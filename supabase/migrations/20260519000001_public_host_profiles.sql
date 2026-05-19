-- =============================================================
-- Allow public (anon) to read all host profiles
-- Needed for /talento/[handle] pages to work regardless of
-- the host's status (active, pending_review, etc.)
-- =============================================================

-- Drop any existing restrictive public-read policy on hosts
DROP POLICY IF EXISTS "hosts_public_read" ON public.hosts;
DROP POLICY IF EXISTS "Public can view active hosts" ON public.hosts;
DROP POLICY IF EXISTS "Anyone can view hosts" ON public.hosts;

-- Allow anyone (including unauthenticated visitors) to read any host profile
CREATE POLICY "hosts_public_read"
  ON public.hosts FOR SELECT
  TO anon, authenticated
  USING (true);
