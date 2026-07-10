import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  _authSubscription: null,

  initialize: async () => {
    // Subscribe synchronously and only once — StrictMode double-invokes
    // effects, and a second listener would double every auth update.
    if (!get()._authSubscription) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null })
      })
      set({ _authSubscription: subscription })
    }
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })
  },

  refreshSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null })
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  },

  sendMagicLink: async (email) => {
    // shouldCreateUser: false — Supabase's default creates an account for any
    // unknown email, turning the recovery form into open signup (single-user app).
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })
    return { error }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
