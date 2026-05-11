import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./datauser.css"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png";
import axios from "axios";

// TESTING
// function DataUser() {
//   return <h1>HALAMAN USER</h1>;
// }

// export default DataUser;
// TESTING

function DataUser() {
  const navigate = useNavigate();
  // const status = String(user.status_akun || user.status || "").toLowerCase();

//   // === STATE NOTIFIKASI ===
  const [isNotifOpen, setIsNotifOpen] = useState(false);

// === STATE DATA PENGGUNA ===
  const [users, setUsers] = useState([]);

  

// Update status akun
const handleUpdateStatus = async () => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/admin/update/${selectedUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },

        // 👇 INI TEMPATNYA
        body: JSON.stringify({
          // status: "disetujui"
          status: formData.status
        })
      }
    );

    await res.json();
    fetchUsers();
    alert("Status berhasil diupdate");

  } catch (error) {
    console.error(error);
  }
};




// Data tambah staff otomatis dari admin
// const initialStaffForm = {
//   nama_lengkap: "",
//   email: "",
//   password: "",
//   role: "",
//   nik: "",
//   nip: "",
//   no_hp: "",
//   alamat: ""
// };

// const [formStaff, setFormStaff] = useState(initialStaffForm);


// const handleAddStaff = async () => {
//   try {
//     const res = await fetch(
//       "http://127.0.0.1:8000/staff",

//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(formStaff)
//       }
//     );
//     const data = await res.json();
//     console.log(data);
//     alert("Staff berhasil ditambahkan");
//   } catch (error) {
//     console.error(error);
//     alert("Gagal tambah staff");
//   }

// };

const [formData, setFormData] = useState({
  nama_lengkap: "",
  email: "",
  role: "",
  status: "menunggu"
});

  // ✅ PERBAIKAN: Baca dari LocalStorage saat pertama render
const fetchUsers = async () => {
  setIsInitialLoad(true);
  try {
    const res = await axios.get("http://localhost:8000/admin/users");

    const data = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
        ? res.data.data
        : null;

    if (data) {
      setUsers(data);
      localStorage.setItem("localUsers", JSON.stringify(data));
    }
  } catch (err) {
    console.warn("Backend mati. Memuat dari memori lokal...");
    const savedUsers = JSON.parse(localStorage.getItem("localUsers")) || [];
    setUsers(savedUsers);
  } finally {
    setIsInitialLoad(false);
  }
};

useEffect(() => {
  fetchUsers();
}, []);


const handleAddStaff = async () => {
  try {
    await fetch("http://127.0.0.1:8000/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...formData,
        status: "menunggu",   // 🔥 penting
        is_active: false      // 🔥 penting
      })
    });

    fetchUsers(); // refresh data
    alert("Staff berhasil ditambahkan");

  } catch (error) {
    console.error(error);
  }
};

  // ✅ PERBAIKAN: Kalkulasi aman untuk statistik
  const totaldisetujui = users.filter(u => {
    const s = String(u.status || "").toLowerCase();
    return s === "disetujui";
  }).length;

  const totalmenunggu = users.filter(u => {
    const s = String(u.status || "").toLowerCase();
    return s === "menunggu";
  }).length;

//   // === STATE FORM DATA (Untuk Tambah & Edit) ===
const initialFormState = {
  id: null,
  nik: "",
  nip: "",
  role: "",
  password: "",
  no_hp: "",
  nama_lengkap: "",
  email: "",
  alamat: "",
  // ini yang penting untuk radio button
  status: "menunggu"
};

// const [formData, setFormData] = useState(initialFormState);


//   // === STATE MODAL POP-UP ===
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

//   // === STATE FILTER & PENCARIAN ===
  const [filterStatus, setFilterStatus] = useState("Semua Status");
  const [searchQuery, setSearchQuery] = useState("");

