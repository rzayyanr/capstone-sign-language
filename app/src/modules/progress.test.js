// ============================================================
// Test modul progress (T8) — mock localStorage
// ============================================================
import { describe, it, expect, beforeEach } from 'vitest'
import {
  recordSuccess,
  recordFailure,
  getProgress,
  getLetterProgress,
  resetProgress,
  MASTERY_STREAK,
} from './progress'

// Mock localStorage sederhana
const store = new Map()
beforeEach(() => {
  store.clear()
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  }
})

describe('progress (localStorage mastery)', () => {
  it('belum dicoba: streak 0 & belum dikuasai', () => {
    const p = getLetterProgress('A')
    expect(p.streak).toBe(0)
    expect(p.mastered).toBe(false)
  })

  it('benar 2x belum dikuasai, streak 2', () => {
    recordSuccess('B')
    recordSuccess('B')
    expect(getLetterProgress('B').streak).toBe(2)
    expect(getLetterProgress('B').mastered).toBe(false)
  })

  it('benar 3x berturut-turut -> dikuasai', () => {
    recordSuccess('C')
    recordSuccess('C')
    recordSuccess('C')
    expect(getLetterProgress('C').mastered).toBe(true)
    expect(getLetterProgress('C').streak).toBe(MASTERY_STREAK)
  })

  it('salah di tengah -> streak balik 0 (belum dikuasai)', () => {
    recordSuccess('D')
    recordSuccess('D')
    recordFailure('D')
    expect(getLetterProgress('D').streak).toBe(0)
    expect(getLetterProgress('D').mastered).toBe(false)
  })

  it('setelah dikuasai, salah sekali tidak menghilangkan status dikuasai', () => {
    recordSuccess('E')
    recordSuccess('E')
    recordSuccess('E')
    recordFailure('E')
    expect(getLetterProgress('E').mastered).toBe(true)
    expect(getLetterProgress('E').streak).toBe(0)
  })

  it('recordFailure utk huruf yg belum pernah dicoba: tidak membuat entri', () => {
    recordFailure('Z')
    expect(getProgress()).toEqual({})
  })

  it('resetProgress mengosongkan semua', () => {
    recordSuccess('A')
    recordSuccess('A')
    recordSuccess('A')
    resetProgress()
    expect(getProgress()).toEqual({})
  })
})
