# backend/app/models/region.py

from sqlalchemy import Column, Integer, String, Boolean
from ..database import Base


class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)

    # Simple region name, must be unique
    name = Column(String(100), unique=True, nullable=False)

    # Optional description for admin use
    description = Column(String(255), nullable=True)

    # Delivery availability flags
    available_lunch = Column(Boolean, default=True)   # 11:30–14:00
    available_dinner = Column(Boolean, default=True)  # 18:00–21:00
