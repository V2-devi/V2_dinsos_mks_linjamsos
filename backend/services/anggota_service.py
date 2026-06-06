from config.database import supabase
from schemas.anggota_schema import Anggota




# 📂 backend/services/ppks_service.py
def create_anggota_keluarga(no_kk: str, data: Anggota):
    try:
        payload = {
            "no_kk": no_kk,
            "nik": str(data.nik),
            "nama_anggota_keluarga": data.nama_anggota_keluarga,
            "hubungan_keluarga": data.hubungan_keluarga,
            "jenis_kelamin": data.jenis_kelamin,
            "tanggal_lahir": data.tanggal_lahir,
            "status_keadaan": data.status_keadaan,
            "kondisi_khusus": data.kondisi_khusus,
        }
        
        result = supabase.table("anggota_keluarga").insert(payload).execute()
        
        # ✅ PASTIKAN RETURN OBJECT DATA LANGSUNG (bukan array/response wrapper)
        if result.data and len(result.data) > 0:
            return result.data[0]  # ← Return object { id: "...", nik: "..." }
        
        return None
        
    except Exception as e:
        print(f"❌ Service Error: {e}")
        raise e
    
# =========================================
# GET ANGGOTA BERDASARKAN NO KK
# =========================================
def get_anggota_keluarga(no_kk: str):

    result = supabase.table("anggota_keluarga") \
        .select("*") \
        .eq("no_kk", no_kk) \
        .execute()

    return result.data


# =========================================
# UPDATE ANGGOTA (FIXED & PRODUCTION READY)
# =========================================

# def update_anggota(no_kk: str, anggota_id: int, data):

#     data_dict = data.model_dump(
#         mode="json",
#         exclude_unset=True
#     )

#     print("DATA UPDATE:", data_dict)

#     payload = {
#         "nik": data_dict.get("nik"),
#         "nama_anggota_keluarga": data_dict.get("nama_anggota_keluarga"),
#         "hubungan_keluarga": data_dict.get("hubungan_keluarga"),
#         "jenis_kelamin": data_dict.get("jenis_kelamin"),
#         "tanggal_lahir": data_dict.get("tanggal_lahir"),
#         "status_keadaan": data_dict.get("status_keadaan"),

#         # ✅ INI YANG PENTING
#         "kondisi_khusus": data_dict.get("kondisi_khusus")
#     }

#     # hapus None
#     payload = {
#         k: v for k, v in payload.items()
#         if v is not None
#     }

#     print("PAYLOAD UPDATE:", payload)

#     result = supabase.table("anggota_keluarga") \
#         .update(payload) \
#         .eq("id", anggota_id) \
#         .eq("no_kk", no_kk) \
#         .execute()

#     print("HASIL UPDATE:", result.data)

#     return result.data



def update_anggota(no_kk: str, anggota_id: int, data):
    payload = data.model_dump(exclude_unset=True)
    
    res = supabase.table("anggota_keluarga") \
        .update(payload) \
        .eq("id", anggota_id) \
        .eq("no_kk", no_kk) \
        .select("*") \
        .execute()
    
    if not res.data:
        raise Exception("Tidak ada data yang diupdate")
    return res.data[0]


# =========================================
# UPDATE KONDISI KHUSUS
# =========================================
def update_kondisi_khusus(id: int, data):

    result = supabase.table("anggota_keluarga") \
        .update({
            "kondisi_khusus":
                data.kondisi_khusus
        }) \
        .eq("id", id) \
        .execute()

    return result.data

# ✅ Pastikan import supabase yang pakai SERVICE_ROLE_KEY
from config.database import supabase, SUPABASE_BUCKET_DOKUMEN

def upload_surat_kematian(no_kk: str, anggota_id: str, file):
    try:
        import os, re, time, uuid

        name, ext = os.path.splitext(file.filename or "surat.pdf")
        clean_name = re.sub(r'[^\w\-]', '_', name).strip('_-')[:50]
        timestamp = int(time.time() * 1000)
        unique_id = uuid.uuid4().hex[:8]
        safe_filename = f"surat_kematian/{no_kk}/{anggota_id}/{timestamp}-{unique_id}-{clean_name}{ext}"

        file_content = file.file.read()

        # ✅ Upload ke storage — pakai supabase yang SERVICE_ROLE_KEY
        supabase.storage.from_(SUPABASE_BUCKET_DOKUMEN).upload(
            safe_filename,
            file_content,
            {"content-type": file.content_type or "application/pdf"}
        )

        public_url = supabase.storage.from_(SUPABASE_BUCKET_DOKUMEN).get_public_url(safe_filename)

        # ✅ Update DB
        result = supabase.table("anggota_keluarga") \
            .update({"surat_kematian": public_url}) \
            .eq("id", anggota_id) \
            .execute()

        return public_url

    except Exception as e:
        raise Exception(f"Gagal upload surat kematian: {str(e)}")








# def create_anggota_keluarga(no_kk: str, data:Anggota):

#     payload = data.model_dump()

#     payload["no_kk"] = no_kk

#     result = supabase.table("anggota_keluarga") \
#         .insert(payload) \
#         .execute()

#     return result.data


# def get_anggota_keluarga(no_kk: str):

#     res = supabase.table("anggota_keluarga") \
#         .select("*") \
#         .eq("no_kk", no_kk) \
#         .execute()

#     return res.data


# def update_kondisi_khusus(id: int, data):

#     result = supabase.table("anggota_keluarga") \
#         .update({
#             "kondisi_khusus": data.kondisi_khusus
#         }) \
#         .eq("id", id) \
#         .execute()

#     return result.data