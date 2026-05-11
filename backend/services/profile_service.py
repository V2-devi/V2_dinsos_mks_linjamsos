from config.database import supabase
from uuid import UUID
# from schemas.profile_schema import ProfileSchema

# def save_profile_service(user_id: UUID, data: ProfileSchema):
#     result = supabase.table("pengguna").upsert({
#         "id": str(user_id),

#         "status": "menunggu",
#         "is_active": False,


#         "nama_lengkap": data.get("nama_lengkap"),
#         "status_pegawai": data.get("status_pegawai"),
#         "nik": data.get("nik"),
#         "nip": data.get("nik"),
#         "email": data.get("email"),
#         "no_hp": data.get("no_hp"),
#         "alamat": data.get("alamat"),
#         "role": data.get("role"),
#         "instansi": data.get("instansi"),
#         "alamat_instansi": data.get("alamat_instansi"),
#         "nama_kepala_dinas": data.get("kepala_dinas"),
#         "nip_kepala_dinas": data.get("nip_kepala_dinas")

#     }).execute()

#     return result.data

# =========================================================
# GET PROFILE
# =========================================================
def get_profile_service(user_id: UUID):

    result = supabase.table("pengguna") \
        .select("""
            id,
            nama_lengkap,
            nik,
            nip,
            email,
            no_hp,
            alamat,
            role,
            status,
            is_active
        """) \
        .eq("id", str(user_id)) \
        .single() \
        .execute()

    return result.data
# =========================================================
# INSERT USER PROFILE
# =========================================================
def insert_user_profile(data: dict):

    result = supabase.table("pengguna") \
        .insert({

            "id": data["id"],

            "email": data["email"],

            "nama_lengkap": data.get("nama_lengkap"),

            "nik": data.get("nik"),

            "nip": data.get("nip"),

            "role": data.get("role"),

            "status": data.get("status", "menunggu"),

            "is_active": data.get("is_active", False),

            "alamat": data.get("alamat"),

            "no_hp": data.get("no_hp")
        }) \
        .execute()

    return result.data

def get_all_users():
    # print("AMBIL DATA USER...")
    
    res = supabase.table("pengguna").select("*").execute()
    
    # print("HASIL:", res)
    
    return res

def get_user_profile(user_id: UUID):
    return supabase.table("pengguna") \
        .select("*") \
        .eq("id", str(user_id)) \
        .single() \
        .execute() \

# =========================================================
# GET USER BY EMAIL
# =========================================================
def get_user_by_email(email):

    result = supabase.table("pengguna") \
        .select("*") \
        .eq("email", email) \
        .execute()

    return result

       

# =========================================================
# UPDATE USER PROFILE
# =========================================================
def update_user_profile(user_id: UUID, data: dict):

    result = supabase.table("pengguna") \
        .update(data) \
        .eq("id", str(user_id)) \
        .execute()

    return result.data



def create_staff(data):

    try:
        # =========================
        # BUAT USER AUTH
        # =========================
        auth_user = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True
        })
        user = auth_user.user
        # =========================
        # INSERT KE TABEL PENGGUNA
        # =========================
        result = supabase.table("pengguna").insert({
            "id": str(user.id),
            "email": data.email,
            "nama_lengkap": data.nama_lengkap,
            "nik": data.nik,
            "nip": data.nip,
            "role": data.role,
            "alamat": data.alamat,
            "no_hp": data.no_hp,
            "status": "disetujui",
            "is_active": True
        }).execute()
        return result.data
    except Exception as e:
        return {
            "error": str(e)
        }