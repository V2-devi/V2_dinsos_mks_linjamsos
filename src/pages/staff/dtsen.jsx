import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../config/supabase";
import API from "../../api/api";
import { ExportButton, ImportButton } from '../staff/DataIO';
import { parseAndMapCSV } from "../../utils/importCSV";
import { exportToCSV } from "../../utils/exportCSV";

function Dtsen({
  activeMenu,
  activeTab,
  setActiveTab,
  dtsenData,
  setDtsenData,
  dummyPPKS,
  setDummyPPKS,
  showSuccess,
  fetchKeluarga,
  currentRole
}) {
  


  

const [isExporting, setIsExporting] = useState(false);

const handleExport = async (tableName) => {
  setIsExporting(true);
  try {
    if (tableName === "keluarga") {
      const dataToExport = tableDtsenFiltered;
      const csvData = dataToExport.map((item) => ({
        "No. KK": item.no_kk || "",
        "NIK": item.nik || "",
        "Nama Kepala Keluarga": item.nama_kepala_keluarga || "",
        "Tanggal Lahir": item.tanggal_lahir || "",
        "Jenis Kelamin": item.jenis_kelamin || "",
        "Kecamatan": item.kecamatan || "",
        "Kelurahan": item.kelurahan || "",
        "Alamat Lengkap": item.alamat || "",
        "Desil": item.hasil_desil || ""
      }));
      exportToCSV(csvData, "Data_DTSEN");
      return;
    }

    if (tableName === "ppks") {
      const dataToExport = tabelPPKSFiltered;
      const csvData = dataToExport.map((item) => ({
        "NIK": item.nik || "",
        "Nama": item.nama_lengkap || "",
        "Kategori PPKS": item.kategori_ppks || "",
        "Kecamatan": item.kecamatan || "",
        "Kelurahan": item.kelurahan || "",
        "Lokasi Penemuan": item.lokasi_penemuan || "",
        "Tanggal Laporan": item.tanggal_penemuan || "",
        "Status": item.status_penanganan || "",
        "Keterangan": item.catatan_verifikator || item.keterangan || ""
      }));
      exportToCSV(csvData, "Data_PPKS");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Sesi login habis. Silakan login ulang.");

    const res = await fetch(`http://127.0.0.1:8000/data/${tableName}/export`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Gagal export data");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableName}_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert("❌ " + err.message);
  } finally {
    setIsExporting(false);
  }
};




const [isImporting, setIsImporting] = useState(false);
const importInputRef = useRef(null);

const handleImportClick = () => {
  importInputRef.current?.click();
};

const handleImportFile = async (e, tableName, onSuccess) => {
  const file = e.target.files[0];
  if (!file) return;

  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
    alert("⚠️ Hanya file .CSV dan Excel (.xlsx / .xls) yang didukung");
    e.target.value = "";
    return;
 }

  setIsImporting(true);
  try {
    const text = await file.text();
    const mappedRows = parseAndMapCSV(text, tableName);

    if (!mappedRows || mappedRows.length === 0) {
      alert("❌ Gagal membaca CSV. Pastikan file tidak kosong dan header sesuai template.");
      return;
    }

    // ✅ Tentukan tabel untuk cleaning
    const isDtsen = tableName?.toLowerCase().includes('keluarga') ||
                    tableName?.toLowerCase().includes('dtsen');
    const isPPKS  = tableName?.toLowerCase().includes('ppks');

    // ✅ Bersihkan rows — hapus id, konversi tipe, isi default
    const cleanedRows = mappedRows.map(row => {
      // Hapus semua variasi kolom id
      const { id, ID, Id, ...rest } = row;

      if (isDtsen) {
        return {
          nama_kepala_keluarga: rest.nama_kepala_keluarga || null,
          nik:          rest.nik ? parseInt(String(rest.nik).replace(/\D/g, ''), 10) || null : null,
          no_kk:         rest.no_kk ? String(rest.no_kk).trim() || null : null,
          tanggal_lahir: rest.tanggal_lahir || null,
          jenis_kelamin: rest.jenis_kelamin || null,
          kecamatan:    rest.kecamatan || null,
          kelurahan:    rest.kelurahan || null,
          alamat:       rest.alamat || null,
          hasil_desil:  rest.hasil_desil || "Belum Dihitung",
          skor_pmt:     rest.skor_pmt ? parseFloat(rest.skor_pmt) || 0 : 0,
          // tanggal_hitung_desil: rest.tanggal_hitung_desil || new Date().toISOString(),

        };
      }

      if (isPPKS) {
        return {
          nama_lengkap:      rest.nama_lengkap || null,
          nik:               rest.nik || null,
          kategori_ppks:     rest.kategori_ppks || null,
          kecamatan:         rest.kecamatan || null,
          kelurahan:         rest.kelurahan || null,
          lokasi_penemuan:   rest.lokasi_penemuan || null,
          tanggal_penemuan:  rest.tanggal_penemuan || null,
          status_penanganan: rest.status_penanganan || "Menunggu Foto Bukti",
          catatan_verifikator: rest.catatan_verifikator || rest.keterangan || null,
        };
      }

      // Default: Usulan Bansos
      return {
        nama_kepala_keluarga:      rest.nama_kepala_keluarga || null,
        nik:               rest.nik ? parseInt(String(rest.nik).replace(/\D/g, ''), 10) || null : null,
        no_kk:         rest.no_kk ? String(rest.no_kk).trim() || null : null,
        kecamatan:         rest.kecamatan || null,
        kelurahan:         rest.kelurahan || null,
        tanggal_usulan:    rest.tanggal_usulan || null,
        alamat:            rest.alamat || null,
        status_pengusulan: rest.status_pengusulan || "Belum",
        catatan_verifikator_bansos: rest.catatan_verifikator_bansos || null,
      };
    });

    // ✅ Filter baris kosong
    const validRows = cleanedRows.filter(row =>
      Object.values(row).some(v => v !== null && v !== '' && v !== undefined)
    );

    if (validRows.length === 0) {
      alert("❌ Tidak ada data valid setelah proses pembersihan.");
      return;
    }

    console.log("📤 Headers:", Object.keys(validRows[0]));
    console.log("📤 Baris pertama:", validRows[0]);
    console.log(`📊 Total baris valid: ${validRows.length}`);

    // ✅ Rebuild CSV dari cleanedRows
    const headers = Object.keys(validRows[0]);
    const csvRows = [headers.map(h => `"${h}"`).join(',')];
    for (const row of validRows) {
      const vals = headers.map(h => {
        const v = row[h] ?? '';
        return `"${String(v).replace(/"/g, '""')}"`;
      });
      csvRows.push(vals.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const mappedFile = new File([blob], file.name, { type: 'text/csv' });

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Sesi login habis. Silakan login ulang.");

    const formData = new FormData();
    formData.append('file', mappedFile);

    const res = await fetch(`http://127.0.0.1:8000/data/${tableName}/import`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    // ✅ Baca response sekali saja
    const responseText = await res.text();
    console.log("📥 Raw response:", responseText);

    let responseData = null;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    if (!res.ok) {
      const detail = responseData?.detail || responseData?.message || responseText;
      let pesanError = `❌ Gagal import (Status ${res.status})\n\n`;

      if (typeof detail === 'string') {
        if (detail.includes('column "id" does not exist')) {
          pesanError += `Kolom "id" masih ada di CSV.\nSolusi: Hubungi developer untuk cek backend.\n\nDetail: ${detail}`;
        } else if (detail.includes('duplicate key') || detail.includes('unique constraint')) {
          pesanError += `Data duplikat — NIK atau No. KK sudah ada di database.\n\nDetail: ${detail}`;
        } else if (detail.includes('null value') || detail.includes('not-null')) {
          pesanError += `Ada kolom wajib yang kosong di CSV.\n\nDetail: ${detail}`;
        } else if (detail.includes('invalid input syntax') && detail.includes('integer')) {
          pesanError += `Format NIK atau No. KK tidak valid (harus angka).\n\nDetail: ${detail}`;
        } else if (detail.includes('invalid input syntax') && detail.includes('timestamp')) {
          pesanError += `Format tanggal tidak valid. Gunakan format YYYY-MM-DD.\n\nDetail: ${detail}`;
        } else if (Array.isArray(detail)) {
          pesanError += detail.map(d => `• ${d.loc?.join('.')} → ${d.msg}`).join('\n');
        } else {
          pesanError += `Detail: ${detail}`;
        }
      }

      console.error("❌ Import error:", detail);
      alert(pesanError);
      return;
    }

    alert(`✅ ${responseData?.message || `Berhasil import ${validRows.length} data!`}`);
    if (onSuccess) onSuccess();

  } catch (err) {
    console.error("❌ Error:", err);
    alert(
      `❌ Gagal import.\n\n` +
      `Kemungkinan penyebab:\n` +
      `• Backend tidak berjalan\n` +
      `• Koneksi terputus\n\n` +
      `Detail: ${err.message}`
    );
  } finally {
    setIsImporting(false);
    e.target.value = "";
  }
};




  // === KAMUS DATA KECAMATAN & KELURAHAN (FILTER DINAMIS) ===
  const daftarWilayah = {
    "Tallo": ["Buloa", "Bunga Eja Baru", "Kaluku Bodoa", "Kalukuang", "La'latang", "Lakkang", "Lembo", "Panampu", "Rappokalling", "Suangga", "Tallo", "Tammua", "Ujung Pandang Baru", "Wala-walaya"],
    "Tamalanrea": ["Tamalanrea", "Tamalanrea Indah", "Tamalanrea Jaya", "Kapasa", "Kapasa Raya", "Bira", "Parang Loe", "Buntusu"],
    "Biring Kanaya": ["Bakung", "Berua", "Bulurokeng", "Daya", "Katimbang", "Laikang", "Paccerakkang", "Pai", "Sudiang", "Sudiang raya", "Untia"],
    "Panakkukang": ["Karampuang", "Masale", "Pampang", "Panaikang", "Pandang", "Paropo", "Sinrijala", "Tamamaung"],
    "Tamalate": ["Balang Baru", "Barombong", "Bongaya", "Bonto Duri", "Jongaya", "Maccini Sombala", "Mangasa", "Mannuruki", "Pa'baeng-baeng", "Parang Tambung", "Tanjung Merdeka"]
  };
  
  
  // 🔗 GABUNG 3 FIELD MENJADI 1 STRING (untuk kirim ke backend)
  const gabungKondisiKhusus = ({ kehamilan, disabilitas, penyakit_kronis }) => {
    const parts = [];
    if (kehamilan && kehamilan !== "") parts.push(`Kehamilan: ${kehamilan}`);
    if (disabilitas && disabilitas !== "") parts.push(`Disabilitas: ${disabilitas}`);
    if (penyakit_kronis && penyakit_kronis.trim() !== "") parts.push(`Penyakit Kronis: ${penyakit_kronis.trim()}`);
    
    return parts.length > 0 ? parts.join(" | ") : "";
  };

  // 🔓 PISAH 1 STRING MENJADI 3 FIELD (untuk edit form)
  const pisahKondisiKhusus = (kondisi_khusus) => {
    const result = { kehamilan: "", disabilitas: "", penyakit_kronis: "" };
    
    if (!kondisi_khusus) return result;
    
    const parts = kondisi_khusus.split(" | ");
    parts.forEach(part => {
      if (part.startsWith("Kehamilan:")) {
        result.kehamilan = part.replace("Kehamilan:", "").trim();
      } else if (part.startsWith("Disabilitas:")) {
        result.disabilitas = part.replace("Disabilitas:", "").trim();
      } else if (part.startsWith("Penyakit Kronis:")) {
        result.penyakit_kronis = part.replace("Penyakit Kronis:", "").trim();
      }
    });
    
    return result;
  };



  // ==========================================
  // STATE PINDAHAN DARI STAFFDASHBOARD (LOGIKA KHUSUS DTSEN/PPKS)
  // ==========================================
  const [isAddDtsenModalOpen, setIsAddDtsenModalOpen] = useState(false);
  const [selectedDtsenData, setSelectedDtsenData] = useState(null);
  const [detailDtsenInnerTab, setDetailDtsenInnerTab] = useState("anggota"); 



  // ✅ State terpisah untuk file PDF baru (hanya saat edit)
  const [newSuratKematianFile, setNewSuratKematianFile] = useState(null);
  // State untuk preview URL (bisa dari DB atau file baru)
  const [previewSuratKematianUrl, setPreviewSuratKematianUrl] = useState("");



  const [isAddAnggotaModalOpen, setIsAddAnggotaModalOpen] = useState(false);
  const [isDetailAnggotaModalOpen, setIsDetailAnggotaModalOpen] = useState(false);
  const [selectedAnggotaData, setSelectedAnggotaData] = useState(null);
  const [isEditAsetModalOpen, setIsEditAsetModalOpen] = useState(false);
  const [selectedPPKSData, setSelectedPPKSData] = useState(null);
  const [catatanAssessment, setCatatanAssessment] = useState("");
  const [selectedNoKK, setSelectedNoKK] = useState(null);
  const [isAddPPKSModalOpen, setIsAddPPKSModalOpen] = useState(false);

  // State khusus untuk modal lengkapi bukti (PPKS Import)
  const [isUploadFotoModalOpen, setIsUploadFotoModalOpen] = useState(false);
  const [selectedPPKSForUpload, setSelectedPPKSForUpload] = useState(null);

  const [filterDtsen, setFilterDtsen] = useState({ kecamatan: "", kelurahan: "", no_kk: "", nama_kepala_keluarga: "" });
  const [filterPeriodePPKS, setFilterPeriodePPKS] = useState("q1");
  const [filterTabelPPKS, setFilterTabelPPKS] = useState({ kategori_ppks: "", kecamatan: "", kelurahan: "", nama: "" }); 

  const [formDtsen, setFormDtsen] = useState({
    no_kk: "",
    nama_kepala_keluarga: "",
    jenis_kelamin: "",
    nik: "",
    kecamatan: "",
    kelurahan: "",
    alamat: "",
    tanggal_lahir: "",
    hasil_desil: "",
    tanggal_terakhir_update: "",
    kategori_desil: "",
    skor_pmt: ""
  });

  const [formAnggota, setFormAnggota] = useState({
    nik: "",
    nama_anggota_keluarga: "",
    hubungan_keluarga: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    // status_khusus: "",
    status_keadaan: "Hidup",
    urutan: 0,
    kehamilan: "",
    disabilitas: "",
    penyakit_kronis: "",
    surat_kematian: null // Menyimpan file PDF
  });

  const resetAddAnggotaModal = () => {
    setFormAnggota({
      nik: "",
      nama_anggota_keluarga: "",
      hubungan_keluarga: "",
      jenis_kelamin: "",
      tanggal_lahir: "",
      status_keadaan: "Hidup",
      kehamilan: "",
      disabilitas: "",
      penyakit_kronis: "",
      surat_kematian: null
    });
    setNewSuratKematianFile(null);
    if (previewSuratKematianUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewSuratKematianUrl);
    }
    setPreviewSuratKematianUrl("");
  };
  
  // FUNGSI UNTUK HANDLE UPLOAD PDF SURAT KEMATIAN]
  const handleSuratKematianChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validasi tipe
      if (file.type !== "application/pdf") {
        alert("Harap unggah file Surat Kematian dalam format .pdf");
        e.target.value = "";
        return;
      }
      
      // Validasi ukuran (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        e.target.value = "";
        return;
      }
    }
    
    // Simpan File object ke state dan set preview hanya untuk file saat ini
    setFormAnggota({ ...formAnggota, surat_kematian: file });
    if (file) {
      setPreviewSuratKematianUrl(URL.createObjectURL(file));
    } else {
      setPreviewSuratKematianUrl("");
    }
  };



const uploadSuratKematianToDB = async (no_kk, anggotaId, file) => {
  if (!file) return null;
  
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  console.log("📤 Mengirim upload ke backend...");
  const res = await fetch(
    `http://127.0.0.1:8000/anggota/${no_kk}/${anggotaId}/upload-surat-kematian`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }
  );

  if (!res.ok) {
    const err = await res.json();
    console.error("❌ Backend Upload Error:", err);
    throw new Error(err.detail || "Gagal simpan ke database");
  }

  const data = await res.json();
  console.log("✅ Backend Return URL:", data.url);
  return data.url; // ← URL ini HARUS dipakai untuk update state/preview
};



  const initialFormPPKS = { nik: "", nama_lengkap: "", kategori_ppks: "", kecamatan: "", kelurahan: "", lokasi_penemuan: "", tanggal_penemuan: "", bukti_foto_ppks: [] }; 
  const [formPPKS, setFormPPKS] = useState(initialFormPPKS);

  const [fotoBuktiPPKS, setFotoBuktiPPKS] = useState([]); // ✅ STATE BARU UNTUK FOTO





  // Tambahkan fungsi ini di dalam komponen Anda (di atas handleSubmitFotoPPKS)
