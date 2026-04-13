from typing import Optional
from pydantic import BaseModel, EmailStr

class RegisterSchema(BaseModel):
    email: EmailStr
    password: str
    nama_lengkap: str
    NIK: int
    NIP: int 
    role: str
    no_hp: str
    alamat: str
