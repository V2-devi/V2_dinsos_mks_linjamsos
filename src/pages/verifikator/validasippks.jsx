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

   // === KAMUS DATA KECAMATAN & KELURAHAN (FILTER DINAMIS) ===
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
                  {Object.keys(daftarWilayah).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
            
            <div className="filter-group-top">
              <label>Kelurahan</label>
              <div className="select-container-custom">
                <select name="kelurahan" value={filterPPKS.kelurahan} onChange={handleFilterPPKSChange} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}}>
                  <option value="">{filterPPKS.kecamatan ? "Semua Kelurahan" : "Pilih Kecamatan Dulu"}</option>
                  {filterPPKS.kecamatan && daftarWilayah[filterPPKS.kecamatan].map(kel => (
                    <option key={kel} value={kel}>{kel}</option>
                  ))}
                </select>
              </div>
                          </div>

            <div className="filter-group-top">
              <label>Nama</label>
              <input 
                type="text" 
                name="keyword" 
                value={filterPPKS.keyword} 
                onChange={handleFilterPPKSChange} 
                placeholder="Cari Nama..." 
                style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px', outline: 'none'}} 
              />
            </div>
          </div>

          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="verifikator-table">
                <thead>
                  <tr>
                    <th>NIK</th>
                    <th>Nama</th>
                    <th>Kategori PPKS</th>
                    <th>Kecamatan</th>
                    <th>Kelurahan</th>
                    <th>Lokasi Penemuan</th>
                    <th>Tanggal Laporan</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPpksList.length > 0 ? filteredPpksList.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nik || "-"}</td>
                      <td style={{ fontWeight: '600' }}>{item.nama_lengkap || "Tanpa Identitas"}</td>
                      <td>{item.kategori_ppks}</td>
                      <td>{item.kecamatan}</td>
                      <td>{item.kelurahan || "-"}</td>
                      <td>{item.lokasi_penemuan}</td>
                      <td>{item.tanggal_penemuan}</td>
                      <td style={{ textAlign: "center" }}>
                        <span className="badge-status-v waiting">{item.status_penanganan}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button className="btn-review-action" onClick={() => openValidationPPKSModal(item)}>Review</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>Tidak ada data.</td></tr>
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
                    <th>NIK</th>
                    <th>Nama</th>
                    <th>Kategori PPKS</th>
                    <th>Kecamatan</th>
                    <th>Kelurahan</th>
                    <th>Lokasi Penemuan</th>
                    <th>Tanggal Laporan</th>
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
                      <td>{item.kelurahan || "-"}</td>
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