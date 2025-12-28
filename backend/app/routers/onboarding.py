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
from ..models.onboarding import OnboardingDraft, OnboardingBehaviorCell, OnboardingFirstWeekSelection
from ..schemas.onboarding import (
    OnboardingClientTypeRequest,
    OnboardingClientTypeResponse,
    OnboardingFirstWeekRequest,
    OnboardingFirstWeekResponse,
    OnboardingStep8ExplanationResponse,
)
from ..services.dish_type import infer_dish_type
from ..schemas.onboarding import OnboardingIbanRequest

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

        db.add(
            OnboardingFirstWeekSelection(
                draft_id=draft_id,
                weekday_index=i,
                delivery_date=day_sel.date,
                meals=day_sel.meals,
                dish_choice=day_sel.dish_choice,
                address_id=getattr(day_sel, "address_id", None),
                time_block=getattr(day_sel, "time_block", None),
            )
        )
        

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

@router.get("/step-8-explanation", response_model=OnboardingStep8ExplanationResponse)
def onboarding_step8_explanation(draft_id: str, db: Session = Depends(get_db_session)):
    """
    Step 8 (read-only):
    Returns an explanation layer based strictly on Step 7.1 client_type stored on the draft.
    Frontend renders only; backend is authoritative.
    """
    draft = db.query(OnboardingDraft).filter(OnboardingDraft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="onboarding draft not found")

    if not draft.client_type:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="client_type not set yet (complete Step 7.1 first)",
        )

    if draft.client_type == "subscriber":
        return {
            "client_type": "subscriber",
            "title": "How Mesa will work for you",
            "sections": [
                {
                    "type": "summary",
                    "content": "Based on your choices, Mesa will automatically prepare and deliver meals each week.",
                },
                {
                    "type": "rules",
                    "items": [
                        "Meals are assigned automatically each week",
                        "Dishes are selected based on your preferences",
                        "You don’t need to place weekly orders",
                        "You can update preferences later in your account",
                    ],
                },
                {
                    "type": "payment_notice",
                    "content": "To enable automatic service, we’ll set up a secure SEPA direct debit.",
                },
                {
                    "type": "iban_required",
                    "content": "Your IBAN is required to activate weekly deliveries.",
                },
            ],
        }

    # weekly
    return {
        "client_type": "weekly",
        "title": "How weekly ordering works",
        "sections": [
            {
                "type": "summary",
                "content": "You’ll manage and confirm your meals manually each week.",
            },
            {
                "type": "rules",
                "items": [
                    "Meals are not assigned automatically",
                    "After onboarding, go to the Booking page to review your order",
                    "You can modify meals before confirming",
                    "You must pay every week before the cutoff for service to happen",
                ],
            },
        ],
    }


def _normalize_iban(raw: str) -> str:
    return (raw or "").replace(" ", "").upper().strip()

def _basic_iban_check(iban: str) -> bool:
    # basic sanity only; real validation can come later
    if len(iban) < 15 or len(iban) > 34:
        return False
    if not iban[:2].isalpha():
        return False
    if not iban[2:4].isalnum():
        return False
    return True

@router.post("/iban")
def set_onboarding_iban(payload: OnboardingIbanRequest, db: Session = Depends(get_db_session)):
    draft = db.query(OnboardingDraft).filter(OnboardingDraft.id == payload.draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="onboarding draft not found")

    if draft.client_type != "subscriber":
        raise HTTPException(status_code=422, detail="IBAN allowed only for subscriber")

    iban = _normalize_iban(payload.iban)
    if not _basic_iban_check(iban):
        raise HTTPException(status_code=422, detail="invalid IBAN")

    draft.iban = iban
    db.commit()
    return {"ok": True, "draft_id": draft.id}