# backend/app/routers/addresses.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..core.deps import get_db_session, get_current_client
from ..models.address import Address
from ..models.user import User
from ..schemas.address import AddressCreate, AddressUpdate, AddressOut

router = APIRouter(prefix="/addresses", tags=["addresses"])


@router.get("/", response_model=list[AddressOut])
def list_addresses(
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_client),
):
    """Return all addresses belonging to the current client."""
    return (
        db.query(Address)
        .filter(Address.user_id == current_user.id)
        .order_by(Address.id.asc())
        .all()
    )


@router.post("/", response_model=AddressOut, status_code=status.HTTP_201_CREATED)
def create_address(
    addr_in: AddressCreate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_client),
):
    """Create a new address, respecting the 3-address limit."""

    # Max 3 addresses
    count = db.query(Address).filter(Address.user_id == current_user.id).count()
    if count >= 3:
        raise HTTPException(status_code=400, detail="Maximum 3 addresses allowed.")

    # If new address is default → unset all other defaults
    if addr_in.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update(
            {Address.is_default: False}
        )

    addr = Address(
        user_id=current_user.id,
        label=addr_in.label,
        line1=addr_in.line1,
        line2=addr_in.line2,
        city=addr_in.city,
        postal_code=addr_in.postal_code,
        region_id=addr_in.region_id,
        notes=addr_in.notes,
        is_default=addr_in.is_default,
    )

    db.add(addr)
    db.commit()
    db.refresh(addr)
    return addr


@router.put("/{address_id}", response_model=AddressOut)
def update_address(
    address_id: int,
    addr_in: AddressUpdate,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_client),
):
    """Update an address for the current user."""

    addr = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == current_user.id)
        .first()
    )

    if not addr:
        raise HTTPException(status_code=404, detail="Address not found.")

    # Future booking restriction (enforced later)
    # TODO: block changes that affect locked bookings (post-Monday cutoff)

    # Handle default toggle
    if addr_in.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update(
            {Address.is_default: False}
        )

    update_data = addr_in.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(addr, field, value)

    db.commit()
    db.refresh(addr)
    return addr


@router.delete("/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_address(
    address_id: int,
    db: Session = Depends(get_db_session),
    current_user: User = Depends(get_current_client),
):
    """Delete an address, unless future bookings depend on it."""

    addr = (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == current_user.id)
        .first()
    )

    if not addr:
        raise HTTPException(status_code=404, detail="Address not found.")

    # TODO: prevent deleting if upcoming bookings use this address

    db.delete(addr)
    db.commit()
    return
