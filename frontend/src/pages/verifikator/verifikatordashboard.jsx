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
    // nama: "Verifikator",
    // nip: "-"
  });

  // ✅ DITAMBAHKAN: State untuk menyimpan daftar staff
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const savedUserData = localStorage.getItem("user"); // atau key yang Anda gunakan
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

  // ==========================================
  // NOTIFIKASI SELAMAT DATANG VERIFIKATOR
  // ==========================================
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeVerifikator");

    if (!hasSeenWelcome) {
      const welcomeNotif = {
        id: "welcome-verifikator",
        title: "Selamat Datang di SICADAS!",
        desc: "Akun Anda telah aktif. Silakan lengkapi profil Anda sekarang.",
        link: "/verifikatorprofile", // Rute menuju halaman profil verifikator
        isWelcome: true,
        date: "Baru saja"
      };

      setNotifData(prev => [welcomeNotif, ...prev]);
      localStorage.setItem("hasSeenWelcomeVerifikator", "true");
    }
  }, []);

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

  const usulanMenunggu = usulanData.filter(i => i.status_pengusulan === "Belum").length;
// ✅ Gunakan ppksList yang datanya sudah di-fetch khusus untuk "Kasus Aktif"
const ppksMenunggu = ppksList.length;
  const totalDtsen = dtsenData.length;
  const desil1 = dtsenData.filter(i => i.hasil_desil === "1").length;
  const desil2 = dtsenData.filter(i => i.hasil_desil === "2").length;
  const desil3 = dtsenData.filter(i => i.hasil_desil === "3").length;
  const desil4 = dtsenData.filter(i => i.hasil_desil === "4").length;
  const desil5 = dtsenData.filter(i => i.hasil_desil === "5").length;
  const desil6_10 = dtsenData.filter(i => i.hasil_desil === "6-10").length;

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
               (item.nama_kepala_keluarga && String(item.nama_kepala_keluarga).toLowerCase().includes(keyword));
    return matchKecamatan && matchKelurahan && matchKeyword;
  });

  const [filterPPKS, setFilterPPKS] = useState({ kategori_ppks: "", kecamatan: "", keyword: "" });

  const handleFilterPPKSChange = (e) => {
    const { name, value } = e.target;
    setFilterPPKS({ ...filterPPKS, [name]: value });
  };

 const filteredPpksList = ppksList.filter(item => {
  // ✅ TAMBAHAN: Pastikan hanya status "Kasus Aktif" yang lolos filter
  const matchStatus = item.status_penanganan === "Kasus Aktif"; 
  const matchKategori = filterPPKS.kategori_ppks === "" || item.kategori_ppks === filterPPKS.kategori_ppks;
  const matchKecamatan = filterPPKS.kecamatan === "" || item.kecamatan === filterPPKS.kecamatan;
  const keyword = filterPPKS.keyword.toLowerCase();
  const matchKeyword = keyword === "" || 
                         (item.nik && String(item.nik).toLowerCase().includes(keyword)) || 
                         (item.nama_lengkap && String(item.nama_lengkap).toLowerCase().includes(keyword));
  
  // ✅ TAMBAHKAN `matchStatus` ke dalam return
  return matchStatus && matchKategori && matchKecamatan && matchKeyword; 
});

  useEffect(() => {
    fetchDataVerifikator();
  }, []);

  const fetchDataVerifikator = async () => {
    try {
      const { data: dataBansos, error: errBansos } = await supabase.from('pengusulan_bansos').select('*').eq('status_pengusulan', 'Belum');
      if (errBansos) throw errBansos;
      setUsulanList(dataBansos);

      const { data: dataRiwayat, error: errRiwayat } = await supabase.from('pengusulan_bansos').select('*').neq('status_pengusulan', 'Selesai');
      if (errRiwayat) throw errRiwayat;
      setRiwayatList(dataRiwayat);

      const { data: dataPPKS, error: errPPKS } = await supabase.from('ppks').select('*').eq('status_penanganan', 'Kasus Aktif');
      if (errPPKS) throw errPPKS;
      setPpksList(dataPPKS);

      const { data: dataRiwayatPPKS, error: errRiwayatPPKS } = await supabase.from('ppks').select('*').eq('status_penanganan', 'Selesai Ditangani');
      if (errRiwayatPPKS) throw errRiwayatPPKS;

      setRiwayatPpksList(dataRiwayatPPKS);
      
      const { data: staffData, error: errStaff } = await supabase.from('users').select('*').eq('role', 'staff');
      if (!errStaff && staffData) {
        setStaffList(staffData);
      }
      
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };


 const openValidationModal = async (data) => {
  setSelectedData(data);
  setCatatanValidasi("");
  setAsetKeluarga(null);

  // ✅ Fetch aset dari backend REST (bukan Supabase langsung)
  if (data.no_kk) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://backend-fastapi-linjamsos-mks.vercel.app/aset/${data.no_kk}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const result = await res.json();
        // ✅ Normalize — backend bisa return { data: {...} } atau langsung {...}
        const asetData = result?.data || result;
        console.log("📦 Data aset diterima:", asetData);
        // ✅ Cek tidak kosong sebelum set
        if (asetData && Object.keys(asetData).length > 0) {
          setAsetKeluarga(asetData);
        } else {
          setAsetKeluarga(null);
        }
      } else {
        console.warn("Aset tidak ditemukan untuk no_kk:", data.no_kk);
        setAsetKeluarga(null);
      }
    } catch (error) {
      console.error("Gagal fetch aset:", error);
      setAsetKeluarga(null);
    }
  }

  setIsValidateModalOpen(true);
};



  const openValidationPPKSModal = (data) => { 
    setSelectedPPKSReview(data); 
    setIsReviewPPKSModalOpen(true);
    setCatatanValidasi("");
    setActiveTab("review_ppks");
    };



