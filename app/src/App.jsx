import { useState } from 'react'
import { getGesturesBySystem } from './modules/content/gestureCatalog'
import './App.css'

function App() {
  const [page, setPage] = useState('beranda')
  const totalGestures = getGesturesBySystem('SIBI').length

  return (
    <div className="app">
      <header className="app-header">
        <h1>CapSL: Belajar SIBI</h1>
        <nav>
          <button onClick={() => setPage('beranda')}>Beranda</button>
          <button onClick={() => setPage('abjad')}>Abjad</button>
          <button onClick={() => setPage('kata')}>Kata</button>
          <button onClick={() => setPage('latihan')}>Latihan</button>
          <button onClick={() => setPage('progres')}>Progres</button>
        </nav>
      </header>
      <main>
        {page === 'beranda' && (
          <section>
            <h2>Selamat datang 👋</h2>
            <p>
              Aplikasi belajar SIBI (Sistem Isyarat Bahasa Indonesia) dengan
              pengenalan gestur real-time.
            </p>
            <p>Total gestur SIBI di katalog: {totalGestures}</p>
            <p className="placeholder-note">
              (Fondasi aplikasi. Halaman belajar, latihan, dan progres menyusul
              di ticket berikutnya.)
            </p>
          </section>
        )}
        {page === 'abjad' && (
          <section>
            <h2>Abjad SIBI</h2>
            <p>Grid abjad akan tampil di sini (T2: Katalog gestur).</p>
          </section>
        )}
        {page === 'kata' && (
          <section>
            <h2>Kata SIBI</h2>
            <p>Daftar kata dasar akan tampil di sini (T2).</p>
          </section>
        )}
        {page === 'latihan' && (
          <section>
            <h2>Latihan</h2>
            <p>Kuis & latihan bebas akan tampil di sini (T7).</p>
          </section>
        )}
        {page === 'progres' && (
          <section>
            <h2>Progres</h2>
            <p>Statistik penguasaan akan tampil di sini (T8).</p>
          </section>
        )}
      </main>
      <footer className="app-footer">
        Capstone Proyek Sistem Aplikasi - Aplikasi Belajar SIBI
      </footer>
    </div>
  )
}

export default App
