import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./verifikatordashboard.css"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png";
// PENTING: Pastikan Anda sudah mengimpor supabase di atas file ini
import { supabase } from "../../config/supabase";

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

  // === STATE DATA DINAMIS DARI SUPABASE ===
  const [usulanList, setUsulanList] = useState([]);
  const [riwayatList, setRiwayatList] = useState([]);
  
  const [ppksList, setPpksList] = useState([]);
  const [riwayatPpksList, setRiwayatPpksList] = useState([]);
  
  const [catatanValidasi, setCatatanValidasi] = useState("");
  // Tambahan state untuk 39 variabel
  const [asetKeluarga, setAsetKeluarga] = useState(null); 

  // === STATE & LOGIKA FILTER PENCARIAN BANSOS ===
  const [filterBansos, setFilterBansos] = useState({ kecamatan: "", kelurahan: "", keyword: "" });

  const handleFilterBansosChange = (e) => {
    const { name, value } = e.target;
    setFilterBansos({ ...filterBansos, [name]: value });
  };

const filteredUsulanList = usulanList.filter(item => {
    const matchKecamatan = filterBansos.kecamatan === "" || item.kecamatan === filterBansos.kecamatan;
    const matchKelurahan = filterBansos.kelurahan === "" || item.kelurahan === filterBansos.kelurahan;
    
    const keyword = filterBansos.keyword.toLowerCase();
    
    const matchKeyword = keyword === "" || 
                         (item.nik && String(item.nik).toLowerCase().includes(keyword)) || 
                         (item.nama_pengusul && String(item.nama_pengusul).toLowerCase().includes(keyword));
    
    return matchKecamatan && matchKelurahan && matchKeyword;
  });

  // === STATE & LOGIKA FILTER PENCARIAN PPKS ===
  const [filterPPKS, setFilterPPKS] = useState({ kategori: "", kecamatan: "", keyword: "" });

  const handleFilterPPKSChange = (e) => {
    const { name, value } = e.target;
    setFilterPPKS({ ...filterPPKS, [name]: value });
  };

  const filteredPpksList = ppksList.filter(item => {
    const matchKategori = filterPPKS.kategori === "" || item.kategori === filterPPKS.kategori;
    const matchKecamatan = filterPPKS.kecamatan === "" || item.kecamatan === filterPPKS.kecamatan;
    
    const keyword = filterPPKS.keyword.toLowerCase();
    // Menggunakan String() untuk mencegah white-screen jika data berupa angka
    const matchKeyword = keyword === "" || 
                         (item.nik && String(item.nik).toLowerCase().includes(keyword)) || 
                         (item.nama && String(item.nama).toLowerCase().includes(keyword));
    
    return matchKategori && matchKecamatan && matchKeyword;
  });

  // --- FETCH DATA DARI SUPABASE ---
  useEffect(() => {
    fetchDataVerifikator();
  }, []);

  const fetchDataVerifikator = async () => {
    try {
      // 1. Ambil Usulan Bansos (Menunggu)
      const { data: dataBansos, error: errBansos } = await supabase
        .from('pengusulan_bansos')
        .select('*')
        .eq('status_pengusulan', 'Belum');
      if (errBansos) throw errBansos;
      setUsulanList(dataBansos);

      // 2. Ambil Riwayat Bansos (Layak / Tidak Layak)
      const { data: dataRiwayat, error: errRiwayat } = await supabase
        .from('pengusulan_bansos')
        .select('*')
        .neq('status_pengusulan', 'Belum');
      if (errRiwayat) throw errRiwayat;
      setRiwayatList(dataRiwayat);

      // 3. Ambil PPKS (Menunggu)
      const { data: dataPPKS, error: errPPKS } = await supabase
        .from('ppks')
        .select('*')
        .eq('status', 'Menunggu Kelayakan');
      if (errPPKS) throw errPPKS;
      setPpksList(dataPPKS);

      // 4. Ambil Riwayat PPKS (Kasus Aktif / Ditolak) 
      const { data: dataRiwayatPPKS, error: errRiwayatPPKS } = await supabase
        .from('ppks')
        .select('*')
        .neq('status', 'Menunggu Kelayakan');
      if (errRiwayatPPKS) throw errRiwayatPPKS;
      setRiwayatPpksList(dataRiwayatPPKS);

    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // --- DATA DUMMY NOTIFIKASI ---
  const notifData = [
    { id: 1, title: "Sistem Terhubung", date: "Hari ini", desc: "Data berhasil disinkronkan dengan Staf Lapangan." }
  ];

  // ================= HANDLERS =================
  
  // Membuka Modal Validasi Bansos & Mencari Data 39 Variabel
  const openValidationModal = async (data) => {
    setSelectedData(data);
    setCatatanValidasi("");
    setAsetKeluarga(null); // Reset dulu

    try {
      // Cari data aset di tabel keluarga berdasarkan NO KK atau NIK pengusul
      const { data: dataKeluarga, error } = await supabase
        .from('keluarga')
        .select('aset, desil')
        .or(`no_kk.eq.${data.no_kk},nik_kepala.eq.${data.nik}`)
        .single();
      
      if (!error && dataKeluarga) {
        setAsetKeluarga({
          desil: dataKeluarga.desil,
          detail: dataKeluarga.aset
        });
      }
    } catch (error) {
      console.log("Keluarga belum memiliki data aset 39 Variabel di DTSEN.");
    }

    setIsValidateModalOpen(true);
  };

  const openValidationPPKSModal = (data) => {
    setSelectedPPKSReview(data);
    setIsReviewPPKSModalOpen(true);
  };

// Handler Submit BANSOS (Terima / Tolak)
  const handleValidasiBansos = async (e, statusKeputusan) => {
    e.preventDefault();
    if (!selectedData) return;

    try {
      // 1. Update ke Supabase
      const { error } = await supabase
        .from('pengusulan_bansos')
        .update({ 
          status_pengusulan: statusKeputusan, 
          catatan_verifikator: catatanValidasi // <--- AKTIFKAN BARIS INI
        })
        .eq('id', selectedData.id);
      
      if (error) throw error;

      // 2. Tarik ulang data agar UI update secara real-time
      await fetchDataVerifikator();

      // 3. Tutup Modal & Tampilkan Sukses
      setIsValidateModalOpen(false);
      setSelectedData(null);
      setCatatanValidasi("");
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 3000);
      setActiveTab("riwayat"); // Otomatis pindah ke tab riwayat
    } catch (error) {
      console.error("Gagal update status:", error);
      alert("Gagal melakukan validasi.");
    }
  };

// Handler Submit PPKS (Terima / Tolak)
  const handleValidationPPKSAction = async (e, statusKeputusan) => {
    e.preventDefault();
    if (!selectedPPKSReview) return;

    try {
      const { error } = await supabase
        .from('ppks')
        .update({ 
          status: statusKeputusan, 
          catatan_verifikator: catatanValidasi // Menyimpan catatan ke database
        })
        .eq('id', selectedPPKSReview.id);

      if (error) throw error;

      await fetchDataVerifikator(); // Refresh data
      setIsReviewPPKSModalOpen(false);
      setSelectedPPKSReview(null);
      setCatatanValidasi(""); // Kosongkan catatan
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 3000);
      setActiveTab("riwayat"); // Pindah ke tab riwayat
    } catch (error) {
      console.error("Gagal update status PPKS:", error);
      alert("Gagal melakukan validasi PPKS.");
    }
  };

  // Fungsi helper format tanggal
  const formatDateIndo = (dateStr) => { 
    if(!dateStr || dateStr === "-") return "-"; 
    const date = new Date(dateStr); 
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]; 
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`; 
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
                  {/* UPDATE DINAMIS: Menampilkan panjang array usulanList */}
                  <div className="task-card-count"><span>{usulanList.length}</span></div>
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
                  {/* UPDATE DINAMIS: Menampilkan panjang array ppksList */}
                  <div className="task-card-count"><span>{ppksList.length}</span></div>
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
                    <div className="filter-group-top">
                      <label>Kecamatan</label>
                      <div className="select-container-custom">
                        <select name="kecamatan" value={filterBansos.kecamatan} onChange={handleFilterBansosChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}}>
                          <option value="">Semua Kecamatan</option>
                          <option value="Tallo">Tallo</option>
                          <option value="Bontoala">Bontoala</option>
                          <option value="Panakkukang">Panakkukang</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="filter-group-top">
                      <label>Kelurahan/Desa</label>
                      <div className="select-container-custom">
                        <select name="kelurahan" value={filterBansos.kelurahan} onChange={handleFilterBansosChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}}>
                          <option value="">Semua Kelurahan</option>
                          <option value="Wala-walaya">Wala-walaya</option>
                          <option value="Baraya">Baraya</option>
                          <option value="Pannampu">Pannampu</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="filter-group-top">
                      <label>NIK / Nama Lengkap</label>
                      <input 
                        type="text" 
                        name="keyword" 
                        value={filterBansos.keyword} 
                        onChange={handleFilterBansosChange} 
                        placeholder="Ketik NIK atau Nama..." 
                        style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}} 
                      />
                    </div>
                    
                    <div className="filter-group-top align-bottom">
                      <button className="btn-search-outline" style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> 
                        Cari Data
                      </button>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <div className="table-responsive">
                      <table className="verifikator-table">
                        <thead>
                          {/* PERBAIKAN: Hapus Kolom Petugas Penginput */}
                          <tr><th>NIK</th><th>Nama Lengkap</th><th>Kecamatan</th><th>Kelurahan</th><th>Tgl Usulan</th><th style={{ textAlign: "center" }}>Status</th><th style={{ textAlign: "center" }}>Tindakan</th></tr>
                        </thead>
                        <tbody>
                          {filteredUsulanList.length > 0 ? filteredUsulanList.map((item) => (
                            <tr key={item.id}>
                              <td>{item.nik}</td>
                              <td style={{ fontWeight: '600' }}>{item.nama_pengusul}</td>
                              <td>{item.kecamatan}</td>
                              <td>{item.kelurahan}</td>
                              <td>{formatDateIndo(item.tanggal_usulan)}</td>
                              <td style={{ textAlign: "center" }}><span className="badge-status-v waiting">Menunggu Review</span></td>
                              <td style={{ textAlign: "center" }}>
                                <button className="btn-review-action" onClick={() => openValidationModal(item)}>
                                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Review
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada usulan baru yang sesuai pencarian.</td></tr>
                          )}
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
                          <tr>
                            <th>Nama / Identitas</th>
                            <th>Kategori PPKS</th>
                            <th>Kecamatan</th>
                            <th>Lokasi Penemuan</th>
                            <th>Tgl Laporan</th>
                            <th style={{ textAlign: "center" }}>Status Keputusan</th>
                            <th>Keterangan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {riwayatPpksList.length > 0 ? riwayatPpksList.map((item) => (
                            <tr key={item.id}>
                              <td style={{ fontWeight: '600' }}>
                                {item.nama || "Tanpa Identitas"}<br/>
                                <span style={{fontSize:'11px', color:'#64748b', fontWeight:'normal'}}>NIK: {item.nik || "-"}</span>
                              </td>
                              <td>{item.kategori}</td>
                              <td>{item.kecamatan}</td>
                              <td>{item.lokasi}</td>
                              <td>{formatDateIndo(item.tanggal_laporan)}</td>
                              <td style={{ textAlign: "center" }}>
                                <span className={`badge-status-v ${item.status === 'Kasus Aktif' ? 'approved' : 'rejected'}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td style={{ color: '#64748b', fontSize: '12px', maxWidth: '200px' }}>
                                {item.catatan_verifikator || "-"}
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Belum ada riwayat validasi PPKS.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= HALAMAN VALIDASI PPKS ================= */}
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
                    <div className="filter-group-top">
                      <label>Kategori PPKS</label>
                      <div className="select-container-custom">
                        <select name="kategori" value={filterPPKS.kategori} onChange={handleFilterPPKSChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}}>
                          <option value="">Semua Kategori</option>
                          <option value="Anak Balita Terlantar">Anak Balita Terlantar</option>
                          <option value="Anak Terlantar">Anak Terlantar</option>
                          <option value="Anak yang Berhadapan dengan Hukum">Anak yang Berhadapan dengan Hukum</option>
                          <option value="Anak Jalanan">Anak Jalanan</option>
                          <option value="Anak dengan Disabilitas">Anak dengan Disabilitas</option>
                          <option value="Anak yang Menjadi Korban Tindak Kekerasan">Anak yang Menjadi Korban Tindak Kekerasan</option>
                          <option value="Anak yang Memerlukan Perlindungan Khusus">Anak yang Memerlukan Perlindungan Khusus</option>
                          <option value="Lanjut Usia Terlantar">Lanjut Usia Terlantar</option>
                          <option value="Penyandang Disabilitas">Penyandang Disabilitas</option>
                          <option value="Tunasusila">Tunasusila</option>
                          <option value="Gelandangan">Gelandangan</option>
                          <option value="Pengemis">Pengemis</option>
                          <option value="Pemulung">Pemulung</option>
                          <option value="Kelompok Minoritas">Kelompok Minoritas</option>
                          <option value="Bekas Warga Binaan Lembaga Permasyarakatan">Bekas Warga Binaan Lembaga Permasyarakatan</option>
                          <option value="Orang dengan HIV/AIDS">Orang dengan HIV/AIDS</option>
                          <option value="Korban Penyalahgunaan NAPZA">Korban Penyalahgunaan NAPZA</option>
                          <option value="Korban Trafficking">Korban Trafficking</option>
                          <option value="Korban Tindak Kekerasan">Korban Tindak Kekerasan</option>
                          <option value="Pekerja Migran Bermasalah Sosial">Pekerja Migran Bermasalah Sosial</option>
                          <option value="Korban Bencana Alam">Korban Bencana Alam</option>
                          <option value="Korban Bencana Sosial">Korban Bencana Sosial</option>
                          <option value="Perempuan Rawan Sosial Ekonomi">Perempuan Rawan Sosial Ekonomi</option>
                          <option value="Fakir Miskin">Fakir Miskin</option>
                          <option value="Keluarga Bermasalah Sosial Psikologi">Keluarga Bermasalah Sosial Psikologi</option>
                          <option value="Komunitas Adat Terpencil">Komunitas Adat Terpencil</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="filter-group-top">
                      <label>Kecamatan</label>
                      <div className="select-container-custom">
                        <select name="kecamatan" value={filterPPKS.kecamatan} onChange={handleFilterPPKSChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}}>
                          <option value="">Semua Kecamatan</option>
                          <option value="Tallo">Tallo</option>
                          <option value="Bontoala">Bontoala</option>
                          <option value="Panakkukang">Panakkukang</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="filter-group-top">
                      <label>Nama / Identitas (NIK)</label>
                      <input 
                        type="text" 
                        name="keyword" 
                        value={filterPPKS.keyword} 
                        onChange={handleFilterPPKSChange} 
                        placeholder="Cari NIK atau Nama..." 
                        style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}} 
                      />
                    </div>
                    
                    <div className="filter-group-top align-bottom">
                      <button className="btn-search-outline" style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> 
                        Cari Data
                      </button>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <div className="table-responsive">
                      <table className="verifikator-table">
                        <thead>
                          <tr>
                            <th>Nama / Identitas</th>
                            <th>Kategori PPKS</th>
                            <th>Kecamatan</th>
                            <th>Lokasi Penemuan</th>
                            <th>Tgl Laporan</th>
                            <th style={{ textAlign: "center" }}>Status</th>
                            <th style={{ textAlign: "center" }}>Tindakan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* MENGGUNAKAN DATA HASIL FILTER */}
                          {filteredPpksList.length > 0 ? filteredPpksList.map((item) => (
                            <tr key={item.id}>
                              <td style={{ fontWeight: '600' }}>
                                {item.nama || "Tanpa Identitas"}<br/>
                                <span style={{fontSize:'11px', color:'#64748b', fontWeight:'normal'}}>NIK: {item.nik || "-"}</span>
                              </td>
                              <td>{item.kategori}</td>
                              <td>{item.kecamatan}</td>
                              <td>{item.lokasi}</td>
                              <td>{formatDateIndo(item.tanggal_laporan)}</td>
                              <td style={{ textAlign: "center" }}><span className="badge-status-v waiting">Menunggu Review</span></td>
                              <td style={{ textAlign: "center" }}>
                                <button className="btn-review-action" onClick={() => openValidationPPKSModal(item)}>
                                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Review
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada laporan PPKS yang sesuai pencarian.</td></tr>
                          )}
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
                          <tr><th>Nama / Identitas</th><th>Kategori PPKS</th><th>Tgl Laporan</th><th style={{ textAlign: "center" }}>Status Keputusan</th></tr>
                        </thead>
                        <tbody>
                          {riwayatPpksList.length > 0 ? riwayatPpksList.map((item) => (
                            <tr key={item.id}>
                              <td style={{ fontWeight: '600' }}>{item.nama}</td><td>{item.kategori}</td><td>{formatDateIndo(item.tanggal_laporan)}</td>
                              <td style={{ textAlign: "center" }}><span className="badge-status-v approved">{item.status}</span></td>
                            </tr>
                          )) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Belum ada riwayat validasi.</td></tr>
                          )}
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

      {/* ================= 🌟 MODAL VALIDASI BANSOS (DIUBAH KE 39 VARIABEL) 🌟 ================= */}
      {isValidateModalOpen && selectedData && (
        <div className="modal-overlay" onClick={() => setIsValidateModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2>Review Data Usulan Bansos</h2>
              </div>
            </div>
            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              
              <div className="alert-info-box" style={{ backgroundColor: '#f1f5f9', border: '1px dashed #94a3b8', padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
                <div><span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>JENIS BANSOS:</span><strong style={{ color: '#234a66' }}>{selectedData.jenis_bansos || "Belum Ditentukan"}</strong></div>
                <div style={{ textAlign: 'right' }}><span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>TANGGAL USULAN:</span><strong style={{ color: '#234a66' }}>{formatDateIndo(selectedData.tanggal_usulan)}</strong></div>
              </div>
              
              <div className="modal-section">
                <h3 className="section-subtitle">Data Pribadi Keluarga (Read-Only)</h3>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>NIK</label><input type="text" value={selectedData.nik} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>No. KK</label><input type="text" value={selectedData.no_kk || "-"} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Nama Lengkap</label><input type="text" value={selectedData.nama_pengusul} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Kecamatan</label><input type="text" value={selectedData.kecamatan} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Kelurahan</label><input type="text" value={selectedData.kelurahan} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Tingkat Desil Saat Ini</label><input type="text" value={asetKeluarga ? asetKeluarga.desil : "Belum Dihitung"} readOnly className="input-readonly" style={{ fontWeight: 'bold', color: '#b45309', backgroundColor: '#fffbeb' }} /></div>
                  <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}><label>Alamat Lengkap</label><input type="text" value={selectedData.alamat} readOnly className="input-readonly" /></div>
                </div>
              </div>

              <div className="modal-section" style={{ marginTop: '20px' }}>
                <h3 className="section-subtitle">Kondisi Aset & Perumahan (39 Variabel DTSEN)</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>Data di bawah ditarik langsung dari survei lapangan DTSEN.</p>
                
                {asetKeluarga && asetKeluarga.detail ? (
                  <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: '13px' }}>
                     {/* Menampilkan objek aset (key-value) */}
                     {Object.entries(asetKeluarga.detail).map(([key, value]) => (
                        <div key={key} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dashed #cbd5e1', paddingBottom: '5px' }}>
                          <span style={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }}>Var: {key.toUpperCase()}</span>
                          <span style={{ color: '#1e293b' }}>{value}</span>
                        </div>
                     ))}
                  </div>
                ) : (
                  <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', textAlign: 'center', fontSize: '13px' }}>
                    Keluarga ini belum melengkapi data 39 Variabel Aset di DTSEN. Disarankan untuk menolak usulan sampai staf melengkapi data tersebut.
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS (Meneruskan Status 'Layak' atau 'Tidak Layak') */}
              <div style={{ marginTop: '30px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
                <div className="form-group-modal" style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#234a66' }}>Catatan Verifikator (Opsional)</label>
                  <textarea 
                    rows="3" 
                    value={catatanValidasi}
                    onChange={(e) => setCatatanValidasi(e.target.value)}
                    style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', width: '100%', outline: 'none', resize: 'vertical' }} 
                    placeholder="Isi catatan jika data dikembalikan ke Staf untuk diperbaiki atau alasan kelayakan..."
                  ></textarea>
                </div>
                <div className="modal-actions" style={{ gap: '20px', display: 'flex' }}>
                  <button type="button" className="btn-modal-danger" style={{ flex: 1, padding: '15px' }} onClick={(e) => handleValidasiBansos(e, "Tidak Layak")}>Tolak (Tidak Layak)</button>
                  <button type="button" className="btn-modal-submit" style={{ flex: 1, padding: '15px' }} onClick={(e) => handleValidasiBansos(e, "Layak")}>Validasi & Setujui (Layak)</button>
                </div>
              </div>

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
                <div><span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>KATEGORI:</span><strong style={{ color: '#234a66' }}>{selectedPPKSReview.kategori}</strong></div>
                <div style={{ textAlign: 'right' }}><span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>TANGGAL LAPORAN:</span><strong style={{ color: '#234a66' }}>{formatDateIndo(selectedPPKSReview.tanggal_laporan)}</strong></div>
              </div>

              <div className="modal-section">
                <h3 className="section-subtitle">Data Temuan Lapangan (Read-Only)</h3>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>Nama / Alias</label><input type="text" value={selectedPPKSReview.nama} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Kecamatan</label><input type="text" value={selectedPPKSReview.kecamatan} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}><label>Lokasi Presisi Penemuan</label><input type="text" value={selectedPPKSReview.lokasi} readOnly className="input-readonly" /></div>
                </div>
              </div>

              {/* FORM ASESMEN & PERSETUJUAN */}
              <form style={{ marginTop: '30px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
                <div className="form-group-modal" style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#15803d' }}>Hasil Asesmen / Instruksi Penanganan Lanjutan*</label>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px 0' }}>Berikan instruksi kepada staf lapangan apa yang harus dilakukan selanjutnya (misal: Rujuk ke RS, Masukkan Panti, dll) jika kasus ini disetujui. Atau berikan alasan jika ditolak.</p>
                  <textarea 
                    rows="4" 
                    value={catatanValidasi}
                    onChange={(e) => setCatatanValidasi(e.target.value)}
                    style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', width: '100%', outline: 'none', resize: 'vertical' }} 
                    placeholder="Ketik hasil asesmen atau instruksi di sini..." 
                    required
                  ></textarea>
                </div>

                <div className="modal-actions" style={{ gap: '20px', display: 'flex' }}>
                  <button type="button" className="btn-modal-danger" style={{ flex: 1, padding: '15px' }} onClick={(e) => handleValidationPPKSAction(e, "Ditolak")}>
                    Tolak Laporan (Bukan Kasus)
                  </button>
                  <button type="button" className="btn-modal-submit" style={{ flex: 1, padding: '15px', backgroundColor: '#1d4ed8' }} onClick={(e) => handleValidationPPKSAction(e, "Kasus Aktif")}>
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