import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../admin/adminprofile.css"; // Menggunakan CSS Admin agar 100% konsisten
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function StaffProfile() {
  const navigate = useNavigate();

  // === STATE DATA PROFIL & INSTANSI ===
  const [profileData, setProfileData] = useState({
    nama: "Firliany Firdaus",
    nik: "0000000000000000",
    nip: "0000000000000000",
    email: "snhsxiqb@gmail.com",
    noHp: "+6280000000000",
    alamat: "Jl.mana saja",
    role: "Staff / Pengisi Data"
  });

  const instansiData = {
    namaInstansi: "Dinas Sosial Kota Makassar",
    alamat: "Jln.",
    kepalaDinas: "Xxxxxxxxxxxxx",
    nip: "0000000000000000"
  };

  // === STATE MODAL ===
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // === STATE FORM SEMENTARA ===
  const [formData, setFormData] = useState(profileData);
  const [passData, setPassData] = useState({ oldPass: "", newPass: "", confirmPass: "" });

  // === HANDLER FUNGSI ===
  const handleOpenEdit = () => {
    setFormData({ ...profileData });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileData(formData);
    setIsEditModalOpen(false);
    showSuccess();
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passData.newPass !== passData.confirmPass) {
      alert("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }
    setIsPasswordModalOpen(false);
    setPassData({ oldPass: "", newPass: "", confirmPass: "" });
    showSuccess();
  };

  const showSuccess = () => {
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 2500);
  };

  return (
    <div className="profile-page-container">
      
      {/* NAVBAR (SAMA DENGAN ADMIN) */}
      <nav className="profile-navbar-dark">
        {/* Tombol Klik Logo -> Kembali ke Staff Dashboard */}
        <div className="navbar-left" style={{ cursor: 'pointer' }} onClick={() => navigate("/staffdashboard")}>
          <img src={logoLinjamsos} alt="Logo" className="branding-logo-small" />
          <div className="branding-text-block-small">
            <span>PERLINDUNGAN DAN</span>
            <span>JAMINAN SOSIAL</span>
          </div>
        </div>
        <div className="navbar-right">
          <button className="nav-btn-plain" onClick={() => setIsPasswordModalOpen(true)}>Ganti Kata Sandi</button>
          <button className="nav-btn-plain active-link" onClick={handleOpenEdit}>Edit Profile</button>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="profile-main-body">
        <div className="profile-flex-wrapper">
          
          {/* FOTO PROFIL KIRI */}
          <div className="profile-avatar-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>

          {/* DATA KANAN */}
          <div className="profile-details-box">
            
            <h2 className="profile-section-title">Data Staff</h2>
            <div className="profile-info-grid">
              <span className="grid-label">Nama Lengkap</span><span className="grid-colon">:</span><span className="grid-value">{profileData.nama}</span>
              <span className="grid-label">NIK</span><span className="grid-colon">:</span><span className="grid-value">{profileData.nik}</span>
              <span className="grid-label">NIP</span><span className="grid-colon">:</span><span className="grid-value">{profileData.nip}</span>
              <span className="grid-label">Email Aktif</span><span className="grid-colon">:</span><span className="grid-value">{profileData.email}</span>
              <span className="grid-label">No.HP</span><span className="grid-colon">:</span><span className="grid-value">{profileData.noHp}</span>
              <span className="grid-label">Alamat</span><span className="grid-colon">:</span><span className="grid-value">{profileData.alamat}</span>
              <span className="grid-label">Role</span><span className="grid-colon">:</span><span className="grid-value">{profileData.role}</span>
            </div>

            <h2 className="profile-section-title" style={{ marginTop: '40px' }}>Instansi</h2>
            <div className="profile-info-grid">
              <span className="grid-label">Nama Instansi</span><span className="grid-colon">:</span><span className="grid-value">{instansiData.namaInstansi}</span>
              <span className="grid-label">Alamat</span><span className="grid-colon">:</span><span className="grid-value">{instansiData.alamat}</span>
              <span className="grid-label">Kepala Dinas</span><span className="grid-colon">:</span><span className="grid-value">{instansiData.kepalaDinas}</span>
              <span className="grid-label">NIP</span><span className="grid-colon">:</span><span className="grid-value">{instansiData.nip}</span>
            </div>

          </div>
        </div>

        {/* ================= TOMBOL BAWAH (KEMBALI KE STAFF DASHBOARD) ================= */}
        <div className="profile-actions-bottom">
          <button className="btn-profile-back" onClick={() => navigate("/staffdashboard")}>
            Kembali Ke Halaman Utama
          </button>
          <button className="btn-profile-exit" onClick={() => navigate("/login")}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Keluar
          </button>
        </div>

      </main>

      {/* ================= MODAL EDIT PROFIL ================= */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title"><h2>Edit Profil</h2></div>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSaveProfile}>
                
                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi Staff</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap</label><input type="text" name="nama" value={formData.nama} onChange={handleEditChange} required /></div>
                    
                    {/* INPUT ROLE DROPDOWN */}
                    <div className="form-group-modal">
                      <label>Role</label>
                      <select name="role" value={formData.role} onChange={handleEditChange} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}>
                        <option value="Staff / Pengisi Data">Staff / Pengisi Data</option>
                        <option value="verifikator">verifikator</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>

                    <div className="form-group-modal"><label>NIP</label><input type="text" name="nip" value={formData.nip} onChange={handleEditChange} required /></div>
                    <div className="form-group-modal"><label>Email Aktif</label><input type="email" name="email" value={formData.email} onChange={handleEditChange} required /></div>
                    <div className="form-group-modal"><label>No. HP</label><input type="text" name="noHp" value={formData.noHp} onChange={handleEditChange} required /></div>
                    <div className="form-group-modal"><label>Alamat</label><input type="text" name="alamat" value={formData.alamat} onChange={handleEditChange} required /></div>
                  </div>
                </div>

                <div className="modal-section" style={{ marginTop: '10px' }}>
                  <h3 className="section-subtitle">Data Instansi</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Instansi</label><input type="text" disabled value={instansiData.namaInstansi} style={{backgroundColor: '#f1f5f9'}} /></div>
                    <div className="form-group-modal"><label>Alamat Instansi</label><input type="text" disabled value={instansiData.alamat} style={{backgroundColor: '#f1f5f9'}} /></div>
                    <div className="form-group-modal"><label>Nama Kepala Dinas</label><input type="text" disabled value={instansiData.kepalaDinas} style={{backgroundColor: '#f1f5f9'}} /></div>
                    <div className="form-group-modal"><label>NIP Kepala Dinas</label><input type="text" disabled value={instansiData.nip} style={{backgroundColor: '#f1f5f9'}} /></div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsEditModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL GANTI PASSWORD ================= */}
      {isPasswordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><span style={{ fontSize: '20px' }}>🔑</span><h2>Ganti Kata Sandi</h2></div></div>
            <div className="modal-body">
              <form onSubmit={handleSavePassword}>
                <div className="form-group-modal" style={{ marginBottom: '15px' }}><label>Kata Sandi Lama</label><input type="password" name="oldPass" value={passData.oldPass} onChange={handlePassChange} required /></div>
                <div className="form-group-modal" style={{ marginBottom: '15px' }}><label>Kata Sandi Baru</label><input type="password" name="newPass" value={passData.newPass} onChange={handlePassChange} required /></div>
                <div className="form-group-modal" style={{ marginBottom: '25px' }}><label>Konfirmasi Kata Sandi Baru</label><input type="password" name="confirmPass" value={passData.confirmPass} onChange={handlePassChange} required /></div>
                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsPasswordModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Sandi</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SUKSES ================= */}
      {isSuccessModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="modal-content" style={{maxWidth: '400px', borderTop: '8px solid #22c55e', borderRadius: '8px'}}>
            <div className="modal-body text-center" style={{ padding: '40px 20px', backgroundColor: '#f8fafc' }}>
              <div style={{width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)'}}>
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 style={{ color: '#1e293b', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Berhasil!</h2>
              <p style={{ color: '#475569', fontSize: '14px', fontWeight: '500', margin: '0' }}>Data profil telah diperbarui.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffProfile;