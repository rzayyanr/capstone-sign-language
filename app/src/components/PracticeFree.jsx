// ============================================================
// Mode Latihan Bebas (T4): kamera + deteksi huruf real-time
// Tangan apa pun → AI menebak huruf (tanpa target tertentu).
// ============================================================
import { useEffect, useRef, useState } from 'react'
import { VideoCamera, Hand, CircleNotch, VideoCameraSlash } from '@phosphor-icons/react'
import { loadModel, predictLandmarks, Stabilizer } from '../modules/recognition/mlp'
import { startCamera, drawLandmarks, VIDEO_WIDTH, VIDEO_HEIGHT } from '../modules/recognition/camera'

const MIN_CONFIDENCE = 0.4
const STABILIZE_FRAMES = 6

export default function PracticeFree() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const trackerRef = useRef(null)

  const [status, setStatus] = useState('idle') // idle | loading-model | loading-camera | running | error
  const [errorMsg, setErrorMsg] = useState('')
  const [handVisible, setHandVisible] = useState(false)
  const [prediction, setPrediction] = useState(null) // { label, confidence }

  const stabilizerRef = useRef(null)
  if (!stabilizerRef.current) stabilizerRef.current = new Stabilizer(STABILIZE_FRAMES)

  // ============ Setup (saat mount) ============
  useEffect(() => {
    let cancelled = false
    let tracker = null

    async function init() {
      // 1. Muat model MLP
      setStatus('loading-model')
      try {
        await loadModel()
        if (cancelled) return
      } catch (e) {
        if (cancelled) return
        setStatus('error')
        setErrorMsg('Gagal memuat model AI: ' + (e?.message || e))
        return
      }

      // 2. Mulai kamera + HandLandmarker
      setStatus('loading-camera')
      try {
        tracker = await startCamera({
          video: videoRef.current,
          onFrame: (flat, lms) => {
            if (cancelled) return
            handleFrame(flat, lms)
          },
          onError: (msg) => {
            if (cancelled) return
            setStatus('error')
            setErrorMsg(msg)
          },
        })
        trackerRef.current = tracker
        if (!cancelled) setStatus('running')
      } catch {
        if (cancelled) return
        setStatus('error')
        setErrorMsg('Tidak bisa memulai kamera. Periksa izin kamera di browser.')
      }
    }

    init()

    return () => {
      cancelled = true
      tracker?.stop()
      trackerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ============ Proses tiap frame ============
  function handleFrame(flat, lms) {
    // Gambar overlay landmark (visualisasi tulang tangan)
    const canvas = canvasRef.current
    const video = videoRef.current
    if (canvas && video) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawLandmarks(ctx, lms, canvas.width, canvas.height)
    }

    if (!flat) {
      setHandVisible(false)
      setPrediction(null)
      stabilizerRef.current.reset()
      return
    }

    setHandVisible(true)

    // Normalisasi tambahan: sentralkan & skala (x,y relatif) supaya model robust
    // MediaPipe sudah kirim x,y normalized [0..1]; z relatif wrist.
    try {
      const result = predictLandmarks(flat)
      stabilizerRef.current.push(result.probabilities)
      const stable = stabilizerRef.current.predictStable()
      if (stable && stable.confidence >= MIN_CONFIDENCE) {
        setPrediction({ label: stable.label, confidence: stable.confidence })
      } else {
        setPrediction(null)
      }
    } catch {
      // frame tidak valid; lewati
    }
  }

  // ============ Render ============
  return (
    <section className="practice-live">
      <div className="practice-live-header">
        <h2>Latihan Bebas</h2>
        <p className="page-sub">Peragakan huruf apa pun di depan kamera. AI menebak huruf yang kamu bentuk.</p>
      </div>

      {/* KARTU KAMERA */}
      <div className="practice-card">
        <div className="video-wrap">
          <video
            ref={videoRef}
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            muted
            playsInline
            className="video-el"
          />
          <canvas ref={canvasRef} width={VIDEO_WIDTH} height={VIDEO_HEIGHT} className="video-overlay" />

          {/* Status overlay */}
          {status === 'idle' && (
            <div className="video-status">
              <VideoCamera size={40} weight="duotone" />
              <p>Siap memulai latihan.</p>
            </div>
          )}
          {status === 'loading-model' && (
            <div className="video-status">
              <CircleNotch className="spin" size={40} weight="duotone" />
              <p>Memuat model AI…</p>
            </div>
          )}
          {status === 'loading-camera' && (
            <div className="video-status">
              <CircleNotch className="spin" size={40} weight="duotone" />
              <p>Mengakses kamera…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="video-status error">
              <VideoCameraSlash size={40} weight="duotone" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Indikator tangan tidak terlihat */}
          {status === 'running' && !handVisible && (
            <div className="video-hint">
              <Hand size={22} weight="fill" />
              Tunjukkan tanganmu ke kamera
            </div>
          )}
        </div>

        {/* HASIL PREDIKSI */}
        <div className="practice-result">
          {status === 'running' && prediction && (
            <div className="prediction-box">
              <span className="prediction-label">Huruf terdeteksi</span>
              <span className="prediction-letter">{prediction.label}</span>
              <span className="prediction-conf">
                Keyakinan {(prediction.confidence * 100).toFixed(0)}%
              </span>
            </div>
          )}
          {status === 'running' && handVisible && !prediction && (
            <div className="prediction-box waiting">
              <span className="prediction-label">Menebak…</span>
              <span className="prediction-letter dim">?</span>
              <span className="prediction-conf">Bentuk huruf dengan stabil</span>
            </div>
          )}
          {status === 'running' && !handVisible && (
            <div className="prediction-box idle">
              <span className="prediction-label">Belum ada tangan</span>
              <span className="prediction-letter dim">?</span>
              <span className="prediction-conf">Arahkan tangan ke kamera</span>
            </div>
          )}
        </div>
      </div>

      {/* CATATAN */}
      <p className="practice-note">
        Petunjuk: posisikan 1 tangan di dalam bingkai, jari terlihat jelas, dan tahan beberapa
        detik. Huruf J dan Z belum didukung (gerakan dinamis). Privasi: video diproses di
        perangkatmu, tidak dikirim ke server.
      </p>
    </section>
  )
}
