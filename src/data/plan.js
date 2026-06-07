export const PROGRAM_START = new Date('2026-06-08') // Week 1 starts June 8 (Mon)

const DAY_TYPE_MAP = {
  1: 'push',     // Monday
  2: 'lower',    // Tuesday
  3: null,       // Wednesday - rest
  4: 'pull',     // Thursday
  5: null,       // Friday - tennis/rest
  6: 'athletic', // Saturday - optional
  0: null,       // Sunday - rest
}

export function getCurrentWeek() {
  const diffMs = Date.now() - PROGRAM_START.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(1, Math.min(24, Math.floor(diffDays / 7) + 1))
}

export function getCurrentPhase(week) {
  if (week <= 8) return 1
  if (week <= 16) return 2
  return 3
}

export function getTodayDayType() {
  return DAY_TYPE_MAP[new Date().getDay()]
}

export const PROGRESSION_RULES = {
  1: 'Doble progresión: cuando alcances el máximo de reps del rango en todos los sets con RPE ≤ 7, sube 2.5 kg la próxima sesión.',
  2: 'Doble progresión: cuando completes 8 reps en todos los sets con RPE ≤ 8, sube 2.5 kg la próxima sesión.',
  3: 'Cluster sets 6×(3+15s+3): sube 2.5 kg cuando completes todos los bloques limpio con RPE ≤ 9.',
}

export function getMondayOfCurrentWeek() {
  const today = new Date()
  const day = today.getDay()
  const daysFromMonday = day === 0 ? 6 : day - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - daysFromMonday)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().split('T')[0]
}
