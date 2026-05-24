from fastapi import APIRouter, HTTPException
from services.desil_service import proses_kalkulasi_desil, proses_kalkulasi_desil

router = APIRouter(
    prefix="/desil",
    tags=["Desil"]
)

@router.post("/kalkulasi/{no_kk}")
def hitung_desil_route(no_kk: str):
    """Hitung desil dari aset data dan simpan langsung ke database"""
    try:
        return proses_kalkulasi_desil(no_kk)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{no_kk}")
async def simpan_hasil_desil_route(no_kk: str, payload: dict):
    """
    Simpan hasil desil yang sudah dihitung di frontend.
    Payload: {skor_pmt, hasil_desil, kategori_desil, tanggal_hitung_desil}
    """
    try:
        result = proses_kalkulasi_desil(no_kk, payload)
        return {
            "message": "Hasil desil berhasil disimpan",
            "data": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))