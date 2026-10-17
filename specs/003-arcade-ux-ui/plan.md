# SPEC-003 - Plan

## Current authorization — block 01 only, 2026-10-16

Owner approved the plan and authorized N01–N05 only. T06 is in_progress for
preparation and owner-operated physical testing. [Block record](t06-native-block-01/README.md)
contains separate case records and the exact local revision snapshot. All physical
cases remain NOT RUN pending owner results. This supersedes earlier planning-only
status, not historical test evidence. N06–N17 require further owner authorization;
no functional changes, dependency updates or automatic SPEC closure permitted.


## Current owner decision — 2026-10-16

Owner formally approved the four secondary game screens and closed T05 for
implementation and visual acceptance. T00–T05 are done; T06 remains todo,
planning only, awaiting authorization. SPEC-003 remains open. This latest status
supersedes older pending-review/dependency-authorization statements below.
See [T05 closure](t05-closure.md), [exact security patch](security-patch-verification.md)
and [proposed physical T06 checklist](t06-plan.md). Native validations remain
pending; no physical tests, commits, push or SPEC closure are claimed.



## Authorized T05 scoped corrections — 2026-10-16

Owner accepted the pre-closure diagnosis and authorized contrast and secondary Play/
result fidelity corrections plus security analysis only. [Implementation and evidence](t05-final-corrections.md)
resolve the current contrast composition and secondary Spanish/card adoption, pending
owner review. [Security proposal](security-update-proposal.md) requires separate approval
before any dependency update. T05 remains in_progress; T06 todo; SPEC open. No commits/push.


## Current pre-closure audit — 2026-10-16

Owner formally approves the implemented Profile and Map visuals, with no more visual
changes requested now. Keep physical iPhone large text/VoiceOver/safe areas and long
emails pending; avatar/editing/expanded profile remain future functional scope.
The [pre-closure audit](pre-closure-audit.md) is the current cross-screen acceptance
index and supersedes older pending approval statements for those two screens.
T00–T04 remain done, T05 in_progress, T06 todo, SPEC in_progress. Secondary Play/result
copy/fidelity, a concrete court-detail contrast failure, native acceptance and critical
security-risk treatment remain explicit. No code changes or closure in this audit.

## Authorization and strategy

Current boundary, 2026-10-14: owner explicitly closed T04 (t04-closure.md) and
authorized only T05 on the preserved current branch. T05 implemented/local checks
ready; remains in_progress for visual/native review. T06 is not started. See
t05-scope.md, t05-verification.md, t05-iphone-review.md and ADR 0019. Earlier task
boundary paragraphs below are historical, not current continuation authorization.

T00–T03 are done; owner explicitly closed/approved T03 and authorized only T04 on
SPEC-003/design on 2026-10-14. T04 uses approved R02/R02.1/T02/T03 presentation for
detail, My Courts and Profile. Local/browser/iOS compilation evidence is separate
from new pending physical cases. T04 in_progress; SPEC-003 not verified, T05–T06 todo.
Stop before T05. See t03-closure.md, t04-scope.md, t04-verification.md and ADR 0018.
Earlier dated entries describe their original approval boundaries.

## Execution sequence

- T00: create draft scope, audit, Design System/motion proposals, tasks and acceptance.
  Exit: repository checks/evidence for documentation, not runtime/design acceptance.
- T01: reviewable visual boards for List, Map, Bottom Sheet, Detail, My Courts and
  principal Play flows. Include discovery/filtering, invitation detail/join/leave,
  My sessions, Now/Plan ahead, organizer lifecycle, match guest/account selection,
  declared scores/correction history, Profile and entry/shared-state examples.
  Annotate loading/empty/error/pending/disabled/confirmed/conflict/navigation states.
  Provide font/license options, original illustration/placeholder direction,
  contrast-tested tokens and motion/reduced-motion storyboards. Static screen boards
  recommended; optional design prototype does not modify application code.
  Exit: dated owner approval naming exact visual revision and approved scope.
- T02: presentation foundations. Before start, record complete SPEC-002 acceptance,
  exact T01 approval and implementation authorization. Do not move draft to ready
  until dependent decisions are resolved. Harness availability does not waive gates.
- T03: list-first discovery, view switch, basketball markers/preview; preserve
  filtering, location denial, camera/search/detail return and web fallback.
- T04: detail, My Courts and Profile; preserve memberships/activity/organize/logout.
- T05: approved styling/motion for Play, organizer, participation, match/history and
  auth/entry/shared states, without new capabilities or modified recovery semantics.
- T06: regression, accessibility, performance and browser/iPhone evidence A01-A08.

## Future file scope

See [audit inventory](audit.md). New primitives are presentation-only; exact paths
and sheet implementation follow approved constraints. No hooks/lib contract change,
backend/RLS/schema/RPC/database-types edits or weakened test expectations.
Keep existing tests; add meaningful interaction coverage for new selection/switch/focus.

