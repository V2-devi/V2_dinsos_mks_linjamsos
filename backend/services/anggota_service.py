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

def update_anggota(no_kk: str, anggota_id: int, data):
    data_dict = data.model_dump(mode="json", exclude_unset=True)
    print(f"\n🔍 DATA DITERIMA: {data_dict}")

    # 🔍 CEK APA BACKEND MENERIMA FLAT FIELDS ATAU JSON
    # Kita extract flat fields untuk dikirim ke Supabase
    payload = {
        "nik": data_dict.get("nik"),
        "nama_anggota_keluarga": data_dict.get("nama_anggota_keluarga"),
        "hubungan_keluarga": data_dict.get("hubungan_keluarga"),
        "jenis_kelamin": data_dict.get("jenis_kelamin"),
        "tanggal_lahir": data_dict.get("tanggal_lahir"),
        "status_keadaan": data_dict.get("status_keadaan"),
    }

    # ✅ TAMBAHKAN FIELD KONDISI KHUSUS (JANGAN JADI OBJECT JSON KECUALI DB ANDA JSONB)
    payload.update({
        "hamil": data_dict.get("hamil", "Tidak Sedang Hamil"),
        "disabilitas": data_dict.get("disabilitas", "Tidak Ada Disabilitas"),
        "penyakit": data_dict.get("penyakit", "")
    })

    # 🧼 HAPUS None AGAR TIDAK OVERWRITE JADI NULL DI DB
    clean_payload = {k: v for k, v in payload.items() if v is not None}
    print(f"📦 PAYLOAD CLEAN: {clean_payload}")

    # 🔒 UPDATE DENGAN VALIDASI NO_KK (CEGAH UPDATE DATA SALAH)
    result = supabase.table("anggota_keluarga") \
        .update(clean_payload) \
        .eq("id", anggota_id) \
        .eq("no_kk", no_kk) \
        .execute()

    if not result.data or len(result.data) == 0:
        raise ValueError("ID Anggota atau No KK tidak cocok di database.")

    print(f"✅ SUPABASE RETURN: {result.data[0]}")
    return result.data[0]


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