import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'
import ErrorState from '../components/ErrorState'

function getYouTubeEmbedUrl(url) {
  if (!url) return null
  const match = url.match(/[?&]v=([^&]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null
}

export default function Exercises() {
  const [exercises, setExercises] = useState([])
  const [search, setSearch] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchExercises = async () => {
    setLoading(true)
    setError(false)
    const { data, error: fetchErr } = await supabase
      .from('exercises')
      .select('*')
      .order('name_en')
    if (fetchErr) {
      setError(true)
    } else {
      setExercises(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExercises()
  }, [])

  const allMuscles = [...new Set(exercises.flatMap((e) => e.muscle_groups || []))].sort()

  const filtered = exercises.filter((e) => {
    const matchesSearch = e.name_en.toLowerCase().includes(search.toLowerCase())
    const matchesMuscle = !muscleFilter || (e.muscle_groups || []).includes(muscleFilter)
    return matchesSearch && matchesMuscle
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-gym-bg)] flex items-center justify-center">
        <p className="text-[var(--color-gym-muted)]">Cargando ejercicios...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-gym-bg)] flex flex-col items-center justify-center px-4 gap-4">
        <ErrorState onRetry={fetchExercises} />
        <Nav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-[var(--color-gym-text)] mb-4">Ejercicios</h1>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-4 py-3 text-[var(--color-gym-text)] placeholder-[var(--color-gym-muted)] focus:outline-none focus:border-[var(--color-gym-accent)]"
          />
          <select
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-xl px-3 py-3 text-[var(--color-gym-text)] focus:outline-none focus:border-[var(--color-gym-accent)] text-sm"
          >
            <option value="">Todos</option>
            {allMuscles.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <p className="text-[var(--color-gym-muted)] text-xs mb-3">{filtered.length} ejercicios</p>

        <div className="space-y-2">
          {filtered.map((ex) => {
            const isOpen = selectedId === ex.id
            const embedUrl = getYouTubeEmbedUrl(ex.video_url)
            return (
              <div
                key={ex.id}
                className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setSelectedId(isOpen ? null : ex.id)}
                  className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-3">
                      <p className="text-[var(--color-gym-text)] font-semibold">{ex.name_en}</p>
                      {ex.name_es && (
                        <p className="text-[var(--color-gym-muted)] text-xs mt-0.5">{ex.name_es}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(ex.muscle_groups || []).map((m) => (
                          <span
                            key={m}
                            className="text-xs bg-[var(--color-gym-accent)]/10 text-[var(--color-gym-accent)] px-2 py-0.5 rounded-full"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[var(--color-gym-muted)] text-sm mt-1">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-[var(--color-gym-border)] pt-4">
                    {ex.description_technique && (
                      <div>
                        <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">Técnica</p>
                        <p className="text-[var(--color-gym-text)] text-sm leading-relaxed">{ex.description_technique}</p>
                      </div>
                    )}
                    {ex.injury_notes && (
                      <div>
                        <p className="text-[var(--color-gym-warning)] text-xs uppercase tracking-wide mb-1">⚠️ Lesiones</p>
                        <p className="text-[var(--color-gym-text)] text-sm leading-relaxed">{ex.injury_notes}</p>
                      </div>
                    )}
                    {ex.coach_source && (
                      <p className="text-[var(--color-gym-muted)] text-xs">Coach: {ex.coach_source}</p>
                    )}
                    {embedUrl && (
                      <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                          allowFullScreen
                          title={ex.name_en}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <Nav />
    </div>
  )
}
