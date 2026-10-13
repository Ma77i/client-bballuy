# SPEC-002 verification

## T02 organizer UI and local iPhone preview

Execution recorded in this continuation; browser artifacts are stamped
2026-10-13 UTC. Environment: Windows/PowerShell, Expo SDK 57, running unlinked
local Supabase, browser viewport 390x844. Owner confirmed the iPhone and computer
share Wi-Fi. Existing worktree changes were preserved. Initial harness reported
T01 done and T02 available; requirements/acceptance were refined before UI work.

T02 / R03 / A03 evidence:

- Added Play (owned invitations), /organize/create and /organize/[id], plus a
  court-detail creation shortcut. Uses real courts, 1v1/2v2/5v5, now/future timing,
  playing/non-playing organizer choice, combined places and optional notes.
- Local date validation rejects nonexistent calendar dates, invalid clock times,
  past future schedules and impossible places. Core controls follow core_locked;
  opening/saving descriptions works even after the planned time.
- Persistent request manager partitions UUID/payload by backend/account/screen.
  Lost transport or readback retains the same operation and input across reload;
  identity mismatch cannot discard an older uncertain request. RPC expected-actor
  binding rejects account switches during transport. See ADR 0012.
- Browser with two generated local accounts verified create, retained fields,
  locked core edits, permitted empty core edits, description save, explicit
  start confirmation/back-out, start, closed invitation and cancellation persistence.
  Non-owner direct route has no controls; signed-out direct create returns to
  sign-in; switching A to B shows B's empty organizer list rather than A's data.
- Fault injection: intercept pickup_command, forward the first request to the
  server with route.fetch(), then abort its response. Reload /organize/create and
  retry the restored operation. Observed two requests with the same UUID and one
  stored invitation, with expected actor included. No optimistic creation was
  reported while uncertain. Definite organizer rejection retained editable input.
- Read faults: abort pickup_sessions or court_catalog REST reads in the browser,
  then remove interception and use Retry/Retry courts. Both recover visibly.
- Future form rejects 2099-02-29; corrected 2099-02-28 creates successfully.
  A synthetic future fixture's scheduled time was moved into the past through
  owner/fixture-ID-bounded local SQL; description-only UI save still succeeded.
- Screenshots inspected for legibility and narrow-screen overflow:
  [Play](evidence/t02-play.png), [creation](evidence/t02-create.png),
  [management](evidence/t02-manage.png). No horizontal overflow at 390px.
  Final ordinary browser flow has zero console errors; legacy shadow/style
  warnings remain. Expected failed-resource messages occur only during injected
  network/403 scenarios. Empty-string native text rendering was found and fixed.
- `npm.cmd run test:client`: 61 passed, including 13 organizer regressions for
  dates, combined occupancy, replay, storage failures, readback and identity races.
- `npm.cmd run db:local:pickup`: 166 passed after local function refinements for
  expected actor and editing descriptions after planned time. Final migration
  replays inside rollback; generated types were regenerated from the local schema.
- `npm.cmd run db:local:verify`: passed, all three original courts/core contracts
  retained. Browser cleanup removed exactly two generated accounts and their
  four synthetic invitations; no owner/user account or invitation was removed.
- `npm.cmd run db:local:device`: Expo remains running on port 8090. LAN iOS
  manifest returns HTTP 200 / SDK 57.0.0 and the final iOS bundle returns HTTP 200
  (14,014,250 bytes). Open /_expo/loading?platform=ios on the computer's Wi-Fi IP
  and choose Expo Go. This does not require editing .env or hosted configuration.

Final checks: `npm.cmd run verify` passed docs (39 Markdown files, two registered
specifications), client TypeScript and lint. `npm.cmd run harness:status` reports
T02 done and T03 available. `git diff --check` passed with only the existing
newline normalization warnings. No Edge
Functions or harness source changed in T02; their previous results do not certify
new native behavior. T02 is accepted for local/browser organizer scope, not all
SPEC-002 requirements. T03 public discovery, T04 joining/personal sessions and
T06 played-match/result UI remain pending. No hosted deployment, beta, commit or
push occurred. Actual iPhone touch, keyboard and functional acceptance remain
unverified pending owner testing; a served native bundle alone is not that evidence.
Local backend and requested Expo preview are left running for the owner.

## T01 local contract implementation - 2026-10-12

