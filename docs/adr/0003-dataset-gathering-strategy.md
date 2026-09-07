# ADR-0003: Pengumpulan dataset latih gabungan, dengan rekam sendiri sebagai tulang punggung

- Status: Accepted
- Tanggal: 2026-09-07 (revisi: bahasa target SIBI, bukan BISINDO)

## Konteks

Model klasifikasi gestur perlu dataset latih. Bahasa target MVP adalah **SIBI** (ADR-0002), yang abjadnya **satu tangan** dan mengadaptasi ASL. Karena itu, dataset publik ASL (misal ASL Alphabet / Sign Language MNIST) **relevan untuk prototyping/awal** pengenal SIBI, karena bentuk abjad dasarnya mirip (satu tangan).

Namun untuk kualitas final dan konsistensi dengan SIBI (dan Kamus SIBI), dataset publik ASL saja tidak cukup: variasi pelafalan, pencahayaan lokal, dan daftar kata SIBI spesifik butuh data sendiri.

## Keputusan

- Pengumpulan dataset latih memakai strategi **gabungan**:
  1. **Dataset publik ASL** dipakai untuk **prototyping/awal** pipeline (uji coba arsitektur model, alur ekstraksi landmark) karena abjad SIBI satu tangan mirip ASL.
  2. **Rekam sendiri** (50-100 sample per gestur, beberapa sudut & kondisi cahaya) sebagai **tulang punggung** dataset final, agar konsisten dengan SIBI dan daftar kata yang dipilih.
- Rekam sendiri dikerjakan oleh kedua anggota tim (butuh variasi tangan/sudut), dengan instruksi teknis dari developer.

## Konsekuensi

- Positif: prototyping cepat dengan dataset publik ASL menghemat waktu; dataset final terkontrol & konsisten SIBI; kerjaan rekam memberi pembagian tugas yang jelas.
- Negatif: dataset publik ASL bukan pengganti data final (perlu rekam sendiri); rekam sendiri makan waktu dan membosankan; porsi teknis dataset lebih berat karena hanya 1 developer yang bisa mengotomasi.