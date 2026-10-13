# Verificación de SPEC-001

## 2026-10-09 - C01-C03 resolved; local SPEC-001 closure

Starting state: clean feature/init at aae45d5 (owner-created commit). Read project
instructions/status/workflow and harness state. The sandbox process could not
start (setup refresh error); approved local execution restored file/command
access. Initial verify passed docs but failed type/lint because TypeScript/ESLint
were absent. npm.cmd ci --no-audit --no-fund restored 936 locked packages; no
package/lockfile change. This installation is not a fresh vulnerability audit.

C01: all four onboarding slides and direct welcome now describe catalog search,
court details, membership without teams or attendance, and persistent My Courts.
C02: consent explicitly says development preview/provisional notices. Removed
placeholder policy links and unsupported privacy promises. Both acknowledgements
remain required; draft fields and account/backend sync are preserved, with
dev-preview-1 distinguishing test notices from finalized legal acceptance. Existing
rows/versions are not rewritten. Storage failure keeps selections and shows Retry.

C03: the owner explicitly confirms Palermo, Parque Rodo and Parque Rodó Court
appear at their actual locations. This is owner-reported geographical evidence,
not an independent survey or permission to merge the two Parque Rodo entries.
No court IDs, names, coordinates or other stored data changed.

Verification performed:

- npm.cmd run verify passed after implementation (docs, client TypeScript, lint).
- npm.cmd run test:client: 48 passed. New development-consent tests reject either
  missing selection without writes, retry storage failure and confirm the distinct
  version survives prepare/sync and cleanup. Existing consent/identity tests pass.
- Browser localhost:8094 with EXPO_NO_DOTENV=1, EXPO_OFFLINE=1, loopback API URL
  and synthetic public-key placeholder. No user signup or database write; these
  public screens need no backend. Initial compilation exceeded navigation timeout;
  retry after bundling succeeded. Early ambiguous selectors were corrected to
  target the visible route. A checkbox assertion exposed missing web aria-checked;
  explicit aria-checked fixed it and the full scenario then passed after restart.
- Fresh entry with this isolated origin's hasSeenOnboarding removed: root -> four
  slides via Next -> age -> consent. All new copy appears; no policy links exist.
  Direct URLs for each slide and /welcome also show the corrected copy.
- Continue is disabled with zero/one acknowledgement, enabled with both. Override
  Storage.prototype.setItem to throw only for pendingConsent; Continue stays on
  consent with an alert and both boxes checked. Restore storage and Retry: signup
  appears, and the draft has true/true plus version dev-preview-1. No account is
  submitted. Browser assertion confirms both visual controls' accessible state.
- Source scan finds no former real-time/stats/match/privacy promises or example
  policy domain in app/(auth). Historical documentation retains the audit record.

Limits: updated public UI was not independently rerun on physical iPhone; prior
owner auth/map/membership/error acceptance remains. No new API permission or Edge
test is claimed, since those contracts did not change. Legacy step4 illustration
uses an invalid inline SVG URI and can generate an image error; existing web
style/driver warnings also remain presentation debt, not a failed consent action.
No new privacy policy, hosted email assurance, production consent validation or
distribution readiness is claimed. Release debt in closure-review.md remains.

With C01-C03 resolved, T08 is done and SPEC-001 verified for the local MVP. No
commit, push, deployment, hosted write, court merge or future feature work occurred.
Final verify passed all three checks (30 Markdown files, TypeScript, lint),
test:client passed 48/48 and git diff --check passed. Final harness:status reports
all tasks done. The temporary 8094 preview was stopped after testing.

## 2026-09-24 - Formal audit corrects the closure assessment

See [closure review](closure-review.md) for criterion-by-criterion coverage,
code references, repository inventory, remaining debt and proposed commit groups.
The prior verified statement was too broad: public first-run onboarding and
consent were not covered by the final authenticated-navigation cleanup checks.
They still advertise unavailable capabilities and placeholder links (C01/C02).
Source-preserved map coordinates also lack explicit physical-accuracy confirmation
for all three courts (C03). Passing earlier functional results remain evidence;
they do not waive these findings. T08 and SPEC-001 return to in_progress.

This is a documentation-only audit: no behavior, database, Git index/history or
remote changes. No future feature work started. Fresh initial verify passed; test:client
46/46 and test:harness 11/11 passed. verify:edge failed with deno ENOENT; it was
not skipped or claimed green. No functions changed. Database/browser/device tests
were reviewed from preceding dated evidence, not rerun in this audit.

Final npm.cmd run verify passed documentation (30 Markdown files), TypeScript
and lint. git diff --check passed under the existing CRLF convention; the index
remains empty. Final harness:status reports SPEC-001/T08 in_progress and preserves
the completed implementation tasks. No known failing Edge check was suppressed.

## 2026-09-24 - T08 final local acceptance and SPEC-001 closure

The owner reports completing the iPhone tests and explicitly confirms both:
independent A/B membership of Palermo (B leaving does not affect A), and an error
on connection failure that recovers after reconnecting and retrying. This is
owner-reported physical-device evidence, not an agent recording. Earlier T04,
T06 and T07 reports cover registration/logout, map markers/search/location denial,
restart persistence and leaving. No additional device configuration is inferred.

Resumed browser verification used an isolated localhost:8092 Expo preview with
.env disabled and local Supabase at 127.0.0.1:55431, plus two disposable accounts.
The prior approval-review usage failure did not recur; the reviewed actions ran.
Initial navigation timed out during startup. An early form attempt displayed
Invalid email address; refilling after startup and resubmitting succeeded without
code changes. This transient automation/startup observation is not diagnosed as
a product defect. All acceptance steps below subsequently passed:

1. Sign in A, complete the minimal name-only profile, join Palermo and open
   My Courts. Intercept local court_memberships reads with route.abort('failed'),
   press Refresh and observe Unable to load your courts. Remove interception,
   press Retry and observe the Palermo card again.
2. Open Profile and verify A's display name. Fulfill the local auth/v1/logout
   request with HTTP 500. Logout displays Retry logout and stays on Profile.
   Remove interception and retry: signin appears. Repeat failure/retry through
   the court menu: the error remains visible and the retry returns to signin.
3. Sign in B, complete its profile and verify empty My Courts. B joins and leaves
   Palermo. Profile displays B's name. Sign out and return to A: My Courts still
   contains Palermo. This verifies final-screen account separation; delayed
   responses and first-render isolation are additionally covered by T05 tests.
4. Abort local court_catalog reads and load /map. The catalog error and Retry
   appear. Remove interception and retry: all three courts appear. Search an
   unmatched name: the no-match message appears; search rodo: two results.
5. Directly navigate to /teams, /notifications, /create-team/step1, /team/<test-id>
   and /player/<test-id>. Each returns to the active /map catalog, without opening
   its legacy screen. The menu shows only the account name, My Profile, My Courts
   and Logout; active tabs are Courts, My Courts and Profile.

All interception was confined to this local browser page. Expected console
request errors came from injected failures. Existing development warnings remain
as recorded below; no production logging or build claim is made. Final logout
passed. The two disposable accounts were removed with the local fixture cleanup,
and the temporary preview stopped. Existing user accounts, the three courts,
the user's preview and all hosted data were preserved.

Closure coverage: A01-A03 use the recorded clean-install/static/local-contract and
permission evidence; A04-A06 use T04/T09 plus profile-write failure and restart
checks; A07 uses final browser A/B and the explicit owner iPhone report; A08 uses
T06 native checks plus final catalog retries; A09 uses T07, lost-response tests
and independent device memberships; A10 uses the recorded profile/membership
write failures, current read/logout failures and excluded unfinished routes.
No new application changes were required. Initial and final npm.cmd run verify
passed documentation (29 Markdown files), TypeScript and lint. Final harness:status
reports SPEC-001 verified and every task, including T08, done.

T08 is done and SPEC-001 is verified for this local MVP scope. This does not
certify hosted permissions/migrations, production email, a standalone native
build, Android or legacy Edge Functions. No deployment was requested or performed.
Historical dependency findings require release triage; no new vulnerability audit
was run. Proposed next work is a separate beta-release specification, a reviewable
Git checkpoint, and an incremental migration/build plan before any deployment.

## 2026-09-24 - T08 navigation cleanup and partial end-to-end acceptance

Environment: Windows, Node 24.16.0, existing Expo SDK 57 installation, local
Supabase API 55431, PostgreSQL 17.6/PostGIS 3.3.7. Preserved existing dirty changes.
Initial harness status confirmed T07 done and T08 available; initial verify passed.
Updated R10 before changing behavior. The registry now reflects in_progress
instead of the obsolete draft state; neither SPEC-001 nor T08 is verified.

Changes:

- Keep only Courts, My Courts and Profile in active navigation. Use Tabs/Stack
  Protected guards for legacy teams, team creation/details, players and
  notification settings. Preserve their source/data. Remove the nonexistent
  match route declaration and no-op menu actions/notification entry points.
