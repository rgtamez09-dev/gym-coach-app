import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWorkoutStore = create(
  persist(
    (set, get) => ({
  activeSession: null,
  currentExerciseIdx: 0,
  rehabDone: {},
  timerSeconds: 0,
  timerActive: false,
  timerDeadline: null,
  _timerInterval: null,

  setActiveSession: (session) =>
    set({ activeSession: session, currentExerciseIdx: 0, rehabDone: {} }),

  toggleRehabDone: (idx) =>
    set({ rehabDone: { ...get().rehabDone, [idx]: !get().rehabDone[idx] } }),

  nextExercise: () => {
    const { activeSession, currentExerciseIdx } = get()
    if (currentExerciseIdx < activeSession.exercises.length - 1)
      set({ currentExerciseIdx: currentExerciseIdx + 1 })
  },

  prevExercise: () => {
    const { currentExerciseIdx } = get()
    if (currentExerciseIdx > 0)
      set({ currentExerciseIdx: currentExerciseIdx - 1 })
  },

  goToExercise: (idx) => {
    const { activeSession } = get()
    if (!activeSession) return
    if (idx >= 0 && idx < activeSession.exercises.length)
      set({ currentExerciseIdx: idx })
  },

  startTimer: (seconds) => {
    const existing = get()._timerInterval
    if (existing) clearInterval(existing)
    // Remaining time derives from a deadline, not a decrementing counter —
    // iOS suspends JS timers on screen lock, which froze the old countdown.
    const deadline = Date.now() + seconds * 1000
    set({ timerSeconds: seconds, timerActive: true, timerDeadline: deadline })
    const interval = setInterval(() => get().syncTimer(), 1000)
    set({ _timerInterval: interval })
  },

  syncTimer: () => {
    const { timerActive, timerDeadline, _timerInterval } = get()
    if (!timerActive || !timerDeadline) return
    const remaining = Math.max(0, Math.ceil((timerDeadline - Date.now()) / 1000))
    if (remaining <= 0) {
      if (_timerInterval) clearInterval(_timerInterval)
      set({ timerSeconds: 0, timerActive: false, timerDeadline: null, _timerInterval: null })
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200])
    } else {
      set({ timerSeconds: remaining })
    }
  },

  stopTimer: () => {
    const interval = get()._timerInterval
    if (interval) clearInterval(interval)
    set({ timerSeconds: 0, timerActive: false, timerDeadline: null, _timerInterval: null })
  },

  substituteExercise: (idx, newExerciseName) => {
    const { activeSession } = get()
    if (!activeSession) return
    const updatedExercises = activeSession.exercises.map((ex, i) =>
      i === idx ? { ...ex, exercise_name: newExerciseName } : ex
    )
    set({ activeSession: { ...activeSession, exercises: updatedExercises } })
  },

  clearSession: () => {
    const interval = get()._timerInterval
    if (interval) clearInterval(interval)
    set({
      activeSession: null,
      currentExerciseIdx: 0,
      rehabDone: {},
      timerSeconds: 0,
      timerActive: false,
      timerDeadline: null,
      _timerInterval: null,
    })
  },
    }),
    {
      name: 'gym-workout-session',
      partialize: (state) => ({
        activeSession: state.activeSession,
        currentExerciseIdx: state.currentExerciseIdx,
        rehabDone: state.rehabDone,
      }),
    }
  )
)
