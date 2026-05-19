from pydantic import BaseModel
from typing import Optional

class PPKS(BaseModel):
    nama_lengkap: str
    nik: Optional[str] = None
    kategori_ppks: str
    lokasi_penemuan: str
    tanggal_penemuan: str
    status_penanganan: str
    # detail_lokasi: str
    kecamatan: Optional[str] = None
    kelurahan: Optional[str] = None