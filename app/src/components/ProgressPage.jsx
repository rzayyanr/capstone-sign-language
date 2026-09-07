// ============================================================
// Halaman Progres & Penguasaan (T8)
//
// Menampilkan status penguasaan 24 huruf abjad dari localStorage:
//   - Ringkasan: X/24 dikuasai (+ progress bar)
//   - Grid huruf: hijau = dikuasai, kuning = streak 1-2, abu = belum
//   - Daftar "masih lemah": pernah dicoba belum dikuasai
//   - Tombol reset (konfirmasi)
//
// Live update: subscribe ke perubahan progres (recordSuccess panggil
// listener) sehingga halaman ini segar setiap kali dikunjungi.
// ============================================================
import { useState, useEffect, useMemo } from 'react'
import { ChartBar, CheckCircle, Trash, Medal, TrendUp } from '@phosphor-icons/react'
import { ABJAD_SIBI } from '../modules/content/gestureCatalog'
import { getSummary, resetProgress, subscribeProgress, MASTERY_STREAK } from '../modules/progress'

export default function ProgressPage({ onOpenGesture }) {
  const [, setTick] = useState(0) // dipakai utk memicu re-render saat data berubah
  const [confirmReset, setConfirmReset] = useState(false)

  const letters = useMemo(() => ABJAD_SIBI.filter((g) => g.kategori === 'abjad'), [])

  // Segarkan saat data progres berubah (dari mode lain) / saat halaman dibuka
  useEffect(() => {
    const unsub = subscribeProgress(() => setTick((t) => t + 1))
    return unsub
  }, [])

  // getSummary dihitung tiap render; data kecil & murah, dan tick memicu re-render
  const summary = getSummary(letters)
  const masteredCount = summary.mastered
  const pct = Math.round((masteredCount / letters.length) * 100)

  const weakLetters = summary.perLetter.filter(
    (p) => !p.mastered && (p.streak > 0 || p.updatedAt)
  )
  const untouched = summary.perLetter.filter((p) => !p.mastered && !p.streak && !p.updatedAt)

  function handleReset() {
    resetProgress()
    setConfirmReset(false)
  }

  return (
    <section className="page-section progress-page">
      <div className="page-head">
        <h2>Progres & Penguasaan</h2>
        <p className="page-desc">
          Huruf dikuasai setelah benar {MASTERY_STREAK}x berturut-turut (dari Belajar Terpandu
          atau Kuis). Tersimpan di browser kamu.
        </p>
      </div>

      {/* RINGKASAN */}
      <div className="card progress-summary-card">
        <div className="progress-summary-top">
          <div className="progress-summary-num">
            <strong>{masteredCount}</strong>
            <span>/ {letters.length} huruf dikuasai</span>
          </div>
          <div className="progress-summary-badge">
            <Medal size={20} weight="fill" />
            {pct}%
          </div>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        {masteredCount === letters.length ? (
          <p className="progress-congrats">
            <CheckCircle size={18} weight="fill" /> Semua huruf dikuasai. Hebat!
          </p>
        ) : (
          <p className="progress-hint">
            {weakLetters.length > 0
              ? `${weakLetters.length} huruf masih berjalan (streak 1-2). Lanjutkan latihan untuk menguasainya.`
              : 'Belum ada progres. Mulai dari Belajar Terpandu atau Kuis untuk mengisi halaman ini.'}
          </p>
        )}
      </div>

      {/* GRID HURUF */}
      <div className="card progress-grid-card">
        <h3 className="progress-section-title">
          <TrendUp size={20} weight="fill" /> Status per Huruf
        </h3>
        <div className="progress-grid">
          {summary.perLetter.map((p) => {
            const cls = p.mastered
              ? 'mastered'
              : p.streak > 0
              ? 'partial'
              : 'untouched'
            return (
              <button
                key={p.label}
                className={`progress-tile ${cls}`}
                onClick={() => onOpenGesture?.(ABJAD_SIBI.find((g) => g.label === p.label))}
                title={
                  p.mastered
                    ? `${p.label}: dikuasai`
                    : p.streak > 0
                    ? `${p.label}: streak ${p.streak}/${MASTERY_STREAK}`
                    : `${p.label}: belum dicoba`
                }
              >
                <span className="progress-tile-letter">{p.label}</span>
                <span className="progress-tile-status">
                  {p.mastered ? (
                    <CheckCircle size={14} weight="fill" />
                  ) : p.streak > 0 ? (
                    `${p.streak}/${MASTERY_STREAK}`
                  ) : (
                    '·'
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* MASIH LEMAH */}
      {weakLetters.length > 0 && (
        <div className="card progress-weak-card">
          <h3 className="progress-section-title">
            <TrendUp size={20} weight="fill" /> Masih Berjalan
          </h3>
          <p className="progress-weak-sub">
            Sudah pernah benar, tapi belum {MASTERY_STREAK}x berturut-turut.
          </p>
          <div className="progress-weak-list">
            {weakLetters.map((p) => (
              <button
                key={p.label}
                className="progress-weak-chip"
                onClick={() => onOpenGesture?.(ABJAD_SIBI.find((g) => g.label === p.label))}
              >
                <strong>{p.label}</strong>
                <span>
                  {p.streak}/{MASTERY_STREAK}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BELUM DICoba */}
      {untouched.length > 0 && (
        <div className="card progress-untouched-card">
          <h3 className="progress-section-title">
            <ChartBar size={20} weight="fill" /> Belum Dicoba
          </h3>
          <div className="progress-untouched-list">
            {untouched.map((p) => (
              <button
                key={p.label}
                className="progress-untouched-chip"
                onClick={() => onOpenGesture?.(ABJAD_SIBI.find((g) => g.label === p.label))}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESET */}
      <div className="progress-reset-row">
        {confirmReset ? (
          <div className="progress-reset-confirm">
            <span>Hapus semua progres? Tindakan ini tidak bisa dibatalkan.</span>
            <button className="btn-danger" onClick={handleReset}>
              <Trash size={16} /> Ya, hapus
            </button>
            <button className="btn-secondary" onClick={() => setConfirmReset(false)}>
              Batal
            </button>
          </div>
        ) : (
          <button className="btn-ghost-danger" onClick={() => setConfirmReset(true)}>
            <Trash size={16} /> Reset Progres
          </button>
        )}
      </div>
    </section>
  )
}
