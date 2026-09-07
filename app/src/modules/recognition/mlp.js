// ============================================================
// MLP forward pass (JavaScript) — model dari T3 (scikit-learn)
// Arsitektur: input(63) → dense(128)+relu → dense(64)+relu → dense(24)+softmax
// Bobot & bias dimuat dari model.json (hasil export_model.py)
// ============================================================

import modelJson from './model.json'

let model = null

export function loadModel() {
  if (model) return Promise.resolve(model)
  // model.json diimpor langsung (Vite JSON import)
  model = normalizeModel(modelJson)
  return Promise.resolve(model)
}

export function isModelLoaded() {
  return model !== null
}

function normalizeModel(raw) {
  // Pastikan weights berbentuk array-of-arrays (layer → [out][in])
  const weights = raw.weights.map((w) => w)
  const biases = raw.biases
  return {
    weights,
    biases,
    classes: raw.classes,
    scalerMean: raw.scaler.mean,
    scalerScale: raw.scaler.scale,
  }
}

// ============ Forward pass ============

function dense(input, weight, bias) {
  // weight sklearn: [in][out] (bukan [out][in]); out[o] = Σ_i input[i] * W[i][o]
  const out = new Array(bias.length)
  const nIn = input.length
  for (let o = 0; o < bias.length; o++) {
    let sum = bias[o]
    for (let i = 0; i < nIn; i++) {
      sum += weight[i][o] * input[i]
    }
    out[o] = sum
  }
  return out
}

function relu(vec) {
  return vec.map((v) => (v > 0 ? v : 0))
}

function softmax(vec) {
  const max = Math.max(...vec)
  const exp = vec.map((v) => Math.exp(v - max))
  const sum = exp.reduce((a, b) => a + b, 0)
  return exp.map((v) => v / sum)
}

/**
 * Prediksi dari vektor 63 fitur (x,y,z per landmark, sudah dinormalisasi MediaPipe).
 * Return { label, confidence, probabilities }
 */
export function predictLandmarks(landmarks63) {
  if (!model) throw new Error('Model belum dimuat. Panggil loadModel() dulu.')
  if (landmarks63.length !== 63) throw new Error(`Fitur harus 63, dapat ${landmarks63.length}`)

  // 1. StandardScaler (mean/scale dari sklearn)
  const scaled = landmarks63.map(
    (v, i) => (v - model.scalerMean[i]) / model.scalerScale[i]
  )

  // 2. Forward pass
  let x = scaled
  for (let layer = 0; layer < model.weights.length - 1; layer++) {
    x = relu(dense(x, model.weights[layer], model.biases[layer]))
  }
  // layer terakhir tanpa relu → softmax
  const logits = dense(x, model.weights[model.weights.length - 1], model.biases[model.biases.length - 1])
  const proba = softmax(logits)

  // 3. Argmax
  let bestIdx = 0
  for (let i = 1; i < proba.length; i++) {
    if (proba[i] > proba[bestIdx]) bestIdx = i
  }
  return {
    label: model.classes[bestIdx],
    confidence: proba[bestIdx],
    probabilities: proba,
  }
}

// ============ Stabilisasi (anti-kedip) ============

/**
 * Rata-rata probabilitas dari N frame terakhir, lalu ambil argmax.
 * Ini membuat prediksi tidak berkedip-kedip antar huruf.
 */
export class Stabilizer {
  constructor(windowSize = 5) {
    this.windowSize = windowSize
    this.history = [] // array proba (Float64Array / array)
    this.numClasses = 24
  }

  push(probaArray) {
    this.history.push(probaArray)
    if (this.history.length > this.windowSize) this.history.shift()
  }

  /**
   * Rata-rata probabilitas dalam window, return { label, confidence, probaMean }.
   * Jika belum ada frame → null.
   */
  predictStable() {
    if (this.history.length === 0) return null
    const n = this.history.length
    const mean = new Array(this.history[0].length).fill(0)
    for (const proba of this.history) {
      for (let i = 0; i < mean.length; i++) mean[i] += proba[i]
    }
    for (let i = 0; i < mean.length; i++) mean[i] /= n

    let bestIdx = 0
    for (let i = 1; i < mean.length; i++) {
      if (mean[i] > mean[bestIdx]) bestIdx = i
    }
    return {
      label: model.classes[bestIdx],
      confidence: mean[bestIdx],
      probaMean: mean,
    }
  }

  reset() {
    this.history = []
  }
}
