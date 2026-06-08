import React, { useState, useRef } from "react";
import { supabase } from "../../config/supabase";
import { ExportButton, ImportButton } from '../staff/DataIO';
import { parseAndMapCSV } from "../../utils/importCSV";
// import { exportToCSV } from "../utils/exportCSV";


function UsulanBaru({
  activeTab,
  setActiveTab,
  usulanData,
  setUsulanData,
  currentStaff,
  showSuccess,
  formatDateIndo,
  getQuarter
}) {
 
  const importInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
const handleImportClick = () => {
  if (importInputRef.current) importInputRef.current.click();
};

// ============================================================
// ✅ TIDAK PERLU MAPPING DI FE
// Backend sudah punya HEADER_MAP sendiri yang handle mapping
// dari header display (CSV export) ke kolom DB
// FE cukup kirim file original langsung
// ============================================================
const handleImportFile = async (e, tableName, refreshFn) => {
  setIsImporting(true);
  try {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('⚠️ Hanya file .CSV yang didukung');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Sesi login habis. Silakan login ulang.');
      return;
    }

    // ✅ Kirim file original langsung — backend yang handle mapping
    const formData = new FormData();
    formData.append('file', file);

    console.log(`📤 Mengirim file "${file.name}" ke tabel "${tableName}"...`);

    const res = await fetch(`http://127.0.0.1:8000/data/${tableName}/import`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    console.log('📥 Status:', res.status, res.statusText);

    // ✅ Baca response sekali sebagai text — hindari double .json()
    const responseText = await res.text();
    console.log('📥 Raw response:', responseText);

    let responseData = null;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    if (!res.ok) {
      const detail =
        responseData?.detail ||
        responseData?.message ||
        responseText ||
        'Tidak ada detail error';

      let pesanError = `❌ Gagal import (Status ${res.status})\n\n`;

      if (typeof detail === 'string') {
        if (detail.includes('Header CSV tidak dikenali')) {
          pesanError +=
            `Header CSV tidak dikenali backend.\n\n` +
            `Pastikan file yang diupload adalah hasil dari fitur Export.\n` +
            `Header yang didukung:\n` +
            `  • Pengusulan: Nama Kepala Keluarga, NIK, No. KK,\n` +
            `    Kecamatan, Kelurahan, Tanggal Pengusulan, Alamat, Status\n` +
            `  • Keluarga: No. KK, Nama Kepala Keluarga, NIK, dll\n` +
            `  • PPKS: Kategori PPKS, Lokasi Penemuan, Tanggal Penemuan, dll`;
        } else if (detail.includes('duplicate key') || detail.includes('unique constraint')) {
          pesanError += `Data duplikat — NIK atau No. KK sudah ada di database.\n\nDetail: ${detail}`;
        } else if (detail.includes('null value') || detail.includes('not-null')) {
          pesanError += `Ada kolom wajib yang kosong di CSV.\n\nDetail: ${detail}`;
        } else if (detail.includes('numerik') || detail.includes('numeric') || detail.includes('integer')) {
          pesanError += `Format NIK atau No. KK tidak valid.\nPastikan hanya berisi angka.\n\nDetail: ${detail}`;
        } else if (detail.includes('timestamp') || detail.includes('tanggal')) {
          pesanError += `Format tanggal tidak valid.\nGunakan format YYYY-MM-DD.\n\nDetail: ${detail}`;
        } else if (detail.includes('File CSV kosong')) {
          pesanError += `File CSV yang diupload kosong atau tidak berisi data.`;
        } else {
          pesanError += `Detail: ${detail}`;
        }
      } else if (Array.isArray(detail)) {
        pesanError += detail.map(d => `• ${d.loc?.join('.')} → ${d.msg}`).join('\n');
      } else {
        pesanError += JSON.stringify(detail, null, 2);
      }

      console.error('❌ Import error:', detail);
      alert(pesanError);
      return;
    }

    // ✅ Sukses
    const pesanSukses = responseData?.message || `Berhasil import data dari "${file.name}"!`;
    alert(`✅ ${pesanSukses}`);

    if (typeof refreshFn === 'function') {
      try { await refreshFn(); } catch (err) { console.error('Refresh error:', err); }
    }

  } catch (err) {
    console.error('❌ Network/upload error:', err);
    alert(
      `❌ Gagal import.\n\n` +
      `Kemungkinan penyebab:\n` +
      `• Backend tidak berjalan (cek http://127.0.0.1:8000)\n` +
      `• Koneksi terputus\n\n` +
      `Detail: ${err.message}`
    );
  } finally {
    setIsImporting(false);
    if (e && e.target) e.target.value = '';
  }
};



// ✅ FUNGSI EXPORT FRONTEND (Gunakan data yang tampil di tabel FE)
const handleExport = () => {
  const dataToExport = tableDataFiltered; // Gunakan data tabel terfilter yang sedang ditampilkan

  if (!dataToExport || dataToExport.length === 0) {
    alert("Tidak ada data untuk diekspor");
    return;
  }

  const headers = [
    "Nama Kepala Keluarga",
    "NIK",
    "No. KK",
    "Kecamatan",
    "Kelurahan",
    "Tanggal Pengusulan",
    "Alamat",
    "Status",
    "Keterangan"
  ];

  const csvRows = [headers.map(h => `"${h}"`).join(",")];

    for (const row of dataToExport) {
    const values = [
      row.nama_kepala_keluarga || row.nama_lengkap || "",
      row.nik || "",
      row.no_kk || "",
      row.kecamatan || "",
      row.kelurahan || "",
      formatDateIndo(row.tanggal_usulan) || "",
      row.alamat || "",
      row.status_pengusulan || "",
      row.catatan_verifikator || ""
    ].map(val => {
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });

    csvRows.push(values.join(","));
  }

  const csvString = "\uFEFF" + csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Data_Pengusulan_Bansos_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};



// const handleExport = async (tableName) => {
//   setIsExporting(true);
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Sesi login habis. Silakan login ulang.");

//     const res = await fetch(`http://127.0.0.1:8000/data/${tableName}/export`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.detail || "Gagal export data");
//     }

//     // Trigger download otomatis
//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${tableName}_export_${new Date().toISOString().slice(0, 10)}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(url);

//   } catch (err) {
//     console.error(err);
//     alert("❌ " + err.message);
//   } finally {
//     setIsExporting(false);
//   }
// };





  const [filterPeriodeDashboard, setFilterPeriodeDashboard] = useState("q1");
  const [filterTable, setFilterTable] = useState({ kecamatan: "", kelurahan: "", nik: "", nama_kepala_keluarga: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState(null);

  const initialFormState = { 
    nik: "", no_kk: "", nama_kepala_keluarga: "", 
    kecamatan: "", kelurahan: "", tanggal: "", alamat: "", hasil_desil: "", 
    jenis_bansos: "", status_pengusulan: "Belum" 
  };
  const [formData, setFormData] = useState(initialFormState);
  const [form, setForm] = useState({
    nama_kepala_keluarga: "", nik: "", no_kk: "",
    kecamatan: "", kelurahan: "", alamat: "", jenis_bansos: ""
  });

  // === KAMUS DATA KECAMATAN & KELURAHAN ===
  const daftarWilayah = {
    "Tallo": ["Buloa", "Bunga Eja Baru", "Kaluku Bodoa", "Kalukuang", "La'latang", "Lakkang", "Lembo", "Panampu", "Rappokalling", "Suangga", "Tallo", "Tammua", "Ujung Pandang Baru", "Wala-walaya"],
    "Tamalanrea": ["Tamalanrea", "Tamalanrea Indah", "Tamalanrea Jaya", "Kapasa", "Kapasa Raya", "Bira", "Parang Loe", "Buntusu"],
    "Biring Kanaya": ["Bakung", "Berua", "Bulurokeng", "Daya", "Katimbang", "Laikang", "Paccerakkang", "Pai", "Sudiang", "Sudiang raya", "Untia"],
    "Panakkukang": ["Karampuang", "Masale", "Pampang", "Panaikang", "Pandang", "Paropo", "Sinrijala", "Tamamaung"],
    "Tamalate": ["Balang Baru", "Barombong", "Bongaya", "Bonto Duri", "Jongaya", "Maccini Sombala", "Mangasa", "Mannuruki", "Pa'baeng-baeng", "Parang Tambung", "Tanjung Merdeka"]
  };

  const handleFilterChange = (e) => { 
    const { name, value } = e.target;
    if (name === "kecamatan") {
      // Jika kecamatan diganti, reset kelurahan agar tidak nyangkut
      setFilterTable({ ...filterTable, kecamatan: value, kelurahan: "" });
    } else {
      setFilterTable({ ...filterTable, [name]: value }); 
    }
  };

  const dashboardDataFiltered = usulanData.filter(item => getQuarter(item.tanggal_usulan || item.tanggal) === filterPeriodeDashboard);
  const tableDataFiltered = usulanData.filter(item => {
    const itemNik = item.nik ? String(item.nik) : "";
    const itemNama = (item.nama_kepala_keluarga || item.nama_lengkap) ? String(item.nama_kepala_keluarga || item.nama_lengkap) : "";
    return (filterTable.kecamatan === "" || item.kecamatan === filterTable.kecamatan) && 
           (filterTable.kelurahan === "" || item.kelurahan === filterTable.kelurahan) && 
           (filterTable.nik === "" || itemNik.includes(filterTable.nik)) && 
           (filterTable.nama_kepala_keluarga === "" || itemNama.toLowerCase().includes(filterTable.nama_kepala_keluarga.toLowerCase()));
  });

  const statTotal = dashboardDataFiltered.length;
  const statSelesai = dashboardDataFiltered.filter(i => i.status_pengusulan === "Layak" || i.status_pengusulan === "Tidak Layak").length;
  const statBelum = dashboardDataFiltered.filter(i => i.status_pengusulan === "Belum").length;
  const statLayak = dashboardDataFiltered.filter(i => i.status_pengusulan === "Layak").length;
  const statTidakLayak = dashboardDataFiltered.filter(i => i.status_pengusulan === "Tidak Layak").length;
  const totalVerified = statLayak + statTidakLayak;
  const pctLayak = totalVerified === 0 ? 0 : Math.round((statLayak / totalVerified) * 100);
  const pctTidakLayak = totalVerified === 0 ? 0 : 100 - pctLayak;

  const approve = async (id) => { await fetch(`/pengusulan/${id}/approve`, { method: "PUT" }); };
  const reject = async (id) => { await fetch(`/pengusulan/${id}/reject`, { method: "PUT" }); };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await fetch("/pengusulan", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(form)
  //   });
  // };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('pengusulan_bansos').insert([{
        nama_kepala_keluarga: formData.nama_kepala_keluarga, nik: formData.nik || null, no_kk: formData.no_kk || null,
        kecamatan: formData.kecamatan, kelurahan: formData.kelurahan, alamat: formData.alamat, 
        status_pengusulan: "Belum", jenis_bansos: formData.jenis_bansos
      }]).select(); 
      if (error) throw error;
      const newUsulan = {
        id: data[0].id, nik: formData.nik, no_kk: formData.no_kk, nama_kepala_keluarga: formData.nama_kepala_keluarga, 
        kecamatan: formData.kecamatan, kelurahan: formData.kelurahan, tanggal: formData.tanggal, alamat: formData.alamat,
        jenis_bansos: formData.jenis_bansos, status_pengusulan: "Belum"
      };
      setUsulanData([newUsulan, ...usulanData]);
      setIsAddModalOpen(false);
      setFormData(initialFormState); 
      showSuccess();
    } catch (error) { console.error('Error adding pengusulan:', error); alert('Gagal menambah pengusulan: ' + error.message); }
  };
  
  const handleOpenDetailRiwayat = (data) => { setSelectedDetailData(data); setActiveTab("detail_usulan"); };

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
            <div className="filter-group-top">
  <label>Kecamatan</label>
  <div className="select-container-custom">
    <select name="kecamatan" value={filterTable.kecamatan} onChange={handleFilterChange}>
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
    <select name="kelurahan" value={filterTable.kelurahan} onChange={handleFilterChange} disabled={!filterTable.kecamatan}>
      <option value="">Semua Kelurahan</option>
      {filterTable.kecamatan && daftarWilayah[filterTable.kecamatan].map((kel) => (
        <option key={kel} value={kel}>{kel}</option>
      ))}
    </select>
  </div>