Environment: Windows / PowerShell, Node 24.16.0, isolated Supabase CLI 2.99.0,
Docker Desktop Linux engine, PostgreSQL 17.6 / PostGIS 3.3.7. Existing application,
documentation and recovery-record changes were preserved. Initial harness reported
T00 done and T01 available; initial verify passed before implementation.

T01 / R01,R03,R04,R06,R08 evidence:

- Added incremental local 20261012000100_pickup_contract.sql and ADR 0011, with
  separate invitations/occupancy, played matches/sides and immutable score history.
  Authenticated reads expose safe display names; direct writes, anonymous commands,
  forged actors/timestamps and internal receipts/helper access are rejected.
- pickup_command derives auth identity, validates exact fields, locks rows for
  capacity/start operations, keeps per-actor request receipts and uses expected
  result revisions. Saving closes a match atomically; corrections keep prior/new
  scores and the first closure time. Completion of an invitation invents no result.
- `npm.cmd run db:local:migrate`: passed against the unlinked local workspace,
  applying the incremental migration without reset or historical SQL replay.
- During development only the new local function/column were synchronized with
  the authored migration. Business conflict codes were corrected to HTTP 409.
  The suite reconstructs the entire new contract inside a rollback transaction,
  establishing final-source replay without resetting existing data.
- `npm.cmd run db:local:pickup`: passed 164 assertions with anonymous access and
  two real synthetic local Auth sessions. Cases cover fixed capacities, present
  guests, organizer occupancy, duplicate/replayed create/join/leave, last-slot
  and start/join races, no edits after registration even after leaving, cancellation,
  both-side formats, guest/account rosters, atomic final result, rejected scores,
  stale/concurrent corrections, preserved history and safe older receipt replay.
  All generated accounts, owned fixtures and receipts were removed after each run.
- `npm.cmd run db:local:verify`: passed exact preservation of all three court rows,
  21 original core columns, public catalog API, signup and membership invariants.
- `npm.cmd run db:local:permissions`: passed 111 prior permission assertions.
- `npm.cmd run db:local:sessions`: passed 42 prior local Auth/session assertions.
- `npm.cmd run db:local:types`: regenerated lib/backend/database.types.ts from the
  final running local schema. No handwritten database type shortcuts were added.
- `npm.cmd run test:client`: 48 passed. `npm.cmd run test:harness`: 11 passed,
  required because the local backend harness gained migrate/pickup commands.
- `npm.cmd run verify`: documentation, client TypeScript and lint passed during
  implementation and final code revision; all checks passed.

Observed setup/test failures and resolutions: Docker access was sandbox-denied;
approved local access succeeded. The isolated CLI lacked its platform binary;
sandbox npm ci failed, escalated locked npm ci restored it without lockfile changes.
An empty PATCH test was a no-op and was replaced with actual field mutations.
Non-updatable view writes return PostgreSQL 55000; tests accept that specific
rejection, not arbitrary server errors. Initial linked-match test used the wrong
format for its source; corrected the fixture to match the source's 2v2 format.

Limits: this accepts T01's local database contract/permissions, not the UI or
the whole R03/R04/R08 experience. T02-T06 remain pending. No Edge Functions changed,
so verify:edge was not required. No hosted inspection/change, migration deployment,
device acceptance, beta, commit or push occurred. Native persistence is not inferred
from the session suite's in-memory storage adapter. The backend was already running
at entry and is retained; unrelated Docker containers are unchanged.

## T01 final closure checks - 2026-10-12

T01 final closure checks on 2026-10-12: `npm.cmd run harness:status` reports
SPEC-002 in_progress, T01 done and T02 available. Final `npm.cmd run verify`
passed documentation (38 Markdown files, two specifications), client TypeScript
and lint. `git diff --check` passed, with only newline normalization warnings.
No task beyond T01 was started.

## T00 planning closure - 2026-10-12

The owner explicitly accepted saving the final score to close the match and
later organizer corrections with retained history. Together with the recorded
audience, locations, formats, visibility, guest/account distinction, capacity,
organizer participation, present occupancy and start rules, this settles the
first-delivery product requirements. Added R08/A08 closure/correction guarantees
and a reproducible local/browser/iPhone acceptance plan; reporting is user-initiated
email using the supplied contact outside repository evidence.

