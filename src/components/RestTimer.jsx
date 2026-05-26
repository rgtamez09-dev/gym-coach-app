import { useWorkoutStore } from '../store/workoutStore'

export default function RestTimer() {
  const { timerSeconds, timerActive, stopTimer } = useWorkoutStore()
  if (!timerActive && timerSeconds === 0) return null

  const mins = Math.floor(timerSeconds / 60)
  const secs = timerSeconds % 60
  const display = `${mins}:${secs.toString().padStart(2, '0')}`

  return (
    <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-accent)]/50 rounded-2xl p-4 mb-4 flex items-center justify-between">
      <div>
        <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">Descanso</p>
        <p className="text-[var(--color-gym-accent)] font-mono text-4xl font-bold leading-none mt-1">
          {display}
        </p>
      </div>
      <button
        onClick={stopTimer}
        className="text-[var(--color-gym-muted)] hover:text-[var(--color-gym-text)] text-sm border border-[var(--color-gym-border)] rounded-lg px-3 py-2 transition-colors"
      >
        Saltar
      </button>
    </div>
  )
}