- Profile uses the authenticated profile name without invented statistics or
  editable avatar controls. Onboarding saves only display_name, preserving any
  existing avatar value. Failed saves retain the entered name and offer a safe
  retry message rather than raw backend errors.
- Header/profile share SignOutButton: synchronous duplicate-submit lock, pending
  state, inline error and Retry logout; navigate only after signOut succeeds.

Commands and results:

- npm.cmd run verify: passed after application edits and again after recording
  this evidence (29 Markdown documents, TypeScript, lint). git diff --check also
  passed with the repository's existing CRLF convention. Generated browser logs
  are ignored under .playwright-mcp; this document is the acceptance record.
- npm.cmd run test:client: 46 passed, including auth logout failure, account/cache
  isolation, consent recovery, catalog validation and membership fault cases.
- Initial db:local:verify could not access Docker's named pipe inside the sandbox.
  Retried with approved local Docker access; no reset or remote connection.
- npm.cmd run db:local:verify: passed three-court/source preservation, 21 columns,
  public catalog/coordinates, signup trigger and membership invariants.
- npm.cmd run db:local:sessions: 42 passed; npm.cmd run db:local:permissions:
  111 passed. Disposable suite fixtures were removed.

Browser reproduction and observed results (isolated localhost:8092 preview with
EXPO_NO_DOTENV=1 and local API only; two disposable incomplete-profile accounts):

1. Sign in A with an incorrect password: Invalid login credentials. Correct the
   password: incomplete-profile setup appears. Enter a one-character name:
   validation rejects it without navigation.
2. In Playwright, intercept only PATCH requests matching
   http://127.0.0.1:55431/rest/v1/users_public* and abort them. Save a valid name:
   inline retry message appears; input remains unchanged. Remove interception
   and press Continue: real three-court catalog appears with the three MVP tabs.
   Profile setup did not require or expose avatar upload.
3. Open Palermo. Abort only POST requests to
   http://127.0.0.1:55431/rest/v1/court_memberships*. Join: Retry change appears;
   no Leave button falsely claims success. Remove interception and retry:
   Leave court appears.
4. Intercept DELETE on that membership endpoint, await route.fetch() and require
   a successful server response, then route.abort('failed') to lose the response.
   Leave: Retry change appears. Remove interception and retry: Join court appears,
   confirming already-absent membership is handled safely.
5. Repeat the successful-server-write/lost-response interception for POST. Join
   reports uncertainty; removing interception and retrying confirms membership.
   My Courts shows exactly one Palermo card. Full page reload retains it.

The following combined browser action was NOT executed: abort My Courts reads,
refresh and retry, then simulate a logout 500 and test Retry logout. Automatic
approval review failed due to a usage limit; this was not a risk rejection. No
alternate tool was used to bypass that review. The two browser fixture accounts
were subsequently removed through the separately approved local cleanup command,
and the temporary preview was stopped. The existing 8090 preview was untouched.
No hosted writes, migrations, deployments or Edge Function changes occurred.

Acceptance coverage and remaining work:

- A01-A03: current client checks/local contract and permission suites pass;
  reproducible installation evidence is retained in T09. No new clean install,
  standalone native build or hosted validation is claimed. Historical dependency
  findings and unverified legacy Edge Functions remain release limitations.
- A04-A06: current invalid-password/profile-retry/browser-reload results supplement
  T04's signup, confirmation email, refresh/revocation and owner iPhone evidence.
- A07: T05/T07 browser and automated isolation evidence remains. Repeat A -> B -> A
  on the final UI and the owner's iPhone, including slow loading, before closure.
- A08: T06 contains the three-court/map/location-denial iPhone evidence. Repeat
  catalog read failure/retry and no-match search on the final browser UI.
- A09: current browser checks add real lost-write-response recovery to T07's
  owner iPhone restart/leave acceptance. Final two-account same-court joining and
  independent leaving/rejoining on iPhone remain pending.
- A10: profile and membership write errors pass in browser. My Courts/catalog
  read failure/retry, menu/profile logout failure/retry and direct attempts to
  open excluded legacy routes still need runtime checks. Navigator guards are
  typechecked, not yet accepted as direct-link behavior. Browser development
  warnings (shadow, pointerEvents, native driver and resizeMode) remain; request
  failures generated by explicit fault injection are expected test events.

Final owner device steps, after reloading the updated local preview:

1. As A, join Palermo and confirm My Courts; sign out and sign in as B. B must
   show its own name and memberships, never A's cached list, including while loading.
2. As B, join Palermo, leave and rejoin; sign out and return to A. A must still
   belong independently. Fully close/reopen and confirm the same A membership.
3. With a court detail already loaded, disable Wi-Fi and cellular access and try
   leaving. A retryable error must appear without false success. Restore the same
   Wi-Fi, retry, verify My Courts, then rejoin if desired. Do not reload while
   offline: Expo Go needs the development server for its bundle.
4. Confirm only Courts, My Courts and Profile are shown, and menu navigation and
   Logout work. Report actual results; steps listed here are not acceptance evidence.

T08 stays in_progress until the remaining browser/device checks have evidence.

## 2026-09-24 - T07 owner iPhone acceptance and closure

Environment: owner's iPhone in the established Expo Go/local Supabase test flow.
The owner reports completing the requested test successfully: search for a court,
join it, close the app completely, reopen with membership retained, then leave.
Expected and reported result: membership persists through restart and leaving
works. This report is manual owner evidence, not an agent-observed recording or
a fresh database inspection. My Courts rendering was not separately described;
its browser checks remain recorded below.

Combined with the preceding 46 client tests, 42 local session assertions, 111
permission assertions and browser join/list/reload/leave/rejoin/account-isolation
journey, this completes T07's local acceptance. Native rejoin, account switching
and fault injection were not separately reported; the full two-account device
journey remains T08. No hosted acceptance or standalone native build is claimed.

T07 is marked done and T08 is available. This documentation-only closure preserves
existing changes and does not modify app behavior, accounts or any database.
Final npm.cmd run verify passed: documentation (29 Markdown files), client
TypeScript and lint. No runtime suites were repeated for this documentation-only
closure; their prior results remain dated below.

## 2026-09-24 - T07 join/leave/My Courts implementation

Environment: Windows, existing Expo SDK 57 installation, local Supabase 55431.
Work began on September 23 and resumed September 24. The previous final local
command was not executed because automatic approval review hit a usage limit;
that failure was not a safety rejection. The resumed run was approved and all
local checks below executed. Existing dirty changes were preserved. T07 had
satisfied dependencies and its R09 behavior was specified before implementation.

Implementation: Join/Leave in court details and a My Courts tab. Join inserts only
owner/court; unique-key retries must confirm the existing row. Leave deletes only
owner/court and verifies absence. Server timestamps are not updated on repeated
joins. Validate identity/IDs before mutation; existing RLS/foreign keys remain the
security boundary. No new SQL migration. Disable repeat submissions while pending;
retain failed intent for Retry change. Do not claim optimistic success. Reload the
owner's membership list and cancel stale reads before publishing confirmed data.
Details/list share the account-scoped query; late responses cannot enter B's cache.
See [ADR 0009](../../docs/decisions/0009-confirmed-court-membership.md).

Verification:

- The initial implementation check identified an unescaped JSX apostrophe; fixed its
  text without suppressions. Final npm.cmd run verify passes docs (29 Markdown),
  client TypeScript and lint.
- npm.cmd run test:client: 46 passed. Six new fault/validation cases cover a join
  applied before its acknowledgement is lost, repeated leave after lost response,
  read-back failure, permission/FK errors, duplicate error without a visible row,
  and stale identity/invalid IDs submitting no writes.
- npm.cmd run db:local:sessions: 42 assertions passed. Added actual concurrent
  duplicate joins preserving one row and joined_at, leave/leave retry, unaffected
  B membership, rejoin, fresh-client login/persistence, rejected mismatched owner
  and nonexistent court. Disposable fixtures removed by the suite.
- npm.cmd run db:local:permissions: 111 assertions passed with anonymous and two
  real local sessions; includes direct ownership/uniqueness/integrity attacks.
- npm.cmd run db:local:verify: all three preserved courts and core invariants pass.
- npx.cmd expo export --platform ios --output-dir .harness/t07-ios --max-workers 2:
  passed (Hermes bundle). EXPO_NO_DOTENV=1, EXPO_OFFLINE=1, local URL, provider
  supabase and synthetic public-key placeholder were used. This is a bundle,
  not an installed native build or physical-device acceptance.
