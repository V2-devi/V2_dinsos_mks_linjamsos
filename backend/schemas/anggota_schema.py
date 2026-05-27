from pydantic import BaseModel, Field
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

    tanggal_lahir: str

    status_keadaan: str

    kondisi_khusus: Optional[str] = None


# =========================================
# UPDATE KONDISI KHUSUS
# =========================================

class UpdateKondisiKhusus(BaseModel):
    nik: Optional[str] = None
    nama_anggota_keluarga: Optional[str] = None
    hubungan_keluarga: Optional[str] = None
    jenis_kelamin: Optional[str] = None
    tanggal_lahir: Optional[str] = None
    status_keadaan: Optional[str] = None
    
    # ✅ Field flat dari frontend form
    hamil: Optional[str] = Field(default="Tidak Sedang Hamil")
    disabilitas: Optional[str] = Field(default="Tidak Ada Disabilitas")
    penyakit: Optional[str] = Field(default="")