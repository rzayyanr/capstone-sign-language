//============================================================
// Test modul gamification (XP & streak harian) — mock localStorage
//============================================================
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  recordCorrect,
  getGamification,
  resetGamification,
  XP_PER_CORRECT,
} from './gamification'

// Mock localStorage sederhana (sama pola progress.test.js)
const store = new Map()
beforeEach(() => {
  store.clear()
  global.localStorage = {
    getItem: vi.fn((k) => (store.has(k) ? store.get(k) : null)),
    setItem: vi.fn((k, v) => store.set(k, String(v))),
    removeItem: vi.fn((k) => store.delete(k)),
  }
})

describe('gamification streak & XP', () => {
  it('XP_PER_CORRECT = 10', () => {
    expect(XP_PER_CORRECT).toBe(10)
  })

  it('recordCorrect pertama: +10 XP, streak 1', () => {
    recordCorrect()
    const s = getGamification()
    expect(s.xp).toBe(10)
    expect(s.streak).toBe(1)
  })

  it('belajar lagi hari yang sama: XP naik, streak tetap', () => {
    recordCorrect()
    recordCorrect() // hari sama
    const s = getGamification()
    expect(s.xp).toBe(20)
    expect(s.streak).toBe(1)
    expect(s.bestStreak).toBe(1)
  })

  it('belajar hari baru setelah kemarin: streak naik', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-07T10:00:00'))
    recordCorrect() // hari 1
    vi.setSystemTime(new Date('2026-09-08T10:00:00'))
    recordCorrect() // hari 2 (beruntun)
    vi.useRealTimers()
    const s = getGamification()
    expect(s.streak).toBe(2)
    expect(s.xp).toBe(20)
    expect(s.bestStreak).toBe(2)
  })

  it('resetGamification mengosongkan', () => {
    recordCorrect()
    resetGamification()
    const s = getGamification()
    expect(s.xp).toBe(0)
    expect(s.streak).toBe(0)
  })
})