# ADR-0005: BISINDO sebagai stretch goal ber-gerbang (bukan janji MVP)

- Status: Accepted
- Tanggal: 2026-09-07

## Konteks

Keputusan ADR-0002 menetapkan **SIBI** sebagai bahasa target MVP karena teknis paling ringan dan dokumentasi resminya bisa dikutip. Namun BISINDO adalah bahasa isyarat yang paling hidup di komunitas Tuli Indonesia (>90% Tuli lebih memilih BISINDO), sehingga menghapusnya sepenuhnya dari visi akan membuang nilai dampak. Solusinya: BISINDO dijadikan **stretch goal** yang boleh dikerjakan jika kondisi memungkinkan, tanpa membebani janji MVP.

Karena abjad BISINDO dua tangan (ADR-0002), menambahkan BISINDO penuh (26 abjad + kata dua tangan) sangat berat. Supaya tetap realistis, stretch BISINDO dibatasi dan dijaga oleh gerbang.

## Keputusan

- **Stretch goal BISINDO** dikerjakan **hanya jika semua gerbang ini terbuka**:
  1. **MVP SIBI tuntas**: fitur lengkap, akurasi ≥85% pada data uji, sudah dites.
  2. **Akses komunitas/narasumber didapat** untuk validasi isyarat BISINDO (karena BISINDO punya variasi daerah; contoh H versi Kupang). Ini syarat wajib: tanpa validasi, BISINDO yang dibangun berisiko salah versi.
  3. **Waktu benar-benar tersisa** setelah laporan dan persiapan presentasi.
- Jika gerbang terbuka, scope stretch BISINDO dibatasi ke **abjad A-Z dua tangan** sebagai modul tambahan (bukan kata-kata, yang paling berat). Pengguna bisa memilih sistem isyarat (SIBI / BISINDO) di aplikasi.
- Jika gerbang tidak terbuka, BISINDO tidak dikerjakan; SIBI MVP tetap utuh dan sukses. Tidak ada rasa bersalah; di laporan BISINDO disebut jujur sebagai "pengembangan lanjutan yang direncanakan".

## Konsekuensi

- Positif: MVP aman dan selesai; BISINDO memberi nilai tambah & peluang dampak bila waktu tersisa; arsitektur multi-sistem jadi nilai jual di laporan.
- Negatif: BISINDO bisa tidak pernah terwujud dalam semester ini (diterima sebagai trade-off).
- Wajib: arsitektur aplikasi **disiapkan multi-sistem dari awal** (katalog gestur data-driven: id, nama, sistem, jumlah tangan 1/2, gambar panduan; registri model per sistem) agar stretch BISINDO hanya "colok modul", bukan rombak besar. Ini biaya kecil di awal yang menjaga opsi tetapterbuka.