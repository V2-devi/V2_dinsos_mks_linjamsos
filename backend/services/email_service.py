# import smtplib

# from email.mime.text import MIMEText

# from email.mime.multipart import MIMEMultipart

# import os

# from dotenv import load_dotenv

# load_dotenv()

# EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")

# EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


# def send_approval_email(to_email, nama):

#     subject = "Akun Anda Telah Disetujui"

#     body = f"""
# Halo {nama},

# Akun Anda telah disetujui oleh admin.

# Silakan login menggunakan email dan kata sandi
# yang telah Anda buat saat registrasi.

# Terima kasih.

# Sistem Informasi Perlindungan dan Jaminan Sosial
# """

#     msg = MIMEMultipart()

#     msg["From"] = EMAIL_ADDRESS

#     msg["To"] = to_email

#     msg["Subject"] = subject

#     msg.attach(MIMEText(body, "plain"))

#     try:

#         server = smtplib.SMTP(
#             "smtp.gmail.com",
#             587
#         )

#         server.starttls()

#         server.login(
#             EMAIL_ADDRESS,
#             EMAIL_PASSWORD
#         )

#         server.send_message(msg)

#         server.quit()

#         print("EMAIL BERHASIL DIKIRIM")

#     except Exception as e:

#         print("EMAIL ERROR:", str(e))




import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import os

from dotenv import load_dotenv

# =====================================
# LOAD ENV
# =====================================
load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

print("EMAIL ADDRESS:", EMAIL_ADDRESS)


# =====================================
# FUNCTION KIRIM EMAIL
# =====================================
def send_approval_email(to_email, nama_lengkap):

    try:

        subject = "Akun Anda Telah Disetujui"

        body = f"""
Halo {nama_lengkap},

Pengajuan akun Anda telah disetujui oleh admin.

Silakan login menggunakan email dan kata sandi
yang telah Anda buat saat registrasi.

Terima kasih.

Link Login:
http://localhost:5173/login

Sistem Informasi Perlindungan dan Jaminan Sosial
"""

        # =====================================
        # BUAT MESSAGE
        # =====================================
        msg = MIMEMultipart()

        msg["From"] = EMAIL_ADDRESS
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(
            MIMEText(body, "plain")
        )

        # =====================================
        # SMTP GMAIL
        # =====================================
        server = smtplib.SMTP(
            "smtp.gmail.com",
            587
        )

        server.starttls()

        # LOGIN EMAIL
        server.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        # KIRIM EMAIL
        server.sendmail(
            EMAIL_ADDRESS,
            to_email,
            msg.as_string()
        )

        # TUTUP SERVER
        server.quit()

        print("EMAIL BERHASIL DIKIRIM")

    except Exception as e:

        print("EMAIL ERROR:", str(e))


# =====================================
# TEST MANUAL
# =====================================
# if __name__ == "__main__":

#     send_approval_email(

#         "email@gmail.com",

#         "Devi"
#     )


def send_staff_account_email(

    to_email,

    nama,

    password,

    role
):

    try:

        subject = "Akun Sistem Linjamsos"

        body = f"""
        <html>
        <body>

        <h3>Halo {nama},</h3>

        <p>
        Akun Anda telah dibuat oleh Admin Sistem Linjamsos.
        </p>

        <p><b>Email:</b> {to_email}</p>

        <p><b>Password Sementara:</b> {password}</p>

        <p><b>Role:</b> {role}</p>

        <p>
        Silakan login melalui link berikut:
        </p>

        <a href="http://localhost:5173/login">
            Login Sekarang
        </a>

        <p>
        Setelah berhasil login,
        segera ubah password Anda.
        </p>

        </body>
        </html>
        """

        msg = MIMEMultipart()

        msg["From"] = EMAIL_ADDRESS

        msg["To"] = to_email

        msg["Subject"] = subject

        msg.attach(
            MIMEText(body, "html")
        )

        server = smtplib.SMTP(
            "smtp.gmail.com",
            587
        )

        server.starttls()

        server.login(
            EMAIL_ADDRESS,
            EMAIL_PASSWORD
        )

        server.sendmail(
            EMAIL_ADDRESS,
            to_email,
            msg.as_string()
        )

        server.quit()

        print("EMAIL STAFF BERHASIL DIKIRIM")

    except Exception as e:

        print("EMAIL STAFF ERROR:", str(e))




import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_reset_email(to_email: str, reset_link: str):
    """Kirim email reset password via Gmail SMTP dengan Error Handling Lengkap"""
    
    SENDER_EMAIL = os.getenv("EMAIL_ADDRESS")      # Ganti dengan email Anda
    SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD")    # Ganti dengan App Password Gmail Anda
    
    subject = "Reset Password SICADAS - Dinas Sosial"
    
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #234a66;">Reset Password SICADAS</h2>
        <p>Halo,</p>
        <p>Anda menerima email ini karena ada permintaan reset password untuk akun SICADAS Anda.</p>
        <p>Klik tombol di bawah untuk reset password:</p>
        <p style="margin: 20px 0;">
            <a href="{reset_link}" 
               style="background-color: #234a66; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
            </a>
        </p>
        <p style="color: #64748b; font-size: 12px;">{reset_link}</p>
        <hr>
        <p style="color: #999; font-size: 11px;">© 2026 SICADAS - Dinas Sosial</p>
    </body>
    </html>
    """
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))
    
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
            
        return {"success": True, "reason": "success", "message": "Email berhasil dikirim"}

    except smtplib.SMTPAuthenticationError:
        return {"success": False, "reason": "auth_error", "message": "Gagal login SMTP. Cek App Password Gmail Anda."}
        
    except smtplib.SMTPRecipientsRefused:
        return {"success": False, "reason": "invalid_email", "message": "Alamat email tujuan tidak valid atau ditolak."}
        
    except smtplib.SMTPException as e:
        error_msg = str(e).lower()
        # Cek kata kunci khusus Gmail Rate Limit (Kode 421 atau 550)
        if "limit" in error_msg or "421" in error_msg or "550" in error_msg or "throttl" in error_msg:
            return {
                "success": False, 
                "reason": "rate_limit", 
                "message": "⚠️ BATAS PENGIRIMAN HARIAN GMAIL TERCAPAI (Rate Limit). Email tidak terkirim."
            }
        else:
            return {"success": False, "reason": "smtp_error", "message": f"Error SMTP: {str(e)}"}
            
    except Exception as e:
        return {"success": False, "reason": "unknown", "message": f"Error tidak terduga: {str(e)}"}
