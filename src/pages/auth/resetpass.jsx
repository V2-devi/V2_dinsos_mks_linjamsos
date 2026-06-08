import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import "./auth.css";
import bgImage from "../../assets/image.png";
import logoSicadas from "../../assets/logo_sicadas.png";

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionValid, setSessionValid] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError("Link reset tidak valid atau sudah kedaluwarsa.");
      } else {
        setSessionValid(true);
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("Kata sandi minimal 6 karakter.");
    }
    if (password !== confirmPassword) {
      return setError("Konfirmasi kata sandi tidak cocok.");
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Gagal mengubah kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
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
          {!success ? (
            <>
              <div className="auth-header">
                <h2>Buat Kata Sandi Baru</h2>
                <p>Masukkan kata sandi baru yang aman.</p>
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

              {sessionValid && (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Kata Sandi Baru*</label>
                    <input 
                      type="password" 
                      placeholder="Minimal 6 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Konfirmasi Kata Sandi*</label>
                    <input 
                      type="password" 
                      placeholder="Ulangi kata sandi"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary btn-block"
                    disabled={loading}
                  >
                    {loading ? "Menyimpan..." : "Ubah Kata Sandi"}
                  </button>
                </form>
              )}
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
              <h2 style={{ color: '#234a66', marginBottom: '15px' }}>
                Kata Sandi Berhasil Diubah!
              </h2>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>
                Anda akan dialihkan ke halaman login...
              </p>
              <button 
                className="btn-primary btn-block"
                onClick={() => navigate("/login")}
              >
                Login Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;