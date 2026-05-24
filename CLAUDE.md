# Gym Coach App

App web personal de entrenamiento de gym con plan de 6 meses personalizado. Stack: React 18 + Vite + Tailwind CSS + Zustand + Supabase + Netlify.

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS v4 (plugin Vite, sin config file) |
| Estado | Zustand |
| Base de datos | Supabase (PostgreSQL) — project ref: dtvxtuccnhkdclhyqexl |
| Auth | Supabase Auth (magic link por email) |
| Deploy | Netlify (free tier) |

**Idioma:** UI en español, nombres de ejercicios en inglés.

## Variables de entorno requeridas

Crear `.env` en la raíz del proyecto con:
```
VITE_SUPABASE_URL=https://dtvxtuccnhkdclhyqexl.supabase.co
VITE_SUPABASE_ANON_KEY=<obtener de Supabase Dashboard > Settings > API > Project API keys > anon/public>
```

## Setup de base de datos

Ejecutar en Supabase Dashboard > SQL Editor (en orden):
1. `supabase/migrations/001_schema.sql` — Crea las 4 tablas + RLS
2. `supabase/migrations/002_seed_exercises.sql` — Inserta ~30 ejercicios del plan
3. `supabase/migrations/003_seed_templates.sql` — Inserta 12 templates de sesión (4 tipos × 3 fases)

## Estructura del proyecto

```
src/
  lib/          → supabase.js (cliente)
  pages/        → Dashboard, Workout, Program, Exercises, Progress, Nutrition
  components/   → Componentes reutilizables (modals, cards, nav, timer)
  store/        → Zustand stores (auth, workout, program)
  hooks/        → Custom hooks (useSession, useSets, useExercises, useProgress)
  data/         → Constantes del plan (fases, sustitutos de ejercicios)
```

## Páginas de la app

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Dashboard | Sesión del día, fase actual, PRs recientes |
| `/workout` | Sesión activa | Logger con timer, sets, RPE, modal técnica |
| `/program` | Plan completo | Timeline 6 meses, semanas, fases |
| `/exercises` | Librería | Búsqueda, filtros, técnica, videos |
| `/progress` | Progreso | Gráficas Recharts, PRs, alerta plateau |
| `/nutrition` | Nutrición | Guía de referencia (macros + suplementos) |

## Schema Supabase

- `exercises` — librería de ejercicios con técnica y videos
- `session_templates` — plantillas de sesiones (phase, day_type, exercise_list JSON)
- `sessions` — sesiones realizadas (user_id, date, template_id, completed)
- `sets` — registros de sets (session_id, exercise_id, weight, reps, rpe)

## Plan de entrenamiento

- **Distribución semanal:** Lun(A-Push), Mar(B-Lower), Mié(Descanso), Jue(C-Pull), Vie-Dom(Tenis/Sesión D opcional)
- **Phase 1** (Sem 1-8): Foundation + Rehab — 3×8-12, RPE 6-7
- **Phase 2** (Sem 9-16): Fuerza + Hipertrofia — 4×5-8, cargas altas
- **Phase 3** (Sem 17-24): Peak + Potencia — cluster sets, deload sem 23

## Sesiones de desarrollo (estado)

- **Sesión 1** (Fundación): ✅ Completada — setup, schema, seed data, estructura
- **Sesión 2** (Auth + Dashboard + Workout): ⬜ Pendiente
- **Sesión 3** (Progreso + Librería): ⬜ Pendiente
- **Sesión 4** (Plan + Nutrición + Deploy): ⬜ Pendiente

## Links

- GitHub: https://github.com/rgtamez09-dev/gym-coach-app
- Notion: https://www.notion.so/36a4c11ebcf58188b80ec59e0d39a54d
- Plan completo: C:\Users\Rober\.claude\plans\hola-claude-te-comparto-zazzy-wolf.md

## Ajustes al plan de entrenamiento

Para cambiar ejercicios, añadir músculo o sustituir algo del gym, decirlo directamente en la terminal de Claude Code. Los cambios en los templates se hacen vía Supabase SQL o actualizando el seed.
