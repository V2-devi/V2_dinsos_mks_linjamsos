from supabase import create_client
from dotenv import load_dotenv
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env") # ✅ Wajib load sebelum os.getenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET") # ✅ Nama harus sama dengan .env

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)