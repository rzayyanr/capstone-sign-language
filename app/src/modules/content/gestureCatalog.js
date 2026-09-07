import { SISTEM } from './types'

// Katalog gestur data-driven (ADR-0005).
// Source konten: Kamus SIBI resmi Kemendikbud (pmpk.kemdikbud.go.id/sibi).
// MVP: 24 abjad statis (A-I, K-Y) + kata dasar. J & Z (dinamis) di luar scope.
// Contoh sample kecil untuk fondasi; daftar lengkap diisi pada fase riset (T2).

export const ABJAD_STATIS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y',
]

const BUILTIN_GESTURES = [
  ...ABJAD_STATIS.map((huruf) => ({
    id: `sibi-${huruf.toLowerCase()}`,
    label: huruf,
    sistem: SISTEM.SIBI,
    jumlahTangan: 1,
    gambar: `/gambar/${huruf.toLowerCase()}.png`,
    teksLangkah: `Bentuk huruf ${huruf} sesuai panduan Kamus SIBI.`,
  })),
  // Contoh kata dasar (daftar final diisi pada T2/riset Kamus SIBI)
  { id: 'sibi-maaf', label: 'maaf', sistem: SISTEM.SIBI, jumlahTangan: 1, gambar: '/gambar/maaf.png', teksLangkah: 'Kepalkan tangan, gerakkan ke depan, geser ke kanan.' },
]

/** Ambil semua gestur untuk satu sistem isyarat. */
export function getGesturesBySystem(sistem) {
  return BUILTIN_GESTURES.filter((g) => g.sistem === sistem)
}

/** Ambil satu gestur berdasarkan id. */
export function getGestureById(id) {
  return BUILTIN_GESTURES.find((g) => g.id === id) || null
}