// ============================================================
// Mode Belajar Terpandu (T5): alur linear per gestur.
//
// Fase:
//   learn   — lihat panduan huruf (gambar, langkah, tips). Kamera MATI.
//   try     — kamera nyala; user memperagakan huruf target.
//             Penilaian stabil: perlu N frame berturut-turut dengan
//             prediksi == target DAN confidence >= ambang, baru "benar".
//             N frame prediksi salah (bukan target) → "coba lagi".
//   success — benar; tombol lanjut ke huruf berikutnya.
//
// Grid huruf (A–Y) tersedia untuk lompat/mengulang. Kamera hanya
// aktif selama fase try; mati otomatis saat kembali ke learn/success.
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { CheckCircle, ArrowRight, ArrowCounterClockwise, Camera, Hand, CircleNotch, VideoCameraSlash, GridFour, XCircle, BookOpenText } from '@phosphor-icons/react'
import { ABJAD_SIBI } from '../modules/content/gestureCatalog'
import { loadModel, predictLandmarks } from '../modules/recognition/mlp'
import { startCamera, drawLandmarks, VIDEO_WIDTH, VIDEO_HEIGHT } from '../modules/recognition/camera'
import { analyze } from '../modules/recognition/geometry'

const STATIC_LETTERS = ABJAD_SIBI.filter((g) => g.kategori === 'abjad')
const SUCCESS_FRAMES = 8 // N frame stabil benar berturut-turut
const FAIL_FRAMES = 12 // N frame salah berturut-turut sebelum "coba lagi"
const CONFIDENCE = 0.5

