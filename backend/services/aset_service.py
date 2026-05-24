from supabase import create_client
from schemas.aset_schema import AsetCreate
import os
from dotenv import load_dotenv


from config.database import supabase



def update_aset_service(no_kk: str, data: dict):
    print(f"\n--- [BE] Menerima Request Update Aset ---")
    print(f"[BE] No KK: {no_kk}")
    print(f"[BE] Raw Data: {data}")

    # 1. Filter Data
    payload = {
        k: v for k, v in data.items() 
        if k.startswith('v') and v is not None and v != ""
    }
    
    print(f"[BE] Cleaned Payload (v01-v39): {payload}")

    if not payload:
        raise Exception("Payload kosong setelah difilter. Cek nama field (harus v01, v02, dst).")

    payload['no_kk'] = no_kk

    try:
        # 2. Cek Existing
        print(f"[BE] Mengecek existing data untuk No KK: {no_kk}...")
        existing = supabase.table("aset_keluarga") \
            .select("id") \
            .eq("no_kk", no_kk) \
            .execute()
        
        print(f"[BE] Hasil Cek Existing: {existing.data}")

        # 3. Insert / Update
        if existing.data:
            print("[BE] Melakukan UPDATE...")
            result = supabase.table("aset_keluarga") \
                .update(payload) \
                .eq("no_kk", no_kk) \
                .execute()
        else:
            print("[BE] Melakukan INSERT...")
            result = supabase.table("aset_keluarga") \
                .insert(payload) \
                .execute()

        print(f"[BE] Result Supabase: {result}")
        
        if not result.data:
            # Seringkali Supabase return error di dalam result jika RLS gagal
            if hasattr(result, 'error') and result.error:
                raise Exception(f"Supabase Error: {result.error.message}")
            raise Exception("Gagal menyimpan: Tidak ada data return dari Supabase.")

        # 4. ✅ RESET HASIL DESIL KE MENUNGGU PENENTUAN
        print(f"[BE] Mereset hasil_desil untuk No KK: {no_kk}")
        reset_desil = supabase.table("keluarga") \
            .update({
                "hasil_desil": "Belum Dihitung"
            }) \
            .eq("no_kk", no_kk) \
            .execute()
        
        print(f"[BE] Reset Desil Result: {reset_desil}")

        return result.data[0]

    except Exception as e:
        print(f"🔥 [BE] EXCEPTION: {str(e)}")
        raise e

def get_aset_by_nokk_service(no_kk: str):
    result = supabase.table("aset_keluarga") \
        .select("*") \
        .eq("no_kk", no_kk) \
        .single() \
        .execute()
    return result.data

# load_dotenv()

# supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))


# def create_aset(data: AsetCreate):

#     payload = data.model_dump()

#     # DEBUG WAJIB
#     print("PAYLOAD ASET:", payload)

#     result = supabase.table("aset_keluarga") \
#         .insert(payload) \
#         .execute()

#     if not result.data:
#         raise Exception("Insert gagal")

#     return result.data


# def get_aset(no_kk: str):

#     result = supabase.table("aset_keluarga") \
#         .select("*") \
#         .eq("no_kk", no_kk) \
#         .execute()

#     return result.data




# def update_aset(no_kk: str, data: dict):
#     # 1. Bersihkan payload: Ambil hanya field v01 - v39
#     payload = {
#         k: v for k, v in data.items() 
#         if k.startswith('v') and v is not None and v != ""
#     }
    
#     # Tambahkan no_kk sebagai referensi
#     payload['no_kk'] = no_kk

#     if not payload:
#         raise Exception("Tidak ada data aset valid untuk disimpan")

#     print(f"📦 PAYLOAD ASET: {payload}")

#     # 2. Cek apakah data aset untuk KK ini sudah ada?
#     existing = supabase.table("aset_keluarga") \
#         .select("id") \
#         .eq("no_kk", no_kk) \
#         .execute()

#     if existing.data and len(existing.data) > 0:
#         # ✅ UPDATE (Jika sudah ada)
#         print("🔄 Melakukan Update pada data aset yang ada...")
#         result = supabase.table("aset_keluarga") \
#             .update(payload) \
#             .eq("no_kk", no_kk) \
#             .execute()
#     else:
#         # ✅ INSERT (Jika belum ada)
#         print("Melakukan Insert data aset baru...")
#         result = supabase.table("aset_keluarga") \
#             .insert(payload) \
#             .execute()

#     if not result.data:
#         raise Exception("Gagal menyimpan data aset ke Supabase")

#     return result.data[0]