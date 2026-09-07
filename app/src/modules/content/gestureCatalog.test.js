import { describe, it, expect } from 'vitest'
import { SISTEM } from './types'
import { getGesturesBySystem } from './gestureCatalog'

describe('katalog gestur SIBI', () => {
  it('menghasilkan 24 abjad statis (A-I, K-Y) untuk sistem SIBI', () => {
    const huruf = getGesturesBySystem(SISTEM.SIBI).filter((g) => g.label.length === 1)
    // A-I (9) + K-Y (15) = 24 huruf dalam daftar statis
    expect(huruf).toHaveLength(24)
    // pastikan J dan Z tidak termasuk (dinamis, luar scope MVP)
    const labels = huruf.map((g) => g.label)
    expect(labels).not.toContain('J')
    expect(labels).not.toContain('Z')
  })

  it('setiap gestur SIBI memakai satu tangan (jumlahTangan = 1)', () => {
    const sibi = getGesturesBySystem(SISTEM.SIBI)
    expect(sibi.length).toBeGreaterThan(0)
    for (const g of sibi) {
      expect(g.jumlahTangan).toBe(1)
    }
  })

  it('memiliki id unik', () => {
    const ids = getGesturesBySystem(SISTEM.SIBI).map((g) => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('kata dasar ikut dalam katalog', () => {
    const kata = getGesturesBySystem(SISTEM.SIBI).filter((g) => g.label.length > 1)
    expect(kata.length).toBeGreaterThan(0)
  })
})