export default function PracticeGuided() {
  const [phase, setPhase] = useState('learn') // learn | try | success | wrong
  const [index, setIndex] = useState(0)
  const [gridOpen, setGridOpen] = useState(false)
  // info saat salah (T6): huruf terdeteksi + saran geometris
  const [wrongInfo, setWrongInfo] = useState(null) // { detected, tips[] }
  const lastLmRef = useRef(null) // landmark frame terakhir utk analisis geometri
  const lastPredRef = useRef(null) // label prediksi frame terakhir

  const gesture = STATIC_LETTERS[index]
  const progress = ((index + 1) / STATIC_LETTERS.length) * 100

  const next = () => {
    setGridOpen(false)
    setIndex((i) => Math.min(i + 1, STATIC_LETTERS.length - 1))
    resetToLearn()
  }
  const prev = () => {
    setGridOpen(false)
    setIndex((i) => Math.max(i - 1, 0))
    resetToLearn()
  }

  // Reset fase ke learn (kamera mati) saat pindah huruf / ulang
  function resetToLearn() {
    trackerRef.current?.stop()
    trackerRef.current = null
    setCamStatus('off')
    setPhase('learn')
    setJudge('none')
    setWrongCount(0)
    setWrongInfo(null)
    lastLmRef.current = null
    lastPredRef.current = null
    streakRef.current = { correct: 0, wrong: 0, miss: 0 }
  }

  // ===== fase try: logika kamera + penilaian =====
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const trackerRef = useRef(null)
  const [camStatus, setCamStatus] = useState('off') // off | loading | on | error
  const [camError, setCamError] = useState('')
  const [handSeen, setHandSeen] = useState(false)
  const [judge, setJudge] = useState('none') // none | success | wrong
  const [wrongCount, setWrongCount] = useState(0)

  // ref penilaian (dibaca di callback frame tanpa re-render)
  const streakRef = useRef({ correct: 0, wrong: 0, miss: 0 })

  // Mulai sesi coba (kamera nyala)
  async function beginTry() {
    setPhase('try')
    setCamStatus('loading')
    setCamError('')
    setHandSeen(false)
    setJudge('none')
    streakRef.current = { correct: 0, wrong: 0, miss: 0 }
    try {
      await loadModel()
      const tracker = await startCamera({
        video: videoRef.current,
        onFrame: handleFrame,
        onError: (msg) => {
          setCamStatus('error')
          setCamError(msg)
        },
      })
      trackerRef.current = tracker
      setCamStatus('on')
    } catch (e) {
      setCamStatus('error')
      setCamError(
        e?.name === 'NotAllowedError'
          ? 'Izin kamera ditolak. Izinkan akses kamera di browser, lalu coba lagi.'
          : e?.name === 'NotFoundError'
            ? 'Kamera tidak ditemukan di perangkat ini.'
            : 'Tidak bisa mengakses kamera: ' + (e?.message || e)
      )
    }
  }

  // ===== proses tiap frame (fase try) =====
  function handleFrame(flat, lms) {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawLandmarks(ctx, lms, canvas.width, canvas.height)
    }
    const s = streakRef.current

    if (!flat) {
      setHandSeen(false)
      s.correct = 0
      s.wrong = 0
      s.miss += 1
      return
    }

    setHandSeen(true)
    s.miss = 0
    try {
      const result = predictLandmarks(flat)
      const isTarget = result.label === gesture.label
      // simpan utk analisis feedback (T6)
      lastLmRef.current = lms
      lastPredRef.current = result.label

      if (isTarget && result.confidence >= CONFIDENCE) {
        s.correct += 1
        s.wrong = 0
      } else {
        s.correct = 0
        s.wrong += 1
      }

      // Penilaian stabil: N frame benar berturut-turut
      if (s.correct >= SUCCESS_FRAMES) {
        setJudge('success')
        setPhase('success')
        trackerRef.current?.stop()
        trackerRef.current = null
        setCamStatus('off')
      } else if (s.wrong >= FAIL_FRAMES) {
        setJudge('wrong')
        setWrongCount((c) => c + 1)
        // Feedback cerdas (T6): tampilkan huruf terdeteksi + saran geometris
        // + contoh benar. User bisa langsung coba lagi dari sini.
        trackerRef.current?.stop()
        trackerRef.current = null
        setCamStatus('off')
        const lm = lastLmRef.current
        const detected = lastPredRef.current || '?'
        const geo = lm ? analyze(gesture.label, lm) : { tips: [] }
        setWrongInfo({
          detected,
          tips: geo.tips.length ? geo.tips : ['Perhatikan posisi jari pada contoh, lalu coba lagi.'],
        })
        setPhase('wrong')
      }
    } catch {
      // frame tidak valid; lewati
    }
  }

  // Hentikan kamera saat komponen dilepas / pindah gestur
  useEffect(() => {
    return () => {
      trackerRef.current?.stop()
      trackerRef.current = null
    }
  }, [])

  // Saat pindah huruf via tombol next/prev, grid tertutup
  const jumpTo = (label) => {
    const idx = STATIC_LETTERS.findIndex((g) => g.label === label)
    if (idx >= 0) {
      resetToLearn()
      setIndex(idx)
      setGridOpen(false)
    }
  }

  // ============ RENDER ============
  return (
    <section className="guided">
      {/* Progress bar */}
      <div className="guided-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">
          {index + 1} / {STATIC_LETTERS.length}
        </span>
      </div>

      {/* Toolbar: prev/next + grid */}
      <div className="guided-toolbar">
        <button className="icon-btn" onClick={prev} aria-label="Huruf sebelumnya" disabled={index === 0}>
          ←
        </button>
        <button className="grid-btn" onClick={() => setGridOpen((o) => !o)}>
          <GridFour size={18} weight="duotone" /> Semua Huruf
        </button>
        <button className="icon-btn" onClick={next} aria-label="Huruf berikutnya" disabled={index === STATIC_LETTERS.length - 1}>
          →
        </button>
      </div>

      {/* Grid lompat huruf */}
      {gridOpen && (
        <div className="guided-grid">
          {STATIC_LETTERS.map((g) => (
            <button
              key={g.id}
              className={'grid-letter' + (g.label === gesture.label ? ' current' : '')}
              onClick={() => jumpTo(g.label)}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {/* FASE LEARN: lihat panduan (kamera mati) */}
      {phase === 'learn' && (
        <div className="guided-learn">
          <div className="learn-card">
            <div className="learn-visual">
              <div className="detail-img-box learn-img-box">
                <img src={gesture.gambar} alt={`Panduan huruf ${gesture.label}`} />
              </div>
              <span className="learn-letter">{gesture.label}</span>
            </div>
            <div className="learn-body">
              <h3>Cara membentuk huruf {gesture.label}</h3>
              <p className="learn-summary">{gesture.ringkasan}</p>
              <ol className="learn-steps">
                {gesture.teksLangkah.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <p className="learn-tip">
                <strong>Tips:</strong> {gesture.tipsGeometri}
              </p>
              {wrongCount > 0 && (
                <p className="learn-feedback">
                  Belum tepat, yuk coba lagi. Perhatikan posisi jari lalu bentuk pelan-pelan.
                </p>
              )}
              <button className="btn-primary cta-try" onClick={beginTry}>
                <Camera size={20} weight="fill" /> Coba di Kamera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE TRY: kamera aktif + penilaian */}
      {phase === 'try' && (
        <div className="guided-try">
          <div className="try-target">
            <span className="try-target-label">Bentuk huruf ini:</span>
            <span className="try-target-letter">{gesture.label}</span>
            <button className="link-btn" onClick={() => setPhase('learn')} style={{ marginLeft: 'auto' }}>
              Lihat panduan
            </button>
          </div>

          <div className="video-wrap try-video-wrap">
            <video ref={videoRef} width={VIDEO_WIDTH} height={VIDEO_HEIGHT} muted playsInline className="video-el" />
            <canvas ref={canvasRef} width={VIDEO_WIDTH} height={VIDEO_HEIGHT} className="video-overlay" />

            {camStatus === 'loading' && (
              <div className="video-status">
                <CircleNotch className="spin" size={40} weight="duotone" />
                <p>Menyiapkan kamera…</p>
              </div>
            )}
            {camStatus === 'error' && (
              <div className="video-status error">
                <VideoCameraSlash size={40} weight="duotone" />
                <p>{camError}</p>
              </div>
            )}
            {camStatus === 'on' && !handSeen && (
              <div className="video-hint">
                <Hand size={22} weight="fill" />
                Bentuk huruf {gesture.label} di depan kamera
              </div>
            )}
          </div>

          <div className="try-status">
            {camStatus === 'on' && judge === 'none' && (
              <p className="try-waiting">
                Tahan posisi tanganmu… (butuh beberapa detik agar stabil)
              </p>
            )}
          </div>

          {/* indikator privasi: kamera aktif */}
          <div className="cam-on-indicator">
            <span className="cam-dot" /> Kamera aktif — video diproses di perangkatmu
          </div>
        </div>
      )}

      {/* FASE WRONG (T6): feedback cerdas — huruf terdeteksi + saran geometris + contoh benar */}
      {phase === 'wrong' && wrongInfo && (
        <div className="guided-wrong">
          <div className="wrong-card">
            <div className="wrong-head">
              <XCircle size={44} weight="fill" className="wrong-icon" />
              <div>
                <h3>Belum tepat untuk huruf {gesture.label}</h3>
                <p className="wrong-detected">
                  Terdeteksi sebagai <strong>{wrongInfo.detected}</strong> — hampir! Bandingkan dengan contoh & saran di bawah.
                </p>
              </div>
            </div>

            <div className="wrong-compare">
              {/* Contoh benar: gambar statis */}
              <div className="wrong-example">
                <span className="wrong-example-label">Contoh huruf {gesture.label}</span>
                <img src={gesture.gambar} alt={`Contoh huruf ${gesture.label}`} className="wrong-example-img" />
              </div>
              {/* Saran perbaikan */}
              <div className="wrong-tips">
                <span className="wrong-tips-label">Yang perlu diperbaiki</span>
                <ul>
                  {wrongInfo.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="wrong-actions">
              <button className="btn-secondary" onClick={resetToLearn}>
                <BookOpenText size={18} /> Lihat Panduan
              </button>
              <button className="btn-primary" onClick={beginTry}>
                <Camera size={18} weight="fill" /> Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FASE SUCCESS: benar! */}
      {phase === 'success' && (
        <div className="guided-success">
          <div className="success-card">
            <CheckCircle size={64} weight="fill" className="success-icon" />
            <h3>Benar! Kamu membentuk huruf {gesture.label}</h3>
            <p>Hebat, lanjut ke huruf berikutnya.</p>
            <div className="success-actions">
              <button className="btn-secondary" onClick={() => jumpTo(gesture.label)}>
                <ArrowCounterClockwise size={18} /> Ulangi
              </button>
              <button
                className="btn-primary"
                onClick={() => (index < STATIC_LETTERS.length - 1 ? (next(), setPhase('learn')) : null)}
                disabled={index === STATIC_LETTERS.length - 1}
              >
                {index < STATIC_LETTERS.length - 1 ? (
                  <>
                    Lanjut ke {STATIC_LETTERS[index + 1].label} <ArrowRight size={18} weight="bold" />
                  </>
                ) : (
                  'Selesai!'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
