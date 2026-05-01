
from fastapi import APIRouter, Depends, HTTPException
from dependencies.auth_dependency import get_current_user
from config.database import supabase

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/users/pending")
def get_pending_users(user=Depends(get_current_user)):
    result = supabase.table("pengguna").select("*").eq("status", "email_verified").execute()
    if result.error:
        raise HTTPException(status_code=400, detail=str(result.error))
    return result.data

@router.post("/users/{user_id}/approve")
def approve_user(user_id: str, user=Depends(get_current_user)):
    result = supabase.table("pengguna").update({"status": "approved", "is_active": True}).eq("id", user_id).execute()
    if result.error:
        raise HTTPException(status_code=400, detail=str(result.error))
    return {"message": "Akun disetujui"}

@router.post("/users/{user_id}/reject")
def reject_user(user_id: str, user=Depends(get_current_user)):
    result = supabase.table("pengguna").update({"status": "rejected", "is_active": False}).eq("id", user_id).execute()
    if result.error:
        raise HTTPException(status_code=400, detail=str(result.error))
    return {"message": "Akun ditolak"}
