# T05 implementation and local evidence — 2026-10-14

Owner authorized T04 closure and T05 only, on existing SPEC-003/design. T04 closure
is recorded in t04-closure.md without inventing physical evidence. Existing local
changes were preserved. T05 is implemented/local checks passed, in_progress for
owner visual/native review. T06 remains todo and has not started. No commit/push.

## Implementation inventory

- app/(tabs)/play.tsx and play tab label/tint only in _layout.tsx: Spanish Jugar,
  shared art/actions, actual organizer/discovery cards, original refresh/read states.
- components/pickup/SessionCard.tsx: opt-in arcade sports tickets, prominent format,
  real occupancy/capacity, separate open/full/started/cancelled/completed labels and
  status treatments. CourtActivity's existing default rendering is preserved.
- DiscoverGames.tsx, app/pickup/[id].tsx and mine.tsx: existing filters, groups,
  personal entries and detail in Spanish; truth/freshness, unknown/read/retry states,
  original court/organizer/history navigation retained.
- CreateInvitation.tsx and app/organize/[id].tsx: original Now quick route/Plan
  expansion, actual court choices, FormatChoices with original capacities and
  defaults, server lifecycle/core locks/confirmations and saved-request recovery.
  create.tsx/quick.tsx route wrappers themselves unchanged.
- ParticipationControls.tsx: original useParticipation/eligibility/run callbacks,
  immediate pending lock, same saved intent and Reintentar comprobación; explicit
  leave confirmation. Decorative feedback observes confirmed message only.
- app/matches/create.tsx, [id].tsx, mine.tsx and MatchPlayerSlot.tsx: original side
  capacity/account/guest validations, owned management, readback, score review,
  revision conflicts/corrections and immutable history; cream score/roster panels.
- Kit.tsx + GameText.tsx/error-copy.ts/presentation.ts/FormatChoices.tsx/MotionLink.tsx:
  adapters over T02 primitives, semantic colors, sports headings, Spanish display
  copy/date formatting and existing press/selection/confirmed motion. Business
  validators/error classification/UUIDs remain unchanged. No parallel design system.
- foundation/Primitives.tsx: optional Choice.style only; default T03/T04 choices
  unchanged. T05 opts in to compact court choices and orange selection boundaries.
- entry/EntryFrame.tsx, OnboardingSlide.tsx, auth signin/signup/age-gate/consent/
  profile-setup/welcome and four onboarding routes: shared scrolling/safe-area/
  keyboard presentation, original local labelled art replacing remote imagery,
  Spanish labels, existing authentication/consent/profile handlers and navigation.
- AuthGate.tsx, splash.tsx and loading.tsx: same routing/recovery; shared truthful
  reduced-motion-aware loading presentation instead of independent rotating messages.
- tests/pickup-presentation.test.cjs and tests/browser/t05-*.js: reproducible checks.
  ADR 0019, scope, task/status/plan/verification and native review documents updated.

No lib/hooks/contexts, backend/RLS/schema/contracts/permissions, package.json/lock,
font/art files or dependency changes. No T03/T04 screen changes in this task. Shared
changes are opt-in or entry presentation; T04 court activity composition unchanged.

## Environment and executed checks

Windows/PowerShell, Node 24.16.0, Expo 57.0.24, React Native 0.86.3. Existing local
Docker bballuy-local API 55431 and actual Expo app 8090; local-only origin guards,
synthetic accounts and normal existing commands. No hosted writes/reset/migration.

- npm run verify: documentation, application typecheck and lint pass without new
  exclusions/any/rule disabling. Final doc count: 75 Markdown files.
- npm run test:client: 109/109, zero skips. Includes account/auth/consent and original
  capacity/lifecycle/registration/request replay/match/revision/permission invariants,
  plus Spanish status/full distinction, past-planned copy and error guidance tests.
- Full iOS export: EXPO_NO_DOTENV=1 EXPO_OFFLINE=1 CI=1, workspace TEMP/TMP,
  npx expo export --platform ios --output-dir .harness/t05-ios-export. Final artifact
  includes full Expo Router entry, fonts/art and SDK compatibility guard. Compilation
  is not native execution; 3637 modules, 31 assets, 7.1MB Hermes entry. Export was
  repeated after the final typography/keyboard changes.
- git diff --check: no whitespace errors; existing LF/CRLF notices are informational.

## Actual browser checks — 61 total

Invoke raw async(page) scripts with Playwright browser_run_code using absolute
filenames in the same isolated local browser, sequentially:

