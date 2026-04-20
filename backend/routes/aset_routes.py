from fastapi import APIRouter, Depends
from dependencies.auth_dependency import get_current_data
from services.aset_service import (
    get_kategori_with_indikator,
    create_aset_keluarga,
    get_aset_keluarga

)

router = APIRouter(prefix="/aset", tags=["Aset"])

# Ambil data berdasarkan kategori dan indikator
@router.get("/kategori")
async def get_kategori_with_indikator():
    return get_kategori_with_indikator()

# Simpan aset keluarga
@router.post("/{keluarga_id}")
async def create_aset_keluarga(keluarga_id: str, data: list):
    return create_aset_keluarga(keluarga_id, data)

# Ambil aset keluarga
@router.get("/{keluarga_id}")
async def get_aset_keluarga(keluarga_id: str):
    return get_aset_keluarga(keluarga_id)