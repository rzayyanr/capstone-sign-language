# Spec: Aplikasi Belajar SIBI dengan Pengenalan Gestur Real-time

> PRD untuk capstone Proyek Sistem Aplikasi. Repo: rzayyanr/capstone-sign-language.
> Status: Draft untuk direview sebelum dipublish ke GitHub Issues.

## Problem Statement

Banyak orang dengar (pendengar) di Indonesia ingin bisa berkomunikasi dengan teman atau kolega Tuli, tetapi tidak tahu cara belajar bahasa isyarat yang benar, mudah, dan terstruktur. Kelas bahasa isyarat formal jarang dan mahal; sumber online tidak terstruktur dan tidak memberi umpan balik. Akibatnya, calon pembelajar berhenti sebelum bisa, dan jurang komunikasi antara komunitas dengar dan Tuli tetap lebar. Tersedia sistem isyarat resmi (SIBI) yang terdokumentasi baik, tetapi tidak ada alat belajar interaktif yang mengoreksi gerakan pengguna secara langsung.

## Solution

Aplikasi web (PWA) untuk belajar **SIBI** dengan pengenalan gestur real-time melalui kamera. Pengguna melihat panduan gestur (gambar + teks), mencoba di depan kamera, dan aplikasi menilai benar/salah plus memberi koreksi. Aplikasi punya alur belajar terstruktur, kuis latihan, dan pelacakan progres lokal. Target pengguna: orang dengar yang ingin belajar SIBI untuk berkomunikasi dengan teman Tuli. Bahasa antarmuka: Bahasa Indonesia. (BISINDO direncanakan sebagai pengembangan lanjutan, bukan bagian MVP.)

## User Stories

1. Sebagai pembelajar, saya ingin melihat daftar semua huruf SIBI dalam grid, sehingga saya tahu apa saja yang bisa dipelajari.
2. Sebagai pembelajar, saya ingin membuka halaman satu huruf yang berisi panduan (gambar + teks langkah), sehingga saya tahu cara membentuknya.
3. Sebagai pembelajar, saya ingin mengikuti alur belajar berurutan (A-Z), sehingga saya punya struktur dan tidak bingung mulai dari mana.
4. Sebagai pembelajar, saya ingin bisa melompat ke huruf mana pun dari grid, sehingga saya bisa mengulang yang sulit atau belajar yang saya mau.
5. Sebagai pembelajar, saya ingin mencoba membentuk huruf di depan kamera dan langsung dinilai benar/salah, sehingga saya tahu apakah gestur saya tepat.
6. Sebagai pembelajar, ketika gestur saya salah, saya ingin sistem memberi tahu huruf apa yang terdeteksi, sehingga saya paham kesalahan saya.
7. Sebagai pembelajar, ketika gestur saya salah, saya ingin melihat saran perbaikan geometris (misal "luruskan jari telunjuk", "rapatkan jari"), sehingga saya bisa memperbaiki pose dengan spesifik.
8. Sebagai pembelajar, ketika gestur saya salah, saya ingin panduan (gambar) muncul lagi di samping kamera, sehingga saya bisa membandingkan dan mencoba lagi.
9. Sebagai pembelajar, saya ingin gestur dianggap berhasil hanya setelah stabil beberapa saat (bukan sekali tebak), sehingga penilaian tidak mengecewakan karena tangan goyang.
10. Sebagai pembelajar, setelah berhasil, saya ingin lanjut otomatis ke huruf/kata berikutnya dalam alur, sehingga belajar mengalir.
11. Sebagai pembelajar, saya ingin melihat progres penguasaan saya (huruf mana yang sudah dikuasai, yang masih lemah), sehingga saya tahu fokus belajar.
12. Sebagai pembelajar, sebuah huruf dianggap "dikuasai" setelah saya benar beberapa kali berturut-turut, sehingga penguasaan benar-benar teruji, bukan keberuntungan.
13. Sebagai pembelajar, saya ingin berlatih lewat kuis (sistem memberi perintah "tunjukkan huruf X", saya membentuknya, dinilai), sehingga saya menguji ingatan saya.
14. Sebagai pembelajar, di akhir kuis saya ingin melihat skor dan daftar huruf yang salah, sehingga saya tahu apa yang perlu diulang.
15. Sebagai pembelajar, saya ingin mode latihan bebas (pilih huruf, langsung dinilai, tanpa skor), sehingga saya bisa berlatih santai.
16. Sebagai pembelajar, saya ingin melihat dan belajar kata-kata SIBI (15-20 kata dasar), sehingga saya bisa berkomunikasi lebih dari sekadar mengeja.
17. Sebagai pembelajar, saya ingin aplikasi bisa dipakai tanpa kamera (melihat materi/panduan), sehingga saya bisa belajar pasif saat tidak ada kamera.
18. Sebagai pembelajar, saya ingin kamera hanya aktif saat sesi latihan dengan indikator jelas, sehingga privasi saya terjaga.
19. Sebagai pembelajar, saya ingin progres saya tersimpan di browser (localStorage) dan tetap ada saat aplikasi ditutup, sehingga saya tidak kehilangan kemajuan.
20. Sebagai pembelajar, saya ingin aplikasi bisa dibuka di HP dan laptop lewat browser, sehingga saya bisa belajar di mana saja.
21. Sebagai pembelajar, saya ingin antarmuka dalam Bahasa Indonesia, sehingga mudah dipahami.
22. Sebagai pembelajar, saya ingin aplikasi memberi tahu kalau kamera tidak tersedia/izin ditolak, dengan opsi lanjut tanpa kamera, sehingga aplikasi tetap berguna.
23. Sebagai dosen/penguji, saya ingin demo bisa berjalan tanpa kamera (mode uji dari file gambar / video cadangan), sehingga penilaian tidak terganggu masalah teknis kamera.
24. Sebagai developer, saya ingin arsitektur memisahkan pipeline pengenalan dari logika produk dan konten, sehingga sistem isyarat lain (BISINDO) bisa ditambahkan tanpa rombak.
25. Sebagai developer, saya ingin model pengenalan dijalankan sepenuhnya di browser (tanpa server), sehingga privasi terjaga dan deployment sederhana.

