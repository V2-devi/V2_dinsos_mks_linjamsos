// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in environment variables.");
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// ✅ Supabase standar menggunakan VITE_SUPABASE_ANON_KEY. 
// Jika di .env Anda namanya VITE_SUPABASE_KEY, fallback akan bekerja.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Cek file .env Anda.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // ✅ WAJIB: Simpan sesi di localStorage
    autoRefreshToken: true,      // ✅ Refresh token otomatis sebelum expired
    detectSessionInUrl: true     // ✅ Deteksi login dari redirect OAuth
  }
});

