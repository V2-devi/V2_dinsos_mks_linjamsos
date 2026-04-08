import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"; // Mengarah ke file CSS Anda sendiri
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function AdminDashboard() {
  const navigate = useNavigate();

  // === STATE NOTIFIKASI ===
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // === DATA DUMMY NOTIFIKASI ===
  const notifData = [
    { id: 1, title: "Pengusulan Akun Baru", date: "15/09", desc: "Terdapat pengusulan akun staf dari Kecamatan Tallo." },
  ];

  // === DATA DUMMY PENGGUNA (Hanya untuk Preview & Kalkulasi) ===
  const dummyData = [
    { id: 1, nik: "7370999999999999", pass: "firli12", phone: "089999999999", name: "Devi Permata", email: "deviper@gmail.com", address: "Gowa", status: "Aktif" },
    { id: 2, nik: "7270888888888888", pass: "dev12", phone: "088888888888", name: "Firliany", email: "firli@gmail.com", address: "Gowa", status: "Aktif" },
    { id: 3, nik: "3971371863193701", pass: "budi123", phone: "087777777777", name: "Budi Santoso", email: "budi@gmail.com", address: "Makassar", status: "Tidak Aktif" },
    { id: 4, nik: "7470666666666666", pass: "siti123", phone: "086666666666", name: "Siti Aminah", email: "siti@gmail.com", address: "Maros", status: "Tidak Aktif" },
  ];

  // Ambil maksimal 3 data untuk Preview di tabel
  const previewData = dummyData.slice(0, 3);
  
  // Kalkulasi statistik
  const totalAktif = dummyData.filter(user => user.status === "Aktif").length;
  const totalTidakAktif = dummyData.filter(user => user.status === "Tidak Aktif").length;

  return (
    <div className="admin-container">
      
      {/* ================= NAVBAR ================= */}
      {/* Sesuai dengan class .admin-navbar di CSS Anda */}
      <nav className="admin-navbar">
        <div className="navbar-left">
          <div className="nav-logo">
            <img src={logoLinjamsos} alt="Logo" style={{ width: '40px', marginRight: '15px' }} />
            <div className="nav-title" style={{ display: 'flex', flexDirection: 'column' }}>
              <span>PERLINDUNGAN DAN</span>
              <span>JAMINAN SOSIAL</span>
            </div>
          </div>
        </div>

        <div className="navbar-right">
          {/* Tombol Keluar */}
          <button className="nav-logout-btn" onClick={() => navigate("/login")}>
            Keluar
          </button>
          
          {/* Fitur Notifikasi */}
          <div style={{ position: 'relative' }}>
            <button className="nav-bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </button>

            {/* Dropdown Notifikasi */}
            {isNotifOpen && (
              <div className="notif-dropdown-custom">
                <div className="notif-header-custom"><h3>Pemberitahuan</h3></div>
                <div className="notif-body-custom">
                  {notifData.map((notif) => (
                    <div className="notif-item-custom" key={notif.id}>
                      <div className="notif-title-row-custom">
                        <h4>{notif.title}</h4><span>{notif.date}</span>
                      </div>
                      <p>{notif.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop agar notif tertutup jika klik di luar kotak */}
      {isNotifOpen && <div className="notif-backdrop-custom" onClick={() => setIsNotifOpen(false)}></div>}

      {/* ================= MAIN CONTENT ================= */}
      <main className="admin-content">
        
        {/* BANNER SELAMAT DATANG */}
        <div className="welcome-banner">
          <div className="banner-text">
            <h2>SELAMAT DATANG FIRLIANY FIRDAUS</h2>
            <button className="btn-light-outline" onClick={() => navigate("/adminprofile")}>
              Lihat Akun Anda &rarr;
            </button>
          </div>
          <div className="banner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '130px', height: '130px' }}>
              <circle cx="12" cy="8" r="5"></circle>
              <path d="M3 21v-2a7 7 0 0114 0v2" transform="translate(2,0)"></path>
            </svg>
          </div>
        </div>

        {/* KARTU STATISTIK */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Pengguna Aktif</h3>
            <div className="stat-value text-green">{totalAktif}</div>
          </div>
          <div className="stat-card">
            <h3>Pengguna Tidak Aktif</h3>
            <div className="stat-value text-red">{totalTidakAktif}</div>
          </div>
        </div>

        {/* TABEL PREVIEW */}
        <h3 className="section-title">Daftar Pengguna</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>NIK</th>
                <th>Kata Sandi</th>
                <th>No.HP</th>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Alamat</th>
                <th style={{ textAlign: 'center' }}>Status Pegawai</th>
                <th style={{ textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((user) => (
                <tr key={user.id}>
                  <td>{user.nik}</td>
                  <td>{user.pass}</td>
                  <td>{user.phone}</td>
                  <td style={{ fontWeight: '600' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`status-badge ${user.status === "Aktif" ? "badge-active" : "badge-inactive"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div className="action-buttons">
                      <button className="action-btn" title="Ganti Password">🔑</button>
                      <button className="action-btn" title="Edit Profil">📝</button>
                      <button className="action-btn" title="Hapus Akun">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER TABEL (TOMBOL LIHAT SEMUA) */}
        <div className="table-footer" style={{ justifyContent: 'flex-start', marginTop: '10px' }}>
          <button 
            className="btn-outline" 
            style={{ border: 'none', color: '#3b82f6', padding: '0', textDecoration: 'underline' }} 
            onClick={() => navigate("/datauser")}
          >
            Lihat selengkapnya
          </button>
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;