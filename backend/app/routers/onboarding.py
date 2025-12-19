# backend/app/routers/onboarding.py

from __future__ import annotations

from datetime import date, timedelta
from typing import Dict
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..config import MENU_ROTATION_START_DATE
from ..core.deps import get_db_session
from ..models.menu import MenuDay
from ..models.onboarding import OnboardingDraft, OnboardingBehaviorCell
from ..schemas.onboarding import (
    OnboardingClientTypeRequest,
    OnboardingClientTypeResponse,
    OnboardingFirstWeekRequest,
    OnboardingFirstWeekResponse,
)
from ..services.dish_type import infer_dish_type

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

_SERVICE_DAYS = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"]


def _rotation_day_number(day: date) -> int:
    """
    Match backend/app/routers/menu.py mapping:
    MENU_ROTATION_START_DATE is day_number=1 and cycles every 14 days.
    """
    delta_days = (day - MENU_ROTATION_START_DATE).days
    return (delta_days % 14) + 1


def _menu_for_date(db: Session, day: date) -> Dict[str, str | None]:
    day_no = _rotation_day_number(day)
    m = db.query(MenuDay).filter(MenuDay.day_number == day_no).first()
    if not m:
        return {"dish_a": None, "dish_b": None}
    return {"dish_a": m.dish_a, "dish_b": m.dish_b}


def _compute_behaviour_for_day(db: Session, day: date, meals: int, dish_choice: str | None) -> Dict[str, str]:
    """
    Locked rules:
    - meals=0 => blank/blank
    - meals=1 => fill meal1 with A or B type, meal2 blank
    - meals=2 => implicit A+B => meal1=A type, meal2=B type
    """
    if meals <= 0:
        return {"meal1": "blank", "meal2": "blank"}

    menu = _menu_for_date(db, day)
    dish_a_type = infer_dish_type(menu["dish_a"])
    dish_b_type = infer_dish_type(menu["dish_b"])

    if meals == 2:
        return {"meal1": dish_a_type, "meal2": dish_b_type}

    # meals == 1
    if dish_choice not in ("A", "B"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"dish_choice must be 'A' or 'B' when meals=1 (got: {dish_choice!r})",
        )
    return {"meal1": dish_a_type if dish_choice == "A" else dish_b_type, "meal2": "blank"}


@router.post("/first-week", response_model=OnboardingFirstWeekResponse, status_code=status.HTTP_201_CREATED)
def onboarding_first_week(payload: OnboardingFirstWeekRequest, db: Session = Depends(get_db_session)):
    """
    Step 7 -> Step 7.1:
    Accept first-week selections (Wed→Tue) and generate + store the behaviour table (draft).
    """
    if payload.week_start.weekday() != 2:  # Wednesday
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="week_start must be a Wednesday (service week start).",
        )

    draft_id = str(uuid4())
    draft = OnboardingDraft(id=draft_id, week_start=payload.week_start, client_type=None)
    db.add(draft)

    grid: Dict[str, Dict[str, str]] = {}

    for i, day_sel in enumerate(payload.days):
        expected_date = payload.week_start + timedelta(days=i)
        if day_sel.date != expected_date:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"days[{i}].date must be {expected_date.isoformat()} (got {day_sel.date.isoformat()})",
            )

        beh = _compute_behaviour_for_day(
            db=db,
            day=day_sel.date,
            meals=day_sel.meals,
            dish_choice=day_sel.dish_choice,
        )

        day_name = _SERVICE_DAYS[i]
        grid[day_name] = {"meal1": beh["meal1"], "meal2": beh["meal2"]}

        db.add(OnboardingBehaviorCell(draft_id=draft_id, weekday_index=i, slot=1, pref=beh["meal1"]))
        db.add(OnboardingBehaviorCell(draft_id=draft_id, weekday_index=i, slot=2, pref=beh["meal2"]))

    db.commit()

    return {
        "draft_id": draft_id,
        "week_start": payload.week_start,
        "behaviour": {"grid": grid},
    }


@router.post("/client-type", response_model=OnboardingClientTypeResponse)
def onboarding_set_client_type(payload: OnboardingClientTypeRequest, db: Session = Depends(get_db_session)):
    """
    Step 7.1 decision:
    Store weekly vs subscriber on the onboarding draft.
    """
    draft = db.query(OnboardingDraft).filter(OnboardingDraft.id == payload.draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="onboarding draft not found")

    draft.client_type = payload.client_type
    db.add(draft)
    db.commit()

    return {"draft_id": payload.draft_id, "client_type": payload.client_type}
