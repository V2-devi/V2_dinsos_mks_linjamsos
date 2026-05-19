from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes.profile_routes import router as profile_router
from routes.admin_routes import router as admin_router
from routes.bansos_routes import router as bansos_router
from routes.keluarga_routes import router as keluarga_router
from routes.ppks_routes import router as ppks_router
from routes.aset_routes import router as aset_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
     allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(admin_router)
app.include_router(bansos_router)
app.include_router(keluarga_router)
app.include_router(ppks_router)
app.include_router(aset_router)