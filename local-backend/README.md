# Reproducible local backend

This is the disposable Supabase workspace for T02 and later database tests. It is
not linked to the hosted project. Do not link it or push its baseline remotely.
The root supabase/migrations and seed are historical and are not executed here.

## Requirements and scope

- Node 24 and the project's installed dependencies.
- Run `npm ci --prefix local-backend/tools` to install the isolated Supabase CLI 2.99.0.
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
npm run db:local:permissions
npm run db:local:sessions
npm run db:local:types
npm run db:local:stop
```

To prove a clean replay, run the following only against this disposable workspace:

```sh
npm run db:local:start
npm run db:local:reset
npm run db:local:verify
npm run db:local:permissions
npm run db:local:sessions
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
publicly: historical areas outside the T03 core boundary retain source permissions. The completion
run leaves these containers stopped. Existing unrelated containers are untouched.

## Source and migration boundaries

The [reviewed snapshot](../supabase/snapshots/2026-09-19-dependencies.json) supplies
the public schema, application functions and three court records. Rebuild the
local baseline/seed with `node scripts/build-local-baseline.mjs` only when reviewing
that fixed snapshot; it writes files but contacts no database. Subsequent changes
belong in separate migrations, not in the reconstructed historical state.

- 20260919000100 recreates inspected public objects and the signup trigger.
- 20260919000200 adds persistent court_memberships and a security-invoker
  court_catalog view projecting geography to latitude/longitude.
- 20260921000100 restricts profile columns and catalog writes, and opens owner-only
  membership read/insert/delete. Both table and column ACLs are reconciled.
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
The verify command checks the data contract. The permissions command separately
creates two real local Auth sessions with a public key and exercises PostgREST
allow/deny cases, forged metadata/ownership/timestamps, profile upserts, private
membership reads, concurrent duplicate joins and leave/rejoin. Its HTTP origin is
fixed to 127.0.0.1:55431. Local SQL is used for preservation checks and removal of
only the generated fixtures, including on failure; it is not the caller identity
under test. Credentials stay in memory and are not logged. These checks do not
accept mobile onboarding/session persistence, Storage or native maps.

Court provenance is the owner-provided existing catalog. The two Parque Rodo
records are about eight meters apart and have different names/attributes; both
remain intact. Physical accuracy, possible duplication, and normalized lighting
labels remain map/catalog review work. Do not silently merge them.

## Browser-only T04 preview

Start Docker, then run `npm.cmd run db:local:start` and
`npm.cmd run db:local:web`. Open http://localhost:8090 in your browser.
The wrapper reads the local public key privately, disables dotenv for that
process and forces the local API URL; it does not edit the root .env or use a
remote backend. Stop any previous Expo process on port 8090 first. Ctrl+C stops
the preview; `npm.cmd run db:local:stop` stops only this local backend.

Use synthetic accounts in this disposable environment. Local email confirmation
is disabled by default. `db:local:sessions` uses actual local Auth for signup,
refresh, revoked refresh tokens and unconfirmed-account verification. Its async
storage adapter is an in-memory map reused by fresh SDK clients; it does not
simulate killing a native process or prove native disk storage.

For manual checks, create an account at /signup, reload the browser, inspect the
saved profile, sign out, reload and try an incorrect password followed by the
correct one. To exercise unfinished onboarding, blank only a disposable fixture's
display_name locally, reload, then complete /profile-setup without an avatar.
The map still contains legacy demo entries pending T06. The email confirmation browser journey has local evidence; native restart
still requires device evidence. To repeat the email UI scenario, temporarily set
[auth.email].enable_confirmations to true and auth.site_url to
http://localhost:8090/signin in this local workspace, then stop/start the local
backend. Register another synthetic account and follow its confirmation link
from http://127.0.0.1:55434 (Mailpit), then return to sign in manually. Restore
config.toml and stop the backend afterwards. Never change hosted Auth settings
for this test; default automated session tests expect local auto-confirmation.

## iPhone with Expo Go 57 (T09 / T04)

The app now targets SDK 57. Install dependencies with `npm ci` at the root and
`npm ci --prefix local-backend/tools` for the separate CLI runtime. Docker Desktop
must be running. Keep the PC and iPhone on the same trusted Wi-Fi.

1. Run `npx expo login` in the project terminal and sign in yourself. Sign in to
   the same Expo account in Expo Go on the iPhone. Never share credentials in chat.
2. Run `npm.cmd run db:local:start`.
3. Run `npm.cmd run db:local:device`. The launcher selects the PC's private Wi-Fi
   IPv4, injects a local Supabase URL/public key, clears Metro's cache and starts
   Expo Go over LAN on port 8090. It does not load or change .env. If adapters are
   ambiguous, pass `-- --address=YOUR_PC_WIFI_IP`; only assigned private IPs pass.
4. Scan the terminal QR code with the iPhone camera. Allow Expo Go local-network
   access if iOS asks. Keep the terminal and Docker running during the test.
5. Use a synthetic local account. Verify signup/login, profile without avatar,
   complete force-close of Expo Go then reopening the project, background/return,
   logout and reopening without a session. Record model, iOS/Expo Go versions,
   observed results and any error. These steps do not prove refresh/revocation
   merely by waiting a few seconds; those scenarios also have local SDK tests.
6. Ctrl+C stops Expo. Run `npm.cmd run db:local:stop` when finished.

If connectivity fails, check that Safari can reach the printed local API host
and that Wi-Fi client isolation/VPN/firewall rules do not block ports 8090 and
55431. Do not disable the firewall or publish ports to the internet. The launcher
checks reachability from the PC; the iPhone's actual connection is still a device
check. The browser-only command uses loopback and cannot serve this native test.

Expo Go 57 requires matching CLI/device login; see the
[official change](https://expo.dev/changelog/expo-go-57-login).
The root app and tooling have separate lockfiles so the CLI's React runtime does
not enter the Expo dependency tree. Do not remove the tooling lockfile or install
its dependencies at the app root.
