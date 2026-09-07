# CapSL: Belajar SIBI

Aplikasi web (PWA) untuk belajar Bahasa Isyarat Indonesia (SIBI) dengan pengenalan gestur real-time via kamera. Dibuat untuk capstone *Proyek Sistem Aplikasi* UPNVJ.

## Live

**https://capstone-sign-language.vercel.app** (Vercel, auto-deploy dari branch `main`, root directory `app`)

## Stack

- React 19 + Vite 8
- Vitest untuk unit test
- Struktur 3 modul: `src/modules/recognition`, `src/modules/product`, `src/modules/content`

## Menjalankan

```bash
npm install
npm run dev      # development (localhost)
npm run build    # build produksi ke dist/
npm test         # unit test
npm run lint     # oxlint
```

## Struktur

```
src/
├── modules/
│   ├── recognition/   # pengenalan gestur (MediaPipe + TF.js) [T3/T4]
│   ├── product/       # logika produk: alur belajar, kuis, mastery [T5+]
│   └── content/       # katalog gestur data-driven + tipe [T2]
├── pages/             # halaman (Beranda, Abjad, Kata, Latihan, Progres) [T2+]
├── components/        # komponen UI
├── data/              # aset statis (gambar panduan dll)
└── lib/               # util umum
```

## Dokumentasi proyek

Lihat direktori `docs/` di root repo (PRD, ADR, rencana 16 pertemuan, ticket).