## Validation

Run npm.cmd run verify and npm.cmd run test:client at appropriate implementation
boundaries. Browser: searchable list/fallback, guarded routes, faults/retry, pending
states and A -> B -> A. Native iPhone/Expo SDK 57: actual marker/sheet gestures,
back/focus, safe areas, keyboard, text scaling, VoiceOver, reduced motion, rapid taps
and background/foreground. Verify lost-response/readback recovery for community,
invitations and results; confirmations/capacity/conflicts/history remain unchanged.
Existing local integrity/permission suites may be rerun with preserving fixtures;
no contract/migration/RLS or hosted-data changes. No Edge Functions or harness edits
proposed. Distinguish historical, owner-reported and newly observed acceptance.
Design samples use recorded court data or explicit unknowns; synthetic session
examples must be clearly illustrative, never evidence of real activity.

## Risks and dependencies

SPEC-002 is verified locally, T00-T06 done; its historical device evidence is retained. Existing uncommitted work requires before/after scope
review. Palette changes can reduce contrast (especially white-on-orange). Native
markers/sheet gestures and modal focus need early testing after gates. Art/font size
can delay startup; optimize and keep fallback. Web must not import the native map.
Do not alter focused foreground polling or cached-error semantics. Old architecture
narratives need later targeted reconciliation, not replacement of historical evidence.
Design approval does not constitute functional/device acceptance.

## Decisions and input for T01

Resolved: Spanish initial UI and R02 + R02.1 visual/motion approval. T01 closure
and exact T02 foundation scope are documented. Exact font files/provenance and
optimized artwork remain T02 technical validation; native modal focus belongs T03.
No new product decision, hosted operation or implementation permission inferred.

## T01 start - 2026-10-13

Brand clarification from the owner: upcoming revisions use `bballuy` as the
temporary brand/logo wordmark; the final app name is undecided. Arcade remains
an art-direction descriptor. Preserve original R01 boards for comparison and
apply the corrected naming to subsequent boards. This clarification does not
approve a complete visual revision or start application implementation.

Owner authorized design-only T01 and Spanish initial UI. SPEC-002 now reports
verified with all tasks done. R01 visual approval and implementation authorization
remain absent. Static compositions and annotations live in design-r01/. Earlier
pending-language/SPEC-002 statements describe the T00 baseline, not current gates.


## T01 R02 refinement - 2026-10-13

Owner requested a separate R02 with Courts/Play/Organize boards and seven annotated
motion groups. Preserve R01, retain functional flow/navigation and remain design-only.
T01 remains in_progress; no T02 authorization or final design approval.


## T01 R02.1 targeted design patch - 2026-10-13

R02 artistic direction approved generally, not final T01 acceptance. Prepare only
the requested compact-sheet, eligibility, scheduling/participant patches and three
four-frame sequences in design-r02-1/. Preserve R02 originals and all other direction.
T01 remains in_progress; no implementation authorization, commits or push.

## R03 design-only fidelity review — 2026-10-14

The owner requested a new [R03 review package](design-r03/README.md) after reporting
native visual divergence. R03 is proposed, not approved or implementation-ready.
Current authorization is design/documentation only; do not continue UI implementation
or final verification from earlier T05 authorization. T00–T04 completed history is
preserved; T05 stays in_progress and T06 todo. No registry state/numbering changed.
The [proposed refinement sequence](design-r03/task-proposal.md) requires approval
before insertion/renumbering. Once approved, frozen R03 boards/specifications become
the visual baseline; until then R02/R02.1 remain historical approved references.
Actual iPhone comparison, text settings, safe insets and native acceptance remain
pending. No backend/RLS, contracts, app source, commits or push in this review.

## Approved return to R02/R02.1 — 2026-10-14

R03 is rejected as a visual baseline; no new design revision is requested. Owner
authorized corrections one screen at a time, starting with Canchas only. See
[scope and acceptance](courts-fidelity-correction.md). Stop for native owner review
before Detalle; preserve all functional behavior and completed task history.

## Targeted Courts/auth refinement — 2026-10-15

Owner authorized outline court CTA/hierarchy and integrated password eyes. Owner
clarified consent scope: make the two existing provisional acknowledgement
checkboxes recognizable, retaining existing persistence/validation. See
[scope, implementation and verification](courts-auth-refinement.md). Verify PASS;
client tests109/109 PASS; actual browser form/card checks passed. Physical iPhone
focus/VoiceOver/scaled text remain pending. No map/backend changes, next-screen
progression, task closure, new mockups, commits or push.

## Detail fidelity implementation — 2026-10-15

Owner authorized only Detalle after Courts/auth work. R02/R02.1 plus subsequent
approved adaptations remain the reference; no R03/new design. See
[scope, changed files, captures and verification](detail-fidelity-correction.md).
Verify PASS; client tests109/109 PASS;10 isolated-browser checks passed with
explicitly simulated transport and no backend writes. Native owner approval pending.
No map/backend/contract changes, next-screen work, closure, commits or push.

