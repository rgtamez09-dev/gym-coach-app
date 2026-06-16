import { useState } from 'react'

export default function ExitSessionModal({ onResumeLater, onFinish, onDiscard, finishing, discarding, finishError, discardError, onClose }) {
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-5 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[var(--color-gym-text)] font-bold text-lg mb-1">Salir de la sesión</h3>
        <p className="text-[var(--color-gym-muted)] text-sm mb-4">
          ¿Qué quieres hacer con tu sesión actual?
        </p>

        <button
          onClick={onResumeLater}
          className="w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors mb-2"
        >
          Seguir luego (ir al inicio)
        </button>
        <p className="text-[var(--color-gym-muted)] text-xs text-center mb-3">
          La sesión se guarda y puedes reanudarla desde el inicio
        </p>

        <button
          onClick={onFinish}
          disabled={finishing}
          className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-success)]/50 text-[var(--color-gym-success)] font-semibold py-3 rounded-xl hover:bg-[var(--color-gym-success)] hover:text-white transition-colors disabled:opacity-50 mb-3"
        >
          {finishing ? 'Guardando...' : 'Finalizar y guardar'}
        </button>
        {finishError && (
          <p className="text-[var(--color-gym-danger)] text-xs text-center mb-3 -mt-1">
            No se pudo guardar la sesión. Intenta de nuevo.
          </p>
        )}

        {!confirmDiscard ? (
          <button
            onClick={() => setConfirmDiscard(true)}
            className="w-full text-[var(--color-gym-danger)] text-sm py-2 hover:underline"
          >
            Descartar sesión
          </button>
        ) : (
          <div className="bg-[var(--color-gym-danger)]/10 border border-[var(--color-gym-danger)]/40 rounded-xl p-3">
            <p className="text-[var(--color-gym-danger)] text-xs mb-2 text-center">
              Esto borra la sesión y todas sus series. No se puede deshacer.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDiscard(false)}
                className="flex-1 bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] text-[var(--color-gym-text)] py-2 rounded-xl text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={onDiscard}
                disabled={discarding}
                className="flex-1 bg-[var(--color-gym-danger)] text-white py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
              >
                {discarding ? 'Borrando...' : 'Sí, descartar'}
              </button>
            </div>
            {discardError && (
              <p className="text-[var(--color-gym-danger)] text-xs mt-2 text-center">
                No se pudo descartar la sesión. Intenta de nuevo.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
