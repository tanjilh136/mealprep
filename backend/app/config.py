#backend/app/config.py

import os
from datetime import date
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mealprep.db")

# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_SECRET")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# ---------------------------------------------------------------------------
# Business rules
# ---------------------------------------------------------------------------
MIN_MEALS_PER_WEEK = 3
MAX_MEALS_PER_WEEK = 14

# ---------------------------------------------------------------------------
# Delivery windows
# ---------------------------------------------------------------------------
LUNCH_START_HOUR = 11
LUNCH_START_MINUTE = 30
LUNCH_END_HOUR = 14
LUNCH_END_MINUTE = 0

DINNER_START_HOUR = 18
DINNER_START_MINUTE = 0
DINNER_END_HOUR = 21
DINNER_END_MINUTE = 0

SLOT_MINUTES = 15

# ---------------------------------------------------------------------------
# Menu rotation (14-day system)
# This date corresponds to day_number = 1.
# You can change it anytime; all menus will rotate correctly.
# ---------------------------------------------------------------------------
MENU_ROTATION_START_DATE = date(2026, 1, 1)  # pick any anchor date you want

# ---------------------------------------------------------------------------
# Launch promo: 50% discount on first service week
# ---------------------------------------------------------------------------
LAUNCH_PROMO_START = date(2026, 1, 7)   # Wednesday
LAUNCH_PROMO_END   = date(2026, 1, 13)  # Tuesday
