// ============================================================
// Halaman Latihan (T5): dua mode belajar
//   1. Terpandu (default) — alur linear: lihat panduan → coba di
//      kamera → dinilai benar/salah → lanjut ke huruf berikutnya.
//   2. Bebas (T4) — kamera nebak huruf apa pun yang diperagakan.
// ============================================================
import { useState, lazy, Suspense } from 'react'
import { ChalkboardTeacher, VideoCamera } from '@phosphor-icons/react'
import PracticeGuided from './PracticeGuided'

// PracticeFree memuat @mediapipe/tasks-vision; lazy supaya beratnya
// hanya diunduh saat mode Bebas benar-benar dibuka.
const PracticeFree = lazy(() => import('./PracticeFree'))

export default function PracticePage() {
  const [mode, setMode] = useState('guided') // guided | free

  return (
    <section className="practice-page">
      {/* Tab mode */}
      <div className="mode-tabs" role="tablist" aria-label="Mode latihan">
        <button
          role="tab"
          aria-selected={mode === 'guided'}
          className={'mode-tab' + (mode === 'guided' ? ' active' : '')}
          onClick={() => setMode('guided')}
        >
          <ChalkboardTeacher size={20} weight="duotone" />
          Belajar Terpandu
        </button>
        <button
          role="tab"
          aria-selected={mode === 'free'}
          className={'mode-tab' + (mode === 'free' ? ' active' : '')}
          onClick={() => setMode('free')}
        >
          <VideoCamera size={20} weight="duotone" />
          Latihan Bebas
        </button>
      </div>

      {/* Konten mode */}
      {mode === 'guided' ? (
        <PracticeGuided />
      ) : (
        <Suspense
          fallback={
            <div className="card placeholder-card" style={{ textAlign: 'center' }}>
              <p>Memuat mode latihan bebas…</p>
            </div>
          }
        >
          <PracticeFree />
        </Suspense>
      )}
    </section>
  )
}