T00 / R01 / R07 / A01: planning evidence consists of the owner confirmations in
the dated sections and the current spec/plan/tasks. Recruitment/date are future
pilot preparation, not functional acceptance or invented retention evidence.
T00 is done and SPEC-002 ready for T01; A02-A08 remain unexecuted. Existing changes
were preserved; no application, server, remote, build or deployment operation ran.
Planning closure checks: `npm.cmd run harness:status` passed, reporting SPEC-002
ready, T00 done and T01 available. `npm.cmd run verify` passed documentation,
client TypeScript and lint; `git diff --check` passed with the known newline
normalization warning. No Edge/harness code changed. These reproduce planning
coherence and do not constitute A02-A08 functional acceptance.

## T00 capacity and start rules confirmed - 2026-10-12

The owner accepted fixed 2/4/10 player capacities with no substitutes, present
players (including guests) consuming places in immediate invitations, and an
explicit organizer start that closes join/leave. Planned time is not automatic
start. Updated R03/R04/A03/A04 and server/client test planning for combined
occupancy, organizer double-count prevention and start/registration races.

No behavior or database change was made. T00 remains in_progress pending final
result correction/closing policy and acceptance plan. Preserve all three selectable
court records; pilot places do not authorize merging Parque Rodo records.
`npm.cmd run verify` passed documentation, client TypeScript and lint (exit 0).
`git diff --check` passed with only the known newline normalization warning.
No Edge/harness code or functional/device/database acceptance changed.

## T00 guest participation confirmed - 2026-10-12

The owner explicitly selected allowing guests without accounts when recording
matches among already-present players. App-based invitation registration still
requires an authenticated account. Updated R04/R08/A08, plan and idea record to
distinguish guest participation from account-linked registration. No automatic
account creation or assignment of guest results to user accounts is authorized.
T00 remains in_progress pending remaining lifecycle/capacity rules; no implementation
or functional acceptance is claimed. Existing working changes were preserved.
Checks: `npm.cmd run verify` passed documentation, client TypeScript and lint;
`git diff --check` passed with only the known newline normalization warning.
No Edge/harness source, server operations, device checks or application behavior changed.

## T00 final-score delivery confirmed - 2026-10-12

The owner accepted final-score entry first and live scorekeeping later. Record
organizer-declared results without ranking credit; live scoring is excluded from
this delivery's R08/A08 and server scope. Participant identity remains unresolved:
the answer "yes" followed a question offering both all-account and guest options,
so it cannot establish either product rule. Requested an explicit choice.
T00 remains in_progress; no implementation or functional acceptance is claimed.
`npm.cmd run verify` passed documentation, client TypeScript and lint (exit 0).
`git diff --check` passed with the known newline normalization warning. This
change updates requirements/tasks only; no Edge or harness source changed.

## T00 clarification and expanded draft - 2026-10-12

Owner clarified formats as 1v1/2v2/5v5; all authenticated users can see participant
display names. Owner supplied an email reporting channel (actual address omitted
from repository evidence) and approved explicit organizer participation choice.
Both immediate invitations and registering already-assembled matches are desired,
with side-level final scores and optional non-playing live scorekeeping; individual
point attribution is unnecessary. Updated R08/A08 and a pending recording task.
The invitation-only minimum was a recommendation, not a confirmed exclusion.

T00 remains in_progress and the specification draft: participant identities,
start/result authority and live scoring delivery scope need agreement. No behavior,
remote operation, email sending or report-channel setup occurred.
`npm.cmd run verify` exited 0: documentation (37 Markdown files, two registered
specifications), client TypeScript and lint passed. `git diff --check` exited 0
with the known docs/status.md newline normalization warning. These are draft
documentation checks, not match/scoring functional acceptance. No Edge or harness
source changed; no device, database or behavioral test was run for this update.

## T00 partial product decisions - 2026-10-12

Environment: same Windows/PowerShell repository; existing working changes retained.
The owner confirmed Parque Rodo/Palermo, any authenticated organizer, discovery
and participation without court membership, organizer/capacity visibility,
leave-until-start, cancellation/recreation after joined participants for changes
to court/time/format, and owner-handled problem reports.

Recorded 1v1/2v2/literal 3v5 without assuming a typo, plus desired instant/future
games and scorekeeper evaluation. These need clarification; roster, reporting
channel, capacity and start rules remain open. T00 is in_progress, not done;
SPEC-002 remains draft and T01 is not started. No behavior, schema or API changed.
Scorekeeping impact/recommendation is recorded in docs/product-vision.md; it is
not an accepted feature requirement or verified functional capability.

