from config.database import supabase

def save_profile_service(user_id: str, data: dict):
    result = supabase.table("pengguna").upsert({
        "id": user_id,

        "status": "pending",
        "is_active": False,


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
    result = supabase.table("pengguna") \
        .select("id, nama_lengkap, nik, nip, email, no_hp, alamat, role, instansi, alamat_instansi, nama_kepala_dinas, nip_kepala_dinas") \
        .eq("id", user_id) \
        .single() \
        .execute()

    return result.data

def insert_user_profile(data):
    return supabase.table("pengguna").insert(data).execute()

def get_user_profile(user_id):
    return supabase.table("pengguna") \
        .select("*") \
        .eq("id", user_id) \
        .single() \
        .execute() \


def get_user_by_email(email):
    email = email.strip()


    # print("EMAIL LOGIN:", repr(email))

    res = supabase.table("pengguna") \
        .select("*") \
        .eq("email", email) \
        .execute()

    # print("QUERY RESULT:", res.data)


    if not res.data:
        return None

    return res.data[0]

       

def update_user_profile(user_id, data):
    return supabase.table("pengguna") \
        .update(data) \
        .eq("id", user_id) \
        .execute()