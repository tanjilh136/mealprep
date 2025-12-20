#BACKEND/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from .config import DATABASE_URL

# SQLite needs check_same_thread=False when used with FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 30} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    """
    The core session generator used everywhere.
    FastAPI dependencies or wrappers can call next(get_db()).
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
