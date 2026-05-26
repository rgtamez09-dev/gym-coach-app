import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const signIn = useAuthStore((s) => s.signIn)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email)
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-gym-bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏋️</div>
          <h1 className="text-2xl font-bold text-[var(--color-gym-text)]">Gym Coach</h1>
          <p className="text-[var(--color-gym-muted)] text-sm mt-1">
            Tu entrenador personal de 6 meses
          </p>
        </div>

        {sent ? (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <p className="text-[var(--color-gym-text)] font-semibold">Revisa tu email</p>
            <p className="text-[var(--color-gym-muted)] text-sm mt-2">
              Enviamos un link de acceso a <strong className="text-[var(--color-gym-text)]">{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-4 py-3 text-[var(--color-gym-text)] placeholder-[var(--color-gym-muted)] focus:outline-none focus:border-[var(--color-gym-accent)]"
            />
            {error && <p className="text-[var(--color-gym-danger)] text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar link de acceso'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
