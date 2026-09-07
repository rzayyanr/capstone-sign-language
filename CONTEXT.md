# CONTEXT.md

Glossary domain proyek. Dokumen ini murni berisi istilah baku, bukan spec, bukan scratch pad, dan bukan tempat keputusan implementasi (itu di `docs/adr/`).

Terakhir diperbarui: 2026-09-07

## Definisi istilah

| Istilah | Definisi |
|---------|----------|
| **Aplikasi belajar bahasa isyarat (CapSL)** | Produk proyek ini: aplikasi web untuk belajar bahasa isyarat dengan pengenalan gestur real-time. |
| **BISINDO** | Bahasa isyarat Indonesia yang tumbuh alami di komunitas Tuli, dipakai dalam pergaulan sehari-hari. Dipilih sebagai bahasa target proyek (bukan SIBI). |
| **SIBI** | Sistem Isyarat Bahasa Indonesia, sistem isyarat buatan/formal yang dibakukan pemerintah untuk pendidikan di SLB. Tidak dipilih; hanya jadi pembanding. |
| **Pembelajar** | Pengguna utama: orang dengar yang ingin belajar berkomunikasi dengan teman Tuli. Kamera menilai gerakan tangan pembelajar. |
| **Komunitas Tuli** | Narasumber validasi kosakata: teman Tuli, Gerkatin, Pusbisindo, SLB, atau dosen yang paham. Akses belum dijamin; dicari oleh anggota tim non-coding. |
| **Gestur statis** | Isyarat yang artinya ditentukan oleh satu pose tangan diam (tanpa gerakan). Contoh: abjad A-Z dan kata-kata berpose tetap. |
| **Gestur dinamis** | Isyarat yang artinya ditentukan oleh urutan gerakan tangan (bukan pose diam). Contoh: "terima kasih", "makan". Masuk fase lanjutan hanya jika waktu sisa (ADR-0001). |
| **Abjad** | 26 huruf A-Z yang isyaratnya gestur statis. Target pengenalan inti MVP. |
| **Kata dasar** | 15-20 kata sehari-hari yang dipilih untuk MVP. Daftar pasti menunggu validasi komunitas (ADR-0002). |
| **21 landmark** | Titik-titik kerangka tangan dari MediaPipe (sendi jari, ujung jari, pergelangan) yang jadi masukan model klasifikasi. |
| **Feedback geometris** | Koreksi belajar berbasis posisi landmark (sudut jari, arah telapak), bukan sekadar benar/salah. Target utama abjad. |
| **Mode belajar** | Sesi pengguna melihat panduan lalu mencoba gestur di depan kamera untuk dinilai sistem. |
| **Mode latihan** | Sesi kuis: sistem mengacak kata/abjad yang sudah dipelajari untuk diulang pembelajar, dengan skor. |
| **Kurikulum bertingkat** | Urutan belajar: Abjad → Kata dasar → (lanjutan) Kalimat sederhana. |
| **Progres pengguna** | Riwayat level dan skor pembelajar. MVP disimpan lokal di browser (localStorage), belum ada login. |
| **Tim** | 2 orang: satu developer (Zayyan, pegang semua kode) dan satu rekan non-coding (riset, validasi komunitas, konten kosakata, QA, laporan & presentasi). |
