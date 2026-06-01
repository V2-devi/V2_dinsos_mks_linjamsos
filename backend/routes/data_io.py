# 📂 backend/routes/data_io.py
import csv
import io
import re
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
from config.database import supabase
from config.auth import security

router = APIRouter(prefix="/data", tags=["Data IO"])

# 🔒 Hanya tabel ini yang boleh di-export/import
SUPPORTED_TABLES = {"keluarga", "pengusulan_bansos", "ppks"}
TABLE_ALIASES = {
    "dtsen": "keluarga",
    "bansos": "pengusulan_bansos",
}

# ==========================================
# ✅ TAMBAHKAN INI DI SINI
# ==========================================

# 1. Kamus Mapping: Header Rapi (CSV) → Kolom Database
HEADER_MAP = {
    # Keluarga
    "No. KK": "no_kk",
    "Nama Kepala Keluarga": "nama_kepala_keluarga",
    "Alamat Lengkap": "alamat",
    "RT": "rt", "RW": "rw",
    "Kecamatan": "kecamatan", "Kelurahan": "kelurahan",
    # DTSN
    "NIK": "nik",
    "Nama Lengkap": "nama_lengkap",
    "Tanggal Lahir": "tanggal_lahir",
    "Jenis Kelamin": "jenis_kelamin",
    "Pekerjaan": "pekerjaan",
    "Penghasilan (Rp)": "penghasilan",
    "Kondisi Khusus": "kondisi_khusus",
    # Usulan/Pengusulan
    "Tanggal Pengusulan": "tanggal_usulan",
    "Status": "status_pengusulan",
    "Status Pengusulan": "status_pengusulan",
    # PPKS
    "Kategori PPKS": "kategori_ppks",
    "Lokasi Penemuan": "lokasi_penemuan",
    "Tanggal Penemuan": "tanggal_penemuan",
    "Keterangan": "catatan_verifikator"
}

# 2. Fungsi Normalize Row (Menerjemahkan header CSV per baris)
import re

NORMALIZED_HEADER_MAP = {k.lower().strip(): v for k, v in HEADER_MAP.items()}

def sanitize_value(db_col: str, value):
    if value is None:
        return None
    s = str(value).strip()
    if s == "":
        return None

    if db_col in {"nik", "no_kk"}:
        digits = re.sub(r"[^0-9]", "", s)
        return digits if digits != "" else None

    if db_col in {"penghasilan", "skor_pmt"}:
        cleaned = s.replace(" ", "")
        # Jika ada tanda koma dan titik, anggap koma sebagai pemisah ribuan
        if "," in cleaned and "." in cleaned:
            cleaned = cleaned.replace(",", "")
        # Jika hanya ada koma, anggap sebagai desimal
        elif "," in cleaned:
            cleaned = cleaned.replace(",", ".")

        cleaned = re.sub(r"[^0-9\.\-]", "", cleaned)
        if cleaned in {"", "-", ".", "-."}:
            return None
        try:
            return float(cleaned)
        except ValueError:
            return None

    # Biarkan tanggal, teks, dan nilai lainnya tetap sebagai string
    return s


def normalize_row(row: dict) -> dict:
    normalized = {}
    for key, value in row.items():
        if key is None:
            continue

        normalized_key = str(key).strip().lstrip("\ufeff").strip()
        normalized_lower = normalized_key.lower()

        # Skip id columns entirely
        if normalized_lower in {"id", "_id", "id_", "id .", "id.", "#", "no", "no."}:
            continue

        db_col = NORMALIZED_HEADER_MAP.get(normalized_lower)
        if not db_col:
            fallback = normalized_lower.replace(" ", "_").replace(".", "").replace("/", "_")
            if fallback in {"id", "_id", "no", "no_"}:
                continue
            db_col = fallback

        normalized[db_col] = sanitize_value(db_col, value)
    return normalized

# 3. Daftar Kolom Unik Per Tabel (Untuk Upsert vs Insert)
CONFLICT_COLUMNS = {
    "keluarga": "no_kk",
    "dtsen": "nik",
    "bansos": "nik_penerima",
    "ppks": "nik",
    "pengusulan_bansos": "nik",
}

def validate_table(table: str) -> str:
    table_key = table.strip().lower()
    actual_table = TABLE_ALIASES.get(table_key, table_key)

    if actual_table not in SUPPORTED_TABLES:
        raise HTTPException(status_code=400, detail="Tabel tidak didukung. Gunakan: dtsen, keluarga, bansos, atau ppks")
    return actual_table

