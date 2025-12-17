# backend/app/schemas/address.py

from typing import Optional

from pydantic import BaseModel


class AddressBase(BaseModel):
    label: str
    line1: str
    line2: Optional[str] = None
    city: str
    postal_code: str
    region_id: Optional[int] = None
    notes: Optional[str] = None
    is_default: bool = False


class AddressCreate(AddressBase):
    """
    Used when creating a new address.
    All base fields apply; is_default can be set to True.
    """
    pass


class AddressUpdate(BaseModel):
    """
    Used when updating an address.
    All fields are optional so we can perform partial updates with exclude_unset=True.
    """
    label: Optional[str] = None
    line1: Optional[str] = None
    line2: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    region_id: Optional[int] = None
    notes: Optional[str] = None
    is_default: Optional[bool] = None


class AddressOut(AddressBase):
    id: int

    class Config:
        orm_mode = True
