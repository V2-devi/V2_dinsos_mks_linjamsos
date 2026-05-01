// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../config/supabase";

// export default function Verify() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleVerify = async () => {
//       // Ambil session dari URL (Supabase otomatis baca hash)
//       const { data, error } = await supabase.auth.getSession();

//       if (error) {
//         alert("Verifikasi gagal");
//         return;
//       }

//       if (data.session) {
//         alert("Email berhasil diverifikasi ✅");

//         // redirect ke login
//         navigate("/login");
//       }
//     };

//     handleVerify();
//   }, []);

//   return <h2>Memverifikasi email...</h2>;
// }