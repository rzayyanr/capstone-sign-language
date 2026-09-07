# CONTEXT.md

Glossary domain proyek. Dokumen ini murni berisi istilah baku, bukan spec, bukan scratch pad, dan bukan tempat keputusan implementasi (itu di `docs/adr/`).

Terakhir diperbarui: 2026-09-07

## Definisi istilah

| Istilah | Definisi |
|---------|----------|
| **Aplikasi belajar bahasa isyarat (CapSL)** | Produk proyek ini: aplikasi web untuk belajar bahasa isyarat dengan pengenalan gestur real-time. |
| **SIBI** | Sistem Isyarat Bahasa Indonesia: sistem isyarat **resmi pemerintah** untuk pendidikan (SLB), dibakukan lewat Kamus SIBI (Kemendikbud). Abjadnya **satu tangan** (mengadaptasi ASL: 24 huruf statis + J/Z yang bergerak). **Bahasa target MVP.** |
| **BISINDO** | Bahasa isyarat Indonesia yang tumbuh alami di komunitas Tuli, dipakai sehari-hari (>90% Tuli lebih memilihnya). Abjadnya **dua tangan** (terverifikasi visual dari video Komunitas Tuli Kupang). **Stretch goal**, bukan janji MVP. |
| **Kamus SIBI** | Kamus digital resmi Kemendikbud (pmpk.kemdikbud.go.id/sibi) berisi abjad & kosakata SIBI; menjadi **sumber kebenaran** konten dan gambar panduan. |
| **Pembelajar** | Pengguna utama: orang dengar yang ingin belajar berkomunikasi dengan teman Tuli. Kamera menilai gerakan tangan pembelajar. |
| **Komunitas Tuli** | Narasumber validasi BISINDO (teman Tuli, Gerkatin, Pusbisindo, SLB). Dibutuhkan **hanya untuk stretch goal BISINDO**; akses bersifat best effort. |
| **Gestur statis** | Isyarat yang artinya ditentukan oleh satu pose tangan diam (tanpa gerakan). |
| **Gestur dinamis** | Isyarat yang artinya ditentukan oleh urutan gerakan. Di SIBI: huruf J, Z, dan sebagian kata. Tidak masuk MVP (ADR-0001). |
| **Abjad SIBI (MVP)** | 24 huruf statis (A-I, K-Y) yang isyaratnya satu tangan. J & Z (bergerak) ditunda. |
| **Kata dasar** | 15-20 kata sehari-hari SIBI yang dipilih dari Kamus SIBI untuk MVP, dipilih yang statis bila memungkinkan. |
| **21 landmark** | Titik-titik kerangka satu tangan dari MediaPipe (sendi jari, ujung jari, pergelangan) yang jadi masukan model. SIBI satu tangan → 21 titik. |
| **Feedback geometris** | Koreksi belajar berbasis posisi landmark (sudut jari, arah telapak), bukan sekadar benar/salah. Target utama abjad. |
| **Mode belajar** | Sesi pengguna melihat panduan lalu mencoba gestur di depan kamera untuk dinilai sistem. |
| **Mode latihan** | Sesi kuis: sistem mengacak kata/abjad yang sudah dipelajari untuk diulang pembelajar, dengan skor. |
| **Kuis latihan** | Mode latihan berstruktur: sistem memberi perintah ("tunjukkan huruf A"), menilai benar/salah, di akhir memberi skor + daftar yang salah untuk diulang. |
| **Latihan bebas** | Mode latihan tanpa skor/urutan: pengguna memilih gestur yang ingin dicoba, langsung dinilai. |
| **Kurikulum bertingkat** | Urutan belajar: Abjad → Kata dasar → (lanjutan) Kalimat sederhana. |
| **Alur belajar (inti)** | Mode Belajar mengikuti alur linear per gestur: Lihat panduan → Coba di kamera → Dinilai. Benar → lanjut ke gestur berikutnya. |
| **Panduan ulang saat salah** | Saat gestur salah di Mode Belajar, sistem otomatis menampilkan panduan lagi sebelum pengguna mencoba ulang. |
| **Grid semua gestur** | Pelengkap alur linear: pengguna bisa kapan saja membuka grid berisi semua huruf/kata untuk lompat atau mengulang. |
| **Saran geometris** | Saat salah, sistem memberi petunjuk konkret dari geometri landmark ("jari telunjukmu belum lurus", "rapatkan jarimu"). |
| **Contoh visual** | Saat salah, sistem menampilkan contoh gestur yang benar di samping tampilan kamera pengguna. |
| **Penilaian stabil (N-frame)** | Gestur dianggap berhasil hanya jika prediksi sama muncul N frame berturut-turut dengan skor keyakinan di atas ambang. |
| **Penguasaan (mastery)** | Gestur dianggap "dikuasai" setelah benar 3x berturut-turut; menjadi dasar status di Progres. |
| **Mode tanpa kamera** | Pengguna bisa melihat materi & panduan tanpa menyalakan kamera. Kamera hanya aktif saat latihan, ada indikator jelas, video tidak direkam/dikirim (semua lokal). |
| **Halaman aplikasi** | Kerangka MVP: Beranda, Abjad (grid), Kata (grid), Latihan (kuis + bebas), Progres. |
| **Panduan gestur** | Isi panduan per huruf/kata: gambar diam pose + teks deskripsi langkah. Video sebagai peningkatan opsional. |
| **Progres pengguna** | Riwayat level & skor. MVP disimpan lokal di browser (localStorage), belum ada login. |
| **Bahasa antarmuka** | UI MVP memakai Bahasa Indonesia. |
| **Urutan kurikulum** | Urutan default A-Z (dan daftar kata). Pengguna bebas memilih gestur lain dari grid; default hanya panduan. |
| **Model klasifikasi** | MLP ringan: input 21 landmark MediaPipe, output kelas gestur. Dilatih offline, dijalankan di browser. |
| **Eksekusi model di browser** | Model dijalankan dengan TensorFlow.js (model Keras dari Python dikonversi ke format TF.js). |
| **Pelatihan model** | Training di Python (Keras/TensorFlow) offline di laptop; Google Colab cadangan bila butuh GPU/dataset besar. |
| **Manajemen dataset** | Video/foto mentah di Google Drive; kode, skrip, dan CSV landmark (± MB) di repo git. |
| **Deployment** | Aplikasi di-hosting di Vercel atau Netlify (gratis, auto-deploy, HTTPS wajib untuk akses kamera). |
| **Metrik kualitas model** | Akurasi per huruf + akurasi rata-rata, dilengkapi confusion matrix / F1 per huruf. |
| **Target akurasi MVP** | Akurasi rata-rata per gestur ≥85% pada data uji. ≥90% sebagai target "stretch". |
| **Cadangan demo** | Setiap fitur live punya versi offline: video rekaman sesi + mode uji dari file gambar. |
| **Metode rekam dataset** | Video pendek per gestur → diekstrak jadi frame (sumber utama, ±70%) + foto langsung untuk variasi (±30%). |
| **Ukuran dataset MVP** | ±100 frame per gestur (24 abjad + 15-20 kata). Bisa dinaikkan untuk huruf yang sering salah. |
| **Stretch goal BISINDO** | Modul BISINDO abjad dua tangan, dikerjakan **hanya jika semua gerbang terbuka**: (1) MVP SIBI tuntas ≥85%, (2) akses komunitas didapat untuk validasi, (3) waktu sisa setelah laporan & presentasi. Bukan janji MVP. |
| **Arsitektur multi-sistem** | Katalog gestur data-driven (id, nama, sistem SIBI/BISINDO, jumlah tangan, gambar panduan) + registri model per sistem, disiapkan sejak awal agar BISINDO bisa "dicolok" tanpa rombak. |
| **Tim** | 2 orang: satu developer (Zayyan, pegang semua kode) dan satu rekan non-coding (konten, riset, QA, dokumentasi/laporan). |
