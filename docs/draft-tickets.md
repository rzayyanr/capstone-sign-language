# Draft Tickets (dari PRD issue #1)

Tracer-bullet vertical slices. Nomor = urutan dependensi (blocker dulu). Tiap ticket demoable/verifiable sendiri.

## T1: Fondasi proyek web (scaffold)
- **Blocked by**: None
- **Delivers**: Repo React+Vite kosong bisa di-build & dijalankan lokal; halaman placeholder; struktur folder siap (modul pengenalan, logika produk, konten). CI/deploy awal ke Vercel/Netlify.
- Ini yang "menghidupkan" repo greenfield.

## T2: Katalog gestur SIBI (data-driven)
- **Blocked by**: T1
- **Delivers**: 24 abjad statis (A-I, K-Y) + 15-20 kata terdefinisi sebagai data {id, label, sistem: SIBI, jumlah_tangan: 1, gambar, teks}. Muncul sebagai grid & halaman detail (tanpa kamera). Sumber: Kamus SIBI.
- Verifiable: buka grid, lihat 24+ huruf & kata.

## T3: Prototype pipeline pengenalan (bukti teknologi)
- **Blocked by**: T1
- **Delivers**: Script (Python) rekam→ekstrak 21 landmark dari video/gambar; latih model MLP kecil; evaluasi akurasi. Prototype: bisa memuat gambar dan menebak huruf.
- Ini "uji kematian" P7 (versi offline dulu, tanpa kamera live).

## T4: Pengenalan real-time di browser (kamera)
- **Blocked by**: T3
- **Delivers**: Kamera → MediaPipe deteksi 1 tangan (21 landmark) → model TF.js → prediksi live di browser. **Milestone gerbang P7: webcam nembak 5-10 huruf real-time.**
- Verifiable: buka di browser, tunjukkan huruf, sistem menebak live.

## T5: Mode Belajar (alur linear)
- **Blocked by**: T2, T4
- **Delivers**: Alur lihat panduan → coba di kamera → dinilai benar/salah → jika salah, panduan muncul lagi. Lanjut otomatis ke gestur berikutnya. Termasuk mode tanpa kamera (belajar pasif) & indikator kamera aktif.
- Verifiable: ikuti alur satu huruf dari panduan sampai berhasil.

## T6: Feedback cerdas (geometris + contoh)
- **Blocked by**: T5
- **Delivers**: Saat salah: sistem kasih saran geometris dari landmark ("luruskan jari telunjuk", "rapatkan jari") + tampilkan contoh gestur benar di samping kamera + beri tahu huruf yang terdeteksi. Target abjad dulu.
- Verifiable: sengaja salah pose, muncul saran yang spesifik & contoh.

## T7: Kuis latihan (skor + daftar salah)
- **Blocked by**: T5
- **Delivers**: Mode kuis: sistem perintah "tunjukkan X", dinilai; akhir sesi tampil skor + daftar yang salah untuk diulang. Plus latihan bebas (tanpa skor).
- Verifiable: mainkan kuis, dapat skor & daftar salah.

## T8: Progres & penguasaan (localStorage)
- **Blocked by**: T5
- **Delivers**: Status penguasaan per huruf (mastery setelah benar 3x berturut-turut), penilaian stabil N-frame, progres tersimpan di localStorage, halaman Progres menampilkan statistik.
- Verifiable: kuasai beberapa huruf, tutup browser, buka lagi, progres ada.

## T9: Mode uji dari file (cadangan demo) + poles
- **Blocked by**: T6, T7, T8
- **Delivers**: Pengguna/penguji bisa memuat gambar untuk dinilai tanpa kamera (cadangan demo). Poles UX & perf, uji akhir (teman sebagai QA), siapkan video demo cadangan.
- Verifiable: demo jalan penuh tanpa kamera via file gambar.

## Rencana cadangan (bukan ticket terpisah)
- Jika telat: T7/T8 bisa dipangkas ke abjad saja (kata jadi fase 2) tanpa mengubah inti.
