# SPEC-003 - Plan

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
