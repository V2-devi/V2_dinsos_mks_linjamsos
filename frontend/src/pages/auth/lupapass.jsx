import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase"; // ✅ IMPORT SUPABASE
import "./auth.css"; 
import bgImage from "../../assets/image.png"; 
import logoSicadas from "../../assets/logo_sicadas.png"; 

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;


    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ PANGGIL BACKEND API (BUKAN SUPABASE AUTH LANGSUNG)
      const res = await fetch("${API_URL}auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Jika backend mengembalikan status error (misal 400 Bad Request)
        setError(data.detail || data.error || "Terjadi kesalahan pada server.");
        return;
      }

      // ✅ Jika berhasil (200 OK), tampilkan halaman sukses
      console.log("Respon Backend:", data);
      setIsSubmitted(true);

    } catch (err) {
      console.error("Network Error:", err);
      setError("Gagal terhubung ke server. Periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  };
  
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

      <div className="auth-right">
        <div className="auth-box">
          {!isSubmitted ? (
            <>
              <div className="auth-header">
                <h2>Lupa Kata Sandi?</h2>
                <p>Masukkan Email yang terdaftar pada akun Anda.</p>
              </div>

              {error && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#991b1b',
                  fontSize: '13px',
                  marginBottom: '15px'
                }}>
                {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email Terdaftar*</label>
                  <input 
                    type="email" 
                    placeholder="Contoh: email@domain.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary btn-block" 
                  style={{ marginTop: '15px' }}
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Kirim Instruksi Reset"}
                </button>
              </form>

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
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ 
                color: '#10b981', 
                fontSize: '60px',
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
                Silakan cek inbox email Anda <strong>(termasuk folder spam)</strong>.
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;