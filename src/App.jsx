import { useState } from "react";
// Sesuaikan path (jalur folder) di bawah ini dengan struktur folder Anda
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import Admin from "./pages/admin/dashboard.jsx"; 

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
        <Admin />
      )}
    </>
  );
}

export default App;