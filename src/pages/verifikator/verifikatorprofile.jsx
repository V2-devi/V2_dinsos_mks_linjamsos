import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./verifikatorprofile.css"; 
import logoLinjamsos from "../../assets/logo_sicadas.png";

function VerifikatorProfile() {
  const navigate = useNavigate();

 // =================================================
  // 1. USER (AMAN DARI NULL)
  // =================================================
  const userData = localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

// === STATE DATA PROFIL ===
  const [profileData, setProfileData] = useState({
    nama_lengkap: "",
    nip: "",
    email: "",
    no_hp: "",
    alamat: "",
    role: "",
    instansi: "",
    alamat_instansi: "",
    nama_kepala_dinas: "",
    nip_kepala_dinas: "",
    wilayah_kerja: "" // ✅ DITAMBAHKAN: State Wilayah Kerja
  });



 // =================================================
  // 3. FETCH PROFILE (AMBIL DARI BACKEND)
  // =================================================
  const fetchProfile = async () => {

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/profile/${user.id}`
      );

      const data = await res.json();

      console.log("PROFILE FROM BE:", data);

      const profile = Array.isArray(data)
        ? data[0]
        : data;

      if (!profile) return;

      setProfileData(profile);

    } catch (error) {

      console.error("FETCH ERROR:", error);
    }
  };

  // =================================================
  // 4. LOAD SAAT PAGE MUNCUL (INI WAJIB)
  // =================================================
  useEffect(() => {

    if (user?.id) {

      fetchProfile();
    }

  }, [user?.id]);





  // === STATE FORM & MODAL ===
  // const [profileData, setprofileData] = useState({ ...profileData });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // === HANDLER ===
  // const handleOpenEdit = () => {
  //    setProfileData({ ...profileData });
  //   setIsEditModalOpen(true);
  // };


const handleOpenEdit = () => {
  setProfileData((prev) => ({ ...prev }));
  setIsEditModalOpen(true);
};

 // =================================================
  // 5. INPUT HANDLER
  // =================================================
  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setProfileData({

      ...profileData,

      [name]: value
    });
  };

  // =================================================
  // 6. UPDATE PROFILE KE BACKEND
  // =================================================
  const handleUpdateProfile = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/profile/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(profileData)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("UPDATE ERROR:", data);
        return { success: false, error: data.detail || data.error || "Update gagal" };
      }

      await fetchProfile();
      setIsEditModalOpen(false);

      return { success: true, data };
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      return { success: false, error: error.message || "Update gagal" };
    }
  };


  const handleSubmit = async (e, type) => {
    e.preventDefault();

    if (type === "edit") {
      const result = await handleUpdateProfile();
      if (result.success) {
        setIsSuccessModalOpen(true);
        setTimeout(() => setIsSuccessModalOpen(false), 2500);
      } else {
        alert(`Gagal update profile: ${result.error}`);
      }
    }

    if (type === "pass") {
      setIsPassModalOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 2500);
    }
  };

  // const handleSubmit = (e, type) => {
  //   e.preventDefault();
  //   if (type === "edit") {
  //     setProfileData(profileData);
  //     setIsEditModalOpen(false);
  //   }
  //   if (type === "pass") setIsPassModalOpen(false);
    
  //   setIsSuccessModalOpen(true);
  //   setTimeout(() => setIsSuccessModalOpen(false), 2500);
  // };






  return (
    <div className="profile-page-container">
      
      {/* NAVBAR */}
      {/* ✅ MENGGUNAKAN CLASS profile-navbar-dark DARI CSS ANDA AGAR WARNANYA BIRU GELAP */}
      <nav className="profile-navbar-dark">
        <div className="navbar-left" style={{ cursor: 'pointer' }} onClick={() => navigate("/verifikator")}>
          {/* ✅ LOGO DISAMAKAN UKURANNYA DENGAN DASHBOARD ADMIN (55px) DAN TEKS REDUNDAN DIHAPUS */}
          <div className="branding-container-small" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              alt="Logo" 
              className="branding-logo-small" 
              style={{ height: '70px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>
        </div>
        <div className="navbar-right">
          <button className="nav-btn-plain" onClick={() => setIsPassModalOpen(true)}>Ganti Kata Sandi</button>
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
            
            <h2 className="profile-section-title">Profile Verifikator</h2>
            <div className="profile-info-grid">
              <span className="grid-label">Nama Lengkap</span><span className="grid-colon">:</span><span className="grid-value">{profileData.nama_lengkap}</span>
              <span className="grid-label">NIP</span><span className="grid-colon">:</span><span className="grid-value">{profileData.nip}</span>
              <span className="grid-label">Email Aktif</span><span className="grid-colon">:</span><span className="grid-value">{profileData.email}</span>
              <span className="grid-label">No.HP</span><span className="grid-colon">:</span><span className="grid-value">{profileData.no_hp}</span>
              <span className="grid-label">Alamat</span><span className="grid-colon">:</span><span className="grid-value">{profileData.alamat}</span>
              <span className="grid-label">Role</span><span className="grid-colon">:</span><span className="grid-value">{profileData.role}</span>
              {/* ✅ DITAMBAHKAN: Tampilan Wilayah Kerja */}
              <span className="grid-label">Wilayah Kerja</span><span className="grid-colon">:</span><span className="grid-value">{profileData.wilayah_kerja || "Belum Ditentukan"}</span>
            </div>

            <h2 className="profile-section-title" style={{ marginTop: '40px' }}>Instansi</h2>
            <div className="profile-info-grid">
              <span className="grid-label">Nama Instansi</span><span className="grid-colon">:</span><span className="grid-value">{profileData.instansi}</span>
              <span className="grid-label">Alamat</span><span className="grid-colon">:</span><span className="grid-value">{profileData.alamat_instansi}</span>
              <span className="grid-label">Kepala Dinas</span><span className="grid-colon">:</span><span className="grid-value">{profileData.nama_kepala_dinas}</span>
              <span className="grid-label">NIP</span><span className="grid-colon">:</span><span className="grid-value">{profileData.nip_kepala_dinas}</span>
            </div>

          </div>
        </div>

        {/* ================= TOMBOL BAWAH (KEMBALI DITAMBAHKAN) ================= */}
        <div className="profile-actions-bottom">
          <button 
            className="btn-profile-back" 
            onClick={() => navigate("/verifikator")} // Mengarah kembali ke Dashboard Verifikator
          >
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
              <form onSubmit={(e) => handleSubmit(e, "edit")}>
                
                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi Staff</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap</label><input type="text" name="nama_lengkap" value={profileData.nama_lengkap} onChange={handleInputChange} required /></div>
                    
                    {/* INPUT NIK DIUBAH MENJADI DROPDOWN ROLE */}
                    <div className="form-group-modal">
                      <label>Role</label>
                      <select name="role" value={profileData.role} onChange={handleInputChange} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}>
                        <option value="staff">staff</option>
                        <option value="verifikator">verifikator</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>

                    <div className="form-group-modal"><label>NIP</label><input type="text" name="nip" value={profileData.nip} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Email Aktif</label><input type="email" name="email" value={profileData.email} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>No. HP</label><input type="text" name="no_hp" value={profileData.no_hp} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Alamat</label><input type="text" name="alamat" value={profileData.alamat} onChange={handleInputChange} required /></div>
                    
                    {/* ✅ DITAMBAHKAN: Dropdown Edit Wilayah Kerja */}
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}>
                      <label>Wilayah Kerja (Kecamatan)</label>
                      <select name="wilayah_kerja" value={profileData.wilayah_kerja || ""} onChange={handleInputChange} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}>
                        <option value="" disabled hidden>Pilih Kecamatan Penugasan</option>
                        <option value="Tallo">Tallo</option>
                        <option value="Tamalanrea">Tamalanrea</option>
                        <option value="Biring Kanaya">Biring Kanaya</option>
                        <option value="Panakkukang">Panakkukang</option>
                        <option value="Tamalate">Tamalate</option>
                        <option value="Bontoala">Bontoala</option>
                      </select>
                    </div>

                  </div>
                </div>

                <div className="modal-section" style={{ marginTop: '10px' }}>
                  <h3 className="section-subtitle">Data Instansi</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Instansi</label><input type="text" name="instansi" value={profileData.instansi} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Alamat Instansi</label><input type="text" name="alamat_instansi" value={profileData.alamat_instansi} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Nama Kepala Dinas</label><input type="text" name="nama_kepala_dinas" value={profileData.nama_kepala_dinas} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>NIP Kepala Dinas</label><input type="text" name="nip_kepala_dinas" value={profileData. nip_kepala_dinas} onChange={handleInputChange} required /></div>
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
      {isPassModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPassModalOpen(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><span style={{ fontSize: '20px' }}></span><h2>Ganti Kata Sandi</h2></div></div>
            <div className="modal-body">
              <form onSubmit={(e) => handleSubmit(e, "pass")}>
                <div className="form-group-modal" style={{ marginBottom: '15px' }}><label>Kata Sandi Lama</label><input type="password" required /></div>
                <div className="form-group-modal" style={{ marginBottom: '15px' }}><label>Kata Sandi Baru</label><input type="password" required /></div>
                <div className="form-group-modal" style={{ marginBottom: '25px' }}><label>Konfirmasi Kata Sandi Baru</label><input type="password" required /></div>
                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsPassModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Sandi</button></div>
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

export default VerifikatorProfile;