// ============================================================
// Mode Kuis (T7): menguji ingatan dengan skor + daftar salah
//
// Alur:
//   1. Setup: pilih "Mulai Kuis" (10 soal acak dari 24 huruf) atau
//      "Ulangi Huruf yang Salah" (hanya huruf yg gagal di sesi
//      sebelumnya).
//   2. Per soal: target huruf tampil besar (tanpa panduan) → user
//      peraga di kamera → dinilai dengan mesin yg SAMA dgn mode
//      Belajar (tahan 5 dtk benar / tenang 3 dtk salah / motion gate).
//   3. Benar → lanjut soal berikutnya. Salah (setelah 3 detik tenang
//      & salah terus) → 1 kegagalan + panel feedback, lalu tombol
//      "Lanjut" ke soal berikutnya.
//   4. Selesai → skor + daftar huruf yg salah utk diulang.
// ============================================================
import { useEffect, useRef, useState } from 'react'
import {
  ChalkboardTeacher, ArrowRight, Camera, Hand, CircleNotch, VideoCameraSlash,
  XCircle, CheckCircle, ArrowCounterClockwise, Sparkle,
} from '@phosphor-icons/react'
import { ABJAD_SIBI } from '../modules/content/gestureCatalog'
import { loadModel, predictLandmarks } from '../modules/recognition/mlp'
import { startCamera, drawLandmarks, VIDEO_WIDTH, VIDEO_HEIGHT } from '../modules/recognition/camera'
import { analyze } from '../modules/recognition/geometry'

const STATIC_LETTERS = ABJAD_SIBI.filter((g) => g.kategori === 'abjad')
const HOLD_MS = 5000 // lulus: tahan gestur benar 5 detik
const WRONG_MS = 3000 // feedback setelah tenang & salah terus 3 dtk
const MOTION_TOLERANCE = 0.06 // gerakan rata-rata landmark/frame = "tenang"
const CONFIDENCE = 0.5
const QUIZ_SIZE = 10 // 10 soal acak dari 24 huruf

