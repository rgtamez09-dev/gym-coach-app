-- Gym Coach App — Seed: Ejercicios
-- Ejecutar DESPUÉS de 001_schema.sql

insert into exercises (name_en, name_es, muscle_groups, video_url, description_technique, injury_notes, coach_source) values

-- ============================================================
-- SESIÓN A — UPPER PUSH
-- ============================================================
(
  'Incline DB Press',
  'Press inclinado con mancuernas',
  array['Pecho superior', 'Hombro anterior', 'Tríceps'],
  'https://www.youtube.com/watch?v=8iPEnn-ltC8',
  'Banco a 30-45°. Empuje hacia arriba y ligeramente hacia adentro. Bajar con control en 3s. No tocar la barra en el pecho — detener cuando los codos lleguen al plano del cuerpo.',
  'Con lesión de hombro derecho: evitar ROM extremo en la bajada. Mantener hombros empacados.',
  'Jeff Nippard'
),
(
  'Face Pulls',
  'Jalones de cara (cable)',
  array['Deltoides posterior', 'Rotadores externos', 'Romboides'],
  'https://www.youtube.com/watch?v=rep-qVOkqgk',
  'Cable a la altura de la cara. Jalar hacia los oídos con codos altos. Rotar externamente al final del movimiento. Es terapéutico — no ejecutar con ego de peso.',
  'Prioritario para hombro derecho. Hacer en TODAS las sesiones upper.',
  'Jeff Nippard / ATG'
),
(
  'Weighted Dips',
  'Fondos con peso (calistenia)',
  array['Pecho inferior', 'Tríceps', 'Hombro anterior'],
  'https://www.youtube.com/watch?v=2z8JmcrW-As',
  'Inclinarse ~20° hacia adelante para activar pecho inferior. Codos a 45° del cuerpo. Bajar hasta hombros debajo del codo. Cinturón con discos. Aprieta core en todo el movimiento.',
  'Con hombro derecho: no forzar ROM extremo. Control excéntrico lento (3s bajada). Si duele, cambiar a close-grip bench press.',
  'Chris Heria / ATG'
),
(
  'Landmine Press',
  'Press en landmine',
  array['Hombro', 'Pecho superior', 'Tríceps', 'Core'],
  'https://www.youtube.com/watch?v=p3NvY9J6bBQ',
  'Un extremo de la barra fija en esquina. Empuje con una mano desde el hombro. Movimiento en arco natural — muy shoulder-friendly. Se puede hacer de pie (más core) o arrodillado.',
  'Excelente alternativa para hombro derecho — el arco de movimiento reduce estrés en el manguito rotador.',
  'Squat University'
),
(
  'Explosive Push-up',
  'Flexión explosiva (palmas)',
  array['Pecho', 'Tríceps', 'Hombro anterior'],
  'https://www.youtube.com/watch?v=C8jGUEn5y6I',
  'Posición de flexión estándar. Bajar lento (2s). Empuje explosivo despespegar manos del suelo. Absorber en el aterrizaje. Progresión: pushup plyo → clap pushup. Empieza conservador.',
  'Si el hombro derecho molesta, mantener aterrizaje muy controlado o sustituir por cable press explosivo.',
  'Chris Heria'
),
(
  'Tyler Twist (Wrist Rehab)',
  'Tyler Twist — rehabilitación de muñeca/codo',
  array['Antebrazo', 'Muñeca', 'Codo (tendón extensor)'],
  'https://www.youtube.com/watch?v=OHcRQCKkFJo',
  'Con Flexbar o banda de resistencia liviana. Agarrar con ambas manos, girar hacia afuera con la mano afectada mientras la otra estabiliza. Movimiento lento y controlado. NO usar peso excesivo.',
  'Protocolo obligatorio para codo de tenista (epicondilitis lateral). Hacer al FINAL de sesión A. Empezar con banda muy liviana.',
  'ATG / fisioterapia estándar'
),
(
  'Wrist Roller',
  'Rodillo de muñeca',
  array['Antebrazo', 'Agarre', 'Muñeca'],
  'https://www.youtube.com/watch?v=CXbh2lCTMCY',
  'Sostener la barra con ambas manos al frente. Enrollar la cuerda con el peso hacia arriba y luego bajar controlado. Igual de importante subir que bajar.',
  'Complementa el Tyler Twist para fortalecer el antebrazo completo. Clave para la muñeca derecha y el agarre en tenis.',
  'Jeff Nippard'
),

