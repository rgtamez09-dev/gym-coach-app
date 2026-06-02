import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signIn, verifyOtp } = useAuthStore()

  const handleSend = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await signIn(email)
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await verifyOtp(email, otp)
    if (error) setError(error.message)
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
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-6">
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">📧</div>
              <p className="text-[var(--color-gym-text)] font-semibold">Revisa tu email</p>
              <p className="text-[var(--color-gym-muted)] text-sm mt-1">
                Ingresa el código de 6 dígitos enviado a{' '}
                <strong className="text-[var(--color-gym-text)]">{email}</strong>
              </p>
            </div>
            <form onSubmit={handleVerify} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                autoFocus
                required
                className="w-full bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] rounded-xl px-4 py-3 text-[var(--color-gym-text)] text-center text-2xl tracking-widest placeholder-[var(--color-gym-muted)] focus:outline-none focus:border-[var(--color-gym-accent)]"
              />
              {error && <p className="text-[var(--color-gym-danger)] text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Verificando...' : 'Entrar'}
              </button>
              <button
                type="button"
                onClick={() => { setSent(false); setOtp(''); setError(null) }}
                className="w-full text-[var(--color-gym-muted)] text-sm py-2"
              >
                Cambiar email o reenviar
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
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
              {loading ? 'Enviando...' : 'Enviar código de acceso'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
