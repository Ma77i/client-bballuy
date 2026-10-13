# SPEC-003 - Verification

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