- Browser preview 8092 with .env disabled and explicit local API: A opened empty
  My Courts, explored Palermo, joined and saw Leave court. My Courts showed
  Palermo, including after a full page reload. After A logout, B's list was empty.
  Returning to A restored Palermo. Leave court removed it from the list; rejoin
  and Refresh restored it. Final logout returned to signin. Only the synthetic
  browser accounts were deleted; test tab/preview stopped. Existing 8090 server
  and user-created accounts were preserved. Initial page navigation timed out
  during compilation, then succeeded after the bundle finished. Metro also
  reported an unreadable cache and recovered with a full crawl; no manual cache
  deletion or application data reset was performed.

Limits: no physical iPhone membership interaction yet. Fault tests exercise the
mutation helper; no browser network-failure injection or every-frame UI assertion
is claimed. The iOS device must confirm the new tab/buttons and force-close/reopen
membership persistence. No deployment, remote writes or Edge Function changes.
T07 remains in_progress; T08 waits for acceptance. Existing team navigation and
historical match route warnings remain outside this task.

Owner acceptance steps: reload the local device preview, sign in A, open a court
and Join court; verify it in My Courts. Fully close/reopen Expo Go and confirm the
membership remains. Sign out and enter B to verify A's court is absent unless B
independently joined it. Return to A, leave, check disappearance, and rejoin.

## 2026-09-23 - T06 permission-denied acceptance and closure

Following the requested iPhone permission-denial test, the owner reports seeing
"Location permission was not granted. You can still browse all courts" and confirms
that manual map navigation remains usable. This is owner-observed device evidence;
no agent device control or permission setting change was performed.

Together with the preceding owner report (three courts, correct marker details,
two rodo search matches and location recentering), browser catalog/detail checks,
40 client tests and 35 local API assertions, this completes T06 for the chosen
local iPhone platform. The denial report specifically confirms the message and
map navigation, not an independent repeat of every list/detail interaction.
T06 is marked done; T07 is next. No new runtime test, hosted operation or deployment
was performed. Final npm.cmd run verify passed documentation, TypeScript and lint.
Android standalone builds and hosted deployment remain outside this acceptance.

## 2026-09-23 - Owner iPhone map check

User-reported results for the requested T06 test: all three courts appear; tapping
a marker opens the correct details; rodo search returns two courts; Use my location
recenters to the user's position. No permission dialog appeared, so denial was
not tested. No coordinates or personal location were collected for this record.

This adds native happy-path evidence, not agent-observed device interaction.
T06 remains in_progress until denial retains manual map/list/detail browsing.
Suggested reproduction: set Expo Go's iOS location permission to Never, reopen
the project, tap Use my location and check the explanatory message plus continued
browsing; then restore the preferred permission. Existing permission is only a
possible explanation for the absent dialog. No permission settings were changed
by the agent. Documentation-only update; npm.cmd run verify passed.

## 2026-09-23 - T06 implementation; native acceptance pending

Environment: Windows, Expo 57.0.24 / React Native 0.86.3, local Supabase API 55431.
Initial harness status showed T06 available and verify passed. R08 and the task
state were updated before implementation. Installed react-native-maps 1.27.2 via
EXPO_NO_DOTENV=1 npx.cmd expo install react-native-maps; the installed SDK catalog
and official SDK 57 documentation agree. Added the foreground expo-location
permission description for future builds; no background location or cloud keys.
See [ADR 0008](../../docs/decisions/0008-sdk57-court-map.md).

Implementation: validated court_catalog rows are the single source for native
markers, name search, list and details. Required identity/name/coordinates and
coordinate ranges are checked rather than silently hiding invalid records.
The native component uses Apple Maps by default on iOS and the library default
on Android; a separate web component preserves list/details without native imports.
No synthetic attendance, ratings or distances remain in discovery. Missing
attributes show Not recorded. Location is requested only by button, stays in
component memory, and denial/error leaves the manual catalog available.

Verification:

- npm.cmd run verify: docs (28 Markdown), TypeScript and lint pass.
- npm.cmd run test:client: 40 tests pass. New tests cover invalid/null/duplicate
  coordinates, zero coordinates, accent-insensitive filtering, empty results,
  region bounds, denial without requesting coordinates, unavailable location,
  and propagating query errors instead of presenting them as an empty catalog.
- npm.cmd run db:local:sessions: 35 assertions pass, including the new loadCatalog
  reader returning three validated real rows through the local API.
  npm.cmd run db:local:verify: all three original courts/core invariants preserved.
- With .env disabled: npx.cmd expo install --check reports dependencies up to
  date; npx.cmd --yes expo-doctor passes 21/21.
- npx.cmd expo export --platform all --output-dir .harness/t06-export --max-workers 2:
  passed iOS/Android Hermes bundles and web, 39 static routes. Environment used
  EXPO_NO_DOTENV=1, EXPO_OFFLINE=1, local URL and a synthetic public-key placeholder.
  Existing match/[id] route and transitive dynamic-import warnings remain. The
  previously missing court/[id] route is now implemented. No build/deploy claimed.
- Browser on an explicitly local preview at 8092: login with a disposable fixture;
  observed Palermo, Parque Rodo and Parque Rodo Court (the latter with its stored
  accent), three results. Searching rodo returned both accented/unaccented names;
  an unmatched term returned zero results and its empty-state message. Palermo
  opened its stored coordinates, full-court flag and concrete surface, with
  lighting Not recorded. An unknown court URL showed Court not found. Logout
  returned to signin. Fixture accounts were removed; temporary tab/preview stopped.
  Existing preview on 8090 and user accounts were preserved.

Limits: native map rendering, marker taps, actual iPhone permission denial/grant,
map/list visual agreement and manual panning are NOT yet observed. Empty-catalog
and network-error behavior have reader tests/rendered branches, not browser fault
injection. Standalone Android key configuration and a full web map remain outside
this step. Existing npm audit still reports 26 findings (2 low, 17 moderate, 7 high).
No remote writes, migrations, Edge Function changes or deployment. T06 remains
in_progress; T07 waits for native acceptance.

Owner reproduction: restart the local device preview after installing the map
package, sign in on Expo Go 57, check all three markers/list entries, tap a marker
and a list item to compare details, search rodo, deny Use my location and verify
manual browsing, then allow foreground location and check recentering. Report any
blank map, mismatch, crash or unusable permission state before closing T06.

## 2026-09-23 - T05 local account isolation

Environment: Windows, existing Expo SDK 57 installation, local Supabase 55431.
Initial harness status identified T05 as available; initial verify passed. Existing
uncommitted work was preserved. R07 was clarified before implementation. See
[ADR 0007](../../docs/decisions/0007-account-scoped-state.md).

Implementation: an identity-keyed provider below AuthProvider creates an isolated
QueryClient and remounts personal UI state on identity changes. Disposal cancels
and clears the previous cache. Same-user token refresh preserves the identity
boundary. Profile/team query keys capture the owner and do not run signed out.
Profile mutation callbacks invalidate their originating cache. Notifications use
backend/owner keys; stopped stores ignore callbacks, hydration does not write an
empty list, and ordered writes survive fast return to the same owner. Legacy
unowned notifications are retained on disk but never imported. Removed the map's
automatic sample notification producer and a personal-team console log.
The My Courts read hook filters membership by owner and consumes cancellation;
its final presentation and join/leave controls are intentionally T07.

Reproduction and observed results:

1. npm.cmd run test:client: 34 pass. New tests exercise real QueryClient
   cancellation/late resolution and fresh account caches, notification A/B/A
   history, delayed hydration after teardown, signed-out writes, serialized
   persistence and return to A while an earlier A write is pending.
2. npm.cmd run db:local:sessions: 34 assertions pass. Two disposable accounts
   join different existing courts using ordinary authenticated API requests.
   loadMyCourts returns only each owner's membership; B requesting A's owner ID
   receives no rows under RLS. Logging A out/back in preserves A's membership.
   Existing Auth/consent tests also pass; fixtures are cleaned by the suite.
3. npm.cmd run db:local:verify: preserved three courts, 21 core columns, public
   catalog API, signup trigger, coordinates and membership invariants pass.
4. Browser smoke on a separate local preview at port 8092 with .env disabled:
   create two synthetic confirmed local accounts, sign in A, visit Profile,
   observe A's name, logout; sign in B, visit Profile, observe a neutral loading
   placeholder then B's name, logout; return to A and observe A's name. Each
   logout returned to /signin. No prior account name or generated notification
   badge appeared in the observed snapshots. Final logout completed. Browser
   accounts were deleted through local Admin Auth; test preview/tab stopped.
   The existing server on 8090 was preserved after the launcher reported a port
   conflict. The temporary preview used explicit local URL and keys internally.
5. Final npm.cmd run verify: documentation (27 Markdown files), TypeScript and
   lint pass. No harness or Edge Function code changed; their separate suites
   were not rerun. Existing missing court/match route warnings remain.

