# backend/app/schemas/__init__.py

from .user import UserBase, UserCreate, UserOut, Token
from .address import AddressBase, AddressCreate, AddressOut
from .menu import MenuDayBase, MenuDayCreate, MenuDayOut
from .booking import BookingBase, BookingCreate, BookingOut
from .region import RegionBase, RegionCreate, RegionOut

__all__ = [
    "UserBase",
    "UserCreate",
    "UserOut",
    "Token",
    "AddressBase",
    "AddressCreate",
    "AddressOut",
    "MenuDayBase",
    "MenuDayCreate",
    "MenuDayOut",
    "BookingBase",
    "BookingCreate",
    "BookingOut",
    "RegionBase",
    "RegionCreate",
    "RegionOut",
]
