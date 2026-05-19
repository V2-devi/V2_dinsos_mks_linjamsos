from fastapi import APIRouter, HTTPException, Depends
from schemas.ppks_schema import PPKS
from services.ppks_service import (
    get_all_ppks_service,
    get_ppks_by_id_service,
    create_ppks_service,
    update_ppks_service,
    delete_ppks_service
)
# Jika Anda punya auth dependency, import di sini
# from dependencies.auth_dependency import get_current_user 

# ✅ HANYA SATU INISIALISASI ROUTER
router = APIRouter(prefix="/PPKS", tags=["PPKS"])

# ==============================
# GET ALL
# ==============================
@router.get("/")
def get_all_ppks():
    """Mengambil semua data PPKS"""
    try:
        return get_all_ppks_service()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# GET DETAIL BY ID
# ==============================
@router.get("/{id}")  # ✅ URL menjadi: /PPKS/{id}
def get_ppks_by_id(id: str):
    """Mengambil detail PPKS berdasarkan ID"""
    try:
        data = get_ppks_by_id_service(id)
        if not data:
            raise HTTPException(status_code=404, detail="Data PPKS tidak ditemukan")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# CREATE
# ==============================
@router.post("/")
def create_ppks(data: PPKS):
    """Menambah data PPKS baru"""
    try:
        # Service sekarang mengembalikan data hasil insert
        return create_ppks_service(data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal membuat data: {str(e)}")

# ==============================
# UPDATE
# ==============================
@router.put("/{id}")  # ✅ URL menjadi: /PPKS/{id}
def update_ppks(id: str, data: PPKS):  # ✅ Ganti 'dict' menjadi 'PPKS' untuk validasi
    """Mengupdate data PPKS berdasarkan ID"""
    try:
        updated_data = update_ppks_service(id, data)
        if not updated_data:
            raise HTTPException(status_code=404, detail="Data PPKS tidak ditemukan atau gagal diupdate")
        return updated_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal update data: {str(e)}")

# ==============================
# DELETE
# ==============================
@router.delete("/{id}")  # ✅ URL menjadi: /PPKS/{id}
def delete_ppks(id: str):
    """Menghapus data PPKS berdasarkan ID"""
    try:
        return delete_ppks_service(id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))







# from fastapi import APIRouter
# from schemas.ppks_schema import PPKS

# from services.ppks_service import (
#     get_all_ppks_service,
#     get_ppks_by_id_service,
#     create_ppks_service,
#     update_ppks_service,
#     delete_ppks_service
# )

# router = APIRouter()
# router = APIRouter(prefix="/PPKS", tags=["PPKS"])

# # ==============================
# # GET ALL
# # ==============================
# @router.get("/")
# def get_all_ppks():

#     return get_all_ppks_service()


# # ==============================
# # GET DETAIL
# # ==============================
# @router.get("/ppks/{id}")
# def get_ppks_by_id(id: str):

#     return get_ppks_by_id_service(id)


# # ==============================
# # CREATE
# # ==============================
# @router.post("/")
# def create_ppks(data: PPKS):

#     return create_ppks_service(data)


# # ==============================
# # UPDATE
# # ==============================
# @router.put("/ppks/{id}")
# def update_ppks(id: str, data: dict):

#     return update_ppks_service(id, data)


# # ==============================
# # DELETE
# # ==============================
# @router.delete("/ppks/{id}")
# def delete_ppks(id: str):

#     return delete_ppks_service(id)