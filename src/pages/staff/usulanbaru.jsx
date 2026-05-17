import React, { useState } from "react";

function UsulanBaru({
  activeTab,
  setActiveTab,
  filterPeriodeDashboard,
  setFilterPeriodeDashboard,
  statTotal,
  statSelesai,
  statBelum,
  statLayak,
  statTidakLayak,
  pctLayak,
  pctTidakLayak,
  filterTable,
  handleFilterChange,
  setIsAddModalOpen,
  tableDataFiltered,
  formatDateIndo,
  handleOpenDetailRiwayat,
  selectedDetailData
}) {
  // ✅ RUMUS OTOMATIS DIPINDAHKAN KE SINI (Di dalam area komponen, bukan di dalam parameter props)
  const getPeriodeOtomatis = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Karena Januari dimulai dari 0, kita tambah 1
    
    if (month >= 1 && month <= 3) return "Januari - Maret";
    if (month >= 4 && month <= 6) return "April - Juni";
    if (month >= 7 && month <= 9) return "Juli - September";
    return "Oktober - Desember";
  };

  return (
    <>
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard Usulan Baru</button>
        <button className={`tab-btn ${activeTab === "pengusulan" ? "active" : ""}`} onClick={() => setActiveTab("pengusulan")}>Pengusulan Bansos</button>
      </div>

      {activeTab === "dashboard" && (
        <div className="tab-content-wrapper outline-box">
          <div className="filter-row-right">
            <div className="pill-select-wrapper">
              <select value={filterPeriodeDashboard} onChange={(e) => setFilterPeriodeDashboard(e.target.value)}>
                <option value="q1">Januari - Maret</option>
                <option value="q2">April - Juni</option>
                <option value="q3">Juli - September</option>
                <option value="q4">Oktober - Desember</option>
              </select>
            </div>
          </div>
          <div className="stats-grid-3">
            <div className="stat-card-white"><h4>Total Usulan</h4><div className="stat-number-large">{statTotal} <span>Usulan</span></div></div>
            <div className="stat-card-white"><h4>Selesai Verifikasi</h4><div className="stat-number-large text-blue">{statSelesai} <span>Usulan</span></div></div>
            <div className="stat-card-white"><h4>Belum Verifikasi</h4><div className="stat-number-large text-dark">{statBelum} <span>Usulan</span></div></div>
          </div>
          <div className="chart-section-wrapper">
            <h3 className="chart-section-title">Distribusi Hasil Kelayakan</h3>
            <div className="chart-flex-container">
              <div className="chart-visual-area">
                <span className="chart-number-top">{statLayak}</span>
                <div className="css-donut-chart" style={{ background: `conic-gradient(#22c55e 0% ${pctLayak}%, #ef4444 ${pctLayak}% 100%)` }}><div className="donut-inner"></div></div>
                <span className="chart-number-bottom">{statTidakLayak}</span>
              </div>
              <div className="chart-legend-area">
                <div className="legend-box-green"><div className="legend-title-row"><div className="dot-green"></div><strong>Layak Bansos ({pctLayak}%)</strong></div></div>
                <div className="legend-box-red-outline">
                  <div className="legend-title-row"><div className="dot-red-outline"></div><strong>Tidak Layak ({pctTidakLayak}%)</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "pengusulan" && (
        <div className="tab-content-wrapper outline-box">
          <div className="pengusulan-filter-grid">
            <div className="filter-group-top"><label>Kecamatan</label><div className="select-container-custom"><select name="kecamatan" value={filterTable.kecamatan} onChange={handleFilterChange}><option value="">Semua Kecamatan</option><option value="Tallo">Tallo</option><option value="Bontoala">Bontoala</option></select></div></div>
            <div className="filter-group-top"><label>Kelurahan/Desa</label><div className="select-container-custom"><select name="kelurahan" value={filterTable.kelurahan} onChange={handleFilterChange}><option value="">Semua Kelurahan</option><option value="Wala-walaya">Wala-walaya</option><option value="Baraya">Baraya</option></select></div></div>
            <div className="filter-group-top"><label>NIK (0-16)</label><input type="text" name="nik" className="input-custom" placeholder="Cari NIK..." value={filterTable.nik} onChange={handleFilterChange} /></div>
            <div className="filter-group-top"><label>Nama</label><input type="text" name="nama_lengkap" className="input-custom" placeholder="Cari Nama..." value={filterTable.nama_lengkap} onChange={handleFilterChange} /></div>
          </div>
          <div className="action-row-right"><button className="btn-add-staff" onClick={() => setIsAddModalOpen(true)}><span className="plus-icon">+</span> Tambah Usulan</button></div>
          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
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
                    <th style={{ textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDataFiltered.map((item) => (
                    <tr key={item.id}>
                      <td><span style={{ fontWeight: '600', color: '#1e293b' }}>{item.nama_lengkap}</span></td>
                      <td>{item.nik}</td>
                      <td>{item.no_kk}</td>
                      <td>{item.kecamatan}</td><td>{item.kelurahan}</td><td>{formatDateIndo(item.tanggal_usulan)}</td><td>{item.alamat}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.status_pengusulan === "Layak" && <span className="status-badge badge-active">Layak</span>}
                        {item.status_pengusulan === "Tidak Layak" && <span className="status-badge badge-inactive">Tidak Layak</span>}
                        {item.status_pengusulan === "Belum" && <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Belum</span>}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button className="btn-icon-keterangan" title="Lihat Riwayat" onClick={() => handleOpenDetailRiwayat(item)}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "detail_usulan" && selectedDetailData && (
        <div className="tab-content-wrapper outline-box" style={{ animation: 'fadeInModal 0.3s ease-out' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '25px' }}>
            <h2 style={{ color: '#234a66', margin: 0, fontSize: '20px', fontWeight: '800' }}>Riwayat Bantuan Keluarga</h2>
            <button className="btn-search-outline" onClick={() => setActiveTab("pengusulan")} style={{ height: '36px' }}>&larr; Kembali ke Daftar</button>
          </div>

          {/* ✅ PERBAIKAN HEADER: Disesuaikan dengan desain Detail Data Terpadu Keluarga */}
          <div className="detail-summary-grid">
            <div className="summary-col">
              <div className="summary-item"><span className="sum-label">Nama Kepala Keluarga</span><span className="sum-val">{selectedDetailData.nama_lengkap}</span></div>
              <div className="summary-item"><span className="sum-label">Nomor Kartu Keluarga (KK)</span><span className="sum-val">{selectedDetailData.no_kk}</span></div>
            </div>
            <div className="summary-col">
              <div className="summary-item"><span className="sum-label">Alamat Domisili</span><span className="sum-val">{selectedDetailData.alamat}</span></div>
              <div className="summary-item"><span className="sum-label">Kecamatan / Kelurahan</span><span className="sum-val">Kec. {selectedDetailData.kecamatan} / Kel. {selectedDetailData.kelurahan}</span></div>
            </div>
          </div>

          <h3 style={{ fontSize: '16px', color: '#234a66', marginBottom: '15px', marginTop: '25px' }}>Daftar Bantuan Sosial Diterima</h3>
          
          {/* ✅ PERBAIKAN TABEL: Kolom dan Logika Status Baru */}
          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Jenis Bantuan Sosial</th>
                    <th>Periode</th>
                    <th>Nominal</th>
                    <th>Tanggal Penerimaan</th>
                    <th style={{ textAlign: "center" }}>Status Penyaluran</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: selectedDetailData.status_pengusulan === "Belum" ? '#fffbeb' : 'transparent' }}>
                    <td style={{ fontWeight: 'bold', color: selectedDetailData.status_pengusulan === "Belum" ? '#b45309' : '#1e293b' }}>
                      {selectedDetailData.jenis_bansos || "Belum Ditentukan"}
                      {selectedDetailData.status_pengusulan === "Belum" && <span style={{fontSize:'10px', color:'#ef4444', marginLeft: '5px'}}>(Usulan Baru)</span>}
                    </td>
                    
                    {/* ✅ PERBAIKAN: Periode ditarik otomatis dari tanggal pengusulan */}
                    <td style={{ color: selectedDetailData.status_pengusulan === "Belum" ? '#b45309' : '#475569', fontWeight: '500' }}>
                      {getPeriodeOtomatis(selectedDetailData.tanggal || selectedDetailData.tanggal_usulan)}
                    </td>
                    
                    <td style={{ color: selectedDetailData.status_pengusulan === "Belum" ? '#b45309' : '#475569' }}>-</td>
                    
                    <td style={{ color: selectedDetailData.status_pengusulan === "Belum" ? '#b45309' : '#475569' }}>
                      {formatDateIndo(selectedDetailData.tanggal || selectedDetailData.tanggal_usulan)}
                    </td>
                    
                    <td style={{ textAlign: "center" }}>
                      {selectedDetailData.status_pengusulan === "Layak" && <span className="status-badge badge-active">Selesai</span>}
                      {selectedDetailData.status_pengusulan === "Tidak Layak" && <span className="status-badge badge-inactive">Tidak Layak</span>}
                      {selectedDetailData.status_pengusulan === "Belum" && <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Belum</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </>
  );
}

export default UsulanBaru;