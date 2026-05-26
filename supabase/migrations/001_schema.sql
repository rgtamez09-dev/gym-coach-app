-- Gym Coach App — Schema inicial
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- Habilitar extensión UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLA: exercises
-- Librería de ejercicios con técnica y referencias
-- ============================================================
create table if not exists exercises (
  id uuid primary key default uuid_generate_v4(),
  name_en text not null,
  name_es text not null,
  muscle_groups text[] not null default '{}',
  video_url text,
  description_technique text,
  injury_notes text,
  coach_source text,
  created_at timestamptz default now()
);

-- ============================================================
-- TABLA: session_templates
-- Plantillas de sesiones por fase y tipo de día
-- ============================================================
create table if not exists session_templates (
  id uuid primary key default uuid_generate_v4(),
  phase int not null check (phase between 1 and 3),
  week_start int not null,
  week_end int not null,
  day_type text not null check (day_type in ('push', 'lower', 'pull', 'athletic')),
  day_label text not null,
  exercise_list jsonb not null default '[]',
  created_at timestamptz default now()
);

-- ============================================================
-- TABLA: sessions
-- Sesiones realizadas por el usuario
-- ============================================================
create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  template_id uuid references session_templates(id),
  date date not null default current_date,
  duration_min int,
  notes text,
  completed boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- TABLA: sets
-- Sets registrados dentro de cada sesión
-- ============================================================
create table if not exists sets (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  exercise_id uuid references exercises(id),
  set_number int not null,
  weight_kg numeric(5,2),
  reps int,
  rpe int check (rpe between 1 and 10),
  completed boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Solo el dueño de la sesión puede ver/modificar sus datos
-- ============================================================
alter table sessions enable row level security;
alter table sets enable row level security;

create policy "Users can manage their own sessions"
  on sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage sets in their sessions"
  on sets for all
  using (
    exists (
      select 1 from sessions s
      where s.id = sets.session_id
      and s.user_id = auth.uid()
    )
  );

-- exercises y session_templates son públicas (solo lectura)
alter table exercises enable row level security;
alter table session_templates enable row level security;

create policy "Exercises are public read"
  on exercises for select using (true);

create policy "Session templates are public read"
  on session_templates for select using (true);

-- ============================================================
-- GRANTS — necesario cuando el schema se crea via SQL Editor
-- (el Dashboard de Supabase los aplica automáticamente; SQL Editor no)
-- ============================================================
grant usage on schema public to anon, authenticated;
grant select on public.exercises to anon, authenticated;
grant select on public.session_templates to anon, authenticated;
grant all on public.sessions to authenticated;
grant all on public.sets to authenticated;
