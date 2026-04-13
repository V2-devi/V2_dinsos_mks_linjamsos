from ..config.database import supabase
from ..models.pengguna_model import insert_user_profile

def register_user(data):
    # Register ke Supabase Auth
    try:
        auth = supabase.auth.sign_up({
            "email": data["email"],
            "password": data["password"]
        })
    except Exception as e:
        return {"error": "Gagal register", "details": str(e)}

    if isinstance(auth, dict):
        auth_data = auth.get("data")
        auth_error = auth.get("error")
    else:
        auth_data = getattr(auth, "data", None)
        auth_error = getattr(auth, "error", None)

    if auth_error:
        return {"error": "Gagal register", "details": str(auth_error)}
    if auth_data is None:
        return {"error": "Gagal register: respons auth kosong"}

    if isinstance(auth_data, dict):
        user = auth_data.get("user") or auth_data
    else:
        user = getattr(auth_data, "user", None) or auth_data

    if user is None:
        user = getattr(auth, "user", None)

    if user is None:
        return {"error": "Gagal register"}

    user_id = getattr(user, "id", None) or (user.get("id") if isinstance(user, dict) else None)
    if not user_id:
        return {"error": "Gagal register: id user tidak ditemukan"}

    # Simpan data profil ke tabel pengguna
    try: 
        insert_user_profile({
            "id": user_id,
            "nama": data["nama_lengkap"],
            "alamat": data["alamat"],
            "no_hp": data["no_hp"],
            "NIK": data["NIK"],
            "NIP": data["NIP"],
            "role": data["role"],
        })
    except Exception as e:
        return {"error": "Gagal simpan profile", "details": str(e)}
    
    return {
        "message": "Register berhasil, silakan cek email untuk verifikasi"
    }