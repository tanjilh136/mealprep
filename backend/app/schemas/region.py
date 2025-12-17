# backend/app/schemas/region.py

from pydantic import BaseModel
from typing import Optional


class RegionBase(BaseModel):
    name: str
    description: Optional[str] = None
    available_lunch: bool = True
    available_dinner: bool = True


class RegionCreate(RegionBase):
    """
    Used for POST and PUT.
    All fields provided, nothing partial.
    """
    pass


class RegionOut(RegionBase):
    id: int

    class Config:
        orm_mode = True
