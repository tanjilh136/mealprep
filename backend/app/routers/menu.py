# backend/app/routers/menu.py

from datetime import date, timedelta
from typing import List, Dict, Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..core.deps import get_db_session
from ..models.menu import MenuDay
from ..config import MENU_ROTATION_START_DATE

router = APIRouter(prefix="/menu", tags=["Menu"])


def get_week_start(d: date) -> date:
    """
    Service week is Wednesday–Tuesday.
    Monday = 0, Tuesday = 1, Wednesday = 2, ...
    """
    weekday = d.weekday()
    offset = (weekday - 2) % 7  # shift so week starts on Wednesday
    return d - timedelta(days=offset)


def get_rotation_day_number(day: date) -> int:
    """
    Map a calendar date to a 1–14 rotation day_number.

    MENU_ROTATION_START_DATE is defined in config.py and is treated as day_number = 1.
    Then we cycle every 14 days.
    """
    delta_days = (day - MENU_ROTATION_START_DATE).days
    # Protect against negative values as well
    return (delta_days % 14) + 1


@router.get("/public-week")
def get_public_week_menu(
    week_for: date = Query(
        default=None,
        description="Any date inside the desired service week. Defaults to today.",
    ),
    db: Session = Depends(get_db_session),
) -> List[Dict[str, Any]]:
    """
    Public endpoint: returns the menu for a full service week (Wed–Tue).
    No auth, no roles.

    Output shape (per day):
    {
        "date": <ISO date>,
        "weekday": "Wednesday",
        "dish_a": {"name": ..., "calories": ..., "description": None},
        "dish_b": {"name": ..., "calories": ..., "description": None},
    }
    """
    if week_for is None:
        week_for = date.today()

    week_start = get_week_start(week_for)

    result: List[Dict[str, Any]] = []

    for i in range(7):
        current_date = week_start + timedelta(days=i)
        rotation_day = get_rotation_day_number(current_date)

        menu_day: MenuDay | None = (
            db.query(MenuDay)
            .filter(MenuDay.day_number == rotation_day)
            .first()
        )

        if menu_day:
            dish_a_name = menu_day.dish_a
            dish_b_name = menu_day.dish_b
            calories_a = menu_day.calories_a
            calories_b = menu_day.calories_b
        else:
            # If rotation not fully configured yet, return empty slots
            dish_a_name = None
            dish_b_name = None
            calories_a = None
            calories_b = None

        result.append(
            {
                "date": current_date,
                "weekday": current_date.strftime("%A"),
                "dish_a": {
                    "name": dish_a_name,
                    "calories": calories_a,
                    "description": None,
                },
                "dish_b": {
                    "name": dish_b_name,
                    "calories": calories_b,
                    "description": None,
                },
            }
        )

    return result
