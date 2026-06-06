# from config.database import supabase, storage_client, SUPABASE_BUCKET
from config.database import supabase, SUPABASE_BUCKET
from schemas.ppks_schema import PPKS
from typing import Optional
from uuid import uuid4
# ==============================
# GET ALL PPKS
# ==============================
def get_all_ppks_service():
    response = supabase.table("ppks") \
        .select("*") \
        .order("id", desc=True) \
        .execute()

    return response.data


# ==============================
# GET DETAIL PPKS BY ID
# ==============================
def get_ppks_by_id_service(ppks_id: str):
    # Gunakan uuid atau string id sesuai tipe data di DB
    response = supabase.table("ppks") \
        .select("*") \
        .eq("id", ppks_id) \
        .single() \
        .execute()

    return response.data


# ==============================
# CREATE PPKS
# ==============================
def create_ppks_service(data: PPKS):
    # ✅ Convert Pydantic model ke dictionary, exclude None agar tidak mengirim null jika opsional
    payload = data.model_dump(exclude_unset=True)
    
    # Pastikan status default jika tidak dikirim
    if "status_penanganan" not in payload:
        payload["status_penanganan"] = "Kasus Aktif"

    response = supabase.table("ppks") \
        .insert(payload) \
        .execute()

    if not response.data:
        raise Exception("Gagal menyimpan data PPKS ke Supabase")

    return response.data[0]


# ==============================
# UPDATE PPKS
# ==============================
def update_ppks_service(ppks_id: str, payload: dict):
    """Update PPKS dengan payload yang sudah diproses (termasuk user context)"""
    
    if not payload:
        raise Exception("Tidak ada data untuk diupdate")

    print(f"🔍 Updating PPKS {ppks_id} dengan payload: {payload}")
    
    response = supabase.table("ppks") \
        .update(payload) \
        .eq("id", ppks_id) \
        .execute()

    print(f"📦 Update response: {response}")
    
    if not response.data:
        raise Exception(f"Data PPKS dengan ID {ppks_id} tidak ditemukan atau gagal diupdate")

    return response.data[0]


# ==============================
# DELETE PPKS
# ==============================
def delete_ppks_service(ppks_id: str):
    response = supabase.table("ppks") \
        .delete() \
        .eq("id", ppks_id) \
        .execute()

    # Supabase delete biasanya return empty list jika sukses, atau error jika gagal
    return {"message": "PPKS berhasil dihapus"}




import os
import re
import time
import uuid

