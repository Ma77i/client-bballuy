# SPEC-003 - Verification

## T04 closure / T05 local implementation — 2026-10-14

Owner explicitly closes T04: [closure](t04-closure.md), retaining unobserved native
cases rather than inferring device acceptance. T05 authorized only within
[scope](t05-scope.md); [implementation evidence](t05-verification.md) records verify,
109 client tests, 61 actual local browser checks and full iOS compilation.
[Native walkthrough](t05-iphone-review.md) is prepared with physical cases pending.
T05 in_progress for review; T06 remains todo and not started. SPEC-003 not verified.
No commits/push. Earlier authorization/status boundaries below are historical.

## T03 owner closure / T04 local execution — 2026-10-14

T03 closed/approved explicitly; see [closure](t03-closure.md). T04 authorized and
implemented within [scope](t04-scope.md), [ADR 0018](../../docs/decisions/0018-arcade-detail-and-account-presentation.md).
Verify, 105 client tests, 40 real local browser checks and full iOS export pass;
[T04 evidence](t04-verification.md) includes captures, source inventory and QA cleanup.
[New iPhone review](t04-iphone-review.md) is pending; no new physical result inferred
from T03 approval or compilation. T04 in_progress, SPEC-003 not verified, T05/T06 todo.
No commits/push or automatic T05. This entry supersedes prior task boundaries as history.

## T03 focused visual refinement — 2026-10-14

Owner authorized compact discovery/preview refinement after iPhone visual feedback.
See [differences and observed evidence](t03-visual-refinement.md). Verify, 105 client
tests, 17 focused tests and full iOS export pass; measured web controls/reflow and
content-driven sheet checked. Original capture retained; refined captures separate.
New iPhone retest is pending; prior device cases are not implicitly marked verified.
T03 in_progress, SPEC-003 not verified, T04–T06 todo. No commits/push or T04 work.

## T03 current execution ledger — 2026-10-14

Owner authorized T03 on SPEC-003/design; T00–T02 remain done. T03 implementation and
local/browser evidence are recorded in [t03-verification](t03-verification.md),
[ADR 0017](../../docs/decisions/0017-list-first-court-preview.md) and
[prepared device review](t03-iphone-review.md). Verify and 105 client tests pass;
10 focused discovery/catalog tests pass. Actual shared web components, fallback,
states and simulated context return checked. iOS transform is not device acceptance.
T03 remains in_progress pending physical checks; SPEC-003 not verified, T04–T06
todo. No backend/RLS/business/dependency change, commit or push. Stop before T04.
This entry supersedes earlier dated authorization boundaries without rewriting history.

## T02 current completion ledger - 2026-10-13

Owner explicitly authorized t02-scope.md only. T02 is done for local foundation
implementation and acceptance, evidence in [t02-verification](t02-verification.md)
and [ADR 0016](../../docs/decisions/0016-shared-presentation-foundations.md).
SPEC-003 is in_progress, not verified; T03-T06 stay todo and T03 is unauthorized.
Earlier ledgers remain historical and are superseded by this dated entry.

Implemented tokens/compatibility adapters, canonical primitives, font map and
loaded-font fallback, static Teko 600 + OFL/Spanish validation, original optimized
local media/fallback and pooled reduced-motion/decorative animation utilities.
No dependency/lockfile, application route, screen layout, hook/lib business contract,
backend/RLS/Edge/harness changes. Root only font/provider initialization.

Reproduction: npm run verify; npm run test:client; node scripts/verify-presentation-assets.mjs;
standalone Metro gallery commands and browser cases in t02-verification.md.
Observed: 101 tests pass (94 baseline + 7 new), token contrast on dark/cream,
font/glyph/hash audits, actual web font/art loading and invalid-source fallback,
busy/disabled callback blocking, radio checked state, help linkage, keyboard focus,
375/812 viewport and doubled browser text stress, live reduced-motion emulation.
Final iOS transform HTTP 200 (6,200,466 bytes) is compilation, not physical acceptance.
Final verify and whitespace/status results are appended below after these updates.

Remaining: physical device font/rendering, VoiceOver/TalkBack, true native text
scaling and release frame timing; full map/sheet/screen adoption in later tasks.
Generic typecheck still includes legacy Deno and fails with 27 preexisting errors;
client-specific typecheck/verify pass. No server check inferred or required Edge edit.
No commits/push; preserve prior owner documentation edits. Local gallery available
for review at localhost only; no backend/auth/data operation executed by the fixture.

## Current approval and gate ledger - 2026-10-13

T01 is done. Owner approved R02.1 direction and all three sequences and expressly
authorized documentary closure after five consistency checks; all pass as documented
in [t01-closure](t01-closure.md). Approved baseline: R02 plus R02.1 corrections and
authoritative contract annotations. Older pending ledgers below are historical.

