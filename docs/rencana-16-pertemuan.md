# Rencana 16 Pertemuan (Capstone SIBI Sign Language)

> Asumsi: 1 pertemuan = 1 minggu. Posisi sekarang: **Pertemuan 3** (minggu ini).
> Proyek: Aplikasi web belajar SIBI + pengenalan gestur real-time (SIBI MVP, BISINDO stretch).
> Tim: 2 orang (1 developer + 1 non-coding). Bahasa target: SIBI (satu tangan).

## Target utama

- **MVP selesai di Pertemuan 12** (= 1 bulan sebelum pertemuan akhir), sisanya P13-16 untuk QA, laporan, dan presentasi.
- Ini target yang **realistis tapi tanpa ruang error**: butuh disiplin mulai dataset di P5-6 dan nol fitur baru setelah P8.
- "Selesai" = aplikasi jalan + model akurasi ≥85%. Laporan disiapkan paralel (bukan nunggu aplikasi jadi).

## Ringkasan fase

| Fase | Pertemuan | Fokus |
|------|-----------|-------|
| **0. Fondasi & riset** | 3-4 | Kunci ide, kontak dosen, susun proposal, riset Kamus SIBI & daftar kata |
| **1. Buktikan teknologinya** | 5-7 | Pipeline MediaPipe + model kecil jalan di browser, dataset awal |
| **2. Bangun MVP** | 8-12 | Aplikasi lengkap: belajar, latihan, feedback, progres, integrasi model |
| **3. Uji & poles** | 13-14 | QA, akurasi final, perbaikan, siapkan demo |
| **4. Laporan & presentasi** | 15-16 | Laporan akhir, slide, demo, presentasi |

## Detail per pertemuan

### Fase 0: Fondasi & riset (Pertemuan 3-4)

**Pertemuan 3 (MINGGU INI)**
- Finalisasi ide & keputusan (SIBI MVP + BISINDO stretch)
- Konsultasi dosen: validasi arah proyek, aturan kelompok, ekspektasi deliverable
- Susun proposal singkat (1-2 hal) untuk dosen
- Bagi peran tim
- ⚠️ **Jalur kritis**: kalau ide belum dikunci ke dosen di P3-4, semua fase mundur.

**Pertemuan 4**
- Riset Kamus SIBI (pmpk.kemdikbud.go.id/sibi): pilih 24 abjad statis + 15-20 kata
- Siapkan daftar kata final & kumpulkan gambar panduan per gestur
- Setup repo & lingkungan dev (React + Vite + MediaPipe + TF.js)
- Mulai eksperimen: jalankan MediaPipe deteksi 1 tangan di browser (proof of concept)
- 🗣️ Teman (non-coding): mulai kumpulkan bahan laporan bab 1-3 (pendahuluan, tinjauan pustaka, metode)

### Fase 1: Buktikan teknologinya (Pertemuan 5-7)

**Pertemuan 5**
- ⚠️ **MULAI REKAM DATASET** (paling sering ditunda, padahal jalur kritis)
- Ekstraksi landmark: script rekam → 21 titik per frame
- Coba dataset publik ASL untuk prototyping pipeline
- Latih model MLP pertama (kecil, misal 5-10 huruf)

**Pertemuan 6**
- Lanjut rekam dataset (video → frame) untuk abjad
- Evaluasi model: akurasi per huruf + confusion matrix

**Pertemuan 7**
- 🚪 **GERBANG**: webcam harus bisa menebak 5-10 huruf secara real-time
- Kalau belum jalan: pangkas scope SEBELUM terlalu dalam (lihat Rencana Cadangan)
- Lanjut dataset (target ±100 frame/gestur untuk 24 abjad)

### Fase 2: Bangun MVP (Pertemuan 8-12)

**Pertemuan 8**
- Kerangka aplikasi: routing 5 halaman (Beranda, Abjad, Kata, Latihan, Progres)
- Halaman Abjad + grid
- 🚫 **NOL fitur baru setelah P8** (catat ide di daftar "nanti", jangan dieksekusi)

**Pertemuan 9**
- Mode Belajar: alur linear (lihat → coba → dinilai → panduan ulang)
- Feedback dasar benar/salah

**Pertemuan 10**
- Feedback geometris (saran dari landmark) untuk abjad
- Halaman Kata (15-20 kata)

**Pertemuan 11**
- Mode Latihan: kuis + latihan bebas
- Progres lokal (localStorage) + mastery 3x benar
- Mode tanpa kamera

**Pertemuan 12**
- ✅ **MVP SELESAI**: integrasi penuh, semua abjad + kata, poles UX, mode uji dari file (cadangan demo), akurasi ≥85%
- **Milestone: MVP lengkap (fitur inti jalan)**

### Fase 3: Uji & poles (Pertemuan 13-14)

**Pertemuan 13**
- QA internal (temanmu jadi user pertama) + perbaikan bug
- Ukur akurasi final (target ≥85%), confusion matrix untuk laporan

**Pertemuan 14**
- Poles UX & perf
- Siapkan video demo cadangan + mode file
- (Kalau gerbang kebuka: mulai riset BISINDO stretch)

### Fase 4: Laporan & presentasi (Pertemuan 15-16)

**Pertemuan 15**
- Laporan capstone (bab 1-6; draft bab 1-3 sudah jalan dari P4)
- Slide presentasi + latihan demo

**Pertemuan 16**
- Finalisasi, presentasi & demo ke dosen

---

## Rencana Cadangan (kalau telat)

**Jika P7 (gerbang) belum tercapai atau MVP terancam molor dari P12:**

1. **Pangkas kata jadi fase 2**: MVP inti cukup 24 abjad dulu; 15-20 kata dikerjakan setelah abjad stabil (bisa tetap masuk sebelum P12, atau jadi "pengembangan lanjutan").
2. Abjad saja dengan feedback bagus tetap cerita sidang yang kuat.
3. Keputusan pangkas diambil bersama tim & dikomunikasikan ke dosen, bukan diam-diam.

## Catatan penting

- **Estimasi beban**: total ±130-190 jam kerja developer untuk scope penuh. Dengan 10-15 jam/minggu efektif, teknis kelar idealnya di P12-13.
- **Laporan bukan kegiatan dadakan**: temanmu mulai kumpulkan bahan dari P4 (bab pendahuluan, tinjauan pustaka bisa ditulis sambil jalan).
- **BISINDO stretch** hanya dikerjakan setelah P14 kalau semua gerbang terbuka (ADR-0005).
- Timeline ini asumsi 1 pertemuan/minggu; kalau ada jeda (UAS, libur), sesuaikan.
