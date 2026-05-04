from pydantic import BaseModel, EmailStr

class ProfileSchema(BaseModel):
        email: EmailStr
        nama_lengkap: str
        status_pegawai: str
        nik: str
        nip: str 
        no_hp: str
        alamat: str 
        role: str
        instansi: str 
        alamat_instansi: str
        nama_kepala_dinas: str
        nip_kepala_dinas: str

        
        