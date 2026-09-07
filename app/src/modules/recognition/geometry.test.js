// ============================================================
// Test engine geometri T6 — saran perbaikan berbasis landmark
// ============================================================
import { describe, it, expect } from 'vitest'
import {
  fingerExtendedness,
  fingerSpreadDistance,
  isFingerExtended,
  analyze,
} from '../recognition/geometry'

// ---- helper: bangun landmark sintetis ----
// Semua jari lurus ke atas (y menurun = naik di gambar), spread rapat.
function straightHand({ indexSpread = 0 } = {}) {
  const lm = Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 }))
  // titik 0 = pergelangan
  lm[0] = { x: 0.5, y: 1.0, z: 0 }
  const fingerBases = {
    thumb: [1, 2, 3, 4],
    index: [5, 6, 7, 8],
    middle: [9, 10, 11, 12],
    ring: [13, 14, 15, 16],
    pinky: [17, 18, 19, 20],
  }
  // jari-jari tegak lurus (dari pangkal y=0.8 ke ujung y=0.1)
  const setFinger = (idxs, x, yBase, yTip) => {
    const n = idxs.length
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      lm[idxs[i]] = { x, y: yBase + (yTip - yBase) * t, z: 0 }
    }
  }
  // thumb condong
  setFinger(fingerBases.thumb, 0.42, 0.85, 0.55)
  setFinger(fingerBases.index, 0.5 + indexSpread, 0.8, 0.1)
  setFinger(fingerBases.middle, 0.55, 0.8, 0.1)
  setFinger(fingerBases.ring, 0.6, 0.8, 0.1)
  setFinger(fingerBases.pinky, 0.65, 0.8, 0.12)
  return lm
}

// Kepalkan semua jari (bengkok): ujung jari kembali mendekati pangkal
function fistHand() {
  const lm = Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 }))
  lm[0] = { x: 0.5, y: 1.0, z: 0 }
  // semua jari: pangkal di y~0.8, lalu melengkung kembali ke y~0.85 (bengkok)
  const groups = {
    index: [5, 6, 7, 8],
    middle: [9, 10, 11, 12],
    ring: [13, 14, 15, 16],
    pinky: [17, 18, 19, 20],
  }
  const xs = { index: 0.5, middle: 0.55, ring: 0.6, pinky: 0.65 }
  for (const [name, idxs] of Object.entries(groups)) {
    const x = xs[name]
    lm[idxs[0]] = { x, y: 0.8, z: 0 }
    lm[idxs[1]] = { x, y: 0.55, z: 0 }
    lm[idxs[2]] = { x, y: 0.5, z: 0 }
    lm[idxs[3]] = { x, y: 0.85, z: 0 } // ujung balik ke bawah = bengkok
  }
  // thumb lurus samping
  lm[1] = { x: 0.42, y: 0.85, z: 0 }
  lm[2] = { x: 0.35, y: 0.8, z: 0 }
  lm[3] = { x: 0.32, y: 0.7, z: 0 }
  lm[4] = { x: 0.3, y: 0.6, z: 0 }
  return lm
}

// ---- Fixture: landmark asli dari dataset (ml_work/data/landmarks) ----
// Sampel V asli: index & middle lurus renggang ~130°, ring/pinky bengkok
const REAL_V = [
  {"x":0.38463908433914185,"y":0.9189808368682861,"z":7.467622253898298e-07},
  {"x":0.41416943073272705,"y":0.7991055250167847,"z":-0.03177889436483383},
  {"x":0.39835888147354126,"y":0.6984971165657043,"z":-0.03832019120454788},
  {"x":0.32444044947624207,"y":0.6379265189170837,"z":-0.044685568660497665},
  {"x":0.25455623865127563,"y":0.648208737373352,"z":-0.04762835428118706},
  {"x":0.3410644829273224,"y":0.5771792531013489,"z":-0.00965201947838068},
  {"x":0.31179141998291016,"y":0.4337671995162964,"z":-0.02921994775533676},
  {"x":0.2928227186203003,"y":0.357169508934021,"z":-0.04606100171804428},
  {"x":0.26768845319747925,"y":0.2849217355251312,"z":-0.05975135788321495},
  {"x":0.2855685353279114,"y":0.6016055345535278,"z":-0.014066197909414768},
  {"x":0.23434776067733765,"y":0.4709840416908264,"z":-0.04833206534385681},
  {"x":0.19553691148757935,"y":0.3873821794986725,"z":-0.07753601670265198},
  {"x":0.1596432477235794,"y":0.30779653787612915,"z":-0.09660015255212784},
  {"x":0.250434935092926,"y":0.6566469669342041,"z":-0.021415166556835175},
  {"x":0.2079649269580841,"y":0.5841978788375854,"z":-0.06307797878980637},
  {"x":0.2570101022720337,"y":0.6488383412361145,"z":-0.0692194476723671},
  {"x":0.2893068492412567,"y":0.69296795129776,"z":-0.06080692261457443},
  {"x":0.23021510243415833,"y":0.7407688498497009,"z":-0.03153898939490318},
  {"x":0.19211184978485107,"y":0.6693035960197449,"z":-0.05671260878443718},
  {"x":0.23229235410690308,"y":0.6934815049171448,"z":-0.04762835428118706},
  {"x":0.26632046699523926,"y":0.7294021248817444,"z":-0.034481778740882874},
]

function vHand() {
  return REAL_V.map((p) => ({ ...p }))
}

describe('fingerExtendedness', () => {
  it('jari lurus ~1.0, jari bengkok <0.6', () => {
    const straight = straightHand()
    const fist = fistHand()
    expect(fingerExtendedness(straight, 'index')).toBeGreaterThan(0.95)
    expect(fingerExtendedness(fist, 'index')).toBeLessThan(0.6)
    expect(fingerExtendedness(fist, 'middle')).toBeLessThan(0.6)
  })
})

describe('fingerSpreadDistance', () => {
  it('jari V asli index-middle renggang (> 0.3)', () => {
    const v = vHand()
    const d = fingerSpreadDistance(v, 'index', 'middle')
    expect(d).toBeGreaterThan(0.3) // V asli index-middle renggang
  })
})

describe('isFingerExtended', () => {
  it('deteksi lurus vs bengkok', () => {
    const straight = straightHand()
    const fist = fistHand()
    expect(isFingerExtended(straight, 'index')).toBe(true)
    expect(isFingerExtended(fist, 'index')).toBe(false)
  })
})

describe('analyze', () => {
  it('tangan lurus penuh utk target A → saran tekuk jari', () => {
    const res = analyze('A', straightHand())
    expect(res.hasErrors).toBe(true)
    expect(res.tips.length).toBeGreaterThan(0)
    expect(res.tips[0]).toMatch(/tekuk|kepal|Teluk/i)
  })

  it('tangan V benar → ok tanpa saran', () => {
    const res = analyze('V', vHand())
    expect(res.ok).toBe(true)
    expect(res.tips).toEqual([])
  })

  it('tangan fist utk target V → saran luruskan index & middle', () => {
    const res = analyze('V', fistHand())
    expect(res.hasErrors).toBe(true)
    const joined = res.tips.join(' ')
    expect(joined).toMatch(/lurus/i)
  })

  it('max 3 saran', () => {
    const res = analyze('B', fistHand()) // B butuh 4 jari lurus; fist salah semua
    expect(res.tips.length).toBeLessThanOrEqual(3)
  })
})
