-- T03: local-only permission changes. Review an incremental hosted upgrade separately.
-- Revoke both table and column grants; table revocation alone leaves column ACLs.
REVOKE ALL ON public.users_public, public.courts, public.court_catalog,
  public.court_memberships FROM PUBLIC, anon, authenticated;
DO $$
DECLARE
  relation_name text;
  column_list text;
BEGIN
  FOREACH relation_name IN ARRAY ARRAY['users_public', 'courts', 'court_catalog', 'court_memberships'] LOOP
    SELECT string_agg(quote_ident(a.attname), ', ' ORDER BY a.attnum)
      INTO column_list FROM pg_attribute a
      WHERE a.attrelid = format('public.%I', relation_name)::regclass
        AND a.attnum > 0 AND NOT a.attisdropped;
    EXECUTE format('REVOKE ALL (%s) ON public.%I FROM PUBLIC, anon, authenticated', column_list, relation_name);
  END LOOP;
END;
$$;

-- Profiles are created by the existing trusted signup trigger, never a caller upsert.
DROP POLICY up_insert ON public.users_public;
DROP POLICY up_update ON public.users_public;
CREATE POLICY profile_update_own ON public.users_public
  FOR UPDATE TO authenticated USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));
GRANT SELECT ON public.users_public TO authenticated;
GRANT UPDATE (display_name, avatar_url, discoverable, profile_visibility, location_mode)
  ON public.users_public TO authenticated;
ALTER FUNCTION public.handle_new_auth_user() SET search_path = '';
REVOKE EXECUTE ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;

-- Catalog reads remain available through the existing SELECT policy/invoker view.
GRANT SELECT ON public.courts, public.court_catalog TO anon, authenticated;

-- No public roster is implied by the community membership feature.
GRANT SELECT, DELETE ON public.court_memberships TO authenticated;
GRANT INSERT (user_id, court_id) ON public.court_memberships TO authenticated;
CREATE POLICY membership_read_own ON public.court_memberships
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY membership_join_own ON public.court_memberships
  FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY membership_leave_own ON public.court_memberships
  FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));
