# ADR-0001: Gestur statis untuk MVP, dinamis sebagai fase lanjutan opsional

- Status: Accepted
- Tanggal: 2026-09-07 (revisi: tim 2 orang, 1 developer)

## Konteks

Bahasa isyarat (BISINDO) terdiri dari dua jenis gestur: **statis** (arti dari satu pose tangan diam, contoh abjad) dan **dinamis** (arti dari urutan gerakan, contoh "terima kasih", "makan"). Pengenalan gestur dinamis butuh model urutan (RNN/GRU) dan dataset yang jauh lebih berat daripada gestur statis. Proyek ini adalah capstone satu semester dengan **tim 2 orang: satu developer penuh dan satu rekan non-coding**. Beban teknis (seluruh kode) ditanggung satu orang, sehingga skala teknis harus realistis agar produk selesai dan akurat.

## Keputusan

- **MVP** mencakup: 26 abjad (statis) + **15-20 kata dasar** yang dipilih agar **statis**.
- Gestur **dinamis** TIDAK masuk MVP. Ia menjadi **fase lanjutan opsional**, dikerjakan hanya jika waktu tersisa setelah MVP stabil. Jika tidak sempat, ia berada di luar scope dan tidak dijanjikan.

## Konsekuensi

- Positif: risiko teknis rendah, akurasi terjaga, timeline aman untuk 1 developer, dan cerita demo tetap kuat (26 abjad + 15-20 kata dengan akurasi baik).
- Negatif: kosakata MVP belum mencakup kata-kata umum yang bergerak ("terima kasih", "makan"). Diterima sebagai trade-off agar proyek kelar.
- Opsional: bila fase lanjutan tercapai, gestur dinamis ditambahkan sebagai ekstensi, bukan perubahan arsitektur inti.