-- ============================================================
-- SESIÓN B — LOWER + HIP
-- ============================================================
(
  'Seated Tibialis Raise',
  'Elevación de tibialis sentado',
  array['Tibial anterior', 'Tobillo', 'Pantorrilla'],
  'https://www.youtube.com/watch?v=5F3CKH-3T_4',
  'Sentado en banco. Talones en el suelo. Levantar la punta del pie lo más alto posible. Mantener 2s arriba. Puedes colocar un disco sobre el pie para aumentar resistencia.',
  'Protocolo ATG clave para tobillo derecho y fascitis plantar. Hacer SIEMPRE en warm-up de sesión B.',
  'Kneesovertoesguy (ATG)'
),
(
  'Towel Scrunches',
  'Arrugar toalla con los pies',
  array['Músculos intrínsecos del pie', 'Fascía plantar'],
  'https://www.youtube.com/watch?v=XzEZLi5ooJM',
  'Descalzo sobre una toalla. Arrugar la toalla hacia ti con los dedos del pie. Mantener la planta apoyada. 15-20 repeticiones cada pie.',
  'Protocolo para fascitis plantar. Hacer descalzo en warm-up de sesión B. Simple pero muy efectivo.',
  'Squat University'
),
(
  'ATG Split Squat',
  'Split squat ATG (rodilla sobre punta del pie)',
  array['Cuádriceps', 'Glúteo', 'Hip flexor', 'Tobillo'],
  'https://www.youtube.com/watch?v=oBBs2_7H1_w',
  'Pie delantero a una distancia moderada del trasero. Dejar que la rodilla viaje MÁS ALLÁ de la punta del pie (el objetivo ATG). Mantener el torso erguido. Comenzar sin peso y progresar muy gradualmente.',
  'Progresión clave del tobillo derecho y rodilla. Empezar sin peso y con el pie elevado si hay limitación. No forzar ROM al inicio.',
  'Kneesovertoesguy (ATG)'
),
(
  'Leg Press (Inclined)',
  'Prensa de pierna inclinada',
  array['Cuádriceps', 'Glúteo', 'Isquiotibiales'],
  'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
  'Pies a la anchura de hombros en la plataforma. Bajar hasta que las rodillas formen ~90° (o más si la movilidad lo permite). Empuje parejo con ambos pies. NO dejar que la espalda baja se levante del asiento.',
  'Con tobillo/rodilla derechos: asegurarte de que ambas piernas empujen simétricamente. Si hay compensación, reducir peso.',
  'Jeff Nippard'
),
(
  'Romanian Deadlift',
  'Peso muerto rumano',
  array['Isquiotibiales', 'Glúteo', 'Espalda baja'],
  'https://www.youtube.com/watch?v=JCXUYuzwNrM',
  'Pies al ancho de cadera. Barra o mancuernas. Bisagra de cadera — NO doblar las rodillas exageradamente. Bajar hasta sentir el estiramiento en los isquios. Espalda NEUTRA en todo momento. Aprieta glúteos al subir.',
  'Movimiento de bisagra de cadera: si hay molestia en espalda baja, reducir peso y revisar posición. Beneficioso para la estabilidad del tobillo también.',
  'Jeff Nippard'
),
(
  'Hip Thrust Machine',
  'Hip thrust en máquina',
  array['Glúteo mayor', 'Isquiotibiales', 'Core'],
  'https://www.youtube.com/watch?v=xDmFkJxPzeM',
  'Respaldo apoyado en el banco. Pies al ancho de cadera. Empujar desde los talones hacia arriba. Al llegar arriba: apretón de glúteos, pelvis neutra (no hiperextender la espalda). Controlar la bajada.',
  'Crucial para la potencia de cadera en el tenis (rotación, sprint lateral, saque). Sin restricciones por lesiones actuales.',
  'muccistrength / dacperformance'
),
(
  'Single-Leg Calf Raise (Deficit)',
  'Elevación de talón unilateral con déficit',
  array['Gemelo', 'Sóleo', 'Tobillo'],
  'https://www.youtube.com/watch?v=JbyjNymZOt0',
  'De pie en el borde de un step o disco. Bajar el talón lo máximo posible (ROM completo). Subir lentamente. Añadir peso (mancuerna en una mano) cuando el BW sea fácil. SIEMPRE unilateral para corregir asimetrías.',
  'ROM completo es clave — el déficit maximiza el beneficio para el tendón de Aquiles y tobillo. Progresión ATG para el tobillo derecho.',
  'Kneesovertoesguy (ATG)'
),
(
  'Single-Leg Balance Progressions',
  'Progresiones de equilibrio unilateral',
  array['Tobillo', 'Peroneos', 'Core', 'Pie'],
  'https://www.youtube.com/watch?v=IElvMWdMgKU',
  'Nivel 1: Equilibrio estático 30s ojos abiertos. Nivel 2: Ojos cerrados. Nivel 3: Sobre superficie inestable (alfombrilla). Nivel 4: Con movimiento de brazos. Nivel 5: Lanzar y atrapar pelota mientras equilibras.',
  'Protocolo de rehab del tobillo derecho. Hacer AL FINAL de sesión B. El lado derecho necesita más atención.',
  'Squat University / ATG'
),

