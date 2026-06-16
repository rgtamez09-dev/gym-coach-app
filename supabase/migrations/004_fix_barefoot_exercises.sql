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
      then jsonb_build_object('exercise_name','Standing Calf Stretch','note','Movilidad pie/pantorrilla — al final','sets',2,'reps','30s + 12','rest_sec',0)
      else elem end
  )
  from jsonb_array_elements(exercise_list) elem
)
where exercise_list @> '[{"exercise_name":"Plantar Fascia Circuit"}]';
