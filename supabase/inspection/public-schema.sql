-- Run only against an identified environment. This query reads schema metadata,
-- not application rows. It is not a migration and does not modify database state.
-- Export the single JSON result locally; review before committing it.
BEGIN TRANSACTION READ ONLY;

WITH target_tables AS (
  SELECT c.oid, n.nspname AS schema_name, c.relname AS table_name,
         c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
    AND c.relname IN ('users_public', 'courts', 'court_memberships')
), column_metadata AS (
  SELECT t.table_name, a.attname AS column_name,
         pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
         a.attnotnull AS not_null,
         pg_catalog.pg_get_expr(d.adbin, d.adrelid) AS default_expression
  FROM target_tables t
  JOIN pg_catalog.pg_attribute a ON a.attrelid = t.oid
  LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
  WHERE a.attnum > 0 AND NOT a.attisdropped
), constraint_metadata AS (
  SELECT t.table_name, c.conname AS constraint_name, c.contype AS constraint_type,
         pg_catalog.pg_get_constraintdef(c.oid) AS definition
  FROM target_tables t JOIN pg_catalog.pg_constraint c ON c.conrelid = t.oid
), index_metadata AS (
  SELECT t.table_name, pg_catalog.pg_get_indexdef(i.indexrelid) AS definition
  FROM target_tables t JOIN pg_catalog.pg_index i ON i.indrelid = t.oid
), trigger_metadata AS (
  SELECT n.nspname AS schema_name, c.relname AS table_name,
         pg_catalog.pg_get_triggerdef(t.oid) AS definition,
         pn.nspname AS function_schema, p.proname AS function_name,
         p.prosecdef AS security_definer, p.proconfig AS function_settings
  FROM pg_catalog.pg_trigger t
  JOIN pg_catalog.pg_class c ON c.oid = t.tgrelid
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_catalog.pg_proc p ON p.oid = t.tgfoid
  JOIN pg_catalog.pg_namespace pn ON pn.oid = p.pronamespace
  WHERE NOT t.tgisinternal AND (
    (n.nspname = 'public' AND c.relname IN ('users_public', 'courts', 'court_memberships'))
    OR (n.nspname = 'auth' AND c.relname = 'users')
  )
)
SELECT jsonb_build_object(
  'captured_at', CURRENT_TIMESTAMP,
  'postgres_version', current_setting('server_version'),
  'scope', 'profiles-courts-membership-metadata',
  'tables', COALESCE((SELECT jsonb_agg(to_jsonb(t) - 'oid' ORDER BY table_name) FROM target_tables t), '[]'::jsonb),
  'columns', COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY table_name, column_name) FROM column_metadata c), '[]'::jsonb),
  'constraints', COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY table_name, constraint_name) FROM constraint_metadata c), '[]'::jsonb),
  'indexes', COALESCE((SELECT jsonb_agg(to_jsonb(i) ORDER BY table_name, definition) FROM index_metadata i), '[]'::jsonb),
  'triggers', COALESCE((SELECT jsonb_agg(to_jsonb(t) ORDER BY schema_name, table_name, definition) FROM trigger_metadata t), '[]'::jsonb),
  'policies', COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY tablename, policyname) FROM pg_catalog.pg_policies p WHERE schemaname = 'public' AND tablename IN ('users_public', 'courts', 'court_memberships')), '[]'::jsonb),
  'table_grants', COALESCE((SELECT jsonb_agg(to_jsonb(g) ORDER BY table_name, grantee, privilege_type) FROM information_schema.table_privileges g WHERE table_schema = 'public' AND table_name IN ('users_public', 'courts', 'court_memberships')), '[]'::jsonb),
  'column_grants', COALESCE((SELECT jsonb_agg(to_jsonb(g) ORDER BY table_name, column_name, grantee, privilege_type) FROM information_schema.column_privileges g WHERE table_schema = 'public' AND table_name IN ('users_public', 'courts', 'court_memberships')), '[]'::jsonb),
  'limitations', 'Grant visibility depends on the inspecting role. Function bodies and business rows are excluded; review relevant function definitions separately.'
) AS schema_snapshot;

COMMIT;