## Implementation Decisions

- **Platform**: Web mobile-first PWA; satu kode jalan di laptop & HP via browser; bisa "Add to Home Screen". (ADR-0004)
- **Pipeline pengenalan**: Sepenuhnya client-side. MediaPipe untuk deteksi & landmark satu tangan (21 titik); model klasifikasi ringan MLP; dijalankan via TensorFlow.js. Tanpa server ML. (ADR-0004)
- **Stack**: React + Vite. (ADR-0004)
- **Bahasa target & sumber konten**: SIBI; konten & gambar panduan bersumber dari Kamus SIBI resmi Kemendikbud. (ADR-0002)
- **Scope MVP**: 24 abjad statis SIBI (A-I, K-Y) + 15-20 kata dasar statis. Huruf J & Z (dinamis) tidak masuk MVP. (ADR-0001)
- **Katalog gestur data-driven**: Setiap gestur adalah data {id, label, sistem [SIBI], jumlah_tangan: 1, gambar_panduan, teks_langkah, aturan_geometris?}. Memungkinkan BISINDO (2 tangan) ditambahkan sebagai sistem baru. (ADR-0005)
- **Arsitektur modular (seam)**: 
  - Modul pengenalan (deteksi + klasifikasi) terisolasi, input frame/gambar, output prediksi kelas + skor keyakinan + landmark.
  - Modul logika produk: alur belajar, kuis, mastery, progres; tidak bergantung langsung pada kamera (bisa diuji dengan landmark sintetis/file).
  - Modul konten/katalog gestur data-driven.
