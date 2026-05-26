
from fastapi import APIRouter, Depends, HTTPException, Body
from dependencies.auth_dependency import get_current_user
from config.database import supabase
# from services.profile_service import get_all_users
from services.auth_service import approve_user
from services.admin_service import create_staff, update_user_service, delete_user_service
from schemas.staff_schema import StaffSchema, StaffUpdateSchema

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
def get_all_users():
    return supabase.table("pengguna").select("*").execute().data


@router.put("/update/{user_id}")
def update_user(user_id: str, data: StaffUpdateSchema):
    print("DATA MASUK:", data)  # 🔥 DEBUG WAJIB

    result = update_user_service(user_id, data)
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/users")
def create_staff_route(data: StaffSchema):
    return create_staff(data)


@router.delete("/delete/{user_id}")
async def delete_user(user_id: str):

    return delete_user_service(user_id)

# @router.put("/admin/update/{user_id}")
# async def update_user(
#     user_id: str,
#     data: StaffSchema
# ):

#     return update_user_service(user_id, data)


# @router.get("/users/pending")
# def get_pending_users():
#     return supabase.table("pengguna").select("*").eq("status", "pending").execute()
    # if result.error:
    #     raise HTTPException(status_code=400, detail=str(result.error))
    # return result.data

# @router.get("/users/pending")
# def get_pending_users():
#     result = supabase.table("pengguna") \
#         .select("*") \
#         .eq("status", "pending") \
#         .execute()

#     return result.data

# @router.put("/update/{id}")
# def update_user(id: str, payload: dict = Body(...)):
#     print("UPDATE REQUEST ID:", id)
#     print("UPDATE REQUEST PAYLOAD:", payload)

#     result = supabase.table("pengguna") \
#         .update(payload) \
#         .eq("id", id) \
#         .execute()

#     print("UPDATE RESULT:", result.data)

#     if not result.data:
#         raise HTTPException(
#             status_code=404,
#             detail="User tidak ditemukan atau gagal update"
#         )

#     return result.data

# @router.post("/users/{user_id}/approve")
# def approve_user(user_id: str, user=Depends(get_current_user)):
#     result = supabase.table("pengguna").update({"status": "approved", "is_active": True}).eq("id", user_id).execute()
#     if result.error:
#         raise HTTPException(status_code=400, detail=str(result.error))
#     return {"message": "Akun disetujui"}


# @router.put("/reject/{user_id}")
# def reject_user(user_id: str):
#     return supabase.table("pengguna") \
#         .update({"status": "rejected"}) \
#         .eq("id", user_id) \
#         .execute()

# @router.post("/users/{user_id}/reject")
# def reject_user(user_id: str, user=Depends(get_current_user)):
#     result = supabase.table("pengguna").update({"status": "rejected", "is_active": False}).eq("id", user_id).execute()
#     if result.error:
#         raise HTTPException(status_code=400, detail=str(result.error))
#     return {"message": "Akun ditolak"}
