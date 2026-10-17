# Verification

## T01 owner-requested removal — 2026-10-16

Preflight identified `61b2c883-d029-4725-9142-bc1af122b84f`, named Parque Rodó Court,
as the requested row. It had one community membership and zero games, matches,
teams, pickup sessions or pickup matches. The owner requested deletion after
confirming the additions. The other Parque Rodo ID remains unchanged.

Applied `20261016000200_remove_selected_court.sql` using `npm.cmd run
db:local:migrate` against guarded unlinked bballuy-local only. The migration locks
and checks the target, refuses history references and deletes only that ID; the
existing membership cascade removes its one membership, without deleting users.
No schema/RLS change, reset, hosted operation or unrelated working-tree edit.

`npm.cmd run db:local:verify` passed: six exact expected rows, all retained original
fields and new attributes preserved, removed ID absent from public table/view,
core contract passing. Both import/removal migrations were replayed twice without
changing remaining catalog rows. The seed and generator now exclude only the
explicit retired ID, leaving the historical source snapshot unchanged. The core
membership fixture uses Palermo as its second court instead of the deleted ID.
Full seed/reset replay is not executed because existing local data must be kept.
`npm.cmd run db:local:permissions`: PASS, 111 assertions, fixtures removed.
`npm.cmd run verify`: PASS, documentation, TypeScript and lint. A Node check of
`catalog/retired.json` against `supabase/seed.sql` also confirms no retired ID is
seeded. T01 is complete for local scope; refresh the app to observe the six-row
catalog. Physical-device observation is not claimed.

2026-10-16: owner supplied four names, coordinate pairs, court types and concrete
surface. Read-only inspection of supabase_db_bballuy-local found the three original
rows (Palermo and both Parque Rodo records); no matching new names or coordinates.
Windows/PowerShell; existing working changes preserved. Acceptance is pending
import, repeat/preservation checks and public API verification.

## T00 completed locally — 2026-10-16

Environment: Windows/PowerShell, Node 24.16.0, local PostgreSQL 17.6/PostGIS 3.3.7.
Docker required execution outside the filesystem sandbox; only the named
`supabase_db_bballuy-local` database was modified. The unlinked workspace guard
passed. Migration history inspection confirmed the owner-courts migration was
the only pending file before execution.

Implemented batch: [manifest](../../local-backend/catalog/2026-10-16.json) and
[incremental migration](../../local-backend/supabase/migrations/20261016000100_owner_courts.sql).
Stable IDs, owner spelling and exact coordinates are retained. Surface is
`concreto` (the existing catalog spelling of concrete/hormigon); only barrio sur
has half_court=true. All new lighting/notes fields are null. Name/location
collisions abort the atomic batch rather than overwriting existing records.

Reproduction and observed results:
- `npm.cmd run db:local:migrate`: PASS; one pending migration applied, no reset.
- `npm.cmd run db:local:verify`: PASS; all original fields including geography
  bytes/timestamp microseconds preserved, four expected new rows, complete public
  table/view reads and exact coordinate/attribute projections. Two direct repeats
  of the migration leave the entire catalog, including timestamps, unchanged.
  Core columns, signup and membership contract checks pass. Seven total courts.
- `npm.cmd run db:local:permissions`: PASS, 111 assertions with anonymous and
  two synthetic local accounts; generated fixtures removed. The initial run
  revealed another test hardcoded to three rows; it was corrected to compare
  the exact pre-test ID set for each identity/relation, then all assertions passed.
- `npm.cmd run verify`: PASS, documentation/client types/lint.
- `npm.cmd run test:client`: PASS, 119 tests, zero failures/skips.

No existing user membership or original court was removed/changed. No hosted
Supabase, app UI, RLS, schema, dependencies, Edge Functions or harness code changed.
No device visual observation or independent physical-coordinate survey is claimed.
The local API proves availability to clients using this backend; a cached device
may need to refresh/reopen Courts. SPEC-003 native acceptance remains separate.