- **Feedback geometris**: Aturan berbasis landmark per huruf (misal "jari telunjuk lurus", "jari rapat") untuk abjad; dipakai untuk saran perbaikan.
- **Penilaian stabil**: Prediksi dianggap benar jika kelas yang sama muncul N frame berturut-turut dengan skor keyakinan di atas ambang.
- **Mastery**: Huruf dianggap dikuasai setelah benar 3x berturut-turut.
- **Progres**: localStorage di browser, tanpa login di MVP.
- **Mode uji dari file / cadangan demo**: Pengguna/penguji bisa memuat gambar untuk dinilai (tanpa kamera); video demo cadangan disiapkan.
- **Deployment**: Vercel atau Netlify (HTTPS wajib untuk akses kamera). (ADR-0004)
- **Dataset**: Prototyping dengan dataset publik ASL (satu tangan, mirip SIBI); dataset final direkam sendiri (video → frame, ±100 frame/gestur, variasi sudut/cahaya), disimpan mentah di Google Drive, CSV landmark di repo. (ADR-0003)
- **Pelatihan model**: Python (Keras/TensorFlow) offline; Google Colab cadangan.
- **Arsitektur multi-sistem**: BISINDO (2 tangan) sebagai stretch goal ber-gerbang, bukan bagian spec ini (lihat ADR-0005).

## Testing Decisions

Prinsip: uji perilaku eksternal, bukan detail implementasi. Yang baik: memastikan logika produk benar tanpa bergantung pada kamera/model nyata.

- **Modul logika produk** (alur belajar, kuis, mastery, progres): diuji dengan landmark sintetis atau input file yang sudah diketahui. Misal: memberi landmark yang "benar" untuk huruf A → sistem menandai benar; memberi yang salah → menandai salah; setelah 3x benar → mastery tercapai.
- **Aturan feedback geometris**: diuji per huruf dengan landmark sintetis yang sengaja "salah" pada satu aspek (misal jari bengkok) → sistem memberi saran yang tepat.
- **Penilaian stabil (N-frame)**: diuji dengan urutan prediksi sintetis (stabil vs berubah-ubah) → sistem hanya mengunci saat stabil.
- **Model MLP**: dievaluasi offline dengan confusion matrix & akurasi per huruf; target ≥85% rata-rata pada data uji. Ini uji di sisi pipeline, terpisah dari UI.
- **Integrasi browser (MediaPipe + TF.js)**: diuji manual dengan kamera + mode file; karena MediaPipe butuh browser, pengujian otomatisnya terbatas; prioritas pada uji manual terstruktur (teman non-coding sebagai QA).
- Tidak ada prior art karena repo greenfield; seam pengujian utama adalah modul logika produk yang murni (tanpa DOM/kamera), sehingga mudah diuji.

## Out of Scope

- Huruf SIBI J & Z (dinamis) dan semua gestur dinamis (fase lanjutan opsional).
- BISINDO (stretch goal ber-gerbang; butuh validasi komunitas & waktu; bukan janji MVP).
- Login, akun, sinkronisasi progres antar perangkat (backend).
- Mode kalimat / percakapan.
- Gamifikasi lanjutan (streak, leaderboard, poin).
- Aplikasi mobile native (Android/iOS) dan publish ke app store.
- Dukungan dua tangan untuk SIBI/BISINDO penuh di MVP.
- Konten video panduan per gestur (gambar + teks cukup di MVP).
- Pengenalan ekspresi wajah / bahasa tubuh (fokus ke tangan).
- Penerjemahan isyarat → teks secara bebas (hanya pengenalan kosakata terbatas).

## Further Notes

- Target selesai: MVP kelar di pertemuan 12 (1 bulan sebelum akhir); P13-16 untuk QA, laporan, presentasi. Lihat `docs/rencana-16-pertemuan.md`.
- Rencana cadangan: jika telat, kata jadi fase 2 (24 abjad tetap MVP inti).
- Akses komunitas Tuli untuk validasi = best effort, dibutuhkan hanya untuk stretch BISINDO.
- Kejujuran akademik: klaim akurasi harus diukur sungguhan dengan confusion matrix; target ≥85% dinyatakan dari awal.
- Repo masih greenfield: spec ini adalah fondasi; implementasi mengikuti issue tracker (GitHub Issues) setelah spec disetujui.
