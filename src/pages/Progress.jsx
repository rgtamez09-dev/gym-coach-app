import { useEffect, useState, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import Nav from '../components/Nav'
import ErrorState from '../components/ErrorState'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function detectPlateau(sessionData) {
  if (sessionData.length < 3) return false
  const last3 = sessionData.slice(-3)
  return last3[2].maxWeight <= last3[0].maxWeight
}

export default function Progress() {
  const user = useAuthStore((s) => s.user)
  const [exerciseData, setExerciseData] = useState({})
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchProgressData = useCallback(async () => {
    setError(false)
    try {
      const { data: sessions, error: sessErr } = await supabase
        .from('sessions')
        .select('id, date')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('date', { ascending: true })

      if (sessErr) throw sessErr

      if (!sessions?.length) {
        setLoading(false)
        return
      }

      const sessionIds = sessions.map((s) => s.id)
      const dateMap = {}
      sessions.forEach((s) => { dateMap[s.id] = s.date })

      const { data: sets, error: setsErr } = await supabase
        .from('sets')
        .select('weight_kg, reps, exercise_id, session_id, exercises(name_en)')
        .in('session_id', sessionIds)
        .eq('completed', true)
        .not('weight_kg', 'is', null)
        .gt('weight_kg', 0)

      if (setsErr) throw setsErr

      if (!sets?.length) {
        setLoading(false)
        return
      }

      const grouped = {}
      sets.forEach((s) => {
        const name = s.exercises?.name_en
        if (!name) return
        const date = dateMap[s.session_id]
        if (!grouped[name]) grouped[name] = {}
        if (!grouped[name][date]) grouped[name][date] = []
        grouped[name][date].push(s.weight_kg)
      })

      const chartData = {}
      Object.entries(grouped).forEach(([name, byDate]) => {
        chartData[name] = Object.entries(byDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, weights]) => ({
            date,
            label: formatDate(date),
            maxWeight: Math.max(...weights),
          }))
      })

      setExerciseData(chartData)
      const names = Object.keys(chartData)
      if (names.length) setSelectedExercise(names[0])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProgressData()
  }, [fetchProgressData])

  const exerciseNames = Object.keys(exerciseData)
  const chartData = selectedExercise ? exerciseData[selectedExercise] : []
  const pr = chartData.length ? Math.max(...chartData.map((d) => d.maxWeight)) : null
  const isPlateau = detectPlateau(chartData)

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-gym-bg)] flex items-center justify-center">
        <p className="text-[var(--color-gym-muted)]">Cargando progreso...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-gym-bg)] flex flex-col items-center justify-center px-4 gap-4">
        <ErrorState onRetry={fetchProgressData} />
        <Nav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-[var(--color-gym-text)] mb-6">Progreso</h1>

        {exerciseNames.length === 0 ? (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-6 text-center">
            <p className="text-[var(--color-gym-muted)] text-sm">Registra tu primera sesión con peso para ver el progreso aquí.</p>
          </div>
        ) : (
          <>
            <select
              value={selectedExercise || ''}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-4 py-3 text-[var(--color-gym-text)] focus:outline-none focus:border-[var(--color-gym-accent)] mb-4"
            >
              {exerciseNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            <div className="flex gap-3 mb-4">
              <div className="flex-1 bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4">
                <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">PR</p>
                <p className={`font-bold text-2xl mt-1 ${pr ? 'text-[var(--color-gym-warning)]' : 'text-[var(--color-gym-muted)]'}`}>
                  {pr ? `${pr} kg` : '—'}
                </p>
              </div>
              <div className="flex-1 bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4">
                <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">Sesiones</p>
                <p className="text-[var(--color-gym-text)] font-bold text-2xl mt-1">{chartData.length}</p>
              </div>
            </div>

            {isPlateau && (
              <div className="bg-[var(--color-gym-warning)]/10 border border-[var(--color-gym-warning)]/30 rounded-2xl p-3 mb-4">
                <p className="text-[var(--color-gym-warning)] text-sm font-semibold">⚠️ Posible plateau detectado</p>
                <p className="text-[var(--color-gym-muted)] text-xs mt-0.5">Sin progreso en las últimas 3 sesiones. Considera subir el peso o cambiar el estímulo.</p>
              </div>
            )}

            {chartData.length > 0 ? (
              <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-4">
                <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-4">Peso máximo (kg)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gym-border)" />
                    <XAxis dataKey="label" stroke="var(--color-gym-muted)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="var(--color-gym-muted)" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-gym-surface)',
                        border: '1px solid var(--color-gym-border)',
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: 'var(--color-gym-text)', fontSize: 12 }}
                      itemStyle={{ color: 'var(--color-gym-accent)', fontSize: 12 }}
                      formatter={(v) => [`${v} kg`, 'Peso']}
                    />
                    <Line
                      type="monotone"
                      dataKey="maxWeight"
                      stroke="var(--color-gym-accent)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--color-gym-accent)', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : null}

            {chartData.length > 0 && (
              <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4">
                <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-3">Historial</p>
                <div className="space-y-2">
                  {[...chartData].reverse().slice(0, 8).map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-gym-muted)]">{d.label}</span>
                      <span className={`font-semibold ${d.maxWeight === pr ? 'text-[var(--color-gym-warning)]' : 'text-[var(--color-gym-text)]'}`}>
                        {d.maxWeight} kg {d.maxWeight === pr ? '🏆' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Nav />
    </div>
  )
}
