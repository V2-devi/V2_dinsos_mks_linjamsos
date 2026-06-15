import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./staffdashboard.css";

// ✅ IMPORT LOGO SICADAS VERSI DASHBOARD (LATAR PUTIH) KARENA NAVBAR ADMIN BERWARNA BIRU GELAP
import logoSicadasDashboard from "../../assets/logo_sicadas_col.png";

import { supabase } from "../../config/supabase";

// ✅ IMPORT KOMPONEN YANG RAPI
import UsulanBaru from "./usulanbaru";
import Dtsen from "./dtsen";

function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // 1. STATE UTAMA (MANGKUK DATA)
  // ==========================================
  const [usulanData, setUsulanData] = useState([]);
  const [dtsenData, setDtsenData] = useState([]);
  const [dummyPPKS, setDummyPPKS] = useState([]);

  const [currentStaff, setCurrentStaff] = useState({
    // nama_lengkap: "Firliany",
    // nip: "12345678912131230"
  });

  const [activeMenu, setActiveMenu] = useState((location.state && location.state.activeMenu) ? location.state.activeMenu : "usulan_baru"); 
  const [activeTab, setActiveTab] = useState((location.state && location.state.activeTab) ? location.state.activeTab : "dashboard"); 
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // =========================================
  // FETCH DATA KELUARGA
  // =========================================
  const fetchKeluarga = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://backend-fastapi-linjamsos-mks.vercel.app/keluarga", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // ✅ PERBAIKAN: Gunakan backtick (`) agar ${token} terbaca sebagai variabel
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("DATA KELUARGA RAW:", data);

      if (Array.isArray(data)) {
        setDtsenData(
          data.map(item => ({
            id: item.id,
            no_kk: item.no_kk,
            nik: item.nik,
            nama_kepala_keluarga: item.nama_kepala_keluarga,
            kecamatan: item.kecamatan,
            kelurahan: item.kelurahan,
            alamat: item.alamat,
            jenis_kelamin: item.jenis_kelamin,
            tanggal_lahir: item.tanggal_lahir,

            // kondisi_khusus: item.kondisi_khusus,
            
            // ✅ STANDARISASI KEY: Gunakan 'desil' agar konsisten di seluruh aplikasi
            hasil_desil: item.hasil_desil || "Belum Dihitung", 
            
            skor_pmt: item.skor_pmt || "-",
            kategori_desil: item.kategori_desil || "",
            
            // Pastikan anggota juga ter-load jika backend mengirimnya
            anggota: item.anggota_keluarga || [],
            
            // Tambahkan field aset agar detail aset tetap jalan
            aset: item.aset || {},
            asetLengkap: item.aset ? Object.keys(item.aset).length > 0 : false
          }))
        );
      } else {
        setDtsenData([]);
      }
    } catch (error) {
      console.error("FETCH ERROR:", error);
      setDtsenData([]); // Pastikan state kosong jika terjadi error agar tidak crash
    }
  };

  // =========================================
  // LOAD DATA AWAL
  // =========================================
  useEffect(() => {
    fetchKeluarga();
  }, []);

  // ==========================================
  // LIFECYCLE (USE EFFECT FETCH SUPABASE)
  // ==========================================
  // ==========================================
  // LIFECYCLE - LOAD DATA STAFF & FETCH DATA
  // ==========================================
  
  // ✅ useEffect 1: Load data staff dari localStorage
  useEffect(() => {
    const savedStaffData = localStorage.getItem("user");
    if (savedStaffData) {
      try {
        const parsedData = JSON.parse(savedStaffData);
        
        setCurrentStaff({
          nama_lengkap: parsedData.nama_lengkap || "Nama Staff",
          nip: parsedData.nip || "NIP Staff"
        });
      } catch (error) {
        console.error("Gagal membaca data staff:", error);
      }
    }
  }, []); // ✅ [] di sini, sebagai argumen kedua useEffect

  // ✅ useEffect 2: Fetch data dari Supabase (terpisah)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Usulan Bansos
        const { data: pengusulanData, error: pengusulanError } =
          await supabase.from('pengusulan_bansos').select('*');
        if (pengusulanError) throw pengusulanError;
        setUsulanData(
          (pengusulanData || []).map(item => ({
            id: item.id,
            nik: item.nik,
            no_kk: item.no_kk,
            nama_kepala_keluarga: item.nama_kepala_keluarga,
            kecamatan: item.kecamatan,
            kelurahan: item.kelurahan,
            tanggal_usulan: item.tanggal_usulan,
            alamat: item.alamat,
            status_pengusulan: item.status_pengusulan,
            jenis_bansos: item.jenis_bansos,
            catatan_verifikator_bansos : item.catatan_verifikator_bansos || ""
          }))
        );
        console.log("LOG MASUK - DATA BANSOS RAW:", pengusulanData);

        // ✅ PPKS
        const { data: ppksData, error: ppksError } =
          await supabase.from('ppks').select('*');
        if (ppksError) throw ppksError;
        setDummyPPKS(
          (ppksData || []).map(item => ({
            id: item.id,
            nik: item.nik,
            nama_lengkap: item.nama_lengkap,
            kategori_ppks: item.kategori_ppks,
            kecamatan: item.kecamatan,
            kelurahan: item.kelurahan,
            lokasi_penemuan: item.lokasi_penemuan,
            tanggal_penemuan: item.tanggal_penemuan,
            status_penanganan: item.status_penanganan,
            catatan_verifikator: item.catatan_verifikator_ppks || item.catatan_verifikator ||"",
            bukti_foto_ppks: item.bukti_foto_ppks
          }))
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // ✅ [] di sini, sebagai argumen kedua useEffect

  const showSuccess = () => { setIsSuccessModalOpen(true); setTimeout(() => setIsSuccessModalOpen(false), 2500); };

  const formatDateIndo = (dateStr) => { 
    if(!dateStr || dateStr === "-") return "-"; 
    const date = new Date(dateStr); 
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]; 
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`; 
  };

  const getQuarter = (dateString) => {
    if (!dateString) return "q1";
    const month = new Date(dateString).getMonth() + 1;
    return month <= 3 ? "q1" : month <= 6 ? "q2" : month <= 9 ? "q3" : "q4";
  };
  
  // ==========================================
  // RENDER TAMPILAN (MASTER LAYOUT)
  // =========================================
  return (
    <div className="staff-layout relative">
      <aside className="sidebar">
       <div className="sidebar-brand" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '15px 0' }}>
          <img 
            src={logoSicadasDashboard} 
            alt="Logo SICADAS" 
            className="sidebar-logo" 
            style={{ width: "100%", maxWidth: "150px", height: "auto", margin: "0 auto" }} 
          />
        </div>
        
        <div className="sidebar-profile" style={{ cursor: 'pointer' }} onClick={() => navigate("/staffprofile")} title="Lihat Profil">
          <div className="profile-avatar-small"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path></svg></div>
          <div className="profile-info">
            <span className="profile-name">{currentStaff.nama_lengkap}</span>
            <span className="profile-nik">{currentStaff.nip}</span>
          </div>
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
          
          <button className="menu-item" style={{ marginTop: '40px', color: '#ef4444' }} onClick={() => navigate("/login")}>
             <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Keluar
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1 className="header-title">
            {activeMenu === "usulan_baru" && "Usulan Baru Bansos"}
            {activeMenu === "lihat_dtsen" && "Data Terpadu Sosial Ekonomi Nasional (DTSEN)"}
            {activeMenu === "ppks" && "Pengusulan Daftar PPKS"}
           </h1>
        </header>

        {/* MENGGUNAKAN KOMPONEN ANAK YANG TELAH DIPISAH  */}
        <div className="content-body">
          {activeMenu === "usulan_baru" && (
            <UsulanBaru 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              usulanData={usulanData} 
              setUsulanData={setUsulanData} 
              currentStaff={currentStaff} 
              showSuccess={showSuccess} 
              formatDateIndo={formatDateIndo} 
              getQuarter={getQuarter}         
            />
          )}

          {/* UBAH MENJADI SEPERTI INI */}
          {(activeMenu === "lihat_dtsen" || activeMenu === "ppks") && (
            <Dtsen 
              activeMenu={activeMenu} activeTab={activeTab} setActiveTab={setActiveTab}
              dtsenData={dtsenData} setDtsenData={setDtsenData} dummyPPKS={dummyPPKS} setDummyPPKS={setDummyPPKS}
              showSuccess={showSuccess} fetchKeluarga={fetchKeluarga}
              currentRole="staff" /* ✅ TAMBAHKAN BARIS INI */
            />
          )}
        </div>
      </main>

      {/* MODAL SUKSES */}
      {isSuccessModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="modal-content modal-success" onClick={(e) => e.stopPropagation()} style={{maxWidth: '400px', borderTop: '8px solid #22c55e'}}>
            <div className="modal-body text-center" style={{ padding: '40px 20px' }}>
              <div style={{width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)'}}><svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></div>
              <h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Berhasil!</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;