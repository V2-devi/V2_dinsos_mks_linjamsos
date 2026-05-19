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

  // const token = localStorage.getItem("token");
  // console.log(token);

  //   const tableDtsenFiltered = dtsenData.filter(item => {
  //   const matchKecamatan = filterDtsen.kecamatan === "" || item.kecamatan === filterDtsen.kecamatan;
  //   const matchKelurahan = filterDtsen.kelurahan === "" || item.kelurahan === filterDtsen.kelurahan;
  //   const matchKk = filterDtsen.no_kk === "" || (item.no_kk && String(item.no_kk).includes(filterDtsen.no_kk));
  //   const matchNama = filterDtsen.nama_kepala_keluarga === "" || (item.nama_kepala_keluarga && String(item.nama_kepala_keluarga).toLowerCase().includes(filterDtsen.nama_kepala_keluarga.toLowerCase()));
  //   return matchKecamatan && matchKelurahan && matchKk && matchNama;
  // });

  // FETCH DATA KELUARGA
//   await fetch(
//   "http://127.0.0.1:8000/keluarga",
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(formData)
//   }
// );

//   useEffect(() => {

//   fetchKeluarga();

// }, []);

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
  
  const [isAddPPKSModalOpen, setIsAddPPKSModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [isAddDtsenModalOpen, setIsAddDtsenModalOpen] = useState(false);
  const [selectedDtsenData, setSelectedDtsenData] = useState(null);
  const [detailDtsenInnerTab, setDetailDtsenInnerTab] = useState("anggota"); 

  const [isAddAnggotaModalOpen, setIsAddAnggotaModalOpen] = useState(false);
  const [isDetailAnggotaModalOpen, setIsDetailAnggotaModalOpen] = useState(false);
  const [selectedAnggotaData, setSelectedAnggotaData] = useState(null);
  const [isEditAsetModalOpen, setIsEditAsetModalOpen] = useState(false);
  const [selectedPPKSData, setSelectedPPKSData] = useState(null);
  const [catatanAssessment, setCatatanAssessment] = useState("");

  // const initialFormAnggota = { nik: "", nama_lengkap: "", hub: "", jenis_kelamin: "", tanggal_lahir: "", status: "Hidup" };
  // const [formAnggota, setFormAnggota] = useState(initialFormAnggota);
  const initialFormPPKS = { nik: "", nama_lengkap: "", kategori_ppks: "", kecamatan: "", kelurahan: "", lokasi_penemuan: "", tanggal_penemuan: "" }; 
  const [formPPKS, setFormPPKS] = useState(initialFormPPKS);

  const [selectedNoKK, setSelectedNoKK] = useState(null);
   // =========================================
  // STATE FORM
  // =========================================
  const [formDtsen, setFormDtsen] = useState({
    no_kk: "",
    nama_kepala_keluarga: "",
    jenis_kelamin: "",
    nik: "",
    kecamatan: "",
    kelurahan: "",
    alamat: "",
    tanggal_lahir: "",
    desil: "",
    tanggal_hitung_desil: ""
  });

  // =========================================
  // STATE LIST DATA
  // =========================================
  // const [keluargaList, setKeluargaList] = useState([]);

  // =========================================
  // HANDLE INPUT
  // =========================================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormDtsen({
      ...formDtsen,
      [name]: value
    });
  };

  // =========================================
  // FETCH DATA KELUARGA
  // =========================================
  const fetchKeluarga = async () => {

  try {

    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    const response = await fetch(
      "http://127.0.0.1:8000/keluarga",
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    console.log("DATA KELUARGA:", data);

    if (Array.isArray(data)) {

      setDtsenData(
        (data || []).map(item => ({
          id: item.id,
          no_kk: item.no_kk,
          nik: item.nik,
          nama_kepala_keluarga: item.nama_kepala_keluarga,
          kecamatan: item.kecamatan,
          kelurahan: item.kelurahan,
          alamat: item.alamat,
          desil: item.desil || "Belum Dihitung",

          // 🔥 INI YANG FIX UTAMA
          anggota: item.anggota_keluarga || []
        }))
      );

    } else {

      setDtsenData([]);
    }

  } catch (error) {

    console.error("FETCH ERROR:", error);
  }
};

  // =========================================
  // LOAD DATA AWAL
  // =========================================
  useEffect(() => {

    fetchKeluarga();

  }, []);

  // =========================================
  // HANDLE SUBMIT
  // =========================================
  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    // =====================================
    // AMBIL TOKEN LOGIN
    // =====================================
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    console.log("DATA DIKIRIM:", formDtsen);

    const response = await fetch(
      "http://127.0.0.1:8000/keluarga",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(formDtsen)
      }
    );

    console.log("STATUS INSERT:", response.status);

    const data = await response.json();
    console.log("RESPONSE:", data);
    console.log("INSERT RESULT:", data);

    // =====================================
    // CEK GAGAL ATAU TIDAK
    // =====================================
    if (!response.ok) {

      alert(JSON.stringify(data, null, 2));

      return;
    }

    alert("Data keluarga berhasil ditambahkan");

    // =====================================
    // REFRESH DATA DARI DATABASE
    // =====================================
    await fetchKeluarga();

    // =====================================
    // RESET FORM
    // =====================================
    setFormDtsen({
      no_kk: "",
      nama_kepala_keluarga: "",
      jenis_kelamin: "",
      nik: "",
      kecamatan: "",
      kelurahan: "",
      alamat: "",
      tanggal_lahir: "",
      desil: "",
      tanggal_hitung_desil: ""
    });

  } catch (error) {

      console.error("SUBMIT ANGGOTA ERROR:", error);

      alert(error.message);
}
};

