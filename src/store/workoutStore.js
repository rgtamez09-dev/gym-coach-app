import { create } from 'zustand'

export const useWorkoutStore = create((set, get) => ({
  activeSession: null,
  currentExerciseIdx: 0,
  timerSeconds: 0,
  timerActive: false,
  _timerInterval: null,

  setActiveSession: (session) =>
    set({ activeSession: session, currentExerciseIdx: 0 }),

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

  startTimer: (seconds) => {
    const existing = get()._timerInterval
    if (existing) clearInterval(existing)
    set({ timerSeconds: seconds, timerActive: true })
    const interval = setInterval(() => {
      const remaining = get().timerSeconds
      if (remaining <= 1) {
        clearInterval(interval)
        set({ timerSeconds: 0, timerActive: false, _timerInterval: null })
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200])
      } else {
        set({ timerSeconds: remaining - 1 })
      }
    }, 1000)
    set({ _timerInterval: interval })
  },

  stopTimer: () => {
    const interval = get()._timerInterval
    if (interval) clearInterval(interval)
    set({ timerSeconds: 0, timerActive: false, _timerInterval: null })
  },

  clearSession: () => {
    const interval = get()._timerInterval
    if (interval) clearInterval(interval)
    set({
      activeSession: null,
      currentExerciseIdx: 0,
      timerSeconds: 0,
      timerActive: false,
      _timerInterval: null,
    })
  },
}))
