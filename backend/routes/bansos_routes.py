from fastapi import APIRouter
from services.bansos_service import (
    get_pengusulan_service,
    approve_pengusulan_service,
    reject_pengusulan_service,
    create_pengusulan
)
from schemas.bansos_schema import PengusulanCreate

router = APIRouter(prefix="/bansos", tags=["Bansos"])

@router.post("/pengusulan")
def create(data: PengusulanCreate):
    return create_pengusulan(data)

@router.get("/pengusulan")
def get_pengusulan():
    return get_pengusulan_service()

@router.put("/pengusulan/{id}/approve")
def approve_pengusulan(id: str):
    return approve_pengusulan_service(id)

@router.put("/pengusulan/{id}/reject")
def reject_pengusulan(id: str):
    return reject_pengusulan_service(id)



