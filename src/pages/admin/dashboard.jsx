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

  // === DATA ANTREAN AKUN BARU (DARI NOTIFIKASI) ===
  const [pendingAccounts, setPendingAccounts] = useState([
    { 
      id: 99, 
      nip: "198012122005011001", // Ditambahkan NIP untuk kelengkapan data
      nik: "1234567890123456", 
      pass: "baru123", 
      phone: "081122334455", 
      name: "Staf Kecamatan Tallo", 
      email: "tallo@gmail.com", 
      address: "Kantor Kecamatan Tallo, Jl. AR Hakim", 
      role: "Verifikator", 
      status_akun: "Menunggu",
      tanggal: "15/09"
    }
  ]);
  
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
    setSelectedApproval(account);
    setIsApprovalModalOpen(true);
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
          
          <div className="notif-wrapper">
            <button className="nav-bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              {pendingAccounts.length > 0 && <span className="notif-badge-red" style={{ position: 'absolute', top: '2px', right: '4px', backgroundColor: '#ef4444', width: '10px', height: '10px', borderRadius: '50%' }}></span>}
            </button>

            {/* DROPDOWN NOTIFIKASI */}
            {isNotifOpen && (
              <div className="notif-dropdown-custom">
                <div className="notif-header-custom"><h3>Pemberitahuan</h3></div>
                <div className="notif-body-custom">
                  {pendingAccounts.length > 0 ? (
                    pendingAccounts.map(acc => (
                      <div className="notif-item-custom" key={acc.id} onClick={() => handleOpenApproval(acc)}>
                        <div className="notif-title-row-custom">
                          <h4 style={{ color: '#2563eb' }}>Pengusulan Akun Baru</h4>
                          <span>{acc.tanggal}</span>
                        </div>
                        <p>Terdapat pengusulan akun staf dari {acc.name}. Klik untuk meninjau persetujuan.</p>
                      </div>
                    ))
                  ) : (
                    <div className="notif-item-custom"><p style={{ textAlign: 'center', padding: '10px 0', fontSize: '12px' }}>Tidak ada pemberitahuan baru.</p></div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isNotifOpen && <div className="notif-backdrop-custom" onClick={() => setIsNotifOpen(false)}></div>}

      {/* ================= MAIN CONTENT ================= */}
      <main className="admin-content">
        
        {/* ================= WELCOME BANNER ================= */}
        <div className="welcome-banner">
          <div className="banner-text">
            <h2>SELAMAT DATANG FIRLIANY FIRDAUS</h2>
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

      {/* ================= 🌟 MODAL PERSETUJUAN AKUN (DETAIL LENGKAP) 🌟 ================= */}
      {isApprovalModalOpen && selectedApproval && (
        <div className="modal-overlay" onClick={() => setIsApprovalModalOpen(false)}>
          <div className="modal-content modal-large" style={{ backgroundColor: '#f8fafc', maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div className="modal-header-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2>Tinjau Pengusulan Akun Lengkap</h2>
              </div>
            </div>

            <div className="modal-body" style={{ padding: '30px' }}>
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', padding: '15px', borderRadius: '8px', marginBottom: '25px', fontSize: '13px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <span><strong>Perhatian:</strong> Akun ini diusulkan sebagai <strong>{selectedApproval.role}</strong>. Pastikan data pendaftar sudah diverifikasi kebenarannya sebelum memberikan akses sistem.</span>
              </div>

              {/* SEKSI 1: INFORMASI LOGIN & ROLE */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '700', marginBottom: '15px', paddingBottom: '8px', borderBottom: '1px solid #cbd5e1' }}>Informasi Akun & Akses</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                  <div><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>NIP Pegawai</span><strong style={{ fontSize: '14px', color: '#1e293b' }}>{selectedApproval.nip || "-"}</strong></div>
                  <div><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Role / Akses Diminta</span><strong style={{ fontSize: '14px', color: '#2563eb', padding: '4px 10px', backgroundColor: '#dbeafe', borderRadius: '6px' }}>{selectedApproval.role}</strong></div>
                </div>
              </div>

              {/* SEKSI 2: DATA PRIBADI */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '700', marginBottom: '15px', paddingBottom: '8px', borderBottom: '1px solid #cbd5e1' }}>Data Pribadi Staf</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                  <div><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Nama Lengkap (Sesuai KTP)</span><strong style={{ fontSize: '14px', color: '#1e293b' }}>{selectedApproval.name}</strong></div>
                  <div><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Nomor Induk Kependudukan (NIK)</span><strong style={{ fontSize: '14px', color: '#1e293b' }}>{selectedApproval.nik}</strong></div>
                  <div><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Email Aktif</span><strong style={{ fontSize: '14px', color: '#1e293b' }}>{selectedApproval.email}</strong></div>
                  <div><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>No. WhatsApp / Handphone</span><strong style={{ fontSize: '14px', color: '#1e293b' }}>{selectedApproval.phone}</strong></div>
                  <div style={{ gridColumn: '1 / -1' }}><span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Alamat Instansi / Wilayah Penugasan</span><strong style={{ fontSize: '14px', color: '#1e293b' }}>{selectedApproval.address}</strong></div>
                </div>
              </div>

              {/* TOMBOL AKSI */}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
                <button onClick={handleRejectAccount} className="btn-modal-cancel" style={{ width: 'auto', border: '1px solid #ef4444', color: '#ef4444' }}>Tolak Usulan</button>
                <button onClick={handleApproveAccount} className="btn-modal-submit" style={{ width: 'auto' }}>Setujui & Aktifkan Akun</button>
              </div>
            </div>

          </div>
        </div>
      )}

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