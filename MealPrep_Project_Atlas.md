# MealPrep / Mesa – Project Atlas (for continuation)

Generated: 2025-12-19 20:02 UTC

This file is a **navigation map** of the current zip so we can work fast without guessing.

---

## Repository Layout (high-level)

```text
mealprep-main/
├── backend/
│   ├── app/
│   │   ├── __pycache__/
│   │   │   ├── __init__.cpython-310.pyc
│   │   │   ├── config.cpython-310.pyc
│   │   │   ├── database.cpython-310.pyc
│   │   │   └── main.cpython-310.pyc
│   │   ├── core/
│   │   │   ├── __pycache__/
│   │   │   │   ├── __init__.cpython-310.pyc
│   │   │   │   ├── deps.cpython-310.pyc
│   │   │   │   └── security.cpython-310.pyc
│   │   │   ├── __init__.py
│   │   │   ├── deps.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── __pycache__/
│   │   │   │   ├── __init__.cpython-310.pyc
│   │   │   │   ├── address.cpython-310.pyc
│   │   │   │   ├── booking.cpython-310.pyc
│   │   │   │   ├── menu.cpython-310.pyc
│   │   │   │   ├── onboarding.cpython-310.pyc
│   │   │   │   ├── region.cpython-310.pyc
│   │   │   │   └── user.cpython-310.pyc
│   │   │   ├── __init__.py
│   │   │   ├── address.py
│   │   │   ├── booking.py
│   │   │   ├── menu.py
│   │   │   ├── onboarding.py
│   │   │   ├── region.py
│   │   │   └── user.py
│   │   ├── routers/
│   │   │   ├── __pycache__/
│   │   │   │   ├── __init__.cpython-310.pyc
│   │   │   │   ├── addresses.cpython-310.pyc
│   │   │   │   ├── admin.cpython-310.pyc
│   │   │   │   ├── auth.cpython-310.pyc
│   │   │   │   ├── booking.cpython-310.pyc
│   │   │   │   ├── exports.cpython-310.pyc
│   │   │   │   ├── kitchen.cpython-310.pyc
│   │   │   │   ├── menu.cpython-310.pyc
│   │   │   │   ├── onboarding.cpython-310.pyc
│   │   │   │   ├── regions.cpython-310.pyc
│   │   │   │   └── users.cpython-310.pyc
│   │   │   ├── __init__.py
│   │   │   ├── addresses.py
│   │   │   ├── admin.py
│   │   │   ├── auth.py
│   │   │   ├── booking.py
│   │   │   ├── exports.py
│   │   │   ├── kitchen.py
│   │   │   ├── menu.py
│   │   │   ├── onboarding.py
│   │   │   ├── regions.py
│   │   │   └── users.py
│   │   ├── schemas/
│   │   │   ├── __pycache__/
│   │   │   │   ├── __init__.cpython-310.pyc
│   │   │   │   ├── address.cpython-310.pyc
│   │   │   │   ├── booking.cpython-310.pyc
│   │   │   │   ├── menu.cpython-310.pyc
│   │   │   │   ├── onboarding.cpython-310.pyc
│   │   │   │   ├── region.cpython-310.pyc
│   │   │   │   └── user.cpython-310.pyc
│   │   │   ├── __init__.py
│   │   │   ├── address.py
│   │   │   ├── booking.py
│   │   │   ├── menu.py
│   │   │   ├── onboarding.py
│   │   │   ├── region.py
│   │   │   └── user.py
│   │   ├── services/
│   │   │   ├── __pycache__/
│   │   │   │   ├── __init__.cpython-310.pyc
│   │   │   │   ├── dish_type.cpython-310.pyc
│   │   │   │   └── pricing.cpython-310.pyc
│   │   │   ├── __init__.py
│   │   │   ├── dish_type.py
│   │   │   ├── pricing.py
│   │   │   └── route_planner.py
│   │   ├── static/
│   │   │   └── styles.css
│   │   ├── templates/
│   │   │   ├── admin_dashboard.html
│   │   │   ├── auth_login.html
│   │   │   ├── auth_register.html
│   │   │   ├── base.html
│   │   │   ├── client_dashboard.html
│   │   │   ├── index.html
│   │   │   └── kitchen_dashboard.html
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── mealprep.db
│   └── requirements.txt
├── frontend/
│   ├── assets/
│   │   ├── icons/
│   │   │   ├── arm.svg
│   │   │   ├── arrow-right.svg
│   │   │   ├── calendar.svg
│   │   │   ├── check.svg
│   │   │   ├── clock.svg
│   │   │   ├── location.svg
│   │   │   ├── meal.svg
│   │   │   └── truck.svg
│   │   ├── logo/
│   │   │   └── mesa.svg
│   │   ├── dish_a.jpg
│   │   ├── dish_b.svg
│   │   ├── hero w b.png
│   │   ├── hero.png
│   │   ├── hero.svg
│   │   ├── logo.svg
│   │   └── old hero.png
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── booking.js
│   │   ├── export.js
│   │   ├── i18n.js
│   │   ├── kitchen.js
│   │   ├── menu.js
│   │   ├── onboarding.js
│   │   └── user.js
│   ├── index.html
│   └── onboarding.html
└── .gitignore
```

