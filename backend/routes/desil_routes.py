from fastapi import APIRouter, Depends, HTTPException
from services.desil_service import proses_kalkulasi_desil
# from dependencies.auth_dependency import get_current_user

router = APIRouter(prefix="/desil", tags=["Kalkulasi Desil"])

@router.post("/hitung/{no_kk}")
def hitung_desil_route(no_kk: str):
    try:
        hasil = proses_kalkulasi_desil(no_kk)
        return {
            "message": "Kalkulasi berhasil disimpan",
            "data": hasil
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))