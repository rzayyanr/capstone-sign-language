"""
Melatih model MLP (scikit-learn) dari data landmark tangan hiruhfingerspelling.
Membaca data/landmarks/{A..Z}/*.json (21 landmark x,y,z per file), membangun matriks
fitur 63 dimensi, train/test split, lalu mengevaluasi akurasi per huruf + confusion matrix.

Pemakaian:
    python train.py                # pakai data/landmarks
    python train.py --data <path>  # folder data landmark kustom
    python train.py --epochs 500 --no-split  # latih semua data (tanpa split, untuk demo)

Menghasilkan:
    artifact/model.pkl  (MLP + feature info)
    artifact/report.txt (akurasi per huruf)
"""
import argparse
import json
import os
import pickle

import numpy as np
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DATA = os.path.join(HERE, "data", "landmarks")
ARTIFACT_DIR = os.path.join(HERE, "artifact")


def load_samples(data_dir, letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"):
    X, y = [], []
    for letter in letters:
        folder = os.path.join(data_dir, letter)
        if not os.path.isdir(folder):
            continue
        for fname in os.listdir(folder):
            if not fname.endswith(".json"):
                continue
            with open(os.path.join(folder, fname)) as f:
                lm = json.load(f)  # list 21 {x,y,z}
            vec = [c for p in lm for c in (p["x"], p["y"], p["z"])]
            if len(vec) != 63:
                continue
            X.append(vec)
            y.append(letter)
    return np.array(X, dtype=np.float32), np.array(y)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default=DEFAULT_DATA)
    ap.add_argument("--epochs", type=int, default=600)
    ap.add_argument("--no-split", action="store_true", help="latih semua data tanpa split-val")
    ap.add_argument(
        "--letters",
        default="ABCDEFGHIKLMNOPQRSTUVWXY",
        help="huruf yang dipakai (default: 24 statis, tanpa J & Z)",
    )
    args = ap.parse_args()

    X, y = load_samples(args.data, letters=args.letters)
    print(f"Total sampel: {X.shape[0]}, fitur per sampel: {X.shape[1]}")
    classes = sorted(set(y))
    print("Kelas (huruf):", "".join(classes))

    # standardisasi
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    if args.no_split:
        X_tr, X_te, y_tr, y_te = X_scaled, X_scaled, y, y
        acc_label = "pelatihan (full-set, overfit-check)"
    else:
        X_tr, X_te, y_tr, y_te = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42, stratify=y
        )
        acc_label = "uji (hold-out 20%, stratified)"

    model = MLPClassifier(
        hidden_layer_sizes=(128, 64),
        activation="relu",
        max_iter=args.epochs,
        random_state=42,
        early_stopping=True,
        validation_fraction=0.15,
        learning_rate_init=0.001,
    )
    model.fit(X_tr, y_tr)

    pred = model.predict(X_te)
    acc = accuracy_score(y_te, pred)
    print(f"\nAkurasi {acc_label}: {acc:.4f} ({acc*100:.1f}%)")

    rep = classification_report(y_te, pred, labels=classes, zero_division=0)
    print("\n=== Laporan per huruf ===")
    print(rep)

    cm = confusion_matrix(y_te, pred, labels=classes)
    os.makedirs(ARTIFACT_DIR, exist_ok=True)
    with open(os.path.join(ARTIFACT_DIR, "report.txt"), "w", encoding="utf-8") as f:
        f.write(f"Akurasi {acc_label}: {acc:.4f}\n\n{rep}\n")
        f.write("Confusion matrix (baris=aktual, kolom=prediksi):\n")
        f.write("   " + " ".join(classes) + "\n")
        for i, row in enumerate(cm):
            f.write(f"{classes[i]}: " + " ".join(f"{v:3d}" for v in row) + "\n")
    with open(os.path.join(ARTIFACT_DIR, "model.pkl"), "wb") as f:
        pickle.dump({"model": model, "scaler": scaler, "classes": classes}, f)
    print(f"\nModel & laporan tersimpan di {ARTIFACT_DIR}/")


if __name__ == "__main__":
    main()