Checks for this update: `npm.cmd run verify` exited 0 (documentation, client
TypeScript and lint passed); `git diff --check` exited 0 with only the known
docs/status.md newline normalization warning. No functional/device/database tests
were run for this discussion-only change. Edge and harness source are unchanged.

## Documentation organization - 2026-10-12

Environment: Windows / PowerShell in the shared repository workspace.
The owner confirmed players seeking to join as the next MVP audience and asked
that this pickup MVP use SPEC-002. iOS beta remains future work without a
registered specification or reserved ID. See
[ADR 0010](../../docs/decisions/0010-player-first-next-mvp.md).

Read README.md, docs/status.md and docs/workflow.md; inspect Git and run
harness:status before changing documents. Preserve unrelated working changes.
Remove the beta specification, tasks, verification and registry entry as requested.
Move the pickup specification to specs/002-player-pickup and update its ID,
requirements/task references, documentation links and current next action.

Requirements, acceptance, plan and the six pending feature tasks are preserved.
No feature task is done and A01-A07 are not functionally accepted. No application,
database, remote data, build, commit, push or deployment operation was performed.
Independent SPEC-001 acceptance and Git recovery evidence remain intact; obsolete
references to the beta specification ID were removed to avoid ambiguity.

Executed on 2026-10-12:

- `npm.cmd run harness:status`: passed; only SPEC-001 verified and SPEC-002 draft
  are registered. Pickup T00 is available; all six feature tasks remain todo.
- Initial `npm.cmd run verify`: documentation failed because the pre-existing
  specs/master-recovery folder was unregistered; client TypeScript/lint passed.
  Compared its three files with docs/master-recovery and verified that all source
  content was preserved there, with additional recovery evidence. Removed only
  the redundant source copies, retaining the complete documentation record.
- Final `npm.cmd run verify`: exit 0; documentation (37 Markdown files, two
  specifications), client TypeScript and lint passed.
- Repository `rg` search for obsolete numbering, old pickup/beta paths and beta
  prerequisite references: no matches (exit 1, the expected no-match result).
- `git diff --check`: exit 0; no whitespace errors. Git reports LF-to-CRLF
  normalization for docs/status.md.

No functional, device or database acceptance was executed for the draft feature.
Edge/harness source was unchanged; verify:edge and test:harness were not required.
Git history was not rewritten; this change removes beta material from the current
repository files, not from previously recorded commits.

## T02 timing refinement - 2026-10-13 UTC

Environment: existing Expo SDK 57 Metro on port 8090; browser viewport 390x844.
Owner requested an entry ending at timing, scheduled fields only after Plan ahead,
and a separate immediate quick setup. Requirements/acceptance and ADR 0013 were
updated before implementation.

Changes: shared creation component with create/quick routes, retained selected
court/format, no default timing selection, explicit future fields and saved-now
resume entry. Organizer request state reloads on screen focus. Loading an empty
pending storage key clears a request confirmed by the other creation screen.

Reproduction: open Organize a game; before selecting timing assert that Are you
playing, Date and Create invitation are absent. Press Now without a selected
court: expect Choose an available court. Select a known court and 5v5, then
Plan ahead: Date and participation appear. Press Now: quick route preserves the
court ID and format=5v5; present-player field appears, Date is absent and a playing
organizer leaves 9 places. Seed an account/backend-bound saved immediate request,
reopen create, select Resume quick setup: saved 2v2, non-playing organizer and
two present guests restore 2 open places and Retry saved invitation.

Observed browser results: all cases above passed using intercepted synthetic
auth/profile/catalog responses, with no real database writes. Screenshots:
[timing entry](evidence/t02-timing-entry.png),
[quick setup](evidence/t02-quick-setup.png). Synthetic request/auth storage was
removed by exact key/fixture identity and request interceptions were removed.
No blanket local-storage deletion was executed.

Commands: npm run verify passed docs/typecheck/lint; npm run test:client passed
62 tests, including a new cross-screen pending recovery/confirmation regression.
iOS manifest returned 200, SDK 57.0.0; updated native bundle returned 200 and
14,017,940 bytes. No Edge or harness implementation changed.

Limits: local auth health endpoints on loopback and LAN stopped responding.
Preserving db:local:start and docker ps also stalled without output and were
interrupted; backend availability remains unresolved. Consequently browser UI
checks used isolated fixtures; no new end-to-end backend or physical iPhone
acceptance is claimed. Earlier T01/T02 backend evidence remains historical.
The attempted synthetic signup did not receive a response; no resulting account
is claimed or broadly deleted. User account/invitations were not modified.

