# 📂 backend/routes/data_io.py
import csv
import io
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
from config.database import supabase
from config.auth import security

router = APIRouter(prefix="/data", tags=["Data IO"])

# 🔒 Hanya tabel ini yang boleh di-export/import
ALLOWED_TABLES = {"keluarga", "pengusulan_bansos", "ppks"}

def validate_table(table: str) -> str:
    if table not in ALLOWED_TABLES:
        raise HTTPException(status_code=400, detail="Tabel tidak didukung. Gunakan: dtsen, bansos, atau ppks")
    return table

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
        text_content = content.decode("utf-8-sig") # Handle BOM Excel
        reader = csv.DictReader(io.StringIO(text_content))
        rows = list(reader)
        
        if not rows:
            raise HTTPException(status_code=400, detail="File CSV kosong")

        # ✅ UPSERT: Insert baru, update jika primary key (id) sudah ada
        result = supabase.table(table).upsert(rows, on_conflict="id").execute()
        
        inserted = len(result.data) if result.data else 0
        return {
            "message": f"✅ Berhasil proses {inserted} baris",
            "count": inserted
        }
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "duplicate key" in err_msg.lower() or "violates unique constraint" in err_msg.lower():
            err_msg = "Gagal: Header CSV tidak cocok dengan kolom database, atau ada constraint unik yang dilanggar."
        raise HTTPException(status_code=400, detail=f"Gagal import: {err_msg}")