T05 is done for its local scope. The browser checks do not prove every rendered
frame; cache/race regression tests provide the complementary deterministic
coverage. Notification persistence tests use an async adapter, not a new iPhone
storage test. Native A/B switching remains part of T08 device verification.
My Courts has API/helper coverage but no membership UI acceptance yet. No remote
writes, migrations, deployments or user-account deletion. Next task: T06.

## 2026-09-23 - T04 owner acceptance after consent correction

The owner replied to the requested iPhone retest: tested with a new account and
signed out. This is recorded as completion of that requested manual flow with no
new failure reported, not as an independent observation of every screen or of the
underlying consent row. The requested environment was local Supabase with Expo
Go SDK 57; the endpoint and app version were not re-inspected during this report.

Reproduction: start local Supabase and the device preview as described in
[the local guide](../../local-backend/README.md), complete Privacy & Terms and
signup using a new synthetic account, then sign out. The earlier owner report
also covers retained authentication after closing/reopening on web and iPhone.
Combine these manual reports with the preceding browser/database evidence and
29 client / 27 local Auth assertions covering refresh, revocation, confirmation,
profile setup, pending-consent ownership and retry. T04 is marked done for local
acceptance. T05 is the next planned implementation task.

Limits: this report does not prove the exact iOS force-quit sequence, native
failure injection or hosted email/backend behavior. The original generic warning
was not reproduced; its cause remains unknown even though recovery was fixed.
No new runtime tests or remote changes were performed for this documentation-only
update. Final npm.cmd run verify passed documentation, TypeScript and lint.
Historical entries retain their original statuses and limitations.

## 2026-09-23 - Consent recovery and ownership regression

Environment: existing SDK 57 installation, Windows, local Supabase API 55431 and
browser preview 8090 via db:local:web (EXPO_NO_DOTENV=1). Initial verify passed.
The initial direct API upsert and a complete browser consent/signup both passed
on the original implementation. Therefore the reported generic warning's root
cause was not reproduced and is not claimed fixed by a schema/permission change.

Source inspection confirmed a separate recoverability defect: signup caught all
consent write/parse failures, logged only a generic error, then navigated away.
Changed R04 and T04 acceptance before implementation. The new consent helper
validates the draft before signup, consumes it into a backend/email-scoped pending
record before Auth events, and writes it after getUser validates the session.
Hydration retries use the authenticated user's ID/email and the original accepted
timestamp. Failed writes/cleanup keep pending data; the existing AuthGate overlay
blocks discovery and offers Retry/Sign out with a safe consent-specific message.
No backend payload or credentials appear in that message. Different accounts and
backends cannot consume that record. Legacy unbound drafts are used only during
an explicit signup, not retroactively attributed during an existing-user login.

Verification:

- Initial/final npm.cmd run verify: documentation, TypeScript and lint pass.
- npm.cmd run test:client: 29 tests pass. New cases cover write failure followed
  by retry, scoped restoration, malformed drafts, storage cleanup failure,
  concurrent replacement retention and AuthGate destination blocking/recovery.
- npm.cmd run db:local:sessions: 27 assertions pass. The actual helper persists
  both consent versions, clears pending storage, repeats idempotently, works with
  a confirmed account login and rejects another account's consent overwrite.
  Fixtures are removed by the suite; no pre-existing accounts are removed.
- npm.cmd run db:local:verify: three original courts, core columns, catalog API
  and membership invariants pass.
- Browser: navigate /consent, check both boxes for a synthetic local fixture,
  Continue, fill signup with synthetic credentials and submit. Both before and
  after the change, /map appeared without the reported warning. Read-only SQL
  confirmed both fixture consent records with tos/privacy version 1.0.0. After
  the change, Profile -> Logout returned to /signin. UI failure/retry behavior
  is covered by helper/controller tests, not browser fault injection.

Limitations: iPhone was not retested for this correction; exact original error
and iOS force-quit sequence remain unknown. T04 is still in progress. No remote
writes, new migration, Edge Function change or deployment. The existing sample
map and notifications remain T05/T06 work. Only the two explicitly created
browser fixture accounts are cleaned up; user-created test accounts are retained.

## 2026-09-23 - Owner-reported SDK 57 session test and consent issue

Source: owner report in this task and supplied screenshot, reviewed directly.
Requested test environment was the local preview on web and iPhone Expo Go 57;
the actual backend endpoint was not independently inspected during this report.
The owner reports: sign in on web, close the tab, open a new tab, observe the
session still active, then log out successfully; the same result on iPhone.
Treat this as user-observed sign-in/persistence/logout evidence, not agent-driven
interaction. Exact iOS force-quit versus backgrounding was not specified.

The screenshot shows the court-discovery shell and the error
`Unable to sync pending consent.` Source inspection finds this message in
app/(auth)/signup.tsx: syncPendingConsent reads pendingConsent from AsyncStorage,
upserts user_consents and logs this generic message on either a database error
or an exception. It retains the pending value on failure and registration can
continue. The screenshot does not reveal the underlying error, so permissions,
network and malformed data are not confirmed causes. Do not suppress the message
or mark consent synchronization successful. T04 remains in progress pending a
local reproduction, correction and onboarding retest.

The displayed Golden Gate Park Court, Mission Rec Center and Dolores Park Courts
are hard-coded sample rows in app/(tabs)/map.tsx. Real map/catalog integration
remains T06; this screenshot is not evidence of reading the preserved courts.

Initial and final `npm.cmd run verify`: passed documentation, TypeScript and lint.
Only evidence/status documentation changed in this update. No new functional
checks, remote operations, deployments or test-account cleanup were performed.

## 2026-09-23 — T09, SDK 57 and local iPhone readiness

Environment: Windows/PowerShell, Node 24.16.0, npm 11.13.0, Docker Desktop;
Expo 57.0.24, React Native 0.86.3, React 19.2.3 and TypeScript 6.0.3.
The owner authorized upgrading for iPhone Expo Go 57.0.9 (supported SDK 57).
Existing uncommitted work was preserved. See [ADR 0006](../../docs/decisions/0006-expo-sdk57.md).

Changes: aligned SDK dependencies and config, adapted public React Native APIs
and compiler/lint requirements, replaced the private Text.render patch with
AppText, and isolated Supabase CLI 2.99.0 under local-backend/tools to avoid
shipping its incompatible React dependency in the mobile dependency tree.
Added a private-address-only LAN launcher and address-selection regression tests.

Reproduction and results:

- `npm.cmd ci --no-audit --no-fund`: passed using the updated root lockfile.
  Tooling was installed with `npm.cmd install --prefix local-backend/tools`;
  its committed lockfile supports subsequent `npm.cmd ci --prefix local-backend/tools`.
- With `EXPO_NO_DOTENV=1`, `npx.cmd expo install --check`: dependencies up to date.
  `npx.cmd --yes expo-doctor`: 21/21 checks passed after the clean root install.
- `npm.cmd run verify`: documentation, TypeScript and lint passed.
  `npm.cmd run test:client`: 23 passed; `npm.cmd run test:harness`: 11 passed.
- Export used EXPO_NO_DOTENV=1, EXPO_OFFLINE=1, EXPO_PUBLIC_PROVIDER=supabase,
  EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:55431 and a synthetic publishable-key
  placeholder, not hosted credentials. Command: `npx.cmd expo export --platform all --output-dir .harness/sdk57-export --max-workers 2`.
  Passed: iOS/Android Hermes bundles, web bundle and 38 static routes.
  Existing missing court/[id] and match/[id] route warnings remain, along with
  transitive dynamic-require warnings. Export is not a native build or device test.
- `npm.cmd run db:local:start`: first attempt failed with local schema-cache
  startup timeouts during concurrent compilation. Retried after compilation:
  passed without resetting the database. `npm.cmd run db:local:sessions`:
  22 assertions passed with temporary local identities cleaned by the suite.
  `npm.cmd run db:local:verify`: passed, including all three preserved courts.
- `npm.cmd run db:local:device`: selected the Wi-Fi private IPv4 address,
  passed its Auth health preflight on port 55431 and started Metro on port 8090.
  GET to the LAN Metro root with expo-platform=ios and accept=application/expo+json
  returned an iOS manifest declaring sdkVersion 57.0.0 and a launch asset URL.
  No key or manifest contents were logged. See the [device procedure](../../local-backend/README.md).
- `npm audit`: 26 findings remain (2 low, 17 moderate, 7 high, 0 critical).
  A compatible shell-quote patch removed the critical finding; no forced broad
  audit fix was applied. The isolated CLI install reported zero findings.

T09 is complete. T04 remains in progress: no physical iPhone interaction was
observed, and the earlier browser journey is SDK 54 evidence, not a new SDK 57
browser UI certification. Phone login, profile setup, background/resume,
force-close/reopen and logout remain to be checked by the owner. Expo Go 57
requires the same Expo account in the CLI and phone. No remote SQL, remote Auth
writes, deployment, root .env edits or firewall changes were performed.
Edge Functions were unchanged; verify:edge was not rerun.

