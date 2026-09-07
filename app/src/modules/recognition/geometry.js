// ============================================================
// Geometry Feedback Engine (T6)
//
// Menghasilkan saran perbaikan geometris berbasis 21 landmark
// tangan saat user salah membentuk huruf di Mode Belajar Terpandu.
//
// Metrik (dikalibrasi dari data landmark asli — ml_work/):
//   ext   — extendedness jari: rasio jarak pangkal→ujung / total jalur.
//   spread — jarak ujung dua jari dinormalisasi lebar tangan (dist3 tip-tip / width).
//
// Profil target per huruf diset berdasarkan distribusi data asli
// (lihat ml_work/profile_letters.py), supaya huruf yang benar TIDAK
// mendapat saran (false-positive rendah). Untuk jari berstatus 'antara'
// di data (ext 0.6–0.85), aturan memakai 'any' (tidak dicek) agar longgar.
//
// Output: daftar saran perbaikan Bahasa Indonesia (max 3).
// ============================================================

// Indeks landmark per jari (MediaPipe 21 titik)
export const FINGER_INDEX = {
  thumb: [1, 2, 3, 4],
  index: [5, 6, 7, 8],
  middle: [9, 10, 11, 12],
  ring: [13, 14, 15, 16],
  pinky: [17, 18, 19, 20],
}

const EXTENDED_THRESHOLD = 0.85
const FINGER_TIP = { index: 8, middle: 12, ring: 16, pinky: 20, thumb: 4 }

const FULL_NAME = {
  thumb: 'ibu jari',
  index: 'jari telunjuk',
  middle: 'jari tengah',
  ring: 'jari manis',
  pinky: 'jari kelingking',
}

// ---------- geometri dasar ----------