- SPEC-002 local acceptance: SATISFIED, verified registry and all tasks done, supported
  by existing local/browser/owner-reported iPhone closure evidence, not rerun here.
- Exact T01 visual revision: SATISFIED for design-only R02 + R02.1 closure.
- Implementation authorization: NOT PROVIDED. No T02 execution or automatic continuation.
- SPEC-003 state: ready for the planned sequence, not implementation-verified.
- Redesign runtime/native focus/VoiceOver/text scaling/motion/performance: NOT VERIFIED.

Windows/PowerShell, existing dirty working tree. Inspected README/status/workflow,
SPEC-002 R02/R04/R08, participationState/manager, ParticipationControls,
validateSessionDraft/capacities and SPEC-003 R02.1 artifacts/annotations. Checks cover
full/open vs started/cancelled actions, 2/4/10 totals and guests, saved-request replay
and current-account readback, state-independent motion, compact/expanded accessible
sheet requirements. Exact sources/steps/outcomes are in t01-closure.md. No new runtime
or backend evidence inferred from static checks. No app/backend/RLS/harness/Edge
Function changes, installations, commits or push. T02 scope is in t02-scope.md.

## T01 / R02 temporary branding clarification - 2026-10-13

Owner instruction: `bballuy` is the internal name and temporary public brand/logo
wordmark until a final app name is chosen. Arcade / street basketball describes
the visual direction only. Requirements and A02 now distinguish those concepts;
product documentation, design guidance and the plan use the same decision.
R01 review notes flag its old naming as superseded while preserving its original
images/HTML. The pre-existing R02 visual-refinement section in spec.md is preserved.

Environment: Windows/PowerShell, Node 24.16.0, npm 11.13.0. Ran
`npm.cmd run harness:status`: SPEC-003 draft, T01 in_progress, T00 done.
Ran `npm.cmd run verify`: PASS, documentation (50 Markdown files / three specs),
client TypeScript and lint, exit 0. No harness or Edge Function changed.
Scope review: documentation only; no runtime copy, logo binaries, generated boards,
backend, dependencies, commits or push changed. No new device/visual acceptance
is claimed. T01 remains in_progress; next apply this naming to the requested R02
boards and obtain approval of the exact visual revision before implementation.

## T00 documentation baseline - 2026-10-13

Windows/PowerShell; existing working tree. Owner approved general planning direction
and authorized only documentation/registry in draft with mandatory UX/UI-only changes.
SPEC-003 absent from registry/folders before creation. Existing work is preserved.
Reviewed instructions/template/workflow, registry/tasks, frontend and architecture.
Initial harness: SPEC-001 verified; SPEC-002 in_progress with T06 todo.

No design assets, application changes, runtime/native acceptance, backend/RLS/data
operations, installs, commits or push. Static checks do not certify designs/behavior.
Validation results are recorded below after execution.

## Implementation gate ledger

- Complete SPEC-002 acceptance: NOT SATISFIED at baseline. Require verified registry,
  all tasks done and complete local/browser/iPhone evidence.
- Exact T01 design revision approved by owner: NOT SATISFIED. Record revision/date/scope;
  general direction approval does not qualify.
- Implementation authorization: NOT PROVIDED; current step is documentation only.

No T02+ while mandatory gates are unsatisfied, regardless of harness availability.

## Planned scenarios (not executed)

- A01/R01: scope diff, unchanged contracts/backend/RLS/tests and recorded gates.
- A02/R02: approved arcade design revision, contrast/font/license/component states.
- A03/R03: list-first/filter equality, rapid marker replacement, sheet/detail/back,
  filter removing selection, context return, location denial and web fallback.
- A04/R04: two-account join/leave/rejoin, repeated taps/lost reply/restart/A-B-A;
  activity freshness/error/closure, unknowns, organize shortcut and logout retry.
- A05/R05: existing full/past/started/cancelled details, participation/My sessions,
  timing split, organizer lifecycle, guests/accounts, result conflicts/history/replay.
- A06/R06: generic original placeholder, failed-photo fallback, provenance/rights/ID policy.
- A07/R07: VoiceOver/focus/close, keyboard/back/scaled text/narrow layout/safe areas,
  preference changes, interruption/frame diagnostics/background-loop stop.
- A08/R08: exact owner-approved design revision, reproducible browser/iPhone steps,
  expected/observed results/environment/limits; distinguish owner/agent observations.

No scenarios pass from file existence or static checks. No real photography,
attendance, retention, production readiness or native acceptance is implied.

## Executed documentation validation - 2026-10-13

