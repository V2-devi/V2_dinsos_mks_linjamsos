from config.database import supabase
from postgrest.exceptions import APIError
from services.email_service import send_approval_email

def create_staff(data):
    try:
        auth_user = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True
        })

        # 🔥 CEK ERROR AUTH
        if hasattr(auth_user, "error") and auth_user.error:
            return {"error": auth_user.error.message}

        user = auth_user.user

        if not user:
            return {"error": "Gagal membuat user auth"}

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
        return {"error": str(e)}


from services.email_service import send_approval_email


def update_user_service(user_id, data):

    try:

        print(f"DEBUG: Updating user {user_id} with data: {data}")

        payload = {}

        # =====================================
        # HANDLE PYDANTIC / DICT
        # =====================================
        if hasattr(data, "dict"):

            payload = data.dict(exclude_unset=True)

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

        # =====================================
        # UPDATE DATABASE
        # =====================================
        result = supabase.table("pengguna") \
            .update(payload) \
            .eq("id", str(user_id)) \
            .execute()

        print("DEBUG UPDATE RESULT:", result)

        # =====================================
        # CEK RESULT
        # =====================================
        if not result.data:

            return {

                "error": "Update gagal"
            }

        # =====================================
        # KIRIM EMAIL SETELAH UPDATE
        # =====================================
        if approved:

            user_result = supabase.table("pengguna") \
                .select("*") \
                .eq("id", str(user_id)) \
                .single() \
                .execute()

            user_data = user_result.data

            print("DEBUG USER DATA:", user_data)

            send_approval_email(

                user_data["email"],

                user_data["nama_lengkap"]
            )

        return result.data

    except Exception as e:

        print("DEBUG ERROR:", str(e))

        return {

            "error": str(e)
        }
    


# def update_user_service(user_id, data):
#     try:
#         print(f"DEBUG: Updating user {user_id} with data: {data}")

#         payload = {}

#         # Handle Pydantic model
#         if hasattr(data, "dict"):
#             payload = data.dict(exclude_unset=True)
#             print(f"DEBUG: Pydantic payload: {payload}")
#         elif isinstance(data, dict):
#             payload = {k: v for k, v in data.items() if v is not None}
#             print(f"DEBUG: Dict payload: {payload}")

#         # Ensure status is processed
#         if "status" in payload and payload["status"] is not None:
#             raw_status = str(payload["status"]).strip().lower()
#             if raw_status in ["disetujui", "approved"]:
#                 payload["status"] = "disetujui"
#                 payload["is_active"] = True
#             else:
#                 payload["status"] = "menunggu"
#                 payload["is_active"] = False

#         print(f"DEBUG: Final payload: {payload}")

#         if not payload:
#             return {"error": "Tidak ada data untuk diupdate"}

#         # Ensure user_id is string
#         user_id_str = str(user_id).strip()
#         print(f"DEBUG: Using user_id: {user_id_str}")

#         result = supabase.table("pengguna") \
#             .update(payload) \
#             .eq("id", user_id_str) \
#             .execute()

#         print(f"DEBUG: Update result: {result}")

#         if not result.data:
#             return {"error": "User tidak ditemukan atau tidak ada perubahan"}

#         return result.data
#     except Exception as e:
#         print(f"DEBUG: Exception in update_user_service: {str(e)}")
#         return {"error": str(e)}







# def update_user_service(user_id, data):

#     try:

#         result = supabase.table("pengguna") \
#             .update({
#                 "status": data.get("status") or "menunggu",
#                 "is_active": True if data.get("status") == "disetujui" else False
#             }) \
#             .eq("id", user_id) \
#             .execute()

#         return result.data

#     except APIError as e:
#         return {"error": str(e)}

