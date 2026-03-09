import { useState } from "react";
// Sesuaikan path (jalur folder) di bawah ini dengan struktur folder Anda
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import Admin from "./pages/admin/dashboard.jsx"; 
import DataUser from "./pages/admin/datauser.jsx";
import AdminProfile from "./pages/admin/adminprofile.jsx";
import StaffDashboard from "./pages/staff/staffdashboard.jsx";

function App() {
  //  UBAH SEMENTARA KE "staff" AGAR BISA MELIHAT HASILNYA SAAT DI-REFRESH
  const [page, setPage] = useState("staff");
  
  return (
    <>
      {page === "login" && (
        <Login goToRegister={() => setPage("register")} />
      )}

      {page === "register" && (
        <Register goToLogin={() => setPage("login")} />
      )}

      {/* Menambahkan rute untuk halaman Admin */}
      {page === "admin" && (
        <Admin 
          // kiirm fungsi prop untuk pindadh ke halaman DataUser
          goToDataUser={()=> setPage("datauser")}
          goToProfile={() => setPage("adminprofile")} 
          />
      )}

      {page === "datauser" && (
        <DataUser
        // kirim fungsi prop untuk kembali ke halaman Admin
        goBack={() => setPage("admin")}
        />
      )}

      {page === "adminprofile" && (
        <AdminProfile goBack={() => setPage("admin")} 
        />
      )}

      {/* 3. TAMBAHKAN RUTE UNTUK HALAMAN STAFF */}
      {page === "staff" && (
        <StaffDashboard />
      )}
    </>
  );
}

export default App;