# 📂 backend/routes/ppks_routes.py
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from typing import List, Optional
import time

from config.database import supabase, SUPABASE_BUCKET
from config.auth import security
from schemas.ppks_schema import PPKS
from services.ppks_service import (
    get_all_ppks_service,
    get_ppks_by_id_service,
    create_ppks_service,
    update_ppks_service,
    delete_ppks_service,
)

# ✅ 1. PREFIX HARUS LOWERCASE & SINKRON DENGAN FRONTEND
router = APIRouter(prefix="/ppks", tags=["PPKS"])

# ==============================
# GET ALL
# ==============================
@router.get("/")
def get_all_ppks():
    try:
        return get_all_ppks_service()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# GET DETAIL BY ID
# ==============================
@router.get("/{id}")
def get_ppks_by_id(id: str):
    try:
        data = get_ppks_by_id_service(id)
        if not data:
            raise HTTPException(status_code=404, detail="Data PPKS tidak ditemukan")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# CREATE PPKS
# ==============================
@router.post("/")
async def create_ppks(
    data: PPKS,  # Pastikan schema PPKS punya field bukti_foto_ppks: Optional[List[str]]
    credentials = Depends(security)
):
    try:
        # Validasi token → dapat user_id
        token = credentials.credentials
        user_response = supabase.auth.get_user(token)
        user_id = user_response.user.id if user_response and user_response.user else None
        
        payload = {
            "kategori_ppks": data.kategori_ppks,
            "tanggal_penemuan": data.tanggal_penemuan,
            "nik": data.nik,
            "nama_lengkap": data.nama_lengkap,
            "kecamatan": data.kecamatan,
            "kelurahan": data.kelurahan,
            "lokasi_penemuan": data.lokasi_penemuan,
            "status_penanganan": data.status_penanganan,
            "bukti_foto_ppks": data.bukti_foto_ppks or [],  # ✅ Array URL
            "created_by": user_id
        }
        
        print(f"📦 Payload insert: {payload}")  # Debug log
        
        res = supabase.table("ppks").insert(payload).execute()
        
        if res.data:
            print(f"✅ Tersimpan dengan ID: {res.data[0]['id']}")
            print(f"📸 URL Foto: {res.data[0]['bukti_foto_ppks']}")
            return {"message": "Berhasil", "data": res.data[0]}
            
        raise HTTPException(status_code=400, detail="Gagal insert data")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
# ==============================
# UPDATE
# ==============================
@router.put("/{id}")
def update_ppks(id: str, data: PPKS):
    try:
        updated_data = update_ppks_service(id, data)
        if not updated_data:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        return updated_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal update: {str(e)}")

# ==============================
# DELETE
# ==============================
@router.delete("/{id}")
def delete_ppks(id: str):
    try:
        return delete_ppks_service(id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# ✅ UPLOAD FOTO (PATH SINKRON DENGAN FRONTEND)
# ==============================
@router.post("/upload/foto-ppks")  # ✅ Final path: /ppks/upload/foto-ppks
async def upload_foto_ppks(
    files: List[UploadFile] = File(...),
    credentials = Depends(security)
):
    """
    Upload multiple images to Supabase Storage.
    Expects: multipart/form-data with field name 'files'
    Returns: { "urls": ["https://...", "..."] }
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    if not SUPABASE_BUCKET:
        raise HTTPException(status_code=500, detail="SUPABASE_BUCKET tidak terdefinisi")

    uploaded_urls = []
    
    try:
        for file in files:
            if not file.content_type or not file.content_type.startswith("image/"):
                continue
            
            timestamp = int(time.time() * 1000)
            # ✅ Gunakan timestamp atau ID sebagai folder/prefix
            safe_filename = f"temp/{timestamp}-{file.filename.replace(' ', '_')}"
            
            file_bytes = await file.read()
            
            supabase.storage.from_(SUPABASE_BUCKET).upload(
                safe_filename,
                file_bytes,
                {"content-type": file.content_type}
            )
            
            public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(safe_filename)
            uploaded_urls.append(public_url)
            
        return {"message": "Upload berhasil", "urls": uploaded_urls}
        
    except Exception as e:
        print(f"❌ Upload Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal upload: {str(e)}"
        )