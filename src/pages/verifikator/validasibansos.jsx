


import React from "react";

function ValidasiBansos({
  activeTab,
  setActiveTab,
  filterBansos,
  handleFilterBansosChange,
  filteredUsulanList,
  riwayatList,
  formatDateIndo,
  openValidationModal
}) {

  // KAMUS DATA KECAMATAN & KELURAHAN
  const daftarWilayah = {
    "Tallo": ["Buloa", "Bunga Eja Baru", "Kaluku Bodoa", "Kalukuang", "La'latang", "Lakkang", "Lembo", "Panampu", "Rappokalling", "Suangga", "Tallo", "Tammua", "Ujung Pandang Baru", "Wala-walaya"],
    "Tamalanrea": ["Tamalanrea", "Tamalanrea Indah", "Tamalanrea Jaya", "Kapasa", "Kapasa Raya", "Bira", "Parang Loe", "Buntusu"],
    "Biring Kanaya": ["Bakung", "Berua", "Bulurokeng", "Daya", "Katimbang", "Laikang", "Paccerakkang", "Pai", "Sudiang", "Sudiang raya", "Untia"],
    "Panakkukang": ["Karampuang", "Masale", "Pampang", "Panaikang", "Pandang", "Paropo", "Sinrijala", "Tamamaung"],
    "Tamalate": ["Balang Baru", "Barombong", "Bongaya", "Bonto Duri", "Jongaya", "Maccini Sombala", "Mangasa", "Mannuruki", "Pa'baeng-baeng", "Parang Tambung", "Tanjung Merdeka"]
  };

  return (
    <>
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === "menunggu" ? "active" : ""}`} onClick={() => setActiveTab("menunggu")}>Menunggu Validasi</button>
        <button className={`tab-btn ${activeTab === "riwayat" ? "active" : ""}`} onClick={() => setActiveTab("riwayat")}>Riwayat Validasi</button>
      </div>

      {activeTab === "menunggu" && (
        <div className="outline-box">
          <div className="alert-info-box warning" style={{ marginBottom: '25px', backgroundColor: '#fffbeb', border: '1px solid #fde047', borderRadius: '8px', padding: '16px', display: 'flex', gap: '15px' }}>
            <svg style={{color: '#d97706', flexShrink: 0}} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#b45309', fontSize: '15px' }}>Tugas Validasi Usulan Bansos</h4>
              <p style={{ margin: 0, color: '#b45309', fontSize: '13px' }}>Mohon periksa dengan teliti kelengkapan dokumen dan data yang diunggah oleh staf pengisi data sebelum memberikan persetujuan (Setuju/Tolak).</p>
            </div>
          </div>

          <div className="verifikator-filter-grid">
            <div className="filter-group-top">
              <label>Kecamatan</label>
              <div className="select-container-custom">
                <select name="kecamatan" value={filterBansos.kecamatan} onChange={handleFilterBansosChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}}>
                  <option value="">Semua Kecamatan</option>
                  {Object.keys(daftarWilayah).map((kec) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="filter-group-top">
              <label>Kelurahan/Desa</label>
              <div className="select-container-custom">
                <select name="kelurahan" value={filterBansos.kelurahan} onChange={handleFilterBansosChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}}>
                  <option value="">Semua Kelurahan</option>
                  {daftarWilayah[filterBansos.kecamatan]?.map((kel) => (
                    <option key={kel} value={kel}>{kel}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="filter-group-top">
              <label>NIK / Nama Kepala Keluarga</label>
              <input 
                type="text" 
                name="keyword" 
                value={filterBansos.keyword} 
                onChange={handleFilterBansosChange} 
                placeholder="Ketik NIK atau Nama..." 
                style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}} 
              />
            </div>
          </div>

          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="verifikator-table">
                <thead>
                  <tr>
                    <th>Nama Kepala Keluarga</th>
                    <th>NIK</th>
                    <th>No. KK</th>
                    <th>Kecamatan</th>
                    <th>Kelurahan</th>
                    <th>Tanggal Pengusulan</th>
                    <th>Alamat</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsulanList.length > 0 ? filteredUsulanList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600', color: '#1e293b' }}>{item.nama_kepala_keluarga}</td>
                      <td>{item.nik}</td>
                      <td>{item.no_kk || "-"}</td>
                      <td>{item.kecamatan}</td>
                      <td>{item.kelurahan}</td>
                      <td>{formatDateIndo(item.tanggal_usulan)}</td>
                      <td>{item.alamat || "-"}</td>
                      <td style={{ textAlign: "center" }}><span className="badge-status-v waiting">Menunggu Review</span></td>
                      <td style={{ textAlign: "center" }}>
                        <button className="btn-review-action" onClick={() => openValidationModal(item)}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Review
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada usulan baru yang sesuai pencarian.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "riwayat" && (
        <div className="outline-box">
          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="verifikator-table">
                <thead>
                  <tr>
                    <th>Nama Kepala Keluarga</th>
                    <th>NIK</th>
                    <th>No. KK</th>
                    <th>Kecamatan</th>
                    <th>Kelurahan</th>
                    <th>Tanggal Pengusulan</th>
                    <th style={{ textAlign: "center" }}>Status Keputusan</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayatList.length > 0 ? riwayatList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600', color: '#1e293b' }}>{item.nama_kepala_keluarga}</td>
                      <td>{item.nik}</td>
                      <td>{item.no_kk || "-"}</td>
                      <td>{item.kecamatan}</td>
                      <td>{item.kelurahan}</td>
                      <td>{formatDateIndo(item.tanggal_usulan)}</td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`badge-status-v ${item.status_pengusulan === 'Layak' ? 'approved' : 'rejected'}`}>
                          {item.status_pengusulan}
                        </span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '12px', maxWidth: '200px' }}>
                        {item.catatan_verifikator_bansos || "-"}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Belum ada riwayat validasi usulan bansos.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ValidasiBansos;