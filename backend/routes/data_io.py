# 📂 backend/routes/data_io.py
import csv
import io
import re
import datetime
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
    # "Nama Lengkap": "nama_lengkap",
    "Nama Lengkap": "nama_kepala_keluarga",
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

    # Tangani kolom tanggal: konversi berbagai format lokal ke ISO (YYYY-MM-DD)
    if "tanggal" in db_col or db_col.endswith("_tgl") or db_col in {"tanggal_lahir", "tanggal_usulan", "tanggal_penemuan"}:
        def try_parse_date(text):
            txt = text.strip()
            # Coba ISO first
            try:
                d = datetime.date.fromisoformat(txt)
                return d.isoformat()
            except Exception:
                pass

            # Common numeric formats
            for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%d.%m.%Y"):
                try:
                    d = datetime.datetime.strptime(txt, fmt).date()
                    return d.isoformat()
                except Exception:
                    pass

            # Indonesian month names (both full and common uppercase)
            months = {
                'januari': 1, 'jan': 1,
                'februari': 2, 'feb': 2,
                'maret': 3, 'mar': 3,
                'april': 4, 'apr': 4,
                'mei': 5, 'may': 5,
                'juni': 6, 'jun': 6,
                'juli': 7, 'jul': 7,
                'agustus': 8, 'agu': 8, 'august': 8,
                'september': 9, 'sep': 9,
                'oktober': 10, 'okt': 10, 'oct': 10,
                'november': 11, 'nov': 11,
                'desember': 12, 'des': 12, 'dec': 12
            }

            # Pattern like '31 MEI 2026' or '31 Mei 2026'
            m = re.match(r"^(\d{1,2})\s+([^\d,./-]+)\s+(\d{4})$", txt, flags=re.IGNORECASE)
            if m:
                day = int(m.group(1))
                month_token = m.group(2).strip().lower()
                month_token = re.sub(r"[^a-z]+", "", month_token)
                year = int(m.group(3))
                mon = months.get(month_token)
                if mon:
                    try:
                        return datetime.date(year, mon, day).isoformat()
                    except Exception:
                        return None

            # Fallback: try to extract day, month number and year from tokens
            digits = re.findall(r"\d+", txt)
            if len(digits) == 3:
                d0, d1, d2 = digits
                # heuristics: if first is year
                try:
                    if len(d0) == 4:
                        year = int(d0); month = int(d1); day = int(d2)
                    else:
                        day = int(d0); month = int(d1); year = int(d2)
                    return datetime.date(year, month, day).isoformat()
                except Exception:
                    return None

            return None

        parsed = try_parse_date(s)
        return parsed if parsed is not None else s

    # Biarkan teks dan nilai lainnya tetap sebagai string
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

# Perkiraan kolom valid per tabel untuk membantu validasi header CSV sebelum insert/upsert.
TABLE_EXPECTED_COLUMNS = {
    "pengusulan_bansos": {"no_kk", "tanggal_usulan", "penginput", "catatan_verifikator_bansos", "alamat", "kecamatan", "kelurahan", "nik", "status_pengusulan", "nama_kepala_keluarga", "jenis_bansos", "id"},
    "keluarga": {"no_kk", "nama_kepala_keluarga", "alamat", "rt", "rw", "kecamatan", "kelurahan", "nik", "tanggal_lahir", "jenis_kelamin", "pekerjaan", "penghasilan", "kondisi_khusus", "id"},
    "ppks": {"kategori_ppks", "lokasi_penemuan", "tanggal_penemuan", "catatan_verifikator", "nik", "id"}
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

        # ✅ 1.b Validasi: periksa apakah ada header/kolom hasil mapping yang tidak dikenali
        all_keys = set()
        for r in mapped_rows:
            all_keys.update([k for k in r.keys() if k])
        expected = TABLE_EXPECTED_COLUMNS.get(table, None)
        if expected is not None:
            unknown = sorted([k for k in all_keys if k not in expected])
            if unknown:
                # Kembalikan detail terstruktur agar FE dapat menampilkan alert yang spesifik
                raise HTTPException(
                    status_code=400,
                    detail={
                        "message": "Header CSV tidak dikenali atau tidak cocok dengan struktur tabel. Gunakan file Export sebagai template.",
                        "invalid_columns": unknown
                    }
                )

        # Hapus baris yang tidak punya data setelah normalisasi
        mapped_rows = [row for row in mapped_rows if row and any(v is not None for v in row.values())]

        # ✅ 2. Tentukan Kolom Unik (Conflict Column)
        # Jika tabel ada di daftar, pakai kolomnya. Jika tidak, default ke "id".
        conflict_col = CONFLICT_COLUMNS.get(table, "id")
        
        # ✅ 3. Logika Upsert vs Insert
        first_row = mapped_rows[0] if mapped_rows else {}
        
        # Hanya lakukan UPSERT jika CSV memang menyertakan kolom konflik dan
        # setidaknya satu baris memiliki nilai non-empty untuk kolom tersebut.
        should_try_upsert = False
        if conflict_col in first_row:
            for r in mapped_rows:
                val = r.get(conflict_col)
                if val not in (None, "", []):
                    should_try_upsert = True
                    break

        if should_try_upsert:
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
                    except Exception:
                        raise
                else:
                    # Re-raise untuk ditangani oleh blok error umum di bawah
                    raise
        else:
            # ✅ KOLOM UNIK TIDAK ADA ATAU KOSONG -> INSERT Murni (Hanya Tambah Baru)
            print(f"⚠️ Kolom '{conflict_col}' tidak ditemukan atau kosong pada semua baris. Menggunakan INSERT murni.")
            result = supabase.table(table).insert(mapped_rows).execute()
            mode = "INSERT"
            
        # Periksa respon Supabase secara eksplisit
        # Beberapa driver mengembalikan object dengan atribut `data` dan `error`.
        err = getattr(result, 'error', None) if result is not None else None
        data = getattr(result, 'data', None) if result is not None else None
        if err:
            raise HTTPException(status_code=400, detail=f"Supabase error: {err}")

        inserted = len(data) if data else 0
        if inserted == 0:
            return {"message": f"⚠️ Tidak ada baris yang ditambahkan atau diubah ({mode}). Periksa isi CSV dan kolom unik.", "count": 0}

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