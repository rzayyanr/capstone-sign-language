// ============================================================
// Mode Belajar Terpandu (T5): alur linear per gestur.
//
// Fase:
//   learn   — lihat panduan huruf (gambar, langkah, tips). Kamera MATI.
//   try     — kamera nyala; user memperagakan huruf target.
//             Lulus = gestur benar ditahan HOLD_MS (5 detik) penuh.
//             Feedback "belum tepat" hanya muncul setelah tangan
//             TENANG (motion gate, anti ancang-ancang) dan salah
//             terus WRONG_MS (3 detik). Saat feedback tampil kamera
//             TETAP nyala: begitu tangan benar, otomatis lanjut
//             ke hitungan 5 detik (auto-recover).
//   success — benar; tombol lanjut ke huruf berikutnya.
//
// Grid huruf (A–Y) tersedia untuk lompat/mengulang. Kamera hanya
// aktif selama fase try; mati otomatis saat kembali ke learn/success.
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { CheckCircle, ArrowRight, ArrowCounterClockwise, Camera, Hand, CircleNotch, VideoCameraSlash, GridFour, XCircle } from '@phosphor-icons/react'
import { ABJAD_SIBI } from '../modules/content/gestureCatalog'
import { loadModel, predictLandmarks } from '../modules/recognition/mlp'
import { startCamera, drawLandmarks, VIDEO_WIDTH, VIDEO_HEIGHT } from '../modules/recognition/camera'
import { analyze } from '../modules/recognition/geometry'
import { recordSuccess } from '../modules/progress'

const STATIC_LETTERS = ABJAD_SIBI.filter((g) => g.kategori === 'abjad')
const HOLD_MS = 5000 // syarat lulus: gestur benar ditahan 5 detik penuh (waktu nyata)
const WRONG_MS = 3000 // feedback muncul setelah tangan tenang & salah terus 3 detik
const MOTION_TOLERANCE = 0.06 // gerakan rata-rata landmark/frame ≤ 6% ukuran tangan = "tenang"
const CONFIDENCE = 0.5

