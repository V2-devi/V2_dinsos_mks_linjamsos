import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./staffdashboard.css"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png";
import "../admin/adminprofile.css";

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
    <div className="staff-layout relative" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ================= 1. SIDEBAR KIRI ================= */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoLinjamsos} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-brand-text"><span>PERLINDUNGAN DAN</span><span>JAMINAN SOSIAL</span></div>
        </div>
        
        {/* 👇 INI ADALAH PROFIL YANG BISA DIKLIK (MENGGANTIKAN MENU BAWAH) 👇 */}
        <div 
          className="sidebar-profile" 
          style={{ cursor: 'pointer', backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1' }} 
          onClick={() => navigate("/staffprofile")} 
          title="Anda Sedang Berada di Profil"
        >
          <div className="profile-avatar-small"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path></svg></div>
          <div className="profile-info"><span className="profile-name">{profileData.nama.split(' ')[0]}</span><span className="profile-nik">{profileData.nik}</span></div>
        </div>

        <nav className="sidebar-menu">
          {/* Tombol kembali ke Dashboard (Usulan Baru) */}
          <button className="menu-item" onClick={() => navigate("/staffdashboard", { state: { activeMenu: "usulan_baru", activeTab: "dashboard" } })}>
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Usulan Baru
          </button>
          
          {/* Tombol kembali ke DTSEN */}
          <button className="menu-item" onClick={() => navigate("/staffdashboard", { state: { activeMenu: "lihat_dtsen", activeTab: "dashboard_dtsen" } })}>
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> DTSEN & PPKS
          </button>
          
          {/* Tombol kembali ke Desil */}
          <button className="menu-item" onClick={() => navigate("/staffdashboard", { state: { activeMenu: "penentuan_desil", activeTab: "menunggu_penentuan" } })}>
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg> Penentuan Desil
          </button>
          
          {/* Tombol Keluar */}
          <button className="menu-item" style={{ marginTop: '40px', color: '#ef4444' }} onClick={() => navigate("/login")}>
             <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Keluar
          </button>
        </nav>
      </aside>

      {/* ================= 2. MAIN CONTENT ================= */}
      <main className="main-content">
        <header className="main-header" style={{ justifyContent: 'space-between', backgroundColor: '#234a66' }}>
          <h1 className="header-title" style={{ color: 'white' }}>Profil Pengguna</h1>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: '0.9' }} onClick={() => setIsPasswordModalOpen(true)}>Ganti Kata Sandi</span>
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', borderBottom: '2px solid white', paddingBottom: '4px' }} onClick={() => setIsEditModalOpen(true)}>Edit Profile</span>
          </div>
        </header>

        <div className="content-body" style={{ display: 'flex', gap: '50px', paddingTop: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* SISI KIRI: AVATAR BESAR */}
          <div style={{ flex: '0 0 250px', textAlign: 'center' }}>
            <div style={{ width: '220px', height: '220px', backgroundColor: '#eef2f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
              <svg width="100" height="100" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
          </div>

          {/* SISI KANAN: TABEL DATA */}
          <div style={{ flex: '1' }}>
             {/* Data Staff */}
             <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '#234a66', fontSize: '18px', fontWeight: '800', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>Data Staff</h3>
                <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr><td style={{ padding: '8px 0', width: '200px', color: '#64748b', fontWeight: '600' }}>Nama Lengkap</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {profileData.nama}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#64748b', fontWeight: '600' }}>NIK</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {profileData.nik}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#64748b', fontWeight: '600' }}>NIP</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {profileData.nip}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#64748b', fontWeight: '600' }}>Email Aktif</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {profileData.email}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#64748b', fontWeight: '600' }}>No.HP</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {profileData.noHp}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#64748b', fontWeight: '600' }}>Alamat</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {profileData.alamat}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#64748b', fontWeight: '600' }}>Role</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {profileData.role}</td></tr>
                  </tbody>
                </table>
             </div>

             {/* Data Instansi */}
             <div>
                <h3 style={{ color: '#234a66', fontSize: '18px', fontWeight: '800', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>Instansi</h3>
                <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr><td style={{ padding: '8px 0', width: '200px', color: '#64748b', fontWeight: '600' }}>Nama Instansi</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {instansiData.namaInstansi}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#64748b', fontWeight: '600' }}>Alamat</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {instansiData.alamat}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#64748b', fontWeight: '600' }}>Kepala Dinas</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {instansiData.kepalaDinas}</td></tr>
                    <tr><td style={{ padding: '8px 0', color: '#64748b', fontWeight: '600' }}>NIP</td><td style={{ fontWeight: '700', color: '#1e293b' }}>: {instansiData.nip}</td></tr>
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      </main>

      {/* ================= 🌟 MODAL EDIT PROFIL 🌟 ================= */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setIsEditModalOpen(false)}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '800' }}>Edit Profile Staff</h2>
            </div>
            <div style={{ padding: '30px' }}>
              <form onSubmit={handleSaveProfile}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Nama Lengkap</label>
                    <input type="text" name="nama" value={formData.nama} onChange={handleEditChange} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Email Aktif</label>
                    <input type="email" name="email" value={formData.email} onChange={handleEditChange} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>No. HP / WhatsApp</label>
                    <input type="text" name="noHp" value={formData.noHp} onChange={handleEditChange} style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Alamat Domisili</label>
                    <input type="text" name="alamat" value={formData.alamat} onChange={handleEditChange} style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde047', padding: '12px 15px', borderRadius: '8px', color: '#b45309', fontSize: '13px', marginBottom: '25px' }}>
                  <strong>Catatan:</strong> NIK, NIP, dan Role tidak dapat diedit secara mandiri. Silakan hubungi Admin Pusat untuk perubahan data instansi.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Batal</button>
                  <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= 🌟 MODAL UBAH KATA SANDI 🌟 ================= */}
      {isPasswordModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setIsPasswordModalOpen(false)}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '450px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px 30px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '800' }}>Ganti Kata Sandi</h2>
            </div>
            <div style={{ padding: '30px' }}>
              <form onSubmit={handleSavePassword}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Kata Sandi Lama*</label>
                    <input type="password" name="oldPass" value={passData.oldPass} onChange={handlePassChange} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Kata Sandi Baru*</label>
                    <input type="password" name="newPass" value={passData.newPass} onChange={handlePassChange} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Konfirmasi Kata Sandi Baru*</label>
                    <input type="password" name="confirmPass" value={passData.confirmPass} onChange={handlePassChange} required style={{ width: '100%', padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                  <button type="button" onClick={() => setIsPasswordModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Batal</button>
                  <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Perbarui Sandi</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= 🌟 MODAL SUKSES 🌟 ================= */}
      {isSuccessModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setIsSuccessModalOpen(false)}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '400px', borderRadius: '12px', borderTop: '8px solid #22c55e', padding: '40px 20px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)' }}>
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Berhasil!</h2>
            <p style={{ color: '#475569', fontSize: '13px', fontWeight: '500', margin: '0' }}>Data akun Anda telah diperbarui.</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default StaffProfile;