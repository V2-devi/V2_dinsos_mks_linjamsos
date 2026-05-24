from pydantic import BaseModel, EmailStr

from typing import Optional

class ProfileSchema(BaseModel):
        email: Optional[EmailStr] = None

        nama_lengkap: Optional[str] = None

        status: Optional[str] = None

        nik: Optional[str] = None

        nip: Optional[str] = None

        no_hp: Optional[str] = None

        alamat: Optional[str] = None

        role: Optional[str] = None

        instansi: Optional[str] = None

        alamat_instansi: Optional[str] = None

        nama_kepala_dinas: Optional[str] = None

        nip_kepala_dinas: Optional[str] = None

        wilayah_kerja: Optional[str] = None
                
                