T02 UI refinement is complete for the tested local scope. T03 remains next: public
discovery and organizer-reported started activity on courts, with foreground
refresh, start time and closure/error handling. This activity indicator is not
yet implemented. Push preferences/delivery are deferred beyond the MVP.

## T03 discovery and reported court activity - 2026-10-13

Scope: R02/R07, with T02 completed. Requirements/acceptance and ADR 0013 were
extended before changing behavior. Added authenticated public discovery in Play,
court/format filters, public invitation details and safe player-place rosters.
Open immediate invitations, future invitations and reported started activity
appear separately; full invitations remain visible with zero places. Past planned
future invitations are excluded from upcoming discovery but remain readable by
ID. Cancelled/completed direct details show their actual state. Only owners see
the management link; T04 join/leave is not advertised or implemented here.

Reads use explicit columns in pickup_session_catalog and pickup_roster, verify
reader identity before/after transport, validate occupancy/state/name projections
and remain account-scoped. Discovery pages in batches of 500 instead of silently
truncating at the API limit. A concurrent roster/count mismatch is labelled for
refresh instead of inventing attendance. Relative TypeScript imports are allowed
by the compiler for the Node 24 regression runner; strict checking is retained.
The hook uses Expo Router's supported focus API, not react-navigation imports,
which are incompatible with SDK 57.

Court-list/detail activity shows organizer-reported started games and server start
time. It polls every 30 seconds on focused foreground screens and refreshes on
return. No automatic expiry, physical-presence claim, push permission request or
notification service was added. Cached reports retain last successful check time
and visible read-error/retry states. Closure removes the reported active state.

Environment: Windows, existing local Supabase/PostgreSQL 17.6/PostGIS 3.3.7,
Expo SDK 57 Metro port 8090, browser 390x844 and trusted LAN device preview.
Docker Desktop reported a stopped engine while its UI was running. A bounded
docker desktop restart --timeout 45 recovered the engine and existing containers;
loopback and LAN auth health returned 200. No database reset or remote migration
was used. The requested Expo preview/backend remain running.

Commands/results:
- npm run test:client: 68 passing tests, including six discovery regressions for
  safe projections, date/state groups, full capacity, roster identity, pagination,
  closed details, concurrent reads, account switches and error propagation.
- npm run verify: documentation, client TypeScript and lint passed.
- npm run db:local:pickup: 174 anonymous/two-real-account assertions passed, including
  other-account reported start/server time, court visibility without membership,
  closure exclusion and completed direct-detail visibility. Generated fixtures
  removed. Existing rollback replay remains limited to the new local contract.
- npm run db:local:verify: all three original court records and 21 core columns,
  public catalog, signup trigger and membership invariants passed.
- SDK 57 iOS manifest: HTTP 200; updated iOS bundle: HTTP 200, 14,066,448 bytes.
  LAN backend auth health: HTTP 200.

Browser reproduction against real local Auth/database:
1. Create synthetic organizer A and signed-in player B. Neither follows the
   chosen courts nor belongs to a team. A creates immediate 2v2 with two occupied
   places, future 5v5 with zero occupied places and a full immediate 1v1.
2. Sign in as B, open Play: immediate/future groups show the real invitations,
   organizer name and correct remaining places. Format 5v5 filters the future
   invitation. Open immediate detail: two player places include A and a present
   guest, with registered/guest labels; no owner management link.
3. Start the 2v2 as A through the same server RPC while B keeps its detail open.
   The next automatic check shows reported play and start time. Open its court:
   activity appears despite B not following it.
4. Inject a 503 only on the catalog read: the next poll retains the cached activity
   with an outdated-data warning. Remove the injection, press Retry activity:
   real data recovers and the warning clears.
5. Close the 2v2 as A: B's court automatically removes its activity and shows no
   currently reported game, without claiming an empty physical court. Its direct
   detail remains readable as closed, with no implied match result.
6. Simulate browser background through visibilitychange for 31 seconds: zero
   catalog requests. Return to foreground: one immediate catalog request.
7. Cancel A's future invitation: B's direct detail updates to cancelled. It is
   excluded from discovery; filtering 5v5 produces the explicit empty state.
