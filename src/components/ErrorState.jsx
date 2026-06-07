export default function ErrorState({ message = 'No se pudo conectar. Verifica tu conexión.', onRetry }) {
  return (
    <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-6 text-center">
      <p className="text-[var(--color-gym-muted)] text-sm mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-[var(--color-gym-accent)] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[var(--color-gym-accent-hover)] transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