## Scope revision — 2026-09-19

The current acceptance journey is account → court discovery → persistent court community membership. Team creation and team joining are deferred. A08/A09 below replace the previous, unexecuted team scenarios. Historical T00/T01 evidence remains unchanged and is not proof of the new functional requirements. No native map, membership migration or remote change was implemented during this revision.

## Alcance de esta evidencia
Documentation/static checks are distinct from product acceptance. T01 establishes
the client baseline; T02 establishes the local data-contract portion of A02
from owner-supplied remote exports. T03 now provides local A03 API authorization
evidence. No hosted writes or mobile-device checks were performed. Hosted A03 and
A04–A10 remain unaccepted. The dated entries distinguish local SQL/API
tests, earlier remote read-only probes, source evidence and unverified behavior.

## Entorno inicial
Windows/PowerShell, Node.js 24.16.0, npm 11.13.0. Dependencias ya instaladas. Deno y Supabase CLI no encontrados en PATH. Fuente: inspección local durante la recuperación del 2026-09-17 (Uruguay).

## Escenarios de aceptación pendientes

### A01 — R01: controles
Desde una instalación reproducible, ejecutar `npm run verify`; esperar documentación, tipos y lint del cliente sin errores. Para Edge Functions afectadas, ejecutar `npm run verify:edge`. Registrar versiones y avisos. No confundir este escenario con una compilación móvil.

Para el arranque local, ejecutar `npm start -- --offline` y comprobar que Metro queda esperando conexiones sin `ExpoMetroConfig.loadAsync is not a function` ni solicitud de instalar `@types/react-native`. Ejecutar `npx expo install --check` para contrastar dependencias; si solo se puede verificar sin red, registrar ese límite. Detener el servidor al terminar. Este control no demuestra que la aplicación compile ni funcione en dispositivo.

T01 regression acceptance: `npm run test:client` imports the real profanity utility and checks clean text, case-insensitive detection, masking and the combined validation result. Type/lint checks must accept court search results with id/name only and resolve every collapsible import. No new lint exclusions or dependency installations are required. Device-level court selection and collapsible interaction are not covered by these static checks.

### A02 — R02: base reproducible
En base desechable, preparar esquema siguiendo el procedimiento documentado; comprobar columnas, restricciones, triggers y políticas esperadas. Comparar con el contrato canónico. Registrar comandos/versión de migraciones sin exportar datos personales.

### A03 — R03: autorización
As A, update an allowed field of A's profile: allowed. Attempt to change app_role, modify B's profile/membership or write the curated court catalog directly: denied or unchanged, verified by a subsequent read. Repeat protected mutations without a session. Do not use service-role credentials as the identity under test.

Also verify profile insertion/upsert/deletion, ID/timestamp/statistic changes,
signup role metadata, membership visibility, timestamp spoofing, nonexistent
courts, duplicate/concurrent joins and leave/rejoin. Create two local Auth users
with a public key; use their real session tokens for protected API calls. Clean
up only the test identities, even on failure. Preserve all three court records.

### A04 — R04: registro y acceso
Crear A con credenciales de prueba. Probar respuesta con sesión inmediata y sin sesión por confirmación de correo; no duplicar cuenta ni entrar a perfil sin sesión. Completar verificación según entorno elegido. Probar contraseña incorrecta y reintento válido.

### A05 — R05: perfil
Con sesión y perfil incompleto, completar nombre sin avatar. Entrar a la app y leer el mismo nombre tras recargar. No volver al registro. Validación rechaza nombre inválido y permite corregirlo.

### A06 — R06: sesión
Cerrar el proceso de la app y abrirlo de nuevo: conservar una sesión válida. Probar renovación y sesión revocada en entorno de prueba: volver al acceso sin bucles. Cerrar sesión y reabrir: no quedar autenticado.

T04 adds controller regression tests for cold restore, confirmation-required
signup, invalid credentials, stale profile responses, transient profile failures,
logout failure and invalid sessions. Local integration uses real Supabase Auth
and a reused in-memory async storage adapter to exercise client recreation,
refresh and revocation. These
automated checks do not replace the native force-close/reopen and manual email
confirmation-return checks; record device/platform evidence separately.

### A07 — R07: dos cuentas en el mismo dispositivo
Load profile/My Courts as A, log out and sign in as B. Check the first render and slow-network states: A's private profile, personal court list and notifications never appear as B's data. Intentionally public community information is separate from account-owned data.

### A08 — R08: court discovery
On the chosen native platform, show the same verified courts in the map/list and open details by selecting a marker or list item. Check location accuracy, empty/error states and permission denial. Manual browsing/list remains usable without location. Record provider, library version, build configuration and test device. A browser preview alone does not satisfy this scenario.

### A09 — R09: persistent community membership
A and B independently join the same court without teams. Retry/double-tap: one membership per user/court. Restart: My Courts and membership state persist. Leave, repeat leaving, then rejoin: state remains consistent with no duplicates. A cannot add/remove B's membership or join a nonexistent court. Global roles remain unchanged. No schedule, automatic expiry or physical-presence claim is introduced. If the proposed multiple-court default is adopted, join two courts and verify leaving one preserves the other.

### A10 — R10: errores y funciones provisionales
Interrupt the network while saving a profile, joining and leaving a court. Expect actionable errors, safe retry and reconciliation of optimistic state rather than false success. Verify discovery error/retry behavior. No simulated notifications or fixed fake invitations appear as real events, and any membership counts are not labeled as people currently playing.

## Registro de ejecución

### 2026-09-22 - T04 implemented; browser acceptance recorded

Environment: Windows/PowerShell, Node 24.16.0, npm 11.13.0, Expo 54.0.37,
React Native 0.81.5, Supabase CLI 2.99.0; local PostgreSQL 17.6/PostGIS 3.3.7.
Browser: Codex in-app Chromium at localhost:8090. Owner confirmed browser-only
access. No hosted writes, deployment or root .env changes; prior T03 work retained.

Initial harness:status identified T04 after completed T03; initial verify passed.
Requirements were refined before implementation; see
[ADR 0005](../../docs/decisions/0005-auth-session-lifecycle.md).

Reproducible checks and results:

1. `npm.cmd run verify`: docs, client TypeScript and lint pass.
2. `npm.cmd run test:client`: 20 pass, including 11 production auth-controller
   regressions for cold restore, incomplete profiles, no-session signup, retry,
   invalid sessions, logout failures and obsolete async responses.
3. `npm.cmd run test:harness`: 11 pass, also executed while preview was active.
4. `npm.cmd run db:local:start` then `npm.cmd run db:local:sessions`: 22 real
   local Auth assertions pass. Includes trigger-created profile saved without
   avatar, fresh-client restoration, expired-session refresh, revoked refresh,
   logout, invalid-password retry and unconfirmed-account verification. Test
   identities are cleaned in finally. Admin key only prepares local fixtures.
5. `npm.cmd run db:local:verify`: three original courts and fields preserved;
   schema, public catalog API and rollback invariants pass.
6. `npm.cmd run db:local:web`: serves Expo with local URL/public key and dotenv
   disabled for the process. The local public key is not written to a file.

Browser observations:

- Created a synthetic account at /signup with valid matching passwords: /map.
- Blanked only that fixture's display_name in local psql; reloaded /map and
  reached /profile-setup. A one-character name showed an inline error. A valid
  name saved without avatar and reached /map without an onboarding loop.
- Reloaded, opened Profile and saw the persisted name. Logout plus reload stayed
  on /signin. Wrong password displayed "Invalid login credentials"; retry with
  the correct password reached /map.
- Temporarily set only local [auth.email].enable_confirmations=true and local
  auth.site_url=http://localhost:8090/signin; stopped/started bballuy-local.
  Signup showed "Check your email" and did not enter a session-only screen.
  Opened its actual Mailpit email at http://127.0.0.1:55434 and followed the
  confirmation link. Returned to the original tab, chose Go to sign in and
  logged in: /map and correct profile name. No duplicate signup. A resumed run
  used a fresh fixture because the first email had expired during interruption.
  No external mailbox or hosted Auth settings were used.

Corrections found through verification: inline errors replace native-only form
alerts; Metro excludes generated .harness fixtures/worktree after fixture cleanup
caused ENOENT; the local preview uses EXPO_OFFLINE rather than incompatible CLI
--offline/--localhost flags. Existing missing court/[id]/match/[id] declarations,
shadow-style and dependency dynamic-import warnings remain; no native build is
certified. Demo courts and simulated notifications remain for T06/T08.

Limits: SDK persistence uses a reused in-memory async adapter, not a killed
process. Native storage, force-close/reopen, foreground/background refresh and
native email links remain unverified. Hosted email delivery, optional avatar
uploads and historical consent/legal screens are not certified. Browser signup
started at /signup. Shared personal caches/notifications remain T05; no full
account-isolation claim. No Edge Functions changed; Deno checks were not rerun.

