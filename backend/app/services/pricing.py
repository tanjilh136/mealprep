# backend/app/services/pricing.py

from datetime import date
from typing import List, Dict, Any

from ..config import (
    MIN_MEALS_PER_WEEK,
    LAUNCH_PROMO_START,
    LAUNCH_PROMO_END,
)
from ..models.booking import Booking


# Pricing tiers (per meal, in EUR)
# 3–5 meals -> 10.50
# 6–9 meals -> 9.99
# 10–14 meals -> 9.45
PRICING_TIERS = [
    (3, 5, 10.50),
    (6, 9, 9.99),
    (10, 14, 9.45),
]


def _get_unit_price(total_meals: int) -> float:
    for min_m, max_m, price in PRICING_TIERS:
        if min_m <= total_meals <= max_m:
            return price
    raise ValueError("No pricing tier for that number of meals")


def compute_week_pricing(
    week_start: date,
    bookings: List[Booking],
) -> Dict[str, Any]:
    """
    Compute pricing for all bookings of a single client in a service week.

    - Enforces MIN_MEALS_PER_WEEK
    - Applies tier pricing based on total meals
    - Applies 50% launch promo if week_start is inside the LAUNCH_PROMO window

    Returns a dict like:
    {
        "ok": bool,
        "reason": str | None,
        "total_meals": int,
        "unit_price": float | None,
        "base_total": float | None,
        "promo_applied": bool,
        "final_total": float | None,
        "week_start": date,
    }
    """
    total_meals = sum(b.meals for b in bookings)

    if total_meals < MIN_MEALS_PER_WEEK:
        return {
            "ok": False,
            "reason": f"Minimum {MIN_MEALS_PER_WEEK} meals per week required.",
            "total_meals": total_meals,
            "unit_price": None,
            "base_total": None,
            "promo_applied": False,
            "final_total": None,
            "week_start": week_start,
        }

    unit_price = _get_unit_price(total_meals)
    base_total = round(total_meals * unit_price, 2)

    promo_applied = False
    final_total = base_total

    # Launch promo logic: if the week_start lies inside promo window
    if LAUNCH_PROMO_START <= week_start <= LAUNCH_PROMO_END:
        promo_applied = True
        final_total = round(base_total * 0.5, 2)

    return {
        "ok": True,
        "reason": None,
        "total_meals": total_meals,
        "unit_price": unit_price,
        "base_total": base_total,
        "promo_applied": promo_applied,
        "final_total": final_total,
        "week_start": week_start,
    }
