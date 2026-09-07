"""Kalibrasi metrik jarak ujung jari (distance-based spread) utk T6.
Jarak antar ujung jari dinormalisasi thd rentang (width) tangan.
LOKASI: cari threshold rapat vs renggang dari data asli.
"""
import json, math, os, random
DATA = os.path.join(os.path.dirname(__file__), "data", "landmarks")
LETTERS = "ABCDEFGHIKLMNOPQRSTUVWXY"
N_PER = 40

FINGERS = {"thumb":1,"index":8,"middle":12,"ring":16,"pinky":20}  # ujung (tip) tiap jari

def dist3(a, b):
    return math.sqrt((a["x"]-b["x"])**2 + (a["y"]-b["y"])**2 + (a["z"]-b["z"])**2)

def hand_width(lm):
    return dist3(lm[0], lm[9])

def load(letter):
    d = os.path.join(DATA, letter)
    if not os.path.isdir(d): return []
    random.seed(42)
    fs = random.sample([f for f in os.listdir(d) if f.endswith(".json")], min(N_PER, len([f for f in os.listdir(d) if f.endswith(".json")])))
    out = []
    for f in fs:
        try:
            lm = json.load(open(os.path.join(d, f), encoding="utf-8"))
            if isinstance(lm, dict) and "landmarks" in lm: lm = lm["landmarks"]
            if len(lm) == 21: out.append(lm)
        except Exception: pass
    return out

def norm_tip_dist(lm, f1, f2):
    w = hand_width(lm)
    if w == 0: return 0
    return dist3(lm[FINGERS[f1]], lm[FINGERS[f2]]) / w

PAIRS = [("index","middle"),("middle","ring"),("ring","pinky")]
print("Metrik: jarak tip-tip / lebar tangan (thumbnail). Semakin besar = makin renggang.")
print(f"{'H':>2} " + " ".join(f"{p[0][0]}{p[1][0]:>6}" for p in PAIRS))
for L in LETTERS:
    samples = load(L)
    if not samples: continue
    vals = {p: [] for p in PAIRS}
    for lm in samples:
        for p in PAIRS:
            vals[p].append(norm_tip_dist(lm, *p))
    row = [f"{L:>2}"]
    for p in PAIRS:
        v = sorted(vals[p]); m = v[len(v)//2]
        row.append(f"{m:>7.2f}")
    print(" ".join(row))
