import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./verifikatordashboard.css"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function VerifikatorDashboard() {
  const navigate = useNavigate();

  // === STATE NAVIGASI & TAB ===
  const [activeMenu, setActiveMenu] = useState("dashboard"); 
  const [activeTab, setActiveTab] = useState("menunggu");
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // === STATE MODAL VALIDASI BANSOS ===
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  // === STATE MODAL VALIDASI PPKS (BARU) ===
  const [isReviewPPKSModalOpen, setIsReviewPPKSModalOpen] = useState(false);
  const [selectedPPKSReview, setSelectedPPKSReview] = useState(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // --- DATA DUMMY NOTIFIKASI ---
  const notifData = [
    { id: 1, title: "Usulan Menunggu Validasi", date: "Hari ini", desc: "Terdapat 12 usulan Bansos baru dari Staf Pengisi Data yang menunggu persetujuan Anda." }
  ];

  // --- DATA DUMMY VALIDASI BANSOS ---
  const dummyUsulan = [
    { id: 1, nik: "3971371863193701", noKk: "0000000000000000", nama: "Cinta", kecamatan: "Tallo", kelurahan: "Wala-walaya", penginput: "Firliany (Staf)", tanggal: "16 Mar 2026", status: "Menunggu" },
    { id: 2, nik: "7270888888888888", noKk: "1111111111111111", nama: "Budi Santoso", kecamatan: "Bontoala", kelurahan: "Baraya", penginput: "Devi (Staf)", tanggal: "15 Mar 2026", status: "Menunggu" },
  ];

  const dummyRiwayat = [
    { id: 3, nik: "7470666666666666", nama: "Siti Aminah", kecamatan: "Tallo", penginput: "Firliany", tanggal: "14 Mar 2026", statusValidasi: "Disetujui", catatan: "-" },
    { id: 4, nik: "7570555555555555", nama: "Andi Pangeran", kecamatan: "Bontoala", penginput: "Devi", tanggal: "13 Mar 2026", statusValidasi: "Ditolak", catatan: "Foto rumah kurang jelas dan NIK tidak sesuai KTP." },
  ];

  // --- DATA DUMMY VALIDASI PPKS (BARU) ---
  const dummyUsulanPPKS = [
    { id: 1, nik: "Belum Diketahui", nama: "Mr. X (Budi Kecil)", kategori: "Anak Jalanan", lokasi: "Lampu Merah Pasar MT Haryono", penginput: "Devi (Staf)", tanggal: "17 Mar 2026", status: "Menunggu", deskripsi: "Ditemukan anak laki-laki usia perkiraan 8 tahun sedang mengamen. Kondisi pakaian lusuh dan tidak mengenakan alas kaki." },
    { id: 2, nik: "3971371863193701", nama: "Supardi", kategori: "Lanjut Usia Terlantar", lokasi: "Jl. Veteran Raya", penginput: "Firliany (Staf)", tanggal: "16 Mar 2026", status: "Menunggu", deskripsi: "Kakek kebingungan dan terlihat sakit di depan ruko yang tutup." },
  ];

  const dummyRiwayatPPKS = [
    { id: 3, nama: "Siti", kategori: "Penyandang Disabilitas", lokasi: "Kecamatan Tallo", penginput: "Firliany", tanggal: "14 Mar 2026", statusValidasi: "Kasus Aktif", catatan: "Valid PPKS. Segera lakukan asesmen lanjutan ke rumahnya dan usulkan bantuan kursi roda." },
  ];

  // Handler Buka Modal Bansos
  const openValidationModal = (data) => {
    setSelectedData(data);
    setIsValidateModalOpen(true);
  };

  // Handler Buka Modal PPKS
  const openValidationPPKSModal = (data) => {
    setSelectedPPKSReview(data);
    setIsReviewPPKSModalOpen(true);
  };

  // Handler Submit Umum (Setuju / Tolak)
  const handleValidationAction = (e) => {
    e.preventDefault();
    setIsValidateModalOpen(false);
    setIsReviewPPKSModalOpen(false);
    setSelectedData(null);
    setSelectedPPKSReview(null);
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 3000);
  };

  return (
    <div className="verifikator-layout relative">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoLinjamsos} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-brand-text"><span>PERLINDUNGAN DAN</span><span>JAMINAN SOSIAL</span></div>
        </div>
        
        <div className="sidebar-profile">
          <div className="profile-avatar-small" style={{ backgroundColor: '#f59e0b' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="profile-info">
            <span className="profile-name">Nama Verifikator</span>
            <span className="profile-nik">Role: Verifikator</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`} onClick={() => setActiveMenu("dashboard")}>
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> Dashboard Utama
          </button>
          
          <div className="menu-group">
            <button className={`menu-item ${activeMenu === "validasi_bansos" ? "active-group" : ""}`} onClick={() => { setActiveMenu("validasi_bansos"); setActiveTab("menunggu"); }}>
              <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> Validasi Bansos
            </button>
          </div>

          <div className="menu-group">
            <button className={`menu-item ${activeMenu === "validasi_ppks" ? "active-group" : ""}`} onClick={() => { setActiveMenu("validasi_ppks"); setActiveTab("menunggu"); }}>
              <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> Validasi PPKS
            </button>
          </div>

          <button className="menu-item" style={{ marginTop: '40px', color: '#ef4444' }} onClick={() => navigate("/login")}>
             <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Keluar
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">
        
        {/* HEADER & NOTIFIKASI DROPDOWN */}
        <header className="main-header">
          <h1 className="header-title">
            {activeMenu === "dashboard" && "Dashboard Verifikator"}
            {activeMenu === "validasi_bansos" && "Validasi Usulan Bansos"}
            {activeMenu === "validasi_ppks" && "Validasi Laporan PPKS"}
          </h1>
          
          <div className="notif-wrapper">
            <button className="nav-bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="notif-badge-red">1</span>
            </button>
            
            {isNotifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header"><h3>Pemberitahuan</h3></div>
                <div className="notif-body">
                  {notifData.map((n) => (
                    <div className="notif-item" key={n.id}>
                      <div className="notif-title-row"><h4>{n.title}</h4><span>{n.date}</span></div>
                      <p>{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {isNotifOpen && <div className="notif-backdrop" onClick={() => setIsNotifOpen(false)}></div>}

        <div className="content-body">

          {/* ================= HALAMAN DASHBOARD UTAMA VERIFIKATOR ================= */}
          {activeMenu === "dashboard" && (
            <div className="dashboard-verifikator-wrapper">
              
              <h3 className="section-title" style={{ marginTop: 0 }}>Tugas Menunggu Validasi</h3>
              <div className="task-summary-grid">
                <div className="task-card bansos-task">
                  <div className="task-card-icon">
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  </div>
                  <div className="task-card-info">
                    <h4>Usulan Bansos Baru</h4>
                    <p>Membutuhkan persetujuan Anda</p>
                  </div>
                  <div className="task-card-count"><span>12</span></div>
                  <button className="task-card-btn" onClick={() => { setActiveMenu("validasi_bansos"); setActiveTab("menunggu"); }}>
                    Validasi Sekarang &rarr;
                  </button>
                </div>

                <div className="task-card ppks-task">
                  <div className="task-card-icon">
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  </div>
                  <div className="task-card-info">
                    <h4>Laporan PPKS</h4>
                    <p>Membutuhkan review kelayakan</p>
                  </div>
                  <div className="task-card-count"><span>5</span></div>
                  <button className="task-card-btn" onClick={() => { setActiveMenu("validasi_ppks"); setActiveTab("menunggu"); }}>
                    Validasi Sekarang &rarr;
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '40px' }}>
                <div className="dtsen-summary-top">
                  <div className="dtsen-top-content">
                    <div>
                      <h2 className="dtsen-top-title">Total Keluarga Terdaftar di DTSEN</h2>
                      <p className="dtsen-top-subtitle">Data terpadu Kota Makassar yang telah tervalidasi</p>
                    </div>
                    <div className="dtsen-top-number">1.500 <span>Keluarga</span></div>
                  </div>
                </div>

                <h3 className="section-title" style={{ marginBottom: '15px' }}>Sebaran Desil Kesejahteraan</h3>
                <div className="decile-grid">
                  <div className="decile-card d1"><div className="dec-head"><span className="dec-badge d1-bg">Desil 1</span></div><div className="dec-title">Sangat Rentan / Ekstrem</div><div className="dec-val">200 <span>Keluarga</span></div></div>
                  <div className="decile-card d2"><div className="dec-head"><span className="dec-badge d2-bg">Desil 2</span></div><div className="dec-title">Keluarga Rentan</div><div className="dec-val">350 <span>Keluarga</span></div></div>
                  <div className="decile-card d3"><div className="dec-head"><span className="dec-badge d3-bg">Desil 3</span></div><div className="dec-title">Hampir Rentan</div><div className="dec-val">400 <span>Keluarga</span></div></div>
                  <div className="decile-card d4"><div className="dec-head"><span className="dec-badge d4-bg">Desil 4</span></div><div className="dec-title">Rentan Sedang</div><div className="dec-val">250 <span>Keluarga</span></div></div>
                  <div className="decile-card d5"><div className="dec-head"><span className="dec-badge d5-bg">Desil 5</span></div><div className="dec-title">Menuju Aman</div><div className="dec-val">200 <span>Keluarga</span></div></div>
                  <div className="decile-card d6"><div className="dec-head"><span className="dec-badge d6-bg">Desil 6-10</span></div><div className="dec-title">Keluarga Mampu / Aman</div><div className="dec-val">100 <span>Keluarga</span></div></div>
                </div>
              </div>
            </div>
          )}
          
          {/* ================= HALAMAN VALIDASI BANSOS ================= */}
          {activeMenu === "validasi_bansos" && (
            <>
              <div className="tabs-container">
                <button className={`tab-btn ${activeTab === "menunggu" ? "active" : ""}`} onClick={() => setActiveTab("menunggu")}>Menunggu Validasi</button>
                <button className={`tab-btn ${activeTab === "riwayat" ? "active" : ""}`} onClick={() => setActiveTab("riwayat")}>Riwayat Validasi</button>
              </div>

              {activeTab === "menunggu" && (
                <div className="outline-box">
                  <div className="alert-info-box warning" style={{ marginBottom: '25px', backgroundColor: '#fffbeb', border: '1px solid #fde047', borderRadius: '8px', padding: '16px', display: 'flex', gap: '15px' }}>
                    <svg style={{color: '#d97706', flexShrink: 0}} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#b45309', fontSize: '15px' }}>Tugas Validasi Usulan Bansos</h4>
                      <p style={{ margin: 0, color: '#b45309', fontSize: '13px' }}>Mohon periksa dengan teliti kelengkapan dokumen dan data yang diunggah oleh staf pengisi data sebelum memberikan persetujuan (Setuju/Tolak).</p>
                    </div>
                  </div>

                  <div className="verifikator-filter-grid">
                    <div className="filter-group-top"><label>Kecamatan</label><select defaultValue=""><option value="" disabled hidden>Semua Kecamatan</option></select></div>
                    <div className="filter-group-top"><label>Kelurahan/Desa</label><select defaultValue=""><option value="" disabled hidden>Semua Kelurahan</option></select></div>
                    <div className="filter-group-top"><label>NIK / No. KK</label><input type="text" placeholder="" /></div>
                    <div className="filter-group-top align-bottom"><button className="btn-search-outline"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Cari Data</button></div>
                  </div>

                  <div className="table-wrapper">
                    <div className="table-responsive">
                      <table className="verifikator-table">
                        <thead>
                          <tr><th>NIK</th><th>Nama Lengkap</th><th>Kecamatan</th><th>Tgl Usulan</th><th>Petugas Penginput</th><th style={{ textAlign: "center" }}>Status</th><th style={{ textAlign: "center" }}>Tindakan</th></tr>
                        </thead>
                        <tbody>
                          {dummyUsulan.map((item) => (
                            <tr key={item.id}>
                              <td>{item.nik}</td><td style={{ fontWeight: '600' }}>{item.nama}</td><td>{item.kecamatan}</td><td>{item.tanggal}</td>
                              <td style={{ color: '#3b82f6', fontWeight: '600' }}>{item.penginput}</td>
                              <td style={{ textAlign: "center" }}><span className="badge-status-v waiting">Menunggu Review</span></td>
                              <td style={{ textAlign: "center" }}>
                                <button className="btn-review-action" onClick={() => openValidationModal(item)}>
                                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Review
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "riwayat" && (
                <div className="outline-box">
                  <div className="table-wrapper">
                    <div className="table-responsive">
                      <table className="verifikator-table">
                        <thead>
                          <tr><th>NIK</th><th>Nama Lengkap</th><th>Tgl Usulan</th><th>Penginput</th><th style={{ textAlign: "center" }}>Status Validasi</th><th>Catatan Verifikator</th></tr>
                        </thead>
                        <tbody>
                          {dummyRiwayat.map((item) => (
                            <tr key={item.id}>
                              <td>{item.nik}</td><td style={{ fontWeight: '600' }}>{item.nama}</td><td>{item.tanggal}</td><td>{item.penginput}</td>
                              <td style={{ textAlign: "center" }}><span className={`badge-status-v ${item.statusValidasi === "Disetujui" ? "approved" : "rejected"}`}>{item.statusValidasi}</span></td>
                              <td style={{ color: '#64748b', fontSize: '12px' }}>{item.catatan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= HALAMAN VALIDASI PPKS (DIUPDATE) ================= */}
          {activeMenu === "validasi_ppks" && (
            <>
              <div className="tabs-container">
                <button className={`tab-btn ${activeTab === "menunggu" ? "active" : ""}`} onClick={() => setActiveTab("menunggu")}>Menunggu Validasi PPKS</button>
                <button className={`tab-btn ${activeTab === "riwayat" ? "active" : ""}`} onClick={() => setActiveTab("riwayat")}>Riwayat Validasi</button>
              </div>

              {activeTab === "menunggu" && (
                <div className="outline-box">
                  <div className="alert-info-box warning" style={{ marginBottom: '25px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', display: 'flex', gap: '15px' }}>
                    <svg style={{color: '#2563eb', flexShrink: 0}} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '15px' }}>Tugas Validasi Laporan Kasus PPKS</h4>
                      <p style={{ margin: 0, color: '#1e3a8a', fontSize: '13px' }}>Tinjau laporan penemuan dari tim lapangan. Berikan hasil asesmen atau instruksi penanganan jika kasus ini valid, lalu setujui untuk mengubahnya menjadi "Kasus Aktif".</p>
                    </div>
                  </div>

                  <div className="verifikator-filter-grid">
                    <div className="filter-group-top"><label>Kategori PPKS</label><select defaultValue=""><option value="" disabled hidden>Semua Kategori</option></select></div>
                    <div className="filter-group-top"><label>Kecamatan/Lokasi</label><input type="text" placeholder="Cari lokasi..." /></div>
                    <div className="filter-group-top"><label>Nama/Identitas</label><input type="text" placeholder="" /></div>
                    <div className="filter-group-top align-bottom"><button className="btn-search-outline"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Cari Data</button></div>
                  </div>

                  <div className="table-wrapper">
                    <div className="table-responsive">
                      <table className="verifikator-table">
                        <thead>
                          <tr><th>Nama / Identitas</th><th>Kategori PPKS</th><th>Lokasi Penemuan</th><th>Tgl Laporan</th><th>Petugas Penginput</th><th style={{ textAlign: "center" }}>Status</th><th style={{ textAlign: "center" }}>Tindakan</th></tr>
                        </thead>
                        <tbody>
                          {dummyUsulanPPKS.map((item) => (
                            <tr key={item.id}>
                              <td style={{ fontWeight: '600' }}>{item.nama}<br/><span style={{fontSize:'11px', color:'#64748b', fontWeight:'normal'}}>NIK: {item.nik}</span></td>
                              <td>{item.kategori}</td>
                              <td>{item.lokasi}</td>
                              <td>{item.tanggal}</td>
                              <td style={{ color: '#3b82f6', fontWeight: '600' }}>{item.penginput}</td>
                              <td style={{ textAlign: "center" }}><span className="badge-status-v waiting">Menunggu Review</span></td>
                              <td style={{ textAlign: "center" }}>
                                <button className="btn-review-action" onClick={() => openValidationPPKSModal(item)}>
                                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Review Kasus
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "riwayat" && (
                <div className="outline-box">
                  <div className="table-wrapper">
                    <div className="table-responsive">
                      <table className="verifikator-table">
                        <thead>
                          <tr><th>Nama / Identitas</th><th>Kategori PPKS</th><th>Tgl Laporan</th><th>Penginput</th><th style={{ textAlign: "center" }}>Status Keputusan</th><th>Hasil Asesmen (Instruksi)</th></tr>
                        </thead>
                        <tbody>
                          {dummyRiwayatPPKS.map((item) => (
                            <tr key={item.id}>
                              <td style={{ fontWeight: '600' }}>{item.nama}</td><td>{item.kategori}</td><td>{item.tanggal}</td><td>{item.penginput}</td>
                              <td style={{ textAlign: "center" }}><span className="badge-status-v approved">{item.statusValidasi}</span></td>
                              <td style={{ color: '#64748b', fontSize: '12px' }}>{item.catatan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* ================= MODAL VALIDASI BANSOS ================= */}
      {isValidateModalOpen && selectedData && (
        <div className="modal-overlay" onClick={() => setIsValidateModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2>Review Data Usulan Bansos</h2>
              </div>
            </div>
            <div className="modal-body">
              <div className="alert-info-box" style={{ backgroundColor: '#f1f5f9', border: '1px dashed #94a3b8', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
                <div><span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>DIINPUT OLEH:</span><strong style={{ color: '#234a66' }}>{selectedData.penginput}</strong></div>
                <div style={{ textAlign: 'right' }}><span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>TANGGAL USULAN:</span><strong style={{ color: '#234a66' }}>{selectedData.tanggal}</strong></div>
              </div>
              <div className="modal-section">
                <h3 className="section-subtitle">Data Pribadi Keluarga (Read-Only)</h3>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>NIK</label><input type="text" value={selectedData.nik} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>No. KK</label><input type="text" value={selectedData.noKk} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Nama Lengkap</label><input type="text" value={selectedData.nama} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Alamat & Kecamatan</label><input type="text" value={`${selectedData.kelurahan}, Kec. ${selectedData.kecamatan}`} readOnly className="input-readonly" /></div>
                </div>
              </div>
              <div className="modal-section">
                <h3 className="section-subtitle">Dokumentasi Aset (Bukti Foto)</h3>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <div style={{ width: '150px', height: '120px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px solid #cbd5e1' }}>[Foto Tampak Depan]</div>
                  <div style={{ width: '150px', height: '120px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px solid #cbd5e1' }}>[Foto Ruang Tamu]</div>
                </div>
              </div>
              <form onSubmit={(e) => handleValidationAction(e)} style={{ marginTop: '30px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
                <div className="form-group-modal" style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#ef4444' }}>Catatan Revisi / Alasan Penolakan (Opsional)</label>
                  <textarea rows="3" style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', width: '100%', outline: 'none', resize: 'vertical' }} placeholder="Isi catatan jika data dikembalikan ke Staf untuk diperbaiki..."></textarea>
                </div>
                <div className="modal-actions" style={{ gap: '20px' }}>
                  <button type="button" className="btn-modal-danger" style={{ width: '100%', padding: '15px' }} onClick={(e) => handleValidationAction(e)}>Tolak & Kembalikan ke Staf</button>
                  <button type="submit" className="btn-modal-submit" style={{ width: '100%', padding: '15px' }}>Validasi & Setujui Data</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL VALIDASI / REVIEW Laporan PPKS (BARU) ================= */}
      {isReviewPPKSModalOpen && selectedPPKSReview && (
        <div className="modal-overlay" onClick={() => setIsReviewPPKSModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2>Review Laporan Kasus PPKS</h2>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="alert-info-box" style={{ backgroundColor: '#f1f5f9', border: '1px dashed #94a3b8', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
                <div><span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>DILAPORKAN OLEH:</span><strong style={{ color: '#234a66' }}>{selectedPPKSReview.penginput}</strong></div>
                <div style={{ textAlign: 'right' }}><span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>TANGGAL LAPORAN:</span><strong style={{ color: '#234a66' }}>{selectedPPKSReview.tanggal}</strong></div>
              </div>

              <div className="modal-section">
                <h3 className="section-subtitle">Data Temuan Lapangan (Read-Only)</h3>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>Nama / Alias</label><input type="text" value={selectedPPKSReview.nama} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Kategori PPKS</label><input type="text" value={selectedPPKSReview.kategori} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}><label>Lokasi Presisi Penemuan</label><input type="text" value={selectedPPKSReview.lokasi} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}><label>Deskripsi Kondisi / Kasus</label><textarea rows="3" value={selectedPPKSReview.deskripsi} readOnly className="input-readonly" style={{ resize: 'none' }}></textarea></div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-subtitle">Dokumentasi (Foto Kondisi TKP)</h3>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <div style={{ width: '200px', height: '140px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px solid #cbd5e1' }}>[Preview Foto TKP]</div>
                </div>
              </div>

              {/* FORM ASESMEN & PERSETUJUAN */}
              <form onSubmit={(e) => handleValidationAction(e)} style={{ marginTop: '30px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
                <div className="form-group-modal" style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#15803d' }}>Hasil Asesmen / Instruksi Penanganan Lanjutan*</label>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px 0' }}>Berikan instruksi kepada staf lapangan apa yang harus dilakukan selanjutnya (misal: Rujuk ke RS, Masukkan Panti, dll) jika kasus ini disetujui. Atau berikan alasan jika ditolak.</p>
                  <textarea rows="4" style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', width: '100%', outline: 'none', resize: 'vertical' }} placeholder="Ketik hasil asesmen atau instruksi di sini..." required></textarea>
                </div>
                
                <div className="modal-actions" style={{ gap: '20px' }}>
                  <button type="button" className="btn-modal-danger" style={{ width: '100%', padding: '15px' }} onClick={(e) => handleValidationAction(e)}>
                    Tolak Laporan (Bukan Kasus)
                  </button>
                  <button type="submit" className="btn-modal-submit" style={{ width: '100%', padding: '15px', backgroundColor: '#1d4ed8' }}>
                    Validasi & Jadikan "Kasus Aktif"
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SUCCESS UMUM ================= */}
      {isSuccessModalOpen && (<div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}><div className="modal-content" style={{maxWidth: '400px', borderTop: '8px solid #22c55e'}}><div className="modal-body text-center" style={{ padding: '40px 20px' }}><div style={{width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto'}}><svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></div><h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Tindakan Berhasil!</h2><p style={{ color: '#475569', fontSize: '13px', margin: '0' }}>Data telah diperbarui dan diteruskan ke sistem.</p></div></div></div>)}

    </div>
  );
}

export default VerifikatorDashboard;