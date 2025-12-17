# backend/app/routers/exports.py

from datetime import date, timedelta
import csv
import io
from typing import Optional

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from ..core.deps import get_db_session
from ..core.security import require_role
from ..models.booking import Booking
from ..models.user import User
from ..models.address import Address  # for type hints / relationship access
from ..models.menu import MenuDay
from .menu import get_rotation_day_number

router = APIRouter(
    tags=["Export"],
)
def _resolve_dish_name(db: Session, booking: Booking) -> str:
    """
    Given a booking, return the human-readable dish name(s) for that day
    using the same 14-day rotation as /menu/public-week.
    """
    if not booking.delivery_date:
        # Fallback: if somehow there's no date, just return the raw code
        return booking.dish_choice or ""

    # 1) Map calendar date -> rotation day number (1–14)
    rotation_day = get_rotation_day_number(booking.delivery_date)

    # 2) Get the MenuDay for that rotation day
    menu_day: MenuDay | None = (
        db.query(MenuDay)
        .filter(MenuDay.day_number == rotation_day)
        .first()
    )

    if not menu_day:
        # If menu not configured for this rotation day, fallback to raw code
        return booking.dish_choice or ""

    # 3) Build the dish name based on meals and dish_choice
    if booking.meals == 2:
        # 2 meals always means A + B
        return f"{menu_day.dish_a} + {menu_day.dish_b}"

    # 1 meal: respect dish_choice
    if booking.dish_choice == "A":
        return menu_day.dish_a
    elif booking.dish_choice == "B":
        return menu_day.dish_b
    else:
        return ""



def _format_address(addr: Address) -> str:
    """Build a human-readable address string for exports."""
    if addr is None:
        return ""
    parts = [addr.line1]
    if addr.line2:
        parts.append(addr.line2)
    parts.append(f"{addr.postal_code} {addr.city}")
    return ", ".join(parts)


def _get_week_start(d: date) -> date:
    """
    Wednesday-based service week.
    Returns the Wednesday that starts the week containing the given date.
    """
    weekday = d.weekday()  # Monday = 0
    offset = (weekday - 2) % 7  # Wednesday = 2
    return d - timedelta(days=offset)


