from config.database import supabase
from datetime import datetime

# =========================================
# BOBOT NILAI PMT (SAMA PERSIS DENGAN FE ANDA)
# =========================================
BOBOT_PMT = {
    "v01": {"Laki-laki": 1.0, "Perempuan": 0.0},
    "v02": {"< 25 tahun": 0.2, "25 - 40 tahun": 1.0, "41 - 55 tahun": 0.8, "56 - 65 tahun": 0.5, "> 65 tahun": 0.1},
    "v03": {"Tidak pernah sekolah": 0.0, "Tidak tamat SD": 0.5, "Tamat SD/sederajat": 1.0, "Tamat SMP/sederajat": 1.8, "Tamat SMA/sederajat": 2.5, "Tamat D1/D2/D3": 3.2, "Tamat S1 ke atas": 4.0},
    "v04": {"Tidak bekerja": 0.0, "Serabutan": 0.5, "Buruh": 1.0, "Usaha sendiri": 1.5, "Karyawan tetap": 2.5}, 
    # Note: Di FE Anda "Serabutan/tidak tetap", di bobot "Serabutan". Pastikan string match atau gunakan logic 'in'
    "v05": {"Cerai mati": 0.0, "Cerai hidup": 0.2, "Belum kawin": 0.5, "Kawin": 1.0},
    "v06": {"≥ 8 jiwa": -2.0, "6 - 7 jiwa": -1.2, "4 - 5 jiwa": -0.5, "3 jiwa": 0.0, "1 - 2 jiwa": 0.5},
    "v07": {"Menumpang": 0.0, "Sewa": 0.5, "Milik sendiri": 1.5}, # Match "Sewa/kontrak" dengan "Sewa"
    "v08": {"< 4 m²": 0.0, "4 - 7 m²": 0.5, "8 - 15 m²": 1.5, "> 15 m²": 2.5},
    "v09": {"Tanah": 0.0, "Bambu": 0.5, "Semen": 1.5, "Keramik": 3.0},
    "v10": {"Bambu": 0.0, "Kayu": 0.5, "Tembok tidak diplester": 1.0, "Tembok diplester": 2.0},
    "v11": {"Rumbia": 0.0, "Seng": 0.8, "Genteng tanah liat": 1.5, "Genteng beton": 2.0},
    "v12": {"Sungai": 0.0, "Sumur tak terlindung": 0.3, "Sumur terlindung": 1.0, "Mata air": 1.2, "Air isi ulang": 1.5, "PDAM": 2.0, "kemasan": 2.5},
    "v13": {"Tidak ada": 0.0, "Bersama": 0.5, "Milik sendiri": 1.5},
    "v14": {"Tidak ada": 0.0, "Plengsengan": 0.5, "Leher angsa": 1.5},
    "v15": {"Sungai": 0.0, "Tangki septik": 1.5, "IPAL komunal": 2.0},
    "v16": {"Bukan listrik": 0.0, "Listrik Non-PLN": 0.8, "Listrik PLN": 1.5},
    "v17": {"Tidak ada": 0.0, "450 Watt": 0.5, "900 Watt": 1.0, "1.300 Watt": 1.8, "2.200 Watt": 3.0},
    "v18": {"Kayu bakar": 0.0, "Minyak tanah": 0.3, "3 Kg": 1.0, "5.5 Kg": 2.0, "Listrik": 2.5},
    "v19": {"Tidak ada": 0.0, "1 tabung": 3.0},
    "v20": {"Tidak ada": 0.0, "< 500 m²": 1.0, "≥ 500 m²": 2.5},
    "v21": {"Tidak ada": 0.0, "Ada": 3.0},
    "v22": {"Tidak ada": 0.0, "Ada": 2.0},
    "v23": {"Tidak ada": 0.0, "Ada": 0.5},
    "v24": {"Tidak ada": 0.0, "Ada": 3.0},
    "v25": {"Tidak ada": 0.0, "Ada": 5.0},
    "v26": {"Tidak ada": 0.0, "Ada": 3.0},
    "v27": {"Tidak ada": 0.0, "Ada": 1.5},
    "v28": {"Tidak ada": 0.0, "Ada": 2.0},
    "v29": {"Tidak ada": 0.0, "Ada": 1.2},
    "v30": {"Tidak ada": 0.0, "Ada": 2.5},
    "v31": {"Tidak ada": 0.0, "Ada": 4.0},
    "v32": {"Tidak ada": 0.0, "Ada": 1.5},
    "v33": {"Tidak ada": 0.0, "Ada": 1.0},
    "v34": {"Tidak ada": 0.0, "Ada": 0.5},
    "v35": {"Tidak ada": 0.0, "1 - 2 ekor": 1.5, "≥ 3 ekor": 3.0},
    "v36": {"Tidak ada": 0.0, "1 - 5 ekor": 0.8, "≥ 6 ekor": 1.5},
    "v37": {"Tidak ada": 0.0, "1 - 10 ekor": 0.3, "≥ 11 ekor": 0.8},
    "v38": {"Tidak ada": 0.0, "< 10 gram": 1.0, "≥ 10 gram": 2.5},
    "v39": {"Tidak ada": 0.0, "< Rp 500.000": 0.5, "Rp 500rb - 5jt": 1.5, "> Rp 5 juta": 3.0},
}

