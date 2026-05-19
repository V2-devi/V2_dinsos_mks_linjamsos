from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Keluarga(BaseModel):
  # user_id: Optional[int] = None
  no_kk: str
  alamat: str
  skor_pmt: Optional[float] = None
  tanggal_hitung_desil: datetime
  desil: int
  nama_kepala_keluarga: str
  kelurahan: str
  kecamatan: str
  jenis_kelamin: str
  tanggal_lahir: datetime
  nik: Optional[int] = None
  updated_at: Optional[datetime] = None
 
 
  # nik: int
  # pekerjaan: str
  # nama_anggota_keluarga: str
  # hubungan_keluarga: str
  # status_keadaan : str
  # status_kehamilan: str
  # kategori_disabilitas : str
  # penyakit_kronis : str
  # lokasi_penemuan : str
  # tanggal_laporan: datetime 
  # kategori_ppks : str
  # status_penanganan : str