8. Switch B -> A -> B: A has the Manage your game link; B has none and still sees
   the full invitation with zero places. A was checked again separately before
   signing out the synthetic UI session.

Screenshots contain synthetic display names only:
[filtered discovery](evidence/t03-discovery.png),
[public started details](evidence/t03-public-details.png),
[court activity](evidence/t03-court-activity.png). They show the mobile-sized web
layout, not a physical iPhone screenshot.

Cleanup: exact generated account IDs and synthetic identity patterns guarded the
removal of two Auth accounts, their public profiles and three invitations. An
initial transaction rolled back because deleting Auth alone does not cascade to
the separate public profile contract; corrected scoped cleanup committed after
asserting unchanged counts for all other accounts/invitations. Original courts
and user-created invitations remain intact. Temporary verification session data
and request interceptions were removed; no blanket storage deletion occurred.
Expected injected HTTP failures and a stale synthetic JWT were isolated from
application runtime checks; refreshed synthetic authentication completed the
real lifecycle checks. Latest clean navigation has no console errors.

T03 is done for local client/server/browser scope. Physical iPhone touch/layout
and full native lifecycle acceptance remain T05; served bundles alone do not
prove them. No hosted change, beta, commit, push or publication occurred.
Next: T04 confirmed join/leave and personal sessions with cancellation visibility.

## T04 confirmed participation and personal sessions - 2026-10-13

Scope: R04/R05, after completed T03. Requirements/acceptance, plan and ADR 0014
were updated before implementation. Public details now offer confirmed join,
explicit leave confirmation and a current player-place indicator. Full, started,
cancelled, completed, failed-read and inconsistent-roster states cannot submit
fresh registration changes. Planned time alone does not close an open session.

A new player request manager persists action/UUID before transport, passes the
expected actor, coalesces double presses and prevents opposite actions while
uncertain. Focus reload cannot erase an in-flight request. Transport/auth/readback
or storage failures retain the request; definite server rejections clear it.
Receipt replay rereads current membership before success messaging, including
changes made from another device. Confirmed writes refresh account-scoped public,
owner and personal caches; no optimistic player place or success is shown.

My sessions is linked from Play and deduplicates organizer-owned invitations with
current account registrations using existing safe projections. Open, reported
playing, cancelled and closed entries remain distinct. A non-owner who leaves
drops from their personal list; a non-playing organizer retains the organizing
entry. Both own and registered read paths paginate, with joined details batched
in groups of 100. Reader identity is checked before/after loading; unknown rows
or failed reads never become a successful empty list. Cached failures are
labelled and retryable. Polling follows T03's focus/foreground rules.

Environment: Windows, existing Expo SDK 57 Metro port 8090, local PostgreSQL
17.6/PostGIS 3.3.7/Supabase and browser viewport 390x844. Backend was already
available and remains running along with the requested LAN preview.

Commands/results:
- npm run test:client: 79 tests passed. Eleven new participation regressions cover
  join/leave/rejoin, lost responses, original-key replay, old receipts versus
  current membership, double presses, focus during transport, storage failures,
  definite/uncertain errors, expected-actor and scope isolation, lifecycle
  eligibility, personal union/cancellation and 501-entry pagination.
- npm run verify: documentation, client TypeScript and lint passed.
- npm run db:local:pickup: 180 anonymous/two-real-account permission/integrity
  assertions passed, including safe personal projection removal after leave,
  cancellation retention and organizer-owned cancellation reads. Existing tests
  also prove last-slot/start races, guest capacity and duplicate prevention.
- npm run db:local:verify: all three original court records, 21 core columns,
  catalog API, signup trigger and membership invariants passed.
- SDK 57 iOS manifest: HTTP 200; updated native bundle: HTTP 200, 14,100,824 bytes.
  LAN backend health: HTTP 200. No Edge Functions or harness implementation changed.

Browser reproduction against real local Auth/database:
1. Create synthetic organizer A/player B and four invitations: immediate 2v2
   with A plus one present guest, future 5v5, full 1v1 and 1v1 with one vacant
   place. Neither account requires a team or court membership.
2. As B, join the 2v2. Forward the RPC to the real backend but abort its response:
   Retry saved registration appears. Reload the route: the same request UUID
   remains. Retry confirms one recorded place and offers Leave invitation.
3. Open My sessions: the invitation appears once. Start leaving, choose Keep my
   place: membership remains. Confirm leave with an aborted successful RPC reply:
   the saved leave is retained and the server registration is removed.
