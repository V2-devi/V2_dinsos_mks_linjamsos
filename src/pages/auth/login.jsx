
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
// Pastikan path image Anda benar
import bgImage from "../../assets/image.png"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png";

import { login } from "../../services/AuthService";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);
      if (res.error) {
        alert(res.error);
        return;
      }

      localStorage.setItem("access_token", res.access_token);
      navigate("/staff");
    } catch (error) {
      alert(error.message || "Login gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="auth-container">
      
      {/* Left Side (Branding) */}
      <div className="auth-left" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="auth-overlay">
          <div className="auth-left-content">
            
            <img src={logoLinjamsos} alt="Logo Linjamsos" className="auth-logo" />
            
            <h1>SISTEM INFORMASI<br />PERLINDUNGAN DAN JAMINAN SOSIAL</h1>
            <p>
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

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Alamat Email*</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
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
                value={form.password}
                onChange={handleChange}
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
  
export default Login;