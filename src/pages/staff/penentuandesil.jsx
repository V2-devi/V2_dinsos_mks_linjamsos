import React, { useState } from "react";

function PenentuanDesil({
  activeTab,
  setActiveTab,
  dtsenData,
  setDtsenData,
  showSuccess
}) {
  const [filterDesil, setFilterDesil] = useState({ kecamatan: "", no_kk: "" });
  const [hasilKalkulasi, setHasilKalkulasi] = useState({ skor_pmt: "-", hasil_desil: "-", kategori_desil: "-" });
  const [isKalkulasiModalOpen, setIsKalkulasiModalOpen] = useState(false);
  const [selectedKalkulasi, setSelectedKalkulasi] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false); 

  const handleFilterDesilChange = (e) => { setFilterDesil({ ...filterDesil, [e.target.name]: e.target.value }); };

  const jalankanAlgoritmaPMT = () => {
    const keluargaAsli = dtsenData.find(item => item.no_kk === selectedKalkulasi.no_kk);
    const aset = keluargaAsli?.aset || {}; 
    let totalSkor = 0;
    const bobot = {
      v01: { "Laki-laki": 1.0, "Perempuan": 0.0 }, v02: { "< 25 tahun": 0.2, "25 - 40 tahun": 1.0, "41 - 55 tahun": 0.8, "56 - 65 tahun": 0.5, "> 65 tahun": 0.1 },
      v03: { "Tidak pernah sekolah": 0.0, "Tidak tamat SD": 0.5, "Tamat SD/sederajat": 1.0, "Tamat SMP/sederajat": 1.8, "Tamat SMA/sederajat": 2.5, "Tamat D1/D2/D3": 3.2, "Tamat S1 ke atas": 4.0 },
      v04: { "Tidak bekerja": 0.0, "Serabutan": 0.5, "Buruh": 1.0, "Usaha sendiri": 1.5, "Karyawan tetap": 2.5 }, v05: { "Cerai mati": 0.0, "Cerai hidup": 0.2, "Belum kawin": 0.5, "Kawin": 1.0 },
      v06: { "≥ 8 jiwa": -2.0, "6 - 7 jiwa": -1.2, "4 - 5 jiwa": -0.5, "3 jiwa": 0.0, "1 - 2 jiwa": 0.5 }, v07: { "Menumpang": 0.0, "Sewa": 0.5, "Milik sendiri": 1.5 },
      v08: { "< 4 m²": 0.0, "4 - 7 m²": 0.5, "8 - 15 m²": 1.5, "> 15 m²": 2.5 }, v09: { "Tanah": 0.0, "Bambu": 0.5, "Semen": 1.5, "Keramik": 3.0 },
      v10: { "Bambu": 0.0, "Kayu": 0.5, "Tembok tidak diplester": 1.0, "Tembok diplester": 2.0 }, v11: { "Rumbia": 0.0, "Seng": 0.8, "Genteng tanah liat": 1.5, "Genteng beton": 2.0 },
      v12: { "Sungai": 0.0, "Sumur tak terlindung": 0.3, "Sumur terlindung": 1.0, "Mata air": 1.2, "Air isi ulang": 1.5, "PDAM": 2.0, "kemasan": 2.5 },
      v13: { "Tidak ada": 0.0, "Bersama": 0.5, "Milik sendiri": 1.5 }, v14: { "Tidak ada": 0.0, "Plengsengan": 0.5, "Leher angsa": 1.5 },
      v15: { "Sungai": 0.0, "Tangki septik": 1.5, "IPAL komunal": 2.0 }, v16: { "Bukan listrik": 0.0, "Listrik Non-PLN": 0.8, "Listrik PLN": 1.5 },
      v17: { "Tidak ada": 0.0, "450 Watt": 0.5, "900 Watt": 1.0, "1.300 Watt": 1.8, "2.200 Watt": 3.0 }, v18: { "Kayu bakar": 0.0, "Minyak tanah": 0.3, "3 Kg": 1.0, "5.5 Kg": 2.0, "Listrik": 2.5 },
      v19: { "Tidak ada": 0.0, "1 tabung": 3.0 }, v20: { "Tidak ada": 0.0, "< 500 m²": 1.0, "≥ 500 m²": 2.5 },
      v21: { "Tidak ada": 0.0, "Ada": 3.0 }, v22: { "Tidak ada": 0.0, "Ada": 2.0 }, v23: { "Tidak ada": 0.0, "Ada": 0.5 },
      v24: { "Tidak ada": 0.0, "Ada": 3.0 }, v25: { "Tidak ada": 0.0, "Ada": 5.0 }, v26: { "Tidak ada": 0.0, "Ada": 3.0 },
      v27: { "Tidak ada": 0.0, "Ada": 1.5 }, v28: { "Tidak ada": 0.0, "Ada": 2.0 }, v29: { "Tidak ada": 0.0, "Ada": 1.2 },
      v30: { "Tidak ada": 0.0, "Ada": 2.5 }, v31: { "Tidak ada": 0.0, "Ada": 4.0 }, v32: { "Tidak ada": 0.0, "Ada": 1.5 },
      v33: { "Tidak ada": 0.0, "Ada": 1.0 }, v34: { "Tidak ada": 0.0, "Ada": 0.5 }, v35: { "Tidak ada": 0.0, "1 - 2 ekor": 1.5, "≥ 3 ekor": 3.0 },
      v36: { "Tidak ada": 0.0, "1 - 5 ekor": 0.8, "≥ 6 ekor": 1.5 }, v37: { "Tidak ada": 0.0, "1 - 10 ekor": 0.3, "≥ 11 ekor": 0.8 },
      v38: { "Tidak ada": 0.0, "< 10 gram": 1.0, "≥ 10 gram": 2.5 }, v39: { "Tidak ada": 0.0, "< Rp 500.000": 0.5, "Rp 500rb - 5jt": 1.5, "> Rp 5 juta": 3.0 },
    };

    Object.keys(bobot).forEach(kunci => {
      const jawabanUser = aset[kunci] || "";
      const opsiCocok = Object.keys(bobot[kunci]).find(opsi => jawabanUser.toLowerCase().includes(opsi.toLowerCase()));
      if (opsiCocok) { totalSkor += bobot[kunci][opsiCocok]; }
    });

    let hasilDesil = "1"; let hasilKat = "Sangat Rentan / Ekstrem";
    if (totalSkor >= 41.26) { hasilDesil = "6-10"; hasilKat = "Aman / Mampu"; }
    else if (totalSkor >= 33.01) { hasilDesil = "5"; hasilKat = "Menuju Aman"; }
    else if (totalSkor >= 24.76) { hasilDesil = "4"; hasilKat = "Rentan Sedang"; }
    else if (totalSkor >= 16.51) { hasilDesil = "3"; hasilKat = "Hampir Rentan"; }
    else if (totalSkor >= 8.26) { hasilDesil = "2"; hasilKat = "Rentan"; }
    else { hasilDesil = "1"; hasilKat = "Sangat Rentan / Ekstrem"; }

    setHasilKalkulasi({ skor_pmt: totalSkor.toFixed(2), hasil_desil: hasilDesil, kategori_desil: hasilKat }); setIsCalculated(true);
  };

  const simpanHasilDesilKeluarga = () => {
    const today = new Date();
    const tglHitungStr = `${today.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"][today.getMonth()]} ${today.getFullYear()}`;
    const updatedDtsenData = dtsenData.map(family => {
      if (family.no_kk === selectedKalkulasi.no_kk) {
        return { ...family, hasil_desil: hasilKalkulasi.hasil_desil, skor_pmt: hasilKalkulasi.skor_pmt, kategoriDesil: hasilKalkulasi.kategori_desil, tglHitung: tanggal_hitung_desil };
      }
      return family;
    });
    setDtsenData(updatedDtsenData); setIsKalkulasiModalOpen(false); showSuccess(); setActiveTab("riwayat_penentuan");
  };

  const dummyRiwayatDesil = []; 
  const tabelRiwayatFiltered = dummyRiwayatDesil.filter((item) => {
    const matchKecamatan = filterDesil.kecamatan === "" || (item.kelurahan && String(item.kelurahan).includes(filterDesil.kecamatan));
    const matchNoKk = filterDesil.no_kk === "" || (item.no_kk && String(item.no_kk).includes(filterDesil.no_kk));
    return matchKecamatan && matchNoKk;
  });

  // Menyaring data untuk tab "Menunggu Penentuan"
  const menungguFiltered = dtsenData.filter(item => {
    const isMenunggu = item.asetLengkap === true && item.hasil_desil === 'Belum Dihitung';
    const matchKecamatan = filterDesil.kecamatan === "" || item.kecamatan === filterDesil.kecamatan;
    const matchKk = filterDesil.no_kk === "" || (item.no_kk && String(item.no_kk).includes(filterDesil.no_kk));
    return isMenunggu && matchKecamatan && matchKk;
  });

  // Menyaring data untuk tab "Riwayat Penentuan"
  const riwayatFiltered = dtsenData.filter(item => {
    const isRiwayat = item.hasil_desil !== 'Belum Dihitung';
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
            {/* ✅ TOMBOL CARI DATA DIHAPUS DARI SINI */}
          </div>
          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
                <thead><tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Kecamatan</th><th>Terakhir Update</th><th style={{ textAlign: "center" }}>Aksi Kalkulasi</th></tr></thead>
                <tbody>
                  {menungguFiltered.length > 0 ? 
                    menungguFiltered.map((item) => (
                    <tr key={item.id}>
                      <td>{item.no_kk}</td><td style={{ fontWeight: '600' }}>{item.nama_kepala_keluarga}</td><td>{item.kecamatan}</td><td>{item.tanggal_terakhir_update}</td>
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
              {/* ✅ TOMBOL CARI DATA DIHAPUS DARI SINI */}
            </div>
            <div className="table-wrapper">
              <div className="table-responsive">
                <table className="staff-table">
                  <thead><tr><th>No. KK</th><th>Nama Kepala Keluarga</th><th>Kecamatan</th><th>Tgl Hitung</th><th>Skor PMT</th><th style={{ textAlign: "center" }}>Hasil Desil</th></tr></thead>
                  <tbody>
                    {riwayatFiltered.length > 0 ? 
                      riwayatFiltered.map((item, idx) => (
                      <tr key={idx}><td>{item.no_kk}</td><td style={{ fontWeight: '600' }}>{item.nama_kepala_keluarga}</td><td>{item.kecamatan}</td><td>{item.tanggal_hitung_desil}</td><td>{item.skor_pmt}</td><td style={{ textAlign: "center" }}><span className="desil-badge-table">{item.hasil_desil}</span></td></tr>
                    )) : (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Tidak ada riwayat yang cocok dengan pencarian Anda.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      )}

      {/* =======================================================
          MODAL KALKULASI DESIL (DIPINDAHKAN KE SINI)
      ======================================================= */}
      {isKalkulasiModalOpen && selectedKalkulasi && (
        <div className="modal-overlay" onClick={() => setIsKalkulasiModalOpen(false)}>
          <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Kalkulasi PMT & Desil</h2></div></div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ marginBottom: '20px' }}><h3 style={{ margin: '0', color: '#234a66', fontSize: '18px' }}>{selectedKalkulasi.nama_lengkap}</h3><p style={{ margin: '5px 0 0 0', fontSize: '13px', fontWeight: '600' }}>No KK: {selectedKalkulasi.no_kk}</p></div>
              {!isCalculated ? (
                <button type="button" className="btn-modal-submit" style={{ width: '100%', padding: '15px', fontSize: '16px', backgroundColor: '#3b82f6' }} onClick={jalankanAlgoritmaPMT}>Jalankan Algoritma PMT</button>
              ) : (
                <div style={{backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '25px', marginTop: '15px', animation: 'fadeInModal 0.4s ease-out'}}>
                  <h4 style={{ color: '#10b981', margin: '0 0 15px 0' }}>✓ Kalkulasi Selesai</h4>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px' }}>
                    <div><span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>SKOR TOTAL PMT</span><span style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>{hasilKalkulasi.skor_pmt}</span></div>
                    <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '30px' }}><span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>MASUK KE DESIL</span><span style={{ backgroundColor: hasilKalkulasi.hasil_desil === "1" ? '#ef4444' : hasilKalkulasi.hasil_desil === "2" ? '#f97316' : '#f59e0b', color: 'white', padding: '8px 24px', borderRadius: '8px', fontSize: '24px', fontWeight: '900', display: 'inline-block' }}>{hasilKalkulasi.hasil_desil}</span></div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Berdasarkan skor, keluarga ini tergolong <strong style={{ color: '#1e293b' }}>{hasilKalkulasi.kategori_desil}</strong>.</p>
                  <div className="modal-actions" style={{ marginTop: '20px' }}><button type="button" className="btn-modal-submit" onClick={simpanHasilDesilKeluarga} style={{ width: '100%' }}>Simpan Hasil ke Database</button></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PenentuanDesil;