// ==================== state ====================
export default function QuizMode() {
  // screens: 'setup' | 'quiz' | 'result'
  const [screen, setScreen] = useState('setup')
  const [questions, setQuestions] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongList, setWrongList] = useState([])
  const [wrongInfo, setWrongInfo] = useState(null)
  const [camStatus, setCamStatus] = useState('off')
  const [camError, setCamError] = useState('')
  const [handSeen, setHandSeen] = useState(false)
  const [holdMs, setHoldMs] = useState(0)
  const [transition, setTransition] = useState(null) // null | {type:'correct', label}

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const trackerRef = useRef(null)
  const streakRef = useRef({ wrong: 0, miss: 0 })
  const prevLmRef = useRef(null)
  const wrongStartRef = useRef(null)
  const holdStartRef = useRef(null)
  const lastLmRef = useRef(null)
  const lastPredRef = useRef(null)
  const transitionTimerRef = useRef(null)
  const wrongAnsweredRef = useRef(false)
  const wrongTimerRef = useRef(null)

  const current = questions[qIndex]
  const isLast = qIndex === questions.length - 1

  // ============ mulai kuis ============
  function startQuiz(withWrongOnly) {
    let pool = STATIC_LETTERS
    if (withWrongOnly && wrongList.length) {
      pool = STATIC_LETTERS.filter((g) => wrongList.includes(g.label))
    }
    const size = withWrongOnly && wrongList.length ? pool.length : Math.min(QUIZ_SIZE, STATIC_LETTERS.length)
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, size)
    setQuestions(shuffled)
    setQIndex(0)
    setCorrectCount(0)
    setWrongList(withWrongOnly ? wrongList : [])
    setWrongInfo(null)
    setScreen('quiz')
    resetPenilaian()
  }

  // reset state penilaian (kamera tetap nyala)
  function resetPenilaian() {
    setHandSeen(false)
    setHoldMs(0)
    holdStartRef.current = null
    prevLmRef.current = null
    wrongStartRef.current = null
    streakRef.current = { wrong: 0, miss: 0 }
    setWrongInfo(null)
    wrongAnsweredRef.current = false
    if (wrongTimerRef.current) {
      clearTimeout(wrongTimerRef.current)
      wrongTimerRef.current = null
    }
  }

  // hentikan kamera penuh (saat selesai / keluar)
  function stopCamera() {
    trackerRef.current?.stop()
    trackerRef.current = null
    setCamStatus('off')
    if (wrongTimerRef.current) {
      clearTimeout(wrongTimerRef.current)
      wrongTimerRef.current = null
    }
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = null
    }
  }

  async function beginTry() {
    setCamStatus('loading')
    setCamError('')
    setHandSeen(false)
    setHoldMs(0)
    holdStartRef.current = null
    streakRef.current = { wrong: 0, miss: 0 }
    if (camStatus !== 'on') {
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
            : 'Tidak bisa mengakses kamera: ' + (e?.message || e)
        )
      }
    }
  }

  // ============ penilaian frame (sama dgn mode Belajar) ============
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
      // motion gate (anti ancang-ancang)
      let motion = 1
      const prev = prevLmRef.current
      if (prev) {
        const sz = Math.hypot(lms[12].x - lms[0].x, lms[12].y - lms[0].y) || 1
        let sum = 0
        for (let i = 0; i < 21; i++) sum += Math.hypot(lms[i].x - prev[i].x, lms[i].y - prev[i].y)
        motion = sum / 21 / sz
      }
      prevLmRef.current = lms
      const still = motion <= MOTION_TOLERANCE

      const result = predictLandmarks(flat)
      const isTarget = result.label === current.label
      lastLmRef.current = lms
      lastPredRef.current = result.label

      if (isTarget && result.confidence >= CONFIDENCE) {
        // BENAR → tahan 5 detik utk lulus
        wrongStartRef.current = null
        setWrongInfo(null)
        s.wrong = 0
        if (!holdStartRef.current) holdStartRef.current = now
        const elapsed = now - holdStartRef.current
        if (elapsed >= HOLD_MS) {
          setHoldMs(HOLD_MS)
          finishQuestion(true)
        } else {
          setHoldMs(Math.floor(elapsed / 100) * 100)
        }
      } else {
        // (BUKAN target) / gerak → reset hitungan tahan
        holdStartRef.current = null
        setHoldMs(0)
        if (!still) {
          // masih bergerak: jangan dihitung salah
          wrongStartRef.current = null
          s.wrong = 0
        } else {
          // tenang & salah terus: akumulasi 3 detik → feedback
          if (!wrongStartRef.current) wrongStartRef.current = now
          s.wrong += 1
          const wrongElapsed = now - wrongStartRef.current
          if (wrongElapsed >= WRONG_MS && !wrongInfo) {
            const lm = lastLmRef.current
            const detected = lastPredRef.current || '?'
            const geo = lm ? analyze(current.label, lm) : { tips: [] }
            setWrongInfo({
              detected,
              tips: geo.tips.length ? geo.tips : ['Perhatikan posisi jari pada contoh, lalu coba lagi.'],
            })
            // 1 percobaan per soal: catat kegagalan & lanjut otomatis
            if (!wrongAnsweredRef.current) {
              wrongAnsweredRef.current = true
              wrongTimerRef.current = setTimeout(() => {
                finishQuestion(false)
                goNextAfterWrong()
              }, 3500)
            }
          }
        }
      }
    } catch {
      // frame tidak valid; lewati
    }
  }

  function finishQuestion(success) {
    const newWrong = success ? wrongList : [...new Set([...wrongList, current.label])]
    const newCorrect = success ? correctCount + 1 : correctCount
    setWrongList(newWrong)
    setCorrectCount(newCorrect)

    if (success) {
      // benar: jeda 1,3 dtk tampilkan "Benar!" lalu pindah soal
      stopCamera()
      setTransition({ type: 'correct', label: current.label })
      transitionTimerRef.current = setTimeout(() => {
        setTransition(null)
        if (isLast) {
          setScreen('result')
        } else {
          setQIndex((i) => i + 1)
          resetPenilaian()
          // kamera dinyalakan otomatis oleh useEffect [screen, qIndex]
        }
      }, 1300)
    }
    // salah: kamera tetap nyala, panel feedback + tombol "Lanjut"
  }

  function goNextAfterWrong() {
    resetPenilaian()
    if (isLast) {
      stopCamera()
      setScreen('result')
    } else {
      setQIndex((i) => i + 1)
      // kamera dinyalakan otomatis oleh useEffect [screen, qIndex]
    }
  }

  // hentikan kuis di tengah jalan & kembali ke layar awal (skor sesi dibuang)
  function stopAndReset() {
    stopCamera()
    resetPenilaian()
    setQuestions([])
    setQIndex(0)
    setCorrectCount(0)
    setScreen('setup')
  }

  // hentikan kamera & bersihkan timer saat komponen dilepas
  useEffect(() => {
    return () => {
      trackerRef.current?.stop()
      trackerRef.current = null
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current)
        transitionTimerRef.current = null
      }
      if (wrongTimerRef.current) {
        clearTimeout(wrongTimerRef.current)
        wrongTimerRef.current = null
      }
    }
  }, [])

  // nyalakan kamera otomatis saat soal baru dimulai (screen quiz & soal pertama)
  const autoStartRef = useRef(false)
  const prevQRef = useRef(0)
  /* oxlint-disable react-hooks/exhaustive-deps -- beginTry dipakai dari ref; efek hanya utk transisi soal */
  useEffect(() => {
    if (screen !== 'quiz') {
      autoStartRef.current = false
      prevQRef.current = qIndex
      return
    }
    // soal baru (qIndex berubah): buka kunci auto-start utk soal ini
    if (prevQRef.current !== qIndex) {
      prevQRef.current = qIndex
      autoStartRef.current = false
    }
    if (camStatus === 'off' && current && !autoStartRef.current) {
      autoStartRef.current = true
      beginTry()
    }
  }, [screen, qIndex, camStatus, current])

  // ============ RENDER ============
  return (
    <section className="quiz">
      {/* ---------- setup ---------- */}
      {screen === 'setup' && (
        <div className="quiz-setup">
          <h2>Kuis Ingatan</h2>
          <p className="quiz-setup-sub">
            Uji ingatanmu: sistem kasih perintah, kamu bentuk hurufnya di depan kamera.
            Skor dihitung jujur dari percobaan pertama, dan huruf yang gagal bisa diulang.
          </p>
          <div className="quiz-setup-actions">
            <button className="btn-primary cta-try" onClick={() => startQuiz(false)}>
              <ChalkboardTeacher size={20} weight="fill" /> Mulai Kuis (10 soal acak)
            </button>
            {wrongList.length > 0 && (
              <button className="btn-secondary" onClick={() => startQuiz(true)}>
                <ArrowCounterClockwise size={18} /> Ulangi Huruf yang Salah ({wrongList.length})
              </button>
            )}
          </div>
          {wrongList.length === 0 && (
            <p className="quiz-setup-hint">
              10 soal acak dari 24 huruf. Jawab sebisamu, huruf yang salah bisa diulang di akhir.
            </p>
          )}
        </div>
      )}

      {/* ---------- kuis sedang berjalan ---------- */}
      {screen === 'quiz' && current && (
        <div className="quiz-active">
          {/* header soal */}
          <div className="quiz-progress">
            <button className="quiz-stop-btn" onClick={stopAndReset} title="Hentikan kuis">
              <XCircle size={18} /> Hentikan
            </button>
            <span>
              Soal {qIndex + 1} dari {questions.length}
            </span>
            <span className="quiz-score-pill">
              <Sparkle size={14} weight="fill" /> {correctCount}
            </span>
          </div>

          <div className="quiz-target">
            <span className="quiz-target-label">Tunjukkan huruf ini:</span>
            <span className="quiz-target-letter">{current.label}</span>
          </div>

          {/* overlay "Benar!" antar soal */}
          {transition && (
            <div className="quiz-transition">
              <CheckCircle size={72} weight="fill" className="quiz-transition-icon" />
              <h3>Benar! Huruf {transition.label}</h3>
              <p>{isLast ? 'Menampilkan hasil…' : 'Menyiapkan soal berikutnya…'}</p>
            </div>
          )}

          {/* kamera (disembunyikan saat transisi benar) */}
          <div className={'video-wrap quiz-video-wrap' + (transition ? ' is-hidden' : '')}>
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
                Bentuk huruf {current.label} di depan kamera
              </div>
            )}
          </div>

          <div className="try-status">
            {camStatus === 'on' && handSeen && holdMs === 0 && !wrongInfo && (
              <p className="try-waiting">Mantap! Sekarang tahan posisi ini 5 detik…</p>
            )}
            {camStatus === 'on' && handSeen && holdMs > 0 && (
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

          {/* tombol mulai kamera (jika belum) */}
          {camStatus === 'off' && !wrongInfo && (
            <button className="btn-primary cta-try" onClick={beginTry}>
              <Camera size={20} weight="fill" /> Mulai Kamera
            </button>
          )}

          {/* panel feedback salah */}
          {wrongInfo && (
            <div className="try-feedback">
              <div className="try-feedback-card">
                <div className="try-feedback-head">
                  <XCircle size={26} weight="fill" className="try-feedback-icon" />
                  <div>
                    <h4>Belum tepat untuk huruf {current.label}</h4>
                    <p>
                      Terdeteksi sebagai <strong>{wrongInfo.detected}</strong> — coba samakan dengan contoh.
                    </p>
                  </div>
                </div>
                <div className="try-feedback-body">
                  <img src={current.gambar} alt={`Contoh huruf ${current.label}`} className="try-feedback-img" />
                  <ul className="try-feedback-tips">
                    {wrongInfo.tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="try-feedback-actions">
                  <button className="btn-primary" onClick={goNextAfterWrong}>
                    <ArrowRight size={18} weight="bold" /> Lanjut Soal {isLast ? '& Lihat Hasil' : 'Berikutnya'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {camStatus === 'on' && (
            <div className="cam-on-indicator">
              <span className="cam-dot" /> Kamera aktif — video diproses di perangkatmu
            </div>
          )}
        </div>
      )}

      {/* ---------- hasil (skor + daftar salah) ---------- */}
      {screen === 'result' && (
        <div className="quiz-result">
          <div className="result-card">
            <div className="result-icon-wrap">
              <CheckCircle size={56} weight="fill" className="result-icon" />
            </div>
            <h2>Kuis Selesai!</h2>
            <p className="result-score">
              Skor kamu <strong>{correctCount}/{questions.length}</strong>
            </p>
            <p className="result-msg">
              {correctCount === questions.length
                ? 'Sempurna! Semua huruf dikuasai.'
                : correctCount >= Math.ceil(questions.length / 2)
                  ? 'Bagus! Tinggal beberapa huruf lagi untuk diulang.'
                  : 'Terus berlatih, kamu pasti bisa!'}
            </p>

            {wrongList.length > 0 && (
              <div className="result-wrong">
                <h4>Perlu diulang ({wrongList.length})</h4>
                <div className="result-wrong-grid">
                  {wrongList.map((label) => (
                    <div key={label} className="result-wrong-letter">
                      <span className="result-wrong-badge">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="result-actions">
              <button className="btn-primary" onClick={() => startQuiz(true)} disabled={!wrongList.length}>
                <ArrowCounterClockwise size={18} /> Ulangi yang Salah
              </button>
              <button className="btn-secondary" onClick={() => startQuiz(false)}>
                <ChalkboardTeacher size={18} /> Kuis Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}