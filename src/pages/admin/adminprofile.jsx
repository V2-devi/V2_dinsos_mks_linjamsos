import React from "react";
import "./adminprofile.css";
// Pastikan path logo sesuai dengan struktur folder Anda
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function AdminProfile({ goBack }) {
  return (
    <div className="admin-container">
      {/* NAVBAR */}
      <nav className="admin-navbar">
        <div className="navbar-left">
          <div className="branding-container-small">
            <img src={logoLinjamsos} alt="Logo" className="branding-logo" />
            <div className="branding-text-block-small">
              <span>PERLINDUNGAN DAN JAMINAN SOSIAL</span>
            </div>
          </div>
        </div>
        
        {/* Navigasi Kanan (Teks Link) */}
        <div className="navbar-right-links">
          <button className="nav-text-link">Ganti Kata Sandi</button>
          <button className="nav-text-link underline">Edit Profile</button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="profile-content">
        <div className="profile-wrapper">
          
          {/* BAGIAN KIRI: AVATAR */}
          <div className="profile-avatar-section">
            <div className="avatar-circle">
              {/* SVG Ikon User Besar */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path>
              </svg>
            </div>
          </div>

          {/* BAGIAN KANAN: DATA INFORMASI */}
          <div className="profile-details-section">
            
            {/* Seksi Data Staff */}
            <div className="info-group">
              <h3 className="info-title">Data Staff</h3>
              <div className="info-grid">
                <span className="info-label">Nama Lengkap</span>
                <span className="info-colon">:</span>
                <span className="info-value">Firliany xxxxxxxxxxx</span>

                <span className="info-label">NIK</span>
                <span className="info-colon">:</span>
                <span className="info-value">0000000000000000</span>

                <span className="info-label">NIP</span>
                <span className="info-colon">:</span>
                <span className="info-value">0000000000000000</span>

                <span className="info-label">Email Aktif</span>
                <span className="info-colon">:</span>
                <span className="info-value">snhsxiqb@gmail.com</span>

                <span className="info-label">No.HP</span>
                <span className="info-colon">:</span>
                <span className="info-value">+62800000000000</span>

                <span className="info-label">Alamat</span>
                <span className="info-colon">:</span>
                <span className="info-value">Jl.mana saja</span>

                <span className="info-label">Role</span>
                <span className="info-colon">:</span>
                <span className="info-value">Staff / Pengisi Data</span>
              </div>
            </div>

            {/* Seksi Instansi */}
            <div className="info-group">
              <h3 className="info-title">Instansi</h3>
              <div className="info-grid">
                <span className="info-label">Nama Instansi</span>
                <span className="info-colon">:</span>
                <span className="info-value">Dinas Sosial Kota Makassar</span>

                <span className="info-label">Alamat</span>
                <span className="info-colon">:</span>
                <span className="info-value">Jln.</span>

                <span className="info-label">Kepala Dinas</span>
                <span className="info-colon">:</span>
                <span className="info-value">Xxxxxxxxxxxx</span>

                <span className="info-label">NIP</span>
                <span className="info-colon">:</span>
                <span className="info-value">0000000000000000</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
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
    </div>
  );
}

export default AdminProfile;