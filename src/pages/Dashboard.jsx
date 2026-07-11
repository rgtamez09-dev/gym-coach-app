import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useWorkoutStore } from '../store/workoutStore'
import { supabase } from '../lib/supabase'
import { getCurrentWeek, getCurrentPhase, getTodayDayType, getMondayOfCurrentWeek } from '../data/plan'
import Nav from '../components/Nav'
import ErrorState from '../components/ErrorState'

const DAY_LABELS = {
  push: 'Sesión A — Upper Push',
  lower: 'Sesión B — Lower + Hip',
  pull: 'Sesión C — Upper Pull + Arms',
  athletic: 'Sesión D — Athletic + Core',
}

const SESSION_TYPES = [
  { type: 'push', label: 'A · Push' },
  { type: 'lower', label: 'B · Lower' },
  { type: 'pull', label: 'C · Pull' },
  { type: 'athletic', label: 'D · Athletic' },
]

const PHASE_LABELS = {
  1: 'Phase 1: Foundation + Rehab',
  2: 'Phase 2: Fuerza + Hipertrofia',
  3: 'Phase 3: Athletic Peak',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const setActiveSession = useWorkoutStore((s) => s.setActiveSession)
  const activeSession = useWorkoutStore((s) => s.activeSession)

  const [template, setTemplate] = useState(null)
  const [sessionsThisWeek, setSessionsThisWeek] = useState(0)
  const [lastPR, setLastPR] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [starting, setStarting] = useState(false)
  const [startError, setStartError] = useState(false)
  const [selectedType, setSelectedType] = useState(null)

  const week = getCurrentWeek()
  const phase = getCurrentPhase(week)
  const todayType = getTodayDayType()
  const activeType = selectedType ?? todayType

  const fetchDashboardData = useCallback(async () => {
    setError(false)
    try {
      const [countRes, prRes] = await Promise.all([
        supabase
          .from('sessions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('completed', true)
          .gte('date', getMondayOfCurrentWeek()),

        supabase
          .from('sets')
          .select('weight_kg, reps, sessions!inner(user_id), exercises(name_en)')
          .eq('sessions.user_id', user.id)
          .eq('completed', true)
          .not('weight_kg', 'is', null)
          .order('weight_kg', { ascending: false })
          .limit(1),
      ])

      if (countRes.error || prRes.error) throw new Error('fetch failed')

      setSessionsThisWeek(countRes.count || 0)
      if (prRes.data?.length) setLastPR(prRes.data[0])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    const loadTemplate = async () => {
      if (!activeType) { setTemplate(null); return }
      const { data } = await supabase
        .from('session_templates')
        .select('*')
        .eq('phase', phase)
        .eq('day_type', activeType)
        .limit(1)
      setTemplate(data?.length ? data[0] : null)
    }
    loadTemplate()
  }, [activeType, phase])

  const handleStartSession = async () => {
    if (!template) return
    if (activeSession) return
    setStarting(true)
    setStartError(false)
    const today = new Date().toISOString().split('T')[0]

    // Lookup-before-insert: resume an existing incomplete session for this
    // template today instead of creating a duplicate (prevents ghost rows).
    const { data: existing, error: lookupError } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_id', template.id)
      .eq('date', today)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(1)

    // If the lookup itself failed, do NOT fall through to insert — that would
    // create the duplicate ghost row this block exists to prevent.
    if (lookupError) {
      setStartError(true)
      setStarting(false)
      return
    }

    if (existing?.length) {
      setActiveSession({ ...existing[0], exercises: template.exercise_list, day_label: template.day_label })
      navigate('/workout')
      setStarting(false)
      return
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, template_id: template.id, date: today })
      .select()
      .single()

    if (sessionError || !session) {
      setStartError(true)
      setStarting(false)
      return
    }

    setActiveSession({ ...session, exercises: template.exercise_list, day_label: template.day_label })
    navigate('/workout')
    setStarting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-gym-bg)] flex items-center justify-center">
        <p className="text-[var(--color-gym-muted)]">Cargando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-gym-bg)] flex flex-col items-center justify-center px-4 gap-4">
        <ErrorState onRetry={fetchDashboardData} />
        <Nav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[var(--color-gym-muted)] text-sm">Bienvenido</p>
            <h1 className="text-2xl font-bold text-[var(--color-gym-text)]">Dashboard</h1>
          </div>
          <button
            onClick={signOut}
            className="text-[var(--color-gym-muted)] text-sm hover:text-[var(--color-gym-text)] transition-colors mt-1"
          >
            Salir
          </button>
        </div>

        {/* Phase + Week */}
        <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">Fase actual</p>
              <p className="text-[var(--color-gym-text)] font-semibold mt-0.5">{PHASE_LABELS[phase]}</p>
            </div>
            <div className="text-right">
              <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">Semana</p>
              <p className="text-[var(--color-gym-accent)] font-bold text-3xl leading-none mt-0.5">{week}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < sessionsThisWeek ? 'bg-[var(--color-gym-accent)]' : 'bg-[var(--color-gym-border)]'
                }`}
              />
            ))}
          </div>
          <p className="text-[var(--color-gym-muted)] text-xs mt-1.5">
            {sessionsThisWeek} de 4 sesiones esta semana
          </p>
          {sessionsThisWeek === 0 && (
            <p className="text-[var(--color-gym-accent)] text-xs mt-1">
              Elige una sesión abajo y empieza tu primera sesión de la semana
            </p>
          )}
        </div>

        {/* Today's session or rest */}
        {activeSession ? (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-accent)] rounded-2xl p-4 mb-4">
            <p className="text-[var(--color-gym-accent)] text-xs uppercase tracking-wide mb-1 font-semibold">
              Sesión en curso
            </p>
            <p className="text-[var(--color-gym-text)] font-semibold text-lg">
              {activeSession.day_label || 'Sesión activa'}
            </p>
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">
              {activeSession.exercises?.length ?? 0} ejercicios · iniciada{' '}
              {activeSession.created_at
                ? new Date(activeSession.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                : ''}
            </p>
            <button
              onClick={() => navigate('/workout')}
              className="mt-4 w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Reanudar sesión
            </button>
            <p className="text-[var(--color-gym-muted)] text-xs mt-2 text-center">
              Finaliza o descarta tu sesión en curso para empezar otra
            </p>
          </div>
        ) : activeType && template ? (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-accent)]/30 rounded-2xl p-4 mb-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">
              {selectedType && selectedType !== todayType ? 'Sesión seleccionada' : 'Sesión de hoy'}
            </p>
            <p className="text-[var(--color-gym-text)] font-semibold text-lg">{DAY_LABELS[activeType]}</p>
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">
              {template.exercise_list.length} ejercicios
            </p>
            <button
              onClick={handleStartSession}
              disabled={starting}
              className="mt-4 w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {starting ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
            {startError && (
              <p className="text-[var(--color-gym-danger)] text-xs mt-2 text-center">
                No se pudo crear la sesión. Verifica tu conexión e intenta de nuevo.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">Hoy</p>
            <p className="text-[var(--color-gym-text)] font-semibold">Día de descanso</p>
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">Tenis, movilidad o descanso activo</p>
          </div>
        )}

        {/* Session type selector */}
        <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-4">
          <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-3">Elegir sesión</p>
          <div className="grid grid-cols-2 gap-2">
            {SESSION_TYPES.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  activeType === type
                    ? 'bg-[var(--color-gym-accent)] text-white'
                    : 'bg-[var(--color-gym-border)]/30 text-[var(--color-gym-muted)] hover:text-[var(--color-gym-text)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Last PR */}
        {lastPR?.weight_kg ? (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">Mejor marca</p>
            <p className="text-[var(--color-gym-text)] font-semibold">{lastPR.exercises?.name_en}</p>
            <p className="text-[var(--color-gym-warning)] font-bold text-2xl mt-1">
              {lastPR.weight_kg} kg × {lastPR.reps} reps
            </p>
          </div>
        ) : (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">PRs</p>
            <p className="text-[var(--color-gym-muted)] text-sm">Registra tu primera sesión para ver tus PRs aquí</p>
          </div>
        )}
      </div>
      <Nav />
    </div>
  )
}
