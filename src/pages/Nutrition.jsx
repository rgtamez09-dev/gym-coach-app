import Nav from '../components/Nav'

const MACROS = [
  { label: 'Calorías', value: '2,800–3,000 kcal', note: '+200-300 sobre mantenimiento' },
  { label: 'Proteína', value: '140–155 g/día', note: '2.0–2.2 g/kg · Prioridad #1' },
  { label: 'Carbohidratos', value: '350–400 g/día', note: 'Pre/post entreno' },
  { label: 'Grasas', value: '70–90 g/día', note: 'Hormonas + absorción vitaminas' },
]

const TIMING = [
  {
    when: 'Pre-gym (45-60 min)',
    what: 'Avena + fruta + whey',
    color: 'var(--color-gym-accent)',
  },
  {
    when: 'Post-gym (30 min)',
    what: 'Whey + plátano',
    color: 'var(--color-gym-success)',
  },
  {
    when: 'Pre-tenis (90 min)',
    what: 'Carbohidrato ligero — arroz o fruta, poca grasa',
    color: 'var(--color-gym-warning)',
  },
]

const SUPPLEMENTS = [
  {
    tier: 1,
    label: 'Tier 1 — Ya en uso',
    active: true,
    items: [
      { name: 'Creatina monohidrato', dose: '5 g/día', when: 'Cualquier momento' },
      { name: 'Whey protein', dose: '1-2 scoops', when: 'Post-entreno' },
      { name: 'Omega-3 (EPA+DHA)', dose: '2-3 g/día', when: 'Con comida' },
      { name: 'Vitamina D3 + K2', dose: '3,000 IU + 100 mcg', when: 'Con comida grasa' },
      { name: 'Magnesio glicinato', dose: '300-400 mg', when: 'Antes de dormir' },
    ],
  },
  {
    tier: 2,
    label: 'Tier 2 — Recomendados por lesiones',
    active: false,
    items: [
      {
        name: 'Colágeno + Vitamina C',
        dose: '10-15 g + 500 mg',
        when: '30-60 min pre-gym',
        note: 'Reparación tendones/ligamentos (Shaw et al.)',
      },
      { name: 'Electrolitos', dose: '1 dosis/sesión', when: 'Durante tenis o gym intenso' },
    ],
  },
  {
    tier: 3,
    label: 'Tier 3 — Opcionales',
    active: false,
    items: [
      { name: 'Cafeína', dose: '150-200 mg', when: 'Pre-gym' },
      { name: 'Ashwagandha', dose: '600 mg/día', when: 'Fases de alta carga' },
    ],
  },
]

export default function Nutrition() {
  return (
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-[var(--color-gym-text)] mb-6">Nutrición</h1>

        {/* Macros */}
        <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-4">
          <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-3">
            Macros objetivo — Lean bulk conservador
          </p>
          <div className="space-y-3">
            {MACROS.map(({ label, value, note }) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <p className="text-[var(--color-gym-muted)] text-sm">{label}</p>
                <div className="text-right">
                  <p className="text-[var(--color-gym-text)] font-semibold text-sm">{value}</p>
                  <p className="text-[var(--color-gym-muted)] text-xs">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timing */}
        <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-4">
          <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-3">
            Timing de nutrición
          </p>
          <div className="space-y-4">
            {TIMING.map(({ when, what, color }) => (
              <div key={when} className="flex items-start gap-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <p className="text-[var(--color-gym-muted)] text-xs">{when}</p>
                  <p className="text-[var(--color-gym-text)] text-sm font-medium mt-0.5">{what}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplements */}
        {SUPPLEMENTS.map(({ tier, label, active, items }) => (
          <div
            key={tier}
            className={`bg-[var(--color-gym-surface)] border rounded-2xl p-4 mb-4 ${
              active ? 'border-[var(--color-gym-success)]/30' : 'border-[var(--color-gym-border)]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide">{label}</p>
              {active && (
                <span className="text-xs bg-[var(--color-gym-success)]/20 text-[var(--color-gym-success)] px-2 py-0.5 rounded-full">
                  Activo
                </span>
              )}
            </div>
            <div className="space-y-3">
              {items.map(({ name, dose, when, note }) => (
                <div key={name} className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${active ? 'text-[var(--color-gym-text)]' : 'text-[var(--color-gym-muted)]'}`}>
                      {name}
                    </p>
                    <p className="text-[var(--color-gym-muted)] text-xs">{when}</p>
                    {note && <p className="text-[var(--color-gym-muted)] text-xs mt-0.5 italic">{note}</p>}
                  </div>
                  <p className={`text-sm shrink-0 font-medium ${active ? 'text-[var(--color-gym-success)]' : 'text-[var(--color-gym-muted)]'}`}>
                    {dose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Nav />
    </div>
  )
}
