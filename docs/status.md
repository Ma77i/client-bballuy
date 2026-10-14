# Estado del proyecto

## T04 owner closure; T05 implemented for review — 2026-10-14

Owner explicitly closed T04, with existing evidence and native limits retained in
[closure](../specs/003-arcade-ux-ui/t04-closure.md), and authorized only T05.
Play/organizer/participation/match/history and entry/auth presentation now reuse the
approved arcade foundations and Spanish copy. Business hooks/contracts/dependencies
unchanged. verify and 109 client tests pass; 61 real local browser checks cover
2/4/10, create/join/leave/lifecycle, saved-request readback/UUID replay, score conflict/
correction/history, entry/signup/isolation, reduced motion and narrow/text reflow.
Full iOS entry exports to Hermes. Five owned QA identities/profiles, three sessions
and one match cleaned; original catalog fingerprint unchanged. Physical T05 native
review remains pending; T05 in_progress for owner review, T06 todo/not started.
No commit/push. See [evidence](../specs/003-arcade-ux-ui/t05-verification.md) and
[iPhone walkthrough](../specs/003-arcade-ux-ui/t05-iphone-review.md).
Earlier in_progress T04/unauthorized T05 statements are historical and superseded.

## T04 explicit map target — 2026-10-14

Owner superseded context-only location return. Detail now sends its real court ID;
discovery opens Map, selects one compact preview and centers the native camera on
catalog coordinates. Only this minimal T03 handoff changed; ordinary entry/back and
marker/preview design remain. verify, 106 client tests, 10 browser location checks and
full iOS Hermes export pass. Physical iPhone centering/gesture/accessibility checks
remain pending; T04 in_progress, T05 not started. No commit/push.
See [target evidence](../specs/003-arcade-ux-ui/t04-map-target.md).

## T04 targeted final refinement — 2026-10-14

Approved direction preserved. My Courts copy, secondary add/remove actions, orange
organizer priority, Volver detail back title and compact reported activity implemented.
verify and 105 client tests pass; 40 browser checks rerun successfully. Owned local QA
fixtures removed and original catalog fingerprint unchanged. Owner selected the
existing map; secondary location action implemented with 7 additional browser checks
passing for retained search/view/results and direct-entry fallback. Physical iPhone
camera and accessibility checks remain
explicitly pending. T04 in_progress, T05 not started. No commit/push.
See [refinement evidence](../specs/003-arcade-ux-ui/t04-final-refinement.md).

## T03 approved/closed; T04 locally implemented — 2026-10-14

Owner explicitly closed T03 and authorized T04 only. Court detail, My Courts and
Profile reuse approved arcade foundations, retaining existing server/account state.
Verify and 105 client tests pass; 40 real local browser checks cover community
join/leave/rejoin/readback/error recovery, logout/report, A -> B -> A and pending/
reduced-motion/narrow presentation. Full iOS Hermes export passes; actual T04 device
cases remain pending. See [T03 closure](../specs/003-arcade-ux-ui/t03-closure.md),
[T04 evidence](../specs/003-arcade-ux-ui/t04-verification.md) and
[iPhone review](../specs/003-arcade-ux-ui/t04-iphone-review.md).
Two isolated QA accounts were cleaned up; original three-court data fingerprint
unchanged. No backend/RLS/contracts/dependency/Play redesign, commit or push.
T04 in_progress awaiting native acceptance; SPEC-003 not verified; stop before T05.
Earlier dated pending T03 statements are historical, superseded by owner closure.

## T03 visual refinement prepared for iPhone retest — 2026-10-14

Owner's iPhone visual feedback requested compact Courts header/search/cards/sheet
and one prominent Ver cancha CTA. Refinement uses opt-in T02 primitive/media styles,
preserving the existing selection/focus/motion/business paths. Browser measures and
controls, 105 client tests, verify and full iOS Hermes export pass. See
[refinement evidence](../specs/003-arcade-ux-ui/t03-visual-refinement.md).
No My Courts/Play/Profile/backend/RLS/dependency change, commit or push. T03 remains
in_progress for another actual iPhone visual/accessibility review; T04 not started.

## Metro navigation import corrected — 2026-10-14

T03's map focus hook now imports from `expo-router/react-navigation`, resolving
SDK 57's rejection of the external React Navigation import. Verify and 105 client
tests pass; the full iOS app exports to Hermes bytecode with the compatibility
guard enabled. Default sandbox temporary-directory permissions required a local
temporary directory for the export. See [evidence](../specs/003-arcade-ux-ui/t03-verification.md).
This corrects a gap in the earlier isolated-fixture verification. Physical iPhone
acceptance remains pending and T03 remains in_progress; T04 has not started.

## SPEC-003 T03 implemented locally; iPhone acceptance pending — 2026-10-14

Owner authorized T03 only on SPEC-003/design. List-first discovery, shared search,
native basketball markers and one compact/expandable preview use T02 foundations.
Catalog IDs/coordinates, existing reads/location/detail routes and business rules
remain. Verify and 105 client tests pass; browser shared-component checks cover
filter/view fallback, loading/empty/retry, keyboard, layout and simulated return.
See [T03 evidence](../specs/003-arcade-ux-ui/t03-verification.md),
[prepared iPhone review](../specs/003-arcade-ux-ui/t03-iphone-review.md) and
[ADR 0017](decisions/0017-list-first-court-preview.md).
T03 in_progress pending actual iPhone markers/gestures/VoiceOver/text/camera evidence;
SPEC-003 not verified. T04–T06 todo; stop before T04. No backend/RLS, dependency,
commit or push. Earlier dated authorization/status entries are historical.

## SPEC-003 T02 foundations locally verified - 2026-10-13

Owner authorized T02 only. Shared tokens/adapters, accessible primitives, pooled
reduced-motion utilities, verified static Teko/OFL/Spanish glyphs and original
optimized local media/fallback are implemented. No new dependency, route/screen,
backend/RLS/business contract, commit or push. See
[foundation evidence](../specs/003-arcade-ux-ui/t02-verification.md) and
[ADR 0016](decisions/0016-shared-presentation-foundations.md).
T02 done for local scope; SPEC-003 in_progress, not verified; T03-T06 todo.
Verify and 101 client tests pass. Web gallery/native transform do not certify
physical font rendering, VoiceOver, Dynamic Type, gestures or release performance.
Legacy primary aliases and full screen/copy adoption remain later presentation work.
Stop before T03 until owner reviews T02 and explicitly authorizes continuation.

## SPEC-003 T01 approved; T02 awaits authorization - 2026-10-13

T01 is done for design-only acceptance of R02 art plus R02.1 visual patches and
three sequences. The five owner-requested contract/design consistency checks pass;
see [closure](../specs/003-arcade-ux-ui/t01-closure.md). SPEC-003 is ready, not verified.
T02-T06 remain todo. [Exact T02 scope](../specs/003-arcade-ux-ui/t02-scope.md) is reusable
presentation foundations only, awaiting explicit implementation authorization.
SPEC-002 local acceptance remains verified; native redesign accessibility/focus/text
scaling/motion/performance remain unverified. This step changes documentation only;
no application/backend/RLS, dependency, commit or push action. Earlier dated entries
retain their original baseline and pending-approval statements as history.

## Temporary branding clarified - 2026-10-13

The owner confirmed `bballuy` as the internal project name and temporary public
brand/logo wordmark until a final name is selected. Arcade / street basketball
describes the visual style only. SPEC-003 R02 and upcoming T01 revisions use this
wording; original R01 boards remain historical. This is a naming clarification,
not full design approval. Application copy/assets have not been changed here.
See [SPEC-003 evidence](../specs/003-arcade-ux-ui/verification.md).

## SPEC-002 local acceptance verified - 2026-10-13

T00-T06 are done for the local specification. Owner-reported iPhone checks cover
creation, keyboard/save, guest match scoring/correction, participation, network
recovery, account separation, persisted sessions and court activity. Report
fallback/retry was confirmed; successful native composer opening remains
unobserved. Browser handoff/failure tests passed after preserving the Linking
receiver. Organizer focus during writes no longer loses pending state.

Passed: verify, 94 client tests, 11 harness tests, 111 permission assertions,
42 session assertions, 197 pickup assertions and preserved-court checks.
See [closure evidence](../specs/002-player-pickup/closure-review.md).
Hosted parity and player usefulness/retention remain unverified.

The MVP is not finished. SPEC-003 remains draft; continuation requires explicit
owner instruction and readiness. No beta/release planning, hosted change or
publication occurred. The local preview remains available.

## SPEC-002 T05 match recording verified locally - 2026-10-13

T05 (formerly T06) is done for local client/server/browser scope: standalone and
linked match records, account/guest sides, declared final scores and revision
history. Reviewed revisions cannot silently rebase; only organizers write scores.
Linked scoring closes the active source invitation in the same transaction.
Local incremental migration/types and guarded cleanup preserved existing data.

Passed: verify, 90 client tests, 197 local permission/integrity assertions,
original-court checks and real two-account browser create/score retry, correction,
lookup, linked closure and non-owner scenarios. SDK 57 iOS manifest/native bundle
and LAN backend health returned 200; actual iPhone acceptance remains T06.
See [evidence](../specs/002-player-pickup/verification.md) and
[ADR 0015](decisions/0015-match-recording-and-score-history.md).

Pending numbering now follows execution: T05 matches/results, T06 acceptance.
Older entries retain their prior numbers; the mapping is recorded in evidence.
Next: T06 verify the SPEC-002 slice and fix remaining issues. Completing SPEC-002
does not complete the MVP. Stop before further work unless the owner instructs
continuation and SPEC-003 is ready. No post-MVP/beta/release planning is active.


## SPEC-002 T04 participation verified locally - 2026-10-13

T04 is done for local client/server/browser scope. Public details provide
confirmed join/leave with explicit leave confirmation and account-bound request
recovery. My sessions combines organized and registered invitations once,
retains cancellations and shows actual lifecycle states. Failed reads remain
labelled and retryable; full/started sessions cannot accept new changes.

Passed: verify, 79 client tests, 180 anonymous/two-account server assertions,
preserved-court checks and real browser recovery/account-switch/race scenarios.
SDK 57 iOS manifest and updated bundle returned 200; LAN backend health is 200.
Physical iPhone acceptance remains T05. See the latest
[evidence](../specs/002-player-pickup/verification.md) and
[ADR 0014](decisions/0014-player-registration-recovery.md).

Two synthetic browser accounts and four invitations were removed with guarded
cleanup; other data is preserved. Expo/backend remain available for owner review.
Next: T06 assembled-match registration and final-score entry/correction history.
Push notifications remain deferred; no hosted change, beta, commit or publication.


## SPEC-002 T03 discovery verified locally - 2026-10-13

T03 is done for local client/server/browser scope. Play shows public immediate/
future invitations with court/format filters, safe names, capacity and details.
Court list/details show organizer-reported started activity, start time, focused
foreground polling and last-check/error/retry states. Closed/cancelled direct
details stay readable; join/leave remains T04.

Passed: verify, 68 client regressions, 174 anonymous/two-account local assertions,
preserved-court checks and real two-account browser lifecycle/error scenarios.
Background polling paused and foreground return refreshed. SDK 57 iOS manifest
and updated bundle returned 200; physical iPhone acceptance remains T05.

Docker engine recovery restored local auth health (200 on loopback and LAN).
Expo preview and backend remain available. Two synthetic browser accounts and
three invitations were removed with guards preserving other data. Previous
backend-outage statements below are historical. See the latest
[evidence](../specs/002-player-pickup/verification.md).
Next: T04 join/leave and personal sessions. Push notifications remain deferred;
no hosted change, beta, commit, push or publication occurred.


## SPEC-002 timing refinement - 2026-10-13

T02 creation entry now ends at timing. Plan ahead reveals scheduled setup; Now
opens quick setup preserving court/format and account-bound pending recovery.
Verify passed and 62 client tests passed; browser branching/recovery checks used
isolated API fixtures. Updated SDK 57 iOS manifest and bundle returned HTTP 200.
See the latest [evidence](../specs/002-player-pickup/verification.md) and
[ADR 0013](decisions/0013-pickup-timing-and-court-activity.md).

Current limitation: local backend health stopped responding; preserving startup
and Docker inspection stalled and were interrupted. Backend availability and
physical iPhone acceptance remain unresolved. Earlier running-backend statements
below are historical. Metro remains available on the existing LAN preview.
Next: T03 public discovery plus organizer-reported court activity after explicit
start, with start time, refresh and closure handling. This indicator is planned
for this MVP but not implemented yet; push notifications are deferred.


## SPEC-002 T02 organizer UI verified locally

T02 is done for local/browser scope: Play, create-now/future form, owned invitation
management, locked core edits and confirmed start/cancel/close. Original dark/orange
sports presentation uses the existing Expo structure. Pending UUID/payload survive
reload with backend/account/screen isolation; expected-actor RPC binding prevents
cross-account transport races. See [ADR 0012](decisions/0012-organizer-request-recovery.md)
and [T02 evidence](../specs/002-player-pickup/verification.md).

Passed: verify, 61 client tests, 166 local pickup assertions, preservation checks
and browser behavior/fault scenarios at 390x844. SDK 57 iOS manifest and final
native bundle return HTTP 200. Two generated browser accounts and four synthetic
invitations were removed; user data remains intact. Requested LAN Expo preview
and the local backend stay running for iPhone review.

Next: T03 public upcoming-session discovery. iPhone touch/keyboard acceptance is
not yet reported; served bundles and browser checks do not certify it. No hosted
change, deployment, beta, commit or push occurred. Older entries retain their dates.

## SPEC-002 T01 local contract verified - 2026-10-12

T01 is done for its local data/permission scope. Added separate pickup invitation,
occupancy, match/side and score-history tables plus authenticated read projections
and a request-keyed atomic RPC. Row locks protect combined guest/account capacity
and start/join races; revision checks/history protect result corrections.
Migration applied incrementally to the existing unlinked local backend without
resetting data. All three court records and original contracts remain preserved.

Passed: 164 new anonymous/two-account pickup assertions including rollback replay,
111 previous permission assertions, 42 session assertions, 48 client tests,
11 harness tests and verify. Generated types match the local schema. See
[T01 evidence](../specs/002-player-pickup/verification.md) and
[ADR 0011](decisions/0011-atomic-pickup-contract.md).

Next: T02 organizer creation/management UI. No new feature UI/device acceptance,
hosted migration, remote operation, beta or publication is claimed. Existing
working changes and unrelated containers were preserved; the already-running
local backend stays running. The preceding planning entries are historical.

## Player-first pickup MVP is SPEC-002 - 2026-10-12

The owner confirmed players looking to join as the initial audience.
[SPEC-002](../specs/002-player-pickup/spec.md) is the next product priority:
draft pickup-session discovery, participation and minimal organizer support.
The draft now also captures immediate invitations and already-assembled match
registration with organizer-declared final scores. Live scoring is deferred.
Confirmed rules include guests in recorded matches, fixed 2/4/10 capacities,
present-player occupancy and explicit organizer start. Saving the final score
closes the match; organizer corrections retain history. T00 planning is complete
and SPEC-002 is ready for T01. No new feature is implemented or accepted yet.
[ADR 0010](decisions/0010-player-first-next-mvp.md) records the accepted direction.

SPEC-001 remains verified for its existing local scope. iOS beta is future work
without a registered specification or reserved ID. At the owner's request its
previous specification, tasks and preparation evidence were removed.
No feature implementation, remote change, build or distribution occurred.
Check results and limits are in SPEC-002 verification.

## SPEC-001 findings resolved and local closure - 2026-10-09

C01/C02: public onboarding/welcome describes only implemented court communities;
consent identifies provisional development notices, removes example links and
unsupported promises, and uses dev-preview-1 acknowledgements. The existing sync
contract is preserved. Both selections gate continuation; failed storage displays
Retry and retains selections. Browser fresh-entry/direct-route and fault tests pass.
C03: the owner confirms all three courts are at their real locations. No rows
were modified or merged. T08 is done and SPEC-001 is verified for the local MVP.

The starting tree was clean at aae45d5. Dependencies were missing; npm ci restored
the locked install without dependency changes. Client checks and 48 tests pass.
No remote calls, signup/account writes, database migrations, commits or push were
performed. Native functional evidence is retained from the owner's previous runs;
this text/acknowledgement update was exercised in browser and unit tests.

Production policies, hosted schema/RLS upgrade, dependency triage, independent
builds and legacy Deno services remain release debt in the
[closure review](../specs/001-core-journey/closure-review.md). Development notices
are not legal policies. No future feature work started. Earlier entries are history.

## Formal closure audit supersedes the previous closure - 2026-09-24

The main local journey works, but SPEC-001 is not formally closed. T08 and the
registry return to in_progress following the [closure review](../specs/001-core-journey/closure-review.md).
Public onboarding advertises real-time activity, teams, statistics and games that
the MVP does not provide. Consent still opens placeholder URLs and promises
unavailable privacy operations. These are R10/A10 findings inside SPEC-001, not
features to defer silently. Explicit physical-location confirmation for the three
courts is also missing; source-coordinate equality is not a field accuracy check.

Fresh checks: verify passes, 46 client tests and 11 harness tests pass; verify:edge
fails because Deno is missing. Existing local API/browser/iPhone results remain
valid within their recorded limits. Only documentation/task states changed in
this audit. No commits, staging, resets, remote changes or future feature work occurred.
The review contains the acceptance-by-criterion assessment, debt register and
proposed commit groups. Next: close its C01-C03 findings within SPEC-001.

Entries below are chronological history; their closure statements are superseded.

## SPEC-001 local MVP accepted - 2026-09-24

T08 is done and SPEC-001 is verified for the local Supabase/browser/iPhone Expo Go
scope. The owner explicitly confirms independent A/B membership (B leaving does
not affect A) and connection-failure recovery after reconnecting and retrying.
Browser checks now also pass catalog/My Courts read-error recovery, A -> B -> A,
profile/menu logout failure and retry, no-match search and direct legacy-route
exclusion. See the [dated evidence](../specs/001-core-journey/verification.md).

No app code changed in this closure. Disposable browser accounts were removed,
the temporary preview stopped and remote data left untouched. Existing static,
unit and local permission results remain recorded with their execution dates.

Proposed next phase: prepare a reproducible beta release. First review and commit
the accumulated working changes, document remaining dependency/legacy-service
risks, and define a separate release specification. Plan a backed-up incremental
hosted schema upgrade preserving the three courts and user data; validate a
standalone iOS build and hosted email configuration before distribution. These
are proposals, not deployment authorization or claims of production readiness.
Android, a full web map, catalog expansion and team features remain outside this MVP.

## T08 implementation and partial acceptance - 2026-09-24

T08 is in progress. Active tabs are Courts, My Courts and Profile. Legacy team,
player, notification-settings and creation routes are excluded through navigator
guards; their source and stored data remain. Removed unfinished menu actions,
avatar upload from onboarding/profile and the nonexistent match route declaration.
Profile shows the authenticated display name. Shared logout now keeps failures
visible with Retry logout; successful logout navigates to signin.

Passed this run: verify, 46 client tests, 42 local session assertions, 111 local
permission assertions and preservation of all three courts. Browser checks passed
invalid-password recovery, incomplete-profile validation, blocked profile-save
retry with retained input, blocked join retry, lost successful join/leave response
recovery, one My Courts card and reload persistence. Local fixtures were removed
and the temporary 8092 preview stopped; no remote data or deployment changed.

Not complete: the next browser action (My Courts read failure and logout failure)
was not executed because automatic approval review hit a usage limit, not because
it found the action unsafe. Remaining browser cases include catalog/list retries,
logout/menu behavior, direct legacy-link exclusion and the new two-account flow.
The final iPhone two-account/error journey also remains pending. Previous T05/T07
account-isolation evidence still applies but does not replace this final pass.
See the dated [evidence and remaining steps](../specs/001-core-journey/verification.md).

## T07 local iPhone acceptance complete - 2026-09-24

The owner reports successful court search, joining, fully closing/reopening the
app with membership retained, and leaving the court on iPhone. Together with the
preceding browser, retry, integrity and permission evidence, this completes T07
for the local scope. This is owner-reported evidence, not agent-observed device
interaction. Native account switching and rejoining were not separately reported.

Next: T08, verify the complete MVP with two accounts, recoverable errors and no
simulated events or misleading unfinished controls. Hosted behavior and standalone
builds remain unverified. This closure changes documentation/task state only;
no application, database, account or deployment changes were performed.

## T07 membership implementation - 2026-09-24

Join court, Leave court and My Courts are implemented against local Supabase.
Changes are confirmed by the server before showing success; repeat joins preserve
the original timestamp and uncertain requests can retry the same intended action.
The owner-scoped list supports loading, empty, refresh and error/retry states.
No team, attendance, public roster or expiry is implied.

Passed: verify, 46 client tests, 42 local Auth/membership assertions, 111 permission
assertions, three-court preservation and iOS bundle export. Browser checks covered
join/list/reload, A -> B -> A isolation, leave/empty/rejoin and refresh. Synthetic
browser accounts were removed; existing user accounts and remote data are intact.
T07 stays in progress pending the same membership journey on the owner's iPhone.
Then T08 verifies the complete MVP. See
[evidence](../specs/001-core-journey/verification.md) and
[decision](decisions/0009-confirmed-court-membership.md).

## T06 local iPhone acceptance complete - 2026-09-23

