-- =============================================================
-- Admin full-access policies + missing fixes
-- =============================================================

-- Helper: check if the current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- =============================================================
-- EXPERIENCES — admin sees and can modify everything
-- =============================================================
DROP POLICY IF EXISTS "experiences_admin_all" ON public.experiences;
CREATE POLICY "experiences_admin_all"
  ON public.experiences FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Missing DELETE policy for host owners
DROP POLICY IF EXISTS "experiences_delete_host" ON public.experiences;
CREATE POLICY "experiences_delete_host"
  ON public.experiences FOR DELETE
  USING (host_id IN (SELECT id FROM public.hosts WHERE user_id = auth.uid()));

-- =============================================================
-- HOSTS — admin sees all (including suspended)
-- =============================================================
DROP POLICY IF EXISTS "hosts_admin_all" ON public.hosts;
CREATE POLICY "hosts_admin_all"
  ON public.hosts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================
-- PROFILES — admin sees all
-- =============================================================
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================
-- BOOKINGS — admin sees all
-- =============================================================
DROP POLICY IF EXISTS "bookings_admin_all" ON public.bookings;
CREATE POLICY "bookings_admin_all"
  ON public.bookings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================
-- REVIEWS — admin sees all and can toggle visibility
-- =============================================================
DROP POLICY IF EXISTS "reviews_admin_all" ON public.experience_reviews;
CREATE POLICY "reviews_admin_all"
  ON public.experience_reviews FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================
-- WISHLISTS — admin sees all
-- =============================================================
DROP POLICY IF EXISTS "wishlists_admin_all" ON public.wishlists;
CREATE POLICY "wishlists_admin_all"
  ON public.wishlists FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================
-- NOTIFICATIONS — fix: allow any authenticated user to INSERT
-- (needed so admin/host actions can notify other users)
-- =============================================================
DROP POLICY IF EXISTS "notifications_insert_auth" ON public.notifications;
CREATE POLICY "notifications_insert_auth"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "notifications_admin_all" ON public.notifications;
CREATE POLICY "notifications_admin_all"
  ON public.notifications FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================
-- IDENTITY VERIFICATIONS — admin sees and manages all
-- =============================================================
DROP POLICY IF EXISTS "identity_verifications_admin_all" ON public.identity_verifications;
CREATE POLICY "identity_verifications_admin_all"
  ON public.identity_verifications FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
