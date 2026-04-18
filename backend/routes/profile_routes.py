from fastapi import Depends, APIRouter
from dependencies.auth_dependency import get_current_user
from services.profile_service import save_profile_service, get_profile_service
from schemas.auth_schema import ProfileSchema

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.post("/")
async def save_profile(data: ProfileSchema, user=Depends(get_current_user)):
    result = save_profile_service(user.id, data)
    return {
        "message": "Profile saved",
        "data": result
    }

@router.get("/")
async def get_profile(user=Depends(get_current_user)):
    result = get_profile_service(user.id)

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