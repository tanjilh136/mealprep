# backend/app/routers/regions.py

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.deps import get_db_session
from ..core.security import require_role
from ..models.region import Region
from ..models.user import User
from ..schemas.region import RegionCreate, RegionOut

router = APIRouter(
    prefix="/regions",
    tags=["Regions"],
)


@router.get("/", response_model=List[RegionOut])
def list_regions(
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    regions = db.query(Region).order_by(Region.name).all()
    return regions


@router.post("/", response_model=RegionOut)
def create_region(
    payload: RegionCreate,
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    existing = db.query(Region).filter(Region.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Region name already exists")

    region = Region(
        name=payload.name,
        description=payload.description,
        available_lunch=payload.available_lunch,
        available_dinner=payload.available_dinner,
    )
    db.add(region)
    db.commit()
    db.refresh(region)
    return region


@router.put("/{region_id}", response_model=RegionOut)
def update_region(
    region_id: int,
    payload: RegionCreate,
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    region = db.query(Region).filter(Region.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")

    # Prevent duplicate names
    existing = (
        db.query(Region)
        .filter(Region.name == payload.name, Region.id != region.id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Region name already exists")

    region.name = payload.name
    region.description = payload.description
    region.available_lunch = payload.available_lunch
    region.available_dinner = payload.available_dinner

    db.commit()
    db.refresh(region)
    return region


@router.delete("/{region_id}")
def delete_region(
    region_id: int,
    db: Session = Depends(get_db_session),
    admin: User = Depends(require_role("admin")),
):
    region = db.query(Region).filter(Region.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")

    # TODO (optional): block deletion if addresses linked to this region exist
    db.delete(region)
    db.commit()
    return {"detail": "Region deleted"}
