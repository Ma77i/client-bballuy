# T04 implementation and local evidence — 2026-10-14

Final approved-direction copy/action refinement and repeated checks are recorded in
[final refinement](t04-final-refinement.md). Earlier wording/captures below describe
the initial implementation; do not infer completion from that historical evidence.

Owner explicitly closed/approved T03 and authorized only T04. See t03-closure.md.
Branch SPEC-003/design; existing uncommitted T03/refinement/Router fixes preserved.
Windows/PowerShell, Node 24.16.0, Expo 57.0.24, RN 0.86.3, React 19.2.3.
T04 implementation/local functional checks ready; status in_progress pending native
acceptance. SPEC-003 not verified; T05/T06 todo. No commit/push/deployment.

## Incremental files and behavior

- app/court/[id].tsx: real catalog hero/attributes/notes/coordinates, original labelled
  local media/fallback, shared community and organizer actions, Spanish state/retry
  presentation and existing activity. Empty notes use a Boolean render guard to avoid
  an empty raw text child in RN Web; same condition for displaying meaningful notes.
- components/courts/CourtMembership.tsx + MembershipPanel.tsx: existing hook/callbacks
  drive shared accessible presentation. Same pending/error/read/confirmed priority;
  uncertain retry uses mutation.variables including false, not current joined inversion.
  No confirmation dialog or optimistic/server-state duplication added.
- app/(tabs)/my-courts.tsx: current-owner rows only, shared arcade cards, existing
  refresh/retry/empty/explore/detail paths. Busy refresh blocks duplicate activation.
- components/courts/CourtCard.tsx: essential opt-in showFacts false projection for
  membership id/name. Defaults for approved T03 full-catalog cards stay unchanged;
  no additional catalog read or invented surface/activity fields.
- app/(tabs)/profile.tsx: actual display_name, generic labelled player art, existing
  My Courts/logout/report. No avatar editing, stats or additional account fields.
- SignOutButton.tsx: arcade option for Profile only; same lock/request/error/retry/
  successful route replacement. HeaderMenu default renderer retained.
- ReportProblem.tsx: arcade Spanish copy only; validity gate, receiver-preserving
  Linking handoff, busy/failure/contact fallback and original support draft unchanged.
- components/pickup/CourtActivity.tsx: opt-in arcade Spanish heading/copy/date and
  reduced-motion-aware loading. Existing query/filter/cadence/freshness/stale warning
  and SessionCard remain. No Play/organizer/session/match redesign.
- app/(tabs)/_layout.tsx: only Mis canchas/Perfil labels and active orange tint.
  Navigation, geometry and Canchas/Play options remain unchanged from T03.
- tests/browser/t04-{setup,community,profile,reads,accessibility}.js: reproducible
  real-app integration checks; no new dependency or raw credentials in source/evidence.
- Documentation: T03 closure, T04 scope/evidence/device guide, ADR 0018, tasks/plan,
  verification/status and separate t04-evidence screenshots.

No lib/hooks/contexts/constants/assets/package/lockfile/backend/RLS/schema changes.
No changes to T03 discovery/map/sheet, beyond the documented backward-compatible
Card reuse. All confirmed state/recovery remains controlled by existing server paths.

## Executed checks

```powershell
npm run harness:status
npm run verify
npm run test:client
git diff --check
```

Verify passes docs/client TypeScript/lint. test:client 105/105 pass, zero skipped.
Includes membership readback/lost join/leave response, identity/caches/logout/support
and presentation/contrast/font/media regressions. No Edge/harness implementation
changed; their separate checks were not required. Final verification repeated after
documentation updates; this does not constitute native acceptance.

Full actual iOS Expo Router entry export passed (3634 modules, Hermes 7.1 MB), with
existing Router compatibility guard enabled. Use the workspace temporary-directory
procedure in t03-verification.md and output .harness/t04-ios-export. Generated files
are ignored local build evidence, not a release/deployment. Existing nonfatal color
environment warnings do not hide compilation errors.

