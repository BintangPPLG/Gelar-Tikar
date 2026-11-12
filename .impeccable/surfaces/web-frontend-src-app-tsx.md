---
version: 1
slug: "web-frontend-src-app-tsx"
primary_target: "web-frontend/src/App.tsx"
related_targets: ["web-frontend"]
---

Scope: seluruh web-frontend (landing tamu, beranda pengguna, auth, checkout, Tiket Saya, panel admin). Mode: Persuade untuk landing; Operate untuk checkout, Tiket Saya, dan admin di dalam dunia yang sama.
Audience: anak muda pencari tiket festival band & indie lokal; admin penyelenggara; guru penilai tugas sekolah.
Action: pilih kategori tiket lalu pesan; admin memverifikasi pembayaran.
Constraints: data fiktif, tanpa klaim angka penjualan; bahasa Indonesia; skema database tetap.
Name: Gelar Tikar.

## Direction contract

THESIS: Festival diumumkan seperti papan huruf tempel di pintu venue, bukan hero gelap dengan neon dan kartu bento. Menolak: hero gelap + gradient + deret kartu sama besar.

OWN-WORLD: Papan beludru hijau botol (#1f3a2e) bergaris alur halus, huruf plastik putih seragam berbobot regular (bukan bold), bingkai kayu tipis. Kertas pengumuman krem (#f2efe6) dipasang paku payung untuk semua bagian yang dibaca/diisi. Tinta hampir hitam (#1b1b18). Satu merah stempel (#c8432b) hanya untuk aksi utama dan status. Garis 1px. Tanpa glow, gradient, emoji.

STORY: Pengunjung melihat nama festival, tanggal, tempat, dan lineup di papan; paham harga dan sisa kuota per kategori; memesan; melihat status pembayaran sampai e-tiket aktif. Admin bekerja di papan kerja yang sama: daftar pesanan sebagai kertas yang distempel.

FIRST VIEWPORT: Papan beludru memenuhi layar (dalam bingkai kayu tipis). Baris huruf: "GELAR TIKAR 2026", tanggal, venue, lalu lineup per hari dalam huruf tempel. Di kanan bawah papan, karcis kertas dipaku: harga mulai, sisa kuota, tombol merah "Beli tiket". Navigasi sebagai tautan teks kecil di bingkai atas.

FORM: Papan huruf tempel (letterboard), kandidat #6 dari daftar grounded; seed key 576b97d0. Raises: tiga nilai warna + satu merah (centre-rail); kode area polos (terminal); jalur status pesanan (accretion); kuota pada skala sama (osiloskop). Janji "berikutnya tampil" (algorave) dicoret: acara belum berlangsung, jadi penanda itu akan menjadi status palsu.
Signature interaction: huruf papan dipasang satu per satu saat pertama dimuat (sekali, hormati prefers-reduced-motion); pilih hari di jadwal = huruf berganti.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
