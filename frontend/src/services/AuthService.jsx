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

// =========================================================
// LOGIN
// =========================================================
export const login = async ({ email, password }) => {
  try {
    // ⚠️ PASTIKAN URL INI SESUAI (Cek apakah router Anda pakai prefix /auth atau tidak)
    const res = await fetch("https://backend-fastapi-ruby.vercel.app/auth/login", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    // Handle error dari backend
    if (!res.ok || data.error || data.detail) {
      return { error: data.detail || data.error || "Login gagal" };
    }

    // ✅ SINKRONISASI SESSION SUPABASE DI FRONTEND (LEBIH EFISIEN!)
    // Backend sudah login ke Supabase dan memberikan token. 
    // Kita cukup tempel (set) token tersebut ke Supabase Client di frontend.
    if (data.access_token && data.refresh_token) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });

      if (sessionError) {
        console.error("⚠️ Gagal sinkronisasi session Supabase:", sessionError);
      } else {
        console.log("✅ Session Supabase berhasil disinkronkan!");
      }
    }

    // Return data ke komponen React (LoginPage)
    return data;

  } catch (error) {
    console.error("Login error:", error);
    return { error: error.message };
  }
};

// =========================================================
// REGISTER
// =========================================================
export const register = async (userData) => {
  try {
    // ⚠️ PASTIKAN URL INI SESUAI (Cek apakah router Anda pakai prefix /auth atau tidak)
    const res = await fetch("https://backend-fastapi-ruby.vercel.app/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (!res.ok || data.error || data.detail) {
      return { error: data.detail || data.error || "Registrasi gagal" };
    }

    // ✅ TIDAK PERLU DAFTAR ULANG KE SUPABASE AUTH DI FRONTEND
    // Karena service backend (auth_service.py) sudah memanggil supabase.auth.sign_up
    // User otomatis sudah terdaftar di Supabase Auth.
    console.log("✅ Registrasi berhasil di backend (User otomatis ada di Supabase Auth)");

    return data;

  } catch (error) {
    console.error("Register error:", error);
    return { error: error.message };
  }
};