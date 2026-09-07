# Penjelasan Q12: Alur sesi "Belajar"

## Konteks: apa itu "sesi belajar"?

Aplikasi ini punya dua aktivitas utama: **Belajar** (melihat cara membuat gestur, lalu mencobanya) dan **Latihan** (menguji yang sudah dipelajari). Yang dibahas di Q12 adalah **Belajar**: momen ketika pengguna membuka aplikasi dengan niat "aku mau belajar huruf/kata baru".

Aplikasi akan punya banyak huruf (A-Z) dan kata (15-20). Pertanyaannya: ketika pengguna masuk ke sesi belajar, **dalam urutan dan format apa** mereka disuguhi huruf-huruf itu?

## Opsi (a): "Lihat → Coba → Dinilai" (alur linear per huruf)

Ini yang paling sederhana dan paling umum di aplikasi belajar bahasa (Duolingo, dsb). Alurnya:

1. Aplikasi menampilkan **satu** huruf: "Kita belajar huruf **A**".
2. Pengguna **melihat panduan**: gambar/foto/video cara membentuk A (tangan seperti apa, jari mana yang lurus, telapak menghadap ke mana).
3. Pengguna **menekan tombol "Coba"** → kamera menyala.
4. Pengguna **membentuk A** di depan kamera.
5. Sistem **menilai**: benar → "Hebat!" → lanjut ke huruf berikutnya; salah → feedback (lihat Q14) → pengguna coba lagi sampai benar.
6. Setelah benar, lanjut ke huruf **B**, dan seterusnya.

**Keunggulan:** alurnya jelas, fokus, tidak membingungkan; pengguna tidak bisa "tersesat"; ini alur inti yang bisa diandalkan. Cocok sebagai MVP.

**Kelemahan:** kalau pengguna sudah bisa A tapi belum bisa B, mereka tetap harus "melewati" A dulu (kecuali kita kasih pilihan untuk lompat). Bisa terasa kaku.

## Opsi (b): "Lihat → Coba → Dinilai → Lihat lagi" (loop membimbing)

Sebenarnya ini **bukan alur yang berdiri sendiri**, melainkan **penyempurnaan dari (a)**: apa yang terjadi **setelah salah**?

Dalam (a) murni, kalau salah, pengguna mungkin bingung: "lah, aku sudah coba, kok salah? emangnya yang bener kayak gimana?".

Dalam (b), kalau salah, sistem **otomatis menampilkan panduan lagi** sebelum pengguna mencoba ulang: "Belum tepat. Ini lagi contoh A yang benar." Pengguna melihat, lalu mencoba lagi. Ini lebih membimbing, mengurangi frustrasi, dan mencegah pengguna mengulang kesalahan yang sama 5 kali.

## Opsi (c): "Bebas jelajah" (grid huruf, tidak ada urutan)

Alih-alih alur linear, aplikasi menampilkan **grid semua huruf** (A-Z). Pengguna bebas memilih huruf mana pun. Setiap huruf punya "halaman" sendiri: panduan + tombol "coba di kamera". Tidak ada urutan wajib, tidak ada "harus selesaikan A dulu".

**Keunggulan:** fleksibel; pengguna yang sudah mahir bisa langsung lompat ke huruf yang belum dikuasai; terasa seperti "kamus interaktif".

**Kelemahan:** tanpa struktur, pengguna pemula bisa bingung mulai dari mana; kurang "alur belajar" yang membimbing; progress tracking jadi kurang jelas (mana yang sudah dipelajari?).

## Rekomendasi saya: (a) sebagai pola inti + sentuhan (b), dengan (c) sebagai pelengkap

**Untuk MVP, rekomendasiku: (a) sebagai alur inti, dengan perilaku (b) saat salah (otomatis tampilkan panduan lagi), dan (c) sebagai pelengkap (pengguna bisa kapan saja membuka "semua huruf" untuk lompat/mengulang).**

Artinya:

- Alur utama tetap **linear dan membimbing**: aplikasi menuntun "sekarang belajar A, sekarang B", cocok untuk pemula yang butuh struktur.
- Kalau salah, bukan cuma "coba lagi", tapi **panduan muncul lagi** (perilaku b) supaya tidak frustrasi.
- Tapi di pojok layar selalu ada akses ke **grid semua huruf** (perilaku c), jadi pengguna yang sudah bisa bisa langsung lompat ke huruf yang sulit, atau mengulang huruf lama.

Ini keseimbangan: struktur untuk pemula, fleksibilitas untuk yang sudah mahir. (a) saja terlalu kaku, (c) saja terlalu bebas, (b) saja bukan alur utuh. Kombinasi (a)+(b)+(c) dengan (a) sebagai tulang punggung.

**Tapi ini keputusanmu.** Kalau kamu mau paling sederhana untuk MVP (biar cepat kelar), ambil **(a) murni**: Lihat → Coba → Dinilai → benar → lanjut; salah → coba lagi (tanpa otomatis menampilkan panduan, tanpa grid). Itu pun sah dan bagus.

Mau yang mana: **(a) murni, (a)+bimbingan saat salah, atau (a)+bimbingan+grid (rekomendasi)**?
