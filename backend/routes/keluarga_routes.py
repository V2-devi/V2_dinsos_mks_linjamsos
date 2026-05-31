from fastapi import APIRouter, Depends, HTTPException
from dependencies.auth_dependency import get_current_user
from schemas.keluarga_schema import Keluarga, UpdateDesil
from fastapi.security import HTTPBearer
from services.keluarga_service import (
    create_keluarga,
    get_keluarga,
    update_keluarga,
    update_desil
)
from services.anggota_service import (
    create_anggota_keluarga,
    get_anggota_keluarga,
    update_anggota
)
from schemas.anggota_schema import Anggota, UpdateKondisiKhusus
from config.database import supabase, SUPABASE_BUCKET_DOKUMEN

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
# 📂 backend/routes/keluarga_routes.py
@router.post("/{no_kk}/anggota")
async def create_anggota_keluarga_route(
    no_kk: str,
    data: Anggota,
    credentials=Depends(security)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authorization header is required")
    
    # Panggil service function
    result = create_anggota_keluarga(no_kk, data)
    
    # ✅ BUNGKUS RESULT AGAR SESUAI DENGAN FRONTEND
    # Jika result sudah object, langsung return dengan key 'data'
    # Jika result adalah tuple (data, error), ambil data-nya saja
    if isinstance(result, tuple):
        inserted_data, error = result
        if error:
            raise HTTPException(status_code=400, detail=str(error))
        return {"message": "Berhasil", "data": inserted_data}
    else:
        # Jika result langsung data object
        return {"message": "Berhasil", "data": result}

        

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
    

@router.put("/desil/{no_kk}")
async def update_desil_route(
    no_kk: str,
    data: UpdateDesil
):
    return update_desil(no_kk, data)




# 📂 backend/routes/keluarga_routes.py
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from config.database import supabase
from config.auth import security
import os
import re
import time
import uuid


def sanitize_storage_filename(filename: str) -> str:
    """Buat key file Supabase yang valid dari nama file asli."""
    name = os.path.basename(filename)
    name = name.replace(' ', '_')
    name = re.sub(r'[^0-9A-Za-z._-]+', '_', name)
    name = name.strip('_')
    if not name:
        name = str(uuid.uuid4()) + '.pdf'
    if not name.lower().endswith('.pdf'):
        name = f"{os.path.splitext(name)[0]}.pdf"
    return name


# ==========================================
# UPLOAD SURAT KEMATIAN (Disesuaikan dengan pola /keluarga/{no_kk}/anggota/{id})
# ==========================================
@router.post("/{no_kk}/anggota/{anggota_id}/upload-surat-kematian")
async def upload_surat_kematian(
    no_kk: str,
    anggota_id: str,
    file: UploadFile = File(...),
    credentials = Depends(security)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Hanya file PDF yang diperbolehkan")
    
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    if size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 5MB")

    try:
        timestamp = int(time.time() * 1000)
        sanitized_name = sanitize_storage_filename(file.filename)
        safe_filename = f"{no_kk}/{anggota_id}/{timestamp}-{sanitized_name}"
        
        file_bytes = await file.read()
        
        # 1. Upload ke Storage
        supabase.storage.from_(SUPABASE_BUCKET_DOKUMEN).upload(
            safe_filename,
            file_bytes,
            {"content-type": "application/pdf"}
        )

        public_url = supabase.storage.from_(SUPABASE_BUCKET_DOKUMEN).get_public_url(safe_filename)
        # 2. Update Database (WAJIB CEK HASILNYA)
        print(f"🔍 Updating DB: id={anggota_id}, url={public_url}")
        result = supabase.table("anggota_keluarga") \
            .update({"surat_kematian": public_url}) \
            .eq("id", anggota_id) \
            .eq("no_kk", no_kk) \
            .execute()
            
        if not result.data:
            raise Exception("Database update returned empty. Check RLS Policy for UPDATE.")
            
        print("✅ DB Updated Successfully")
        return {"message": "Berhasil", "url": public_url}
        
    except Exception as e:
        print(f"❌ Upload/DB Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))