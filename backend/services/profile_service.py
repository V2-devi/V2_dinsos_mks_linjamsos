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

    try:
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
                instansi,
                alamat_instansi,
                nama_kepala_dinas,
                nip_kepala_dinas,
                is_active
            """) \
            .eq("id", str(user_id)) \
            .single() \
            .execute()

        if not result.data:
            return None

        return result.data

    except Exception as e:
        print(f"GET PROFILE ERROR: {str(e)}")
        return None
# =========================================================
# INSERT USER PROFILE
# =========================================================
def insert_user_profile(data):

    try:
        payload = {
            "id": str(data["id"]),
            "email": data["email"],
            "nama_lengkap": data.get("nama_lengkap"),
            "nik": data.get("nik"),
            "nip": data.get("nip"),
            "role": data.get("role"),
            "no_hp": data.get("no_hp"),
            "alamat": data.get("alamat"),
            "instansi": data.get("instansi"),
            "alamat_instansi": data.get("alamat_instansi"),
            "nama_kepala_dinas": data.get("nama_kepala_dinas"),
            "nip_kepala_dinas": data.get("nip_kepala_dinas"),
            "status": data.get("status", "menunggu"),
            "is_active": data.get("is_active", False)
        }

        print("INSERT PAYLOAD:", payload)

        result = supabase.table("pengguna").insert(payload).execute()

        print("INSERT RESULT:", result.data)

        if not result.data:
            return {
                "error": "Gagal menyimpan profile pengguna"
            }

        return result.data

    except Exception as e:
        print("INSERT PROFILE ERROR:", str(e))
        return {
            "error": str(e)
        }

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


# def update_user_profile(user_id: UUID, data:dict):
def update_user_profile(user_id: UUID, data):

    try:

        clean_user_id = str(user_id).strip()

        print("USER ID:", clean_user_id)
        print("DATA MASUK:", data)

        if hasattr(data, "dict"):
            payload = data.dict(exclude_unset=True)
        elif isinstance(data, dict):
            payload = {k: v for k, v in data.items() if v is not None}
        else:
            payload = dict(data)

        # Jangan update primary key
        payload.pop("id", None)

        # Hilangkan field kosong yang tidak sengaja dikirim
        payload = {k: v for k, v in payload.items() if v is not None}

        print("UPDATE PAYLOAD:", payload)

        if not payload:
            return {"error": "Tidak ada data profile yang diupdate"}

        result = supabase.table("pengguna") \
            .update(payload) \
            .eq("id", clean_user_id) \
            .select("*") \
            .execute()

        print("UPDATE RESULT:", result.data)

        if not result.data:
            return {"error": "Update profile gagal atau tidak ada perubahan"}

        return result.data

    except Exception as e:

        print("ERROR:", str(e))

        return {"error": str(e)}

# def update_user_profile(
#     user_id: UUID,
#     data
# ):

#     try:

#         # =====================================
#         # CLEAN USER ID
#         # =====================================
#         clean_user_id = str(user_id).strip()

#         print("USER ID:", clean_user_id)

#         # =====================================
#         # CEK USER DULU
#         # =====================================
#         check_user = supabase.table("pengguna") \
#             .select("*") \
#             .eq("id", clean_user_id) \
#             .execute()

#         print("CHECK USER:", check_user.data)

#         # =====================================
#         # USER TIDAK ADA
#         # =====================================
#         if not check_user.data:
#             return {
#                 "error": "User tidak ditemukan"
#             }

#         # =====================================
#         # CONVERT SCHEMA → DICT
#         # =====================================
#         if hasattr(data, "dict"):
#             payload = data.dict(exclude_unset=True)
#         elif isinstance(data, dict):
#             payload = {k: v for k, v in data.items() if v is not None}
#         else:
#             payload = dict(data)

#         # Remove id from payload to avoid primary key update
#         payload.pop("id", None)

#         # Remove empty strings for fields that should not be updated unintentionally
#         payload = {k: v for k, v in payload.items() if v is not None}

#         print("PAYLOAD:", payload)

#         if not payload:
#             return {
#                 "error": "Tidak ada data profile yang diupdate"
#             }

#         # =====================================
#         # UPDATE
#         # =====================================
#         result = supabase.table("pengguna") \
#             .update(payload) \
#             .eq("id", clean_user_id) \
#             .select("*") \
#             .execute()

#         print("UPDATE RESULT:", result.data)

#         if not result.data:
#             return {
#                 "error": "Update profile gagal"
#             }

#         return result.data

#     except Exception as e:
#         print("UPDATE ERROR:", str(e))
#         return {
#             "error": str(e)
#         }



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