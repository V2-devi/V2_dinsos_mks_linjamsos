from supabase import create_client
from dotenv import load_dotenv
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env") # ✅ Wajib load sebelum os.getenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET") # ✅ Nama harus sama dengan .env
SUPABASE_BUCKET_DOKUMEN = os.getenv("SUPABASE_BUCKET_DOKUMEN") # ✅

print("URL =", SUPABASE_URL)
print("KEY =", SUPABASE_SERVICE_ROLE_KEY)
print("BUCKET =", SUPABASE_BUCKET)
print("BUCKET_DOKUMEN =", SUPABASE_BUCKET_DOKUMEN)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)