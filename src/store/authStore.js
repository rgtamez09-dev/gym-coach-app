import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  refreshSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null })
  },

  signIn: async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    return { error }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
