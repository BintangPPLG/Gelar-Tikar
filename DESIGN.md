---
name: Gelar Tikar
description: Web tiket festival band dan indie lokal, diumumkan seperti papan huruf tempel di pintu venue.
colors:
  felt: "#1f3a2e"
  felt-deep: "#172e23"
  felt-groove: "#142a1f"
  felt-line: "#2c4a3c"
  chalk: "#f2efe6"
  chalk-dim: "#b8c6b9"
  paper: "#f5f2ea"
  paper-warm: "#ece7da"
  paper-edge: "#d9d2bf"
  ink: "#1b1b18"
  ink-soft: "#4b4a43"
  ink-faint: "#6f6c61"
  stamp: "#b83a24"
  stamp-deep: "#9a2f1c"
  wood: "#7b5b3b"
typography:
  display:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 9.5vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "0.08em"
  title:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: "36px"
    letterSpacing: "0.08em"
  board-small:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: "24px"
    letterSpacing: "0.08em"
  board-tiny:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: "24px"
    letterSpacing: "0.08em"
  paper-title:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.01em"
  price:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.01em"
    fontFeature: "tnum"
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  stamp:
    fontFamily: "Archivo, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  focus: "2px"
  sm: "3px"
  full: "9999px"
spacing:
  groove: "12px"
  paper-x: "24px"
  page-x-mobile: "16px"
  page-x: "24px"
  section: "96px"
components:
  button-stamp:
    backgroundColor: "{colors.stamp}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0 1.15rem"
    height: "44px"
  button-stamp-hover:
    backgroundColor: "{colors.stamp-deep}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0 1.15rem"
    height: "44px"
  button-ink-hover:
    backgroundColor: "#34332d"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 1.15rem"
    height: "44px"
  button-chalk:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    rounded: "{rounded.sm}"
    padding: "0 0.8rem"
    height: "36px"
  field:
    backgroundColor: "#fffdf8"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.55rem 0.75rem"
    height: "44px"
  paper-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.paper-x}"
  status-stamp:
    textColor: "{colors.stamp}"
    typography: "{typography.stamp}"
    rounded: "{rounded.sm}"
    padding: "0.1rem 0.5rem"
  day-tab-active:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.felt}"
    typography: "{typography.board-tiny}"
    padding: "0 12px"
  day-tab:
    backgroundColor: "transparent"
    textColor: "{colors.chalk-dim}"
    typography: "{typography.board-tiny}"
    padding: "0 12px"
---

# Design System: Gelar Tikar

## Overview

**Creative North Star: "Papan Pengumuman di Pintu Venue"**

Seluruh web adalah satu papan beludru hijau botol dengan alur horizontal halus, tempat panitia menancapkan huruf plastik putih dan memaku kertas pengumuman krem. Apa pun yang *diumumkan* (nama festival, tanggal, venue, lineup, judul bagian) ditulis dengan huruf papan: Archivo kapital, berjarak lebar, berbobot sedang, dengan bayangan jatuh tipis seperti huruf yang benar-benar menempel. Apa pun yang *dibaca atau diisi* (harga, kuota, formulir, rincian pesanan, daftar pesanan admin) berada di atas kertas krem yang dipaku paku payung merah.

Halaman pembeli dan panel panitia memakai dunia yang sama: admin bekerja di papan kerja yang sama, pesanan adalah kertas, statusnya stempel. Kepadatan sedang dan tenang; ruang antarbagian lebar (96px), isi kertas rapat dan bergaris 1px. Hanya ada satu warna seru, merah stempel, dan ia dipakai untuk aksi utama dan status, tidak untuk hiasan.

Yang ditolak secara sadar (dari kontrak arah dan PRODUCT.md): hero gelap dengan neon, gradient warna, glow, deret kartu sama besar, emoji di UI, dan huruf tebal berlebihan.

**Key Characteristics:**
- Papan beludru hijau dengan alur tiap 24px (dua kali `--g`) sebagai latar seluruh situs.
- Huruf papan Archivo kapital berbobot 500, dipasang per huruf saat pertama muncul.
- Kertas krem bersudut tajam, dipaku, kadang miring sedikit (0,5 sampai 1,2 derajat).
- Tiga nilai warna (beludru, kertas, tinta) ditambah satu merah stempel.
- Garis 1px dan garis putus sobekan karcis sebagai pemisah.

## Colors

Tiga keluarga nilai (beludru, kertas, tinta) ditambah satu merah stempel; kayu hanya untuk bingkai.

### Primary
- **Merah Stempel** (stamp): satu-satunya aksen. Tombol aksi utama ("Pilih tiket", "Pesan"), stempel status Lunas/Ditolak, kepala paku payung, cincin fokus di atas kertas, pesan galat, lencana jumlah pesanan menunggu di tab admin, seleksi teks. Nilainya sengaja lebih gelap dari #c8432b di kontrak arah supaya teks putih di tombol lolos kontras.
- **Merah Stempel Tua** (stamp-deep): hanya keadaan hover tombol merah dan cincin tepi paku payung.

### Neutral
- **Beludru Hijau Botol** (felt): latar seluruh halaman dan isi bingkai papan utama.
- **Beludru Dalam** (felt-deep): menu HP yang terbuka, jalur scrollbar.
- **Alur Papan** (felt-groove): garis horizontal 1px tiap 24px pada latar beludru.
- **Garis Beludru** (felt-line): pemisah 1px di atas beludru (baris jadwal, footer, tab admin, jalur status yang belum dicapai).
- **Kapur** (chalk): huruf papan dan teks utama di atas beludru; latar tab hari yang aktif.
- **Kapur Redup** (chalk-dim): teks sekunder di beludru (deskripsi, tautan navigasi tidak aktif, venue).
- **Kertas** (paper): permukaan semua kertas pengumuman dan karcis; juga warna terang kode QR.
- **Kertas Hangat** (paper-warm): kertas kedua (Cara beli, rincian pesanan, formulir admin) dan rel kosong meter kuota.
- **Tepi Kertas** (paper-edge): garis 1px pemisah baris di atas kertas.
- **Tinta** (ink): teks di kertas, tombol tinta, isi meter kuota (80%), warna gelap kode QR.
- **Tinta Lunak** (ink-soft): teks sekunder di kertas, stempel Menunggu.
- **Tinta Pudar** (ink-faint): keterangan paling kecil di kertas.
- **Kayu** (wood): hanya bingkai papan utama (10px, 6px di HP).

### Named Rules
**The Satu Merah Rule.** Merah stempel hanya untuk aksi utama, status, galat, dan paku. Satu tombol merah per kertas; aksi pendamping memakai tombol tinta atau tombol garis.

**The Beludru-atau-Kertas Rule.** Setiap elemen hidup di salah satu dari dua permukaan. Di beludru: kapur dan kapur redup. Di kertas: tinta dan tinta lunak. Jangan menaruh teks tinta langsung di beludru atau teks kapur di kertas.

## Typography

**Display Font:** Archivo (lebar 85 sampai 100, bobot 400 sampai 600; cadangan Arial Narrow, sans-serif), dipakai dengan `font-stretch: 92%`.
**Body Font:** Public Sans (dengan system-ui, sans-serif).

**Character:** Archivo yang sedikit dipadatkan dan dikapitalkan meniru huruf plastik papan pengumuman; Public Sans yang netral membawa semua teks baca di kertas tanpa ikut tampil.

### Hierarchy
- **Display** (500, clamp(2.75rem, 9.5vw, 6rem), 1.04, kapital): hanya nama festival di papan utama, satu kata per baris.
- **Headline** (500, clamp(1.5rem, 3.2vw, 2.25rem), 48px, kapital): judul bagian di atas beludru ("Harga tiket", "Panel panitia").
- **Title** (500, 1.375rem, 36px, kapital): kota, tanggal, venue, nama band di jadwal, judul "Jadwal".
- **Board small / tiny** (500, 1rem / 0.8125rem, 24px, kapital): logotipe di navigasi, tab hari, huruf panggung.
- **Paper title** (Archivo 500, 1.375rem, huruf biasa, 0.01em): nama kategori tiket dan judul di dalam kertas. Di kertas, Archivo tidak dikapitalkan.
- **Price** (Archivo 500, 2.25rem, angka tabular): angka harga utama di karcis.
- **Body** (Public Sans 400, 1rem, 1.55): semua teks baca; paragraf dibatasi 46 sampai 62ch.
- **Label** (Public Sans 500, 0.875rem): label formulir.
- **Stamp** (Archivo 500, 0.75rem, 0.08em, kapital): teks stempel status.

### Named Rules
**The Alur Rule.** Tinggi baris huruf papan adalah kelipatan alur 12px (24, 36, 48px) supaya huruf berdiri di garis papan. Hanya Display yang lepas dari aturan ini.

**The Tanpa Tebal Rule.** Bobot tertinggi di sistem adalah 600, dan hanya untuk teks tombol. Penekanan lain memakai warna (tinta lawan tinta lunak) atau Archivo, bukan bobot.

**The Angka Tabular Rule.** Harga, kuota, kode pesanan, dan nomor Virtual Account selalu memakai angka tabular.

## Layout

Halaman berpusat dengan lebar maksimum 76rem dan sisi 16px (24px dari 640px ke atas). Papan utama di beranda memakai kisi 12 kolom dari 1024px: huruf papan di 7 kolom kiri, jadwal dan karcis di 5 kolom kanan; di bawah 1024px semuanya menumpuk, karcis tetap di urutan kedua. Bagian-bagian dipisah ruang lebar 80 sampai 96px di atas beludru, bukan oleh panel atau garis. Di dalam kertas, baris dipisah garis 1px tepi kertas dengan padding vertikal 24px; padding sisi kertas 20 sampai 32px. Daftar (kategori tiket, kota lain, pesanan admin) adalah baris bergaris dalam satu kertas, bukan kartu terpisah. Navigasi tingginya 64px; di bawah 768px berubah menjadi tombol menu.

## Elevation & Depth

Kedalaman bersifat fisik, bukan antarmuka: kertas menempel di papan dan menjatuhkan bayangan pendek; papan masuk ke dalam bingkai kayu; huruf plastik menjatuhkan bayangan tipis. Tidak ada glow dan tidak ada elevasi berlapis-lapis; semua kertas berada di satu ketinggian.

### Shadow Vocabulary
- **Kertas menempel** (`box-shadow: 0 1px 1px rgba(0,0,0,0.18), 0 10px 22px -10px rgba(0,0,0,0.55)`): semua kertas dan karcis.
- **Bingkai cekung** (`box-shadow: inset 0 0 0 1px rgba(0,0,0,0.35), inset 0 10px 24px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.06)`): bingkai kayu papan utama.
- **Huruf tempel** (`text-shadow: 0 1px 0 rgba(0,0,0,0.35), 0 2px 3px rgba(0,0,0,0.25)`): setiap huruf papan; dihapus pada tab hari yang aktif.
- **Takik karcis** (`box-shadow: inset ±2px 0 3px rgba(0,0,0,0.25)`): dua lubang setengah lingkaran di ujung garis sobekan.

### Named Rules
**The Satu Ketinggian Rule.** Kertas tidak naik saat hover dan tidak bertumpuk. Bayangan hanya menyatakan "ditempel", bukan prioritas.

## Shapes

Kertas, papan, dan bingkai bersudut tajam (0). Tombol, field, dan stempel bersudut sangat kecil (3px), cincin fokus 2px. Bentuk bulat hanya untuk benda bulat sungguhan: kepala paku, takik karcis, titik jalur status. Kertas boleh dimiringkan sedikit (0,5 sampai 1,2 derajat, ke kiri atau kanan) seolah dipaku tangan; stempel Lunas miring -2 derajat. Garis selalu 1px kecuali stempel (1,5 sampai 2px) dan bingkai kayu.

## Components

### Buttons
Padat dan jujur seperti tombol formulir loket.
- **Shape:** sudut 3px, tinggi minimum 44px (36px untuk varian kecil), teks Public Sans 600 0.9375rem.
- **Merah stempel:** aksi utama satu-satunya di kertas (beli, pesan, bayar). Hover ke merah stempel tua.
- **Tinta:** aksi utama kedua atau aksi admin positif ("Setujui"). Hover ke #34332d.
- **Garis:** aksi pendamping di kertas ("Tolak", kurang/tambah jumlah); garis 1px #b9b19c, hover garis tinta.
- **Kapur:** satu-satunya tombol di atas beludru ("Masuk", filter admin); garis kapur 45%, hover garis penuh.
- **Hover / Focus:** transisi 160ms dengan `cubic-bezier(0.16, 1, 0.3, 1)`; ditekan turun 1px; nonaktif opasitas 50%. Fokus: garis 2px merah stempel berjarak 3px (kapur di beludru).

### Chips
- **Tab hari (di beludru):** huruf papan kecil dalam kotak bergaris 1px tanpa sudut. Aktif = latar kapur, teks beludru, tanpa bayangan huruf. Mengganti hari memasang ulang huruf jadwal.
- **Filter status admin:** tombol kapur kecil dengan angka; yang aktif berlatar kertas.

### Cards / Containers
- **Corner Style:** tajam (0).
- **Background:** kertas; kertas hangat untuk kertas pendamping (langkah, rincian, formulir).
- **Shadow Strategy:** kertas menempel (lihat Elevation & Depth).
- **Border:** tidak ada; pemisah internal 1px tepi kertas.
- **Internal Padding:** 24px sisi, 28 sampai 32px atas bila dipaku.
- **Paku:** kepala merah 14px di tepi atas, posisi horizontal bebas per kertas (8% sampai 92%); kertas lebar boleh dua paku.

### Inputs / Fields
- **Style:** latar #fffdf8, garis 1px #c9c1ab, sudut 3px, tinggi 44px. Label Public Sans 500 0.875rem di atas.
- **Focus:** garis berubah tinta plus cincin lembut merah 18% selebar 3px.
- **Error:** garis merah stempel, pesan merah 0.875rem di bawah field; petunjuk netral memakai tinta lunak 0.8125rem.

### Navigation
Teks kecil di atas beludru, seperti tulisan di bingkai atas papan. Logotipe "Gelar Tikar" dalam huruf papan kecil di kiri; tautan Public Sans 0.9375rem kapur redup, yang aktif kapur dengan garis bawah. Di bawah 768px menjadi tombol menu ikon yang membuka daftar di beludru dalam.

### Stempel Status
Status pesanan memakai tinta dan satu merah saja. Menunggu: garis putus tinta lunak. Lunas: merah, garis 2px, miring -2 derajat. Ditolak: merah dengan teks dicoret. Dibatalkan memakai rupa Menunggu.

### Meter Kuota
Rel 6px kertas hangat dengan isi tinta 80% untuk yang terjual. Semua kategori digambar pada skala yang sama (kuota terbesar = lebar penuh), sehingga panjang rel menunjukkan besar kuota. Di bawahnya "Sisa X dari Y" dengan angka tabular.

### Garis Sobekan Karcis
Baris titik-titik (#b5ab92, jarak 9px) dengan dua takik setengah lingkaran berwarna beludru di kedua tepi kertas. Memisahkan harga dari aksi di karcis.

### Jalur Status Pesanan
Di atas beludru: garis 1px dengan tiga titik 9px (Pesanan dibuat, Pembayaran diperiksa panitia, E-tiket aktif atau Ditolak). Selesai = titik kapur, sedang berlangsung = titik kapur redup bercincin, ditolak = titik merah.

### Huruf Papan Bergerak
Saat pertama dimuat, setiap huruf papan muncul satu per satu (520ms, jeda 14ms per huruf, turun 0,18em dari kabur ke tajam). Sekali saja per teks; mati sepenuhnya bila `prefers-reduced-motion`. Judul bagian tidak dianimasikan.

## Do's and Don'ts

### Do:
- **Do** tulis semua yang diumumkan di beludru (nama acara, tanggal, venue, lineup, judul bagian) dengan huruf papan kapital, tinggi baris kelipatan 12px.
- **Do** letakkan semua yang dibaca atau diisi di atas kertas krem bersudut tajam dengan bayangan kertas menempel.
- **Do** batasi merah stempel (#b83a24) pada aksi utama, status, galat, dan paku; satu tombol merah per kertas.
- **Do** tampilkan daftar sebagai baris bergaris 1px di dalam satu kertas.
- **Do** gambar kuota semua kategori pada skala yang sama.
- **Do** pakai angka tabular untuk harga, kuota, kode, dan nomor pembayaran.
- **Do** hormati `prefers-reduced-motion` untuk animasi pasang huruf dan gulir halus.

### Don't:
- **Don't** pakai gradient warna, glow, atau neon. Pola tekstur papan (alur, serat beludru, titik sobekan) bukan gradient warna dan tetap boleh.
- **Don't** pakai bobot di atas 600, dan 600 hanya untuk teks tombol.
- **Don't** tambah warna aksen kedua; status memakai tinta dan merah stempel saja.
- **Don't** pakai emoji di UI.
- **Don't** pecah daftar menjadi deret kartu sama besar.
- **Don't** pakai sudut membulat besar pada kertas, tombol, atau field; 3px maksimum, bulat penuh hanya untuk benda bulat (paku, takik, titik status).
- **Don't** tampilkan penanda "berikutnya tampil" atau status langsung acara selama acara belum berlangsung; itu status palsu.
- **Don't** miringkan kertas lebih dari 1,2 derajat atau miringkan kertas yang berisi formulir panjang atau tabel admin.
