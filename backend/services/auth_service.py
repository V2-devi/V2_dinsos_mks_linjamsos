from config.auth import sign_in
from services.profile_service import insert_user_profile, update_user_profile, get_user_by_email
from config.database import supabase

# =========================================================
# REGISTER
# =========================================================
def register_user(data):

    try:

        existing = get_user_by_email(data.email)

        if existing and existing.data:
            return {
                "error": "Email sudah terdaftar"
            }

        # ====================================
        # REGISTER KE AUTH
        # ====================================
        auth = supabase.auth.sign_up({

            "email": data.email,

            "password": data.password,

            "options": {

                "data": {
                    "role": data.role,
                },

                "email_redirect_to":
                "http://localhost:5173/verify"

            }
        })

        print(auth)
        print(auth.user)

        user = auth.user

        if not user:
            return {
                "error": "Gagal register"
            }

        # ====================================
        # INSERT PROFILE KE TABEL PENGGUNA
        # ====================================
        insert_user_profile({

            "id": str(user.id),

            "email": data.email,

            "nama_lengkap": data.nama_lengkap,

            "nik": data.nik,

            "nip": data.nip,

            "role": data.role,

            "no_hp": data.no_hp,

            "alamat": data.alamat

        })

        return {
            "message":
            "Register berhasil, cek email verifikasi"
        }

    except Exception as e:

        return {
            "error": str(e)
        }

# =========================================================
# LOGIN
# =========================================================
def login_user(data):
    try:

        # =====================================
        # LOGIN AUTH
        # =====================================
        auth = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })

        # =====================================
        # CEK SESSION
        # =====================================
        if not auth.session:
            return {
                "error": "Login gagal"
            }

        auth_user = auth.user

        # =====================================
        # CEK EMAIL VERIFIED
        # =====================================
        if not auth_user.email_confirmed_at:
            return {
                "error": "Email belum diverifikasi"
            }

        # =====================================
        # AMBIL PROFILE PENGGUNA
        # =====================================
        profile = supabase.table("pengguna") \
            .select("*") \
            .eq("email", data.email) \
            .execute()

        # DEBUG
        print("PROFILE:", profile.data)

        # =====================================
        # JIKA PROFILE BELUM ADA
        # =====================================
        if not profile.data:

            insert_user_profile({

                "id": str(auth_user.id),

                "email": auth_user.email,

                "nama_lengkap": auth_user.user_metadata.get("nama_lengkap"),

                "nik": auth_user.user_metadata.get("nik"),

                "nip": auth_user.user_metadata.get("nip"),

                "role": auth_user.user_metadata.get("role"),

                "alamat": auth_user.user_metadata.get("alamat"),

                "no_hp": auth_user.user_metadata.get("no_hp"),

                "status": "menunggu",

                "is_active": False
            })

            # ambil ulang
            profile = supabase.table("pengguna") \
                .select("*") \
                .eq("email", data.email) \
                .execute()

        # =====================================
        # AMBIL USER
        # =====================================
        user = profile.data[0]

        print("USER:", user)

        # =====================================
        # CEK APPROVAL ADMIN
        # =====================================
        if user["is_active"] is not True:

            return {
                "error": "Akun belum disetujui admin"
            }

        # =====================================
        # LOGIN BERHASIL
        # =====================================
        return {

            "access_token": auth.session.access_token,

            "refresh_token": auth.session.refresh_token,

            "user": user
        }

    except Exception as e:

        print("LOGIN ERROR:", str(e))

        return {
            "error": str(e)
        }


# =========================================================
# APPROVE USER OLEH ADMIN
# =========================================================
def approve_user(user_id):
    result = supabase.table("pengguna") \
        .update({

        "is_active": True,
        "status": "disetujui"
        }) \
        .eq("id", str(user_id)) \
        .execute()

    return result.data