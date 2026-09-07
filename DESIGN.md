---
version: alpha
name: CapSL
description: Belajar SIBI yang hangat, ceria, dan menggembirakan. Latar krem hangat, teal tua, aksen amber, sudut membulat, tipografi bulat yang ramah.
colors:
  paper: "#FBF6EE"
  surface: "#FFFFFF"
  ink: "#2E2A24"
  primary: "#0E7A6C"
  primary-deep: "#0A5E54"
  primary-soft: "#E3F1EF"
  highlight: "#F2A41B"
  success: "#2F9E63"
  danger: "#D95D5E"
typography:
  display:
    fontFamily: Baloo 2
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.15
  heading:
    fontFamily: Baloo 2
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: Nunito Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Nunito Sans
    fontSize: 0.8125rem
    fontWeight: 800
    letterSpacing: "0.04em"
rounded:
  md: 12px
  lg: 20px
  xl: 28px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: 14px
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  nav-pill:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-deep}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  letter-tile:
    backgroundColor: "{colors.primary-soft}"
    rounded: "{rounded.xl}"
---

# CapSL: Panduan Desain (DESIGN.md)

## Overview

CapSL adalah aplikasi belajar SIBI (Sistem Isyarat Bahasa Indonesia) untuk orang dengar yang ingin bisa berkomunikasi dengan teman Tuli. Pengguna utama adalah pemula yang mungkin merasa canggung atau takut salah. Karena itu wajah aplikasi harus terasa seperti teman yang sabar mengajari, bukan kelas yang menegangkan: hangat, ceria, jelas, dan memberi semangat.

Metafora visualnya adalah kartu flashcard edukatif yang menyenangkan: bidang krem hangat seperti kertas, kartu putih dengan sudut membulat, huruf besar yang bulat dan ramah, serta warna teal sebagai "tangan yang menuntun". Setiap keberhasilan kecil dirayakan dengan warna kuning cerah.

## Colors

- **paper (#FBF6EE):** latar utama. Krem hangat seperti kertas, lebih ramah daripada putih telanjang dan tidak menyilaukan saat dipakai berlama-lama.
- **surface (#FFFFFF):** permukaan kartu dan panel. Putih bersih di atas krem memberi kedalaman tanpa bayangan berat.
- **ink (#2E2A24):** teks utama. Cokelat gelap hangat, lebih lembut daripada hitam pekat.
- **primary (#0E7A6C):** teal tua. Warna aksi utama (tombol, tautan, elemen aktif). Memberi kesan tenang dan kompeten, sekaligus membedakan dari aplikasi belajar lain yang didominasi hijau atau oranye.
- **primary-deep (#0A5E54):** teal lebih gelap untuk keadaan hover/tekan.
- **primary-soft (#E3F1EF):** latar lembut untuk pil navigasi aktif, kartu huruf, dan area sorotan.
- **highlight (#F2A41B):** amber untuk pencapaian, bintang penguasaan, dan elemen "rayakan".
- **success (#2F9E63):** hijau untuk umpan balik "benar".
- **danger (#D95D5E):** merah hangat untuk umpan balik "salah". Dipilih hangat agar tidak terasa menghukum.

## Typography

Dua keluarga huruf yang jelas berbeda perannya:

- **Baloo 2** untuk logo, judul, dan angka besar. Bulat dan ceria, membawa karakter "edukasi yang menyenangkan". Dipakai dengan takaran (judul dan angka saja), bukan untuk paragraf panjang.
- **Nunito Sans** untuk isi, label, dan tombol. Ramah dan sangat terbaca di layar kecil, termasuk untuk teks panjang.

Ukuran dasar isi 1rem dengan tinggi baris 1.6. Label memakai bobot 800 dengan jarak huruf sedikit renggang agar terlihat seperti keterangan kartu yang rapi.

## Layout & Spacing

Mobile-first: satu kolom dengan lebar konten maksimal 560px, rata tengah di layar lebar. Di bagian atas ada bar aplikasi berisi logo dan navigasi (pil). Konten mengalir ke bawah: hero, lalu kartu-kartu.

Jarak memakai tangga 4/8/16/24/32px. Antar bagian diberi jarak 32px agar tiap kartu "bernapas". Tombol aksi utama selalu cukup besar untuk disentuh jempol (minimal tinggi 48px).

## Elevation & Depth

Kedalaman dibuat dengan bayangan lembut dan hangat, bukan garis tepi tegas:

- Kartu biasa: bayangan 0 1px 2px rgba(46,42,36,0.06) dengan tepi 1px rgba(46,42,36,0.06).
- Kartu yang sedang disentuh/di-hover: terangkat perlahan (translateY -2px) dengan bayangan 0 8px 20px rgba(46,42,36,0.10). Pergerakan halus sekitar 150ms.
- Elemen tidak memakai bayangan keras atau efek kaca (glassmorphism).

## Shapes

Semua bentuk memakai sudut membulat yang konsisten: kartu 20px, kartu huruf besar 28px, pil dan tombol 999px. Bentuk bulat ini memperkuat kesan ramah dan "dapat disentuh". Tidak ada sudut lancip pada elemen interaktif.

## Components

- **button-primary:** tombol aksi utama. Latar teal tua, teks putih tebal, bentuk pil, tinggi nyaman untuk jempol. Saat hover berubah menjadi teal lebih gelap.
- **nav-pill:** navigasi halaman. Pil dengan latar teal lembut dan teks teal dalam saat aktif; transparan dengan teks tinta saat tidak aktif.
- **card:** kartu konten (detail huruf, hasil kuis, ringkasan progres). Putih, sudut 20px, bayangan lembut.
- **letter-tile:** kartu huruf besar pada kisi abjad. Latar teal lembut, huruf Baloo 2 besar berwarna teal dalam, sudut 28px.

## Do's and Don'ts

- Lakukan: gunakan krem hangat sebagai latar, bukan putih telanjang.
- Lakukan: pakai Baloo 2 hanya untuk judul dan angka, Nunito Sans untuk teks lain.
- Lakukan: rayakan keberhasilan dengan amber dan teks penyemangat.
- Lakukan: beri umpan balik salah dengan nada menuntun ("hampir!", "coba luruskan jari telunjuk"), bukan sekadar "salah".
- Jangan: gunakan keluarga huruf generik (Inter, Roboto, Arial, atau font sistem) sebagai huruf utama.
- Jangan: pakai gradien ungu, kartu membulat seragam tanpa variasi, atau tata letak "template AI" yang bisa dipasang ke produk apa pun.
- Jangan: memakai bayangan keras atau efek kaca.
- Jangan: menambah animasi yang tidak melayani pelajaran; gerakan dipakai secukupnya untuk arah dan penguatan, bukan hiasan.
