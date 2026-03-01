import React, { useState } from "react";
import "./adminprofile.css"; // Pastikan nama file ini sesuai di folder Anda (tanpa strip)
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function AdminProfile({ goBack }) {
  // STATE UNTUK MENGONTROL POP-UP
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Fungsi saat tombol "Simpan" ditekan di pop-up
  const handleSubmit = (e, type) => {
    e.preventDefault();
    if (type === "edit") setIsEditModalOpen(false);
    if (type === "pass") setIsPassModalOpen(false);
    
    setIsSuccessModalOpen(true); // Tampilkan pop-up sukses hijau
    
    // Hilangkan pop-up sukses setelah 3 detik
    setTimeout(() => {
      setIsSuccessModalOpen(false);
    }, 3000);
  };

  return (
    <div className="admin-container relative">
      {/* NAVBAR */}
      <nav className="admin-navbar">
        <div className="navbar-left">
          <div className="branding-container-small">
            <img src={logoLinjamsos} alt="Logo" className="branding-logo-small" />
            <div className="branding-text-block-small">
              <span>PERLINDUNGAN DAN</span>
              <span>JAMINAN SOSIAL</span>
            </div>
          </div>
        </div>
        
        {/* TOMBOL PEMICU POP-UP DI KANAN ATAS */}
        <div className="navbar-right-links">
          <button className="nav-text-link" onClick={() => setIsPassModalOpen(true)}>
            Ganti Kata Sandi
          </button>
          <button className="nav-text-link underline" onClick={() => setIsEditModalOpen(true)}>
            Edit Profile
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT (Informasi Profil) */}
      <main className="profile-content">
        <div className="profile-wrapper">
          
          {/* KIRI: AVATAR */}
          <div className="profile-avatar-section">
            <div className="avatar-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path>
              </svg>
            </div>
          </div>

          {/* KANAN: DATA */}
          <div className="profile-details-section">
            <div className="info-group">
              <h3 className="info-title">Data Staff</h3>
              <div className="info-grid">
                <span className="info-label">Nama Lengkap</span><span className="info-colon">:</span><span className="info-value">Firliany xxxxxxxxxxx</span>
                <span className="info-label">NIK</span><span className="info-colon">:</span><span className="info-value">0000000000000000</span>
                <span className="info-label">NIP</span><span className="info-colon">:</span><span className="info-value">0000000000000000</span>
                <span className="info-label">Email Aktif</span><span className="info-colon">:</span><span className="info-value">snhsxiqb@gmail.com</span>
                <span className="info-label">No.HP</span><span className="info-colon">:</span><span className="info-value">+62800000000000</span>
                <span className="info-label">Alamat</span><span className="info-colon">:</span><span className="info-value">Jl.mana saja</span>
                <span className="info-label">Role</span><span className="info-colon">:</span><span className="info-value">Staff / Pengisi Data</span>
              </div>
            </div>

            <div className="info-group">
              <h3 className="info-title">Instansi</h3>
              <div className="info-grid">
                <span className="info-label">Nama Instansi</span><span className="info-colon">:</span><span className="info-value">Dinas Sosial Kota Makassar</span>
                <span className="info-label">Alamat</span><span className="info-colon">:</span><span className="info-value">Jln.</span>
                <span className="info-label">Kepala Dinas</span><span className="info-colon">:</span><span className="info-value">Xxxxxxxxxxxx</span>
                <span className="info-label">NIP</span><span className="info-colon">:</span><span className="info-value">0000000000000000</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOMBOL BAWAH */}
        <div className="profile-actions">
          <button className="btn-profile-back" onClick={goBack}>
            Kembali Ke Halaman Utama
          </button>
          <button className="btn-profile-exit">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Keluar
          </button>
        </div>
      </main>

      {/* ================= 1. MODAL EDIT PROFIL ================= */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <h2>Edit Profil</h2>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleSubmit(e, "edit")}>
                <div className="modal-section">
                  <h3 className="section-subtitle">Informasi Login (Kredential)</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>NIK (Nomor Induk Kependudukan)*</label><input type="text" defaultValue="0000000000000000" /></div>
                    <div className="form-group-modal"><label>Kata Sandi*</label><input type="password" defaultValue="********" /></div>
                  </div>
                </div>
                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi Staff</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap (Sesuai KTP)*</label><input type="text" defaultValue="Firliany xxxxxxxxxxx" /></div>
                    <div className="form-group-modal"><label>Email Aktif*</label><input type="email" defaultValue="snhsxiqb@gmail.com" /></div>
                    <div className="form-group-modal"><label>NIP*</label><input type="text" defaultValue="0000000000000000" /></div>
                    <div className="form-group-modal"><label>No.HP*</label><input type="text" defaultValue="+62800000000000" /></div>
                    <div className="form-group-modal" style={{ gridColumn: "1 / -1" }}><label>Alamat*</label><input type="text" defaultValue="Jl.mana saja" /></div>
                  </div>
                </div>
                <div className="modal-section">
                  <h3 className="section-subtitle">Instansi dan Status</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Instansi*</label><input type="text" defaultValue="Dinas Sosial Kota Makassar" readOnly className="input-readonly" /></div>
                    <div className="form-group-modal"><label>Nama Kepala Dinas*</label><input type="text" defaultValue="Xxxxxxxxxxxx" /></div>
                    <div className="form-group-modal"><label>Alamat*</label><input type="text" defaultValue="Jln." /></div>
                    <div className="form-group-modal"><label>NIP*</label><input type="text" defaultValue="0000000000000000" /></div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsEditModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit">Simpan Data</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. MODAL GANTI PASSWORD ================= */}
      {isPassModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPassModalOpen(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <span style={{ fontSize: '20px' }}>🔑</span>
                <h2>Ganti Kata Sandi</h2>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleSubmit(e, "pass")}>
                <div className="form-group-modal" style={{ marginBottom: '15px' }}>
                  <label>Kata Sandi Baru*</label>
                  <input type="password" placeholder="Masukkan kata sandi baru" required />
                </div>
                <div className="form-group-modal" style={{ marginBottom: '25px' }}>
                  <label>Konfirmasi Kata Sandi Baru*</label>
                  <input type="password" placeholder="Ketik ulang kata sandi baru" required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsPassModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. MODAL SUKSES ================= */}
      {isSuccessModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="modal-content modal-success" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body text-center" style={{ padding: '40px 20px' }}>
              <div className="success-icon-circle">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>
                Perubahan Data Berhasil!
              </h2>
              <p style={{ color: '#475569', fontSize: '13px', fontWeight: '500', margin: '0' }}>
                Data Anda Berhasil di Perbarui
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminProfile;