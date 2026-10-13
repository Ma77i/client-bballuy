# SPEC-002 implementation plan

## Strategy

Next product priority. T00 has resolved the first delivery's rules and acceptance
plan; work in small dependency-satisfied implementation slices.
Reuse Expo routing, authentication, account-scoped queries and the inspected local
Supabase workflow. Inspect current contracts before choosing storage or APIs;
record structural decisions separately. Keep original court data intact.

## Sequence

T00 finalizes scope and pilot rules. T01 establishes the local session/registration
contract, lifecycle, permissions and concurrent capacity operations with tests.
T02 supplies organizer creation and management so the list has real activity.
T03 adds player discovery/details. T04 integrates join/leave and personal sessions.
T06 verifies the complete journey with browser/device and server evidence.
The expanded draft adds T05 after T04 for assembled matches and side-level
results; T06 depends on T05 as well. The owner confirmed final-score entry first
and live scoring later. T01/T05 implement only organizer-declared final scores;
live recording needs future scope and acceptance.
No work beyond this specification is planned or authorized.

## Files and validation

Likely areas: app court/session screens, hooks, lib/backend, generated database
types, local-backend migrations/fixtures/tests and focused client regressions.
Actual files follow contract inspection; no legacy team API is assumed suitable.
Run verify for each slice and relevant client/local integrity/permission tests.
Run verify:edge if Edge Functions change and test:harness if harness source changes.
Record environment, steps, results and remaining limits in verification.md.

## Risks and next task

T00 is complete for planning. The owner confirmed Parque Rodo/Palermo, any authenticated
organizer, participation independent of court membership, organizer/capacity
visibility and cancellation/recreation for core changes after registration.
The owner resolved formats as 1v1/2v2/5v5, roster visibility for authenticated
users, email-based owner support and explicit organizer participation. Both
immediate invitations and already-assembled match recording are desired, with
side-level final scores first and live recording later. Guest/account identity
representation follows these rules during contract work. Start is explicit;
saving a final result closes the match and organizer corrections preserve history.
Do not introduce ranking/statistics rules from stored scores.
Guest participation in recorded matches is confirmed; invitation joining remains
account-based. T01/T05 must distinguish guests from linked users without automatic
account creation or later identity assignment.
The owner confirmed fixed 2/4/10 capacities, present-player occupancy and explicit
organizer start. T01 must enforce capacity across present players/registrations
and serialize start/join/leave races. T02/T04 must prevent organizer double counts
and distinguish planned time from started state. Add focused cases to acceptance.

No organizers means no opportunities to join. Registrations do not prove attendance.
Race conditions, uncertain responses, time boundaries, privacy and cancellations
must be specified and tested. Hosted parity and beta delivery remain separate.
T01 is locally verified; see ADR 0011 and verification.md for its contract and
permission/integrity assertions. T02 adds the organizer UI and account-bound
pending request recovery; local/browser verification is recorded in verification.md.
T03 public discovery/details and reported court activity are now locally
verified. Next: T04 confirmed joining/leaving and personal sessions. Native
acceptance remains part of the final MVP checks.
Reporting uses configured owner email
and a user-initiated action; pilot recruitment/date are operational preparation.

## T03 read path

Use existing authenticated pickup_session_catalog and pickup_roster projections.
Add account-scoped discovery/detail queries, focused foreground polling, public
detail routes, court activity cards and immediate/future opportunity grouping.
No SQL or notifications service is needed. Unit tests cover date/state/occupancy
validation, safe projection and loader behavior. Browser checks cover non-owner
discovery, rosters, activity closure, error/retry, polling and account switching.
Backend verification depends on recovery of the currently unresponsive local
Docker service; record fixtures versus actual server checks separately.

## T04 participation slice

Add player-only participation request recovery, public-detail controls and an
account-scoped My sessions read path using existing safe projections. Preserve
organizer recovery and server row locks. Unit tests cover retained requests,
readback, scopes, storage failures, list union and lifecycle eligibility.
Two-account browser/server checks cover join/leave/rejoin, lost replies, reopen,
capacity/start races, cancellations and account switching. No SQL migration or
publishing is part of this task. See ADR 0014.

T04 is now verified for local client/server/browser scope; evidence and remaining
native limits are recorded in verification.md. Next is T05 assembled matches and
organizer-declared final scores, then T06 complete device/local MVP acceptance.

## Owner delivery boundary - 2026-10-13

Completing SPEC-002 does not finish the MVP or authorize another phase. Stop
after this specification until the owner explicitly instructs continuation
and SPEC-003 is ready. Additional design/functionality improvements may be
defined there before MVP completion. Do not plan post-MVP work, beta or launch.

T05 is locally verified, including the preserving match migration and safe
player lookup. Next is T06 SPEC-002 acceptance, including physical iPhone checks.
The MVP remains under development after this specification; owner instruction
and a ready SPEC-003 are required before continuing beyond it.
