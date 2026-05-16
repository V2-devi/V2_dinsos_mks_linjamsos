# from fastapi import APIRouter
# from schemas.ppks_schema import PPKS

# from services.ppks_service import (
#     get_all_ppks_service,
#     get_ppks_by_id_service,
#     create_ppks_service,
#     update_ppks_service,
#     delete_ppks_service
# )

# router = APIRouter()

# router = APIRouter(prefix="/PPKS", tags=["PPKS"])
# # ==============================
# # GET ALL
# # ==============================
# @router.get("/")
# def get_all_ppks():

#     return get_all_ppks_service()


# # ==============================
# # GET DETAIL
# # ==============================
# @router.get("/ppks/{id}")
# def get_ppks_by_id(id: str):

#     return get_ppks_by_id_service(id)


# # ==============================
# # CREATE
# # ==============================
# @router.post("/")
# def create_ppks(data: PPKS):

#     return create_ppks_service(data)


# # ==============================
# # UPDATE
# # ==============================
# @router.put("/ppks/{id}")
# def update_ppks(id: str, data: dict):

#     return update_ppks_service(id, data)


# # ==============================
# # DELETE
# # ==============================
# @router.delete("/ppks/{id}")
# def delete_ppks(id: str):

#     return delete_ppks_service(id)