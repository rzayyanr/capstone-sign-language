"""
Prediksi huruf dari satu gambar / satu vektor landmark menggunakan model terlatih.
Mendukung dua mode:
  1. Dari file gambar (pakai MediaPipe untuk ekstrak landmark)
  2. Dari file JSON landmark (21 titik x,y,z)

Pemakaian:
    python predict.py foto_tangan.png
    python predict.py landmark.json
"""
import json
import os
import pickle
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(HERE, "artifact", "model.pkl")


def load_model(path=MODEL_PATH):
    with open(path, "rb") as f:
        return pickle.load(f)


def predict_from_landmarks(landmarks, bundle):
    """landmarks: list 21 dict {x,y,z} atau array (63,). Kembalikan (huruf, proba)."""
    if isinstance(landmarks, list):
        vec = np.array([c for p in landmarks for c in (p["x"], p["y"], p["z"])], dtype=np.float32)
    else:
        vec = np.asarray(landmarks, dtype=np.float32).reshape(-1)
    vec = bundle["scaler"].transform(vec.reshape(1, -1))
    proba = bundle["model"].predict_proba(vec)[0]
    idx = int(np.argmax(proba))
    letter = bundle["classes"][idx]
    return letter, float(proba[idx]), proba


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    path = sys.argv[1]
    if not os.path.exists(path):
        print(f"File tidak ditemukan: {path}")
        sys.exit(1)

    bundle = load_model()
    print(f"Model dimuat. Kelas: {''.join(bundle['classes'])}")

    ext = os.path.splitext(path)[1].lower()
    if ext in (".json",):
        with open(path) as f:
            lm = json.load(f)
        letter, conf, proba = predict_from_landmarks(lm, bundle)
    elif ext in (".jpg", ".jpeg", ".png", ".webp"):
        from extract_landmarks import extract_from_image, landmarks_to_vector

        hl = extract_from_image(path)
        if hl is None:
            print("Tidak ada tangan terdeteksi.")
            sys.exit(1)
        vec = landmarks_to_vector(hl)
        lm = [{"x": vec[i], "y": vec[i + 1], "z": vec[i + 2]} for i in range(0, 63, 3)]
        letter, conf, proba = predict_from_landmarks(lm, bundle)
    else:
        print(f"Ekstensi tidak didukung: {ext}")
        sys.exit(1)

    print(f"\nPrediksi: huruf {letter}  (confidence {conf*100:.1f}%)")
    top5 = np.argsort(proba)[::-1][:5]
    print("Top-5 tebakan:")
    for i in top5:
        print(f"  {bundle['classes'][i]}: {proba[i]*100:.1f}%")


if __name__ == "__main__":
    main()