-- ============================================================
-- SESIÓN C — UPPER PULL + ARMS
-- ============================================================
(
  'Weighted Pullups',
  'Dominadas con peso',
  array['Dorsal', 'Bíceps', 'Romboides', 'Core'],
  'https://www.youtube.com/watch?v=eGo4IYlbE5g',
  'Agarre prono (pullup) o supino (chinup) — alternar cada semana. Colgarse con escápulas activas antes de tirar. Llevar el pecho a la barra. Bajar CONTROLADO (3s excéntrico). Cinturón con peso cuando las reps sean fáciles.',
  'Uno de los mejores ejercicios para tu perfil. Hombro derecho: mantener la escápula activa durante todo el movimiento para proteger el manguito rotador.',
  'Chris Heria / Jeff Nippard'
),
(
  'Chest-Supported DB Row',
  'Remo con mancuerna en banco inclinado',
  array['Dorsal', 'Romboides', 'Bíceps', 'Deltoides posterior'],
  'https://www.youtube.com/watch?v=drhONBmHDBQ',
  'Banco a 45°. Pecho apoyado — elimina el trampeo de espalda baja. Jalar los codos hacia los costados y atrás. Comprimir la escápula en la contracción. Bajar lento.',
  'Al estar apoyado, no hay carga en la espalda baja. Excelente para el hombro también. Sin restricciones.',
  'Jeff Nippard'
),
(
  'Hammer Curl',
  'Curl de martillo',
  array['Bíceps (cabeza larga)', 'Braquiorradial', 'Braquial'],
  'https://www.youtube.com/watch?v=zC3nLlEvin4',
  'Agarre neutro (pulgares arriba). Codo fijo al costado. Subir controlado, bajar lento. Alterna entre curl alternado y curl simultáneo. El agarre neutro reduce el estrés en la muñeca.',
  'Agarre neutro es más seguro para la muñeca derecha que el curl supino. Priorizar este tipo de curl.',
  'Jeff Nippard'
),
(
  'Reverse Curl',
  'Curl inverso (agarre prono)',
  array['Braquiorradial', 'Bíceps', 'Antebrazo extensor'],
  'https://www.youtube.com/watch?v=nwMjMdpZ8Mo',
  'Agarre prono (palmas hacia abajo). Curl normal. Este agarre pone énfasis en el braquiorradial y los extensores del antebrazo — crítico para la salud del codo.',
  'Fundamental para el codo de tenista. Combinar con el Tyler Twist en un circuito de rehab. Ir ligero y controlado.',
  'Squat University / fisioterapia'
),
(
  'Neck Harness Training',
  'Entrenamiento con arnés de cuello',
  array['Flexores del cuello', 'Extensores del cuello', 'Esternocleidomastoideo'],
  'https://www.youtube.com/watch?v=8oHjFUrYNHo',
  'Arnés en la cabeza. Movimientos en 4 direcciones: flexión, extensión, lateral izquierdo, lateral derecho. COMENZAR MUY CONSERVADOR — el cuello es sensitivo. 3 sets de 15 reps con muy poco peso al inicio.',
  'Nueva carga muscular. Semanas 1-2: solo peso del arnés sin añadir discos. Aumentar muy gradualmente. Si hay mareo o molestia, parar.',
  'David Weck / dacperformance'
),
(
  'Eccentric Wrist Extensions',
  'Extensiones excéntricas de muñeca (codo tenista)',
  array['Extensores del carpo', 'Tendón epicóndilo lateral'],
  'https://www.youtube.com/watch?v=T5nqn6_hDSQ',
  'Antebrazo apoyado en banco, mano colgando. Levantar la mano con la otra mano o con poco peso, luego bajar MUY LENTO (5s excéntrico) controlando solo con la mano afectada. El excéntrico es el mecanismo terapéutico.',
  'Protocolo de rehab para codo de tenista. SIEMPRE al final de sesión C. Empezar sin peso adicional. La sensación de fatiga en el antebrazo es normal; el dolor agudo no.',
  'Squat University / fisioterapia'
),

