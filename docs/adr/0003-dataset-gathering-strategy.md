# ADR-0004: Pengumpulan dataset latih gabungan, dengan rekam sendiri sebagai tulang punggung

- Status: Accepted
- Tanggal: 2026-09-07

## Konteks

Model klasifikasi gestur perlu dataset latih. Dataset publik bahasa isyarat yang besar umumnya untuk **ASL** atau **SIBI**, bukan BISINDO (karena BISINDO tumbuh alami dan kalah terdokumentasi). Karena bahasa target adalah BISINDO (ADR-0002), dataset publik yang cocok hampir tidak tersedia.

## Keputusan

- Pengumpulan dataset latih memakai strategi **gabungan**: cari dataset publik BISINDO/relevan terlebih dahulu; kekurangannya ditutup dengan **rekam sendiri** (50-100 sample per gestur, dari beberapa sudut dan kondisi cahaya).
- Rekam sendiri adalah **tulang punggung** dataset karena konsisten dengan BISINDO dan daftar kata yang kita pilih.
- Rekam sendiri dikerjakan minimal oleh kedua anggota tim (butuh banyak variasi tangan/sudut), dengan instruksi teknis dari developer.

## Konsekuensi

- Positif: dataset terkontrol dan konsisten dengan BISINDO; kerjaan rekam data memberi pembagian tugas yang jelas di tim dan cerita yang kuat di sidang.
- Negatif: rekam sendiri makan waktu dan membosankan; karena hanya 1 developer yang bisa mengotomasi, porsi teknis dataset lebih berat.