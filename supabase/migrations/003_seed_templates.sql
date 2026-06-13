-- Gym Coach App — Seed: Session Templates
-- Ejecutar DESPUÉS de 002_seed_exercises.sql
-- Los IDs de ejercicios se resuelven por nombre automáticamente

-- Helper: función para obtener el ID de un ejercicio por nombre
-- (solo se usa durante el seed, no queda en producción)

-- ============================================================
-- PHASE 1 (Semanas 1-8) — Foundation + Rehab Activation
-- ============================================================

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  1, 1, 8, 'push', 'Sesión A — Upper Push',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Band Pull-Apart + Wrist Circles', 'note', 'Warm-up', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'Incline DB Press', 'superset_with', 'Face Pulls', 'sets', 3, 'reps', '8-10', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Face Pulls', 'superset_with', 'Incline DB Press', 'sets', 3, 'reps', '15', 'rest_sec', 0),
    jsonb_build_object('exercise_name', 'Weighted Dips', 'sets', 3, 'reps', '6-8', 'rest_sec', 120, 'note', '+5-10kg cinturón'),
    jsonb_build_object('exercise_name', 'Landmine Press', 'sets', 3, 'reps', '10-12', 'rest_sec', 90, 'per_side', true),
    jsonb_build_object('exercise_name', 'Explosive Push-up', 'sets', 2, 'reps', '8', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Tyler Twist (Wrist Rehab)', 'note', 'Rehab — al final', 'sets', 2, 'reps', '15', 'rest_sec', 45),
    jsonb_build_object('exercise_name', 'Wrist Roller', 'note', 'Rehab — al final', 'sets', 2, 'reps', '3 vueltas', 'rest_sec', 45)
  )
);

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  1, 1, 8, 'lower', 'Sesión B — Lower + Hip',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Seated Tibialis Raise', 'note', 'Warm-up', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'Towel Scrunches', 'note', 'Warm-up fascitis plantar', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'ATG Split Squat', 'sets', 3, 'reps', '8 c/u', 'rest_sec', 90, 'note', 'Empezar sin peso'),
    jsonb_build_object('exercise_name', 'Leg Press (Inclined)', 'sets', 3, 'reps', '8-10', 'rest_sec', 120),
    jsonb_build_object('exercise_name', 'Romanian Deadlift', 'sets', 3, 'reps', '10-12', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Hip Thrust Machine', 'sets', 3, 'reps', '12-15', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Single-Leg Calf Raise (Deficit)', 'sets', 3, 'reps', '15 c/u', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Single-Leg Balance Progressions', 'note', 'Rehab tobillo — al final', 'sets', 3, 'reps', '30s c/u', 'rest_sec', 30)
  )
);

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  1, 1, 8, 'pull', 'Sesión C — Upper Pull + Arms',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Face Pulls', 'note', 'Warm-up', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'Weighted Pullups', 'sets', 3, 'reps', '6-8', 'rest_sec', 120, 'note', '+5-10kg cinturón'),
    jsonb_build_object('exercise_name', 'Chest-Supported DB Row', 'sets', 3, 'reps', '10-12', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Face Pulls', 'sets', 3, 'reps', '15-20', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Hammer Curl', 'superset_with', 'Reverse Curl', 'sets', 3, 'reps', '10', 'rest_sec', 0),
    jsonb_build_object('exercise_name', 'Reverse Curl', 'superset_with', 'Hammer Curl', 'sets', 3, 'reps', '12', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Neck Harness Training', 'sets', 3, 'reps', '15 c/dirección', 'rest_sec', 45, 'note', 'Conservador — sin peso extra al inicio'),
    jsonb_build_object('exercise_name', 'Eccentric Wrist Extensions', 'note', 'Rehab codo tenista — al final', 'sets', 2, 'reps', '15', 'rest_sec', 45)
  )
);

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  1, 1, 8, 'athletic', 'Sesión D — Athletic + Core (opcional sábado)',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Turkish Get-Up', 'sets', 3, 'reps', '3 c/u', 'rest_sec', 90, 'note', 'Empezar sin KB — solo patrón'),
    jsonb_build_object('exercise_name', 'Pallof Press (Cable Anti-Rotation)', 'sets', 3, 'reps', '12 c/u', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Hollow Body Hold', 'sets', 3, 'reps', '30s', 'rest_sec', 45),
    jsonb_build_object('exercise_name', 'L-Sit Progression', 'sets', 3, 'reps', 'Máx tiempo', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Sandbag Bear Hug Squat', 'sets', 3, 'reps', '10', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Hip Flexor Protocol ATG', 'note', 'Movilidad — al final', 'sets', 1, 'reps', '10 min', 'rest_sec', 0),
    jsonb_build_object('exercise_name', 'Plantar Fascia Circuit', 'note', 'Rehab fascitis — al final', 'sets', 1, 'reps', '8 min', 'rest_sec', 0)
  )
);

