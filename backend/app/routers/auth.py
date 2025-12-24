# backend/app/routers/auth.py

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..models.onboarding import OnboardingDraft

from ..core.deps import get_db_session
from ..core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
)
from ..models.user import User
from ..schemas.user import UserCreate, UserOut
from pydantic import BaseModel, EmailStr, constr
from passlib.hash import pbkdf2_sha256

router = APIRouter(prefix="/auth", tags=["auth"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        return None
    return user

class ResetPasswordSimple(BaseModel):
    email: EmailStr
    phone: str | None = None
    new_password: constr(min_length=6)
# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: UserCreate,
    db: Session = Depends(get_db_session),
):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    draft = None
    iban_value = None
    client_type_value = None
    onboarding_draft_id_value = None

    if user_in.onboarding_draft_id:
        draft = (
            db.query(OnboardingDraft)
            .filter(OnboardingDraft.id == user_in.onboarding_draft_id)
            .first()
        )
        if not draft:
            raise HTTPException(status_code=404, detail="onboarding draft not found")
        if not draft.client_type:
            raise HTTPException(status_code=422, detail="client_type not set for onboarding draft")

        client_type_value = draft.client_type
        onboarding_draft_id_value = draft.id

        # IBAN rule:
        # - subscriber => IBAN required and copied from draft
        # - weekly     => IBAN must remain NULL
        if draft.client_type == "subscriber":
            if not getattr(draft, "iban", None):
                raise HTTPException(status_code=422, detail="IBAN required for subscriber")
            iban_value = draft.iban

    # Always instantiate user before db.add(user)
    user = User(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=get_password_hash(user_in.password),
        role="client",
        is_active=True,
        client_type=client_type_value,
        onboarding_draft_id=onboarding_draft_id_value,
        iban=iban_value,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/reset-password-simple")
def reset_password_simple(payload: ResetPasswordSimple,
                          db: Session = Depends(get_db_session)):
    """
    Offline-friendly reset:
    - User gives email + (optionally) phone + new password.
    - We check that user exists and (if phone given) phone matches.
    - Then we overwrite hashed_password.
    """
    user = db.query(models.User).filter(
        models.User.email == payload.email
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    # phone check (only if user has phone stored and client sent phone)
    if payload.phone and user.phone and payload.phone.strip() != user.phone.strip():
        raise HTTPException(status_code=400, detail="Phone number does not match")

    # Same hashing scheme as the rest of the app
    user.hashed_password = pbkdf2_sha256.using(rounds=29000).hash(
        payload.new_password
    )
    db.commit()

    return {"ok": True}

@router.post("/token")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db_session),
):
    """
    OAuth2 password flow.
    The frontend should send:
    - username = email
    - password
    """

    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # sub should be a string for JWT
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}
