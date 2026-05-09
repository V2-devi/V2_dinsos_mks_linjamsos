from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PengusulanCreate(BaseModel):
    nama_lengkap: str
    nik: str
    no_kk: str
    kecamatan: str
    kelurahan: str
    alamat: str

    # nama_penerima_bantuan: str
    # jenis_bantuan_sosial: str
    # tanggal_penerimaan: datetime
    # status_penyaluran: str