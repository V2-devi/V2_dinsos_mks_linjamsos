import { useState } from "react";
// Sesuaikan path (jalur folder) di bawah ini dengan struktur folder Anda
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import Admin from "./pages/admin/dashboard.jsx"; 
import DataUser from "./pages/admin/datauser.jsx";
import AdminProfile from "./pages/admin/adminprofile.jsx";

function App() {
  // SEMENTARA kita set ke "login" agar langsung muncul di browser saat di-refresh
  const [page, setPage] = useState("admin");
  
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
    </>
  );
}

export default App;