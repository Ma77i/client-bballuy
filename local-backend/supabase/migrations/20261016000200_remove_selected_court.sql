-- Owner-requested local removal; preserve the separate Parque Rodo court.
DO $$
DECLARE target uuid := '61b2c883-d029-4725-9142-bc1af122b84f';
BEGIN
  -- Block concurrent references while checking history and deleting the row.
  PERFORM 1 FROM public.courts WHERE id=target FOR UPDATE;
  IF EXISTS (SELECT 1 FROM public.courts WHERE id=target AND name <> 'Parque Rodó Court') THEN
    RAISE EXCEPTION 'Selected court identity changed; abort removal';
  END IF;
  IF EXISTS (SELECT 1 FROM public.games WHERE court_id=target)
    OR EXISTS (SELECT 1 FROM public.matches WHERE court_id=target)
    OR EXISTS (SELECT 1 FROM public.teams WHERE home_court_id=target)
    OR EXISTS (SELECT 1 FROM public.pickup_sessions WHERE court_id=target)
    OR EXISTS (SELECT 1 FROM public.pickup_matches WHERE court_id=target) THEN
    RAISE EXCEPTION 'Selected court has history; review before removal';
  END IF;
  -- Existing FK cascade removes community memberships, never user accounts.
  DELETE FROM public.courts WHERE id=target;
END $$;
