# ADR-0001: Gestur statis untuk MVP, dinamis sebagai fase lanjutan opsional

- Status: Accepted
- Tanggal: 2026-09-07 (revisi: SIBI satu tangan, tim 2 orang, 1 developer)

## Konteks

Bahasa isyarat punya dua jenis gestur: **statis** (arti dari satu pose tangan diam, contoh abjad) dan **dinamis** (arti dari urutan gerakan, contoh huruf J & Z pada SIBI, dan kata-kata tertentu). Pengenalan gestur dinamis butuh model urutan (RNN/GRU) dan dataset yang jauh lebih berat daripada gestur statis.

Proyek ini adalah capstone satu semester dengan **tim 2 orang: satu developer penuh dan satu rekan non-coding**. Beban teknis (seluruh kode) ditanggung satu orang, sehingga skala teknis harus realistis agar produk selesai dan akurat. Bahasa target MVP adalah **SIBI (satu tangan)**.

## Keputusan

- **MVP** mencakup: **24 abjad statis SIBI (A-I, K-Y)** + **15-20 kata dasar** yang dipilih dari Kamus SIBI (dipilih yang statis bila memungkinkan).
- Huruf **J & Z** pada SIBI bersifat dinamis: **tidak masuk MVP**; ditangani di fase lanjutan (bisa lewat pose akhirnya atau sebagai gestur dinamis).
- Gestur **dinamis** TIDAK masuk MVP; menjadi **fase lanjutan opsional**.
- Gestur BISINDO dua tangan juga bukan bagian MVP (lihat ADR-0005).

## Konsekuensi

- Positif: risiko teknis rendah, akurasi terjaga, timeline aman untuk 1 developer, cerita demo kuat (24 abjad + 15-20 kata satu tangan dengan akurasi baik).
- Negatif: kosakata SIBI MVP belum mencakup J, Z, dan kata-kata yang bergerak. Diterima sebagai trade-off agar proyek kelar.
- Opsional: bila fase lanjutan tercapai, J/Z dan gestur dinamis ditambahkan sebagai ekstensi, bukan perubahan arsitektur inti.