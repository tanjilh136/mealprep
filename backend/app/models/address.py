# backend/app/models/address.py

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer, primary_key=True, index=True)

    # FK to users table
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Human label: "Home", "Work", "Gym", etc.
    label = Column(String(50), nullable=False)

    # Address fields
    line1 = Column(String(255), nullable=False)
    line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=False)

    # Region system (admin-defined) — can be null until region selection is implemented
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True)

    # Notes: delivery instructions, floor, door code, etc.
    notes = Column(String(255), nullable=True)

    # Only ONE address per user can be default
    is_default = Column(Boolean, default=False)

    # Relationship back to User
    user = relationship("User", back_populates="addresses")

    # Optional future relationship: region = relationship("Region")
