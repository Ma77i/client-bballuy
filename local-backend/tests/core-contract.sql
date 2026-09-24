-- Run only through scripts/local-backend.mjs against bballuy-local.
-- Every fixture and mutation rolls back, including failures.
BEGIN;
INSERT INTO auth.users (id, raw_user_meta_data)
VALUES ('00000000-0000-4000-8000-000000000001', '{"display_name":"Local contract fixture"}');

DO $$
DECLARE
  fixture_user uuid := '00000000-0000-4000-8000-000000000001';
  fixture_court uuid := '43fd5901-f3f6-4e5e-9ae6-d32c2dcc4764';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users_public WHERE id = fixture_user AND display_name = 'Local contract fixture' AND app_role = 'player') THEN
    RAISE EXCEPTION 'The inspected signup trigger did not create the expected profile';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.court_catalog WHERE id = fixture_court AND abs(longitude - (-56.168726)) < 0.000001 AND latitude BETWEEN -35 AND -34) THEN
    RAISE EXCEPTION 'Map coordinate projection is invalid or axes are reversed';
  END IF;
  INSERT INTO public.court_memberships (user_id, court_id) VALUES (fixture_user, fixture_court);
  IF NOT EXISTS (SELECT 1 FROM public.court_memberships WHERE user_id=fixture_user AND court_id=fixture_court AND joined_at IS NOT NULL) THEN
    RAISE EXCEPTION 'Membership did not receive its server timestamp';
  END IF;
  BEGIN
    INSERT INTO public.court_memberships (user_id, court_id) VALUES (fixture_user, fixture_court);
    RAISE EXCEPTION 'Duplicate membership accepted';
  EXCEPTION WHEN unique_violation THEN NULL;
  END;
  BEGIN
    INSERT INTO public.court_memberships (user_id, court_id) VALUES (fixture_user, '00000000-0000-4000-8000-000000000002');
    RAISE EXCEPTION 'Missing court accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL;
  END;
  BEGIN
    INSERT INTO public.court_memberships (user_id, court_id) VALUES ('00000000-0000-4000-8000-000000000002', fixture_court);
    RAISE EXCEPTION 'Missing user accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL;
  END;
  DELETE FROM public.court_memberships WHERE user_id=fixture_user AND court_id=fixture_court;
  INSERT INTO public.court_memberships (user_id, court_id) VALUES (fixture_user, fixture_court);
  INSERT INTO public.court_memberships (user_id, court_id) VALUES (fixture_user, '61b2c883-d029-4725-9142-bc1af122b84f');
  DELETE FROM public.court_memberships WHERE user_id=fixture_user AND court_id=fixture_court;
  IF (SELECT count(*) FROM public.court_memberships WHERE user_id=fixture_user) <> 1 THEN
    RAISE EXCEPTION 'Leaving one court affected another membership';
  END IF;
  IF EXISTS (SELECT 1 FROM public.team_members WHERE user_id=fixture_user) THEN
    RAISE EXCEPTION 'Fixture unexpectedly requires a team';
  END IF;
  IF has_any_column_privilege('anon', 'public.court_memberships', 'INSERT')
    OR has_column_privilege('authenticated', 'public.court_memberships', 'joined_at', 'INSERT')
    OR NOT has_column_privilege('authenticated', 'public.court_memberships', 'user_id', 'INSERT') THEN
    RAISE EXCEPTION 'Membership grants must preserve caller ownership and server timestamps';
  END IF;
END;
$$;
ROLLBACK;
