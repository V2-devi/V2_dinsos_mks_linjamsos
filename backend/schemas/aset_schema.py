from pydantic import BaseModel

class aset(BaseModel):
  
  no_kk: int
  nama_kategori: str 
  nama_indikator: str
  tipe_data: int
  satuan: int
  nilai_angka: int
  nilai_text: str