The owner confirms the permission-denied message and continued manual map browsing
on iPhone. Combined with the earlier three-court rendering, correct marker details,
search and granted-location results, T06 is now done for the local iPhone scope.
Automated and browser evidence remain linked in the specification. Android builds,
hosted behavior and a full web map are not certified by this acceptance.

Next task: T07, join/leave/rejoin court communities and the My Courts screen, with
persistent owner-scoped membership. No application, remote database or permission
settings were changed by the agent in this documentation-only update.

## T06 owner iPhone results - 2026-09-23

The owner confirms all three courts appear, marker taps open the correct court,
searching rodo returns two results, and Use my location centers on their position.
No permission prompt appeared. Prior permission is a possible explanation, not
an inspected fact. Native permission-denied/manual-browsing acceptance remains
pending; T06 stays in progress. No application or remote changes in this update.

## T06 catalog and map implementation - 2026-09-23

T06 is implemented locally and remains in progress pending iPhone map acceptance.
The SDK-compatible react-native-maps 1.27.2 uses the default Apple provider on iOS.
Catalog search, list and detail screens now read the existing three courts; sample
ratings, distances and player counts were removed. The native map receives the
same filtered rows. Foreground location is opt-in and denial preserves browsing.
Web offers the catalog/list/details without importing a native map.

Passed: verify, 40 client tests, 35 local Auth/catalog assertions, court-preservation
check, Expo Doctor 21/21 and iOS/Android/web export. Browser checks covered the
three real names, accent-insensitive search, no matches, Palermo details and an
unknown court. Native rendering/taps/location permission behavior require the
owner's iPhone test. No remote changes or deployment. Next: validate T06 on iPhone,
then T07 membership actions and My Courts UI. See
[evidence](../specs/001-core-journey/verification.md) and
[map decision](decisions/0008-sdk57-court-map.md).

## T05 local account isolation complete - 2026-09-23

T05 is complete with local/browser evidence. Identity changes replace the query
cache and mounted personal screen state; owner-keyed queries are disabled while
signed out. Notifications use backend/account storage, wait for hydration and
serialize writes across instances. Unowned legacy notifications are not imported,
and automatic sample events have been removed. My Courts has an owner-filtered
reader/hook; its final screen and join/leave actions remain T07.

Verification: 34 client tests, 34 local Auth/session/isolation assertions, preserved
three-court check and verify pass. Browser A -> logout -> B -> logout -> A showed
the correct profiles and no synthetic badge. Two temporary browser accounts were
removed; user accounts and remote data were untouched. Native account switching
was not rerun. Next task: T06, validate the native map and connect the real catalog.
See [evidence](../specs/001-core-journey/verification.md) and
[decision](decisions/0007-account-scoped-state.md). The MVP is not yet complete.

## T04 local acceptance complete - 2026-09-23

The owner retested the updated flow on iPhone with a new account and signed out.
Together with the earlier reported web/iPhone session persistence and logout,
browser onboarding evidence, 29 client tests and 27 local Auth/session assertions,
this completes T04's local acceptance. The latest report is manual user evidence,
not an independently observed device recording or database inspection.

Next task: T05, isolate personal query data, My Courts and notifications between
accounts. T06 map/catalog integration is also available by dependencies. T04
completion does not certify the full MVP or hosted behavior. The original generic
consent warning's cause remains unknown; retain its history if it recurs. Exact
iOS force-quit timing and native fault injection were not independently observed.
No app code, user accounts, remote data or deployment changed in this update.

## Consent recovery implemented locally - 2026-09-23

The original generic consent warning did not reproduce in a fresh local API or
browser signup. Its specific cause remains unknown. The confirmed handling defect
was corrected: failure previously logged a generic console error and continued
without a retry. Pending consent is now validated, bound to the signup account
and backend, and synchronized during validated session hydration. Failures retain
the pending record and expose the existing setup Retry/Sign out controls.

The updated browser flow persisted consent and reached discovery; logout passed.
29 client tests and 27 local Auth/session assertions pass, including consent
retry, account/environment separation and cross-account write rejection. The
three courts remain preserved. T04 stays in progress pending owner validation of
the updated flow on iPhone and clarification of the original failure if it recurs.
Unbound legacy pending values are not silently assigned on login. No remote
changes or database migrations were made. See the dated specification evidence.

## Owner-reported web and iPhone session check - 2026-09-23

The owner reports successful sign-in, retained authentication after closing and
reopening, and successful logout on both web and iPhone. This adds manual device
evidence to T04; the exact iOS termination/background sequence was not recorded.
The supplied screenshot also shows `Unable to sync pending consent.` This is an
open onboarding defect, not a failed login. T04 remains in progress while that
failure is diagnosed and verified. Next action: reproduce consent synchronization
against local Supabase, fix the confirmed cause and rerun the onboarding journey.

The screenshot's court names and map placeholder are static content in
app/(tabs)/map.tsx, not the preserved three-court catalog; real discovery is T06.
No application or database behavior was changed for this evidence update.

## SDK 57 ready for iPhone testing — 2026-09-23

T09 is complete: Expo 57.0.24, React Native 0.86.3 and React 19.2.3 are aligned.
A clean lockfile install, Expo Doctor (21/21), static checks, 23 client tests,
11 harness tests and 22 local Auth assertions pass. iOS, Android and web bundles
export successfully. The LAN launcher reaches local Auth and serves an iOS
manifest with SDK 57.0.0. The three preserved courts pass the local data check.