Owner corrected Detalle reference on2026-10-15 with an uploaded image: cream page,
wide original-art header, navy attribute rows, grouped orange save/outlined organizer
actions, separate navy activity. Latest accepted labels/no coordinates/quiet location
remain. See [current comparison and checks](detail-fidelity-correction.md). Earlier
composition notes are history; new reference comes from the owner, not R03.

## My Courts fidelity implementation — 2026-10-15

Owner approved Detalle and authorized only Mis canchas. Shared approved illustrated
card reused, quiet header refresh and existing-art empty state implemented. See
[scope, files, captures and observed limits](my-courts-fidelity-correction.md).
Verify PASS; client109/109 PASS;8 isolated browser transport-simulation checks PASS.
Protected approved detail/shared components/hooks unchanged. Native owner review
pending; no Jugar work, backend/contract changes, commits/push or SPEC closure.

## My Courts final approval and Play fidelity review — 2026-10-15

My Courts final owner-requested subtitle/CTA verified; refresh 48 x 48, screen now
approved/frozen. See [approval record](my-courts-fidelity-correction.md).
Jugar now uses R02 horizontal illustrated cards, compact selectors and fixed action
dock with existing routes. Verify PASS, client109/109 PASS,6 grouped isolated actual
web-app checks PASS; simulated transport is not remote or native acceptance.
See [implementation, comparison, captures and iPhone gate](play-fidelity-correction.md).
Physical iPhone review pending; T05 remains in_progress, T06 not started, SPEC open.
Earlier statements that Jugar was not started are historical. No commit/push.

## Play R02 fidelity recovery after rejection — 2026-10-15

Owner rejected the previous Play visuals. With explicit authorization, actual clean
art crops from the attached R02 now drive the illustrated JUGAR header and compact
sports tickets, with overlaid formats, semantic state tags, icon-led real metadata
and exact #FF8A43/navy CTA. Existing routes/filters/dock/domain rules preserved.
Verify PASS, client111/111 PASS and6 isolated browser groups PASS. See
[current element comparison, provenance, captures and limits](play-fidelity-correction.md#recovered-r02-composition-and-verification).
Art crop resolution/framing and font differences remain explicit; actual iPhone
acceptance not claimed. My Courts/Detalle unchanged. T05 in_progress, T06 todo,
SPEC open, no next screen, commits or push. Earlier visual completion is superseded.

## Jugar approved; Armar partido fidelity review — 2026-10-15

Owner explicitly approved Jugar visually; header integration, availability wording
and full-game behavior remain minor follow-ups, not resolved claims. Only existing
Armar partido creation/quick/planned presentation was corrected next. Compact real
court selector, illustrated checked format tiles, timing/participation choices and
exact orange/navy CTA preserve existing contracts/defaults/validation/UUID replay.
Verify PASS, client111/111 PASS, five isolated actual-browser groups PASS including
both simulated confirmed creations and uncertain readback. No real backend writes.
See [comparison, files, captures and native limits](organize-fidelity-correction.md).
Jugar and other approved screens unchanged. Physical iPhone review pending; T05
in_progress, T06 not started, SPEC open; no commits/push or automatic next screen.

## Organizer approved composition; native scheduling usability — 2026-10-15

Owner approved Armar partido composition and requested targeted usability changes.
Native date/time adapters, Spanish readable date/device zone, future-selection guards,
compact format summary, shorter help and keyboard/safe-inset policy implemented only
in creation. One justified SDK-compatible picker dependency; no domain/backend change.
Verify PASS, client116/116 PASS; isolated browser regression PASS including both
simulated creations/replay and resized-viewport CTA. iOS Hermes export PASS; final
Android export status and actual native limits in [current evidence](organize-usability.md).
[Future invitations](../../docs/future-player-invitations.md) documented, not implemented.
Project npm audit reports49 alerts including1 critical; picker inherits Expo's alert,
no broad fix/downgrade applied. No clean security/native-release acceptance claimed.
Physical iPhone/Android review pending; T05 in_progress, T06 todo, SPEC open; no
commits/push or other-screen work. Earlier manual scheduling adaptation is superseded.

## Organizer formally approved; game detail/management review only — 2026-10-15

Owner formally approves Armar partido design/usability in Jugar ahora and Planificar.
Keep pending physical iPhone pickers/keyboard/safe areas/enlarged text,49 security
alerts with critical priority, and future functional invitation SPEC (documented only).
Review of public game detail/organizer management compared source and actual isolated
browser presentation to R02/R02.1. R02 has public detail but no standalone management
board. Six read-only browser groups passed with0 attempted writes; native/remote
acceptance not claimed. See [differences and proposed scope](game-detail-management-review.md).
Application code unchanged; implementation requires owner approval of the proposal.
T05 remains in_progress, T06 todo, SPEC open. No commits/push or automatic next screen.
