import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useWorkoutStore } from '../store/workoutStore'
import { supabase } from '../lib/supabase'
import { getCurrentWeek, getCurrentPhase, getTodayDayType, getMondayOfCurrentWeek } from '../data/plan'
import Nav from '../components/Nav'

const DAY_LABELS = {
  push: 'Sesión A — Upper Push',
  lower: 'Sesión B — Lower + Hip',
  pull: 'Sesión C — Upper Pull + Arms',
  athletic: 'Sesión D — Athletic + Core',
}

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

  const [template, setTemplate] = useState(null)
  const [sessionsThisWeek, setSessionsThisWeek] = useState(0)
  const [lastPR, setLastPR] = useState(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  const week = getCurrentWeek()
  const phase = getCurrentPhase(week)
  const todayType = getTodayDayType()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const [templateRes, countRes, prRes] = await Promise.all([
      todayType
        ? supabase
            .from('session_templates')
            .select('*')
            .eq('phase', phase)
            .eq('day_type', todayType)
            .limit(1)
        : Promise.resolve({ data: [] }),

      supabase
        .from('sessions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('date', getMondayOfCurrentWeek()),

      supabase
        .from('sets')
        .select('weight_kg, reps, exercises(name_en)')
        .eq('completed', true)
        .not('weight_kg', 'is', null)
        .order('weight_kg', { ascending: false })
        .limit(1),
    ])

    if (templateRes.data?.length) setTemplate(templateRes.data[0])
    setSessionsThisWeek(countRes.count || 0)
    if (prRes.data?.length) setLastPR(prRes.data[0])
    setLoading(false)
  }

  const handleStartSession = async () => {
    if (!template) return
    setStarting(true)
    const today = new Date().toISOString().split('T')[0]
    const { data: session } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, template_id: template.id, date: today })
      .select()
      .single()

    if (session) {
      setActiveSession({ ...session, exercises: template.exercise_list })
      navigate('/workout')
    }
    setStarting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-gym-bg)] flex items-center justify-center">
        <p className="text-[var(--color-gym-muted)]">Cargando...</p>
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
        </div>

        {/* Today's session or rest */}
        {todayType && template ? (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-accent)]/30 rounded-2xl p-4 mb-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">Sesión de hoy</p>
            <p className="text-[var(--color-gym-text)] font-semibold text-lg">{DAY_LABELS[todayType]}</p>
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
          </div>
        ) : (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">Hoy</p>
            <p className="text-[var(--color-gym-text)] font-semibold">Día de descanso</p>
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">Tenis, movilidad o descanso activo</p>
          </div>
        )}

        {/* Last PR */}
        {lastPR?.weight_kg ? (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">Último PR</p>
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
