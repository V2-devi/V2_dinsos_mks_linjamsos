import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import logoLinjamsos from "../../assets/logo_linjamsos.png";
import { register } from "../../services/AuthService";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    konfirmasi_password: "",
    nama_lengkap: "",
    nik: "",
    nip: "",
    role: "",
    no_hp: "",
    alamat: "",
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password || !formData.konfirmasi_password) {
      alert("Mohon lengkapi informasi akun terlebih dahulu.");
      setStep(1);
      return;
    }

    if (formData.password !== formData.konfirmasi_password) {
      alert("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      setStep(1);
      return;
    }

    if (!formData.nama_lengkap || !formData.nik || !formData.role || !formData.alamat) {
      alert("Mohon lengkapi data identitas terlebih dahulu.");
      setStep(2);
      return;
    }

    if (!formData.agreed) {
      alert("Silakan setujui pernyataan untuk melanjutkan.");
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);
    
    try {
      // PANGGILAN API ASLI (Tinggal buka komentar jika API sudah siap)
      /*
      await register({
        email: formData.email,
        password: formData.password,
        nama_lengkap: formData.nama_lengkap,
        nik: formData.nik,
        nip: formData.nip,
        role: formData.role,
        no_hp: formData.no_hp,
        alamat: formData.alamat,
      });
      */

      // Simulasi loading selama 1.5 detik agar terlihat prosesnya
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Pindahkan ke step 4 (Layar Sukses Daftar)
      setStep(4); 

    } catch (error) {
      console.error(error);
      const responseData = error?.response?.data;
      const message =
        responseData?.details || responseData?.error || error?.message ||
        "Terjadi kesalahan saat mendaftar. Silakan coba lagi.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-left-content">
          <div className="branding-container">
            <img src={logoLinjamsos} alt="Logo Linjamsos" className="branding-logo" />
            <div className="branding-text-logo">
              <b>PERLINDUNGAN DAN </b>
              <b>JAMINAN SOSIAL</b>
            </div>
          </div>

          <h1>
            Satu Data Untuk
            <br />Perlindungan dan Jaminan Sosial
          </h1>
          <p>
            Pastikan data yang Anda masukkan sesuai dengan Kartu Tanda Penduduk (KTP) dan Kartu Keluarga (KK)
            terbaru agar verifikasi bantuan berjalan lancar.
          </p>
        </div>
      </div>

      <div className="register-right">
        <div className="register-box">
          
          {/* HEADER FORM HILANG JIKA SUDAH SUKSES (STEP 4) */}
          {step < 4 && (
            <div className="register-header">
              <h2>Pendaftaran Akun Baru</h2>
              <p>Lengkapi data di bawah ini untuk memulai.</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* STEPPER HILANG JIKA SUDAH SUKSES (STEP 4) */}
            {step < 4 && (
              <div className="stepper">
                <div className={`step ${step >= 1 ? "active" : ""}`}>
                  <div className="step-circle">1</div>
                  <span>Akun</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step >= 2 ? "active" : ""}`}>
                  <div className="step-circle">2</div>
                  <span>Identitas</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${step >= 3 ? "active" : ""}`}>
                  <div className="step-circle">3</div>
                  <span>Verifikasi</span>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="form-content">
                <div className="form-group">
                  <label>Alamat Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contoh@gmail.com"
                    required
                  />
                  <span className="helper-text">*verifikasi masuk ke email Anda</span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Kata Sandi*</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimal 8 karakter"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ulangi Kata Sandi*</label>
                    <input
                      type="password"
                      name="konfirmasi_password"
                      value={formData.konfirmasi_password}
                      onChange={handleChange}
                      placeholder="Ketik ulang sandi"
                      required
                    />
                  </div>
                </div>

                <button type="button" className="btn-primary btn-block" onClick={() => setStep(2)}>
                  Lanjutkan ke Data diri &rarr;
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-content">
                <div className="form-group">
                  <label>Nama Lengkap (Sesuai KTP)*</label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                    placeholder="Contoh: FIRLIANY FIRDAUS"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>NIK (Nomor Induk Kependudukan)*</label>
                  <input
                    type="text" // Diubah dari 'int' ke 'text' agar tidak ada error di browser
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    placeholder="16 digit angka"
                    maxLength="16"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text" // Diubah dari 'int' ke 'text'
                    name="nip"
                    value={formData.nip}
                    onChange={handleChange}
                    placeholder="18 digit angka (Kosongkan jika bukan PNS)"
                    maxLength="18"
                  />
                </div>

                <div className="form-group-modal">
                  <label
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#234a66",
                      marginBottom: "6px",
                      display: "block",
                    }}
                  >
                    Role*
                  </label>
                  <div className="select-container-custom">
                    <select name="role" value={formData.role} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none'}}>
                      <option value="" disabled hidden>
                        Pilih salah satu role
                      </option>
                      <option value="Pengisi Data">Staff / Pengisi Data</option>
                      <option value="Verifikator">Verifikator</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{marginTop: '15px'}}>
                  <label>No.Hp</label>
                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleChange}
                    placeholder="+62xxxxxxxxxxxx"
                  />
                </div>

                <div className="form-group">
                  <label>Alamat*</label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Jln. xxx"
                    required
                  />
                </div>

                <div className="button-row">
                  <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                    Kembali
                  </button>
                  <button type="button" className="btn-primary" onClick={() => setStep(3)}>
                    Tinjau Data
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-content">
                <div className="confirmation-card">
                  <div className="icon-wrapper">
                    <span>📋</span>
                  </div>
                  <h3>Konfirmasi Pendaftaran</h3>
                  <p>Pastikan data Anda benar. Data palsu dapat menyebabkan sanksi hukum.</p>

                  <label className="checkbox-box">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleChange}
                    />
                    <span>
                      Saya menyatakan bahwa data yang saya masukkan adalah benar, valid,
                      dan dapat dipertanggungjawabkan sesuai hukum yang berlaku.
                    </span>
                  </label>
                </div>

                <div className="button-row">
                  <button type="button" className="btn-light" onClick={() => setStep(2)}>
                    Ubah Data
                  </button>
                  <button type="submit" className="btn-success" disabled={loading}>
                    {loading ? "Memproses Pendaftaran..." : "DAFTAR SEKARANG"}
                  </button>
                </div>
              </div>
            )}

            {/* ================= 🌟 STEP 4: LAYAR KEBERHASILAN 🌟 ================= */}
            {step === 4 && (
              <div className="form-content" style={{ animation: 'fadeInModal 0.4s ease-out' }}>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  
                  {/* Ikon Sukses */}
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px auto' }}>
                    <svg width="40" height="40" fill="none" stroke="#22c55e" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  
                  <h2 style={{ color: '#234a66', fontSize: '24px', fontWeight: '800', marginBottom: '15px' }}>Pendaftaran Berhasil!</h2>
                  
                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '20px', color: '#1e3a8a', fontSize: '14px', lineHeight: '1.6', marginBottom: '30px', textAlign: 'left' }}>
                    <p style={{ marginTop: 0 }}><strong>Langkah Selanjutnya:</strong></p>
                    <ol style={{ paddingLeft: '20px', margin: 0 }}>
                      <li style={{ marginBottom: '8px' }}>Silakan <strong>cek kotak masuk (inbox) atau spam di email Anda</strong> untuk melakukan verifikasi alamat email.</li>
                      <li>Setelah email diverifikasi, <strong>Admin Pusat akan meninjau</strong> permohonan akses Anda sebagai {formData.role}.</li>
                      <li>Anda akan menerima email pemberitahuan apabila akun Anda telah aktif dan dapat digunakan.</li>
                    </ol>
                  </div>

                  <button type="button" className="btn-primary btn-block" onClick={() => navigate("/login")}>
                    Kembali ke Halaman Masuk
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* FOOTER DIHILANGKAN JIKA SUDAH SUKSES DI STEP 4 */}
          {step < 4 && (
            <div className="register-footer">
              <p>Sudah punya akun?</p>
              <button className="link-btn" onClick={() => navigate("/login")}>Masuk di sini</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Register;