# 📂 backend/routes/ppks_routes.py
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from typing import List, Optional
import time
import uuid

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
    data: PPKS,
    credentials = Depends(security)
):
    try:
        # ✅ Ekstrak token & verifikasi user
        token = credentials.credentials
        print(f"🔍 Token received: {token[:20]}...")
        
        user_response = supabase.auth.get_user(token)
        print(f"🔍 User response: {user_response}")
        
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Token tidak valid atau user tidak ditemukan")
        
        user_id = str(user_response.user.id)
        print(f"✅ User ID extracted: {user_id}")
        
        payload = {
            "kategori_ppks": data.kategori_ppks,
            "tanggal_penemuan": data.tanggal_penemuan,
            "nik": data.nik,
            "nama_lengkap": data.nama_lengkap,
            "kecamatan": data.kecamatan,
            "kelurahan": data.kelurahan,
            "lokasi_penemuan": data.lokasi_penemuan,
            "status_penanganan": data.status_penanganan or "Kasus Aktif",
            "catatan_verifikator": data.catatan_verifikator,
            "bukti_foto_ppks": data.bukti_foto_ppks or [],
            "created_by": user_id  # ✅ Wajib untuk RLS policy
        }
        
        print(f"📦 Payload insert: {payload}")
        
        res = supabase.table("ppks").insert(payload).execute()
        
        print(f"📦 Insert response: {res}")
        
        if res.data:
            print(f"✅ Tersimpan dengan ID: {res.data[0]['id']}")
            return {"message": "Berhasil", "data": res.data[0]}
        
        raise HTTPException(status_code=400, detail="Gagal insert data PPKS")
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {type(e).__name__} - {e}")
        raise HTTPException(status_code=500, detail=str(e))
# ==============================
# UPDATE
# ==============================
@router.put("/{id}")
def update_ppks(
    id: str,
    data: PPKS,
    credentials = Depends(security)
):
    try:
        if not credentials:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # ✅ Ekstrak user_id dari token untuk RLS policy
        token = credentials.credentials
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Token tidak valid")
        
        user_id = str(user_response.user.id)
        
        # ✅ Convert data ke dict dan tambahkan user_id untuk RLS
        payload = data.model_dump(exclude_unset=True)
        payload.pop("id", None)
        payload["updated_by"] = user_id  # ✅ Untuk audit trail
        
        updated_data = update_ppks_service(id, payload)
        if not updated_data:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        return updated_data
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {type(e).__name__} - {e}")
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
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from typing import List
import uuid
import time
import re

@router.post("/upload/foto-ppks")
async def upload_foto_ppks(
    ppks_id: str = Form(...),  # ✅ TAMBAHKAN: ID record yang akan diupdate
    files: List[UploadFile] = File(...),
    credentials = Depends(security)
):
    """
    Upload multiple images + langsung update kolom bukti_foto_ppks di DB.
    Expects: multipart/form-data dengan field 'ppks_id' (string) dan 'files' (array of images)
    Returns: { "message": "...", "urls": [...], "updated": true }
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    if not SUPABASE_BUCKET:
        raise HTTPException(status_code=500, detail="SUPABASE_BUCKET tidak terdefinisi")

    # ✅ Validasi ppks_id
    if not ppks_id or not ppks_id.strip():
        raise HTTPException(status_code=400, detail="ppks_id wajib diisi")

    uploaded_urls = []
    
    try:
        # 1. Upload semua file ke Storage
        for file in files:
            if not file.content_type or not file.content_type.startswith("image/"):
                print(f"⚠️ Skipping non-image file: {file.filename}")
                continue
            
            file_bytes = await file.read()
            
            if len(file_bytes) > 5 * 1024 * 1024:
                raise HTTPException(
                    status_code=400, 
                    detail=f"File {file.filename} terlalu besar (max 5MB)"
                )
            
            # Sanitasi nama file (hindari karakter ilegal seperti [])
            name, ext = __import__('os').path.splitext(file.filename or "image.jpg")
            clean_name = re.sub(r'[^\w\-]', '_', name).strip('_-')[:50]
            
            timestamp = int(time.time() * 1000)
            unique_id = uuid.uuid4().hex[:8]
            safe_filename = f"ppks/{ppks_id}/{timestamp}-{unique_id}-{clean_name}{ext}"
            
            print(f"📤 Uploading: {safe_filename}")
            
            supabase.storage.from_(SUPABASE_BUCKET).upload(
                safe_filename,
                file_bytes,
                {"content-type": file.content_type}
            )
            
            public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(safe_filename)
            uploaded_urls.append(public_url)
            print(f"✅ Uploaded: {public_url}")
        
        if not uploaded_urls:
            raise HTTPException(status_code=400, detail="Tidak ada file gambar valid yang diupload")
        
        # 2. ✅ UPDATE DATABASE langsung (bypass RLS karena pakai SERVICE_ROLE_KEY)
        # Gabungkan semua URL jadi string comma-separated (atau pilih yang pertama jika single)
        url_to_save = uploaded_urls[0] if len(uploaded_urls) == 1 else ",".join(uploaded_urls)
        
        print(f"🔍 Updating DB: ppks_id={ppks_id}, url={url_to_save}")
        
        result = supabase.table("ppks") \
            .update({"bukti_foto_ppks": url_to_save}) \
            .eq("id", ppks_id) \
            .execute()
        
        if not result.data:
            raise Exception(
                f"Database update gagal. Record dengan id={ppks_id} tidak ditemukan "
                f"atau kolom 'bukti_foto_ppks' tidak ada di tabel ppks."
            )
        
        print(f"✅ DB Updated Successfully. Rows affected: {len(result.data)}")
        
        return {
            "message": f"Upload berhasil ({len(uploaded_urls)} file)",
            "urls": uploaded_urls,
            "saved_url": url_to_save,
            "updated": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Upload/DB Error: {type(e).__name__} - {error_msg}")
        
        # Pesan error yang lebih informatif
        if "column" in error_msg.lower() and "does not exist" in error_msg.lower():
            raise HTTPException(
                status_code=400,
                detail=f"Kolom database tidak ditemukan. Pastikan kolom 'bukti_foto_ppks' ada di tabel ppks.\n\nDetail: {error_msg}"
            )
        elif "violates row-level security" in error_msg.lower():
            raise HTTPException(
                status_code=403,
                detail="RLS policy memblokir. Backend seharusnya bypass RLS. Cek SUPABASE_SERVICE_ROLE_KEY di .env"
            )
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Gagal upload: {error_msg}"
        )