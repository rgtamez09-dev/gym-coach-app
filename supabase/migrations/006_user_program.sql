-- 006: progression model decoupled from the calendar (PRD 2026-07-08).
-- The plan week is a position in the program, not a date. It advances when
-- training happens; the user can always move it. The calendar only suggests.

create table if not exists user_program (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_plan_week int not null default 1 check (current_plan_week between 1 and 24),
  week_started_on date not null default current_date,
  updated_at timestamptz default now()
);

alter table user_program enable row level security;
create policy "Users manage their own program state"
  on user_program for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- GRANT required: without it RLS returns "permission denied" even when the
-- policy passes (see 001_schema.sql).
grant select, insert, update on user_program to authenticated;

-- Supabase default privileges grant more than the app needs — strip them
-- (same lockdown standard as 005_db_hardening.sql).
revoke truncate, references, trigger on user_program from anon, authenticated;
revoke all on user_program from anon;

create trigger user_program_updated_at
  before update on user_program
  for each row execute function update_updated_at();

-- Sessions record which plan week they belong to, so weekly progress counts
-- against the PLAN week, not the calendar Monday.
alter table sessions add column if not exists plan_week int check (plan_week between 1 and 24);

-- Backfill: the sessions logged in June (13-14) were plan week 1.
update sessions set plan_week = 1 where plan_week is null;
