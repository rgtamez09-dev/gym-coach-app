# Session Resume, Edit Sets & Foot-Exercise Swap — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user pause/resume a gym session without losing it, edit a logged set, and replace barefoot foot exercises with a shoe-friendly one; then remove one ghost session from the DB.

**Architecture:** React 19 + Vite + Zustand + Supabase. Session state moves from in-memory Zustand to `persist`-backed localStorage so it survives PWA close. The Workout page gains a nav bar and an exit modal that separates *leaving* from *finishing*. Foot-exercise swaps are data-only changes to the Supabase `session_templates` table (clients have read-only access, so these run server-side via migration + the `supabase-gym` MCP).

**Tech Stack:** React 19, react-router-dom 7, Zustand 5 (`persist` middleware), `@supabase/supabase-js` 2, Tailwind v4.

**Testing note:** This repo has **no unit-test runner** (eslint only). Each task is verified with `npm run lint`, `npm run build`, observable dev-server checks, and direct Supabase SQL queries. Do **not** add a test framework — out of scope.

**Branch:** `feat/session-resume-edit-sets-foot-swap` (already created off `develop`).

**Spec:** `docs/superpowers/specs/2026-06-14-session-resume-edit-sets-foot-swap-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `supabase/migrations/004_fix_barefoot_exercises.sql` | Create | New `Standing Calf Stretch` exercise + swap it into Session B & D templates |
| `supabase/migrations/002_seed_exercises.sql` | Modify | Keep seed in sync — add the new exercise |
| `supabase/migrations/003_seed_templates.sql` | Modify | Keep seed in sync — swap the names |
| `src/store/workoutStore.js` | Modify | Wrap in `persist`; persist only `activeSession` + `currentExerciseIdx`; add `discardSession` helper data |
| `src/components/ExitSessionModal.jsx` | Create | Modal with Seguir luego / Finalizar / Descartar |
| `src/pages/Workout.jsx` | Modify | Render `<Nav>`; hydrate logged sets on resume; exit modal; inline set editing |
| `src/pages/Dashboard.jsx` | Modify | Resume card when a session is active; lookup-before-insert on start; store `day_label` |

---

## Task 1: Foot-exercise data swap — migration + seed sync

**Files:**
- Create: `supabase/migrations/004_fix_barefoot_exercises.sql`
- Modify: `supabase/migrations/002_seed_exercises.sql` (append one exercise)
- Modify: `supabase/migrations/003_seed_templates.sql` (3 name swaps)

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/004_fix_barefoot_exercises.sql` with exactly:

```sql
-- 004: Replace barefoot foot exercises in GYM sessions with a shoe-friendly
-- "Standing Calf Stretch". Towel Scrunches stays in homeRoutines.js (barefoot
-- is fine at home). Run after 003. Idempotent — safe to re-run.

-- 1) New library exercise (so "Ver técnica" + muscle groups render in Workout)
insert into exercises (name_en, name_es, muscle_groups, video_url, description_technique, injury_notes, coach_source)
select
  'Standing Calf Stretch',
  'Estiramiento de pantorrilla de pie',
  array['Gemelo', 'Sóleo', 'Fascia plantar'],
  'https://www.youtube.com/watch?v=Hg2cQGUyQbU',
  'Contra la pared, pie atrás y talón apoyado: rodilla estirada 30s (estira gemelo y fascia plantar vía mecanismo windlass), luego rodilla ligeramente doblada 30s (estira sóleo). Termina con 10-15 elevaciones de talón lentas, 3s de bajada. Con calzado — no requiere estar descalzo.',
  'Sustituto de gym para fascitis plantar: trabaja la cadena pantorrilla-fascia sin descalzarse.',
  'ATG / protocolo fascitis'
where not exists (select 1 from exercises where name_en = 'Standing Calf Stretch');

-- 2) Session B (lower): Towel Scrunches -> Standing Calf Stretch (all phases)
update session_templates
set exercise_list = (
  select jsonb_agg(
    case when elem->>'exercise_name' = 'Towel Scrunches'
      then jsonb_build_object('exercise_name','Standing Calf Stretch','note','Warm-up pie/pantorrilla','sets',2,'reps','30s + 12','rest_sec',30)
      else elem end
  )
  from jsonb_array_elements(exercise_list) elem
)
where exercise_list @> '[{"exercise_name":"Towel Scrunches"}]';

-- 3) Session D (athletic): Plantar Fascia Circuit -> Standing Calf Stretch (all phases)
update session_templates
set exercise_list = (
  select jsonb_agg(
    case when elem->>'exercise_name' = 'Plantar Fascia Circuit'
      then jsonb_build_object('exercise_name','Standing Calf Stretch','note','Movilidad pie/pantorrilla — al final','sets',2,'reps','30s + 12','rest_sec',30)
      else elem end
  )
  from jsonb_array_elements(exercise_list) elem
)
where exercise_list @> '[{"exercise_name":"Plantar Fascia Circuit"}]';
```

