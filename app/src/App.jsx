import { useState } from 'react'
import { getGesturesBySystem } from './modules/content/gestureCatalog'
import { SISTEM } from './modules/content/types'
import HeroArt from './components/HeroArt'
import './App.css'

const PAGES = ['beranda', 'abjad', 'kata', 'latihan', 'progres']
const TEASER_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function App() {
  const [page, setPage] = useState('beranda')
  const huruf = getGesturesBySystem(SISTEM.SIBI).filter((g) => g.label.length === 1)

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-badge">👋</span>
          Isyarat
        </div>
        <nav className="app-nav">
          {PAGES.map((p) => (
            <button
              key={p}
              className={`nav-btn ${page === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p === 'beranda' ? 'Beranda' : p === 'abjad' ? 'Abjad' : p === 'kata' ? 'Kata' : p === 'latihan' ? 'Latihan' : 'Progres'}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {page === 'beranda' && (
          <>
            <section className="hero">
              <div className="hero-text">
                <h1>Kenalan dulu dengan bahasa isyarat.</h1>
                <p className="tagline">
                  Isyarat adalah aplikasi untuk belajar SIBI, bahasa isyarat
                  resmi Indonesia. Dibuat supaya kamu bisa ngobrol langsung
                  dengan teman Tuli, bukan cuma lewat tulisan.
                </p>
                <button className="btn-primary" onClick={() => setPage('abjad')}>
                  Mulai dari huruf A
                </button>
              </div>
              <HeroArt />
            </section>

            <section className="card teaser-card">
              <div className="teaser-head">
                <h2>Coba huruf pertama</h2>
                <button className="link-btn" onClick={() => setPage('abjad')}>
                  Lihat semua →
                </button>
              </div>
              <div className="letter-grid teaser-grid">
                {TEASER_LETTERS.map((l) => (
                  <button
                    key={l}
                    className="letter-tile"
                    onClick={() => setPage('abjad')}
                    aria-label={`Buka huruf ${l}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </section>

            <section className="intro-grid">
              <div className="card intro-card">
                <h2>Apa itu bahasa isyarat?</h2>
                <p>
                  Bahasa isyarat adalah cara berkomunikasi memakai tangan,
                  ekspresi wajah, dan gerak tubuh. Ini bahasa sehari-hari
                  teman-teman Tuli, sama seperti bahasa lisan bagi kita.
                </p>
              </div>
              <div className="card intro-card">
                <h2>Kenapa belajar?</h2>
                <p>
                  Supaya teman Tuli tidak perlu selalu menulis atau memakai
                  perantara untuk bicara denganmu. Sedikit usaha belajarmu
                  berarti besar buat mereka.
                </p>
              </div>
              <div className="card intro-card">
                <h2>Apa itu SIBI?</h2>
                <p>
                  SIBI (Sistem Isyarat Bahasa Indonesia) adalah sistem isyarat
                  resmi yang dibakukan pemerintah dan dipakai di sekolah luar
                  biasa. Isyaratnya satu tangan dan ada kamus resminya, jadi
                  enak dipelajari bertahap.
                </p>
              </div>
            </section>

            <section className="card">
              <h2>Cara pakainya gampang</h2>
              <ol className="steps">
                <li>
                  <span className="step-num">1</span>
                  <span>
                    <strong>Pilih huruf atau kata</strong> yang mau dipelajari
                    dari katalog.
                  </span>
                </li>
                <li>
                  <span className="step-num">2</span>
                  <span>
                    <strong>Tirukan gerakannya</strong> mengikuti panduan
                    gambar dan langkah.
                  </span>
                </li>
                <li>
                  <span className="step-num">3</span>
                  <span>
                    <strong>Dinilai kamera</strong>: aplikasi memberi tahu
                    benar atau salah, plus saran perbaikannya.
                  </span>
                </li>
              </ol>
            </section>
          </>
        )}

        {page === 'abjad' && (
          <section className="card">
            <h2>Abjad SIBI</h2>
            <div className="letter-grid">
              {huruf.map((g) => (
                <button key={g.id} className="letter-tile">
                  {g.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {page === 'kata' && (
          <section className="card">
            <h2>Kata SIBI</h2>
            <p className="placeholder-note">
              Daftar kata dasar akan tampil di sini (T2). Katalog kata sedang
              disiapkan dari Kamus SIBI.
            </p>
          </section>
        )}

        {page === 'latihan' && (
          <section className="card">
            <h2>Latihan</h2>
            <p className="placeholder-note">
              Kuis & latihan bebas akan tampil di sini (T7).
            </p>
          </section>
        )}

        {page === 'progres' && (
          <section className="card">
            <h2>Progres</h2>
            <p className="placeholder-note">
              Statistik penguasaan akan tampil di sini (T8).
            </p>
          </section>
        )}
      </main>

      <footer className="footer">
        Isyarat — Aplikasi Belajar SIBI · Capstone Proyek Sistem Aplikasi
      </footer>
    </div>
  )
}

export default App