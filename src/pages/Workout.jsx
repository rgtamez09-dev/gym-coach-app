import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutStore } from '../store/workoutStore'
import { supabase } from '../lib/supabase'
import { getCurrentWeek, getCurrentPhase } from '../data/plan'
import RestTimer from '../components/RestTimer'
import TechniqueModal from '../components/TechniqueModal'
import SubstituteModal from '../components/SubstituteModal'
import SessionPlanModal from '../components/SessionPlanModal'

const isRehabOrWarmup = (note) =>
  note?.toLowerCase().includes('warm-up') || note?.toLowerCase().includes('rehab')

const RPE_LABELS = {
  6: 'Fácil',
  7: 'Moderado',
  8: 'Difícil',
  9: 'Muy difícil',
  10: 'Máximo',
}
const RPE_EMOJI = { 6: '😐', 7: '😤', 8: '😓', 9: '😵', 10: '💀' }

function getRepRangeMax(repsStr) {
  if (!repsStr) return null
  const nums = String(repsStr).match(/\d+/g)
  if (!nums) return null
  return parseInt(nums[nums.length - 1], 10)
}

function getRpeThreshold(phase) {
  return phase === 1 ? 7 : phase === 2 ? 8 : 9
}

export default function Workout() {
  const navigate = useNavigate()
  const {
    activeSession,
    currentExerciseIdx,
    nextExercise,
    prevExercise,
    goToExercise,
    startTimer,
    clearSession,
  } = useWorkoutStore()

  const [exerciseMap, setExerciseMap] = useState({})
  const [sessionSets, setSessionSets] = useState([])
  const [prevSets, setPrevSets] = useState([])
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [rpe, setRpe] = useState(7)
  const [showTechnique, setShowTechnique] = useState(false)
  const [showSubstitute, setShowSubstitute] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [logError, setLogError] = useState(false)
  const [finishError, setFinishError] = useState(false)
  const [rehabDone, setRehabDone] = useState({})

  const currentWeek = getCurrentWeek()
  const currentPhase = getCurrentPhase(currentWeek)

  const exercise = activeSession?.exercises?.[currentExerciseIdx]
  const exerciseInfo = exercise ? exerciseMap[exercise.exercise_name] : null
  const isRehab = isRehabOrWarmup(exercise?.note)
  const isPerSide = exercise?.per_side || String(exercise?.reps || '').includes('c/u')

  const supersetPartnerIdx = exercise?.superset_with
    ? activeSession?.exercises.findIndex((e) => e.exercise_name === exercise.superset_with)
    : -1

  const fetchExercises = async () => {
    const { data } = await supabase.from('exercises').select('*')
    if (data) {
      const map = {}
      data.forEach((ex) => { map[ex.name_en] = ex })
      setExerciseMap(map)
    }
  }

  const fetchPrevSets = async (exerciseId) => {
    const { data } = await supabase
      .from('sets')
      .select('weight_kg, reps, rpe, set_number')
      .eq('exercise_id', exerciseId)
      .neq('session_id', activeSession.id)
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(5)
    setPrevSets(data || [])
  }

  useEffect(() => {
    if (!activeSession) {
      navigate('/')
      return
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExercises()
  }, [activeSession])

  useEffect(() => {
    if (exerciseInfo?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchPrevSets(exerciseInfo.id)
      setWeight('')
      setReps('')
    }
  }, [currentExerciseIdx, exerciseInfo?.id])

  const logSet = async () => {
    if (!exercise) return
    setLogError(false)
    const currentSets = sessionSets.filter((s) => s.exercise_name === exercise.exercise_name)
    const setNumber = currentSets.length + 1

    const payload = {
      session_id: activeSession.id,
      exercise_id: exerciseInfo?.id ?? null,
      set_number: setNumber,
      weight_kg: weight !== '' ? parseFloat(weight) : 0,
      reps: reps !== '' ? parseInt(reps) : null,
      rpe,
      completed: true,
    }

    const { data, error } = await supabase.from('sets').insert(payload).select().single()
    if (error || !data) {
      setLogError(true)
      return
    }
    setSessionSets((prev) => [...prev, { ...data, exercise_name: exercise.exercise_name }])
    setWeight('')
    setReps('')
    if (exercise.rest_sec > 0) startTimer(exercise.rest_sec)
  }

  const finishSession = async () => {
    setFinishing(true)
    setFinishError(false)
    const startedAt = new Date(activeSession.created_at)
    const duration = Math.round((Date.now() - startedAt.getTime()) / 60000)
    const { error } = await supabase
      .from('sessions')
      .update({ completed: true, duration_min: duration })
      .eq('id', activeSession.id)
    if (error) {
      setFinishError(true)
      setFinishing(false)
      return
    }
    clearSession()
    navigate('/')
  }

  if (!activeSession || !exercise) return null

  const currentSets = sessionSets.filter((s) => s.exercise_name === exercise.exercise_name)
  const suggestedWeight = prevSets[0]?.weight_kg ?? null

  const maxReps = getRepRangeMax(exercise.reps)
  const rpeThreshold = getRpeThreshold(currentPhase)
  const shouldShowProgressionHint = !isRehab &&
    maxReps !== null &&
    prevSets.length >= exercise.sets &&
    prevSets.slice(0, exercise.sets).every((s) =>
      s.reps != null && s.reps >= maxReps && s.rpe != null && s.rpe <= rpeThreshold
    )

  return (
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-8">
      <div className="max-w-lg mx-auto px-4">

        {/* ── Header: exercise name as hero ── */}
        <div className="pt-6 pb-3 text-center">
          <p className="text-[var(--color-gym-muted)] text-xs mb-1">
            {currentExerciseIdx + 1} / {activeSession.exercises.length}
          </p>
          <h2 className="text-[var(--color-gym-text)] font-bold text-3xl leading-tight mb-1">
            {exercise.exercise_name}
          </h2>
          {exercise.note && (
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">{exercise.note}</p>
          )}
          {exerciseInfo?.muscle_groups?.length > 0 && (
            <p className="text-[var(--color-gym-muted)] text-xs mt-1">
              {exerciseInfo.muscle_groups.join(' · ')}
            </p>
          )}
          {/* Action buttons row */}
          <div className="flex gap-2 justify-center mt-3 flex-wrap">
            <button
              onClick={() => setShowTechnique(true)}
              disabled={!exerciseInfo}
              className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-3 py-2 text-[var(--color-gym-text)] text-sm disabled:opacity-40 hover:border-[var(--color-gym-accent)] transition-colors"
            >
              Ver técnica
            </button>
            <button
              onClick={() => setShowSubstitute(true)}
              className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-3 py-2 text-[var(--color-gym-muted)] text-sm hover:border-[var(--color-gym-warning)] hover:text-[var(--color-gym-text)] transition-colors"
            >
              Sustituir
            </button>
            <button
              onClick={() => setShowPlan(true)}
              className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-3 py-2 text-[var(--color-gym-muted)] text-sm hover:border-[var(--color-gym-accent)] transition-colors"
            >
              Ver plan
            </button>
          </div>
        </div>

        {/* ── Superset banner ── */}
        {exercise.superset_with && (
          <div className="bg-[var(--color-gym-accent)]/10 border border-[var(--color-gym-accent)]/30 rounded-xl p-3 mb-3 text-center">
            <p className="text-[var(--color-gym-accent)] text-xs font-bold uppercase tracking-wider">
              SUPERSET — alterna con {exercise.superset_with}
            </p>
            <p className="text-[var(--color-gym-muted)] text-xs mt-1">
              1 serie aquí → 1 serie de {exercise.superset_with} → descansa → repite. Registra cada ejercicio en su pantalla.
            </p>
            {supersetPartnerIdx >= 0 && (
              <button
                onClick={() => goToExercise(supersetPartnerIdx)}
                className="mt-2 text-[var(--color-gym-accent)] text-xs font-semibold border border-[var(--color-gym-accent)]/50 rounded-lg px-3 py-1.5 hover:bg-[var(--color-gym-accent)]/10 transition-colors"
              >
                Ir a {exercise.superset_with} →
              </button>
            )}
          </div>
        )}

        {/* ── Rehab / Warm-up badge ── */}
        {isRehab && (
          <div className={`rounded-2xl border p-3 mb-3 flex items-center justify-between ${
            rehabDone[currentExerciseIdx]
              ? 'bg-[var(--color-gym-success)]/10 border-[var(--color-gym-success)]/40'
              : 'bg-[var(--color-gym-warning)]/10 border-[var(--color-gym-warning)]/40'
          }`}>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${
                rehabDone[currentExerciseIdx] ? 'text-[var(--color-gym-success)]' : 'text-[var(--color-gym-warning)]'
              }`}>
                {exercise.note?.toLowerCase().includes('warm-up') ? 'Warm-up' : 'Rehab'}
              </p>
              <p className="text-[var(--color-gym-muted)] text-xs mt-0.5">
                {rehabDone[currentExerciseIdx] ? 'Completado' : 'No te lo saltes — es clave para longevidad'}
              </p>
            </div>
            <button
              onClick={() => setRehabDone((prev) => ({ ...prev, [currentExerciseIdx]: !prev[currentExerciseIdx] }))}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                rehabDone[currentExerciseIdx]
                  ? 'bg-[var(--color-gym-success)]/20 text-[var(--color-gym-success)]'
                  : 'bg-[var(--color-gym-warning)]/20 text-[var(--color-gym-warning)]'
              }`}
            >
              {rehabDone[currentExerciseIdx] ? '✓ Hecho' : 'Marcar'}
            </button>
          </div>
        )}

        {/* ── Target: Sets / Reps / Rest ── */}
        <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-3 mb-3 flex gap-4">
          <div className="text-center flex-1">
            <p className="text-[var(--color-gym-muted)] text-xs">Series</p>
            <p className="text-[var(--color-gym-text)] font-bold text-xl">{exercise.sets}</p>
          </div>
          <div className="w-px bg-[var(--color-gym-border)]" />
          <div className="text-center flex-1">
            <p className="text-[var(--color-gym-muted)] text-xs">Reps</p>
            <p className="text-[var(--color-gym-text)] font-bold text-xl">{exercise.reps}</p>
            {isPerSide && (
              <p className="text-[var(--color-gym-accent)] text-[10px] leading-tight">× por lado</p>
            )}
          </div>
          <div className="w-px bg-[var(--color-gym-border)]" />
          <div className="text-center flex-1">
            <p className="text-[var(--color-gym-muted)] text-xs">Descanso</p>
            <p className="text-[var(--color-gym-text)] font-bold text-xl">{exercise.rest_sec}s</p>
          </div>
        </div>

        {/* ── Progression hint (contextual — only when earned) ── */}
        {shouldShowProgressionHint && (
          <div className="bg-[var(--color-gym-success)]/10 border border-[var(--color-gym-success)]/40 rounded-xl px-3 py-2.5 mb-3 text-center">
            <p className="text-[var(--color-gym-success)] font-semibold text-sm">⬆️ Sube 2.5 kg esta sesión</p>
            <p className="text-[var(--color-gym-muted)] text-xs mt-0.5">
              Alcanzaste el tope del rango con RPE ≤ {rpeThreshold} la sesión anterior
            </p>
          </div>
        )}

        {/* ── Rest timer (compact) ── */}
        <RestTimer />

        {/* ── Previous session sets ── */}
        {prevSets.length > 0 && (
          <div className="mb-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-2">
              Sesión anterior
            </p>
            <div className="space-y-1">
              {prevSets.slice(0, exercise.sets).map((s, i) => (
                <div key={i} className="flex gap-4 text-sm text-[var(--color-gym-muted)]">
                  <span className="w-14">Serie {s.set_number}</span>
                  <span>{s.weight_kg != null ? `${s.weight_kg} kg` : '— kg'}</span>
                  <span>{s.reps != null ? `× ${s.reps} reps` : ''}</span>
                  {s.rpe && <span>RPE {s.rpe}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Sets logged this session ── */}
        {currentSets.length > 0 && (
          <div className="mb-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-2">
              Esta sesión
            </p>
            <div className="space-y-1.5">
              {currentSets.map((s, i) => (
                <div
                  key={i}
                  className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-success)]/30 rounded-xl px-3 py-2 flex gap-4 text-sm"
                >
                  <span className="text-[var(--color-gym-muted)] w-14">Serie {s.set_number}</span>
                  <span className="text-[var(--color-gym-text)] font-semibold">
                    {s.weight_kg != null ? `${s.weight_kg} kg` : '— kg'}
                  </span>
                  <span className="text-[var(--color-gym-text)]">
                    {s.reps != null ? `× ${s.reps}` : ''}
                  </span>
                  <span className="text-[var(--color-gym-muted)]">RPE {s.rpe}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Log set form ── */}
        <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-4">
          <p className="text-[var(--color-gym-muted)] text-xs mb-3">
            Serie {currentSets.length + 1}
            {suggestedWeight && (
              <span className="ml-2 text-[var(--color-gym-accent)]">
                · Sugerido: {suggestedWeight} kg
              </span>
            )}
          </p>

          {isPerSide && (
            <p className="text-[var(--color-gym-accent)] text-xs mb-3 text-center">
              Registra las reps de un solo lado
            </p>
          )}

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-[var(--color-gym-muted)] text-xs block mb-1">Peso (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={suggestedWeight ?? '0'}
                className="w-full bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] rounded-xl px-3 py-3 text-[var(--color-gym-text)] text-center text-2xl font-bold focus:outline-none focus:border-[var(--color-gym-accent)]"
              />
            </div>
            <div className="flex-1">
              <label className="text-[var(--color-gym-muted)] text-xs block mb-1">
                Reps{isPerSide ? ' (un lado)' : ''}
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="0"
                className="w-full bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] rounded-xl px-3 py-3 text-[var(--color-gym-text)] text-center text-2xl font-bold focus:outline-none focus:border-[var(--color-gym-accent)]"
              />
            </div>
          </div>

          {/* RPE */}
          <div className="mb-4">
            <p className="text-[var(--color-gym-muted)] text-xs mb-2">RPE — Esfuerzo percibido</p>
            <div className="flex gap-1.5">
              {[6, 7, 8, 9, 10].map((r) => (
                <button
                  key={r}
                  onClick={() => setRpe(r)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    rpe === r
                      ? 'bg-[var(--color-gym-accent)] text-white'
                      : 'bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] text-[var(--color-gym-muted)]'
                  }`}
                >
                  {RPE_EMOJI[r]}
                </button>
              ))}
            </div>
            <p className="text-[var(--color-gym-muted)] text-xs mt-1.5 text-center">
              RPE {rpe} — {RPE_LABELS[rpe]}
            </p>
          </div>

          <button
            onClick={logSet}
            disabled={weight === '' && reps === ''}
            className="w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-40"
          >
            Registrar serie
          </button>
          {logError && (
            <p className="text-[var(--color-gym-danger)] text-xs mt-2 text-center">
              No se pudo guardar. Los datos siguen aquí — intenta de nuevo.
            </p>
          )}
        </div>

        {/* ── Navigate exercises ── */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={prevExercise}
            disabled={currentExerciseIdx === 0}
            className="flex-1 bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] text-[var(--color-gym-text)] py-3 rounded-xl disabled:opacity-40 hover:border-[var(--color-gym-accent)] transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={nextExercise}
            disabled={currentExerciseIdx === activeSession.exercises.length - 1}
            className="flex-1 bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] text-[var(--color-gym-text)] py-3 rounded-xl disabled:opacity-40 hover:border-[var(--color-gym-accent)] transition-colors"
          >
            Siguiente →
          </button>
        </div>

        {/* ── Finish ── */}
        <button
          onClick={finishSession}
          disabled={finishing}
          className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-danger)]/50 text-[var(--color-gym-danger)] py-3 rounded-xl hover:bg-[var(--color-gym-danger)] hover:text-white transition-colors disabled:opacity-50"
        >
          {finishing ? 'Guardando...' : 'Finalizar sesión'}
        </button>
        {finishError && (
          <p className="text-[var(--color-gym-danger)] text-xs mt-2 text-center">
            No se pudo guardar la sesión. Verifica tu conexión e intenta de nuevo.
          </p>
        )}
      </div>

      {showTechnique && exerciseInfo && (
        <TechniqueModal exercise={exerciseInfo} onClose={() => setShowTechnique(false)} />
      )}
      {showSubstitute && (
        <SubstituteModal
          exerciseIdx={currentExerciseIdx}
          exerciseName={exercise.exercise_name}
          exerciseInfo={exerciseInfo}
          onClose={() => setShowSubstitute(false)}
        />
      )}
      {showPlan && (
        <SessionPlanModal
          exercises={activeSession.exercises}
          sessionSets={sessionSets}
          currentIdx={currentExerciseIdx}
          onNavigate={goToExercise}
          onClose={() => setShowPlan(false)}
        />
      )}
    </div>
  )
}
