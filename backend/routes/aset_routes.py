from fastapi import APIRouter, Depends, HTTPException
from schemas.aset_schema import AsetCreate
# from services.aset_service import create_aset, get_aset, update_aset
from fastapi.security import HTTPBearer

from services.aset_service import update_aset_service, get_aset_by_nokk_service
# from dependencies.auth_dependency import get_current_user # Jika pakai auth

router = APIRouter(prefix="/aset", tags=["Aset Keluarga"]) # ✅ Prefix langsung /aset

# ==============================
# UPDATE / INSERT ASET (UPSERT)
# ==============================
@router.put("/{no_kk}")
def update_aset_route(
    no_kk: str, 
    data: dict, 
    credentials = Depends(lambda: True) # Ganti dengan auth dependency Anda jika ada
):
    """
    Update atau Insert data 39 variabel aset berdasarkan No KK.
    URL: PUT /aset/{no_kk}
    """
    try:
        result = update_aset_service(no_kk, data)
        return {"message": "Data aset berhasil disimpan", "data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ==============================
# GET DETAIL ASET (Opsional)
# ==============================
@router.get("/{no_kk}")
def get_aset_route(no_kk: str):
    """
    Ambil data aset berdasarkan No KK.
    URL: GET /aset/{no_kk}
    """
    try:
        result = get_aset_by_nokk_service(no_kk)
        if not result:
            return {"data": {}} # Return kosong jika belum ada data aset
        return {"data": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))