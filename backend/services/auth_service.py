from config.auth import sign_in
from services.profile_service import insert_user_profile, update_user_profile, get_user_by_email
from config.database import supabase
import os
from dotenv import load_dotenv

# =========================================================
# REGISTER
# =========================================================
load_dotenv()

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

                "email_redirect_to": f"{os.getenv('FRONTEND_URL')}/verify"

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

            "alamat": data.alamat,
            
            "wilayah_kerja": data.wilayah_kerja

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
        # CEK EMAIL VERIFIED (tidak memblokir login — hanya flag)
        # =====================================
        email_verified = bool(getattr(auth_user, "email_confirmed_at", None))

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

            payload = {
                "id": str(auth_user.id),
                "email": getattr(auth_user, "email", data.email),
                "nama_lengkap": None,
                "nik": None,
                "nip": None,
                "role": None,
                "alamat": None,
                "no_hp": None,
                "wilayah_kerja": None,
                "status": "menunggu",
                "is_active": False
            }

            # try to read from user_metadata if available (may be dict or None)
            user_meta = getattr(auth_user, "user_metadata", None) or {}
            if isinstance(user_meta, dict):
                payload.update({
                    "nama_lengkap": user_meta.get("nama_lengkap"),
                    "nik": user_meta.get("nik"),
                    "nip": user_meta.get("nip"),
                    "role": user_meta.get("role"),
                    "alamat": user_meta.get("alamat"),
                    "no_hp": user_meta.get("no_hp"),
                    "wilayah_kerja": user_meta.get("wilayah_kerja"),
                })

            print("INSERTING PROFILE PAYLOAD:", payload)
            insert_res = insert_user_profile(payload)
            print("INSERT RESULT:", insert_res)

            # ambil ulang berdasarkan id terlebih dahulu, fallback ke email
            profile = supabase.table("pengguna") \
                .select("*") \
                .eq("id", str(auth_user.id)) \
                .execute()
            if not profile.data:
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
        # Status akun dari profil
        # =====================================
        is_active = user.get("is_active", False)

        # =====================================
        # LOGIN BERHASIL — kembalikan token + user + flags
        # =====================================
        return {
            "access_token": auth.session.access_token,
            "refresh_token": auth.session.refresh_token,
            "user": user,
            "email_verified": email_verified,
            "is_active": is_active
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



from config.database import supabase
import secrets
from datetime import datetime, timedelta


from services.email_service import send_reset_email


def request_reset_password(email: str):
    """Minta reset password - generate token, simpan, dan KIRIM EMAIL"""

    # 1) Cek apakah user ada pada tabel pengguna
    response = supabase.table("pengguna") \
        .select("id, email, nama_lengkap") \
        .eq("email", email) \
        .execute()

    if not response.data:
        # Jangan ungkapkan apakah email terdaftar (keamanan)
        return {"message": "Jika email terdaftar, link reset akan dikirim."}

    user = response.data[0]

    # 2) Generate token dan expiry
    reset_token = secrets.token_urlsafe(32)
    expiry = (datetime.utcnow() + timedelta(hours=1)).isoformat()

    # 3) Simpan token pada tabel password_reset_tokens
    supabase.table("password_reset_tokens").insert({
        "user_id": user["id"],
        "email": email,
        "token": reset_token,
        "expires_at": expiry,
        "used": False
    }).execute()

    # 4) Buat link reset
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"

    # 5) ✅ PANGGIL FUNGSI KIRIM EMAIL (yang sudah Anda buat di email_service.py)
    email_status = send_reset_email(email, reset_link)

    # 6) Log ke terminal untuk debugging
    print(f"\n{'='*70}")
    print(f"📧 RESET PASSWORD untuk: {email}")
    print(f"🔗 Link: {reset_link}")
    
    if email_status["success"]:
        print(f"✅ STATUS: Email BERHASIL dikirim ke inbox!")
    else:
        print(f"❌ STATUS: Email GAGAL dikirim.")
        print(f"⚠️ ALASAN: {email_status['reason']}")
        print(f"📝 PESAN: {email_status['message']}")
    
    print(f"{'='*70}\n")

    # 7) Return ke frontend (Pesan tetap sama demi keamanan)
    return {"message": "Jika email terdaftar, link reset akan dikirim."}


def verify_reset_token(token: str):
    """Verifikasi token reset password"""
    response = supabase.table("password_reset_tokens") \
        .select("*") \
        .eq("token", token) \
        .eq("used", False) \
        .execute()

    if not response.data:
        return {"valid": False, "message": "Token tidak valid atau sudah digunakan."}

    token_data = response.data[0]
    expires_at = datetime.fromisoformat(token_data["expires_at"])

    if datetime.utcnow() > expires_at:
        return {"valid": False, "message": "Token sudah kedaluwarsa."}

    return {"valid": True, "user_id": token_data["user_id"], "email": token_data["email"]}


def reset_password_with_token(token: str, new_password: str):
    """Reset password menggunakan token

    Menggunakan Supabase Admin API untuk mengganti password user pada
    Supabase Auth, kemudian menandai token sebagai telah digunakan.
    """
    verify = verify_reset_token(token)
    if not verify["valid"]:
        raise Exception(verify["message"])

    user_id = verify["user_id"]

    # Update password via Supabase Admin API
    try:
        # gotrue admin API: update_user_by_id(user_id, attributes)
        result = supabase.auth.admin.update_user_by_id(str(user_id), {"password": new_password})
    except Exception as e:
        raise Exception(f"Gagal memperbarui password pada auth provider: {e}")

    # Tandai token sudah digunakan
    supabase.table("password_reset_tokens").update({"used": True}).eq("token", token).execute()

    return {"message": "Password berhasil diubah. Silakan login dengan password baru."}




