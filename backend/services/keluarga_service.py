from config.database import supabase
from schemas.keluarga_schema import Keluarga
from schemas.anggota_schema import Anggota

# =========================================
# CREATE KELUARGA
# =========================================
from datetime import datetime


def create_keluarga(data: Keluarga):

    # convert pydantic -> dict
    data_dict = data.model_dump(mode="json")

    # =====================================
    # PAYLOAD KELUARGA
    # =====================================
    payload = {
        k: v for k, v in data_dict.items()
        if v is not None and k != "id"
    }
    print(data_dict)

    # =====================================
    # FIX DEFAULT VALUE
    # =====================================

    # tanggal hitung wajib ada
    payload["tanggal_hitung_desil"] = datetime.now().isoformat()

    # default skor PMT
    payload["skor_pmt"] = 0

    # default desil
    payload["hasil_desil"] = "Belum Dihitung"

    # =====================================
    # DEBUG
    # =====================================
    print("PAYLOAD KELUARGA:")
    print(payload)

    # =====================================
    # 1. INSERT KE TABEL KELUARGA
    # =====================================
    result = supabase.table("keluarga") \
        .insert(payload) \
        .execute()

    # =====================================
    # VALIDASI HASIL INSERT
    # =====================================
    created = result.data[0] if result.data else None

    if not created:
        return {
            "error": "Gagal membuat keluarga"
        }

    # =====================================
    # AMBIL NO KK
    # =====================================
    no_kk = created["no_kk"]

    # =====================================
    # 2. AUTO INSERT KEPALA KELUARGA
    # =====================================
    supabase.table("anggota_keluarga").insert({

        "nik":
            data_dict.get("nik"),

        "no_kk":
            no_kk,

        "nama_anggota_keluarga":
            data_dict.get("nama_kepala_keluarga"),

        "hubungan_keluarga":
            "Kepala Keluarga",

        "jenis_kelamin":
            data_dict.get("jenis_kelamin"),

        "tanggal_lahir":
            data_dict.get("tanggal_lahir"),

        # DEFAULT
        "status_keadaan":
            "Hidup",

        # OPSIONAL
        "kondisi_khusus":
            None

    }).execute()

    # =====================================
    # RESPONSE
    # =====================================
    return {
        "message": "Keluarga dan anggota berhasil dibuat",
        "data": created
    }

# =========================================
# GET SEMUA KELUARGA
# =========================================
# def get_keluarga():

#     result = (
#         supabase
#         .table("keluarga")
#         .select("""
#             *,
#             anggota:anggota_keluarga(*)
#         """)
#         .execute()
#     )

#     return result.data


# def get_keluarga():
#     result = supabase.table("keluarga") \
#         .select("*, anggota_keluarga(*)") \
#         .execute()

#     return result.data

def get_keluarga():

    result = (
        supabase
        .table("keluarga")
        .select("""
            *,
                anggota_keluarga(
                id,
                nik,
                no_kk,
                nama_anggota_keluarga,
                hubungan_keluarga,
                jenis_kelamin,
                tanggal_lahir,
                status_keadaan,
                kondisi_khusus
            )
        """)
        .execute()
    )

    return result.data

# =========================================
# GET ANGGOTA BERDASARKAN NO KK
# =========================================
# def get_anggota_keluarga(no_kk: str):

#     result = supabase.table("anggota_keluarga") \
#         .select("*") \
#         .eq("no_kk", no_kk) \
#         .execute()

#     return result.data




# # =========================================
# # CREATE ANGGOTA KELUARGA
# # =========================================
# def create_anggota_keluarga(no_kk: str, data: Anggota):

#     data_dict = data.model_dump(mode="json")

#     payload = {

#         # pastikan numeric/string valid
#         "nik":
#             str(data_dict.get("nik"))
#             if data_dict.get("nik")
#             else None,

#         "no_kk":
#             str(no_kk),

#         "nama_anggota_keluarga":
#             data_dict.get("nama_anggota_keluarga"),

#         "hubungan_keluarga":
#             data_dict.get("hubungan_keluarga"),

#         "jenis_kelamin":
#             data_dict.get("jenis_kelamin"),

#         "tanggal_lahir":
#             data_dict.get("tanggal_lahir"),

#         "status_keadaan":
#             data_dict.get("status_keadaan"),

#         "kondisi_khusus":
#             data_dict.get("kondisi_khusus")
#     }

#     print("PAYLOAD ANGGOTA:", payload)

#     result = supabase.table("anggota_keluarga") \
#         .insert(payload) \
#         .execute()

#     return result.data






# =========================================
# UPDATE KELUARGA
# =========================================
def update_keluarga(id: str, data: dict):

    result = supabase.table("keluarga") \
        .update(data) \
        .eq("id", id) \
        .execute()

    return result.data






# =========================================
# DELETE ANGGOTA KELUARGA
# =========================================
def delete_anggota_keluarga(id: str):

    result = supabase.table("anggota_keluarga") \
        .delete() \
        .eq("id", id) \
        .execute()

    return result.data



def update_desil(no_kk: str, data):

    payload = data.model_dump(exclude_none=True)

    print("UPDATE DESIL:")
    print(payload)

    result = supabase.table("keluarga") \
        .update(payload) \
        .eq("no_kk", no_kk) \
        .execute()

    return result.data






