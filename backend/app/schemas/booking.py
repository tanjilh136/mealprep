# backend/app/schemas/booking.py

from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class BookingBase(BaseModel):
    delivery_date: date
    time_block: str = Field(..., description="15-minute block, e.g. '11:30-11:45'")
    meals: int = Field(..., ge=1, le=2)
    dish_choice: Optional[str] = None  # "A", "B", "A+B"


class BookingCreate(BookingBase):
    address_id: int


class BookingOut(BookingBase):
    id: int
    user_id: int
    address_id: int
    status: str

    class Config:
        orm_mode = True
