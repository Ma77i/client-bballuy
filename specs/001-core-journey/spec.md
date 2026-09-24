# SPEC-001 — Account, courts and community membership

Execution state: [registry](../registry.json). Revised on 2026-09-19 following the user's clarification: joining a court means belonging to its community, without needing a team.

Formal audit 2026-09-24: requirements below are unchanged. The main local journey
has evidence, but [closure review](closure-review.md) identifies R10/A10 gaps and
the limit of physical-location evidence. Do not treat earlier closure notes as
waiving those acceptance criteria.

## Revision history

This revision replaces the proposed team-creation journey. R08/R09, tasks T06/T07 and scenarios A08/A09 now cover court discovery and court membership. None of the replaced functional requirements had been verified. Preserve T00 completion, T01 work in progress and all dated evidence; earlier results do not demonstrate the new requirements.

## Problem

The map is a placeholder and there is no verified flow from account creation to discovering a real court and joining its community. The MVP needs a small useful journey with reliable authentication, real data and enforceable permissions.

## Goal

A person signs up or signs in, discovers real courts, joins a court community and can find their courts again after reopening the app.

## Scope

Email/password authentication, minimal profile, persistent session, map/list discovery, court details, joining/leaving and My Courts. Membership represents an ongoing community relationship, not attendance or a reservation. No team is required.

First available validation target: the owner's iPhone with Expo Go 57.0.9, confirmed on 2026-09-22. Proposed initial catalog: 10–20 verified courts in Montevideo; catalog expansion remains unconfirmed.

## Out of scope

Teams, team-to-court eligibility rules, scheduled attendance, automatic membership expiry, games, chat, ratings, push, OAuth, court submissions and embedded route navigation. A full web map is a separate decision.

## Requirements

### R01 — Verifiable client baseline

T09 upgrades the existing app to Expo SDK 57 for the owner's iPhone running
Expo Go 57.0.9. Align dependencies and lockfile without forcing peer resolution;
preserve T04 auth behavior and Expo structure. Verify dependency health, client
checks and iOS/web bundle generation. Provide a LAN-only local-backend launcher
that never edits .env or connects to hosted data. Native device acceptance stays
in T04 and requires observed results. No EAS build, deployment or remote SQL.

Metro must not watch generated .harness fixtures or its documentation worktree;
running harness tests must not terminate a concurrent local preview.

Documentation and commands are reproducible. Client types and lint pass without errors; warnings are fixed or justified. Deno functions have separate checks. Do not hide known errors.

Use the local Expo CLI through npm start or npx expo start rather than global expo-cli. React Native supplies its own types. Use SDK 57 following the owner-approved upgrade on 2026-09-22 and distinguish the installed compatibility catalog from remotely checked recommendations.

T01 stabilization boundaries: court search consumers use the existing id/name result contract without inventing an address or changing backend queries. Retain the collapsible component using the existing app palette and React Native primitives, with its initially closed/toggle behavior. Use the installed profanity filter's supported export and preserve detection/cleaning behavior with local regression tests. Resolve hook dependency and unused-code warnings without suppressing checks. Notification storage/account isolation and onboarding routing remain assigned to later tasks.

### R02 — Reproducible court data contract

Reconcile profiles, courts and court memberships across migrations, generated types and queries. Inspect the actual development schema before assuming local SQL or JSON is authoritative. Document and verify a disposable database setup. Seed verified court locations with source/provenance; do not present sample locations as real local courts.

Preserve all three owner-supplied court records and their identifiers. Keep raw
lighting/surface values until a separate normalization decision; use a
security-invoker catalog view to expose latitude/longitude without changing
geography storage. Profile/court reads and types must use inspected fields and
nullability. Do not invent bio, address or win statistics when their columns are
absent. Physical court verification remains part of map/catalog acceptance.

### R03 — Protected privileges and ownership

A user can edit allowed profile fields and their own court memberships, but cannot elevate their global role, alter another user's membership or modify the curated court catalog. Enforce permissions at the database/API boundary and demonstrate denied operations through direct requests.

T03 local contract: authenticated callers may update their own display_name,
avatar_url, discoverable, profile_visibility and location_mode. IDs, creation
timestamps, global roles and level/statistics remain server-managed. Profile
creation belongs to the signup trigger; direct API inserts, upserts and deletes
must not bypass these restrictions. Existing profile read visibility is retained.
Court tables and the coordinate view are read-only to public API callers.
Memberships expose only the caller's own rows until a public roster/count policy
is decided; callers may insert their own user/court pair and delete it, but cannot
set joined_at, update rows or operate on another user's membership. Tests must
include real local Auth sessions, forged signup role metadata, retries and reads
after denied mutations. This does not authorize hosted schema deployment.

### R04 — Coherent registration and login

Create an account once with valid credentials. When email confirmation is required, explain the pending step without entering a session-only route. Invalid credentials allow a clear retry. Test the verification return for the chosen platform and auth configuration.

T04 uses email/password only; hide unfinished OAuth and password-recovery entry
points. A successful signup without a session shows a persistent confirmation
instruction and a sign-in action, without another signup attempt. After verifying
the email, the user may return and sign in manually; automatic email deep-link
login is not required by this implementation. Keep existing pre-signup age/consent
screens; completing a profile never returns to them.

