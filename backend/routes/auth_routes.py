from fastapi import APIRouter
from ..schemas.auth_schema import RegisterSchema
from ..services.auth_service import register_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: RegisterSchema):
    return register_user(user.dict())