-- ============================================================
-- SESIÓN D — ATHLETIC + CORE
-- ============================================================
(
  'Turkish Get-Up',
  'Turkish Get-Up (KB)',
  array['Core', 'Hombro', 'Cadera', 'Coordinación total'],
  'https://www.youtube.com/watch?v=0bWRPC49-KI',
  'De tumbado a de pie con una KB en una mano extendida al techo. El brazo con el KB SIEMPRE apuntando al techo. Movimiento lento y controlado. Hay 6-7 fases — aprender cada una antes de añadir peso.',
  'Excelente para el hombro — trabaja la estabilidad de la articulación glenohumeral. Empezar SIN peso hasta dominar el patrón.',
  'dacperformance / StrongFirst'
),
(
  'Pallof Press (Cable Anti-Rotation)',
  'Pallof press — anti-rotación de core',
  array['Core (oblicuos)', 'Transverso abdominal', 'Estabilización lumbar'],
  'https://www.youtube.com/watch?v=AH_QZLm_0-s',
  'Cable a la altura del pecho. De pie de costado al cable. Extender los brazos al frente y mantener — NO dejar que el cable te gire. Controlar el regreso. La resistencia a la rotación es el ejercicio.',
  'Core específico para el tenis: toda la potencia de los golpes pasa por la capacidad anti-rotacional. Sin restricciones.',
  'Squat University / dacperformance'
),
(
  'Hollow Body Hold',
  'Posición hollow body',
  array['Core profundo', 'Transverso abdominal', 'Hip flexors'],
  'https://www.youtube.com/watch?v=44ScXWFaVBs',
  'De espaldas. Presionar la espalda baja en el suelo (oblicuos activados). Elevar piernas y hombros. La zona lumbar NUNCA se despega del suelo. Progresión: rodillas dobladas → piernas extendidas → brazos arriba.',
  'Base de toda la calistenia avanzada. Sin restricciones para lesiones actuales.',
  'Chris Heria / GMB Fitness'
),
(
  'L-Sit Progression',
  'Progresión de L-sit',
  array['Core', 'Hip flexors', 'Tríceps', 'Hombros'],
  'https://www.youtube.com/watch?v=IUZJoSP66HI',
  'Apoyado en paralelas o en el suelo. Progresiones: 1) Tucked L-sit → 2) Single-leg → 3) Full L-sit. Mantener el tiempo máximo. Los hombros deben estar deprimidos (empujar hacia abajo).',
  'La muñeca derecha puede sentir tensión al inicio. Si molesta, usar paralelas o dip bars para apoyar con el agarre neutral.',
  'Chris Heria / Al Kavadlo'
),
(
  'Sandbag Bear Hug Squat',
  'Sentadilla con sandbag en abrazo',
  array['Cuádriceps', 'Glúteo', 'Core', 'Agarre', 'Espalda alta'],
  'https://www.youtube.com/watch?v=9bJBFKPdCkA',
  'Abrazar el sandbag contra el pecho. Sentadilla goblet — torso más vertical que en back squat. La posición del sandbag obliga a mantener el core tenso y la espalda recta.',
  'El agarre del sandbag fortalece las manos y muñecas. Sin restricciones de lesiones para este ejercicio.',
  'dacperformance'
),
(
  'Hip Flexor Protocol ATG',
  'Protocolo de hip flexor ATG',
  array['Psoas', 'Ilíaco', 'Recto femoral', 'Hip flexors'],
  'https://www.youtube.com/watch?v=Nlbk-dxkFkA',
  'Serie de estiramientos y movilidad de cadera. Incluye: couch stretch, pigeon pose, 90/90 stretch, half-kneeling hip flexor stretch. Mantener cada posición 60-90s. Respirar profundo.',
  'Los hip flexors acortados afectan la postura, el sprint y el saque en tenis. Crítico para la salud lumbar a largo plazo.',
  'Kneesovertoesguy (ATG)'
),
(
  'Plantar Fascia Circuit',
  'Circuito para fascitis plantar',
  array['Fascía plantar', 'Músculos intrínsecos del pie', 'Gemelo', 'Tobillo'],
  'https://www.youtube.com/watch?v=YNrj4iIXQjg',
  '1) Towel scrunches 20 reps. 2) Marble pickups (si tienes). 3) Calf stretch con rodilla recta 60s. 4) Calf stretch con rodilla doblada 60s. 5) Foot massage con pelota de tenis 60s. 6) Tibialis raises 20 reps.',
  'Hacer descalzo. El masaje con pelota de tenis puede ser intenso — es normal. Consistencia > intensidad.',
  'Squat University / ATG'
),

-- ============================================================
-- WARM-UPS (referenciados en templates)
-- ============================================================
(
  'Band Pull-Apart + Wrist Circles',
  'Separaciones con banda + círculos de muñeca',
  array['Deltoides posterior', 'Romboides', 'Rotadores externos', 'Muñeca'],
  'https://www.youtube.com/watch?v=Avc_5PZbHpM',
  'Band pull-apart: banda a la altura del pecho, separar hasta que los omóplatos se junten, controlar el regreso. Wrist circles: círculos lentos con las muñecas en ambas direcciones, 10 reps cada sentido.',
  'Obligatorio en warm-up de sesión A para activar la salud del hombro derecho y lubricar las muñecas antes de cargar.',
  'Jeff Nippard / ATG'
);