4. Sign out B and sign in A. A cannot see B's saved retry. A's organizing/playing
   invitation appears once in My sessions. Return to B: My sessions is empty
   rather than containing A's entries; the direct route restores the same saved
   leave UUID. Retry confirms no current player place.
5. Join again, but inject a roster-read 503 after a successful RPC response:
   failed readback retains the request. Remove the injection and retry: one
   current place is confirmed. Join the future invitation as well; My sessions
   contains exactly those two registrations.
6. Cancel the future invitation and explicitly start the 2v2 as A through the
   existing RPC. B's active personal screen updates automatically to Cancelled
   and Playing groups. Cancellation retains its card. Started detail has no
   leave control; the full 1v1 offers only a disabled No places available button.
7. Keep B on the one-vacancy detail and let A take the last place through the
   server. B's subsequent join receives a definite conflict, refreshes to full
   and grants no B place. No optimistic registration or duplicate is displayed.
8. Inject a 503 only on the personal roster read: cached personal entries remain
   with an outdated-data warning. Remove the injection and Retry my sessions:
   real entries recover and the warning disappears.

Visual evidence, inspected at mobile-sized web viewport with synthetic names:
[confirmed player place](evidence/t04-joined-place.png),
[personal playing and cancelled sessions](evidence/t04-my-sessions.png).
Expected injected network errors were isolated from clean runtime navigation;
final sign-in navigation showed zero console errors.

Cleanup: signed out only the synthetic UI account, removed request interceptions
and exact synthetic local/session-storage keys. Guarded exact fixture IDs and
identity patterns removed two synthetic Auth accounts, their profiles and four
invitations; all other account/invitation counts were preserved. User-created
invitations and original courts remain intact. No blanket storage deletion,
reset, SQL deployment or remote operation occurred.

T04 is done for local client/server/browser scope. Actual iPhone touch, layout
and native network-interruption acceptance remain T05; delivered native bundles
do not prove device acceptance. No beta, commit, push or publication occurred.
Next: T06 assembled-match registration with guests, two sides, organizer-declared
final scores and corrections that preserve history.

## Planning convention update - 2026-10-13

The owner requested that future task IDs always follow execution order and that
changes trigger coordinated renumbering of tasks, dependencies and references.
The convention is recorded in docs/workflow.md. This documentation-only update
does not add MVP scope or change the two remaining SPEC-002 tasks.
Validation: npm run verify (documentation, client types and lint). No runtime,
Edge Function or harness implementation change; no deployment is authorized.

## Pending-task renumbering and delivery boundary - 2026-10-13

Pending task IDs now follow execution order: former T06 (matches/results) is
T05; former T05 (final verification) is T06. Historical evidence above retains
its original labels; this mapping resolves those references. Tasks/dependencies
and active spec/plan references were updated together. The owner explicitly
requires that SPEC-002 completion not close the MVP or trigger another phase.
Continuation requires owner instruction and a ready SPEC-003. No post-MVP
planning, beta or release work is authorized.

## T05 matches and declared final scores - 2026-10-13

Scope: R08/R06, formerly numbered T06. Pending IDs were renumbered before
implementation: matches/results is T05; SPEC-002 acceptance is T06. Historical
entries retain their original IDs and the mapping above. Owner delivery boundary
is explicit: this specification does not complete the MVP or authorize another
phase. No post-MVP planning is active.

Implemented standalone match creation, optional creation linked from owned
started/closed invitations, exact 1/2/5 players on each side, guest/account
selection, owned recorded-match list, public authenticated result details and
organizer-only score entry/corrections. Account lookup is a bounded literal
display-name search exposing only IDs/names; private profile/contact fields are
not part of its response. Guest names and distinct account identities validate
before transport, with server side/count/FK checks enforced independently.

Created match records await final results and do not infer physical presence.
Final scores require nonnegative SQL integers and explicit review/confirmation.
The reviewed revision is frozen: if polling discovers another correction before
confirmation, saving is blocked pending review. Server revision locks separately
reject transport races. No silent rebasing or optimistic score/history is used.

Match requests persist account/backend/create-or-match-bound UUID/payload before
transport. Double presses share an operation; uncertain create/score/readback
or storage failures preserve retry identity. Current match, complete sides and
continuous previous/new score history are reread before success. Old receipt
replay reports current values without undoing later corrections. History and
owned-match reads paginate beyond API page limits.

