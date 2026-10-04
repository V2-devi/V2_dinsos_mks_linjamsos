from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PengusulanCreate(BaseModel):
    id: Optional[int] = None
    no_kk: int 
    tanggal_usulan: datetime
    catatan_verifikator_bansos: Optional[str] = None
    alamat: str
    kecamatan: str
    kelurahan: str
    nik:int
    status_pengusulan: str

    nama_kepala_keluarga: str   
    jenis_bansos: str
  