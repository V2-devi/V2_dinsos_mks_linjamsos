import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./staffdashboard.css";
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // <--- Panggil fungsi location

  // === STATE NAVIGASI & TAB DINAMIS ===
  // Ia akan membaca 'state' dari halaman sebelumnya. Jika tidak ada, default ke 'usulan_baru'
  const [activeMenu, setActiveMenu] = useState(location.state?.activeMenu || "usulan_baru"); 
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "dashboard"); 
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // === STATE POP-UP MODAL UMUM ===
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddPPKSModalOpen, setIsAddPPKSModalOpen] = useState(false);
  const [isKalkulasiModalOpen, setIsKalkulasiModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedKalkulasi, setSelectedKalkulasi] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false); 

  // === STATE DETAIL USULAN BANSOS ===
  const [selectedDetailData, setSelectedDetailData] = useState(null);

  // === STATE DATA & MODAL DTSEN ===
  const [isAddDtsenModalOpen, setIsAddDtsenModalOpen] = useState(false);
  const [selectedDtsenData, setSelectedDtsenData] = useState(null);
  const [detailDtsenInnerTab, setDetailDtsenInnerTab] = useState("anggota"); 

  // === STATE MODAL ANGGOTA & 39 VARIABEL DTSEN ===
  const [isAddAnggotaModalOpen, setIsAddAnggotaModalOpen] = useState(false);
  const [isDetailAnggotaModalOpen, setIsDetailAnggotaModalOpen] = useState(false);
  const [selectedAnggotaData, setSelectedAnggotaData] = useState(null);
  const [isEditAsetModalOpen, setIsEditAsetModalOpen] = useState(false);
  const initialFormAnggota = { nik: "", nama: "", hub: "", jk: "", tglLahir: "", status: "Hidup" };
  const [formAnggota, setFormAnggota] = useState(initialFormAnggota);
  const initialFormPPKS = { nik: "", nama: "", kategori: "", kecamatan: "", lokasi: "", tanggal: "" };
  const [formPPKS, setFormPPKS] = useState(initialFormPPKS);
  
  const handleAddPPKSSubmit = (e) => {
    e.preventDefault();
    const newPPKS = {
      ...formPPKS,
      id: Date.now(),
      status: "Menunggu Kelayakan",
      // Jika NIK/Nama kosong, beri nilai default
      nik: formPPKS.nik || "Belum Diketahui", 
      nama: formPPKS.nama || "Tanpa Identitas"
    };
    setDummyPPKS([newPPKS, ...dummyPPKS]);
    setIsAddPPKSModalOpen(false);
    setFormPPKS(initialFormPPKS); // Reset form
    showSuccess();
  };
  // =========================================================================
  // === 🌟 STATE & FUNGSI UNTUK DETAIL PPKS 🌟 ===
  // =========================================================================
  const [selectedPPKSData, setSelectedPPKSData] = useState(null);
  const [catatanAssessment, setCatatanAssessment] = useState("");

  const handleOpenDetailPPKS = (data) => {
    setSelectedPPKSData(data);
    setCatatanAssessment(data.deskripsiAwal || ""); // Mengambil catatan lama jika ada
    setActiveTab("detail_ppks"); // Pindah ke halaman virtual detail
  };

  const handleUpdateStatusPPKS = (e, statusBaru) => {
    e.preventDefault();
    // Update data di tabel utama
    const updatedPPKS = dummyPPKS.map(item =>
      item.id === selectedPPKSData.id ? { ...item, status: statusBaru, deskripsiAwal: catatanAssessment } : item
    );
    setDummyPPKS(updatedPPKS);
    // Update data yang sedang ditampilkan di detail
    setSelectedPPKSData({ ...selectedPPKSData, status: statusBaru, deskripsiAwal: catatanAssessment });
    showSuccess();
  };
  
  const [formAset, setFormAset] = useState({});

  // =========================================================================
  // === DATA DUMMY: USULAN BANSOS ===
  // =========================================================================
  const [usulanData, setUsulanData] = useState([
    { id: 1, nik: "3971371863193701", noKk: "000000000000", nama: "Cinta", kecamatan: "Tallo", kelurahan: "Wala-walaya", tanggal: "2026-02-14", alamat: "Jl. Kandea", status: "Layak" },
    { id: 2, nik: "7270888888888888", noKk: "111111111111", nama: "Budi Santoso", kecamatan: "Bontoala", kelurahan: "Baraya", tanggal: "2026-03-15", alamat: "Jl. Veteran", status: "Tidak Layak" },
    { id: 3, nik: "7470666666666666", noKk: "222222222222", nama: "Andi Pangeran", kecamatan: "Tallo", kelurahan: "Pannampu", tanggal: "2026-05-10", alamat: "Jl. Sunu", status: "Belum" }
  ]);
  const initialFormState = { nik: "", noKk: "", nama: "", kecamatan: "", kelurahan: "", tanggal: "", alamat: "", desil: "", jenisBansos: "", status: "Belum" };
  const [formData, setFormData] = useState(initialFormState);
  const [filterPeriodeDashboard, setFilterPeriodeDashboard] = useState("q1");
  const [filterTable, setFilterTable] = useState({ kecamatan: "", kelurahan: "", nik: "", nama: "" });

  const getQuarter = (dateString) => {
    if (!dateString) return "q1";
    const month = new Date(dateString).getMonth() + 1;
    return month <= 3 ? "q1" : month <= 6 ? "q2" : month <= 9 ? "q3" : "q4";
  };

  const dashboardDataFiltered = usulanData.filter(item => getQuarter(item.tanggal) === filterPeriodeDashboard);
  const statTotal = dashboardDataFiltered.length;
  const statSelesai = dashboardDataFiltered.filter(i => i.status === "Layak" || i.status === "Tidak Layak").length;
  const statBelum = dashboardDataFiltered.filter(i => i.status === "Belum").length;
  const statLayak = dashboardDataFiltered.filter(i => i.status === "Layak").length;
  const statTidakLayak = dashboardDataFiltered.filter(i => i.status === "Tidak Layak").length;
  const totalVerified = statLayak + statTidakLayak;
  const pctLayak = totalVerified === 0 ? 0 : Math.round((statLayak / totalVerified) * 100);
  const pctTidakLayak = totalVerified === 0 ? 0 : 100 - pctLayak;

  const handleFilterChange = (e) => { setFilterTable({ ...filterTable, [e.target.name]: e.target.value }); };
  const tableDataFiltered = usulanData.filter(item => {
    return (filterTable.kecamatan === "" || item.kecamatan === filterTable.kecamatan) && (filterTable.kelurahan === "" || item.kelurahan === filterTable.kelurahan) && (filterTable.nik === "" || item.nik.includes(filterTable.nik)) && (filterTable.nama === "" || item.nama.toLowerCase().includes(filterTable.nama.toLowerCase()));
  });

  const handleAddSubmit = (e) => { e.preventDefault(); setUsulanData([{ ...formData, id: Date.now() }, ...usulanData]); setIsAddModalOpen(false); setFormData(initialFormState); showSuccess(); };
  
  const handleOpenDetailRiwayat = (data) => { 
    setSelectedDetailData(data); 
    setActiveTab("detail_usulan"); 
  };

  // =========================================================================
  // === DATA DUMMY INTERAKTIF: DTSEN ===
  // =========================================================================
  const [dtsenData, setDtsenData] = useState([
  ]);

  const [formDtsen, setFormDtsen] = useState({ noKk: "", namaKepala: "", kecamatan: "", kelurahan: "", alamat: "" });

  const handleAddDtsen = (e) => {
    e.preventDefault();
    const newDtsen = { 
      ...formDtsen, 
      id: Date.now(), 
      desil: "Belum Dihitung", 
      anggota: [{ nik: "Belum Diinput", nama: formDtsen.namaKepala, hub: "Kepala Keluarga", jk: "-", tglLahir: "-", status: "Hidup" }]
    };
    setDtsenData([newDtsen, ...dtsenData]);
    setIsAddDtsenModalOpen(false);
    setFormDtsen({ noKk: "", namaKepala: "", kecamatan: "", kelurahan: "", alamat: "" });
    showSuccess();
  };

  const handleOpenDetailDtsen = (data) => {
    setSelectedDtsenData(data);
    setDetailDtsenInnerTab("anggota");
    setActiveTab("detail_dtsen");
  };

  const handleOpenDetailAnggota = (anggota) => {
    setSelectedAnggotaData(anggota);
    setIsDetailAnggotaModalOpen(true);
  };

  const handleAddAnggotaSubmit = (e) => {
    e.preventDefault();
    const newAnggota = { ...formAnggota, id: Date.now() };

    const updatedDtsenData = dtsenData.map(family => {
      if (family.id === selectedDtsenData.id) {
        const updatedFamily = { ...family, anggota: [...family.anggota, newAnggota] };
        setSelectedDtsenData(updatedFamily); // Update tampilan detail saat ini
        return updatedFamily;
      }
      return family;
    });

    setDtsenData(updatedDtsenData);
    setIsAddAnggotaModalOpen(false);
    setFormAnggota(initialFormAnggota);
    showSuccess();
  };

  const handleEditAnggotaChange = (e) => {
    const { name, value } = e.target;
    setSelectedAnggotaData({ ...selectedAnggotaData, [name]: value });
  };

  const handleEditAnggotaSubmit = (e) => {
    e.preventDefault();

    const updatedDtsenData = dtsenData.map(family => {
      if (family.id === selectedDtsenData.id) {
        const updatedAnggotaList = family.anggota.map(ang => 
          ang.id === selectedAnggotaData.id ? selectedAnggotaData : ang
        );
        const updatedFamily = { ...family, anggota: updatedAnggotaList };
        setSelectedDtsenData(updatedFamily); // Update tampilan detail saat ini
        return updatedFamily;
      }
      return family;
    });

    setDtsenData(updatedDtsenData);
    setIsDetailAnggotaModalOpen(false);
    showSuccess();
  };

  // 🌟 FUNGSI: BUKA MODAL EDIT 39 VARIABEL 🌟
  const handleOpenEditAset = () => {
    // Jika keluarga sudah punya data aset, gunakan itu. Jika belum, siapkan objek kosong.
    setFormAset(selectedDtsenData.aset || {}); 
    setIsEditAsetModalOpen(true);
  };

  // 🌟 FUNGSI: UBAH INPUT VARIABEL ASET 🌟
  const handleEditAsetChange = (e) => {
    const { name, value } = e.target;
    setFormAset({ ...formAset, [name]: value });
  };

  // 🌟 FUNGSI: SIMPAN 39 VARIABEL 🌟
  const handleEditAsetSubmit = (e) => {
    e.preventDefault();

    const updatedDtsenData = dtsenData.map(family => {
      if (family.id === selectedDtsenData.id) {
        // Simpan data aset ke keluarga ini dan tandai aset sudah lengkap
        const updatedFamily = { ...family, aset: formAset, asetLengkap: true };
        setSelectedDtsenData(updatedFamily); // Update tampilan detail saat ini
        return updatedFamily;
      }
      return family;
    });

    setDtsenData(updatedDtsenData);
    setIsEditAsetModalOpen(false);
    showSuccess();
  };

  const handleArahkanKeDesil = () => {
    setActiveMenu("penentuan_desil");
    setActiveTab("menunggu_penentuan");
  };

  const notifData = [{ id: 1, title: "Sistem", date: "Hari ini", desc: "Data berhasil dimuat." }];
  // State dan dummy PPKS
  const [dummyPPKS, setDummyPPKS] = useState([
    { id: 1, nik: "7371111111111111", nama: "Budi", kategori: "Anak Jalanan", lokasi: "Pasar MT Haryono", kecamatan: "Tallo", tanggal: "2026-02-12", status: "Menunggu Kelayakan" },
    { id: 2, nik: "3971371863193701", nama: "Supardi", kategori: "Lanjut Usia Terlantar", lokasi: "Jl. Veteran Raya", kecamatan: "Bontoala", tanggal: "2026-03-10", status: "Kasus Aktif" },
    { id: 3, nik: "7372222222222222", nama: "Siti", kategori: "Gelandangan & Pengemis", lokasi: "Lampu Merah Flyover", kecamatan: "Tallo", tanggal: "2026-01-15", status: "Kasus Aktif" },
    { id: 4, nik: "7373333333333333", nama: "Agus", kategori: "Penyandang Disabilitas", lokasi: "Jl. Urip Sumoharjo", kecamatan: "Bontoala", tanggal: "2026-04-20", status: "Menunggu Kelayakan" }, // Ini masuk Kuartal 2
    { id: 5, nik: "7374444444444444", nama: "Rina", kategori: "Lanjut Usia Terlantar", lokasi: "Jl. Perintis", kecamatan: "Tallo", tanggal: "2026-02-25", status: "Kasus Aktif" },
    { id: 6, nik: "7375555555555555", nama: "Doni", kategori: "Anak Jalanan", lokasi: "Karebosi", kecamatan: "Bontoala", tanggal: "2026-03-05", status: "Kasus Aktif" },
    { id: 7, nik: "7376666666666666", nama: "Hasan", kategori: "Anak Jalanan", lokasi: "Pelabuhan", kecamatan: "Tallo", tanggal: "2026-03-18", status: "Kasus Aktif" }
  ]);

  const [filterPeriodePPKS, setFilterPeriodePPKS] = useState("q1");
  const [filterTabelPPKS, setFilterTabelPPKS] = useState({ kategori: "", kecamatan: "", nama: "" });
  // STATE & FUNGSI UNTUK FILTER PENENTUAN DESIL
  const [filterDesil, setFilterDesil] = useState({ kecamatan: "", noKk: "" });

  const handleFilterDesilChange = (e) => {
    const { name, value } = e.target;
    setFilterDesil({ ...filterDesil, [name]: value });
  };

  const handleFilterPPKSChange = (e) => {
    setFilterTabelPPKS({ ...filterTabelPPKS, [e.target.name]: e.target.value });
  };
  const dummyMenungguDesil = [
    { id: 1, noKk: "1234567890123456", nama: "Keluarga Baru", kelurahan: "Tallo", tglUpdate: "Hari Ini", kelengkapan: "Lengkap (39/39 Vrb)" },
    { id: 2, noKk: "3971371863193701", nama: "Ahmad Sudirman", kelurahan: "Tallo", tglUpdate: "16 Mar 2026", kelengkapan: "Lengkap (39/39 Vrb)" },
    { id: 3, noKk: "3971371863193702", nama: "Siti Aminah", kelurahan: "Wala-walaya", tglUpdate: "17 Mar 2026", kelengkapan: "Lengkap (39/39 Vrb)" }
  ];
  const dummyRiwayatDesil = [
    { noKk: "3971371863193703", nama: "Kaharuddin", kelurahan: "Tallo", tglHitung: "15 Mar 2026", skor: "45.2", desil: "3" }
  ];

  // LOGIKA PENCARIAN (FILTER) DATA DESIL
  const tabelMenungguFiltered = dummyMenungguDesil.filter((item) => {
    // Mengecek apakah inputan cocok dengan data (Kecamatan dan No KK)
    const matchKecamatan = filterDesil.kecamatan === "" || item.kelurahan.includes(filterDesil.kecamatan);
    const matchNoKk = filterDesil.noKk === "" || item.noKk.includes(filterDesil.noKk);
    return matchKecamatan && matchNoKk;
  });

  const tabelRiwayatFiltered = dummyRiwayatDesil.filter((item) => {
    const matchKecamatan = filterDesil.kecamatan === "" || item.kelurahan.includes(filterDesil.kecamatan);
    const matchNoKk = filterDesil.noKk === "" || item.noKk.includes(filterDesil.noKk);
    return matchKecamatan && matchNoKk;
  });

  // LOGIKA KALKULASI DASHBOARD & TABEL PPKS
  // 1. Filter untuk Dashboard berdasarkan Triwulan (Menggunakan fungsi getQuarter yang sudah ada)
  const dashboardPPKSFiltered = dummyPPKS.filter(item => getQuarter(item.tanggal) === filterPeriodePPKS);
  const ppksAktif = dashboardPPKSFiltered.filter(i => i.status === "Kasus Aktif").length;
  const ppksMenunggu = dashboardPPKSFiltered.filter(i => i.status === "Menunggu Kelayakan").length;

  // 2. Hitung Top 5 Kategori Terbanyak
  const kategoriCount = {};
  dashboardPPKSFiltered.forEach(item => {
    kategoriCount[item.kategori] = (kategoriCount[item.kategori] || 0) + 1;
  });

  const top5PPKS = Object.entries(kategoriCount)
    .map(([nama, jumlah]) => ({ nama, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 5); // Mengambil maksimal 5 data teratas

  const maxPPKS = top5PPKS.length > 0 ? top5PPKS[0].jumlah : 1; // Untuk persentase panjang bar

  // 3. Filter untuk Data Tabel PPKS
  const tabelPPKSFiltered = dummyPPKS.filter(item => {
    const matchKategori = filterTabelPPKS.kategori === "" || item.kategori === filterTabelPPKS.kategori;
    const matchKecamatan = filterTabelPPKS.kecamatan === "" || item.kecamatan === filterTabelPPKS.kecamatan;
    const matchNama = filterTabelPPKS.nama === "" || item.nama.toLowerCase().includes(filterTabelPPKS.nama.toLowerCase()) || item.nik.includes(filterTabelPPKS.nama);
    return matchKategori && matchKecamatan && matchNama;
  });

  const handleGenericSubmit = (e, closeModalFunc) => { e.preventDefault(); if(closeModalFunc) closeModalFunc(false); setIsKalkulasiModalOpen(false); setIsCalculated(false); showSuccess(); };
  const showSuccess = () => { setIsSuccessModalOpen(true); setTimeout(() => setIsSuccessModalOpen(false), 2500); };
  const formatDateIndo = (dateStr) => { if(!dateStr || dateStr === "-") return "-"; const date = new Date(dateStr); const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]; return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`; };

  return (
    <div className="staff-layout relative">
      {/* ================= SIDEBAR ================= */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoLinjamsos} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-brand-text"><span>PERLINDUNGAN DAN</span><span>JAMINAN SOSIAL</span></div>
        </div>
        <div className="sidebar-profile" style={{ cursor: 'pointer' }} onClick={() => navigate("/staffprofile")} title="Lihat Profil">
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
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg> Penentuan Desil
          </button>
          
          <button className="menu-item" style={{ marginTop: '40px', color: '#ef4444' }} onClick={() => navigate("/login")}>
             <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Keluar
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
          
          {/* ================= NOTIFIKASI DROPDOWN UTUH ================= */}
          <div className="notif-wrapper">
            <button className="nav-bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
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
          
          {/* TABS NAVIGASI DINAMIS (Sembunyikan saat di halaman Detail) */}
          {activeMenu === "usulan_baru" && activeTab !== "detail_usulan" && (
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard Usulan Baru</button>
              <button className={`tab-btn ${activeTab === "pengusulan" ? "active" : ""}`} onClick={() => setActiveTab("pengusulan")}>Pengusulan Bansos</button>
            </div>
          )}
          
          {activeMenu === "lihat_dtsen" && activeTab !== "detail_dtsen" && (
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === "dashboard_dtsen" ? "active" : ""}`} onClick={() => setActiveTab("dashboard_dtsen")}>Dashboard DTSEN</button>
              <button className={`tab-btn ${activeTab === "data_dtsen" ? "active" : ""}`} onClick={() => setActiveTab("data_dtsen")}>Lihat Data DTSEN</button>
            </div>
          )}
          
          {/* 👇 TAMBAHKAN KEMBALI TAB PPKS DI SINI 👇 */}
          {activeMenu === "ppks" && activeTab !== "detail_ppks" && (
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === "dashboard_ppks" ? "active" : ""}`} onClick={() => setActiveTab("dashboard_ppks")}>Dashboard Data PPKS</button>
              <button className={`tab-btn ${activeTab === "data_ppks" ? "active" : ""}`} onClick={() => setActiveTab("data_ppks")}>Daftar Data PPKS</button>
            </div>
          )}
          
          {/* 👇 PASTIKAN TAB PENENTUAN DESIL ADA DI SINI 👇 */}
          {activeMenu === "penentuan_desil" && activeTab !== "detail_penentuan" && (
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === "menunggu_penentuan" ? "active" : ""}`} onClick={() => setActiveTab("menunggu_penentuan")}>Data Menunggu Penentuan</button>
              <button className={`tab-btn ${activeTab === "riwayat_penentuan" ? "active" : ""}`} onClick={() => setActiveTab("riwayat_penentuan")}>Riwayat Penentuan Desil</button>
            </div>
          )}
          {/* ================= 🌟 VIRTUAL PAGE: DETAIL & PENANGANAN PPKS 🌟 ================= */}
          {activeMenu === "ppks" && activeTab === "detail_ppks" && selectedPPKSData && (
            <div className="tab-content-wrapper outline-box" style={{ animation: 'fadeInModal 0.3s ease-out' }}>
              
              {/* Header Page & Tombol Kembali */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '25px' }}>
                <h2 style={{ color: '#234a66', margin: 0, fontSize: '20px', fontWeight: '800' }}>Tinjauan & Penanganan PPKS</h2>
                <button className="btn-search-outline" onClick={() => setActiveTab("data_ppks")} style={{ height: '36px' }}>&larr; Kembali ke Daftar PPKS</button>
              </div>

              {/* Status Banner */}
              <div className="info-alert-box" style={{ 
                  backgroundColor: selectedPPKSData.status === 'Kasus Aktif' ? '#eff6ff' : selectedPPKSData.status === 'Menunggu Kelayakan' ? '#fffbeb' : '#dcfce7', 
                  borderColor: selectedPPKSData.status === 'Kasus Aktif' ? '#bfdbfe' : selectedPPKSData.status === 'Menunggu Kelayakan' ? '#fde047' : '#86efac',
                  color: selectedPPKSData.status === 'Kasus Aktif' ? '#1e3a8a' : selectedPPKSData.status === 'Menunggu Kelayakan' ? '#b45309' : '#166534',
                  marginBottom: '25px', display: 'flex', justifyContent: 'space-between'
                }}>
                <span>Status Penanganan Saat Ini: <strong>{selectedPPKSData.status}</strong></span>
                <span style={{ fontSize: '12px', fontWeight: '500' }}>Tgl Laporan: {formatDateIndo(selectedPPKSData.tanggal)}</span>
              </div>

              <div className="detail-summary-grid">
                <div className="summary-col">
                  <div className="summary-item"><span className="sum-label">Nama / Identitas (Alias)</span><span className="sum-val">{selectedPPKSData.nama}</span></div>
                  <div className="summary-item"><span className="sum-label">Nomor NIK (Jika Ada)</span><span className="sum-val">{selectedPPKSData.nik}</span></div>
                </div>
                <div className="summary-col">
                  <div className="summary-item"><span className="sum-label">Kategori PPKS</span><span className="sum-val text-blue">{selectedPPKSData.kategori}</span></div>
                  <div className="summary-item"><span className="sum-label">Kecamatan Penemuan</span><span className="sum-val">{selectedPPKSData.kecamatan}</span></div>
                </div>
                <div className="summary-col" style={{ gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                  <div className="summary-item"><span className="sum-label">Lokasi Penemuan Spesifik</span><span className="sum-val">{selectedPPKSData.lokasi}</span></div>
                </div>
              </div>

              {/* Form Tindak Lanjut & Assessment */}
              <div className="modal-section" style={{ marginTop: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 className="section-subtitle">Tindak Lanjut & Assessment Lapangan</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Catat hasil temuan lapangan dan perbarui status penanganan kasus ini.</p>
                
                <div className="form-group-modal">
                  <label>Catatan Penanganan / Assessment Singkat</label>
                  <textarea 
                    value={catatanAssessment} 
                    onChange={(e) => setCatatanAssessment(e.target.value)} 
                    rows="4" 
                    placeholder="Ketik hasil observasi atau tindakan yang telah dilakukan..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '13px' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'flex-end' }}>
                  {selectedPPKSData.status === "Menunggu Kelayakan" && (
                    <button className="btn-modal-submit" style={{ backgroundColor: '#3b82f6', width: 'auto' }} onClick={(e) => handleUpdateStatusPPKS(e, "Kasus Aktif")}>
                      Terima & Ubah ke Kasus Aktif
                    </button>
                  )}
                  {selectedPPKSData.status === "Kasus Aktif" && (
                    <button className="btn-modal-submit" style={{ backgroundColor: '#22c55e', width: 'auto' }} onClick={(e) => handleUpdateStatusPPKS(e, "Selesai Ditangani")}>
                      Tandai Selesai / Dirujuk ke Panti
                    </button>
                  )}
                  {selectedPPKSData.status === "Selesai Ditangani" && (
                    <span style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#64748b', borderRadius: '8px', fontWeight: '700', fontSize: '13px' }}>
                      Kasus Telah Ditutup
                    </span>
                  )}
                </div>
              </div>

            </div>
          )}
          
          {/* ================= 1. USULAN BARU (DASHBOARD & TABEL) ================= */}
          {activeMenu === "usulan_baru" && activeTab === "dashboard" && (
            <div className="tab-content-wrapper outline-box">
              <div className="filter-row-right">
                <div className="pill-select-wrapper">
                  <select value={filterPeriodeDashboard} onChange={(e) => setFilterPeriodeDashboard(e.target.value)}>
                    <option value="q1">Januari - Maret</option>
                    <option value="q2">April - Juni</option>
                    <option value="q3">Juli - September</option>
                    <option value="q4">Oktober - Desember</option>
                  </select>
                </div>
              </div>
              <div className="stats-grid-3">
                <div className="stat-card-white"><h4>Total Usulan</h4><div className="stat-number-large">{statTotal} <span>Usulan</span></div></div>
                <div className="stat-card-white"><h4>Selesai Verifikasi</h4><div className="stat-number-large text-blue">{statSelesai} <span>Usulan</span></div></div>
                <div className="stat-card-white"><h4>Belum Verifikasi</h4><div className="stat-number-large text-dark">{statBelum} <span>Usulan</span></div></div>
              </div>
              <div className="chart-section-wrapper">
                <h3 className="chart-section-title">Distribusi Hasil Kelayakan</h3>
                <div className="chart-flex-container">
                  <div className="chart-visual-area">
                    <span className="chart-number-top">{statLayak}</span>
                    <div className="css-donut-chart" style={{ background: `conic-gradient(#22c55e 0% ${pctLayak}%, #ef4444 ${pctLayak}% 100%)` }}><div className="donut-inner"></div></div>
                    <span className="chart-number-bottom">{statTidakLayak}</span>
                  </div>
                  <div className="chart-legend-area">
                    <div className="legend-box-green"><div className="legend-title-row"><div className="dot-green"></div><strong>Layak Bansos ({pctLayak}%)</strong></div></div>
                    <div className="legend-box-red-outline">
                      <div className="legend-title-row"><div className="dot-red-outline"></div><strong>Tidak Layak ({pctTidakLayak}%)</strong></div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "usulan_baru" && activeTab === "pengusulan" && (
            <div className="tab-content-wrapper outline-box">
              <div className="pengusulan-filter-grid">
                <div className="filter-group-top"><label>Kecamatan</label><div className="select-container-custom"><select name="kecamatan" value={filterTable.kecamatan} onChange={handleFilterChange}><option value="">Semua Kecamatan</option><option value="Tallo">Tallo</option><option value="Bontoala">Bontoala</option></select></div></div>
                <div className="filter-group-top"><label>Kelurahan/Desa</label><div className="select-container-custom"><select name="kelurahan" value={filterTable.kelurahan} onChange={handleFilterChange}><option value="">Semua Kelurahan</option><option value="Wala-walaya">Wala-walaya</option><option value="Baraya">Baraya</option></select></div></div>
                <div className="filter-group-top"><label>NIK (0-16)</label><input type="text" name="nik" className="input-custom" placeholder="Cari NIK..." value={filterTable.nik} onChange={handleFilterChange} /></div>
                <div className="filter-group-top"><label>Nama</label><input type="text" name="nama" className="input-custom" placeholder="Cari Nama..." value={filterTable.nama} onChange={handleFilterChange} /></div>
              </div>
              <div className="action-row-right"><button className="btn-add-staff" onClick={() => setIsAddModalOpen(true)}><span className="plus-icon">+</span> Tambah Usulan</button></div>
              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead><tr><th>Nama Lengkap</th><th>Kecamatan</th><th>Kelurahan</th><th>Tanggal Pengusulan</th><th>Alamat</th><th style={{ textAlign: "center" }}>Status</th><th style={{ textAlign: "center" }}>Aksi</th></tr></thead>
                    <tbody>
                      {tableDataFiltered.map((item) => (
                        <tr key={item.id}>
                          <td><span style={{ fontWeight: '600', color: '#1e293b' }}>{item.nama}</span><br/><span style={{ fontSize: '11px', color: '#64748b' }}>NIK: {item.nik}</span></td>
                          <td>{item.kecamatan}</td><td>{item.kelurahan}</td><td>{formatDateIndo(item.tanggal)}</td><td>{item.alamat}</td>
                          <td style={{ textAlign: "center" }}>
                            {item.status === "Layak" && <span className="status-badge badge-active">Layak</span>}
                            {item.status === "Tidak Layak" && <span className="status-badge badge-inactive">Tidak Layak</span>}
                            {item.status === "Belum" && <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Menunggu</span>}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {/* === IKON MATA SVG PROFESIONAL (DIKEMBALIKAN) === */}
                            <button className="btn-icon-keterangan" title="Lihat Riwayat" onClick={() => handleOpenDetailRiwayat(item)}>
                              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
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

          {/* ================= 🌟 VIRTUAL PAGE: DETAIL RIWAYAT USULAN BANSOS (UTUH) 🌟 ================= */}
          {activeMenu === "usulan_baru" && activeTab === "detail_usulan" && selectedDetailData && (
            <div className="tab-content-wrapper outline-box" style={{ animation: 'fadeInModal 0.3s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '25px' }}>
                <h2 style={{ color: '#234a66', margin: 0, fontSize: '20px', fontWeight: '800' }}>Riwayat Bantuan Keluarga</h2>
                <button className="btn-search-outline" onClick={() => setActiveTab("pengusulan")} style={{ height: '36px' }}>&larr; Kembali ke Daftar</button>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '30px', display: 'flex', gap: '40px' }}>
                <div><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Nama Pengusul</span><strong style={{ fontSize: '15px', color: '#1e293b' }}>{selectedDetailData.nama}</strong></div>
                <div><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>NIK</span><strong style={{ fontSize: '15px', color: '#1e293b' }}>{selectedDetailData.nik}</strong></div>
                <div><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Domisili</span><strong style={{ fontSize: '15px', color: '#1e293b' }}>Kec. {selectedDetailData.kecamatan}, Kel. {selectedDetailData.kelurahan}</strong></div>
              </div>
              <h3 style={{ fontSize: '16px', color: '#234a66', marginBottom: '15px', marginTop: '0' }}>Daftar Bantuan Sosial Diterima</h3>
              <div className="table-wrapper"><div className="table-responsive"><table className="staff-table">
                <thead><tr><th>Nama Penerima Bantuan</th><th>Jenis Bantuan Sosial</th><th>Tanggal Penerimaan</th><th style={{ textAlign: "center" }}>Status Penyaluran</th></tr></thead>
                <tbody>
                  <tr><td style={{ fontWeight: '600' }}>{selectedDetailData.nama}</td><td>Bantuan Pangan Non Tunai (BPNT)</td><td>12 Januari 2026</td><td style={{ textAlign: "center" }}><span className="status-badge badge-active">Selesai</span></td></tr>
                  <tr><td style={{ fontWeight: '600' }}>{selectedDetailData.nama}</td><td>Program Keluarga Harapan (PKH)</td><td>25 Agustus 2025</td><td style={{ textAlign: "center" }}><span className="status-badge badge-active">Selesai</span></td></tr>
                  <tr style={{ backgroundColor: '#fffbeb' }}><td style={{ fontWeight: '600', color: '#b45309' }}>{selectedDetailData.nama} <span style={{fontSize:'10px', color:'#ef4444'}}>(Usulan Baru)</span></td><td style={{ color: '#b45309' }}>Bantuan Langsung Tunai (BLT)</td><td style={{ color: '#b45309' }}>{formatDateIndo(selectedDetailData.tanggal)}</td><td style={{ textAlign: "center" }}>{selectedDetailData.status === "Layak" && <span className="status-badge badge-active">Selesai</span>}{selectedDetailData.status === "Tidak Layak" && <span className="status-badge badge-inactive">Tidak Layak Menerima</span>}{selectedDetailData.status === "Belum" && <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Belum Selesai</span>}</td></tr>
                </tbody>
              </table></div></div>
            </div>
          )}

          {/* ================= 2. DTSEN (DASHBOARD & TABEL DATA LENGKAP) ================= */}
          {activeMenu === "lihat_dtsen" && activeTab === "dashboard_dtsen" && (
            <div className="tab-content-wrapper">
              <div className="dtsen-summary-top">
                <div className="dtsen-top-content">
                  <div><h2 className="dtsen-top-title">Total Keluarga Terdaftar di DTSEN</h2></div>
                  <div className="dtsen-top-number">{dtsenData.length} <span>Keluarga</span></div>
                </div>
              </div>
              <h3 className="section-title">Sebaran Desil Kesejahteraan</h3>
              <div className="decile-grid">
                <div className="decile-card d1"><div className="dec-head"><span className="dec-badge d1-bg">Desil 1</span></div><div className="dec-title">Sangat Rentan / Ekstrem</div><div className="dec-val">200</div></div>
                <div className="decile-card d2"><div className="dec-head"><span className="dec-badge d2-bg">Desil 2</span></div><div className="dec-title">Keluarga Rentan</div><div className="dec-val">350</div></div>
                <div className="decile-card d3"><div className="dec-head"><span className="dec-badge d3-bg">Desil 3</span></div><div className="dec-title">Hampir Rentan</div><div className="dec-val">400</div></div>
                <div className="decile-card d4"><div className="dec-head"><span className="dec-badge d4-bg">Desil 4</span></div><div className="dec-title">Rentan Sedang</div><div className="dec-val">250</div></div>
                <div className="decile-card d5"><div className="dec-head"><span className="dec-badge d5-bg">Desil 5</span></div><div className="dec-title">Menuju Aman</div><div className="dec-val">200</div></div>
                <div className="decile-card d6"><div className="dec-head"><span className="dec-badge d6-bg">Desil 6-10</span></div><div className="dec-title">Keluarga Mampu / Aman</div><div className="dec-val">100</div></div>
              </div>
            </div>
          )}

          {activeMenu === "lihat_dtsen" && activeTab === "data_dtsen" && (
            <div className="tab-content-wrapper outline-box">
              <div className="pengusulan-filter-grid">
                <div className="filter-group-top"><label>Kecamatan</label><div className="select-container-custom"><select><option>Semua Kecamatan</option><option>Tallo</option><option>Bontoala</option></select></div></div>
                <div className="filter-group-top"><label>Kelurahan/Desa</label><div className="select-container-custom"><select><option>Semua Kelurahan</option><option>Wala-walaya</option><option>Baraya</option></select></div></div>
                <div className="filter-group-top"><label>No. KK</label><input type="text" className="input-custom" placeholder="Ketik No. KK..." /></div>
                <div className="filter-group-top"><label>Nama Kepala Keluarga</label><input type="text" className="input-custom" placeholder="Ketik Nama..." /></div>
              </div>

              <div className="action-row-right">
                <button className="btn-search-outline" style={{ marginRight: '15px' }}>Cari Data</button>
                <button className="btn-add-staff" onClick={() => setIsAddDtsenModalOpen(true)}><span className="plus-icon">+</span> Tambah Data DTSEN</button>
              </div>

              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead><tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Kelurahan</th><th>Alamat Lengkap</th><th style={{ textAlign: "center" }}>Desil</th><th style={{ textAlign: "center" }}>Detail</th></tr></thead>
                    <tbody>
                      {dtsenData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.noKk}</td><td style={{ fontWeight: '600' }}>{item.namaKepala}</td><td>{item.kelurahan}</td><td>{item.alamat}</td>
                          <td style={{ textAlign: "center" }}>
                            {item.desil === 'Belum Dihitung' ? <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Belum Dihitung</span> : <span className="desil-badge-table">{item.desil}</span>}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button className="btn-icon-keterangan" title="Lihat Detail Keluarga" onClick={() => handleOpenDetailDtsen(item)}>
                              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
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

          {/* 🌟 VIRTUAL PAGE: DETAIL DTSEN & ANGGOTA KELUARGA 🌟 */}
          {activeMenu === "lihat_dtsen" && activeTab === "detail_dtsen" && selectedDtsenData && (
            <div className="tab-content-wrapper outline-box" style={{ animation: 'fadeInModal 0.3s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '25px' }}>
                <h2 style={{ color: '#234a66', margin: 0, fontSize: '20px', fontWeight: '800' }}>Detail Data Terpadu Keluarga</h2>
                <button className="btn-search-outline" onClick={() => setActiveTab("data_dtsen")} style={{ height: '36px' }}>&larr; Kembali ke Daftar DTSEN</button>
              </div>

              <div className="detail-summary-grid">
                <div className="summary-col">
                  <div className="summary-item"><span className="sum-label">Nama Kepala Keluarga</span><span className="sum-val">{selectedDtsenData.namaKepala}</span></div>
                  <div className="summary-item"><span className="sum-label">Nomor Kartu Keluarga (KK)</span><span className="sum-val">{selectedDtsenData.noKk}</span></div>
                </div>
                <div className="summary-col">
                  <div className="summary-item"><span className="sum-label">Alamat Domisili</span><span className="sum-val">{selectedDtsenData.alamat}</span></div>
                  <div className="summary-item"><span className="sum-label">Kecamatan / Kelurahan</span><span className="sum-val">{selectedDtsenData.kecamatan} / {selectedDtsenData.kelurahan}</span></div>
                </div>
                <div className="desil-col">
                  <div className="desil-box-red" style={{ backgroundColor: selectedDtsenData.desil === 'Belum Dihitung' ? '#f1f5f9' : '#fca5a5', color: selectedDtsenData.desil === 'Belum Dihitung' ? '#475569' : '#dc2626' }}>
                    <span className="desil-text">TINGKAT DESIL</span>
                    <span className="desil-number" style={{ fontSize: selectedDtsenData.desil === 'Belum Dihitung' ? '18px' : '32px' }}>{selectedDtsenData.desil}</span>
                  </div>
                </div>
              </div>

              {selectedDtsenData.desil === 'Belum Dihitung' && (
                <div className="info-alert-box" style={{ backgroundColor: '#fffbeb', borderColor: '#fde047', color: '#b45309', marginBottom: '30px' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <span>Keluarga ini merupakan data baru. Anda harus melengkapi 39 Variabel Aset terlebih dahulu untuk menghitung Tingkat Desil.</span>
                  <button onClick={handleArahkanKeDesil} style={{ marginLeft: 'auto', backgroundColor: '#b45309', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lengkapi Aset & Hitung Desil &rarr;</button>
                </div>
              )}

              <div className="detail-inner-tabs">
                <button className={`inner-tab-btn ${detailDtsenInnerTab === "anggota" ? "active" : ""}`} onClick={() => setDetailDtsenInnerTab("anggota")}>Data Anggota Keluarga</button>
                <button className={`inner-tab-btn ${detailDtsenInnerTab === "aset" ? "active" : ""}`} onClick={() => setDetailDtsenInnerTab("aset")}>Data Aset & Perumahan (39 Variabel)</button>
              </div>

{/* 🌟 TAB ANGGOTA KELUARGA YANG SUDAH DINAMIS 🌟 */}
              {detailDtsenInnerTab === "anggota" && (
                <div className="table-wrapper">
                  <table className="staff-table">
                    <thead><tr><th>NIK</th><th>Nama Anggota</th><th>Hub. Keluarga</th><th>Jenis Kelamin</th><th>Status Keadaan</th><th style={{ textAlign: "center" }}>Aksi Detail</th></tr></thead>
                    <tbody>
                      {selectedDtsenData.anggota.map((ang) => (
                        <tr key={ang.id}>
                          <td>{ang.nik}</td><td style={{ fontWeight: '600' }}>{ang.nama}</td><td>{ang.hub}</td><td>{ang.jk}</td>
                          <td>
                            {ang.status === "Meninggal" ? <span className="status-badge badge-inactive">Meninggal</span> : <span className="status-badge badge-active">{ang.status}</span>}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {/* TOMBOL AKSI DETAIL ANGGOTA */}
                            <button className="btn-icon-keterangan" title="Lihat/Edit Detail Anggota" onClick={() => handleOpenDetailAnggota(ang)}>
                              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: '15px', textAlign: 'right' }}>
                    {/* TOMBOL TAMBAH ANGGOTA KELUARGA */}
                    <button className="btn-add-staff" style={{ display: 'inline-flex' }} onClick={() => setIsAddAnggotaModalOpen(true)}>+ Tambah Anggota</button>
                  </div>
                </div>
              )}

              {detailDtsenInnerTab === "aset" && (
                <div className="aset-container">
                  <div className="aset-grid-3">
                    
                    {/* KOLOM 1: Kepala Keluarga & Perumahan */}
                    <div className="aset-column">
                      <div className="aset-header-title">Kondisi Demografi & Perumahan</div>
                      <div className="aset-item"><span className="aset-label">V01 | Jenis Kelamin KK</span><span className="aset-value">{selectedDtsenData.aset?.v01 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V02 | Usia KK</span><span className="aset-value">{selectedDtsenData.aset?.v02 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V03 | Pendidikan Tertinggi KK</span><span className="aset-value">{selectedDtsenData.aset?.v03 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V04 | Status Pekerjaan KK</span><span className="aset-value">{selectedDtsenData.aset?.v04 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V05 | Status Perkawinan KK</span><span className="aset-value">{selectedDtsenData.aset?.v05 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V06 | Jumlah Anggota Rumah Tangga</span><span className="aset-value">{selectedDtsenData.aset?.v06 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V07 | Status Kepemilikan Rumah</span><span className="aset-value">{selectedDtsenData.aset?.v07 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V08 | Luas Lantai per Kapita</span><span className="aset-value">{selectedDtsenData.aset?.v08 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V09 | Jenis Lantai</span><span className="aset-value">{selectedDtsenData.aset?.v09 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V10 | Jenis Dinding</span><span className="aset-value">{selectedDtsenData.aset?.v10 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V11 | Jenis Atap</span><span className="aset-value">{selectedDtsenData.aset?.v11 || "-"}</span></div>
                    </div>

                    {/* KOLOM 2: Sanitasi, Energi & Kendaraan */}
                    <div className="aset-column">
                      <div className="aset-header-title">Sanitasi, Energi & Transportasi</div>
                      <div className="aset-item"><span className="aset-label">V12 | Sumber Air Minum</span><span className="aset-value">{selectedDtsenData.aset?.v12 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V13 | Fasilitas BAB</span><span className="aset-value">{selectedDtsenData.aset?.v13 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V14 | Jenis Kloset</span><span className="aset-value">{selectedDtsenData.aset?.v14 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V15 | Pembuangan Tinja</span><span className="aset-value">{selectedDtsenData.aset?.v15 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V16 | Sumber Penerangan</span><span className="aset-value">{selectedDtsenData.aset?.v16 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V17 | Daya Listrik</span><span className="aset-value">{selectedDtsenData.aset?.v17 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V18 | Bahan Bakar Memasak</span><span className="aset-value">{selectedDtsenData.aset?.v18 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V19 | Tabung Gas ≥5.5 Kg</span><span className="aset-value">{selectedDtsenData.aset?.v19 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V20 | Kepemilikan Lahan/Tanah</span><span className="aset-value">{selectedDtsenData.aset?.v20 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V21 | Kepemilikan Rumah Lain</span><span className="aset-value">{selectedDtsenData.aset?.v21 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V22 | Usaha/Kios/Toko</span><span className="aset-value">{selectedDtsenData.aset?.v22 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V23 | Jumlah Sepeda</span><span className="aset-value">{selectedDtsenData.aset?.v23 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V24 | Jumlah Sepeda Motor</span><span className="aset-value">{selectedDtsenData.aset?.v24 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V25 | Mobil/Truk/Minibus</span><span className="aset-value">{selectedDtsenData.aset?.v25 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V26 | Kepemilikan Perahu</span><span className="aset-value">{selectedDtsenData.aset?.v26 || "-"}</span></div>
                    </div>

                    {/* KOLOM 3: Elektronik, Ternak & Finansial */}
                    <div className="aset-column">
                      <div className="aset-header-title">Elektronik, Ternak & Finansial</div>
                      <div className="aset-item"><span className="aset-label">V27 | Jumlah Televisi</span><span className="aset-value">{selectedDtsenData.aset?.v27 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V28 | Jumlah Kulkas/Freezer</span><span className="aset-value">{selectedDtsenData.aset?.v28 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V29 | Jumlah Smartphone</span><span className="aset-value">{selectedDtsenData.aset?.v29 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V30 | Komputer/Laptop</span><span className="aset-value">{selectedDtsenData.aset?.v30 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V31 | Jumlah AC</span><span className="aset-value">{selectedDtsenData.aset?.v31 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V32 | Jumlah Pemanas Air</span><span className="aset-value">{selectedDtsenData.aset?.v32 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V33 | Mesin Cuci</span><span className="aset-value">{selectedDtsenData.aset?.v33 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V34 | Telepon Rumah</span><span className="aset-value">{selectedDtsenData.aset?.v34 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V35 | Ternak Besar (Sapi/Kerbau)</span><span className="aset-value">{selectedDtsenData.aset?.v35 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V36 | Ternak Kecil (Kambing/Babi)</span><span className="aset-value">{selectedDtsenData.aset?.v36 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V37 | Unggas (Ayam/Bebek)</span><span className="aset-value">{selectedDtsenData.aset?.v37 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V38 | Emas/Perhiasan</span><span className="aset-value">{selectedDtsenData.aset?.v38 || "-"}</span></div>
                      <div className="aset-item"><span className="aset-label">V39 | Tabungan</span><span className="aset-value">{selectedDtsenData.aset?.v39 || "-"}</span></div>
                    </div>

                  </div>
                  <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button className="btn-search-outline" style={{ display: 'inline-flex', margin: '0 auto', padding: '10px 25px', backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#d97706' }} onClick={handleOpenEditAset}>
                      📝 Edit Data 39 Variabel Aset
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 3. PPKS (DASHBOARD) ================= */}
          {activeMenu === "ppks" && activeTab === "dashboard_ppks" && (
            <div className="tab-content-wrapper outline-box">
              <div className="filter-row-right">
                <div className="pill-select-wrapper">
                  <select value={filterPeriodePPKS} onChange={(e) => setFilterPeriodePPKS(e.target.value)}>
                    <option value="q1">Januari - Maret</option>
                    <option value="q2">April - Juni</option>
                    <option value="q3">Juli - September</option>
                    <option value="q4">Oktober - Desember</option>
                  </select>
                </div>
              </div>
              <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="stat-card-outline">
                  <h4>Total Kasus Aktif Ditangani</h4>
                  <div className="stat-number text-blue">{ppksAktif} <span>Kasus</span></div>
                </div>
                <div className="stat-card-outline">
                  <h4>Laporan Menunggu Validasi</h4>
                  <div className="stat-number text-dark">{ppksMenunggu} <span>Laporan</span></div>
                </div>
              </div>
              <h3 className="section-title">Distribusi Kategori PPKS (Top 5)</h3>
              <div className="outline-box" style={{ padding: '30px' }}>
                <div className="ppks-horizontal-chart">
                  {top5PPKS.length > 0 ? top5PPKS.map((item, idx) => (
                    <div className="ppks-bar-row" key={idx}>
                      <span className="ppks-label">{item.nama}</span>
                      <div className="ppks-bar-track">
                        {/* Panjang Bar dihitung dinamis berdasarkan persentase */}
                        <div className="ppks-bar-fill" style={{ width: `${(item.jumlah / maxPPKS) * 100}%` }}></div>
                      </div>
                      <span className="ppks-value">{item.jumlah}</span>
                    </div>
                  )) : (
                    <p style={{ textAlign: 'center', color: '#64748b' }}>Tidak ada data pada periode ini.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeMenu === "ppks" && activeTab === "data_ppks" && (
            <div className="tab-content-wrapper outline-box">
              <div className="pengusulan-filter-grid">
                <div className="filter-group-top">
                  <label>Kategori PPKS</label>
                  <div className="select-container-custom">
                    <select name="kategori" value={filterTabelPPKS.kategori} onChange={handleFilterPPKSChange}>
                      <option value="">Semua Kategori</option>
                      <option>Anak Balita Terlantar</option>
                      <option>Anak Terlantar</option>
                      <option>Anak yang Berhadapan dengan Hukum</option>
                      <option>Anak Jalanan</option>
                      <option>Anak dengan Disabilitas</option>
                      <option>Anak yang Menjadi Korban Tindak Kekerasan</option>
                      <option>Anak yang Memerlukan Perlindungan Khusus</option>
                      <option>Lanjut Usia Terlantar</option>
                      <option>Penyandang Disabilitas</option>
                      <option>Tunasusila</option>
                      <option>Gelandangan</option>
                      <option>Pengemis</option>
                      <option>Pemulung</option>
                      <option>Kelompok Minoritas</option>
                      <option>Bekas Warga Binaan Lembaga Permasyarakatan</option>
                      <option>Orang dengan HIV/AIDS</option>
                      <option>Korban Penyalahgunaan NAPZA</option>
                      <option>Korban Trafficking</option>
                      <option>Korban Tindak Kekerasan</option>
                      <option>Pekerja Migran Bermasalah Sosial</option>
                      <option>Korban Bencana Alam</option>
                      <option>Korban Bencana Sosial</	option>
                      <	option>Perempuan Rawan Sosial Ekonomi</	option>
                      <	option>Fakir Miskin</	option>
                      <	option>Keluarga Bermasalah Sosial Psikologi</	option>
                      <	option>Komunitas Adat Terpencil</	option>
                    </select>
                  </div>
                </div>
                <div className="filter-group-top">
                  <label>Kecamatan</label>
                  <div className="select-container-custom">
                    <select name="kecamatan" value={filterTabelPPKS.kecamatan} onChange={handleFilterPPKSChange}>
                      <option value="">Semua Kecamatan</option>
                      <option value="Tallo">Tallo</option>
                      <option value="Bontoala">Bontoala</option>
                    </select>
                  </div>
                </div>
                <div className="filter-group-top">
                  <label>Nama/Identitas</label>
                  <input type="text" name="nama" value={filterTabelPPKS.nama} onChange={handleFilterPPKSChange} className="input-custom" placeholder="Cari Nama/NIK..." />
                </div>
                <div className="filter-group-top align-bottom">
                  <button className="btn-search-outline">Cari Data</button>
                </div>
              </div>
              
              <div className="action-row-right">
                <button className="btn-add-staff" onClick={() => setIsAddPPKSModalOpen(true)}>
                  <span className="plus-icon">+</span> Tambah Laporan PPKS
                </button>
              </div>
              
              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead>
                      <tr><th>Nama / Identitas</th><th>Kategori PPKS</th><th>Lokasi Penemuan</th><th>Tgl Laporan</th><th style={{ textAlign: "center" }}>Status</th><th style={{ textAlign: "center" }}>Detail</th></tr>
                    </thead>
                    <tbody>
                      {tabelPPKSFiltered.length > 0 ? tabelPPKSFiltered.map((item) => (
                        <tr key={item.id}>
                          <td><span style={{ fontWeight: '600', color: '#1e293b' }}>{item.nama}</span><br/><span style={{ fontSize: '11px', color: '#64748b' }}>NIK: {item.nik}</span></td>
                          <td>{item.kategori}</td>
                          <td>{item.lokasi}</td>
                          <td>{formatDateIndo(item.tanggal)}</td>
                          <td style={{ textAlign: "center" }}>
                            <span className={`badge-ppks ${item.status === 'Kasus Aktif' ? 'badge-aktif' : 'badge-menunggu'}`}>{item.status}</span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button className="btn-icon-keterangan" title="Lihat Detail & Penanganan" onClick={() => handleOpenDetailPPKS(item)}>
                              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Tidak ada data PPKS yang cocok.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. PENENTUAN DESIL ================= */}
          {activeMenu === "penentuan_desil" && activeTab === "menunggu_penentuan" && (
            <div className="tab-content-wrapper outline-box">
              <div className="info-alert-box" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Daftar keluarga dengan data aset baru yang membutuhkan kalkulasi PMT untuk menentukan Tingkat Desil.
              </div>
              <div className="pengusulan-filter-grid">
                <div className="filter-group-top">
                  <label>Kecamatan</label>
                  <div className="select-container-custom">
                    <select name="kecamatan" value={filterDesil.kecamatan} onChange={handleFilterDesilChange}>
                      <option value="">Semua Kecamatan</option>
                      <option value="Tallo">Tallo</option>
                      <option value="Bontoala">Bontoala</option>
                    </select>
                  </div>
                </div>
                <div className="filter-group-top">
                  <label>No. KK</label>
                  <input type="text" name="noKk" value={filterDesil.noKk} onChange={handleFilterDesilChange} className="input-custom" placeholder="Ketik No. KK..." />
                </div>
                <div className="filter-group-top align-bottom">
                  <button className="btn-search-outline">Cari Data</button>
                </div>
              </div>
              <div className="table-wrapper">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead><tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Kelurahan</th><th>Terakhir Update</th><th style={{ textAlign: "center" }}>Aksi Kalkulasi</th></tr></thead>
                    <tbody>
                      {/* 👇 PENTING: Gunakan tabelMenungguFiltered, bukan dummyMenungguDesil 👇 */}
                      {tabelMenungguFiltered.length > 0 ? tabelMenungguFiltered.map((item) => (
                        <tr key={item.id}>
                          <td>{item.noKk}</td><td style={{ fontWeight: '600' }}>{item.nama}</td><td>{item.kelurahan}</td><td>{item.tglUpdate}</td>
                          <td style={{ textAlign: "center" }}><button className="btn-hitung-desil" onClick={() => { setSelectedKalkulasi(item); setIsKalkulasiModalOpen(true); setIsCalculated(false); }}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg> Hitung Desil</button></td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada data yang cocok dengan pencarian.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "penentuan_desil" && activeTab === "riwayat_penentuan" && (
             <div className="tab-content-wrapper outline-box">
                <div className="pengusulan-filter-grid">
                  <div className="filter-group-top">
                    <label>Kecamatan</label>
                    <div className="select-container-custom">
                      <select name="kecamatan" value={filterDesil.kecamatan} onChange={handleFilterDesilChange}>
                        <option value="">Semua Kecamatan</option>
                        <option value="Tallo">Tallo</option>
                        <option value="Bontoala">Bontoala</option>
                      </select>
                    </div>
                  </div>
                  <div className="filter-group-top">
                    <label>No. KK</label>
                    <input type="text" name="noKk" value={filterDesil.noKk} onChange={handleFilterDesilChange} className="input-custom" placeholder="Ketik No. KK..." />
                  </div>
                  <div className="filter-group-top align-bottom">
                    <button className="btn-search-outline">Cari Data</button>
                  </div>
                </div>
               <div className="table-wrapper">
                 <div className="table-responsive">
                   <table className="staff-table">
                     <thead><tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Kelurahan</th><th>Tgl Hitung</th><th>Skor PMT</th><th style={{ textAlign: "center" }}>Hasil Desil</th></tr></thead>
                     <tbody>
                       {/* 👇 PENTING: Gunakan tabelRiwayatFiltered 👇 */}
                       {tabelRiwayatFiltered.length > 0 ? tabelRiwayatFiltered.map((item, idx) => (
                         <tr key={idx}><td>{item.noKk}</td><td style={{ fontWeight: '600' }}>{item.nama}</td><td>{item.kelurahan}</td><td>{item.tglHitung}</td><td>{item.skor}</td><td style={{ textAlign: "center" }}><span className="desil-badge-table">{item.desil}</span></td></tr>
                       )) : (
                         <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada riwayat yang cocok.</td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
          )}

        </div>
      </main>

      {/* ================= 🌟 MODAL TAMBAH ANGGOTA KELUARGA 🌟 ================= */}
      {isAddAnggotaModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddAnggotaModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Tambah Anggota Keluarga</h2></div></div>
            <div className="modal-body">
              <form onSubmit={handleAddAnggotaSubmit}>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>NIK*</label><input type="text" name="nik" value={formAnggota.nik} onChange={(e) => setFormAnggota({...formAnggota, nik: e.target.value})} required maxLength="16" placeholder="Ketik NIK..." /></div>
                  <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" name="nama" value={formAnggota.nama} onChange={(e) => setFormAnggota({...formAnggota, nama: e.target.value})} required placeholder="Ketik Nama..." /></div>
                  <div className="form-group-modal">
                    <label>Hubungan Keluarga*</label>
                    <div className="select-container-custom"><select name="hub" value={formAnggota.hub} onChange={(e) => setFormAnggota({...formAnggota, hub: e.target.value})} required><option value="" hidden>Pilih Hubungan</option><option>Kepala Keluarga</option><option>Istri</option><option>Anak</option><option>Lainnya</option></select></div>
                  </div>
                  <div className="form-group-modal">
                    <label>Jenis Kelamin*</label>
                    <div className="select-container-custom"><select name="jk" value={formAnggota.jk} onChange={(e) => setFormAnggota({...formAnggota, jk: e.target.value})} required><option value="" hidden>Pilih Kelamin</option><option>Laki-laki</option><option>Perempuan</option></select></div>
                  </div>
                  <div className="form-group-modal"><label>Tanggal Lahir*</label><input type="date" name="tglLahir" value={formAnggota.tglLahir} onChange={(e) => setFormAnggota({...formAnggota, tglLahir: e.target.value})} required /></div>
                  <div className="form-group-modal">
                    <label>Status Keadaan*</label>
                    <div className="select-container-custom"><select name="status" value={formAnggota.status} onChange={(e) => setFormAnggota({...formAnggota, status: e.target.value})} required><option>Hidup</option><option>Meninggal</option></select></div>
                  </div>
                </div>
                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsAddAnggotaModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Anggota</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

{/* modal detail / edit anggota keluarga */}
      {isDetailAnggotaModalOpen && selectedAnggotaData && (
        <div className="modal-overlay" onClick={() => setIsDetailAnggotaModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Detail Kondisi Anggota</h2></div></div>
            <div className="modal-body">
              <form onSubmit={handleEditAnggotaSubmit}>
                
                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>NIK</label><input type="text" name="nik" value={selectedAnggotaData.nik} onChange={handleEditAnggotaChange} /></div>
                    <div className="form-group-modal"><label>Nama Lengkap</label><input type="text" name="nama" value={selectedAnggotaData.nama} onChange={handleEditAnggotaChange} /></div>
                    <div className="form-group-modal">
                      <label>Hubungan Keluarga</label>
                      <div className="select-container-custom"><select name="hub" value={selectedAnggotaData.hub} onChange={handleEditAnggotaChange}><option>Kepala Keluarga</option><option>Istri</option><option>Anak</option><option>Lainnya</option></select></div>
                    </div>
                    <div className="form-group-modal">
                      <label>Status Keadaan</label>
                      <div className="select-container-custom"><select name="status" value={selectedAnggotaData.status} onChange={handleEditAnggotaChange}><option>Hidup</option><option>Meninggal</option></select></div>
                    </div>
                  </div>
                </div>

                <div className="modal-section" style={{ marginTop: '10px' }}>
                  <h3 className="section-subtitle" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>Kondisi Khusus (Penting Untuk Bansos)</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal">
                      <label>Status Kehamilan (Bagi Perempuan)</label>
                      <div className="select-container-custom"><select defaultValue="Tidak"><option>Tidak Sedang Hamil</option><option>Sedang Hamil</option></select></div>
                    </div>
                    <div className="form-group-modal">
                      <label>Kategori Disabilitas</label>
                      <div className="select-container-custom"><select defaultValue="Tidak Ada"><option>Tidak Ada Disabilitas</option><option>Disabilitas Fisik</option><option>Disabilitas Sensorik (Netra/Rungu)</option><option>Disabilitas Mental (ODGJ)</option></select></div>
                    </div>
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}>
                      <label>Penyakit Kronis / Menahun</label>
                      <input type="text" placeholder="Kosongkan jika tidak ada, misal: TBC, Kanker, Paru-paru..." />
                    </div>
                  </div>
                </div>

                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsDetailAnggotaModalOpen(false)}>Tutup</button><button type="submit" className="btn-modal-submit">Simpan Perubahan</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= 🌟 MODAL EDIT 39 VARIABEL ASET LENGKAP 🌟 ================= */}
      {isEditAsetModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditAsetModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title"><h2>Pengisian Kuesioner 39 Variabel (PMT)</h2></div>
            </div>
            <div className="modal-body" style={{ padding: '20px 30px' }}>
              <div className="info-alert-box" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a', fontSize: '13px', marginBottom: '20px' }}>
                Isi data dengan keadaan sebenar-benarnya berdasarkan observasi lapangan. Variabel ini akan dikalkulasi sistem untuk menentukan Tingkat Desil.
              </div>
              
              <form onSubmit={handleEditAsetSubmit}>
                
                {/* --- KELOMPOK 1: KONDISI KEPALA KELUARGA & RUMAH TANGGA --- */}
                <div className="modal-section" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h3 className="section-subtitle">1. Kondisi Demografi & Keluarga</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>V01 | Jenis Kelamin KK</label><div className="select-container-custom"><select name="v01" value={formAset.v01 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Laki-laki</option><option>Perempuan</option></select></div></div>
                    <div className="form-group-modal"><label>V02 | Usia KK</label><div className="select-container-custom"><select name="v02" value={formAset.v02 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>&lt; 25 tahun</option><option>25 - 40 tahun</option><option>41 - 55 tahun</option><option>56 - 65 tahun</option><option>&gt; 65 tahun</option></select></div></div>
                    <div className="form-group-modal"><label>V03 | Pendidikan Tertinggi KK</label><div className="select-container-custom"><select name="v03" value={formAset.v03 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak pernah sekolah</option><option>Tidak tamat SD</option><option>Tamat SD/sederajat</option><option>Tamat SMP/sederajat</option><option>Tamat SMA/sederajat</option><option>Tamat D1/D2/D3</option><option>Tamat S1 ke atas</option></select></div></div>
                    <div className="form-group-modal"><label>V04 | Status Pekerjaan KK</label><div className="select-container-custom"><select name="v04" value={formAset.v04 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak bekerja</option><option>Serabutan/tidak tetap</option><option>Buruh/Karyawan harian</option><option>Usaha sendiri</option><option>Karyawan tetap formal</option></select></div></div>
                    <div className="form-group-modal"><label>V05 | Status Perkawinan KK</label><div className="select-container-custom"><select name="v05" value={formAset.v05 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Cerai mati</option><option>Cerai hidup</option><option>Belum kawin</option><option>Kawin</option></select></div></div>
                    <div className="form-group-modal"><label>V06 | Jumlah Anggota Rumah Tangga</label><div className="select-container-custom"><select name="v06" value={formAset.v06 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>1 - 2 jiwa</option><option>3 jiwa</option><option>4 - 5 jiwa</option><option>6 - 7 jiwa</option><option>≥ 8 jiwa</option></select></div></div>
                  </div>
                </div>

                {/* --- KELOMPOK 2: KONDISI PERUMAHAN & SANITASI --- */}
                <div className="modal-section" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                  <h3 className="section-subtitle">2. Kondisi Perumahan & Sanitasi</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>V07 | Status Kepemilikan Rumah</label><div className="select-container-custom"><select name="v07" value={formAset.v07 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Menumpang</option><option>Sewa/kontrak</option><option>Milik sendiri</option></select></div></div>
                    <div className="form-group-modal"><label>V08 | Luas Lantai per Kapita</label><div className="select-container-custom"><select name="v08" value={formAset.v08 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>&lt; 4 m²/jiwa</option><option>4 - 7 m²/jiwa</option><option>8 - 15 m²/jiwa</option><option>&gt; 15 m²/jiwa</option></select></div></div>
                    <div className="form-group-modal"><label>V09 | Jenis Lantai</label><div className="select-container-custom"><select name="v09" value={formAset.v09 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tanah</option><option>Bambu/papan kayu</option><option>Semen/bata merah</option><option>Keramik</option></select></div></div>
                    <div className="form-group-modal"><label>V10 | Jenis Dinding</label><div className="select-container-custom"><select name="v10" value={formAset.v10 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Bambu/anyaman</option><option>Kayu/papan</option><option>Tembok tidak diplester</option><option>Tembok diplester</option></select></div></div>
                    <div className="form-group-modal"><label>V11 | Jenis Atap</label><div className="select-container-custom"><select name="v11" value={formAset.v11 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Rumbia/ijuk/daun</option><option>Seng/asbes</option><option>Genteng tanah liat</option><option>Genteng beton/metal</option></select></div></div>
                    <div className="form-group-modal"><label>V12 | Sumber Air Minum</label><div className="select-container-custom"><select name="v12" value={formAset.v12 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Sungai/air hujan</option><option>Sumur tak terlindung</option><option>Sumur terlindung</option><option>Mata air terlindung</option><option>Air isi ulang</option><option>PDAM/ledeng</option><option>Air kemasan bermerk</option></select></div></div>
                    <div className="form-group-modal"><label>V13 | Fasilitas BAB</label><div className="select-container-custom"><select name="v13" value={formAset.v13 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada/sembarang</option><option>Bersama/MCK umum</option><option>Milik sendiri</option></select></div></div>
                    <div className="form-group-modal"><label>V14 | Jenis Kloset</label><div className="select-container-custom"><select name="v14" value={formAset.v14 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada/cemplung</option><option>Plengsengan</option><option>Leher angsa</option></select></div></div>
                    <div className="form-group-modal"><label>V15 | Pembuangan Tinja</label><div className="select-container-custom"><select name="v15" value={formAset.v15 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Sungai/kebun/galian</option><option>Tangki septik</option><option>IPAL komunal</option></select></div></div>
                    <div className="form-group-modal"><label>V16 | Sumber Penerangan</label><div className="select-container-custom"><select name="v16" value={formAset.v16 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Bukan listrik</option><option>Listrik Non-PLN</option><option>Listrik PLN</option></select></div></div>
                    <div className="form-group-modal"><label>V17 | Daya Listrik</label><div className="select-container-custom"><select name="v17" value={formAset.v17 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>450 Watt</option><option>900 Watt</option><option>1.300 Watt</option><option>2.200 Watt ke atas</option></select></div></div>
                    <div className="form-group-modal"><label>V18 | Bahan Bakar Memasak</label><div className="select-container-custom"><select name="v18" value={formAset.v18 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Kayu bakar/arang</option><option>Minyak tanah</option><option>Gas elpiji 3 Kg</option><option>Gas elpiji ≥ 5.5 Kg</option><option>Listrik</option></select></div></div>
                    <div className="form-group-modal"><label>V19 | Jumlah Tabung Gas ≥5.5 Kg</label><div className="select-container-custom"><select name="v19" value={formAset.v19 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>1 tabung atau lebih</option></select></div></div>
<<<<<<< Updated upstream
                    {/* <div className="form-group-modal"><label>21. Tabung Gas 5.5kg / Kulkas</label><div className="select-container-custom"><select><option>Ada</option><option>Tidak Ada</option></select></div></div>
                    <div className="form-group-modal"><label>22. Sepeda Motor</label><div className="select-container-custom"><select><option>Tidak Ada</option><option>1 Unit</option><option> 1 Unit</option></select></div></div>
                    <div className="form-group-modal"><label>23. Emas / Perhiasan ( 10 Gram)</label><div className="select-container-custom"><select><option>Ada</option><option>Tidak Ada</option></select></div></div>
                    <div className="form-group-modal"><label>24. Lahan Pertanian (Ha)</label><div className="select-container-custom"><select><option>Tidak Ada</option><option>&lt; 0.5 Ha</option><option> 0.5 Ha</option></select></div></div> */}
=======
                    <div className="form-group-modal"><label>21. Tabung Gas 5.5kg / Kulkas</label><div className="select-container-custom"><select><option>Ada</option><option>Tidak Ada</option></select></div></div>
                    <div className="form-group-modal"><label>22. Sepeda Motor</label><div className="select-container-custom"><select><option>Tidak Ada</option><option>1 Unit</option><option> 1 Unit</option></select></div></div>
                    <div className="form-group-modal"><label>23. Emas / Perhiasan ( 10 Gram)</label><div className="select-container-custom"><select><option>Ada</option><option>Tidak Ada</option></select></div></div>
                    <div className="form-group-modal"><label>24. Lahan Pertanian (Ha)</label><div className="select-container-custom"><select><option>Tidak Ada</option><option>&lt; 0.5 Ha</option><option> 0.5 Ha</option></select></div></div>
>>>>>>> Stashed changes
                  </div>
                </div>

                {/* --- KELOMPOK 3: ASET TAK BERGERAK & KENDARAAN --- */}
                <div className="modal-section" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                  <h3 className="section-subtitle">3. Aset Tidak Bergerak & Kendaraan</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>V20 | Kepemilikan Lahan/Tanah</label><div className="select-container-custom"><select name="v20" value={formAset.v20 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada, &lt; 500 m²</option><option>Ada, ≥ 500 m²</option></select></div></div>
                    <div className="form-group-modal"><label>V21 | Rumah/Bangunan Lain</label><div className="select-container-custom"><select name="v21" value={formAset.v21 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V22 | Usaha/Kios/Toko</label><div className="select-container-custom"><select name="v22" value={formAset.v22 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V23 | Jumlah Sepeda</label><div className="select-container-custom"><select name="v23" value={formAset.v23 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V24 | Jumlah Sepeda Motor</label><div className="select-container-custom"><select name="v24" value={formAset.v24 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V25 | Mobil/Truk/Minibus</label><div className="select-container-custom"><select name="v25" value={formAset.v25 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V26 | Kepemilikan Perahu</label><div className="select-container-custom"><select name="v26" value={formAset.v26 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                  </div>
                </div>

                {/* --- KELOMPOK 4: ASET ELEKTRONIK, TERNAK & FINANSIAL --- */}
                <div className="modal-section" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                  <h3 className="section-subtitle">4. Aset Elektronik, Ternak, & Finansial</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>V27 | Jumlah Televisi</label><div className="select-container-custom"><select name="v27" value={formAset.v27 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V28 | Kulkas/Freezer</label><div className="select-container-custom"><select name="v28" value={formAset.v28 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V29 | Smartphone</label><div className="select-container-custom"><select name="v29" value={formAset.v29 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V30 | Komputer/Laptop</label><div className="select-container-custom"><select name="v30" value={formAset.v30 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V31 | Jumlah AC</label><div className="select-container-custom"><select name="v31" value={formAset.v31 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V32 | Pemanas Air</label><div className="select-container-custom"><select name="v32" value={formAset.v32 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V33 | Mesin Cuci</label><div className="select-container-custom"><select name="v33" value={formAset.v33 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V34 | Telepon Rumah (kabel)</label><div className="select-container-custom"><select name="v34" value={formAset.v34 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V35 | Ternak Besar (Sapi/Kerbau/Kuda)</label><div className="select-container-custom"><select name="v35" value={formAset.v35 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>1 - 2 ekor</option><option>≥ 3 ekor</option></select></div></div>
                    <div className="form-group-modal"><label>V36 | Ternak Kecil (Kambing/Babi)</label><div className="select-container-custom"><select name="v36" value={formAset.v36 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>1 - 5 ekor</option><option>≥ 6 ekor</option></select></div></div>
                    <div className="form-group-modal"><label>V37 | Unggas (Ayam/Bebek)</label><div className="select-container-custom"><select name="v37" value={formAset.v37 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>1 - 10 ekor</option><option>≥ 11 ekor</option></select></div></div>
                    <div className="form-group-modal"><label>V38 | Emas/Perhiasan</label><div className="select-container-custom"><select name="v38" value={formAset.v38 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada, &lt; 10 gram</option><option>Ada, ≥ 10 gram</option></select></div></div>
                    <div className="form-group-modal"><label>V39 | Tabungan</label><div className="select-container-custom"><select name="v39" value={formAset.v39 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada, &lt; Rp 500.000</option><option>Ada, Rp 500rb - 5jt</option><option>Ada, &gt; Rp 5 juta</option></select></div></div>
                  </div>
                </div>

                <div className="modal-actions" style={{ marginTop: '30px' }}>
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsEditAsetModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit" style={{ width: 'auto' }}>Simpan & Lengkapi 39 Variabel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH DATA DTSEN ================= */}
      {isAddDtsenModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddDtsenModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><span style={{ fontSize: '20px', fontWeight: 'bold' }}>+</span><h2>Registrasi Keluarga Baru di DTSEN</h2></div></div>
            <div className="modal-body">
              <div className="info-alert-box" style={{ backgroundColor: '#fffbeb', borderColor: '#fde047', color: '#b45309', marginBottom: '20px', fontSize: '13px' }}>
                Registrasi awal hanya memerlukan identitas dasar Kepala Keluarga. 39 Variabel Aset dapat dilengkapi setelah data ini tersimpan.
              </div>
              <form onSubmit={handleAddDtsen}>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>No. Kartu Keluarga (KK)*</label><input type="text" name="noKk" value={formDtsen.noKk} onChange={(e) => setFormDtsen({...formDtsen, noKk: e.target.value})} required maxLength="16"/></div>
                  <div className="form-group-modal"><label>Nama Kepala Keluarga*</label><input type="text" name="namaKepala" value={formDtsen.namaKepala} onChange={(e) => setFormDtsen({...formDtsen, namaKepala: e.target.value})} required /></div>
                  <div className="form-group-modal"><label>Kecamatan*</label><div className="select-container-custom"><select required value={formDtsen.kecamatan} onChange={(e) => setFormDtsen({...formDtsen, kecamatan: e.target.value})}><option value="" disabled hidden>Pilih Kecamatan</option><option value="Tallo">Tallo</option><option value="Bontoala">Bontoala</option></select></div></div>
                  <div className="form-group-modal"><label>Kelurahan*</label><div className="select-container-custom"><select required value={formDtsen.kelurahan} onChange={(e) => setFormDtsen({...formDtsen, kelurahan: e.target.value})}><option value="" disabled hidden>Pilih Kelurahan</option><option value="Wala-walaya">Wala-walaya</option><option value="Baraya">Baraya</option></select></div></div>
                  <div className="form-group-modal" style={{ gridColumn: "1 / -1" }}><label>Alamat Lengkap / RT RW*</label><input type="text" value={formDtsen.alamat} onChange={(e) => setFormDtsen({...formDtsen, alamat: e.target.value})} required /></div>
                </div>
                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsAddDtsenModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Registrasi Awal</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH USULAN BANSOS ================= */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Tambah Usulan Baru</h2></div></div>
            <div className="modal-body">
              <form onSubmit={handleAddSubmit}>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>NIK*</label><input type="text" name="nik" value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} required maxLength="16"/></div>
                  <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" name="nama" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required /></div>
                </div>
                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsAddModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Data</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= 🌟 MODAL TAMBAH Laporan PPKS LENGKAP 🌟 ================= */}
      {isAddPPKSModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddPPKSModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div className="modal-header-title"><h2>Form Laporan PPKS Baru</h2></div>
            </div>
            
            <div className="modal-body">
              <div className="info-alert-box" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a', marginBottom: '20px', fontSize: '13px' }}>
                Jika PPKS tidak membawa identitas, kosongkan bagian NIK dan Nama. Pastikan Lokasi Penemuan diisi dengan sangat spesifik.
              </div>

              <form onSubmit={handleAddPPKSSubmit}>
                <div className="form-grid-2">
                  
                  <div className="form-group-modal">
                    <label>Kategori PPKS*</label>
                    <div className="select-container-custom">
                      <select name="kategori" value={formPPKS.kategori} onChange={(e) => setFormPPKS({...formPPKS, kategori: e.target.value})} required>
                        <option value="" hidden>Pilih Kategori</option>
                        <option value="Anak Jalanan">Anak Jalanan</option>
                        <option value="Lanjut Usia Terlantar">Lanjut Usia Terlantar</option>
                        <option value="Gelandangan & Pengemis">Gelandangan & Pengemis</option>
                        <option value="Penyandang Disabilitas">Penyandang Disabilitas</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group-modal">
                    <label>Tanggal Penemuan*</label>
                    <input type="date" name="tanggal" value={formPPKS.tanggal} onChange={(e) => setFormPPKS({...formPPKS, tanggal: e.target.value})} required />
                  </div>

                  <div className="form-group-modal">
                    <label>NIK (Bila Diketahui)</label>
                    <input type="text" name="nik" value={formPPKS.nik} onChange={(e) => setFormPPKS({...formPPKS, nik: e.target.value})} maxLength="16" placeholder="Kosongkan jika tidak ada" />
                  </div>

                  <div className="form-group-modal">
                    <label>Nama/Alias (Bila Diketahui)</label>
                    <input type="text" name="nama" value={formPPKS.nama} onChange={(e) => setFormPPKS({...formPPKS, nama: e.target.value})} placeholder="Contoh: Bapak Fulan" />
                  </div>

                  <div className="form-group-modal">
                    <label>Kecamatan Penemuan*</label>
                    <div className="select-container-custom">
                      <select name="kecamatan" value={formPPKS.kecamatan} onChange={(e) => setFormPPKS({...formPPKS, kecamatan: e.target.value})} required>
                        <option value="" hidden>Pilih Kecamatan</option>
                        <option value="Tallo">Tallo</option>
                        <option value="Bontoala">Bontoala</option>
                        <option value="Panakkukang">Panakkukang</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group-modal">
                    <label>Lokasi Penemuan Spesifik*</label>
                    <input type="text" name="lokasi" value={formPPKS.lokasi} onChange={(e) => setFormPPKS({...formPPKS, lokasi: e.target.value})} required placeholder="Contoh: Pasar MT Haryono, depan Toko A" />
                  </div>

                </div>
                
                <div className="modal-actions" style={{ marginTop: '20px' }}>
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsAddPPKSModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit">Simpan Laporan</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}
      {/* ================= MODAL KALKULASI DESIL ================= */}
      {isKalkulasiModalOpen && selectedKalkulasi && (
        <div className="modal-overlay" onClick={() => setIsKalkulasiModalOpen(false)}>
          <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Kalkulasi PMT & Desil</h2></div></div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0', color: '#234a66', fontSize: '18px' }}>{selectedKalkulasi.nama}</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', fontWeight: '600' }}>No KK: {selectedKalkulasi.noKk}</p>
              </div>
              {!isCalculated ? (
                <button type="button" className="btn-modal-submit" style={{ width: '100%', padding: '15px', fontSize: '16px' }} onClick={() => setIsCalculated(true)}>Jalankan Algoritma PMT</button>
              ) : (
                <div style={{backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '25px', marginTop: '15px'}}>
                  <h4 style={{ color: '#10b981', margin: '0 0 15px 0' }}>✓ Kalkulasi Selesai</h4>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px' }}>
                    <div><span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>SKOR TOTAL PMT</span><span style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>65.8</span></div>
                    <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '30px' }}><span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>MASUK KE DESIL</span><span style={{ backgroundColor: '#f97316', color: 'white', padding: '8px 24px', borderRadius: '8px', fontSize: '24px', fontWeight: '900', display: 'inline-block' }}>2</span></div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>Berdasarkan skor, keluarga ini tergolong <strong>Keluarga Rentan</strong>.</p>
                  <div className="modal-actions"><button type="button" className="btn-modal-submit" onClick={(e) => handleGenericSubmit(e, setIsKalkulasiModalOpen)}>Simpan Hasil ke Database</button></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SUKSES UMUM ================= */}
      {isSuccessModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="modal-content modal-success" onClick={(e) => e.stopPropagation()} style={{maxWidth: '400px', borderTop: '8px solid #22c55e'}}>
            <div className="modal-body text-center" style={{ padding: '40px 20px' }}>
              <div style={{width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)'}}>
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Berhasil!</h2>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StaffDashboard;