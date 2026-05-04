from config.database import supabase
from uuid import UUID

def save_profile_service(id: UUID, data: dict):
    result = supabase.table("pengguna").upsert({
        "id": id,

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


def get_profile_service(id: UUID):
    result = supabase.table("pengguna") \
        .select("id, nama_lengkap, nik, nip, email, no_hp, alamat, role, instansi, alamat_instansi, nama_kepala_dinas, nip_kepala_dinas") \
        .eq("id", id) \
        .single() \
        .execute()

    return result.data

def insert_user_profile(data):
    return supabase.table("pengguna").insert(data).execute()

# def get_all_users():
#     return supabase.table("pengguna").select("*").execute()

def get_all_users():
    # print("AMBIL DATA USER...")
    
    res = supabase.table("pengguna").select("*").execute()
    
    # print("HASIL:", res)
    
    return res

def get_user_profile(id):
    return supabase.table("pengguna") \
        .select("*") \
        .eq("id", id) \
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

       

def update_user_profile(id, data):
    return supabase.table("pengguna") \
        .update(data) \
        .eq("id", id) \
        .execute()