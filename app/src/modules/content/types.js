// Tipe data katalog gestur (ADR-0005: data-driven, multi-sistem)
export const SISTEM = {
  SIBI: 'SIBI',
  BISINDO: 'BISINDO',
}

/**
 * @typedef {Object} Gesture
 * @property {string} id        - kode unik (misal 'sibi-a', 'sibi-maaf')
 * @property {string} label     - representasi teks (huruf atau kata)
 * @property {string} sistem    - SISTEM.SIBI atau SISTEM.BISINDO
 * @property {number} jumlahTangan - 1 atau 2 (SIBI satu tangan; BISINDO dua tangan)
 * @property {string} gambar    - path gambar panduan
 * @property {string} teksLangkah - deskripsi cara membentuk gestur
 */