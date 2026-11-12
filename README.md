# Gelar Tikar · Web Tiket Festival

Web pemesanan tiket untuk festival band dan indie lokal **Gelar Tikar 2027** (acara fiktif, dibuat untuk tugas sekolah).
Satu web dipakai tiga peran: **tamu**, **pembeli** (akun terdaftar), dan **panitia** (admin).

- `web-backend/` · REST API: Express + TypeScript, MySQL (mysql2), password bcrypt, login JWT.
- `web-frontend/` · Tampilan: React + Vite + Tailwind CSS.

## Menjalankan

1. (Opsional) Nyalakan MySQL (mis. Laragon), lalu impor `web-backend/database/schema.sql`.
   Bila MySQL tidak menyala, backend otomatis memakai data contoh di memori (data kembali ke awal saat server dimatikan).
2. Backend (terminal 1):
   ```bash
   cd web-backend
   npm run dev
   ```
   API: `http://localhost:5000/api`
3. Frontend (terminal 2):
   ```bash
   cd web-frontend
   npm run dev
   ```
   Web: `http://localhost:5173`

Pengaturan database ada di `web-backend/.env` (lihat `.env.example`).

## Akun demo

| Peran   | Email                 | Password      |
| ------- | --------------------- | ------------- |
| Panitia | `admin@gelartikar.id` | `Admin12345!` |
| Pembeli | `raditya@example.com` | `User12345!`  |

Di halaman Masuk ada tombol "Isi akun pembeli" dan "Isi akun panitia".

## Alur

**Pembeli**

1. Buka beranda: papan acara berisi tanggal, tempat, jadwal per hari, dan harga mulai.
2. Pilih kategori tiket dan jumlah (maksimal 4 per pesanan), lalu klik **Pesan**.
   Bila belum masuk, pembeli diarahkan ke halaman Masuk/Daftar lalu kembali ke formulir pesanan.
3. Isi data pemegang tiket, pilih **QRIS** atau **Virtual Account**, centang persetujuan, lalu **Buat pesanan**.
   Kuota langsung disimpan untuk pesanan itu (stok berkurang) supaya tidak terjual melebihi kuota.
4. Halaman pesanan menampilkan instruksi bayar (simulasi) dan status **Menunggu verifikasi**. Status dicek ulang otomatis tiap 10 detik.
5. Setelah panitia menyetujui, status menjadi **Lunas** dan e-tiket dengan kode QR muncul di halaman pesanan dan di **Tiket saya**.

**Panitia** (menu *Panel panitia*)

- **Pesanan**: periksa pembayaran yang menunggu, lalu **Setujui** (e-tiket aktif) atau **Tolak** (kuota dikembalikan). Pesanan yang sudah diproses tidak bisa diproses dua kali.
- **Ringkasan**: pendapatan terverifikasi, jumlah pesanan per status, dan sisa kuota per acara.
- **Kategori tiket**: ubah harga, kuota, dan status jual; tambah kategori. Kategori yang sudah pernah dipesan tidak bisa dihapus (tutup penjualannya saja).
- **Acara**: buka/tutup penjualan; tambah acara di kota baru (dibuat dalam keadaan ditutup sampai kategori tiketnya siap).
- **Band**: tambah dan hapus penampil.

**Aturan yang dijaga backend**

- Memesan wajib login; pembeli hanya bisa melihat pesanannya sendiri.
- Jumlah tiket 1–4 per pesanan; tidak bisa memesan bila acara ditutup, kategori tidak dijual, atau kuota kurang.
- Biaya layanan Rp10.000 per pesanan.
- Saat memakai MySQL, pembuatan pesanan dan verifikasi berjalan dalam transaksi dengan penguncian baris kategori (`SELECT ... FOR UPDATE`), jadi dua pembeli tidak bisa mengambil sisa kuota yang sama.

## Struktur database

Lihat `web-backend/database/schema.sql`: `users`, `artists`, `events`, `event_artists` (jadwal), `ticket_tiers`, `orders`, `order_items`, `payments`.
Status pesanan: `pending` → `paid` atau `rejected`.
