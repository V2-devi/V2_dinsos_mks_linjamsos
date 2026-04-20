from pydantic import BaseModel
import datetime

class Keluarga(BaseModel):
  updated_at: datetime
  skor_pmt: int
  tanggal_hitung_desil: datetime
  nama_kepala_keluarga: str
  kabupaten: str
  kecamatan : str
  no_kk: int
  nik: int
  pekerjaan: str
  nama_anggota_keluarga: str
  tempat_tanggal_lahir: str
  hubungan_keluarga: str
  jenis_kelamin : str
  status_keadaan : str
  status_kehamilan: str
  kategori_disabilitas : str
  penyakit_kronis : str
  lokasi_penemuan : str
  tanggal_laporan: datetime 
  kategori_ppks : str
  status_penanganan : str

