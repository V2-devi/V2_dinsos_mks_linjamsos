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

# @router.get("/verify")
# def verify_email(email: str):
#     user_res = get_user_by_email(email)
#     if not user_res or not user_res.data:
#         raise HTTPException(status_code=404, detail="User tidak ditemukan")

#     user = user_res.data
#     update_user_profile(user["id"], {"status": "email_verified"})
#     return {"message": "Email berhasil diverifikasi"}


@router.get("/verify")
def verify_email(email: str):
    user_res = get_user_by_email(email)

    if not user_res or not user_res.data:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    user = user_res.data[0]

    update_user_profile(user["id"], {"is_active": True})

    return {"message": "Email berhasil diverifikasi"}

# @router.options("/register")
# def options_register():
#     return {"message": "OK"}


from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from services.auth_service import (
    request_reset_password,
    verify_reset_token,
    reset_password_with_token
)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyTokenRequest(BaseModel):
    token: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    """Minta link reset password"""
    try:
        result = request_reset_password(request.email)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/verify-reset-token")
async def verify_token(request: VerifyTokenRequest):
    """Verifikasi token masih valid"""
    try:
        result = verify_reset_token(request.token)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password dengan token"""
    try:
        if len(request.new_password) < 6:
            raise HTTPException(status_code=400, detail="Password minimal 6 karakter")
        
        result = reset_password_with_token(request.token, request.new_password)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))