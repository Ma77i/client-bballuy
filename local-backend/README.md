# Reproducible local backend

This is the disposable Supabase workspace for T02 and later database tests. It is
not linked to the hosted project. Do not link it or push its baseline remotely.
The root supabase/migrations and seed are historical and are not executed here.

## Requirements and scope

- Node 24 and the project's installed dependencies, including Supabase CLI 2.99.0.
- Docker Desktop with its Linux engine running. First startup downloads images.
- Tested database runtime: PostgreSQL 17.6 and PostGIS 3.3.7, matching the export.
- Project ID: bballuy-local. API 55431, database 55432, mail viewer 55434.
- Auth, PostgREST, gateway, database and local email capture run. Studio, Storage,
  Realtime, Edge Functions, analytics and pooler are omitted from this task.

No remote credentials are required. Commands do not load or change the app's
root .env. The app therefore keeps using its existing configured backend unless
the developer explicitly changes its environment.

## Commands from the repository root

```sh
npm run db:local:start
npm run db:local:verify
npm run db:local:types
npm run db:local:stop
```

To prove a clean replay, run the following only against this disposable workspace:

```sh
npm run db:local:start
npm run db:local:reset
npm run db:local:verify
npm run db:local:types
npm run verify
npm run db:local:stop
```

reset destroys **local test data** and replays this workspace's migrations/seed.
The wrapper always uses --local and a fixed workdir/project ID, rejects a linked
project marker, and has no remote deployment command. stop retains local data.
On PowerShell, use npm.cmd if npm.ps1 is blocked. CLI diagnostics are local under
.harness; the wrapper redacts tokens and database URLs from failure output.

The custom Docker network requests loopback-only publishing. On this Windows
Docker Desktop installation, inspection still reports 0.0.0.0 / :: bindings;
both CLI 2.117.0 and 2.99.0 showed this behavior. Do not assume localhost isolation
from the URL or network option. start reports the observed limitation. Use only a
trusted development network, stop after testing, and do not expose this baseline
publicly: it deliberately retains source permissions pending T03. The completion
run leaves these containers stopped. Existing unrelated containers are untouched.

## Source and migration boundaries

The [reviewed snapshot](../supabase/snapshots/2026-09-19-dependencies.json) supplies
the public schema, application functions and three court records. Rebuild the
local baseline/seed with `node scripts/build-local-baseline.mjs` only when reviewing
that fixed snapshot; it writes files but contacts no database. Subsequent changes
belong in separate migrations, not in the reconstructed historical state.

- 20260919000100 recreates inspected public objects and the signup trigger.
- 20260919000200 adds persistent court_memberships and a security-invoker
  court_catalog view projecting geography to latitude/longitude. API membership
  writes remain denied until T03 implements and tests ownership permissions.
- seed.sql imports only the three original courts, keeping IDs, timestamps,
  geography and raw attribute values. No hosted users or teams are copied.

Do not apply the local baseline/seed remotely. A future deployment needs a
separate incremental upgrade and fresh preflight of the hosted schema. The
absence of the migration history table in the export does not authorize a reset.

## What the checks establish

db:local:verify compares every court field (including timestamp microseconds and
geography bytes) with the export, checks all 21 original core column types and
nullability, verifies signup-trigger output, and exercises membership uniqueness,
foreign keys, leave/rejoin and independent multiple courts without a team. SQL
fixtures run in a rollback transaction. Public-key API requests verify court
search and the projected catalog, including all three coordinate pairs.

Types are generated from the running database and consumed by the client. The
client now rejects nonexistent columns such as courts.address at compile time.
These are data-contract checks, not two-account authorization, mobile signup,
session persistence, Storage, or native-map acceptance.

Court provenance is the owner-provided existing catalog. The two Parque Rodo
records are about eight meters apart and have different names/attributes; both
remain intact. Physical accuracy, possible duplication, and normalized lighting
labels remain map/catalog review work. Do not silently merge them.
