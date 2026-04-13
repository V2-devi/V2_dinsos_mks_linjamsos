import { useState } from "react";
import "./register.css";
import logoLinjamsos from "../../assets/logo_linjamsos.png";
import API from "./api";

// 
const handleRegister = async () => {
  await register(formData);
  alert("Silakan cek email untuk verifikasi akun");
};
//

function Register({ goToLogin }) {
  const [step, setStep] = useState(1);

  return (
    <div className="register-container">
      {/* LEFT SIDE */}
      <div className="register-left">
        <div className="register-left-content">

          <div className="branding-container">
            <img src={logoLinjamsos} alt="Logo Linjamsos" className="branding-logo"/>
            <div className="branding-text-logo">
              <b>PERLINDUNGAN DAN </b>
              <b>JAMINAN SOSIAL</b>
            </div>
          </div>

          <h1>Satu Data Untuk<br />Perlindungan dan Jaminan Sosial</h1>
          <p>
            Pastikan data yang Anda masukkan sesuai dengan Kartu Tanda
            Penduduk (KTP) dan Kartu Keluarga (KK) terbaru agar verifikasi
            bantuan berjalan lancar.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-right">
        <div className="register-box">
          <div className="register-header">
            <h2>Pendaftaran Akun Baru</h2>
            <p>Lengkapi data di bawah ini untuk memulai.</p>
          </div>

          {/* STEP INDICATOR */}
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

          {/* ================= STEP 1: AKUN ================= */}
          {step === 1 && (
            <div className="form-content">
              <div className="form-group">
                <label>Alamat Email*</label>
                <input type="email" placeholder="contoh@gmail.com" />
                <span className="helper-text">*verifikasi masuk ke email Anda</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kata Sandi*</label>
                  <input type="password" placeholder="Minimal 8 karakter" />
                </div>
                <div className="form-group">
                  <label>Ulangi Kata Sandi*</label>
                  <input type="password" placeholder="Ketik ulang sandi" />
                </div>
              </div>

              <button className="btn-primary btn-block" onClick={() => setStep(2)}>
                Lanjutkan ke Data diri →
              </button>
            </div>
          )}

          {/* ================= STEP 2: IDENTITAS ================= */}
          {step === 2 && (
            <div className="form-content">
              <div className="form-group">
                <label>Nama Lengkap (Sesuai KTP)*</label>
                <input type="text" placeholder="Contoh: FIRLIANY FIRDAUS" />
              </div>

              <div className="form-group">
                <label>NIK (Nomor Induk Kependudukan)*</label>
                <input type="text" placeholder="16 digit angka" />
              </div>

              <div className="form-group">
                <label>NIP (Nomor Induk Pegawai)</label>
                <input type="text" placeholder="18 digit angka" />
              </div>

              <div className="form-group-modal">
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#234a66', marginBottom: '6px', display: 'block' }}>
                Role*
              </label>
              <div className="select-container-custom">
                <select required defaultValue="">
                  <option value="" disabled hidden>Pilih salah satu role</option>
                  <option value="pengisi_data">Staff / Pengisi Data</option>
                  <option value="verifikator">Verifikator</option>
                </select>
              </div>
            </div>

              <div className="form-group">
                <label>No.Hp</label>
                <input type="text" placeholder="+62xxxxxxxxxxxx" />
              </div>

              <div className="form-group">
                <label>Alamat*</label>
                <input type="text" placeholder="Jln. xxx" />
              </div>

              <div className="button-row">
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  Kembali
                </button>
                <button className="btn-primary" onClick={() => setStep(3)}>
                  Tinjau Data
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: VERIFIKASI ================= */}
          {step === 3 && (
            <div className="form-content">
              <div className="confirmation-card">
                <div className="icon-wrapper">
                  <span>📋</span> {/* Bisa diganti icon clipboard centang biru */}
                </div>
                <h3>Konfirmasi Pendaftaran</h3>
                <p>Pastikan data Anda benar. Data palsu dapat menyebabkan sanksi hukum.</p>
                
                <label className="checkbox-box">
                  <input type="checkbox" />
                  <span>
                    Saya menyatakan bahwa data yang saya masukkan adalah benar, valid,
                    dan dapat dipertanggungjawabkan sesuai hukum yang berlaku.
                  </span>
                </label>
              </div>

              <div className="button-row">
                <button className="btn-light" onClick={() => setStep(2)}>
                  Ubah Data
                </button>
                <button className="btn-success">
                  DAFTAR SEKARANG
                </button>
              </div>
            </div>
          )}

          {/* FOOTER LINK */}
          <div className="register-footer">
            <p>Sudah punya akun?</p>
            <button className="link-btn" onClick={goToLogin}>
              Masuk di sini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;