from config.database import supabase

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



from postgrest.exceptions import APIError

def update_user_service(user_id, data):

    result = supabase.table("pengguna") \
        .update({
            "status": data.status,
            "is_active": True if data.status == "disetujui" else False
        }) \
        .eq("id", user_id) \
        .execute()

    return result.data


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

