"""
Ekstrak bobot & bias dari model MLP scikit-learn (artifact/model.pkl) ke file JSON
yang bisa dimuat langsung oleh TensorFlow.js / net JS di browser.

Model kita: MLPClassifier(hidden_layer_sizes=(128,64), activation='relu').
Struktur:
  input(63) -> [dense 128 + relu] -> [dense 64 + relu] -> [dense 24 softmax]

Output: artifact/model.json = { weights: [...], biases: [...], classes: [...], input_scale, ... }

Pemakaian:
    python export_model.py
"""
import json
import os
import pickle

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(HERE, "artifact", "model.pkl")
OUT_PATH = os.path.join(
    os.path.dirname(HERE),  # naik ke root repo
    "app", "src", "modules", "recognition", "model.json",
)


def main():
    if not os.path.exists(MODEL_PATH):
        print(f"Model tidak ditemukan: {MODEL_PATH}")
        print("Jalankan dulu: python train.py")
        return
    with open(MODEL_PATH, "rb") as f:
        bundle = pickle.load(f)

    model = bundle["model"]        # Sklearn MLPClassifier
    scaler = bundle["scaler"]      # StandardScaler
    classes = bundle["classes"]    # list huruf

    # Bobot (coefs_) & bias (intercepts_) per layer, dari layer pertama ke terakhir
    weights = [w.tolist() for w in model.coefs_]
    biases = [b.tolist() for b in model.intercepts_]

    out = {
        "architecture": "MLP",
        "activation": "relu",
        "output_activation": "softmax",
        "layers": [{"in": w.shape[0], "out": w.shape[1]} for w in model.coefs_],
        "weights": weights,
        "biases": biases,
        "classes": [str(c) for c in classes],
        # StandardScaler parameter untuk normalisasi input
        "scaler": {
            "mean": scaler.mean_.tolist(),
            "scale": scaler.scale_.tolist(),
        },
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f)
    print(f"Model diekspor ke {OUT_PATH}")
    print(f"  Layers: {out['layers']}")
    print(f"  Kelas: {''.join(out['classes'])}")
    print(f"  Total bobot: {sum(len(w) for li in weights for w in li)}")


if __name__ == "__main__":
    main()