Cleanup: removed the three exact browser fixture accounts/profiles; count zero.
Final db:local:verify preserved all three courts. Restored config.toml byte-for-
byte, stopped the preview and ran db:local:stop. Existing local data retained.

T04 stays **in_progress** pending device lifecycle evidence. Next action is to
complete those checks; T05 then isolates personal data and My Courts by account.

### 2026-09-21 — T03 local core permissions accepted

The owner reports an empty hosted Edge Functions list. Historical handlers remain
undeployed and unchanged; no secret migration or gateway change is needed for
them based on that report. External integrations were not independently audited.

Implemented [ADR 0004](../../docs/decisions/0004-core-permission-boundary.md) in
local migration 20260921000100_core_permissions.sql. Revoked table and column
ACLs, then granted only owner profile field updates, read-only court/catalog
access and owner-scoped membership SELECT/INSERT/DELETE. Direct profile creation,
upsert/deletion, privileged field writes and membership timestamp/UPDATE writes
are denied. Retained existing profile read visibility; no public membership roster
is exposed. The signup trigger ignores forged role metadata and has a fixed empty
search path. The historical baseline is unchanged.

Environment: Windows/PowerShell, Node 24.16.0, project Supabase CLI 2.99.0,
PostgreSQL 17.6 and PostGIS 3.3.7 in bballuy-local. Reproduction:

1. npm.cmd run db:local:start
2. npm.cmd run db:local:reset — local-only replay succeeds.
3. npm.cmd run db:local:verify — PASS: three original courts and all their fields,
   21 original core columns, public API reads and rollback SQL invariants.
4. npm.cmd run db:local:permissions — PASS: 111 assertions through local Auth and
   PostgREST, using only a public key and two actual user sessions as HTTP callers.
   Includes anonymous denials, signup metadata, allowed profile fields, all
   protected columns, direct insert/upsert/delete, cross-account mutations,
   read-only tables/view, private memberships, forged owner/timestamp, invalid
   court, duplicate/concurrent joins, multiple courts, repeated leave/rejoin and
   a broad DELETE predicate constrained by RLS. Subsequent reads verify state.
   SQL confirms preserved court data and absence of team dependencies. Fixtures
   are removed in finally; zero remaining fixture Auth/profile/membership rows
   are asserted. HTTP requests cannot select a hosted target and log no tokens.
5. npm.cmd run db:local:verify — PASS after permission scenarios.
6. npm.cmd run db:local:types — generated output has no diff from the existing
   types; the permission migration changes no exposed row shapes.
7. npm.cmd run verify — documentation, client types and lint PASS.
   npm.cmd run test:harness: 11 PASS. npm.cmd run test:client: 9 PASS.
   Targeted ESLint passes scripts/local-backend.mjs and the authorization suite.
8. npm.cmd run db:local:stop — PASS; local services stopped and data retained.
   Final npm.cmd run verify passes after task/evidence updates. harness:status
   reports T03 done and T04 available. No Edge Function source changed.

The first authorization run failed because its anonymous unfiltered DELETE did
not return the expected authorization status. The suite now uses an explicit
identity filter for that permission check and separately verifies RLS with a
broad non-null predicate. It retains strict 401/403 expectations for denials;
no migration permissions were relaxed to make the suite pass. Cleanup also ran
on the failed attempt, and the completed suite verifies cleanup explicitly.

T03 is complete for the disposable local boundary. Hosted permissions, Storage,
historical tables outside the core boundary and the mobile journey are not
certified. No remote migration, court edit, user cleanup or deployment occurred.
The next implementation task is T04: registration, minimal profile and sessions.

### 2026-09-21 — Legacy-key dependency preflight

Reviewed all five local Edge Functions and searched app, components, lib, hooks
and contexts for direct function calls and names. No direct client calls were
found. Three handlers read SUPABASE_SERVICE_ROLE_KEY; issue-signed-url reads
SUPABASE_ANON_KEY; approx-locate has no key dependency. Compared referenced
tables/columns with the preserved dependency snapshot and recorded discrepancies
and migration acceptance in the [runbook](../../docs/supabase-key-migration.md).

The preceding publishable-key probe returned HTTP 200 from /auth/v1/settings
and /rest/v1/courts?select=id&limit=4, with three rows. No credentials or row data
were logged. Legacy deactivation is owner-reported, not independently tested.
The deployed function inventory and external callers remain unknown; no live
function was invoked, migrated or deployed. No permission task is marked done.

Windows/PowerShell: npm.cmd run verify passes documentation, client TypeScript
and lint. Deno is absent from PATH. No Edge source or harness code changed, so
this preflight does not claim Edge typechecking or functional acceptance.

### 2026-09-21 — Restore the local Expo installation

The user reported that `npx expo start --clear` offered to install Expo 57.
Inspection found no locally resolvable Expo package or CLI shim, while the project
and lockfile require Expo 54. Restored dependencies with
`npm.cmd ci --no-audit --no-fund`; installed Expo is 54.0.37. No SDK upgrade or
manifest/lockfile change was needed. npm reported dependency deprecation notices;
this restore was not a dependency security audit.

The ignored local environment file used NEXT_PUBLIC_SUPABASE_URL and
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, which the Expo client does not read.
Renamed those entries to EXPO_PUBLIC_SUPABASE_URL and
EXPO_PUBLIC_SUPABASE_ANON_KEY, preserving their values without logging them.
EXPO_PUBLIC_PROVIDER remains unchanged.

`npm.cmd run verify` passes documentation, client types and lint. A subsequent
`npm.cmd start -- --clear --offline --port 8089` loads the expected environment
variable names and reaches Metro's waiting state. Stopped the test server after
verification. This proves local CLI startup only: no native build, authenticated
Supabase request, remote key revocation or full app journey was tested.

### 2026-09-21 — Documentation access from mobile

Prepared a documentation-only publication on codex/docs-mobile-access, with a
mobile reading guide, a dated summary of current issues and clearer local versus
published-code boundaries. No implementation task state changed. The development
working copy retains its application changes; hosted data and schema are untouched.

Windows/PowerShell, existing Node/npm environment: `npm.cmd run harness:status`
reports T00–T02 done and T03 available. `npm.cmd run verify` passes documentation,
client types and lint. No harness or Edge Function code changed. Database and
device acceptance were not rerun for this documentation-only update.

The publication is assembled in a separate Git worktree with an explicit file
list. It includes Markdown guides, specification JSON, reviewed schema evidence,
read-only inventory SQL and the placeholder environment example. Application
changes, runtime credentials and local verification logs are excluded. A scan of
the selected files found no common token/private-key/credentialed database-URL
patterns; this is a bounded check, not a general secret-detection guarantee.

Relative Markdown file links are checked against the publication itself. The
one link to an unpublished client test is rendered as a code-path reference in
that snapshot. Task evidence paths and executable commands still describe the
development working copy; this documentation branch is not a runnable T02 release.

Publication validation: all 115 relative Markdown file links resolve in the
32-file snapshot. Git created the local documentation commit, but GitHub rejected
the push with HTTP 403: the connected account lacks write access to the existing
repository. A noninteractive attempt with the repository owner's username found
no usable stored credential. No successful upload or phone-accessible branch is
claimed. Resolving account access is required before retrying the same branch;
repository visibility and global credential configuration were not changed.

### 2026-09-19–20 — T02 local reconstruction, typed client and repeatable checks

Received and reviewed the second CSV as
[dependency evidence](../../supabase/snapshots/2026-09-19-dependencies.json), with
source hash and boundaries in the [snapshot notes](../../supabase/snapshots/README.md).
It supplies 15 public tables, one view, 12 app routines, enum labels and three
court records. No public relation implements persistent court membership. Both
games and matches exist; no remote migration history table was reported.

Implemented [ADR 0003](../../docs/decisions/0003-inspected-local-baseline.md).
The local-only baseline reconstructs the reviewed public objects/auth trigger;
the next migration adds court_memberships and court_catalog. The historical root
migrations/seed remain untouched. No remote SQL, user cleanup or court mutation
was performed. Court IDs, raw geography, attributes and timestamps are preserved.

Reproduction from the repository root, using the commands documented in
[local-backend](../../local-backend/README.md):

1. Installed a project-scoped CLI and initialized an unlinked workspace. Initial
   replay used CLI 2.117.0. Final pinned/verified CLI is 2.99.0; the config uses its
   inbucket section. Runtime: PostgreSQL 17.6 and PostGIS 3.3.7, matching the export.
2. `npm.cmd run db:local:start`: local services started from migrations and seed.
   Only the BBallUY project/network/volumes were created or operated on. CLI output
   containing generated local credentials was not exposed; the initial captured
   startup log was replaced with a credential-free summary.
