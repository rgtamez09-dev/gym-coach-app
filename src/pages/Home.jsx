import { useState, useEffect, useRef } from 'react'
import { HOME_ROUTINES } from '../data/homeRoutines'
import Nav from '../components/Nav'

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function ActiveRoutine({ routine, onBack }) {
  const [exIdx, setExIdx] = useState(0)
  const [phase, setPhase] = useState('exercise') // 'exercise' | 'rest' | 'done'
  const [secondsLeft, setSecondsLeft] = useState(routine.exercises[0].duration_sec)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (phase === 'done') return

    const ex = routine.exercises[exIdx]
    const duration = phase === 'exercise' ? ex.duration_sec : ex.rest_sec

    clearInterval(intervalRef.current)
    setSecondsLeft(duration)

    let remaining = duration
    intervalRef.current = setInterval(() => {
      remaining--
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        clearInterval(intervalRef.current)
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200])

        const isLast = exIdx === routine.exercises.length - 1
        if (phase === 'exercise') {
          if (ex.rest_sec > 0) {
            setPhase('rest')
          } else if (isLast) {
            setPhase('done')
          } else {
            setExIdx((i) => i + 1)
          }
        } else {
          if (isLast) {
            setPhase('done')
          } else {
            setExIdx((i) => i + 1)
            setPhase('exercise')
          }
        }
      }
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [exIdx, phase])

  const skip = () => {
    clearInterval(intervalRef.current)
    const ex = routine.exercises[exIdx]
    const isLast = exIdx === routine.exercises.length - 1
    if (phase === 'exercise') {
      if (ex.rest_sec > 0) {
        setPhase('rest')
      } else if (isLast) {
        setPhase('done')
      } else {
        setExIdx((i) => i + 1)
      }
    } else {
      if (isLast) {
        setPhase('done')
      } else {
        setExIdx((i) => i + 1)
        setPhase('exercise')
      }
    }
  }

  const ex = routine.exercises[exIdx]
  const isRest = phase === 'rest'

  if (phase === 'done') {
    return (
      <div className="min-h-screen bg-[var(--color-gym-bg)] flex flex-col items-center justify-center px-4">
        <span className="text-6xl mb-4">✅</span>
        <h2 className="text-2xl font-bold text-[var(--color-gym-text)] mb-2">¡Rutina completada!</h2>
        <p className="text-[var(--color-gym-muted)] mb-8">{routine.title}</p>
        <button
          onClick={onBack}
          className="bg-[var(--color-gym-accent)] text-white font-semibold px-8 py-3 rounded-xl"
        >
          Volver a rutinas
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-8">
      <div className="max-w-lg mx-auto px-4">
        <div className="pt-6 pb-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-[var(--color-gym-muted)] hover:text-[var(--color-gym-text)] transition-colors"
          >
            ← Volver
          </button>
          <h2 className="text-[var(--color-gym-text)] font-bold text-lg flex-1 truncate">{routine.title}</h2>
          <p className="text-[var(--color-gym-muted)] text-sm shrink-0">
            {exIdx + 1}/{routine.exercises.length}
          </p>
        </div>

        <p className={`text-xs uppercase tracking-widest font-semibold mb-2 ${isRest ? 'text-[var(--color-gym-success)]' : 'text-[var(--color-gym-accent)]'}`}>
          {isRest ? 'Descanso' : 'Ejercicio'}
        </p>

        <h3 className="text-[var(--color-gym-text)] font-bold text-2xl mb-1">{ex.name}</h3>
        <p className="text-[var(--color-gym-muted)] text-sm mb-8">
          {isRest ? 'Recupera y prepárate para el siguiente' : ex.instruction}
        </p>

        <div className="flex items-center justify-center mb-8">
          <div className="w-48 h-48 rounded-full border-4 border-[var(--color-gym-accent)]/30 flex items-center justify-center bg-[var(--color-gym-surface)]">
            <span className={`text-5xl font-bold ${isRest ? 'text-[var(--color-gym-success)]' : 'text-[var(--color-gym-text)]'}`}>
              {formatTime(secondsLeft)}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 mb-6">
          {routine.exercises.map((e, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                i === exIdx
                  ? 'bg-[var(--color-gym-accent)]/15 border border-[var(--color-gym-accent)]/30 text-[var(--color-gym-text)]'
                  : i < exIdx
                  ? 'text-[var(--color-gym-muted)] line-through'
                  : 'text-[var(--color-gym-muted)]'
              }`}
            >
              <span className="w-4 text-center shrink-0">
                {i < exIdx ? '✓' : i === exIdx ? '▶' : `${i + 1}`}
              </span>
              <span className="flex-1">{e.name}</span>
              <span className="text-xs shrink-0">{formatTime(e.duration_sec)}</span>
            </div>
          ))}
        </div>

        <button
          onClick={skip}
          className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] text-[var(--color-gym-muted)] py-3 rounded-xl hover:text-[var(--color-gym-text)] transition-colors"
        >
          {isRest ? 'Saltar descanso →' : 'Saltar ejercicio →'}
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [activeRoutine, setActiveRoutine] = useState(null)

  if (activeRoutine) {
    return <ActiveRoutine routine={activeRoutine} onBack={() => setActiveRoutine(null)} />
  }

  return (
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-gym-text)]">Casa</h1>
          <p className="text-[var(--color-gym-muted)] text-sm mt-1">Rutinas sin equipo — solo tapete</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {HOME_ROUTINES.map((routine) => (
            <div
              key={routine.id}
              className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 cursor-pointer hover:border-[var(--color-gym-accent)]/50 transition-colors"
              onClick={() => setActiveRoutine(routine)}
            >
              <span className="text-3xl">{routine.icon}</span>
              <h3 className="text-[var(--color-gym-text)] font-semibold mt-2 leading-tight text-sm">{routine.title}</h3>
              <p className="text-[var(--color-gym-muted)] text-xs mt-1">{routine.duration_min} min</p>
              <p className="text-[var(--color-gym-muted)] text-xs">{routine.exercises.length} ejercicios</p>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveRoutine(routine) }}
                className="mt-3 w-full bg-[var(--color-gym-accent)] text-white text-xs font-semibold py-2 rounded-xl hover:bg-[var(--color-gym-accent-hover)] transition-colors"
              >
                Empezar
              </button>
            </div>
          ))}
        </div>
      </div>
      <Nav />
    </div>
  )
}
