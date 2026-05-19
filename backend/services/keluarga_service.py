from config.database import supabase
from schemas.keluarga_schema import Keluarga

# buat/simpan data keluarga saja
# def create_keluarga(id: str, data:Keluarga):
#     data_dict = data.dict()
#     payload = {
#         "no_kk": data_dict.get("no_kk"),
#         "user_id": id,
#         "skor_pmt": data_dict.get("skor_pmt"),
#         "tanggal_hitung_desil": data_dict.get("tanggal_hitung_desil"),
#         "nama_kepala_keluarga": data_dict.get("nama_kepala_keluarga"),
#         "alamat": data_dict.get("alamat"),
#         "kecamatan": data_dict.get("kecamatan"),
#         "kabupaten": data_dict.get("kabupaten"),
#         "jenis_kelamin": data_dict.get("jenis_kelamin"),
#         "tanggal_lahir": data_dict.get("tanggal_lahir"),
#         "desil": data_dict.get("desil")
#     }

#     result = supabase.table("keluarga").insert(payload).execute()
#     return result.data


# def create_keluarga(data: Keluarga):

#     data_dict = data.model_dump(mode="json")
#     # Exclude 'id' dan filter None values
#     payload = {k: v for k, v in data_dict.items() if v is not None and k != "id"}

#     result = supabase.table("keluarga") \
#         .insert(payload) \
#         .execute()

#     return result.data

# def create_anggota_keluarga(id: str, data: Keluarga):
#     payload = {
#         "user_id": id, 
#         "nik" : data.get("nik"),
#         "keluarga_id": data.get("keluarga_id"),
#         "pekerjaan": data.get("pekerjaan"),
#         "nama_anggota_keluarga": data.get("nama_anggota_keluarga"),
#         "tempat_tanggal_lahir": data.get("tempat_tanggal_lahir"),
#         "hubunga_keluarga": data.get("hubungan_keluarga"),
#         "jenis_kelamin": data.get("jenis_kelamin"),
#         "status_keadaan": data.get("status_keadaaan"),
#         "status_kehamilan": data.get("status_kehamilan"),

#         "kategori_disabilitas": data.get("katgeori_disabilitas"),
#         "penyakit_kronis": data.get("penyakit_kronis"),
#         "lokasi_penemuan": data.get("lokasi_penemuan"),
#         "tanggal_laporan": data.get("tanggal_laporan"),
#         "kategori_ppks": data.get("kategori_ppks"),
#         "status_penangangan": data.get("status_penanganan"),

#         "alamat":data.get("alamat")

#     }

#     result = supabase.table("anggota_keluarga").insert(payload).execute()

#     return result.data



# =========================================
# CREATE KELUARGA
# =========================================
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
    # KE TABEL anggota_keluarga
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
def get_keluarga():

    result = supabase.table("keluarga") \
        .select("*") \
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
# CREATE ANGGOTA KELUARGA
# =========================================
def create_anggota_keluarga(no_kk: str, data):

    data_dict = data.model_dump(mode="json")

    payload = {

        "nik":
            data_dict.get("nik"),

        "no_kk":
            no_kk,

        "nama_anggota_keluarga":
            data_dict.get("nama_anggota_keluarga"),

        "hubungan_keluarga":
            data_dict.get("hubungan_keluarga"),

        "jenis_kelamin":
            data_dict.get("jenis_kelamin"),

        "tanggal_lahir":
            data_dict.get("tanggal_lahir"),

        "status_keadaan":
            data_dict.get("status_keadaan"),

        "kondisi_khusus":
            data_dict.get("kondisi_khusus")
    }

    result = supabase.table("anggota_keluarga") \
        .insert(payload) \
        .execute()

    return result.data


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





















# def create_keluarga(data: Keluarga):

#     data_dict = data.model_dump(mode="json")

#     # Exclude 'id' dan filter None values
#     payload = {
#         k: v for k, v in data_dict.items()
#         if v is not None and k != "id"
#     }

#     # ============================
#     # 1. INSERT KE TABEL KELUARGA
#     # ============================
#     result = supabase.table("keluarga") \
#         .insert(payload) \
#         .execute()

#     # ambil data yang baru dibuat
#     created = result.data[0] if result.data else None

#     if not created:
#         return {"error": "Gagal membuat keluarga"}

#     no_kk = created["no_kk"]

#     # ============================
#     # 2. AUTO INSERT KE ANGGOTA
#     # (kepala keluarga otomatis)
#     # ============================
#     supabase.table("anggota_keluarga").insert({
#         "nik": data_dict.get("nik"),
#         "no_kk": no_kk,
#         "nama_anggota_keluarga": data_dict.get("nama_kepala_keluarga"),
#         "hubungan_keluarga": "Kepala Keluarga",
#         "jenis_kelamin": data_dict.get("jenis_kelamin"),
#         "tanggal_lahir": data_dict.get("tanggal_lahir"),
#         "status_keadaan": data_dict.get("status_keadaan"),
#         "kondisi_khusus": data_dict.get("kondisi_khusus") 
#     }).execute()

#     return {
#         "message": "Keluarga dan anggota berhasil dibuat",
#         "data": created
#     }

# # Ambil keluarga
# def get_keluarga():
#     result = supabase.table("keluarga") \
#         .select("*") \
#         .execute()

#     return result.data

# # Ambil anggota kelurag
# # def get_anggota_keluarga(id: str):
# #     result = supabase.table("keluarga") \
# #         .select("*, anggota_keluarga(*)") \
# #         .eq("id", id) \
# #         .execute()
    
# #     return  result.data

# # Update keluarga
# def update_keluarga(id: str, data: dict):
#     result = supabase.table("keluarga") \
#         .update(data) \
#         .eq("id", id) \
#         .execute()

#     return result.data

# # Hapus anggota keluarga
# def delete_anggota_keluarga(id: str):
#     result = supabase.table("anggota_keluarga") \
#         .delete() \
#         .eq("id", id) \
#         .execute()

#     return result.data