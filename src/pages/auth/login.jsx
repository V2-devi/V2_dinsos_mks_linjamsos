import "./auth.css";
// Pastikan path image Anda benar
import bgImage from "../../assets/image.png"; 
import logoLinjamsos from "../../assets/logo_linjamsos.png";

function Login({ goToRegister }) {
  return (
    <div className="auth-container">
      {/* LEFT SIDE */}
      <div className="auth-left" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="auth-overlay">
          <div className="auth-left-content">
            
            {/* Logo Besar untuk Login */}
            <div className="auth-logo">
              <img src={logoLinjamsos} alt="Logo Linjamsos" className="logo-image-large"/>
            </div>

            <h1>SISTEM INFORMASI<br />PERLINDUNGAN DAN JAMINAN SOSIAL</h1>
            <p>
              Melayani dengan hati, melindungi sepenuh jiwa. Akses Perlindungan
              dan Jaminan Sosial dengan lebih mudah dan transparan.
            </p>
            <span className="copyright">
              @2026 Linjamsos. Dinas Sosial. Hak Cipta Dilindungi.
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-header">
            <h2>Masuk Akun</h2>
            <p>Silahkan masukkan kredential Anda</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>NIK (Nomor Induk Kependudukan)*</label>
              <input type="text" placeholder="Contoh: 1234567890000000" />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label>Kata Sandi*</label>
                <a href="#lupa" className="link-text">Lupa Kata Sandi?</a>
              </div>
              <input type="password" placeholder="**********" />
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Ingatkan Saya</label>
            </div>

            <button type="submit" className="btn-primary btn-block">
              Masuk Sekarang
            </button>
          </form>

          <div className="auth-footer">
            <p>Belum mempunyai akun?</p>
            <button type="button" className="link-btn" onClick={goToRegister}>
              Usulkan akun ke Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;