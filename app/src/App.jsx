import { useState } from 'react'
import {
  ABJAD_SIBI,
  KATA_SIBI,
  SUMBER_KONTEN,
} from './modules/content/gestureCatalog'
import {
  Hand,
  ChatCenteredDots,
  Target,
  Lightbulb,
  BookOpen,
  BookOpenText,
  ChartBar,
  Camera,
  ListChecks,
} from '@phosphor-icons/react'
import HeroArt from './components/HeroArt'
import GestureDetailModal from './components/GestureDetailModal'
import './App.css'

const PAGES = ['beranda', 'abjad', 'kata', 'latihan', 'progres']
const TEASER_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function App() {
  const [page, setPage] = useState('beranda')
  const [selectedGesture, setSelectedGesture] = useState(null)
  const [kataFilter, setKataFilter] = useState('Semua')

  const abjadList = ABJAD_SIBI
  const kataList =
    kataFilter === 'Semua'
      ? KATA_SIBI
      : KATA_SIBI.filter((k) => k.topik === kataFilter)

  const topics = ['Semua', ...new Set(KATA_SIBI.map((k) => k.topik))]

  const handleOpenGesture = (gesture) => {
    setSelectedGesture(gesture)
  }

  const handleCloseModal = () => {
    setSelectedGesture(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo" onClick={() => setPage('beranda')} style={{ cursor: 'pointer' }}>
          <div className="logo-badge"><Hand weight="fill" /></div>
          Isyarat
        </div>
        <nav className="app-nav">
          {PAGES.map((p) => (
            <button
              key={p}
              className={`nav-btn ${page === p ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p === 'beranda'
                ? 'Beranda'
                : p === 'abjad'
                ? 'Abjad'
                : p === 'kata'
                ? 'Kata'
                : p === 'latihan'
                ? 'Latihan'
                : 'Progres'}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {/* HALAMAN 1: BERANDA */}
        {page === 'beranda' && (
          <>
            {/* HERO */}
            <section className="hero">
              <div className="hero-text">
                <h1>Kenalan dulu dengan bahasa isyarat.</h1>
                <p className="tagline">
                  Isyarat adalah aplikasi untuk belajar SIBI, bahasa isyarat
                  resmi Indonesia. Dibuat supaya kamu bisa ngobrol langsung
                  dengan teman Tuli, bukan cuma lewat tulisan.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setPage('abjad')
                    handleOpenGesture(ABJAD_SIBI[0])
                  }}
                >
                  Mulai dari huruf A →
                </button>
              </div>
              <div className="hero-art-col">
                <HeroArt />
              </div>
            </section>

            {/* 3 KARTU MODUL BESAR */}
            <section className="module-grid" aria-label="Menu belajar">
              <button
                className="module-card module-teal"
                onClick={() => setPage('abjad')}
              >
                <Hand className="module-emoji" weight="duotone" size={32} />
                <span className="module-title">Abjad</span>
                <span className="module-sub">24 huruf statis SIBI (A-I, K-Y)</span>
              </button>
              <button
                className="module-card module-amber"
                onClick={() => setPage('kata')}
              >
                <ChatCenteredDots className="module-emoji" weight="duotone" size={32} />
                <span className="module-title">Kata</span>
                <span className="module-sub">16 kosakata dasar sehari-hari</span>
              </button>
              <button
                className="module-card module-peach"
                onClick={() => setPage('latihan')}
              >
                <Target className="module-emoji" weight="duotone" size={32} />
                <span className="module-title">Latihan</span>
                <span className="module-sub">Tebak & peragakan dengan kamera</span>
              </button>
            </section>

            {/* Teaser Kartu Huruf */}
            <section className="card teaser-card">
              <div className="teaser-head">
                <div>
                  <h2>Coba huruf pertama</h2>
                  <p className="sub-desc">Klik huruf di bawah untuk melihat cara memperagakannya.</p>
                </div>
                <button className="link-btn" onClick={() => setPage('abjad')}>
                  Lihat 24 Huruf →
                </button>
              </div>
              <div className="letter-grid teaser-grid">
                {TEASER_LETTERS.map((l) => {
                  const g = ABJAD_SIBI.find((item) => item.label === l)
                  return (
                    <button
                      key={l}
                      className="letter-tile"
                      onClick={() => handleOpenGesture(g)}
                      aria-label={`Buka panduan huruf ${l}`}
                    >
                      <span className="tile-inner">
                        <span className="tile-letter">{l}</span>
                        {g && g.gambar && (
                          <img src={g.gambar} alt={`Gestur ${l}`} className="tile-thumb" />
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Intro Cards */}
            <section className="intro-grid">
              <div className="card intro-card">
                <Hand className="intro-icon" weight="fill" size={26} />
                <h2>Apa itu bahasa isyarat?</h2>
                <p>
                  Bahasa isyarat adalah cara berkomunikasi memakai tangan,
                  ekspresi wajah, dan gerak tubuh. Ini bahasa sehari-hari
                  teman-teman Tuli.
                </p>
              </div>
              <div className="card intro-card">
                <Lightbulb className="intro-icon" weight="fill" size={26} />
                <h2>Kenapa belajar?</h2>
                <p>
                  Supaya teman Tuli tidak perlu selalu menulis atau memakai
                  perantara untuk bicara denganmu.
                </p>
              </div>
              <div className="card intro-card">
                <BookOpen className="intro-icon" weight="fill" size={26} />
                <h2>Apa itu SIBI?</h2>
                <p>
                  SIBI (Sistem Isyarat Bahasa Indonesia) adalah sistem isyarat
                  resmi pemerintah, satu tangan, ada kamus resminya.
                </p>
              </div>
            </section>

            {/* Steps */}
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

        {/* HALAMAN 2: ABJAD SIBI */}
        {page === 'abjad' && (
          <section className="page-section">
            <div className="page-head">
              <h2>Katalog Abjad SIBI</h2>
              <p className="page-desc">
                24 abjad statis satu tangan (A-I, K-Y). Klik huruf untuk melihat foto panduan dan posisi ruas jari.
              </p>
            </div>

            <div className="catalog-grid">
              {abjadList.map((g) => (
                <div
                  key={g.id}
                  className="catalog-card"
                  onClick={() => handleOpenGesture(g)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleOpenGesture(g)}
                >
                  <div className="catalog-card-img">
                    <img src={g.gambar} alt={`Gestur ${g.label}`} loading="lazy" />
                  </div>
                  <div className="catalog-card-body">
                    <span className="catalog-card-letter">{g.label}</span>
                    <span className="catalog-card-hint">Lihat panduan →</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="source-note">
              📖 Sumber panduan: <strong>{SUMBER_KONTEN.nama}</strong> ({SUMBER_KONTEN.penerbit})
            </div>
          </section>
        )}

        {/* HALAMAN 3: KATA SIBI */}
        {page === 'kata' && (
          <section className="page-section">
            <div className="page-head">
              <h2>Katalog Kata Dasar SIBI</h2>
              <p className="page-desc">
                Koleksi 16 kosakata dasar statis untuk percakapan sehari-hari.
              </p>
            </div>

            {/* Filter Topik */}
            <div className="filter-chips">
              {topics.map((t) => (
                <button
                  key={t}
                  className={`chip ${kataFilter === t ? 'active' : ''}`}
                  onClick={() => setKataFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="catalog-grid kata-grid-view">
              {kataList.map((g) => (
                <div
                  key={g.id}
                  className="catalog-card kata-card"
                  onClick={() => handleOpenGesture(g)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleOpenGesture(g)}
                >
                  <div className="catalog-card-img kata-img-wrap">
                    <img src={g.gambar} alt={`Gestur ${g.label}`} loading="lazy" />
                    <span className="badge-topic">{g.topik}</span>
                  </div>
                  <div className="catalog-card-body">
                    <strong className="kata-title">{g.label}</strong>
                    <p className="kata-summary">{g.ringkasan}</p>
                    <span className="catalog-card-hint">Buka detail →</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="source-note">
              📖 Sumber panduan: <strong>{SUMBER_KONTEN.nama}</strong> ({SUMBER_KONTEN.penerbit})
            </div>
          </section>
        )}

        {/* HALAMAN 4: LATIHAN (PLACEHOLDER T7) */}
        {page === 'latihan' && (
          <section className="card placeholder-card">
            <h2>Mode Latihan & Kuis</h2>
            <p>
              Fitur latihan interaktif kuis tebak gestur via webcam real-time (Ticket T7).
            </p>
            <div className="feature-preview-box">
              <Target className="preview-icon" weight="duotone" size={44} />
              <p>Kamu akan diberi tantangan memperagakan huruf di depan kamera dan dinilai kecocokannya oleh model AI.</p>
            </div>
          </section>
        )}

        {/* HALAMAN 5: PROGRES (PLACEHOLDER T8) */}
        {page === 'progres' && (
          <section className="card placeholder-card">
            <h2>Statistik & Penguasaan</h2>
            <p>
              Riwayat penguasaan gestur yang tersimpan lokal di browser kamu (Ticket T8).
            </p>
            <div className="feature-preview-box">
              <ChartBar className="preview-icon" weight="duotone" size={44} />
              <p>Mencatat huruf mana saja yang sudah berhasil diperagakan 3x berturut-turut.</p>
            </div>
          </section>
        )}
      </main>

      {/* MODAL DETAIL GESTUR */}
      {selectedGesture && (
        <GestureDetailModal
          gesture={selectedGesture}
          onClose={handleCloseModal}
          onLearn={(g) => {
            handleCloseModal()
            setPage('abjad')
          }}
        />
      )}

      <footer className="footer">
        Isyarat — Aplikasi Belajar SIBI · Capstone Proyek Sistem Aplikasi
      </footer>
    </div>
  )
}

export default App