The owner now has an iPhone with Expo Go 57.0.9. T04 remains **in_progress** until
its physical-device session lifecycle is observed; SDK readiness is not device
acceptance. Use the [iPhone guide](../local-backend/README.md) and
[evidence](../specs/001-core-journey/verification.md). Expo Go and the CLI need the
same Expo account. The launcher disables .env and targets local Supabase only.
No hosted data, deployment or firewall rules were changed.

Remaining limitations: npm audit reports 26 findings (2 low, 17 moderate, 7 high;
no critical). Existing missing court/match route warnings remain. Native rendering,
AppState, force-close persistence and hosted email delivery are not certified.
After T04 acceptance, proceed to T05 account isolation. Historical entries below
retain the environment and availability at the time of each check.

## T04 implementation and browser evidence — 2026-09-22

Registration, minimal profile setup and the session lifecycle are implemented.
Local browser checks passed for signup, incomplete-profile recovery, name
validation, save without avatar, reload persistence, logout and invalid-password
retry, plus email-confirmation instructions and manual login after following
a real confirmation link in the local mail viewer. Controller tests cover late responses, failed profile loads and expired
sessions; real local Auth tests cover refresh and revocation.

T04 remains **in_progress**: only a browser is available, so native force-close,
reopen and AppState behavior are unverified. The local confirmation-email browser
journey passed; native link handling and hosted email delivery are not certified.
T05 (account isolation) follows once T04 acceptance is completed.

Use `npm.cmd run db:local:start` and `npm.cmd run db:local:web` for a local preview
without editing .env. See [reproduction and limits](../specs/001-core-journey/verification.md)
and [session decision](decisions/0005-auth-session-lifecycle.md). No hosted writes
or deployment were performed. Test identities were removed, the temporary Auth
configuration restored and the local backend/preview stopped. The map, sample notifications, team UI and shared
personal query keys remain pending T05–T08. Existing consent sync and optional
avatar storage are not certified. Historical entries below retain their dates.

## T03 local permissions complete — 2026-09-21

Owner-confirmed hosted Edge Functions list is empty. No function deployment or
server secret change was needed to proceed. The new local migration restricts
profile fields and ownership, makes courts/catalog read-only to API callers and
opens private owner-only membership operations. Server roles, statistics and
timestamps cannot be supplied or edited through the mobile caller's privileges.

Local replay and court-preservation checks pass. The permission suite passes
111 assertions with two real Auth sessions plus anonymous requests, including
cross-account attacks, forged metadata, duplicate/concurrent joins and cleanup.
All three courts remain intact. Client/static checks, 11 harness tests and nine
client tests pass. See [evidence](../specs/001-core-journey/verification.md).

These permissions are implemented locally, not in hosted Supabase. The app's
existing hosted configuration remains unchanged. Next available task: T04,
registration, minimal profile and persistent sessions. Historical entries below
describe earlier observations, not the current local implementation.

## API key migration preflight — 2026-09-21

The owner reports disabling legacy API keys. Read-only checks with the new
publishable key returned HTTP 200 for Auth settings and all three courts. This
does not certify signed-in flows or deployed Edge Functions. Four local functions
read legacy credentials, but no direct callers were found in the inspected app.
Some also use absent schema objects or incomplete authorization/error handling.
See the [migration runbook](supabase-key-migration.md). Hosted function names and
callers still need confirmation; no functions or gateway settings were changed.
T03 remains the next implementation task. Historical findings follow below.

## Current issues and next action — 2026-09-21

This is a reading summary of the recorded evidence, not a new runtime or remote
security audit. Task states remain in [tasks.json](../specs/001-core-journey/tasks.json).
T00–T02 have local completion evidence; T03 is the next available implementation
task. The MVP is not yet accepted on a device or deployed as a complete journey.

- **Permissions (T03):** inspected profile permissions do not protect app_role
  from owner edits. Restrict privileged profile fields and catalog writes, then
  verify allowed/denied operations with anonymous access and two real test sessions.
  The new local court membership API remains closed until ownership is enforced.
- **Registration and sessions (T04):** the onboarding loop, email confirmation
  without an immediate session, persistence, refresh and revocation need fixes or
  functional verification. Existing screens do not prove this journey works.
- **Account isolation (T05):** shared personal cache keys and logout cleanup can
  expose stale account data after switching users; verify A-to-B behavior.
- **Maps and catalog (T06):** the map remains a placeholder. The Google/Apple
  proposal needs native validation; platform and initial area are not finalized.
  Preserve the three original courts; verify location accuracy and whether the
  two nearby Parque Rodo records represent the same court before any merge.
- **Membership experience (T07):** local storage exists, but join/leave/rejoin and
  My Courts still need UI, integration, retry and persistence acceptance.
- **Release evidence (T08):** no complete two-account device journey or native
  build acceptance is recorded. Remove simulated MVP events and test failures.

Additional known limitations: Docker published local ports on all interfaces
despite the requested loopback option; the last backend run was stopped. An npm
audit previously reported 36 vulnerabilities, but that is a historical count,
not a fresh assessment of current versions or exploitability. Dependency triage
is still required before release. Edge Function validation remains separate;
the missing-Deno limitation has not been resolved by client checks.

Deferred legacy issues include partial team creation, image-storage behavior and
an adapter whose eq filter is ineffective. Teams are outside this MVP; do not use
that adapter for new writes without fixing it. The historical root SQL is not a
safe remote deployment path. A future release needs a reviewed incremental
upgrade against a freshly inspected hosted database.

