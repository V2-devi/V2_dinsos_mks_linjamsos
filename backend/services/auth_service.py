from config.auth import sign_in
from services.profile_service import insert_user_profile, update_user_profile, get_user_by_email
from config.database import supabase

def register_user(data):
    try:
        existing = get_user_by_email(data.email)
        if existing and existing.data:
            return {"error": "Email sudah terdaftar"}

        auth = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {
                "data": {
                    "role": data.role,
                },
                "email_redirect_to": "http://localhost:5173/verify"
            }
        })

        user = auth.user
        if not user:
            return {"error": "Gagal register"}
        user_id = user.id

        insert_user_profile({
            "id": user_id,
            "email": data.email,
            "nama_lengkap": data.nama_lengkap,
            "nik": data.nik,
            "nip": data.nip,
            "role": data.role,
            "no_hp": data.no_hp,
            "alamat": data.alamat
        })

        return {"message": "Register berhasil, cek email verifikasi"}

    except Exception as e:
        return {"error": str(e)}

def approve_user(user_id):
    return update_user_profile(user_id, {
        "is_active": True,
        "status": "approved"
    })

def login_user(data):
    try:
        # Login ke supabase Auth
        auth = sign_in(data.email, data.password)

        if not auth.session:
            return {"error": "Login gagal"}

        if not auth.user.email_confirmed_at:
            return {"error": "Email belum diverifikasi"}
        
        # Ambil data user dari tabel
        user = get_user_by_email(data.email)

        if not user:
            return {"error": "User tidak ditemukan"}


        # cek apakah sudah di-approve admin
        if not user.get("is_active"):
            return {"error": "Akun belum disetujui admin"}
        
        return {
            "access_token": auth.session.access_token,
            "refresh_token": auth.session.refresh_token
        }
        
    except Exception as e:
        return {"error": str(e)}

    