# backend/app/services/dish_type.py

import re
from typing import Optional


_FISH_KEYWORDS = {
    # Portuguese + English common fish/seafood terms
    "fish", "salmon", "tuna", "cod", "hake", "sardine", "anchovy",
    "bacalhau", "atum", "salmão", "salmao", "pescada", "robalo", "dourada",
    "polvo", "lulas", "camarao", "camarão", "shrimp", "prawn",
    "octopus", "squid", "marisco", "seafood", "enguia", "trout", "tilapia",
}


def infer_dish_type(dish_name: Optional[str]) -> str:
    """
    Deterministic classifier for Slice 1.

    - If dish name contains a fish/seafood keyword -> 'fish'
    - Else -> 'meat'

    Behaviour storage must only use: meat | fish | blank (never dish names).
    """
    if not dish_name:
        return "meat"

    s = re.sub(r"\s+", " ", dish_name.strip().lower())
    for kw in _FISH_KEYWORDS:
        if kw in s:
            return "fish"
    return "meat"
