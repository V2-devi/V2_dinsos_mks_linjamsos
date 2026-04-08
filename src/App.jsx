import React from "react";
// Import sistem Router dari React Router DOM
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Sesuaikan path import dengan struktur folder Anda
import Login from "./pages/auth/login.jsx";
import Register from "./pages/auth/register.jsx";
// PASTIKAN ANDA MENGIMPORT FILE LUPA PASSWORD DI SINI:
import ForgotPassword from "./pages/auth/lupapass.jsx"; // Sesuaikan jika nama filenya huruf kecil semua

import Admin from "./pages/admin/dashboard.jsx"; 
import DataUser from "./pages/admin/datauser.jsx";
import AdminProfile from "./pages/admin/adminprofile.jsx";
import StaffDashboard from "./pages/staff/staffdashboard.jsx"; 

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Jika user membuka localhost:5173/ saja, otomatis diarahkan ke /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* RUTE AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* RUTE LUPA PASSWORD BARU */}
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