from config.database import supabase
from schemas.bansos_schema import PengusulanCreate

def create_pengusulan(data: PengusulanCreate):

    result = supabase.table("pengusulan_bansos").insert({
        "no_kk": data.no_kk,
        "tanggal_usulan": data.tanggal_usulan,
        "catatan_verifikator_bansos": data.catatan_verifikator_bansos,
        "alamat": data.alamat,
        "kecamatan": data.kecamatan,
        "kelurahan": data.kelurahan,
        "nik": data.nik,
        "status_pengusulan": "Belum",
        "nama_kepala_keluarga": data.nama_kepala_keluarga,
        "jenis_bansos": data.jenis_bansos,
    }).execute()

    return result.data


def get_pengusulan_service():

    res = supabase.table("pengusulan_bansos") \
        .select("""
            id,
            no_kk,
            tanggal_usulan,
            status_pengusulan,
            catatan_verifikator_bansos,
            alamat,
            kecamatan,
            kelurahan,
            nik,
            nama_kepala_keluarga,
            jenis_bansos,
            keluarga (
                kecamatan,
                kelurahan,
                alamat
            )
        """) \
        .execute()
    

    data = []

    for item in res.data:
        data.append({
            "id": item["id"],
            "nama_kepala_keluarga": item.get("nama_kepala_keluarga") or item.get("nama_lengkap"),
            "nik": item.get("nik"),
            "no_kk": item.get("no_kk"),
            "tanggal_usulan": item["tanggal_usulan"],
            "status_pengusulan": item["status_pengusulan"],
            "jenis_bansos": item["jenis_bansos"],
            "alamat": item.get("keluarga", {}).get("alamat") or item.get("alamat"),
            "kecamatan": item.get("keluarga", {}).get("kecamatan") or item.get("kecamatan"),
            "kelurahan": item.get("keluarga", {}).get("kelurahan") or item.get("kelurahan"),
            
        })

    return data



def approve_pengusulan_service(id: str):
    res = supabase.table("pengusulan_bansos") \
        .select("*") \
        .eq("id", id) \
        .single() \
        .execute()

    item = res.data

    if not item:
        raise Exception("Data tidak ditemukan")

    # update status
    supabase.table("pengusulan_bansos") \
        .update({"status_pengusulan": "Layak"}) \
        .eq("id", id) \
        .execute()

    # insert ke penerima bansos
    supabase.table("pengusulan_bansos").insert({
        "no_kk": item["no_kk"],
        "jenis_bansos": item.get("jenis_bansos", "default")
    }).execute()

    return {"message": "Layak"}


def reject_pengusulan_service(id: str):
    supabase.table("pengusulan_bansos") \
        .update({"status_pengusulan": "Tidak Layak"}) \
        .eq("id", id) \
        .execute()

    return {"message": "Tidak Layak"}












