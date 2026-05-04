import React from "react";
// Import sistem Router dari React Router DOM
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Sesuaikan path import dengan struktur folder Anda
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
import ForgotPassword from "./pages/auth/lupapass.jsx"; // Sesuaikan jika nama filenya huruf kecil semua
<<<<<<< HEAD
=======

import Verify from "./pages/auth/verify.jsx";

>>>>>>> 1f2a125a2acf90f4a03e21fdd1bbde4993a58572
import Admin from "./pages/admin/dashboard.jsx"; 
import DataUser from "./pages/admin/datauser.jsx";
import AdminProfile from "./pages/admin/adminprofile.jsx";
import StaffDashboard from "./pages/staff/staffdashboard.jsx"; 
import StaffProfile from "./pages/staff/StaffProfile";
import VerifikatorDashboard from "./pages/verifikator/verifikatordashboard.jsx";


function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Jika user membuka localhost:5173/ saja, otomatis diarahkan ke /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

<<<<<<< HEAD
=======
      <Route path="/verify" element={<Verify />} />

      {/* RUTE LUPA PASSWORD BARU */}
>>>>>>> 1f2a125a2acf90f4a03e21fdd1bbde4993a58572
      <Route path="/forgot-password" element={<ForgotPassword />} />
      

      {/* RUTE ADMIN */}
      <Route 
        path="/admin" 
        element={
          <Admin 
            goToDataUser={() => navigate("/datauser")}
            goToProfile={() => navigate("/adminprofile")} 
          />
        } 
      />
      <Route path="/datauser" element={<DataUser goBack={() => navigate("/admin")} />} />
      <Route path="/adminprofile" element={<AdminProfile goBack={() => navigate("/admin")} />} />

      {/* RUTE STAFF / PENGISI DATA */}
      <Route path="/staff" element={<StaffDashboard />} />

      <Route path="/verifikator" element={<VerifikatorDashboard />} />
      <Route path="/staffprofile" element={<StaffProfile />} />

    </Routes>
  );
}

// Komponen Utama App
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;