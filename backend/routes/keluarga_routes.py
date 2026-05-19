from fastapi import APIRouter, Depends, HTTPException

from dependencies.auth_dependency import get_current_user
from schemas.keluarga_schema import Keluarga
from fastapi.security import HTTPBearer
from services.keluarga_service import (
    create_keluarga,
    get_keluarga,
    update_keluarga,
    # delete_anggota_keluarga
)
from services.anggota_service import create_anggota_keluarga, get_anggota_keluarga
from schemas.anggota_schema import Anggota, UpdateKondisiKhusus


router = APIRouter(prefix="/keluarga", tags=["Keluarga"])

security = HTTPBearer()
# @router.post("/")
# async def create_keluarga_route(data: Keluarga, user=Depends(get_current_user)):
#     return create_keluarga(user.id, data)


@router.post("/")
async def create_keluarga_route(data: Keluarga):
    return create_keluarga(data)

@router.post("/{no_kk}/anggota")
async def create_anggota_keluarga_route(
    no_kk: str,
    data: Anggota,
    credentials=Depends(security)
):

    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header is required")

    return create_anggota_keluarga(no_kk, data)


@router.put("/anggota/{id}/kondisi")
async def update_kondisi_route(
    id: int,
    data: UpdateKondisiKhusus
):
    return update_kondisi_khusus(id, data)@router.put("/anggota/{id}/kondisi")
async def update_kondisi_route(
    id: int,
    data: UpdateKondisiKhusus
):
    return update_kondisi_khusus(id, data)

# @router.post("/{id}/anggota")
# async def create_anggota_keluarga_route(id: str, data: dict, user=Depends(get_current_user)):
#     return create_anggota_keluarga(id, data)

@router.get("/")
async def get_keluarga_route():
    return get_keluarga()


@router.get("/{no_kk}/anggota")
async def get_anggota_keluarga_route(
    no_kk: str,
    credentials=Depends(security)
):

    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header is required")

    return get_anggota_keluarga(no_kk)


# @router.get("/{id}/anggota")
# async def get_anggota_keluarga_route(id: str, user=Depends(get_current_user)):
#     return get_anggota_keluarga(id)

@router.put("/{id}")
async def update_keluarga(user=Depends(get_current_user)):
    return update_keluarga(user.id)

# @router.delete("/anggota/{id}")
# async def delete_anggota_keluarga(user=Depends(get_current_user)):
#     return delete_anggota_keluarga(user.id)
    