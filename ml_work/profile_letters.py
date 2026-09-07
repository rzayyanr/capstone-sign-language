"""
Rangkum profil geometri target per huruf (dari data kalibrasi)
untuk panduan menulis aturan feedback T6.
Threshold:
  extendedness: lurus >= 0.85, bengkok <= 0.60 (antara = ambigu)
  spread: rapat <= 12, renggang >= 60
"""
import json, math, os

DATA = os.path.join(os.path.dirname(__file__), "data", "landmarks")
LETTERS = "ABCDEFGHIKLMNOPQRSTUVWXY"
N_PER = 40
FINGERS = ["thumb", "index", "middle", "ring", "pinky"]

def dist3(a, b):
    return math.sqrt((a["x"]-b["x"])**2 + (a["y"]-b["y"])**2 + (a["z"]-b["z"])**2)

def extendedness(lm, idxs):
    base, tip = lm[idxs[0]], lm[idxs[-1]]
    straight = dist3(base, tip)
    path = sum(dist3(lm[idxs[i]], lm[idxs[i+1]]) for i in range(len(idxs)-1))
    return straight / path if path > 0 else 0

def load(letter):
    d = os.path.join(DATA, letter)
    if not os.path.isdir(d): return []
    import random
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

FINGER_IDX = {"thumb":[1,2,3,4],"index":[5,6,7,8],"middle":[9,10,11,12],"ring":[13,14,15,16],"pinky":[17,18,19,20]}
def describe(ext):
    if ext >= 0.85: return "lurus"
    if ext <= 0.60: return "bengkok"
    return "antara"

for L in LETTERS:
    samples = load(L)
    if not samples: continue
    # ekstrak per huruf
    ext_f = {f: [] for f in FINGERS}
    for lm in samples:
        for f in FINGERS:
            ext_f[f].append(extendedness(lm, FINGER_IDX[f]))
    med = {f: sorted(v)[len(v)//2] for f, v in ext_f.items()}
    print(f"{L}: " + ", ".join(f"{f}={med[f]:.2f}({describe(med[f])})" for f in FINGERS))