- [ ] **Step 2: Sync the exercise seed (`002`)**

In `supabase/migrations/002_seed_exercises.sql`, the file is one big `insert into exercises (...) values (...)` list. Find the **last** exercise tuple (ends with `)` just before the statement's terminating `;`). Add a comma after that closing `)` and append this tuple before the `;`:

```sql
,
(
  'Standing Calf Stretch',
  'Estiramiento de pantorrilla de pie',
  array['Gemelo', 'Sóleo', 'Fascia plantar'],
  'https://www.youtube.com/watch?v=Hg2cQGUyQbU',
  'Contra la pared, pie atrás y talón apoyado: rodilla estirada 30s (estira gemelo y fascia plantar vía mecanismo windlass), luego rodilla ligeramente doblada 30s (estira sóleo). Termina con 10-15 elevaciones de talón lentas, 3s de bajada. Con calzado — no requiere estar descalzo.',
  'Sustituto de gym para fascitis plantar: trabaja la cadena pantorrilla-fascia sin descalzarse.',
  'ATG / protocolo fascitis'
)
```

To locate the insertion point: `grep -n ");" supabase/migrations/002_seed_exercises.sql | tail -1` shows the terminating line. Insert the tuple immediately above it (and ensure the previous tuple now ends with `),`).

- [ ] **Step 3: Sync the template seed (`003`)**

In `supabase/migrations/003_seed_templates.sql`:
- Line ~33 — replace the whole `Towel Scrunches` object with:
```sql
    jsonb_build_object('exercise_name', 'Standing Calf Stretch', 'note', 'Warm-up pie/pantorrilla', 'sets', 2, 'reps', '30s + 12', 'rest_sec', 30),
```
- Each `Plantar Fascia Circuit` object (3 occurrences, lines ~68, ~131, ~191) — replace with:
```sql
    jsonb_build_object('exercise_name', 'Standing Calf Stretch', 'note', 'Movilidad pie/pantorrilla — al final', 'sets', 2, 'reps', '30s + 12', 'rest_sec', 0)
```
(Keep each line's trailing comma exactly as it was — the last item in each array has no trailing comma.)

Verify zero remain: `grep -nc "Towel Scrunches\|Plantar Fascia Circuit" supabase/migrations/003_seed_templates.sql` → must print `0`.

- [ ] **Step 4: Commit the data changes**

```bash
git add supabase/migrations/004_fix_barefoot_exercises.sql supabase/migrations/002_seed_exercises.sql supabase/migrations/003_seed_templates.sql
git commit -m "feat(plan): swap barefoot foot exercises for shoe-friendly Standing Calf Stretch"
```

---

## Task 2: Apply the foot-exercise swap to the LIVE gym DB

The app reads `session_templates` from the live DB, not the seed files. This task makes the change visible in production. The gym DB (ref `dtvxtuccnhkdclhyqexl`) is reachable only via the **`supabase-gym` MCP**, which needs OAuth.

- [ ] **Step 1: Authenticate the gym MCP**

Call `mcp__supabase-gym__authenticate`, then `mcp__supabase-gym__complete_authentication` per its returned instructions. If it surfaces a URL/login, hand it to Roberto to complete (do not enter credentials yourself).

- [ ] **Step 2: Snapshot current templates (before)**

Run via the gym MCP's SQL tool:
```sql
select id, day_label, phase,
       jsonb_path_query_array(exercise_list, '$[*].exercise_name') as names
from session_templates
where exercise_list @> '[{"exercise_name":"Towel Scrunches"}]'
   or exercise_list @> '[{"exercise_name":"Plantar Fascia Circuit"}]'
order by phase, day_label;
```
Record the matching rows.

- [ ] **Step 3: Run the migration body against the live DB**

Execute the three statements from `004_fix_barefoot_exercises.sql` (Step 1 of Task 1) against the live gym DB.

- [ ] **Step 4: Verify (after)**

```sql
-- expect 0 rows
select count(*) from session_templates
where exercise_list @> '[{"exercise_name":"Towel Scrunches"}]'
   or exercise_list @> '[{"exercise_name":"Plantar Fascia Circuit"}]';
-- expect 1 row
select name_en from exercises where name_en = 'Standing Calf Stretch';
```
Both must pass before continuing.

---

## Task 3: Persist the workout session

**Files:**
- Modify: `src/store/workoutStore.js`

- [ ] **Step 1: Wrap the store in `persist`**

Replace the top of `src/store/workoutStore.js`:
```js
import { create } from 'zustand'

export const useWorkoutStore = create((set, get) => ({
```
with:
```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWorkoutStore = create(
  persist(
    (set, get) => ({
```

- [ ] **Step 2: Close the `persist` wrapper with `partialize`**

Replace the final closing of the store:
```js
  clearSession: () => {
    const interval = get()._timerInterval
    if (interval) clearInterval(interval)
    set({
      activeSession: null,
      currentExerciseIdx: 0,
      timerSeconds: 0,
      timerActive: false,
      _timerInterval: null,
    })
  },
}))
```
with:
```js
  clearSession: () => {
    const interval = get()._timerInterval
    if (interval) clearInterval(interval)
    set({
      activeSession: null,
      currentExerciseIdx: 0,
      timerSeconds: 0,
      timerActive: false,
      _timerInterval: null,
    })
  },
    }),
    {
      name: 'gym-workout-session',
      partialize: (state) => ({
        activeSession: state.activeSession,
        currentExerciseIdx: state.currentExerciseIdx,
      }),
    }
  )
)
```
(Only `activeSession` and `currentExerciseIdx` persist — never the timer interval handle.)

- [ ] **Step 3: Lint + build**

Run: `npm run lint && npm run build`
Expected: no errors.

- [ ] **Step 4: Manual check — persistence survives reload**

Run `npm run dev`. Log in, start a session, reload the browser tab. The store value `gym-workout-session` must be present in `localStorage` (DevTools → Application → Local Storage) and `/workout` must still show the active session instead of redirecting home.

- [ ] **Step 5: Commit**

```bash
git add src/store/workoutStore.js
git commit -m "feat: persist active workout session to localStorage"
```

---

## Task 4: Workout page — nav bar, set hydration, day label

**Files:**
- Modify: `src/pages/Workout.jsx`

- [ ] **Step 1: Import Nav and useRef**

In `src/pages/Workout.jsx`, change the React import:
```js
import { useState, useEffect } from 'react'
```
to:
```js
import { useState, useEffect, useRef } from 'react'
```
and add after the existing component imports:
```js
import Nav from '../components/Nav'
```

- [ ] **Step 2: Add a hydration ref and function**

Inside the component, after the existing `const [rehabDone, setRehabDone] = useState({})` line, add:
```js
  const hydratedRef = useRef(false)
```

After the existing `fetchPrevSets` function (before the first `useEffect`), add:
```js
  const hydrateSessionSets = async () => {
    const { data } = await supabase
      .from('sets')
      .select('*')
      .eq('session_id', activeSession.id)
      .eq('completed', true)
      .order('created_at', { ascending: true })
    if (!data) return
    const idToName = {}
    Object.values(exerciseMap).forEach((ex) => { idToName[ex.id] = ex.name_en })
    setSessionSets(
      data.map((s) => ({ ...s, exercise_name: idToName[s.exercise_id] ?? '' }))
    )
  }
```

- [ ] **Step 3: Trigger hydration once when the exercise map is ready**

After the existing `useEffect(() => { if (exerciseInfo?.id) {...} }, [...])` block, add a new effect:
```js
  useEffect(() => {
    if (hydratedRef.current) return
    if (!activeSession?.id) return
    if (Object.keys(exerciseMap).length === 0) return
    hydratedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    hydrateSessionSets()
  }, [activeSession?.id, exerciseMap])
```

- [ ] **Step 4: Render Nav + bottom padding**

Change the outermost wrapper:
```js
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-8">
```
to:
```js
    <div className="min-h-screen bg-[var(--color-gym-bg)] pb-24">
```
Then, immediately before the final closing `</div>` of the component's returned JSX (the one paired with the wrapper above, right after the `{showPlan && (...)}` block and its closing), add:
```js
      <Nav />
```

- [ ] **Step 5: Lint + build**

Run: `npm run lint && npm run build`
Expected: no errors.

- [ ] **Step 6: Manual check — resume shows logged sets**

`npm run dev`: start a session, log 2 sets on an exercise, tap the "Sesión" / "Inicio" nav, return to "Sesión". The "Esta sesión" list for that exercise must still show the 2 sets (hydrated from DB), and the bottom nav must be visible without covering the finish button.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Workout.jsx
git commit -m "feat: workout page nav + hydrate logged sets on resume"
```

---

## Task 5: Exit modal + discard session

**Files:**
- Create: `src/components/ExitSessionModal.jsx`
- Modify: `src/pages/Workout.jsx`

- [ ] **Step 1: Create the modal component**

Create `src/components/ExitSessionModal.jsx`:
```jsx
import { useState } from 'react'

export default function ExitSessionModal({ onResumeLater, onFinish, onDiscard, finishing, onClose }) {
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
                className="flex-1 bg-[var(--color-gym-danger)] text-white py-2 rounded-xl text-sm font-semibold"
              >
                Sí, descartar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Import the modal in Workout.jsx**

Add with the other component imports in `src/pages/Workout.jsx`:
```js
import ExitSessionModal from '../components/ExitSessionModal'
```

- [ ] **Step 3: Add exit-modal state and discard handler**

Add near the other `useState` calls:
```js
  const [showExit, setShowExit] = useState(false)
```

After the existing `finishSession` function, add:
```js
  const discardSession = async () => {
    await supabase.from('sets').delete().eq('session_id', activeSession.id)
    await supabase.from('sessions').delete().eq('id', activeSession.id)
    clearSession()
    navigate('/')
  }
```

- [ ] **Step 4: Replace the finish button with an exit button**

Replace this block:
```js
        {/* ── Finish ── */}
        <button
          onClick={finishSession}
          disabled={finishing}
          className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-danger)]/50 text-[var(--color-gym-danger)] py-3 rounded-xl hover:bg-[var(--color-gym-danger)] hover:text-white transition-colors disabled:opacity-50"
        >
          {finishing ? 'Guardando...' : 'Finalizar sesión'}
        </button>
        {finishError && (
          <p className="text-[var(--color-gym-danger)] text-xs mt-2 text-center">
            No se pudo guardar la sesión. Verifica tu conexión e intenta de nuevo.
          </p>
        )}
```
with:
```js
        {/* ── Exit ── */}
        <button
          onClick={() => setShowExit(true)}
          className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] text-[var(--color-gym-text)] py-3 rounded-xl hover:border-[var(--color-gym-accent)] transition-colors"
        >
          Salir de la sesión
        </button>
        {finishError && (
          <p className="text-[var(--color-gym-danger)] text-xs mt-2 text-center">
            No se pudo guardar la sesión. Verifica tu conexión e intenta de nuevo.
          </p>
        )}
```

- [ ] **Step 5: Render the modal**

Immediately before the `<Nav />` line added in Task 4, add:
```js
      {showExit && (
        <ExitSessionModal
          finishing={finishing}
          onClose={() => setShowExit(false)}
          onResumeLater={() => { setShowExit(false); navigate('/') }}
          onFinish={finishSession}
          onDiscard={discardSession}
        />
      )}
```

- [ ] **Step 6: Lint + build**

Run: `npm run lint && npm run build`
Expected: no errors.

- [ ] **Step 7: Manual check — three exit paths**

`npm run dev`, start a session, tap "Salir de la sesión":
1. "Seguir luego" → lands on dashboard, session still resumable.
2. Reopen, "Finalizar y guardar" → session marked complete, dashboard count increments.
3. Start another, "Descartar" → confirm → session + sets gone from DB (`select count(*) from sessions where id='<id>'` → 0), dashboard count unchanged.

- [ ] **Step 8: Commit**

```bash
git add src/components/ExitSessionModal.jsx src/pages/Workout.jsx
git commit -m "feat: exit-session modal with resume-later / finish / discard"
```

---

## Task 6: Dashboard resume card + lookup-before-insert

**Files:**
- Modify: `src/pages/Dashboard.jsx`

- [ ] **Step 1: Read activeSession from the store**

In `src/pages/Dashboard.jsx`, change:
```js
  const setActiveSession = useWorkoutStore((s) => s.setActiveSession)
```
to:
```js
  const setActiveSession = useWorkoutStore((s) => s.setActiveSession)
  const activeSession = useWorkoutStore((s) => s.activeSession)
```

- [ ] **Step 2: Store `day_label` when starting, and add lookup-before-insert**

Replace the whole `handleStartSession` function:
```js
  const handleStartSession = async () => {
    if (!template) return
    setStarting(true)
    setStartError(false)
    const today = new Date().toISOString().split('T')[0]
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, template_id: template.id, date: today })
      .select()
      .single()

    if (sessionError || !session) {
      setStartError(true)
      setStarting(false)
      return
    }

    setActiveSession({ ...session, exercises: template.exercise_list })
    navigate('/workout')
    setStarting(false)
  }
```
with:
```js
  const handleStartSession = async () => {
    if (!template) return
    setStarting(true)
    setStartError(false)
    const today = new Date().toISOString().split('T')[0]

    // Lookup-before-insert: resume an existing incomplete session for this
    // template today instead of creating a duplicate (prevents ghost rows).
    const { data: existing } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('template_id', template.id)
      .eq('date', today)
      .eq('completed', false)
      .order('created_at', { ascending: false })
      .limit(1)

    if (existing?.length) {
      setActiveSession({ ...existing[0], exercises: template.exercise_list, day_label: template.day_label })
      navigate('/workout')
      setStarting(false)
      return
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, template_id: template.id, date: today })
      .select()
      .single()

    if (sessionError || !session) {
      setStartError(true)
      setStarting(false)
      return
    }

    setActiveSession({ ...session, exercises: template.exercise_list, day_label: template.day_label })
    navigate('/workout')
    setStarting(false)
  }
```

- [ ] **Step 3: Show a resume card instead of the start card when a session is active**

Replace the entire "Today's session or rest" block — from `{/* Today's session or rest */}` through its closing `)}` (the ternary that renders the start card vs the rest-day card) — with:
```js
        {/* Resume in-progress session (takes priority) */}
        {activeSession ? (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-accent)] rounded-2xl p-4 mb-4">
            <p className="text-[var(--color-gym-accent)] text-xs uppercase tracking-wide mb-1 font-semibold">
              Sesión en curso
            </p>
            <p className="text-[var(--color-gym-text)] font-semibold text-lg">
              {activeSession.day_label || 'Sesión activa'}
            </p>
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">
              {activeSession.exercises?.length ?? 0} ejercicios · iniciada{' '}
              {activeSession.created_at
                ? new Date(activeSession.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                : ''}
            </p>
            <button
              onClick={() => navigate('/workout')}
              className="mt-4 w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Reanudar sesión
            </button>
            <p className="text-[var(--color-gym-muted)] text-xs mt-2 text-center">
              Finaliza o descarta tu sesión en curso para empezar otra
            </p>
          </div>
        ) : activeType && template ? (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-accent)]/30 rounded-2xl p-4 mb-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">
              {selectedType && selectedType !== todayType ? 'Sesión seleccionada' : 'Sesión de hoy'}
            </p>
            <p className="text-[var(--color-gym-text)] font-semibold text-lg">{DAY_LABELS[activeType]}</p>
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">
              {template.exercise_list.length} ejercicios
            </p>
            <button
              onClick={handleStartSession}
              disabled={starting}
              className="mt-4 w-full bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {starting ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
            {startError && (
              <p className="text-[var(--color-gym-danger)] text-xs mt-2 text-center">
                No se pudo crear la sesión. Verifica tu conexión e intenta de nuevo.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] rounded-2xl p-4 mb-4">
            <p className="text-[var(--color-gym-muted)] text-xs uppercase tracking-wide mb-1">Hoy</p>
            <p className="text-[var(--color-gym-text)] font-semibold">Día de descanso</p>
            <p className="text-[var(--color-gym-muted)] text-sm mt-0.5">Tenis, movilidad o descanso activo</p>
          </div>
        )}
```

- [ ] **Step 4: Lint + build**

Run: `npm run lint && npm run build`
Expected: no errors.

- [ ] **Step 5: Manual check — resume card + no duplicate rows**

`npm run dev`: start a session, go to dashboard → "Sesión en curso" card with "Reanudar sesión" appears (start card hidden). Tap Reanudar → returns to the same session. Finish it → card disappears, normal start card returns. Then verify lookup-before-insert: start a session, close the PWA/clear the `gym-workout-session` localStorage key (simulating a wiped store), reopen, tap "Iniciar sesión" for the same type → it resumes the existing DB row (no second `completed=false` row created). Confirm with `select count(*) from sessions where user_id='<uid>' and date=current_date and completed=false` → 1, not 2.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Dashboard.jsx
git commit -m "feat: dashboard resume card + lookup-before-insert on start"
```

---

## Task 7: Edit a logged set (edit-only)

**Files:**
- Modify: `src/pages/Workout.jsx`

- [ ] **Step 1: Add edit state**

Add near the other `useState` calls in `src/pages/Workout.jsx`:
```js
  const [editingSetId, setEditingSetId] = useState(null)
  const [editWeight, setEditWeight] = useState('')
  const [editReps, setEditReps] = useState('')
  const [editRpe, setEditRpe] = useState(7)
  const [editError, setEditError] = useState(false)
```

- [ ] **Step 2: Add start-edit and save-edit handlers**

After the `discardSession` function (Task 5), add:
```js
  const startEditSet = (s) => {
    setEditError(false)
    setEditingSetId(s.id)
    setEditWeight(s.weight_kg != null ? String(s.weight_kg) : '')
    setEditReps(s.reps != null ? String(s.reps) : '')
    setEditRpe(s.rpe ?? 7)
  }

  const saveSetEdit = async (setId) => {
    setEditError(false)
    const { data, error } = await supabase
      .from('sets')
      .update({
        weight_kg: editWeight !== '' ? parseFloat(editWeight) : 0,
        reps: editReps !== '' ? parseInt(editReps) : null,
        rpe: editRpe,
      })
      .eq('id', setId)
      .select()
      .single()
    if (error || !data) {
      setEditError(true)
      return
    }
    setSessionSets((prev) =>
      prev.map((s) => (s.id === setId ? { ...s, ...data, exercise_name: s.exercise_name } : s))
    )
    setEditingSetId(null)
  }
```

- [ ] **Step 3: Make each logged-set row editable**

Replace the "Sets logged this session" map block:
```js
            <div className="space-y-1.5">
              {currentSets.map((s, i) => (
                <div
                  key={i}
                  className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-success)]/30 rounded-xl px-3 py-2 flex gap-4 text-sm"
                >
                  <span className="text-[var(--color-gym-muted)] w-14">Serie {s.set_number}</span>
                  <span className="text-[var(--color-gym-text)] font-semibold">
                    {s.weight_kg != null ? `${s.weight_kg} kg` : '— kg'}
                  </span>
                  <span className="text-[var(--color-gym-text)]">
                    {s.reps != null ? `× ${s.reps}` : ''}
                  </span>
                  <span className="text-[var(--color-gym-muted)]">RPE {s.rpe}</span>
                </div>
              ))}
            </div>
```
with:
```js
            <div className="space-y-1.5">
              {currentSets.map((s) => (
                editingSetId === s.id ? (
                  <div
                    key={s.id}
                    className="bg-[var(--color-gym-surface)] border border-[var(--color-gym-accent)] rounded-xl px-3 py-3"
                  >
                    <p className="text-[var(--color-gym-muted)] text-xs mb-2">Editar serie {s.set_number}</p>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={editWeight}
                        onChange={(e) => setEditWeight(e.target.value)}
                        placeholder="kg"
                        className="flex-1 bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] rounded-lg px-2 py-2 text-[var(--color-gym-text)] text-center font-semibold focus:outline-none focus:border-[var(--color-gym-accent)]"
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        value={editReps}
                        onChange={(e) => setEditReps(e.target.value)}
                        placeholder="reps"
                        className="flex-1 bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] rounded-lg px-2 py-2 text-[var(--color-gym-text)] text-center font-semibold focus:outline-none focus:border-[var(--color-gym-accent)]"
                      />
                    </div>
                    <div className="flex gap-1.5 mb-2">
                      {[6, 7, 8, 9, 10].map((r) => (
                        <button
                          key={r}
                          onClick={() => setEditRpe(r)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            editRpe === r
                              ? 'bg-[var(--color-gym-accent)] text-white'
                              : 'bg-[var(--color-gym-bg)] border border-[var(--color-gym-border)] text-[var(--color-gym-muted)]'
                          }`}
                        >
                          {RPE_EMOJI[r]}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSetId(null)}
                        className="flex-1 bg-[var(--color-gym-surface)] border border-[var(--color-gym-border)] text-[var(--color-gym-text)] py-2 rounded-lg text-sm"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => saveSetEdit(s.id)}
                        className="flex-1 bg-[var(--color-gym-accent)] hover:bg-[var(--color-gym-accent-hover)] text-white py-2 rounded-lg text-sm font-semibold"
                      >
                        Guardar
                      </button>
                    </div>
                    {editError && (
                      <p className="text-[var(--color-gym-danger)] text-xs mt-2 text-center">
                        No se pudo guardar el cambio. Intenta de nuevo.
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    key={s.id}
                    onClick={() => startEditSet(s)}
                    className="w-full bg-[var(--color-gym-surface)] border border-[var(--color-gym-success)]/30 rounded-xl px-3 py-2 flex gap-4 text-sm items-center hover:border-[var(--color-gym-accent)] transition-colors text-left"
                  >
                    <span className="text-[var(--color-gym-muted)] w-14">Serie {s.set_number}</span>
                    <span className="text-[var(--color-gym-text)] font-semibold">
                      {s.weight_kg != null ? `${s.weight_kg} kg` : '— kg'}
                    </span>
                    <span className="text-[var(--color-gym-text)]">
                      {s.reps != null ? `× ${s.reps}` : ''}
                    </span>
                    <span className="text-[var(--color-gym-muted)]">RPE {s.rpe}</span>
                    <span className="text-[var(--color-gym-muted)] text-xs ml-auto">editar ✏️</span>
                  </button>
                )
              ))}
            </div>
```

- [ ] **Step 4: Lint + build**

Run: `npm run lint && npm run build`
Expected: no errors.

- [ ] **Step 5: Manual check — reproduce the real bug**

`npm run dev`: on an exercise, log a set with weight 0 and some reps. Tap that set → change weight to 40 → Guardar. The row updates to 40 kg, and `select weight_kg from sets where id='<id>'` returns `40`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Workout.jsx
git commit -m "feat: edit a logged set inline (weight/reps/RPE)"
```

---

## Task 8: One-time ghost-session cleanup

Uses the authenticated `supabase-gym` MCP from Task 2.

- [ ] **Step 1: List all sessions with set counts**

```sql
select s.id, s.date, s.completed, s.duration_min, s.created_at, t.day_label,
       (select count(*) from sets where session_id = s.id) as total_sets,
       (select count(*) from sets where session_id = s.id and completed = true and weight_kg > 0) as real_sets
from sessions s
left join session_templates t on t.id = s.template_id
order by s.created_at asc;
```

- [ ] **Step 2: Identify the ghost and CONFIRM with Roberto**

Per Roberto's description, keep: the first (Upper/Push) and the last-registered Lower session. The middle incomplete one is the ghost (expected `real_sets` = 0 or near-0). **Present the rows to Roberto and get explicit confirmation of the exact `id` before deleting — this is irreversible.**

- [ ] **Step 3: Delete the confirmed ghost row (sets cascade)**

```sql
delete from sessions where id = '<CONFIRMED_GHOST_ID>';
```

- [ ] **Step 4: Verify final state**

```sql
select s.id, s.completed, t.day_label,
       (select count(*) from sets where session_id = s.id and weight_kg > 0) as real_sets
from sessions s left join session_templates t on t.id = s.template_id
where s.completed = true
order by s.created_at asc;
```
Expect exactly the two legitimate sessions (Push first, Lower last).

---

## Task 9: Final verification & PR

- [ ] **Step 1: Full build + lint**

Run: `npm run lint && npm run build`
Expected: no errors.

- [ ] **Step 2: End-to-end smoke test**

`npm run dev`: full loop — start session → log sets → edit a set → leave via "Seguir luego" → resume from dashboard → finish. Confirm Session B/D now show "Standing Calf Stretch" (no barefoot exercise) with a working "Ver técnica".

- [ ] **Step 3: Push and open PR**

```bash
git push -u origin feat/session-resume-edit-sets-foot-swap
```
Then open a PR `feat/session-resume-edit-sets-foot-swap` → `main` with a body summarizing the 4 parts. (Per repo rule: never push to `main` directly; Netlify deploys from `main` on merge.)

- [ ] **Step 4: After merge — sync develop**

```bash
git checkout develop && git fetch origin && git merge origin/main
```

---

## Self-Review notes

- **Spec coverage:** Part A → Tasks 1–2; Part B → Tasks 3–6; Part C → Task 7; Part D → Task 8. All covered.
- **Known limitation:** sets logged against a library-less exercise (`exercise_id = null`, e.g. some rehab items) won't re-hydrate a name on resume; they simply won't reappear in the per-exercise "Esta sesión" list. Acceptable for v1 (weighted sets always have an `exercise_id`).
- **Type consistency:** `setActiveSession` payload gains `day_label` in Dashboard (Task 6) and is read in Dashboard's resume card and `Workout` reads `activeSession.exercises` (unchanged shape). `clearSession`, `finishSession`, `discardSession` names used consistently.