T00 / R01,R02,R06,R07,R08: created six planning documents and appended SPEC-003
as draft without replacing existing registry entries. No existing specification or
application file was edited. Existing Git modifications predated this work.

- npm.cmd run verify:docs: PASS, 47 Markdown files and three specifications.
- npm.cmd run verify: PASS, documentation, client TypeScript and lint.
- git diff --check -- specs/registry.json: PASS; Git only warns about existing
  LF-to-CRLF normalization policy.
- Final documentation/status checks are run after this evidence/task update.

T00 is complete for documentation only. T01 remains todo; no visual designs exist
or are approved. SPEC-003 remains draft. Both implementation gates remain unsatisfied.
Client runtime/unit/backend/device suites were not rerun for this documentation-only
change; no new functional/performance acceptance is claimed. The harness generated
ignored .harness reports as normal check output, not application implementation.

## T01 R01 design presentation - 2026-10-13

Windows/PowerShell, existing dirty working tree preserved. Owner explicitly
authorized design-only T01 and Spanish initial UI. harness:status reports SPEC-002
verified with T00-T06 done; its acceptance evidence is historical, not rerun here.
T01 is in_progress pending exact owner approval. T02 remains todo and unauthorized.

R02-R08: review design-r01/review.html, review.md, courts.png and play.png;
static original image_gen boards plus supporting HTML compositions (not application
components), state annotations, alternative density/light direction, motion
storyboard, font/license options, contrast.json and generation provenance.
Reproduce by opening review.html with sibling images and reviewing review.md.
All session data is illustrative; court names preserve catalog records.

Observed: upstream Lexend/Teko/Barlow Condensed license text is SIL OFL 1.1;
exact font selection/bundled provenance remains pending. sRGB contrast ratios
are reproducible from contrast.json color pairs; meaningful control border and
white-on-orange failures were identified and rejected in design annotations.

Checks: npm run verify PASS (docs, client TypeScript, lint). No Edge Functions or
harness changed, so verify:edge/test:harness are not required by this change.
No client runtime, iPhone, VoiceOver, gestures, performance or backend acceptance
executed for these designs. Static green does not certify them. No functional code,
data, dependencies, commits or push changed. Owner R01 approval is NOT provided.
Next: owner reviews exact R01 visual scope/changes, then explicit T02 authorization.


Presentation preview limitation: Playwright could not open the static HTML because
its managed browser profile was already in use. Existing browser was preserved;
HTML rendering is not claimed as browser-verified. Raster boards were visually
inspected in the tool output. open_in_codex queued the review file for the panel.


## T01 R02 design-only refinement - 2026-10-13

Windows/PowerShell, existing dirty working tree preserved. Owner explicitly requested
R02 separate from R01: Courts, Play, Organize and annotated motion. Read README,
status/workflow, SPEC-003 and R01 constraints; harness reports T01 in_progress,
T02 todo and SPEC-002 verified. No final visual approval provided.

Review design-r02/review.html with sibling boards and storyboard.svg; compare R01
using embedded original image links. review.md records changes/limits, motion.md
records durations/behavior/interruption/reduced-motion for seven interaction groups
and organizer court selection. prompts.json records built-in generation provenance.
Session examples are synthetic. Court names/attributes derive from the local catalog,
not hosted parity. Raster typography approximates the proposed fonts.

Observed visual review: Courts shows the compact header, three distinct cards,
schematic map with exclusive selected ring, location control and smaller preview art.
Play generation initially drifted on 1v1 capacity and navigation; targeted correction
was requested to preserve 2/4/10 totals and the four existing tabs. Board findings
and any remaining raster deviations are documented in review.md before delivery.

Validation: npm run verify PASS (docs, TypeScript, lint) during preparation; final
check runs after artifacts/evidence are complete. No Edge Function or harness edits,
so verify:edge/test:harness are not required. No functional/runtime/backend/iPhone,
VoiceOver, motion or performance acceptance rerun. Static storyboard is not evidence
of implemented motion. No application code, RLS/backend, dependencies, commits or
push changed. R01 preserved. T01 stays in_progress awaiting final owner review.


Final R02 visual review: Organize corrected past date to Choose date/Choose time
placeholders, navy selected labels/checks and same-form Plan heading. All three
boards visually inspected in image output. Original art has symbolic format icons;
exact capacities remain in text. Chrome isolated file tabs rendered storyboard.svg
and loaded review.html; a full storyboard screenshot was inspected without clipped
rows. PNG export through the browser connector was unavailable due to its path
policy; SVG remains the standalone visual artifact, with inline screenshot reviewed.
This is artifact rendering evidence only, not client or animation acceptance.


