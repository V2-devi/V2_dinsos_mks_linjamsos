# 📂 backend/routes/data_io.py
import csv
import io
import re
from datetime import datetime, date
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
from config.database import supabase
from config.auth import security

router = APIRouter(prefix="/data", tags=["Data IO"])

# ==========================================
# 🔒 KONFIGURASI TABEL
# ==========================================

# Tabel yang didukung (nama asli di database)
SUPPORTED_TABLES = {"keluarga", "pengusulan_bansos", "ppks"}

# Alias: nama panggilan → nama tabel asli
TABLE_ALIASES = {
    "dtsen": "keluarga",
    "bansos": "pengusulan_bansos",
}

# ==========================================
# 📋 TEMPLATE EXPORT
# ==========================================

EXPORT_COLUMNS = {
    "keluarga": [
        ("No. KK", "no_kk"),
        ("NIK", "nik"),
        ("Nama Kepala Keluarga", "nama_kepala_keluarga"),
        ("Tanggal Lahir", "tanggal_lahir"),
        ("Jenis Kelamin", "jenis_kelamin"),
        ("Kecamatan", "kecamatan"),
        ("Kelurahan", "kelurahan"),
        ("Alamat Lengkap", "alamat"),
        ("Desil", "hasil_desil"),
    ],
    "ppks": [
        ("NIK", "nik"),
        ("Nama", "nama_lengkap"),
        ("Kategori PPKS", "kategori_ppks"),
        ("Kecamatan", "kecamatan"),
        ("Kelurahan", "kelurahan"),
        ("Lokasi Penemuan", "lokasi_penemuan"),
        ("Tanggal Laporan", "tanggal_penemuan"),
        ("Status", "status_penanganan"),
        ("Keterangan", "catatan_verifikator"),
    ],
    "pengusulan_bansos": [
        ("No. KK", "no_kk"),
        ("NIK", "nik"),
        ("Nama Kepala Keluarga", "nama_kepala_keluarga"),
        ("Tanggal Pengusulan", "tanggal_usulan"),
        ("Kecamatan", "kecamatan"),
        ("Kelurahan", "kelurahan"),
        ("Alamat", "alamat"),
        ("Status", "status_pengusulan"),
        ("Keterangan", "catatan_verifikator_bansos"),
    ],
}

# ==========================================
# 🗺️ MAPPING HEADER (CSV → DATABASE)
# ==========================================

HEADER_MAP = {
    # Keluarga
    "No. KK": "no_kk",
    "Nama Kepala Keluarga": "nama_kepala_keluarga",
    "Alamat Lengkap": "alamat",
    "Alamat": "alamat",


    "RT": "rt",
    "RW": "rw",
    "Kecamatan": "kecamatan",
    "Kelurahan": "kelurahan",
    "Desil": "hasil_desil",
    # DTSN
    "NIK": "nik",
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
    "Jenis Bansos": "jenis_bansos",
    # PPKS
    "Nama": "nama_lengkap",
    "Kategori PPKS": "kategori_ppks",
    "Lokasi Penemuan": "lokasi_penemuan",
    "Tanggal Laporan": "tanggal_penemuan",
    "Tanggal Penemuan": "tanggal_penemuan",
    "Keterangan": "catatan_verifikator",
    
}

# Override khusus per tabel untuk header yang ambigu (misal: "Status")
TABLE_SPECIFIC_HEADER_MAPS = {
    "keluarga": {
        "status": "status_pengusulan"
    },
    "pengusulan_bansos": {
        "status": "status_pengusulan",
        "keterangan": "catatan_verifikator_bansos",
        "Nama kepala keluarga": "nama_kepala_keluarga",
    },
    "ppks": {
        "status": "status_penanganan"
    }
}

# Pre-lowercase untuk pencarian cepat
NORMALIZED_HEADER_MAP = {k.lower().strip(): v for k, v in HEADER_MAP.items()}

# ==========================================
# 🔑 KOLOM UNIK PER TABEL (UPSERT)
# ==========================================

