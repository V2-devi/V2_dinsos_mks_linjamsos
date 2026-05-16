# from config.supabase import supabase


# # ==============================
# # GET ALL PPKS
# # ==============================
# def get_all_ppks_service():

#     response = supabase.table("ppks") \
#         .select("*") \
#         .order("id", desc=True) \
#         .execute()

#     return response.data


# # ==============================
# # GET DETAIL PPKS
# # ==============================
# def get_ppks_by_id_service(id: str):

#     response = supabase.table("ppks") \
#         .select("*") \
#         .eq("id", id) \
#         .single() \
#         .execute()

#     return response.data


# # ==============================
# # CREATE PPKS
# # ==============================
# def create_ppks_service(data: dict):

#     supabase.table("ppks") \
#         .insert({
#             "nama": data["nama"],
#             "kategori_ppks": data["kategori_ppks"],
#             "lokasi_penemuan": data["lokasi_penemuan"],
#             "tgl_laporan": data["tgl_laporan"],
#             "status": data["status"],
#             "detail": data["detail"]
#         }) \
#         .execute()

#     return {
#         "message": "PPKS berhasil ditambahkan"
#     }


# # ==============================
# # UPDATE PPKS
# # ==============================
# def update_ppks_service(id: str, data: dict):

#     supabase.table("ppks") \
#         .update({
#             "nama": data["nama"],
#             "kategori_ppks": data["kategori_ppks"],
#             "lokasi_penemuan": data["lokasi_penemuan"],
#             "tgl_laporan": data["tgl_laporan"],
#             "status": data["status"],
#             "detail": data["detail"]
#         }) \
#         .eq("id", id) \
#         .execute()

#     return {
#         "message": "PPKS berhasil diupdate"
#     }


# # ==============================
# # DELETE PPKS
# # ==============================
# def delete_ppks_service(id: str):

#     supabase.table("ppks") \
#         .delete() \
#         .eq("id", id) \
#         .execute()

#     return {
#         "message": "PPKS berhasil dihapus"
#     }