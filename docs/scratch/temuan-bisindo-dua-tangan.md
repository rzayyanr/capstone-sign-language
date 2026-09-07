# Verifikasi: Abjad BISINDO memakai DUA tangan (terkonfirmasi visual)

## Status: Terverifikasi dari sumber primer

Aku melihat langsung video **"Abjad Jari BISINDO A-Z" oleh Komunitas Tuli Kupang (KTK)** (https://www.youtube.com/watch?v=Dq9CaVGPfwk, durasi 135 detik) dan meng-capture beberapa frame.

**Hasil visual:** Wanita dalam video membentuk huruf **"H"** dengan **DUA tangan**:
- Kedua telunjuk (kiri & kanan) diacungkan lurus ke atas, sejajar.
- Ibu jari/ bagian tangan saling bertemu di tengah membentuk garis horizontal.
- Secara visual kedua tangan membentuk huruf kapital H.

Ini konfirmasi langsung bahwa **abjad jari BISINDO (setidaknya versi KTK/NTT) memakai dua tangan**, konsisten dengan sumber media (Tempo, RRI, Kemensos, Telkom, LBI UI) yang menyebut BISINDO "cenderung dua tangan" untuk abjad, berbeda dari SIBI/ASL yang satu tangan.

## Catatan penting (kejujuran)

- Ini versi **NTT (Komunitas Tuli Kupang)**. BISINDO punya **variasi daerah**; versi lain (Jakarta, dll) mungkin sedikit berbeda untuk sebagian huruf. Namun konsistensi antar sumber memperkuat bahwa dua tangan adalah ciri umum abjad BISINDO.
- Tidak semua huruf harus dua tangan; detail per huruf (A-Z) perlu diverifikasi ke chart/video lengkap saat eksekusi.
- Temuan ini **memperkuat** pentingnya ADR-0002 (validasi & sumber dokumentasi yang kuat).

## Dampak teknis (perubahan dari asumsi awal)

| Aspek | Asumsi awal (salah) | Kenyataan BISINDO |
|---|---|---|
| Jumlah tangan | 1 tangan | **2 tangan** (untuk abjad) |
| Landmark per frame | 21 (satu tangan) | **42 (dua tangan) atau 2 set 21** |
| Deteksi | MediaPipe satu tangan | MediaPipe **dua tangan** |
| Dataset | rekam 1 tangan | rekam **2 tangan**, pose relatif antar tangan penting |
| Feedback geometris | geometri 1 tangan | geometri **2 tangan** + hubungan antar tangan |
| Beban teknis | sedang | **lebih berat** (2x lipat data, kompleksitas pose) |
| Dataset publik | bisa pakai ASL | **tidak bisa** (ASL 1 tangan ≠ BISINDO 2 tangan) |

## Implikasi pilihan

1. **Tetap BISINDO dua tangan**: paling autentik, dampak nyata, tapi beban teknis naik signifikan — berisiko untuk 1 developer dalam 1 semester. Perlu scope menyempit (misal abjad saja, atau abjad + sangat sedikit kata) dan waktu dataset 2x.
2. **Pivot ke SIBI (satu tangan)**: teknis paling ringan (mirip ASL, dataset publik ASL bisa dipakai), dokumentasi resmi Kemendikbud lengkap, tapi cerita dampak lebih lemah (SIBI kurang dipakai komunitas sehari-hari; 90%+ Tuli lebih suka BISINDO).
3. **BISINDO dua tangan + batasi cakupan ekstrem**: misal hanya 10-15 huruf yang paling sering dipakai & terdokumentasi, atau fokus kata yang satu tangan saja. Autentik, teknis terkendali, tapi produk lebih kecil.

## Rekomendasi awal

Dengan tim 2 orang (1 developer) dan 1 semester, **BISINDO dua tangan penuh (26 abjad + 15-20 kata) terlalu berisiko**. Pilihan realistis:
- **Opsi teraman & tetap berdampak**: SIBI (satu tangan) sebagai MVP teknis, dengan catatan jujur di laporan bahwa BISINDO adalah bahasa komunitas yang lebih hidup. Atau
- **BISINDO autentik dengan scope kecil**: 10-15 huruf dua tangan pilihan + beberapa kata satu tangan, sebagai "bukti konsep" yang autentik.

Keputusan akhir tetap di tangan Zayyan (user) setelah memahami trade-off ini.
