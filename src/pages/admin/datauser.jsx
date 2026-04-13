import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./datauser.css"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function DataUser() {
  const navigate = useNavigate();

  // === STATE NOTIFIKASI ===
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // === STATE DATA PENGGUNA (Bisa Diubah/Ditambah) ===
  const [users, setUsers] = useState([
    { id: 1, nik: "7370999999999999", nip: "198012122005", role: "Pengisi Data", pass: "firli12", phone: "089999999999", name: "Devi Permata", email: "deviper@gmail.com", address: "Gowa", status: "Aktif" },
    { id: 2, nik: "7270888888888888", nip: "198012122006", role: "Verifikator", pass: "dev12", phone: "088888888888", name: "Firliany", email: "firli@gmail.com", address: "Gowa", status: "Aktif" },
    { id: 3, nik: "3971371863193701", nip: "198012122007", role: "Pengisi Data", pass: "budi123", phone: "087777777777", name: "Budi Santoso", email: "budi@gmail.com", address: "Makassar", status: "Tidak Aktif" },
  ]);

  // === STATE FORM DATA (Untuk Tambah & Edit) ===
  const initialFormState = { id: null, nik: "", nip: "", role: "", pass: "", phone: "", name: "", email: "", address: "", status: "Aktif" };
  const [formData, setFormData] = useState(initialFormState);

  // === STATE MODAL POP-UP ===
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // === STATE FILTER & PENCARIAN ===
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [searchQuery, setSearchQuery] = useState("");

  // === LOGIKA FILTER ===
  const filteredUsers = users.filter((user) => {
    const matchStatus = filterStatus === "Semua Status" || user.status === filterStatus;
    const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.nik.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  // === HANDLER INPUT FORM ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // === HANDLER TAMBAH DATA ===
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newUser = { 
      ...formData, 
      id: Date.now() // Membuat ID unik sementara
    };
    setUsers([newUser, ...users]); // Masukkan data baru ke urutan paling atas
    setIsAddModalOpen(false);
    setFormData(initialFormState); // Kosongkan form
    showSuccess();
  };

  // === HANDLER EDIT DATA ===
  const openEditModal = (user) => {
    setFormData(user); // Isi form dengan data user yang diklik
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedUsers = users.map(u => (u.id === formData.id ? formData : u));
    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    setFormData(initialFormState);
    showSuccess();
  };

  // === HANDLER GANTI PASSWORD ===
  const handlePassSubmit = (e) => {
    e.preventDefault();
    setIsPassModalOpen(false);
    showSuccess();
  };

  // === HANDLER HAPUS DATA ===
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const remainingUsers = users.filter(u => u.id !== userToDelete.id);
    setUsers(remainingUsers);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    showSuccess();
  };

  // Tampilkan Notifikasi Sukses
  const showSuccess = () => {
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 2500);
  };

  return (
    <div className="admin-layout relative">
      
      {/* ================= NAVBAR ADMIN ================= */}
      <nav className="admin-navbar-dark">
        <div className="navbar-left">
          <div className="branding-container-small">
            <img src={logoLinjamsos} alt="Logo" className="branding-logo-small" />
            <div className="branding-text-block-small"><span>PERLINDUNGAN DAN</span><span>JAMINAN SOSIAL</span></div>
          </div>
        </div>
        <div className="navbar-right">
          <button className="nav-link-btn" onClick={() => navigate("/admin")}>Kembali Ke Halaman Utama</button>
          
          <div className="notif-wrapper">
            <button className="nav-bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </button>
            {isNotifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header"><h3>Pemberitahuan</h3></div>
                <div className="notif-body">
                  <div className="notif-item"><div className="notif-title-row"><h4>Sistem Admin</h4><span>Baru saja</span></div><p>Selamat datang di halaman kelola pengguna.</p></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isNotifOpen && <div className="notif-backdrop" onClick={() => setIsNotifOpen(false)}></div>}

      {/* ================= MAIN CONTENT ================= */}
      <main className="admin-main-content" style={{ maxWidth: '1300px' }}>
        
        {/* KOTAK FILTER & SEARCH */}
        <div className="filter-search-box-white">
          <div className="custom-select-box" style={{ width: '250px' }}>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="Semua Status">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
          <div className="custom-search-box" style={{ width: '350px' }}>
            <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Cari NIK atau Nama Staff ....." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* TOMBOL TAMBAH STAFF */}
        <div className="action-row-right">
          <button className="btn-add-staff" onClick={() => { setFormData(initialFormState); setIsAddModalOpen(true); }}>
            <span className="plus-icon">+</span> Tambah Staff
          </button>
        </div>

        {/* DATA TABLE */}
        <div className="table-wrapper">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr><th>NIK</th><th>Role</th><th>Kata Sandi</th><th>No.HP</th><th>Nama Lengkap</th><th>Email</th><th>Alamat</th><th style={{ textAlign: 'center' }}>Status Pegawai</th><th style={{ textAlign: "center" }}>Aksi</th></tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nik}</td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', backgroundColor: user.role === 'Verifikator' ? '#fef08a' : '#e0e7ff', color: user.role === 'Verifikator' ? '#a16207' : '#1d4ed8' }}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.pass}</td><td>{user.phone}</td><td style={{ fontWeight: '600' }}>{user.name}</td><td>{user.email}</td><td>{user.address}</td>
                      <td style={{ textAlign: 'center' }}><span className={`status-badge ${user.status === "Aktif" ? "badge-active" : "badge-inactive"}`}>{user.status}</span></td>
                      <td style={{ textAlign: "center" }}>
                        <div className="action-buttons-table">
                          <button className="action-btn-icon text-yellow" title="Ganti Password" onClick={() => setIsPassModalOpen(true)}>🔑</button>
                          <button className="action-btn-icon text-blue" title="Edit Profil" onClick={() => openEditModal(user)}>📝</button>
                          <button className="action-btn-icon text-red" title="Hapus Akun" onClick={() => openDeleteModal(user)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Tidak ada data pengguna yang ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ================= MODAL TAMBAH STAFF (INTERAKTIF) ================= */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg><h2>Tambah Staff Baru</h2></div>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSubmit}>
                
                <div className="modal-section">
                  <h3 className="section-subtitle">Informasi Login & Role</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>NIP Pegawai</label><input type="text" name="nip" value={formData.nip} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>NIK KTP*</label><input type="text" name="nik" value={formData.nik} onChange={handleInputChange} required maxLength="16" /></div>
                    <div className="form-group-modal">
                      <label>Role / Posisi*</label>
                      <select name="role" value={formData.role} onChange={handleInputChange} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}>
                        <option value="" disabled hidden>Pilih Role</option>
                        <option value="Pengisi Data">Pengisi Data</option>
                        <option value="Verifikator">Verifikator</option>
                      </select>
                    </div>
                    <div className="form-group-modal"><label>Kata Sandi Sementara*</label><input type="text" name="pass" value={formData.pass} onChange={handleInputChange} required /></div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi Staff</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Email Aktif*</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>No. WhatsApp*</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Alamat / Domisili*</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} required /></div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Status Akun</h3>
                  <div className="form-group-modal">
                    <div className="radio-group-inline">
                      <label className="radio-label"><input type="radio" name="status" value="Aktif" checked={formData.status === "Aktif"} onChange={handleInputChange} /><span>Aktif</span></label>
                      <label className="radio-label"><input type="radio" name="status" value="Tidak Aktif" checked={formData.status === "Tidak Aktif"} onChange={handleInputChange} /><span>Tidak Aktif</span></label>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsAddModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit">Buat Akun</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT STAFF (INTERAKTIF) ================= */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg><h2>Edit Profil Staff</h2></div>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                
                <div className="modal-section">
                  <h3 className="section-subtitle">Informasi Akun</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>NIP Pegawai</label><input type="text" name="nip" value={formData.nip} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal">
                      <label>Role / Posisi*</label>
                      <select name="role" value={formData.role} onChange={handleInputChange} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}>
                        <option value="Pengisi Data">Pengisi Data</option>
                        <option value="Verifikator">Verifikator</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi Staff</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Email Aktif*</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>No. WhatsApp*</label><input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Alamat / Domisili*</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} required /></div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Status Akun</h3>
                  <div className="form-group-modal">
                    <div className="radio-group-inline">
                      <label className="radio-label"><input type="radio" name="status" value="Aktif" checked={formData.status === "Aktif"} onChange={handleInputChange} /><span>Aktif</span></label>
                      <label className="radio-label"><input type="radio" name="status" value="Tidak Aktif" checked={formData.status === "Tidak Aktif"} onChange={handleInputChange} /><span>Tidak Aktif</span></label>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsEditModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL GANTI PASSWORD ================= */}
      {isPassModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPassModalOpen(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title"><span style={{ fontSize: '20px' }}>🔑</span><h2>Ganti Kata Sandi</h2></div>
            </div>
            <div className="modal-body">
              <form onSubmit={handlePassSubmit}>
                <div className="form-group-modal" style={{ marginBottom: '15px' }}><label>Kata Sandi Baru*</label><input type="password" required /></div>
                <div className="form-group-modal" style={{ marginBottom: '25px' }}><label>Konfirmasi Kata Sandi Baru*</label><input type="password" required /></div>
                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsPassModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL HAPUS AKUN (INTERAKTIF) ================= */}
      {isDeleteModalOpen && userToDelete && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content modal-small text-center" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body" style={{ padding: '40px 20px 30px' }}>
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>🗑️</div>
              <h2 style={{ color: '#234a66', fontSize: '20px', marginBottom: '10px' }}>Hapus Akun Pengguna?</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>
                Apakah Anda yakin ingin menghapus akun milik <strong>{userToDelete.name}</strong>?<br/>Data yang telah dihapus tidak dapat dikembalikan.
              </p>
              <div className="modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsDeleteModalOpen(false)}>Batal</button>
                <button type="button" className="btn-modal-danger" onClick={confirmDelete}>Ya, Hapus Akun</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SUKSES UMUM ================= */}
      {isSuccessModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="modal-content" style={{maxWidth: '400px', borderTop: '8px solid #22c55e', borderRadius: '8px', overflow:'hidden'}}>
            <div className="modal-body text-center" style={{ padding: '40px 20px', backgroundColor: '#f8fafc' }}>
              <div style={{width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)'}}>
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 style={{ color: '#1e293b', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Berhasil!</h2>
              <p style={{ color: '#475569', fontSize: '14px', fontWeight: '500', margin: '0' }}>Data sistem telah diperbarui.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DataUser;