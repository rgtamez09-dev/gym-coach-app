import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const today = () => new Date().toISOString().split('T')[0]

// Source of truth for the plan week (user_program table). The plan week is a
// position in the 24-week program, not a date — it advances when the user
// says so, never because a Monday went by.
export const useProgramStore = create((set) => ({
  planWeek: null,
  weekStartedOn: null,
  loading: true,
  needsInit: false,
  initDefaultWeek: 1,
  error: false,

  loadProgram: async (userId) => {
    set({ error: false })
    const { data, error } = await supabase
      .from('user_program')
      .select('current_plan_week, week_started_on')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) {
      set({ loading: false, error: true })
      return
    }
    if (!data) {
      // First load after the update: default to the highest week already trained.
      const { data: last } = await supabase
        .from('sessions')
        .select('plan_week')
        .eq('user_id', userId)
        .eq('completed', true)
        .not('plan_week', 'is', null)
        .order('plan_week', { ascending: false })
        .limit(1)
      set({ needsInit: true, initDefaultWeek: last?.[0]?.plan_week ?? 1, loading: false })
      return
    }
    set({
      planWeek: data.current_plan_week,
      weekStartedOn: data.week_started_on,
      needsInit: false,
      loading: false,
    })
  },

  initProgram: async (userId, week) => {
    const { error } = await supabase
      .from('user_program')
      .insert({ user_id: userId, current_plan_week: week, week_started_on: today() })
    if (error) return { error }
    set({ planWeek: week, weekStartedOn: today(), needsInit: false })
    return { error: null }
  },

  // Covers the three user actions — advance (week+1), repeat (same week) and
  // choose (any week). All of them restart the week attempt today, so weekly
  // progress only counts sessions from the current attempt.
  setWeek: async (userId, week) => {
    const clamped = Math.max(1, Math.min(24, week))
    const { error } = await supabase
      .from('user_program')
      .update({ current_plan_week: clamped, week_started_on: today() })
      .eq('user_id', userId)
    if (error) return { error }
    set({ planWeek: clamped, weekStartedOn: today() })
    return { error: null }
  },
}))