function dist3(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/** extendedness: rasio jarak pangkal→ujung / total jalur jari. ~1 lurus, <1 bengkok. */
export function fingerExtendedness(lm, finger) {
  const idxs = FINGER_INDEX[finger]
  const base = lm[idxs[0]], tip = lm[idxs[idxs.length - 1]]
  const straight = dist3(base, tip)
  let path = 0
  for (let i = 0; i < idxs.length - 1; i++) path += dist3(lm[idxs[i]], lm[idxs[i + 1]])
  return path > 0 ? straight / path : 0
}

export function isFingerExtended(lm, finger) {
  return fingerExtendedness(lm, finger) >= EXTENDED_THRESHOLD
}

/** jarak ujung dua jari dinormalisasi lebar tangan (skala-invarian). */
export function fingerSpreadDistance(lm, f1, f2) {
  const width = dist3(lm[0], lm[9])
  if (width === 0) return 0
  return dist3(lm[FINGER_TIP[f1]], lm[FINGER_TIP[f2]]) / width
}

// ---------- target per huruf (dari distribusi data asli) ----------

/**
 * fingers: jari yang DICENTANG (lurus): 'lurus' atau 'any'.
 *  (aturan hanya menegur bila jari yg harus lurus ternyata bengkok,
 *   atau menyarankan 'tekuk' utk jari yg data-nya jelas bengkok & krusial)
 * bent:  jari yang HARUS bengkok (data ext <= 0.6 stabil) → saran tekuk bila lurus.
 * spread: { pair, mode, threshold } jarak tip-tip.
 */
export const LETTER_RULES = {
  // Kepalan penuh: 4 jari bengkok + jempol di samping. Data A: semua bengkok.
  A: { fingers: {}, bent: ['index', 'middle', 'ring', 'pinky'], spread: [] },
  // 4 jari lurus rapat. Data B: index-pinky distance 0.31, variasi sampai 0.6.
  // Ciri utama B = 4 jari LURUS; spread sekunder, longgar (0.7) biar tak false-positive.
  B: { fingers: { index: 'lurus', middle: 'lurus', ring: 'lurus', pinky: 'lurus' }, bent: [], spread: [{ pair: ['index', 'pinky'], mode: 'close', threshold: 0.7 }] },
  // C: semua jari melengkung lembut (antara/lurus rendah). Cek index lurus tipis.
  C: { fingers: {}, bent: [], spread: [{ pair: ['thumb', 'index'], mode: 'open', threshold: 0.4 }] },
  // D: index lurus, 3 lain bengkok. Data D: index 1.00, middle/ring/pinky ~0.46
  D: { fingers: { index: 'lurus' }, bent: ['middle', 'ring', 'pinky'], spread: [] },
  // E: kepalan penuh (data ~0.3). Sama A.
  E: { fingers: {}, bent: ['index', 'middle', 'ring', 'pinky'], spread: [] },
  // F: "OK" di atas: index bengkok atas jempol, 3 jari lurus. Data: index 0.69, M/R/P 1.00
  F: { fingers: { middle: 'lurus', ring: 'lurus', pinky: 'lurus' }, bent: ['index'], spread: [{ pair: ['thumb', 'index'], mode: 'close', threshold: 0.5 }] },
  // G: jempol & index nunjuk, jari lain bengkok. Data G: index lurus, M/R/P antara-bengkok
  G: { fingers: { index: 'lurus' }, bent: ['middle', 'ring', 'pinky'], spread: [{ pair: ['index', 'middle'], mode: 'open', threshold: 0.5 }] },
  // H: 2 jari (index-middle) lurus rapat, ring-pinky bengkok. Data H: index-middle 1.0, R/P 0.3-0.5
  H: { fingers: { index: 'lurus', middle: 'lurus' }, bent: ['ring', 'pinky'], spread: [{ pair: ['index', 'middle'], mode: 'close', threshold: 0.35 }] },
  // I: kelingking lurus, 3 lain bengkok. Data I: pinky 1.0, I/M/R ~0.45
  I: { fingers: { pinky: 'lurus' }, bent: ['index', 'middle', 'ring'], spread: [{ pair: ['thumb', 'pinky'], mode: 'open', threshold: 0.5 }] },
  // K: index-middle lurus renggang (V ke atas), ring-pinky bengkok. Data: I/M 1.0, R/P 0.5
  K: { fingers: { index: 'lurus', middle: 'lurus' }, bent: ['ring', 'pinky'], spread: [{ pair: ['index', 'middle'], mode: 'open', threshold: 0.3 }] },
  // L: jempol+index lurus (L), 3 lain bengkok. Data: thumb 0.97, index 1.0, M/R/P bengkok
  L: { fingers: { index: 'lurus' }, bent: ['middle', 'ring', 'pinky'], spread: [{ pair: ['index', 'middle'], mode: 'open', threshold: 0.6 }] },
  // M: 3 jari bengkok (index-ring), kelingking boleh lurus (data 0.72 antara). Jempol di depan.
  M: { fingers: {}, bent: ['index', 'middle', 'ring'], spread: [] },
  // N: 2 jari bengkok (index-middle), ring & pinky longgar (data ring 0.83, pinky 0.86 ≈ threshold)
  N: { fingers: {}, bent: ['index', 'middle'], spread: [] },
  // O: semua jari melengkung membentuk O; index-middle-etc antara. Hanya cek jempol-index rapat (lingkaran).
  O: { fingers: {}, bent: [], spread: [{ pair: ['thumb', 'index'], mode: 'close', threshold: 0.6 }] },
  // P: index lurus nunjuk kiri + jempol di bawahnya; 3 jari lain antara. Data: index 1.0
  P: { fingers: { index: 'lurus' }, bent: [], spread: [{ pair: ['index', 'middle'], mode: 'open', threshold: 0.45 }] },
  // Q: jempol-index lurus ke bawah (seperti G tapi ke bawah), 3 lain bengkok
  Q: { fingers: { index: 'lurus' }, bent: ['middle', 'ring', 'pinky'], spread: [{ pair: ['index', 'middle'], mode: 'open', threshold: 0.4 }] },
  // R: index-middle lurus RAPAT (V silang), ring-pinky bengkok. Data R: I/M 1.0, R/P ~0.5
  R: { fingers: { index: 'lurus', middle: 'lurus' }, bent: ['ring', 'pinky'], spread: [{ pair: ['index', 'middle'], mode: 'close', threshold: 0.3 }] },
  // S: kepalan, jempol di depan jari (menutup). 4 jari bengkok.
  S: { fingers: {}, bent: ['index', 'middle', 'ring', 'pinky'], spread: [] },
  // T: jempol di antara telunjuk-tengah bengkok (kepal), seperti A tapi jempol silang.
  // Data T: index 0.52 & pinky 0.57 bengkok stabil; middle/ring antara (0.62-0.66) → longgar.
  T: { fingers: {}, bent: ['index', 'pinky'], spread: [] },
  // U: index-middle lurus rapat, ring-pinky bengkok. Data U: I/M 1.0
  U: { fingers: { index: 'lurus', middle: 'lurus' }, bent: ['ring', 'pinky'], spread: [{ pair: ['index', 'middle'], mode: 'close', threshold: 0.35 }] },
  // V: index-middle lurus renggang, ring-pinky bengkok. Data V: I/M 1.0, R/P 0.5
  V: { fingers: { index: 'lurus', middle: 'lurus' }, bent: ['ring', 'pinky'], spread: [{ pair: ['index', 'middle'], mode: 'open', threshold: 0.3 }] },
  // W: index-ring lurus (3 jari), pinky bengkok. Data W: I/M/R 1.0, P 0.67
  W: { fingers: { index: 'lurus', middle: 'lurus', ring: 'lurus' }, bent: ['pinky'], spread: [{ pair: ['index', 'pinky'], mode: 'open', threshold: 0.5 }] },
  // X: index bengkok kait (antara 0.83, jangan dicek lurus), 3 lain bengkok. Jempol nunjuk.
  X: { fingers: {}, bent: ['middle', 'ring', 'pinky'], spread: [] },
  // Y: jempol+kelingking lurus (Y), 3 tengah bengkok. Data Y: thumb 1.0, pinky 1.0
  Y: { fingers: { pinky: 'lurus' }, bent: ['index', 'middle', 'ring'], spread: [{ pair: ['thumb', 'pinky'], mode: 'open', threshold: 0.5 }] },
}

// ---------- analisis & saran ----------

export function analyze(targetLetter, landmarks21) {
  const rule = LETTER_RULES[targetLetter]
  if (!rule) return { ok: true, hasErrors: false, tips: [], reason: 'huruf-tidak-didukung' }

  const errors = []
  const order = ['index', 'middle', 'ring', 'pinky']

  // 1. Jari yg harus LURUS tapi bengkok
  for (const finger of order) {
    if (rule.fingers[finger] !== 'lurus') continue
    if (fingerExtendedness(landmarks21, finger) < EXTENDED_THRESHOLD) {
      errors.push(`Luruskan ${FULL_NAME[finger]} kamu.`)
    }
  }

  // 2. Jari yg harus BENGKOK (data stabil bengkok) tapi lurus
  for (const finger of rule.bent || []) {
    if (fingerExtendedness(landmarks21, finger) >= EXTENDED_THRESHOLD) {
      errors.push(`Tekuk ${FULL_NAME[finger]} kamu ke arah telapak.`)
    }
  }

  // 3. Spread (jarak ujung jari vs lebar tangan)
  for (const { pair, mode, threshold } of rule.spread || []) {
    const [f1, f2] = pair
    const d = fingerSpreadDistance(landmarks21, f1, f2)
    if (mode === 'close' && d > threshold) {
      errors.push(`Rapatkan ${FULL_NAME[f1]} dan ${FULL_NAME[f2]} agar menyatu.`)
    } else if (mode === 'open' && d < threshold) {
      errors.push(`Renggangkan ${FULL_NAME[f1]} dan ${FULL_NAME[f2]} lebih lebar.`)
    }
  }

  const tips = errors.slice(0, 3)
  return {
    ok: tips.length === 0,
    hasErrors: tips.length > 0,
    tips,
    reason: tips.length === 0 ? 'tepat' : 'geometri-beda',
  }
}