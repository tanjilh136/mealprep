# backend/app/routers/users.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.deps import get_db_session
from ..core.security import get_current_user
from ..models.user import User
from ..schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db_session),  # kept for future expansion
):
    """
    Return the authenticated user's own profile.
    """
    return current_user