---

## Backend

### Tech
- FastAPI app entry: `backend/app/main.py`
- DB: SQLAlchemy + SQLite (file present: `backend/mealprep.db`)
- Requirements: `backend/requirements.txt`

### Core folders
- Routers: `backend/app/routers/`
- Models: `backend/app/models/`
- Schemas (Pydantic): `backend/app/schemas/`
- Services: `backend/app/services/`
- Templates (server-rendered pages): `backend/app/templates/`
- Static: `backend/app/static/`

### Models present
- `user.py`, `address.py`, `region.py`, `menu.py`, `booking.py`, `onboarding.py`

### Routers present
- `auth.py`, `users.py`, `addresses.py`, `regions.py`, `menu.py`, `booking.py`, `admin.py`, `kitchen.py`, `exports.py`, `onboarding.py`

---

## Frontend

### Files
- `frontend/index.html` (landing / SPA shell)
- `frontend/onboarding.html` + `frontend/js/onboarding.js` (onboarding flow UI)
- Other JS modules: `frontend/js/auth.js`, `menu.js`, `booking.js`, `user.js`, `admin.js`, `kitchen.js`, `export.js`, `i18n.js`
- Styles: `frontend/css/styles.css`
- Assets: `frontend/assets/` (icons, hero images, logo)

---

## Onboarding Slice (what matters for our next work)

### Backend endpoints (onboarding router)
- `POST /onboarding/first-week`
- `POST /onboarding/client-type`

### Frontend integration points
- `frontend/js/onboarding.js` calls:
  - `POST /onboarding/first-week`
  - `POST /onboarding/client-type`
- `renderStep7()` and `renderStep71()` handle the **first-week booking** and **behaviour pattern** UI layers.
- `renderStep10()` exists (account fields in state), but Step 10 is not completed end-to-end yet (by design per your plan).

---

## API Endpoint Inventory (from router decorators)

### addresses.py
- `GET` `/addresses/`
- `POST` `/addresses/`
- `DELETE` `/addresses/{address_id}`
- `PUT` `/addresses/{address_id}`

### admin.py
- `GET` `/admin/bookings`
- `GET` `/admin/menu`
- `POST` `/admin/menu`
- `GET` `/admin/menu/{day_number}`
- `GET` `/admin/users`
- `GET` `/admin/weekly-summary`

### auth.py
- `POST` `/auth/register`
- `POST` `/auth/reset-password-simple`
- `POST` `/auth/token`

### booking.py
- `GET` `/booking/`
- `POST` `/booking/`
- `GET` `/booking/slots`
- `GET` `/booking/week-pricing`
- `DELETE` `/booking/{booking_id}`
- `PUT` `/booking/{booking_id}`

### exports.py
- `GET` `/admin/export/bookings`
- `GET` `/admin/export/clients`
- `GET` `/export/driver/today`
- `GET` `/export/today/csv`
- `GET` `/export/week/csv`
- `GET` `/kitchen/export/day`

### kitchen.py
- `GET` `/kitchen/day`

### menu.py
- `GET` `/menu/public-week`

### onboarding.py
- `POST` `/onboarding/client-type`
- `POST` `/onboarding/first-week`

### regions.py
- `GET` `/regions/`
- `POST` `/regions/`
- `DELETE` `/regions/{region_id}`
- `PUT` `/regions/{region_id}`

### users.py
- `GET` `/users/me`

---

## Templates (backend/app/templates)
- `admin_dashboard.html`
- `auth_login.html`
- `auth_register.html`
- `base.html`
- `client_dashboard.html`
- `index.html`
- `kitchen_dashboard.html`

## Backend static
- `styles.css`

---

## Notable things to keep in mind (facts from the zip)

- Zip contains compiled Python files (`.pyc`) under `__pycache__/` (35 files). These should be excluded from version control & distribution.
- Repository includes a SQLite database file: `backend/mealprep.db` (consider excluding from git unless it’s an intentional demo fixture).
- `backend/app/schemas/onboarding.py` contains a debug `print(...)` at import time. That will spam logs and can break tests/WSGI workers; remove it.
- CORS middleware is enabled in `backend/app/main.py` (check allowed origins when deploying).

---

## Practical next step for us (when we start coding)

We will implement **Step 10 registration wiring** using the existing auth router (`/auth/register`, `/auth/token`) *or* extend onboarding cleanly (whichever matches the current intended UX), then add Step 8 and Step 9 layers in the onboarding UI.