Incremental local migration 20261013000100 adds authenticated safe lookup and
extends score closure: saving a linked final result also closes its started
source invitation in the same transaction. Corrections/replay preserve closure
time and never reopen it. Generated local types were refreshed. No reset,
remote SQL or Edge Function changes occurred.

Environment: Windows, local Supabase/PostgreSQL 17.6/PostGIS 3.3.7, Expo SDK 57
Metro 8090 and browser 390x844. The owned Expo preview was restarted to regenerate
new routes after cold-cache startup; the first browser navigation timed out
during the roughly 57-second rebuild, then loaded normally. A generated index
route type inconsistently rejected /matches after file changes, so the recorded
list uses explicit /matches/mine instead. Strict checks remain enabled. The
backend and requested LAN preview remain running for owner review.

Commands/results:
- npm run db:local:migrate: preserving incremental local migration applied.
- npm run db:local:types: types regenerated from the local contract.
- npm run test:client: 90 passing tests. Eleven new match cases cover formats and
  side counts, duplicate accounts/guest validation, SQL score bounds, lost create
  and score replies, old receipts/current revisions, conflict protection,
  readback/storage failures, double presses/focus, actor/scope isolation, malformed
  rosters/history and 1,001 history revisions beyond API limits.
- npm run db:local:pickup: 197 anonymous/two-real-account assertions passed.
  Both pickup migrations replay inside a rollback transaction. Lookup denies
  anonymous access and returns only names/IDs; wildcard/short searches do not
  dump account names. Linked scoring closes the source atomically, keeps its
  closure time through correction/replay and does not duplicate history.
- npm run db:local:verify: original three courts/21 core columns, catalog API,
  signup trigger and membership invariants preserved.
- npm run verify: documentation, client TypeScript and lint passed. No harness
  implementation or Edge Function changes required additional checks.
- SDK 57 iOS manifest and native bundle returned HTTP 200; LAN backend health
  returned 200. Native bundle was served after the final history paging change.

Browser reproduction against real local Auth/database:
1. Create synthetic organizer A/player B. Open Play -> Recorded matches -> Record
   a match. Select Palermo/1v1: empty guest labels are rejected. Choose A's account
   for side A and a named guest for side B.
2. Forward create_match to the real server but abort its response. Retry saved
   match appears and persists across reload. Retry opens the single recorded
   match with its two sides and awaiting-final-score state.
3. Enter a negative score: validation blocks it. Review 11-9 and confirm; abort
   the successful score reply. Reopen/retry confirms revision 1 without another
   result/history record. Correct to 12-9: revision 2 retains previous 11-9.
4. Explicitly start an owned invitation. Use Record this match: court/format are
   locked to the source. Select A's account and search/select B by display name.
   Create and save 15-10: the source management route reports Closed and no
   Close invitation control, proving linked activity ended.
5. Review a draft 13-9 correction to the standalone result at revision 2, then
   save 14-9 from another authenticated request. The next poll reports revision 3
   and disables the old confirmation with a review warning. Keep current result:
   no 13-9 overwrite occurs; history retains all three revisions.
6. Switch to B: the standalone result and history can be read, but no correction
   controls exist. B's owned-match list is empty rather than exposing A's list.

Screenshots were inspected at mobile-sized web viewport and contain only
synthetic names: [side selection](evidence/t05-create-match.png),
[declared result and history](evidence/t05-score-history.png). Physical iPhone
touch/keyboard/network-interruption acceptance remains T06; served native bundles
and web screenshots do not certify it.

Cleanup signed out only the synthetic UI account, removed request interceptions
and exact test storage keys, and guarded deletion of two synthetic accounts, two
matches and one linked invitation. Other account/invitation/match counts were
preserved. Original user data/courts remain intact; no blanket storage deletion,
commit, push, hosted migration or publication occurred.

T05 is done for local client/server/browser scope. Next is T06, the verification
of this specification's journey and necessary fixes. After SPEC-002, stop until
the owner explicitly requests continuation and SPEC-003 is ready; do not mark
the MVP complete or plan a beta/release.

## T06 final local acceptance - 2026-10-13

See [closure review](closure-review.md) for A01-A08 coverage, final fixes,
reproducible checks and owner-reported iPhone evidence. T06 is done and SPEC-002
is locally verified. The MVP remains open; stop before another phase.
