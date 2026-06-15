// 📂 src/components/DataIO.jsx
import { useState } from 'react';

// 📥 TOMBOL EXPORT
export const ExportButton = ({ table, label = "📥 Export CSV", onExport, className = "btn-primary" }) => {
  const handleExport = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://backend-fastapi-ruby.vercel.app/data/${table}/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Gagal export");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${table}_export_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      if (onExport) onExport();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return <button onClick={handleExport} className={className} type="button">{label}</button>;
};

// 📤 TOMBOL IMPORT
export const ImportButton = ({ table, label = " Import CSV", onImport, className = "btn-secondary" }) => {
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".csv")) {
      alert("⚠️ Hanya file .CSV yang didukung");
      e.target.value = "";
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`https://backend-fastapi-ruby.vercel.app/data/${table}/import`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Gagal import");
      
      alert(data.message);
      if (onImport) onImport();
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <label className={className} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
      {loading ? " Memproses..." : label}
      <input type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} disabled={loading} />
    </label>
  );
};