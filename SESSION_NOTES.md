# Catatan sesi

## 2026-11-12 · Redesign total → "Gelar Tikar" (branch `redesign/total`)

**Tujuan**: redesign total web tiket (tugas sekolah untuk ujian semester) supaya tidak terlihat buatan AI, dan alurnya logis.

**Selesai**
- Commit `f98dac2`: snapshot versi lama "Aurora Pulse" (sebelumnya `web-backend/` dan `web-frontend/` belum pernah di-commit).
- Nama baru **Gelar Tikar**, festival band dan indie lokal fiktif (Jakarta 3 hari, Bandung, Yogyakarta, Surabaya). Arah desain "Papan Huruf": beludru hijau #1f3a2e, huruf papan Archivo 500, kertas krem dipaku, satu merah stempel #b83a24. Detail di `DESIGN.md`, `PRODUCT.md`, `.impeccable/surfaces/`.
- Frontend ditulis ulang total dengan hash router (`src/lib/router.ts`). Halaman: `EventPage`, `CheckoutPage`, `OrderPage`, `MyTicketsPage`, `AuthPage`, `AdminPage`. Komponen lama dan foto EDM dihapus; `motion` dan `canvas-confetti` di-uninstall.
- Backend: `store.ts` ditulis ulang; data contoh ada di `seed.ts`. Bila MySQL tersambung, semua data ke MySQL (pesanan & verifikasi memakai transaksi + `FOR UPDATE`); bila tidak, data di memori.
  - Pesan wajib login; 1–4 tiket per pesanan; biaya layanan Rp10.000.
  - Pesanan ditolak → kuota dikembalikan. Pesanan hanya bisa diproses sekali. Kategori yang sudah dipesan tidak bisa dihapus.
- `schema.sql`: struktur tabel tidak berubah. Yang berubah: data awal diganti Gelar Tikar, dan ditambah `SET NAMES utf8mb4` supaya karakter tidak rusak saat impor dari terminal Windows.
- Akun demo: `admin@gelartikar.id` / `Admin12345!`, `raditya@example.com` / `User12345!`.
- Sudah diuji: alur UI lengkap (mode memori), alur API lengkap di MySQL 8.4 sementara, `tsc` dan `vite build` lulus, detector impeccable bersih, finish review (6+2 perbaikan diterapkan).

**Keputusan penting**
- Penanda "berikutnya tampil" di jadwal tidak dibuat, karena acaranya belum berlangsung dan penanda itu akan menjadi status palsu.
- E-tiket menampilkan hari berlaku dari fasilitas kategori yang diawali "Berlaku …".

**Belum / berikutnya**
- Belum di-merge ke `master` dan belum di-push.
- Lineup belum bisa diedit dari panel admin (API-nya belum ada); band baru tidak otomatis masuk jadwal.
- Pembayaran masih simulasi (tidak ada unggah bukti transfer).
- `web-backend/.env` lokal masih memakai JWT_SECRET lama (tidak di-commit).
