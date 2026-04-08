import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigasi
import "./auth.css";
// Pastikan path image Anda benar
import bgImage from "../../assets/image.png"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function Login() {
  const navigate = useNavigate(); // Aktifkan fungsi navigasi

  // Simulasi jika tombol login ditekan (Bisa diarahkan ke /staff atau /admin)
  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/staff"); 
  };

  return (
    <div className="auth-container">
      
      {/* ================= LEFT SIDE (BRANDING) ================= */}
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

      {/* ================= RIGHT SIDE (FORM) ================= */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-header">
            <h2>Masuk Akun</h2>
            <p>Silahkan masukkan kredential Anda</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>NIK (Nomor Induk Kependudukan)*</label>
              <input type="text" placeholder="Contoh: 1234567890000000" maxLength="16" required />
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
              <input type="password" placeholder="**********" required />
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