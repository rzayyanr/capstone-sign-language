"""
Kalibrasi fitur geometri utk T6 (feedback cerdas).
Hitung statistik per huruf: extendedness tiap jari + spread antar jari,
utk menyetel threshold klasifikasi jari lurus/bengkok & rapat/renggang.
Pakai data landmark asli dari ml_work/data/landmarks/{A..Y}.
"""
import json, math, os, random

DATA = os.path.join(os.path.dirname(__file__), "data", "landmarks")
LETTERS = "ABCDEFGHIKLMNOPQRSTUVWXY"  # 24 statis
N_PER = 40

# index landmark per jari (MediaPipe 21 titik)
FINGERS = {
    "thumb":  [1, 2, 3, 4],
    "index":  [5, 6, 7, 8],
    "middle": [9, 10, 11, 12],
    "ring":   [13, 14, 15, 16],
    "pinky":  [17, 18, 19, 20],
}

def dist3(a, b):
    return math.sqrt((a["x"]-b["x"])**2 + (a["y"]-b["y"])**2 + (a["z"]-b["z"])**2)

def extendedness(lm, idxs):
    """ratio jarak pangkal->ujung / total jalur. ~1 lurus, <1 bengkok."""
    base, tip = lm[idxs[0]], lm[idxs[-1]]
    straight = dist3(base, tip)
    path = sum(dist3(lm[idxs[i]], lm[idxs[i+1]]) for i in range(len(idxs)-1))
    return straight / path if path > 0 else 0

def spread_deg(lm, f1, f2):
    """sudut antara vektor pangkal->ujung dua jari (derajat)."""
    a = lm[FINGERS[f1][0]]; b = lm[FINGERS[f1][-1]]
    c = lm[FINGERS[f2][0]]; d = lm[FINGERS[f2][-1]]
    v1 = (b["x"]-a["x"], b["y"]-a["y"], b["z"]-a["z"])
    v2 = (d["x"]-c["x"], d["y"]-c["y"], d["z"]-c["z"])
    n1 = math.sqrt(sum(x*x for x in v1)); n2 = math.sqrt(sum(x*x for x in v2))
    if n1 == 0 or n2 == 0: return 0
    dot = sum(v1[i]*v2[i] for i in range(3))
    cosv = max(-1, min(1, dot/(n1*n2)))
    return math.degrees(math.acos(cosv))

def load_samples(letter):
    d = os.path.join(DATA, letter)
    if not os.path.isdir(d): return []
    files = [f for f in os.listdir(d) if f.endswith(".json")]
    random.seed(42)
    files = random.sample(files, min(N_PER, len(files)))
    out = []
    for f in files:
        try:
            lm = json.load(open(os.path.join(d, f), encoding="utf-8"))
            if isinstance(lm, dict) and "landmarks" in lm:
                lm = lm["landmarks"]
            if len(lm) == 21: out.append(lm)
        except Exception:
            pass
    return out

def stats(vals):
    m = sum(vals)/len(vals)
    sd = math.sqrt(sum((v-m)**2 for v in vals)/len(vals)) if len(vals) > 1 else 0
    return m, sd

print(f"{'H':>2} " + " ".join(f"{f:>6}" for f in FINGERS) + " " +
      " ".join(f"{p:>6}" for p in ["sp-IM", "sp-MR", "sp-RP"]))
for L in LETTERS:
    samples = load_samples(L)
    if not samples:
        print(f"{L:>2} no-data"); continue
    ext = {f: [] for f in FINGERS}
    sp = {"IM": [], "MR": [], "RP": []}
    for lm in samples:
        for f, idxs in FINGERS.items():
            ext[f].append(extendedness(lm, idxs))
        sp["IM"].append(spread_deg(lm, "index", "middle"))
        sp["MR"].append(spread_deg(lm, "middle", "ring"))
        sp["RP"].append(spread_deg(lm, "ring", "pinky"))
    row = [f"{L:>2}"]
    for f in FINGERS:
        m, sd = stats(ext[f]); row.append(f"{m:.2f}±{sd:.2f}")
    for k in ["IM", "MR", "RP"]:
        m, sd = stats(sp[k]); row.append(f"{m:>4.0f}±{sd:.0f}")
    print(" ".join(row))
