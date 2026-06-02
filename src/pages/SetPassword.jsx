import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    if (password.length < 8) { setError('Mínimo 8 caracteres'); return }
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else { setSuccess(true); setTimeout(() => navigate('/'), 2000) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-gym-bg)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-[var(--color-gym-text)]">Establecer contraseña</h1>
          <p className="text-[var(--color-gym-muted)] text-sm mt-1">Se usará para iniciar sesión en la app</p>
        </div>

        {success ? (
          <div className="text-center bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-6">
            <p className="text-[var(--color-gym-accent)] font-semibold">Contraseña guardada</p>
            <p className="text-[var(--color-gym-muted)] text-sm mt-1">Redirigiendo al dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nueva contraseña (mín. 8 caracteres)"
              required
              className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-4 py-3 text-[var(--color-gym-text)] placeholder-[var(--color-gym-muted)] focus:outline-none focus:border-[var(--color-gym-accent)]"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmar contraseña"
              required
              className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-4 py-3 text-[var(--color-gym-text)] placeholder-[var(--color-gym-muted)] focus:outline-none focus:border-[var(--color-gym-accent)]"
            />
            {error && <p className="text-[var(--color-gym-danger)] text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
