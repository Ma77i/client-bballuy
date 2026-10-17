# Organizer usability refinements — 2026-10-15

Owner approves current composition; this is not a redesign. Scope only existing
Armar partido quick/planned flows. Preserve submit/identity/request/recovery contract.

## Acceptance before implementation

- System-native date/time selectors on iOS/Android; browser-native equivalent on web
  without importing a mobile native module. Readable Spanish dates and explicit
  device-local timezone. No parsing date-only strings as UTC, no fixed offset hacks.
- Future-only selections and final existing validation. Android native time dialog
  cannot enforce minimumDate: reject past time selections before updating draft,
  show actionable error. Re-check at confirmation/submission for elapsed time.
- Keep local YYYY-MM-DD/HH:MM draft and existing backend ISO conversion unchanged.
  Calendar dates selected today may require choosing a new future hour; do not
  silently change existing selected time/defaults or saved uncertain commands.
- Compact format/capacity summary immediately before confirm in both modes.
- Short nearby help, visible copy uses partido, explicit no court reservation.
- One keyboard avoidance/inset policy, safe bottom padding, scroll/focus clearance
  and text reflow; actual iOS/Android keyboard/native acceptance must be separated
  from browser/logic checks. No new background, hero, navigation or artwork.
- One necessary native-picker dependency justified in ADR0020, matching installed
  Expo SDK57 native map9.1.0. No unrelated upgrade, backend or contract changes.
- Document future invitations separately; do not implement them or create a ready
  functional SPEC without product decisions. No next screen, commits/push/closure.

Verification and observed limits to be appended after execution.

## Files and implementation

- components/pickup/CreateInvitation.tsx: native-schedule adapter, compact real-format
  confirmation immediately above CTA, shorter nearby guidance, no-reservation notice,
  creation-only partido error copy; keyboard offset from Expo Router header and bottom
  safe inset. Original handler/default/capacity/submission/saved-request logic retained.
- components/pickup/PlannedSchedule.tsx: system Android date/time dialogs and iOS
  native spinner with Cancelar/Listo modal; dismissing never applies an edit. Calendar
  minimum today; past time callbacks rejected. Spanish date display, device timezone,
  focus restoration and limited scrollable modal height for large text. Native controls
  never submit the form. Pending/busy draft remains locked.
- components/pickup/PlannedSchedule.web.tsx and PlannedSchedule.types.ts: HTML-native
  date/time fallback and shared adapter props; web does not import the mobile module.
- components/pickup/schedule-policy.ts: pure local component parsing/formatting and
  selection constraints, no UTC-only date parsing or fixed offsets. Today with an
  elapsed hour requires explicitly selecting a future hour, not silently changing it.
  Invalid DST gaps are rejected. A native second occurrence of a repeated DST hour is
  rejected if the existing wall-time contract would serialize a different instant.
- package.json/package-lock.json: only native-picker9.1.0 added; no existing package
  version changed. MIT license, matching installed Expo native map. See
  [ADR0020](../../docs/decisions/0020-native-scheduling-controls.md) and its official
  Expo/library sources. Optional installer-added config plugin removed; app.json
  restored unchanged, no native-theme/permission config added.
- tests/schedule-policy.test.cjs: real timezone/date/DST/contract round-trip checks.
- tests/browser/organize-fidelity.js: existing browser regression adapted to native
  browser controls; captures saved separately from previous visual approval evidence.
- [Future invitations note](../../docs/future-player-invitations.md): both modalities,
  search/name/email privacy, send/accept/reject, guest accounting and server concurrency
  requirements documented. No UI, endpoint, data model, notification or rule implemented.

The already approved composition/art/tokens remain. FormatChoices/Play/court/detail/
My Courts/management/matches and organizer domain hook/module retained start-of-turn
source hashes; no backend/Supabase/RLS or contract edits.12 protected files unchanged.

## Observed verification — 2026-10-15

Windows, branch SPEC-003/design, existing local changes preserved.

- npm run verify: PASS docs/TypeScript/ESLint after implementation.
- npm run test:client: PASS116/116 (previous111 +5 schedule-policy tests).
- node --test tests/schedule-policy.test.cjs: PASS5/5. Covers invalid normalized
  dates, past-date/hour rejection without mutating old values, next-minute midnight
  rollover and unchanged wall-field/ISO round-trip in America/Montevideo,
  America/New_York and Asia/Kolkata. DST skipped time rejected; repeated time retains
  prior contract's earlier occurrence and refuses silently converting native second
  occurrence to the first. Existing validateSessionDraft/restoredSessionDraft unchanged.
- tests/browser/organize-fidelity.js: PASS5 grouped actual-Expo-web checks at
  localhost:8092, isolated simulated auth/REST, locale es-UY and Montevideo timezone:
  existing selector/default2v2/capacities2/4/10 and now-route parameters, planned
  browser-native fields, rejection of a past calendar choice, both confirmed creations,
  invalid counts, real-format summary, exact orange CTA, rejection/retry, busy duplicate
  guard, uncertain readback/locked fields/same UUID, catalog loading/error/retry,
  narrow320pt/text stress/reduced motion. Four simulated RPC attempts, no real writes.
- Browser keyboard approximation: focus description, resize viewport402x500,
  scroll submit into view and assert its full bounds fit; passed. This is NOT an
  iOS/Android software-keyboard measurement or a proof of native safe-area behavior.
- iOS local full-entry Hermes export: PASS into .harness/organize-usability-ios.
  Android full-entry Hermes export also executed; final status recorded below.
  These validate JS/native module bundling, not native compilation/linking, installed
  Expo Go version or actual native picker behavior. No app published or deployed.

