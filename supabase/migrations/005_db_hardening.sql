-- Gym Coach App — DB hardening (code review 2026-07-08)
-- YA APLICADA en la DB viva vía MCP (migración db_hardening_indexes_rls_functions).
-- Este archivo existe para mantener paridad repo ↔ DB.

-- 1. Índices en FKs consultadas en cada pantalla
create index if not exists idx_sets_session_id on public.sets(session_id);
create index if not exists idx_sets_exercise_id on public.sets(exercise_id);
create index if not exists idx_sessions_user_id on public.sessions(user_id);
create index if not exists idx_sessions_template_id on public.sessions(template_id);

-- 2. RLS initplan: (select auth.uid()) se evalúa una vez por query, no por fila
drop policy if exists "Users can manage their own sessions" on public.sessions;
create policy "Users can manage their own sessions"
  on public.sessions for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage sets in their sessions" on public.sets;
create policy "Users can manage sets in their sessions"
  on public.sets for all
  using (
    exists (
      select 1 from public.sessions s
      where s.id = sets.session_id
      and s.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.sessions s
      where s.id = sets.session_id
      and s.user_id = (select auth.uid())
    )
  );

-- 3. search_path fijo en la trigger function
alter function public.update_updated_at() set search_path = '';
