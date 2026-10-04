from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Keluarga(BaseModel):
  no_kk: str
  alamat: str
  nama_kepala_keluarga: str
  kelurahan: str
  kecamatan: str
  jenis_kelamin: str
  tanggal_lahir: str
  nik: Optional[int] = None
  updated_at: Optional[datetime] = None

  hasil_desil: Optional[str] = None
  skor_pmt: Optional[float] = None
  tanggal_hitung_desil: Optional[datetime] = None
  

  kategori_desil: Optional[str] = None
  tanggal_terakhir_update: Optional[str] = None


class UpdateDesil(BaseModel):

    skor_pmt: Optional[float] = None
    hasil_desil: Optional[str] = None
    kategori_desil: Optional[str] = None
    tanggal_hitung_desil: Optional[str] = None
    tanggal_terakhir_update: Optional[str] = None
 
 
 