3. `npm.cmd run db:local:verify`: PASS. Compares all three courts with the source,
   including geographic bytes and timestamp microseconds; checks all 21 original
   core column names/types/nullability; exercises the actual signup trigger and
   membership uniqueness/FKs/server timestamp/leave/rejoin/multiple-court
   independence without teams. Fixtures run in a rollback transaction.
4. The same verifier uses only the local public key to read court search and
   court_catalog via PostgREST. All three IDs/names and projected coordinate pairs,
   lighting and half_court values agree with the export. Membership API writes
   remain denied by grants while T03 policies are pending.
5. `npm.cmd run db:local:types` generates database.types.ts from the running local
   database. The client uses Database/Tables types; compilation identified the
   nonexistent courts.address query and an overly wide invite-role type. Fixed
   those, the achievement primary-key selection, and profile assumptions about
   bio/wins/rank. No new any, lint exclusion or type suppression was introduced.
6. With pinned CLI 2.99.0, repeated `db:local:reset`, `db:local:verify` and
   `db:local:types`: PASS. The generated type file's SHA-256 is unchanged by clean
   replay. Only the disposable local database was reset; no hosted link exists.

Local tooling observations: the first type-generation attempt omitted the custom
Docker network and failed; fixed by passing --network-id for every CLI operation.
Docker Desktop reports 0.0.0.0 / :: published ports despite the requested loopback
network option with both tested CLI versions. The wrapper reports this actual
limit, the workflow requires a trusted development network and shutdown after
tests, and the completion run stops bballuy-local. No host firewall, Docker daemon
configuration or unrelated containers were modified.

T02's reproducible data contract is complete. Source provenance and preservation
are verified against the owner-supplied catalog; this is not independent field
verification of court locations or duplicate resolution. T06 must review those
map/catalog questions. A03 permissions, mobile signup/sessions, Storage/Edge
Functions and the complete MVP journey are not accepted by these checks.

Static/client validation before final documentation: `npm.cmd run verify` passes
documentation, types and lint; `npm.cmd run test:client` passes nine tests; targeted
ESLint passes both new tooling scripts. Git diff --check still reports existing
CRLF/whitespace findings in the dirty working tree; no broad formatting cleanup
was made.

Final completion check on 2026-09-20: `npm.cmd run verify` passes documentation,
types and lint after the task/status updates; `npm.cmd run test:client` passes
all nine tests. `db:local:stop` succeeds and retains the disposable local data.
The local services are stopped. T02 is marked done; T03 authorization is next.

### 2026-09-19 — T02 first user-supplied database snapshot

Parsed the single schema_snapshot CSV cell supplied by the user, validated its
scope and counts, and preserved it in
[2026-09-19-core-schema.json](../../supabase/snapshots/2026-09-19-core-schema.json).
[Provenance](../../supabase/snapshots/README.md) records the original CSV hash
and capture timestamp. The source is user-identified as the configured project;
the export itself contains no project ID or inspection role.

Compared the 21 exported columns, constraints, policies, grants and trigger with
the initial migration, lib/backend/types.ts and hooks/profile.ts. Recorded exact
differences and evidence limits in [database context](../../docs/db-context.md).
No secrets or business rows are present in this first snapshot. No remote
requests, migrations, user cleanup or court mutations were performed this turn.

Prepared core-dependencies.sql to collect the missing definitions and existing
court catalog in a read-only transaction. It has not been run against the remote
database. T02 remains partial: no complete baseline, generated types, disposable
replay, verified court provenance or A02 acceptance is claimed.

Validation: `npm.cmd run verify` passed documentation, client types and lint.
Executed core-dependencies.sql successfully using the already installed image
`sha256:2d74f8a2591ca34f2ea0565e385325570dd618e2d07372a8bb0ba97bddd19c93`
(PostgreSQL 16.0) in a task-created container with `--rm --network none`, tmpfs
database storage and no published ports or host mounts. The synthetic fixture
contained a courts table (coords as text), one court, an enum with two labels,
a profile table, a view and a SQL helper function. Parsed the returned JSON and
asserted the scope, one court, two enum labels, one view and one function. The
container was stopped and automatically removed after the check. Existing
containers were not changed. This proves query execution on the fixture, not
PostGIS behavior, remote PostgreSQL 17.6 compatibility or a replay of the actual
Supabase schema. No remote credentials were passed to Docker.

### 2026-09-19 — T02 Docker recovered and credential diagnosis corrected

The user confirmed the keys still match and showed Docker Desktop's Images view. An authorized `docker version --format '{{.Server.Version}}'` returned 28.3.2; the restricted attempt failed with access denied. No containers were started, stopped or modified. Local credential checks printed booleans only: anon role, unexpired claim, matching project reference, no process overrides or surrounding whitespace. These checks alone do not validate a signature.

Authorized GET probes with the existing public key returned: `/rest/v1/` HTTP 401 with or without the bearer header; `/rest/v1` HTTP 401; `/auth/v1/settings` HTTP 200; `/rest/v1/courts?select=id&limit=0` HTTP 200 and an empty array. Only statuses and error categories were logged; no keys or response bodies were printed. No business rows were retrieved and no writes were sent. The zero-row request does not verify court count or row-level policies.

Supabase's [official breaking change](https://supabase.com/changelog/42949-breaking-change-removing-access-to-openapi-spec-via-the-anon-key) removes anon OpenAPI access while preserving ordinary Data API requests. This explains the endpoint-specific failure and corrects the earlier credential suspicion. Updated the inspector error guidance and workflow to require a supported inventory path. T02 remains blocked on that inventory, not on Docker or proven invalid credentials; A02 remains unaccepted.

Validation: `npm.cmd run verify` passed documentation (20 files), client types and lint; `npm.cmd run test:client` passed all nine tests; targeted ESLint for scripts/inspect-database-api.mjs exited 0. No SQL inventory, migration replay or device acceptance was executed.

### 2026-09-19 — T02 target and retention confirmation

The user confirmed the existing Supabase project remains the intended target and reported three courts that must be preserved. Test users and their court associations may be removed if they obstruct the work, but no cleanup has been demonstrated necessary or executed. Updated the runbook, status and blocked reason. This is user-provided context, not a verified database inventory. The previous HTTP 401 and unavailable Docker engine remain independent, unresolved observations; no new remote requests or data changes were made in this update.

### 2026-09-19 — T02 inspection preparation, not acceptance

T01 was already complete when this turn started. Entry `npm run verify` passed documentation, client types and lint. Prepared scripts/inspect-database-api.mjs and supabase/inspection/public-schema.sql, plus the database reconciliation runbook. No database schema, generated types or data migration was invented from the unverified historical snapshot.

`npm run test:client`: nine tests passed, including five inspector cases for public-only credentials, safe endpoints, metadata-only output and invalid-response rejection. Tests are local and do not make network requests.

`npm run db:inspect:api`: restricted execution returned EACCES. The authorized network retry reached the configured endpoint and received HTTP 401; no API schema snapshot was produced. The script did not fall back to the available service-role credential and did not read business rows or send writes.

Docker's first restricted check could not access its configuration/engine. The authorized read-only version check also failed because the Docker Desktop Linux engine pipe was unavailable. No containers were started. Supabase CLI was not available in PATH. The SQL inventory query has not been executed against a real database, so its database behavior is not certified.

T02 remains blocked pending identification/access to the intended development schema and a runnable disposable backend. API inspection alone would not establish RLS, grants or complete database types even if successful. A02 is not accepted; no new device or functional acceptance scenarios were executed.

### 2026-09-19 — T01 completion: client checks and regression baseline

Environment: Windows/PowerShell, Node 24.16.0, npm 11.13.0; existing installed dependencies, Expo 54.0.37 / React Native 0.81.5. No reinstall or new dependency. Preserved the user's existing tracked and untracked work, including deleted legacy theme hooks. Used `npm.cmd` because PowerShell blocks `npm.ps1`. Git inspection used a command-scoped `-c safe.directory=C:/Users/user/Documents/code/mobileApps/bball/client-bballuy` due to sandbox ownership; no global Git configuration was changed.

Initial `npm.cmd run harness:status`: T00 done, T01 in progress, remaining tasks waiting on dependencies. Initial `npm.cmd run verify`: docs passed; client TypeScript failed with 6 errors; lint failed with 4 errors and 4 warnings, matching the prior baseline.

Changes for R01/T01:

- Court search now derives its result type from `searchCourts` and displays the available id/name data without an unsupported address. Backend queries were not changed.
- Collapsible imports now resolve to React Native primitives and the existing palette. It retains initially closed/toggle state and exposes its expanded accessibility state. No active call sites were found by `rg -n 'Collapsible' app components` outside its definition; no device interaction is claimed.
- The profanity utility imports the actual named `Filter` export. [Regression tests](../../tests/profanity.test.cjs) exercise ordinary text, word boundaries, case-insensitive detection, masking and combined validation with the installed library.
- Removed two unused declarations, added the router effect dependency and moved the notification save helper into its effect. No lint suppression or broader exclusion was added. Notification startup read/write ordering and account-scoped storage remain later work, not verified fixes.

