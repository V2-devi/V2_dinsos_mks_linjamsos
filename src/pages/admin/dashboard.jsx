import React from "react";
import "./dashboard.css";
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function Admin() {
  // Data sementara (dummy) sesuai dengan gambar desain Anda
  const dummyData = [
    { nik: "7370999999999999", pass: "firli12", phone: "089999999999", name: "Devi Permata", email: "deviper@gmail.com", address: "Gowa", status: "Aktif" },
    { nik: "7370888888888888", pass: "dev12", phone: "08888888888", name: "Firliany", email: "firli@gmail.com", address: "Gowa", status: "Aktif" },
    { nik: "7370111111111111", pass: "angel11", phone: "0877777777", name: "Angel", email: "angell@gmail.com", address: "Makassar", status: "Tidak Aktif" },
    { nik: "7370222222222222", pass: "put123", phone: "0866666666", name: "Putri Matcha", email: "matcha@gmail.com", address: "Makassar", status: "Tidak Aktif" },
  ];

  return (
    <div className="admin-container">
      {/* NAVBAR */}
      <nav className="admin-navbar">
        <div className="navbar-left">
          
          <div className="nav-logo">
            <img src={logoLinjamsos} alt="Logo Linjamsos" className="logo-image-small"/>             
          </div>
          
          <span className="nav-title">PERLINDUNGAN DAN JAMINAN SOSIAL</span>
        </div>
        <div className="navbar-right">
          <button className="nav-logout-btn">Keluar</button>
          <button className="nav-bell-btn">
            {/* Ikon Lonceng Sederhana menggunakan SVG */}
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="admin-content">
        
        {/* WELCOME BANNER */}
        <div className="welcome-banner">
          <div className="banner-text">
            <h2>SELAMAT DATANG FIRLIANY FIRDAUS</h2>
            <button className="btn-light-outline">Lihat Akun Anda →</button>
          </div>
          <div className="banner-icon">
            {/* Ikon User Lingkaran (Mirip desain) */}
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path>
              <circle cx="12" cy="12" r="11"></circle>
            </svg>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Pengguna Aktif</h3>
            <div className="stat-value text-green">123</div>
          </div>
          <div className="stat-card">
            <h3>Pengguna Tidak Aktif</h3>
            <div className="stat-value text-red">9</div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="table-section">
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
                  <th>Status Pegawai</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((user, index) => (
                  <tr key={index}>
                    <td>{user.nik}</td>
                    <td>{user.pass}</td>
                    <td>{user.phone}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>
                      <span className={`status-badge ${user.status === "Aktif" ? "badge-active" : "badge-inactive"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn text-yellow" title="Ganti Password">🔑</button>
                        <button className="action-btn text-gray" title="Edit">📝</button>
                        <button className="action-btn text-red" title="Hapus">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="table-footer">
            <button className="btn-outline">Lihat Selengkapnya →</button>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Admin;