# Gym Coach App

A personalized 6-month gym training PWA (Progressive Web App) built as my own digital coach. Tracks progressive overload, manages session logging, and integrates a periodized program tailored to my injury history and goals (longevity → tennis performance → aesthetics).

**Live:** https://gym-coach-app-365.netlify.app

---

## Features

- **Dashboard** — today's session, current week & phase, sessions this week, last PR
- **Workout logger** — set/reps/RPE tracking with rest timer, pre-loaded previous session weights, exercise substitution
- **Progress charts** — per-exercise weight progression (Recharts), PR tracking, plateau detection
- **Exercise library** — 30+ exercises with technique cues, YouTube embeds, and injury-specific notes
- **24-week program timeline** — periodized 3-phase plan with visual week grid and deload markers
- **Home routines** — 6 bodyweight routines (rehab, mobility, core, push, lower, flexibility) with countdown timer
- **Nutrition guide** — macro targets, meal timing, supplement tiers
- **PWA installable** — works as a standalone app on iOS and Android, offline-capable via service worker

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styles | Tailwind CSS v4 (Vite plugin — no config file) |
| State | Zustand |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + password) |
| Charts | Recharts |
| PWA | vite-plugin-pwa (Workbox) |
| Deploy | Netlify (free tier, CD from GitHub) |

## Architecture decisions

| Decision | Rationale |
|----------|-----------|
| Supabase (not localStorage) | Sync between phone (gym) and laptop — single source of truth |
| Zustand over Context | Lightweight, no boilerplate, easy devtools |
| Tailwind v4 Vite plugin | No `tailwind.config.js`; custom colors via `@theme {}` in CSS |
| `vite-plugin-pwa` autoUpdate | Personal app — silent updates preferred over "new version" prompts |
| PWA `Cache-Control: no-cache` for `sw.js` | Ensures deploys propagate immediately without CDN serving stale service worker |
| email+password auth (not magic link) | Magic link opens Safari, breaking PWA's sandboxed localStorage on iOS |
| JSONB for `exercise_list` in templates | No UUID foreign keys needed in seed; resolves by exercise name |
| `.limit(1)` over `.single()` | Tolerant of duplicate seed data; `.single()` throws on multiple rows |
| `controllerchange` → `window.location.reload()` | Without this, autoUpdate installs new SW but page runs old JS bundle |
| GRANT explicit in SQL Editor | Supabase SQL Editor doesn't apply GRANTs automatically — needed for RLS to work |

## Training program

- **Goal priority:** longevity & injury rehab → tennis performance → aesthetics
- **Schedule:** Mon (Push A) / Tue (Lower B) / Thu (Pull C) / Sat optional (Athletic D)
- **Phase 1** (Weeks 1–8): Foundation + Rehab Activation — 3×8-12, RPE 6-7
- **Phase 2** (Weeks 9–16): Strength + Hypertrophy — 4×5-8, heavier loads
- **Phase 3** (Weeks 17–24): Athletic Peak + Cluster sets — deload Week 23
- Injury protocols integrated: ankle, wrist, plantar fascia, tennis elbow, shoulder, knee

## Local setup

```bash
npm install
```

Create `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Run SQL migrations in Supabase Dashboard → SQL Editor (in order):
1. `supabase/migrations/001_schema.sql`
2. `supabase/migrations/002_seed_exercises.sql`
3. `supabase/migrations/003_seed_templates.sql`

```bash
npm run dev
```

## Future work

- Unit tests (Vitest) for date/phase calculations and set logging logic
- Custom data-access hooks (`useProgress`, `useExercises`) to decouple Supabase queries from components
- `<dialog>` element for modals + Escape key dismiss + aria-labels
- Code splitting / lazy loading for pages
- Move home routines to Supabase for runtime edits without redeploy
- Push notifications for session reminders
- Export progress to PDF / share completed session