The first three tasks established documentation, a passing client baseline and
a reproducible local data contract. They do not represent one third of the user
experience: most remaining work is functional integration and acceptance.

For phone access, use the [mobile reading guide](mobile-guide.md). The published
documentation records local work; it does not publish or deploy the app changes.

## T02 local reconciliation complete — 2026-09-20

The two reviewed exports now reproduce the public application schema and all
three existing court records in a separate local Supabase workspace. PostgreSQL
17.6/PostGIS 3.3.7 replay, source preservation, SQL contract tests and public
catalog API reads pass. Type generation is identical before/after a clean replay.
The generated types now drive the client and exposed invalid field assumptions;
profile stats, achievement and court queries were aligned with the real schema.

Added local-only court_memberships (unique user/court pair, foreign keys and
server timestamp) and a security-invoker coordinate view. Membership API writes
remain closed until T03. Hosted data and schema were not changed. The three
original IDs and raw court fields are preserved; possible duplicate Parque Rodo
entries and physical map accuracy remain T06 review work.

The [local workflow](../local-backend/README.md) documents setup, reset, checks,
type generation and shutdown, including the observed Docker port-binding limit.
Next task: T03, protect privileged profile columns/catalog writes and prove
membership ownership with anonymous and two authenticated callers. T04–T08
remain unaccepted. See [execution evidence](../specs/001-core-journey/verification.md).
All entries below are historical observations.

## T02 first schema snapshot received — 2026-09-19

Reviewed and preserved the user's PostgreSQL 17.6 inventory: courts has eight
columns, users_public has 13, and public.court_memberships is not among the
returned regular/partitioned tables. The historical migrations and manual types
do not match it. Profile grants/policies do not restrict editing privileged
columns; T03 needs direct permission checks and a fix. No remote writes or
cleanup occurred. The three courts remain protected by the retention requirement.

Prepared one read-only follow-up to collect missing enum labels, application
function bodies, related schema objects and the court catalog. The first export
contains structure only, not a backup of those courts. T02's remaining blocker
is this dependency/catalog inventory, not Docker or the public API key. See
[confirmed differences](db-context.md) and the [runbook](database-reconciliation.md).
Historical status entries below describe the earlier state.

## T02 diagnostic correction — 2026-09-19

Docker is now reachable (server 28.3.2). The unchanged public Supabase key succeeds for Auth settings and a zero-row courts request (HTTP 200). The OpenAPI root alone returns HTTP 401, consistent with Supabase's removal of public-key schema introspection. The earlier probe was insufficient to diagnose credential validity. Do not change credentials on that basis. T02 now awaits a supported schema inventory via SQL editor/database connection or authorized Management API, plus local replay. Preserve the three existing courts; no cleanup or remote mutations occurred. Details and sources: [database runbook](database-reconciliation.md). The following entry records the earlier state.

## T02 started; external prerequisites pending — 2026-09-19

Current client checks still pass. Added read-only API schema inspection, a database catalog inventory query and five regression tests for the inspector (nine tests total in test:client). The configured Supabase metadata endpoint returns HTTP 401; the Docker Desktop Linux engine is not running/available. The user confirmed the same target project and requires preservation of its three existing courts. Test users and court associations may be cleaned up if necessary, but no need has been established and no cleanup was performed. The remote project is not disposable. T02 is blocked on access/environment prerequisites, not complete. No canonical schema/types, migrations or verified court catalog are claimed. See the [database runbook](database-reconciliation.md).

## Client baseline restored — 2026-09-19

T01 is complete: documentation, client TypeScript and lint pass with zero errors/warnings; four profanity regression tests pass. Local Expo starts Metro offline and `/status` returns `packager-status:running`. SDK dependency compatibility passes against the installed offline catalog, without a fresh remote recommendation check. No dependencies were changed during this completion.

B03's client compilation blockers are fixed. Court search consumes the existing id/name contract; the collapsible uses React Native primitives and the existing palette; the profanity utility uses the installed named export. Hook dependencies and unused code warnings are fixed without exclusions. Notification persistence/hydration and account isolation remain unverified; this warning cleanup does not resolve B06.

Next: T02, reconcile the profile/court/membership contract and prepare a disposable backend. Development schema inspection, platform/catalog decisions, database permissions, authentication, real maps and membership acceptance remain pending. No remote database access, migrations or deployment took place. Deno was not rechecked because no Edge Functions changed; its prior missing-runtime limitation remains unresolved. See [reproducible evidence](../specs/001-core-journey/verification.md). Historical entries below describe earlier states.

## Current product direction — 2026-09-19

The user narrowed the MVP to sign-up/sign-in, real court discovery and persistent membership in court communities, independent of teams. SPEC-001 now reflects that direction. The map recommendation and alternatives are in [ADR 0002](decisions/0002-court-first-mvp.md); no provider has been installed or activated. T00 completion and T01 progress are preserved. Team creation/invitation work is deferred, while the historical findings below remain relevant to existing code.

Referencia: 2026-09-17, hora local de Uruguay. Revisión de archivos y comprobaciones locales; sin ejecución en dispositivo ni consultas al Supabase remoto.

## Estado general
En estabilización. Hay base Expo / React Native, perfiles, equipos, Zod, React Query y recursos Supabase. El árbol de trabajo ya tenía modificaciones y archivos sin registrar antes de esta organización.

