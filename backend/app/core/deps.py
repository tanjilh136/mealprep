# backend/app/core/deps.py

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..core.security import get_current_user, require_role
from ..models.user import User


def get_db_session(db: Session = Depends(get_db)) -> Session:
    """
    Dependency wrapper around get_db so we can use a named dependency.
    FastAPI will handle opening/closing the session per request.
    """
    return db


def get_current_client(current_user: User = Depends(get_current_user)) -> User:
    """
    Ensure the current user is a client.
    """
    if current_user.role != "client":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Current user is not a client",
        )
    return current_user


def get_admin(current_admin: User = Depends(require_role("admin"))) -> User:
    """
    Ensure the current user is an admin.
    require_role('admin') handles all checks.
    """
    return current_admin