# ==========================================
# 📥 EXPORT CSV
# ==========================================
@router.get("/{table}/export")
async def export_csv(table: str, credentials = Depends(security)):
    table = validate_table(table)
    try:
        response = supabase.table(table).select("*").execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Data kosong")

        # Convert JSON → CSV
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=response.data[0].keys())
        writer.writeheader()
        writer.writerows(response.data)

        # utf-8-sig agar Excel tidak membaca karakter aneh
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode("utf-8-sig")),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={table}_export.csv"}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal export: {str(e)}")

# ==========================================
# 📤 IMPORT CSV (dengan UPSERT anti-duplikat)
# ==========================================
@router.post("/{table}/import")
async def import_csv(table: str, file: UploadFile = File(...), credentials = Depends(security)):
    table = validate_table(table)
    try:
        content = await file.read()
        text_content = content.decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(text_content))
        rows = list(reader)
        
        if not rows:
            raise HTTPException(status_code=400, detail="File CSV kosong")

        # ✅ 1. Auto Reverse Mapping (Header Rapi -> Kolom DB)
        mapped_rows = [normalize_row(row) for row in rows]

        # Hapus baris yang tidak punya data setelah normalisasi
        mapped_rows = [row for row in mapped_rows if row and any(v is not None for v in row.values())]

        # ✅ 2. Tentukan Kolom Unik (Conflict Column)
        # Jika tabel ada di daftar, pakai kolomnya. Jika tidak, default ke "id".
        conflict_col = CONFLICT_COLUMNS.get(table, "id")
        
        # ✅ 3. Logika Upsert vs Insert
        first_row = mapped_rows[0] if mapped_rows else {}
        
        if conflict_col in first_row:
            # ✅ KOLOM UNIK ADA DI CSV -> Coba UPSERT
            try:
                result = supabase.table(table).upsert(mapped_rows, on_conflict=conflict_col).execute()
                mode = "UPSERT"
            except Exception as up_err:
                up_msg = str(up_err)
                # Jika Postgres menolak karena tidak ada unique constraint, fallback ke INSERT
                if 'there is no unique or exclusion constraint matching' in up_msg.lower() or 'no unique or exclusion constraint matching' in up_msg.lower():
                    print(f"⚠️ UPSERT gagal karena tidak ada constraint unik untuk '{conflict_col}'. Melakukan INSERT sebagai fallback.")
                    try:
                        result = supabase.table(table).insert(mapped_rows).execute()
                        mode = "INSERT (fallback from UPSERT)"
                    except Exception as ins_err:
                        raise
                else:
                    # Re-raise untuk ditangani oleh blok error umum di bawah
                    raise
        else:
            # ✅ KOLOM UNIK TIDAK ADA -> Fallback ke INSERT Murni (Hanya Tambah Baru)
            print(f"⚠️ Kolom '{conflict_col}' tidak ditemukan. Menggunakan INSERT murni.")
            result = supabase.table(table).insert(mapped_rows).execute()
            mode = "INSERT"
            
        inserted = len(result.data) if result.data else 0
        return {"message": f"✅ Berhasil proses {inserted} baris ({mode})", "count": inserted}
        
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        # ✅ Handle Error yang Jelas untuk Frontend
        if 'column "id" does not exist' in err_msg:
            raise HTTPException(
                status_code=400, 
                detail=f'Kolom unik "{CONFLICT_COLUMNS.get(table, "id")}" tidak ditemukan di CSV. '
                       f'Pastikan header CSV sesuai atau tambahkan kolom tersebut untuk update data.'
            )
        elif 'invalid input syntax for type numeric' in err_msg.lower() or 'invalid input syntax for type integer' in err_msg.lower():
            raise HTTPException(
                status_code=400,
                detail=(
                    'Format nilai numerik tidak valid di beberapa kolom CSV. '
                    'Periksa NIK, No. KK, Penghasilan, atau Skor PMT dan pastikan hanya berisi angka.'
                )
            )
        elif 'PGRST204' in err_msg or 'Could not find' in err_msg:
            raise HTTPException(status_code=400, detail="Header CSV tidak dikenali. Gunakan file Export sebagai template.")
        
        raise HTTPException(status_code=400, detail=f"Gagal import: {err_msg}")