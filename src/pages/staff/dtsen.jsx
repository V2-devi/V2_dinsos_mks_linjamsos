import React from "react";

function Dtsen({
  activeMenu,
  activeTab,
  setActiveTab,
  dtsenData,
  filterDtsen,
  handleFilterDtsenChange,
  tableDtsenFiltered,
  setIsAddDtsenModalOpen,
  handleOpenDetailDtsen,
  selectedDtsenData,
  detailDtsenInnerTab,
  setDetailDtsenInnerTab,
  handleOpenEditAset,
  handleOpenDetailAnggota,
  setIsAddAnggotaModalOpen,
  filterPeriodePPKS,
  setFilterPeriodePPKS,
  ppksAktif,
  ppksMenunggu,
  top5PPKS,
  maxPPKS,
  filterTabelPPKS,
  handleFilterPPKSChange,
  setIsAddPPKSModalOpen,
  tabelPPKSFiltered,
  formatDateIndo,
  handleOpenDetailPPKS,
  selectedPPKSData,
  catatanAssessment,
  setCatatanAssessment,
  handleUpdateStatusPPKS
  
}) {
  
  return (
    <>
      {/* =======================================================
          TABS NAVIGASI DINAMIS MENU DTSEN
      ======================================================= */}
      {activeMenu === "lihat_dtsen" && activeTab !== "detail_dtsen" && (
        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === "dashboard_dtsen" ? "active" : ""}`} onClick={() => setActiveTab("dashboard_dtsen")}>Dashboard DTSEN</button>
          <button className={`tab-btn ${activeTab === "data_dtsen" ? "active" : ""}`} onClick={() => setActiveTab("data_dtsen")}>Lihat Data DTSEN</button>
        </div>
      )}
      
      {/* =======================================================
          TABS NAVIGASI DINAMIS MENU PPKS
      ======================================================= */}
      {activeMenu === "ppks" && activeTab !== "detail_ppks" && (
        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === "dashboard_ppks" ? "active" : ""}`} onClick={() => setActiveTab("dashboard_ppks")}>Dashboard Data PPKS</button>
          <button className={`tab-btn ${activeTab === "data_ppks" ? "active" : ""}`} onClick={() => setActiveTab("data_ppks")}>Daftar Data PPKS</button>
        </div>
      )}

      {/* =======================================================
          🌟 VIRTUAL PAGE: DETAIL & PENANGANAN PPKS 🌟
      ======================================================= */}
      {activeMenu === "ppks" && activeTab === "detail_ppks" && selectedPPKSData && (
        <div className="tab-content-wrapper outline-box" style={{ animation: 'fadeInModal 0.3s ease-out' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '25px' }}>
            <h2 style={{ color: '#234a66', margin: 0, fontSize: '20px', fontWeight: '800' }}>Tinjauan & Penanganan PPKS</h2>
            <button className="btn-search-outline" onClick={() => setActiveTab("data_ppks")} style={{ height: '36px' }}>&larr; Kembali ke Daftar PPKS</button>
          </div>

          <div className="info-alert-box" style={{ 
              backgroundColor: selectedPPKSData.status === 'Kasus Aktif' ? '#eff6ff' : selectedPPKSData.status === 'Menunggu Kelayakan' ? '#fffbeb' : '#dcfce7', 
              borderColor: selectedPPKSData.status === 'Kasus Aktif' ? '#bfdbfe' : selectedPPKSData.status === 'Menunggu Kelayakan' ? '#fde047' : '#86efac',
              color: selectedPPKSData.status === 'Kasus Aktif' ? '#1e3a8a' : selectedPPKSData.status === 'Menunggu Kelayakan' ? '#b45309' : '#166534',
              marginBottom: '25px', display: 'flex', justifyContent: 'space-between'
            }}>
            <span>Status Penanganan Saat Ini: <strong>{selectedPPKSData.status}</strong></span>
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Tgl Laporan: {formatDateIndo(selectedPPKSData.tanggal)}</span>
          </div>

          <div className="detail-summary-grid">
            <div className="summary-col">
              <div className="summary-item"><span className="sum-label">Nama / Identitas (Alias)</span><span className="sum-val">{selectedPPKSData.nama_lengkap}</span></div>
              <div className="summary-item"><span className="sum-label">Nomor NIK (Jika Ada)</span><span className="sum-val">{selectedPPKSData.nik}</span></div>
            </div>
            <div className="summary-col">
              <div className="summary-item"><span className="sum-label">Kategori PPKS</span><span className="sum-val text-blue">{selectedPPKSData.kategori}</span></div>
              <div className="summary-item"><span className="sum-label">Kecamatan Penemuan</span><span className="sum-val">{selectedPPKSData.kecamatan}</span></div>
            </div>
            <div className="summary-col" style={{ gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
              <div className="summary-item"><span className="sum-label">Lokasi Penemuan Spesifik</span><span className="sum-val">{selectedPPKSData.lokasi}</span></div>
            </div>
          </div>

          <div className="modal-section" style={{ marginTop: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 className="section-subtitle">Tindak Lanjut & Assessment Lapangan</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>Catat hasil temuan lapangan dan perbarui status penanganan kasus ini.</p>
            
            <div className="form-group-modal">
              <label>Catatan Penanganan / Assessment Singkat</label>
              <textarea 
                value={catatanAssessment} 
                onChange={(e) => setCatatanAssessment(e.target.value)} 
                rows="4" 
                placeholder="Ketik hasil observasi atau tindakan yang telah dilakukan..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '13px' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'flex-end' }}>
              {selectedPPKSData.status === "Menunggu Kelayakan" && (
                <button className="btn-modal-submit" style={{ backgroundColor: '#3b82f6', width: 'auto' }} onClick={(e) => handleUpdateStatusPPKS(e, "Kasus Aktif")}>
                  Terima & Ubah ke Kasus Aktif
                </button>
              )}
              {selectedPPKSData.status === "Kasus Aktif" && (
                <button className="btn-modal-submit" style={{ backgroundColor: '#22c55e', width: 'auto' }} onClick={(e) => handleUpdateStatusPPKS(e, "Selesai Ditangani")}>
                  Tandai Selesai / Dirujuk ke Panti
                </button>
              )}
              {selectedPPKSData.status === "Selesai Ditangani" && (
                <span style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#64748b', borderRadius: '8px', fontWeight: '700', fontSize: '13px' }}>
                  Kasus Telah Ditutup
                </span>
              )}
            </div>
          </div>

        </div>
      )}

      {/* =======================================================
          2. DTSEN (TAB DASHBOARD)
      ======================================================= */}
      {activeMenu === "lihat_dtsen" && activeTab === "dashboard_dtsen" && (
        <div className="tab-content-wrapper">
          <div className="dtsen-summary-top">
            <div className="dtsen-top-content">
              <div><h2 className="dtsen-top-title">Total Keluarga Terdaftar di DTSEN</h2></div>
              <div className="dtsen-top-number">{dtsenData.length} <span>Keluarga</span></div>
            </div>
          </div>
          <h3 className="section-title">Sebaran Desil Kesejahteraan</h3>
          <div className="decile-grid">
            <div className="decile-card d1">
              <div className="dec-head"><span className="dec-badge d1-bg">Desil 1</span></div>
              <div className="dec-title">Sangat Rentan / Ekstrem</div>
              <div className="dec-val">{dtsenData.filter(item => item.desil === "1").length}</div>
            </div>
            <div className="decile-card d2">
              <div className="dec-head"><span className="dec-badge d2-bg">Desil 2</span></div>
              <div className="dec-title">Keluarga Rentan</div>
              <div className="dec-val">{dtsenData.filter(item => item.desil === "2").length}</div>
            </div>
            <div className="decile-card d3">
              <div className="dec-head"><span className="dec-badge d3-bg">Desil 3</span></div>
              <div className="dec-title">Hampir Rentan</div>
              <div className="dec-val">{dtsenData.filter(item => item.desil === "3").length}</div>
            </div>
            <div className="decile-card d4">
              <div className="dec-head"><span className="dec-badge d4-bg">Desil 4</span></div>
              <div className="dec-title">Rentan Sedang</div>
              <div className="dec-val">{dtsenData.filter(item => item.desil === "4").length}</div>
            </div>
            <div className="decile-card d5">
              <div className="dec-head"><span className="dec-badge d5-bg">Desil 5</span></div>
              <div className="dec-title">Menuju Aman</div>
              <div className="dec-val">{dtsenData.filter(item => item.desil === "5").length}</div>
            </div>
            <div className="decile-card d6">
              <div className="dec-head"><span className="dec-badge d6-bg">Desil 6-10</span></div>
              <div className="dec-title">Keluarga Mampu / Aman</div>
              <div className="dec-val">{dtsenData.filter(item => item.desil === "6-10").length}</div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          3. DTSEN (TAB LIHAT DATA TABLE & FILTER UTAMA)
      ======================================================= */}
      {activeMenu === "lihat_dtsen" && activeTab === "data_dtsen" && (
        <div className="tab-content-wrapper outline-box">
          <div className="pengusulan-filter-grid">
            <div className="filter-group-top">
              <label>Kecamatan</label>
              <div className="select-container-custom">
                <select name="kecamatan" value={filterDtsen.kecamatan} onChange={handleFilterDtsenChange}>
                  <option value="">Semua Kecamatan</option>
                  <option value="Tallo">Tallo</option>
                  <option value="Bontoala">Bontoala</option>
                </select>
              </div>
            </div>
            <div className="filter-group-top">
              <label>Kelurahan/Desa</label>
              <div className="select-container-custom">
                <select name="kelurahan" value={filterDtsen.kelurahan} onChange={handleFilterDtsenChange}>
                  <option value="">Semua Kelurahan</option>
                  <option value="Wala-walaya">Wala-walaya</option>
                  <option value="Baraya">Baraya</option>
                </select>
              </div>
            </div>
            <div className="filter-group-top">
              <label>No. KK</label>
              <input type="text" name="no_kk" value={filterDtsen.no_kk} onChange={handleFilterDtsenChange} className="input-custom" placeholder="Ketik No. KK..." />
            </div>
            <div className="filter-group-top">
              <label>Nama Kepala Keluarga</label>
              <input type="text" name="nama_kepala_keluarga" value={filterDtsen.nama_kepala_keluarga} onChange={handleFilterDtsenChange} className="input-custom" placeholder="Ketik Nama..." />
            </div>
          </div>

          <div className="action-row-right">
            <button className="btn-add-staff" onClick={() => setIsAddDtsenModalOpen(true)}>
              <span className="plus-icon">+</span> Tambah Data DTSEN
            </button>
          </div>

          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>No. KK</th>
                    <th>Nama Kepala Keluarga</th>
                    <th>Tanggal Lahir</th>
                    <th>Jenis Kelamin</th>
                    <th>Kecamatan</th>
                    <th>Kelurahan</th>
                    <th>Alamat Lengkap</th>
                    <th style={{ textAlign: "center" }}>Desil</th>
                    <th style={{ textAlign: "center" }}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDtsenFiltered.length > 0 ? tableDtsenFiltered.map((item) => (
                    <tr key={item.user_id}>
                      <td>{item.no_kk}</td>
                      <td style={{ fontWeight: '600' }}>{item.nama_kepala_keluarga}</td>
                      <td>{item.tanggal_lahir || "-"}</td>
                      <td>{item.jenis_kelamin || "-"}</td> 
                      <td>{item.kecamatan}</td>
                      <td>{item.kelurahan}</td>
                      <td>{item.alamat}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.desil === 'Belum Dihitung' ? (
                          <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Belum Dihitung</span>
                        ) : (
                          <span className="desil-badge-table">{item.desil}</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button className="btn-icon-keterangan" title="Lihat Detail Keluarga" onClick={() => handleOpenDetailDtsen(item)}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Tidak ada data keluarga yang cocok dengan pencarian Anda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          4. DTSEN (VIRTUAL PAGE: DETAIL DATA TERPADU KELUARGA)
      ======================================================= */}
      {activeMenu === "lihat_dtsen" && activeTab === "detail_dtsen" && selectedDtsenData && (
        <div className="tab-content-wrapper outline-box" style={{ animation: 'fadeInModal 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '25px' }}>
            <h2 style={{ color: '#234a66', margin: 0, fontSize: '20px', fontWeight: '800' }}>Detail Data Terpadu Keluarga</h2>
            <button className="btn-search-outline" onClick={() => setActiveTab("data_dtsen")} style={{ height: '36px' }}>&larr; Kembali ke Daftar DTSEN</button>
          </div>

          <div className="detail-summary-grid">
            <div className="summary-col">
              <div className="summary-item"><span className="sum-label">Nama Kepala Keluarga</span><span className="sum-val">{selectedDtsenData.nama_kepala_keluarga}</span></div>
              <div className="summary-item"><span className="sum-label">Nomor Kartu Keluarga (KK)</span><span className="sum-val">{selectedDtsenData.no_kk}</span></div>
            </div>
            <div className="summary-col">
              <div className="summary-item"><span className="sum-label">Alamat Domisili</span><span className="sum-val">{selectedDtsenData.alamat}</span></div>
              <div className="summary-item"><span className="sum-label">Kecamatan / Kelurahan</span><span className="sum-val">{selectedDtsenData.kecamatan} / {selectedDtsenData.kelurahan}</span></div>
            </div>
            <div className="desil-col">
              <div className="desil-box-red" style={{ backgroundColor: selectedDtsenData.desil === 'Belum Dihitung' ? '#f1f5f9' : '#fca5a5', color: selectedDtsenData.desil === 'Belum Dihitung' ? '#475569' : '#dc2626' }}>
                <span className="desil-text">TINGKAT DESIL</span>
                <span className="desil-number" style={{ fontSize: selectedDtsenData.desil === 'Belum Dihitung' ? '18px' : '32px' }}>{selectedDtsenData.desil}</span>
              </div>
            </div>
          </div>

          {selectedDtsenData.desil === 'Belum Dihitung' && (
            <div className="info-alert-box" style={{ backgroundColor: '#fffbeb', borderColor: '#fde047', color: '#b45309', marginBottom: '30px' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <span>Keluarga ini merupakan data baru. Anda harus melengkapi 39 Variabel Aset terlebih dahulu untuk menghitung Tingkat Desil.</span>
              <button onClick={handleOpenEditAset} style={{ marginLeft: 'auto', backgroundColor: '#b45309', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Lengkapi 39 Variabel Aset &rarr;</button>
            </div>
          )}

          <div className="detail-inner-tabs">
            <button className={`inner-tab-btn ${detailDtsenInnerTab === "anggota" ? "active" : ""}`} onClick={() => setDetailDtsenInnerTab("anggota")}>Data Anggota Keluarga</button>
            <button className={`inner-tab-btn ${detailDtsenInnerTab === "aset" ? "active" : ""}`} onClick={() => setDetailDtsenInnerTab("aset")}>Data Aset & Perumahan (39 Variabel)</button>
          </div>

          {detailDtsenInnerTab === "anggota" && (
            <div className="table-wrapper">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>NIK</th>
                    <th>Nama Anggota</th>
                    <th>Tanggal Lahir</th>
                    <th>Hub. Keluarga</th>
                    <th>Jenis Kelamin</th>
                    <th>Kondisi Khusus</th>
                    <th>Status Keadaan</th>
                    <th style={{ textAlign: "center" }}>Aksi Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDtsenData?.anggota?.map((ang, index) => {
                    const kondisi = [];
                    if (ang.hamil && ang.hamil === "Sedang Hamil") kondisi.push("Hamil");
                    if (ang.disabilitas && ang.disabilitas !== "Tidak Ada Disabilitas") kondisi.push(ang.disabilitas);
                    if (ang.penyakit && ang.penyakit.trim() !== "") kondisi.push(ang.penyakit);

                    return (
                      <tr key={ang.id || index}>
                        <td>{ang.nik === "Belum Diinput" && index === 0 ? (selectedDtsenData?.nik_kepala || selectedDtsenData?.no_kk) : ang.nik}</td> 
                        <td style={{ fontWeight: index === 0 ? '600' : 'normal' }}>{ang.nama_lengkap || ang.nama_kepala_keluarga}</td>
                        <td>{ang.tglLahir || "-"}</td>
                        <td>{ang.hub}</td>
                        {/* ✅ PERBAIKAN SINKRONISASI JENIS KELAMIN */}
                        <td>{ang.jk && ang.jk !== "-" ? ang.jk : (index === 0 ? selectedDtsenData?.jenis_kelamin : "-")}</td>
                        <td>
                          {kondisi.length > 0 ? (
                            <span style={{ color: '#e11d48', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                              {kondisi.join(", ")}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                        </td>
                        <td>
                          <span style={{ backgroundColor: ang.status === 'Hidup' ? '#22c55e' : '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                            {ang.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button type="button" className="btn-icon-keterangan" title="Lihat Detail" onClick={() => handleOpenDetailAnggota(ang)}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ padding: '15px', textAlign: 'right' }}>
                <button className="btn-add-staff" style={{ display: 'inline-flex' }} onClick={() => setIsAddAnggotaModalOpen(true)}>+ Tambah Anggota</button>
              </div>
            </div>
          )}

          {detailDtsenInnerTab === "aset" && (
            <div className="aset-container">
              <div className="aset-grid-3">
                <div className="aset-column">
                  <div className="aset-header-title">Kondisi Demografi & Perumahan</div>
                  <div className="aset-item"><span className="aset-label">V01 | Jenis Kelamin KK</span><span className="aset-value">{selectedDtsenData.aset?.v01 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V02 | Usia KK</span><span className="aset-value">{selectedDtsenData.aset?.v02 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V03 | Pendidikan Tertinggi KK</span><span className="aset-value">{selectedDtsenData.aset?.v03 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V04 | Status Pekerjaan KK</span><span className="aset-value">{selectedDtsenData.aset?.v04 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V05 | Status Perkawinan KK</span><span className="aset-value">{selectedDtsenData.aset?.v05 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V06 | Jumlah Anggota Rumah Tangga</span><span className="aset-value">{selectedDtsenData.aset?.v06 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V07 | Status Kepemilikan Rumah</span><span className="aset-value">{selectedDtsenData.aset?.v07 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V08 | Luas Lantai per Kapita</span><span className="aset-value">{selectedDtsenData.aset?.v08 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V09 | Jenis Lantai</span><span className="aset-value">{selectedDtsenData.aset?.v09 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V10 | Jenis Dinding</span><span className="aset-value">{selectedDtsenData.aset?.v10 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V11 | Jenis Atap</span><span className="aset-value">{selectedDtsenData.aset?.v11 || "-"}</span></div>
                </div>
                <div className="aset-column">
                  <div className="aset-header-title">Sanitasi, Energi & Transportasi</div>
                  <div className="aset-item"><span className="aset-label">V12 | Sumber Air Minum</span><span className="aset-value">{selectedDtsenData.aset?.v12 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V13 | Fasilitas BAB</span><span className="aset-value">{selectedDtsenData.aset?.v13 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V14 | Jenis Kloset</span><span className="aset-value">{selectedDtsenData.aset?.v14 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V15 | Pembuangan Tinja</span><span className="aset-value">{selectedDtsenData.aset?.v15 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V16 | Sumber Penerangan</span><span className="aset-value">{selectedDtsenData.aset?.v16 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V17 | Daya Listrik</span><span className="aset-value">{selectedDtsenData.aset?.v17 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V18 | Bahan Bakar Memasak</span><span className="aset-value">{selectedDtsenData.aset?.v18 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V19 | Tabung Gas ≥5.5 Kg</span><span className="aset-value">{selectedDtsenData.aset?.v19 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V20 | Kepemilikan Lahan/Tanah</span><span className="aset-value">{selectedDtsenData.aset?.v20 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V21 | Kepemilikan Rumah Lain</span><span className="aset-value">{selectedDtsenData.aset?.v21 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V22 | Usaha/Kios/Toko</span><span className="aset-value">{selectedDtsenData.aset?.v22 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V23 | Jumlah Sepeda</span><span className="aset-value">{selectedDtsenData.aset?.v23 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V24 | Jumlah Sepeda Motor</span><span className="aset-value">{selectedDtsenData.aset?.v24 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V25 | Mobil/Truk/Minibus</span><span className="aset-value">{selectedDtsenData.aset?.v25 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V26 | Kepemilikan Perahu</span><span className="aset-value">{selectedDtsenData.aset?.v26 || "-"}</span></div>
                </div>
                <div className="aset-column">
                  <div className="aset-header-title">Elektronik, Ternak & Finansial</div>
                  <div className="aset-item"><span className="aset-label">V27 | Jumlah Televisi</span><span className="aset-value">{selectedDtsenData.aset?.v27 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V28 | Jumlah Kulkas/Freezer</span><span className="aset-value">{selectedDtsenData.aset?.v28 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V29 | Jumlah Smartphone</span><span className="aset-value">{selectedDtsenData.aset?.v29 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V30 | Komputer/Laptop</span><span className="aset-value">{selectedDtsenData.aset?.v30 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V31 | Jumlah AC</span><span className="aset-value">{selectedDtsenData.aset?.v31 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V32 | Jumlah Pemanas Air</span><span className="aset-value">{selectedDtsenData.aset?.v32 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V33 | Mesin Cuci</span><span className="aset-value">{selectedDtsenData.aset?.v33 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V34 | Telepon Rumah</span><span className="aset-value">{selectedDtsenData.aset?.v34 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V35 | Ternak Besar (Sapi/Kerbau)</span><span className="aset-value">{selectedDtsenData.aset?.v35 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V36 | Ternak Kecil (Kambing/Babi)</span><span className="aset-value">{selectedDtsenData.aset?.v36 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V37 | Unggas (Ayam/Bebek)</span><span className="aset-value">{selectedDtsenData.aset?.v37 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V38 | Emas/Perhiasan</span><span className="aset-value">{selectedDtsenData.aset?.v38 || "-"}</span></div>
                  <div className="aset-item"><span className="aset-label">V39 | Tabungan</span><span className="aset-value">{selectedDtsenData.aset?.v39 || "-"}</span></div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button className="btn-search-outline" style={{ display: 'inline-flex', margin: '0 auto', padding: '10px 25px', backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#d97706' }} onClick={handleOpenEditAset}>
                  📝 Edit Data 39 Variabel Aset
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =======================================================
          5. PPKS (TAB DASHBOARD)
      ======================================================= */}
      {activeMenu === "ppks" && activeTab === "dashboard_ppks" && (
        <div className="tab-content-wrapper outline-box">
          <div className="filter-row-right">
            <div className="pill-select-wrapper">
              <select value={filterPeriodePPKS} onChange={(e) => setFilterPeriodePPKS(e.target.value)}>
                <option value="q1">Januari - Maret</option>
                <option value="q2">April - Juni</option>
                <option value="q3">Juli - September</option>
                <option value="q4">Oktober - Desember</option>
              </select>
            </div>
          </div>
          <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="stat-card-outline">
              <h4>Total Kasus Aktif Ditangani</h4>
              <div className="stat-number text-blue">{ppksAktif} <span>Kasus</span></div>
            </div>
            <div className="stat-card-outline">
              <h4>Laporan Menunggu Validasi</h4>
              <div className="stat-number text-dark">{ppksMenunggu} <span>Laporan</span></div>
            </div>
          </div>
          <h3 className="section-title">Distribusi Kategori PPKS (Top 5)</h3>
          <div className="outline-box" style={{ padding: '30px' }}>
            <div className="ppks-horizontal-chart">
              {top5PPKS.length > 0 ? top5PPKS.map((item, idx) => (
                <div className="ppks-bar-row" key={idx}>
                  <span className="ppks-label">{item.nama_lengkap}</span>
                  <div className="ppks-bar-track">
                    <div className="ppks-bar-fill" style={{ width: `${(item.jumlah / maxPPKS) * 100}%` }}></div>
                  </div>
                  <span className="ppks-value">{item.jumlah}</span>
                </div>
              )) : (
                <p style={{ textAlign: 'center', color: '#64748b' }}>Tidak ada data pada periode ini.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          6. PPKS (TAB DAFTAR DATA TABLE & FILTER PPKS)
      ======================================================= */}
      {activeMenu === "ppks" && activeTab === "data_ppks" && (
        <div className="tab-content-wrapper outline-box">
          <div className="pengusulan-filter-grid">
            <div className="filter-group-top">
              <label>Kategori PPKS</label>
              <div className="select-container-custom">
                <select name="kategori" value={filterTabelPPKS.kategori} onChange={handleFilterPPKSChange}>
                  <option value="">Semua Kategori</option>
                  <option>Anak Balita Terlantar</option>
                  <option>Anak Terlantar</option>
                  <option>Anak yang Berhadapan dengan Hukum</option>
                  <option>Anak Jalanan</option>
                  <option>Anak dengan Disabilitas</option>
                  <option>Anak yang Menjadi Korban Tindak Kekerasan</option>
                  <option>Anak yang Memerlukan Perlindungan Khusus</option>
                  <option>Lanjut Usia Terlantar</option>
                  <option>Penyandang Disabilitas</option>
                  <option>Tunasusila</option>
                  <option>Gelandangan</option>
                  <option>Pengemis</option>
                  <option>Pemulung</option>
                  <option>Kelompok Minoritas</option>
                  <option>Bekas Warga Binaan Lembaga Permasyarakatan</option>
                  <option>Orang dengan HIV/AIDS</option>
                  <option>Korban Penyalahgunaan NAPZA</option>
                  <option>Korban Trafficking</option>
                  <option>Korban Tindak Kekerasan</option>
                  <option>Pekerja Migran Bermasalah Sosial</option>
                  <option>Korban Bencana Alam</option>
                  <option>Korban Bencana Sosial</option>
                  <option>Perempuan Rawan Sosial Ekonomi</option>
                  <option>Fakir Miskin</option>
                  <option>Keluarga Bermasalah Sosial Psikologi</option>
                  <option>Komunitas Adat Terpencil</option>
                </select>
              </div>
            </div>
            <div className="filter-group-top">
              <label>Kecamatan</label>
              <div className="select-container-custom">
                <select name="kecamatan" value={filterTabelPPKS.kecamatan} onChange={handleFilterPPKSChange}>
                  <option value="">Semua Kecamatan</option>
                  <option value="Tallo">Tallo</option>
                  <option value="Bontoala">Bontoala</option>
                </select>
              </div>
            </div>
            <div className="filter-group-top">
              <label>Nama/Identitas</label>
              <input type="text" name="nama_lengkap" value={filterTabelPPKS.nama_lengkap} onChange={handleFilterPPKSChange} className="input-custom" placeholder="Cari Nama/NIK..." />
            </div>
            <div className="filter-group-top align-bottom">
              <button className="btn-search-outline">Cari Data</button>
            </div>
          </div>
          
          <div className="action-row-right">
            <button className="btn-add-staff" onClick={() => setIsAddPPKSModalOpen(true)}>
              <span className="plus-icon">+</span> Tambah Laporan PPKS
            </button>
          </div>
          
          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
                <thead>
                  <tr><th>Nama / Identitas</th><th>Kategori PPKS</th><th>Lokasi Penemuan</th><th>Tgl Laporan</th><th style={{ textAlign: "center" }}>Status</th><th style={{ textAlign: "center" }}>Detail</th></tr>
                </thead>
                <tbody>
                  {tabelPPKSFiltered.length > 0 ? tabelPPKSFiltered.map((item) => (
                    <tr key={item.id}>
                      <td><span style={{ fontWeight: '600', color: '#1e293b' }}>{item.nama_lengkap}</span><br/><span style={{ fontSize: '11px', color: '#64748b' }}>NIK: {item.nik}</span></td>
                      <td>{item.kategori}</td>
                      <td>{item.lokasi}</td>
                      <td>{formatDateIndo(item.tanggal_laporan)}</td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`badge-ppks ${item.status_penanganan === 'Kasus Aktif' ? 'badge-aktif' : 'badge-menunggu'}`}>{item.status_penanganan}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button className="btn-icon-keterangan" title="Lihat Detail & Penanganan" onClick={() => handleOpenDetailPPKS(item)}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Tidak ada data PPKS yang cocok.</td></tr>
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

export default Dtsen;