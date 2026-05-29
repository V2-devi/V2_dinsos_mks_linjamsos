# # 📂 backend/routes/anggota_routes.py
# from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
# from config.database import supabase
# from config.auth import security
# import time

# router = APIRouter(prefix="/anggota", tags=["Anggota"])

# # ==========================================
# # UPLOAD SURAT KEMATIAN (Single PDF)
# # ==========================================
# @router.post("/{anggota_id}/upload-surat-kematian")
# async def upload_surat_kematian(
#     anggota_id: str,
#     file: UploadFile = File(...),
#     credentials = Depends(security)
# ):
#     """
#     Upload surat kematian PDF untuk anggota keluarga tertentu
#     dan langsung simpan URL-nya ke database
#     """
#     if not credentials:
#         raise HTTPException(status_code=401, detail="Unauthorized")

#     # Validasi file PDF
#     if file.content_type != "application/pdf":
#         raise HTTPException(status_code=400, detail="Hanya file PDF yang diperbolehkan")
    
#     # Batasi ukuran max 5MB
#     file.file.seek(0, 2)
#     size = file.file.tell()
#     file.file.seek(0)
#     if size > 5 * 1024 * 1024:
#         raise HTTPException(status_code=400, detail="Ukuran file maksimal 5MB")

#     try:
#         # 1. Upload ke Supabase Storage
#         timestamp = int(time.time() * 1000)
#         safe_filename = f"{anggota_id}/{timestamp}-{file.filename.replace(' ', '_')}"
        
#         file_bytes = await file.read()
        
#         supabase.storage.from_("surat-kematian").upload(
#             safe_filename,
#             file_bytes,
#             {"content-type": "application/pdf"}
#         )
        
#         # 2. Dapatkan public URL
#         public_url = supabase.storage.from_("surat-kematian").get_public_url(safe_filename)
        
#         # 3. Update database anggota_keluarga dengan URL
#         update_result = supabase.table("anggota_keluarga") \
#             .update({"surat_kematian": public_url}) \
#             .eq("id", anggota_id) \
#             .execute()
        
#         if not update_result.data:
#             raise HTTPException(status_code=404, detail="Anggota tidak ditemukan")
        
#         return {
#             "message": "Surat kematian berhasil diupload dan disimpan",
#             "url": public_url,
#             "data": update_result.data[0]
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"❌ Upload Surat Kematian Error: {e}")
#         raise HTTPException(status_code=500, detail=f"Gagal upload: {str(e)}")


# # ==========================================
# # UPDATE DATA ANGGOTA (dengan surat_kematian)
# # ==========================================
# @router.put("/{anggota_id}")
# async def update_anggota(
#     anggota_id: str,
#     data: dict,
#     credentials = Depends(security)
# ):
#     """Update data anggota termasuk surat_kematian"""
#     if not credentials:
#         raise HTTPException(status_code=401, detail="Unauthorized")

#     try:
#         # Hanya update field yang dikirim
#         update_data = {k: v for k, v in data.items() if v is not None}
        
#         result = supabase.table("anggota_keluarga") \
#             .update(update_data) \
#             .eq("id", anggota_id) \
#             .execute()
        
#         if not result.data:
#             raise HTTPException(status_code=404, detail="Anggota tidak ditemukan")
        
#         return {"message": "Berhasil diupdate", "data": result.data[0]}
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))