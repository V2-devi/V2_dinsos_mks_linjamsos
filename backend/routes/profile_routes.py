from fastapi import Depends, APIRouter, HTTPException
from dependencies.auth_dependency import get_current_user
from services.profile_service import get_profile_service, insert_user_profile, update_user_profile
from schemas.profile_schema import ProfileSchema
from uuid import UUID


router = APIRouter(prefix="/profile", tags=["Profile"])


@router.post("/")
async def save_profile(data: ProfileSchema, user=Depends(get_current_user)):
    payload = data.dict(exclude_unset=True)
    payload["id"] = str(user.id)
    if not payload.get("email"):
        payload["email"] = getattr(user, "email", None)

    result = insert_user_profile(payload)
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])

    return {
        "message": "Profile saved",
        "data": result
    }

# @router.get("/")
# async def get_profile(user=Depends(get_current_user)):
#     result = get_profile_service(user.id)

#     return result

# @router.get("/profile/{user_id}")
# def get_profile(user_id: str):
#     result = supabase.table("pengguna") \
#         .select("*") \
#         .eq("id", user_id) \
#         .single() \
#         .execute()

#     return result.data


# @router.put("/profile/{user_id}")
# def update_profile(user_id: str, data: dict = ProfileSchema):

#     result = supabase.table("pengguna") \
#         .update({
#             "nama_lengkap": data.get("nama_lengkap"),
#             "nik": data.get("nik"),
#             "nip": data.get("nip"),
#             "no_hp": data.get("no_hp"),
#             "alamat": data.get("alamat"),
#             "instansi": data.get("instansi"),
#             "alamat_instansi": data.get("alamat_instansi")
#         }) \
#         .eq("id", user_id) \
#         .execute()

#     return result.data


@router.get("/{user_id}")
def get_profile_route(user_id: str):
    try:
        result = get_profile_service(user_id)
        if not result:
            raise HTTPException(status_code=404, detail="Profile tidak ditemukan")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{user_id}")
def update_profile_route(user_id: str, data: ProfileSchema):
    result = update_user_profile(user_id, data)
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
    return result




# from config.database import supabase
# from fastapi import Depends
# from fastapi import APIRouter
# from dependencies.auth_dependency import get_current_user

# router = APIRouter(prefix="/profile", tags=["Profile"])

# @router.post("/")
# async def save_profile(data: dict, user=Depends(get_current_user)):
#     user_id = user.id

#     result = supabase.table("profiles").upsert({
#         "id": user_id,
#         "name": data.get("name"),
#         "phone": data.get("phone"),
#         "address": data.get("address")
#     }).execute()

#     return {"message": "Profile saved", "data": result.data}


# @router.get("/")
# async def get_profile(user=Depends(get_current_user)):
#     user_id = user.id

#     result = supabase.table("profiles") \
#         .select("*") \
#         .eq("id", user_id) \
#         .single() \
#         .execute()

#     return result.data

# Bisa tambah put dan delete