-- ============================================================
-- PHASE 2 (Semanas 9-16) — Strength + Hypertrophy
-- Las mismas sesiones pero con ejercicios actualizados
-- (rep range 5-8 en compuestos, cargas más altas)
-- ============================================================

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  2, 9, 16, 'push', 'Sesión A — Upper Push (Fuerza)',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Face Pulls', 'note', 'Warm-up', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'Incline DB Press', 'superset_with', 'Face Pulls', 'sets', 4, 'reps', '5-8', 'rest_sec', 120, 'note', 'Aumentar peso vs Phase 1'),
    jsonb_build_object('exercise_name', 'Weighted Dips', 'sets', 4, 'reps', '5-7', 'rest_sec', 150, 'note', '+15-20kg cinturón'),
    jsonb_build_object('exercise_name', 'Landmine Press', 'sets', 3, 'reps', '8-10', 'rest_sec', 90, 'per_side', true),
    jsonb_build_object('exercise_name', 'Explosive Push-up', 'sets', 3, 'reps', '6-8', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Tyler Twist (Wrist Rehab)', 'note', 'Rehab', 'sets', 2, 'reps', '15', 'rest_sec', 45),
    jsonb_build_object('exercise_name', 'Wrist Roller', 'note', 'Rehab', 'sets', 3, 'reps', '3 vueltas', 'rest_sec', 45)
  )
);

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  2, 9, 16, 'lower', 'Sesión B — Lower (Fuerza + Nordic)',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Seated Tibialis Raise', 'note', 'Warm-up', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'ATG Split Squat', 'sets', 4, 'reps', '6 c/u', 'rest_sec', 90, 'note', 'Con carga progresiva'),
    jsonb_build_object('exercise_name', 'Leg Press (Inclined)', 'sets', 4, 'reps', '6-8', 'rest_sec', 120, 'note', 'Aumentar carga vs Phase 1'),
    jsonb_build_object('exercise_name', 'Romanian Deadlift', 'sets', 3, 'reps', '8-10', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Hip Thrust Machine', 'sets', 4, 'reps', '10-12', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Single-Leg Calf Raise (Deficit)', 'sets', 4, 'reps', '12 c/u', 'rest_sec', 60, 'note', 'Con mancuerna en la mano'),
    jsonb_build_object('exercise_name', 'Single-Leg Balance Progressions', 'note', 'Rehab tobillo', 'sets', 3, 'reps', '30s c/u', 'rest_sec', 30)
  )
);

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  2, 9, 16, 'pull', 'Sesión C — Upper Pull (Fuerza)',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Face Pulls', 'note', 'Warm-up', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'Weighted Pullups', 'sets', 4, 'reps', '5-6', 'rest_sec', 150, 'note', '+15-20kg cinturón'),
    jsonb_build_object('exercise_name', 'Chest-Supported DB Row', 'sets', 4, 'reps', '8-10', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Face Pulls', 'sets', 3, 'reps', '15-20', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Hammer Curl', 'superset_with', 'Reverse Curl', 'sets', 4, 'reps', '8-10', 'rest_sec', 0),
    jsonb_build_object('exercise_name', 'Reverse Curl', 'superset_with', 'Hammer Curl', 'sets', 4, 'reps', '10-12', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Neck Harness Training', 'sets', 3, 'reps', '15 c/dirección', 'rest_sec', 45),
    jsonb_build_object('exercise_name', 'Eccentric Wrist Extensions', 'note', 'Rehab', 'sets', 3, 'reps', '15', 'rest_sec', 45)
  )
);

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  2, 9, 16, 'athletic', 'Sesión D — Athletic + Potencia (Phase 2)',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Turkish Get-Up', 'sets', 3, 'reps', '3 c/u', 'rest_sec', 90, 'note', 'Con KB ligero'),
    jsonb_build_object('exercise_name', 'Pallof Press (Cable Anti-Rotation)', 'sets', 4, 'reps', '12 c/u', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'L-Sit Progression', 'sets', 4, 'reps', 'Máx tiempo', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Sandbag Bear Hug Squat', 'sets', 4, 'reps', '8', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Hip Flexor Protocol ATG', 'note', 'Movilidad', 'sets', 1, 'reps', '10 min', 'rest_sec', 0),
    jsonb_build_object('exercise_name', 'Plantar Fascia Circuit', 'note', 'Rehab', 'sets', 1, 'reps', '8 min', 'rest_sec', 0)
  )
);

