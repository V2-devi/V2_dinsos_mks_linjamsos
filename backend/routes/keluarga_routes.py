from fastapi import APIRouter, Depends, HTTPException
from dependencies.auth_dependency import get_current_user
from schemas.keluarga_schema import Keluarga
from fastapi.security import HTTPBearer
from services.keluarga_service import (
    create_keluarga,
    get_keluarga,
    update_keluarga,
)
from services.anggota_service import (
    create_anggota_keluarga,
    get_anggota_keluarga,
    update_anggota
)
from schemas.anggota_schema import Anggota, UpdateKondisiKhusus

router = APIRouter(prefix="/keluarga", tags=["Keluarga"])
security = HTTPBearer()

# ================= KLUARGA =================
@router.post("/")
async def create_keluarga_route(data: Keluarga):
    return create_keluarga(data)

@router.get("/")
async def get_keluarga_route():
    return get_keluarga()

# ✅ HAPUS DUPLIKAT @router.put("/{id}") YANG KEDUA!
@router.put("/{id}")
async def update_keluarga_route(
    id: int,
    data: Keluarga,
    credentials=Depends(security)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return update_keluarga(id, data)

# ================= ANGGOTA =================
@router.post("/{no_kk}/anggota")
async def create_anggota_keluarga_route(
    no_kk: str,
    data: Anggota,
    credentials=Depends(security)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header is required")
    return create_anggota_keluarga(no_kk, data)

@router.get("/{no_kk}/anggota")
async def get_anggota_keluarga_route(
    no_kk: str,
    credentials=Depends(security)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header is required")
    return get_anggota_keluarga(no_kk)

# ✅ TAMBAHKAN ENDPOINT INI (YANG SEBELUMNYA HILANG)
@router.put("/{no_kk}/anggota/{anggota_id}")
async def update_anggota_route(
    no_kk: str,
    anggota_id: int,
    data: UpdateKondisiKhusus,
    credentials=Depends(security)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        updated_data = update_anggota(no_kk, anggota_id, data)
        return {"message": "Berhasil diperbarui", "data": updated_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))