import API from "../api/api";

const AUTH_URL = "/auth";

// export const register = async (data) => {
//   const res = await API.post(`${AUTH_URL}/register`, data);
//   return res.data;
// };

// export const login = async (data) => {
//   const res = await API.post(`${AUTH_URL}/login`, data);
//   return res.data;
//  };


import { supabase } from "../config/supabase";

// Fungsi login yang sudah ada
export const login = async ({ email, password }) => {
  try {
    // 1. Login via backend custom (seperti biasa)
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || data.error || data.detail) {
      return { error: data.detail || data.error || "Login gagal" };
    }

    // 2. ✅ SINKRONISASI KE SUPABASE AUTH (BARU!)
    // Coba sign in ke Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    // Jika user belum ada di Supabase Auth, daftarkan sekarang
    if (authError && authError.message.includes("Invalid login credentials")) {
      console.log("🔄 User belum ada di Supabase Auth, mendaftarkan...");
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password, // Password yang sama dengan backend
        options: {
          data: {
            nama_lengkap: data.user.nama_lengkap,
            nip: data.user.nip,
            role: data.user.role
          }
        }
      });

      if (signUpError) {
        console.error("❌ Gagal daftar ke Supabase Auth:", signUpError);
      } else {
        console.log("✅ User berhasil didaftarkan ke Supabase Auth");
        
        // Confirm email otomatis (untuk development)
        // Di production, user harus konfirmasi email dulu
        if (signUpData.user) {
          // Sign in setelah sign up
          await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });
        }
      }
    }

    // 3. Return data seperti biasa
    return data;

  } catch (error) {
    console.error("Login error:", error);
    return { error: error.message };
  }
};

// Fungsi register (jika ada)
export const register = async ({ email, password, nama_lengkap, nip, role }) => {
  try {
    // 1. Register via backend custom
    const res = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nama_lengkap, nip, role })
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.detail || "Registrasi gagal" };
    }

    // 2. ✅ DAFTARKAN KE SUPABASE AUTH JUGA
    const { error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { nama_lengkap, nip, role }
      }
    });

    if (authError) {
      console.error("⚠️ Gagal daftar ke Supabase Auth:", authError);
    } else {
      console.log("✅ User terdaftar di Supabase Auth");
    }

    return data;

  } catch (error) {
    console.error("Register error:", error);
    return { error: error.message };
  }
};