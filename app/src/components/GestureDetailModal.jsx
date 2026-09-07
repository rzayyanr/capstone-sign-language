export default function GestureDetailModal({ gesture, onClose, onLearn }) {
  if (!gesture) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="badge-category">{gesture.kategori === 'abjad' ? 'Abjad SIBI' : `Kata · ${gesture.topik || 'Umum'}`}</span>
            <h2>{gesture.label}</h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Tutup modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Gambar Panduan */}
          <div className="detail-img-box">
            <img src={gesture.gambar} alt={`Panduan gestur ${gesture.label}`} />
            <span className="tag-source">Sumber: Kamus SIBI</span>
          </div>

          {/* Penjelasan & Langkah */}
          <div className="detail-info">
            <p className="detail-summary">{gesture.ringkasan}</p>

            <div className="detail-steps-section">
              <h3>Cara Membentuk Gestur:</h3>
              <ol className="detail-steps-list">
                {gesture.teksLangkah.map((step, idx) => (
                  <li key={idx}>
                    <span className="step-badge">{idx + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {gesture.tipsGeometri && (
              <div className="tips-box">
                <strong>💡 Kunci Posisi Jari:</strong> {gesture.tipsGeometri}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Tutup
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              if (onLearn) onLearn(gesture)
            }}
          >
            Latih di Kamera (T5) →
          </button>
        </div>
      </div>
    </div>
  )
}
