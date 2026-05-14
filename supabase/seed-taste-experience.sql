-- ============================================================
-- SEED: Taste of Dominican Culture
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================================
-- UUID fijo para la experiencia — ya está en el código
-- ============================================================

DO $$
DECLARE
  v_admin_profile_id  UUID;
  v_admin_user_id     UUID;
  v_host_id           UUID;
  v_experience_id     UUID := '11111111-1111-1111-1111-111111111111';
BEGIN

  -- 1. Obtener perfil de admin
  SELECT id, user_id
    INTO v_admin_profile_id, v_admin_user_id
    FROM profiles
   WHERE role = 'admin'
   LIMIT 1;

  IF v_admin_profile_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró ningún perfil de admin. Crea primero un usuario administrador.';
  END IF;

  -- 2. Buscar host existente para ese perfil
  SELECT id INTO v_host_id
    FROM hosts
   WHERE profile_id = v_admin_profile_id
   LIMIT 1;

  -- 3. Si no tiene host, crear uno para DoCoolture Gastronomy
  IF v_host_id IS NULL THEN
    INSERT INTO hosts (
      profile_id, user_id, display_name, bio,
      verification_status, is_verified, status,
      is_superhost, response_rate, response_time,
      years_experience, country,
      total_listings, total_reviews, total_bookings,
      average_rating, total_earnings_usd
    ) VALUES (
      v_admin_profile_id, v_admin_user_id,
      'DoCoolture Gastronomy',
      'Somos un equipo apasionado por mostrar la República Dominicana auténtica — su cultura, su gente y sus tradiciones.',
      'approved', true, 'active',
      true, 100, 'en menos de una hora',
      1, 'DO',
      1, 0, 0, 5.0, 0
    )
    RETURNING id INTO v_host_id;

    RAISE NOTICE 'Host creado con ID: %', v_host_id;
  ELSE
    RAISE NOTICE 'Usando host existente con ID: %', v_host_id;
  END IF;

  -- 4. Insertar experiencia con UUID fijo
  INSERT INTO experiences (
    id, host_id,
    title, handle, description,
    category, duration_time, languages,
    max_guests, min_guests,
    address, city, country,
    price_usd,
    featured_image_url, gallery_urls,
    available_days,
    latitude, longitude,
    is_published, is_hidden,
    total_reviews, total_bookings, average_rating,
    like_count, view_count
  ) VALUES (
    v_experience_id, v_host_id,
    'Taste of Dominican Culture',
    'taste-of-dominican-culture',
    'Descubre la esencia de la República Dominicana a través de su gastronomía. Un recorrido sensorial que combina historia, tradición y sabor — desde ingredientes taínos hasta influencias africanas y europeas. Cada plato cuenta una historia. Guiado por expertos locales en la Zona Colonial de Santo Domingo.',
    'Gastronomía', '3–4 horas',
    ARRAY['Español', 'English'],
    8, 1,
    'Zona Colonial, Santo Domingo', 'Santo Domingo', 'DO',
    120,
    '/images/experiences/taste-dominican/sancocho.jpeg',
    ARRAY[
      '/images/experiences/taste-dominican/sancocho.jpeg',
      '/images/experiences/taste-dominican/desayuno.jpeg',
      '/images/experiences/taste-dominican/locrio.jpeg',
      '/images/experiences/taste-dominican/cacao.jpeg',
      '/images/experiences/taste-dominican/chocolate.jpeg',
      '/images/experiences/taste-dominican/cafe.jpeg'
    ],
    ARRAY['Sábados', 'Domingos'],
    18.4733, -69.8833,
    true, false,
    0, 0, 5.0, 0, 0
  )
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE '✅ Listo. Experience ID: %', v_experience_id;

END $$;
