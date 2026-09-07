# ADR-0002: SIBI sebagai bahasa target MVP (bukan BISINDO)

- Status: Accepted (revisi dari keputusan awal — lihat ADR-0005)
- Tanggal: 2026-09-07

## Konteks

Indonesia memiliki dua bahasa isyarat utama: **BISINDO** (tumbuh alami di komunitas Tuli, dipakai sehari-hari; >90% Tuli lebih memilihnya) dan **SIBI** (sistem isyarat formal yang dibakukan pemerintah untuk pendidikan SLB, abjadnya mengadaptasi ASL).

Semula proyek memilih BISINDO. Namun setelah **verifikasi langsung** (video "Abjad Jari BISINDO A-Z" oleh Komunitas Tuli Kupang, ditonton pada 2026-09-07), terbukti bahwa **abjad BISINDO memakai DUA tangan** (contoh huruf H: dua telunjuk sejajar + ibu jari bertemu di tengah). Ini berbeda dari asumsi awal (abjad satu tangan mirip ASL). Konsekuensinya: deteksi 2 tangan (42 landmark), dataset 2× lipat & lebih rumit, feedback antar dua tangan, dan dataset publik ASL tidak bisa dipakai.

Pertimbangan memilih **SIBI** untuk MVP:
- Abjad SIBI **satu tangan** (seperti ASL): teknis paling ringan, dataset publik ASL bisa dipakai untuk prototyping/awal.
- Terdapat **Kamus SIBI resmi Kemendikbud** (pmpk.kemdikbud.go.id/sibi) yang lengkap & bisa dikutip sebagai sumber kebenaran, tanpa butuh akses komunitas.
- Proyek capstone 1 semester dengan 1 developer lebih realistis selesai dengan kualitas baik.

## Keputusan

- Bahasa target MVP: **SIBI**.
- Sumber kebenaran konten & gambar panduan: **Kamus SIBI resmi Kemendikbud**.
- BISINDO tidak dihapus dari visi, tapi menjadi **stretch goal ber-gerbang** (lihat ADR-0005), bukan janji MVP.

## Konsekuensi

- Positif: teknis ringan, dataset publik ASL membantu, dokumentasi resmi bisa dikutip, proyek realistis selesai.
- Negatif: SIBI kurang dipakai komunitas sehari-hari (cerita dampak sedikit lebih lemah daripada BISINDO); BISINDO (bahasa komunitas yang hidup) tidak masuk MVP.
- Mitigasi: arsitektur disiapkan multi-sistem (ADR-0005) dan narasi laporan menyebut SIBI sebagai "sistem isyarat resmi pendidikan Indonesia" sambil mengakui keunggulan komunitas BISINDO.