# 🧪 Panduan Testing Kalkulasi Desil

## ✅ Perbaikan yang Telah Dilakukan

### 1. **Perbaiki Fuzzy Matching (`hitung_skor_pmt`)**
- ✅ Prioritas: Exact match dulu, baru partial match
- ✅ Logging detail setiap variable yang di-proses
- ✅ Tracking variable yang tidak cocok
- ✅ String validation & trimming

### 2. **Validasi Payload Pydantic**
- ✅ Gunakan `UpdateDesil` schema di routes
- ✅ Validasi tipe data (float, string)
- ✅ Validasi value tidak kosong/negatif
- ✅ Error response dengan HTTP 422 untuk validation error

### 3. **Error Handling yang Lebih Baik**
- ✅ Logging di setiap step kalkulasi
- ✅ Catch error di database update
- ✅ Return status code yang tepat (400 vs 422)
- ✅ Detailed error message untuk debugging

### 4. **Database Saving**
- ✅ Handle Supabase response yang kosong (normal behavior)
- ✅ Timestamp otomatis di backend
- ✅ Validasi No KK sebelum update

---

## 🧬 Alur Proses Kalkulasi

```
1. GET /desil/kalkulasi/{no_kk}
   ↓
2. Ambil data aset dari tabel "aset_keluarga"
   ↓
3. Hitung skor PMT dari 39 variabel
   ├─ v01: Jenis Kelamin
   ├─ v02: Umur
   ├─ ... (v03 s/d v38)
   └─ v39: Aset Non-Produktif
   ↓
4. Tentukan Desil & Kategori
   ├─ Desil 1 (≤ 8.26): Sangat Rentan
   ├─ Desil 2 (8.26-16.50): Keluarga Rentan
   ├─ Desil 3 (16.51-24.75): Hampir Rentan
   ├─ Desil 4 (24.76-33.00): Rentan Sedang
   ├─ Desil 5 (33.01-41.25): Menuju Aman
   └─ Desil 6-10 (≥ 41.26): Aman/Mampu
   ↓
5. Simpan ke tabel "keluarga"
   └─ Fields: skor_pmt, hasil_desil, kategori_desil, tanggal_hitung_desil
```

---

## 🧪 Testing Checklist

### **1. Test Data Aset Lengkap**
```bash
# Pastikan data aset sudah lengkap untuk No KK tertentu
# GET /aset/{no_kk} harus return semua 39 variabel
```

**Contoh Response:**
```json
{
  "data": {
    "id": 1,
    "no_kk": "1234567890123456",
    "v01": "Laki-laki",
    "v02": "25 - 40 tahun",
    "v03": "Tamat SMA/sederajat",
    "v04": "Karyawan tetap",
    ...
    "v39": "Rp 500rb - 5jt"
  }
}
```

### **2. Test Kalkulasi Desil**
```bash
# POST /desil/kalkulasi/{no_kk}
# Tidak perlu request body
```

**Expected Response (Success):**
```json
{
  "success": true,
  "message": "Kalkulasi desil berhasil",
  "data": {
    "no_kk": "1234567890123456",
    "skor_pmt": 45.5,
    "hasil_desil": "6-10",
    "kategori_desil": "Aman / Mampu",
    "tanggal_hitung_desil": "2026-05-24T10:30:00"
  }
}
```

**Expected Response (Error - Aset Kosong):**
```json
{
  "detail": "Data aset belum lengkap. Silakan isi data aset terlebih dahulu."
}
```

### **3. Test Simpan Langsung dari FE**
```bash
# PUT /desil/{no_kk}
# Content-Type: application/json
```

**Request Payload:**
```json
{
  "skor_pmt": 45.5,
  "hasil_desil": "6-10",
  "kategori_desil": "Aman / Mampu",
  "tanggal_hitung_desil": "2026-05-24T10:30:00"
}
```

**Expected Response:**
```json
{
  "message": "Hasil desil berhasil disimpan",
  "data": {
    "no_kk": "1234567890123456",
    "skor_pmt": 45.5,
    "hasil_desil": "6-10",
    "kategori_desil": "Aman / Mampu",
    "message": "Hasil desil berhasil disimpan"
  }
}
```

### **4. Test Validasi Payload**
**Test Case: Skor Negatif**
```json
{
  "skor_pmt": -5,
  "hasil_desil": "1",
  "kategori_desil": "Sangat Rentan",
  "tanggal_hitung_desil": "2026-05-24T10:30:00"
}
```
Expected: HTTP 422 - "Skor PMT tidak boleh negatif"

**Test Case: Field Kosong**
```json
{
  "skor_pmt": 25,
  "hasil_desil": "",
  "kategori_desil": "Rentan Sedang",
  "tanggal_hitung_desil": "2026-05-24T10:30:00"
}
```
Expected: HTTP 422 - "Hasil desil tidak boleh kosong"

### **5. Verifikasi Database**
```sql
-- Query di Supabase untuk verifikasi
SELECT 
  no_kk,
  skor_pmt,
  hasil_desil,
  kategori_desil,
  tanggal_hitung_desil
FROM keluarga
WHERE no_kk = '1234567890123456';
```

---

## 🔍 Debugging Log Console

Ketika endpoint dipanggil, Anda akan melihat log seperti ini:

```
📌 Endpoint POST /desil/kalkulasi/1234567890123456 dipanggil
🔍 Proses Kalkulasi Desil untuk No KK: 1234567890123456
✓ v01: 'Laki-laki' → 1.0
✓ v02: '25 - 40 tahun' → 1.0
✓ v03: 'Tamat SMA/sederajat' → 2.5
... (dst)
❌ v15: 'Sungai' - TIDAK ADA MATCH (contoh error)
✅ SKOR PMT TOTAL: 45.5
✅ DESIL: 6-10 | KATEGORI: Aman / Mampu
✅ Update response: ...
```

---

## 💡 Tips Debugging

1. **Jika skor terlalu rendah/tinggi:**
   - Check log console untuk variabel mana yang tidak match
   - Verifikasi data input di FE sesuai dengan BOBOT_PMT keys

2. **Jika gagal simpan ke database:**
   - Cek RLS policy di Supabase (apakah user bisa update keluarga table?)
   - Cek apakah No KK ada di tabel keluarga
   - Lihat error message detail di response

3. **Jika fuzzy matching tidak cocok:**
   - Lihat warning di console: "Variabel tanpa match: ..."
   - Update BOBOT_PMT atau standardize data input di FE

---

## 📝 Frontend Integration Example

```javascript
// Contoh di FE (React) untuk call endpoint

// 1. Kalkulasi desil
const hitungDesil = async (noKk) => {
  try {
    const response = await fetch(`/desil/kalkulasi/${noKk}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }
    
    const result = await response.json();
    console.log('Desil berhasil dihitung:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error kalkulasi desil:', error);
  }
};

// 2. Simpan desil langsung (alternatif)
const simpanDesil = async (noKk, desilData) => {
  try {
    const response = await fetch(`/desil/${noKk}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(desilData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }
    
    const result = await response.json();
    console.log('Desil tersimpan:', result.data);
  } catch (error) {
    console.error('Error simpan desil:', error);
  }
};
```

---

## 🚀 Production Checklist

- [ ] Test dengan 10+ kombinasi data aset berbeda
- [ ] Verifikasi hasil desil di database
- [ ] Check RLS policy Supabase keluarga table
- [ ] Monitor console log untuk warning/error
- [ ] Test error cases (kosong, invalid, negatif)
- [ ] Test dengan beberapa user/role berbeda
- [ ] Backup database sebelum mass update

---

**Terakhir Update:** 24 Mei 2026