Reproduction and observed results:

1. `npm.cmd run verify`: exit 0; documentation (19 Markdown files, one specification), TypeScript and lint all pass; zero client errors/warnings.
2. `npm.cmd run test:client`: exit 0; 4 tests pass, 0 fail. Uses Node 24 native TypeScript loading; no backend or credentials. The strategy and future integration/device boundaries are recorded in [development](../../docs/development.md).
3. `$env:EXPO_NO_DOTENV='1'; $env:EXPO_OFFLINE='1'; npx.cmd expo install --check`: exit 0, `Dependencies are up to date`, alongside Expo's warning that validation is unreliable offline. This checks the installed catalog only. `npm.cmd ls @types/react-native --depth=0` reports `(empty)` with exit 1, the expected absence of that package.
4. In a separate shell: `$env:EXPO_NO_DOTENV='1'; $env:CI='1'; npm.cmd start -- --offline --port 8087`. Observed `Starting Metro Bundler` and `Waiting on http://localhost:8087`, with no global CLI failure or types installation. `Invoke-WebRequest -UseBasicParsing http://localhost:8087/status` returned UTF-8 `packager-status:running`. Ctrl+C did not stop the CI process; identified its listener with `netstat -ano -p tcp`, then stopped that process tree with `taskkill /PID <observed-pid> /T /F` using elevated cleanup after sandbox access denial.
5. Final `npm.cmd run verify` passed again after documentation/task updates. `npm.cmd run harness:status` reports T01 done and T02 available by dependencies. Auxiliary `git diff --check` reports whitespace/CRLF findings across the existing dirty working tree; no repository-wide formatting cleanup was attempted. This is separate from the passing client lint check.

T01 is complete using this evidence and the preserved 2026-09-18 CLI/dependency evidence. A01's local client checks pass on the existing installation; a clean-install/native-build acceptance is not claimed. R01's server verification limitation remains: no Edge Functions changed and `verify:edge` was not rerun; the last recorded result is missing Deno. Harness scripts were not changed. No device/emulator, native bundle/build, two-account flow or A02–A10 scenario was executed. Previously reported dependency vulnerabilities were not reassessed. No remote database was accessed or modified and nothing was deployed. Next available task: T02.

### 2026-09-19 — Court-first scope revision

The user confirmed that joining means persistent court community membership without a team. Updated product scope, map decision record, requirements, plan, tasks and acceptance scenarios together. Preserved T00 completion, ongoing T01 state and dated evidence below. Native map selection remains a recommendation pending integration validation.

`npm run verify`: documentation passed (19 Markdown files, one specification); client TypeScript still has 6 errors and lint still has 4 errors / 4 warnings. Overall exit code 1, with the same pre-existing findings. No application code, dependencies, cloud billing, database or Edge Functions were changed. Map/provider sources were checked on 2026-09-19 and linked in ADR 0002. No device or functional acceptance scenarios were executed.

### 2026-09-17 — T00, organización y harness

Entorno: el indicado arriba. Ejecución equivalente mediante `npm.cmd` en PowerShell. Ninguna migración, cuenta ni dato remoto modificados.

- `npm run verify`: documentación válida (18 archivos Markdown, una especificación); TypeScript de cliente con 6 errores; lint de cliente con 4 errores y 4 advertencias. Código global 1. El control de lint se ejecutó aunque tipos falló. Resultado estructurado en `.harness/verify.json` al ejecutar, no versionado.
- `npm run test:harness`: 11 pruebas aprobadas. Cubren caso válido, enlace roto, requisito sin tarea, ciclos, cierre sin evidencia/dependencias, evidencia externa/temporal, especificación verificada prematuramente, continuidad tras fallo y status sin mutación. Fixtures desechables; no usan Supabase ni credenciales.
- `npm run verify:edge`: código 1 por `deno ENOENT`; no se pudo comprobar el servidor porque Deno no está instalado. No es evidencia de que las funciones tengan tipos correctos.
- `npm run harness:status`: registro y tareas legibles; no inicia trabajo ni marca tareas automáticamente.
- Dependencias declaradas de `package.json` y raíz de `package-lock.json`: coinciden. No se instaló ni actualizó ningún paquete en esta tarea.

T00 respalda la organización y el funcionamiento del verificador. **R01 y A01 no están completos:** quedan los fallos del cliente, la verificación Deno y el establecimiento de pruebas apropiadas. A02–A10 no se ejecutaron. T01 es el siguiente trabajo para recuperar controles del cliente.

Los errores del cliente son los ya identificados en B03; no se arreglaron ni silenciaron durante documentación. La separación de entornos explica la reducción de conteos frente a los comandos amplios históricos.

### 2026-09-18 — T01 parcial, CLI local y dependencias de SDK 54

Entorno: Windows/PowerShell, Node.js 24.16.0, npm 11.13.0. Se conservaron los cambios existentes. Alcance: corregir el arranque reportado con `expo-cli` global y alinear dependencias, sin cambios de pantallas ni backend.

- El stack reportado apunta a `expo-cli` global. El script `start` existente ya ejecuta el binario local de Expo; se documentó usar `npm start` / `npx expo start` y sus variantes `.cmd` para PowerShell.
- `npm.cmd uninstall --save-dev @types/react-native --offline --ignore-scripts --no-audit --no-fund`: código 0. Se retiró el paquete agregado por el CLI antiguo; React Native incluye sus tipos.
- `npx.cmd expo install --check`: la primera consulta falló por acceso de red restringido. La repetición con red disponible devolvió 22 recomendaciones para SDK 54. La comprobación offline previa solo contrastaba con el catálogo local de Expo 54.0.13 y no detectaba estas recomendaciones remotas.
- `npx.cmd expo install --fix`: código 0; Expo 54.0.13 → 54.0.37, React Native 0.81.4 → 0.81.5 y paquetes del SDK alineados. El CLI agregó los plugins `expo-font`, `expo-secure-store` y `expo-web-browser` en `app.json`. Manifiesto y raíz del lockfile coinciden en dependencias y dependencias de desarrollo.
- `npx.cmd expo install --check` después de instalar, con red disponible: código 0, `Dependencies are up to date`.
- Arranque: `$env:EXPO_NO_DOTENV='1'; $env:CI='1'; npm.cmd start -- --offline --port 8087`. Resultado: `Starting Metro Bundler` y `Waiting on http://localhost:8087`, sin el TypeError original ni instalación de tipos. GET a `/status` respondió `packager-status:running`. Servidor detenido con Ctrl+C. El primer intento combinó `--offline --localhost` y fue rechazado por opciones excluyentes; se corrigió el procedimiento documentado.
- `npm.cmd run verify`, antes y después del ajuste: documentación aprobada (18 Markdown, una especificación); permanecen 6 errores de TypeScript y 4 errores / 4 advertencias de lint. Son los mismos fallos previos de `step1`, módulos ausentes de `collapsible` y exportación de `bad-words`, más las advertencias ya registradas. El resultado global sigue siendo FAIL.
- npm informó 36 vulnerabilidades del árbol instalado (2 bajas, 16 moderadas, 17 altas, 1 crítica). No se investigó su aplicabilidad ni se ejecutó `npm audit fix`; ese análisis queda pendiente.

Límites: prueba de arranque de Metro en modo offline/CI, sin cargar `.env`, generar bundle ni probar dispositivo/emulador. No se verificó compilación nativa, comportamiento de los plugins ni A02–A10. No se modificaron Edge Functions ni harness. **T01 continúa en progreso y A01 sigue incompleto.** Siguiente tarea: corregir los fallos estáticos del cliente y repetir `npm run verify` antes de la aceptación funcional.

## Core branch readiness check - 2026-10-09

Environment: Windows / PowerShell; active branch feature/init at c6a4757;
working tree initially clean. Local master and cached origin/master at b54c821.

Commands and results:
- git merge-base --is-ancestor feature/init master: exit 1. The locally known
  master does not contain feature/init. No merge readiness is claimed for master.
- git diff --stat master feature/init: 149 files differ, including application,
  backend contracts, documentation and tests; this is not just a naming difference.
- npm run harness:status: SPEC-001 verified, all registered tasks done.
- npm run verify: passed documentation, client TypeScript and lint on feature/init.
- npm run test:client: 48 passed, zero failed on feature/init.
- git fetch origin: failed with Repository not found. Cached refs cannot certify
  the current GitHub state. Owner must refresh through GitHub Desktop and ensure
  the feature/init -> master PR is merged before creating a new branch from master.

No branch switch, merge, commit, push, application/Edge changes, database command
or deployment was performed. No fresh device/backend acceptance was executed.