Pending consent must be validated before signup and bound to that signup's
backend/account. Synchronize it after authenticated session validation, including
manual login after email confirmation. A failed write retains the pending value
and presents a retryable setup error without requiring a second registration.
Clear it only after successful persistence; never assign another account's pending
consent to the current user. Legacy unbound values are not proof of ownership.
Do not log raw backend errors, credentials or consent payloads.

### R05 — Minimal profile and completed onboarding

Store a valid display name and enter court discovery without looping through registration or consent again. An authenticated user with an incomplete profile reaches the unfinished step. No avatar or team is required.

### R06 — Persistent session

A valid session survives a full app restart and refreshes when appropriate. Revoked sessions or failed refreshes return to login without loops. Logout clears authentication consistently and reports relevant errors.

Supabase owns session persistence through the installed native storage adapter;
do not maintain separate token copies on sign-in. Coordinate refresh with app
foreground/background state. Auth event callbacks must remain synchronous and
profile requests run outside them. Late responses after logout/account change
must not restore a previous profile. Profile/network failures offer retry without
misclassifying the user as new. Full query-cache isolation remains T05.

### R07 — Account isolation

Switching from A to B never shows A's personal profile, My Courts or personal notifications as B's data, including initial cached renders. Queries and local storage are scoped to the authenticated user. This does not prohibit intentionally public community information.

T05 replaces the query cache and mounted personal screen state on identity changes,
including logout and session loss, without clearing the current account on token
refresh. Personal query keys include the owner and queries are disabled while
signed out. Notification storage includes backend and owner, waits for hydration
before writing, ignores late responses after teardown, and never imports the
legacy unowned notifications key. Remove automatic sample notifications. Provide
an owner-filtered My Courts read hook now; membership actions and its final UI
remain T07. Verify A -> logout -> B -> A, delayed A responses, storage races and
server-enforced membership isolation without changing hosted data.

### R08 — Real court discovery

Show the same real catalog in a map and list. Selecting a court opens its details with verified name/location and available attributes. Location permission denial still allows manual browsing and the list. Provide usable loading, empty and error states. Restrict results to the initial catalog/area; do not claim national completeness.

Use a native map provider after the integration check in [ADR 0002](../../docs/decisions/0002-court-first-mvp.md). T06 integrates the Expo SDK 57-compatible react-native-maps candidate using default Apple Maps on iOS; adoption is provisional until the owner checks it in Expo Go. Web provides the same searchable catalog and details without a native map. Read only the existing court_catalog view and preserve the three courts. A single name-filtered dataset feeds list and markers. Location is requested only from an explicit button, used in memory to center the map and never persisted. Denial/unavailable location keeps catalog browsing usable. Show unknown attributes honestly; remove sample ratings, distances and player counts. Joining remains T07.

### R09 — Persistent court community membership

An authenticated user can join a court, see it in My Courts, leave and join again. Membership persists across app restarts until the user leaves. Repeated taps and network retries cannot create duplicate memberships for the same user/court.

Two users can belong to the same court without a team. No scheduling, check-in, automatic expiry, capacity reservation or physical-presence claim is implied. Proposed default: a user may join multiple courts independently. The app must not impose future team eligibility rules in this MVP.

T07 adds explicit Join court / Leave court actions and a My Courts tab. Joining
means community membership, not presence, reservation or a team. Disable duplicate
submissions while a request is pending. Do not optimistically claim success:
confirm the server state and refresh the owner's shared membership query. Retrying
a join preserves an existing membership's timestamp; retrying a leave succeeds
if it is already absent. Failed or uncertain requests show a retry for the same
intended action. The list supports loading, empty, error/retry and refresh states.
Preserve membership across logout/restart. No public roster/count is introduced.

Show the current user's membership state. A community member count or roster is optional until visibility is decided; never label membership counts as people currently playing.

### R10 — Honest and recoverable experience

Network failures during profile updates or membership changes show an error and retry rather than false success. Reconcile optimistic changes after failures. Remove simulated notifications and fixed fake invitations from the MVP experience. Clearly identify or hide unfinished controls.

T08 limits active navigation to Courts, My Courts and Profile. Keep legacy team,
player, notification-settings and team-creation source files, but exclude their
routes from active navigation, including direct links. Remove the missing match
route declaration. Hide unimplemented menu actions, statistics and avatar upload
controls; the minimal profile uses a display name only. Preserve existing avatar
data. Logout exposes an inline retryable error and only navigates after success.
Profile-save failures retain the entered name and show a safe connection/retry
message. Verify blocked requests and lost membership acknowledgements in a local
browser, and record physical iPhone acceptance separately.

## Acceptance

Execute A01–A10 in [verification.md](verification.md) with two test accounts and a real device/development build. Keep evidence linked from [tasks.json](tasks.json). Static checks alone do not verify the journey.

## Remaining decisions

The owner confirmed iPhone Expo Go as the validation platform. Local Supabase
reproduces the supplied three-court source; expansion and physical verification
remain distinct. Hosted email configuration and visibility of other court members
remain open. Multiple court membership is the proposed default, with integrity
supported in storage. Future team eligibility is deliberately undecided.

Shared stabilization and non-dependent preparation can continue while these decisions are open.
