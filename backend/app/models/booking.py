# backend/app/models/booking.py

from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from ..database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)

    # Business logic fields
    delivery_date = Column(Date, nullable=False)            # Must be within next service week
    time_block = Column(String(20), nullable=False)         # e.g. "11:30-11:45"
    meals = Column(Integer, nullable=False)                 # 1 or 2 meals for this booking

    # Dish selection: "A", "B", or "A+B"
    dish_choice = Column(String(10), nullable=True)

    # Booking status: active / cancelled / locked (after Monday midnight)
    status = Column(String(20), nullable=False, default="active")

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="bookings")
    address = relationship("Address")
