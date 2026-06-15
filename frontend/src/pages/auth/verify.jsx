import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

export default function Verify() {
  const navigate = useNavigate();
  
  // State untuk melacak proses: "loading", "success", atau "error"
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Sedang memverifikasi email Anda. Mohon tunggu sebentar...");

  useEffect(() => {
    const handleVerify = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setStatus("error");
          setMessage("Tautan verifikasi tidak valid atau sudah kedaluwarsa.");
          return;
        }

        if (data.session) {
          setStatus("success");
          setMessage("Email Anda berhasil diverifikasi! Silakan tunggu persetujuan admin.");
        } else {
          setStatus("error");
          setMessage("Sesi tidak ditemukan. Silakan coba daftar atau login kembali.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Terjadi kesalahan pada sistem jaringan.");
      }
    };

    handleVerify();
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
      
      {/* KARTU VERIFIKASI */}
      <div style={{ backgroundColor: 'white', padding: '50px 30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        
        {/* TAMPILAN SAAT LOADING */}
        {status === "loading" && (
          <div>
            <div style={{ width: '45px', height: '45px', border: '4px solid #e2e8f0', borderTop: '4px solid #234a66', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>Memverifikasi Email</h2>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>{message}</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* TAMPILAN SAAT BERHASIL */}
        {status === "success" && (
          <div>
            {/* Ikon centang hijau muda yang soft */}
            <div style={{ width: '80px', height: '80px', backgroundColor: '#d1fae5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto' }}>
              <svg width="45" height="45" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '15px' }}>Verifikasi Berhasil!</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0', lineHeight: '1.6' }}>{message}</p>
          </div>
        )}

        {/* TAMPILAN SAAT GAGAL / ERROR */}
        {status === "error" && (
          <div>
            {/* Ikon silang merah muda yang soft */}
            <div style={{ width: '80px', height: '80px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto' }}>
              <svg width="45" height="45" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '15px' }}>Verifikasi Gagal</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '35px', lineHeight: '1.6' }}>{message}</p>

            {/* Tombol kembali ke login tetap ada untuk error */}
            <button onClick={() => navigate("/login")} style={{ backgroundColor: '#f1f5f9', color: '#234a66', border: '1px solid #cbd5e1', padding: '14px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', width: '100%', fontSize: '15px', transition: 'all 0.2s' }}>
              Kembali ke Halaman Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}