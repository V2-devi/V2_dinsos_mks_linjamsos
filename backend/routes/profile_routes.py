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




