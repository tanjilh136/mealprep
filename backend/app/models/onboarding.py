# backend/app/models/onboarding.py

from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy import (
    Column,
    String,
    Integer,
    Date,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from ..database import Base


class OnboardingDraft(Base):
    """
    Pre-registration onboarding state.

    Steps 7–8 happen BEFORE Step 9 (registration), so we can't tie this to a User yet.
    """
    __tablename__ = "onboarding_drafts"

    # UUID string (server-generated)
    id = Column(String(36), primary_key=True, index=True)

    # Service week start (Wednesday)
    week_start = Column(Date, nullable=False)

    # 'weekly' | 'subscriber' (chosen at Step 7.1)
    client_type = Column(String(20), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    behavior_cells = relationship(
        "OnboardingBehaviorCell",
        back_populates="draft",
        cascade="all, delete-orphan",
    )
    iban = Column(String(34), nullable=True)
    first_week_selections = relationship(
        "OnboardingFirstWeekSelection",
        cascade="all, delete-orphan",
        back_populates="draft",
    )




class OnboardingBehaviorCell(Base):
    """
    One cell of the behaviour table (Wed→Tue x Meal1/Meal2).
    """
    __tablename__ = "onboarding_behavior_cells"

    __table_args__ = (
        UniqueConstraint("draft_id", "weekday_index", "slot", name="uq_draft_weekday_slot"),
    )

    id = Column(Integer, primary_key=True, index=True)

    draft_id = Column(
        String(36),
        ForeignKey("onboarding_drafts.id", ondelete="CASCADE"),
        nullable=False,
    )

    # 0..6 for Wed..Tue (service-week order)
    weekday_index = Column(Integer, nullable=False)

    # 1 or 2
    slot = Column(Integer, nullable=False)

    # 'meat' | 'fish' | 'blank'
    pref = Column(String(10), nullable=False, default="blank")

    draft = relationship("OnboardingDraft", back_populates="behavior_cells")


class OnboardingFirstWeekSelection(Base):
    __tablename__ = "onboarding_first_week_selections"

    id = Column(Integer, primary_key=True, index=True)

    draft_id = Column(String, ForeignKey("onboarding_drafts.id", ondelete="CASCADE"), nullable=False)
    weekday_index = Column(Integer, nullable=False)  # 0..6 (Wed..Tue)

    delivery_date = Column(Date, nullable=False)
    meals = Column(Integer, nullable=False)               # 0/1/2
    dish_choice = Column(String(10), nullable=True)       # "A" | "B" | None

    # Optional if later you collect them in onboarding:
    address_id = Column(Integer, ForeignKey("addresses.id"), nullable=True)
    time_block = Column(String(20), nullable=True)

    draft = relationship("OnboardingDraft", back_populates="first_week_selections")