const handleValidasiBansos = async (e, statusKeputusan) => {
  e.preventDefault();
  
  if (!selectedData) {
    return alert("⚠️ Pilih data terlebih dahulu.");
  }

  try {
    // 1. DEBUG: Lihat apa yang sebenarnya diterima fungsi ini
    console.log("🔍 Status yang diterima dari UI:", statusKeputusan);

    // 2. Normalisasi Status yang BENAR (Urutan PENTING!)
    const normalizedStatus = (() => {
      if (!statusKeputusan) return "Menunggu Review";
      
      const s = String(statusKeputusan).toLowerCase().trim();
      
      // Cek "tidak" atau "tolak" DULU sebelum cek "layak"
      if (s.includes('tidak') || s.includes('tolak') || s === 'tidak layak') {
        return "Tidak Layak";
      }
      // Baru cek "layak" (agar "Tidak Layak" tidak tertangkap di sini)
      if (s.includes('layak') && !s.includes('tidak')) {
        return "Layak";
      }
      // Cek menunggu review
      if (s.includes('menunggu') || s.includes('review') || s.includes('proses')) {
        return "Menunggu Review";
      }
      
      // Fallback: gunakan nilai asli yang sudah dibersihkan
      return statusKeputusan.trim();
    })();

    console.log("✅ Status setelah normalisasi:", normalizedStatus);

    // 3. Update ke Supabase
    const { error } = await supabase
      .from('pengusulan_bansos')
      .update({ 
        status_pengusulan: normalizedStatus, 
        catatan_verifikator_bansos: catatanValidasi ? catatanValidasi.trim() : null 
      })
      .eq('id', selectedData.id);

    if (error) throw error;

    // 4. Refresh & Reset
    await fetchDataVerifikator();
    setIsValidateModalOpen(false); 
    setSelectedData(null); 
    setCatatanValidasi("");

    // 5. Alert & Pindah Tab
    alert(`✅ Data berhasil diperbarui menjadi: "${normalizedStatus}"`);
    
    if (normalizedStatus === "Layak" || normalizedStatus === "Tidak Layak") {
      setActiveTab("riwayat"); 
    }

  } catch (error) { 
    console.error("Gagal update status:", error); 
    alert(`❌ Gagal melakukan validasi: ${error.message}`); 
  }
};




