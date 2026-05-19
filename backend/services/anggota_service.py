from config.database import supabase
from schemas.anggota_schema import Anggota

# def create_anggota_keluarga(data: Anggota):

#     result = supabase.table("anggota_keluarga").insert({
#         "nik": data.nik,
#         "no_kk": data.no_kk,
#         "nama_anggota_keluarga": data.nama_anggota_keluarga,
#         "hubungan_keluarga": data.hubungan_keluarga,
#         "jenis_kelamin": data.jenis_kelamin,
#         "tanggal_lahir": data.tanggal_lahir,
#         "status_keadaan": data.status_keadaan,
#         "kondisi_khusus": data.kondisi_khusus
#     }).execute()

#     return result.data


def create_anggota_keluarga(no_kk: str, data:Anggota):

    payload = data.model_dump()

    payload["no_kk"] = no_kk

    result = supabase.table("anggota_keluarga") \
        .insert(payload) \
        .execute()

    return result.data


def get_anggota_keluarga(no_kk: str):

    res = supabase.table("anggota_keluarga") \
        .select("*") \
        .eq("no_kk", no_kk) \
        .execute()

    return res.data


def update_kondisi_khusus(id: int, data):

    result = supabase.table("anggota_keluarga") \
        .update({
            "kondisi_khusus": data.kondisi_khusus
        }) \
        .eq("id", id) \
        .execute()

    return result.data