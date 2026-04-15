from fastapi import Header, HTTPException
from config.auth import get_user

def get_current_user(authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid auth header")

        token = authorization.split(" ")[1]
        user = get_user(token)

        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized")

        return user

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")