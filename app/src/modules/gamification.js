// ============================================================
// Gamifikasi: XP & streak harian (gaya Duolingo)
//
// Menyimpan di localStorage kunci "isyarat-gamification-v1":
//   {
//     xp: number,          // total XP terkumpul (tidak pernah turun)
//     streak: number,      // hari belajar beruntun saat ini
//     bestStreak: number,  // rekor streak terpanjang
//     lastActiveDate: string, // tanggal terakhir belajar 'YYYY-MM-DD' (lokal)
//   }
//
// Aturan (keputusan user):
//   - 1 huruf benar (Terpandu/Kuis) = +10 XP
//   - Streak hari: naik bila belajar hari ini & kemarin; bolong 1 hari
//     → balik ke 1 (belajar hari ini setelah bolong = streak 1)
//   - Belajar 2x di hari yang sama: XP tetap bertambah, streak tidak dobel
// ============================================================

const STORAGE_KEY = 'isyarat-gamification-v1'
export const XP_PER_CORRECT = 10

const listeners = new Set()

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function defaultState() {
  return { xp: 0, streak: 0, bestStreak: 0, lastActiveDate: null }
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    // pastikan semua field ada (data lama/partial)
    return { ...defaultState(), ...parsed }
  } catch {
    return defaultState()
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage penuh / tidak tersedia: lewati diam-diam
  }
  listeners.forEach((fn) => fn())
}

function emit() {
  listeners.forEach((fn) => fn())
}

/** Ambil state gamifikasi saat ini. */
export function getGamification() {
  return readStorage()
}

/** Catat 1 huruf benar: +10 XP, update streak harian. */
export function recordCorrect() {
  const s = readStorage()
  const today = todayStr()
  const yesterday = yesterdayStr()

  const xp = s.xp + XP_PER_CORRECT

  let streak = s.streak
  if (s.lastActiveDate === today) {
    // sudah belajar hari ini: streak tetap, XP bertambah
  } else if (s.lastActiveDate === yesterday) {
    streak = s.streak + 1 // lanjut beruntun
  } else {
    streak = 1 // bolong / pertama kali
  }

  const bestStreak = Math.max(s.bestStreak, streak)

  writeStorage({
    xp,
    streak,
    bestStreak,
    lastActiveDate: today,
  })
}

/** Hapus data gamifikasi (dipakai tombol reset progres). */
export function resetGamification() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // abaikan
  }
  emit()
}

/** Daftarkan listener; kembalikan fungsi utk berhenti mendengar. */
export function subscribeGamification(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
