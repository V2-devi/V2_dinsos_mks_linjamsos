from config.database import supabase

def save_profile_service(user_id: str, data: dict):
    result = supabase.table("profiles").upsert({
        "id": user_id,
        "nama_lengkap": data.get("nama_lengkap"),
        "status_pegawai": data.get("status_pegawai"),
        "nik": data.get("nik"),
        "nip": data.get("nik"),
        "email": data.get("email"),
        "no_hp": data.get("no_hp"),
        "alamat": data.get("alamat"),
        "role": data.get("role"),
        "instansi": data.get("instansi"),
        "alamat_instansi": data.get("alamat_instansi"),
        "nama_kepala_dinas": data.get("kepala_dinas"),
        "nip_kepala_dinas": data.get("nip_kepala_dinas")

    }).execute()

    return result.data


def get_profile_service(user_id: str):
    result = supabase.table("profiles") \
        .select("id, nama_lengkap, nik, nip, email, no_hp, alamat, role, instansi, alamat_instansi, nama_kepala_dinas, nip_kepala dinas") \
        .eq("id", user_id) \
        .single() \
        .execute()

    return result.data