CONFLICT_COLUMNS = {
    "keluarga": "no_kk",
    "dtsen": "nik",
    "bansos": "nik_penerima",
    "ppks": "nik",
    "pengusulan_bansos": "nik",
}

# ==========================================
# ✅ KOLOM YANG DIHARAPKAN PER TABEL
# ==========================================

TABLE_EXPECTED_COLUMNS = {
    "pengusulan_bansos": {
        "no_kk", "tanggal_usulan", "catatan_verifikator_bansos",
        "alamat", "kecamatan", "kelurahan", "nik", "status_pengusulan",
        "nama_kepala_keluarga", "jenis_bansos", "id", "created_at",
        "catatan_verifikator",
        "catatan_verifikator",
        "tanggal_pengusulan",
        "status",
        "updated_at",
        "user_id",
        "nama_lengkap",
        "nama",
    },
    "keluarga": {
        "no_kk", "nama_kepala_keluarga", "alamat", "kecamatan",
        "kelurahan", "nik", "tanggal_lahir", "jenis_kelamin", "pekerjaan",
        "kategori_desil", "kondisi_khusus", "hasil_desil", "user_id",
        "tanggal_hitung_desil", "status_pengusulan", "updated_at", "skor_pmt",
        "tanggal_terakhir_update",
    },
    "ppks": {
        "kategori_ppks", "lokasi_penemuan", "tanggal_penemuan",
        "catatan_verifikator", "nik", "nama_lengkap", "status_penanganan",
        "id", "created_at", "kecamatan", "kelurahan",
    },
}

# ==========================================
# ⚙️ AUTO-FILL KOLOM WAJIB (DEFAULT VALUES)
# ==========================================

TABLE_DEFAULTS = {
    "keluarga": {
        "tanggal_hitung_desil": lambda: datetime.now().strftime("%Y-%m-%d"),
    },
    "pengusulan_bansos": {},
    "ppks": {},
}


def apply_table_defaults(row: dict, table: str) -> dict:
    """
    Auto-fill kolom wajib yang kosong dengan default value.
    Hanya mengisi jika key belum ada ATAU nilainya None/empty.
    """
    defaults = TABLE_DEFAULTS.get(table, {})
    if not defaults:
        return row

    for col, generator in defaults.items():
        if col not in row or row[col] is None or str(row[col]).strip() == "":
            row[col] = generator()

    return row

    


# ==========================================
# 🛠️ HELPER FUNCTIONS
# ==========================================

def validate_table(table: str) -> str:
    table_key = table.strip().lower()
    actual_table = TABLE_ALIASES.get(table_key, table_key)

    if actual_table not in SUPPORTED_TABLES:
        raise HTTPException(
            status_code=400,
            detail="Tabel tidak didukung. Gunakan: dtsen, keluarga, bansos, atau ppks"
        )
    return actual_table


def sanitize_value(db_col: str, value):
    """Membersihkan nilai CSV sebelum masuk ke database."""
    if value is None:
        return None
    s = str(value).strip()
    if s == "":
        return None

    # Kolom NIK & No KK: hanya angka
    if db_col in {"nik", "no_kk"}:
        digits = re.sub(r"[^0-9]", "", s)
        return digits if digits != "" else None

    # Kolom numerik (penghasilan, skor, dll)
    if db_col in {"penghasilan", "skor_pmt"}:
        cleaned = s.replace(" ", "")
        if "," in cleaned and "." in cleaned:
            cleaned = cleaned.replace(",", "")
        elif "," in cleaned:
            cleaned = cleaned.replace(",", ".")

        cleaned = re.sub(r"[^0-9\.\-]", "", cleaned)
        if cleaned in {"", "-", ".", "-."}:
            return None
        try:
            return float(cleaned)
        except ValueError:
            return None

    # Kolom tanggal: konversi berbagai format ke ISO (YYYY-MM-DD)
    if "tanggal" in db_col or db_col.endswith("_tgl") or db_col in {
        "tanggal_lahir", "tanggal_usulan", "tanggal_penemuan"
    }:
        parsed = try_parse_date(s)
        return parsed if parsed is not None else s

    return s


