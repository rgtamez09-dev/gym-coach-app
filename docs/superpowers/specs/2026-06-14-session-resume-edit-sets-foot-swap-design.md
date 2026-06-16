# Design — Session resume, edit sets, foot-exercise swap

**Date:** 2026-06-14
**Branch:** `feat/session-resume-edit-sets-foot-swap`
**Status:** Approved by Roberto

## Problem

Three issues surfaced during real gym use (2026-06-14):

1. **Barefoot exercise in the gym.** `Towel Scrunches` (and the `Plantar Fascia Circuit`) require being barefoot, which is impractical at the gym.
2. **Sessions can't be paused.** The active session lives only in Zustand memory and the Workout page has no nav. Leaving the page (or the only available button, "Finalizar sesión") ends/registers the session. Closing the PWA strands it. There is no way to go to the dashboard and return to an in-progress session.
3. **Logged sets are immutable.** Once a set is logged there is no UI to correct a wrong weight/reps/RPE (e.g. a set sent with 0 kg).

A **ghost session** already exists in the DB (a `completed=true` row with incomplete content) and must be removed.

## Root-cause notes (verified in code)

- `Dashboard.handleStartSession` inserts a `sessions` row (`completed=false`) on start, then stores `activeSession` only in Zustand memory.
- `workoutStore` is **not** persisted → PWA close/iOS kill wipes it; `/workout` then redirects home, orphaning the DB row.
- `Workout.jsx` renders **no `<Nav>`**; the only exit is "Finalizar sesión" → `finishSession` sets `completed=true`. This is how an incomplete session got "registered as finished."
- `Workout.sessionSets` is local React state, never refetched from the DB → a resumed session would show an empty "Esta sesión" list.
- Progress and Dashboard only count `completed=true` sessions.
- The app reads `session_templates` from the **live Supabase DB** (project ref `dtvxtuccnhkdclhyqexl`), not the seed files. The seed files must be updated in parallel for consistency. The live gym DB is reachable only via the `supabase-gym` MCP (OAuth).

## Decisions (confirmed with Roberto)

| Topic | Decision |
|-------|----------|
| Gym foot warm-up | Replace `Towel Scrunches` with a new shoe-friendly `Standing Calf Stretch` (wall stretch + slow eccentric calf raise). |
| Session D barefoot circuit | Apply the same swap (replace `Plantar Fascia Circuit`). |
| Towel Scrunches at home | Keep it in `homeRoutines.js` (barefoot is fine at home). |
| Editing a logged set | Edit-only (peso/reps/RPE). No per-set delete. |
| Exit modal | Three actions: Seguir luego / Finalizar / **Descartar** (approved). |
| Duplicate prevention | **Lookup-before-insert** on session start (approved). |

## Solution

### Part A — Barefoot exercise swap (data only)

- Add library exercise **`Standing Calf Stretch`** to the `exercises` table and `002_seed_exercises.sql`. Fields: technique (wall stretch knee-straight then knee-bent, then slow eccentric calf raises), `muscle_groups` (Pantorrilla/Gemelo, Sóleo, Fascia plantar), rationale note. Must exist so the Workout "Ver técnica" button and muscle-group line render.
- **Session B** (Lower, all phases that contain it): replace `Towel Scrunches` warm-up with `Standing Calf Stretch`.
- **Session D** (Athletic, all phases): replace `Plantar Fascia Circuit` with `Standing Calf Stretch`, note "Movilidad pie/pantorrilla — al final".
- Keep `Towel Scrunches` in `homeRoutines.js`.
- Apply via a new `004_*.sql` migration **and** to the live gym DB (`supabase-gym` MCP). Verify the live `session_templates` JSON before/after.

### Part B — Session resume

- Wrap `workoutStore` in Zustand `persist` middleware (`zustand/middleware`, localStorage). Persist `activeSession` and `currentExerciseIdx` only (never the timer interval handle).
- Render `<Nav>` on the Workout page (add bottom padding to avoid the nav overlapping the finish button).
- On Workout mount, if `activeSession` exists, refetch logged sets from `sets` where `session_id = activeSession.id` and `completed=true`, and hydrate `sessionSets` (mapping `exercise_name` from the template/exercise map) so the "Esta sesión" list is correct after a resume.
- Replace the single "Finalizar sesión" button with **"Salir de la sesión"** → modal with:
  - **Seguir luego (ir al inicio)** → `navigate('/')`, session stays active/persisted.
  - **Finalizar sesión** → existing `finishSession` (sets `completed=true`, `duration_min`, clears store).
  - **Descartar sesión** → delete the `sets` for the session then the `sessions` row, then `clearSession()` and `navigate('/')`. Confirmation required inside the modal.
- **Dashboard resume banner**: when a persisted `activeSession` exists, show a top card "Sesión en curso — Reanudar" (day label + start time) linking to `/workout`.
- **Lookup-before-insert** in `handleStartSession`: before inserting, if a persisted `activeSession` exists, resume it; also query for an existing `completed=false` session for the same user+template+today and resume that row instead of creating a duplicate.

### Part C — Edit a logged set (edit-only)

- In the "Esta sesión" list, tapping a set row toggles it into inline edit mode: peso / reps / RPE inputs prefilled, with **Guardar** / **Cancelar**.
- Guardar → `UPDATE sets SET weight_kg, reps, rpe WHERE id = <set.id>` → update the row in local `sessionSets`. Reuse the same input styling as the log form.

### Part D — Ghost session cleanup (one-time)

- Authenticate `supabase-gym` MCP. List all sessions for the user with set counts (`completed`, `real_sets`). Present the rows to Roberto, confirm the exact ghost row ID, then delete that single `sessions` row + its `sets`. Irreversible → explicit confirmation before executing.

## Sequencing

Single feature branch, layered with verification per layer:
**A** data swap → **B** persistence/resume/exit modal → **C** edit-set → **D** ghost cleanup → PR `develop` → `main`.

## Out of scope

- Per-set delete.
- Multi-session-in-progress at once (one active session is enough).
- Reworking the progression-hint / superset logic.
