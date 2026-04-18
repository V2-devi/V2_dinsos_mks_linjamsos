from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Bansos(BaseModel):
    nama_pengusul: str
    tanggal_usulan: datetime
    status_pengusulan: str
    penginput: str
    catatan_verifikator: str
    no_kk: int
    nama_penerima_bantuan: str
    jenis_bantuan_sosial: str
    tanggal_penerimaan: datetime
    status_penyaluran: str