import React, { useState } from "react";

function PenentuanDesil({
  activeTab,
  setActiveTab,
  dtsenData,
  setDtsenData,
  showSuccess,
  fetchKeluarga
}) {
  // ✅ [PERBAIKAN: TAMBAH KELURAHAN PADA STATE]
  const [filterDesil, setFilterDesil] = useState({ kecamatan: "", kelurahan: "", no_kk: "" });
  const [isKalkulasiModalOpen, setIsKalkulasiModalOpen] = useState(false);
  const [selectedKalkulasi, setSelectedKalkulasi] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [hasilKalkulasi, setHasilKalkulasi] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ [PERBAIKAN: KAMUS DATA KECAMATAN & KELURAHAN]
  const daftarWilayah = {
    "Tallo": ["Buloa", "Bunga Eja Baru", "Kaluku Bodoa", "Kalukuang", "La'latang", "Lakkang", "Lembo", "Panampu", "Rappokalling", "Suangga", "Tallo", "Tammua", "Ujung Pandang Baru", "Wala-walaya"],
    "Tamalanrea": ["Tamalanrea", "Tamalanrea Indah", "Tamalanrea Jaya", "Kapasa", "Kapasa Raya", "Bira", "Parang Loe", "Buntusu"],
    "Biring Kanaya": ["Bakung", "Berua", "Bulurokeng", "Daya", "Katimbang", "Laikang", "Paccerakkang", "Pai", "Sudiang", "Sudiang raya", "Untia"],
    "Panakkukang": ["Karampuang", "Masale", "Pampang", "Panaikang", "Pandang", "Paropo", "Sinrijala", "Tamamaung"],
    "Tamalate": ["Balang Baru", "Barombong", "Bongaya", "Bonto Duri", "Jongaya", "Maccini Sombala", "Mangasa", "Mannuruki", "Pa'baeng-baeng", "Parang Tambung", "Tanjung Merdeka"]
  };

  // ==========================================
  // HANDLER FILTER
  // ==========================================
  const handleFilterDesilChange = (e) => {
    // ✅ [PERBAIKAN: RESET KELURAHAN JIKA KECAMATAN BERUBAH]
    if (e.target.name === "kecamatan") {
      setFilterDesil({ ...filterDesil, kecamatan: e.target.value, kelurahan: "" });
    } else {
      setFilterDesil({ ...filterDesil, [e.target.name]: e.target.value });
    }
  };

  // ==========================================
  // BUKA / TUTUP MODAL
  // ==========================================
  const handleOpenKalkulasiModal = (item) => {
    setSelectedKalkulasi(item);
    setIsCalculated(false);
    setHasilKalkulasi(null);
    setErrorMsg("");
    setIsKalkulasiModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isCalculating) return; // jangan tutup saat sedang proses
    setIsKalkulasiModalOpen(false);
    setSelectedKalkulasi(null);
    setIsCalculated(false);
    setHasilKalkulasi(null);
    setErrorMsg("");
  };

  // ==========================================
  // FILTER DATA MENUNGGU PENENTUAN
  // ==========================================
  const menungguFiltered = dtsenData.filter((item) => {
    const isMenunggu =
      item.hasil_desil === "Belum Dihitung" ||
      item.hasil_desil === null ||
      item.hasil_desil === undefined;
    const matchKecamatan =
      filterDesil.kecamatan === "" || item.kecamatan === filterDesil.kecamatan;
    // ✅ [PERBAIKAN: TAMBAH FILTER KELURAHAN]
    const matchKelurahan =
      filterDesil.kelurahan === "" || item.kelurahan === filterDesil.kelurahan;
    const matchKk =
      filterDesil.no_kk === "" ||
      (item.no_kk && String(item.no_kk).includes(filterDesil.no_kk));
    return isMenunggu && matchKecamatan && matchKelurahan && matchKk;
  });

  // ==========================================
  // FILTER RIWAYAT PENENTUAN
  // ==========================================
  const riwayatFiltered = dtsenData.filter((item) => {
    const isRiwayat =
      item.hasil_desil &&
      item.hasil_desil !== "Belum Dihitung";
    const matchKecamatan =
      filterDesil.kecamatan === "" || item.kecamatan === filterDesil.kecamatan;
    // ✅ [PERBAIKAN: TAMBAH FILTER KELURAHAN]
    const matchKelurahan =
      filterDesil.kelurahan === "" || item.kelurahan === filterDesil.kelurahan;
    const matchKk =
      filterDesil.no_kk === "" ||
      (item.no_kk && String(item.no_kk).includes(filterDesil.no_kk));
    return isRiwayat && matchKecamatan && matchKelurahan && matchKk;
  });

  // ==========================================
  // HITUNG DESIL + SIMPAN (1 endpoint, backend sudah handle keduanya)
  //
  // Backend service proses_kalkulasi_desil() sudah:
  //   1. Ambil data aset dari tabel aset_keluarga
  //   2. Hitung skor PMT (v01-v39)
  //   3. Tentukan desil
  //   4. UPDATE tabel keluarga (skor_pmt, hasil_desil, tanggal_hitung_desil, kategori_desil)
  //   5. Return hasil
  //
  // Jadi frontend cukup panggil 1x, hasil langsung tersimpan di DB.
  // ==========================================
  const handleHitungDesil = async () => {
    if (!selectedKalkulasi) return;

    setIsCalculating(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");

      // -----------------------------------------------
      // PENTING: Ganti URL di bawah sesuai router FastAPI Anda.
      // Cek file router dengan: grep -r "hitung" backend/ --include="*.py"
      // Kemungkinan URL yang benar:
      //   - /kalkulasi/hitung/{no_kk}      ← paling umum
      //   - /kalkulasi/{no_kk}/hitung
      //   - /desil/hitung/{no_kk}
      //   - /penentuan-desil/{no_kk}
      // -----------------------------------------------
      const url = `http://127.0.0.1:8000/desil/kalkulasi/${selectedKalkulasi.no_kk}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      // Coba parse JSON, fallback ke text jika gagal
      let result;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Response bukan JSON (${res.status}): ${text}`);
      }

      if (!res.ok) {
        throw new Error(
          result.detail || result.message || `HTTP ${res.status}`
        );
      }

      const hasil = result.data ?? result;
      setHasilKalkulasi(hasil);
      setIsCalculated(true);

      // Optimistic update: pindahkan baris langsung tanpa tunggu refresh
      // agar tab 'Menunggu' dan 'Riwayat' langsung terupdate saat modal masih terbuka
      if (setDtsenData) {
        setDtsenData((prev) =>
          prev.map((item) =>
            item.no_kk === selectedKalkulasi.no_kk
              ? {
                  ...item,
                  skor_pmt: hasil.skor_pmt,
                  hasil_desil: hasil.hasil_desil,
                  kategori_desil: hasil.kategori_desil,
                  tanggal_terakhir_update: hasil.tanggal_terakhir_update,
                }
              : item
          )
        );
      }

      // Fetch di background untuk sinkronisasi penuh dari server
      if (fetchKeluarga) fetchKeluarga();

    } catch (error) {
      console.error("[Kalkulasi Desil Error]", error);
      setErrorMsg(error.message || "Terjadi kesalahan tidak diketahui");
    } finally {
      setIsCalculating(false);
    }
  };

  // ==========================================
  // HELPER: Warna badge desil
  // ==========================================
  const getDesilColor = (desil) => {
    if (!desil) return "#94a3b8";
    const d = parseInt(desil);
    if (d === 1) return "#ef4444";
    if (d === 2) return "#f97316";
    if (d === 3) return "#f59e0b";
    if (d === 4) return "#eab308";
    if (d === 5) return "#84cc16";
    return "#22c55e"; // 6-10
  };

  return (
    <>
      {/* TAB NAVIGATION */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === "menunggu_penentuan" ? "active" : ""}`}
          onClick={() => setActiveTab("menunggu_penentuan")}
        >
          Data Menunggu Penentuan
        </button>
        <button
          className={`tab-btn ${activeTab === "riwayat_penentuan" ? "active" : ""}`}
          onClick={() => setActiveTab("riwayat_penentuan")}
        >
          Riwayat Penentuan Desil
        </button>
      </div>

      {/* TAB: MENUNGGU PENENTUAN */}
      {activeTab === "menunggu_penentuan" && (
        <div className="tab-content-wrapper outline-box">
          <div
            className="info-alert-box"
            style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe", color: "#1e3a8a" }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Daftar keluarga dengan data aset baru yang membutuhkan kalkulasi PMT untuk menentukan Tingkat Desil.
          </div>

          <div className="pengusulan-filter-grid">
            <div className="filter-group-top">
              <label>Kecamatan</label>
              <div className="select-container-custom">
                {/* ✅ [PERBAIKAN: DINAMIS KECAMATAN] */}
                <select name="kecamatan" value={filterDesil.kecamatan} onChange={handleFilterDesilChange}>
                  <option value="">Semua Kecamatan</option>
                  {Object.keys(daftarWilayah).map((kec) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* ✅ [PERBAIKAN: DITAMBAHKAN FILTER KELURAHAN] */}
            <div className="filter-group-top">
              <label>Kelurahan</label>
              <div className="select-container-custom">
                <select name="kelurahan" value={filterDesil.kelurahan} onChange={handleFilterDesilChange} disabled={!filterDesil.kecamatan}>
                  <option value="">{filterDesil.kecamatan ? "Semua Kelurahan" : "Pilih Kecamatan Dulu"}</option>
                  {filterDesil.kecamatan && daftarWilayah[filterDesil.kecamatan].map((kel) => (
                    <option key={kel} value={kel}>{kel}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-group-top">
              <label>No. KK</label>
              <input
                type="text" name="no_kk" value={filterDesil.no_kk}
                onChange={handleFilterDesilChange} className="input-custom"
                placeholder="Ketik No. KK..."
              />
            </div>
          </div>

          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
                <thead>
                  {/* ✅ [PERBAIKAN: STRUKTUR KOLOM MENUNGGU PENENTUAN] */}
                  <tr>
                    <th>No. KK</th>
                    <th>Nama Kepala Keluarga</th>
                    <th>Kecamatan</th>
                    <th>Kelurahan</th>
                    <th>Terakhir Update</th>
                    <th style={{ textAlign: "center" }}>Aksi Kalkulasi</th>
                  </tr>
                </thead>
                <tbody>
                  {menungguFiltered.length > 0 ? (
                    menungguFiltered.map((item) => (
                      <tr key={item.id}>
                        <td>{item.no_kk}</td>
                        <td style={{ fontWeight: "600" }}>{item.nama_kepala_keluarga}</td>
                        <td>{item.kecamatan}</td>
                        {/* ✅ [PERBAIKAN: ISI DATA KELURAHAN] */}
                        <td>{item.kelurahan || "-"}</td>
                        <td>{item.tanggal_terakhir_update}</td>
                        <td style={{ textAlign: "center" }}>
                          <button className="btn-hitung-desil" onClick={() => handleOpenKalkulasiModal(item)}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>{" "}
                            Hitung Desil
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      {/* ✅ [PERBAIKAN: COLSPAN MENJADI 6] */}
                      <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                        Tidak ada data keluarga yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: RIWAYAT PENENTUAN */}
      {activeTab === "riwayat_penentuan" && (
        <div className="tab-content-wrapper outline-box">
          <div className="pengusulan-filter-grid">
            <div className="filter-group-top">
              <label>Kecamatan</label>
              <div className="select-container-custom">
                {/* ✅ [PERBAIKAN: DINAMIS KECAMATAN] */}
                <select name="kecamatan" value={filterDesil.kecamatan} onChange={handleFilterDesilChange}>
                  <option value="">Semua Kecamatan</option>
                  {Object.keys(daftarWilayah).map((kec) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* ✅ [PERBAIKAN: DITAMBAHKAN FILTER KELURAHAN] */}
            <div className="filter-group-top">
              <label>Kelurahan</label>
              <div className="select-container-custom">
                <select name="kelurahan" value={filterDesil.kelurahan} onChange={handleFilterDesilChange} disabled={!filterDesil.kecamatan}>
                  <option value="">{filterDesil.kecamatan ? "Semua Kelurahan" : "Pilih Kecamatan Dulu"}</option>
                  {filterDesil.kecamatan && daftarWilayah[filterDesil.kecamatan].map((kel) => (
                    <option key={kel} value={kel}>{kel}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-group-top">
              <label>No. KK</label>
              <input
                type="text" name="no_kk" value={filterDesil.no_kk}
                onChange={handleFilterDesilChange} className="input-custom"
                placeholder="Ketik No. KK..."
              />
            </div>
          </div>

          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
                <thead>
                  {/* ✅ [PERBAIKAN: STRUKTUR KOLOM RIWAYAT] */}
                  <tr>
                    <th>No. KK</th>
                    <th>Nama Kepala Keluarga</th>
                    <th>Kecamatan</th>
                    <th>Kelurahan</th>
                    <th>Terakhir Update</th>
                    <th>Skor PMT</th>
                    <th style={{ textAlign: "center" }}>Hasil Desil</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayatFiltered.length > 0 ? (
                    riwayatFiltered.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.no_kk}</td>
                        <td style={{ fontWeight: "600" }}>{item.nama_kepala_keluarga}</td>
                        <td>{item.kecamatan}</td>
                        {/* ✅ [PERBAIKAN: ISI DATA KELURAHAN] */}
                        <td>{item.kelurahan || "-"}</td>
                        <td>{item.tanggal_terakhir_update}</td>
                        <td>{item.skor_pmt}</td>
                        <td style={{ textAlign: "center" }}>
                          <span className="desil-badge-table">{item.hasil_desil}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      {/* ✅ [PERBAIKAN: COLSPAN MENJADI 7] */}
                      <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                        Tidak ada riwayat yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL KALKULASI DESIL
          Alur: Buka Modal → Klik Hitung → Backend hitung + simpan → Tampilkan hasil → Tutup
      ========================================== */}
      {isKalkulasiModalOpen && selectedKalkulasi && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content modal-medium" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="modal-header-title">
                <h2>Kalkulasi PMT &amp; Desil</h2>
              </div>
              <button
                onClick={handleCloseModal}
                disabled={isCalculating}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: isCalculating ? "not-allowed" : "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="modal-body" style={{ textAlign: "center", padding: "30px" }}>

              {/* Info keluarga */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0", color: "#234a66", fontSize: "18px" }}>
                  {selectedKalkulasi.nama_kepala_keluarga}
                </h3>
                <p style={{ margin: "5px 0 0 0", fontSize: "13px", fontWeight: "600" }}>
                  No KK: {selectedKalkulasi.no_kk}
                </p>
              </div>

              {/* STEP 1: Belum dihitung */}
              {!isCalculated && !isCalculating && (
                <>
                  <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
                    Klik tombol di bawah untuk menjalankan algoritma PMT.<br />
                    Hasil akan langsung tersimpan ke database.
                  </p>
                  <button
                    type="button"
                    className="btn-modal-submit"
                    style={{ width: "100%", padding: "15px", fontSize: "16px", backgroundColor: "#3b82f6" }}
                    onClick={handleHitungDesil}
                  >
                    Jalankan Algoritma PMT &amp; Simpan
                  </button>
                </>
              )}

              {/* LOADING */}
              {isCalculating && (
                <div style={{ padding: "20px 0" }}>
                  <div style={{
                    width: "48px", height: "48px", border: "4px solid #e2e8f0",
                    borderTop: "4px solid #3b82f6", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite", margin: "0 auto 16px"
                  }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <p style={{ color: "#64748b", fontSize: "14px" }}>
                    Menghitung skor PMT dan menyimpan hasil...
                  </p>
                </div>
              )}

              {/* ERROR */}
              {errorMsg && !isCalculating && (
                <div style={{
                  backgroundColor: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: "8px", padding: "16px", marginTop: "12px", textAlign: "left"
                }}>
                  <p style={{ color: "#b91c1c", fontWeight: "600", margin: "0 0 6px 0" }}>
                    ❌ Gagal menghitung desil
                  </p>
                  <p style={{ color: "#dc2626", fontSize: "13px", margin: "0 0 12px 0", fontFamily: "monospace" }}>
                    {errorMsg}
                  </p>
                  <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 12px 0" }}>
                    Kemungkinan penyebab: URL endpoint salah, data aset belum diisi, atau No KK tidak ditemukan.
                    Cek <code>/openapi.json</code> untuk daftar endpoint yang tersedia.
                  </p>
                  <button
                    type="button"
                    style={{
                      padding: "8px 16px", backgroundColor: "#3b82f6", color: "white",
                      border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px"
                    }}
                    onClick={() => { setErrorMsg(""); }}
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* STEP 2: Hasil kalkulasi */}
              {isCalculated && hasilKalkulasi && !isCalculating && (
                <div style={{
                  backgroundColor: "#f8fafc", border: "1px solid #cbd5e1",
                  borderRadius: "10px", padding: "25px", marginTop: "15px"
                }}>
                  <h4 style={{ color: "#10b981", margin: "0 0 15px 0" }}>✓ Kalkulasi Selesai &amp; Tersimpan</h4>

                  <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginBottom: "20px" }}>
                    <div>
                      <span style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>
                        SKOR TOTAL PMT
                      </span>
                      <span style={{ fontSize: "32px", fontWeight: "900", color: "#1e293b" }}>
                        {hasilKalkulasi.skor_pmt}
                      </span>
                    </div>
                    <div style={{ borderLeft: "2px solid #e2e8f0", paddingLeft: "30px" }}>
                      <span style={{ display: "block", fontSize: "12px", color: "#64748b", fontWeight: "bold" }}>
                        MASUK KE DESIL
                      </span>
                      <span style={{
                        backgroundColor: getDesilColor(hasilKalkulasi.hasil_desil),
                        color: "white", padding: "8px 24px", borderRadius: "8px",
                        fontSize: "24px", fontWeight: "900", display: "inline-block"
                      }}>
                        {hasilKalkulasi.hasil_desil}
                      </span>
                    </div>
                  </div>

                  {hasilKalkulasi.kategori_desil && (
                    <p style={{ fontSize: "14px", color: "#64748b" }}>
                      Keluarga ini tergolong{" "}
                      <strong style={{ color: "#1e293b" }}>{hasilKalkulasi.kategori_desil}</strong>.
                    </p>
                  )}

                  <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
                    ✓ Data sudah tersimpan ke database
                  </p>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn-modal-submit"
                    style={{ width: "100%", marginTop: "16px", padding: "12px", backgroundColor: "#10b981" }}
                  >
                    Tutup
                  </button>
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