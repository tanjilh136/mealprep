# backend/app/models/menu.py

from sqlalchemy import Column, Integer, String
from ..database import Base


class MenuDay(Base):
    __tablename__ = "menu_days"

    id = Column(Integer, primary_key=True, index=True)

    # Rotation day number: 1–14
    day_number = Column(Integer, unique=True, nullable=False)

    # Dish options
    dish_a = Column(String, nullable=False)
    dish_b = Column(String, nullable=False)

    # Optional nutrition fields
    calories_a = Column(Integer, nullable=True)
    calories_b = Column(Integer, nullable=True)
