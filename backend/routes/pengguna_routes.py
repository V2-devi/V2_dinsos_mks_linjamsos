# from fastapi import APIRouter, Request, Depends, UploadFile, File
# from fastapi.responses import HTMLResponse, RedirectResponse
# from ..database import supabase, SUPABASE_BUCKET, SUPABASE_URL
# from ..models import PenggunaCreate, EmployeeUpdate
# # from ..forms import as_form
# from fastpi.templating import Jinja2Template

# router = APIRouter()
# templates = Jinja2Template(directory="./routes/template.py ")

# @router.get("/", response_class=HTMLResponse)
# async def read_pengguna(request: Request):
#     response = supabase.table('pengguna').select('*').eq('is_active', True).execute()
#     pengguna = response.data
#     return templates.TemplateResponse("index.html", {"request": request, "pengguna":pengguna})


# @router.get("/add", response_class=HTMLResponse)
# async def add_penggguna(request=Request):
#     return templates.TemplateResponse("add_pengguna.html", {"request": request})

# @router.post("/add")
# async def add_pengguna(
#     request: Request,
#     pengguna: PenggunaCreate = Depends(PenggunaCreate),
#     image = UploadFile = File(None)
# ):
#     image_url = None
#     if image and image.filename != "":
#         image_filename = f"{pengguna.nama}_{image.filename}"
#         file_content = await image.read()
#         response = supabase.storage.from_(SUPABASE_BUCKET).upload(image_filename, file_content)
#         if response.status_code == 200:
#             image_url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{image_filename}"


#     supabase.table('pengguna').insert({
#         'name' = pengguna.nama,
#         'email' = pengguna.email
#     }).execute()


#     return RedirectResponse("/", status_code = 303)