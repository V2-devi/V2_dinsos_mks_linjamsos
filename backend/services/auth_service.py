from config.auth import sign_in
from services.profile_service import insert_user_profile, update_user_profile, get_user_by_email
from config.database import supabase

# =========================================================
# REGISTER
# =========================================================
def register_user(data):

    try:

        # cek email sudah ada atau belum
        existing = get_user_by_email(data.email)

        if existing and existing.data:
            return {
                "error": "Email sudah terdaftar"
            }

        # register ke auth.users
        auth = supabase.auth.sign_up({

            "email": data.email,

            "password": data.password,

            "options": {

                # metadata user
                "data": {

                    "nama_lengkap": data.nama_lengkap,

                    "nik": data.nik,

                    "nip": data.nip,

                    "role": data.role,

                    "alamat": data.alamat,

                    "no_hp": data.no_hp
                },

                # redirect verifikasi email
                "email_redirect_to": "http://localhost:5173/verify"
            }
        })

        if not auth.user:

            return {
                "error": "Gagal register"
            }

        return {
            "message": "Register berhasil, silakan cek email verifikasi"
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

        # login auth
        auth = supabase.auth.sign_in_with_password({

            "email": data.email,

            "password": data.password
        })

        # cek session
        if not auth.session:

            return {
                "error": "Login gagal"
            }

        # cek email verification
        if not auth.user.email_confirmed_at:

            return {
                "error": "Email belum diverifikasi"
            }

        auth_user = auth.user

        # cek profile pengguna
        profile = get_user_by_email(data.email)

        # =================================================
        # JIKA PROFILE BELUM ADA -> INSERT OTOMATIS
        # =================================================
        if not profile or not profile.data:

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

            # ambil ulang profile
            profile = get_user_by_email(data.email)

        user = profile.data[0]

        # =================================================
        # CEK APPROVAL ADMIN
        # =================================================
        if not user.get("is_active"):

            return {
                "error": "Akun belum disetujui admin"
            }

        return {

            "access_token": auth.session.access_token,

            "refresh_token": auth.session.refresh_token,

            "user": user
        }

    except Exception as e:

        return {
            "error": str(e)
        }


# =========================================================
# APPROVE USER OLEH ADMIN
# =========================================================
def approve_user(user_id):

    return update_user_profile(user_id, {

        "is_active": True,

        "status": "disetujui"
    })