from fastapi import Header, HTTPException
from config.auth import get_user

def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        user = get_user(token)

        if not user:
            raise HTTPException(status_code=401, detail="Unauthorized")

        return user

    except:
        raise HTTPException(status_code=401, detail="Invalid token")