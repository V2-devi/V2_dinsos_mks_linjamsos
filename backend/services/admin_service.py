from config.database import supabase
from postgrest.exceptions import APIError
from services.email_service import send_approval_email, send_staff_account_email
from services.profile_service import insert_user_profile
import secrets



import random
import string


def get_users_service():

    try:

        result = (
            supabase
            .table("pengguna")
            .select("*")
            .execute()
        )

        return result.data

    except Exception as e:

        print("GET USERS ERROR:", str(e))

        return {
            "error": str(e)
        }


def generate_password(length=8):

    chars = string.ascii_letters + string.digits

    return ''.join(
        random.choice(chars)
        for _ in range(length)
    )


def create_staff(data):

    try:

        # ====================================
        # GENERATE PASSWORD RANDOM
        # ====================================
        temporary_password = secrets.token_hex(4)

        print("PASSWORD:", temporary_password)

        # ====================================
        # BUAT USER AUTH
        # ====================================
        auth_user = supabase.auth.admin.create_user({
            "email": data.email,
            "password": temporary_password,
            "email_confirm": True
        })

        if hasattr(auth_user, "error") and auth_user.error:
            return {"error": auth_user.error.message}

        user = auth_user.user

        if not user:
            return {"error": "Gagal membuat akun auth"}

        # ====================================
        # SIMPAN PROFILE
        # ====================================
        result = insert_user_profile({
            "id": str(user.id),
            "email": data.email,
            "nama_lengkap": data.nama_lengkap,
            "nik": data.nik,
            "nip": data.nip,
            "role": data.role,
            "alamat": data.alamat,
            "no_hp": data.no_hp,
            "wilayah_kerja": data.wilayah_kerja,
            "status": "disetujui",
            "is_active": True
        })

        if not result:
            return {"error": "Gagal menyimpan profil pengguna"}

        # ====================================
        # KIRIM EMAIL
        # ====================================
        send_staff_account_email(
            data.email,
            data.nama_lengkap,
            temporary_password,
            data.role
        )

        return result

    except Exception as e:
        return {"error": str(e)}




def update_user_service(user_id, data):

    try:

        print(f"DEBUG: Updating user {user_id} with data: {data}")

        payload = {}

        # =====================================
        # HANDLE PYDANTIC / DICT
        # =====================================
        if hasattr(data, "dict"):

            payload = data.dict(exclude_none=True)

        elif isinstance(data, dict):

            payload = {
                k: v for k, v in data.items()
                if v is not None
            }

        print("DEBUG PAYLOAD:", payload)

        # =====================================
        # HANDLE STATUS
        # =====================================
        approved = False

        if "status" in payload:

            raw_status = str(
                payload["status"]
            ).strip().lower()

            if raw_status in ["disetujui", "approved"]:

                payload["status"] = "disetujui"
                payload["is_active"] = True
                approved = True

            else:

                payload["status"] = "menunggu"
                payload["is_active"] = False

        print("DEBUG FINAL PAYLOAD:", payload)

        if not payload:
            return {"error": "Tidak ada data untuk diupdate"}

        # =====================================
        # UPDATE DATABASE
        # =====================================
        result = (
            supabase
            .table("pengguna")
            .update(payload)
            .eq("id", str(user_id))
            .select("*")
            .execute()
        )

        print("DEBUG UPDATE RESULT:", result)

        # =====================================
        # CEK RESULT
        # =====================================
        if hasattr(result, 'error') and result.error:
            return {"error": str(result.error)}

        if not result.data:
            # Jika tidak ada data hasil update, cek apakah user memang ada
            existing = (
                supabase
                .table("pengguna")
                .select("*")
                .eq("id", str(user_id))
                .single()
                .execute()
            )

            if not existing.data:
                return {"error": "User tidak ditemukan"}

            # Update valid, tapi tidak ada perubahan baru untuk diterapkan.
            # Kembalikan data user saat ini sebagai respons sukses.
            return existing.data

        # =====================================
        # EMAIL APPROVAL
        # =====================================
        if approved:

            user_result = (
                supabase
                .table("pengguna")
                .select("*")
                .eq("id", str(user_id))
                .single()
                .execute()
            )

            user_data = user_result.data

            print("DEBUG USER DATA:", user_data)

            try:

                send_approval_email(
                    user_data["email"],
                    user_data["nama_lengkap"]
                )

            except Exception as email_error:

                print("EMAIL ERROR:", str(email_error))

        return result.data

    except Exception as e:

        print("DEBUG ERROR:", str(e))

        return {
            "error": str(e)
        }



def delete_user_service(user_id: str):

    try:

        print("DELETE USER:", user_id)

        result = (
            supabase
            .table("pengguna")
            .delete()
            .eq("id", str(user_id))
            .execute()
        )

        print("DELETE RESULT:", result.data)

        return {
            "success": True,
            "data": result.data
        }

    except Exception as e:

        print("DELETE ERROR:", str(e))

        return {
            "success": False,
            "error": str(e)
        }

# def update_user_service(user_id, data):

#     try:

#         print(f"DEBUG: Updating user {user_id} with data: {data}")

#         payload = {}

#         # =====================================
#         # HANDLE PYDANTIC / DICT
#         # =====================================
#         if hasattr(data, "dict"):

#             payload = data.dict(exclude_unset=True)

#         elif isinstance(data, dict):

#             payload = {

#                 k: v for k, v in data.items()

#                 if v is not None
#             }

#         print("DEBUG PAYLOAD:", payload)

#         # =====================================
#         # HANDLE STATUS
#         # =====================================
#         approved = False

#         if "status" in payload:

#             raw_status = str(
#                 payload["status"]
#             ).strip().lower()

#             if raw_status in ["disetujui", "approved"]:

#                 payload["status"] = "disetujui"

#                 payload["is_active"] = True

#                 approved = True

#             else:

#                 payload["status"] = "menunggu"

#                 payload["is_active"] = False

#         print("DEBUG FINAL PAYLOAD:", payload)

#         # =====================================
#         # UPDATE DATABASE
#         # =====================================
#         result = supabase.table("pengguna") \
#             .update(payload) \
#             .eq("id", str(user_id)) \
#             .execute()

#         print("DEBUG UPDATE RESULT:", result)

#         # =====================================
#         # CEK RESULT
#         # =====================================
#         if not result.data:

#             return {

#                 "error": "Update gagal"
#             }

#         # =====================================
#         # KIRIM EMAIL SETELAH UPDATE
#         # =====================================
#         if approved:

#             user_result = supabase.table("pengguna") \
#                 .select("*") \
#                 .eq("id", str(user_id)) \
#                 .single() \
#                 .execute()

#             user_data = user_result.data

#             print("DEBUG USER DATA:", user_data)

#             send_approval_email(

#                 user_data["email"],

#                 user_data["nama_lengkap"]
#             )

#         return result.data

#     except Exception as e:

#         print("DEBUG ERROR:", str(e))

#         return {

#             "error": str(e)
#         }
    