// Anggota Keluarga

const [formAnggota, setFormAnggota] = useState({
  nik: "",
  nama_anggota_keluarga: "",
  hubungan_keluarga: "",
  jenis_kelamin: "",
  tanggal_lahir: "",
  status_keadaan: ""
  
});

// const login = async () => {
//   const res = await fetch("http://127.0.0.1:8000/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       email,
//       password
//     })
//   });

//   const data = await res.json();

//   localStorage.setItem("token", data.access_token);
// };

const handleChangeAnggota = (e) => {
  const { name, value } = e.target;

  setFormAnggota((prev) => ({
    ...prev,
    [name]: value
  }));
};

const createKeluarga = async (formDtsen) => {
  const res = await fetch("http://127.0.0.1:8000/keluarga", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formDtsen)
  });

  const data = await res.json();
  console.log(data);
};


// const createAnggota = async (no_kk, formData) => {

//   const token = localStorage.getItem("token");

//   console.log("TOKEN:", token);

//   const res = await fetch(
//     `http://127.0.0.1:8000/keluarga/${no_kk}/anggota`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify(formData)
//     }
//   );

//   const data = await res.json();
//   console.log(data);
// };


// const submitAnggota = async (no_kk) => {

//   const token = localStorage.getItem("token");
//   console.log("TOKEN:", token);

//   const res = await fetch(
//     `http://127.0.0.1:8000/keluarga/${no_kk}/anggota`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify(formAnggota)
//     }
//   );

//   const data = await res.json();
//   console.log(data);
// };