const handleFileChange = (e) => {
  const files = Array.from(e.target.files || []);
  
  if (files.length === 0) {
    setFotoBuktiPPKS([]);
    return;
  }

  if (files.length > 3) {
    alert("⚠️ Maksimal 3 foto");
    e.target.value = "";
    return;
  }

  const maxSize = 5 * 1024 * 1024;
  const oversized = files.find(f => f.size > maxSize);
  if (oversized) {
    alert(`⚠️ File "${oversized.name}" terlalu besar (max 5MB)`);
    e.target.value = "";
    return;
  }

  console.log("📷 File dipilih:", files.map(f => f.name));
  setFotoBuktiPPKS(files);
  // ❌ JANGAN reset e.target.value di sini!
};



  // ✅ FUNGSI HANDLE UPLOAD FOTO
// ✅ VERSI BARU: Terima ID sebagai parameter

// ✅ FUNGSI HANDLE UPLOAD FOTO (VERSI FINAL - UPDATE DATABASE JUGA)
const handleSubmitFotoPPKS = async (ppksId = null) => {
  const targetId = ppksId || selectedPPKSData?.id || selectedPPKSForUpload;
  
  console.log(" ID yang akan diupload:", targetId);
  
  if (!targetId) {
    return alert("⚠️ ID PPKS tidak ditemukan.");
  }
  
  if (!fotoBuktiPPKS || fotoBuktiPPKS.length === 0) {
    return alert("⚠️ Pilih minimal 1 foto bukti.");
  }
  
  const token = localStorage.getItem("token");
  if (!token) return alert("⚠️ Sesi login habis.");
  
  try {
    // ==========================================
    // STEP 1: Upload File ke Backend (Dapatkan URL)
    // ==========================================
    const formData = new FormData();
    formData.append("ppks_id", targetId);
    fotoBuktiPPKS.forEach((file) => formData.append("files", file));
    
    console.log("📤 Step 1: Upload ke backend...");
    
    const res = await fetch("http://127.0.0.1:8000/ppks/upload/foto-ppks", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error("❌ Backend error:", data);
      return alert(`❌ ${data.detail || "Gagal upload"}`);
    }
    
    console.log("✅ Step 1 berhasil. URLs:", data.urls);
    const finalUrl = data.urls.join(",");
    
    // ==========================================
    // STEP 2: ✅ UPDATE DATABASE LANGSUNG VIA SUPABASE
    // (Update bukti_foto_ppks DAN status_penanganan sekaligus!)
    // ==========================================
    console.log("💾 Step 2: Update database...");
    console.log("   ID:", targetId);
    console.log("   URL:", finalUrl);
    console.log("   Status: Kasus Aktif");
    
    const { data: updateResult, error: updateError } = await supabase
      .from('ppks')
      .update({ 
        bukti_foto_ppks: finalUrl,
        status_penanganan: "Kasus Aktif"  // ✅ UBAH STATUS OTOMATIS
      })
      .eq('id', targetId)
      .select();
    
    if (updateError) {
      console.error(" Gagal update database:", updateError);
      return alert(`❌ Gagal simpan ke database: ${updateError.message}`);
    }
    
    if (!updateResult || updateResult.length === 0) {
      console.error("❌ Database tidak menemukan ID:", targetId);
      return alert("❌ Data PPKS tidak ditemukan di database.");
    }
    
    console.log("✅ Step 2 berhasil! Database updated:", updateResult[0]);
    
    // ==========================================
    // STEP 3: Update State Lokal
    // ==========================================
    const updatedData = { 
      ...(selectedPPKSData || {}),
      id: targetId,
      bukti_foto_ppks: finalUrl,
      status_penanganan: "Kasus Aktif"
    };
    
    // Update state jika sedang membuka detail
    if (selectedPPKSData?.id === targetId) {
      setSelectedPPKSData(updatedData);
    }
    
    // Update daftar PPKS di tabel
    setDummyPPKS(prev => prev.map(item =>
      item.id === targetId ? updatedData : item
    ));
    
    // Reset & tutup modal
    setFotoBuktiPPKS([]);
    setIsUploadFotoModalOpen(false);
    
    alert(`✅ BERHASIL! ${data.urls.length} foto tersimpan dan status diubah menjadi "Kasus Aktif".`);
    
  } catch (err) {
    console.error("❌ Error:", err);
    alert(`❌ ${err.message}`);
  }
};

// const handleSubmitFotoPPKS = async (ppksId = null) => {
//   // Gunakan ID dari parameter, atau fallback ke state
//   const targetId = ppksId || selectedPPKSData?.id;
  
//   console.log("🔍 ID yang akan diupload:", targetId);
//   console.log("🔍 selectedPPKSData:", selectedPPKSData);
  
//   if (!targetId) {
//     return alert("⚠️ ID PPKS tidak ditemukan. Silakan buka detail data terlebih dahulu.");
//   }

//   if (!fotoBuktiPPKS || fotoBuktiPPKS.length === 0) {
//     return alert("⚠️ Pilih minimal 1 foto bukti.");
//   }

//   const token = localStorage.getItem("token");
//   if (!token) return alert("⚠️ Sesi login habis.");

//   try {
//     const formData = new FormData();
//     formData.append("ppks_id", targetId);
    
//     fotoBuktiPPKS.forEach((file) => {
//       formData.append("files", file);
//     });

//     console.log("📤 Upload untuk ID:", targetId);

//     const res = await fetch("http://127.0.0.1:8000/ppks/upload/foto-ppks", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       console.error("❌ Backend error:", data);
//       alert(`❌ ${data.detail || "Gagal upload"}`);
//       return;
//     }

//     console.log("✅ Upload berhasil:", data);
//     alert(`✅ ${data.message}`);

//     // ✅ Update state jika data sedang dibuka
//     if (selectedPPKSData?.id === targetId) {
//       setSelectedPPKSData(prev => ({ 
//         ...prev, 
//         bukti_foto_ppks: data.urls.join(",") 
//       }));
//     }

//     // ✅ Update daftar PPKS
//     setDummyPPKS(prev => prev.map(item => 
//       item.id === targetId 
//         ? { ...item, bukti_foto_ppks: data.urls.join(",") }
//         : item
//     ));

//     // Reset & tutup modal
//     setFotoBuktiPPKS([]);
//     if (typeof setIsUploadFotoModalOpen === "function") {
//       setIsUploadFotoModalOpen(false);
//     }

