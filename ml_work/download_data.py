"""
Unduh dataset landmark fingerspelling dari HuggingFace (sid220/asl-now-fingerspelling).
Setiap folder (A-Z) berisi file JSON: 1 file = 21 landmark (x,y,z) = 1 sampel, label = nama folder.

Pemakaian:
    python download_data.py
"""
import json
import os
import time
import urllib.request

BASE_API = "https://huggingface.co/api/datasets/sid220/asl-now-fingerspelling/tree/main"
BASE_RAW = "https://huggingface.co/datasets/sid220/asl-now-fingerspelling/resolve/main"
OUT_DIR = os.path.join(os.path.dirname(__file__), "data", "landmarks")
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

HEADERS = {"User-Agent": "Mozilla/5.0 (CapSL-T3)"}


def api_get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def download(url, dest):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
        f.write(r.read())


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    total = 0
    for letter in LETTERS:
        folder = os.path.join(OUT_DIR, letter)
        os.makedirs(folder, exist_ok=True)
        existing = {f for f in os.listdir(folder) if f.endswith(".json")}
        tree = api_get(f"{BASE_API}/{letter}?recursive=true")
        files = [x["path"] for x in tree if x.get("type") == "file" and x["path"].endswith(".json")]
        new_count = 0
        for path in files:
            name = os.path.basename(path)
            if name in existing:
                continue
            dest = os.path.join(folder, name)
            try:
                download(f"{BASE_RAW}/{path}", dest)
                new_count += 1
            except Exception as e:
                print(f"  gagal {path}: {e}")
            time.sleep(0.05)
        print(f"{letter}: {len(files)} file ({new_count} baru)")
        total += new_count
    print(f"\nSelesai. Total diunduh baru: {total}")


if __name__ == "__main__":
    main()
