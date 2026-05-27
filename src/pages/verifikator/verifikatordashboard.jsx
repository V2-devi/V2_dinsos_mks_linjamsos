import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./verifikatordashboard.css"; 
import PenentuanDesil from "../staff/penentuandesil";

// ✅ IMPORT LOGO SICADAS VERSI DASHBOARD (LATAR PUTIH)
import logoSicadasDashboard from "../../assets/logo_sicadas_col.png";

import { supabase } from "../../config/supabase";

// ✅ IMPORT KOMPONEN ANAK
import ValidasiBansos from "./validasibansos";
import ValidasiPPKS from "./validasippks";

function VerifikatorDashboard() {
  const [usulanData, setUsulanData] = useState([]);
  const [dtsenData, setDtsenData] = useState([]);
  const [dummyPPKS, setDummyPPKS] = useState([]);
  // Tambahkan ini di dekat state lainnya
  const [currentVerifikator, setCurrentVerifikator] = useState({
    nama: "Verifikator",
    nip: "-"
  });

  // ✅ DITAMBAHKAN: State untuk menyimpan daftar staff
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const savedUserData = localStorage.getItem("currentStaffUser"); // atau key yang Anda gunakan
  if (savedUserData) {
    const parsedData = JSON.parse(savedUserData);
    setCurrentVerifikator({
      nama: parsedData.nama_lengkap || "Verifikator",
      nip: parsedData.nip || "-"
    });
  }
    const fetchData = async () => {
      try {
        const { data: pengusulanData } = await supabase.from('pengusulan_bansos').select('*');
        if (pengusulanData) setUsulanData(pengusulanData);

        const { data: keluargaData } = await supabase.from('keluarga').select('*');
        if (keluargaData) setDtsenData(keluargaData);

        // const { data: ppksData } = await supabase.from('ppks').select('*');
        // if (ppksData) setDummyPPKS(ppksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const usulanMenunggu = usulanData.filter(i => i.status_pengusulan === "Belum").length;
  const ppksMenunggu = dummyPPKS.filter(i => i.status_penanganan === "Menunggu Kelayakan" || i.status_penanganan === "Menunggu Kelayakan").length;
  const totalDtsen = dtsenData.length;
  const desil1 = dtsenData.filter(i => i.hasil_desil === "1").length;
  const desil2 = dtsenData.filter(i => i.hasil_desil === "2").length;
  const desil3 = dtsenData.filter(i => i.hasil_desil === "3").length;
  const desil4 = dtsenData.filter(i => i.hasil_desil === "4").length;
  const desil5 = dtsenData.filter(i => i.hasil_desil === "5").length;
  const desil6_10 = dtsenData.filter(i => i.hasil_desil === "6-10").length;
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("dashboard"); 
  const [activeTab, setActiveTab] = useState("menunggu");
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  const [isReviewPPKSModalOpen, setIsReviewPPKSModalOpen] = useState(false);
  const [selectedPPKSReview, setSelectedPPKSReview] = useState(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [usulanList, setUsulanList] = useState([]);
  const [riwayatList, setRiwayatList] = useState([]);
  
  const [ppksList, setPpksList] = useState([]);
  const [riwayatPpksList, setRiwayatPpksList] = useState([]);
  
  const [catatanValidasi, setCatatanValidasi] = useState("");
  const [asetKeluarga, setAsetKeluarga] = useState(null); 

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
                         (item.nama_lengkap && String(item.nama_lengkap).toLowerCase().includes(keyword));
    return matchKecamatan && matchKelurahan && matchKeyword;
  });

  const [filterPPKS, setFilterPPKS] = useState({ kategori_ppks: "", kecamatan: "", keyword: "" });

  const handleFilterPPKSChange = (e) => {
    const { name, value } = e.target;
    setFilterPPKS({ ...filterPPKS, [name]: value });
  };

  const filteredPpksList = ppksList.filter(item => {
    const matchKategori = filterPPKS.kategori_ppks === "" || item.kategori_ppks === filterPPKS.kategori_ppks;
    const matchKecamatan = filterPPKS.kecamatan === "" || item.kecamatan === filterPPKS.kecamatan;
    const keyword = filterPPKS.keyword.toLowerCase();
    const matchKeyword = keyword === "" || 
                         (item.nik && String(item.nik).toLowerCase().includes(keyword)) || 
                         (item.nama_lengkap && String(item.nama_lengkap).toLowerCase().includes(keyword));
    return matchKategori && matchKecamatan && matchKeyword;
  });

  useEffect(() => {
    fetchDataVerifikator();
  }, []);

  const fetchDataVerifikator = async () => {
    try {
      const { data: dataBansos, error: errBansos } = await supabase.from('pengusulan_bansos').select('*').eq('status_pengusulan', 'Belum');
      if (errBansos) throw errBansos;
      setUsulanList(dataBansos);

      const { data: dataRiwayat, error: errRiwayat } = await supabase.from('pengusulan_bansos').select('*').neq('status_pengusulan', 'Belum');
      if (errRiwayat) throw errRiwayat;
      setRiwayatList(dataRiwayat);

      const { data: dataPPKS, error: errPPKS } = await supabase.from('ppks').select('*').eq('status_penanganan', 'Menunggu Kelayakan');
      if (errPPKS) throw errPPKS;
      setPpksList(dataPPKS);

      // ✅ BENAR: Ambil data yang statusnya "Kasus Aktif" ATAU "Selesai Ditangani"
      const { data: dataRiwayatPPKS, error: errRiwayatPPKS } = await supabase
        .from('ppks')
        .select('*')
        .or('status_penanganan.eq.Kasus Aktif,status_penanganan.eq.Selesai Ditangani');

      if (errRiwayatPPKS) throw errRiwayatPPKS;
      setRiwayatPpksList(dataRiwayatPPKS);

      // const { data: dataRiwayatPPKS, error: errRiwayatPPKS } = await supabase.from('ppks').select('*').neq('status_penanganan', 'Selesai Ditangani', 'Kasus Aktif');
      // if (errRiwayatPPKS) throw errRiwayatPPKS;
      // setRiwayatPpksList(dataRiwayatPPKS);
      
      // ✅ DITAMBAHKAN: Mengambil data user yang memiliki role staff
      // Pastikan tabel di supabase Anda bernama 'users' atau sesuaikan namanya
      const { data: staffData, error: errStaff } = await supabase.from('users').select('*').eq('role', 'staff');
      if (!errStaff && staffData) {
        setStaffList(staffData);
      }
      
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  const notifData = [{ id: 1, title: "Sistem Terhubung", date: "Hari ini", desc: "Data berhasil disinkronkan dengan Staf Lapangan." }];

  const openValidationModal = async (data) => {
    setSelectedData(data);
    setCatatanValidasi("");
    setAsetKeluarga(null); 
    try {
      const { data: dataKeluarga, error } = await supabase.from('keluarga').select('aset, hasil_desil').or(`no_kk.eq.${data.no_kk},nik_kepala.eq.${data.nik}`).single();
      if (!error && dataKeluarga) setAsetKeluarga({ hasil_desil: dataKeluarga.hasil_desil, detail: dataKeluarga.aset });
    } catch (error) { console.log("Keluarga belum memiliki data aset 39 Variabel di DTSEN."); }
    setIsValidateModalOpen(true);
  };

  const openValidationPPKSModal = (data) => { setSelectedPPKSReview(data); setIsReviewPPKSModalOpen(true); };

  const handleValidasiBansos = async (e, statusKeputusan) => {
    e.preventDefault();
    if (!selectedData) return;
    try {
      const { error } = await supabase.from('pengusulan_bansos').update({ status_pengusulan: statusKeputusan, catatan_verifikator: catatanValidasi }).eq('id', selectedData.id);
      if (error) throw error;
      await fetchDataVerifikator();
      setIsValidateModalOpen(false); setSelectedData(null); setCatatanValidasi("");
      setIsSuccessModalOpen(true); setTimeout(() => setIsSuccessModalOpen(false), 3000);
      setActiveTab("riwayat"); 
    } catch (error) { console.error("Gagal update status:", error); alert("Gagal melakukan validasi."); }
  };

  const handleValidationPPKSAction = async (e, statusKeputusan) => {
    e.preventDefault();
    if (!selectedPPKSReview) return;
    try {
      const { error } = await supabase.from('ppks').update({ status_penanganan: statusKeputusan, catatan_verifikator: catatanValidasi }).eq('id', selectedPPKSReview.id);
      if (error) throw error;
      await fetchDataVerifikator(); 
      setIsReviewPPKSModalOpen(false); setSelectedPPKSReview(null); setCatatanValidasi(""); 
      setIsSuccessModalOpen(true); setTimeout(() => setIsSuccessModalOpen(false), 3000);
      setActiveTab("riwayat"); 
    } catch (error) { console.error("Gagal update status PPKS:", error); alert("Gagal melakukan validasi PPKS."); }
  };

  const formatDateIndo = (dateStr) => { 
    if(!dateStr || dateStr === "-") return "-"; 
    const date = new Date(dateStr); 
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]; 
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`; 
  };

  return (
    <div className="verifikator-layout relative">
      <aside className="sidebar">
        
        {/* ✅ LOGO SICADAS DITENGAHKAN DAN TEKS LAMA DIHAPUS AGAR BERSIH */}
        <div className="sidebar-brand" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '15px 0' }}>
          <img 
            src={logoSicadasDashboard} 
            alt="Logo SICADAS" 
            className="sidebar-logo" 
            style={{ width: "100%", maxWidth: "150px", height: "auto", margin: "0 auto" }} 
          />
        </div>

        <div className="sidebar-profile" style={{ cursor: 'pointer' }} onClick={() => navigate("/verifikatorprofile")} title="Lihat Profil">
  {/* Ikon Profil */}
  <div className="profile-avatar-small">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4"></circle>
      <path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path>
    </svg>
  </div>
  
  {/* Info Profil */}
  <div className="profile-info">
    <span className="profile-name">{currentVerifikator.nama}</span>
    <span className="profile-nip">{currentVerifikator.nip}</span>
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

          <button 
            className={`menu-item ${activeMenu === "penentuan_desil" ? "active" : ""}`} 
            onClick={() => { setActiveMenu("penentuan_desil"); setActiveTab("menunggu_penentuan"); }}
          >
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
            </svg> 
            Penentuan Desil
          </button>

          <button className="menu-item" style={{ marginTop: '40px', color: '#ef4444' }} onClick={() => navigate("/login")}>
             <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Keluar
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1 className="header-title">
            {activeMenu === "dashboard" && "Dashboard Verifikator"}
            {activeMenu === "validasi_bansos" && "Validasi Usulan Bansos"}
            {activeMenu === "validasi_ppks" && "Validasi Laporan PPKS"}
            {activeMenu === "monitoring" && "Monitoring Tanggung Jawab Wilayah"}
            {activeMenu === "penentuan_desil" && "Kalkulasi & Penentuan Desil Keluarga"}
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
                  {notifData.map((n) => (<div className="notif-item" key={n.id}><div className="notif-title-row"><h4>{n.title}</h4><span>{n.date}</span></div><p>{n.desc}</p></div>))}
                </div>
              </div>
            )}
          </div>
        </header>

        {isNotifOpen && <div className="notif-backdrop" onClick={() => setIsNotifOpen(false)}></div>}

        <div className="content-body">
          {activeMenu === "dashboard" && (
            <div className="dashboard-verifikator-wrapper">
              <h3 className="section-title" style={{ marginTop: 0 }}>Tugas Menunggu Validasi</h3>
              <div className="task-summary-grid">
                <div className="task-card bansos-task">
                  <div className="task-card-icon"><svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg></div>
                  <div className="task-card-info"><h4>Usulan Bansos Baru</h4><p>Membutuhkan persetujuan Anda</p></div>
                  <div className="task-card-count"><span>{usulanList.length}</span></div>
                  <button className="task-card-btn" onClick={() => { setActiveMenu("validasi_bansos"); setActiveTab("menunggu"); }}>Validasi Sekarang &rarr;</button>
                </div>
                <div className="task-card ppks-task">
                  <div className="task-card-icon"><svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
                  <div className="task-card-info"><h4>Laporan PPKS</h4><p>Membutuhkan review kelayakan</p></div>
                  <div className="task-card-count"><span>{ppksList.length}</span></div>
                  <button className="task-card-btn" onClick={() => { setActiveMenu("validasi_ppks"); setActiveTab("menunggu"); }}>Validasi Sekarang &rarr;</button>
                </div>
              </div>

              <div style={{ marginTop: '40px' }}>
                <div className="dtsen-summary-top">
                  <div className="dtsen-top-content">
                    <div><h2 className="dtsen-top-title">Total Keluarga Terdaftar di DTSEN</h2><p className="dtsen-top-subtitle">Data terpadu Kota Makassar yang telah tervalidasi</p></div>
                    <div className="dtsen-top-number">{totalDtsen} <span>Keluarga</span></div>
                  </div>
                </div>
                <h3 className="section-title" style={{ marginBottom: '15px' }}>Sebaran Desil Kesejahteraan</h3>
                <div className="decile-grid">
                  <div className="decile-card d1"><div className="dec-head"><span className="dec-badge d1-bg">Desil 1</span></div><div className="dec-title">Sangat Rentan / Ekstrem</div><div className="dec-val">{desil1} <span>Keluarga</span></div></div>
                  <div className="decile-card d2"><div className="dec-head"><span className="dec-badge d2-bg">Desil 2</span></div><div className="dec-title">Keluarga Rentan</div><div className="dec-val">{desil2} <span>Keluarga</span></div></div>
                  <div className="decile-card d3"><div className="dec-head"><span className="dec-badge d3-bg">Desil 3</span></div><div className="dec-title">Hampir Rentan</div><div className="dec-val">{desil3} <span>Keluarga</span></div></div>
                  <div className="decile-card d4"><div className="dec-head"><span className="dec-badge d4-bg">Desil 4</span></div><div className="dec-title">Rentan Sedang</div><div className="dec-val">{desil4} <span>Keluarga</span></div></div>
                  <div className="decile-card d5"><div className="dec-head"><span className="dec-badge d5-bg">Desil 5</span></div><div className="dec-title">Menuju Aman</div><div className="dec-val">{desil5} <span>Keluarga</span></div></div>
                  <div className="decile-card d6"><div className="dec-head"><span className="dec-badge d6-bg">Desil 6-10</span></div><div className="dec-title">Keluarga Mampu / Aman</div><div className="dec-val">{desil6_10} <span>Keluarga</span></div></div>
                </div>
              </div>
            </div>
          )}
          
          {/* ✅ PANGGIL KOMPONEN VALIDASI BANSOS */}
          {activeMenu === "validasi_bansos" && (
            <ValidasiBansos 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              filterBansos={filterBansos} 
              handleFilterBansosChange={handleFilterBansosChange} 
              filteredUsulanList={filteredUsulanList} 
              riwayatList={riwayatList} 
              formatDateIndo={formatDateIndo} 
              openValidationModal={openValidationModal} 
            />
          )}

          {/* ✅ PANGGIL KOMPONEN VALIDASI PPKS */}
          {activeMenu === "validasi_ppks" && (
            <ValidasiPPKS 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              filterPPKS={filterPPKS} 
              handleFilterPPKSChange={handleFilterPPKSChange} 
              filteredPpksList={filteredPpksList} 
              riwayatPpksList={riwayatPpksList} 
              formatDateIndo={formatDateIndo} 
              openValidationPPKSModal={openValidationPPKSModal} 
            />
          )}

          {activeMenu === "penentuan_desil" && (
            <PenentuanDesil 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              dtsenData={dtsenData} 
              setDtsenData={setDtsenData} 
              showSuccess={() => {}} /* Gunakan fungsi showSuccess jika ada di file ini, atau biarkan kosong seperti ini sementara waktu */
            />
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
                  <div className="form-group-modal"><label>Nama Kepala Keluarga</label><input type="text" value={selectedData.nama_lengkap} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Kecamatan</label><input type="text" value={selectedData.kecamatan} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Kelurahan</label><input type="text" value={selectedData.kelurahan} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Tingkat Desil Saat Ini</label><input type="text" value={asetKeluarga ? asetKeluarga.hasil_desil : "Belum Dihitung"} readOnly className="input-readonly" style={{ fontWeight: 'bold', color: '#b45309', backgroundColor: '#fffbeb' }} /></div>
                  <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}><label>Alamat Lengkap</label><input type="text" value={selectedData.alamat} readOnly className="input-readonly" /></div>
                </div>
              </div>

              <div className="modal-section" style={{ marginTop: '20px' }}>
                <h3 className="section-subtitle">Kondisi Aset & Perumahan (39 Variabel DTSEN)</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>Data di bawah ditarik langsung dari survei lapangan DTSEN.</p>
                {asetKeluarga && asetKeluarga.detail ? (
                  <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: '13px' }}>
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

              <div style={{ marginTop: '30px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
                <div className="form-group-modal" style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#234a66' }}>Catatan Verifikator (Opsional)</label>
                  <textarea rows="3" value={catatanValidasi} onChange={(e) => setCatatanValidasi(e.target.value)} style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', width: '100%', outline: 'none', resize: 'vertical' }} placeholder="Isi catatan jika data dikembalikan ke Staf untuk diperbaiki atau alasan kelayakan..."></textarea>
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

              <form style={{ marginTop: '30px', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
                <div className="form-group-modal" style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#15803d' }}>Hasil Asesmen / Instruksi Penanganan Lanjutan*</label>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px 0' }}>Berikan instruksi kepada staf lapangan apa yang harus dilakukan selanjutnya (misal: Rujuk ke RS, Masukkan Panti, dll) jika kasus ini disetujui. Atau berikan alasan jika ditolak.</p>
                  <textarea rows="4" value={catatanValidasi} onChange={(e) => setCatatanValidasi(e.target.value)} style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px', width: '100%', outline: 'none', resize: 'vertical' }} placeholder="Ketik hasil asesmen atau instruksi di sini..." required></textarea>
                </div>
                <div className="modal-actions" style={{ gap: '20px', display: 'flex' }}>
                  <button type="button" className="btn-modal-danger" style={{ flex: 1, padding: '15px' }} onClick={(e) => handleValidationPPKSAction(e, "Ditolak")}>Tolak Laporan (Bukan Kasus)</button>
                  <button type="button" className="btn-modal-submit" style={{ flex: 1, padding: '15px', backgroundColor: '#1d4ed8' }} onClick={(e) => handleValidationPPKSAction(e, "Kasus Aktif")}>Validasi & Jadikan "Kasus Aktif"</button>
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