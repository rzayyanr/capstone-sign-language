# ADR-0003: Web mobile-first (PWA), semua pipeline pengenalan di browser

- Status: Accepted
- Tanggal: 2026-09-07

## Konteks

Proyek adalah aplikasi belajar bahasa isyarat dengan pengenalan gestur real-time. Ada pertanyaan mendasar: di mana aplikasi "nempel" dan di mana otak pengenalan (deteksi + klasifikasi) dijalankan.

Pilihan platform: native mobile (butuh dua platform/publish ke app store, demo di HP yang kameranya mudah goyang), web desktop (stabil tapi kurang "apps in hand"), atau **web mobile-first/PWA** (satu kode jalan di browser laptop dan HP, bisa "Add to Home Screen", tanpa publish). Dipilih PWA agar demo stabil di laptop sekaligus tetap bisa dibuka di HP.

Pilihan pipeline: deteksi tangan + klasifikasi bisa jalan **di server** (butuh backend, ada latensi dan masalah privasi video) atau **di browser pengguna** (MediaPipe deteksi 21 landmark + model ringan via TensorFlow.js, video tidak pernah keluar device). Dipilih **client-side** agar: privasi terjaga, tanpa latensi, tanpa biaya server, dan deployment murah. Konsekuensinya model harus ringan (MLP/CNN kecil) agar tidak lemot di browser.

## Keputusan

- Platform: **web mobile-first (PWA)**, jalan di laptop dan HP lewat browser.
- Pipeline pengenalan: **sepenuhnya di browser** (MediaPipe landmark + TensorFlow.js), tanpa server ML.
- Stack frontend: **React + Vite** (ringan, cocok untuk aplikasi client-side; backend tidak wajib di MVP karena progres lokal).

## Konsekuensi

- Positif: demo stabil di laptop, tetap mobile; privasi pengguna terjaga; tanpa biaya server; deployment murah; stack ringan yang cepat dikembangkan 1 developer.
- Negatif: model terbatas pada yang ringan untuk browser; tidak ada agregasi data lintas perangkat di MVP.
- Catatan: migrasi ke Next.js dimungkinkan di masa depan bila perlu login/server/akun, tanpa mengubah arsitektur inti.