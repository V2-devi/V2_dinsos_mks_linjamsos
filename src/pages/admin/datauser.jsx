import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./datauser.css"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function DataUser() {
  const navigate = useNavigate();

  // === STATE POP-UP ===
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // === STATE FILTER ===
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [searchQuery, setSearchQuery] = useState("");

  const notifData = [{ id: 1, title: "Pengusulan Akun", date: "15/09", desc: "Segera lakukan pembuatan akun yang telah diusulkan." }];

  // DATA DUMMY
  const dummyData = [
    { id: 1, nik: "09283197092980371", pass: "edwfdqde", phone: "089999999999", name: "Devi Permata", email: "deviper@gmail.com", address: "bumi", status: "Aktif", role: "Pengisi Data" },
    { id: 2, nik: "273297309183103173", pass: "dqqqecdx", phone: "084323552322", name: "Angel", email: "wqdwcw@", address: "saasxaxs", status: "Aktif", role: "Verifikator" },
    { id: 3, nik: "3971371863193701", pass: "dqxqeqd", phone: "089657445265", name: "Putri", email: "saxa@", address: "saas", status: "Tidak Aktif", role: "Pengisi Data" },
  ];

  // LOGIKA FILTER
  const filteredData = dummyData.filter((user) => {
    const matchStatus = filterStatus === "Semua Status" || user.status === filterStatus;
    const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.nik.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  const handleFormSubmit = (e, closeModal) => {
    e.preventDefault();
    closeModal(false);
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 3000);
  };

  return (
    <div className="admin-layout relative">
      
      {/* NAVBAR */}
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
                  {notifData.map(n => (<div className="notif-item" key={n.id}><div className="notif-title-row"><h4>{n.title}</h4><span>{n.date}</span></div><p>{n.desc}</p></div>))}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isNotifOpen && <div className="notif-backdrop" onClick={() => setIsNotifOpen(false)}></div>}

      {/* MAIN CONTENT */}
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
          <button className="btn-add-staff" onClick={() => setIsAddModalOpen(true)}>
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
                {filteredData.length > 0 ? (
                  filteredData.map((user) => (
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
                          <button className="action-btn-icon text-gray" title="Edit Profil" onClick={() => setIsEditModalOpen(true)}>📝</button>
                          <button className="action-btn-icon text-red" title="Hapus Akun" onClick={() => setIsDeleteModalOpen(true)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Tidak ada data pengguna.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ================= 1. MODAL TAMBAH STAFF (KEMBALI LENGKAP) ================= */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                <h2>Tambah Staff</h2>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleFormSubmit(e, setIsAddModalOpen)}>
                
                <div className="modal-section">
                  <h3 className="section-subtitle">Informasi Login (Kredential)</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal">
                      <label>NIK*</label>
                      <input type="text" placeholder="16 digit angka" required />
                    </div>
                    {/* INI FITUR ROLE BARU YANG DISISIPKAN DENGAN RAPI */}
                    <div className="form-group-modal">
                      <label>Role / Posisi*</label>
                      <div className="custom-select-box" style={{ width: '100%' }}>
                        <select required defaultValue="" style={{ width: '100%', backgroundColor: '#f8fafc' }}>
                          <option value="" disabled hidden>Pilih role</option>
                          <option value="pengisi_data">Pengisi Data</option>
                          <option value="verifikator">Verifikator</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group-modal">
                      <label>Kata Sandi*</label>
                      <input type="password" placeholder="Minimal 8 Karakter" required />
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi Staff</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" placeholder="Contoh: FIRLIANY FIRDAUS" required /></div>
                    <div className="form-group-modal"><label>Email Aktif*</label><input type="email" placeholder="contohfirly@gmail.com" required /></div>
                    <div className="form-group-modal"><label>Alamat*</label><input type="text" placeholder="Jln.nn" required /></div>
                    <div className="form-group-modal"><label>No.HP*</label><input type="text" placeholder="+62xxxxxxxxxxxx" required /></div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Instansi dan Status</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Instansi*</label><input type="text" defaultValue="Dinas Sosial Kota Makassar" readOnly className="input-readonly" /></div>
                    <div className="form-group-modal">
                      <label>Status Akun*</label>
                      <div className="radio-group" style={{ flexDirection: 'row' }}>
                        <label className="radio-label"><input type="radio" name="statusAkunAdd" value="Aktif" defaultChecked /><span>Aktif</span></label>
                        <label className="radio-label"><input type="radio" name="statusAkunAdd" value="Tidak Aktif" /><span>Tidak Aktif</span></label>
                      </div>
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

      {/* ================= 2. MODAL EDIT PROFIL (KEMBALI LENGKAP) ================= */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <h2>Edit Profil</h2>
              </div>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleFormSubmit(e, setIsEditModalOpen)}>
                
                <div className="modal-section">
                  <h3 className="section-subtitle">Informasi Login (Kredential)</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>NIK*</label><input type="text" defaultValue="09283197092980371" required /></div>
                    <div className="form-group-modal">
                      <label>Role / Posisi*</label>
                      <div className="custom-select-box" style={{ width: '100%' }}>
                        <select required defaultValue="Pengisi Data" style={{ width: '100%', backgroundColor: '#f8fafc' }}>
                          <option value="Pengisi Data">Pengisi Data</option>
                          <option value="Verifikator">Verifikator</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group-modal"><label>Kata Sandi*</label><input type="password" defaultValue="edwfdqde" required /></div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi Staff</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" defaultValue="Devi Permata" required /></div>
                    <div className="form-group-modal"><label>Email Aktif*</label><input type="email" defaultValue="deviper@gmail.com" required /></div>
                    <div className="form-group-modal"><label>NIP*</label><input type="text" defaultValue="198012122005012001" required /></div>
                    <div className="form-group-modal"><label>No.HP*</label><input type="text" defaultValue="089999999999" required /></div>
                    <div className="form-group-modal" style={{ gridColumn: "1 / -1" }}><label>Alamat*</label><input type="text" defaultValue="Gowa" required /></div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Instansi dan Status</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Instansi*</label><input type="text" defaultValue="Dinas Sosial Kota Makassar" readOnly className="input-readonly" /></div>
                    <div className="form-group-modal"><label>Nama Kepala Dinas*</label><input type="text" defaultValue="Andi Pangeran" required /></div>
                    <div className="form-group-modal"><label>Alamat Instansi*</label><input type="text" defaultValue="Jl. A.R. Hakim Makassar" required /></div>
                    <div className="form-group-modal"><label>NIP Kepala Dinas*</label><input type="text" defaultValue="197508082001121002" required /></div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsEditModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit">Simpan Data</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. MODAL GANTI PASSWORD (KEMBALI ORIGINAL) ================= */}
      {isPassModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPassModalOpen(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title"><span style={{ fontSize: '20px' }}>🔑</span><h2>Ganti Kata Sandi</h2></div>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => handleFormSubmit(e, setIsPassModalOpen)}>
                <div className="form-group-modal" style={{ marginBottom: '15px' }}>
                  <label>Kata Sandi Baru*</label>
                  <input type="password" required />
                </div>
                <div className="form-group-modal" style={{ marginBottom: '25px' }}>
                  <label>Konfirmasi Kata Sandi Baru*</label>
                  <input type="password" required />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsPassModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. MODAL HAPUS AKUN (KEMBALI ORIGINAL) ================= */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content modal-small text-center" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body" style={{ padding: '40px 20px 30px' }}>
              <div className="warning-icon-large">🗑️</div>
              <h2 style={{ color: '#234a66', fontSize: '20px', marginBottom: '10px' }}>Hapus Akun Pengguna?</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>
                Apakah Anda yakin ingin menghapus akun pegawai ini?<br/>Data yang telah dihapus tidak dapat dikembalikan.
              </p>
              <div className="modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsDeleteModalOpen(false)}>Batal</button>
                <button type="button" className="btn-modal-danger" onClick={() => setIsDeleteModalOpen(false)}>Ya, Hapus</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SUKSES UMUM ================= */}
      {isSuccessModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="modal-content modal-success text-center" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body" style={{ padding: '40px 20px' }}>
              <div className="success-icon-circle"><svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></div>
              <h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Berhasil!</h2>
              <p style={{ color: '#475569', fontSize: '13px', fontWeight: '500', margin: '0' }}>Aksi Anda berhasil diproses oleh sistem.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DataUser;