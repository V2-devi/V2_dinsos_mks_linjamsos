from config.auth import sign_up, sign_in
from models.pengguna_model import insert_user_profile
from config.database import supabase

def register_user(data):
    try:
        # 1. register ke auth
        auth = supabase.auth.sign_up({
            "email": data["email"],
            "password": data["password"],
            "options": {
                "email_redirect_to": "http://localhost:5173/register"
            }
        })

        user = auth.user
        if not user:
            return {"error": "Gagal register"}

        user_id = user.id

        # 2. simpan profil
        insert_user_profile({
            "id": user_id,
            "nama_lengkap": data["nama_lengkap"],
            "nik": data["nik"],
            "nip": data["nip"],
            "role": data["role"],
            "no_hp": data["no_hp"],
            "alamat": data["alamat"]
        })

        return {"message": "Register berhasil, cek email verifikasi"}

    except Exception as e:
        return {"error": str(e)}


def login_user(data):
    try:
        auth = sign_in(data["email"], data["password"])

        if not auth.session:
            return {"error": "Login gagal"}

        return {
            "access_token": auth.session.access_token,
            "refresh_token": auth.session.refresh_token
        }

    except Exception as e:
        return {"error": str(e)}