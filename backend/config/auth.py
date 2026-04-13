from config.database import supabase

# REGISTER
def sign_up(email: str, password: str):
    return supabase.auth.sign_up({
        "email": email,
        "password": password
    })

# LOGIN
def sign_in(email: str, password: str):
    return supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })

# GET USER DARI TOKEN
def get_user(token: str):
    return supabase.auth.get_user(token)

# LOGOUT
def sign_out():
    return supabase.auth.sign_out()