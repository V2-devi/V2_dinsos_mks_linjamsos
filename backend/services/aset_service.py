from config.database import supabase


# Ambil kategori berdasarkan indikator
def get_kategori_with_indikator():
    return supabase.table("kategori_aset") \
        .select("*, indikator_aset(*)") \
        .execute().data

# Simpan data keluarga
def create_aset_keluarga(id: str, data: list):
    payload = []

    for item in data:
        payload.append({
            "id": id,
            "indikator_id": item.get("indikator_id"),
            "kategori_id": item.get("kategori_id"),
            "nilai_angka": item.get("nilai_angka"),
            "nilai_text": item.get("niali_text")
        
        })
    result = supabase.table("aset_keluarga").insert(payload).execute().data
    return result.data

# Ambil aset keluarga dan detail indikator
def get_aset_keluarga(keluarga_id: str):
    return supabase.table("aset_keluarga") \
        .select("*, indikator_aset(*, kategori_aset(*))") \
        .eq("keluarga_id", keluarga_id) \
        .execute().data