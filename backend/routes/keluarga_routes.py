from fastapi import APIRouter, Depends
from dependencies.auth_dependency import get_current_user

from services.keluarga_service import (
    create_keluarga,
    create_anggota_keluarga,
    get_keluarga,
    get_anggota_keluarga,
    update_keluarga,
    delete_anggota_keluarga
)

router = APIRouter(prefix="/keluarga", tags=["Keluarga"])

@router.post("/")
async def create_keluarga_route(data: dict, user=Depends(get_current_user)):
    return create_keluarga(user.id, data)

@router.post("/{id}/anggota")
async def create_anggota_keluarga_route(id: str, data: dict, user=Depends(get_current_user)):
    return create_anggota_keluarga(id, data)

@router.get("/")
async def get_keluarga_route(user=Depends(get_current_user)):
    return get_keluarga(user.id)

@router.get("/")
async def get_anggota_keluarga_route(user=Depends(get_current_user)):
    return get_anggota_keluarga(user.id)

@router.put("/{id}")
async def update_keluarga(user=Depends(get_current_user)):
    return update_keluarga(user.id)

@router.delete("/anggota/{id}")
async def delete_anggota_keluarga(user=Depends(get_current_user)):
    return delete_anggota_keluarga(user.id)
    