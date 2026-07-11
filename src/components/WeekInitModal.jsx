import { useState } from 'react'
import { getPhaseForWeek } from '../data/plan'

const PHASE_SHORT = { 1: 'Foundation', 2: 'Fuerza', 3: 'Peak' }

// One-time setup after the progression update: the user tells the app where
// they are in the program instead of the calendar deciding for them.
export default function WeekInitModal({ defaultWeek, onConfirm }) {
  const [week, setWeek] = useState(defaultWeek)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)

  const confirm = async () => {
    setSaving(true)
    setError(false)
    const { error: err } = await onConfirm(week)
    if (err) {
      setError(true)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <div className="w-full max-w-lg bg-[var(--color-gym-surface)] rounded-t-3xl p-6 pb-8">
        <h3 className="text-[var(--color-gym-text)] font-bold text-lg">¿En qué semana del plan estás?</h3>
        <p className="text-[var(--color-gym-muted)] text-sm mt-1 mb-4">
          Ahora tú controlas la semana — ya no avanza sola con el calendario.
          Puedes cambiarla cuando quieras desde el Dashboard.
        </p>

        <div className="grid grid-cols-6 gap-1.5 mb-4">
          {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
            <button
              key={w}
              onClick={() => setWeek(w)}
              className={`py-2 rounded-xl text-sm font-semibold transition-colors ${
                week === w
                  ? 'bg-[var(--color-gym-accent)] text-white'
                  : 'bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] text-[var(--color-gym-muted)]'
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <p className="text-[var(--color-gym-muted)] text-xs mb-4 text-center">
          Semana {week} · Phase {getPhaseForWeek(week)} ({PHASE_SHORT[getPhaseForWeek(week)]})
          {week === 23 ? ' · Deload' : ''}
        </p>

        <button
          onClick={confirm}
          disabled={saving}
          className="w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : `Empezar en la semana ${week}`}
        </button>
        {error && (
          <p className="text-[var(--color-gym-danger)] text-xs mt-2 text-center">
            No se pudo guardar. Verifica tu conexión e intenta de nuevo.
          </p>
        )}
      </div>
    </div>
  )
}
