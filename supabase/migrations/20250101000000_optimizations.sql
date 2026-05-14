-- =============================================================
-- DoCoolture — Database Optimizations & Improvements
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================


-- =============================================================
-- 1. AUTO-CREATE PROFILE ON SIGNUP  (CRÍTICO)
--    Sin esto, el update de rol en signup.tsx falla silenciosamente
--    porque no existe la fila en profiles todavía.
-- =============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    email,
    full_name,
    display_name,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'explorer')
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================
-- 2. AUTO-UPDATE updated_at EN TODAS LAS TABLAS
-- =============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.hosts;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.hosts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.experiences;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.bookings;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.identity_verifications;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.identity_verifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =============================================================
-- 3. GENERADOR DE BOOKING CODE  (ej: DC-26-AB3F9)
-- =============================================================

CREATE OR REPLACE FUNCTION public.generate_booking_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  new_code text;
  year_part text;
  rand_part text;
BEGIN
  IF NEW.booking_code IS NULL THEN
    year_part := TO_CHAR(NOW(), 'YY');
    rand_part := UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 5));
    new_code  := 'DC-' || year_part || '-' || rand_part;

    WHILE EXISTS (SELECT 1 FROM public.bookings WHERE booking_code = new_code) LOOP
      rand_part := UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 5));
      new_code  := 'DC-' || year_part || '-' || rand_part;
    END LOOP;

    NEW.booking_code := new_code;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_generate_booking_code ON public.bookings;
CREATE TRIGGER trg_generate_booking_code
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.generate_booking_code();


-- =============================================================
-- 4. AUTO-UPDATE STATS DE EXPERIENCIAS  (rating, total_reviews)
-- =============================================================

CREATE OR REPLACE FUNCTION public.update_experience_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_exp_id uuid;
BEGIN
  v_exp_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.experience_id ELSE NEW.experience_id END;

  UPDATE public.experiences
  SET
    total_reviews  = (SELECT COUNT(*)       FROM public.experience_reviews WHERE experience_id = v_exp_id AND is_visible = true),
    average_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.experience_reviews WHERE experience_id = v_exp_id AND is_visible = true)
  WHERE id = v_exp_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_experience_stats ON public.experience_reviews;
CREATE TRIGGER trg_experience_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.experience_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_experience_stats();


-- =============================================================
-- 5. AUTO-UPDATE STATS DEL HOST
-- =============================================================

-- 5a. Bookings → total_bookings, total_earnings_usd del host
CREATE OR REPLACE FUNCTION public.update_host_booking_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_host_id uuid;
BEGIN
  v_host_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.host_id ELSE NEW.host_id END;

  UPDATE public.hosts
  SET
    total_bookings    = (SELECT COUNT(*) FROM public.bookings WHERE host_id = v_host_id AND status != 'cancelled'),
    total_earnings_usd = (SELECT COALESCE(SUM(subtotal_usd), 0) FROM public.bookings WHERE host_id = v_host_id AND payment_status = 'paid')
  WHERE id = v_host_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_host_booking_stats ON public.bookings;
CREATE TRIGGER trg_host_booking_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_host_booking_stats();

-- 5b. Reviews → total_reviews, average_rating del host
CREATE OR REPLACE FUNCTION public.update_host_review_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_host_id uuid;
BEGIN
  SELECT e.host_id INTO v_host_id
  FROM public.experiences e
  WHERE e.id = CASE WHEN TG_OP = 'DELETE' THEN OLD.experience_id ELSE NEW.experience_id END;

  UPDATE public.hosts
  SET
    total_reviews  = (
      SELECT COUNT(*) FROM public.experience_reviews er
      JOIN public.experiences e ON e.id = er.experience_id
      WHERE e.host_id = v_host_id AND er.is_visible = true
    ),
    average_rating = (
      SELECT COALESCE(AVG(er.rating), 0) FROM public.experience_reviews er
      JOIN public.experiences e ON e.id = er.experience_id
      WHERE e.host_id = v_host_id AND er.is_visible = true
    )
  WHERE id = v_host_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_host_review_stats ON public.experience_reviews;
CREATE TRIGGER trg_host_review_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.experience_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_host_review_stats();

