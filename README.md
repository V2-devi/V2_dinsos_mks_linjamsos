# 📋 sicadas - Sistem cadangan data sosial

Sistem informasi terpadu untuk manajemen data keluarga, Data Terpadu Kesejahteraan Sosial (DTSEN), Pengusulan Bansos, dan Penanganan PPKS (Penyandang Problema Kesejahteraan Sosial) berbasis web dengan dukungan real-time notifications dan fitur export/import data.


---

## 🌟 Fitur Utama

### 👥 Manajemen Data Keluarga
- CRUD data keluarga lengkap (Kepala Keluarga + Anggota)
- Upload & preview dokumen **Surat Kematian** (PDF)
- Pencarian & filter data real-time
- Tracking kondisi khusus (kehamilan, disabilitas, penyakit kronis)

### 📊 Data Terpadu Kesejahteraan Sosial (DTSEN)
- Manajemen data warga terpadu
- Kategorisasi desil kesejahteraan
- Integrasi dengan data keluarga

### 💰 Pengusulan Bantuan Sosial
- Dashboard statistik pengusulan per periode (Q1-Q4)
- Multi-level approval workflow (Staff → Verifikator → Admin)
- Status tracking real-time: `Belum` → `Layak` / `Tidak Layak`
- Riwayat bantuan per keluarga

### 🏥 Penanganan PPKS
- Pencatatan kasus PPKS
- Upload bukti foto dokumentasi
- Tracking status penanganan

### 📥 Export & Import Data
- Export CSV dengan header rapi (siap cetak/laporan)
- Import CSV dengan **auto reverse mapping** (header user-friendly ↔ kolom DB)
- Validasi data otomatis (tipe numerik, FK constraint, duplikat)
- Mode import: **UPSERT** (update/insert) atau **INSERT** murni

### 🔐 Autentikasi & Keamanan
- Multi-role: `Admin`, `Staff`, `Verifikator`
- JWT-based authentication
- Row-Level Security (RLS) di Supabase
- File validation & size limit

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Frontend** | React 18, Vite, React Router |
| **Backend** | Python 3.10+, FastAPI, Uvicorn |
| **Database** | PostgreSQL (via Supabase) |
| **Storage** | Supabase Storage |
| **Auth** | Supabase Auth + JWT |
| **Styling** | CSS Custom / Tailwind |

---
