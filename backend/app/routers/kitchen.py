# backend/app/routers/kitchen.py

from datetime import date
from typing import List, Dict

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload  # ⬅ add joinedload

from ..core.deps import get_db_session
from ..core.security import require_role
from ..models.booking import Booking as BookingModel
from ..models.user import User

router = APIRouter(prefix="/kitchen", tags=["Kitchen"])


@router.get("/day", response_model=List[Dict])
def kitchen_day_view(
    day: date = Query(..., description="Delivery date"),
    db: Session = Depends(get_db_session),
    kitchen_user: User = Depends(require_role("kitchen")),
):
    """
    Kitchen view for a specific delivery date.

    Returns list of bookings with:
    - time_block
    - meals
    - dish_choice
    - address_id

    PLUS extra fields for kitchen.js:
    - client_name
    - client_phone
    - address_label / address_line1 / address_city / address_postal_code
    """
    bookings = (
        db.query(BookingModel)
        .options(
            joinedload(BookingModel.user),     # needs BookingModel.user relationship
            joinedload(BookingModel.address),  # needs BookingModel.address relationship
        )
        .filter(
            BookingModel.delivery_date == day,
            BookingModel.status == "active",
        )
        .order_by(BookingModel.time_block, BookingModel.id)
        .all()
    )

    if not bookings:
        raise HTTPException(status_code=404, detail="No bookings for this day")

    out: List[Dict] = []
    for b in bookings:
        user = b.user
        addr = b.address

        # base payload (what you already had)
        row: Dict = {
            "time_block": b.time_block,
            "meals": b.meals,
            "dish_choice": b.dish_choice,
            "dish_description": None,  # menu text still comes from /menu/public-week on frontend
            "address_id": b.address_id,
        }

        # NEW: client info
        row["client_name"] = user.name if user else None
        # adjust attribute if your User model uses a different field (phone_number, mobile, etc.)
        row["client_phone"] = getattr(user, "phone", None) if user else None

        # NEW: address info (flattened for kitchen.js)
        if addr is not None:
            row["address_label"] = getattr(addr, "label", None)
            row["address_line1"] = getattr(addr, "line1", None)
            row["address_city"] = getattr(addr, "city", None)
            row["address_postal_code"] = getattr(addr, "postal_code", None)
            # optional combined field – kitchen.js will happily use this too
            parts = [
                getattr(addr, "label", None),
                getattr(addr, "line1", None),
                getattr(addr, "city", None),
                getattr(addr, "postal_code", None),
            ]
            row["address_full"] = " – ".join([p for p in parts if p])
        else:
            row["address_label"] = None
            row["address_line1"] = None
            row["address_city"] = None
            row["address_postal_code"] = None
            row["address_full"] = None

        out.append(row)

    return out