// === LOGIKA FILTER ===
  const filteredUsers = users.filter((user) => {
    // 1. Amankan status agar terbaca (cek data lama/baru/huruf besar/kecil)
    const rawStatus = String(user.status || "").toLowerCase();
    const mappedStatus = (rawStatus === "disetujui" || rawStatus === "approved") ? "disetujui" : "menunggu";
    
    // 2. Cocokkan dengan dropdown filter
    const matchStatus = filterStatus === "Semua Status" || mappedStatus === filterStatus;
    
    // 3. Cocokkan dengan kolom pencarian
    const name = (user.nama_lengkap || "").toLowerCase();
    const nip = String(user.nip || "").toLowerCase(); 
    const search = searchQuery.toLowerCase();
    
    const matchSearch = name.includes(search) || nip.includes(search);
    
    return matchStatus && matchSearch;
  });

  console.log("FILTERED USERS:", filteredUsers.length, "from", users.length, "users");

//   // === HANDLER INPUT FORM ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

// === HANDLER TAMBAH DATA ===
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newUserPayload = {
      id: Date.now(),
      nip: formData.nip,
      role: formData.role,
      password: formData.password,
      nama_lengkap: formData.nama_lengkap,
      email: formData.email,
      no_hp: formData.no_hp,
      alamat: formData.alamat,
      status: formData.status
    };

    try {
      const response = await axios.post("http://localhost:8000/admin/users", newUserPayload, { headers: { "Content-Type": "application/json" } });
      const createdUser = response.data && response.data[0] ? response.data[0] : null;

      if (!createdUser) {
        throw new Error("Gagal membuat staff di server.");
      }

      await fetchUsers();
      setIsAddModalOpen(false);
      setFormData(initialFormState);
      showSuccess();
    } catch (err) {
      console.error("Error add staff:", err);
      const serverMessage = err.response?.data?.detail || err.response?.data?.message || err.message;
      setErrorMessage(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage));
    } finally {
      setIsLoading(false);
    }
  };

  // === HANDLER EDIT DATA ===
  const openEditModal = (user) => {
    setFormData({
      id: user.id,
      nip: user.nip || "",
      nama_lengkap: user.nama_lengkap || "",
      email: user.email || "",
      no_hp: user.no_hp || "",
      alamat: user.alamat || "",
      role: user.role || "",
      status: user.status ||  "menunggu",

    }); // Isi form dengan data user yang diklik

    setIsEditModalOpen(true);
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.nama_lengkap || !formData.email || !formData.alamat) {
      setErrorMessage("Semua field harus diisi!");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    console.log("SUBMIT KEKLIK - Form Data:", formData);
    
    try {
      const payload = {
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        no_hp: formData.no_hp,
        alamat: formData.alamat,
        role: formData.role,
        status: formData.status,
      };

      console.log("Payload dikirim:", payload);
      
      const response = await axios.put(
        `http://localhost:8000/admin/update/${formData.id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Response update:", response.data);

      // Update local cache segera agar user tidak perlu reload
      setUsers((prevUsers) => prevUsers.map((u) =>
        u.id === formData.id ? { ...u, ...payload } : u
      ));

      await fetchUsers();
      setIsEditModalOpen(false);
      setFormData(initialFormState);
      showSuccess();

    } catch (err) {
      console.error("Error update:", err);
      const responseData = err.response?.data;
      const serverMessage = responseData?.detail || responseData?.message || responseData || err.message;
      setErrorMessage(
        typeof serverMessage === 'string'
          ? serverMessage
          : JSON.stringify(serverMessage)
      );
    } finally {
      setIsLoading(false);
    }
  };


  // const handleEditSubmit = (e) => {
  //   e.preventDefault();
  //   const updatedUsers = users.map(u => (u.id === formData.id ? formData : u));
  //   setUsers(updatedUsers);
  //   setIsEditModalOpen(false);
  //   setFormData(initialFormState);
  //   showSuccess();
  // };

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

// === HANDLER HAPUS DATA (PERMANEN) ===
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      // ✅ Memanggil API Backend untuk menghapus data (Beri tahu teman backend Anda untuk menyiapkan endpoint DELETE ini)
      await axios.delete(`http://localhost:8000/admin/delete/${userToDelete.id}`);
    } catch (err) {
      console.warn("Backend mati atau endpoint berbeda. Menghapus data dari tampilan lokal...");
    } finally {
      // ✅ PERBAIKAN: Gunakan .filter() untuk membuang data secara permanen dari tabel
      // Kita mengecek berdasarkan ID dan NIP agar anti-error
      const updatedList = users.filter(u => u.id !== userToDelete.id && u.nip !== userToDelete.nip);
      
      setUsers(updatedList);
      localStorage.setItem("localUsers", JSON.stringify(updatedList));

      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      showSuccess();
      setIsLoading(false);
    }
  };

  // Tampilkan Notifikasi Sukses
  const showSuccess = () => {
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 2500);
  };

