from fastapi import APIRouter, HTTPException
from schemas.auth_schema import RegisterSchema, LoginSchema
from services.auth_service import register_user, login_user
from services.profile_service import get_user_by_email, update_user_profile

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(data: RegisterSchema):
    result = register_user(data)
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/login")
def login(data: LoginSchema):
    result = login_user(data)
    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.get("/verify")
def verify_email(email: str):
    user_res = get_user_by_email(email)
    if not user_res or not user_res.data:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    user = user_res.data
    update_user_profile(user["id"], {"status": "email_verified"})
    return {"message": "Email berhasil diverifikasi"}

# @router.options("/register")
# def options_register():
#     return {"message": "OK"}