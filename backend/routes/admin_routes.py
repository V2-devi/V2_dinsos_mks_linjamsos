from fastapi import APIRouter, Depends, HTTPException, Body
from dependencies.auth_dependency import get_current_user
from config.database import supabase
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
    result = create_staff(data)
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.delete("/delete/{user_id}")
async def delete_user(user_id: str):
    result = delete_user_service(user_id)
    if not result.get("success"):
        status_code = 404 if result.get("error") == "User tidak ditemukan" else 400
        raise HTTPException(status_code=status_code, detail=result.get("error", "Gagal menghapus user"))
    return result