def try_parse_date(text: str):
    """Coba parse tanggal dari berbagai format."""
    txt = text.strip()

    # 1. Format ISO
    try:
        d = date.fromisoformat(txt)
        return d.isoformat()
    except Exception:
        pass

    # 2. Format numerik umum
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%d.%m.%Y"):
        try:
            d = datetime.strptime(txt, fmt).date()
            return d.isoformat()
        except Exception:
            pass

    # 3. Format dengan nama bulan Indonesia (31 MEI 2026)
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

    m = re.match(r"^(\d{1,2})\s+([^\d,./-]+)\s+(\d{4})$", txt, flags=re.IGNORECASE)
    if m:
        day = int(m.group(1))
        month_token = re.sub(r"[^a-z]+", "", m.group(2).strip().lower())
        year = int(m.group(3))
        mon = months.get(month_token)
        if mon:
            try:
                return date(year, mon, day).isoformat()
            except Exception:
                return None

    # 4. Fallback: heuristik dari 3 angka (DD MM YYYY atau YYYY MM DD)
    digits = re.findall(r"\d+", txt)
    if len(digits) == 3:
        d0, d1, d2 = digits
        try:
            if len(d0) == 4:
                year, month, day = int(d0), int(d1), int(d2)
            else:
                day, month, year = int(d0), int(d1), int(d2)
            return date(year, month, day).isoformat()
        except Exception:
            return None

    return None


def normalize_row(row: dict, table: str) -> dict:
    """Terjemahkan header CSV menjadi nama kolom database."""
    normalized = {}
    unmapped = []  # ✅ tracking kolom yang tidak ada di map
    
    for key, value in row.items():
        if key is None:
            continue

        normalized_key = str(key).strip().lstrip("\ufeff").strip()
        if normalized_key == "":
            continue

        normalized_lower = normalized_key.lower()

        if normalized_lower in {"id", "_id", "id_", "id .", "id.", "#", "no", "no."}:
            continue

        specific_map = TABLE_SPECIFIC_HEADER_MAPS.get(table, {})
        if normalized_lower in specific_map:
            db_col = specific_map[normalized_lower]
        else:
            db_col = NORMALIZED_HEADER_MAP.get(normalized_lower)
            if not db_col:
                fallback = normalized_lower.replace(" ", "_").replace(".", "").replace("/", "_")
                if fallback == "" or fallback in {"id", "_id", "no", "no_"}:
                    continue
                db_col = fallback
                unmapped.append(f"'{normalized_key}' → '{db_col}'")  # ✅ log ini

        if db_col == "":
            continue

        normalized[db_col] = sanitize_value(db_col, value)
    
    if unmapped:
        print(f"⚠️ [{table}] Header tidak ada di HEADER_MAP (pakai fallback): {unmapped}")
        
    
    return normalized


# ==========================================
# 📥 EXPORT CSV
# ==========================================

@router.get("/{table}/export")
async def export_csv(table: str, credentials=Depends(security)):
    table = validate_table(table)
    try:
        response = supabase.table(table).select("*").execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Data kosong")

        output = io.StringIO()
        export_columns = EXPORT_COLUMNS.get(table)

        if export_columns:
            fieldnames = [header for header, _ in export_columns]
            writer = csv.DictWriter(output, fieldnames=fieldnames)
            writer.writeheader()
            for item in response.data:
                writer.writerow({
                    header: item.get(col, "")
                    for header, col in export_columns
                })
        else:
            writer = csv.DictWriter(output, fieldnames=response.data[0].keys())
            writer.writeheader()
            writer.writerows(response.data)

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
# 📤 IMPORT CSV (dengan Auto Mapping + Upsert)
# ==========================================

