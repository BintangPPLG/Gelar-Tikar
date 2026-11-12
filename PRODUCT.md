# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Penonton**: anak muda Indonesia yang mencari dan membeli tiket festival musik band & indie lokal, sebagian besar lewat HP.
- **Admin penyelenggara**: memverifikasi pembayaran, mengelola event, kategori tiket, kuota, dan lineup.
- **Penilai (guru)**: project ini tugas sekolah untuk ujian semester; alur harus masuk akal dari ujung ke ujung saat didemokan.

## Product Purpose

Web tiket untuk festival musik band & indie lokal (fiktif). Satu web untuk tiga peran: tamu melihat acara, pengguna terdaftar memesan dan menyimpan e-tiket, admin memverifikasi pembayaran dan mengelola data. Berhasil bila alur daftar → pesan → bayar → diverifikasi admin → e-tiket aktif berjalan logis dan bisa didemokan tanpa penjelasan tambahan.

## Positioning

Terasa seperti web tiket acara sungguhan buatan penyelenggara lokal, bukan template atau hasil generator AI.

## Operating Context

- Didemokan di laptop (localhost) di depan guru; juga harus rapi di HP.
- Backend Express + MySQL; bila MySQL tidak jalan, backend memakai data contoh di memori.
- Bahasa antarmuka: Indonesia.

## Capabilities and Constraints

- Frontend: React + Vite + Tailwind (`web-frontend/`). Backend: Express + TypeScript (`web-backend/`), skema MySQL di `web-backend/database/schema.sql` tidak diubah.
- Fitur: daftar/masuk (bcrypt + JWT), katalog event & lineup, kategori tiket dengan kuota, checkout (QRIS / Virtual Account), Tiket Saya dengan QR, panel admin (ringkasan, verifikasi pesanan, kelola tiket, event, artis).
- Status pesanan: pending → paid / rejected.

## Brand Commitments

- Nama: **Gelar Tikar** (dipilih pengguna; menggantikan "Aurora Pulse" yang terdengar buatan AI).
- Hindari kesan AI: tidak memakai neon, glow, emoji di UI, teks bombastis, terlalu banyak huruf tebal.

## Evidence on Hand

- Semua acara, artis, harga, dan angka adalah data contoh fiktif untuk tugas sekolah. Tidak ada sponsor, testimoni, atau angka penjualan nyata; jangan mengarang klaim seperti "28.450+ tiket terverifikasi".
- Tidak ada foto band atau acara. Foto panggung elektronik lama sudah dihapus karena tidak cocok dengan festival band dan indie.

## Product Principles

1. Alur harus logis dan bisa dijelaskan langkah demi langkah.
2. Isi terdengar seperti acara lokal sungguhan: nama band, venue, harga, dan aturan yang wajar.
3. Informasi yang dibutuhkan pembeli (tanggal, tempat, harga, sisa kuota) selalu mudah ditemukan.
