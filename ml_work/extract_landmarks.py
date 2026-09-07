"""
Ekstraksi 21 landmark tangan dari gambar menggunakan MediaPipe HandLandmarker (tasks API).
Menghasilkan vektor fitur 63 dimensi (21 landmark x 3 koordinat x,y,z).

Pemakaian:
    python extract_landmarks.py <path_gambar>          # cetak landmark 1 gambar
    python extract_landmarks.py --dir <folder_gambar>  # proses semua gambar di folder
"""
import argparse
import csv
import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(HERE, "models", "hand_landmarker.task")

# Import MediaPipe tasks (API baru; solutions legacy sudah dihapus di 1.x)
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision

_landmarker = None


def get_landmarker():
    """Buat (sekali) HandLandmarker mode IMAGE."""
    global _landmarker
    if _landmarker is None:
        if not os.path.exists(MODEL_PATH):
            print(f"Model tidak ditemukan: {MODEL_PATH}")
            print("Unduh dulu dari: https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task")
            sys.exit(1)
        options = vision.HandLandmarkerOptions(
            base_options=mp_python.BaseOptions(model_asset_path=MODEL_PATH),
            running_mode=vision.RunningMode.IMAGE,
            num_hands=1,
            min_hand_detection_confidence=0.5,
            min_hand_presence_confidence=0.5,
        )
        _landmarker = vision.HandLandmarker.create_from_options(options)
    return _landmarker


def extract_from_image(path):
    """Ekstrak landmark tangan pertama dari satu gambar. Return None jika tak ada tangan."""
    import cv2

    img = cv2.imread(path)
    if img is None:
        return None
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
    result = get_landmarker().detect(mp_image)
    if not result.hand_landmarks:
        return None
    return result.hand_landmarks[0]  # list 21 {x,y,z}


def landmarks_to_vector(landmarks):
    """21 landmark (list dict x,y,z) -> vektor 63 fitur."""
    vec = []
    for lm in landmarks:
        vec.extend([lm.x, lm.y, lm.z])
    return np.array(vec, dtype=np.float32)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", help="path gambar atau folder (dengan --dir)")
    ap.add_argument("--dir", action="store_true", help="proses semua gambar di folder")
    ap.add_argument("--out", default=None, help="file CSV tujuan (jika --dir)")
    args = ap.parse_args()

    if args.dir:
        folder = args.input
        out_csv = args.out or os.path.join(folder, "landmarks.csv")
        rows = []
        for fname in sorted(os.listdir(folder)):
            if not fname.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                continue
            path = os.path.join(folder, fname)
            hl = extract_from_image(path)
            if hl is None:
                print(f"  [skip] tidak ada tangan: {fname}")
                continue
            vec = landmarks_to_vector(hl)
            label = os.path.basename(os.path.dirname(path)) or fname[0].upper()
            rows.append([label, *vec.tolist()])
        with open(out_csv, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            header = ["label"] + [f"{ax}{i}" for i in range(21) for ax in ("x", "y", "z")]
            w.writerow(header)
            w.writerows(rows)
        print(f"Selesai: {len(rows)} sampel -> {out_csv}")
    else:
        hl = extract_from_image(args.input)
        if hl is None:
            print("Tidak ada tangan terdeteksi di gambar.")
            sys.exit(1)
        vec = landmarks_to_vector(hl)
        print("63 fitur landmark:")
        print(", ".join(f"{v:.4f}" for v in vec))


if __name__ == "__main__":
    main()