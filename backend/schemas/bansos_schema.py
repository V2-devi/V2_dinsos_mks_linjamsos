from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PengusulanCreate(BaseModel):
    id: int
    no_kk: int 
    nama_pengusul: str
    tanggal_usulan: datetime
    penginput: str
    catatan_verifikator: str
    alamat: str
    kecamatan: str
    kelurahan: str
    nik:int
    status_pengusulan: str
    nama_lengkap: str   
    jenis_bansos: str
    # nama_penerima_bantuan: str
    # jenis_bantuan_sosial: str
    # tanggal_penerimaan: datetime
    # status_penyaluran: str