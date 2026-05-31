// 📂 src/utils/exportCSV.js
export const exportToCSV = (data, fileName = "export") => {
  if (!data || data.length === 0) {
    alert("️ Tidak ada data untuk diekspor");
    return;
  }

  // Ambil header dari key object pertama
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Tambah baris header
  csvRows.push(headers.map(h => `"${h}"`).join(","));

  // Tambah baris data
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header] ?? "";
      // Escape karakter khusus CSV (koma, kutip, enter)
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  // Buat Blob & trigger download
  const csvString = "\uFEFF" + csvRows.join("\n"); // \uFEFF = BOM untuk Excel
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};