export default function SessionPlanModal({ exercises, sessionSets, currentIdx, onNavigate, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-[var(--color-gym-surface)] rounded-t-3xl w-full max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[var(--color-gym-text)] font-bold text-xl">Plan de sesión</h3>
            <button
              onClick={onClose}
              className="text-[var(--color-gym-muted)] text-3xl leading-none hover:text-[var(--color-gym-text)] transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            {exercises.map((ex, idx) => {
              const done = sessionSets.some((s) => s.exercise_name === ex.exercise_name)
              const isCurrent = idx === currentIdx

              let textColor = 'text-[var(--color-gym-text)]'
              let borderColor = 'border-[var(--color-gym-border)]'
              let bgColor = 'bg-[var(--color-gym-bg)]'
              let statusColor = 'text-[var(--color-gym-muted)]'
              let prefix = ''

              if (isCurrent) {
                textColor = 'text-[var(--color-gym-accent)]'
                borderColor = 'border-[var(--color-gym-accent)]'
                bgColor = 'bg-[var(--color-gym-accent)]/5'
                statusColor = 'text-[var(--color-gym-accent)]'
                prefix = '▶ '
              } else if (done) {
                textColor = 'text-[var(--color-gym-success)]'
                borderColor = 'border-[var(--color-gym-success)]/30'
                bgColor = 'bg-[var(--color-gym-success)]/5'
                statusColor = 'text-[var(--color-gym-success)]'
                prefix = '✓ '
              }

              return (
                <button
                  key={idx}
                  onClick={() => { onNavigate(idx); onClose() }}
                  className={`w-full ${bgColor} border ${borderColor} rounded-xl px-4 py-3 text-left transition-colors`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold text-sm ${textColor} truncate`}>
                      {prefix}{ex.exercise_name}
                    </p>
                    <p className={`text-xs shrink-0 ${statusColor}`}>{ex.sets} × {ex.reps}</p>
                  </div>
                  {ex.superset_with && (
                    <p className="text-[var(--color-gym-accent)] text-xs mt-0.5">
                      Superset con {ex.superset_with}
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          <p className="text-[var(--color-gym-muted)] text-xs text-center mt-5">
            Toca un ejercicio para ir a él directamente
          </p>
        </div>
      </div>
    </div>
  )
}
