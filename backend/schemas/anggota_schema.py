from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Anggota(BaseModel):
    no_kk: str
    nik: str
    nama_anggota_keluarga: str
    hubungan_keluarga: str
    jenis_kelamin: str
    tanggal_lahir: datetime
    status_keadaan: str 
    kondisi_khusus: Optional[str] = None

class UpdateKondisiKhusus(BaseModel):
    kondisi_khusus: str