export default function PracticeGuided() {
  const [phase, setPhase] = useState('learn') // learn | try | success
  const [index, setIndex] = useState(0)
  const [gridOpen, setGridOpen] = useState(false)
  // info saat salah (T6): huruf terdeteksi + saran geometris (panel di dalam try)
  const [wrongInfo, setWrongInfo] = useState(null) // null | { detected, tips[] }
  const lastLmRef = useRef(null) // landmark frame terakhir utk analisis geometri
  const lastPredRef = useRef(null) // label prediksi frame terakhir
  // progres tahan 5 detik (0..HOLD_MS) utk UI hitung mundur
  const [holdMs, setHoldMs] = useState(0)
  const holdStartRef = useRef(null) // timestamp kapan streak benar mulai
  // motion gate (anti ancang-ancang) + akumulasi waktu salah
  const prevLmRef = useRef(null) // landmark frame sebelumnya utk ukur gerakan
  const wrongStartRef = useRef(null) // timestamp kapan streak "tenang+salah" mulai

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
    holdStartRef.current = null
    setHoldMs(0)
    streakRef.current = { wrong: 0, miss: 0 }
    prevLmRef.current = null
    wrongStartRef.current = null
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
  const streakRef = useRef({ wrong: 0, miss: 0 })

  // Mulai sesi coba (kamera nyala)
  async function beginTry() {
    setPhase('try')
    setCamStatus('loading')
    setCamError('')
    setHandSeen(false)
    setJudge('none')
    setHoldMs(0)
    holdStartRef.current = null
    streakRef.current = { wrong: 0, miss: 0 }
    prevLmRef.current = null
    wrongStartRef.current = null
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
      holdStartRef.current = null
      setHoldMs(0)
      // tangan lepas: bukan "tenang salah" → reset akumulasi waktu salah.
      // Panel feedback (jika sudah tampil) TETAP: baru hilang saat huruf benar.
      prevLmRef.current = null
      wrongStartRef.current = null
      s.wrong = 0
      s.miss += 1
      return
    }

    setHandSeen(true)
    s.miss = 0
    try {
      // oxlint-disable-next-line react/purity -- handleFrame = callback kamera, bukan render
      const now = performance.now()

      // ---- Motion gate: ukur gerakan tangan antar frame (anti ancang-ancang) ----
      let motion = 1 // default "bergerak" (belum ada frame pembanding)
      const prev = prevLmRef.current
      if (prev) {
        // ukuran tangan = jarak pergelangan (0) ke ujung jari tengah (12)
        const sz = Math.hypot(lms[12].x - lms[0].x, lms[12].y - lms[0].y) || 1
        let sum = 0
        for (let i = 0; i < 21; i++) {
          sum += Math.hypot(lms[i].x - prev[i].x, lms[i].y - prev[i].y)
        }
        motion = sum / 21 / sz // rata-rata perpindahan landmark relatif ukuran tangan
      }
      prevLmRef.current = lms
      const still = motion <= MOTION_TOLERANCE

      const result = predictLandmarks(flat)
      const isTarget = result.label === gesture.label
      // simpan utk analisis feedback (T6)
      lastLmRef.current = lms
      lastPredRef.current = result.label

      if (isTarget && result.confidence >= CONFIDENCE) {
        // ---- BENAR: reset semua counter salah, lanjutkan hitungan tahan 5 detik ----
        wrongStartRef.current = null
        setWrongInfo(null)
        setJudge('none')
        s.wrong = 0
        if (!holdStartRef.current) {
          holdStartRef.current = now
        }
        const elapsed = now - holdStartRef.current
        if (elapsed >= HOLD_MS) {
          // LULUS: gestur benar ditahan 5 detik penuh
          setHoldMs(HOLD_MS)
          setJudge('success')
          setPhase('success')
          trackerRef.current?.stop()
          trackerRef.current = null
          setCamStatus('off')
          // T8: catat keberhasilan (hanya huruf abjad)
          if (gesture.kategori === 'abjad') {
            recordSuccess(gesture.label)
          }
        } else {
          // bulatkan ke 100ms: nilai sama antar frame → React bailout (tak re-render)
          setHoldMs(Math.floor(elapsed / 100) * 100)
        }
      } else {
        // ---- SALAH / BUKAN TARGET ----
        // reset hitungan tahan 5 detik (syarat lulus tak terpenuhi)
        holdStartRef.current = null
        setHoldMs(0)

        if (!still) {
          // Tangan masih bergerak (ancang-ancang) → jangan dihitung salah.
          // Reset akumulasi "tenang salah": gerakan baru = mulai tenang dari nol.
          // Panel feedback (jika sudah tampil) TETAP sampai huruf benar.
          wrongStartRef.current = null
          s.wrong = 0
        } else {
          // Tangan TENANG tapi membentuk pola salah: akumulasi waktu salah.
          if (!wrongStartRef.current) wrongStartRef.current = now
          s.wrong += 1
          const wrongElapsed = now - wrongStartRef.current
          // Feedback hanya setelah WRONG_MS (3 dtk) tenang & salah terus-menerus.
          // Kamera TETAP nyala; panel hilang otomatis begitu tangan benar.
          if (wrongElapsed >= WRONG_MS && !wrongInfo) {
            setJudge('wrong')
            setWrongCount((c) => c + 1)
            const lm = lastLmRef.current
            const detected = lastPredRef.current || '?'
            const geo = lm ? analyze(gesture.label, lm) : { tips: [] }
            setWrongInfo({
              detected,
              tips: geo.tips.length ? geo.tips : ['Perhatikan posisi jari pada contoh, lalu coba lagi.'],
            })
          }
        }
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
            {camStatus === 'on' && judge === 'none' && handSeen && holdMs === 0 && (
              <p className="try-waiting">
                Mantap! Sekarang tahan posisi ini 5 detik…
              </p>
            )}
            {camStatus === 'on' && judge === 'none' && handSeen && holdMs > 0 && (
              <div className="hold-box">
                <p className="try-hold-label">
                  Pertahankan! {((HOLD_MS - holdMs) / 1000).toFixed(1)} detik lagi
                </p>
                <div className="hold-bar">
                  <div className="hold-bar-fill" style={{ width: `${(holdMs / HOLD_MS) * 100}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Panel feedback "belum tepat" (T6): muncul saat tangan tenang & salah
              terus 3 detik. Kamera TETAP nyala: begitu tangan benar, panel
              hilang otomatis dan lanjut ke hitungan 5 detik. */}
          {wrongInfo && (
            <div className="try-feedback">
              <div className="try-feedback-card">
                <div className="try-feedback-head">
                  <XCircle size={26} weight="fill" className="try-feedback-icon" />
                  <div>
                    <h4>Belum tepat untuk huruf {gesture.label}</h4>
                    <p>
                      Terdeteksi sebagai <strong>{wrongInfo.detected}</strong> — coba samakan dengan contoh.
                    </p>
                  </div>
                  <button className="link-btn" onClick={() => setPhase('learn')}>
                    Lihat panduan
                  </button>
                </div>
                <div className="try-feedback-body">
                  <img src={gesture.gambar} alt={`Contoh huruf ${gesture.label}`} className="try-feedback-img" />
                  <ul className="try-feedback-tips">
                    {wrongInfo.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* indikator privasi: kamera aktif */}
          <div className="cam-on-indicator">
            <span className="cam-dot" /> Kamera aktif — video diproses di perangkatmu
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
