from config.auth import sign_up, sign_in
from models.pengguna_model import insert_user_profile

def register_user(data):
    try:
        # 1. register ke auth
        auth = sign_up(data["email"], data["password"])

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