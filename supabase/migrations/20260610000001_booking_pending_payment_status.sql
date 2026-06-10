-- =============================================================
-- DoCoolture — Soporte para reservas en estado pendiente de pago
--
-- Contexto: el flujo de Cardnet ahora crea la reserva ANTES de
-- cobrar (status: pending_payment) para evitar cobros sin reserva.
-- Si Cardnet falla, la reserva queda en payment_failed.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =============================================================


-- =============================================================
-- 1. AMPLIAR CHECK CONSTRAINT de status en bookings
--
-- El schema actual permite:
--   pending | confirmed | completed | cancelled | no_show
--
-- Necesitamos agregar:
--   pending_payment  → reserva creada, tarjeta aún no cobrada
--   payment_failed   → intento de cobro rechazado/error
--
-- payment_status YA tiene: pending | paid | failed | refunded ✅
-- payment_method YA tiene: cardnet_direct ✅
-- =============================================================

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_status_check CHECK (
    status = ANY (ARRAY[
      'pending_payment'::text,
      'payment_failed'::text,
      'pending'::text,
      'confirmed'::text,
      'completed'::text,
      'cancelled'::text,
      'no_show'::text
    ])
  );


-- =============================================================
-- 2. CORREGIR TRIGGER: total_bookings del HOST
--    Antes: contaba todo excepto 'cancelled'
--    Ahora: excluye también pending_payment y payment_failed
--    (no son reservas reales confirmadas)
-- =============================================================

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
    total_bookings     = (
      SELECT COUNT(*) FROM public.bookings
      WHERE host_id = v_host_id
        AND status NOT IN ('cancelled', 'pending_payment', 'payment_failed')
    ),
    total_earnings_usd = (
      SELECT COALESCE(SUM(subtotal_usd), 0) FROM public.bookings
      WHERE host_id = v_host_id
        AND payment_status = 'paid'
    )
  WHERE id = v_host_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;


-- =============================================================
-- 3. CORREGIR TRIGGER: total_bookings del PERFIL (explorer)
--    Misma lógica: excluir reservas de pago fallido/pendiente
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
      WHERE explorer_id = v_explorer_id
        AND status NOT IN ('cancelled', 'pending_payment', 'payment_failed')
    )
    WHERE id = v_explorer_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;


-- =============================================================
-- 4. ÍNDICE para limpiar reservas huérfanas (opcional pero útil)
--    Permite hacer fácilmente:
--    SELECT * FROM bookings WHERE status = 'pending_payment'
--    AND created_at < NOW() - INTERVAL '30 minutes'
-- =============================================================

CREATE INDEX IF NOT EXISTS idx_bookings_pending_payment
  ON public.bookings(status, created_at)
  WHERE status IN ('pending_payment', 'payment_failed');
