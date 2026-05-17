import React from "react";

function PenentuanDesil({
  activeTab,
  setActiveTab,
  filterDesil,
  handleFilterDesilChange,
  dtsenData,
  setSelectedKalkulasi,
  setIsKalkulasiModalOpen,
  setIsCalculated
}) {

  // Menyaring data untuk tab "Menunggu Penentuan"
  const menungguFiltered = dtsenData.filter(item => {
    const isMenunggu = item.asetLengkap === true && item.desil === 'Belum Dihitung';
    const matchKecamatan = filterDesil.kecamatan === "" || item.kecamatan === filterDesil.kecamatan;
    const matchKk = filterDesil.no_kk === "" || (item.no_kk && String(item.no_kk).includes(filterDesil.no_kk));
    return isMenunggu && matchKecamatan && matchKk;
  });

  // Menyaring data untuk tab "Riwayat Penentuan"
  const riwayatFiltered = dtsenData.filter(item => {
    const isRiwayat = item.desil !== 'Belum Dihitung';
    const matchKecamatan = filterDesil.kecamatan === "" || item.kecamatan === filterDesil.kecamatan;
    const matchKk = filterDesil.no_kk === "" || (item.no_kk && String(item.no_kk).includes(filterDesil.no_kk));
    return isRiwayat && matchKecamatan && matchKk;
  });

  return (
    <>
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === "menunggu_penentuan" ? "active" : ""}`} onClick={() => setActiveTab("menunggu_penentuan")}>Data Menunggu Penentuan</button>
        <button className={`tab-btn ${activeTab === "riwayat_penentuan" ? "active" : ""}`} onClick={() => setActiveTab("riwayat_penentuan")}>Riwayat Penentuan Desil</button>
      </div>

      {activeTab === "menunggu_penentuan" && (
        <div className="tab-content-wrapper outline-box">
          <div className="info-alert-box" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Daftar keluarga dengan data aset baru yang membutuhkan kalkulasi PMT untuk menentukan Tingkat Desil.
          </div>
          <div className="pengusulan-filter-grid">
            <div className="filter-group-top">
              <label>Kecamatan</label>
              <div className="select-container-custom">
                <select name="kecamatan" value={filterDesil.kecamatan} onChange={handleFilterDesilChange}>
                  <option value="">Semua Kecamatan</option>
                  <option value="Tallo">Tallo</option>
                  <option value="Bontoala">Bontoala</option>
                </select>
              </div>
            </div>
            <div className="filter-group-top">
              <label>No. KK</label>
              <input type="text" name="no_kk" value={filterDesil.no_kk} onChange={handleFilterDesilChange} className="input-custom" placeholder="Ketik No. KK..." />
            </div>
            <div className="filter-group-top align-bottom">
              <button className="btn-search-outline">Cari Data</button>
            </div>
          </div>
          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
                <thead><tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Kecamatan</th><th>Terakhir Update</th><th style={{ textAlign: "center" }}>Aksi Kalkulasi</th></tr></thead>
                <tbody>
                  {menungguFiltered.length > 0 ? 
                    menungguFiltered.map((item) => (
                    <tr key={item.id}>
                      <td>{item.no_kk}</td><td style={{ fontWeight: '600' }}>{item.nama_kepala_keluarga}</td><td>{item.kecamatan}</td><td>{item.tglUpdate}</td>
                      <td style={{ textAlign: "center" }}><button className="btn-hitung-desil" onClick={() => { setSelectedKalkulasi(item); setIsKalkulasiModalOpen(true); setIsCalculated(false); }}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg> Hitung Desil</button></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada data keluarga yang cocok dengan pencarian Anda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "riwayat_penentuan" && (
          <div className="tab-content-wrapper outline-box">
            <div className="pengusulan-filter-grid">
              <div className="filter-group-top">
                <label>Kecamatan</label>
                <div className="select-container-custom">
                  <select name="kecamatan" value={filterDesil.kecamatan} onChange={handleFilterDesilChange}>
                    <option value="">Semua Kecamatan</option>
                    <option value="Tallo">Tallo</option>
                    <option value="Bontoala">Bontoala</option>
                  </select>
                </div>
              </div>
              <div className="filter-group-top">
                <label>No. KK</label>
                <input type="text" name="no_kk" value={filterDesil.no_kk} onChange={handleFilterDesilChange} className="input-custom" placeholder="Ketik No. KK..." />
              </div>
              <div className="filter-group-top align-bottom">
                <button className="btn-search-outline">Cari Data</button>
              </div>
            </div>
            <div className="table-wrapper">
              <div className="table-responsive">
                <table className="staff-table">
                  <thead><tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Kecamatan</th><th>Tgl Hitung</th><th>Skor PMT</th><th style={{ textAlign: "center" }}>Hasil Desil</th></tr></thead>
                  <tbody>
                    {riwayatFiltered.length > 0 ? 
                      riwayatFiltered.map((item, idx) => (
                      <tr key={idx}><td>{item.no_kk}</td><td style={{ fontWeight: '600' }}>{item.nama_kepala_keluarga}</td><td>{item.kecamatan}</td><td>{item.tglHitung}</td><td>{item.skorPMT}</td><td style={{ textAlign: "center" }}><span className="desil-badge-table">{item.desil}</span></td></tr>
                    )) : (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada riwayat yang cocok dengan pencarian Anda.</td></tr>
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

export default PenentuanDesil;