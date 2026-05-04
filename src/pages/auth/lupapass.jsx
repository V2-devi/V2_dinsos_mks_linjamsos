import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css"; 
import bgImage from "../../assets/image.png"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png"; 

function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="auth-container">
      
      {/* Left side (branding) */}
      {/* Ditambahkan style backgroundImage persis seperti login */}
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

      {/* Right side (form area) */}
      <div className="auth-right">
        <div className="auth-box">
          
          {!isSubmitted ? (
            <>
              {/* HEADER FORM */}
              <div className="auth-header">
                <h2>Lupa Kata Sandi?</h2>
                <p style={{ lineHeight: '1.5' }}>
                  Masukkan Email yang terdaftar pada akun Anda. Kami akan 
                  mengirimkan instruksi untuk mengatur ulang kata sandi.
                </p>
              </div>

              {/* INPUT FORM */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Terdaftar*</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: email@domain.com" 
                    required 
                  />
                </div>

                <button type="submit" className="btn-primary btn-block" style={{ marginTop: '15px' }}>
                  Kirim Instruksi Reset
                </button>
              </form>

              {/* FOOTER FORM */}
              <div className="auth-footer" style={{ marginTop: '30px' }}>
                <p style={{ margin: '0 0 8px 0' }}>Sudah ingat kata sandi Anda?</p>
                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={() => navigate("/login")}
                >
                  Kembali ke Masuk Akun
                </button>
              </div>
            </>
          ) : (
            <>
              {/* State ketika sukses dikirim */}
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ 
                  color: '#10b981', 
                  fontSize: '60px', 
                  marginBottom: '20px',
                  backgroundColor: '#d1fae5',
                  width: '90px',
                  height: '90px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  margin: '0 auto 25px auto'
                }}>
                  ✓
                </div>
                <h2 style={{ color: '#234a66', fontSize: '24px', fontWeight: '800', marginBottom: '15px' }}>
                  Instruksi Terkirim!
                </h2>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '35px' }}>
                  Jika Email tersebut terdaftar di sistem kami, instruksi untuk mengatur ulang kata sandi telah dikirim. Silakan cek pesan Anda atau hubungi Admin Dinas Sosial.
                </p>
                <button 
                  type="button" 
                  className="btn-primary btn-block" 
                  style={{ backgroundColor: '#eef2f6', color: '#234a66', border: '1px solid #234a66' }} 
                  onClick={() => navigate("/login")}
                >
                  Kembali ke Halaman Login
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;