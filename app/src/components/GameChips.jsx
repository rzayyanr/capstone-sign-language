import { useState, useEffect } from 'react'
import { Flame, Lightning } from '@phosphor-icons/react'
import { getGamification, subscribeGamification } from '../modules/gamification'

/**
 * Chip status ala Duolingo di header: 🔥 streak hari + ⚡ XP.
 * Berlangganan ke modul gamification → ikut re-render saat XP/streak berubah
 * (mis. habis menjawab benar di mode latihan).
 */
export default function GameChips() {
  const [stats, setStats] = useState(() => getGamification())

  useEffect(() => subscribeGamification(() => setStats(getGamification())), [])

  return (
    <div className="game-chips" aria-label="Statistik belajar">
      <span className="game-chip chip-streak" title="Hari belajar beruntun">
        <span className="chip-icon chip-icon-streak">
          <Flame weight="fill" size={16} />
        </span>
        <span className="chip-value">{stats.streak}</span>
      </span>
      <span className="game-chip chip-xp" title="Total XP">
        <span className="chip-icon chip-icon-xp">
          <Lightning weight="fill" size={16} />
        </span>
        <span className="chip-value">{stats.xp}</span>
      </span>
    </div>
  )
}