## Hallazgos prioritarios
- **B01 — Permisos:** la migración RLS permite modificar el perfil propio sin proteger `app_role`. No se encontraron restricciones de columna equivalentes en los archivos revisados. Contrastar el remoto y proteger los campos privilegiados.
- **B02 — Esquemas:** la app escribe `teams.type`, `requires_approval`, `minimum_players` y `team_members.status`, ausentes en la migración inicial. También discrepan roles y `games`/`matches`. Ver [datos](db-context.md).
- **B03 — Cliente:** `step1` espera `address` en canchas; `collapsible` importa cuatro módulos ausentes; `profanity` importa por defecto una exportación nombrada de `bad-words`.
- **B04 — Registro:** completar perfil vuelve a edad/consentimiento/registro; no se distingue bien el alta sin sesión cuando hay confirmación de correo.
- **B05 — Sesión:** falta almacenamiento persistente nativo integrado a Supabase y completar el retorno OAuth.
- **B06 — Cambio de cuenta:** claves de caché personales compartidas y sin limpieza al salir; riesgo de mostrar datos anteriores.
- **B07 — Creación parcial:** equipo y miembros se guardan en llamadas separadas sin transacción ni compensación.
- **B08 — Provisionales:** mapa, canchas y notificaciones de ejemplo; enlace de invitación fijo y opciones sin implementar.
- **B09 — Imágenes:** varias convenciones de rutas y políticas de logos que solo dejan leer al propietario. Falta verificar subida nativa y lectura de otros miembros.
- **B10 — Adaptador:** `eq` en `lib/backend/supabase.ts` no aplica el filtro. No usarlo para nuevas escrituras hasta corregirlo o retirarlo; las pantallas revisadas usan principalmente Supabase directo.

## Línea base previa
- `tsc --noEmit`: 33 errores; 6 del cliente y 27 de funciones Supabase bajo configuración del cliente.
- `eslint .`: 13 errores y 5 advertencias, incluyendo generados y funciones Deno.
- No había suite automatizada configurada.

Las nuevas comprobaciones separan cliente y Deno. Sus conteos no son directamente comparables a los anteriores. El resultado actualizado se registra en [evidencia](../specs/001-core-journey/verification.md).

## Desconocidos
Esquema, grants, políticas, triggers y buckets remotos; configuración Auth; funciones desplegadas; arranque de base local desde cero; compilación Android/iOS y recorrido con dos cuentas. No se afirma que producción tenga todos los problemas locales.

## Siguiente trabajo
Consultar `npm run harness:status`. Los estados y dependencias viven en [tasks.json](../specs/001-core-journey/tasks.json). Primero una base verificable; luego datos/permisos y el recorrido funcional.

## Actualización de arranque — 2026-09-18
Se comprobó el arranque de Metro con el CLI local mediante `npm start`, se retiró `@types/react-native` y se alinearon dependencias dentro de SDK 54 (Expo 54.0.37, React Native 0.81.5). La comprobación de compatibilidad de Expo pasa. El CLI agregó plugins de font, secure-store y web-browser; no se verificó compilación nativa. `verify` mantiene 6 errores de tipos y 4 errores / 4 advertencias de lint. npm reportó 36 vulnerabilidades pendientes de evaluar. T01 sigue en progreso; consultar [evidencia y límites](../specs/001-core-journey/verification.md). Próximo paso: corregir los errores estáticos del cliente.

## SPEC-003 T01 R01 visual review prepared - 2026-10-13

Owner authorized design-only T01 and confirmed Spanish initial UI. Reviewable
static compositions prioritize Court List, Map, Preview and Detail, and cover
Play/supporting states, alternatives, tokens and motion. See
[the R01 review](../specs/003-arcade-ux-ui/design-r01/review.md).
T01 remains in_progress awaiting exact owner approval. SPEC-003 remains draft;
T02 is not authorized. Verify passes; no runtime/device accessibility/performance
acceptance, functional code, backend, deployment, commits or push in this step.

## SPEC-003 T01 R02 visual refinement - 2026-10-13

Owner requested three separate Courts/Play/Organize visual boards and an annotated
motion storyboard, preserving R01 and existing behavior. See
[the R02 review](../specs/003-arcade-ux-ui/design-r02/review.md).
Design-only; T01 remains in_progress, SPEC-003 draft and T02 unauthorized.
No application/backend/RLS changes, commits or push. Static check and visual
review evidence/limitations are recorded in SPEC-003 verification.

## SPEC-003 T01 R02.1 targeted visual review - 2026-10-13

Owner approved R02 general artistic direction, not final T01 acceptance. R02.1
contains compact/expanded court preview, eligibility/schedule/participant patches
and three four-frame sequences. See
[the R02.1 review](../specs/003-arcade-ux-ui/design-r02-1/review.md).
R02 preserved. T01 remains in_progress; no implementation, commits or push.

## R03 design-only fidelity review — 2026-10-14

The owner requested a new [R03 review package](../specs/003-arcade-ux-ui/design-r03/README.md) after reporting
native visual divergence. R03 is proposed, not approved or implementation-ready.
Current authorization is design/documentation only; do not continue UI implementation
or final verification from earlier T05 authorization. T00–T04 completed history is
preserved; T05 stays in_progress and T06 todo. No registry state/numbering changed.
The [proposed refinement sequence](../specs/003-arcade-ux-ui/design-r03/task-proposal.md) requires approval
before insertion/renumbering. Once approved, frozen R03 boards/specifications become
the visual baseline; until then R02/R02.1 remain historical approved references.
Actual iPhone comparison, text settings, safe insets and native acceptance remain
pending. No backend/RLS, contracts, app source, commits or push in this review.
