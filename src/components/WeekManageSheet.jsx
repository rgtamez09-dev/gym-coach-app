import { useState } from 'react'
import { getPhaseForWeek } from '../data/plan'

function nextWeekNote(week) {
  const next = Math.min(24, week + 1)
  if (next === 23) return 'La semana 23 es deload — volumen reducido a propósito.'
  if (getPhaseForWeek(next) > getPhaseForWeek(week))
    return `La semana ${next} inicia la Phase ${getPhaseForWeek(next)} — cambian cargas y rangos de reps.`
  return null
}

// Bottom sheet with the three always-available week actions (PRD §3.3):
// advance, repeat, choose. The calendar never does any of this on its own.
export default function WeekManageSheet({ planWeek, onSetWeek, onClose }) {
  const [picking, setPicking] = useState(false)
  const [pickedWeek, setPickedWeek] = useState(planWeek)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)

  const apply = async (week) => {
    setSaving(true)
    setError(false)
    const { error: err } = await onSetWeek(week)
    if (err) {
      setError(true)
      setSaving(false)
      return
    }
    onClose()
  }

  const note = nextWeekNote(planWeek)

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[var(--color-gym-surface)] rounded-t-3xl p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-[var(--color-gym-text)] font-bold text-lg">Gestionar semana</h3>
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">
              Estás en la semana {planWeek} · Phase {getPhaseForWeek(planWeek)}
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--color-gym-muted)] text-2xl leading-none hover:text-[var(--color-gym-text)]">
            ×
          </button>
        </div>

        {!picking ? (
          <div className="space-y-2">
            <button
              onClick={() => apply(planWeek + 1)}
              disabled={saving || planWeek >= 24}
              className="w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-40 text-left px-4"
            >
              Avanzar a la semana {Math.min(24, planWeek + 1)} →
            </button>
            {note && (
              <p className="text-[var(--color-gym-warning)] text-xs px-1">{note}</p>
            )}
            <button
              onClick={() => apply(planWeek)}
              disabled={saving}
              className="w-full bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] text-[var(--color-gym-text)] py-3 rounded-xl hover:border-[var(--color-gym-accent)] transition-colors disabled:opacity-40 text-left px-4"
            >
              Repetir la semana {planWeek} desde hoy
            </button>
            <button
              onClick={() => setPicking(true)}
              disabled={saving}
              className="w-full bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] text-[var(--color-gym-text)] py-3 rounded-xl hover:border-[var(--color-gym-accent)] transition-colors disabled:opacity-40 text-left px-4"
            >
              Elegir otra semana...
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-6 gap-1.5 mb-4">
              {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
                <button
                  key={w}
                  onClick={() => setPickedWeek(w)}
                  className={`py-2 rounded-xl text-sm font-semibold transition-colors ${
                    pickedWeek === w
                      ? 'bg-[var(--color-gym-accent)] text-white'
                      : 'bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] text-[var(--color-gym-muted)]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <p className="text-[var(--color-gym-muted)] text-xs mb-3 text-center">
              Semana {pickedWeek} · Phase {getPhaseForWeek(pickedWeek)}
              {pickedWeek === 23 ? ' · Deload' : ''}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPicking(false)}
                disabled={saving}
                className="flex-1 bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] text-[var(--color-gym-text)] py-3 rounded-xl"
              >
                Volver
              </button>
              <button
                onClick={() => apply(pickedWeek)}
                disabled={saving}
                className="flex-1 bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : `Ir a la semana ${pickedWeek}`}
              </button>
            </div>
          </>
        )}
        {error && (
          <p className="text-[var(--color-gym-danger)] text-xs mt-3 text-center">
            No se pudo guardar el cambio. Intenta de nuevo.
          </p>
        )}
      </div>
    </div>
  )
}