def _csv_stream(filename: str, headers, rows):
    """
    Build a StreamingResponse returning CSV.
    `rows` is an iterable of lists.
    """
    def iterfile():
        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(headers)
        for row in rows:
            writer.writerow(row)
        buf.seek(0)
        data = buf.read()
        buf.close()
        yield data

    return StreamingResponse(
        iterfile(),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ---------------------------------------------------------------------------
# LEGACY-LIKE ENDPOINTS (KEPT, BUT NOW STREAM CSV)
# ---------------------------------------------------------------------------

@router.get("/export/today/csv")
def export_today_csv_legacy(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(require_role("kitchen")),
) -> StreamingResponse:
    """
    Legacy: Export today's bookings as CSV for kitchen staff.
    Path: GET /export/today/csv
    """
    today = date.today()

    bookings = (
        db.query(Booking)
        .filter(Booking.delivery_date == today, Booking.status == "active")
        .order_by(Booking.time_block)
        .all()
    )

    headers = [
        "Date",
        "Time Block",
        "Client Name",
        "Phone",
        "label",
        "Address",
        "Meals (qty)",
        "Dish Choice",
    ]
    rows = []
    for b in bookings:
        addr_str = _format_address(b.address)
        dish_name = _resolve_dish_name(db, b)
        rows.append(
            [
                b.delivery_date.isoformat(),
                b.time_block,
                b.user.name,  
                b.user.phone,
                b.address.label if b.address else "",
                addr_str,
                b.meals,
                dish_name,
            ]
        )


    filename = f"kitchen_export_{today}.csv"
    return _csv_stream(filename, headers, rows)


@router.get("/export/week/csv")
def export_week_csv_legacy(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(require_role("admin")),
) -> StreamingResponse:
    """
    Legacy: Export all bookings for the current service week (Wed–Tue) as CSV.
    Path: GET /export/week/csv
    """
    today = date.today()
    start_of_week = _get_week_start(today)
    end_of_week = start_of_week + timedelta(days=6)

    bookings = (
        db.query(Booking)
        .filter(
            Booking.delivery_date >= start_of_week,
            Booking.delivery_date <= end_of_week,
            Booking.status == "active",
        )
        .order_by(Booking.delivery_date, Booking.time_block)
        .all()
    )

    headers = [
        "Date",
        "Time Block",
        "Client Name",
        "Phone",
        "label",
        "Address",
        "Meals (qty)",
        "Dish Choice",
    ]
    rows = []
    for b in bookings:
        addr_str = _format_address(b.address)
        dish_name = _resolve_dish_name(db, b)
        rows.append(
            [
                b.delivery_date.isoformat(),
                b.time_block,
                b.user.name,  
                b.user.phone,
                b.address.label if b.address else "",
                addr_str,
                b.meals,
                dish_name,
            ]
        )


    filename = f"week_export_{start_of_week}_to_{end_of_week}.csv"
    return _csv_stream(filename, headers, rows)


@router.get("/export/driver/today")
def export_driver_sheet(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(require_role("admin")),
) -> StreamingResponse:
    """
    Export a simplified driver route sheet as plain text.
    Path: GET /export/driver/today
    """
    today = date.today()

    bookings = (
        db.query(Booking)
        .filter(Booking.delivery_date == today, Booking.status == "active")
        .order_by(Booking.time_block)
        .all()
    )

    lines = []
    lines.append("DRIVER ROUTE SHEET — TODAY")
    lines.append(f"DATE: {today.isoformat()}")
    lines.append("-------------------------------------------")

    for b in bookings:
        addr_str = _format_address(b.address)
        lines.append(
            f"{b.time_block} — {b.user.name} — {addr_str} — {b.meals} meal(s) — {b.dish_choice or 'N/A'}"
        )

    content = "\n".join(lines)

    def iterfile():
        yield content

    return StreamingResponse(
        iterfile(),
        media_type="text/plain",
        headers={"Content-Disposition": f'attachment; filename="driver_route_today.txt"'},
    )


# ---------------------------------------------------------------------------
# NEW ENDPOINTS – MATCH SPA FRONTEND
# ---------------------------------------------------------------------------

# 1) KITCHEN: per-day CSV (used by kitchen.js → /kitchen/export/day?service_date=YYYY-MM-DD)

@router.get("/kitchen/export/day")
def export_kitchen_day(
    service_date: date = Query(..., description="Service date (YYYY-MM-DD)"),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(require_role("kitchen")),
) -> StreamingResponse:
    """
    Export one service day's kitchen sheet as CSV.
    Path: GET /kitchen/export/day?service_date=YYYY-MM-DD
    """
    bookings = (
        db.query(Booking)
        .filter(Booking.delivery_date == service_date, Booking.status == "active")
        .order_by(Booking.time_block)
        .all()
    )

    headers = [
        "Date",
        "Time Block",
        "Client Name",
        "Phone",
        "label",
        "Address",
        "Meals (qty)",
        "Dish Choice",
    ]
    rows = []
    for b in bookings:
        addr_str = _format_address(b.address)
        dish_name = _resolve_dish_name(db, b)
        rows.append(
            [
                b.delivery_date.isoformat(),
                b.time_block,
                b.user.name,  
                b.user.phone,
                b.address.label if b.address else "",
                addr_str,
                b.meals,
                dish_name,
            ]
        )



    filename = f"kitchen_{service_date.isoformat()}.csv"
    return _csv_stream(filename, headers, rows)


# 2) ADMIN: clients CSV (used by admin.js → /admin/export/clients)

@router.get("/admin/export/clients")
def export_clients(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(require_role("admin")),
) -> StreamingResponse:
    """
    Export all users (clients) as CSV.
    Path: GET /admin/export/clients
    """
    # No order_by here because User.created_at does not exist
    users = db.query(User).all()

    headers = [
        "User ID",
        "Name",
        "Email",
        "Phone",
        "Role",
        "Active",
        "Created At",   # this will be blank unless you add it later
    ]

    rows = []
    for u in users:
        rows.append(
            [
                u.id,
                u.name,
                u.email,
                u.phone or "",
                getattr(u, "role", ""),
                getattr(u, "is_active", True),
                getattr(u, "created_at", ""),  # safe fallback
            ]
        )

    filename = "clients.csv"
    return _csv_stream(filename, headers, rows)


# 3) ADMIN: weekly bookings CSV (used by admin.js → /admin/export/bookings)

@router.get("/admin/export/bookings")
def export_admin_week_bookings(
    service_week_start: Optional[date] = Query(
        None,
        description="Service week start (Monday or Wednesday); if omitted, current service week is used.",
    ),
    db: Session = Depends(get_db_session),
    current_user: User = Depends(require_role("admin")),
) -> StreamingResponse:
    """
    Export bookings for one service week as CSV for admin.
    Path: GET /admin/export/bookings?service_week_start=YYYY-MM-DD
    We apply the Wed–Tue logic around the given date (or today if None).
    """
    if service_week_start is None:
        base = date.today()
    else:
        base = service_week_start

    start_of_week = _get_week_start(base)
    end_of_week = start_of_week + timedelta(days=6)

    bookings = (
        db.query(Booking)
        .filter(
            Booking.delivery_date >= start_of_week,
            Booking.delivery_date <= end_of_week,
            Booking.status == "active",
        )
        .order_by(Booking.delivery_date, Booking.time_block)
        .all()
    )

    headers = [
        "Date",
        "Time Block",
        "Client Name",
        "Phone",
        "label",
        "Address",
        "Meals (qty)",
        "Dish Choice",
    ]
    rows = []
    for b in bookings:
        addr_str = _format_address(b.address)
        dish_name = _resolve_dish_name(db, b)
        rows.append(
            [
                b.delivery_date.isoformat(),
                b.time_block,
                b.user.name,  
                b.user.phone,
                b.address.label if b.address else "",
                addr_str,
                b.meals,
                dish_name,
            ]
        )



    filename = f"bookings_{start_of_week.isoformat()}_to_{end_of_week.isoformat()}.csv"
    return _csv_stream(filename, headers, rows)
