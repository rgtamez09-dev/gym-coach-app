import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const signIn = useAuthStore((s) => s.signIn)
  const sendMagicLink = useAuthStore((s) => s.sendMagicLink)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!email) { setError('Escribe tu email primero'); return }
    setLoading(true)
    setError(null)
    const { error } = await sendMagicLink(email)
    if (error) setError(error.message)
    else setMagicSent(true)
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

        {magicSent ? (
          <div className="text-center space-y-3">
            <p className="text-[var(--color-gym-text)]">Revisa tu email</p>
            <p className="text-[var(--color-gym-muted)] text-sm">
              Te enviamos un enlace de acceso a <strong>{email}</strong>. Ábrelo en el navegador, entra, y luego visita <strong>/set-password</strong> para establecer una nueva contraseña.
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-4 py-3 text-[var(--color-gym-text)] placeholder-[var(--color-gym-muted)] focus:outline-none focus:border-[var(--color-gym-accent)]"
            />
            {error && <p className="text-[var(--color-gym-danger)] text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full text-[var(--color-gym-muted)] text-sm hover:text-[var(--color-gym-text)] transition-colors"
            >
              Olvidé mi contraseña — enviar enlace al email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