const handleValidationPPKSAction = async (e, statusKeputusan) => {
  e.preventDefault();
  
  if (!selectedPPKSReview || !selectedPPKSReview.id) {
    return alert("⚠️ Data tidak ditemukan. Silakan pilih data terlebih dahulu.");
  }

  // 1. Normalisasi Status secara EKSAK (Hanya 2 Opsi)
  const s = String(statusKeputusan || "").toLowerCase().trim();
  let statusFinal = "Kasus Aktif"; // Default

  if (s.includes("selesai") || s.includes("tutup")) {
    statusFinal = "Selesai Ditangani";
  } else if (s.includes("aktif") || s.includes("lanjut") || s.includes("menunggu")) {
    statusFinal = "Kasus Aktif";
  }

  console.log("🔍 [PPKS] Update ID:", selectedPPKSReview.id, "ke status:", statusFinal);

  try {
    // 2. Eksekusi Update ke Supabase
    const { error, data } = await supabase
      .from('ppks')
      .update({ 
        status_penanganan: statusFinal, 
        catatan_verifikator: catatanValidasi ? catatanValidasi.trim() : null 
      })
      .eq('id', selectedPPKSReview.id)
      .select(); // .select() penting untuk memastikan data kembali

    if (error) throw error;

    console.log("✅ [PPKS] Update Berhasil:", data);

    // 3. Refresh Data (Pastikan fungsi ini benar-benar mengambil data terbaru dari DB)
    await fetchDataVerifikator();

    // 4. Reset State Modal
    setIsReviewPPKSModalOpen(false);
    setSelectedPPKSReview(null);
    setCatatanValidasi("");

    // 5. Logika Pindah Tab SESUAI KLARIFIKASI ANDA
    const targetTab = statusFinal === "Selesai Ditangani" ? "riwayat" : "menunggu";
    setActiveTab(targetTab);
    
    alert(`✅ Berhasil! Status diubah menjadi "${statusFinal}".\nOtomatis pindah ke tab ${targetTab === "riwayat" ? "Riwayat" : "Menunggu"}.`);

  } catch (error) {
    console.error("💥 [PPKS] Action Failed:", error);
    alert(`Gagal update: ${error.message}`);
  }
};

