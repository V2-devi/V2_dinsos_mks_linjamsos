from pydantic import BaseModel
from typing import Optional

class PPKS(BaseModel):
    nama_lengkap: str
    kategori_ppks: str
    lokasi_penemuan: str
    tanggal_laporan: str
    status_ppks: str
    detail: str
    kecamatan: Optional[str] = None