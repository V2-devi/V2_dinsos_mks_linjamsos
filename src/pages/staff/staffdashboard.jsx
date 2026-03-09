import React, { useState } from "react";
import "./staffdashboard.css";
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function StaffDashboard() {
  // === LOGIKA HIGHLIGHT CERDAS ===
  const [activeMenu, setActiveMenu] = useState("penentuan_desil"); // Track menu sidebar
  const [activeTab, setActiveTab] = useState("menunggu_penentuan"); // Track tab aktif
  const [detailTab, setDetailTab] = useState("data_keluarga"); // Track sub-tab detail keluarga
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // === STATE UNTUK POP-UP BANSOS & DTSEN ===
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isIndividuModalOpen, setIsIndividuModalOpen] = useState(false);
  const [isMeninggalModalOpen, setIsMeninggalModalOpen] = useState(false);
  const [isHamilModalOpen, setIsHamilModalOpen] = useState(false);
  const [isDisabilitasModalOpen, setIsDisabilitasModalOpen] = useState(false);
  const [isOrtuModalOpen, setIsOrtuModalOpen] = useState(false);
  const [isPendidikanModalOpen, setIsPendidikanModalOpen] = useState(false);
  const [isEditAsetModalOpen, setIsEditAsetModalOpen] = useState(false);

  // === STATE UNTUK POP-UP PPKS ===
  const [isAddPPKSModalOpen, setIsAddPPKSModalOpen] = useState(false);
  const [selectedPPKS, setSelectedPPKS] = useState(null);

  // === STATE UNTUK POP-UP PENENTUAN DESIL ===
  const [isKalkulasiModalOpen, setIsKalkulasiModalOpen] = useState(false);
  const [selectedKalkulasi, setSelectedKalkulasi] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false); 

  const [disabilitasTab, setDisabilitasTab] = useState("individu"); 
  const [ortuTab, setOrtuTab] = useState("status"); 

  // --- DATA DUMMY BANSOS & DTSEN ---
  const dummyPengusulan = [
    { nik: "397137186319370137021", noKk: "0000000000000000", nama: "Cinta", kecamatan: "Camat", kelurahan: "Apasaja", tanggal: "14 Februari 2026", alamat: "Jln. xxxxxxxxxxxx" },
    { nik: "397137186319370137022", noKk: "1111111111111111", nama: "Budi", kecamatan: "Camat", kelurahan: "Bebas", tanggal: "15 Februari 2026", alamat: "Jln. yyyyyyyyyyyy" },
  ];

  const dummyDtsen = [
    { noKk: "397137186319370137021", namaKepala: "Cinta", alamat: "Jln. xxxxxxxxxxxx", desil: "2" },
    { noKk: "397137186319370137022", namaKepala: "Budi", alamat: "Jln. yyyyyyyyyyyy", desil: "4" },
    { noKk: "397137186319370137023", namaKepala: "Andi", alamat: "Jln. zzzzzzzzzzzz", desil: "1" },
  ];

  const dummyKeluarga = [
    { nik: "397137186319370137021", nama: "Cinta", hub: "Ibu", ttl: "xxxxxxxxx", kerja: "Wirausaha", jk: "Perempuan" },
    { nik: "3242536444444444444", nama: "Anak Cinta1", hub: "Anak", ttl: "xxxxxxxxx", kerja: "Pelajar", jk: "Laki-laki" },
    { nik: "211111143354134545455", nama: "Anak Cinta2", hub: "Anak", ttl: "xxxxxxxxx", kerja: "Pelajar", jk: "Perempuan" },
  ];

  // --- DATA DUMMY PPKS ---
  const dummyPPKS = [
    { id: 1, nik: "397137186319370137021", nama: "Supardi", kategori: "Lanjut Usia Terlantar", lokasi: "Jl. Veteran Raya", tanggal: "10 Mar 2026", status: "Kasus Aktif", deskripsiAwal: "Ditemukan kakek kebingungan dan terlihat sakit di depan ruko yang tutup. Mengaku bernama Supardi tapi lupa alamat.", hasilAssessment: "Valid PPKS. Peksos merujuk sementara ke Rumah Singgah Dinsos untuk perawatan medis dasar dan pencarian keluarga." },
    { id: 2, nik: "Belum Diketahui", nama: "Mr. X (Budi Kecil)", kategori: "Anak Jalanan", lokasi: "Lampu Merah Pasar", tanggal: "12 Mar 2026", status: "Menunggu Kelayakan", deskripsiAwal: "Ditemukan seorang anak laki-laki usia perkiraan 8 tahun sedang mengamen di lampu merah. Kondisi pakaian lusuh dan tidak mengenakan alas kaki. Mengaku bernama Budi namun tidak tahu dimana orang tuanya." },
    { id: 3, nik: "397137186319370137023", nama: "Siti", kategori: "Penyandang Disabilitas", lokasi: "Kecamatan Tallo", tanggal: "14 Mar 2026", status: "Selesai", deskripsiAwal: "Laporan warga ada penyandang disabilitas fisik tidak terurus oleh keluarga.", hasilAssessment: "Telah dilakukan kunjungan rumah. Keluarga butuh edukasi dan bantuan kursi roda.", tindakanPenyelesaian: "Diberikan bantuan kursi roda dan edukasi perawatan. Keluarga bersedia merawat kembali.", tanggalSelesai: "18 Mar 2026" },
  ];

  const chartPPKS = [
    { nama: "Lanjut Usia Terlantar", jumlah: 245, persentase: "85%" },
    { nama: "Anak Jalanan / Anak Terlantar", jumlah: 180, persentase: "65%" },
    { nama: "Penyandang Disabilitas", jumlah: 150, persentase: "50%" },
    { nama: "Gelandangan & Pengemis", jumlah: 120, persentase: "40%" },
    { nama: "Korban Tindak Kekerasan", jumlah: 85, persentase: "30%" },
    { nama: "Perempuan Rawan Sosial Ekonomi", jumlah: 60, persentase: "20%" },
    { nama: "Pemulung", jumlah: 36, persentase: "15%" },
  ];

  // --- DATA DUMMY PENENTUAN DESIL ---
  const dummyMenungguDesil = [
    { id: 1, noKk: "3971371863193701311", nama: "Ahmad Sudirman", kelurahan: "Tallo", tglUpdate: "16 Mar 2026", kelengkapan: "Lengkap (39/39 Vrb)" },
    { id: 2, noKk: "3971371863193701322", nama: "Siti Aminah", kelurahan: "Wala-walaya", tglUpdate: "17 Mar 2026", kelengkapan: "Lengkap (39/39 Vrb)" }
  ];

  const dummyRiwayatDesil = [
    { noKk: "3971371863193701333", nama: "Kaharuddin", kelurahan: "Tallo", tglHitung: "15 Mar 2026", skor: "45.2", desil: "3" },
    { noKk: "3971371863193701344", nama: "Marniati", kelurahan: "Bontoala", tglHitung: "14 Mar 2026", skor: "78.5", desil: "1" }
  ];

  const notifData = [{ id: 1, title: "Pengusulan Akun Oleh XXXXX", date: "15/09", desc: "Segera lakukan pembuatan akun yang telah diusulkan..." }];

  const handleGenericSubmit = (e, closeModalFunc) => {
    e.preventDefault();
    if(closeModalFunc) closeModalFunc(false);
    setSelectedPPKS(null);
    setIsKalkulasiModalOpen(false);
    setIsCalculated(false);
    setIsSuccessModalOpen(true);
    setTimeout(() => { setIsSuccessModalOpen(false); }, 3000);
  };

  const handleBackFromDetail = () => {
    if (activeMenu === "usulan_baru") setActiveTab("pengusulan");
    if (activeMenu === "lihat_dtsen") setActiveTab("data_dtsen");
  };

  const getBadgeClass = (status) => {
    if (status === 'Selesai') return 'badge-selesai';
    if (status === 'Kasus Aktif') return 'badge-aktif';
    return 'badge-menunggu';
  };

  const handleJalankanKalkulasi = () => {
    setIsCalculated(true);
  };

  return (
    <div className="staff-layout relative">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoLinjamsos} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-brand-text"><span>PERLINDUNGAN DAN</span><span>JAMINAN SOSIAL</span></div>
        </div>
        <div className="sidebar-profile">
          <div className="profile-avatar-small"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path></svg></div>
          <div className="profile-info"><span className="profile-name">Firliany</span><span className="profile-nik">12345678912131230</span></div>
        </div>
        <nav className="sidebar-menu">
          
          <button className={`menu-item ${activeMenu === "usulan_baru" ? "active" : ""}`} onClick={() => { setActiveMenu("usulan_baru"); setActiveTab("dashboard"); }}>
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Usulan Baru
          </button>
          
          <div className="menu-group">
            <button className={`menu-item ${(activeMenu === "lihat_dtsen" || activeMenu === "ppks") ? "active-group" : ""}`}>
              <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> DTSEN & PPKS
            </button>
            <div className="submenu">
              <button className={`submenu-item ${activeMenu === "lihat_dtsen" ? "active-submenu" : ""}`} onClick={() => { setActiveMenu("lihat_dtsen"); setActiveTab("dashboard_dtsen"); }}>Lihat DTSEN</button>
              <button className={`submenu-item ${activeMenu === "ppks" ? "active-submenu" : ""}`} onClick={() => { setActiveMenu("ppks"); setActiveTab("dashboard_ppks"); }}>Daftar Pemerlu (PPKS)</button>
            </div>
          </div>

          <button className={`menu-item ${activeMenu === "penentuan_desil" ? "active" : ""}`} onClick={() => { setActiveMenu("penentuan_desil"); setActiveTab("menunggu_penentuan"); }}>
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg> 
            Penentuan Desil
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="main-content">
        <header className="main-header">
          <h1 className="header-title">
            {activeMenu === "usulan_baru" && "Usulan Baru Bansos"}
            {activeMenu === "lihat_dtsen" && "Data Terpadu Sosial Ekonomi Nasional (DTSEN)"}
            {activeMenu === "ppks" && "Pengusulan Daftar PPKS"}
            {activeMenu === "penentuan_desil" && "Kalkulasi & Penentuan Desil Keluarga"}
          </h1>
          <button className="nav-bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
        </header>

        {isNotifOpen && (
          <><div className="notif-overlay-transparent" onClick={() => setIsNotifOpen(false)}></div><div className="notif-popup"><div className="notif-header"><h3>Pemberitahuan</h3></div><div className="notif-body">{notifData.map((n) => (<div className="notif-item" key={n.id}><div className="notif-title-row"><h4>{n.title}</h4><span>{n.date}</span></div><p>{n.desc}</p></div>))}</div></div></>
        )}

        <div className="content-body">
          
          {/* TABS NAVIGASI DINAMIS */}
          {activeTab !== "detail_keluarga" && activeMenu === "usulan_baru" && (
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard Usulan Baru</button>
              <button className={`tab-btn ${activeTab === "pengusulan" ? "active" : ""}`} onClick={() => setActiveTab("pengusulan")}>Pengusulan Bansos</button>
            </div>
          )}
          {activeTab !== "detail_keluarga" && activeMenu === "lihat_dtsen" && (
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === "dashboard_dtsen" ? "active" : ""}`} onClick={() => setActiveTab("dashboard_dtsen")}>Dashboard DTSEN</button>
              <button className={`tab-btn ${activeTab === "data_dtsen" ? "active" : ""}`} onClick={() => setActiveTab("data_dtsen")}>Lihat Data DTSEN</button>
            </div>
          )}
          {activeTab !== "detail_keluarga" && activeMenu === "ppks" && (
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === "dashboard_ppks" ? "active" : ""}`} onClick={() => setActiveTab("dashboard_ppks")}>Dashboard Data PPKS</button>
              <button className={`tab-btn ${activeTab === "data_ppks" ? "active" : ""}`} onClick={() => setActiveTab("data_ppks")}>Daftar Data PPKS</button>
            </div>
          )}
          {activeTab !== "detail_keluarga" && activeMenu === "penentuan_desil" && (
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === "menunggu_penentuan" ? "active" : ""}`} onClick={() => setActiveTab("menunggu_penentuan")}>Data Menunggu Penentuan</button>
              <button className={`tab-btn ${activeTab === "riwayat_penentuan" ? "active" : ""}`} onClick={() => setActiveTab("riwayat_penentuan")}>Riwayat Penentuan Desil</button>
            </div>
          )}

          {/* ================= 1. KONTEN MENU USULAN BARU ================= */}
          {activeMenu === "usulan_baru" && activeTab === "dashboard" && (
            <div className="tab-content-wrapper outline-box">
              <div className="filter-row"><div className="pill-select-wrapper"><select defaultValue=""><option value="" disabled hidden>Pilih Periode</option><option value="q1">Januari - Maret</option></select></div></div>
              <div className="stats-grid">
                <div className="stat-card-outline"><h4>Total Usulan</h4><div className="stat-number">123 <span>Usulan</span></div></div>
                <div className="stat-card-outline"><h4>Selesai Verifikasi</h4><div className="stat-number">100 <span>Usulan</span></div></div>
                <div className="stat-card-outline"><h4>Belum Verifikasi</h4><div className="stat-number">20 <span>Usulan</span></div></div>
              </div>
              <div className="chart-section" style={{ border: 'none', padding: '0', backgroundColor: 'transparent' }}>
                <h3 className="chart-title" style={{ marginTop: '20px' }}>Distribusi Hasil Kelayakan</h3>
                <div className="chart-content">
                  <div className="chart-graphic"><div className="donut-chart"><div className="donut-inner"></div></div><span className="chart-label-top">963</span><span className="chart-label-bottom">886</span></div>
                  <div className="chart-legend">
                    <div className="legend-box green"><div className="legend-header"><div className="legend-indicator"></div><span className="legend-name">Layak Bansos</span><span className="legend-value">963 <span>(55%)</span></span></div></div>
                    <div className="legend-box red"><div className="legend-header"><div className="legend-indicator"></div><span className="legend-name">Tidak Layak <span className="light">(45%)</span></span></div><ul className="legend-details"><li><span>Dianggap mampu</span> <span>700 orang</span></li><li><span>Pindah/Tidak di temukan</span> <span>86 orang</span></li><li><span>Meninggal dunia</span> <span>100 orang</span></li></ul></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "usulan_baru" && activeTab === "pengusulan" && (
            <div className="tab-content-wrapper outline-box">
              <div className="pengusulan-filter-grid">
                <div className="filter-group-top"><label>Kecamatan</label><div className="select-container-custom"><select defaultValue=""><option value="" disabled hidden>Pilih Kecamatan</option><option value="camat1">Kecamatan A</option></select></div></div>
                <div className="filter-group-top"><label>Kelurahan/Desa</label><div className="select-container-custom"><select defaultValue=""><option value="" disabled hidden>Pilih Kelurahan/Desa</option><option value="desa1">Kelurahan A</option></select></div></div>
                <div className="filter-group-top"><label>NIK (0-16)</label><input type="text" className="input-custom" placeholder="" /></div>
                <div className="filter-group-top"><label>Nama</label><input type="text" className="input-custom" placeholder="" /></div>
                <div className="filter-group-top align-bottom"><button className="btn-search-outline"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Cari ....</button></div>
              </div>
              <div className="action-row-right"><button className="btn-add-staff" onClick={() => setIsAddModalOpen(true)}><span className="plus-icon">+</span> Tambah Usulan</button></div>
              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead><tr><th>NIK</th><th>No.KK</th><th>Nama Lengkap</th><th>Kecamatan</th><th>Kelurahan</th><th>Tanggal Pengusulan</th><th>Alamat</th><th style={{ textAlign: "center" }}>Status Kelayakan</th><th style={{ textAlign: "center" }}>Keterangan</th></tr></thead>
                    <tbody>
                      {dummyPengusulan.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nik}</td><td>{item.noKk}</td><td>{item.nama}</td><td>{item.kecamatan}</td><td>{item.kelurahan}</td><td>{item.tanggal}</td><td>{item.alamat}</td>
                          <td style={{ textAlign: "center" }}><div className="status-badges-group"><span className="badge-status dark-gray">Layak</span><span className="badge-status light-gray">Tidak Layak</span></div></td>
                          <td style={{ textAlign: "center" }}><button className="btn-icon-keterangan" title="Lihat Keterangan" onClick={() => setActiveTab("detail_keluarga")}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* ================= 2. KONTEN MENU LIHAT DTSEN ================= */}
          {activeMenu === "lihat_dtsen" && activeTab === "dashboard_dtsen" && (
            <div className="tab-content-wrapper">
              <div className="dtsen-summary-top">
                <div className="dtsen-top-content">
                  <div><h2 className="dtsen-top-title">Total Keluarga Terdaftar di DTSEN</h2><p className="dtsen-top-subtitle">Data terpadu Kota Makassar</p></div>
                  <div className="dtsen-top-number">1.500 <span>Keluarga</span></div>
                </div>
              </div>
              <h3 className="chart-title" style={{ marginBottom: '15px' }}>Sebaran Desil Kesejahteraan</h3>
              <div className="decile-grid">
                <div className="decile-card d1"><div className="dec-head"><span className="dec-badge d1-bg">Desil 1</span></div><div className="dec-title">Sangat Rentan / Ekstrem</div><div className="dec-val">200 <span>Keluarga</span></div></div>
                <div className="decile-card d2"><div className="dec-head"><span className="dec-badge d2-bg">Desil 2</span></div><div className="dec-title">Keluarga Rentan</div><div className="dec-val">350 <span>Keluarga</span></div></div>
                <div className="decile-card d3"><div className="dec-head"><span className="dec-badge d3-bg">Desil 3</span></div><div className="dec-title">Hampir Rentan</div><div className="dec-val">400 <span>Keluarga</span></div></div>
                <div className="decile-card d4"><div className="dec-head"><span className="dec-badge d4-bg">Desil 4</span></div><div className="dec-title">Rentan Sedang</div><div className="dec-val">250 <span>Keluarga</span></div></div>
                <div className="decile-card d5"><div className="dec-head"><span className="dec-badge d5-bg">Desil 5</span></div><div className="dec-title">Menuju Aman</div><div className="dec-val">200 <span>Keluarga</span></div></div>
                <div className="decile-card d6"><div className="dec-head"><span className="dec-badge d6-bg">Desil 6-10</span></div><div className="dec-title">Keluarga Mampu / Aman</div><div className="dec-val">100 <span>Keluarga</span></div></div>
              </div>
            </div>
          )}

          {activeMenu === "lihat_dtsen" && activeTab === "data_dtsen" && (
            <div className="tab-content-wrapper outline-box">
              <div className="pengusulan-filter-grid">
                <div className="filter-group-top"><label>Kecamatan</label><div className="select-container-custom"><select defaultValue=""><option value="" disabled hidden>Pilih Kecamatan</option><option value="camat1">Kecamatan A</option></select></div></div>
                <div className="filter-group-top"><label>Kelurahan/Desa</label><div className="select-container-custom"><select defaultValue=""><option value="" disabled hidden>Pilih Kelurahan/Desa</option><option value="desa1">Kelurahan A</option></select></div></div>
                <div className="filter-group-top"><label>No. KK</label><input type="text" className="input-custom" placeholder="397137..." /></div>
                <div className="filter-group-top"><label>Nama Kepala Keluarga</label><input type="text" className="input-custom" placeholder="" /></div>
                <div className="filter-group-top align-bottom"><button className="btn-search-outline"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Cari ....</button></div>
              </div>
              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead><tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Alamat</th><th style={{ textAlign: "center" }}>Desil Keluarga</th><th style={{ textAlign: "center" }}>Aksi</th></tr></thead>
                    <tbody>
                      {dummyDtsen.map((item, index) => (
                        <tr key={index}>
                          <td>{item.noKk}</td><td>{item.namaKepala}</td><td>{item.alamat}</td>
                          <td style={{ textAlign: "center", fontWeight: "700", color: "#234a66" }}>{item.desil}</td>
                          <td style={{ textAlign: "center" }}><button className="btn-icon-keterangan" title="Lihat Detail" onClick={() => setActiveTab("detail_keluarga")}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* ================= 3. KONTEN MENU DAFTAR PEMERLU (PPKS) ================= */}
          {activeMenu === "ppks" && activeTab === "dashboard_ppks" && (
            <div className="tab-content-wrapper outline-box">
              <div className="filter-row">
                <div className="pill-select-wrapper">
                  <select defaultValue=""><option value="" disabled hidden>Pilih Periode</option><option value="q1">Januari - Maret</option></select>
                </div>
              </div>
              <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="stat-card-outline"><h4 style={{ color: '#234a66' }}>Kasus Aktif PPKS</h4><div className="stat-number">876 <span>Jiwa</span></div></div>
                <div className="stat-card-outline"><h4 style={{ color: '#234a66' }}>Menunggu Kelayakan</h4><div className="stat-number">100 <span>Usulan</span></div></div>
              </div>
              <div className="chart-section" style={{ marginTop: '30px' }}>
                <h3 className="chart-title">Distribusi Hasil Kategori PPKS (Top 7 Kategori)</h3>
                <div className="ppks-horizontal-chart">
                  {chartPPKS.map((data, index) => (
                    <div className="ppks-bar-row" key={index}>
                      <span className="ppks-label">{data.nama}</span>
                      <div className="ppks-bar-track"><div className="ppks-bar-fill" style={{ width: data.persentase }}></div></div>
                      <span className="ppks-value">{data.jumlah} Jiwa</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '15px', textAlign: 'right' }}>*Hanya menampilkan kategori dengan jumlah kasus tertinggi</p>
              </div>
            </div>
          )}

          {activeMenu === "ppks" && activeTab === "data_ppks" && (
            <div className="tab-content-wrapper outline-box">
              <div className="pengusulan-filter-grid" style={{ gridTemplateColumns: "1fr 1fr auto" }}>
                <div className="filter-group-top">
                  <label>Kategori PPKS</label>
                  <div className="select-container-custom">
                    <select defaultValue="">
                      <option value="" disabled hidden>Semua Kategori (26 Kategori)</option>
                      <option value="1">Anak Balita Terlantar</option>
                      <option value="2">Anak Terlantar</option>
                      <option value="3">Anak yang Berhadapan dengan Hukum (ABH)</option>
                      <option value="4">Anak Jalanan</option>
                      <option value="5">Anak dengan Disabilitas</option>
                      <option value="6">Anak yang Memerlukan Perlindungan Khusus</option>
                      <option value="7">Lanjut Usia Terlantar</option>
                      <option value="8">Penyandang Disabilitas</option>
                      <option value="9">Tuna Susila</option>
                      <option value="10">Gelandangan</option>
                      <option value="11">Pengemis</option>
                      <option value="12">Pemulung</option>
                      <option value="13">Kelompok Minoritas</option>
                      <option value="14">Bekas Warga Binaan Lembaga Permasyarakatan (BWBLP)</option>
                      <option value="15">Orang dengan HIV/AIDS</option>
                      <option value="16">Korban Penyalahgunaan NAPZA</option>
                      <option value="17">Korban Perdagangan Orang</option>
                      <option value="18">Korban Tindak Kekerasan</option>
                      <option value="19">Pekerja Migran Bermasalah Sosial</option>
                      <option value="20">Korban Bencana Alam</option>
                      <option value="21">Korban Bencana Sosial</option>
                      <option value="22">Perempuan Rawan Sosial Ekonomi</option>
                      <option value="23">Fakir Miskin</option>
                      <option value="24">Keluarga Bermasalah Sosial Psikologis</option>
                      <option value="25">Komunitas Adat terpencil (KAT)</option>
                      <option value="26">Orang Terlantar</option>
                    </select>
                  </div>
                </div>
                <div className="filter-group-top">
                  <label>Status Penanganan</label>
                  <div className="select-container-custom">
                    <select defaultValue="">
                      <option value="" disabled hidden>Semua Status</option>
                      <option value="menunggu">Menunggu Kelayakan</option>
                      <option value="aktif">Kasus Aktif</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </div>
                </div>
                <div className="filter-group-top align-bottom"><button className="btn-search-outline"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Cari ....</button></div>
              </div>

              <div className="action-row-right">
                <button className="btn-add-staff" onClick={() => setIsAddPPKSModalOpen(true)}><span className="plus-icon">+</span> Tambah Usulan PPKS</button>
              </div>

              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead><tr><th>NIK / Identitas</th><th>Nama Lengkap</th><th>Kategori PPKS</th><th>Lokasi Penemuan / Alamat</th><th>Tanggal Laporan</th><th style={{ textAlign: "center" }}>Status Penanganan</th><th style={{ textAlign: "center" }}>Aksi</th></tr></thead>
                    <tbody>
                      {dummyPPKS.map((item) => (
                        <tr key={item.id}>
                          <td>{item.nik}</td><td style={{ fontWeight: '600' }}>{item.nama}</td><td>{item.kategori}</td><td>{item.lokasi}</td><td>{item.tanggal}</td>
                          <td style={{ textAlign: "center" }}><span className={`badge-ppks ${getBadgeClass(item.status)}`}>{item.status}</span></td>
                          <td style={{ textAlign: "center" }}><button className="btn-icon-keterangan" title="Lihat Detail PPKS" onClick={() => setSelectedPPKS(item)}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* ================= 4. KONTEN PENENTUAN DESIL ================= */}
          {activeMenu === "penentuan_desil" && activeTab === "menunggu_penentuan" && (
            <div className="tab-content-wrapper outline-box">
              <div className="alert-info-box warning" style={{ marginBottom: '25px', backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                  <strong>Informasi Penentuan Desil</strong>
                  <p>Daftar di bawah ini adalah keluarga yang data asetnya baru saja diinput atau diubah. Silakan lakukan kalkulasi sistem (Proxy Means Testing) untuk menentukan Tingkat Desil Kesejahteraan mereka.</p>
                </div>
              </div>

              <div className="pengusulan-filter-grid">
                <div className="filter-group-top"><label>Kecamatan</label><div className="select-container-custom"><select defaultValue=""><option value="" disabled hidden>Semua Kecamatan</option></select></div></div>
                <div className="filter-group-top"><label>Kelurahan/Desa</label><div className="select-container-custom"><select defaultValue=""><option value="" disabled hidden>Semua Kelurahan</option></select></div></div>
                <div className="filter-group-top"><label>No. KK</label><input type="text" className="input-custom" placeholder="" /></div>
                <div className="filter-group-top"><label>Nama Kepala Keluarga</label><input type="text" className="input-custom" placeholder="" /></div>
                <div className="filter-group-top align-bottom"><button className="btn-search-outline"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Cari ....</button></div>
              </div>

              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead>
                      <tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Kelurahan</th><th>Terakhir Update Data</th><th style={{ textAlign: "center" }}>Kelengkapan Aset</th><th style={{ textAlign: "center" }}>Aksi Kalkulasi</th></tr>
                    </thead>
                    <tbody>
                      {dummyMenungguDesil.map((item) => (
                        <tr key={item.id}>
                          <td>{item.noKk}</td><td style={{ fontWeight: '600' }}>{item.nama}</td><td>{item.kelurahan}</td><td>{item.tglUpdate}</td>
                          <td style={{ textAlign: "center", color: "#15803d", fontWeight: "600" }}>{item.kelengkapan}</td>
                          <td style={{ textAlign: "center" }}>
                            <button className="btn-hitung-desil" onClick={() => { setSelectedKalkulasi(item); setIsKalkulasiModalOpen(true); setIsCalculated(false); }}>
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg> Hitung Desil
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

          {activeMenu === "penentuan_desil" && activeTab === "riwayat_penentuan" && (
            <div className="tab-content-wrapper outline-box">
               <div className="pengusulan-filter-grid">
                <div className="filter-group-top"><label>No. KK</label><input type="text" className="input-custom" placeholder="" /></div>
                <div className="filter-group-top"><label>Nama Kepala Keluarga</label><input type="text" className="input-custom" placeholder="" /></div>
                <div className="filter-group-top"><label>Desil</label><div className="select-container-custom"><select defaultValue=""><option value="" disabled hidden>Semua Desil</option><option value="1">Desil 1</option><option value="2">Desil 2</option></select></div></div>
                <div className="filter-group-top align-bottom"><button className="btn-search-outline"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Cari ....</button></div>
              </div>

              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead>
                      <tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Kelurahan</th><th>Tanggal Hitung</th><th style={{ textAlign: "center" }}>Skor PMT</th><th style={{ textAlign: "center" }}>Desil Hasil</th></tr>
                    </thead>
                    <tbody>
                      {dummyRiwayatDesil.map((item, index) => (
                        <tr key={index}>
                          <td>{item.noKk}</td><td style={{ fontWeight: '600' }}>{item.nama}</td><td>{item.kelurahan}</td><td>{item.tglHitung}</td>
                          <td style={{ textAlign: "center", color: "#64748b" }}>{item.skor}</td>
                          <td style={{ textAlign: "center" }}><span className="desil-badge-table">{item.desil}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {/* ================= KONTEN BERSAMA: DETAIL KELUARGA (Hanya muncul jika klik detail tabel Bansos/DTSEN) ================= */}
          {activeTab === "detail_keluarga" && (
            <div className="tab-content-wrapper outline-box detail-keluarga-box">
              <h2 className="detail-page-title">Detail Data DTSEN No. KK 0000000000000000</h2>
              <div className="detail-inner-tabs">
                <button className={`inner-tab-btn ${detailTab === "data_keluarga" ? "active" : ""}`} onClick={() => setDetailTab("data_keluarga")}>Data Keluarga</button>
                <button className={`inner-tab-btn ${detailTab === "riwayat" ? "active" : ""}`} onClick={() => setDetailTab("riwayat")}>Riwayat Bansos</button>
                <button className={`inner-tab-btn ${detailTab === "aset" ? "active" : ""}`} onClick={() => setDetailTab("aset")}>Aset yang dimiliki</button>
                <button className={`inner-tab-btn ${detailTab === "desil" ? "active" : ""}`} onClick={() => setDetailTab("desil")}>Desil</button>
              </div>

              {detailTab === "data_keluarga" && (
                <>
                  <div className="info-alert-box"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>Detail Informasi Keluarga</span></div>
                  <div className="detail-summary-grid">
                    <div className="summary-col"><div className="summary-item"><span className="sum-label">NO KK</span><span className="sum-val">0000000000000000</span></div><div className="summary-item"><span className="sum-label">NAMA KEPALA KELUARGA</span><span className="sum-val">ASSSSSSSSSSSAS</span></div><div className="summary-item"><span className="sum-label">KABUPATEN</span><span className="sum-val">KOTA MAKASSAR</span></div></div>
                    <div className="summary-col"><div className="summary-item"><span className="sum-label">NIK KEPALA KELUARGA</span><span className="sum-val">0000000000000000</span></div><div className="summary-item"><span className="sum-label">KECAMATAN</span><span className="sum-val">ASSSSSSSSSSSAS</span></div><div className="summary-item"><span className="sum-label">ALAMAT</span><span className="sum-val">KOTA MAKASSAR</span></div></div>
                    <div className="summary-col desil-col"><div className="desil-box-red"><span className="desil-text">TINGKAT DESIL</span><span className="desil-number">3</span></div></div>
                  </div>
                  <div className="table-wrapper" style={{ marginTop: "20px" }}>
                    <div className="table-responsive">
                      <table className="staff-table">
                        <thead><tr><th>NIK</th><th>Nama Lengkap</th><th>Hubungan Keluarga</th><th>Tempat, Tanggal Lahir</th><th>Pekerjaan</th><th style={{ textAlign: "center" }}>Aksi</th></tr></thead>
                        <tbody>
                          {dummyKeluarga.map((anggota, index) => (
                            <tr key={index}>
                              <td>{anggota.nik}</td><td>{anggota.nama}</td><td>{anggota.hub}</td><td>{anggota.ttl}</td><td>{anggota.kerja}</td>
                              <td style={{ textAlign: "center" }}>
                                <div className="action-icons-row">
                                  <button className="action-icn text-blue" onClick={() => setIsIndividuModalOpen(true)}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
                                  <button className="action-icn text-red" onClick={() => setIsMeninggalModalOpen(true)}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM17 9l4 4m0-4l-4 4"></path></svg></button>
                                  {anggota.jk === "Perempuan" && (<button className="action-icn text-pink" onClick={() => setIsHamilModalOpen(true)}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM6 10.5a6 6 0 0112 0v2a6 6 0 01-12 0v-2zM8 18.5v3a1 1 0 002 0v-3h4v3a1 1 0 002 0v-3"></path></svg></button>)}
                                  <button className="action-icn text-yellow" onClick={() => setIsDisabilitasModalOpen(true)}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.333 14.667a4.667 4.667 0 01-4.666 4.666H9.333v-1.166a3.5 3.5 0 113.5-3.5h6.5v.001zM11.667 8.833a2.333 2.333 0 114.666 0 2.333 2.333 0 01-4.666 0z"></path></svg></button>
                                  <button className="action-icn text-green" onClick={() => setIsOrtuModalOpen(true)}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V16a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-4a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>
                                  <button className="action-icn text-blue" onClick={() => setIsPendidikanModalOpen(true)}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {detailTab === "riwayat" && (
                <div className="table-wrapper" style={{ marginTop: "20px" }}>
                  <div className="table-responsive">
                    <table className="staff-table">
                      <thead>
                        <tr><th>No. Kartu</th><th>Jenis Bansos</th><th>Periode</th><th>No. Rekening</th><th>Atas Nama</th><th>Nominal (Rp)</th><th>Status Transaksi</th><th style={{ textAlign: "center" }}>Aksi</th></tr>
                      </thead>
                      <tbody>
                        {[1].map((item, index) => (
                          <tr key={index}>
                            <td>09283197092980371</td><td>PKH</td><td>Januari - Maret 2022</td><td>0899999999999</td><td>Devi Permata</td><td>Rp. 600.000</td><td>Sudah Transaksi</td>
                            <td style={{ textAlign: "center" }}><button className="btn-icon-keterangan"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailTab === "aset" && (
                <div className="aset-container">
                  <div className="aset-grid-3">
                    <div className="aset-column">
                      <div className="aset-header-title"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Kondisi Keluarga</div>
                      <div className="aset-item"><span className="aset-label">Status dalam Keluarga</span><span className="aset-value">Kepala Keluarga</span></div>
                      <div className="aset-item"><span className="aset-label">Usia</span><span className="aset-value">60 Tahun</span></div>
                      <div className="aset-item"><span className="aset-label">Status Perkawinan</span><span className="aset-value">Cerai mati</span></div>
                      <div className="aset-item"><span className="aset-label">Status Pekerjaan</span><span className="aset-value">Usaha Sendiri</span></div>
                      <div className="aset-item"><span className="aset-label">Kepemilikan Usaha</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Anggota dalam Rumah Tangga</span><span className="aset-value">4</span></div>
                    </div>
                    <div className="aset-column">
                      <div className="aset-header-title"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Kondisi Perumahan Keluarga</div>
                      <div className="aset-item"><span className="aset-label">Status kepemilikan rumah</span><span className="aset-value">Milik Sendiri</span></div>
                      <div className="aset-item"><span className="aset-label">Luas Lantai Rumah</span><span className="aset-value">10 x 20 m</span></div>
                      <div className="aset-item"><span className="aset-label">Jenis Lantai</span><span className="aset-value">Keramik</span></div>
                      <div className="aset-item"><span className="aset-label">Jenis dinding</span><span className="aset-value">Tembok</span></div>
                      <div className="aset-item"><span className="aset-label">Jenis Atap</span><span className="aset-value">Seng</span></div>
                      <div className="aset-item"><span className="aset-label">Sumber Air Minum</span><span className="aset-value">Sumur Terlindung</span></div>
                      <div className="aset-item"><span className="aset-label">Jenis Kloset</span><span className="aset-value">Kloset Jongkok</span></div>
                      <div className="aset-item"><span className="aset-label">Tempat Pembuangan Tinja</span><span className="aset-value">Tangki Septik</span></div>
                      <div className="aset-item"><span className="aset-label">Sumber Penerangan</span><span className="aset-value">Listrik PLN</span></div>
                      <div className="aset-item"><span className="aset-label">Daya Listrik</span><span className="aset-value">900 Watt</span></div>
                      <div className="aset-item"><span className="aset-label">Bahan bakar masak</span><span className="aset-value">Gas Elpiji 3 Kg</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah tabung gas 5,5 kg atau lebih</span><span className="aset-value">Tidak ada</span></div>
                    </div>
                    <div className="aset-column">
                      <div className="aset-header-title"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Aset Bergerak dan Tidak Bergerak Keluarga</div>
                      <div className="aset-item"><span className="aset-label">Kepemilikan Tanah</span><span className="aset-value">Milik Sendiri</span></div>
                      <div className="aset-item"><span className="aset-label">Kepemilikan Rumah Lain</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Sepeda Motor</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Mobil</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Perahu/Alat Usaha</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Sepeda</span><span className="aset-value">1</span></div>
                      <div className="aset-item"><span className="aset-label">Jenis Kapal/Perahu Motor</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Kulkas/Pendingin Makanan</span><span className="aset-value">1</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Televisi</span><span className="aset-value">1</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Smartphone</span><span className="aset-value">1</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Air Conditioner</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Pemanas Air</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Telepon Rumah</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Ternak Sapi</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Ternak Kerbau</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Ternak Babi</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Ternak Kambing</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Ternak Kuda</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Tabung Gas 5,5 Kg atau Lebih</span><span className="aset-value">Tidak Ada</span></div>
                      <div className="aset-item"><span className="aset-label">Jumlah Emas/Perhiasan</span><span className="aset-value">Tidak Ada</span></div>
                    </div>
                  </div>
                  <div className="aset-dokumentasi">
                    <h4 className="aset-doc-title">Dokumentasi Verifikasi</h4>
                    <div className="upload-box" style={{ height: '200px' }}>
                      <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <span>Foto Rumah (Bagian depan dan dalam)</span>
                    </div>
                  </div>
                  <div className="action-row-right" style={{ marginTop: "30px", gap: "15px" }}>
                    <button className="btn-modal-cancel" onClick={handleBackFromDetail}>Batal</button>
                    <button className="btn-modal-submit" style={{ width: "auto", padding: "12px 24px" }} onClick={() => setIsEditAsetModalOpen(true)}>Edit Aset yang dimiliki</button>
                  </div>
                </div>
              )}

              {detailTab === "desil" && (
                <div className="desil-graph-container">
                  <div className="graph-wrapper">
                    <svg viewBox="0 0 800 300" className="svg-chart">
                      <line x1="50" y1="20" x2="750" y2="20" stroke="#e2e8f0" strokeWidth="1" />
                      <line x1="50" y1="70" x2="750" y2="70" stroke="#e2e8f0" strokeWidth="1" />
                      <line x1="50" y1="120" x2="750" y2="120" stroke="#e2e8f0" strokeWidth="1" />
                      <line x1="50" y1="170" x2="750" y2="170" stroke="#e2e8f0" strokeWidth="1" />
                      <line x1="50" y1="220" x2="750" y2="220" stroke="#e2e8f0" strokeWidth="1" />
                      <line x1="50" y1="270" x2="750" y2="270" stroke="#94a3b8" strokeWidth="1.5" /> 
                      <text x="30" y="25" fontSize="12" fill="#64748b" textAnchor="end">6-10</text>
                      <text x="30" y="75" fontSize="12" fill="#64748b" textAnchor="end">4</text>
                      <text x="30" y="125" fontSize="12" fill="#64748b" textAnchor="end">3</text>
                      <text x="30" y="175" fontSize="12" fill="#64748b" textAnchor="end">2</text>
                      <text x="30" y="225" fontSize="12" fill="#64748b" textAnchor="end">1</text>
                      <line x1="50" y1="270" x2="50" y2="275" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="283" y1="270" x2="283" y2="275" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="516" y1="270" x2="516" y2="275" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="750" y1="270" x2="750" y2="275" stroke="#94a3b8" strokeWidth="1.5" />
                      <text x="50" y="295" fontSize="12" fill="#64748b" textAnchor="middle">TW1</text>
                      <text x="283" y="295" fontSize="12" fill="#64748b" textAnchor="middle">TW2</text>
                      <text x="516" y="295" fontSize="12" fill="#64748b" textAnchor="middle">TW3</text>
                      <text x="750" y="295" fontSize="12" fill="#64748b" textAnchor="middle">TW4</text>
                      <polyline points="50,70 283,70 516,70 750,70" fill="none" stroke="#ef4444" strokeWidth="2" />
                      <circle cx="50" cy="70" r="4" fill="#ef4444" />
                      <circle cx="283" cy="70" r="4" fill="#ef4444" />
                      <circle cx="516" cy="70" r="4" fill="#ef4444" />
                      <circle cx="750" cy="70" r="4" fill="#ef4444" />
                    </svg>
                  </div>
                </div>
              )}

              <div className="action-row-right" style={{ marginTop: "30px" }}>
                <button className="btn-back-dark" onClick={handleBackFromDetail}>
                  {activeMenu === "usulan_baru" ? "Kembali ke Usulan Baru" : "Kembali ke Data DTSEN"}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= AREA MODALS (POP-UP) BANSOS ================= */}
      {isAddModalOpen && (<div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}><div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}><div className="modal-header"><div className="modal-header-title"><span style={{ fontSize: '20px', fontWeight: 'bold' }}>+</span><h2>Tambah Usulan</h2></div></div><div className="modal-body"><form onSubmit={(e) => handleGenericSubmit(e, setIsAddModalOpen)}><div className="form-grid-2"><div className="form-group-modal"><label>NIK (Nomor Induk Kependudukan)*</label><input type="text" placeholder="16 digit angka" required /></div><div className="form-group-modal"><label>No. KK*</label><input type="text" placeholder="contohfirly@gmail.com" required /></div><div className="form-group-modal"><label>Nama Lengkap (Sesuai KTP)*</label><input type="text" placeholder="Contoh: FIRLIANY FIRDAUS" required /></div><div className="form-group-modal"><label>Kecamatan*</label><input type="text" placeholder="xxxxxxxxxx" required /></div><div className="form-group-modal"><label>Kelurahan*</label><input type="text" placeholder="Jln. nn" required /></div><div className="form-group-modal"><label>Desil*</label><div className="select-container-custom"><select required defaultValue=""><option value="" disabled hidden>Pilih Desil</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6-10">6-10</option></select></div></div><div className="form-group-modal"><label>Jenis Bansos*</label><div className="select-container-custom"><select required defaultValue=""><option value="" disabled hidden>Pilih Bansos</option><option value="PBI">PBI</option><option value="Sembako">Sembako</option><option value="PKH">PKH</option><option value="YAPI">YAPI</option></select></div></div></div><div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsAddModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Data</button></div></form></div></div></div>)}
      {isIndividuModalOpen && (<div className="modal-overlay" onClick={() => setIsIndividuModalOpen(false)}><div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}><div className="modal-body" style={{ paddingTop: '30px' }}><h3 className="modal-title-center">Detail Data Individu NIK 0000000000000000</h3><form onSubmit={(e) => handleGenericSubmit(e, setIsIndividuModalOpen)}><div className="form-grid-2"><div className="form-group-modal"><label>NIK</label><input type="text" placeholder="contoh: januari" /></div><div className="form-group-modal"><label>Nama Lengkap</label><input type="text" placeholder="contoh: 2024" /></div><div className="form-group-modal"><label>Tempat Lahir</label><input type="text" placeholder="contoh: januari" /></div><div className="form-group-modal"><label>Tanggal Lahir</label><input type="text" placeholder="contoh: 2024" /></div><div className="form-group-modal" style={{ gridColumn: "1 / -1" }}><label>Jenis Kelamin</label><div className="radio-group-inline"><label className="radio-label"><input type="radio" name="jk" value="Laki-laki" /><span>Laki-laki</span></label><label className="radio-label"><input type="radio" name="jk" value="Perempuan" /><span>Perempuan</span></label></div></div><div className="form-group-modal"><label>Provinsi</label><input type="text" placeholder="Sulawesi Selatan" /></div><div className="form-group-modal"><label>Kabupaten/Kota</label><input type="text" placeholder="contoh: makassar" /></div><div className="form-group-modal"><label>Kecamatan</label><input type="text" placeholder="Tallo" /></div><div className="form-group-modal"><label>Kelurahan/Desa</label><input type="text" placeholder="Wala-walaya" /></div><div className="form-group-modal" style={{ gridColumn: "1 / -1" }}><label>Alamat KTP</label><input type="text" placeholder="Sulawesi Selatan" /></div><div className="form-group-modal"><label>Keberadaan anggota</label><input type="text" placeholder="Tinggal bersama keluarga" /></div><div className="form-group-modal"><label>Status Perkawinan</label><input type="text" placeholder="Kawin" /></div><div className="form-group-modal"><label>Hubungan dengan Kepala Keluarga</label><input type="text" placeholder="Anak" /></div><div className="form-group-modal"><label>Pekerjaan Utama</label><input type="text" placeholder="Ibu Rumah Tangga" /></div></div><div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsIndividuModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Data</button></div></form></div></div></div>)}
      {isMeninggalModalOpen && (<div className="modal-overlay" onClick={() => setIsMeninggalModalOpen(false)}><div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}><div className="modal-body" style={{ paddingTop: '30px' }}><h3 className="modal-title-center">Data Pernyataan Meninggal NIK 0000000000000000</h3><form onSubmit={(e) => handleGenericSubmit(e, setIsMeninggalModalOpen)}><div className="form-group-modal" style={{ marginBottom: '15px' }}><label>Tanggal Meninggal</label><input type="text" placeholder="contoh: 12 Januari 2000" /></div><div className="form-group-modal"><label>Bukti Kematian*</label><div className="upload-box"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span>Surat Keterangan Meninggal Dunia</span></div></div><div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsMeninggalModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Data</button></div></form></div></div></div>)}
      {isHamilModalOpen && (<div className="modal-overlay" onClick={() => setIsHamilModalOpen(false)}><div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}><div className="modal-body" style={{ paddingTop: '30px' }}><h3 className="modal-title-center">Data Kehamilan NIK 0000000000000000</h3><form onSubmit={(e) => handleGenericSubmit(e, setIsHamilModalOpen)}><div className="form-grid-2" style={{ marginBottom: '15px' }}><div className="form-group-modal"><label>Bulan Kehamilan</label><input type="text" placeholder="contoh: januari" /></div><div className="form-group-modal"><label>Tahun Kehamilan</label><input type="text" placeholder="contoh: 2024" /></div></div><div className="form-group-modal"><label>Bukti Kehamilan*</label><div className="upload-box"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span>Surat Keterangan Menyatakan Hamil dari Fasilitas Kesehatan</span></div></div><div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsHamilModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Data</button></div></form></div></div></div>)}
      {isDisabilitasModalOpen && (<div className="modal-overlay" onClick={() => setIsDisabilitasModalOpen(false)}><div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}><div className="modal-body" style={{ paddingTop: '20px' }}><div className="modal-inner-tabs"><button className={`inner-tab-btn ${disabilitasTab === "individu" ? "active" : ""}`} onClick={() => setDisabilitasTab("individu")}>Disabilitas Individu</button><button className={`inner-tab-btn ${disabilitasTab === "riwayat" ? "active" : ""}`} onClick={() => setDisabilitasTab("riwayat")}>Riwayat Perubahan Disabilitas</button></div>{disabilitasTab === "individu" && (<div className="inner-tab-content"><table className="staff-table" style={{ marginTop: '20px' }}><thead><tr><th>Jenis Disabilitas</th><th>Tingkat Disabilitas</th><th style={{ textAlign: "center" }}>Aksi</th></tr></thead><tbody><tr><td>Disabilitas Fisik</td><td>Sedang</td><td style={{ textAlign: "center" }}><button className="btn-icon-keterangan"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></button></td></tr></tbody></table><div className="modal-actions" style={{ marginTop: '50px' }}><button type="button" className="btn-modal-cancel" onClick={() => setIsDisabilitasModalOpen(false)}>Batal</button><button type="button" className="btn-modal-submit" onClick={() => setIsDisabilitasModalOpen(false)}>Simpan Data</button></div></div>)}{disabilitasTab === "riwayat" && (<div className="inner-tab-content"><h4 className="modal-subtitle-center">Tambah Data Disabilitas</h4><form onSubmit={(e) => handleGenericSubmit(e, setIsDisabilitasModalOpen)}><div className="form-grid-2"><div className="form-group-modal"><label>Jenis Disabilitas*</label><div className="select-container-custom"><select required defaultValue=""><option value="" disabled hidden>Pilih Jenis Disabilitas</option><option value="non">Non-disabilitas</option><option value="fisik">Disabilitas Fisik</option><option value="mental">Disabilitas Mental</option><option value="intelektual">Disabilitas Intelektual</option><option value="sensorik_netral">Disabilitas Sensorik Netral</option><option value="sensorik_rungu">Disabilitas Sensorik Rungu</option><option value="sensorik_wicara">Disabilitas Sensorik Wicara</option><option value="ganda">Disabilitas Ganda/Multi</option></select></div></div><div className="form-group-modal"><label>Tingkat Disabilitas*</label><div className="select-container-custom"><select required defaultValue=""><option value="" disabled hidden>Pilih Tingkat Disabilitas</option><option value="ringan">Ringan</option><option value="sedang">Sedang</option><option value="berat">Berat</option></select></div></div></div><div className="form-group-modal" style={{ marginTop: '15px' }}><label>Bukti Disabilitas*</label><div className="upload-box"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span>Surat Keterangan Disabilitas dari Fasilitas Kesehatan</span></div></div><div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsDisabilitasModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Data</button></div></form></div>)}</div></div></div>)}
      {isOrtuModalOpen && (<div className="modal-overlay" onClick={() => setIsOrtuModalOpen(false)}><div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}><div className="modal-body" style={{ paddingTop: '20px' }}><div className="modal-inner-tabs"><button className={`inner-tab-btn ${ortuTab === "status" ? "active" : ""}`} onClick={() => setOrtuTab("status")}>Status Orang Tua</button><button className={`inner-tab-btn ${ortuTab === "riwayat" ? "active" : ""}`} onClick={() => setOrtuTab("riwayat")}>Riwayat Perubahan Orang Tua</button></div>{ortuTab === "status" && (<div className="inner-tab-content"><table className="staff-table" style={{ marginTop: '20px' }}><thead><tr><th>Nama Individu</th><th>Status Orang Tua</th><th style={{ textAlign: "center" }}>Aksi</th></tr></thead><tbody><tr><td>Anak Cinta1</td><td>Orang Tua Lengkap</td><td style={{ textAlign: "center" }}><button className="btn-icon-keterangan"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></button></td></tr></tbody></table><div className="modal-actions" style={{ marginTop: '50px' }}><button type="button" className="btn-modal-cancel" onClick={() => setIsOrtuModalOpen(false)}>Batal</button><button type="button" className="btn-modal-submit" onClick={() => setIsOrtuModalOpen(false)}>Simpan Data</button></div></div>)}{ortuTab === "riwayat" && (<div className="inner-tab-content"><h4 className="modal-subtitle-center">Pengusulan Orang Tua</h4><form onSubmit={(e) => handleGenericSubmit(e, setIsOrtuModalOpen)}><div className="form-grid-2"><div className="form-group-modal"><label>Status Orang Tua*</label><div className="select-container-custom"><select required defaultValue=""><option value="" disabled hidden>Pilih Status Orang Tua</option><option value="lengkap">Orang Tua Lengkap</option><option value="yatim">Yatim</option><option value="piatu">Piatu</option><option value="yatimpiatu">Yatim Piatu</option><option value="unknown">Tidak Diketahui Keberadaannya</option></select></div></div><div className="form-group-modal"><label>Nomor Surat*</label><input type="text" placeholder="" required /></div></div><div className="form-group-modal" style={{ marginTop: '15px' }}><label>Bukti Status Orang Tua*</label><div className="upload-box"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span>Surat Keterangan Menyatakan Orang Tua</span></div></div><div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsOrtuModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Data</button></div></form></div>)}</div></div></div>)}
      {isPendidikanModalOpen && (<div className="modal-overlay" onClick={() => setIsPendidikanModalOpen(false)}><div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}><div className="modal-body" style={{ padding: '30px', textAlign: 'center' }}><h3 className="modal-title-center" style={{ borderBottom: '2px solid #cbd5e1', paddingBottom: '15px', margin: '0 0 20px 0' }}>Detail Pendidikan NIK 0000000000000000</h3><div style={{ textAlign: 'left', padding: '0 20px', color: '#234a66' }}><p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Nama Sekolah:</p><p style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold' }}>SMA XXXXXXXX</p><p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Jenjang Pendidikan:</p><p style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold' }}>Sekolah Menengah Atas</p></div></div></div></div>)}
      {isEditAsetModalOpen && (<div className="modal-overlay" onClick={() => setIsEditAsetModalOpen(false)}><div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}><div className="modal-header"><div className="modal-header-title"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg><h2>Edit Data Aset & Kondisi Keluarga</h2></div></div><div className="modal-body"><form onSubmit={(e) => handleGenericSubmit(e, setIsEditAsetModalOpen)}><div className="modal-section"><h3 className="section-subtitle">1. Kondisi Keluarga</h3><div className="form-grid-2"><div className="form-group-modal"><label>Status dalam Keluarga</label><div className="select-container-custom"><select defaultValue="Kepala Keluarga"><option value="Kepala Keluarga">Kepala Keluarga</option><option value="Istri">Istri</option><option value="Anak">Anak</option></select></div></div><div className="form-group-modal"><label>Usia (Tahun)</label><input type="number" defaultValue="60" min="0" /></div><div className="form-group-modal"><label>Status Perkawinan</label><div className="select-container-custom"><select defaultValue="Cerai mati"><option value="Belum Kawin">Belum Kawin</option><option value="Kawin">Kawin</option><option value="Cerai hidup">Cerai hidup</option><option value="Cerai mati">Cerai mati</option></select></div></div><div className="form-group-modal"><label>Status Pekerjaan</label><div className="select-container-custom"><select defaultValue="Usaha Sendiri"><option value="Tidak Bekerja">Tidak Bekerja</option><option value="Karyawan">Karyawan</option><option value="Usaha Sendiri">Usaha Sendiri</option><option value="Petani/Buruh">Petani/Buruh</option></select></div></div><div className="form-group-modal"><label>Kepemilikan Usaha</label><div className="select-container-custom"><select defaultValue="Tidak Ada"><option value="Tidak Ada">Tidak Ada</option><option value="Ada">Ada</option></select></div></div><div className="form-group-modal"><label>Jumlah Anggota RT</label><input type="number" defaultValue="4" min="1" /></div></div></div><div className="modal-section"><h3 className="section-subtitle">2. Kondisi Perumahan Keluarga</h3><div className="form-grid-2"><div className="form-group-modal"><label>Status Kepemilikan Rumah</label><div className="select-container-custom"><select defaultValue="Milik Sendiri"><option value="Milik Sendiri">Milik Sendiri</option><option value="Sewa/Kontrak">Sewa/Kontrak</option><option value="Numpang">Numpang</option></select></div></div><div className="form-group-modal"><label>Luas Lantai Rumah (m2)</label><input type="text" defaultValue="10 x 20 m" /></div><div className="form-group-modal"><label>Jenis Lantai</label><div className="select-container-custom"><select defaultValue="Keramik"><option value="Keramik">Keramik</option><option value="Semen">Semen/Bata</option><option value="Tanah">Tanah</option><option value="Bambu/Kayu">Bambu/Kayu</option></select></div></div><div className="form-group-modal"><label>Jenis Dinding</label><div className="select-container-custom"><select defaultValue="Tembok"><option value="Tembok">Tembok</option><option value="Kayu/Papan">Kayu/Papan</option><option value="Bambu">Bambu</option></select></div></div><div className="form-group-modal"><label>Jenis Atap</label><div className="select-container-custom"><select defaultValue="Seng"><option value="Seng">Seng</option><option value="Genteng">Genteng</option><option value="Asbes">Asbes</option><option value="Rumbia/Ijuk">Rumbia/Ijuk</option></select></div></div><div className="form-group-modal"><label>Sumber Air Minum</label><div className="select-container-custom"><select defaultValue="Sumur Terlindung"><option value="PDAM">PDAM</option><option value="Sumur Terlindung">Sumur Terlindung</option><option value="Mata Air">Mata Air</option><option value="Sungai">Sungai</option></select></div></div><div className="form-group-modal"><label>Jenis Kloset</label><div className="select-container-custom"><select defaultValue="Kloset Jongkok"><option value="Kloset Duduk">Kloset Duduk</option><option value="Kloset Jongkok">Kloset Jongkok</option><option value="Plengsengan">Plengsengan</option><option value="Tanpa Kloset">Tanpa Kloset</option></select></div></div><div className="form-group-modal"><label>Tempat Pembuangan Tinja</label><div className="select-container-custom"><select defaultValue="Tangki Septik"><option value="Tangki Septik">Tangki Septik</option><option value="Lubang Tanah">Lubang Tanah</option><option value="Sungai/Danau">Sungai/Danau/Laut</option></select></div></div><div className="form-group-modal"><label>Sumber Penerangan</label><div className="select-container-custom"><select defaultValue="Listrik PLN"><option value="Listrik PLN">Listrik PLN</option><option value="Listrik Non PLN">Listrik Non PLN</option><option value="Bukan Listrik">Bukan Listrik</option></select></div></div><div className="form-group-modal"><label>Daya Listrik</label><div className="select-container-custom"><select defaultValue="900 Watt"><option value="450 Watt">450 Watt</option><option value="900 Watt">900 Watt</option><option value="1300 Watt">1300 Watt</option><option value="> 1300 Watt">> 1300 Watt</option></select></div></div><div className="form-group-modal"><label>Bahan Bakar Masak</label><div className="select-container-custom"><select defaultValue="Gas Elpiji 3 Kg"><option value="Gas Elpiji 3 Kg">Gas Elpiji 3 Kg</option><option value="Gas Elpiji > 3 Kg">Gas Elpiji > 3 Kg</option><option value="Minyak Tanah">Minyak Tanah</option><option value="Kayu Bakar">Kayu Bakar</option></select></div></div><div className="form-group-modal"><label>Jml Tabung Gas (5,5kg / lebih)</label><input type="number" defaultValue="0" min="0" /></div></div></div><div className="modal-section"><h3 className="section-subtitle">3. Aset Bergerak & Tidak Bergerak</h3><div className="form-grid-2"><div className="form-group-modal"><label>Kepemilikan Tanah</label><div className="select-container-custom"><select defaultValue="Milik Sendiri"><option value="Milik Sendiri">Milik Sendiri</option><option value="Tidak Ada">Tidak Ada</option></select></div></div><div className="form-group-modal"><label>Kepemilikan Rumah Lain</label><div className="select-container-custom"><select defaultValue="Tidak Ada"><option value="Tidak Ada">Tidak Ada</option><option value="Ada">Ada</option></select></div></div><div className="form-group-modal"><label>Jumlah Sepeda Motor</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Mobil</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Perahu/Alat Usaha</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Sepeda</label><input type="number" defaultValue="1" min="0" /></div><div className="form-group-modal"><label>Jenis Kapal/Perahu Motor</label><div className="select-container-custom"><select defaultValue="Tidak Ada"><option value="Tidak Ada">Tidak Ada</option><option value="Perahu Tanpa Motor">Perahu Tanpa Motor</option><option value="Perahu Motor">Perahu Motor</option></select></div></div><div className="form-group-modal"><label>Jumlah Kulkas/Pendingin</label><input type="number" defaultValue="1" min="0" /></div><div className="form-group-modal"><label>Jumlah Televisi</label><input type="number" defaultValue="1" min="0" /></div><div className="form-group-modal"><label>Jumlah Smartphone</label><input type="number" defaultValue="1" min="0" /></div><div className="form-group-modal"><label>Jumlah Air Conditioner (AC)</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Pemanas Air</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Telepon Rumah</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Ternak Sapi</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Ternak Kerbau</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Ternak Babi</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Ternak Kambing</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Ternak Kuda</label><input type="number" defaultValue="0" min="0" /></div><div className="form-group-modal"><label>Jumlah Emas/Perhiasan (Gram)</label><input type="number" defaultValue="0" min="0" placeholder="Dalam satuan gram" /></div></div></div><div className="modal-actions" style={{ marginTop: '30px' }}><button type="button" className="btn-modal-cancel" onClick={() => setIsEditAsetModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Perubahan</button></div></form></div></div></div>)}

      {/* ================= AREA MODALS (POP-UP) PPKS ================= */}
      {isAddPPKSModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddPPKSModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>+</span>
                <h2>Tambah Laporan PPKS</h2>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleGenericSubmit(e, setIsAddPPKSModalOpen)}>
                <div className="modal-section">
                  <h3 className="section-subtitle">Data Diri Pemerlu</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap / Alias*</label><input type="text" placeholder="Contoh: Mr. X / Budi" required /></div>
                    <div className="form-group-modal"><label>NIK (Jika Diketahui)</label><input type="text" placeholder="Kosongkan jika tidak ada" /></div>
                    <div className="form-group-modal" style={{ gridColumn: "1 / -1" }}>
                      <label>Kategori PPKS (Pilih dari 26 Kategori)*</label>
                      <div className="select-container-custom">
                        <select required defaultValue="">
                          <option value="" disabled hidden>Pilih Kategori PPKS</option>
                          <option value="1">Anak Balita Terlantar</option>
                          <option value="2">Anak Terlantar</option>
                          <option value="3">Anak yang Berhadapan dengan Hukum (ABH)</option>
                          <option value="4">Anak Jalanan</option>
                          <option value="5">Anak dengan Disabilitas</option>
                          <option value="6">Anak yang Memerlukan Perlindungan Khusus</option>
                          <option value="7">Lanjut Usia Terlantar</option>
                          <option value="8">Penyandang Disabilitas</option>
                          <option value="9">Tuna Susila</option>
                          <option value="10">Gelandangan</option>
                          <option value="11">Pengemis</option>
                          <option value="12">Pemulung</option>
                          <option value="13">Kelompok Minoritas</option>
                          <option value="14">Bekas Warga Binaan Lembaga Permasyarakatan (BWBLP)</option>
                          <option value="15">Orang dengan HIV/AIDS</option>
                          <option value="16">Korban Penyalahgunaan NAPZA</option>
                          <option value="17">Korban Perdagangan Orang</option>
                          <option value="18">Korban Tindak Kekerasan</option>
                          <option value="19">Pekerja Migran Bermasalah Sosial</option>
                          <option value="20">Korban Bencana Alam</option>
                          <option value="21">Korban Bencana Sosial</option>
                          <option value="22">Perempuan Rawan Sosial Ekonomi</option>
                          <option value="23">Fakir Miskin</option>
                          <option value="24">Keluarga Bermasalah Sosial Psikologis</option>
                          <option value="25">Komunitas Adat terpencil (KAT)</option>
                          <option value="26">Orang Terlantar</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-section">
                  <h3 className="section-subtitle">Kondisi & Lokasi Penemuan</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal" style={{ gridColumn: "1 / -1" }}><label>Lokasi Presisi Penemuan / Alamat Domisili*</label><input type="text" placeholder="Cth: Kolong Jembatan Flyover Urip Sumoharjo" required /></div>
                    <div className="form-group-modal" style={{ gridColumn: "1 / -1" }}><label>Deskripsi Singkat Kondisi Fisik / Kasus*</label><textarea rows="3" className="input-custom" style={{ height: 'auto', padding: '10px' }} placeholder="Jelaskan kondisi saat ditemukan (Misal: Sakit, linglung, membawa barang bekas...)" required></textarea></div>
                    <div className="form-group-modal" style={{ gridColumn: "1 / -1", marginTop: "10px" }}><label>Foto Bukti Penemuan (Wajib)*</label><div className="upload-box" style={{ height: '120px' }}><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span>Unggah Foto TKP / Kondisi PPKS</span></div></div>
                  </div>
                </div>
                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsAddPPKSModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Kirim Laporan</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedPPKS && (
        <div className="modal-overlay" onClick={() => setSelectedPPKS(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="modal-header-title">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <h2>Detail Penanganan PPKS</h2>
                </div>
                <div style={{ display: 'inline-block', width: 'fit-content' }}><span className={`badge-ppks ${getBadgeClass(selectedPPKS.status)}`} style={{ fontSize: '13px', padding: '6px 16px' }}>{selectedPPKS.status}</span></div>
              </div>
            </div>
            <div className="modal-body">
              <div className="detail-summary-grid" style={{ marginBottom: '20px', borderBottom: '1px solid #cbd5e1', paddingBottom: '20px' }}>
                <div className="summary-col"><div className="summary-item"><span className="sum-label">NAMA / IDENTITAS</span><span className="sum-val">{selectedPPKS.nama}</span></div><div className="summary-item"><span className="sum-label">NIK</span><span className="sum-val">{selectedPPKS.nik}</span></div></div>
                <div className="summary-col"><div className="summary-item"><span className="sum-label">KATEGORI PPKS</span><span className="sum-val">{selectedPPKS.kategori}</span></div><div className="summary-item"><span className="sum-label">TANGGAL LAPORAN</span><span className="sum-val">{selectedPPKS.tanggal}</span></div></div>
                <div className="summary-col" style={{ flex: 1 }}><div className="summary-item"><span className="sum-label">LOKASI PENEMUAN</span><span className="sum-val">{selectedPPKS.lokasi}</span></div></div>
              </div>

              <div className="modal-section"><h3 className="section-subtitle">Deskripsi Kondisi & Laporan Awal</h3><p className="description-box">{selectedPPKS.deskripsiAwal}</p></div>

              {selectedPPKS.status === "Menunggu Kelayakan" && (
                <div className="alert-info-box warning"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div><strong>Menunggu Verifikasi Lapangan</strong><p>Laporan ini belum di-assessment oleh tim Verifikator / Pekerja Sosial. Tidak ada tindakan lanjutan yang bisa dilakukan staf saat ini.</p></div></div>
              )}

              {selectedPPKS.status === "Kasus Aktif" && (
                <>
                  <div className="modal-section"><h3 className="section-subtitle" style={{ color: '#1d4ed8' }}>Hasil Assessment Verifikator</h3><p className="description-box active-bg">{selectedPPKS.hasilAssessment}</p></div>
                  <form onSubmit={(e) => handleGenericSubmit(e, null)}>
                    <div className="modal-section" style={{ border: '1px solid #93c5fd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
                      <h3 className="section-subtitle" style={{ borderBottom: 'none', color: '#1d4ed8', marginBottom: '15px' }}>Form Penyelesaian Kasus (Terminasi)</h3>
                      <div className="form-group-modal" style={{ marginBottom: '15px' }}><label>Tindakan Akhir / Keputusan Penanganan*</label><div className="select-container-custom"><select required defaultValue=""><option value="" disabled hidden>Pilih Tindakan Akhir</option><option value="keluarga">Dikembalikan / Reunifikasi dengan Keluarga</option><option value="panti">Dirujuk menetap di Panti / Balai Rehabilitasi</option><option value="mandiri">Sudah Mandiri / Diberikan Modal Usaha</option><option value="meninggal">Meninggal Dunia</option></select></div></div>
                      <div className="form-group-modal" style={{ marginBottom: '15px' }}><label>Deskripsi Pelaksanaan Serah Terima*</label><textarea rows="3" className="input-custom" style={{ height: 'auto', padding: '10px' }} placeholder="Ceritakan bagaimana proses penyelesaian kasus ini..." required></textarea></div>
                      <div className="form-group-modal"><label>Unggah Bukti Terminasi (Berita Acara / Foto Serah Terima)*</label><div className="upload-box" style={{ height: '100px' }}><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span>Upload File (PDF/JPG)</span></div></div>
                    </div>
                    <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setSelectedPPKS(null)}>Tutup</button><button type="submit" className="btn-modal-submit" style={{ backgroundColor: '#15803d' }}>Selesaikan Kasus & Simpan</button></div>
                  </form>
                </>
              )}

              {selectedPPKS.status === "Selesai" && (
                <>
                  <div className="modal-section"><h3 className="section-subtitle" style={{ color: '#1d4ed8' }}>Hasil Assessment Verifikator</h3><p className="description-box active-bg">{selectedPPKS.hasilAssessment}</p></div>
                  <div className="modal-section"><h3 className="section-subtitle" style={{ color: '#15803d' }}>Laporan Penyelesaian (Terminasi)</h3><div className="description-box success-bg"><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><strong style={{ color: '#15803d' }}>Tanggal Selesai: {selectedPPKS.tanggalSelesai}</strong></div><p style={{ margin: 0 }}>{selectedPPKS.tindakanPenyelesaian}</p><div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '6px', border: '1px dashed #86efac', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#15803d', cursor: 'pointer' }}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg><span style={{ fontSize: '12px', fontWeight: 'bold' }}>Download Berita Acara Serah Terima.pdf</span></div></div></div>
                </>
              )}

              {selectedPPKS.status !== "Kasus Aktif" && (<div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setSelectedPPKS(null)}>Tutup</button></div>)}
            </div>
          </div>
        </div>
      )}

      {/* ================= AREA MODALS (POP-UP) PENENTUAN DESIL (BARU) ================= */}
      {isKalkulasiModalOpen && selectedKalkulasi && (
        <div className="modal-overlay" onClick={() => setIsKalkulasiModalOpen(false)}>
          <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <h2>Kalkulasi PMT & Desil</h2>
              </div>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              
              <div style={{ marginBottom: '20px', color: '#475569' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '13px' }}>Keluarga atas nama:</p>
                <h3 style={{ margin: '0', color: '#234a66', fontSize: '18px', fontWeight: '800' }}>{selectedKalkulasi.nama}</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', fontWeight: '600' }}>No KK: {selectedKalkulasi.noKk}</p>
              </div>

              {!isCalculated && (
                <>
                  <div className="alert-info-box warning" style={{ textAlign: 'left', marginBottom: '25px' }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                      <p>Sistem akan memproses 39 variabel aset dan kondisi perumahan keluarga ini untuk menentukan skor kerentanan.</p>
                    </div>
                  </div>
                  <button type="button" className="btn-modal-submit" style={{ width: '100%', padding: '15px', fontSize: '16px' }} onClick={handleJalankanKalkulasi}>
                    Jalankan Kalkulasi Sistem
                  </button>
                </>
              )}

              {isCalculated && (
                <div className="calc-result-box slide-up-anim">
                  <h4 style={{ color: '#10b981', margin: '0 0 15px 0' }}>✓ Kalkulasi Selesai</h4>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>SKOR PMT</span>
                      <span style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>48.5</span>
                    </div>
                    <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '30px' }}>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '5px' }}>TINGKAT DESIL</span>
                      <span className="desil-badge-large">3</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', marginBottom: '25px' }}>Keluarga ini masuk dalam kategori <strong>Hampir Rentan</strong>.</p>
                  
                  <div className="modal-actions">
                    <button type="button" className="btn-modal-cancel" onClick={() => setIsKalkulasiModalOpen(false)}>Batal</button>
                    <button type="button" className="btn-modal-submit" onClick={(e) => handleGenericSubmit(e, setIsKalkulasiModalOpen)}>Simpan Hasil ke DTSEN</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SUCCESS UMUM ================= */}
      {isSuccessModalOpen && (<div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}><div className="modal-content modal-success" onClick={(e) => e.stopPropagation()}><div className="modal-body text-center" style={{ padding: '40px 20px' }}><div className="success-icon-circle"><svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></div><h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Data Berhasil Disimpan!</h2><p style={{ color: '#475569', fontSize: '13px', fontWeight: '500', margin: '0' }}>Aksi Anda berhasil diproses oleh sistem.</p></div></div></div>)}

    </div>
  );
}

export default StaffDashboard;