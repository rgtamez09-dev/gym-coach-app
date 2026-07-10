import { useEffect } from 'react'
import { useWorkoutStore } from '../store/workoutStore'

export default function RestTimer() {
  const { timerSeconds, timerActive, stopTimer, syncTimer } = useWorkoutStore()

  // Intervals stay suspended while the screen is locked — resync from the
  // deadline as soon as the app is visible again instead of waiting a tick.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') syncTimer()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [syncTimer])

  if (!timerActive && timerSeconds === 0) return null

  const mins = Math.floor(timerSeconds / 60)
  const secs = timerSeconds % 60
  const display = `${mins}:${secs.toString().padStart(2, '0')}`

  return (
    <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-accent)]/50 rounded-xl px-4 py-2.5 mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">Descanso</p>
        <p className="text-[var(--color-gym-accent)] font-mono text-2xl font-bold leading-none">
          {display}
        </p>
      </div>
      <button
        onClick={stopTimer}
        className="text-[var(--color-gym-muted)] hover:text-[var(--color-gym-text)] text-xs border border-[var(--color-gym-border)] rounded-lg px-2.5 py-1.5 transition-colors"
      >
        Saltar
      </button>
    </div>
  )
}
