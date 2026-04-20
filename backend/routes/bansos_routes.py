from fastapi import APIRouter, Depends
from dependencies.auth_dependency import get_current_user


from services.bansos_service import (
    get_bantuan,
    daftar_bantuan,
    get_bantuan_keluarga,
    verifikasi_bantuan
)

router = APIRouter(prefix="/bansos", tags=["Bansos"])

@router.get("/")
async def get_bantuan_route():
    return get_bantuan()


@router.post("/{keluarga_id}")
async def daftar_bantuan_route(
    keluarga_id: str,
    data: dict,
    user=Depends(get_current_user)
):
    return daftar_bantuan(keluarga_id, user.id, data)

@router.get("/keluarga/{keluarga_id}")
async def get_bantuan_keluarga_route(keluarga_id: str):
    return get_bantuan_keluarga(keluarga_id)

@router.put("/verifikasi/{transaksi_id}")
async def verifikasi_bantuan_route(data: dict):
    return verifikasi_bantuan(data)