//   } catch (err) {
//     console.error("❌ Error:", err);
//     alert(`❌ ${err.message}`);
//   }
// };

  const [formAset, setFormAset] = useState({
    no_kk: "", v01: "", v02: "", v03: "", v04: "", v05: "", v06: 0, v07: "", v08: "", v09: "", v10: "", v11: "", v12: "", v13: "", v14: "", v15: "", v16: "", v17: "", v18: "", v19: "",
    v20: "", v21: "", v22: "", v23: 0, v24: 0, v25: 0, v26: "", v27: 0, v28: "", v29: 0, v30: "", v31: 0, v33: "", v34: "", v35: "", v36: "", v37_: "", v38: "", v39: "" 
  });

  // =========================================
  // HANDLERS & LOGIKA FILTER PINDAHAN
  // =========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDtsen({ ...formDtsen, [name]: value });
  };

  const handleChangeAnggota = (e) => {
    const { name, value } = e.target;
    setFormAnggota((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterDtsenChange = (e) => {
    const { name, value } = e.target;
    if (name === "kecamatan") {
      setFilterDtsen({ ...filterDtsen, kecamatan: value, kelurahan: "" });
    } else {
      setFilterDtsen({ ...filterDtsen, [name]: value });
    }
  };

  const handleFilterPPKSChange = (e) => {
    const { name, value } = e.target;
    if (name === "kecamatan") {
      setFilterTabelPPKS({ ...filterTabelPPKS, kecamatan: value, kelurahan: "" });
    } else {
      setFilterTabelPPKS({ ...filterTabelPPKS, [name]: value });
    }
  };

  const getQuarter = (dateString) => {
    if (!dateString) return "q1";
    const month = new Date(dateString).getMonth() + 1;
    return month <= 3 ? "q1" : month <= 6 ? "q2" : month <= 9 ? "q3" : "q4";
  };


  const tableDtsenFiltered = dtsenData.filter(item => {
    const matchKecamatan = filterDtsen.kecamatan === "" || item.kecamatan === filterDtsen.kecamatan;
    const matchKelurahan = filterDtsen.kelurahan === "" || item.kelurahan === filterDtsen.kelurahan;
    const matchKk = filterDtsen.no_kk === "" || (item.no_kk && String(item.no_kk).includes(filterDtsen.no_kk));
    const matchNama = filterDtsen.nama_kepala_keluarga === "" || (item.nama_kepala_keluarga && String(item.nama_kepala_keluarga).toLowerCase().includes(filterDtsen.nama_kepala_keluarga.toLowerCase()));
    return matchKecamatan && matchKelurahan && matchKk && matchNama;
  });

  const dashboardPPKSFiltered = dummyPPKS.filter(item => getQuarter(item.tanggal_penemuan || item.tanggal_penemuan) === filterPeriodePPKS);
  const tabelPPKSFiltered = dummyPPKS.filter(item => {
    const matchKategori = filterTabelPPKS.kategori_ppks === "" || item.kategori_ppks === filterTabelPPKS.kategori_ppks;
    const matchKecamatan = filterTabelPPKS.kecamatan === "" || item.kecamatan === filterTabelPPKS.kecamatan;
    const matchKelurahan = filterTabelPPKS.kelurahan === "" || item.kelurahan === filterTabelPPKS.kelurahan; 
    const itemNama = item.nama_lengkap ? String(item.nama_lengkap).toLowerCase() : "";
    const itemNik = item.nik ? String(item.nik) : "";
    const searchVal = filterTabelPPKS.nama ? filterTabelPPKS.nama.toLowerCase() : ""; 
    const matchNama = filterTabelPPKS.nama === "" || itemNama.includes(searchVal) || itemNik.includes(searchVal);
    return matchKategori && matchKecamatan && matchKelurahan && matchNama; 
  });

  const ppksAktif = dashboardPPKSFiltered.filter(i => i.status_penanganan === "Kasus Aktif").length;
  const ppksMenunggu = dashboardPPKSFiltered.filter(i => i.status_penanganan === "Kasus Aktif").length;
  const kategoriCount = {};
  dashboardPPKSFiltered.forEach(item => { kategoriCount[item.kategori_ppks] = (kategoriCount[item.kategori_ppks] || 0) + 1; });
  const top5PPKS = Object.entries(kategoriCount).map(([nama_lengkap, jumlah]) => ({ nama_lengkap, jumlah })).sort((a, b) => b.jumlah - a.jumlah).slice(0, 5); 
  const maxPPKS = top5PPKS.length > 0 ? top5PPKS[0].jumlah : 1; 

  const handleAddDtsen = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        no_kk: formDtsen.no_kk,
        nama_kepala_keluarga: formDtsen.nama_kepala_keluarga,
        jenis_kelamin: formDtsen.jenis_kelamin, 
        nik: formDtsen.nik || null,
        kecamatan: formDtsen.kecamatan,
        kelurahan: formDtsen.kelurahan,
        alamat: formDtsen.alamat,
        tanggal_lahir: formDtsen.tanggal_lahir, 
        hasil_desil: "Belum Dihitung",
        skor_pmt: 0
      };

      console.log("PAYLOAD DIKIRIM:", payload);

      const response = await fetch("http://127.0.0.1:8000/keluarga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.detail
          ? Array.isArray(data.detail)
            ? data.detail.map(d => `${d.loc?.join(".")} → ${d.msg}`).join("\n")
            : data.detail
          : JSON.stringify(data, null, 2);
        alert("Gagal:\n" + errorMsg);
        return;
      }

      await fetchKeluarga();
      setIsAddDtsenModalOpen(false);
      setFormDtsen({ no_kk: "", nama_kepala_keluarga: "", jenis_kelamin: "", nik: "", kecamatan: "", kelurahan: "", alamat: "", tanggal_lahir: "" });
      showSuccess();
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };



const fetchAnggota = async (no_kk) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://127.0.0.1:8000/anggota/${no_kk}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const data = await response.json();
    console.log("RAW DATA ANGGOTA:", data);
    
    // Debug: Cek apakah surat_kematian ada
    data.forEach((ang, idx) => {
      console.log(`Anggota ${idx + 1} (${ang.nama_anggota_keluarga}):`, {
        id: ang.id,
        surat_kematian: ang.surat_kematian || "KOSONG",
        tipe: typeof ang.surat_kematian
      });
    });
    
    const normalizedAnggota = data.map(anggota => ({
      ...anggota,
      kondisi_khusus: anggota.kondisi_khusus || ""
    }));

     // ✅ TAMBAHKAN SORTING YANG BENAR DI SINI
      const sortedAnggota = [...normalizedAnggota].sort((a, b) => {
      // 1. Kepala Keluarga selalu di atas
      if (a.hubungan_keluarga === "Kepala Keluarga" && b.hubungan_keluarga !== "Kepala Keluarga") return -1;
      if (a.hubungan_keluarga !== "Kepala Keluarga" && b.hubungan_keluarga === "Kepala Keluarga") return 1;
      
      // 2. Istri kedua
      if (a.hubungan_keluarga === "Istri" && b.hubungan_keluarga !== "Istri") return -1;
      if (a.hubungan_keluarga !== "Istri" && b.hubungan_keluarga === "Istri") return 1;
      
      // 3. Lainnya berdasarkan tanggal lahir (tertua dulu)
      const dateA = new Date(a.tanggal_lahir || "1900-01-01");
      const dateB = new Date(b.tanggal_lahir || "1900-01-01");
      return dateA - dateB;
    });


    // ✅ Update dtsenData dengan perbandingan String (anti type-mismatch)
    const updatedDtsen = dtsenData.map((item) => {
      if (String(item.no_kk) === String(no_kk)) {
        return { ...item, anggota: sortedAnggota };
      }
      return item;
    });
    setDtsenData(updatedDtsen);

    // ✅ PERBAIKAN: Gunakan callback form untuk dapat state terbaru
    // DAN gunakan String() untuk perbandingan yang aman
    setSelectedDtsenData(prev => {
      if (prev && String(prev.no_kk) === String(no_kk)) {
        console.log("✅ Update selectedDtsenData dengan anggota:", sortedAnggota.length, "orang");
        return { ...prev, anggota: sortedAnggota };
      }
      console.warn("⚠️ no_kk tidak cocok:", prev?.no_kk, "vs", no_kk);
      return prev;
    });
    
  } catch (error) {
    console.error("FETCH ANGGOTA ERROR:", error);
  }
};




  const handleOpenDetailDtsen = async (data) => {
    setSelectedDtsenData(data);
    setSelectedNoKK(data.no_kk);
    setDetailDtsenInnerTab("anggota"); 
    setActiveTab("detail_dtsen");

    await fetchAnggota(data.no_kk);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/aset/${data.no_kk}`, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }
      });

      if (res.ok) {
        const result = await res.json();
        const asetData = result.data || result; 
        console.log("📦 Data Aset Diterima dari BE:", asetData);

        setSelectedDtsenData(prev => ({
          ...prev,
          aset: asetData,
          asetLengkap: Object.keys(asetData).length > 0
        }));

        setDtsenData(prevList => prevList.map(item => 
          item.no_kk === data.no_kk ? { ...item, aset: asetData, asetLengkap: true } : item
        ));
      } else {
        setSelectedDtsenData(prev => ({ ...prev, aset: {}, asetLengkap: false }));
      }
    } catch (error) {
      console.error("Gagal fetch aset:", error);
    }
  };

  // const handleOpenDetailAnggota = (anggota) => { setSelectedAnggotaData(anggota); setIsDetailAnggotaModalOpen(true); };
  const handleOpenDetailAnggota = (anggota) => {
    const parsed = pisahKondisiKhusus(anggota.kondisi_khusus);

    setSelectedAnggotaData({
      ...anggota,
      kehamilan: parsed.kehamilan,
      disabilitas: parsed.disabilitas,
      penyakit_kronis: parsed.penyakit_kronis
    });

    // ✅ Set preview URL dari data DB saat modal dibuka
    setPreviewSuratKematianUrl(anggota.surat_kematian || "");
    setNewSuratKematianFile(null); // ✅ Reset file baru

    setIsDetailAnggotaModalOpen(true);
  };


const handleAddAnggotaSubmit = async (e) => {
  e.preventDefault();
  try {
    if (!formAnggota.nik) { alert("NIK wajib diisi"); return; }
    if (!selectedNoKK) { alert("No KK tidak ditemukan"); return; }

    const token = localStorage.getItem("token");
    
    const kondisi_khusus_gabung = gabungKondisiKhusus({
      kehamilan: formAnggota.kehamilan,
      disabilitas: formAnggota.disabilitas,
      penyakit_kronis: formAnggota.penyakit_kronis
    });

    // Hitung urutan tertinggi + 1
    const maxUrutan = selectedDtsenData.anggota?.reduce(
      (max, ang) => Math.max(max, ang.urutan || 0), 
      -1
    ) || 0;

    const payload = {
      nik: String(formAnggota.nik),
      nama_anggota_keluarga: formAnggota.nama_anggota_keluarga,
      hubungan_keluarga: formAnggota.hubungan_keluarga,
      jenis_kelamin: formAnggota.jenis_kelamin,
      tanggal_lahir: formAnggota.tanggal_lahir,
      status_keadaan: formAnggota.status_keadaan,
      kondisi_khusus: kondisi_khusus_gabung,
      urutan: maxUrutan + 1
    };

    console.log("📤 PAYLOAD ADD ANGGOTA:", payload);

    // =====================================
    // 1. INSERT DATA ANGGOTA
    // =====================================
    const response = await fetch(`http://127.0.0.1:8000/anggota/${selectedDtsenData.no_kk}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    if (!response.ok) { 
      alert(JSON.stringify(data, null, 2)); 
      return; 
    }

    // 🔍 DEBUG: Lihat struktur response backend
    console.log("📦 RESPONSE CREATE:", JSON.stringify(data, null, 2));

    // ✅ AMBIL ID DENGAN CARA FLEKSIBEL (sesuaikan dengan response backend Anda)
    const newAnggotaId = data.data?.id || data.id || data.anggota_id || data._id;
    console.log("🆔 ID ANGGOTA BARU:", newAnggotaId);

    if (!newAnggotaId) {
      console.warn("⚠️ ID tidak ditemukan di response backend");
      alert("Data anggota tersimpan, tapi ID tidak ditemukan. Upload PDF dibatalkan.");
    } else {
      // =====================================
      // 2. UPLOAD PDF (HANYA DI MODE ADD)
      // =====================================
      if (formAnggota.surat_kematian instanceof File) {
        try {
          console.log("📤 Mengupload PDF untuk ID:", newAnggotaId);
          
          const formDataPDF = new FormData();
          formDataPDF.append("file", formAnggota.surat_kematian);

          const uploadRes = await fetch(
            `http://127.0.0.1:8000/anggota/${selectedDtsenData.no_kk}/${newAnggotaId}/upload-surat-kematian`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formDataPDF
            }
          );

          const uploadData = await uploadRes.json();
          
          if (!uploadRes.ok) {
            console.error("❌ Upload PDF Gagal:", uploadData);
            throw new Error(uploadData.detail || "Gagal upload surat kematian");
          }

          console.log("✅ PDF Berhasil Upload. URL:", uploadData.url);
          // ✅ URL sudah tersimpan di DB oleh endpoint upload. 
          // TIDAK PERLU update state lokal karena akan di-refresh oleh fetchAnggota()
          
        } catch (uploadErr) {
          console.error("Upload Error:", uploadErr);
          alert("⚠️ Data anggota tersimpan, tapi upload PDF gagal: " + uploadErr.message);
          // Jangan return, biar data anggota tetap tersimpan
        }
      }
    }

    // =====================================
    // 3. REFRESH & RESET (URUTAN PENTING!)
    // =====================================
    
    // ✅ TUNGGU fetchAnggota SELESAI sebelum tutup modal
    await fetchAnggota(selectedNoKK);
    
    // ✅ Tutup modal SETELAH refresh selesai
    setIsAddAnggotaModalOpen(false);
    resetAddAnggotaModal();
    
    showSuccess();

  } catch (error) {
    console.error(error);
    alert("Gagal: " + error.message);
  }
};



// =================================================================
  // ✅ [FUNGSI INI TERHAPUS SEBELUMNYA, PASTIKAN ADA DI SINI]
  // =================================================================
  const handleEditAnggotaChange = (e) => { 
    setSelectedAnggotaData({ ...selectedAnggotaData, [e.target.name]: e.target.value }); 
  };




const handleEditSuratKematianChange = (e) => {
  const file = e.target.files[0];
  
  if (file) {
    // Validasi tipe
    if (file.type !== "application/pdf") {
      alert("Harap unggah file Surat Kematian dalam format .pdf");
      e.target.value = "";
      return;
    }
    
    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      e.target.value = "";
      return;
    }
  }
  
  // ✅ Simpan File object ke state terpisah (JANGAN ke selectedAnggotaData)
  setNewSuratKematianFile(file);

  if (previewSuratKematianUrl?.startsWith("blob:")) {
    URL.revokeObjectURL(previewSuratKematianUrl);
  }
  
  // Update preview (opsional, untuk UX)
  if (file) {
    setPreviewSuratKematianUrl(URL.createObjectURL(file));
  } else {
    // Jika user batal pilih file, kembalikan preview ke URL dari DB
    setPreviewSuratKematianUrl(selectedAnggotaData?.surat_kematian || "");
  }
};


  // =================================================================

