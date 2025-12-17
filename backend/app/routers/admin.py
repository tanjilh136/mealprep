# backend/app/routers/admin.py

from datetime import date, timedelta
from typing import List, Dict

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..core.deps import get_db_session
from ..core.security import require_role
from ..models.user import User
from ..models.booking import Booking as BookingModel
from ..models.menu import MenuDay
from ..schemas.menu import MenuDayCreate, MenuDayOut

router = APIRouter(prefix="/admin", tags=["Admin"])


def _get_week_start(d: date) -> date:
    """
    Wednesday-based week:
    Service week runs from Wednesday (day 0) to Tuesday (day 6).
    """
    weekday = d.weekday()  # Monday = 0
    offset = (weekday - 2) % 7  # Wednesday = 2
    return d - timedelta(days=offset)


# ---------------------------------------------------------------------------
# USERS
# ---------------------------------------------------------------------------


@router.get("/users", response_model=List[Dict])
def list_users(
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    users = db.query(User).order_by(User.id).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "name": u.name,
            "role": u.role,
            "is_active": u.is_active,
            "phone": u.phone,
        }
        for u in users
    ]


@router.patch("/users/{user_id}/role", response_model=Dict)
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    if role not in ("client", "admin", "kitchen"):
        raise HTTPException(status_code=400, detail="Invalid role")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = role
    db.commit()
    db.refresh(user)
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "is_active": user.is_active,
    }


# ---------------------------------------------------------------------------
# MENU MANAGEMENT (14-DAY ROTATION)
# ---------------------------------------------------------------------------

@router.post("/menu", response_model=MenuDayOut)
def create_or_update_menu_day(
    payload: MenuDayCreate,
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    """
    Create or update a menu day in the 14-day rotation.

    MenuDayCreate MUST contain:
    - day_number: int (1–14)
    - dish_a, dish_b
    - calories_a, calories_b (optional)
    """

    existing = db.query(MenuDay).filter(MenuDay.day_number == payload.day_number).first()

    if existing:
        existing.dish_a = payload.dish_a
        existing.dish_b = payload.dish_b
        existing.calories_a = payload.calories_a
        existing.calories_b = payload.calories_b
        db.commit()
        db.refresh(existing)
        return existing

    m = MenuDay(
        day_number=payload.day_number,
        dish_a=payload.dish_a,
        dish_b=payload.dish_b,
        calories_a=payload.calories_a,
        calories_b=payload.calories_b,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


@router.get("/menu/{day_number}", response_model=MenuDayOut)
def get_menu_for_day(
    day_number: int,
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    """
    Get the MenuDay entry for a given rotation day (1–14).
    """
    m = db.query(MenuDay).filter(MenuDay.day_number == day_number).first()
    if not m:
        raise HTTPException(status_code=404, detail="Menu not found for that day_number")
    return m


@router.get("/menu", response_model=List[MenuDayOut])
def list_menu(
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    """
    List all menu days in the rotation (ideally 14).
    """
    items = db.query(MenuDay).order_by(MenuDay.day_number.asc()).all()
    return items


# ---------------------------------------------------------------------------
# BOOKINGS + WEEKLY SUMMARY
# ---------------------------------------------------------------------------


@router.get("/bookings", response_model=List[Dict])
def list_all_bookings(
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    bookings = (
        db.query(BookingModel)
        .order_by(BookingModel.delivery_date, BookingModel.time_block)
        .all()
    )
    return [
        {
            "id": b.id,
            "user_id": b.user_id,
            "address_id": b.address_id,
            "delivery_date": b.delivery_date,
            "time_block": b.time_block,
            "meals": b.meals,
            "dish_choice": b.dish_choice,
            "status": b.status,
        }
        for b in bookings
    ]


@router.get("/weekly-summary", response_model=Dict)
def weekly_summary(
    week_for: date = Query(..., description="Any date inside the service week"),
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    """
    Summarize all active bookings in the Wednesday–Tuesday service week
    that contains the given date.
    """
    week_start = _get_week_start(week_for)
    week_end = week_start + timedelta(days=6)

    bookings = (
        db.query(BookingModel)
        .filter(
            BookingModel.delivery_date >= week_start,
            BookingModel.delivery_date <= week_end,
            BookingModel.status == "active",
        )
        .all()
    )
    if not bookings:
        raise HTTPException(status_code=404, detail="No bookings for this week")

    by_user: Dict[int, Dict] = {}
    total_meals = 0

    for b in bookings:
        client = by_user.setdefault(
            b.user_id,
            {"user_id": b.user_id, "total_meals": 0, "bookings": []},
        )
        client["total_meals"] += b.meals
        total_meals += b.meals
        client["bookings"].append(
            {
                "id": b.id,
                "date": b.delivery_date,
                "time_block": b.time_block,
                "meals": b.meals,
                "dish_choice": b.dish_choice,
                "status": b.status,
            }
        )

    return {
        "week_start": week_start,
        "week_end": week_end,
        "total_meals_all_clients": total_meals,
        "clients": list(by_user.values()),
    }