</div>
            <div className="filter-group-top"><label>NIK (0-16)</label><input type="text" name="nik" className="input-custom" placeholder="Cari NIK..." value={filterTable.nik} onChange={handleFilterChange} /></div>
            <div className="filter-group-top"><label>Nama</label><input type="text" name="nama_kepala_keluarga" className="input-custom" placeholder="Cari Nama..." value={filterTable.nama_kepala_keluarga} onChange={handleFilterChange} /></div>
          </div>
          {/* Ganti baris tombol lama Anda dengan blok di bawah ini */}
<div className="action-row-right" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
  
  {/* TOMBOL EXPORT BANSOS */}
  <button className="btn-action-data btn-export" onClick={handleExport} type="button">
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
    Export
  </button>

  {/* TOMBOL IMPORT BANSOS */}
  <button className="btn-action-data btn-import" onClick={handleImportClick} disabled={isImporting}>
    {isImporting ? "⏳ Importing..." : (
      <>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        Import
      </>
    )}
  </button>

  <input type="file" accept=".csv" ref={importInputRef} style={{ display: 'none' }} onChange={(e) => handleImportFile(e, "pengusulan_bansos", undefined)} />

  <button className="btn-add-staff" onClick={() => setIsAddModalOpen(true)}>
    <span className="plus-icon">+</span> Tambah Usulan
  </button>