const handleEditAnggotaSubmit = async (e) => {
  e.preventDefault();

  if (!selectedAnggotaData?.id || !selectedDtsenData?.no_kk) {
    alert("Data anggota atau No KK tidak valid");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const kondisi_khusus_gabung = gabungKondisiKhusus({
      kehamilan: selectedAnggotaData.kehamilan,
      disabilitas: selectedAnggotaData.disabilitas,
      penyakit_kronis: selectedAnggotaData.penyakit_kronis
    });

    const payload = {
      nama_anggota_keluarga: selectedAnggotaData.nama_anggota_keluarga,
      hubungan_keluarga: selectedAnggotaData.hubungan_keluarga,
      jenis_kelamin: selectedAnggotaData.jenis_kelamin,
      tanggal_lahir: selectedAnggotaData.tanggal_lahir,
      status_keadaan: selectedAnggotaData.status_keadaan,
      kondisi_khusus: kondisi_khusus_gabung
    };

    const endpoint = `http://127.0.0.1:8000/anggota/${selectedDtsenData.no_kk}/${selectedAnggotaData.id}`;

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.detail || `Gagal (Status: ${res.status})`);

    // ✅ UPLOAD PDF JIKA ADA FILE BARU
    let suratKematianUrl = selectedAnggotaData.surat_kematian || null;

    if (newSuratKematianFile instanceof File) {
      try {
        const formDataPDF = new FormData();
        formDataPDF.append("file", newSuratKematianFile);

        const uploadRes = await fetch(
          `http://127.0.0.1:8000/anggota/${selectedDtsenData.no_kk}/${selectedAnggotaData.id}/upload-surat-kematian`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formDataPDF
          }
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.detail || "Gagal upload surat kematian");
        }

        suratKematianUrl = uploadData.url;
        console.log("✅ PDF terupload, URL:", suratKematianUrl);

      } catch (uploadError) {
        alert("⚠️ Data tersimpan tapi upload PDF gagal: " + uploadError.message);
      }
    }

    // ✅ UPDATE STATE dengan URL terbaru (dari DB atau upload baru)
    setSelectedAnggotaData(prev => ({
      ...prev,
      surat_kematian: suratKematianUrl
    }));

    // ✅ Update dtsenData agar tabel ikut refresh
    setDtsenData(prevList => prevList.map(family => {
      if (family.no_kk === selectedDtsenData.no_kk) {
        return {
          ...family,
          anggota: (family.anggota || []).map(ang =>
            ang.id === selectedAnggotaData.id
              ? { ...ang, ...payload, surat_kematian: suratKematianUrl, kondisi_khusus: kondisi_khusus_gabung }
              : ang
          )
        };
      }
      return family;
    }));

    // ✅ Reset file state
    setNewSuratKematianFile(null);
    setPreviewSuratKematianUrl(suratKematianUrl || "");

    await fetchAnggota(selectedDtsenData.no_kk);
    setIsDetailAnggotaModalOpen(false);
    setSelectedAnggotaData(null);
    showSuccess();

  } catch (error) {
    console.error(error);
    alert("Gagal: " + error.message);
  }
};


  const handleOpenEditAset = () => {
    const existingAset = selectedDtsenData?.aset || {};
    setFormAset({
      v01: existingAset.v01 || "", v02: existingAset.v02 || "", v03: existingAset.v03 || "", v04: existingAset.v04 || "", v05: existingAset.v05 || "", v06: existingAset.v06 || "",
      v07: existingAset.v07 || "", v08: existingAset.v08 || "", v09: existingAset.v09 || "", v10: existingAset.v10 || "", v11: existingAset.v11 || "", v12: existingAset.v12 || "",
      v13: existingAset.v13 || "", v14: existingAset.v14 || "", v15: existingAset.v15 || "", v16: existingAset.v16 || "", v17: existingAset.v17 || "", v18: existingAset.v18 || "", v19: existingAset.v19 || "",
      v20: existingAset.v20 || "", v21: existingAset.v21 || "", v22: existingAset.v22 || "", v23: existingAset.v23 || "", v24: existingAset.v24 || "", v25: existingAset.v25 || "", v26: existingAset.v26 || "",
      v27: existingAset.v27 || "", v28: existingAset.v28 || "", v29: existingAset.v29 || "", v30: existingAset.v30 || "", v31: existingAset.v31 || "", v32: existingAset.v32 || "", v33: existingAset.v33 || "",
      v34: existingAset.v34 || "", v35: existingAset.v35 || "", v36: existingAset.v36 || "", v37: existingAset.v37 || "", v38: existingAset.v38 || "", v39: existingAset.v39 || ""
    });
    setIsEditAsetModalOpen(true);
  };

  const handleEditAsetChange = (e) => {
    const { name, value } = e.target;
    setFormAset((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAsetSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const no_kk = selectedDtsenData?.no_kk;
      if (!no_kk) throw new Error("No KK tidak ditemukan");

      const payload = { ...formAset };
      const response = await fetch(`http://127.0.0.1:8000/aset/${no_kk}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Gagal menyimpan");
      }

      const result = await response.json();
      const newAsetData = result.data || formAset;

      setSelectedDtsenData(prev => ({ ...prev, aset: newAsetData, asetLengkap: true }));
      setDtsenData(prevList => prevList.map(item => item.no_kk === no_kk ? { ...item, aset: newAsetData, asetLengkap: true } : item));
      setIsEditAsetModalOpen(false);
      showSuccess();
    } catch (error) {
      alert("Gagal: " + error.message);
    }
  };

  // const handleAddPPKSSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data, error } = await supabase.from('ppks').insert([{
  //       kategori_ppks: formPPKS.kategori_ppks, tanggal_penemuan: formPPKS.tanggal_penemuan, nik: formPPKS.nik || null, nama_lengkap: formPPKS.nama_lengkap || null,
  //       kecamatan: formPPKS.kecamatan, kelurahan: formPPKS.kelurahan, lokasi_penemuan: formPPKS.lokasi_penemuan, status_penanganan: "Menunggu Kelayakan" 
  //     }]);
  //     if (error) throw error;
  //     const newPPKS = { ...formPPKS, id: data[0].id, status_penanganan: "Menunggu Kelayakan", nik: formPPKS.nik || "Belum Diketahui", nama_lengkap: formPPKS.nama_lengkap || "Tanpa Identitas" };
  //     setDummyPPKS([newPPKS, ...dummyPPKS]);
  //     setIsAddPPKSModalOpen(false);
  //     setFormPPKS(initialFormPPKS);
  //     setFotoBuktiPPKS([]);
  //     showSuccess();
  //   } catch (error) {
  //     alert('Gagal menambah laporan PPKS: ' + error.message);
  //   }
  // };



 const handleAddPPKSSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Silakan login ulang.");

    // ✅ Validasi foto sebelum submit
    if (fotoBuktiPPKS.length === 0) {
      alert("⚠️ Minimal 1 foto bukti wajib diunggah.");
      return;
    }
    if (fotoBuktiPPKS.length > 3) {
      alert("⚠️ Maksimal 3 foto bukti.");
      return;
    }

    // =====================================
    // 1. INSERT DATA PPKS DULU — DAPAT ID
    // =====================================
    const res = await fetch("http://127.0.0.1:8000/ppks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        kategori_ppks: formPPKS.kategori_ppks,
        tanggal_penemuan: formPPKS.tanggal_penemuan,
        nik: formPPKS.nik || null,
        nama_lengkap: formPPKS.nama_lengkap || null,
        kecamatan: formPPKS.kecamatan,
        kelurahan: formPPKS.kelurahan,
        lokasi_penemuan: formPPKS.lokasi_penemuan,
        status_penanganan: "Kasus Aktif"
      })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.detail || JSON.stringify(result));

    const newPPKSId = result?.data?.id;
    console.log("✅ PPKS tersimpan, ID:", newPPKSId);

    if (!newPPKSId) throw new Error("ID PPKS tidak ditemukan dari response backend.");

    // =====================================
    // 2. UPLOAD FOTO — PAKAI fotoBuktiPPKS LANGSUNG
    // =====================================
    let fotoUrls = [];

    try {
      const formDataFoto = new FormData();
      formDataFoto.append("ppks_id", newPPKSId);

      // ✅ Ambil dari state fotoBuktiPPKS yang sudah diset oleh handleFileChange
      fotoBuktiPPKS.forEach(file => formDataFoto.append("files", file));

      console.log("📸 Mengupload", fotoBuktiPPKS.length, "foto untuk ID:", newPPKSId);

      const uploadRes = await fetch("http://127.0.0.1:8000/ppks/upload/foto-ppks", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataFoto
      });

      const uploadData = await uploadRes.json();
      console.log("📸 Upload response:", uploadData);

      if (!uploadRes.ok) {
        alert(`⚠️ Data PPKS tersimpan tapi upload foto gagal: ${uploadData?.detail || "Error tidak diketahui"}`);
      } else {
        fotoUrls = uploadData.urls || [];
        console.log("✅ Foto terupload:", fotoUrls);
      }
    } catch (uploadErr) {
      alert(`⚠️ Data PPKS tersimpan tapi upload foto gagal: ${uploadErr.message}`);
    }

    // =====================================
    // 3. UPDATE STATE FE
    // =====================================
    const newPPKS = {
      id: newPPKSId,
      kategori_ppks: formPPKS.kategori_ppks,
      tanggal_penemuan: formPPKS.tanggal_penemuan,
      nik: formPPKS.nik || "Belum Diketahui",
      nama_lengkap: formPPKS.nama_lengkap || "Tanpa Identitas",
      kecamatan: formPPKS.kecamatan,
      kelurahan: formPPKS.kelurahan,
      lokasi_penemuan: formPPKS.lokasi_penemuan,
      status_penanganan: "Kasus Aktif",
      bukti_foto_ppks: fotoUrls  // ✅ array URL dari Supabase Storage
    };

    setDummyPPKS(prev => [newPPKS, ...prev]);
    setIsAddPPKSModalOpen(false);
    setFormPPKS(initialFormPPKS);
    setFotoBuktiPPKS([]);
    showSuccess();

  } catch (error) {
    console.error("❌ Error:", error);
    alert("Terjadi kesalahan: " + error.message);
  }
};




// ==========================================
  // ✅ FUNGSI BUKA DETAIL PPKS (KEMBALIKAN FUNGSI INI)
  // ==========================================
  const handleOpenDetailPPKS = (data) => { 
    setSelectedPPKSData(data); 
    setCatatanAssessment(data.deskripsiAwal || ""); 
    setActiveTab("detail_ppks"); 
  };

  
const handleUpdateStatusPPKS = async (e, statusBaru) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    // ✅ Update via backend REST (konsisten dengan sumber data)
    const res = await fetch(`http://127.0.0.1:8000/ppks/${selectedPPKSData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        status_penanganan: statusBaru,
        catatan: catatanAssessment
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Gagal update status");
    }

    // ✅ Update state FE langsung
    const updatedPPKS = dummyPPKS.map(item =>
      item.id === selectedPPKSData.id
        ? { ...item, status_penanganan: statusBaru, deskripsiAwal: catatanAssessment }
        : item
    );
    setDummyPPKS(updatedPPKS);
    setSelectedPPKSData(prev => ({
      ...prev,
      status_penanganan: statusBaru,
      deskripsiAwal: catatanAssessment
    }));

    showSuccess();

  } catch (error) {
    console.error("Error updating PPKS:", error);
    alert("Gagal update status PPKS: " + error.message);
  }
};

  const formatDateIndo = (dateStr) => { if(!dateStr || dateStr === "-") return "-"; const date = new Date(dateStr); const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]; return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`; };
  
  const getKategoriPendidikan = (tanggal_lahir) => {
    if (!tanggal_lahir || tanggal_lahir === "-") return "Belum Ada Data";
    const birthDate = new Date(tanggal_lahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
    if (age >= 0 && age <= 5) return `Balita (${age} Tahun)`;
    if (age === 6) return `TK (${age} Tahun)`;
    if (age >= 7 && age <= 12) return `SD (${age} Tahun)`;
    if (age >= 13 && age <= 15) return `SMP (${age} Tahun)`;
    if (age >= 16 && age <= 18) return `SMA (${age} Tahun)`;
    if (age >= 19 && age <= 25) return `Pendidikan Tinggi (${age} Tahun)`;
    return `Dewasa Umum (${age} Tahun)`;
  };

  return (
    <>
      {/* =======================================================
          TABS NAVIGASI DINAMIS MENU DTSEN
      ======================================================= */}
      {activeMenu === "lihat_dtsen" && activeTab !== "detail_dtsen" && (
        <div className="tabs-container">
          <button className={`tab-btn ${activeTab === "dashboard_dtsen" ? "active" : ""}`} onClick={() => setActiveTab("dashboard_dtsen")}>Dashboard DTSEN</button>
          <button className={`tab-btn ${activeTab === "data_dtsen" ? "active" : ""}`} onClick={() => setActiveTab("data_dtsen")}>Lihat DTSEN</button>
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
              backgroundColor: (selectedPPKSData.status_penanganan || selectedPPKSData.status_penanganan) === 'Kasus Aktif' ? '#eff6ff' : (selectedPPKSData.status_penanganan || selectedPPKSData.status) === 'Selesai Ditangani' ? '#fffbeb' : '#dcfce7', 
              borderColor: (selectedPPKSData.status_penanganan || selectedPPKSData.status_penanganan) === 'Kasus Aktif' ? '#bfdbfe' : (selectedPPKSData.status_penanganan || selectedPPKSData.status) === 'Selesai Ditangani' ? '#fde047' : '#86efac',
              color: (selectedPPKSData.status_penanganan || selectedPPKSData.status_penanganan) === 'Kasus Aktif' ? '#1e3a8a' : (selectedPPKSData.status_penanganan || selectedPPKSData.status) === 'Selesai Ditangani' ? '#b45309' : '#166534',
              marginBottom: '25px', display: 'flex', justifyContent: 'space-between'
            }}>
            <span>Status Penanganan Saat Ini: <strong>{selectedPPKSData.status_penanganan || selectedPPKSData.status_penanganan}</strong></span>
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Tgl Laporan: {formatDateIndo(selectedPPKSData.tanggal_penemuan || selectedPPKSData.tanggal_penemuan)}</span>
          </div>

          <div className="detail-summary-grid">
            <div className="summary-col">
              <div className="summary-item"><span className="sum-label">Nama</span><span className="sum-val">{selectedPPKSData.nama_lengkap || "Tanpa Identitas"}</span></div>
              <div className="summary-item"><span className="sum-label">Nomor NIK (Jika Ada)</span><span className="sum-val">{selectedPPKSData.nik || "-"}</span></div>
            </div>
            <div className="summary-col">
              <div className="summary-item"><span className="sum-label">Kategori PPKS</span><span className="sum-val text-blue" style={{fontWeight: 'bold'}}>{selectedPPKSData.kategori_ppks || "-"}</span></div>
              <div className="summary-item"><span className="sum-label">Kecamatan Penemuan</span><span className="sum-val">{selectedPPKSData.kecamatan || "-"}</span></div>
            </div>
            <div className="summary-col" style={{ gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
              <div className="summary-item"><span className="sum-label">Lokasi Penemuan Spesifik</span><span className="sum-val">{selectedPPKSData.lokasi_penemuan || "-"}</span></div>
            </div>
          </div>



    <div className="modal-section" style={{ marginTop: '20px' }}>
            <h3 className="section-subtitle">Bukti Foto Penemuan</h3>

            {/* ✅ JIKA STATUS MASIH MENUNGGU FOTO -> TAMPILKAN FORM UPLOAD YANG SUDAH DIRAPIKAN */}
            {selectedPPKSData.status_penanganan === "Menunggu Foto Bukti" || selectedPPKSData.status_penanganan === "Menunggu Foto" ? (
              <div style={{ marginTop: '10px' }}>
                <label style={{ fontWeight: '600', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  Unggah Bukti Foto Lapangan (Maks. 3 Foto)*
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  style={{ padding: '10px', border: '1px dashed #94a3b8', borderRadius: '6px', width: '100%', backgroundColor: '#f8fafc', cursor: 'pointer' }}
                />
                <small style={{ color: '#64748b', display: 'block', marginTop: '6px' }}>
                  *Wajib unggah. Rekomendasi: 1 Foto Kondisi Fisik/Wajah, 1 Foto Lingkungan/Lokasi, 1 Foto Interaksi/Identitas.
                </small>

                {/* Preview Nama File yang Dipilih */}
                {fotoBuktiPPKS.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {fotoBuktiPPKS.map((file, idx) => (
                      <span key={idx} style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#e2e8f0', color: '#334155', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
                {/* ❌ Tombol Kuning dihapus dari sini */}
              </div>


            ) : (
              /* ✅ JIKA KASUS SUDAH AKTIF (FOTO SUDAH ADA) -> TAMPILKAN FOTONYA SEPERTI BIASA */
              (() => {
                let fotoList = [];
                if (Array.isArray(selectedPPKSData?.bukti_foto_ppks)) {
                  fotoList = selectedPPKSData.bukti_foto_ppks.filter(f => f && f.trim() !== "");
                } else if (typeof selectedPPKSData?.bukti_foto_ppks === 'string' && selectedPPKSData.bukti_foto_ppks.trim() !== "") {
                  fotoList = selectedPPKSData.bukti_foto_ppks.split(",").map(f => f.trim()).filter(f => f !== "");
                }

                if (fotoList.length === 0) {
                  return <p style={{ fontSize: '13px', color: '#94a3b8' }}>Tidak ada bukti foto yang dilampirkan.</p>;
                }

                return (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {fotoList.map((fotoUrl, idx) => (
                      <img
                        key={idx}
                        src={fotoUrl}
                        alt={`Bukti ${idx + 1}`}
                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                        onClick={() => window.open(fotoUrl, '_blank')}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ))}
                  </div>
                );
              })()
            )}
          </div>



          {/* ✅ [PERBAIKAN: AREA CATATAN DIBUAT READ-ONLY KHUSUS MENAMPILKAN PESAN VERIFIKATOR] */}
          <div className="modal-section" style={{ marginTop: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 className="section-subtitle">Instruksi & Catatan Verifikator</h3>
            
            {(selectedPPKSData.catatan_verifikator || selectedPPKSData.keterangan) ? (
              <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#1e293b', fontSize: '14px', lineHeight: '1.6' }}>
                {selectedPPKSData.catatan_verifikator || selectedPPKSData.keterangan}
              </div>
            ) : (
              <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>
                  Belum ada instruksi atau catatan dari Verifikator. Laporan sedang menunggu tinjauan.
                </p>
              </div>
            )}

            {/* Jika kasus sudah ditutup, tampilkan badge khusus */}
            {(selectedPPKSData.status_penanganan === "Selesai Ditangani") && (
              <div style={{ marginTop: '15px', textAlign: 'right' }}>
                <span style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', color: '#475569', borderRadius: '6px', fontWeight: '600', fontSize: '12px' }}>
                  Kasus Telah Ditutup / Selesai
                </span>
              </div>
            )}
          </div>

          {/* ✅ TOMBOL KUNING DIPINDAHKAN KE SINI (PALING BAWAH) */}
          {(selectedPPKSData.status_penanganan === "Menunggu Foto Bukti" || selectedPPKSData.status_penanganan === "Menunggu Foto") && (
            <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <button
                type="button"
                className="btn-modal-submit"
                style={{ width: 'auto', backgroundColor: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px' }}
                onClick={async () => {
                  if (fotoBuktiPPKS.length === 0) {
                    alert("⚠️ Pilih minimal 1 foto bukti terlebih dahulu.");
                    return;
                  }

                  // 1. Upload foto
                  await handleSubmitFotoPPKS(selectedPPKSData.id);

                  // 2. Ubah status otomatis menjadi "Kasus Aktif" ke Backend
                  const token = localStorage.getItem("token");
                  await fetch(`http://127.0.0.1:8000/ppks/${selectedPPKSData.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ status_penanganan: "Kasus Aktif", catatan: "" })
                  });

                  // 3. Update tampilan (state)
                  setDummyPPKS(prev => prev.map(item => item.id === selectedPPKSData.id ? { ...item, status_penanganan: "Kasus Aktif" } : item));
                  setSelectedPPKSData(prev => ({ ...prev, status_penanganan: "Kasus Aktif" }));
                }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Upload & Aktifkan Kasus
              </button>
            </div>
          )}

        </div> /* <-- Ini adalah penutup dari tab-content-wrapper Detail PPKS */
      )}

      {/* =======================================================
          2. DTSEN (TAB DASHBOARD)
      ======================================================= */}
      {activeMenu === "lihat_dtsen" && activeTab === "dashboard_dtsen" && (
        <div className="tab-content-wrapper">
          <div className="dtsen-summary-top">
            <div className="dtsen-top-content">
              <div>
                <h2 className="dtsen-top-title">Total Keluarga Terdaftar di DTSEN</h2>
                {/* ✅ 1. MENGEMBALIKAN SUBTITLE YANG TERHAPUS */}
                <p className="dtsen-top-subtitle">Data terpadu Kota Makassar yang telah tervalidasi</p>
              </div>
              <div className="dtsen-top-number">{dtsenData.length} <span>Keluarga</span></div>
            </div>
          </div>
          
          <h3 className="section-title" style={{ marginBottom: '15px' }}>Sebaran Desil Kesejahteraan</h3>
          
          <div className="decile-grid">
            {/* ✅ 2. MEMPERBAIKI CLASS CSS (dec-title) & ✅ 3. MENGEMBALIKAN SPAN KELUARGA */}
            <div className="decile-card d1">
              <div className="dec-head"><span className="dec-badge d1-bg">Desil 1</span></div>
              <div className="dec-title">Sangat Rentan / Ekstrem</div>
              <div className="dec-val">{dtsenData.filter(item => item.hasil_desil === "1").length} <span>Keluarga</span></div>
            </div>
            
            <div className="decile-card d2">
              <div className="dec-head"><span className="dec-badge d2-bg">Desil 2</span></div>
              <div className="dec-title">Keluarga Rentan</div>
              <div className="dec-val">{dtsenData.filter(item => item.hasil_desil === "2").length} <span>Keluarga</span></div>
            </div>
            
            <div className="decile-card d3">
              <div className="dec-head"><span className="dec-badge d3-bg">Desil 3</span></div>
              <div className="dec-title">Hampir Rentan</div>
              <div className="dec-val">{dtsenData.filter(item => item.hasil_desil === "3").length} <span>Keluarga</span></div>
            </div>
            
            <div className="decile-card d4">
              <div className="dec-head"><span className="dec-badge d4-bg">Desil 4</span></div>
              <div className="dec-title">Rentan Sedang</div>
              <div className="dec-val">{dtsenData.filter(item => item.hasil_desil === "4").length} <span>Keluarga</span></div>
            </div>
            
            <div className="decile-card d5">
              <div className="dec-head"><span className="dec-badge d5-bg">Desil 5</span></div>
              <div className="dec-title">Menuju Aman</div>
              <div className="dec-val">{dtsenData.filter(item => item.hasil_desil === "5").length} <span>Keluarga</span></div>
            </div>
            
            <div className="decile-card d6">
              <div className="dec-head"><span className="dec-badge d6-bg">Desil 6-10</span></div>
              <div className="dec-title">Keluarga Mampu / Aman</div>
              <div className="dec-val">{dtsenData.filter(item => item.hasil_desil === "6-10").length} <span>Keluarga</span></div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          3. DTSEN (TAB LIHAT DATA TABLE & FILTER DINAMIS)
      ======================================================= */}
      {activeMenu === "lihat_dtsen" && activeTab === "data_dtsen" && (
        <div className="tab-content-wrapper outline-box">
          <div className="pengusulan-filter-grid">
            <div className="filter-group-top">
              <label>Kecamatan</label>
              <div className="select-container-custom">
                <select name="kecamatan" value={filterDtsen.kecamatan} onChange={handleFilterDtsenChange}>
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
                <select name="kelurahan" value={filterDtsen.kelurahan} onChange={handleFilterDtsenChange} disabled={!filterDtsen.kecamatan}>
                  <option value="">{filterDtsen.kecamatan ? "Semua Kelurahan" : "Pilih Kecamatan Dulu"}</option>
                  {filterDtsen.kecamatan && daftarWilayah[filterDtsen.kecamatan].map((kel) => (
                    <option key={kel} value={kel}>{kel}</option>
                  ))}
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

          <div className="action-row-right" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
  
  {/* TOMBOL EXPORT DENGAN IKON SEMPURNA */}
  <button className="btn-action-data btn-export" onClick={() => handleExport("dtsen")} disabled={isExporting}>
    {isExporting ? "⏳ Exporting..." : (
      <>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export
      </>
    )}
  </button>

  {/* TOMBOL IMPORT DENGAN IKON SEMPURNA SEJAJAR */}
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

  <input type="file" accept=".csv" ref={importInputRef} style={{ display: 'none' }} onChange={(e) => handleImportFile(e, "keluarga", fetchKeluarga)} />

  <button className="btn-add-staff" onClick={() => setIsAddDtsenModalOpen(true)}>
    <span className="plus-icon">+</span> Tambah DTSEN
  </button>
</div>

          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>No. KK</th>
                    <th>NIK</th>
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
                    <tr key={item.user_id || item.id}>
                      <td>{item.no_kk}</td>
                      <td>{item.nik || "-"}</td>
                      <td style={{ fontWeight: '600' }}>{item.nama_kepala_keluarga}</td>
                      <td>{item.tanggal_lahir || "-"}</td>
                      <td>{item.jenis_kelamin || "-"}</td> 
                      <td>{item.kecamatan}</td>
                      <td>{item.kelurahan}</td>
                      <td>{item.alamat}</td>
                      <td style={{ textAlign: "center" }}>
                        {item.hasil_desil === 'Belum Dihitung' ? (
                          <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Belum Dihitung</span>
                        ) : (
                          <span className="desil-badge-table">{item.hasil_desil}</span>
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
              <div className="desil-box-red" style={{ backgroundColor: selectedDtsenData.hasil_desil === 'Belum Dihitung' ? '#f1f5f9' : '#fca5a5', color: selectedDtsenData.hasil_desil === 'Belum Dihitung' ? '#475569' : '#dc2626' }}>
                <span className="desil-text">TINGKAT DESIL</span>
                <span className="desil-number" style={{ fontSize: selectedDtsenData.hasil_desil === 'Belum Dihitung' ? '18px' : '32px' }}>{selectedDtsenData.hasil_desil}</span>
              </div>
            </div>
          </div>

          {selectedDtsenData.hasil_desil === 'Belum Dihitung' && (
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
            <div>
              <div className="action-row-right" style={{ marginBottom: '15px' }}>
                <button className="btn-add-staff" onClick={() => {
                    setSelectedAnggotaData(null);
                    setNewSuratKematianFile(null);
                    setPreviewSuratKematianUrl("");
                    resetAddAnggotaModal();
                    setIsAddAnggotaModalOpen(true);
                  }}>
                  <span className="plus-icon">+</span> Tambah Anggota
                </button>
              </div>

              <div className="table-wrapper" style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '10px' }}>
                <table className="staff-table" style={{ minWidth: '900px' }}>
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
                        // ✅ Parse string gabungan jadi object 3 field
                        const parsed = pisahKondisiKhusus(ang.kondisi_khusus);
                        
                        const kondisiList = [];
                        if (parsed.kehamilan && parsed.kehamilan !== "Tidak Sedang Hamil") {
                          kondisiList.push(`Hamil (${parsed.kehamilan})`);
                        }
                        if (parsed.disabilitas && parsed.disabilitas !== "Tidak Ada Disabilitas") {
                          kondisiList.push(parsed.disabilitas);
                        }
                        if (parsed.penyakit_kronis && parsed.penyakit_kronis.trim() !== "") {
                          kondisiList.push(parsed.penyakit_kronis);
                        }
                        const kondisi_khusus = kondisiList.length > 0 ? kondisiList.join(", ") : "-";
  

                      return (
                        <tr key={ang.id || index}>
                          <td>{ang.nik === "Belum Diinput" && index === 0 ? (selectedDtsenData?.nik || selectedDtsenData?.no_kk) : ang.nik}</td> 
                          <td style={{ fontWeight: index === 0 ? '600' : 'normal' }}>{ang.nama_anggota_keluarga || ang.nama_kepala_keluarga}</td>
                          <td>{ang.tanggal_lahir || "-"}</td>
                          <td>{ang.hubungan_keluarga}</td>
                          <td>{ang.jenis_kelamin && ang.jenis_kelamin !== "-" ? ang.jenis_kelamin : (index === 0 ? selectedDtsenData?.jenis_kelamin : "-")}</td>
                          <td>
                            {kondisi_khusus !== "-" ? (
                              <span
                                style={{
                                  color: '#e11d48',
                                  fontWeight: '600',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                  ></path>
                                </svg>

                                {kondisi_khusus}
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>-</span>
                            )}
                          </td>


                          {/* <td>
                            {kondisi_khusus.length > 0 ? (
                              <span style={{ color: '#e11d48', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                {kondisi_khusus.join(", ")}
                              </span>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>-</span>
                            )}
                          </td> */}
                          <td>
                            <span style={{ backgroundColor: ang.status_keadaan === 'Hidup' ? '#22c55e' : '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>
                              {ang.status_keadaan}
                            </span>
                          </td>




             <td style={{ textAlign: 'center' }}>
  {ang.status_keadaan === "Meninggal" ? (
    <button
      type="button"
      className="btn-search-outline"
      title="Lihat Surat Kematian"
      onClick={(e) => {
        e.stopPropagation();
        const pdfUrl = ang?.surat_kematian;
        
        console.log("🔍 Klik surat kematian:", {
          nama: ang.nama_anggota_keluarga,
          url: pdfUrl,
          tipe: typeof pdfUrl
        });
        
        if (pdfUrl && typeof pdfUrl === "string" && pdfUrl.startsWith("http")) {
          window.open(pdfUrl, "_blank", "noopener,noreferrer");
        } else {
          alert(`❌ Surat kematian belum tersedia.\n\nData: ${pdfUrl || 'KOSONG'}`);
        }
      }}
      style={{ 
        padding: '6px 12px', 
        fontSize: '11px', 
        color: ang?.surat_kematian ? '#be123c' : '#94a3b8',
        borderColor: ang?.surat_kematian ? '#fecdd3' : '#e2e8f0',
        backgroundColor: ang?.surat_kematian ? '#fff1f2' : '#f8fafc',
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '5px',
        cursor: 'pointer'
      }}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>
      Surat Kematian
    </button>
  ) : (
    <button type="button" className="btn-icon-keterangan" title="Lihat Detail" onClick={(e) => { 
      e.stopPropagation(); 
      handleOpenDetailAnggota(ang); 
    }}>
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>
  )}
</td>



                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                   Edit Data 39 Variabel Aset
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
          6. PPKS (TAB DAFTAR DATA TABLE & FILTER DINAMIS)
      ======================================================= */}
      {activeMenu === "ppks" && activeTab === "data_ppks" && (
        <div className="tab-content-wrapper outline-box">
          <div className="pengusulan-filter-grid">
            <div className="filter-group-top">
              <label>Kategori PPKS</label>
              <div className="select-container-custom">
                <select name="kategori_ppks" value={filterTabelPPKS.kategori_ppks} onChange={handleFilterPPKSChange}>
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
                  {Object.keys(daftarWilayah).map((kec) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filter-group-top">
              <label>Kelurahan</label>
              <div className="select-container-custom">
                <select name="kelurahan" value={filterTabelPPKS.kelurahan} onChange={handleFilterPPKSChange} disabled={!filterTabelPPKS.kecamatan}>
                  <option value="">{filterTabelPPKS.kecamatan ? "Semua Kelurahan" : "Pilih Kecamatan Dulu"}</option>
                  {filterTabelPPKS.kecamatan && daftarWilayah[filterTabelPPKS.kecamatan].map((kel) => (
                    <option key={kel} value={kel}>{kel}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filter-group-top">
              <label>Nama</label>
              <input type="text" name="nama" value={filterTabelPPKS.nama} onChange={handleFilterPPKSChange} className="input-custom" placeholder="Cari Nama..." />
            </div>
          </div>
          
          <div className="action-row-right" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }}>
  
  {/* TOMBOL EXPORT */}
  <button className="btn-action-data btn-export" onClick={() => handleExport("ppks")} disabled={isExporting}>
    {isExporting ? "⏳ Exporting..." : (
      <>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export
      </>
    )}
  </button>

  {/* TOMBOL IMPORT */}
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

  <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" ref={importInputRef} style={{ display: 'none' }} onChange={(e) => handleImportFile(e, "ppks", fetchKeluarga)} />

  <button className="btn-add-staff" onClick={() => setIsAddPPKSModalOpen(true)}>
    <span className="plus-icon">+</span> Tambah Laporan PPKS
  </button>
</div>
          
          <div className="table-wrapper">
            <div className="table-responsive">
              <table className="staff-table">
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
                    <th>Keterangan</th>
                    <th style={{ textAlign: "center" }}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {tabelPPKSFiltered.length > 0 ? tabelPPKSFiltered.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nik || "-"}</td>
                      <td><span style={{ fontWeight: '600', color: '#1e293b' }}>{item.nama_lengkap || "Tanpa Identitas"}</span></td>
                      <td>{item.kategori_ppks}</td>
                      <td>{item.kecamatan}</td>
                      <td>{item.kelurahan || "-"}</td>
                      <td>{item.lokasi_penemuan}</td>
                      <td>{item.tanggal_penemuan}</td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`badge-ppks ${item.status_penanganan === 'Kasus Aktif' ? 'badge-aktif' : 'badge-menunggu'}`}>{item.status_penanganan}</span>
                      </td>

{/* 
                      <span
                        className={`badge-ppks ${
                          item.status_penanganan === 'Kasus Aktif'
                            ? 'badge-aktif'
                            : item.status_penanganan === 'Selesai'
                            ? 'badge-selesai'
                            : 'badge-menunggu'
                        }`}
                      >
                        {item.status_penanganan}
                      </span> */}

                      {/* ✅ Kolom KETERANGAN (Sekarang berada di kiri Detail) */}
                      <td style={{ color: '#64748b', maxWidth: '200px' }}>
                        {item.catatan_verifikator || item.keterangan || "-"} 
                      </td>

                      <td style={{ textAlign: "center" }}>
                        
                        {/* UNTUK IMPORT SOAL FOTO */}
                        {item.status_penanganan === 'Menunggu Foto' ? (
                          <button 
                            className="btn-add-staff" 
                            style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPPKSForUpload(item.id);
                              setFotoBuktiPPKS([]);
                              setIsUploadFotoModalOpen(true);
                            }}
                          >
                          Lengkapi Bukti
                          </button>
                        ) : (
                          <button className="btn-icon-keterangan" title="Lihat Detail & Penanganan" onClick={() => handleOpenDetailPPKS(item)}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          </button>
                        )}
                      </td>
                    
                    </tr>
                  )) : (
                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Tidak ada data PPKS yang cocok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          SEMUA MODAL DIISOLASI DI FILE DTSEN AGAR STAFFDASHBOARD BERSIH 
      ======================================================= */}
      {/* MODAL DTSEN */}
      {isAddDtsenModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddDtsenModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '8px' }}>+</span><h2 style={{ margin: 0 }}>Registrasi Keluarga Baru di DTSEN</h2></div></div>
            <div className="modal-body">
              <div className="info-alert-box" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde047', color: '#b45309', marginBottom: '20px', padding: '12px 15px', borderRadius: '8px', fontSize: '13px' }}>Registrasi awal hanya memerlukan identitas dasar Kepala Keluarga. 39 Variabel Aset dapat dilengkapi setelah data ini tersimpan.</div>
              <form onSubmit={handleAddDtsen}>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>No. Kartu Keluarga (KK)*</label><input type="text" name="no_kk" value={formDtsen.no_kk} onChange={(e) => setFormDtsen({...formDtsen, no_kk: e.target.value})} required maxLength="16" placeholder="Masukkan 16 Digit KK"/></div>
                  <div className="form-group-modal"><label>NIK Kepala Keluarga*</label><input type="text" name="nik" value={formDtsen.nik} onChange={(e) => setFormDtsen({...formDtsen, nik: e.target.value})} required maxLength="16" placeholder="Masukkan 16 Digit NIK"/></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>Nama Kepala Keluarga*</label><input type="text" name="nama_kepala_keluarga" value={formDtsen.nama_kepala_keluarga} onChange={(e) => setFormDtsen({...formDtsen, nama_kepala_keluarga: e.target.value})} required placeholder="Sesuai KTP"/></div>
                  <div className="form-group-modal"><label>Tanggal Lahir*</label><input type="date" name="tanggal_lahir" value={formDtsen.tanggal_lahir || ""} onChange={(e) => setFormDtsen({...formDtsen, tanggal_lahir: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>Jenis Kelamin*</label><div className="select-container-custom"><select required value={formDtsen.jenis_kelamin} onChange={(e) => setFormDtsen({...formDtsen, jenis_kelamin: e.target.value})}><option value="" disabled hidden>Pilih Jenis Kelamin</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div></div>
                  <div className="form-group-modal">
                    <label>Kecamatan*</label>
                    <div className="select-container-custom">
                      <select required name="kecamatan" value={formDtsen.kecamatan} onChange={(e) => setFormDtsen({...formDtsen, kecamatan: e.target.value, kelurahan: ""})}>
                        <option value="" disabled hidden>Pilih Kecamatan</option>
                        {Object.keys(daftarWilayah).map((kec) => (
                          <option key={kec} value={kec}>{kec}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal">
                    <label>Kelurahan*</label>
                    <div className="select-container-custom">
                      <select required name="kelurahan" value={formDtsen.kelurahan} onChange={(e) => setFormDtsen({...formDtsen, kelurahan: e.target.value})} disabled={!formDtsen.kecamatan}>
                        <option value="" disabled hidden>{formDtsen.kecamatan ? "Pilih Kelurahan" : "Pilih Kecamatan Dulu"}</option>
                        {formDtsen.kecamatan && daftarWilayah[formDtsen.kecamatan].map((kel) => (
                          <option key={kel} value={kel}>{kel}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div></div>
                </div>
                <div className="form-grid-1" style={{ marginBottom: '20px' }}><div className="form-group-modal"><label>Alamat Lengkap / RT RW*</label><textarea value={formDtsen.alamat} onChange={(e) => setFormDtsen({...formDtsen, alamat: e.target.value})} required placeholder="Masukkan nama jalan, RT/RW" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #94a3b8', resize: 'vertical', minHeight: '60px'}}></textarea></div></div>
                <div className="modal-actions" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}><button type="button" className="btn-modal-cancel" onClick={() => setIsAddDtsenModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Registrasi Awal</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ANGGOTA */}
    {/* MODAL TAMBAH ANGGOTA */}
      {isAddAnggotaModalOpen && (
        <div className="modal-overlay" onClick={() => {
            setIsAddAnggotaModalOpen(false);
            resetAddAnggotaModal();
          }}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Tambah Anggota Keluarga</h2></div></div>
            <div className="modal-body">
              <form onSubmit={handleAddAnggotaSubmit}>
                {/* 📌 SESI 1: DATA PRIBADI */}
                <div className="modal-section">
                  <h3 className="section-subtitle" style={{ color: '#2563eb', borderBottom: '1px solid #bfdbfe', paddingBottom: '8px', marginBottom: '15px' }}>Data Pribadi</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>NIK*</label><input type="text" name="nik" value={formAnggota.nik} onChange={(e) => setFormAnggota({...formAnggota, nik: e.target.value})} required maxLength="16" placeholder="Ketik NIK..." /></div>
                    <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" name="nama_anggota_keluarga" value={formAnggota.nama_anggota_keluarga} onChange={(e) => setFormAnggota({...formAnggota, nama_anggota_keluarga: e.target.value})} required placeholder="Ketik Nama..." /></div>
                    <div className="form-group-modal"><label>Hubungan Keluarga*</label><div className="select-container-custom"><select name="hubungan_keluarga" value={formAnggota.hubungan_keluarga} onChange={(e) => setFormAnggota({...formAnggota, hubungan_keluarga: e.target.value})} required><option value="" hidden>Pilih Hubungan</option><option>Kepala Keluarga</option><option>Istri</option><option>Anak</option><option>Lainnya</option></select></div></div>
                    <div className="form-group-modal"><label>Status Keadaan*</label><div className="select-container-custom"><select name="status_keadaan" value={formAnggota.status_keadaan} onChange={(e) => setFormAnggota({...formAnggota, status_keadaan: e.target.value})} required><option value="Hidup">Hidup</option><option value="Meninggal">Meninggal</option></select></div></div>
                    <div className="form-group-modal"><label>Jenis Kelamin*</label><div className="select-container-custom"><select name="jenis_kelamin" value={formAnggota.jenis_kelamin} onChange={(e) => setFormAnggota({...formAnggota, jenis_kelamin: e.target.value})} required><option value="" hidden>Pilih Kelamin</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div></div>
                    <div className="form-group-modal"><label>Tanggal Lahir*</label><input type="date" name="tanggal_lahir" value={formAnggota.tanggal_lahir} onChange={(e) => setFormAnggota({...formAnggota, tanggal_lahir: e.target.value})} required /></div>

                    {/* ✅ JIKA STATUS MENINGGAL: MUNCUL FORM UPLOAD SURAT KEMATIAN */}
                   {formAnggota.status_keadaan === "Meninggal" && (
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1', backgroundColor: '#fff1f2', padding: '15px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                      <label style={{ color: '#be123c', fontWeight: 'bold' }}>
                        Unggah Surat Kematian (Format .pdf)*
                      </label>

                      {/* ✅ Preview PDF yang sudah dipilih atau URL yang tersedia */}
                      {previewSuratKematianUrl && (
                        <div style={{ marginBottom: '8px', marginTop: '8px' }}>
                          <a
                            href={previewSuratKematianUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontSize: '13px', textDecoration: 'underline' }}
                          >
                            📄 {formAnggota.surat_kematian instanceof File ? "Lihat Surat Kematian yang Dipilih" : "Lihat Surat Kematian"}
                          </a>
                        </div>
                      )}

                      {/* Input upload file */}
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleSuratKematianChange}
                        required={!formAnggota.surat_kematian}
                        style={{ marginTop: '8px', padding: '8px', backgroundColor: '#ffffff', border: '1px dashed #fda4af', borderRadius: '6px', width: '100%' }}
                      />

                      {/* ✅ Indikator file baru dipilih */}
                      {formAnggota.surat_kematian instanceof File && (
                        <div style={{ marginTop: '6px', padding: '6px 10px', backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: '6px', fontSize: '12px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>✅</span>
                          <span>File dipilih: <strong>{formAnggota.surat_kematian.name}</strong></span>
                        </div>
                      )}

                      <small style={{ color: '#f43f5e', display: 'block', marginTop: '5px' }}>
                        Wajib melampirkan bukti surat keterangan kematian resmi. Maks 5MB.
                      </small>
                    </div>
                  )}
              </div>  {/* ← TUTUP form-grid-2 */}
              </div>


                {/* 📌 SESI 2: KONDISI KHUSUS */}
                <div className="modal-section" style={{ marginTop: '20px' }}>
                  <h3 className="section-subtitle" style={{ color: '#ef4444', borderBottom: '1px solid #fecaca', paddingBottom: '8px', marginBottom: '15px' }}>Kondisi Khusus (Penting Untuk Bansos)</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal">
                      <label>Status Kehamilan (Bagi Perempuan)</label>
                      <div className="select-container-custom">
                        <select name="hamil" value={formAnggota.jenis_kelamin === 'Laki-laki' ? "Tidak Sedang Hamil" : formAnggota.hamil} onChange={(e) => setFormAnggota({...formAnggota, hamil: e.target.value})} disabled={formAnggota.jenis_kelamin === 'Laki-laki'} style={formAnggota.jenis_kelamin === 'Laki-laki' ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8' } : {}}>
                          <option value="Tidak Sedang Hamil">Tidak Sedang Hamil</option>
                          <option value="Sedang Hamil">Sedang Hamil</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group-modal">
                      <label>Kategori Disabilitas</label>
                      <div className="select-container-custom">
                        <select name="disabilitas" value={formAnggota.disabilitas} onChange={(e) => setFormAnggota({...formAnggota, disabilitas: e.target.value})}>
                          <option value="Tidak Ada Disabilitas">Tidak Ada Disabilitas</option>
                          <option value="Disabilitas Fisik">Disabilitas Fisik</option>
                          <option value="Disabilitas Intelektual">Disabilitas Intelektual</option>
                          <option value="Disabilitas Mental (ODGJ)">Disabilitas Mental (ODGJ)</option>
                          <option value="Disabilitas Sensorik Netra">Disabilitas Sensorik Netra</option>
                          <option value="Disabilitas Sensorik Rungu">Disabilitas Sensorik Rungu</option>
                          <option value="Disabilitas Sensorik Wicara">Disabilitas Sensorik Wicara</option>
                          <option value="Disabilitas Ganda/Multi">Disabilitas Ganda/Multi</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}>
                      <label>Penyakit Kronis / Menahun</label>
                      <input type="text" name="penyakit_kronis" value={formAnggota.penyakit_kronis} onChange={(e) => setFormAnggota({...formAnggota, penyakit_kronis: e.target.value})} placeholder="Kosongkan jika tidak ada, misal: TBC, Kanker, Paru-paru..." />
                    </div>
                  </div>
                </div>

                <div className="modal-actions" style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                  <button type="button" className="btn-modal-cancel" onClick={() => {
                      setIsAddAnggotaModalOpen(false);
                      resetAddAnggotaModal();
                    }}>Batal</button>
                  <button type="submit" className="btn-modal-submit" style={{ backgroundColor: '#10b981' }}>Simpan Anggota</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT ANGGOTA DETAIL */}
      {isDetailAnggotaModalOpen && selectedAnggotaData && (
        <div className="modal-overlay" onClick={() => setIsDetailAnggotaModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Detail Kondisi Anggota</h2></div></div>
            <div className="modal-body">
              <form onSubmit={handleEditAnggotaSubmit}>
                <div className="modal-section">
                  <h3 className="section-subtitle">Data Pribadi</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>NIK</label><input type="text" name="nik" value={selectedAnggotaData.nik} onChange={handleEditAnggotaChange} /></div>
                    <div className="form-group-modal"><label>Nama Lengkap</label><input type="text" name="nama_anggota_keluarga" value={selectedAnggotaData.nama_anggota_keluarga} onChange={handleEditAnggotaChange} /></div>
                    <div className="form-group-modal"><label>Hubungan Keluarga</label><div className="select-container-custom"><select name="hubungan_keluarga" value={selectedAnggotaData.hubungan_keluarga} onChange={handleEditAnggotaChange}><option>Kepala Keluarga</option><option>Istri</option><option>Anak</option><option>Lainnya</option></select></div></div>
                    <div className="form-group-modal"><label>Status Keadaan</label><div className="select-container-custom"><select name="status_keadaan" value={selectedAnggotaData.status_keadaan} onChange={handleEditAnggotaChange}><option value="Hidup">Hidup</option><option value="Meninggal">Meninggal</option></select></div></div>
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}>
                      <label>Estimasi Kategori Pendidikan/Usia (Otomatis dari Tanggal Lahir)</label>
                      <input type="text" value={getKategoriPendidikan(selectedAnggotaData.tanggal_lahir)} readOnly style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', fontWeight: 'bold' }} />
                    </div>

                    
                    {/* ✅ TAMBAHAN: MUNCULKAN FORM UPLOAD JIKA STATUS DIUBAH KE MENINGGAL */}
                    {selectedAnggotaData.status_keadaan === "Meninggal" && (
                      <div className="form-group-modal" style={{ gridColumn: '1 / -1', backgroundColor: '#fff1f2', padding: '15px', borderRadius: '8px', border: '1px solid #fecdd3', marginTop: '10px' }}>
                        <label style={{ color: '#be123c', fontWeight: 'bold' }}>Unggah Surat Kematian (Format .pdf){!selectedAnggotaData.surat_kematian && !newSuratKematianFile ? '*' : ''}</label>

                        {previewSuratKematianUrl && (
                          <div style={{ marginBottom: '8px', marginTop: '8px' }}>
                            <a
                              href={previewSuratKematianUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontSize: '13px', textDecoration: 'underline' }}
                            >
                              📄 {newSuratKematianFile instanceof File ? "Lihat Surat Kematian yang Dipilih" : "Lihat Surat Kematian saat ini"}
                            </a>
                          </div>
                        )}

                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleEditSuratKematianChange}
                          required={!selectedAnggotaData.surat_kematian && !newSuratKematianFile}
                          style={{ marginTop: '8px', padding: '8px', backgroundColor: '#ffffff', border: '1px dashed #fda4af', borderRadius: '6px', width: '100%' }}
                        />
                        <small style={{ color: '#f43f5e', display: 'block', marginTop: '5px' }}>Wajib melampirkan bukti surat keterangan kematian jika status diubah menjadi Meninggal.</small>
                      </div>


                    )}
                  </div>
                </div>
                
                <div className="modal-section" style={{ marginTop: '10px' }}>
                  <h3 className="section-subtitle" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>Kondisi Khusus (Penting Untuk Bansos)</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal">
                      <label>Status Kehamilan (Bagi Perempuan)</label>
                      <div className="select-container-custom">
                        <select 
                          name="kehamilan" 
                          value={selectedAnggotaData.jenis_kelamin === 'Laki-laki' ? "Tidak Sedang Hamil" : (selectedAnggotaData.kehamilan || "Tidak Sedang Hamil")} 
                          onChange={handleEditAnggotaChange}
                          disabled={selectedAnggotaData.jenis_kelamin === 'Laki-laki'}
                          style={selectedAnggotaData.jenis_kelamin === 'Laki-laki' ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8' } : {}}
                        >
                          <option value="Tidak Sedang Hamil">Tidak Sedang Hamil</option>
                          <option value="Sedang Hamil">Sedang Hamil</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group-modal"><label>Kategori Disabilitas</label><div className="select-container-custom"><select name="disabilitas" value={selectedAnggotaData.disabilitas || "Tidak Ada Disabilitas"} onChange={handleEditAnggotaChange}><option value="Tidak Ada Disabilitas">Tidak Ada Disabilitas</option><option value="Disabilitas Fisik">Disabilitas Fisik</option><option value="Disabilitas Intelektual">Disabilitas Intelektual</option><option value="Disabilitas Mental (ODGJ)">Disabilitas Mental (ODGJ)</option><option value="Disabilitas Sensorik Netra">Disabilitas Sensorik Netra</option><option value="Disabilitas Sensorik Rungu">Disabilitas Sensorik Rungu</option><option value="Disabilitas Sensorik Wicara">Disabilitas Sensorik Wicara</option><option value="Disabilitas Ganda/Multi">Disabilitas Ganda/Multi</option></select></div></div>
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}><label>Penyakit Kronis / Menahun</label><input type="text" name="penyakit_kronis" value={selectedAnggotaData.penyakit_kronis || ""} onChange={handleEditAnggotaChange} placeholder="Kosongkan jika tidak ada, misal: TBC, Kanker, Paru-paru..." /></div>
                  </div>
                </div>
                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsDetailAnggotaModalOpen(false)}>Tutup</button><button type="submit" className="btn-modal-submit">Simpan Perubahan</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 39 VARIABEL ASET */}
      {isEditAsetModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditAsetModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Pengisian Kuesioner 39 Variabel (PMT)</h2></div></div>
            <div className="modal-body" style={{ padding: '20px 30px' }}>
              <div className="info-alert-box" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a', fontSize: '13px', marginBottom: '20px' }}>Isi data dengan keadaan sebenar-benarnya berdasarkan observasi lapangan. Variabel ini akan dikalkulasi sistem untuk menentukan Tingkat Desil.</div>
              <form onSubmit={handleEditAsetSubmit}>
                <div className="modal-section" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h3 className="section-subtitle">1. Kondisi Demografi & Keluarga</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>V01 | Jenis Kelamin KK</label><div className="select-container-custom"><select name="v01" value={formAset.v01 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Laki-laki</option><option>Perempuan</option></select></div></div>
                    <div className="form-group-modal"><label>V02 | Usia KK</label><div className="select-container-custom"><select name="v02" value={formAset.v02 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>&lt; 25 tahun</option><option>25 - 40 tahun</option><option>41 - 55 tahun</option><option>56 - 65 tahun</option><option>&gt; 65 tahun</option></select></div></div>
                    <div className="form-group-modal"><label>V03 | Pendidikan Tertinggi KK</label><div className="select-container-custom"><select name="v03" value={formAset.v03 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak pernah sekolah</option><option>Tidak tamat SD</option><option>Tamat SD/sederajat</option><option>Tamat SMP/sederajat</option><option>Tamat SMA/sederajat</option><option>Tamat D1/D2/D3</option><option>Tamat S1 ke atas</option></select></div></div>
                    <div className="form-group-modal"><label>V04 | Status Pekerjaan KK</label><div className="select-container-custom"><select name="v04" value={formAset.v04 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak bekerja</option><option>Serabutan/tidak tetap</option><option>Buruh/Karyawan harian</option><option>Usaha sendiri</option><option>Karyawan tetap formal</option></select></div></div>
                    <div className="form-group-modal"><label>V05 | Status Perkawinan KK</label><div className="select-container-custom"><select name="v05" value={formAset.v05 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Cerai mati</option><option>Cerai hidup</option><option>Belum kawin</option><option>Kawin</option></select></div></div>
                    <div className="form-group-modal"><label>V06 | Jumlah Anggota Rumah Tangga</label><div className="select-container-custom"><select name="v06" value={formAset.v06 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>1 - 2 jiwa</option><option>3 jiwa</option><option>4 - 5 jiwa</option><option>6 - 7 jiwa</option><option>≥ 8 jiwa</option></select></div></div>
                  </div>
                </div>
                <div className="modal-section" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                  <h3 className="section-subtitle">2. Kondisi Perumahan & Sanitasi</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>V07 | Status Kepemilikan Rumah</label><div className="select-container-custom"><select name="v07" value={formAset.v07 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Menumpang</option><option>Sewa/kontrak</option><option>Milik sendiri</option></select></div></div>
                    <div className="form-group-modal"><label>V08 | Luas Lantai per Kapita</label><div className="select-container-custom"><select name="v08" value={formAset.v08 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>&lt; 4 m²/jiwa</option><option>4 - 7 m²/jiwa</option><option>8 - 15 m²/jiwa</option><option>&gt; 15 m²/jiwa</option></select></div></div>
                    <div className="form-group-modal"><label>V09 | Jenis Lantai</label><div className="select-container-custom"><select name="v09" value={formAset.v09 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tanah</option><option>Bambu/papan kayu</option><option>Semen/bata merah</option><option>Keramik</option></select></div></div>
                    <div className="form-group-modal"><label>V10 | Jenis Dinding</label><div className="select-container-custom"><select name="v10" value={formAset.v10 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Bambu/anyaman</option><option>Kayu/papan</option><option>Tembok tidak diplester</option><option>Tembok diplester</option></select></div></div>
                    <div className="form-group-modal"><label>V11 | Jenis Atap</label><div className="select-container-custom"><select name="v11" value={formAset.v11 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Rumbia/ijuk/daun</option><option>Seng/asbes</option><option>Genteng tanah liat</option><option>Genteng beton/metal</option></select></div></div>
                    <div className="form-group-modal"><label>V12 | Sumber Air Minum</label><div className="select-container-custom"><select name="v12" value={formAset.v12 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Sungai/air hujan</option><option>Sumur tak terlindung</option><option>Sumur terlindung</option><option>Mata air terlindung</option><option>Air isi ulang</option><option>PDAM/ledeng</option><option>Air kemasan bermerk</option></select></div></div>
                    <div className="form-group-modal"><label>V13 | Fasilitas BAB</label><div className="select-container-custom"><select name="v13" value={formAset.v13 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada/sembarang</option><option>Bersama/MCK umum</option><option>Milik sendiri</option></select></div></div>
                    <div className="form-group-modal"><label>V14 | Jenis Kloset</label><div className="select-container-custom"><select name="v14" value={formAset.v14 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada/cemplung</option><option>Plengsengan</option><option>Leher angsa</option></select></div></div>
                    <div className="form-group-modal"><label>V15 | Pembuangan Tinja</label><div className="select-container-custom"><select name="v15" value={formAset.v15 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Sungai/kebun/galian</option><option>Tangki septik</option><option>IPAL komunal</option></select></div></div>
                    <div className="form-group-modal"><label>V16 | Sumber Penerangan</label><div className="select-container-custom"><select name="v16" value={formAset.v16 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Bukan listrik</option><option>Listrik Non-PLN</option><option>Listrik PLN</option></select></div></div>
                    <div className="form-group-modal"><label>V17 | Daya Listrik</label><div className="select-container-custom"><select name="v17" value={formAset.v17 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>450 Watt</option><option>900 Watt</option><option>1.300 Watt</option><option>2.200 Watt ke atas</option></select></div></div>
                    <div className="form-group-modal"><label>V18 | Bahan Bakar Memasak</label><div className="select-container-custom"><select name="v18" value={formAset.v18 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Kayu bakar/arang</option><option>Minyak tanah</option><option>Gas elpiji 3 Kg</option><option>Gas elpiji ≥ 5.5 Kg</option><option>Listrik</option></select></div></div>
                    <div className="form-group-modal"><label>V19 | Jumlah Tabung Gas ≥5.5 Kg</label><div className="select-container-custom"><select name="v19" value={formAset.v19 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>1 tabung atau lebih</option></select></div></div>
                  </div>
                </div>
                <div className="modal-section" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                  <h3 className="section-subtitle">3. Aset Tidak Bergerak & Kendaraan</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>V20 | Kepemilikan Lahan/Tanah</label><div className="select-container-custom"><select name="v20" value={formAset.v20 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada, &lt; 500 m²</option><option>Ada, ≥ 500 m²</option></select></div></div>
                    <div className="form-group-modal"><label>V21 | Rumah/Bangunan Lain</label><div className="select-container-custom"><select name="v21" value={formAset.v21 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V22 | Usaha/Kios/Toko</label><div className="select-container-custom"><select name="v22" value={formAset.v22 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V23 | Jumlah Sepeda</label><div className="select-container-custom"><select name="v23" value={formAset.v23 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V24 | Jumlah Sepeda Motor</label><div className="select-container-custom"><select name="v24" value={formAset.v24 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V25 | Mobil/Truk/Minibus</label><div className="select-container-custom"><select name="v25" value={formAset.v25 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V26 | Kepemilikan Perahu</label><div className="select-container-custom"><select name="v26" value={formAset.v26 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                  </div>
                </div>
                <div className="modal-section" style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                  <h3 className="section-subtitle">4. Aset Elektronik, Ternak, & Finansial</h3>
                  <div className="form-grid-2">
                    <div className="form-group-modal"><label>V27 | Jumlah Televisi</label><div className="select-container-custom"><select name="v27" value={formAset.v27 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V28 | Kulkas/Freezer</label><div className="select-container-custom"><select name="v28" value={formAset.v28 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V29 | Jumlah Smartphone</label><div className="select-container-custom"><select name="v29" value={formAset.v29 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V30 | Komputer/Laptop</label><div className="select-container-custom"><select name="v30" value={formAset.v30 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V31 | Jumlah AC</label><div className="select-container-custom"><select name="v31" value={formAset.v31 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V32 | Jumlah Pemanas Air</label><div className="select-container-custom"><select name="v32" value={formAset.v32 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V33 | Mesin Cuci</label><div className="select-container-custom"><select name="v33" value={formAset.v33 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V34 | Telepon Rumah (kabel)</label><div className="select-container-custom"><select name="v34" value={formAset.v34 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada</option></select></div></div>
                    <div className="form-group-modal"><label>V35 | Ternak Besar (Sapi/Kerbau/Kuda)</label><div className="select-container-custom"><select name="v35" value={formAset.v35 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>1 - 2 ekor</option><option>≥ 3 ekor</option></select></div></div>
                    <div className="form-group-modal"><label>V36 | Ternak Kecil (Kambing/Babi)</label><div className="select-container-custom"><select name="v36" value={formAset.v36 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>1 - 5 ekor</option><option>≥ 6 ekor</option></select></div></div>
                    <div className="form-group-modal"><label>V37 | Unggas (Ayam/Bebek)</label><div className="select-container-custom"><select name="v37" value={formAset.v37 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>1 - 10 ekor</option><option>≥ 11 ekor</option></select></div></div>
                    <div className="form-group-modal"><label>V38 | Emas/Perhiasan</label><div className="select-container-custom"><select name="v38" value={formAset.v38 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada, &lt; 10 gram</option><option>Ada, ≥ 10 gram</option></select></div></div>
                    <div className="form-group-modal"><label>V39 | Tabungan</label><div className="select-container-custom"><select name="v39" value={formAset.v39 || ""} onChange={handleEditAsetChange} required><option value="" hidden>Pilih</option><option>Tidak ada</option><option>Ada, &lt; Rp 500.000</option><option>Ada, Rp 500rb - 5jt</option><option>Ada, &gt; Rp 5 juta</option></select></div></div>
                  </div>
                </div>
                <div className="modal-actions" style={{ marginTop: '30px' }}><button type="button" className="btn-modal-cancel" onClick={() => setIsEditAsetModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit" style={{ width: 'auto' }}>Simpan & Lengkapi 39 Variabel</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PPKS */}
      {isAddPPKSModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddPPKSModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Form Laporan PPKS Baru</h2></div></div>
            <div className="modal-body">
              <div className="info-alert-box" style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a', marginBottom: '20px', fontSize: '13px' }}>Jika PPKS tidak membawa identitas, kosongkan bagian NIK dan Nama. Pastikan Lokasi Penemuan diisi dengan sangat spesifik.</div>
              <form onSubmit={handleAddPPKSSubmit}>
                <div className="form-grid-2">
                  <div className="form-group-modal">
                    <label>Kategori PPKS*</label>
                    <div className="select-container-custom">
                      <select name="kategori_ppks" value={formPPKS.kategori_ppks} onChange={(e) => setFormPPKS({...formPPKS, kategori_ppks: e.target.value})} required>
                        <option value="" hidden>Pilih Kategori</option>
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
                  <div className="form-group-modal"><label>Tanggal Penemuan*</label><input type="date" name="tanggal_penemuan" value={formPPKS.tanggal_penemuan} onChange={(e) => setFormPPKS({...formPPKS, tanggal_penemuan: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>NIK (Bila Diketahui)</label><input type="text" name="nik" value={formPPKS.nik} onChange={(e) => setFormPPKS({...formPPKS, nik: e.target.value})} maxLength="16" placeholder="Kosongkan jika tidak ada" /></div>
                  <div className="form-group-modal"><label>Nama (Bila Diketahui)</label><input type="text" name="nama" value={formPPKS.nama_lengkap} onChange={(e) => setFormPPKS({...formPPKS, nama_lengkap: e.target.value})} placeholder="Contoh: Bapak Fulan" /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal">
                    <label>Kecamatan Penemuan*</label>
                    <div className="select-container-custom">
                      <select name="kecamatan" value={formPPKS.kecamatan} onChange={(e) => setFormPPKS({...formPPKS, kecamatan: e.target.value, kelurahan: ""})} required>
                        <option value="" hidden>Pilih Kecamatan</option>
                        {Object.keys(daftarWilayah).map((kec) => (
                          <option key={kec} value={kec}>{kec}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group-modal">
                    <label>Kelurahan Penemuan*</label>
                    <div className="select-container-custom">
                      <select name="kelurahan" value={formPPKS.kelurahan} onChange={(e) => setFormPPKS({...formPPKS, kelurahan: e.target.value})} required disabled={!formPPKS.kecamatan}>
                        <option value="" hidden>{formPPKS.kecamatan ? "Pilih Kelurahan" : "Pilih Kecamatan Dulu"}</option>
                        {formPPKS.kecamatan && daftarWilayah[formPPKS.kecamatan].map((kel) => (
                          <option key={kel} value={kel}>{kel}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-grid-1" style={{ marginBottom: '20px' }}>
                  <div className="form-group-modal"><label>Lokasi Penemuan Spesifik*</label><input type="text" name="lokasi_penemuan" value={formPPKS.lokasi_penemuan} onChange={(e) => setFormPPKS({...formPPKS, lokasi_penemuan: e.target.value})} required placeholder="Contoh: Pasar MT Haryono, depan Toko A" /></div>
                </div>
                
                {/* ✅ TAMBAHKAN BLOK UPLOAD FOTO DI SINI */}
                <div className="form-grid-1" style={{ marginBottom: '20px' }}>
                  <div className="form-group-modal">
                    <label>Unggah Bukti Foto Tindak Lanjut (Maks. 3 Foto)*</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/png, image/jpeg, image/jpg" 
                      onChange={handleFileChange} 
                      required 
                      style={{ padding: '8px', border: '1px dashed #94a3b8', borderRadius: '6px', width: '100%' }}
                    />
                    <small style={{ color: '#64748b', display: 'block', marginTop: '6px' }}>
                      *Wajib unggah. Rekomendasi: 1 Foto Kondisi Fisik/Wajah, 1 Foto Lingkungan/Lokasi, 1 Foto Interaksi/Identitas.
                    </small>
                    
                    {/* Preview nama file yang diupload */}
                    {fotoBuktiPPKS.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {fotoBuktiPPKS.map((file, idx) => (
                          <span key={idx} style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#e2e8f0', color: '#334155', borderRadius: '4px', border: '1px solid #cbd5e1' }}>{file.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-actions" style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}><button type="button" className="btn-modal-cancel" onClick={() => setIsAddPPKSModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Laporan</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dtsen;