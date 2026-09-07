import { describe, it, expect } from 'vitest'
import { SISTEM } from './types'
import {
  getGesturesBySystem,
  getGestureById,
  getGestureByLabel,
  ABJAD_SIBI,
  KATA_SIBI,
  SUMBER_KONTEN,
} from './gestureCatalog'

describe('Katalog Gestur SIBI (T2)', () => {
  it('memiliki 24 abjad statis SIBI (A-I, K-Y)', () => {
    expect(ABJAD_SIBI).toHaveLength(24)
    const labels = ABJAD_SIBI.map((g) => g.label)
    // Cek huruf awal dan akhir
    expect(labels).toContain('A')
    expect(labels).toContain('I')
    expect(labels).toContain('K')
    expect(labels).toContain('Y')
    // Memastikan J dan Z yang dinamis tidak masuk MVP
    expect(labels).not.toContain('J')
    expect(labels).not.toContain('Z')
  })

  it('memiliki 15-20 kata dasar statis SIBI', () => {
    expect(KATA_SIBI.length).toBeGreaterThanOrEqual(15)
    expect(KATA_SIBI.length).toBeLessThanOrEqual(20)
  })

  it('setiap gestur SIBI memiliki struktur data lengkap', () => {
    const all = getGesturesBySystem(SISTEM.SIBI)
    expect(all.length).toBe(40) // 24 abjad + 16 kata

    for (const g of all) {
      expect(g.id).toBeTruthy()
      expect(g.label).toBeTruthy()
      expect(g.sistem).toBe(SISTEM.SIBI)
      expect(g.jumlahTangan).toBe(1)
      expect(g.gambar).toBeTruthy()
      expect(Array.isArray(g.teksLangkah)).toBe(true)
      expect(g.teksLangkah.length).toBeGreaterThan(0)
      expect(g.ringkasan).toBeTruthy()
    }
  })

  it('semua id gestur bersifat unik', () => {
    const all = getGesturesBySystem(SISTEM.SIBI)
    const ids = all.map((g) => g.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('dapat mencari gestur by ID dan by Label', () => {
    const gA = getGestureById('sibi-a')
    expect(gA).not.toBeNull()
    expect(gA.label).toBe('A')

    const gHalo = getGestureByLabel('Halo / Hai')
    expect(gHalo).not.toBeNull()
    expect(gHalo.id).toBe('sibi-halo')
  })

  it('mencatat sumber resmi Kamus SIBI Kemendikbud', () => {
    expect(SUMBER_KONTEN.nama).toContain('Kamus Sistem Isyarat Bahasa Indonesia')
    expect(SUMBER_KONTEN.penerbit).toContain('Kementerian Pendidikan')
    expect(SUMBER_KONTEN.url).toContain('kemdikbud.go.id')
  })
})
