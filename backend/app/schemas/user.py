# backend/app/schemas/user.py

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str
    onboarding_draft_id: Optional[str] = None


class UserOut(UserBase):
    id: int
    role: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"