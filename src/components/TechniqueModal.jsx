function getEmbedUrl(url) {
  try {
    const u = new URL(url)
    const v = u.searchParams.get('v')
    return v ? `https://www.youtube.com/embed/${v}` : url
  } catch {
    return url
  }
}

export default function TechniqueModal({ exercise, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-[var(--color-gym-surface)] rounded-t-3xl w-full max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="text-[var(--color-gym-text)] font-bold text-xl">{exercise.name_en}</h3>
              {exercise.name_es && (
                <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">{exercise.name_es}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[var(--color-gym-muted)] text-3xl leading-none hover:text-[var(--color-gym-text)] transition-colors"
            >
              ×
            </button>
          </div>

          {exercise.video_url && (
            <div className="mb-5 rounded-2xl overflow-hidden">
              <iframe
                src={getEmbedUrl(exercise.video_url)}
                className="w-full aspect-video"
                allowFullScreen
                title={exercise.name_en}
              />
            </div>
          )}

          {exercise.description_technique && (
            <div className="mb-4">
              <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-2">Técnica</p>
              <p className="text-[var(--color-gym-text)] text-sm leading-relaxed">
                {exercise.description_technique}
              </p>
            </div>
          )}

          {exercise.injury_notes && (
            <div className="bg-[var(--color-gym-warning)]/10 border border-[var(--color-gym-warning)]/30 rounded-xl p-4">
              <p className="text-[var(--color-gym-warning)] text-xs font-semibold uppercase tracking-wide mb-1">
                ⚠️ Lesiones
              </p>
              <p className="text-[var(--color-gym-text)] text-sm leading-relaxed">{exercise.injury_notes}</p>
            </div>
          )}

          {exercise.coach_source && (
            <p className="text-[var(--color-gym-muted)] text-xs mt-4">Fuente: {exercise.coach_source}</p>
          )}
        </div>
      </div>
    </div>
  )
}
