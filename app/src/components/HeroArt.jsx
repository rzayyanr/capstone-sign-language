// Ilustrasi Hero Beranda menggunakan file foto PNG resmi gestur tangan huruf A (SIBI)
export default function HeroArt() {
  return (
    <div className="hero-art" role="img" aria-label="Foto panduan gestur tangan huruf A SIBI">
      <div className="hero-art-container">
        {/* Lingkaran latar belakang kartu */}
        <div className="hero-art-circle">
          <img
            src="/assets/letters/A.png"
            alt="Gestur Huruf A SIBI"
            className="hero-art-img"
          />
        </div>

        {/* Badge Aksen Huruf A */}
        <div className="hero-art-badge">
          <span>A</span>
        </div>
      </div>
    </div>
  )
}
