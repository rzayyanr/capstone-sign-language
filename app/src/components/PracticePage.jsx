// ============================================================
// Halaman Latihan: tiga mode
//   1. Terpandu (default) — alur linear: lihat panduan → coba di
//      kamera → dinilai benar/salah → lanjut ke huruf berikutnya.
//   2. Bebas (T4) — kamera nebak huruf apa pun yang diperagakan.
//   3. Kuis (T7) — uji ingatan: perintah huruf → peraga → skor +
//      daftar salah.
// ============================================================
import { useState, lazy, Suspense } from 'react'
import { ChalkboardTeacher, VideoCamera, Exam } from '@phosphor-icons/react'
import PracticeGuided from './PracticeGuided'

// PracticeFree & QuizMode memuat @mediapipe/tasks-vision; lazy supaya
// beratnya hanya diunduh saat mode tsb benar-benar dibuka.
const PracticeFree = lazy(() => import('./PracticeFree'))
const QuizMode = lazy(() => import('./QuizMode'))

export default function PracticePage() {
  const [mode, setMode] = useState('guided') // guided | free | quiz

  const lazyFallback = (
    <div className="card placeholder-card" style={{ textAlign: 'center' }}>
      <p>Memuat…</p>
    </div>
  )

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
        <button
          role="tab"
          aria-selected={mode === 'quiz'}
          className={'mode-tab' + (mode === 'quiz' ? ' active' : '')}
          onClick={() => setMode('quiz')}
        >
          <Exam size={20} weight="duotone" />
          Kuis
        </button>
      </div>

      {/* Konten mode */}
      {mode === 'guided' ? (
        <PracticeGuided />
      ) : (
        <Suspense fallback={lazyFallback}>
          {mode === 'free' ? <PracticeFree /> : <QuizMode />}
        </Suspense>
      )}
    </section>
  )
}