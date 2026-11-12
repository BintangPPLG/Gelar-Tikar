# 🎟️ AURORA PULSE: SISTEM MANAJEMEN & TIKET KONSER FULL-STACK

Sistem aplikasi tiket konser dan festival musik modern dengan arsitektur **Clean Modular**:
- 📁 **`web-backend/`** : REST API Server (Express.js, TypeScript, MySQL2 / Dual Storage Engine, Bcrypt Password Hashing, JWT Auth, Seeder).
- 📁 **`web-frontend/`** : Unified Web Application (React + Vite + Tailwind CSS + Phosphor Icons + Canvas Confetti + QR Code) yang menyatukan seluruh peran (**Pengunjung / Guest**, **Pengguna Terdaftar**, dan **Administrator**) ke dalam **1 Web Terpadu**.

---

## 🚀 Panduan Menjalankan Manual di Terminal

### 1️⃣ Menjalankan Backend API (Terminal 1)
```bash
cd web-backend
npm run dev
```
> Server API berjalan di: **`http://localhost:5000`** (Endpoint API: **`http://localhost:5000/api`**)

### 2️⃣ Menjalankan Frontend Web (Terminal 2)
```bash
cd web-frontend
npm run dev
```
> Website antarmuka berjalan di: **`http://localhost:5173`**

---

## 🔑 Kredensial Akun Bawaan (Default Database)

| Role / Peran | Alamat Email | Password Asli | Akses Fitur |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@aurorapulse.com` | `AdminAurora2026!` | Panel Kontrol Admin (Event, Tiket, Verifikasi Order, Artis, Revenue) |
| **Pengguna Demo** | `customer@gmail.com` | `User12345!` | Pemesanan Tiket, Checkout QRIS/VA, Akses Tiket Saya & QR E-Ticket |

---

## ✨ Fitur & Alur Penggunaan Satu Web (All-in-One Role)

### 👤 1. Alur Pengunjung & Pendaftaran User Baru
1. Buka website di browser (`http://localhost:5173`).
2. Klik tombol **"Masuk / Daftar"** di pojok kanan atas navbar.
3. Pilih tab **"Daftar Akun Baru"**:
   - Masukkan **Nama Lengkap**, **Email**, **No WhatsApp**, dan **Password**.
   - Klik **"Daftar & Masuk Otomatis"**.
   - Data otomatis tersimpan ke **Database** dengan enkripsi Bcrypt dan user langsung ter-autentikasi.
4. Pilih tiket konser di bagian **"Kategori Tiket"** -> Klik **"Pesan Tiket"**.
5. Form checkout otomatis terisi data diri user -> Pilih metode pembayaran (QRIS / Virtual Account) -> Klik **"Bayar Sekarang"**.
6. E-Ticket QR Code resmi diterbitkan dan otomatis tersimpan di menu **"Tiket Saya"**.

### 🛡️ 2. Alur Administrator (Tanpa Pindah Website)
1. Buka modal yang sama melalui tombol **"Masuk / Daftar"** -> Masukkan email `admin@aurorapulse.com` dan password `AdminAurora2026!`.
2. Sistem otomatis mengenali role **`admin`**.
3. Di Navbar akan langsung muncul badge **"🛡️ Administrator"** dan tombol **"🎛️ Panel Admin"**.
4. Klik tombol **"🎛️ Panel Admin"** untuk membuka pusat kendali:
   - **📊 Ringkasan & Metrik**: Total pendapatan, total tiket terjual, dan status transaksi.
   - **💳 Pesanan & Verifikasi**: Cek pesanan pembeli baru dan lakukan verifikasi pembayaran (Approve / Reject) dengan 1 klik.
   - **🎟️ Kelola Tiket**: Tambah kategori tiket baru, ubah harga, dan tambah kuota.
   - **🎪 Kelola Event**: Buka atau tutup penjualan tiket event secara langsung.
   - **🎤 Lineup Artis**: Tambah bintang tamu pengisi acara.
5. Admin dapat kembali menikmati tampilan festival kapan saja dengan 1 klik tanpa harus logout.

---

## 🗄️ Skema Basis Data MySQL
Skema database lengkap dan query relasi tabel tersedia di [`web-backend/database/schema.sql`](web-backend/database/schema.sql).