1. t05-setup.js: local origin guard, two generated identities, actual sign in/catalog.
2. t05-create.js — 11: format selection immediate, 2/4/10, no commands/navigation on
   format touches, invalid past date, real confirmed creation/ID and organizer counted
   once; actual invitation sports discovery card.
3. t05-participation.js — 11: B signs in, held join blocks duplicate press, no premature
   confirmation, committed write with lost readback stays uncertain, opposite action
   absent, retry uses same UUID, actual confirmed registration, leave confirmation,
   released capacity/rejoin, actual full personal card, return to A.
4. t05-results.js — 9: explicit start/server readback, started state has no join/leave,
   linked match with explicit guest sides, score review/confirm, revision 1 then 2,
   original history retained, linked invitation closed and actual match history.
5. t05-lifecycle.js — 9: Now route, actual 2v2 present guests/capacity 4, full nonplaying
   organizer cannot join, occupied core edit locked, cancel confirmation and cancelled
   closed participation, planned has no guest field, 5v5 capacity 10, manual closure
   without inventing score/participation.
6. t05-conflicts.js — 5: normal owned A command updates the score concurrently; stale
   revision rejected with Spanish guidance, actual revision/history reconciled,
   reviewed correction succeeds while preserving conflict history, history read error
   prevents unchecked edit and retry restores actual match.
7. t05-accessibility.js — 13: discovery read failure/freshness/retry; reduced motion
   selection; Enter and final Space-key activation/no write/navigation; 320x568 Play/Organize/personal/
   history reflow; doubled browser text without horizontal overflow; intro/age/both
   provisional notices/continued signup path. This is not native Dynamic Type.
8. t05-signup.js — 3: real signup validation, third account through actual consent/
   signup path, recorded display name/discovery and account C isolation.

Fault injection uses 400/503 responses only in the isolated browser; no backend
permissions or contracts modified. Early probe input sampled before hydration;
network-idle waits corrected it. Held-request checks were corrected to wait for
request dispatch and post-write invalidation, retaining duplicate/uncertain assertions.
The first conflict API probe reused an old revoked signup token; corrected to the
active current-account token with an owned-ID guard. An early Space-key assumption
initially used the working RN Web Enter activation. Then added a Web-only Space
handler in FormatChoices using the same onChange callback; final full 13-case script
passed with Space on a fresh pair of local identities. No discovery/default Choice
keyboard handler or native event changed; neither key submits or navigates.
Initial localization typecheck errors (including a mistakenly translated revision
identifier) were corrected; business identifier/logic restored before passing checks.
These failed preliminary attempts are not recorded as passes or hidden by exclusions.

Existing Metro stopped during entry checks; local db:local:device relaunched without
database restart. Cold web rebuild exceeded an initial automation timeout; after
build completion the complete 13-case script passed. No eligible update installed.

## Captures, cleanup and limits

Actual 390x844 web app before fixture cleanup, not mockups or physical iPhone:
[Play final](t05-evidence/play-final.png), [Organize](t05-evidence/organize-final.png),
[My sessions](t05-evidence/my-sessions.png), [Match result](t05-evidence/match-result.png),
[Sign in](t05-evidence/signin.png).
Court information is real local catalog data; names/game/result examples are actual
synthetic QA records created by existing local UI/commands, not seeded into production.
Earlier initial capture remains for comparison; final hierarchy is the final code.

Signed out/cleared private browser fixture storage. Guarded cleanup removed exactly
five generated auth identities (three main-flow, two final keyboard recheck), their
public profiles/consents and three owned
sessions/one owned match/history/places/requests; zero owned profiles/sessions/matches
remain. Checked that no nonfixture player was attached before cleanup. The first auth
cleanup did not cascade public profiles; follow-up cleaned the actual local tables.
An attempted cleanup of user_stats rolled back because it is a calculated view; no
view/schema was modified. Final cleanup uses base tables/owned profiles only.
Original three-court fingerprint remains 6b603bd412dbb79c3ac6a6070eeb1d9e.
Ignored .harness cleanup files contain only owned fixture identity pairs, no tokens.

See t05-iphone-review.md for physical review. VoiceOver, native keyboard/safe areas,
>=200% Dynamic Type, press/background interruptions, native saved-state restore and
physical frame timing are unobserved. Browser text doubling and iOS export do not
certify them. SPEC-003 is not verified; no release/deployment or T06 authorization.
T05 implementation/local regression evidence is ready for owner review; task remains
in_progress pending visual/native acceptance. No commit/push.
