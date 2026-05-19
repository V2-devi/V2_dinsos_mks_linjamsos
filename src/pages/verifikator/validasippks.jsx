import React from "react";

function ValidasiPPKS({
  activeTab,
  setActiveTab,
  filterPPKS,
  handleFilterPPKSChange,
  filteredPpksList,
  riwayatPpksList,
  formatDateIndo,
  openValidationPPKSModal
}) {
  return (
    <>
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === "menunggu" ? "active" : ""}`} onClick={() => setActiveTab("menunggu")}>Menunggu Validasi PPKS</button>
        <button className={`tab-btn ${activeTab === "riwayat" ? "active" : ""}`} onClick={() => setActiveTab("riwayat")}>Riwayat Validasi</button>
      </div>

      {activeTab === "menunggu" && (
        <div className="outline-box">
          <div className="alert-info-box warning" style={{ marginBottom: '25px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', display: 'flex', gap: '15px' }}>
            <svg style={{color: '#2563eb', flexShrink: 0}} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#1e3a8a', fontSize: '15px' }}>Tugas Validasi Laporan Kasus PPKS</h4>
              <p style={{ margin: 0, color: '#1e3a8a', fontSize: '13px' }}>Tinjau laporan penemuan dari tim lapangan. Berikan hasil asesmen atau instruksi penanganan jika kasus ini valid, lalu setujui untuk mengubahnya menjadi "Kasus Aktif".</p>
            </div>
          </div>

          <div className="verifikator-filter-grid">
            <div className="filter-group-top">
              <label>Kategori PPKS</label>
              <div className="select-container-custom">
                <select name="kategori" value={filterPPKS.kategori_ppks} onChange={handleFilterPPKSChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}}>
                  <option value="">Semua Kategori</option>
                  <option value="Anak Balita Terlantar">Anak Balita Terlantar</option>
                  <option value="Anak Terlantar">Anak Terlantar</option>
                  <option value="Anak yang Berhadapan dengan Hukum">Anak yang Berhadapan dengan Hukum</option>
                  <option value="Anak Jalanan">Anak Jalanan</option>
                  <option value="Anak dengan Disabilitas">Anak dengan Disabilitas</option>
                  <option value="Anak yang Menjadi Korban Tindak Kekerasan">Anak yang Menjadi Korban Tindak Kekerasan</option>
                  <option value="Anak yang Memerlukan Perlindungan Khusus">Anak yang Memerlukan Perlindungan Khusus</option>
                  <option value="Lanjut Usia Terlantar">Lanjut Usia Terlantar</option>
                  <option value="Penyandang Disabilitas">Penyandang Disabilitas</option>
                  <option value="Tunasusila">Tunasusila</option>
                  <option value="Gelandangan">Gelandangan</option>
                  <option value="Pengemis">Pengemis</option>
                  <option value="Pemulung">Pemulung</option>
                  <option value="Kelompok Minoritas">Kelompok Minoritas</option>
                  <option value="Bekas Warga Binaan Lembaga Permasyarakatan">Bekas Warga Binaan Lembaga Permasyarakatan</option>
                  <option value="Orang dengan HIV/AIDS">Orang dengan HIV/AIDS</option>
                  <option value="Korban Penyalahgunaan NAPZA">Korban Penyalahgunaan NAPZA</option>
                  <option value="Korban Trafficking">Korban Trafficking</option>
                  <option value="Korban Tindak Kekerasan">Korban Tindak Kekerasan</option>
                  <option value="Pekerja Migran Bermasalah Sosial">Pekerja Migran Bermasalah Sosial</option>
                  <option value="Korban Bencana Alam">Korban Bencana Alam</option>
                  <option value="Korban Bencana Sosial">Korban Bencana Sosial</option>
                  <option value="Perempuan Rawan Sosial Ekonomi">Perempuan Rawan Sosial Ekonomi</option>
                  <option value="Fakir Miskin">Fakir Miskin</option>
                  <option value="Keluarga Bermasalah Sosial Psikologi">Keluarga Bermasalah Sosial Psikologi</option>
                  <option value="Komunitas Adat Terpencil">Komunitas Adat Terpencil</option>
                </select>
              </div>
            </div>
            
            <div className="filter-group-top">
              <label>Kecamatan</label>
              <div className="select-container-custom">
                <select name="kecamatan" value={filterPPKS.kecamatan} onChange={handleFilterPPKSChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}}>
                  <option value="">Semua Kecamatan</option>
                  <option value="Tallo">Tallo</option>
                  <option value="Bontoala">Bontoala</option>
                  <option value="Panakkukang">Panakkukang</option>
                </select>
              </div>
            </div>
            
            <div className="filter-group-top">
              <label>Nama / Identitas (NIK)</label>
              <input 
                type="text" 
                name="keyword" 
                value={filterPPKS.keyword} 
                onChange={handleFilterPPKSChange} 
                placeholder="Cari NIK atau Nama..." 
                style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}} 
              />
            </div>
          </div>

          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="verifikator-table">
                <thead>
                  <tr>
                    <th>Nama / Identitas</th>
                    <th>Kategori PPKS</th>
                    <th>Kecamatan</th>
                    <th>Lokasi Penemuan</th>
                    <th>Tgl Laporan</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPpksList.length > 0 ? filteredPpksList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600' }}>
                        {item.nama_lengkap || "Tanpa Identitas"}<br/>
                        <span style={{fontSize:'11px', color:'#64748b', fontWeight:'normal'}}>NIK: {item.nik || "-"}</span>
                      </td>
                      <td>{item.kategori_ppks}</td>
                      <td>{item.kecamatan}</td>
                      <td>{item.lokasi_penemuan}</td>
                      <td>{formatDateIndo(item.tanggal_laporan)}</td>
                      <td style={{ textAlign: "center" }}><span className="badge-status-v waiting">Menunggu Review</span></td>
                      <td style={{ textAlign: "center" }}>
                        <button className="btn-review-action" onClick={() => openValidationPPKSModal(item)}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Review
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada laporan PPKS yang sesuai pencarian.</td></tr>
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
                    <th>Nama / Identitas</th>
                    <th>Kategori PPKS</th>
                    <th>Kecamatan</th>
                    <th>Lokasi Penemuan</th>
                    <th>Tgl Laporan</th>
                    <th style={{ textAlign: "center" }}>Status Keputusan</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayatPpksList.length > 0 ? riwayatPpksList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600' }}>
                        {item.nama_lengkap || "Tanpa Identitas"}<br/>
                        <span style={{fontSize:'11px', color:'#64748b', fontWeight:'normal'}}>NIK: {item.nik || "-"}</span>
                      </td>
                      <td>{item.kategori}</td>
                      <td>{item.kecamatan}</td>
                      <td>{item.lokasi_penemuan}</td>
                      <td>{formatDateIndo(item.tanggal_laporan)}</td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`badge-status-v ${item.status_penanganan === 'Kasus Aktif' ? 'approved' : 'rejected'}`}>
                          {item.status_penanganan}
                        </span>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '12px', maxWidth: '200px' }}>
                        {item.catatan_verifikator || "-"}
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Belum ada riwayat validasi PPKS.</td></tr>
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

export default ValidasiPPKS;