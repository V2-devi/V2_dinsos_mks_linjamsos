# from pydantic import BaseModel, EmailStr, Field, field_validator
from ..config.database import supabase

def insert_user_profile(data):
    return supabase.table("pengguna").insert(data).execute()


