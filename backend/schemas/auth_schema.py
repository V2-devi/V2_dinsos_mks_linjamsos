from typing import Optional
from pydantic import BaseModel, EmailStr

class RegisterSchema(BaseModel):
    email: EmailStr
    password: str
    nama_lengkap: str
    nik: int
    nip: int 
    role: str
    no_hp: str
    alamat: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

