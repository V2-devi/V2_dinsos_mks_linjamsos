from config.database import supabase
from schemas.bansos_schema import PengusulanCreate
# from fastapi import HTTPException
# import datetime

# services/bansos_service.py


def create_pengusulan(data: PengusulanCreate):

    result = supabase.table("pengusulan_bansos").insert({
        "no_kk": data.no_kk,
        "tanggal_usulan": data.tanggal_usulan,
        "penginput": data.penginput,
        "catatan_verifikator_bansos": data.catatan_verifikator_bansos,
        "alamat": data.alamat,
        "kecamatan": data.kecamatan,
        "kelurahan": data.kelurahan,
        "nik": data.nik,
        "status_pengusulan": "Belum",
        "nama_lengkap": data.nama_lengkap,
        "jenis_bansos": data.jenis_bansos,
    }).execute()

    return result.data


def get_pengusulan_service():

    res = supabase.table("pengusulan_bansos") \
        .select("""
         
            no_kk,
       
            tanggal_usulan,
            status_pengusulan,
            penginput,
            catatan_verifikator_bansos,
            alamat,
            kecamatan,
            kelurahan,
            nik,
            nama_lengkap,
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
            "nama_lengkap": item["nama_lengkap"],  # mapping di sini
            "tanggal_usulan": item["tanggal_usulan"],
            "status_pengusulan": item["status_pengusulan"],
            "jenis_bansos": item["jenis_bansos"],

            "alamat": item.get("keluarga", {}).get("alamat"),
            "kecamatan": item.get("keluarga", {}).get("kecamatan"),
            "kelurahan": item.get("keluarga", {}).get("kelurahan"),
            # "alamat": item["keluarga"]["alamat"] if item.get("keluarga") else None,
            # "kecamatan": item["keluarga"]["kecamatan"] if item.get("keluarga") else None,
            # "kelurahan": item["keluarga"]["kelurahan"] if item.get("keluarga") else None,
            
        })

    return data



def approve_pengusulan_service(id: str):
    # ambil data pengusulan
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
    supabase.table("penerima_bansos").insert({
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












# def get_bantuan():
#     result = supabase.table("bantuan_sosial") \
#         .select("*") \
#         .execute()

#     return result.data

# def daftar_bantuan(keluarga_id: str, user_id: str, data: dict):
#     bantuan_id = data.get("bantuan_id")

#     if not bantuan_id:
#         raise HTTPException(status_code=400, detail="bantuan_id wajib diisi")

#     # 🔐 validasi keluarga milik user
#     keluarga = supabase.table("keluarga") \
#         .select("id") \
#         .eq("id", keluarga_id) \
#         .eq("user_id", user_id) \
#         .single() \
#         .execute()

#     if not keluarga.data:
#         raise HTTPException(status_code=403, detail="Akses ditolak")

#     # 🚫 cek duplikasi
#     existing = supabase.table("transaksi_bantuan") \
#         .select("id") \
#         .eq("keluarga_id", keluarga_id) \
#         .eq("bantuan_id", bantuan_id) \
#         .execute()

#     if existing.data:
#         raise HTTPException(status_code=400, detail="Sudah pernah mendaftar bantuan ini")

#     # 💾 insert transaksi
#     payload = {
#         "keluarga_id": keluarga_id,
#         "bantuan_id": bantuan_id,
#         "status": "pending",
#         "tanggal_daftar": datetime.datetime.now().isoformat()
#     }

#     result = supabase.table("transaksi_bantuan") \
#         .insert(payload) \
#         .execute()

#     return result.data

# def get_bantuan_keluarga(keluarga_id: str):
#     result = supabase.table("transaksi_bantuan") \
#         .select("*, bantuan_sosial(*)") \
#         .eq("keluarga_id", keluarga_id) \
#         .execute()

#     return result.data


# def verifikasi_bantuan(transaksi_id: str, data: dict):
#     status = data.get("status")

#     if status not in ["diterima", "ditolak"]:
#         raise HTTPException(status_code=400, detail="Status harus 'diterima' atau 'ditolak'")

#     payload = {
#         "status": status,
#         "tanggal_verifikasi": datetime.datetime.now().isoformat(),
#         "catatan": data.get("catatan", "-")
#     }

#     result = supabase.table("transaksi_bantuan") \
#         .update(payload) \
#         .eq("id", transaksi_id) \
#         .execute()

#     return result.data











# from config.database import supabase
# import datetime

# def create_bansos(id: str, data: list):
#     payload = {
#         "nama_pengusul": data.get("nama_pengusul"),
#         "tanggal_usulan": datetime.now().isoformat(), 
#         "status_pengusulan": data.get("status_pengusulan", "Menunggu"), # Nilai default
#         "penginput": id, 
#         "catatan_verifikator": data.get("catatan_verifikator", "-"),
#         "no_kk": str(data.get("no_kk")), 
#         "nama_penerima_bantuan": data.get("nama_penerima_bantuan"),
#         "jenis_bantuan_sosial": data.get("jenis_bantuan_sosial"), # Bisa ID jika pakai tabel master
#         "status_penyaluran": data.get("status_penyaluran", "Belum Disalurkan")
#     }

#     result = supabase.table("bantuan_sosial").insert(payload).execute()
#     return result.data

# def get_bansos(id: str):
#     result = supabase.table("bantuan_sosial") \
#         .select("*") \
#         .eq("id", id) \
#         .execute()
#     return result.data

# def update_bansos(id: str, data:list):
#     result = supabase.table("bantuan_sosial") \
#         .update(data) \
#         .eq("id", id) \
#         .execute()
    
#     return result.data

# def delete_bansos(id: str):
#     result = supabase.table("bantuan_sosial") \
#         .delete() \
#         .eq("id", id) \
#         .execute()
#     return result.data