def upload_foto_ppks(ppks_id: str, files, SUPABASE_BUCKET: str):
    """Upload foto dan LANGSUNG update database - TANPA PANGGIL FUNGSI LAIN"""
    
    print(f"\n{'='*70}")
    print(f"🚀 UPLOAD FOTO PPKS - DIRECT DATABASE UPDATE")
    print(f"{'='*70}")
    print(f"📋 PPKS ID: {ppks_id}")
    print(f"📦 Jumlah file: {len(files)}")
    print(f"🗄️  Bucket: {SUPABASE_BUCKET}")
    
    try:
        uploaded_urls = []
        
        # 1. Upload semua file ke Storage
        for idx, file in enumerate(files, 1):
            print(f"\n📤 [{idx}/{len(files)}] File: {file.filename}")
            
            # Sanitasi nama file
            name, ext = os.path.splitext(file.filename or "image.jpg")
            clean_name = re.sub(r'[^\w\-]', '_', name).strip('_-')[:50]
            timestamp = int(time.time() * 1000)
            unique_id = uuid.uuid4().hex[:8]
            safe_filename = f"ppks/{ppks_id}/{timestamp}-{unique_id}-{clean_name}{ext}"
            
            # Baca & Upload
            file_content = file.file.read()
            supabase.storage.from_(SUPABASE_BUCKET).upload(
                safe_filename, file_content, {"content-type": file.content_type}
            )
            
            public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(safe_filename)
            uploaded_urls.append(public_url)
            print(f"   ✅ Uploaded: {public_url[:80]}...")
        
        if not uploaded_urls:
            raise Exception("Tidak ada file yang berhasil diupload")
        
        # 2. Gabungkan URL
        url_to_save = uploaded_urls[0] if len(uploaded_urls) == 1 else ",".join(uploaded_urls)
        print(f"\n🔗 URL to save: {url_to_save[:80]}...")
        
        # 3. ✅ LANGSUNG UPDATE DATABASE - TANPA PANGGIL FUNGSI SERVICE
        print(f"\n🔄 DIRECT DATABASE UPDATE...")
        print(f"   Table: ppks")
        print(f"   ID: {ppks_id}")
        print(f"   Column: bukti_foto_ppks")
        
        # ⚠️ PASTIKAN NAMA KOLOM INI BENAR! Cek di Supabase Table Editor
        result = supabase.table("ppks") \
            .update({"bukti_foto_ppks": url_to_save}) \
            .eq("id", ppks_id) \
            .execute()
        
        print(f"\n📦 RESULT:")
        print(f"   Data: {result.data}")
        print(f"   Error: {result.error if hasattr(result, 'error') else 'None'}")
        print(f"   Count: {result.count if hasattr(result, 'count') else 'None'}")
        
        # 4. Verifikasi update berhasil
        if result.data and len(result.data) > 0:
            updated_record = result.data[0]
            saved_url = updated_record.get('bukti_foto_ppks')
            print(f"\n✅ DATABASE UPDATED SUCCESSFULLY!")
            print(f"   Saved URL: {saved_url[:80] if saved_url else 'NULL'}...")
        else:
            print(f"\n⚠️ WARNING: Update executed but no data returned!")
            print(f"   Possible causes:")
            print(f"   1. ID {ppks_id} tidak ditemukan di tabel ppks")
            print(f"   2. RLS policy memblokir update")
            print(f"   3. Nama kolom 'bukti_foto_ppks' salah")
            
            # Coba cek apakah ID ada
            check = supabase.table("ppks").select("id").eq("id", ppks_id).execute()
            if not check.data:
                print(f"   ❌ ID {ppks_id} TIDAK ADA di tabel ppks!")
            else:
                print(f"   ✅ ID {ppks_id} ADA di tabel ppks")
        
        print(f"\n{'='*70}")
        print(f"✅ UPLOAD SELESAI")
        print(f"{'='*70}\n")
        
        return uploaded_urls
        
    except Exception as e:
        print(f"\n{'='*70}")
        print(f"❌ ERROR FATAL!")
        print(f"{'='*70}")
        print(f"Type: {type(e).__name__}")
        print(f"Message: {str(e)}")
        print(f"{'='*70}\n")
        raise Exception(f"Gagal upload: {str(e)}")




# from config.database import supabase
# from schemas.ppks_schema import PPKS

# # ==============================
# # GET ALL PPKS
# # ==============================
# def get_all_ppks_service():

#     response = supabase.table("ppks") \
#         .select("*") \
#         .order("id", desc=True) \
#         .execute()

#     return response.data


# # ==============================
# # GET DETAIL PPKS
# # ==============================
# def get_ppks_by_id_service(id: str):

#     response = supabase.table("ppks") \
#         .select("*") \
#         .eq("id", id) \
#         .single() \
#         .execute()

#     return response.data


# # ==============================
# # CREATE PPKS
# # ==============================
# def create_ppks_service(data: dict: PPKS):

#     supabase.table("ppks") \
#         .insert({
#             "nama_lengkap": data["nama_lengkap"],
#             "kategori_ppks": data["kategori_ppks"],
#             "lokasi_penemuan": data["lokasi_penemuan"],
#             "tanggal_penemuan": data["tanggal_penemuan"],
#             "status_penanganan": data["status_penanganan"],
#             "kecamatan": data["kecamatan"],
#             "kelurahan": data["kelurahan"],
#             "nik": data.get("nik")  
            
#         }) \
#         .execute()

#     return {
#         "message": "PPKS berhasil ditambahkan"
#     }


# # ==============================
# # UPDATE PPKS
# # ==============================
# def update_ppks_service(id: str, data: dict):

#     supabase.table("ppks") \
#         .update({
#             "nama": data["nama"],
#             "kategori_ppks": data["kategori_ppks"],
#             "lokasi_penemuan": data["lokasi_penemuan"],
#             "tgl_laporan": data["tgl_laporan"],
#             "status": data["status"],
#             "detail": data["detail"]
#         }) \
#         .eq("id", id) \
#         .execute()

#     return {
#         "message": "PPKS berhasil diupdate"
#     }


# # ==============================
# # DELETE PPKS
# # ==============================
# def delete_ppks_service(id: str):

#     supabase.table("ppks") \
#         .delete() \
#         .eq("id", id) \
#         .execute()

#     return {
#         "message": "PPKS berhasil dihapus"
#     }