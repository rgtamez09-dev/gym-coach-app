import { Link } from 'react-router-dom'
import { getCurrentWeek, getCurrentPhase } from '../data/plan'
import Nav from '../components/Nav'

const PHASE_LABELS = {
  1: 'Phase 1 — Foundation + Rehab',
  2: 'Phase 2 — Fuerza + Hipertrofia',
  3: 'Phase 3 — Athletic Peak',
}

const PHASE_RANGES = { 1: [1, 8], 2: [9, 16], 3: [17, 24] }

const PHASE_CHANGES = {
  2: [
    'Reps → 5-8 en compuestos, cargas más altas',
    'Introduce Trap Bar Deadlift (hip hinge pesado, más seguro)',
    'Nordic Curl — progresión asistida → libre',
    'Weighted calistenia: apuntar a +15-20 kg en pullups/dips',
    'Explosive split squat jump en sesión D (si tobillo lo permite)',
  ],
  3: [
    'Cluster sets en compuestos: 6×(3 + 15s rest + 3)',
    'Rotational core específico tenis: cable woodchop, pallof rotacional',
    'Split squat jumps + box step-ups para potencia',
    'Semana 21-22: reducción progresiva de volumen',
    'Semana 23: deload completo',
    'Semana 24: evaluación de PRs + foto de progreso',
  ],
}

const WEEK_SCHEDULE = [
  { day: 'Lun', session: 'A', label: 'Push', color: 'text-[var(--color-gym-accent)]' },
  { day: 'Mar', session: 'B', label: 'Lower', color: 'text-[var(--color-gym-success)]' },
  { day: 'Mié', session: '—', label: 'Descanso', color: 'text-[var(--color-gym-muted)]' },
  { day: 'Jue', session: 'C', label: 'Pull', color: 'text-[var(--color-gym-warning)]' },
  { day: 'Vie', session: '🎾', label: 'Tenis', color: 'text-[var(--color-gym-muted)]' },
  { day: 'Sáb', session: 'D?', label: 'Athletic', color: 'text-purple-400' },
  { day: 'Dom', session: '—', label: 'Descanso', color: 'text-[var(--color-gym-muted)]' },
]

export default function Program() {
  const currentWeek = getCurrentWeek()
  const currentPhase = getCurrentPhase(currentWeek)

  return (
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-gym-text)]">Plan de entrenamiento</h1>
          <p className="text-[var(--color-gym-muted)] text-sm mt-1">6 meses · 24 semanas</p>
        </div>

        {/* Current status */}
        <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-accent)]/40 rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">Estás aquí</p>
              <p className="text-[var(--color-gym-text)] font-semibold mt-0.5">{PHASE_LABELS[currentPhase]}</p>
            </div>
            <div className="text-right">
              <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">Semana</p>
              <p className="text-[var(--color-gym-accent)] font-bold text-4xl leading-none mt-0.5">{currentWeek}</p>
            </div>
          </div>
        </div>

        {/* Weekly schedule */}
        <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-5">
          <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-3">Distribución semanal</p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEK_SCHEDULE.map(({ day, session, color }) => (
              <div key={day}>
                <p className="text-[var(--color-gym-muted)] text-[10px]">{day}</p>
                <p className={`font-bold text-sm mt-1 ${color}`}>{session}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {WEEK_SCHEDULE.filter((s) => !['—', '🎾'].includes(s.session)).map(({ session, label, color }) => (
              <span key={session} className={`text-xs ${color}`}>
                {session} — {label}
              </span>
            ))}
          </div>
        </div>

        {/* Phases */}
        {[1, 2, 3].map((phase) => {
          const [start, end] = PHASE_RANGES[phase]
          const isCurrent = phase === currentPhase
          const isPast = phase < currentPhase

          return (
            <div key={phase} className="mb-4">
              <div className={`rounded-2xl border overflow-hidden ${isCurrent ? 'border-[var(--color-gym-accent)]/50' : 'border-[var(--color-gym-border)]'}`}>
                {/* Phase header */}
                <div className={`p-4 ${isCurrent ? 'bg-[var(--color-gym-accent)]/10' : 'bg-[var(--color-gym-surface)]'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-bold ${isPast ? 'text-[var(--color-gym-muted)]' : 'text-[var(--color-gym-text)]'}`}>
                        {PHASE_LABELS[phase]}
                      </p>
                      <p className="text-[var(--color-gym-muted)] text-xs mt-0.5">Semanas {start}–{end}</p>
                    </div>
                    {isCurrent && (
                      <span className="text-xs bg-[var(--color-gym-accent)] text-white px-2 py-1 rounded-full">Activo</span>
                    )}
                    {isPast && (
                      <span className="text-[var(--color-gym-success)] text-xs">✓ Completado</span>
                    )}
                  </div>
                </div>

                {/* Weeks grid */}
                <div className="p-3 bg-[var(--color-gym-bg)] grid grid-cols-4 gap-1.5">
                  {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((week) => {
                    const isNow = week === currentWeek
                    const past = week < currentWeek
                    return (
                      <div
                        key={week}
                        className={`rounded-xl py-2 px-1 text-center text-xs ${
                          isNow
                            ? 'bg-[var(--color-gym-accent)] text-white font-bold'
                            : past
                            ? 'bg-[var(--color-gym-surface)] text-[var(--color-gym-muted)]'
                            : 'bg-[var(--color-gym-surface)] text-[var(--color-gym-text)]'
                        }`}
                      >
                        <p className="font-semibold">Sem {week}</p>
                        {week === 23 && <p className="text-[9px] mt-0.5 opacity-80">Deload</p>}
                      </div>
                    )
                  })}
                </div>

                {/* Phase changes */}
                {PHASE_CHANGES[phase] && (
                  <div className="px-4 py-3 bg-[var(--color-gym-surface)] border-t border-[var(--color-gym-border)]">
                    <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-2">Cambios clave</p>
                    <div className="space-y-1">
                      {PHASE_CHANGES[phase].map((change, i) => (
                        <p key={i} className="text-[var(--color-gym-text)] text-xs">· {change}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Nutrition link */}
        <Link
          to="/nutrition"
          className="block bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 hover:border-[var(--color-gym-accent)]/50 transition-colors"
        >
          <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">Complemento</p>
          <p className="text-[var(--color-gym-text)] font-semibold mt-0.5">Guía de nutrición →</p>
          <p className="text-[var(--color-gym-muted)] text-xs mt-0.5">Macros, timing, suplementos</p>
        </Link>
      </div>
      <Nav />
    </div>
  )
}
