// ============================================================
// Kamera + MediaPipe HandLandmarker + loop prediksi (T4)
// Pipeline: webcam frame → 21 landmark (x,y,z) → mlp.js → label + conf
// ============================================================

import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

export const VIDEO_WIDTH = 640
export const VIDEO_HEIGHT = 480

const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm`
const MODEL_URL = `${import.meta.env.BASE_URL}models/hand_landmarker.task`

let handLandmarker = null
let videoEl = null
let rafId = null
let lastVideoTime = -1

/**
 * Siapkan & mulai kamera + landmarker.
 * @param {Object} opts { video, onFrame(landmarks21), onStatus(text), onError(msg) }
 * @returns {Promise<{stop: Function}>}
 */
export async function startCamera(opts) {
  const { video, onFrame, onStatus, onError } = opts

  // 1. Inisialisasi HandLandmarker (sekali saja)
  if (!handLandmarker) {
    onStatus?.('Memuat model MediaPipe...')
    try {
      const fileset = await FilesetResolver.forVisionTasks(WASM_URL)
      handLandmarker = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
    } catch (e) {
      onError?.('Gagal memuat model deteksi tangan. Cek koneksi internet lalu muat ulang.')
      throw e
    }
  }

  // 2. Akses webcam
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: VIDEO_WIDTH }, height: { ideal: VIDEO_HEIGHT }, facingMode: 'user' },
      audio: false,
    })
    video.srcObject = stream
    videoEl = video
  } catch (e) {
    onError?.(
      e?.name === 'NotAllowedError'
        ? 'Izin kamera ditolak. Izinkan akses kamera di browser, lalu coba lagi.'
        : e?.name === 'NotFoundError'
          ? 'Kamera tidak ditemukan di perangkat ini.'
          : 'Tidak bisa mengakses kamera: ' + (e?.message || e)
    )
    throw e
  }

  await new Promise((resolve) => {
    video.onloadedmetadata = () => resolve()
  })
  await video.play()

  // 3. Loop deteksi tiap frame (requestVideoFrameCallback jika ada, fallback rAF)
  const processFrame = () => {
    if (!handLandmarker || video.readyState < 2) {
      rafId = requestAnimationFrame(processFrame)
      return
    }
    const now = performance.now()
    if (video.currentTime !== lastVideoTime) {
      lastVideoTime = video.currentTime
      try {
        const result = handLandmarker.detectForVideo(video, now)
        if (result.landmarks && result.landmarks.length > 0) {
          const lm = result.landmarks[0] // [21] {x,y,z}
          const flat = []
          for (let i = 0; i < lm.length; i++) {
            flat.push(lm[i].x, lm[i].y, lm[i].z)
          }
          onFrame?.(flat, lm)
        } else {
          onFrame?.(null, null)
        }
      } catch {
        // frame sedang transisi; lewati
      }
    }
    rafId = requestAnimationFrame(processFrame)
  }
  rafId = requestAnimationFrame(processFrame)

  return {
    stop() {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = null
      if (videoEl?.srcObject) {
        videoEl.srcObject.getTracks().forEach((t) => t.stop())
        videoEl.srcObject = null
      }
      lastVideoTime = -1
    },
  }
}

/** Gambar landmark sebagai canvas overlay (untuk visualisasi). */
export function drawLandmarks(ctx, landmarks21, w, h) {
  if (!landmarks21) return
  const scaleX = w
  const scaleY = h

  // Koneksi antar titik (dari MediaPipe HAND_CONNECTIONS)
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17],
  ]

  ctx.strokeStyle = 'rgba(14,122,108,0.9)'
  ctx.lineWidth = Math.max(2, w / 200)
  ctx.lineCap = 'round'
  for (const [a, b] of connections) {
    ctx.beginPath()
    ctx.moveTo(landmarks21[a].x * scaleX, landmarks21[a].y * scaleY)
    ctx.lineTo(landmarks21[b].x * scaleX, landmarks21[b].y * scaleY)
    ctx.stroke()
  }

  ctx.fillStyle = '#F2A41B'
  for (const p of landmarks21) {
    ctx.beginPath()
    ctx.arc(p.x * scaleX, p.y * scaleY, Math.max(3, w / 130), 0, Math.PI * 2)
    ctx.fill()
  }
}
