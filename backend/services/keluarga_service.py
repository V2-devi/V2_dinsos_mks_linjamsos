from config.database import supabase

# buat/simpan data keluarga saja
def create_keluarga(id: str, data:dict):
    payload = {
        "no_kk": data.get("no_kk"),
        "user_id": id,
        "skor_pmt": data.get("skor_pmt"),
        "tanggal_hitung_desil": data.get("tanggal_hitung_desil"),
        "nama_kepala_keluarga": data.get("nama_kepala_keluarga"),
        "alamat_keluarga": data.get("alamat_keluarga"),
        "kecamatan": data.get("kecamatan"),
        "kabupaten": data.get("kapubaten")
        
    }

    result = supabase.table("keluarga").insert(payload).execute()
    return result.data

def create_anggota_keluarga(id: str, data: dict):
    payload = {
        "user_id": id, 
        "nik" : data.get("nik"),
        "keluarga_id": data.get("keluarga_id"),
        "pekerjaan": data.get("pekerjaan"),
        "nama_anggota_keluarga": data.get("nama_anggota_keluarga"),
        "tempat_tanggal_lahir": data.get("tempat_tanggal_lahir"),
        "hubunga_keluarga": data.get("hubungan_keluarga"),
        "jenis_kelamin": data.get("jenis_kelamin"),
        "status_keadaan": data.get("status_keadaaan"),
        "status_kehamilan": data.get("status_kehamilan"),

        "kategori_disabilitas": data.get("katgeori_disabilitas"),
        "penyakit_kronis": data.get("penyakit_kronis"),
        "lokasi_penemuan": data.get("lokasi_penemuan"),
        "tanggal_laporan": data.get("tanggal_laporan"),
        "kategori_ppks": data.get("kategori_ppks"),
        "status_penangangan": data.get("status_penanganan")

    }

    result = supabase.table("anggota_keluarga").insert(payload).execute()

    return result.data

# Ambil keluarga
def get_keluarga(id: str):
    result = supabase.table("keluarga") \
        .select("*") \
        .eq("id", id) \
        .execute()

    return result.data

# Ambil anggota kelurag
def get_anggota_keluarga(id: str):
    result = supabase.table("keluarga") \
        .select("*, anggota_keluarga(*)") \
        .eq("id", id) \
        .execute()
    
    return  result.data

# Update keluarga
def update_keluarga(id: str, data: dict):
    result = supabase.table("keluarga") \
        .update(data) \
        .eq("id", id) \
        .execute()

    return result.data

# Hapus anggota keluarga
def delete_anggota_keluarga(id: str):
    result = supabase.table("anggota_keluarga") \
        .delete() \
        .eq("id", id) \
        .execute()

    return result.data