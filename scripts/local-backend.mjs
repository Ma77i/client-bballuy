import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Buffer } from 'node:buffer';
import { networkInterfaces } from 'node:os';
import { selectLanAddress } from './local-device.mjs';
import { verifyAuthorization } from '../local-backend/tests/authorization.mjs';
import { verifySessions } from '../local-backend/tests/sessions.mjs';
import { verifyPickup } from '../local-backend/tests/pickup.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspace = path.join(root, 'local-backend');
const config = readFileSync(path.join(workspace, 'supabase/config.toml'), 'utf8');
const cli = path.join(workspace, 'tools/node_modules/supabase/dist/supabase.js');
if (!existsSync(cli)) throw new Error('Install local tooling with npm ci --prefix local-backend/tools.');
const docker = process.platform === 'win32' ? 'C:/Program Files/Docker/Docker/resources/bin/docker.exe' : 'docker';
const project = 'bballuy-local';
const network = 'bballuy-local-network';
const container = `supabase_db_${project}`;
const action = process.argv[2];
const excluded = 'realtime,storage-api,imgproxy,postgres-meta,studio,edge-runtime,logflare,vector,supavisor';
if (!/^project_id = "bballuy-local"$/m.test(config) || existsSync(path.join(workspace, 'supabase/.temp/project-ref'))) {
  throw new Error('Only the unlinked bballuy-local workspace is allowed.');
}
mkdirSync(path.join(root, '.harness'), { recursive: true });
function run(command, args, input) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', input, maxBuffer: 20 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    // Redact credentials even from ignored local diagnostics.
    const diagnostic = `${result.stdout || ''}\n${result.stderr || ''}`
      .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[redacted-database-url]')
      .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[redacted-token]')
      .replace(/sb_(?:secret|publishable)_[A-Za-z0-9_-]+/g, '[redacted-key]');
    writeFileSync(path.join(root, '.harness/local-backend-error.log'), diagnostic);
    throw new Error(`Local ${action} failed (exit ${result.status}). Review .harness/local-backend-error.log privately.`);
  }
  return result.stdout;
}
function supabase(args) {
  return run(process.execPath, [cli, ...args, '--workdir', workspace, '--network-id', network]);
}
function database(sql) {
  const name = run(docker, ['inspect', '--format', '{{.Name}}', container]).trim();
  if (name !== `/${container}`) throw new Error('Unexpected local database container.');
  return run(docker, ['exec', '-i', container, 'psql', '-X', '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'postgres'], sql);
}

switch (action) {
  case 'start': {
    const networks = run(docker, ['network', 'ls', '--filter', `name=^${network}$`, '--format', '{{.Name}}']).trim();
    if (!networks) run(docker, ['network', 'create', '--label', 'com.bballuy.purpose=local-development', '-o', 'com.docker.network.bridge.host_binding_ipv4=127.0.0.1', network]);
    const binding = run(docker, ['network', 'inspect', '--format', '{{index .Options "com.docker.network.bridge.host_binding_ipv4"}}', network]).trim();
    if (binding !== '127.0.0.1') throw new Error('Local network must bind published ports to loopback.');
    supabase(['start', '--exclude', excluded]);
    const published = JSON.parse(run(docker, ['inspect', '--format', '{{json .NetworkSettings.Ports}}', container]));
    const loopbackOnly = Object.values(published).flat().filter(Boolean).every(port => ['127.0.0.1', '::1'].includes(port.HostIp));
    console.log('Local Supabase started. API: http://127.0.0.1:55431. Remote configuration unchanged.');
    if (!loopbackOnly) console.warn('This Docker host publishes local development ports beyond loopback despite the network setting. Use only a trusted development network and run db:local:stop after testing.');
    break;
  }
  case 'stop':
    supabase(['stop']);
    console.log('Stopped bballuy-local; local data is retained.');
    break;
  case 'reset':
    supabase(['db', 'reset', '--local', '--yes']);
    console.log('Replayed migrations and seed in bballuy-local only.');
    break;
  case 'migrate':
    supabase(['migration', 'up', '--local']);
    console.log('Applied pending incremental migrations to bballuy-local; existing data retained.');
    break;
  case 'types': {
    const types = supabase(['gen', 'types', '--local', '--lang', 'typescript', '--schema', 'public']);
    const firstExport = types.indexOf('export type Json');
    if (firstExport < 0 || !types.includes('court_memberships:') || !types.includes('court_catalog:')) throw new Error('Unexpected type-generation output.');
    writeFileSync(path.join(root, 'lib/backend/database.types.ts'), `// Generated from the local inspected baseline plus MVP migrations. Do not edit.\n${types.slice(firstExport)}`);
    console.log('Generated lib/backend/database.types.ts from the local database.');
    break;
  }
  case 'verify': {
    const snapshot = JSON.parse(readFileSync(path.join(root, 'supabase/snapshots/2026-09-19-dependencies.json'), 'utf8'));
    const actual = JSON.parse(database("SELECT jsonb_agg(jsonb_build_object('id',id,'name',name,'coords_geography_text',upper(encode(ST_AsEWKB(coords::geometry),'hex')),'half_court',half_court,'lighting',lighting,'surface',surface,'notes',notes,'created_at',created_at) ORDER BY id) FROM public.courts;"));
    const canonical = rows => rows.map(row => {
      const fraction = (row.created_at.match(/\.(\d+)/)?.[1] ?? '').padEnd(6, '0');
      // Preserve PostgreSQL microseconds while normalizing timezone offsets.
      const instant = BigInt(new Date(row.created_at).getTime()) * 1000n + BigInt(fraction.slice(3, 6));
      return { ...row, created_at: instant.toString() };
    });
    const additions = JSON.parse(readFileSync(path.join(workspace, 'catalog/2026-10-16.json'), 'utf8'));
    const retired = JSON.parse(readFileSync(path.join(workspace, 'catalog/retired.json'), 'utf8'));
    const retainedOriginals = snapshot.court_catalog.filter(court => !retired.some(row => row.id === court.id));
    const expected = [...canonical(retainedOriginals), ...additions.map(({ latitude, longitude, ...court }) => {
      const point = Buffer.alloc(25);
      point.writeUInt8(1, 0); point.writeUInt32LE(0x20000001, 1); point.writeUInt32LE(4326, 5);
      point.writeDoubleLE(longitude, 9); point.writeDoubleLE(latitude, 17);
      return { ...court, coords_geography_text: point.toString('hex').toUpperCase() };
    })].sort((a, b) => a.id.localeCompare(b.id));
    const normalized = canonical(actual);
    if (expected.length !== normalized.length || expected.some((court, i) => Object.keys(court).some(key => court[key] !== normalized[i][key]))) {
      throw new Error('Local court catalog differs from the preserved source.');
    }
    // Replaying the batch must preserve every row, including generated timestamps.
    const catalogSnapshot = () => database('SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM public.courts c;');
    const beforeReplay = catalogSnapshot();
    const importSql = readFileSync(path.join(workspace, 'supabase/migrations/20261016000100_owner_courts.sql'), 'utf8');
    database(importSql);
    database(importSql);
    const removalSql = readFileSync(path.join(workspace, 'supabase/migrations/20261016000200_remove_selected_court.sql'), 'utf8');
    database(removalSql);
    database(removalSql);
    if (catalogSnapshot() !== beforeReplay) throw new Error('Owner court import replay changed the catalog.');
    const originalColumns = snapshot.columns.filter(col => ['courts', 'users_public'].includes(col.relation_name));
    const localColumns = JSON.parse(database("SELECT jsonb_agg(jsonb_build_object('relation_name',c.relname,'column_name',a.attname,'data_type',format_type(a.atttypid,a.atttypmod),'not_null',a.attnotnull)) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_attribute a ON a.attrelid=c.oid WHERE n.nspname='public' AND c.relname IN ('courts','users_public') AND a.attnum>0 AND NOT a.attisdropped;"));
    if (localColumns.length !== originalColumns.length || originalColumns.some(col => !localColumns.some(actualCol => ['relation_name', 'column_name', 'data_type', 'not_null'].every(key => actualCol[key] === col[key])))) {
      throw new Error('Local core columns differ from inspected schema.');
    }
    database(readFileSync(path.join(workspace, 'tests/core-contract.sql'), 'utf8'));
    const status = JSON.parse(supabase(['status', '-o', 'json']));
    const publicKey = status.ANON_KEY ?? status.PUBLISHABLE_KEY;
    if (!publicKey) throw new Error('Local public API key unavailable.');
    for (const route of [
      'courts?select=id,name&order=id',
      'court_catalog?select=id,name,latitude,longitude,half_court,lighting,surface,notes&order=id',
    ]) {
      const response = await fetch(`http://127.0.0.1:55431/rest/v1/${route}`, {
        headers: { apikey: publicKey }, redirect: 'error', signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error(`Local catalog API returned HTTP ${response.status}.`);
      const rows = await response.json();
      if (rows.length !== expected.length || rows.some((row, i) => row.id !== expected[i].id || row.name !== expected[i].name)) {
        throw new Error('Local API catalog differs from the preserved source.');
      }
      if (route.startsWith('court_catalog')) {
        for (const [i, row] of rows.entries()) {
          const point = Buffer.from(expected[i].coords_geography_text, 'hex');
          if (point.length !== 25 || point.readUInt32LE(1) !== 0x20000001 || point.readUInt32LE(5) !== 4326 ||
              row.longitude !== point.readDoubleLE(9) || row.latitude !== point.readDoubleLE(17) ||
              row.lighting !== expected[i].lighting || row.half_court !== expected[i].half_court ||
              row.surface !== expected[i].surface || row.notes !== expected[i].notes) {
            throw new Error('Local API coordinate/attribute conversion differs from the source.');
          }
        }
      }
    }
    const versions = database("SELECT jsonb_build_object('postgres',current_setting('server_version'),'postgis',postgis_lib_version());").trim();
    console.log(`PASS: ${retainedOriginals.length} preserved original courts and ${additions.length} owner additions; ${retired.length} explicitly retired court absent, 21 core columns, public catalog API, signup trigger, coordinates and membership invariants. Runtime: ${versions}`);
    break;
  }
  case 'permissions': {
    const status = JSON.parse(supabase(['status', '-o', 'json']));
    const publicKey = status.PUBLISHABLE_KEY ?? status.ANON_KEY;
    if (!publicKey) throw new Error('Local public API key unavailable.');
    await verifyAuthorization({ publicKey, database });
    break;
  }
  case 'pickup': {
    const status = JSON.parse(supabase(['status', '-o', 'json']));
    const publicKey = status.PUBLISHABLE_KEY ?? status.ANON_KEY;
    if (!publicKey) throw new Error('Local public API key unavailable.');
    await verifyPickup({ publicKey, database });
    break;
  }
  case 'sessions': {
    const status = JSON.parse(supabase(['status', '-o', 'json']));
    const publicKey = status.PUBLISHABLE_KEY ?? status.ANON_KEY;
    const adminKey = status.SECRET_KEY ?? status.SERVICE_ROLE_KEY;
    if (!publicKey || !adminKey) throw new Error('Local test keys unavailable.');
    await verifySessions({ publicKey, adminKey, database });
    break;
  }
  case 'device':
  case 'web': {
    const device = action === 'device';
    const args = process.argv.slice(3);
    if (args.some(arg => !device || !arg.startsWith('--address=')) || args.length > 1) {
      throw new Error('Only device --address=PRIVATE_IP is supported.');
    }
    const host = device ? selectLanAddress(networkInterfaces(), args[0]?.slice('--address='.length)) : '127.0.0.1';
    const status = JSON.parse(supabase(['status', '-o', 'json']));
    const publicKey = status.PUBLISHABLE_KEY ?? status.ANON_KEY;
    if (!publicKey) throw new Error('Local public API key unavailable.');
    const apiUrl = `http://${host}:55431`;
    // Keep the owner contact out of versioned files and launch diagnostics.
    const supportPath = path.join(root, '.harness/local-support.json');
    let supportEmail = process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? '';
    if (!supportEmail && existsSync(supportPath)) {
      try {
        const support = JSON.parse(readFileSync(supportPath, 'utf8'));
        if (typeof support.email !== 'string') throw new Error('Invalid contact');
        supportEmail = support.email;
      } catch { throw new Error('Invalid private local support configuration.'); }
    }
    const health = await fetch(`${apiUrl}/auth/v1/health`, {
      headers: { apikey: publicKey }, signal: AbortSignal.timeout(5000), redirect: 'error',
    });
    if (!health.ok) throw new Error(`Local Auth is unavailable at ${apiUrl} (HTTP ${health.status}).`);
    console.log(`Starting ${device ? 'device' : 'web'} preview against bballuy-local only; .env is disabled for this process.`);
    if (device) console.log(`Local API: ${apiUrl}. On iPhone, sign in to the same Expo account as the CLI, then scan the QR code. Keep both devices on the same trusted Wi-Fi.`);
    const preview = spawnSync(process.execPath,
      [path.join(root, 'node_modules/expo/bin/cli'), 'start', ...(device ? ['--go', '--lan', '--clear'] : ['--web', '--localhost']), '--port', '8090'], {
        cwd: root, stdio: 'inherit', env: {
          ...process.env, CI: 'false', BROWSER: 'none', EXPO_NO_DOTENV: '1', EXPO_OFFLINE: device ? '0' : '1',
          REACT_NATIVE_PACKAGER_HOSTNAME: host,
          EXPO_PUBLIC_SUPABASE_URL: apiUrl,
          EXPO_PUBLIC_SUPABASE_ANON_KEY: publicKey, EXPO_PUBLIC_PROVIDER: 'supabase',
          EXPO_PUBLIC_SUPPORT_EMAIL: supportEmail,
        },
      });
    if (preview.error) throw preview.error;
    process.exitCode = preview.status ?? 1;
    break;
  }
  default:
    throw new Error('Use start, stop, reset, migrate, types, verify, permissions, pickup, sessions, web or device. No remote operations supported.');
}
