// ============================================================
// Progres & penguasaan (T8)
//
// Menyimpan status penguasaan per huruf abjad SIBI di localStorage.
// Aturan (keputusan user):
//   - Dicatat hanya dari mode Belajar Terpandu & Kuis (yang punya target)
//   - Cakupan: 24 huruf abjad statis (A-I, K-Y)
//   - Dikuasai (mastered) setelah benar 3x BERTURUT-TURUT
//   - Salah / gagal → streak huruf itu balik ke 0
//
// Data disimpan dgn kunci "isyarat-progress-v1":
//   {
//     [label]: { streak: number, mastered: boolean, updatedAt: number },
//     ...
//   }
// ============================================================

const STORAGE_KEY = 'isyarat-progress-v1'
export const MASTERY_STREAK = 3

// Kumpulan listener agar UI (halaman Progres) bisa re-render saat data berubah
const listeners = new Set()

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage penuh / tidak tersedia: lewati diam-diam
  }
  // beri tahu UI (halaman Progres) bahwa data berubah
  listeners.forEach((fn) => fn())
}

function emit() {
  listeners.forEach((fn) => fn())
}

/** Ambil seluruh data progres (objek { [label]: {streak, mastered, updatedAt} }). */
export function getProgress() {
  return readStorage()
}

/** Ambil status satu huruf; kembalikan default bila belum pernah dicoba. */
export function getLetterProgress(label) {
  const data = readStorage()
  return (
    data[label] || {
      streak: 0,
      mastered: false,
      updatedAt: null,
    }
  )
}

/** Catat keberhasilan membentuk huruf (hanya dipanggil utk huruf abjad). */
export function recordSuccess(label) {
  const data = readStorage()
  const cur = data[label] || { streak: 0, mastered: false, updatedAt: null }
  const nextStreak = cur.streak + 1
  const mastered = cur.mastered || nextStreak >= MASTERY_STREAK
  data[label] = {
    streak: nextStreak,
    mastered,
    updatedAt: Date.now(),
  }
  writeStorage(data)
}

/** Catat kegagalan membentuk huruf: streak balik ke 0 (mastered tetap dipertahankan). */
export function recordFailure(label) {
  const data = readStorage()
  const cur = data[label]
  if (!cur) return // belum pernah dicoba: tidak perlu dicatat
  if (cur.streak === 0 && !cur.mastered) return
  data[label] = {
    streak: 0,
    mastered: cur.mastered, // tetap dikuasai walau sekali salah setelahnya
    updatedAt: Date.now(),
  }
  writeStorage(data)
}

/** Hapus seluruh progres (tombol reset di halaman Progres). */
export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // abaikan
  }
  emit()
}

/** Daftarkan listener; kembalikan fungsi utk berhenti mendengar. */
export function subscribeProgress(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Ringkasan cepat utk halaman Progres. */
export function getSummary(letters) {
  const data = readStorage()
  let mastered = 0
  let tried = 0
  const perLetter = letters.map((l) => {
    const p = data[l.label] || { streak: 0, mastered: false, updatedAt: null }
    if (p.mastered) mastered += 1
    if (p.streak > 0 || p.mastered || p.updatedAt) tried += 1
    return { label: l.label, ...p }
  })
  return { mastered, tried, total: letters.length, perLetter }
}
