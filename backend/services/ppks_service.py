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




def upload_foto_ppks(file, file_name: str):
    """Upload foto ke Supabase Storage dan return public URL"""
    try:
        # Baca file sebagai bytes
        file_content = file.read()
        file_type = file.content_type
        
        # Upload ke bucket
        supabase.storage.from_(SUPABASE_BUCKET).upload(
            file_name,
            file_content,
            {"content-type": file_type}
        )
        
        # Dapatkan public URL
        public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(file_name)
        return public_url
        
    except Exception as e:
        print(f"❌ Upload error: {e}")
        raise Exception(f"Gagal upload foto: {str(e)}")










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