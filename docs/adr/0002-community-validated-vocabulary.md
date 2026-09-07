# ADR-0002: Bahasa target BISINDO, validasi kosakata oleh komunitas Tuli

- Status: Accepted (dengan risiko validasi terbuka)
- Tanggal: 2026-09-07

## Konteks

Indonesia memiliki dua bahasa isyarat utama: **BISINDO** (tumbuh alami di komunitas Tuli, dipakai dalam pergaulan sehari-hari) dan **SIBI** (sistem isyarat formal yang dibakukan pemerintah untuk pendidikan di SLB, alfabetnya mengadopsi ASL).

Pertimbangan memilih BISINDO:
- BISINDO adalah bahasa isyarat yang **benar-benar dipakai** komunitas Tuli Indonesia sehari-hari; survei menyebut lebih dari 90% penyandang Tuli Indonesia lebih memilih BISINDO untuk interaksi autentik.
- Cerita dampak proyek paling jujur: membantu orang dengar berkomunikasi dengan teman Tuli dalam bahasa yang nyata dipakai.
- SIBI lebih "buatan" dan penggunaannya terbatas di ruang pendidikan formal.

Konsekuensi dari pilihan ini:
- BISINDO **tumbuh alami**, jadi ada variasi isyarat antar daerah dan dokumentasi resmi yang lebih tipis daripada SIBI.
- Dataset publik untuk BISINDO **hampir tidak ada** (dataset isyarat publik umumnya ASL atau SIBI), sehingga pengumpulan data latih harus **rekam sendiri** (bisa dikombinasikan dengan pencarian dataset publik yang relevan).
- Abjad BISINDO cukup terdokumentasi (chart/video komunitas), tetapi **kata** BISINDO sangat perlu validasi narasumber karena variasi regionalnya.

## Keputusan

- Bahasa target: **BISINDO**.
- Abjad: mulai dari dokumentasi BISINDO yang tersedia; minta dicek narasumber bila akses didapat.
- Kata dasar: daftar 15-20 kata **harus divalidasi narasumber yang kompeten** (teman Tuli, Gerkatin, Pusbisindo, SLB, atau dosen yang paham) sebelum dijadikan konten dan dataset.
- Jika sampai tengah semester akses narasumber belum didapat: MVP difokuskan ke abjad + kata yang dokumentasinya paling kuat, dan risiko ini dicatat serta dikomunikasikan ke dosen pembimbing.
- Pencarian akses komunitas adalah **tanggung jawab anggota tim non-coding** (riset & validasi).

## Konsekuensi

- Positif: isyarat yang diajarkan kredibel dan dipakai nyata; proyek punya narasi dampak kuat.
- Negatif: pengumpulan dataset kata tertunda sampai validasi (atau fallback dipakai); beban dataset rekam sendiri lebih berat daripada memakai dataset publik ASL/SIBI.
- Risiko terbuka: tanpa narasumber, cakupan kata MVP harus menyusut. Ini dikelola dengan ADR ini dan dikomunikasikan ke dosen.
