import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useWorkoutStore } from '../store/workoutStore'

export default function SubstituteModal({ exerciseIdx, exerciseName, exerciseInfo, onClose }) {
  const substituteExercise = useWorkoutStore((s) => s.substituteExercise)
  const [alternatives, setAlternatives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchAlternatives = async () => {
    if (!exerciseInfo) {
      setLoading(false)
      return
    }
    if (!exerciseInfo.muscle_groups?.length) {
      setLoading(false)
      return
    }

    const { data, error: fetchErr } = await supabase
      .from('exercises')
      .select('id, name_en, name_es, muscle_groups')
      .neq('name_en', exerciseName)
      .overlaps('muscle_groups', exerciseInfo.muscle_groups)
      .order('name_en')
      .limit(8)

    if (fetchErr) {
      setError(true)
    } else {
      setAlternatives(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlternatives()
  }, [])

  const handleSubstitute = (newName) => {
    substituteExercise(exerciseIdx, newName)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-[var(--color-gym-surface)] rounded-t-3xl p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-[var(--color-gym-text)] font-bold text-lg">Sustituir ejercicio</h3>
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">{exerciseName}</p>
          </div>
          <button onClick={onClose} className="text-[var(--color-gym-muted)] text-2xl leading-none hover:text-[var(--color-gym-text)]">
            ×
          </button>
        </div>

        {loading ? (
          <p className="text-[var(--color-gym-muted)] text-sm">Buscando alternativas...</p>
        ) : error ? (
          <p className="text-[var(--color-gym-danger)] text-sm">No se pudieron cargar las alternativas. Verifica tu conexión.</p>
        ) : !exerciseInfo ? (
          <p className="text-[var(--color-gym-muted)] text-sm">
            Este ejercicio no tiene datos en la librería — no se pueden buscar alternativas por músculo.
          </p>
        ) : alternatives.length === 0 ? (
          <p className="text-[var(--color-gym-muted)] text-sm">No se encontraron alternativas para los músculos de este ejercicio.</p>
        ) : (
          <div className="space-y-2">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-3">Alternativas — mismos músculos</p>
            {alternatives.map((alt) => (
              <button
                key={alt.id}
                onClick={() => handleSubstitute(alt.name_en)}
                className="w-full bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] rounded-xl px-4 py-3 text-left hover:border-[var(--color-gym-accent)] transition-colors"
              >
                <p className="text-[var(--color-gym-text)] font-semibold text-sm">{alt.name_en}</p>
                <p className="text-[var(--color-gym-muted)] text-xs mt-0.5">
                  {(alt.muscle_groups || []).join(' · ')}
                </p>
              </button>
            ))}
          </div>
        )}

        <p className="text-[var(--color-gym-muted)] text-xs mt-4 text-center">
          El cambio aplica solo para esta sesión
        </p>
      </div>
    </div>
  )
}
