# SPEC-001 implementation plan

Revised 2026-09-19: court communities replace the proposed team-first journey.
Reading update 2026-09-23: T04 has local acceptance, including owner iPhone tests.
T05 has local account-isolation evidence. T06 integrates the SDK 57 native map
and the three-court catalog; local iPhone acceptance is complete. T07 join/leave/My Courts
has local acceptance, including the owner's iPhone report on 2026-09-24.
The 2026-09-24 audit reopened T08. Its C01-C03 findings are resolved on 2026-10-09:
onboarding/consent copy and retry behavior are verified, and the owner confirmed
the three physical locations. See [closure review](closure-review.md). T08 is done;
SPEC-001 is verified for the local MVP. No subsequent specification has started.
Execution
states live in [tasks.json](tasks.json), and dated results in [verification.md](verification.md).

## Strategy

Keep Expo, React Native and Supabase. Deliver authentication, real court discovery and persistent court membership before team features. Do not delete existing team functionality or migrate team data as part of this planning revision.

## Sequence

1. T00: documentation and harness, already evidenced.
2. T01: finish client checks and establish proportionate behavior tests.
3. T02: inspect/reconcile profiles and courts, design membership storage and prepare a disposable backend.
4. T03: enforce profile privileges, curated-catalog permissions and ownership of memberships.
5. T09: upgrade to SDK 57 and prepare LAN-only iPhone testing (owner-approved prerequisite).
6. T04: complete registration, minimal profile and persistent session.
7. T05: isolate personal data and My Courts between accounts.
8. T06: validate native map integration, then connect the real catalog, list and details.
9. T07: complete persistent join/leave/My Courts with uniqueness and retries.
10. T08: remove simulated MVP data and verify the two-account device journey.

## Proposed implementation

- Start with react-native-maps: Google Maps on Android and Apple Maps on iOS. Validate an SDK-compatible version and native rebuild before adopting. See [ADR 0002](../../docs/decisions/0002-court-first-mvp.md).
- Keep the court catalog and memberships in Supabase. The map provider draws the basemap; it does not define membership or supply the MVP catalog.
- T02 implements local court_memberships with court_id, user_id and joined_at,
  a unique user/court pair and foreign keys. T03 adds verified owner-scoped
  read/insert/delete policies and server-managed timestamps. Leaving removes the active
  relationship; do not introduce attendance status or expiration.
- Treat join and leave as idempotent desired-state operations. Derive/check identity from authentication, enforce uniqueness in the database and reconcile UI/cache after failures.
- Support a proposed many-to-many relationship: several courts per user and several users per court. Do not require a team or connect this relationship to future team eligibility.
- Use Supabase session state with native persistence. Key personal queries by user and clear personal caches when authentication changes.
- Use existing geography data through a documented conversion/query boundary; verify latitude/longitude ordering. Do not assume the manual TypeScript coords object matches a PostGIS response.
- For denied location permission, retain manual map/list discovery. Request foreground location only when needed; no background tracking.
- Curate a small catalog with verified provenance. Avoid Places/geocoding dependencies unless a later requirement justifies them.

## Files and boundaries

Existing areas: app/(auth), app/(tabs)/map.tsx, app/(tabs)/_layout.tsx, contexts/AuthContext.tsx, hooks, lib/backend and Supabase migrations. Add a court detail route and membership query/mutation layer as needed. Keep shared stabilization changes small and protect existing user work.

No map installation, cloud billing setup, remote SQL or deployment is performed by this plan.

## Verification and risks

T02 starts with the [read-only database inventory](../../docs/database-reconciliation.md). Hosted Supabase no longer exposes OpenAPI through the public key; use an authorized inventory path. A catalog query is required for constraints, RLS and grants. Do not equate either prepared tooling or an inaccessible API definition with a reconciled backend. Generate database types only after inspecting and reproducing the canonical schema.

T01 uses the existing id/name court-search contract and app palette, fixes the installed profanity export and resolves lint warnings without changing backend queries or onboarding destinations. The focused Node regression suite runs via `npm run test:client`; see [development](../../docs/development.md) for the test strategy and boundaries. No framework, native package or structural migration is needed for this stabilization.

Run client checks and appropriate behavior tests; use Deno checks for changed functions. Integration tests must verify allowed and denied membership operations, uniqueness, invalid court IDs and safe retries. Device checks must cover map rendering/taps, permission denial, login restart and A → B cache isolation.

Before database changes, inspect the target and test a disposable environment. Map rendering does not validate the catalog's accuracy. Native provider setup and web maps have different requirements. Public community visibility needs an explicit policy; membership is never a live presence indicator.
