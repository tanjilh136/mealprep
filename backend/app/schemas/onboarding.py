# backend/app/schemas/onboarding.py
import app.services.dish_type as dt
print("DISH_TYPE IMPORTED FROM:", dt.__file__)

from datetime import date
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


ClientType = Literal["weekly", "subscriber"]
PrefType = Literal["meat", "fish", "blank"]


class FirstWeekDaySelection(BaseModel):
    """
    Step 7 input: one day in the first service week (Wed→Tue).
    """
    date: date
    meals: int = Field(0, ge=0, le=2, description="0 means no booking for that day")

    # For meals=1: must be 'A' or 'B'
    # For meals=2: can be None or 'A+B' (we treat meals=2 as implicit A+B)
    dish_choice: Optional[str] = None

    # Not used for behaviour learning in Slice 1, but included for future slices
    time_block: Optional[str] = None
    address_id: Optional[int] = None


class OnboardingFirstWeekRequest(BaseModel):
    week_start: date = Field(..., description="Wednesday date that starts the service week")
    days: List[FirstWeekDaySelection] = Field(..., min_items=7, max_items=7)


class BehaviourGrid(BaseModel):
    # DayName -> {meal1: pref, meal2: pref}
    grid: Dict[str, Dict[str, PrefType]]


class OnboardingFirstWeekResponse(BaseModel):
    draft_id: str
    week_start: date
    behaviour: BehaviourGrid


class OnboardingClientTypeRequest(BaseModel):
    draft_id: str
    client_type: ClientType


class OnboardingClientTypeResponse(BaseModel):
    draft_id: str
    client_type: ClientType

# --- Step 8: Rules / Explanation layer (read-only) ---

Step8SectionType = Literal["summary", "rules", "payment_notice", "iban_required"]


class Step8Section(BaseModel):
    type: Step8SectionType
    content: Optional[str] = None
    items: Optional[List[str]] = None


class OnboardingStep8ExplanationResponse(BaseModel):
    client_type: ClientType
    title: str
    sections: List[Step8Section]
