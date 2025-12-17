# backend/app/routers/booking.py

from datetime import date, time, datetime, timedelta
from typing import List, Dict

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..config import (
    LUNCH_START_HOUR,
    LUNCH_START_MINUTE,
    LUNCH_END_HOUR,
    LUNCH_END_MINUTE,
    DINNER_START_HOUR,
    DINNER_START_MINUTE,
    DINNER_END_HOUR,
    DINNER_END_MINUTE,
    SLOT_MINUTES,
    MAX_MEALS_PER_WEEK,
)
from ..core.deps import get_db_session, get_current_client
from ..models.booking import Booking as BookingModel
from ..models.address import Address
from ..models.user import User
from ..schemas.booking import BookingCreate, BookingOut
from ..services.pricing import compute_week_pricing

router = APIRouter(prefix="/booking", tags=["Booking"])


# ---------------------------------------------------------------------------
# Time slot generation
# ---------------------------------------------------------------------------

def _generate_slots() -> List[str]:
    slots: List[str] = []

    def _range(start: time, end: time):
        current = datetime.combine(date.today(), start)
        finish = datetime.combine(date.today(), end)
        delta = timedelta(minutes=SLOT_MINUTES)
        while current < finish:
            slot_start = current
            slot_end = current + delta
            slots.append(
                f"{slot_start.strftime('%H:%M')}-{slot_end.strftime('%H:%M')}"
            )
            current += delta

    lunch_start = time(LUNCH_START_HOUR, LUNCH_START_MINUTE)
    lunch_end = time(LUNCH_END_HOUR, LUNCH_END_MINUTE)
    dinner_start = time(DINNER_START_HOUR, DINNER_START_MINUTE)
    dinner_end = time(DINNER_END_HOUR, DINNER_END_MINUTE)

    _range(lunch_start, lunch_end)
    _range(dinner_start, dinner_end)
    return slots


ALL_SLOTS = _generate_slots()


# ---------------------------------------------------------------------------
# Week + cutoff helpers
# ---------------------------------------------------------------------------

def get_week_start(d: date) -> date:
    """
    Wednesday-based service week.
    Returns the Wednesday that starts the week containing the given date.
    """
    weekday = d.weekday()  # Monday=0
    offset = (weekday - 2) % 7  # Wednesday=2
    return d - timedelta(days=offset)


def get_cutoff_for_week(week_start: date) -> datetime:
    """
    For a service week starting Wednesday, cutoff for CLIENT changes is
    Monday 23:59 *before* that service week.
    Example: week_start = Wed 8 -> cutoff = Mon 6 23:59.
    """
    cutoff_date = week_start - timedelta(days=2)  # Monday
    return datetime(cutoff_date.year, cutoff_date.month, cutoff_date.day, 23, 59)


# ---------------------------------------------------------------------------
# Public endpoints
# ---------------------------------------------------------------------------

@router.get("/slots", response_model=List[str])
def list_slots() -> List[str]:
    """Return all delivery time blocks."""
    return ALL_SLOTS


@router.post("/", response_model=BookingOut)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_client),
):
    """
    Create a booking for the current client.
    Enforces:
    - valid time_block
    - address belongs to user
    - dish_choice format
    - weekly max meals
    - Monday cutoff relative to the booking's service week
    """
    # Validate time block
    if payload.time_block not in ALL_SLOTS:
        raise HTTPException(status_code=400, detail="Invalid time block")

    # Validate meals per booking (1 or 2)
    if payload.meals not in (1, 2):
        raise HTTPException(status_code=400, detail="Each booking must be 1 or 2 meals")

    # Validate address belongs to user
    address = (
        db.query(Address)
        .filter(Address.id == payload.address_id, Address.user_id == current_user.id)
        .first()
    )
    if not address:
        raise HTTPException(status_code=400, detail="Invalid address")

    # Validate dish_choice format (A, B, A+B)
    if payload.dish_choice:
        if payload.dish_choice not in ("A", "B", "A+B"):
            raise HTTPException(status_code=400, detail="Invalid dish choice")
        # TODO: Map delivery_date -> rotation day_number and validate against MenuDay

    # Determine service week for this booking
    week_start = get_week_start(payload.delivery_date)
    week_end = week_start + timedelta(days=6)

    # Cutoff for clients (no admin bypass here; this router is for clients)
    cutoff = get_cutoff_for_week(week_start)
    if datetime.utcnow() > cutoff:
        raise HTTPException(
            status_code=400,
            detail=(
                "Cutoff passed for this service week. "
                "Changes now will only apply to a future week. Contact support if needed."
            ),
        )

    # Enforce weekly max meals
    existing = (
        db.query(BookingModel)
        .filter(
            BookingModel.user_id == current_user.id,
            BookingModel.delivery_date >= week_start,
            BookingModel.delivery_date <= week_end,
            BookingModel.status == "active",
        )
        .all()
    )
    current_meals = sum(b.meals for b in existing)

    if current_meals + payload.meals > MAX_MEALS_PER_WEEK:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Weekly limit exceeded: you already have {current_meals} meals; "
                f"max is {MAX_MEALS_PER_WEEK}."
            ),
        )

    booking = BookingModel(
        user_id=current_user.id,
        address_id=payload.address_id,
        delivery_date=payload.delivery_date,
        time_block=payload.time_block,
        meals=payload.meals,
        dish_choice=payload.dish_choice,
        status="active",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/", response_model=List[BookingOut])
def list_my_bookings(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_client),
):
    """List all bookings for the current client."""
    bookings = (
        db.query(BookingModel)
        .filter(BookingModel.user_id == current_user.id)
        .order_by(BookingModel.delivery_date, BookingModel.time_block)
        .all()
    )
    return bookings


