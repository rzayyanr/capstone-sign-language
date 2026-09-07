// Modul pengenalan gestur (ADR-0004: client-side).
// Pipeline: kamera/frame -> MediaPipe (21 landmark) -> model MLP (TF.js) -> prediksi.
// Ticket T3/T4 mengisi implementasi. Di sini hanya kontrak/placeholder.

/**
 * Hasil prediksi satu frame.
 * @typedef {Object} Prediction
 * @property {string} gestureId   - id gestur terprediksi
 * @property {number} confidence  - skor keyakinan 0..1
 * @property {Array}  landmarks   - 21 titik landmark tangan (jika tersedia)
 */

export const recognitionModuleReady = false
