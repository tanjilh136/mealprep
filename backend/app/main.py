# backend/app/main.py

from pathlib import Path

from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .database import Base, engine
from .routers import (
    auth,
    booking,
    admin,
    kitchen,
    exports,
    addresses,
    regions,
    users,
    menu,
)
from .core.security import require_role, get_current_user
from .models.user import User

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MealPrep API")

# ---------------------------------------------------------------------------
# Static files & templates
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),
    name="static",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # no "*" with allow_credentials=True
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers (API)
# ---------------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(addresses.router)
app.include_router(regions.router)
app.include_router(menu.router)
app.include_router(booking.router)
app.include_router(admin.router)
app.include_router(kitchen.router)
app.include_router(exports.router)  # single unified exports router

# ---------------------------------------------------------------------------
# HTML pages
# ---------------------------------------------------------------------------

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    """Public landing page."""
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/auth/login", response_class=HTMLResponse)
def login_page(request: Request):
    """Simple login form that posts to /auth/token."""
    return templates.TemplateResponse("auth_login.html", {"request": request})


@app.get("/auth/register", response_class=HTMLResponse)
def register_page(request: Request):
    """Simple registration form that posts to /auth/register."""
    return templates.TemplateResponse("auth_register.html", {"request": request})



@app.get("/dashboard/client", response_class=HTMLResponse)
def client_dashboard(
    request: Request,
    user: User = Depends(require_role("client")),
):
    """Client dashboard view."""
    return templates.TemplateResponse(
        "client_dashboard.html",
        {"request": request, "user": user},
    )


@app.get("/dashboard/admin", response_class=HTMLResponse)
def admin_dashboard(
    request: Request,
    admin_user: User = Depends(require_role("admin")),
):
    """Admin dashboard view."""
    return templates.TemplateResponse(
        "admin_dashboard.html",
        {"request": request, "user": admin_user},
    )


@app.get("/dashboard/kitchen", response_class=HTMLResponse)
def kitchen_dashboard(
    request: Request,
    kitchen_user: User = Depends(require_role("kitchen")),
):
    """Kitchen dashboard view."""
    return templates.TemplateResponse(
        "kitchen_dashboard.html",
        {"request": request, "user": kitchen_user},
    )


# Optional: keep a pure-JSON health endpoint if you want
@app.get("/health")
def health():
    return {"status": "ok", "message": "MealPrep API running"}
