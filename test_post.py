import json, urllib.request
data = {
    "no_kk": "7371999999999",
    "alamat": "Jl. Test No. 99",
    "nama_kepala_keluarga": "Test User",
    "kelurahan": "Test Kelurahan",
    "kecamatan": "Test Kecamatan",
    "jenis_kelamin": "Laki-laki",
    "tanggal_lahir": "1990-05-18T00:00:00.000Z",
    "desil": 3,
    "tanggal_hitung_desil": "2026-05-18T00:00:00.000Z"
}
try:
    req = urllib.request.Request('http://127.0.0.1:8000/keluarga/', data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
    res = urllib.request.urlopen(req)
    print('STATUS:', res.status)
    print('RESPONSE:', json.loads(res.read().decode()))
except Exception as e:
    print('ERROR:', type(e).__name__, str(e)[:200])