First bundling attempt failed because the new header-height import used external
@react-navigation/elements, which SDK57 rejects in application code. Replaced only
that import with the supported expo-router/react-navigation entry point. Browser
and iOS export then passed; no compatibility-check exclusion/bypass was introduced.

### Scheduling semantics and remaining limits

Form displays Spanish date text and IANA device timezone. Android and browser system
picker chrome follows OS/browser language/clock conventions; a browser capture shows
month/day and12-hour controls despite locale preference, but its adjacent date text
is Spanish and backend still receives correct local18:00 as an ISO instant. Mobile
Spanish display labels are under app control; actual OS-picker locale needs review.

Scheduling remains device-local, not a newly fixed Uruguay venue timezone. A travelling
user sees the device timezone. A timezone change before sending reinterprets unsent
wall fields in the device's current zone, as the existing contract does; review the
shown zone before confirming. Saved pending requests retain their original ISO/UUID
and cannot be changed by these controls. No offset-aware second DST occurrence is
silently invented; choosing one requires another hour or a future contract decision.
Android system time dialogs cannot disable past hours: the callback adapter refuses
application and shows a correction. Existing submit validation still rejects a
selection that becomes past while the form is open; server rules remain untouched.

Native iOS/Android devices, hardware/software keyboard, VoiceOver/TalkBack,
Dynamic Type/Android font scaling, actual native dialog gesture/focus/locale/minimum
limits and performance are NOT executed. Windows/browser cannot certify them.

### Dependency audit finding (not fixed within this task)

npm audit --json returned49 reported project dependencies:1 low,15 moderate,32 high,
1 critical. The new picker is reported high via existing Expo (its via array is
['expo']), not with a standalone picker advisory. npm suggests an incompatible
picker downgrade; no automatic downgrade or broad dependency/security fix applied.
No pre-install audit snapshot was captured, so changes in total count are not claimed.
This remains dependency-security work outside the UI correction and prevents any
claim of a clean audit or release readiness. Raw transient report is under .harness;
these counts/classification are preserved here for review.

## Implementation captures and iPhone gate

Actual browser captures, explicitly simulated test data, not new mockups:
[initial](organize-usability-evidence/initial.png),
[planning upper fields](organize-usability-evidence/planned.png),
[planning confirmation](organize-usability-evidence/planned-submit.png),
[quick](organize-usability-evidence/quick.png),
[quick confirmation](organize-usability-evidence/quick-submit.png),
[uncertain](organize-usability-evidence/pending.png),
[viewport keyboard approximation](organize-usability-evidence/keyboard-resize.png),
[text stress](organize-usability-evidence/text-stress.png).

On iPhone16Pro/Expo Go reload the app, open Planificar, select/confirm/cancel date
and hour, try today/past hour and review Spanish date/device zone. Check real format
above confirmation, both modes and pending readback in an authorized test environment.
Open the keyboard in description/present count, scroll to submit without obscured
controls or double inset. Repeat larger text/VoiceOver/Reduce Motion; review native
picker scroll, cancel and focus return, safe bottom and no-reservation notice.
Android system dialog and TalkBack/font/keyboard checks also remain pending.

Owner composition approval is retained; this targeted implementation awaits iPhone
review. Future invitations documented only. T05 remains in_progress, T06 todo,
SPEC-003 open. No next screen, commits or push.

## Final native bundle results

Final source iOS full-entry Hermes export PASS:
`npx expo export --platform ios --output-dir .harness/organize-usability-ios --max-workers 2`
(offline Expo environment). Bundle entry-32af291848aad3e7a6bd3ef3f6f7c1db.hbc,7.1MB.
Final source Android full-entry Hermes export PASS:
`npx expo export --platform android --output-dir .harness/organize-usability-android --max-workers 2`.
Bundle entry-40d5f5a9382428d9be156f5fd257c4cb.hbc,7.3MB. No native application
build/install or device test performed. These are local verification artifacts only.

## Device preview connection correction — 2026-10-15

Owner reported a credential rejection after a newly supplied Expo connection. The
ad-hoc8093 launcher had loaded root.env and targeted hosted Auth instead of the
local test environment documented for device review. Stopped that preview and used
`npm run db:local:device -- --address=192.168.1.13`, which disables.env, injects the
local public configuration, checks local Auth health and starts Expo Go on8090.
Local Auth health preflight passed. No password reset, account creation, credential
logging, backend/data mutation or application-source change. Actual iPhone sign-in
success remains for the owner to confirm; credential validity was not inferred
from the screenshot or the environment mismatch alone.

## Formal owner approval — 2026-10-15

Owner formally approves Armar partido design and usability for both Jugar ahora and
Planificar. This supersedes the prior owner-review gate for visual/usability approval,
not the explicitly pending physical-native evidence.

Retain open:
- Physical iPhone validation of native pickers, keyboard, safe areas and enlarged text.
- Review all49 reported dependency-security alerts, prioritizing the critical one.
- Player invitation system, documented only for a later functional SPEC in
  docs/future-player-invitations.md; no invitation implementation is authorized.

Next authorized step is review/proposals only for Detalle de partido and Gestión de
partido, comparing existing implementation with R02/R02.1 before application-code
changes. No change to the approved creation screen. T05 remains in_progress, T06 todo,
SPEC-003 open, no commits/push. Approval is not a claim of newly executed native tests,
clean security audit, remote contract verification or new functional acceptance.