-- ============================================================
-- PHASE 3 (Semanas 17-24) — Athletic Peak + Power
-- ============================================================

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  3, 17, 24, 'push', 'Sesión A — Upper Push (Potencia)',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Face Pulls', 'note', 'Warm-up', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'Incline DB Press', 'sets', 4, 'reps', '4-6', 'rest_sec', 150, 'note', 'Cluster sets: 6×(3+15s rest+3)'),
    jsonb_build_object('exercise_name', 'Weighted Dips', 'sets', 4, 'reps', '4-5', 'rest_sec', 150, 'note', 'Máximo peso — cluster sets'),
    jsonb_build_object('exercise_name', 'Landmine Press', 'sets', 3, 'reps', '6-8', 'rest_sec', 90, 'per_side', true),
    jsonb_build_object('exercise_name', 'Explosive Push-up', 'sets', 4, 'reps', '6', 'rest_sec', 90, 'note', 'Máxima explosividad'),
    jsonb_build_object('exercise_name', 'Tyler Twist (Wrist Rehab)', 'note', 'Rehab', 'sets', 2, 'reps', '15', 'rest_sec', 45),
    jsonb_build_object('exercise_name', 'Wrist Roller', 'note', 'Rehab', 'sets', 3, 'reps', '3 vueltas', 'rest_sec', 45)
  )
);

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  3, 17, 24, 'lower', 'Sesión B — Lower (Peak + Potencia)',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Seated Tibialis Raise', 'note', 'Warm-up', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'ATG Split Squat', 'sets', 4, 'reps', '4-5 c/u', 'rest_sec', 90, 'note', 'Con máxima carga segura'),
    jsonb_build_object('exercise_name', 'Leg Press (Inclined)', 'sets', 4, 'reps', '5-6', 'rest_sec', 150),
    jsonb_build_object('exercise_name', 'Romanian Deadlift', 'sets', 4, 'reps', '6-8', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Hip Thrust Machine', 'sets', 4, 'reps', '8-10', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Single-Leg Calf Raise (Deficit)', 'sets', 4, 'reps', '10 c/u', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Single-Leg Balance Progressions', 'note', 'Rehab tobillo', 'sets', 3, 'reps', '30s c/u', 'rest_sec', 30)
  )
);

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  3, 17, 24, 'pull', 'Sesión C — Upper Pull (Peak)',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Face Pulls', 'note', 'Warm-up', 'sets', 2, 'reps', '20', 'rest_sec', 30),
    jsonb_build_object('exercise_name', 'Weighted Pullups', 'sets', 5, 'reps', '4-5', 'rest_sec', 150, 'note', 'Máximo peso — evaluar PR semana 24'),
    jsonb_build_object('exercise_name', 'Chest-Supported DB Row', 'sets', 4, 'reps', '6-8', 'rest_sec', 90),
    jsonb_build_object('exercise_name', 'Face Pulls', 'sets', 3, 'reps', '15', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Hammer Curl', 'superset_with', 'Reverse Curl', 'sets', 4, 'reps', '8', 'rest_sec', 0),
    jsonb_build_object('exercise_name', 'Reverse Curl', 'superset_with', 'Hammer Curl', 'sets', 4, 'reps', '10', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Neck Harness Training', 'sets', 3, 'reps', '15 c/dirección', 'rest_sec', 45),
    jsonb_build_object('exercise_name', 'Eccentric Wrist Extensions', 'note', 'Rehab', 'sets', 3, 'reps', '15', 'rest_sec', 45)
  )
);

insert into session_templates (phase, week_start, week_end, day_type, day_label, exercise_list)
values (
  3, 17, 24, 'athletic', 'Sesión D — Athletic Peak + Tenis',
  jsonb_build_array(
    jsonb_build_object('exercise_name', 'Turkish Get-Up', 'sets', 3, 'reps', '3 c/u', 'rest_sec', 90, 'note', 'Con KB moderado'),
    jsonb_build_object('exercise_name', 'Pallof Press (Cable Anti-Rotation)', 'sets', 4, 'reps', '15 c/u', 'rest_sec', 60, 'note', 'Añadir rotación — Pallof press rotacional'),
    jsonb_build_object('exercise_name', 'L-Sit Progression', 'sets', 4, 'reps', 'Máx tiempo', 'rest_sec', 60),
    jsonb_build_object('exercise_name', 'Sandbag Bear Hug Squat', 'sets', 4, 'reps', '6', 'rest_sec', 90, 'note', 'Máxima carga'),
    jsonb_build_object('exercise_name', 'Hip Flexor Protocol ATG', 'note', 'Movilidad', 'sets', 1, 'reps', '10 min', 'rest_sec', 0),
    jsonb_build_object('exercise_name', 'Plantar Fascia Circuit', 'note', 'Rehab', 'sets', 1, 'reps', '8 min', 'rest_sec', 0)
  )
);