-- 5c. Experiences → total_listings del host
CREATE OR REPLACE FUNCTION public.update_host_listing_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_host_id uuid;
BEGIN
  v_host_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.host_id ELSE NEW.host_id END;

  UPDATE public.hosts
  SET total_listings = (
    SELECT COUNT(*) FROM public.experiences
    WHERE host_id = v_host_id AND is_published = true AND is_hidden = false
  )
  WHERE id = v_host_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_host_listing_count ON public.experiences;
CREATE TRIGGER trg_host_listing_count
  AFTER INSERT OR UPDATE OR DELETE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_host_listing_count();


-- =============================================================
-- 6. AUTO-UPDATE total_bookings DEL PERFIL (EXPLORER)
-- =============================================================

CREATE OR REPLACE FUNCTION public.update_profile_booking_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_explorer_id uuid;
BEGIN
  v_explorer_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.explorer_id ELSE NEW.explorer_id END;

  IF v_explorer_id IS NOT NULL THEN
    UPDATE public.profiles
    SET total_bookings = (
      SELECT COUNT(*) FROM public.bookings
      WHERE explorer_id = v_explorer_id AND status != 'cancelled'
    )
    WHERE id = v_explorer_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_profile_booking_count ON public.bookings;
CREATE TRIGGER trg_profile_booking_count
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_booking_count();


-- =============================================================
-- 7. CONSTRAINTS FALTANTES
-- =============================================================

-- Wishlists: evitar duplicados
ALTER TABLE public.wishlists
  DROP CONSTRAINT IF EXISTS wishlists_unique_entry;
ALTER TABLE public.wishlists
  ADD CONSTRAINT wishlists_unique_entry UNIQUE (profile_id, experience_id);

-- Reviews: un usuario solo puede reseñar una vez por reserva
ALTER TABLE public.experience_reviews
  DROP CONSTRAINT IF EXISTS experience_reviews_unique_booking;
ALTER TABLE public.experience_reviews
  ADD CONSTRAINT experience_reviews_unique_booking UNIQUE (booking_id);


-- =============================================================
-- 8. ÍNDICES DE RENDIMIENTO
-- =============================================================

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role    ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email   ON public.profiles(email);

-- hosts
CREATE INDEX IF NOT EXISTS idx_hosts_profile_id ON public.hosts(profile_id);
CREATE INDEX IF NOT EXISTS idx_hosts_user_id    ON public.hosts(user_id);
CREATE INDEX IF NOT EXISTS idx_hosts_verified   ON public.hosts(is_verified, status);

-- experiences
CREATE INDEX IF NOT EXISTS idx_experiences_host_id   ON public.experiences(host_id);
CREATE INDEX IF NOT EXISTS idx_experiences_published ON public.experiences(is_published, is_hidden) WHERE is_published = true AND is_hidden = false;
CREATE INDEX IF NOT EXISTS idx_experiences_city      ON public.experiences(city);
CREATE INDEX IF NOT EXISTS idx_experiences_category  ON public.experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_price     ON public.experiences(price_usd);
CREATE INDEX IF NOT EXISTS idx_experiences_rating    ON public.experiences(average_rating DESC);

