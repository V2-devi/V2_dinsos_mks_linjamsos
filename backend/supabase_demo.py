from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE.KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Insert a new row table row into table
# new_row = {'nama': 'John Doe'}
# supabase.table('users').insert(new_row).execute()

# new_row = {'nama' : 'Jane Doe'}
# supabase.table('users').update(new_row).eq('id', 2).execute()

# Delete record
# supabase.table('users').delete().eq('id', 2).execute()

# Fetch all records
# results = supabase.table('users').select('*').execute()
# print(results)

# response = supabase.storage.from_('users_bucket').get_public_url('per_class_accuracy (1).png')
# print(response)