Review HTML image check: all six image references loaded (three R02 boards, two
R01 references and storyboard); page width 1234 within 1249 viewport. Final
npm run verify PASS (53 Markdown files, docs/TypeScript/lint); docs/status.md
diff whitespace check PASS. Design artifact loading does not certify app behavior.


## T01 R02.1 targeted design review - 2026-10-13

Owner explicitly approved only the general R02 artistic direction (identity, navy,
orange, cream, original illustrations and sports-game component styling). Final
T01 revision approval is NOT provided. T01 stays in_progress; T02 unauthorized.
Owner requested four targeted corrections and three 3-4-frame visual sequences.

Windows/PowerShell; README/status/workflow, R02 documents and actual client organizer/
participation contracts inspected. Existing naming/documentation edits and R02
artifacts preserved. New folder design-r02-1/ contains only patches, not full redesign.
Review review.html, review.md, sheet.png, eligibility.svg, participants-dates.svg
and sequence-marker/format/registration.svg. Each sequence has four UI-state frames
plus duration, interruption and reduced-motion notes. Built-in image_gen edits only
the preview presentation; SVG UI diagrams are static design artifacts, no app code.

Rule findings: open/full differs from started/cancelled; already-registered players
may leave an open full session with confirmation. Only fresh consistent open reads
with available places can allow new join. Uncertainty blocks opposite action.
Now counts guests/playing organizer once; Plan occupies only the playing organizer
and adds no present-count field. Current defaults preserved. Planned sample is
20/10/2026 18:00 Uruguay (future relative to this review); started example has no
fabricated past schedule. All activity/participant values explicitly illustrative.

Preparation npm run verify PASS (docs, TypeScript, lint); final checks recorded after
artifacts. Isolated Chrome rendered marker sequence, visually inspected screenshot;
participant SVG DOM has no text outside its 1600x930 viewBox. No functional/native,
VoiceOver, actual 200% text scaling, animation, performance or backend acceptance.
No code/backend/RLS/harness/Edge Function edits; no commits or push. R02 remains
unchanged; scope records and design artifacts only. No tasks marked done.


Final R02.1 checks: npm run verify PASS (54 Markdown files; docs/TypeScript/lint).
docs/status.md diff whitespace check PASS. Review HTML reload loads all six artifacts
including corrected sheet; width 1234 fits 1249 viewport. Marker, format and
registration sequences were visually inspected as rendered four-frame SVGs.
Sheet raster was visually inspected; compact vs enlarged/reflowed proposal preserves
Close/View court and labelled generic media. Browser evidence applies to artifacts
only; no app/native accessibility or animation acceptance. Final approval pending.

Final T01 closure validation - 2026-10-13: npm run verify PASS (56 Markdown files,
docs/TypeScript/lint); git diff --check PASS; harness:status reports SPEC-003 ready,
T01 done and T02-T06 todo. approved-design.json records relative artifact paths and
SHA-256 for the exact approved R02/R02.1 package and authoritative annotations.
No application file was edited in this closure. Existing README/product/R01 naming
changes predated this turn and were preserved. No Edge/harness edits: verify:edge and
test:harness not required. Native/device/permission suites not rerun for doc closure.

Final T02 result - 2026-10-13: npm run verify PASS (58 Markdown files, client
TypeScript/lint); npm run test:client PASS 101/101 (94 baseline + 7 foundation tests);
node scripts/verify-presentation-assets.mjs PASS; git diff --check PASS. Client
checks passed after the final missing-media guard. Final native fixture transform
HTTP 200 (6,201,772 bytes). Gallery decoded all four instances: default, invalid URI
recovery, empty URI fallback and decorative character. Idle/busy height stayed 50px;
labelled radio groups expose checked state. Screenshot/DOM observations are local
browser evidence, not native accessibility or release performance acceptance.

T02 done; T03-T06 todo. Only final localhost gallery 8196 and Metro 8093 retained
for owner review; three stale preview helpers stopped. No dependency/lockfile,
backend/RLS/hooks/lib contracts, real entities, commits or push changed. Existing
owner changes preserved. No automatic T03 execution. No Edge/harness edits, so
verify:edge/test:harness not required for this foundation-only change.


## R03 visual fidelity design package — 2026-10-14

Design/documentation-only owner request. See [R03 design evidence](design-r03/verification.md),
[boards and proposed decisions](design-r03/README.md) and
[fidelity acceptance contract](design-r03/fidelity-contract.md). Five annotated
402 × 874 design boards plus shared visual states; two newly generated original
review illustrations; no runtime UI/contract/backend modifications. Native iPhone
comparison is not executed. T00–T04 history unchanged, T05 in_progress, T06 todo;
R03 unapproved and no implementation authorization. Local static result is recorded
in the R03 evidence after checks complete.