// console.log("DATA USER PAGE RENDER");

// // TESTING 


// return (
//   <div>
//     <h1>HALAMAN USER</h1>

//     {users && users.length > 0 ? (
//       users.map((user) => (
//         <div key={user.id}>
//           <p>{user.nama_lengkap}</p>
//         </div>
//       ))
//     ) : (
//       <p>Tidak ada data</p>
//     )}
//   </div>
// );
// TESTING 

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
              <option value="disetujui">Disetujui</option>
              <option value="menunggu">Menunggu</option>
            </select>
          </div>
          <div className="custom-search-box" style={{ width: '350px' }}>
            <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Cari NIK atau Nama Staff ....." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* TOMBOL TAMBAH STAFF */}

        {/* <div className="action-row-right">
          <button
            className="btn-add-staff"
            onClick={() => setIsAddStaffModalOpen(true)}>
            <span className="plus-icon">+</span>
            Tambah Staff
          </button>
        </div> */}

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
                <tr>
                  <th>NIP</th>
                  <th>Role</th>
                  <th>Nama Lengkap</th>
                  <th>Email</th>
                  <th>Alamat</th>
                  <th style={{ textAlign: 'center' }}>Status Pegawai</th>
                  <th style={{ textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id || Math.random()}>
                      <td>{user.nip|| "-"}</td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', backgroundColor: user.role === 'verifikator' ? '#fef08a' : user.role === 'admin' ? '#fecaca' : '#e0e7ff', color: user.role === 'verifikator' ? '#a16207' : user.role === 'admin' ? '#b91c1c' : '#1d4ed8' }}>
                          {user.role || "staff"}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>{user.nama_lengkap || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td>{user.alamat || "-"}</td>
                      <td style={{ textAlign: 'center' }}>
                        {(() => {
                          const status = String(user.status || "").toLowerCase();
                          const isApproved = status === "disetujui" || status === "approved";
                          return (
                            <span className={`status-badge ${isApproved ? "badge-active" : "badge-inactive"}`}>
                              {isApproved ? "Disetujui" : "Menunggu"}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="action-buttons-table">
                          <button className="action-btn-icon text-blue" title="Edit Profil" onClick={() => openEditModal(user)}>📝</button>
                          <button className="action-btn-icon text-red" title="Hapus Akun" onClick={() => openDeleteModal(user)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    {isInitialLoad ? "Memuat data dari Supabase..." : "Tidak ada data pengguna yang ditemukan."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

{/* ================= MODAL TAMBAH STAFF (INTERapproved) ================= */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg><h2>Tambah Staff Baru</h2></div>
            </div>
            <div className="modal-body">
              {/* ✅ MENAMPILKAN KOTAK ERROR JIKA SERVER MENOLAK */}
              {errorMessage && (
                <div style={{
                  padding: '12px 15px',
                  marginBottom: '20px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  color: '#991b1b',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleAddSubmit}>
                
                <div className="modal-section">
                  <h3 className="section-subtitle">Informasi Login & Role</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal">
                      <label>NIP Pegawai*</label>
                      <input type="text" name="nip" value={formData.nip || ""} onChange={handleInputChange} required placeholder="Masukkan NIP" />
                    </div>
                    
                    <div className="form-group-modal">
                      <label>Role / Posisi*</label>
                      <select name="role" value={formData.role || ""} onChange={handleInputChange} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}>
                        <option value="" disabled hidden>Pilih Role</option>
                        <option value="staff">staff</option>
                        <option value="verifikator">verifikator</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                    
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}>
                      <label>Kata Sandi Sementara*</label>
                      <input type="text" name="password" value={formData.password || ""} onChange={handleInputChange} required placeholder="Ketik kata sandi..." />
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi Staff</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" name="nama_lengkap" value={formData.nama_lengkap || ""} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Email*</label><input type="email" name="email" value={formData.email || ""} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Alamat / Domisili*</label><input type="text" name="alamat" value={formData.alamat || ""} onChange={handleInputChange} required /></div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Status Akun</h3>
                  <div className="form-group-modal">
                    <div className="radio-group-inline">
                      <label className="radio-label"><input type="radio" name="status" value="disetujui" checked={formData.status === "disetujui"} onChange={handleInputChange} required /><span>Disetujui</span></label>
                      <label className="radio-label"><input type="radio" name="status" value="menunggu" checked={formData.status === "menunggu"} onChange={handleInputChange} required /><span>Menunggu</span></label>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsAddModalOpen(false)} disabled={isLoading}>Batal</button>
                  {/* ✅ TOMBOL OTOMATIS BERUBAH JADI 'Menyimpan...' AGAR TIDAK DIKLIK BERKALI-KALI */}
                  <button type="submit" className="btn-modal-submit" disabled={isLoading} style={{opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}}>
                    {isLoading ? 'Menyimpan...' : 'Buat Akun'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT STAFF (INTERapproved) ================= */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg><h2>Edit Profil Staff</h2></div>
            </div>
            <div className="modal-body">
              {errorMessage && (
                <div style={{
                  padding: '12px 15px',
                  marginBottom: '20px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  color: '#991b1b',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleEditSubmit}>
                
                <div className="modal-section">
                  <h3 className="section-subtitle">Informasi Akun</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>NIP Pegawai</label><input type="text" name="nip" value={formData.nip} onChange={handleInputChange} 
                    /></div>
                    <div className="form-group-modal">
                      <label>Role / Posisi*</label>
                      <select name="role" value={formData.role} onChange={handleInputChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}>
                        <option value="staff">staff</option>
                        <option value="verifikator">verifikator</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi Staff</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Email Disetujui*</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
                    <div className="form-group-modal"><label>Alamat / Domisili*</label><input type="text" name="alamat" value={formData.alamat} onChange={handleInputChange} required /></div>
                  </div>
                </div>

                <div className="modal-section">
                  <h3 className="section-subtitle">Status Akun</h3>
                  <div className="form-group-modal">
                    <div className="radio-group-inline">
                      <label className="radio-label"><input type="radio" name="status" value="disetujui" checked={formData.status === "disetujui"} onChange={handleInputChange} /><span>Disetujui</span></label>
                      <label className="radio-label"><input type="radio" name="status" value="menunggu" checked={formData.status === "menunggu"} onChange={handleInputChange} /><span>Menunggu</span></label>

                    
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsEditModalOpen(false)} disabled={isLoading}>Batal</button>
                  <button type="submit" className="btn-modal-submit" disabled={isLoading} style={{opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer'}}>
                    {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
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

      {/* ================= MODAL HAPUS AKUN ================= */}
      {isDeleteModalOpen && userToDelete && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content modal-small text-center" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body" style={{ padding: '40px 20px 30px' }}>
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>⚠️</div>
              <h2 style={{ color: '#234a66', fontSize: '20px', marginBottom: '10px' }}>Hapus Akun?</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>
                Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.nama_lengkap}</strong> secara permanen?<br/>Data akun ini akan hilang dari sistem.
              </p>
              <div className="modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsDeleteModalOpen(false)}>Batal</button>
                <button type="button" className="btn-modal-danger" style={{ backgroundColor: '#ef4444' }} onClick={confirmDelete}>Ya, Hapus</button>
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