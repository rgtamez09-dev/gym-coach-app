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
| `/home` | Casa | 6 rutinas de 10-20 min sin equipo (solo tapete) — rehab, movilidad, core, push, lower, flexibilidad |

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
- **Sesión 2** (Auth + Dashboard + Workout): ✅ Completada — PR #2 mergeado a main
- **Sesión 3** (Progreso + Librería + Casa): ✅ Completada — PR #3 mergeado a main
- **Sesión 4** (Plan + Nutrición + Deploy): ✅ Completada — PR #4 mergeado a main

## Links

- GitHub: https://github.com/rgtamez09-dev/gym-coach-app
- Notion: https://www.notion.so/36a4c11ebcf58188b80ec59e0d39a54d
- Plan completo: C:\Users\Rober\.claude\plans\hola-claude-te-comparto-zazzy-wolf.md

## Git workflow

**Rama principal:** `main` (protegida — sin push directo)
**Rama de desarrollo:** `develop` (aquí va todo el trabajo)

```
develop  →  PR  →  main
```

- Todo el desarrollo ocurre en `develop`
- Para mergear a `main`: crear Pull Request en GitHub
- `main` = código listo para producción (Netlify deploya desde aquí)
- No hacer `git push origin main` nunca — solo vía PR

**Comandos cotidianos:**
```bash
git checkout develop          # cambiar a develop
git add .                     # stagear cambios
git commit -m "feat: ..."     # commitear (Conventional Commits)
git push origin develop       # subir cambios
# luego crear PR en GitHub: develop → main
```

## Keep-Alive automático (Supabase free tier)

El workflow `.github/workflows/supabase-keepalive.yml` hace una lectura real a PostgREST (`/rest/v1/exercises?select=id&limit=1`) cada día a las 09:17 UTC, lo que cuenta como actividad y evita que Supabase pause el proyecto (umbral: 7 días sin actividad).

**Verificar que sigue vivo:** GitHub → Actions → "Supabase Keep-Alive" → último run verde.
**Si el run es rojo:** Supabase probablemente ya está pausado o el secret `SUPABASE_ANON_KEY` expiró.
**Re-activar manualmente:** Actions → "Supabase Keep-Alive" → "Run workflow".

**Trampa de los 60 días:** GitHub deshabilita los workflows programados si no hay actividad en el repo en 60 días. El workflow mismo lo previene: el día 1 de cada mes hace un commit a `.github/keepalive-heartbeat.txt` que resetea el contador. Si ves cero runs después de 60 días → ir a Actions y re-habilitar el workflow manualmente.

**Secret requerido:** `SUPABASE_ANON_KEY` en repo Settings → Secrets → Actions. Si se perde/expira: obtener la anon key de Supabase Dashboard → Settings → API y volver a ejecutar `gh secret set SUPABASE_ANON_KEY --body <key> --repo rgtamez09-dev/gym-coach-app`.

## Ajustes al plan de entrenamiento

Para cambiar ejercicios, añadir músculo o sustituir algo del gym, decirlo directamente en la terminal de Claude Code. Los cambios en los templates se hacen vía Supabase SQL o actualizando el seed.