</div>          <div className="table-wrapper">
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
                    <th>Keterangan</th>
                    <th style={{ textAlign: "center" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tableDataFiltered.map((item) => (
                    <tr key={item.id}>
                      <td><span style={{ fontWeight: '600', color: '#1e293b' }}>{item.nama_kepala_keluarga || item.nama_lengkap}</span></td>
                      <td>{item.nik}</td>
                      <td>{item.no_kk}</td>
                      <td>{item.kecamatan}</td><td>{item.kelurahan}</td><td>{formatDateIndo(item.tanggal_usulan || item.tanggal)}</td><td>{item.alamat}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.status_pengusulan === "Layak" && <span className="status-badge badge-active">Layak</span>}
                        {item.status_pengusulan === "Tidak Layak" && <span className="status-badge badge-inactive">Tidak Layak</span>}
                        {item.status_pengusulan === "Belum" && <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Belum</span>}
                      </td>
                      <td style={{ color: '#64748b', maxWidth: '200px', fontSize: '13px' }}>
                        {item.catatan_verifikator ? item.catatan_verifikator : "-"}
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
              <div className="summary-item"><span className="sum-label">Nama Kepala Keluarga</span><span className="sum-val">{selectedDetailData.nama_kepala_keluarga || selectedDetailData.nama_lengkap}</span></div>
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

      {/* =======================================================
          MODAL TAMBAH USULAN BARU (DIPINDAHKAN KE SINI)
      ======================================================= */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#234a66', color: 'white', padding: '15px 25px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Tambah Usulan Baru</h2>
              <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px', cursor: 'pointer', padding: 0, lineHeight: 1 }} title="Tutup">&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSubmit}>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>NIK*</label><input type="text" name="nik" value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} required maxLength="16" placeholder="Masukkan NIK 16 digit" /></div>
                  <div className="form-group-modal"><label>No. Kartu Keluarga*</label><input type="text" name="no_kk" value={formData.no_kk} onChange={(e) => setFormData({...formData, no_kk: e.target.value})} required maxLength="16" placeholder="Masukkan No KK 16 digit" /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>Nama Kepala Keluarga (Sesuai KTP)*</label><input type="text" name="nama_kepala_keluarga" value={formData.nama_kepala_keluarga} onChange={(e) => setFormData({...formData, nama_kepala_keluarga: e.target.value})} required placeholder="Masukkan Nama Kepala Keluarga" /></div>
                  <div className="form-group-modal"><label>Tanggal Pengusulan*</label><input type="date" name="tanggal" value={formData.tanggal_usulan || formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value, tanggal_usulan: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
  <div className="form-group-modal">
    <label>Kecamatan*</label>
    <div className="select-container-custom">
      <select name="kecamatan" value={formData.kecamatan} onChange={(e) => setFormData({...formData, kecamatan: e.target.value, kelurahan: ""})} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}>
        <option value="" disabled hidden>Pilih Kecamatan</option>
        {Object.keys(daftarWilayah).map((kec) => (
          <option key={kec} value={kec}>{kec}</option>
        ))}
      </select>
    </div>
  </div>
  <div className="form-group-modal">
    <label>Kelurahan/Desa*</label>
    <div className="select-container-custom">
      <select name="kelurahan" value={formData.kelurahan} onChange={(e) => setFormData({...formData, kelurahan: e.target.value})} required disabled={!formData.kecamatan} style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}>
        <option value="" disabled hidden>{formData.kecamatan ? "Pilih Kelurahan" : "Pilih Kecamatan Dulu"}</option>
        {formData.kecamatan && daftarWilayah[formData.kecamatan].map((kel) => (
          <option key={kel} value={kel}>{kel}</option>
        ))}
      </select>
    </div>
  </div>
</div>
                <div className="form-grid-1" style={{ marginBottom: '20px' }}>
                  <div className="form-group-modal">
                    <label>Jenis Bantuan Sosial yang Diusulkan*</label>
                    <div className="select-container-custom"><select name="jenis_bansos" value={formData.jenis_bansos} onChange={(e) => setFormData({...formData, jenis_bansos: e.target.value})} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}><option value="" disabled hidden>Pilih Jenis Bantuan</option><option value="Bantuan Langsung Tunai (BLT)">Bantuan Langsung Tunai (BLT)</option><option value="Program Keluarga Harapan (PKH)">Program Keluarga Harapan (PKH)</option><option value="Bantuan Pangan Non Tunai (BPNT)">Bantuan Pangan Non Tunai (BPNT)</option><option value="Bantuan Sosial Tunai (BST)">Bantuan Sosial Tunai (BST)</option></select></div>
                  </div>
                  <div className="form-group-modal" style={{ marginTop: '15px' }}><label>Alamat Lengkap*</label><textarea name="alamat" value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} required placeholder="Masukkan alamat lengkap (Jalan, RT/RW)" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #94a3b8', resize: 'vertical', minHeight: '60px'}}></textarea></div>
                </div>
                <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <button type="button" className="btn-modal-cancel" onClick={() => setIsAddModalOpen(false)}>Batal</button>
                  <button type="submit" className="btn-modal-submit">Simpan Data</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UsulanBaru;