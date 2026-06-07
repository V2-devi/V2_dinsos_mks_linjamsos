from typing import Optional
from pydantic import BaseModel, EmailStr


class RegisterSchema(BaseModel):
    email: EmailStr
    password: str
    nama_lengkap: Optional[str] = None
    nik: Optional[str] = None
    nip: Optional[str] = None
    role: Optional[str] = None
    no_hp: Optional[str] = None
    alamat: Optional[str] = None
    wilayah_kerja: Optional[str] = None


class LoginSchema(BaseModel):
    email: EmailStr
    password: str

