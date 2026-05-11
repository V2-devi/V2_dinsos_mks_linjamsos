from config.database import supabase

def create_staff(data):
    try:
        # ====================================
        # BUAT AKUN LOGIN DI AUTH.USERS
        # ====================================
        auth_user = supabase.auth.admin.create_user({
            "email": data.email,
            "password": data.password,
            "email_confirm": True

        })

        user = auth_user.user
        # ====================================
        # SIMPAN PROFILE KE TABEL PENGGUNA
        # ====================================
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
        return {
            "error": str(e)
        }
    

from postgrest.exceptions import APIError

def update_user_service(user_id, data):

    try:

        result = supabase.table("pengguna") \
            .update({
                "status": data.get("status") or "menunggu",
                "is_active": True if data.get("status") == "disetujui" else False
            }) \
            .eq("id", user_id) \
            .execute()

        return result.data

    except APIError as e:
        return {"error": str(e)}