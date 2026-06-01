const splitCSVLine = (line) => {
  const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  return parts.map(p => p.replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"'));
};

// ✅ TIDAK ada 'nama kepala keluarga' di sini karena ambigu
// Ditangani di mappedKeys berdasarkan tableHint
const headerKeyMap = {
  // Shared
  'nik': 'nik',
  'no. kk': 'no_kk',
  'no kk': 'no_kk',
  'kecamatan': 'kecamatan',
  'kelurahan': 'kelurahan',
  'alamat': 'alamat',
  'alamat lengkap': 'alamat',

  // Usulan Bansos
  'tanggal pengusulan': 'tanggal_usulan',
  'status': 'status_pengusulan',
  'status_pengusulan': 'status_pengusulan',

  // DTSEN
  'tanggal lahir': 'tanggal_lahir',
  'jenis kelamin': 'jenis_kelamin',
  'desil': 'hasil_desil',

  // PPKS
  'kategori ppks': 'kategori_ppks',
  'lokasi penemuan': 'lokasi_penemuan',
  'tanggal laporan': 'tanggal_penemuan',
  'tanggal penemuan': 'tanggal_penemuan',
  'keterangan': 'catatan_verifikator'
};

const normalize = (s) => (s || '').toString().trim().toLowerCase();

export const parseAndMapCSV = (text, tableHint = '') => {
  if (!text) return [];
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length < 2) return [];

  const rawHeaders = splitCSVLine(lines[0]).map(h => h.trim());
  const t = normalize(tableHint);

  // ✅ Tentukan apakah ini tabel keluarga/dtsen atau bansos
  const isDtsen = t.includes('keluarga');
  const isPPKS = t.includes('ppks');

  const mappedKeys = rawHeaders.map(h => {
    const n = normalize(h);


    
    // ✅ Tangani "nama kepala keluarga" & "nama" berdasarkan tableHint
    if (n.includes('nama') && n.includes('kepala')) {
      return isDtsen ? 'nama_kepala_keluarga' : 'nama_lengkap';
    }
    if (n === 'nama') {
      return isDtsen ? 'nama_kepala_keluarga' : 'nama_lengkap';
    }

    // Cek headerKeyMap
    if (headerKeyMap[n]) {
      // ✅ Override 'status' berdasarkan tableHint
      if (n === 'status') {
        if (isPPKS) return 'status_penanganan';
        return 'status_pengusulan';
      }
      return headerKeyMap[n];
    }

    // Skip kolom id
    if (n === 'id' || n === 'no' || n === 'no.' || n === '#') return null;

    // Fallback heuristics
    if (n.includes('no') && n.includes('kk')) return 'no_kk';
    if (n.includes('tanggal')) {
      if (n.includes('pengusulan')) return 'tanggal_usulan';
      if (n.includes('laporan') || n.includes('penemuan')) return 'tanggal_penemuan';
      if (n.includes('lahir')) return 'tanggal_lahir';
      return isDtsen ? 'tanggal_lahir' : 'tanggal_usulan';
    }

    // Default snake_case
    return n.replace(/[^a-z0-9]+/g, '_');
  });

const rows = lines.slice(1).map(line => {
  const cols = splitCSVLine(line);
  const obj = {};
  for (let i = 0; i < mappedKeys.length; i++) {
    const key = mappedKeys[i];
    if (!key) continue;
    // ✅ Skip semua variasi kolom id
    if (['id', 'ID', 'Id', '_id', 'no_', '_', ''].includes(key)) continue;
    obj[key] = cols[i] !== undefined ? cols[i] : '';
  }
  return obj;
});

return rows.filter(row => Object.values(row).some(v => v !== ''));
};

export default { parseAndMapCSV };