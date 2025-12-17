# backend/app/schemas/menu.py

from typing import Optional

from pydantic import BaseModel, Field


class MenuDayBase(BaseModel):
    day_number: int = Field(..., ge=1, le=14, description="Rotation day number (1–14)")
    dish_a: str
    dish_b: str
    calories_a: Optional[int] = None
    calories_b: Optional[int] = None


class MenuDayCreate(MenuDayBase):
    """
    Used by admin to create or update a rotation day.
    """
    pass


class MenuDayOut(MenuDayBase):
    id: int

    class Config:
        orm_mode = True
