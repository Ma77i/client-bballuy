-- T02 follow-up to public-schema.sql. Run in the same project's SQL Editor.
-- Read-only: schema metadata, application function definitions and court catalog.
-- No auth/user/team rows, passwords or session tokens are queried.
-- Review function definitions and court notes for embedded private values before
-- sharing the result. This does not execute application functions or migrations.
BEGIN TRANSACTION READ ONLY;

WITH app_relations AS (
  SELECT c.oid, n.nspname AS schema_name, c.relname AS relation_name,
         c.relkind AS relation_kind, c.relrowsecurity AS rls_enabled,
         c.relforcerowsecurity AS rls_forced
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p', 'v', 'm')
    AND NOT EXISTS (
      SELECT 1 FROM pg_catalog.pg_depend d
      WHERE d.classid = 'pg_catalog.pg_class'::regclass
        AND d.objid = c.oid AND d.deptype = 'e'
    )
), columns AS (
  SELECT t.relation_name, a.attnum AS ordinal_position,
         a.attname AS column_name,
         pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
         a.attnotnull AS not_null,
         pg_catalog.pg_get_expr(d.adbin, d.adrelid) AS default_expression
  FROM app_relations t
  JOIN pg_catalog.pg_attribute a ON a.attrelid = t.oid
  LEFT JOIN pg_catalog.pg_attrdef d
    ON d.adrelid = a.attrelid AND d.adnum = a.attnum
  WHERE a.attnum > 0 AND NOT a.attisdropped
), constraints AS (
  SELECT n.nspname AS schema_name, t.relname AS relation_name,
         c.conname AS constraint_name, c.contype AS constraint_type,
         pg_catalog.pg_get_constraintdef(c.oid) AS definition
  FROM pg_catalog.pg_constraint c
  JOIN pg_catalog.pg_class t ON t.oid = c.conrelid
  JOIN pg_catalog.pg_namespace n ON n.oid = t.relnamespace
  WHERE c.conrelid IN (SELECT oid FROM app_relations)
     OR c.confrelid IN (SELECT oid FROM app_relations)
), app_functions AS (
  SELECT p.oid, n.nspname AS schema_name, p.proname AS function_name,
         pg_catalog.pg_get_function_identity_arguments(p.oid) AS arguments,
         pg_catalog.pg_get_functiondef(p.oid) AS definition,
         p.prosecdef AS security_definer, p.proconfig AS function_settings
  FROM pg_catalog.pg_proc p
  JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public' AND p.prokind IN ('f', 'p')
    AND NOT EXISTS (
      SELECT 1 FROM pg_catalog.pg_depend d
      WHERE d.classid = 'pg_catalog.pg_proc'::regclass
        AND d.objid = p.oid AND d.deptype = 'e'
    )
), enum_labels AS (
  SELECT n.nspname AS schema_name, t.typname AS type_name,
         e.enumlabel AS label, e.enumsortorder AS sort_order
  FROM pg_catalog.pg_type t
  JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
  JOIN pg_catalog.pg_enum e ON e.enumtypid = t.oid
  WHERE n.nspname = 'public'
), extension_versions AS (
  SELECT e.extname AS name, e.extversion AS version, n.nspname AS schema_name
  FROM pg_catalog.pg_extension e
  JOIN pg_catalog.pg_namespace n ON n.oid = e.extnamespace
), trigger_definitions AS (
  SELECT n.nspname AS schema_name, c.relname AS relation_name,
         pg_catalog.pg_get_triggerdef(t.oid) AS definition
  FROM pg_catalog.pg_trigger t
  JOIN pg_catalog.pg_class c ON c.oid = t.tgrelid
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  WHERE NOT t.tgisinternal AND (
    c.oid IN (SELECT oid FROM app_relations)
    OR (n.nspname = 'auth' AND c.relname = 'users')
  )
), court_catalog AS (
  -- Preserve the original geography representation, without assuming JSON coords.
  SELECT id, name, coords::text AS coords_geography_text,
         half_court, lighting, surface, notes, created_at
  FROM public.courts
)
SELECT jsonb_build_object(
  'captured_at', CURRENT_TIMESTAMP,
  'inspection_role', CURRENT_USER,
  'postgres_version', current_setting('server_version'),
  'scope', 'public-app-dependencies-and-court-catalog',
  'relations', COALESCE((SELECT jsonb_agg(to_jsonb(t) - 'oid' ORDER BY relation_name) FROM app_relations t), '[]'::jsonb),
  'columns', COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY relation_name, ordinal_position) FROM columns c), '[]'::jsonb),
  'constraints', COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY schema_name, relation_name, constraint_name) FROM constraints c), '[]'::jsonb),
  'enums', COALESCE((SELECT jsonb_agg(to_jsonb(e) ORDER BY schema_name, type_name, sort_order) FROM enum_labels e), '[]'::jsonb),
  'extensions', COALESCE((SELECT jsonb_agg(to_jsonb(e) ORDER BY name) FROM extension_versions e), '[]'::jsonb),
  'functions', COALESCE((SELECT jsonb_agg(to_jsonb(f) - 'oid' ORDER BY schema_name, function_name, arguments) FROM app_functions f), '[]'::jsonb),
  'triggers', COALESCE((SELECT jsonb_agg(to_jsonb(t) ORDER BY schema_name, relation_name, definition) FROM trigger_definitions t), '[]'::jsonb),
  'indexes', COALESCE((SELECT jsonb_agg(to_jsonb(i) ORDER BY tablename, indexname) FROM pg_catalog.pg_indexes i WHERE schemaname = 'public' AND tablename IN (SELECT relation_name FROM app_relations)), '[]'::jsonb),
  'views', COALESCE((SELECT jsonb_agg(jsonb_build_object('name', relation_name, 'definition', pg_catalog.pg_get_viewdef(oid, true)) ORDER BY relation_name) FROM app_relations WHERE relation_kind IN ('v', 'm')), '[]'::jsonb),
  'policies', COALESCE((SELECT jsonb_agg(to_jsonb(p) ORDER BY tablename, policyname) FROM pg_catalog.pg_policies p WHERE schemaname = 'public' AND tablename IN (SELECT relation_name FROM app_relations)), '[]'::jsonb),
  'table_grants', COALESCE((SELECT jsonb_agg(to_jsonb(g) ORDER BY table_name, grantee, privilege_type) FROM information_schema.table_privileges g WHERE table_schema = 'public' AND table_name IN (SELECT relation_name FROM app_relations)), '[]'::jsonb),
  'routine_grants', COALESCE((SELECT jsonb_agg(to_jsonb(g) ORDER BY specific_name, grantee, privilege_type) FROM information_schema.routine_privileges g WHERE specific_schema = 'public' AND specific_name IN (SELECT function_name || '_' || oid::text FROM app_functions)), '[]'::jsonb),
  'court_count', (SELECT count(*) FROM court_catalog),
  'court_catalog', COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM court_catalog c), '[]'::jsonb),
  'migration_history_table_present', to_regclass('supabase_migrations.schema_migrations') IS NOT NULL,
  'limitations', 'Not a full database backup. No user/team rows or migration history exported. Private schemas, sequences and full role configuration excluded. Court accuracy/provenance requires owner review. Function definitions may contain embedded private values; review before sharing.'
) AS dependency_snapshot;

COMMIT;
