import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
// Pastikan path image Anda benar
import bgImage from "../../assets/image.png"; 
// ✅ PASTIKAN INI MENGARAH KE LOGO SICADAS VERSI LOGIN (LATAR GELAP)
import logoSicadas from "../../assets/logo_sicadas.png";

import { login } from "../../services/AuthService";





function LoginPage() {

  // =====================================
  // NAVIGATE
  // =====================================
  const navigate = useNavigate();

  // =====================================
  // STATE FORM LOGIN
  // =====================================
  const [formData, setFormData] = useState({

    email: "",

    password: ""
  });

  // =====================================
  // HANDLE INPUT
  // =====================================
  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData({

      ...formData,

      [name]: value
    });
  };

  // =====================================
  // HANDLE LOGIN
  // =====================================
  const handleLogin = async () => {
    try {
      const data = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("LOGIN RESPONSE:", data);

      if (!data || data.error || data.detail) {
        const errorMessage = data?.error || data?.detail || "Login gagal";
        alert(errorMessage);
        return;
      }

      if (!data.access_token || !data.user) {
        alert("Login gagal: respons server tidak valid");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else if (data.user.role === "staff") {
        window.location.href = "/staff";
      } else if (data.user.role === "verifikator") {
        window.location.href = "/verifikator";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        error?.message ||
        "Gagal login";
      alert(message);
    }
  };

// function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };


// const handleLogin = async () => {

//   try {

//     const res = await fetch(
//       "http://127.0.0.1:8000/login",
//       {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json"
//         },

//         body: JSON.stringify({
//           email,
//           password
//         })
//       }
//     );

//     const data = await res.json();

//     console.log("LOGIN RESPONSE:", data);

//     // =====================================
//     // CEK ERROR
//     // =====================================
//     if (data.error) {
//       alert(data.error);
//       return;
//     }

//     // =====================================
//     // SIMPAN TOKEN
//     // =====================================
//     localStorage.setItem(
//       "token",
//       data.access_token
//     );

//     // =====================================
//     // SIMPAN USER
//     // =====================================
//     localStorage.setItem(
//       "user",
//       JSON.stringify(data.user)
//     );

//     alert("Login berhasil");

//     // =====================================
//     // REDIRECT BERDASARKAN ROLE
//     // =====================================
//     if (data.user.role === "staff") {

//       window.location.href = "/staff";

//     } else if (data.user.role === "verifikator") {

//       window.location.href = "/verifikator";

//     } else {
//         window.location.href = "/admin";
//     }

//   } catch (error) {

//     console.error(error);

//     alert("Gagal login");
//   }
// };


// const handleLogin = async () => {

//   try {

//     const res = await fetch(
//       "http://127.0.0.1:8000/login",
//       {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json"
//         },

//         body: JSON.stringify({

//           email: formData.email,

//           password: formData.password
//         })
//       }
//     );

//     const data = await res.json();

//     console.log("LOGIN RESPONSE:", data);

//     if (data.error) {

//       alert(data.error);

//       return;
//     }

//     // simpan token
//     localStorage.setItem(
//       "token",
//       data.access_token
//     );

//     // simpan user
//     localStorage.setItem(
//       "user",
//       JSON.stringify(data.user)
//     );

//     alert("Login berhasil");

//   } catch (error) {

//     console.error("LOGIN ERROR:", error);

//     alert(error.message);
//   }
// };

  return (
    <div className="auth-container">
      
      {/* Left Side (Branding) */}
      <div className="auth-left" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="auth-overlay">
          <div className="auth-left-content">
            <img 
              src={logoSicadas} 
              alt="Logo SICADAS" 
              className="auth-logo" 
              style={{ width: '100%', maxWidth: '320px', height: 'auto', marginBottom: '5px' }}
            />
                  
            <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>
              Melayani dengan hati, melindungi sepenuh jiwa. Akses Perlindungan
              dan Jaminan Sosial dengan lebih mudah dan transparan.
            </p>
            
            <span className="copyright">
              @2026 Linjamsos. Dinas Sosial. Hak Cipta Dilindungi.
            </span>
          </div>
        </div>
      </div>

      {/* Right side (form)*/}
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-header">
            <h2>Masuk Akun</h2>
            <p>Silahkan masukkan kredential Anda</p>
          </div>

          {/* <form onSubmit={handleLogin}> */}
          <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
            <div className="form-group">
              <label>Alamat Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contoh@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>Kata Sandi*</label>
                {/* Tombol Lupa Kata Sandi diarahkan ke /forgot-password */}
                <button 
                  type="button" 
                  className="link-text" 
                  style={{ background: 'none', border: 'none', padding: 0 }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Lupa Kata Sandi?
                </button>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="**********"
                required
              />
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Ingatkan Saya</label>
            </div>

            <button type="submit" className="btn-primary btn-block">
              Masuk Sekarang
            </button>
          </form>

          <div className="auth-footer">
            <p style={{ margin: '0 0 8px 0' }}>Belum mempunyai akun?</p>
            {/* Tombol Register diarahkan ke /register */}
            <button 
              type="button" 
              className="link-btn" 
              onClick={() => navigate("/register")}
            >
              Usulkan akun ke Admin
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
  
export default LoginPage;