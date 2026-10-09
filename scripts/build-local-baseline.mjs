// Rebuild the reviewed local-only baseline; never contacts a database.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snapshot = JSON.parse(readFileSync(path.join(root, 'supabase/snapshots/2026-09-19-dependencies.json'), 'utf8'));
const out = path.join(root, 'local-backend/supabase');
const quote = value => `"${value.replaceAll('"', '""')}"`;
const literal = value => value === null ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`;
const role = value => value.toLowerCase() === 'public' ? 'PUBLIC' : quote(value);
if (snapshot.scope !== 'public-app-dependencies-and-court-catalog' || snapshot.court_count !== 3) {
  throw new Error('Expected the reviewed three-court snapshot.');
}
const lines = [
  '-- LOCAL BASELINE ONLY. Reconstructed from the reviewed 2026-09-19 inventory.',
  '-- Preserves existing behavior, including permission issues assigned to T03.',
  '-- Not a remote upgrade. Does not replace the historical root migrations.',
  'SET search_path = public, extensions;',
  'SET check_function_bodies = off;',
  'CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;',
];
const enums = Map.groupBy(snapshot.enums, item => item.type_name);
for (const [name, labels] of enums) {
  lines.push(`CREATE TYPE public.${quote(name)} AS ENUM (${labels.sort((a, b) => a.sort_order - b.sort_order).map(item => literal(item.label)).join(', ')});`);
}
for (const table of snapshot.relations.filter(item => item.relation_kind === 'r')) {
  const cols = snapshot.columns.filter(col => col.relation_name === table.relation_name)
    .sort((a, b) => a.ordinal_position - b.ordinal_position)
    .map(col => `  ${quote(col.column_name)} ${col.data_type}${col.default_expression === null ? '' : ` DEFAULT ${col.default_expression}`}${col.not_null ? ' NOT NULL' : ''}`);
  lines.push(`CREATE TABLE public.${quote(table.relation_name)} (\n${cols.join(',\n')}\n);`);
}
// All tables exist before constraints; keys must precede foreign keys.
for (const constraint of [...snapshot.constraints].sort((a, b) => Number(a.constraint_type === 'f') - Number(b.constraint_type === 'f'))) {
  if (constraint.schema_name !== 'public') throw new Error('Unexpected cross-schema constraint; review before generation.');
  lines.push(`ALTER TABLE public.${quote(constraint.relation_name)} ADD CONSTRAINT ${quote(constraint.constraint_name)} ${constraint.definition};`);
}
const constraintIndexes = new Set(snapshot.constraints.filter(item => ['p', 'u'].includes(item.constraint_type)).map(item => item.constraint_name));
for (const index of snapshot.indexes) {
  if (!constraintIndexes.has(index.indexname)) lines.push(`${index.indexdef};`);
}
for (const fn of snapshot.functions) lines.push(`${fn.definition.trim()};`);
for (const view of snapshot.views) lines.push(`CREATE VIEW public.${quote(view.name)} AS ${view.definition}`);
for (const trigger of snapshot.triggers) lines.push(`${trigger.definition};`);
for (const table of snapshot.relations.filter(item => item.relation_kind === 'r' && item.rls_enabled)) {
  lines.push(`ALTER TABLE public.${quote(table.relation_name)} ENABLE ROW LEVEL SECURITY;`);
  if (table.rls_forced) lines.push(`ALTER TABLE public.${quote(table.relation_name)} FORCE ROW LEVEL SECURITY;`);
}
for (const policy of snapshot.policies) {
  lines.push(`CREATE POLICY ${quote(policy.policyname)} ON public.${quote(policy.tablename)} AS ${policy.permissive} FOR ${policy.cmd} TO ${policy.roles.map(role).join(', ')}${policy.qual === null ? '' : ` USING (${policy.qual})`}${policy.with_check === null ? '' : ` WITH CHECK (${policy.with_check})`};`);
}
for (const grant of snapshot.table_grants) {
  lines.push(`GRANT ${grant.privilege_type} ON TABLE public.${quote(grant.table_name)} TO ${role(grant.grantee)}${grant.is_grantable === 'YES' ? ' WITH GRANT OPTION' : ''};`);
}
for (const fn of snapshot.functions) {
  const signature = `public.${quote(fn.function_name)}(${fn.arguments})`;
  lines.push(`REVOKE ALL ON FUNCTION ${signature} FROM PUBLIC;`);
  // specific_name contains the original database OID; match by exact routine name prefix.
  for (const grant of snapshot.routine_grants.filter(item => item.routine_name === fn.function_name)) {
    lines.push(`GRANT ${grant.privilege_type} ON FUNCTION ${signature} TO ${role(grant.grantee)}${grant.is_grantable === 'YES' ? ' WITH GRANT OPTION' : ''};`);
  }
}
lines.push('SET check_function_bodies = on;');
mkdirSync(path.join(out, 'migrations'), { recursive: true });
writeFileSync(path.join(out, 'migrations/20260919000100_inspected_baseline.sql'), `${lines.join('\n\n')}\n`);

const seed = [
  '-- Local-only catalog from the owner-provided export. Preserve IDs and raw values.',
  '-- Do not merge the two Parque Rodo records or invent user/team fixtures here.',
  ...snapshot.court_catalog.map(court => {
    if (!/^[0-9a-f]+$/i.test(court.coords_geography_text)) throw new Error('Unexpected geography encoding.');
    return `INSERT INTO public.courts (id, name, coords, half_court, lighting, surface, notes, created_at) VALUES (${literal(court.id)}, ${literal(court.name)}, ${literal(court.coords_geography_text)}::public.geography, ${court.half_court}, ${literal(court.lighting)}, ${literal(court.surface)}, ${literal(court.notes)}, ${literal(court.created_at)}) ON CONFLICT (id) DO NOTHING;`;
  }),
];
writeFileSync(path.join(out, 'seed.sql'), `${seed.join('\n')}\n`);
console.log('Generated local baseline and seed from reviewed snapshot. No database contacted.');
