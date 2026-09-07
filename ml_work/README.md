# Pipeline Pengenalan Abjad SIBI (Prototype T3)

Prototype offline untuk membuktikan pipeline pengenalan huruf dari gestur tangan
sebelum diintegrasikan ke browser (T4+). Menggunakan landmark tangan MediaPipe
(21 titik x,y,z per tangan = vektor 63 fitur) dan model MLP kecil (scikit-learn).

## Alur

```
gambar/JSON landmark  →  extract_landmarks.py  →  vektor 63 fitur
                                                      ↓
data/landmarks/{A..Z}/*.json  →  train.py  →  model.pkl + report.txt
                                                      ↓
gambar/JSON  →  predict.py  →  huruf tertebak
```

## Dataset

Data landmark fingerspelling dari [sid220/asl-now-fingerspelling](https://huggingface.co/datasets/sid220/asl-now-fingerspelling)
(MIT license): ribuan sampel 21 landmark per huruf A-Z, dikumpulkan dari banyak
partisipan lewat MediaPipe di browser. Struktur: `data/landmarks/<HURUF>/<uuid>.json`.

SIBI memakai alfabet satu tangan yang sama dengan ASL untuk huruf statis
(A-I, K-Y; J & Z dinamis tidak dipakai di MVP), jadi dataset ini valid sebagai
titik awal prototype.

> Catatan: data asli berada di subfolder `data/landmarks/` (diunduh oleh
> `download_data.py`) dan tidak di-commit ke git (ukuran + hak cipta).

## Instalasi

```bash
pip install -r requirements.txt
```

## Pemakaian

1. Unduh data (sekali):
   ```bash
   python download_data.py
   ```

2. Latih model & lihat laporan akurasi:
   ```bash
   python train.py
   ```
   Output: `artifact/model.pkl` (model + scaler + kelas) dan `artifact/report.txt`.

3. Tebak huruf dari satu file:
   ```bash
   python predict.py data/landmarks/A/xxxx.json   # dari landmark JSON
   python predict.py foto_tangan.png              # dari gambar (via MediaPipe)
   ```

4. (Utilitas) Ekstrak landmark dari folder gambar ke CSV:
   ```bash
   python extract_landmarks.py --dir folder_gambar --out hasil.csv
   ```

## Artefak

| File | Isi |
|---|---|
| `artifact/model.pkl` | Model MLP terlatih + scaler + daftar kelas |
| `artifact/report.txt` | Akurasi per huruf + confusion matrix |

## Catatan akurasi

Target PRD: akurasi rata-rata >= 85% pada data uji. Dataset landmark yang
sudah dinormalisasi biasanya memberi akurasi > 95% dengan MLP sederhana pada
26 kelas. Di MVP kami hanya memakai 24 huruf statis (tanpa J, Z).
