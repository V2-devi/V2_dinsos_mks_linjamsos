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

                "wilayah_kerja": auth_user.user_metadata.get("wilayah_kerja"),

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



from config.database import supabase
import uuid
import secrets
from datetime import datetime, timedelta

def request_reset_password(email: str):
    """Minta reset password - generate token dan simpan"""
    # 1. Cek apakah email ada di localUsers
    response = supabase.table("password_reset_tokens") \
        .select("id, email, nama_lengkap") \
        .eq("email", email) \
        .execute()
    
    if not response.data:
        # Untuk keamanan, tetap return success meski email tidak ada
        # (agar hacker tidak bisa tahu email mana yang terdaftar)
        return {"message": "Jika email terdaftar, link reset akan dikirim."}
    
    user = response.data[0]
    
    # 2. Generate token reset (random 32 karakter)
    reset_token = secrets.token_urlsafe(32)
    
    # 3. Simpan token ke database dengan expiry 1 jam
    expiry = (datetime.utcnow() + timedelta(hours=1)).isoformat()
    
    supabase.table("password_reset_tokens").insert({
        "user_id": user["id"],
        "email": email,
        "token": reset_token,
        "expires_at": expiry,
        "used": False
    }).execute()
    
    # 4. Kirim email (pakai service email Anda)
    # Untuk sekarang, kita return token-nya agar bisa dites
    # Nanti bisa diganti dengan kirim email via SMTP/Resend
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
    
    print(f"\n{'='*60}")
    print(f"📧 RESET PASSWORD LINK untuk {email}:")
    print(f"🔗 {reset_link}")
    print(f"{'='*60}\n")
    
    # TODO: Ganti dengan kirim email asli via SMTP
    # send_reset_email(email, user["nama_lengkap"], reset_link)
    
    return {
        "message": "Link reset password telah dikirim ke email Anda.",
        "reset_token": reset_token  # Hapus ini di production!
    }


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
    
    # Cek apakah token sudah expired
    expires_at = datetime.fromisoformat(token_data["expires_at"])
    if datetime.utcnow() > expires_at:
        return {"valid": False, "message": "Token sudah kedaluwarsa."}
    
    return {
        "valid": True, 
        "user_id": token_data["user_id"],
        "email": token_data["email"]
    }



from config.database import supabase
import secrets
from datetime import datetime, timedelta
import hashlib

def request_reset_password(email: str):
    """Minta reset password - generate token dan simpan"""
    # ✅ GANTI 'localUsers' DENGAN NAMA TABEL ASLI (huruf kecil semua)
    # Cek di Supabase Table Editor untuk nama yang benar
    response = supabase.table("password_reset_tokens") \
        .select("id, email, nama_lengkap") \
        .eq("email", email) \
        .execute()
    
    if not response.data:
        return {"message": "Jika email terdaftar, link reset akan dikirim."}
    
    user = response.data[0]
    
    # Generate token reset
    reset_token = secrets.token_urlsafe(32)
    expiry = (datetime.utcnow() + timedelta(hours=1)).isoformat()
    
    # Simpan token
    supabase.table("password_reset_tokens").insert({
        "user_id": user["id"],
        "email": email,
        "token": reset_token,
        "expires_at": expiry,
        "used": False
    }).execute()
    
    # Buat link reset
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
    
    print(f"\n{'='*60}")
    print(f"📧 RESET PASSWORD LINK untuk {email}:")
    print(f"🔗 {reset_link}")
    print(f"{'='*60}\n")
    
    return {
        "message": "Link reset password telah dikirim ke email Anda.",
        "reset_token": reset_token  # Hapus ini di production!
    }


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
    
    return {
        "valid": True, 
        "user_id": token_data["user_id"],
        "email": token_data["email"]
    }


def reset_password_with_token(token: str, new_password: str):
    """Reset password menggunakan token"""
    verify = verify_reset_token(token)
    if not verify["valid"]:
        raise Exception(verify["message"])
    
    user_id = verify["user_id"]
    
    # Hash password (gunakan bcrypt untuk production)
    hashed_password = hashlib.sha256(new_password.encode()).hexdigest()
    
    # ✅ GANTI 'localUsers' DENGAN NAMA TABEL ASLI
    result = supabase.table("password_reset_tokens") \
        .update({"password": hashed_password}) \
        .eq("id", user_id) \
        .execute()
    
    if not result.data:
        raise Exception("Gagal update password.")
    
    # Tandai token sebagai sudah digunakan
    supabase.table("password_reset_tokens") \
        .update({"used": True}) \
        .eq("token", token) \
        .execute()
    
    return {"message": "Password berhasil diubah. Silakan login dengan password baru."}