## Real local browser integration — 40 checks passed

Reused the already-running local device Metro at port 8090 without interrupting the
owner's iPhone preview. db:local:web could not start on that occupied port; no change
to server/env was needed. Actual app/browser backend requests were verified local
(port 55431), not hosted. Two fresh synthetic @example.invalid accounts, normal
player permissions, were created solely for QA; real three-court catalog used.

Reproduce: existing local backend/Metro using npm run db:local:web or device, open
http://localhost:8090 and run the five tests/browser/t04-*.js files in order using
the Playwright browser_run_code tool (filename absolute workspace path). setup
captures the app's public key privately from a local request, checks the origin and
keeps fixture credentials/session tokens only in the isolated review browser.
Do not print them, use real user accounts, or substitute a remote API. Transport
interception affects only the review browser; server code/RLS stays unchanged.

- Community: 14 passed. Discovery -> same detail ID, real join -> leave -> rejoin
  checked against server rows, My Courts-only owned card, refresh/detail. Write 503
  and committed-write/readback 503 preserve uncertain retry and block opposite action.
  Retry of committed join preserves original joined_at/no duplicate. Failed personal
  read hides stale cards; retry restores the owned community.
- Profile: 9 passed. Real stored name/My Courts action; support composer failure
  and retry stub inspect only draft properties, no email sent/no automatic account
  data. Logout 400 retains account/retry; actual successful logout clears prior
  profile. A -> B -> A isolates names/communities and restores A's server membership.
- Reads: 9 passed. Catalog/membership/activity errors and retries; stale report
  warning, no inference of physical court emptiness. Palermo's unknown lighting
  labelled. Existing organizer route/back preserves its exact courtId. No organizer
  creation/write or T05 implementation performed.
- Accessibility/pending: 8 passed. Held refresh is busy/disabled and a forced second
  click issues no duplicate read. Held membership request has no success/opposite
  action before server completion. Live prefers-reduced-motion prevents press scale.
  Profile/My Courts/Detail at 320x568 have no horizontal overflow; 390x844 checked.

Additional browser-only doubled-text stress in Profile: no horizontal overflow,
logout reachable. This does not trigger RN Dynamic Type/fontScale or certify iPhone.
Empty-note raw-text warning discovered in Detail was fixed; reload showed no UI console
errors. Expected HTTP errors came from deliberate fault injection. Early automation
timing mistakes were corrected by waiting for actual responses before checking success
or removing held routes; final scripts pass without hiding failures/excluding cases.

After checks: signed out, cleared private fixture storage and deleted only the two
new QA identities via guarded local Docker SQL (exact generated UUID/email pairs;
local Desktop pipe/container validated). Zero owned fixtures remain. Catalog MD5
before/after identical: 6b603bd412dbb79c3ac6a6070eeb1d9e. User accounts/catalog/seed and
schema/rules were preserved; no reset, historical SQL or remote write. Cleanup contains
no raw credentials and is ignored under .harness/t04-ui-owned-cleanup.sql.

## Captures and native limits

Actual web app, local synthetic account, 390x844; captured before fixture cleanup:

- [Detail](t04-evidence/detail.png)
- [My Courts](t04-evidence/my-courts.png)
- [Profile](t04-evidence/profile.png)

These are not illustrative mockups or iPhone captures. Account name is the synthetic
record saved on the local server; court fields and membership were real reads/writes
within the QA account. No personal contact/credential is included in screenshots.

See [iPhone review](t04-iphone-review.md): all new device cases pending. Actual
VoiceOver, >=200% Dynamic Type, safe areas/landscape, press/background interruption,
restart persistence, real composer and physical frame timing are unobserved. T03 owner
closure does not implicitly certify T04 or detailed T06 accessibility/performance.
T04 stays in_progress until native acceptance evidence resolves these limits.
No regression found in executed checks; complete native/release acceptance not claimed.
Stop before T05 and do not commit/push without owner authorization.