@router.post("/{table}/import")
async def import_csv(
    table: str,
    file: UploadFile = File(...),
    credentials=Depends(security)
):
    table = validate_table(table)
    try:
        content = await file.read()
        text_content = content.decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(text_content))
        rows = list(reader)

        if not rows:
            raise HTTPException(status_code=400, detail="File CSV kosong")

        # ✅ 1. Auto Reverse Mapping (Header Rapi → Kolom DB)
        mapped_rows = [normalize_row(row, table) for row in rows]

        # ✅ 1.a Auto-Fill Kolom Wajib dengan Default Value
        mapped_rows = [apply_table_defaults(row, table) for row in mapped_rows]

        # ✅ Filter kolom readonly
        READONLY_COLUMNS = {"created_at", "updated_at", "id"}
        mapped_rows = [
            {k: v for k, v in row.items() if k not in READONLY_COLUMNS}
            for row in mapped_rows
        ]

        # ✅ 1.b Validasi: cek apakah ada header yang tidak dikenali
        # ✅ 1.b Validasi: cek apakah ada header yang tidak dikenali
        all_keys = set()
        for r in mapped_rows:
            all_keys.update([k for k in r.keys() if k])
        # ✅ DEBUG — paste di dalam @router.post("/{table}/import"), sebelum: if expected is not None:
        print(f"\n{'='*60}")
        print(f"📋 TABLE: {table}")
        all_keys_debug = set()
        for r in mapped_rows:
            all_keys_debug.update(r.keys())
        expected_debug = TABLE_EXPECTED_COLUMNS.get(table, set())
        unknown_debug = sorted([k for k in all_keys_debug if k not in expected_debug])
        print(f"📥 Semua kolom hasil mapping : {sorted(all_keys_debug)}")
        print(f"✅ Kolom expected            : {sorted(expected_debug)}")
        print(f"❌ Kolom UNKNOWN             : {unknown_debug}")
        print(f"{'='*60}\n")

        expected = TABLE_EXPECTED_COLUMNS.get(table, None)
        if expected is not None:
            unknown = sorted([k for k in all_keys if k not in expected])
            if unknown:
                expected_headers = sorted(list(expected))
                
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"⚠️ File CSV memiliki {len(unknown)} kolom yang tidak dikenali sistem.\n\n"
                        f"❌ Kolom bermasalah: {', '.join(unknown)}\n\n"
                        f"✅ Kolom yang diizinkan untuk tabel '{table}':\n"
                        f"{', '.join(expected_headers)}\n\n"
                        f"💡 Solusi: Gunakan file Export sebagai template, atau hapus kolom yang tidak dikenali dari CSV."
                    )
                )

        # ✅ 1.c Hapus baris kosong
        mapped_rows = [
            row for row in mapped_rows
            if row and any(v is not None for v in row.values())
        ]

        if not mapped_rows:
            return {
                "message": "⚠️ CSV tidak berisi data valid setelah pemetaan.",
                "count": 0
            }

        # ✅ 2. Tentukan Kolom Unik (Conflict Column)
        conflict_col = CONFLICT_COLUMNS.get(table, "id")

        # ✅ 3. Logika Upsert vs Insert
        first_row = mapped_rows[0] if mapped_rows else {}

        should_try_upsert = False
        if conflict_col in first_row:
            for r in mapped_rows:
                val = r.get(conflict_col)
                if val not in (None, "", []):
                    should_try_upsert = True
                    break

        if should_try_upsert:
            try:
                result = supabase.table(table).upsert(
                    mapped_rows, on_conflict=conflict_col
                ).execute()
                mode = "UPSERT"
            except Exception as up_err:
                up_msg = str(up_err)
                # Jika tidak ada unique constraint, fallback ke INSERT
                if 'no unique or exclusion constraint' in up_msg.lower():
                    print(f"⚠️ UPSERT gagal karena tidak ada constraint unik "
                          f"untuk '{conflict_col}'. Fallback ke INSERT.")
                    result = supabase.table(table).insert(mapped_rows).execute()
                    mode = "INSERT (fallback)"
                else:
                    raise
        else:
            print(f"⚠️ Kolom '{conflict_col}' tidak ditemukan/kosong. "
                  f"Menggunakan INSERT murni.")
            result = supabase.table(table).insert(mapped_rows).execute()
            mode = "INSERT"

        # ✅ 4. Cek respon Supabase
        err = getattr(result, 'error', None) if result is not None else None
        data = getattr(result, 'data', None) if result is not None else None
        if err:
            raise HTTPException(status_code=400, detail=f"Supabase error: {err}")

        inserted = len(data) if data else 0
        if inserted == 0:
            return {
                "message": (
                    f"⚠️ Tidak ada baris yang ditambahkan/diubah ({mode}). "
                    f"Periksa isi CSV dan kolom unik."
                ),
                "count": 0
            }

        return {
            "message": f"✅ Berhasil proses {inserted} baris ({mode})",
            "count": inserted
        }

    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)

        # 🎯 Handle Error Spesifik dengan Pesan Jelas

        # Kasus 1: Kolom id tidak ditemukan
        if 'column "id" does not exist' in err_msg:
            raise HTTPException(
                status_code=400,
                detail=(
                    f'Kolom unik "{CONFLICT_COLUMNS.get(table, "id")}" '
                    f'tidak ditemukan di CSV. Pastikan header CSV sesuai '
                    f'atau tambahkan kolom tersebut untuk update data.'
                )
            )

        # Kasus 2: Format numerik invalid
        elif ('invalid input syntax for type numeric' in err_msg.lower() or
              'invalid input syntax for type integer' in err_msg.lower()):
            raise HTTPException(
                status_code=400,
                detail=(
                    'Format nilai numerik tidak valid di beberapa kolom CSV. '
                    'Periksa NIK, No. KK, Penghasilan, atau Skor PMT '
                    'dan pastikan hanya berisi angka.'
                )
            )

        # Kasus 3: Header tidak dikenal (PGRST204)
        elif 'PGRST204' in err_msg or 'Could not find' in err_msg:
            raise HTTPException(
                status_code=400,
                detail="Header CSV tidak dikenali. Gunakan file Export sebagai template."
            )

        # Kasus 4: NOT NULL constraint (KOLOM WAJIB KOSONG)
        elif 'violates not-null constraint' in err_msg.lower() or '23502' in err_msg:
            match = re.search(r'column "([^"]+)"', err_msg)
            col_name = match.group(1) if match else "kolom tertentu"

            raise HTTPException(
                status_code=400,
                detail=(
                    f'Kolom "{col_name}" tidak boleh kosong.\n\n'
                    f'Solusi:\n'
                    f'1. Tambahkan kolom "{col_name}" ke CSV, atau\n'
                    f'2. Ubah kolom di database menjadi nullable:\n'
                    f'   ALTER TABLE {table} ALTER COLUMN {col_name} DROP NOT NULL;\n'
                    f'3. Atau beri default value:\n'
                    f'   ALTER TABLE {table} ALTER COLUMN {col_name} SET DEFAULT NOW();'
                )
            )

        # Kasus 5: Foreign Key violation
        elif 'foreign key constraint' in err_msg.lower() or '23503' in err_msg:
            raise HTTPException(
                status_code=400,
                detail=(
                    'Data yang diimport melanggar relasi antar tabel (Foreign Key).\n\n'
                    'Pastikan data induk (misal: NIK di tabel DTSN) sudah ada '
                    'sebelum import data turunan.'
                )
            )

        # Kasus 6: Unique constraint violation
        elif 'duplicate key' in err_msg.lower() or '23505' in err_msg:
            raise HTTPException(
                status_code=400,
                detail=(
                    'Ada data duplikat yang bentrok dengan data yang sudah ada.\n'
                    'Pastikan kolom unik (NIK/No KK) tidak ada duplikat di CSV.'
                )
            )

        # Fallback umum
        raise HTTPException(status_code=400, detail=f"Gagal import: {err_msg}")