import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseEnv } from 'node:util';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tables = ['users_public', 'courts', 'court_memberships'];

export function inspectionRequest(env) {
  const url = new URL(env.EXPO_PUBLIC_SUPABASE_URL);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash ||
      (url.protocol !== 'https:' && !(local && url.protocol === 'http:'))) {
    throw new Error('Use an HTTPS Supabase URL or HTTP localhost without embedded credentials.');
  }
  if (url.pathname !== '/') throw new Error('Use the Supabase project origin, without an API path.');
  const key = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('Missing public Supabase API key.');
  const headers = { apikey: key, Accept: 'application/openapi+json' };
  if (key.startsWith('sb_publishable_')) {
    // Publishable keys are not JWT bearer tokens.
  } else {
    let claims;
    try { claims = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()); }
    catch { throw new Error('Expected a publishable key or an anon-role JWT.'); }
    if (claims.role !== 'anon') throw new Error('Schema inspection only uses the public anon role.');
    headers.Authorization = `Bearer ${key}`;
  }
  return { url: new URL('/rest/v1/', url), headers };
}

export function summarizeSchema(document) {
  if (!document || document.swagger !== '2.0' || typeof document.paths !== 'object' ||
      !document.paths || Array.isArray(document.paths)) {
    throw new Error('The server did not return a PostgREST OpenAPI 2 document.');
  }
  const definitions = document.definitions ?? {};
  return tables.map(table => {
    const definition = Object.hasOwn(definitions, table) ? definitions[table] : undefined;
    if (!definition?.properties) return { table, visibility: 'not_exposed_or_absent', columns: [] };
    const required = new Set(definition.required ?? []);
    const columns = Object.entries(definition.properties).map(([name, property]) => ({
      name,
      type: typeof property.type === 'string' ? property.type : null,
      format: typeof property.format === 'string' ? property.format : null,
      requiredByApi: required.has(name),
    })).sort((a, b) => a.name.localeCompare(b.name));
    return { table, visibility: 'exposed_to_public_key', columns };
  });
}

async function main() {
  let fileEnv = {};
  try { fileEnv = parseEnv(readFileSync(path.join(root, '.env'), 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const request = inspectionRequest({ ...fileEnv, ...process.env });
  const response = await fetch(request.url, {
    method: 'GET', headers: request.headers, redirect: 'error', signal: AbortSignal.timeout(15000),
  });
  // Do not print response bodies: errors may contain infrastructure details.
  if (!response.ok) throw new Error(
    `Schema endpoint returned HTTP ${response.status}.` +
    ((response.status === 401 || response.status === 403)
      ? ' Hosted Supabase no longer exposes OpenAPI to public keys. This does not establish that the key is invalid. Use the catalog SQL inventory or authorized Management API; see docs/database-reconciliation.md.'
      : ''),
  );
  const summary = summarizeSchema(await response.json());
  const report = {
    capturedAt: new Date().toISOString(), origin: request.url.origin,
    scope: 'public-key-visible-api-metadata-only',
    limitations: 'Not a complete database snapshot. Absence does not prove a table is missing. No RLS, grants, triggers or row data inspected.',
    tables: summary,
  };
  mkdirSync(path.join(root, '.harness'), { recursive: true });
  writeFileSync(path.join(root, '.harness', 'database-api.json'), `${JSON.stringify(report, null, 2)}\n`);
  for (const table of summary) console.log(`${table.table}: ${table.visibility}; ${table.columns.length} visible columns`);
  console.log('Metadata saved to .harness/database-api.json. No rows read and no writes sent.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    const code = error.cause?.code;
    console.error(`Read-only schema inspection failed: ${error.message}${code ? ` (${code})` : ''}`);
    process.exitCode = 1;
  });
}
