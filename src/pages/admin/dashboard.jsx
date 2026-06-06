import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; //
import "./dashboard.css"; 

// ✅ IMPORT LOGO SICADAS VERSI LOGIN (LATAR GELAP / WARNA PUTIH) KARENA NAVBAR ADMIN BERWARNA BIRU GELAP
import logoSicadas from "../../assets/logo_sicadas.png";

function AdminDashboard() {
  const navigate = useNavigate();

  // === STATE NOTIFIKASI & MODAL PERSETUJUAN ===
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // === STATE DATA PENGGUNA (DARI DATABASE) ===
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

const fetchUsers = async () => {
    try {
      // Coba fetch dari API dulu
      const res = await axios.get("http://localhost:8000/admin/users");
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : null;
      if (data) {
        setUsers(data);
        localStorage.setItem("localUsers", JSON.stringify(data));
      }
    } catch (err) {
      console.warn("Backend mati. Memuat data Dashboard dari memori lokal...");
      // ✅ PERBAIKAN: Jika API mati, tarik data dari form DataUser tadi
      const savedUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
      setUsers(savedUsers);
    }
  };

  // ✅ PERBAIKAN: Kalkulasi aman untuk membaca data lama (pending/approved) maupun baru (menunggu/disetujui)
  const totaldisetujui = users.filter(u => {
    const s = String(u.status_akun || u.status || "").toLowerCase();
    return s === "disetujui" || s === "approved";
  }).length;

  const totalmenunggu = users.filter(u => {
    const s = String(u.status_akun || u.status || "").toLowerCase();
    return s === "menunggu" || s === "pending" || s === "tidak aktif" || s === "";
  }).length;
  // === HANDLER FUNGSI ===
  const handleOpenApproval = (account) => {
    navigate("/datauser", { state: { filterStatus: "Menunggu" } });
    setIsNotifOpen(false);
    };

  const handleApproveAccount = () => {
    const newActiveUser = { ...selectedApproval, status_akun: "disetujui", id: Date.now() };
    setUsers([newActiveUser, ...users]); 
    setPendingAccounts(pendingAccounts.filter(acc => acc.id !== selectedApproval.id)); 
    setIsApprovalModalOpen(false);
    showSuccess();
  };

  const handleRejectAccount = () => {
    setPendingAccounts(pendingAccounts.filter(acc => acc.id !== selectedApproval.id));
    setIsApprovalModalOpen(false);
    showSuccess();
  };

  const showSuccess = () => {
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 2500);
  };

  return (
    <div className="admin-container relative">
      
      {/* ================= NAVBAR ADMIN ================= */}
      <nav className="admin-navbar">
        <div className="navbar-left">
          
          {/* ✅ MENGGUNAKAN LOGO SICADAS VERSI PUTIH DAN MENGHAPUS TEKS REDUNDAN */}
          <div className="branding-container-small" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={logoSicadas} 
              alt="Logo SICADAS" 
              className="branding-logo-small" 
              style={{ height: '70px', width: 'auto', objectFit: 'contain' }} 
            />
          </div>
          
        </div>
        
        <div className="navbar-right">
          <button className="nav-logout-btn" onClick={() => navigate("/login")}>Keluar</button>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="admin-content">
        
        {/* ================= WELCOME BANNER ================= */}
        <div className="welcome-banner">
          <div className="banner-text">
            <h2>SELAMAT DATANG DI SISTEM ADMIN</h2>
            <button className="btn-light-outline" onClick={() => navigate("/adminprofile")}>
              Lihat Akun Anda &rarr;
            </button>
          </div>
          <div className="banner-icon">
            <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"></circle>
            </svg>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Pengguna Disetujui</h3>
            <div className="stat-value text-green">{totaldisetujui}</div>
          </div>
          <div className="stat-card">
            <h3>Pengguna Menunggu</h3>
            <div className="stat-value text-red">{totalmenunggu}</div>
          </div>
        </div>

        {/* DATA TABLE PENGGUNA */}
        <h3 className="section-title">Daftar Pengguna</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>NIP</th>
                <th>Role</th>
                <th>Nama Lengkap</th>
                <th>Wilayah Kerja</th>
                <th>Email</th>
                <th>Alamat</th>
                <th style={{ textAlign: 'center' }}>Status Pegawai</th>
                <th style={{ textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* Tampilkan maksimal 5 pengguna di Dashboard */}
              {users.slice(0, 5).map((user) => (
                <tr key={user.id || Math.random()}>
                  <td>{user.nip || "-"}</td>
                  <td>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', backgroundColor: user.role === 'verifikator' ? '#fef08a' : user.role === 'admin' ? '#fecaca' : '#e0e7ff', color: user.role === 'verifikator' ? '#a16207' : user.role === 'admin' ? '#b91c1c' : '#1d4ed8' }}>
                      {user.role || "staff"}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{user.nama_lengkap || "-"}</td>
                  <td>{user.wilayah_kerja}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.alamat || "-"}</td>
                 <td style={{ textAlign: 'center' }}>
                        <span className={`status-badge ${
                          String(user.status_akun || user.status || "").toLowerCase() === "disetujui" || 
                          String(user.status_akun || user.status || "").toLowerCase() === "approved" 
                            ? "badge-active" : "badge-inactive"
                        }`}>
                          {String(user.status_akun || user.status || "").toLowerCase() === "disetujui" || 
                           String(user.status_akun || user.status || "").toLowerCase() === "approved" 
                            ? "Disetujui" : "Menunggu"}
                        </span>
                      </td>
                  <td style={{ textAlign: "center" }}>
                    <div className="action-buttons" style={{ justifyContent: 'center' }}>
                      {/* Aksi di dashboard diarahkan ke halaman Data User agar pengelolaannya terpusat */}
                      <button className="action-btn text-blue" title="Kelola di Data User" onClick={() => navigate("/datauser")}>📝</button>
                      <button className="action-btn text-red" title="Kelola di Data User" onClick={() => navigate("/datauser")}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Memuat data pengguna...</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* TOMBOL LIHAT SELENGKAPNYA */}
        <div className="table-footer">
          <button className="btn-outline" onClick={() => navigate("/datauser")}>
            Lihat Selengkapnya &rarr;
          </button>
        </div>

      </main>

      {/* ================= MODAL SUKSES ================= */}
      {isSuccessModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="modal-content modal-success" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-body text-center" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div className="success-icon-circle" style={{width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)'}}>
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Tindakan Berhasil!</h2>
              <p style={{ color: '#475569', fontSize: '13px', fontWeight: '500', margin: '0' }}>Data sistem telah diperbarui.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;