const handleSelesaikanKasusPPKS = async (id) => {
  console.log("🔍 [PPKS Quick Action] ID yang akan diupdate:", id);
  if (!window.confirm("Yakin ingin mengubah status kasus ini menjadi 'Selesai Ditangani'?")) return;
  
  try {
    const { error, data } = await supabase
      .from('ppks')
      .update({ status_penanganan: "Selesai Ditangani" })
      .eq('id', id)
      .select();
      
    if (error) throw error;
    
    console.log("✅ [PPKS Quick Action] Berhasil:", data);
    await fetchDataVerifikator(); 
    
    // Pindah ke tab riwayat setelah selesai
    setActiveTab("riwayat");
    alert("✅ Status berhasil diubah menjadi Selesai Ditangani!");
  } catch (err) {
    console.error("❌ [PPKS Quick Action] Gagal:", err);
    alert("Gagal update status: " + err.message);
  }
};



  const formatDateIndo = (dateStr) => { 
    if(!dateStr || dateStr === "-") return "-"; 
    const date = new Date(dateStr); 
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]; 
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`; 
  };


// const [asetKeluarga, setAsetKeluarga] = useState(null);

// ✅ Fungsi aman untuk mengambil data aset
const fetchAsetKeluarga = async (no_kk) => {
  if (!no_kk) return;
  
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://backend-fastapi-linjamsos-mks.vercel.app/aset/${no_kk}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const result = await res.json();
      // Supabase biasanya return { data: {...} }, kita ambil isinya
      const dataAset = result.data || result; 
      setAsetKeluarga(dataAset);
    } else {
      setAsetKeluarga(null); // Set null jika tidak ditemukan
    }
  } catch (error) {
    console.error("Gagal fetch aset:", error);
    setAsetKeluarga(null);
  }
};




const handleOpenVerifikasi = (item) => {
  setSelectedPengusulan(item);
  setAsetKeluarga(null); // Reset state aset dulu agar tidak menampilkan data lama
  
  // ✅ Panggil fetch data aset berdasarkan No KK dari item yang dipilih
  if (item.no_kk) {
    fetchAsetKeluarga(item.no_kk);
  }
  
  setIsVerifikasiModalOpen(true);
};


  return (
    <div className="verifikator-layout relative">
      <aside className="sidebar">
        <div className="sidebar-brand" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '15px 0' }}>
          <img src={logoSicadasDashboard} alt="Logo SICADAS" 
          className="sidebar-logo" 
          style={{ width: "100%", maxWidth: "150px", height: "auto", margin: "0 auto" }} />
        </div>
        
        <div className="sidebar-profile" style={{ cursor: 'pointer' }} onClick={() => navigate("/verifikatorprofile")} title="Lihat Profil">
          <div className="profile-avatar-small">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path>
            </svg>
          </div>
          <div className="profile-info">
            {/* Pastikan variabel pemanggil nama dan NIK disesuaikan dengan state di Verifikator */}
            <span className="profile-name">{currentVerifikator.nama}</span>
            <span className="profile-nik">{currentVerifikator.nip}</span>
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
          <button className={`menu-item ${activeMenu === "penentuan_desil" ? "active" : ""}`} onClick={() => { setActiveMenu("penentuan_desil"); setActiveTab("menunggu_penentuan"); }}>
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg> Penentuan Desil
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
            {activeMenu === "penentuan_desil" && "Kalkulasi & Penentuan Desil Keluarga"}
          </h1>
        </header>
        
        <div className="content-body">
          {activeMenu === "dashboard" && (
            <div className="dashboard-verifikator-wrapper">
              {/* ======================================================== */}
              {/* HEADER PINTASAN UNDUHAN TEMPLATE (QUICK ACTIONS)         */}
              {/* ======================================================== */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                <div>
                  <h3 className="section-title" style={{ marginTop: 0 }}>Tinjauan Umum</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Unduh format data import.</p>
                </div>
                
                {/* Kumpulan Tombol Unduhan (Opsi 2: Solid Abu-Biru) */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  
                  {/* Tombol DTSEN */}
                  <a 
                    href="/templates/template_import_dtsen.csv" download="Template_DTSEN.csv"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 15px', color: '#1e293b', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', textDecoration: 'none', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s' }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Template DTSEN
                  </a>

                  {/* Tombol PPKS */}
                  <a 
                    href="/templates/template_import_ppks.csv" download="Template_PPKS.csv"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 15px', color: '#1e293b', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', textDecoration: 'none', borderRadius: '6px', fontWeight: '600', transition: 'all 0.2s' }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Template PPKS
                  </a>

                </div>
              </div>
          
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

          {/* ====================================================================== */}
          {/* 1. PANGGIL KOMPONEN VALIDASI PPKS (TABEL)                              */}
          {/* ====================================================================== */}
          {activeMenu === "validasi_ppks" && activeTab !== "review_ppks" && (
            <ValidasiPPKS 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              filterPPKS={filterPPKS} 
              handleFilterPPKSChange={handleFilterPPKSChange} 
              filteredPpksList={filteredPpksList} 
              riwayatPpksList={riwayatPpksList} 
              formatDateIndo={formatDateIndo} 
              openValidationPPKSModal={openValidationPPKSModal}
              onSelesaikanKasus={handleSelesaikanKasusPPKS} 
            />
          )}


          {/* ====================================================================== */}
          {/* 2. HALAMAN VIRTUAL: REVIEW LAPORAN PPKS (MUNCUL SAAT KLIK REVIEW)      */}
          {/* ====================================================================== */}
          {activeMenu === "validasi_ppks" && activeTab === "review_ppks" && selectedPPKSReview && (
            <div className="dashboard-verifikator-wrapper" style={{ padding: '20px' }}>
              
              {/* HEADER HALAMAN & TOMBOL KEMBALI */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                  <h2 className="section-title" style={{ margin: 0 }}>Review Laporan Kasus PPKS</h2>
                  <p style={{ color: '#64748b', margin: '5px 0 0 0', fontSize: '14px' }}>Tinjau dan berikan instruksi penanganan untuk kasus ini.</p>
                </div>
                <button 
                  className="btn-search-outline" 
                  onClick={() => setActiveTab("menunggu")} 
                  style={{ padding: '8px 16px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  &larr; Kembali ke Daftar PPKS
                </button>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                
                {/* 1. STATUS BOX */}
                <div className="alert-info-box" style={{ backgroundColor: selectedPPKSReview.status_penanganan === 'Selesai Ditangani' ? '#fee2e2' : '#f0fdf4', border: `1px solid ${selectedPPKSReview.status_penanganan === 'Selesai Ditangani' ? '#fca5a5' : '#bbf7d0'}`, padding: '15px', borderRadius: '8px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
                  <div><span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: 'bold' }}>STATUS PENANGANAN SAAT INI:</span><strong style={{ color: selectedPPKSReview.status_penanganan === 'Selesai Ditangani' ? '#991b1b' : '#166534' }}>{selectedPPKSReview.status_penanganan || "Menunggu Kelayakan"}</strong></div>
                  <div style={{ textAlign: 'right' }}><span style={{ fontSize: '12px', color: '#64748b', display: 'block', fontWeight: 'bold' }}>TGL LAPORAN:</span><strong style={{ color: '#166534' }}>{formatDateIndo(selectedPPKSReview.tanggal_penemuan)}</strong></div>
                </div>

                {/* 2. DATA TEMUAN LAPANGAN */}
                <div style={{ paddingBottom: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>NAMA</span>
                      <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '15px' }}>{selectedPPKSReview.nama_lengkap || "-"}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>KATEGORI PPKS</span>
                      <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '15px' }}>{selectedPPKSReview.kategori_ppks || "-"}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>NOMOR NIK (JIKA ADA)</span>
                      <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '15px' }}>{selectedPPKSReview.nik || "-"}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>KECAMATAN PENEMUAN</span>
                      <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '15px' }}>{selectedPPKSReview.kecamatan || "-"}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>LOKASI PENEMUAN SPESIFIK</span>
                    <div style={{ color: '#0f172a', fontWeight: '600', fontSize: '15px' }}>{selectedPPKSReview.lokasi_penemuan || "-"}</div>
                  </div>
                </div>

                {/* 3. BUKTI FOTO PENEMUAN */}
                <div style={{ paddingBottom: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '14px', color: '#3b82f6', fontWeight: 'bold', margin: '0 0 15px 0' }}>Bukti Foto Penemuan</h3>
                  {Array.isArray(selectedPPKSReview?.bukti_foto_ppks) && selectedPPKSReview?.bukti_foto_ppks.length > 0 ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {selectedPPKSReview.bukti_foto_ppks.map((fotoUrl, idx) => (
                        <img key={idx} src={fotoUrl} alt={`Bukti ${idx + 1}`} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      ))}
                    </div>
                  ) : typeof selectedPPKSReview?.bukti_foto_ppks === 'string' && selectedPPKSReview?.bukti_foto_ppks.trim() !== "" ? (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {selectedPPKSReview.bukti_foto_ppks.split(",").map((fotoUrl, idx) => (
                        <img key={idx} src={fotoUrl.trim()} alt={`Bukti ${idx + 1}`} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>Tidak ada bukti foto yang dilampirkan oleh Staf Lapangan.</p>
                  )}
                </div>

                {/* 4. FORM CATATAN VERIFIKATOR */}
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '14px', color: '#3b82f6', fontWeight: 'bold', margin: '0 0 10px 0' }}>Tindak Lanjut & Assessment Lapangan</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                    Catat hasil temuan lapangan dan instruksikan penanganan selanjutnya untuk kasus ini.
                  </p>
                  <textarea 
                    className="form-control"
                    rows="4" 
                    placeholder="Ketik hasil asesmen atau instruksi di sini..."
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', resize: 'vertical' }}
                    value={catatanValidasi || ""} 
                    onChange={(e) => setCatatanValidasi(e.target.value)} 
                  ></textarea>
                </div>
                
                {/* 5. TOMBOL AKSI VERIFIKATOR */}
                <div style={{ gap: '15px', display: 'flex', marginTop: '25px', paddingTop: '20px', borderTop: '2px solid #e2e8f0' }}>
                   <button 
                     type="button" 
                     style={{ flex: 1, padding: '15px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }} 
                     // ✅ Ubah parameter status menjadi "Selesai Ditangani"
                     onClick={(e) => handleValidationPPKSAction(e, "Selesai Ditangani")}
                   >
                     Selesaikan Laporan
                   </button>
                </div>

              </div>
            </div>
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
                  <div className="form-group-modal"><label>Nama Kepala Keluarga</label><input type="text" value={selectedData.nama_kepala_keluarga || selectedData.nama_kepala_keluarga} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Kecamatan</label><input type="text" value={selectedData.kecamatan} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Kelurahan</label><input type="text" value={selectedData.kelurahan} readOnly className="input-readonly" /></div>
                  <div className="form-group-modal"><label>Tingkat Desil Saat Ini</label><input type="text" value={asetKeluarga ? asetKeluarga.hasil_desil : "Belum Dihitung"} readOnly className="input-readonly" style={{ fontWeight: 'bold', color: '#b45309', backgroundColor: '#fffbeb' }} /></div>
                  <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}><label>Alamat Lengkap</label><input type="text" value={selectedData.alamat} readOnly className="input-readonly" /></div>
                </div>
              </div>



<div className="modal-section" style={{ marginTop: '20px' }}>
  <h3 className="section-subtitle">Kondisi Aset & Perumahan (39 Variabel DTSEN)</h3>
  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>
    Data di bawah ditarik langsung dari survei lapangan DTSEN.
  </p>

  {/* 🛡️ PENGAMAN: Cek apakah asetKeluarga adalah object DAN tidak kosong */}
{asetKeluarga && typeof asetKeluarga === 'object' && Object.keys(asetKeluarga).length > 0 ? (
  <div style={{
    backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px',
    border: '1px solid #e2e8f0', display: 'grid',
    gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: '13px'
  }}>
      {Object.entries(asetKeluarga)
      .filter(([key]) => !['id', 'no_kk', 'created_at', 'updated_at', 'user_id'].includes(key))
      .map(([key, value]) => (
        <div key={key} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          borderBottom: '1px dashed #cbd5e1', 
          paddingBottom: '5px' 
        }}>
          
          <span style={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px' }}>
           
            {key.replace(/_/g, ' ')} {/* Mengganti underscore dengan spasi agar rapi */}
          </span>

          <span style={{ color: '#1e293b' }}>
            {/* Tampilkan value, atau "-" jika null/undefined/kosong */}
            {value !== null && value !== undefined && value !== "" ? String(value) : "-"}
          </span>
        </div>
      ))}
    </div>

  ) : (
    /* TAMPILAN JIKA DATA NULL, UNDEFINED, ATAU OBJEK KOSONG {} */
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#fee2e2', 
      color: '#991b1b', 
      borderRadius: '8px', 
      textAlign: 'center', 
      fontSize: '13px',
      border: '1px solid #fecaca'
    }}>
      ⚠️ Keluarga ini belum melengkapi data 39 Variabel Aset di DTSEN. <br/>
      Disarankan untuk menunda validasi sampai staf melengkapi data tersebut.
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
      

            {/* ================= MODAL SUCCESS UMUM ================= */}
      {isSuccessModalOpen && (<div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}><div className="modal-content" style={{maxWidth: '400px', borderTop: '8px solid #22c55e'}}><div className="modal-body text-center" style={{ padding: '40px 20px' }}><div style={{width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto'}}><svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></div><h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Tindakan Berhasil!</h2><p style={{ color: '#475569', fontSize: '13px', margin: '0' }}>Data telah diperbarui dan diteruskan ke sistem.</p></div></div></div>)}

    </div>
  );
}

export default VerifikatorDashboard;