from pydantic import BaseModel, EmailStr
from typing import Optional


class StaffSchema(BaseModel):
    nama_lengkap: str
    email: EmailStr
    password: Optional[str] = None
    role: str
    nik: Optional[str] = None
    nip: Optional[str] = None
    no_hp: Optional[str] = None
    alamat: Optional[str] = None
    instansi: Optional[str] = None
    alamat_instansi: Optional[str] = None
    nama_kepala_dinas: Optional[str] = None
    nip_kepala_dinas: Optional[str] = None
    status: str
    wilayah_kerja: str

class StaffUpdateSchema(BaseModel):
    status: str
  