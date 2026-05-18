import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./staffdashboard.css";
import logoLinjamsos from "../../assets/logo_linjamsos.png";
import { supabase } from "../../config/supabase";

// ✅ IMPORT KOMPONEN YANG RAPI
import UsulanBaru from "./usulanbaru";
import Dtsen from "./dtsen";
import PenentuanDesil from "./penentuandesil";

function StaffDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // 1. STATE UTAMA (MANGKUK DATA)
  // ==========================================
  const [usulanData, setUsulanData] = useState([]);
  const [dtsenData, setDtsenData] = useState([]);
  const [dummyPPKS, setDummyPPKS] = useState([]);

  const [currentStaff, setCurrentStaff] = useState({
    nama: "Firliany",
    nip: "12345678912131230"
  });

  const [activeMenu, setActiveMenu] = useState((location.state && location.state.activeMenu) ? location.state.activeMenu : "usulan_baru"); 
  const [activeTab, setActiveTab] = useState((location.state && location.state.activeTab) ? location.state.activeTab : "dashboard"); 
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddPPKSModalOpen, setIsAddPPKSModalOpen] = useState(false);
  const [isKalkulasiModalOpen, setIsKalkulasiModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedKalkulasi, setSelectedKalkulasi] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false); 

  const [selectedDetailData, setSelectedDetailData] = useState(null);
  const [isAddDtsenModalOpen, setIsAddDtsenModalOpen] = useState(false);
  const [selectedDtsenData, setSelectedDtsenData] = useState(null);
  const [detailDtsenInnerTab, setDetailDtsenInnerTab] = useState("anggota"); 

  const [isAddAnggotaModalOpen, setIsAddAnggotaModalOpen] = useState(false);
  const [isDetailAnggotaModalOpen, setIsDetailAnggotaModalOpen] = useState(false);
  const [selectedAnggotaData, setSelectedAnggotaData] = useState(null);
  const [isEditAsetModalOpen, setIsEditAsetModalOpen] = useState(false);
  const [selectedPPKSData, setSelectedPPKSData] = useState(null);
  const [catatanAssessment, setCatatanAssessment] = useState("");

  const initialFormState = { 
    nik: "", no_kk: "", nama_lengkap: "", penginput: "",
    kecamatan: "", kelurahan: "", tanggal: "", alamat: "", desil: "", 
    jenis_bansos: "", status_pengusulan: "Belum" 
  };
  const [formData, setFormData] = useState(initialFormState);
  const [form, setForm] = useState({
    nama_lengkap: "", nik: "", no_kk: "",
    kecamatan: "", kelurahan: "", alamat: "", penginput: "", jenis_bansos: ""
  });
  const initialFormAnggota = { nik: "", nama_lengkap: "", hub: "", jk: "", tglLahir: "", status: "Hidup" };
  const [formAnggota, setFormAnggota] = useState(initialFormAnggota);
  const initialFormPPKS = { nik: "", nama_lengkap: "", kategori: "", kecamatan: "", kelurahan: "", lokasi: "", tanggal: "" }; 
  const [formPPKS, setFormPPKS] = useState(initialFormPPKS);
  const [formDtsen, setFormDtsen] = useState({ no_kk: "", nama_kepala_keluarga: "", jenis_kelamin:"", nik_kepala:"", kecamatan: "", kelurahan: "", alamat: "", tanggal_lahir: "" });
  const [formAset, setFormAset] = useState({});

  const [filterPeriodeDashboard, setFilterPeriodeDashboard] = useState("q1");
  const [filterTable, setFilterTable] = useState({ kecamatan: "", kelurahan: "", nik: "", nama_lengkap: "" });
  const [filterDtsen, setFilterDtsen] = useState({ kecamatan: "", kelurahan: "", no_kk: "", nama_kepala_keluarga: "" });
  const [filterPeriodePPKS, setFilterPeriodePPKS] = useState("q1");
  const [filterTabelPPKS, setFilterTabelPPKS] = useState({ kategori: "", kecamatan: "", kelurahan: "", nama: "" }); 
  const [filterDesil, setFilterDesil] = useState({ kecamatan: "", no_kk: "" });
  const [hasilKalkulasi, setHasilKalkulasi] = useState({ skor: 0, desil: "-", kategori: "-" });

  // ==========================================
  // 2. LOGIKA FILTER (DIAMANKAN AGAR TIDAK CRASH)
  // ==========================================
  const handleFilterChange = (e) => { setFilterTable({ ...filterTable, [e.target.name]: e.target.value }); };
  const handleFilterDtsenChange = (e) => { setFilterDtsen({ ...filterDtsen, [e.target.name]: e.target.value }); };
  const handleFilterPPKSChange = (e) => { setFilterTabelPPKS({ ...filterTabelPPKS, [e.target.name]: e.target.value }); };
  const handleFilterDesilChange = (e) => { setFilterDesil({ ...filterDesil, [e.target.name]: e.target.value }); };

  const getQuarter = (dateString) => {
    if (!dateString) return "q1";
    const month = new Date(dateString).getMonth() + 1;
    return month <= 3 ? "q1" : month <= 6 ? "q2" : month <= 9 ? "q3" : "q4";
  };

  const dashboardDataFiltered = usulanData.filter(item => getQuarter(item.tanggal_usulan) === filterPeriodeDashboard);
  const tableDataFiltered = usulanData.filter(item => {
    const itemNik = item.nik ? String(item.nik) : "";
    const itemNama = item.nama_lengkap ? String(item.nama_lengkap) : "";
    return (filterTable.kecamatan === "" || item.kecamatan === filterTable.kecamatan) && 
           (filterTable.kelurahan === "" || item.kelurahan === filterTable.kelurahan) && 
           (filterTable.nik === "" || itemNik.includes(filterTable.nik)) && 
           (filterTable.nama_lengkap === "" || itemNama.toLowerCase().includes(filterTable.nama_lengkap.toLowerCase()));
  });

  const tableDtsenFiltered = dtsenData.filter(item => {
    const matchKecamatan = filterDtsen.kecamatan === "" || item.kecamatan === filterDtsen.kecamatan;
    const matchKelurahan = filterDtsen.kelurahan === "" || item.kelurahan === filterDtsen.kelurahan;
    const matchKk = filterDtsen.no_kk === "" || (item.no_kk && String(item.no_kk).includes(filterDtsen.no_kk));
    const matchNama = filterDtsen.nama_kepala_keluarga === "" || (item.nama_kepala_keluarga && String(item.nama_kepala_keluarga).toLowerCase().includes(filterDtsen.nama_kepala_keluarga.toLowerCase()));
    return matchKecamatan && matchKelurahan && matchKk && matchNama;
  });

  const dashboardPPKSFiltered = dummyPPKS.filter(item => getQuarter(item.tanggal || item.tanggal_laporan) === filterPeriodePPKS);
  const tabelPPKSFiltered = dummyPPKS.filter(item => {
    const matchKategori = filterTabelPPKS.kategori === "" || item.kategori === filterTabelPPKS.kategori;
    const matchKecamatan = filterTabelPPKS.kecamatan === "" || item.kecamatan === filterTabelPPKS.kecamatan;
    const matchKelurahan = filterTabelPPKS.kelurahan === "" || item.kelurahan === filterTabelPPKS.kelurahan; // ✅ DITAMBAHKAN
    const itemNama = item.nama_lengkap ? String(item.nama_lengkap).toLowerCase() : "";
    const itemNik = item.nik ? String(item.nik) : "";
    const searchVal = filterTabelPPKS.nama ? filterTabelPPKS.nama.toLowerCase() : ""; 
    const matchNama = filterTabelPPKS.nama === "" || itemNama.includes(searchVal) || itemNik.includes(searchVal);
    return matchKategori && matchKecamatan && matchKelurahan && matchNama; // ✅ DIUBAH
  });
  const dummyRiwayatDesil = []; 
  const tabelRiwayatFiltered = dummyRiwayatDesil.filter((item) => {
    const matchKecamatan = filterDesil.kecamatan === "" || (item.kelurahan && String(item.kelurahan).includes(filterDesil.kecamatan));
    const matchNoKk = filterDesil.no_kk === "" || (item.no_kk && String(item.no_kk).includes(filterDesil.no_kk));
    return matchKecamatan && matchNoKk;
  });

  const statTotal = dashboardDataFiltered.length;
  const statSelesai = dashboardDataFiltered.filter(i => i.status_pengusulan === "Layak" || i.status_pengusulan === "Tidak Layak").length;
  const statBelum = dashboardDataFiltered.filter(i => i.status_pengusulan === "Belum").length;
  const statLayak = dashboardDataFiltered.filter(i => i.status_pengusulan === "Layak").length;
  const statTidakLayak = dashboardDataFiltered.filter(i => i.status_pengusulan === "Tidak Layak").length;
  const totalVerified = statLayak + statTidakLayak;
  const pctLayak = totalVerified === 0 ? 0 : Math.round((statLayak / totalVerified) * 100);
  const pctTidakLayak = totalVerified === 0 ? 0 : 100 - pctLayak;

  const ppksAktif = dashboardPPKSFiltered.filter(i => i.status === "Kasus Aktif").length;
  const ppksMenunggu = dashboardPPKSFiltered.filter(i => i.status === "Menunggu Kelayakan").length;
  const kategoriCount = {};
  dashboardPPKSFiltered.forEach(item => { kategoriCount[item.kategori] = (kategoriCount[item.kategori] || 0) + 1; });
  const top5PPKS = Object.entries(kategoriCount).map(([nama_lengkap, jumlah]) => ({ nama_lengkap, jumlah })).sort((a, b) => b.jumlah - a.jumlah).slice(0, 5); 
  const maxPPKS = top5PPKS.length > 0 ? top5PPKS[0].jumlah : 1; 

  // ==========================================
  // 3. LIFECYCLE (USE EFFECT FETCH)
  // ==========================================
  useEffect(() => {
    const savedStaffData = localStorage.getItem("currentStaffUser");
    if (savedStaffData) {
      const parsedData = JSON.parse(savedStaffData);
      const namaDepan = parsedData.namaLengkap ? parsedData.namaLengkap.split(' ')[0] : "Firliany";
      setCurrentStaff({ nama: namaDepan, nip: parsedData.nip || "12345678912131230" });
    }
    
    const fetchData = async () => {
      try {
        const { data: pengusulanData, error: pengusulanError } = await supabase.from('pengusulan_bansos').select('*');
        if (pengusulanError) throw pengusulanError;
        setUsulanData((pengusulanData || []).map(item => ({
          id: item.id, nik: item.nik, no_kk: item.no_kk, nama_lengkap: item.nama_lengkap, 
          penginput: item.penginput, kecamatan: item.kecamatan, kelurahan: item.kelurahan, tanggal: item.tanggal_usulan, 
          alamat: item.alamat, status_pengusulan: item.status_pengusulan, jenis_bansos: item.jenis_bansos
        })));

        const { data: dtsenDataFetched, error: dtsenError } = await supabase.from('keluarga').select('*');
        if (dtsenError) throw dtsenError;
        setDtsenData((dtsenDataFetched || []).map(item => ({
          id: item.id, no_kk: item.no_kk, nama_kepala_keluarga: item.nama_kepala_keluarga, kecamatan: item.kecamatan,
          kelurahan: item.kelurahan, alamat: item.alamat, desil: item.desil || "Belum Dihitung", anggota: [] 
        })));

        const { data: ppksData, error: ppksError } = await supabase.from('ppks').select('*');
        if (ppksError) throw ppksError;
        setDummyPPKS((ppksData || []).map(item => ({
          id: item.id, nik: item.nik, nama_lengkap: item.nama_lengkap, kategori: item.kategori, kecamatan: item.kecamatan,
          lokasi: item.lokasi, tanggal: item.tanggal_laporan, status_penanganan: item.status_penanganan
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []); 

  // ==========================================
  // 4. FUNGSI HANDLER UMUM
  // ==========================================
  const approve = async (id) => { await fetch(`/pengusulan/${id}/approve`, { method: "PUT" }); };
  const reject = async (id) => { await fetch(`/pengusulan/${id}/reject`, { method: "PUT" }); };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/pengusulan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('pengusulan_bansos').insert([{
        nama_lengkap: formData.nama_lengkap, nik: formData.nik || null, no_kk: formData.no_kk || null,
        kecamatan: formData.kecamatan, kelurahan: formData.kelurahan, alamat: formData.alamat, penginput: currentStaff.nama || "Staff", 
        status_pengusulan: "Belum", jenis_bansos: formData.jenis_bansos
      }]).select(); 
      if (error) throw error;
      const newUsulan = {
        id: data[0].id, nik: formData.nik, no_kk: formData.no_kk, nama_lengkap: formData.nama_lengkap, 
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

  const handleAddDtsen = async (e) => {
    e.preventDefault();
    const newDtsen = { 
      ...formDtsen, id: Date.now(), desil: "Belum Dihitung", 
      anggota: [{ 
        nik: formDtsen.nik_kepala || "Belum Diinput", 
        nama_lengkap: formDtsen.nama_kepala_keluarga, 
        hub: "Kepala Keluarga", 
        jk: formDtsen.jenis_kelamin || "-", 
        tglLahir: formDtsen.tanggal_lahir || "-", 
        status: "Hidup" 
      }]
    };
    setDtsenData([newDtsen, ...dtsenData]);
    setIsAddDtsenModalOpen(false);
    setFormDtsen({ no_kk: "", nama_kepala_keluarga: "", jenis_kelamin:"", nik_kepala:"", kecamatan: "", kelurahan: "", alamat: "", tanggal_lahir: "" });
    showSuccess();
  };

  const handleOpenDetailDtsen = (data) => { setSelectedDtsenData(data); setDetailDtsenInnerTab("anggota"); setActiveTab("detail_dtsen"); };
  const handleOpenDetailAnggota = (anggota) => { setSelectedAnggotaData(anggota); setIsDetailAnggotaModalOpen(true); };

  const handleAddAnggotaSubmit = (e) => {
    e.preventDefault();
    const newAnggota = { ...formAnggota, id: Date.now() };
    const updatedDtsenData = dtsenData.map(family => {
      if (family.id === selectedDtsenData.id) {
        const updatedFamily = { ...family, anggota: [...family.anggota, newAnggota] };
        setSelectedDtsenData(updatedFamily); return updatedFamily;
      }
      return family;
    });
    setDtsenData(updatedDtsenData); setIsAddAnggotaModalOpen(false); setFormAnggota(initialFormAnggota); showSuccess();
  };

  const handleEditAnggotaChange = (e) => { setSelectedAnggotaData({ ...selectedAnggotaData, [e.target.name]: e.target.value }); };

  const handleEditAnggotaSubmit = (e) => {
    e.preventDefault();
    const updatedDtsenData = dtsenData.map(family => {
      if (family.id === selectedDtsenData.id) {
        const updatedAnggotaList = family.anggota.map(ang => ang.id === selectedAnggotaData.id ? selectedAnggotaData : ang);
        const updatedFamily = { ...family, anggota: updatedAnggotaList };
        setSelectedDtsenData(updatedFamily); return updatedFamily;
      }
      return family;
    });
    setDtsenData(updatedDtsenData); setIsDetailAnggotaModalOpen(false); showSuccess();
  };

  const handleOpenEditAset = () => { setFormAset(selectedDtsenData.aset || {}); setIsEditAsetModalOpen(true); };
  const handleEditAsetChange = (e) => { setFormAset({ ...formAset, [e.target.name]: e.target.value }); };

  const handleEditAsetSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const tglSekarang = `${today.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"][today.getMonth()]} ${today.getFullYear()}`;
    const updatedDtsenData = dtsenData.map(family => {
      if (family.id === selectedDtsenData.id) {
        const updatedFamily = { ...family, aset: formAset, asetLengkap: true, tglUpdate: tglSekarang };
        setSelectedDtsenData(updatedFamily); return updatedFamily;
      }
      return family;
    });
    setDtsenData(updatedDtsenData); setIsEditAsetModalOpen(false); showSuccess();
  };

  const handleAddPPKSSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('ppks').insert([{
        kategori: formPPKS.kategori, tanggal_laporan: formPPKS.tanggal, nik: formPPKS.nik || null, nama_lengkap: formPPKS.nama_lengkap || null,
        kecamatan: formPPKS.kecamatan, kelurahan: formPPKS.kelurahan, lokasi: formPPKS.lokasi, status: "Menunggu Kelayakan" // ✅ DIUBAH
      }]);;
      if (error) throw error;
      const newPPKS = { ...formPPKS, id: data[0].id, status_penanganan: "Menunggu Kelayakan", nik: formPPKS.nik || "Belum Diketahui", nama_lengkap: formPPKS.nama_lengkap || "Tanpa Identitas" };
      setDummyPPKS([newPPKS, ...dummyPPKS]); setIsAddPPKSModalOpen(false); setFormPPKS(initialFormPPKS); showSuccess();
    } catch (error) { console.error('Error adding PPKS:', error); alert('Gagal menambah laporan PPKS: ' + error.message); }
  };

  const handleOpenDetailPPKS = (data) => { setSelectedPPKSData(data); setCatatanAssessment(data.deskripsiAwal || ""); setActiveTab("detail_ppks"); };

  const handleUpdateStatusPPKS = async (e, statusBaru) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('ppks').update({ status_penanganan: statusBaru }).eq('id', selectedPPKSData.id);
      if (error) throw error;
      const updatedPPKS = dummyPPKS.map(item => item.id === selectedPPKSData.id ? { ...item, status: statusBaru, deskripsiAwal: catatanAssessment } : item);
      setDummyPPKS(updatedPPKS); setSelectedPPKSData({ ...selectedPPKSData, status_penanganan: statusBaru, deskripsiAwal: catatanAssessment }); showSuccess();
    } catch (error) { console.error('Error updating PPKS status:', error); alert('Gagal update status PPKS: ' + error.message); }
  };

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

    setHasilKalkulasi({ skor: totalSkor.toFixed(2), desil: hasilDesil, kategori: hasilKat }); setIsCalculated(true);
  };

  const simpanHasilDesilKeluarga = () => {
      const today = new Date();
      const tglHitungStr = `${today.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"][today.getMonth()]} ${today.getFullYear()}`;
      const updatedDtsenData = dtsenData.map(family => {
        if (family.no_kk === selectedKalkulasi.no_kk) {
          return { ...family, desil: hasilKalkulasi.desil, skorPMT: hasilKalkulasi.skor, kategoriDesil: hasilKalkulasi.kategori, tglHitung: tglHitungStr };
        }
        return family;
      });
      setDtsenData(updatedDtsenData); setIsKalkulasiModalOpen(false); showSuccess(); setActiveTab("riwayat_penentuan");
    };

  const notifData = [{ id: 1, title: "Sistem", date: "Hari ini", desc: "Data berhasil dimuat." }];
  const showSuccess = () => { setIsSuccessModalOpen(true); setTimeout(() => setIsSuccessModalOpen(false), 2500); };
  const formatDateIndo = (dateStr) => { if(!dateStr || dateStr === "-") return "-"; const date = new Date(dateStr); const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]; return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`; };
  const getKategoriPendidikan = (tglLahir) => {
    if (!tglLahir || tglLahir === "-") return "Belum Ada Data";
    const birthDate = new Date(tglLahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age >= 0 && age <= 5) return `Balita (${age} Tahun)`;
    if (age === 6) return `TK (${age} Tahun)`;
    if (age >= 7 && age <= 12) return `SD (${age} Tahun)`;
    if (age >= 13 && age <= 15) return `SMP (${age} Tahun)`;
    if (age >= 16 && age <= 18) return `SMA (${age} Tahun)`;
    if (age >= 19 && age <= 25) return `Pendidikan Tinggi (${age} Tahun)`;
    return `Dewasa Umum (${age} Tahun)`;
  };

  // ==========================================
  // RENDER TAMPILAN (MASTER LAYOUT)
  // ==========================================
  return (
    <div className="staff-layout relative">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoLinjamsos} alt="Logo" className="sidebar-logo" />
          <div className="sidebar-brand-text"><span>PERLINDUNGAN DAN</span><span>JAMINAN SOSIAL</span></div>
        </div>
        
        <div className="sidebar-profile" style={{ cursor: 'pointer' }} onClick={() => navigate("/staffprofile")} title="Lihat Profil">
          <div className="profile-avatar-small"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"></circle><path d="M4 20c0-4 4-7 8-7s8 3 8 7"></path></svg></div>
          <div className="profile-info">
            <span className="profile-name">{currentStaff.nama}</span>
            <span className="profile-nik">{currentStaff.nip}</span>
          </div>
        </div>
        
        <nav className="sidebar-menu">
          <button className={`menu-item ${activeMenu === "usulan_baru" ? "active" : ""}`} onClick={() => { setActiveMenu("usulan_baru"); setActiveTab("dashboard"); }}>
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Usulan Baru
          </button>
          
          <div className="menu-group">
            <button className={`menu-item ${(activeMenu === "lihat_dtsen" || activeMenu === "ppks") ? "active-group" : ""}`}>
              <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> DTSEN & PPKS
            </button>
            <div className="submenu">
              <button className={`submenu-item ${activeMenu === "lihat_dtsen" ? "active-submenu" : ""}`} onClick={() => { setActiveMenu("lihat_dtsen"); setActiveTab("dashboard_dtsen"); }}>Lihat DTSEN</button>
              <button className={`submenu-item ${activeMenu === "ppks" ? "active-submenu" : ""}`} onClick={() => { setActiveMenu("ppks"); setActiveTab("dashboard_ppks"); }}>Daftar Pemerlu (PPKS)</button>
            </div>
          </div>

          <button className={`menu-item ${activeMenu === "penentuan_desil" ? "active" : ""}`} onClick={() => { setActiveMenu("penentuan_desil"); setActiveTab("menunggu_penentuan"); }}>
            <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg> Penentuan Desil
          </button>
          
          <button className="menu-item" style={{ marginTop: '40px', color: '#ef4444' }} onClick={() => navigate("/login")}>
             <svg className="menu-icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Keluar
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1 className="header-title">
            {activeMenu === "usulan_baru" && "Usulan Baru Bansos"}
            {activeMenu === "lihat_dtsen" && "Data Terpadu Sosial Ekonomi Nasional (DTSEN)"}
            {activeMenu === "ppks" && "Pengusulan Daftar PPKS"}
            {activeMenu === "penentuan_desil" && "Kalkulasi & Penentuan Desil Keluarga"}
          </h1>
          
          <div className="notif-wrapper">
            <button className="nav-bell-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </button>
            {isNotifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header"><h3>Pemberitahuan</h3></div>
                <div className="notif-body">
                  {notifData.map((n) => (
                    <div className="notif-item" key={n.id}>
                      <div className="notif-title-row"><h4>{n.title}</h4><span>{n.date}</span></div>
                      <p>{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {isNotifOpen && <div className="notif-backdrop" onClick={() => setIsNotifOpen(false)}></div>}

        {/* ✅ MENGGUNAKAN KOMPONEN ANAK YANG TELAH DIPISAH ✅ */}
        <div className="content-body">
          {activeMenu === "usulan_baru" && (
            <UsulanBaru 
              activeTab={activeTab} setActiveTab={setActiveTab}
              filterPeriodeDashboard={filterPeriodeDashboard} setFilterPeriodeDashboard={setFilterPeriodeDashboard}
              statTotal={statTotal} statSelesai={statSelesai} statBelum={statBelum}
              statLayak={statLayak} statTidakLayak={statTidakLayak} pctLayak={pctLayak} pctTidakLayak={pctTidakLayak}
              filterTable={filterTable} handleFilterChange={handleFilterChange} setIsAddModalOpen={setIsAddModalOpen}
              tableDataFiltered={tableDataFiltered} formatDateIndo={formatDateIndo}
              handleOpenDetailRiwayat={handleOpenDetailRiwayat} selectedDetailData={selectedDetailData}
            />
          )}

          {(activeMenu === "lihat_dtsen" || activeMenu === "ppks") && (
            <Dtsen 
              activeMenu={activeMenu} activeTab={activeTab} setActiveTab={setActiveTab}
              dtsenData={dtsenData} filterDtsen={filterDtsen} handleFilterDtsenChange={handleFilterDtsenChange}
              tableDtsenFiltered={tableDtsenFiltered} setIsAddDtsenModalOpen={setIsAddDtsenModalOpen}
              handleOpenDetailDtsen={handleOpenDetailDtsen} selectedDtsenData={selectedDtsenData}
              detailDtsenInnerTab={detailDtsenInnerTab} setDetailDtsenInnerTab={setDetailDtsenInnerTab}
              handleOpenEditAset={handleOpenEditAset} handleOpenDetailAnggota={handleOpenDetailAnggota}
              setIsAddAnggotaModalOpen={setIsAddAnggotaModalOpen} filterPeriodePPKS={filterPeriodePPKS}
              setFilterPeriodePPKS={setFilterPeriodePPKS} ppksAktif={ppksAktif} ppksMenunggu={ppksMenunggu}
              top5PPKS={top5PPKS} maxPPKS={maxPPKS} filterTabelPPKS={filterTabelPPKS}
              handleFilterPPKSChange={handleFilterPPKSChange} setIsAddPPKSModalOpen={setIsAddPPKSModalOpen}
              tabelPPKSFiltered={tabelPPKSFiltered} formatDateIndo={formatDateIndo}
              handleOpenDetailPPKS={handleOpenDetailPPKS} selectedPPKSData={selectedPPKSData}
              catatanAssessment={catatanAssessment} setCatatanAssessment={setCatatanAssessment}
              handleUpdateStatusPPKS={handleUpdateStatusPPKS}
            />
          )}

          {activeMenu === "penentuan_desil" && (
            <PenentuanDesil 
              activeTab={activeTab} setActiveTab={setActiveTab} filterDesil={filterDesil}
              handleFilterDesilChange={handleFilterDesilChange} dtsenData={dtsenData}
              setSelectedKalkulasi={setSelectedKalkulasi} setIsKalkulasiModalOpen={setIsKalkulasiModalOpen}
              setIsCalculated={setIsCalculated}
            />
          )}
        </div>
      </main>

      {/* =======================================================
          SEMUA MODAL (POP-UP) TETAP DISINI AGAR FUNGSI AMAN 
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
                  <div className="form-group-modal"><label>Nama Kepala Keluarga (Sesuai KTP)*</label><input type="text" name="nama" value={formData.nama_lengkap} onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})} required placeholder="Masukkan Nama Kepala Keluarga" /></div>
                  <div className="form-group-modal"><label>Tanggal Pengusulan*</label><input type="date" name="tanggal" value={formData.tanggal_usulan} onChange={(e) => setFormData({...formData, tanggal_usulan: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal">
                    <label>Kecamatan*</label>
                    <div className="select-container-custom"><select name="kecamatan" value={formData.kecamatan} onChange={(e) => setFormData({...formData, kecamatan: e.target.value})} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}><option value="" disabled hidden>Pilih Kecamatan</option><option value="Tallo">Tallo</option><option value="Bontoala">Bontoala</option><option value="Panakkukang">Panakkukang</option></select></div>
                  </div>
                  <div className="form-group-modal">
                    <label>Kelurahan/Desa*</label>
                    <div className="select-container-custom"><select name="kelurahan" value={formData.kelurahan} onChange={(e) => setFormData({...formData, kelurahan: e.target.value})} required style={{width:'100%', height:'40px', border:'1px solid #94a3b8', borderRadius:'6px', padding:'0 10px'}}><option value="" disabled hidden>Pilih Kelurahan</option><option value="Wala-walaya">Wala-walaya</option><option value="Baraya">Baraya</option><option value="Pannampu">Pannampu</option></select></div>
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
                  <div className="form-group-modal"><label>NIK Kepala Keluarga*</label><input type="text" name="nik_kepala" value={formDtsen.nik_kepala} onChange={(e) => setFormDtsen({...formDtsen, nik_kepala: e.target.value})} required maxLength="16" placeholder="Masukkan 16 Digit NIK"/></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>Nama Kepala Keluarga*</label><input type="text" name="nama_kepala_keluarga" value={formDtsen.nama_kepala_keluarga} onChange={(e) => setFormDtsen({...formDtsen, nama_kepala_keluarga: e.target.value})} required placeholder="Sesuai KTP"/></div>
                  <div className="form-group-modal"><label>Tanggal Lahir*</label><input type="date" name="tanggal_lahir" value={formDtsen.tanggal_lahir || ""} onChange={(e) => setFormDtsen({...formDtsen, tanggal_lahir: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>Jenis Kelamin*</label><div className="select-container-custom"><select required value={formDtsen.jenis_kelamin} onChange={(e) => setFormDtsen({...formDtsen, jenis_kelamin: e.target.value})}><option value="" disabled hidden>Pilih Jenis Kelamin</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div></div>
                  <div className="form-group-modal"><label>Kecamatan*</label><div className="select-container-custom"><select required value={formDtsen.kecamatan} onChange={(e) => setFormDtsen({...formDtsen, kecamatan: e.target.value})}><option value="" disabled hidden>Pilih Kecamatan</option><option value="Tallo">Tallo</option><option value="Bontoala">Bontoala</option></select></div></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>Kelurahan*</label><div className="select-container-custom"><select required value={formDtsen.kelurahan} onChange={(e) => setFormDtsen({...formDtsen, kelurahan: e.target.value})}><option value="" disabled hidden>Pilih Kelurahan</option><option value="Wala-walaya">Wala-walaya</option><option value="Baraya">Baraya</option></select></div></div>
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
      {isAddAnggotaModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddAnggotaModalOpen(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-header-title"><h2>Tambah Anggota Keluarga</h2></div></div>
            <div className="modal-body">
              <form onSubmit={handleAddAnggotaSubmit}>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>NIK*</label><input type="text" name="nik" value={formAnggota.nik} onChange={(e) => setFormAnggota({...formAnggota, nik: e.target.value})} required maxLength="16" placeholder="Ketik NIK..." /></div>
                  <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" name="nama_lengkap" value={formAnggota.nama_lengkap} onChange={(e) => setFormAnggota({...formAnggota, nama_lengkap: e.target.value})} required placeholder="Ketik Nama..." /></div>
                  <div className="form-group-modal"><label>Hubungan Keluarga*</label><div className="select-container-custom"><select name="hub" value={formAnggota.hub} onChange={(e) => setFormAnggota({...formAnggota, hub: e.target.value})} required><option value="" hidden>Pilih Hubungan</option><option>Kepala Keluarga</option><option>Istri</option><option>Anak</option><option>Lainnya</option></select></div></div>
                  <div className="form-group-modal"><label>Jenis Kelamin*</label><div className="select-container-custom"><select name="jk" value={formAnggota.jk} onChange={(e) => setFormAnggota({...formAnggota, jk: e.target.value})} required><option value="" hidden>Pilih Kelamin</option><option>Laki-laki</option><option>Perempuan</option></select></div></div>
                  <div className="form-group-modal"><label>Tanggal Lahir*</label><input type="date" name="tglLahir" value={formAnggota.tglLahir} onChange={(e) => setFormAnggota({...formAnggota, tglLahir: e.target.value})} required /></div>
                  <div className="form-group-modal"><label>Status Keadaan*</label><div className="select-container-custom"><select name="status" value={formAnggota.status} onChange={(e) => setFormAnggota({...formAnggota, status: e.target.value})} required><option>Hidup</option><option>Meninggal</option></select></div></div>
                </div>
                <div className="modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsAddAnggotaModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Anggota</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                    <div className="form-group-modal"><label>Nama Lengkap</label><input type="text" name="nama_lengkap" value={selectedAnggotaData.nama_lengkap} onChange={handleEditAnggotaChange} /></div>
                    <div className="form-group-modal"><label>Hubungan Keluarga</label><div className="select-container-custom"><select name="hub" value={selectedAnggotaData.hub} onChange={handleEditAnggotaChange}><option>Kepala Keluarga</option><option>Istri</option><option>Anak</option><option>Lainnya</option></select></div></div>
                    <div className="form-group-modal"><label>Status Keadaan</label><div className="select-container-custom"><select name="status" value={selectedAnggotaData.status} onChange={handleEditAnggotaChange}><option>Hidup</option><option>Meninggal</option></select></div></div>
                    
                    {/* ✅ INPUT BARU: Kategori Pendidikan Otomatis (Read-Only) */}
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}>
                      <label>Estimasi Kategori Pendidikan/Usia (Otomatis dari Tanggal Lahir)</label>
                      <input 
                        type="text" 
                        value={getKategoriPendidikan(selectedAnggotaData.tglLahir)} 
                        readOnly 
                        style={{ backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed', fontWeight: 'bold' }} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="modal-section" style={{ marginTop: '10px' }}>
                  <h3 className="section-subtitle" style={{ color: '#ef4444', borderColor: '#fca5a5' }}>Kondisi Khusus (Penting Untuk Bansos)</h3>
                  <div className="form-grid-2">
                    
                    {/* ✅ LOGIKA BARU: Jika Laki-laki, terkunci dan otomatis "Tidak Sedang Hamil" */}
                    <div className="form-group-modal">
                      <label>Status Kehamilan (Bagi Perempuan)</label>
                      <div className="select-container-custom">
                        <select 
                          name="hamil" 
                          value={selectedAnggotaData.jk === 'Laki-laki' ? "Tidak Sedang Hamil" : (selectedAnggotaData.hamil || "Tidak Sedang Hamil")} 
                          onChange={handleEditAnggotaChange}
                          disabled={selectedAnggotaData.jk === 'Laki-laki'}
                          style={selectedAnggotaData.jk === 'Laki-laki' ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8' } : {}}
                        >
                          <option value="Tidak Sedang Hamil">Tidak Sedang Hamil</option>
                          <option value="Sedang Hamil">Sedang Hamil</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group-modal"><label>Kategori Disabilitas</label><div className="select-container-custom"><select name="disabilitas" value={selectedAnggotaData.disabilitas || "Tidak Ada Disabilitas"} onChange={handleEditAnggotaChange}><option value="Tidak Ada Disabilitas">Tidak Ada Disabilitas</option><option value="Disabilitas Fisik">Disabilitas Fisik</option><option value="Disabilitas Intelektual">Disabilitas Intelektual</option><option value="Disabilitas Mental (ODGJ)">Disabilitas Mental (ODGJ)</option><option value="Disabilitas Sensorik Netra">Disabilitas Sensorik Netra</option><option value="Disabilitas Sensorik Rungu">Disabilitas Sensorik Rungu</option><option value="Disabilitas Sensorik Wicara">Disabilitas Sensorik Wicara</option><option value="Disabilitas Ganda/Multi">Disabilitas Ganda/Multi</option></select></div></div>
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}><label>Penyakit Kronis / Menahun</label><input type="text" name="penyakit" value={selectedAnggotaData.penyakit || ""} onChange={handleEditAnggotaChange} placeholder="Kosongkan jika tidak ada, misal: TBC, Kanker, Paru-paru..." /></div>
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
                    <div className="form-group-modal"><label>21. Tabung Gas 5.5kg / Kulkas</label><div className="select-container-custom"><select><option>Ada</option><option>Tidak Ada</option></select></div></div>
                    <div className="form-group-modal"><label>22. Sepeda Motor</label><div className="select-container-custom"><select><option>Tidak Ada</option><option>1 Unit</option></select></div></div>
                    <div className="form-group-modal"><label>23. Emas / Perhiasan ( 10 Gram)</label><div className="select-container-custom"><select><option>Ada</option><option>Tidak Ada</option></select></div></div>
                    <div className="form-group-modal"><label>24. Lahan Pertanian (Ha)</label><div className="select-container-custom"><select><option>Tidak Ada</option><option>&lt; 0.5 Ha</option><option> 0.5 Ha</option></select></div></div>
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
                      <select name="kategori" value={formPPKS.kategori} onChange={(e) => setFormPPKS({...formPPKS, kategori: e.target.value})} required>
                        <option value="" hidden>Pilih Kategori</option>
                        {/* ✅ 26 KATEGORI DITAMBAHKAN */}
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
                  <div className="form-group-modal"><label>Tanggal Penemuan*</label><input type="date" name="tanggal" value={formPPKS.tanggal} onChange={(e) => setFormPPKS({...formPPKS, tanggal: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>NIK (Bila Diketahui)</label><input type="text" name="nik" value={formPPKS.nik} onChange={(e) => setFormPPKS({...formPPKS, nik: e.target.value})} maxLength="16" placeholder="Kosongkan jika tidak ada" /></div>
                  <div className="form-group-modal"><label>Nama/Alias (Bila Diketahui)</label><input type="text" name="nama" value={formPPKS.nama_lengkap} onChange={(e) => setFormPPKS({...formPPKS, nama_lengkap: e.target.value})} placeholder="Contoh: Bapak Fulan" /></div>
                </div>
                {/* ✅ INPUT KECAMATAN DAN KELURAHAN */}
                <div className="form-grid-2">
                  <div className="form-group-modal"><label>Kecamatan Penemuan*</label><div className="select-container-custom"><select name="kecamatan" value={formPPKS.kecamatan} onChange={(e) => setFormPPKS({...formPPKS, kecamatan: e.target.value})} required><option value="" hidden>Pilih Kecamatan</option><option value="Tallo">Tallo</option><option value="Bontoala">Bontoala</option><option value="Panakkukang">Panakkukang</option></select></div></div>
                  <div className="form-group-modal"><label>Kelurahan Penemuan*</label><div className="select-container-custom"><select name="kelurahan" value={formPPKS.kelurahan} onChange={(e) => setFormPPKS({...formPPKS, kelurahan: e.target.value})} required><option value="" hidden>Pilih Kelurahan</option><option value="Wala-walaya">Wala-walaya</option><option value="Baraya">Baraya</option><option value="Pannampu">Pannampu</option></select></div></div>
                </div>
                <div className="form-grid-1" style={{ marginBottom: '20px' }}>
                  <div className="form-group-modal"><label>Lokasi Penemuan Spesifik*</label><input type="text" name="lokasi" value={formPPKS.lokasi} onChange={(e) => setFormPPKS({...formPPKS, lokasi: e.target.value})} required placeholder="Contoh: Pasar MT Haryono, depan Toko A" /></div>
                </div>
                <div className="modal-actions" style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}><button type="button" className="btn-modal-cancel" onClick={() => setIsAddPPKSModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Laporan</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KALKULASI DESIL */}
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
                    <div><span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>SKOR TOTAL PMT</span><span style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b' }}>{hasilKalkulasi.skor}</span></div>
                    <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '30px' }}><span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>MASUK KE DESIL</span><span style={{ backgroundColor: hasilKalkulasi.desil === "1" ? '#ef4444' : hasilKalkulasi.desil === "2" ? '#f97316' : '#f59e0b', color: 'white', padding: '8px 24px', borderRadius: '8px', fontSize: '24px', fontWeight: '900', display: 'inline-block' }}>{hasilKalkulasi.desil}</span></div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Berdasarkan skor, keluarga ini tergolong <strong style={{ color: '#1e293b' }}>{hasilKalkulasi.kategori}</strong>.</p>
                  <div className="modal-actions" style={{ marginTop: '20px' }}><button type="button" className="btn-modal-submit" onClick={simpanHasilDesilKeluarga} style={{ width: '100%' }}>Simpan Hasil ke Database</button></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUKSES */}
      {isSuccessModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="modal-content modal-success" onClick={(e) => e.stopPropagation()} style={{maxWidth: '400px', borderTop: '8px solid #22c55e'}}>
            <div className="modal-body text-center" style={{ padding: '40px 20px' }}>
              <div style={{width: '60px', height: '60px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)'}}><svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></div>
              <h2 style={{ color: '#234a66', fontSize: '22px', fontWeight: '800', margin: '0 0 8px 0' }}>Berhasil!</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;