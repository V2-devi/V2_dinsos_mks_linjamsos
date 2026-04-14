from fastapi import APIRouter, Depends
from schemas.auth_schema import RegisterSchema, LoginSchema
from services.auth_service import register_user, login_user
from dependencies.auth_dependency import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: RegisterSchema):
    return register_user(user.dict())

@router.post("/login")
def login(user: LoginSchema):
    return login_user(user.dict())

# @router.get("/me")
# def get_me(user=Depends(get_current_user)):
#     return user