def hitung_skor_pmt(aset_data: dict) -> float:
    """
    Menghitung total skor berdasarkan data aset dan bobot yang ditentukan.
    Menggunakan fuzzy matching sederhana (lowercase & contains) agar robust.
    """
    total_skor = 0.0
    
    for kunci, opsi_bobot in BOBOT_PMT.items():
        jawaban_user = aset_data.get(kunci, "")
        if not jawaban_user:
            continue
            
        jawaban_lower = jawaban_user.lower()
        
        # Cari opsi yang cocok
        nilai_ditemukan = False
        for opsi_kunci, nilai in opsi_bobot.items():
            if opsi_kunci.lower() in jawaban_lower or jawaban_lower in opsi_kunci.lower():
                total_skor += nilai
                nilai_ditemukan = True
                break # Ambil match pertama
        
        # Debugging jika tidak match (opsional)
        if not nilai_ditemukan:
            print(f"⚠️ Warning: Tidak ada match bobot untuk {kunci}: '{jawaban_user}'")

    return total_skor

def tentukan_desil(skor: float) -> dict:
    """
    Menentukan Desil dan Kategori berdasarkan Skor PMT.
    """
    if skor >= 41.26:
        return {"desil": "6-10", "kategori": "Aman / Mampu"}
    elif skor >= 33.01:
        return {"desil": "5", "kategori": "Menuju Aman"}
    elif skor >= 24.76:
        return {"desil": "4", "kategori": "Rentan Sedang"}
    elif skor >= 16.51:
        return {"desil": "3", "kategori": "Hampir Rentan"}
    elif skor >= 8.26:
        return {"desil": "2", "kategori": "Keluarga Rentan"}
    else:
        return {"desil": "1", "kategori": "Sangat Rentan / Ekstrem"}

def proses_kalkulasi_desil(no_kk: str) -> dict:
    # 1. Ambil Data Aset
    aset_res = supabase.table("aset_keluarga").select("*").eq("no_kk", no_kk).execute()
    
    if not aset_res.data:
        raise Exception("Data aset belum lengkap.")
    
    aset_data = aset_res.data[0]
    
    # 2. Hitung Skor (Logika Bobot)
    skor_pmt = hitung_skor_pmt(aset_data) # Pastikan fungsi ini ada
    
    # 3. Tentukan Desil
    hasil = tentukan_desil(skor_pmt) # Pastikan fungsi ini ada
    
    # 4. ✅ SIMPAN KE DATABASE (PERHATIKAN NAMA KOLOM)
    from datetime import datetime
    payload_update = {
        "skor_pmt": round(skor_pmt, 2),
        "hasil_desil": str(hasil["desil"]), # Ubah ke string
        "tanggal_hitung_desil": datetime.now().isoformat()
    }
    
    print(f"📝 Updating DB for KK {no_kk} with: {payload_update}")

    update_res = supabase.table("keluarga").update(payload_update).eq("no_kk", no_kk).execute()
    
    if not update_res.data:
        # Seringkali Supabase tidak return error tapi data kosong jika RLS blokir atau ID salah
        raise Exception("Gagal menyimpan ke DB. Cek RLS atau No KK.")
    
    return {
        "no_kk": no_kk,
        "skor_pmt": payload_update["skor_pmt"],
        "hasil_desil": payload_update["hasil_desil"],
        "kategori_desil": hasil["kategori_desil"]
    }