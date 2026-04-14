# from pydantic import BaseModel, EmailStr, Field, field_validator
from config.database import supabase

def insert_user_profile(data):
    return supabase.table("pengguna").insert(data).execute()

def get_user_profile(user_id):
    return supabase.table("pengguna").select("*").eq("id", user_id).single().execute()


