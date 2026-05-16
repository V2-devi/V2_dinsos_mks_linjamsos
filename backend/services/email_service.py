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