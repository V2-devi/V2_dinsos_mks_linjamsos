from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# =========================================
# CREATE ANGGOTA
# =========================================
class Anggota(BaseModel):

    nik: int

    nama_anggota_keluarga: str

    hubungan_keluarga: str

    jenis_kelamin: str

    tanggal_lahir: datetime

    status_keadaan: str

    kondisi_khusus: Optional[str] = None


# =========================================
# UPDATE KONDISI KHUSUS
# =========================================
class UpdateKondisiKhusus(BaseModel):

    kondisi_khusus: str