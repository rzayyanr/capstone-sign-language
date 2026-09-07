// Modul pengenalan gestur (ADR-0004: client-side).
// Pipeline: kamera/frame -> MediaPipe (21 landmark) -> model MLP (JS) -> prediksi.
// T4: implementasi nyata di mlp.js (forward pass + stabilisasi) & camera.js (HandLandmarker).

export { loadModel, isModelLoaded, predictLandmarks, Stabilizer } from './mlp'
export { startCamera, drawLandmarks, VIDEO_WIDTH, VIDEO_HEIGHT } from './camera'
export const recognitionModuleReady = true