-- bookings
CREATE INDEX IF NOT EXISTS idx_bookings_explorer_id    ON public.bookings(explorer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_host_id        ON public.bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id  ON public.bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status         ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date   ON public.bookings(booking_date);

-- experience_reviews
CREATE INDEX IF NOT EXISTS idx_reviews_experience_id ON public.experience_reviews(experience_id);
CREATE INDEX IF NOT EXISTS idx_reviews_explorer_id   ON public.experience_reviews(explorer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_visible       ON public.experience_reviews(experience_id, is_visible) WHERE is_visible = true;

-- wishlists
CREATE INDEX IF NOT EXISTS idx_wishlists_profile_id    ON public.wishlists(profile_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_experience_id ON public.wishlists(experience_id);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread  ON public.notifications(user_id, is_read) WHERE is_read = false;


-- =============================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =============================================================

ALTER TABLE public.profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_reviews     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES ----
DROP POLICY IF EXISTS "profiles_select_public"  ON public.profiles;
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- ---- HOSTS ----
DROP POLICY IF EXISTS "hosts_select_active" ON public.hosts;
CREATE POLICY "hosts_select_active"
  ON public.hosts FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "hosts_insert_own" ON public.hosts;
CREATE POLICY "hosts_insert_own"
  ON public.hosts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "hosts_update_own" ON public.hosts;
CREATE POLICY "hosts_update_own"
  ON public.hosts FOR UPDATE USING (auth.uid() = user_id);

-- ---- EXPERIENCES ----
DROP POLICY IF EXISTS "experiences_select_published" ON public.experiences;
CREATE POLICY "experiences_select_published"
  ON public.experiences FOR SELECT
  USING (is_published = true AND is_hidden = false);

DROP POLICY IF EXISTS "experiences_select_own_host" ON public.experiences;
CREATE POLICY "experiences_select_own_host"
  ON public.experiences FOR SELECT
  USING (host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "experiences_insert_host" ON public.experiences;
CREATE POLICY "experiences_insert_host"
  ON public.experiences FOR INSERT
  WITH CHECK (host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "experiences_update_host" ON public.experiences;
CREATE POLICY "experiences_update_host"
  ON public.experiences FOR UPDATE
  USING (host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid()));

-- ---- BOOKINGS ----
DROP POLICY IF EXISTS "bookings_select_participant" ON public.bookings;
CREATE POLICY "bookings_select_participant"
  ON public.bookings FOR SELECT
  USING (
    explorer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR
    host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "bookings_insert_auth" ON public.bookings;
CREATE POLICY "bookings_insert_auth"
  ON public.bookings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "bookings_update_participant" ON public.bookings;
CREATE POLICY "bookings_update_participant"
  ON public.bookings FOR UPDATE
  USING (
    explorer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR
    host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid())
  );

-- ---- REVIEWS ----
DROP POLICY IF EXISTS "reviews_select_visible" ON public.experience_reviews;
CREATE POLICY "reviews_select_visible"
  ON public.experience_reviews FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "reviews_insert_explorer" ON public.experience_reviews;
CREATE POLICY "reviews_insert_explorer"
  ON public.experience_reviews FOR INSERT
  WITH CHECK (explorer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "reviews_update_host_reply" ON public.experience_reviews;
CREATE POLICY "reviews_update_host_reply"
  ON public.experience_reviews FOR UPDATE
  USING (
    experience_id IN (
      SELECT e.id FROM public.experiences e
      JOIN public.hosts h ON h.id = e.host_id
      WHERE h.user_id = auth.uid()
    )
  );

-- ---- WISHLISTS ----
DROP POLICY IF EXISTS "wishlists_own" ON public.wishlists;
CREATE POLICY "wishlists_own"
  ON public.wishlists FOR ALL
  USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- ---- NOTIFICATIONS ----
DROP POLICY IF EXISTS "notifications_own_select" ON public.notifications;
CREATE POLICY "notifications_own_select"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_own_update" ON public.notifications;
CREATE POLICY "notifications_own_update"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ---- IDENTITY VERIFICATIONS ----
DROP POLICY IF EXISTS "identity_verifications_own" ON public.identity_verifications;
CREATE POLICY "identity_verifications_own"
  ON public.identity_verifications FOR SELECT
  USING (host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "identity_verifications_insert" ON public.identity_verifications;
CREATE POLICY "identity_verifications_insert"
  ON public.identity_verifications FOR INSERT
  WITH CHECK (host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid()));


-- =============================================================
-- 10. STORAGE BUCKETS
-- =============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',             'avatars',             true,  5242880,  ARRAY['image/jpeg','image/png','image/webp']),
  ('experience-images',   'experience-images',   true,  10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('identity-documents',  'identity-documents',  false, 10485760, ARRAY['image/jpeg','image/png','application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage: avatars (público)
DROP POLICY IF EXISTS "avatars_public_read"   ON storage.objects;
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_auth_insert" ON storage.objects;
CREATE POLICY "avatars_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "avatars_auth_update" ON storage.objects;
CREATE POLICY "avatars_auth_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage: experience-images (público)
DROP POLICY IF EXISTS "exp_images_public_read" ON storage.objects;
CREATE POLICY "exp_images_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'experience-images');

DROP POLICY IF EXISTS "exp_images_host_insert" ON storage.objects;
CREATE POLICY "exp_images_host_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'experience-images' AND auth.uid() IS NOT NULL);

-- Storage: identity-documents (privado)
DROP POLICY IF EXISTS "identity_docs_own_read" ON storage.objects;
CREATE POLICY "identity_docs_own_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'identity-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "identity_docs_host_insert" ON storage.objects;
CREATE POLICY "identity_docs_host_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'identity-documents' AND auth.uid() IS NOT NULL);
