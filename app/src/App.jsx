import { useState } from 'react'
import { getGesturesBySystem } from './modules/content/gestureCatalog'
import { SISTEM } from './modules/content/types'
import './App.css'

const PAGES = ['beranda', 'abjad', 'kata', 'latihan', 'progres']

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
              <h1>Belajar SIBI jadi menyenangkan.</h1>
              <p className="tagline">
                Isyarat: aplikasi belajar bahasa isyarat Indonesia (SIBI) dengan
                pengenalan gestur real-time. Temanmu bisa diajak bicara, bukan
                cuma ditatap.
              </p>
              <button className="btn-primary" onClick={() => setPage('abjad')}>
                Mulai dari huruf A
              </button>
            </section>
            <section className="card">
              <h2>Pilih huruf</h2>
              <div className="letter-grid">
                {huruf.slice(0, 24).map((g) => (
                  <button key={g.id} className="letter-tile">
                    {g.label}
                  </button>
                ))}
              </div>
              <p className="placeholder-note">
                24 abjad statis SIBI (A-I, K-Y). Belajar huruf per huruf.
              </p>
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