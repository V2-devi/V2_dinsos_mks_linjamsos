// 📂 src/utils/exportCSV.js (atau di komponen)
const HEADER_LABELS = {
  no_kk: "No. KK",
  nama_kepala_keluarga: "Nama Kepala Keluarga",
  alamat: "Alamat Lengkap",
  rt: "RT", rw: "RW",
  desa_kelurahan: "Desa/Kelurahan",
  kecamatan: "Kecamatan", kabupaten_kota: "Kabupaten/Kota",
  nik: "NIK", nama_lengkap: "Nama Lengkap",
  tanggal_lahir: "Tanggal Lahir", jenis_kelamin: "Jenis Kelamin",
  pekerjaan: "Pekerjaan", penghasilan: "Penghasilan (Rp)",
  kondisi_khusus: "Kondisi Khusus",
  // Tambahkan sesuai tabel lain
};

const getLabel = (key) => HEADER_LABELS[key] || key;

export const exportToCSV = (data, fileName = "export") => {
  if (!data?.length) return alert("Tidak ada data");
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  // ✅ Header Rapi
  csvRows.push(headers.map(h => `"${getLabel(h)}"`).join(","));
  
  for (const row of data) {
    const values = headers.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`);
    csvRows.push(values.join(","));
  }

  const blob = new Blob(["\uFEFF" + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  a.remove();
};
// // 📂 src/utils/exportCSV.js
// export const exportToCSV = (data, fileName = "export") => {
//   if (!data || data.length === 0) {
//     alert("️ Tidak ada data untuk diekspor");
//     return;
//   }

//   // Ambil header dari key object pertama
//   const headers = Object.keys(data[0]);
//   const csvRows = [];

//   // Tambah baris header
//   csvRows.push(headers.map(h => `"${h}"`).join(","));

//   // Tambah baris data
//   for (const row of data) {
//     const values = headers.map(header => {
//       const val = row[header] ?? "";
//       // Escape karakter khusus CSV (koma, kutip, enter)
//       const escaped = String(val).replace(/"/g, '""');
//       return `"${escaped}"`;
//     });
//     csvRows.push(values.join(","));
//   }

//   // Buat Blob & trigger download
//   const csvString = "\uFEFF" + csvRows.join("\n"); // \uFEFF = BOM untuk Excel
//   const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   window.URL.revokeObjectURL(url);
// };