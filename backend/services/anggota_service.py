from config.database import supabase
from schemas.anggota_schema import Anggota




def create_anggota_keluarga(no_kk: str, data: Anggota):

    # 1. convert Pydantic → JSON safe
    data_dict = data.model_dump(mode="json")

    # 2. build payload (AMAN + CLEAN)
    payload = {
        "nik": str(data_dict.get("nik")) if data_dict.get("nik") else None,
        "no_kk": no_kk,
        "nama_anggota_keluarga": data_dict.get("nama_anggota_keluarga"),
        "hubungan_keluarga": data_dict.get("hubungan_keluarga"),
        "jenis_kelamin": data_dict.get("jenis_kelamin"),
        "tanggal_lahir": data_dict.get("tanggal_lahir"),
        "status_keadaan": data_dict.get("status_keadaan"),
        "kondisi_khusus": data_dict.get("kondisi_khusus")
    }

    # 3. DEBUG (WAJIB SEMENTARA)
    print("PAYLOAD ANGGOTA:", payload)

    # 4. INSERT KE SUPABASE
    result = supabase.table("anggota_keluarga") \
        .insert(payload) \
        .execute()

    return result.data
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