@router.put("/{booking_id}", response_model=BookingOut)
def update_booking(
    booking_id: int,
    payload: BookingCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_client),
):
    """
    Update an existing booking for the current client.
    Enforces cutoff & weekly max meals rules.
    """
    booking = (
        db.query(BookingModel)
        .filter(
            BookingModel.id == booking_id,
            BookingModel.user_id == current_user.id,
        )
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status != "active":
        raise HTTPException(status_code=400, detail="Booking is not active")

    # Cutoff based on original delivery week (you can decide if you want it
    # to be based on new or old date; here we enforce based on new date)
    new_week_start = get_week_start(payload.delivery_date)
    cutoff = get_cutoff_for_week(new_week_start)
    if datetime.utcnow() > cutoff:
        raise HTTPException(
            status_code=400,
            detail="Cutoff passed, contact support to change this booking.",
        )

    # Validate time block
    if payload.time_block not in ALL_SLOTS:
        raise HTTPException(status_code=400, detail="Invalid time block")

    # Validate meals per booking
    if payload.meals not in (1, 2):
        raise HTTPException(status_code=400, detail="Each booking must be 1 or 2 meals")

    # Validate address belongs to same user
    address = (
        db.query(Address)
        .filter(Address.id == payload.address_id, Address.user_id == current_user.id)
        .first()
    )
    if not address:
        raise HTTPException(status_code=400, detail="Invalid address")

    # Dish validation
    if payload.dish_choice:
        if payload.dish_choice not in ("A", "B", "A+B"):
            raise HTTPException(status_code=400, detail="Invalid dish choice")
        # TODO: Map delivery_date -> rotation day_number and validate against MenuDay

    # Re-check weekly max with the new meals
    week_start = new_week_start
    week_end = week_start + timedelta(days=6)

    existing = (
        db.query(BookingModel)
        .filter(
            BookingModel.user_id == current_user.id,
            BookingModel.delivery_date >= week_start,
            BookingModel.delivery_date <= week_end,
            BookingModel.status == "active",
            BookingModel.id != booking.id,
        )
        .all()
    )
    current_meals = sum(b.meals for b in existing)

    if current_meals + payload.meals > MAX_MEALS_PER_WEEK:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Weekly limit exceeded: you already have {current_meals} meals; "
                f"max is {MAX_MEALS_PER_WEEK}."
            ),
        )

    booking.address_id = payload.address_id
    booking.delivery_date = payload.delivery_date
    booking.time_block = payload.time_block
    booking.meals = payload.meals
    booking.dish_choice = payload.dish_choice

    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_client),
):
    """
    Cancel an active booking for the current client, respecting cutoff rules.
    """
    booking = (
        db.query(BookingModel)
        .filter(
            BookingModel.id == booking_id,
            BookingModel.user_id == current_user.id,
        )
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status != "active":
        raise HTTPException(status_code=400, detail="Booking is not active")

    week_start = get_week_start(booking.delivery_date)
    cutoff = get_cutoff_for_week(week_start)
    if datetime.utcnow() > cutoff:
        raise HTTPException(
            status_code=400,
            detail="Cutoff passed, contact support to cancel this booking.",
        )

    booking.status = "cancelled"
    db.commit()
    return {"detail": "Booking cancelled"}


@router.get("/week-pricing", response_model=Dict)
def get_week_pricing(
    week_for: date = Query(..., description="Any date inside the service week"),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_client),
):
    """
    Compute weekly pricing for the current user.
    - Uses all ACTIVE bookings in that service week.
    - Enforces min/max meal logic inside compute_week_pricing.
    - Applies tier pricing & launch promo.
    """
    week_start = get_week_start(week_for)
    week_end = week_start + timedelta(days=6)

    bookings = (
        db.query(BookingModel)
        .filter(
            BookingModel.user_id == current_user.id,
            BookingModel.delivery_date >= week_start,
            BookingModel.delivery_date <= week_end,
            BookingModel.status == "active",
        )
        .all()
    )

    result = compute_week_pricing(week_start, bookings)
    return result
