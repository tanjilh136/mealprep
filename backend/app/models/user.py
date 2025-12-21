# backend/app/models/user.py

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Basic profile fields
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    onboarding_draft_id = Column(String(36), nullable=True)
    iban = Column(String(34), nullable=True)


    # Authentication
    hashed_password = Column(String(255), nullable=False)

    # Role control: client / admin / kitchen
    role = Column(String(20), nullable=False, default="client")

    # Slice 1+ (safe now)
    # 'weekly' | 'subscriber' (nullable until onboarding/registration connects it)
    client_type = Column(String(20), nullable=True)

    # Founders plan flag (used in Step 10 later)
    is_founder = Column(Boolean, default=False)

    # Account activation (used by security.py)
    is_active = Column(Boolean, default=True)

    # Relationships
    addresses = relationship(
        "Address",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    bookings = relationship(
        "Booking",
        back_populates="user",
        cascade="all, delete-orphan",
    )