const fetchAnggota = async (no_kk) => {

  try {

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://127.0.0.1:8000/keluarga/${no_kk}/anggota`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    console.log("DATA ANGGOTA:", data);

    // =========================
    // UPDATE dtsenData
    // =========================
    const updatedDtsen = dtsenData.map((item) => {

      if (item.no_kk === no_kk) {

        return {
          ...item,
          anggota: data
        };
      }

      return item;
    });

    setDtsenData(updatedDtsen);

    // =========================
    // UPDATE selected detail
    // =========================
    if (selectedDtsenData?.no_kk === no_kk) {

      setSelectedDtsenData({
        ...selectedDtsenData,
        anggota: data
      });
    }

  } catch (error) {

    console.error("FETCH ANGGOTA ERROR:", error);
  }
};


  const [formAset, setFormAset] = useState({});

  const [filterDtsen, setFilterDtsen] = useState({ kecamatan: "", kelurahan: "", no_kk: "", nama_kepala_keluarga: "" });
  const [filterPeriodePPKS, setFilterPeriodePPKS] = useState("q1");
  const [filterTabelPPKS, setFilterTabelPPKS] = useState({ kategori_ppks: "", kecamatan: "", kelurahan: "", nama: "" }); 

  // ==========================================
  // 2. LOGIKA FILTER (DIAMANKAN AGAR TIDAK CRASH)
  // ==========================================
  const handleFilterDtsenChange = (e) => { setFilterDtsen({ ...filterDtsen, [e.target.name]: e.target.value }); };
  const handleFilterPPKSChange = (e) => { setFilterTabelPPKS({ ...filterTabelPPKS, [e.target.name]: e.target.value }); };

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
    const matchKelurahan = filterTabelPPKS.kelurahan === "" || item.kelurahan === filterTabelPPKS.kelurahan; // ✅ DITAMBAHKAN
    const itemNama = item.nama_lengkap ? String(item.nama_lengkap).toLowerCase() : "";
    const itemNik = item.nik ? String(item.nik) : "";
    const searchVal = filterTabelPPKS.nama ? filterTabelPPKS.nama.toLowerCase() : ""; 
    const matchNama = filterTabelPPKS.nama === "" || itemNama.includes(searchVal) || itemNik.includes(searchVal);
    return matchKategori && matchKecamatan && matchKelurahan && matchNama; // ✅ DIUBAH
  });

  const ppksAktif = dashboardPPKSFiltered.filter(i => i.status_penanganan === "Kasus Aktif").length;
  const ppksMenunggu = dashboardPPKSFiltered.filter(i => i.status_penanganan === "Menunggu Kelayakan").length;
  const kategoriCount = {};
  dashboardPPKSFiltered.forEach(item => { kategoriCount[item.kategori_ppks] = (kategoriCount[item.kategori_ppks] || 0) + 1; });
  const top5PPKS = Object.entries(kategoriCount).map(([nama_lengkap, jumlah]) => ({ nama_lengkap, jumlah })).sort((a, b) => b.jumlah - a.jumlah).slice(0, 5); 
  const maxPPKS = top5PPKS.length > 0 ? top5PPKS[0].jumlah : 1; 

  // ==========================================
  // 3. LIFECYCLE (USE EFFECT FETCH)
  // ==========================================
  // ==========================================
  // 3. LIFECYCLE (USE EFFECT FETCH)
  // ==========================================
  useEffect(() => {
    const savedStaffData = localStorage.getItem("currentStaffUser");
    if (savedStaffData) {
      const parsedData = JSON.parse(savedStaffData);
      const namaDepan = parsedData.namaLengkap
        ? parsedData.namaLengkap.split(' ')[0]
        : "Firliany";
      setCurrentStaff({
        nama: namaDepan,
        nip: parsedData.nip || "12345678912131230"
      });
    }

    const fetchData = async () => {
      try {
        // ✅ Usulan Bansos — tetap dari Supabase
        const { data: pengusulanData, error: pengusulanError } =
          await supabase.from('pengusulan_bansos').select('*');
        if (pengusulanError) throw pengusulanError;
        setUsulanData(
          (pengusulanData || []).map(item => ({
            id: item.id,
            nik: item.nik,
            no_kk: item.no_kk,
            nama_lengkap: item.nama_lengkap,
            penginput: item.penginput,
            kecamatan: item.kecamatan,
            kelurahan: item.kelurahan,
            tanggal_usulan: item.tanggal_usulan,
            alamat: item.alamat,
            status_pengusulan: item.status_pengusulan,
            jenis_bansos: item.jenis_bansos
          }))
        );

        // ✅ DTSEN — fetch dari backend, BUKAN Supabase
        // fetchKeluarga() sudah dipanggil di useEffect terpisah di atas,
        // jadi tidak perlu dipanggil lagi di sini agar tidak terjadi race condition
        // ❌ HAPUS blok ini:
        // const { data: dtsenDataFetched, error: dtsenError } =
        //   await supabase.from('keluarga').select('*');
        // if (dtsenError) throw dtsenError;
        // setDtsenData(...);

        // ✅ PPKS — tetap dari Supabase
        const { data: ppksData, error: ppksError } =
          await supabase.from('ppks').select('*');
        if (ppksError) throw ppksError;
        setDummyPPKS(
          (ppksData || []).map(item => ({
            id: item.id,
            nik: item.nik,
            nama_lengkap: item.nama_lengkap,
            kategori_ppks: item.kategori_ppks,
            kecamatan: item.kecamatan,
            lokasi_penemuan: item.lokasi_penemuan,
            tanggal_penemuan: item.tanggal_penemuan,
            status_penanganan: item.status_penanganan
          }))
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // 4. FUNGSI HANDLER UMUM
  // ==========================================

  const handleAddDtsen = async (e) => {

  e.preventDefault();

  try {

    // =====================================
    // AMBIL TOKEN LOGIN
    // =====================================
    const token = localStorage.getItem("token");

console.log("TOKEN:", token);
    // =====================================
    // DATA YANG DIKIRIM KE BACKEND
    // =====================================
    const payload = {
      no_kk: formDtsen.no_kk,
      nama_kepala_keluarga: formDtsen.nama_kepala_keluarga,
      jenis_kelamin: formDtsen.jenis_kelamin,
      nik: formDtsen.nik || null,
      kecamatan: formDtsen.kecamatan ,
      kelurahan: formDtsen.kelurahan,
      alamat: formDtsen.alamat,
      tanggal_lahir: formDtsen.tanggal_lahir,  // format "YYYY-MM-DD" dari input date
      desil: 0,                                 // ✅ int, bukan string
      tanggal_hitung_desil: new Date().toISOString(), // ✅ wajib ada di schema
      skor_pmt: 0,
      user_id: null,
      updated_at: null
    };

    console.log("PAYLOAD:", payload);

    // =====================================
    // POST KE BACKEND
    // =====================================
    const response = await fetch(
      "http://127.0.0.1:8000/keluarga",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(payload)
      }
    );

    console.log("STATUS:", response.status);

    const data = await response.json();

    console.log("HASIL INSERT:", data);

    // =====================================
    // CEK ERROR
    // =====================================
    if (!response.ok) {

      // ✅ Handle validation error dari FastAPI/Pydantic
      const errorMsg = data.detail
        ? Array.isArray(data.detail)
        ? data.detail.map(d => `${d.loc?.join(".")} → ${d.msg}`).join("\n")
        : data.detail
        : JSON.stringify(data, null, 2);

      alert("Gagal:\n" + errorMsg);

      return;
    }

    // =====================================
    // REFRESH DATA DARI DATABASE
    // =====================================
    await fetchKeluarga();

    // =====================================
    // TUTUP MODAL
    // =====================================
    setIsAddDtsenModalOpen(false);

    // =====================================
    // RESET FORM
    // =====================================
    setFormDtsen({
      no_kk: "",
      nama_kepala_keluarga: "",
      jenis_kelamin: "",
      nik: "",
      kecamatan: "",
      kelurahan: "",
      alamat: "",
      tanggal_lahir: ""
    });

    showSuccess();

  } catch (error) {

    console.error("ERROR:", error);
    alert("Terjadi kesalahan: " + error.message);
  }
};

  // const handleOpenDetailDtsen = (data) => 
  //   { setSelectedDtsenData(data); 
  //     setDetailDtsenInnerTab("anggota"); 
  //     setActiveTab("detail_dtsen"); 
  //   };

  const handleOpenDetailDtsen = (data) => {

  console.log("DATA DETAIL:", data);

  setSelectedDtsenData(data);

  // ✅ INI YANG HILANG
  setSelectedNoKK(data.no_kk);

  setDetailDtsenInnerTab("anggota");

  setActiveTab("detail_dtsen");
}


  const handleOpenDetailAnggota = (anggota) => { setSelectedAnggotaData(anggota); setIsDetailAnggotaModalOpen(true); };

 const handleAddAnggotaSubmit = async (e) => {

  e.preventDefault();

  try {

    // ==============================
    // VALIDASI
    // ==============================
    if (!formAnggota.nik) {
      alert("NIK wajib diisi");
      return;
    }

    if (!selectedNoKK) {
      alert("No KK tidak ditemukan");
      return;
    }

    const token = localStorage.getItem("token");

    // ==============================
    // PAYLOAD
    // ==============================
    const payload = {

      nik: String(formAnggota.nik),

      nama_anggota_keluarga:
        formAnggota.nama_anggota_keluarga,

      hubungan_keluarga:
        formAnggota.hubungan_keluarga,

      jenis_kelamin:
        formAnggota.jenis_kelamin,

      tanggal_lahir:
        formAnggota.tanggal_lahir,

      status_keadaan:
        formAnggota.status_keadaan

    };
    console.log("PAYLOAD YANG DIKIRIM:", payload);
    console.log("kondisi_khusus DI PAYLOAD:", payload.kondisi_khusus);
    console.log("PAYLOAD ANGGOTA:", payload);

    // ==============================
    // FETCH
    // ==============================
    const response = await fetch(
      `http://127.0.0.1:8000/keluarga/${selectedDtsenData.no_kk}/anggota`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(payload)
      }
    );
      console.log("STATUS RESPONSE:", response.status);
    const data = await response.json();

    console.log("INSERT ANGGOTA:", data);

    // ==============================
    // HANDLE ERROR
    // ==============================
    if (!response.ok) {

      alert(JSON.stringify(data, null, 2));

      return;
    }

    // ==============================
    // REFRESH DATA
    // ==============================
    await fetchAnggota(selectedNoKK);

    // ==============================
    // TUTUP MODAL
    // ==============================
    setIsAddAnggotaModalOpen(false);

    // ==============================
    // RESET FORM
    // ==============================
    setFormAnggota({
      nik: "",
      nama_anggota_keluarga: "",
      hubungan_keluarga: "",
      jenis_kelamin: "",
      tanggal_lahir: "",
      status_keadaan: ""
    });

    showSuccess();

  } catch (error) {

    console.error("SUBMIT ANGGOTA ERROR:", error);

    alert(error.message);
  }
};



  const handleEditAnggotaChange = (e) => { setSelectedAnggotaData({ ...selectedAnggotaData, [e.target.name]: e.target.value }); };

// ✅ DI StaffDashboard.jsx
const handleEditAnggotaSubmit = (e) => {
  e.preventDefault();
  
  try {
    // ✅ Validasi data
    if (!selectedAnggotaData?.id && !selectedAnggotaData?.nik) {
      alert("Data anggota tidak valid");
      return;
    }

    // ✅ Update state dtsenData dengan data yang sudah diedit
    setDtsenData(prevData => 
      prevData.map(family => {
        // Cari keluarga yang sesuai (bisa by no_kk atau id)
        if (family.no_kk === selectedDtsenData?.no_kk || family.id === selectedDtsenData?.id) {
          const updatedAnggotaList = family.anggota?.map(ang => {
            // Cocokkan anggota by id atau nik
            if (ang.id === selectedAnggotaData.id || ang.nik === selectedAnggotaData.nik) {
              return { ...ang, ...selectedAnggotaData }; // ✅ Merge data baru
            }
            return ang;
          });
          
          return { 
            ...family, 
            anggota: updatedAnggotaList || [selectedAnggotaData] 
          };
        }
        return family;
      })
    );

    // ✅ Juga update selectedDtsenData agar UI detail tetap sinkron
    if (selectedDtsenData) {
      const updatedAnggotaList = selectedDtsenData.anggota?.map(ang => {
        if (ang.id === selectedAnggotaData.id || ang.nik === selectedAnggotaData.nik) {
          return { ...ang, ...selectedAnggotaData };
        }
        return ang;
      });
      setSelectedDtsenData({
        ...selectedDtsenData,
        anggota: updatedAnggotaList
      });
    }

    setIsDetailAnggotaModalOpen(false); 
    showSuccess();
    
  } catch (error) {
    console.error("Error updating anggota:", error);
    alert("Gagal menyimpan perubahan: " + error.message);
  }
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
        kategori_ppks: formPPKS.kategori_ppks, tanggal_penemuan: formPPKS.tanggal_penemuan, nik: formPPKS.nik || null, nama_lengkap: formPPKS.nama_lengkap || null,
        kecamatan: formPPKS.kecamatan, kelurahan: formPPKS.kelurahan, lokasi_penemuan: formPPKS.lokasi_penemuan, status_penanganan: "Menunggu Kelayakan" // ✅ DIUBAH
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
      const updatedPPKS = dummyPPKS.map(item => item.id === selectedPPKSData.id ? { ...item, status_penanganan: statusBaru, deskripsiAwal: catatanAssessment } : item);
      setDummyPPKS(updatedPPKS); setSelectedPPKSData({ ...selectedPPKSData, status_penanganan: statusBaru, deskripsiAwal: catatanAssessment }); showSuccess();
    } catch (error) { console.error('Error updating PPKS status:', error); alert('Gagal update status PPKS: ' + error.message); }
  };

  const notifData = [{ id: 1, title: "Sistem", date: "Hari ini", desc: "Data berhasil dimuat." }];
  const showSuccess = () => { setIsSuccessModalOpen(true); setTimeout(() => setIsSuccessModalOpen(false), 2500); };
  
  const formatDateIndo = (dateStr) => { if(!dateStr || dateStr === "-") return "-"; const date = new Date(dateStr); const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]; return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`; };
  
  const getKategoriPendidikan = (tanggal_lahir) => {
    if (!tanggal_lahir || tanggal_lahir === "-") return "Belum Ada Data";
    const birthDate = new Date(tanggal_lahir);
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
  // PPKS
  // ==========================================




  // ==========================================
  // RENDER TAMPILAN (MASTER LAYOUT)
  // =========================================
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
              activeTab={activeTab} setActiveTab={setActiveTab} usulanData={usulanData} setUsulanData={setUsulanData} 
              currentStaff={currentStaff} showSuccess={showSuccess} formatDateIndo={formatDateIndo} getQuarter={getQuarter}
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
              activeTab={activeTab} setActiveTab={setActiveTab} dtsenData={dtsenData} setDtsenData={setDtsenData} showSuccess={showSuccess}
            />
          )}
        </div>
      </main>

      {/* =======================================================
          SEMUA MODAL (POP-UP) TETAP DISINI AGAR FUNGSI AMAN 
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
                  <div className="form-group-modal"><label>Nama Lengkap*</label><input type="text" name="nama_anggota_keluarga" value={formAnggota.nama_anggota_keluarga} onChange={(e) => setFormAnggota({...formAnggota, nama_anggota_keluarga: e.target.value})} required placeholder="Ketik Nama..." /></div>
                  <div className="form-group-modal"><label>Hubungan Keluarga*</label><div className="select-container-custom"><select name="hubungan_keluarga" value={formAnggota.hubungan_keluarga} onChange={(e) => setFormAnggota({...formAnggota, hubungan_keluarga: e.target.value})} required><option value="" hidden>Pilih Hubungan</option><option>Kepala Keluarga</option><option>Istri</option><option>Anak</option><option>Lainnya</option></select></div></div>
                  <div className="form-group-modal"><label>Jenis Kelamin*</label><div className="select-container-custom"><select name="jenis_kelamin" value={formAnggota.jenis_kelamin} onChange={(e) => setFormAnggota({...formAnggota, jenis_kelamin: e.target.value})} required><option value="" hidden>Pilih Kelamin</option><option>Laki-laki</option><option>Perempuan</option></select></div></div>
                  <div className="form-group-modal"><label>Tanggal Lahir*</label><input type="date" name="tanggal_lahir" value={formAnggota.tanggal_lahir} onChange={(e) => setFormAnggota({...formAnggota, tanggal_lahir: e.target.value})} required /></div>
                  <div className="form-group-modal"><label>Status Keadaan*</label><div className="select-container-custom"><select name="status_keadaan" value={formAnggota.status_keadaan} onChange={(e) => setFormAnggota({...formAnggota, status_keadaan: e.target.value})} required><option>Hidup</option><option>Meninggal</option></select></div></div>
                  
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
                    <div className="form-group-modal"><label>Nama Lengkap</label><input type="text" name="nama_anggota_keluarga" value={selectedAnggotaData.nama_anggota_keluarga} onChange={handleEditAnggotaChange} /></div>
                    <div className="form-group-modal"><label>Hubungan Keluarga</label><div className="select-container-custom"><select name="hubungan_keluarga" value={selectedAnggotaData.hubungan_keluarga} onChange={handleEditAnggotaChange}><option>Kepala Keluarga</option><option>Istri</option><option>Anak</option><option>Lainnya</option></select></div></div>
                    <div className="form-group-modal"><label>Status Keadaan</label><div className="select-container-custom"><select name="status_keadaan" value={selectedAnggotaData.status_keadaan} onChange={handleEditAnggotaChange}><option>Hidup</option><option>Meninggal</option></select></div></div>
                    
                    {/* ✅ INPUT BARU: Kategori Pendidikan Otomatis (Read-Only) */}
                    <div className="form-group-modal" style={{ gridColumn: '1 / -1' }}>
                      <label>Estimasi Kategori Pendidikan/Usia (Otomatis dari Tanggal Lahir)</label>
                      <input 
                        type="text" 
                        value={getKategoriPendidikan(selectedAnggotaData.tanggal_lahir)} 
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
                          value={selectedAnggotaData.jenis_kelamin === 'Laki-laki' ? "Tidak Sedang Hamil" : (selectedAnggotaData.hamil || "Tidak Sedang Hamil")} 
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
                  <div className="form-group-modal"><label>Tanggal Penemuan*</label><input type="date" name="tanggal_penemuan" value={formPPKS.tanggal_penemuan} onChange={(e) => setFormPPKS({...formPPKS, tanggal_penemuan: e.target.value})} required /></div>
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
                  <div className="form-group-modal"><label>Lokasi Penemuan Spesifik*</label><input type="text" name="lokasi_penemuan" value={formPPKS.lokasi_penemuan} onChange={(e) => setFormPPKS({...formPPKS, lokasi_penemuan: e.target.value})} required placeholder="Contoh: Pasar MT Haryono, depan Toko A" /></div>
                </div>
                <div className="modal-actions" style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}><button type="button" className="btn-modal-cancel" onClick={() => setIsAddPPKSModalOpen(false)}>Batal</button><button type="submit" className="btn-modal-submit">Simpan Laporan</button></div>
              </form>
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