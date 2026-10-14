# T01 closure — approved R02 + R02.1 — 2026-10-13

Owner approved the three R02.1 sequences and visual direction, then explicitly
authorized documentation-only T01 closure if five consistency checks passed.
All five pass for documented design/contract consistency. No implementation approved.
This record supersedes earlier pending-approval statements; original boards remain
historical artifacts. The approved basis is R02 art/navigation with R02.1 targeted
patches, authoritative annotations and existing SPEC-001/002 contracts. R01 supplies
unchanged supporting screen/state references, not pixel-perfect new approval.
Temporary brand is lowercase `bballuy`; Arcade is style, not public app-name suffix.

## 1 — Allowed invitation actions: consistent

Sources: SPEC-002 R02/R04; `lib/pickup/participation.ts` participationState;
`components/pickup/ParticipationControls.tsx`; R02.1 eligibility.svg/review.md.

- Open, available, not already registered: join only with a usable consistent read,
  initialized recovery state, no active/pending opposite operation and positive capacity.
- Full but open: no new join; already-registered player may leave with explicit
  confirmation. Full is occupancy, not a lifecycle transition.
- Started, cancelled or closed: no new join/leave. Readable direct details do not
  imply eligibility. Started activity is separate; cancelled is not public open discovery.
- Read failure/inconsistent roster blocks fresh operations. Pending request uses
  reconciliation even if lifecycle changed; this is not a fresh join/leave action.
  Actual current readback and server permissions decide the outcome of races/replays.

## 2 — Formats and participants: consistent

Sources: SPEC-002 R04/R08; `lib/pickup/organizer.ts` capacities/validateSessionDraft;
R02.1 participants-dates.svg and sequence-format.svg.

1v1/2v2/5v5 correspond to 2/4/10 total places. Guests already present and account
registrations share capacity; playing organizer counted once. Now requires integer
present count from Number(organizerPlays) through capacity. Plan occupies only the
playing organizer and does not add a present-count field. Match sides remain exactly
1/2/5 players with account/guest distinction. Defaults remain 2v2, plays, one present;
illustrative two-present state is edited input. Planned example 20/10/2026 18:00
America/Montevideo is future relative to this review. No new participant rules.

## 3 — Uncertain registration recovery: consistent

Sources: participation manager executeParticipation/load/send; useParticipation;
ParticipationControls saved-request branch; R02.1 sequence-registration/review.md.

Approved Spanish recovery action: `Reintentar comprobación`, with explanation
`Tu solicitud está guardada. Comprobá tu inscripción antes de cambiarla.`
This maps to existing Retry saved registration, not a new endpoint. Persist same
account/backend/session-bound UUID/action; replay then read current registration.
Busy blocks duplicates, pending blocks opposite action. Failed readback keeps request.
Only current-account readback allows current-state success, never the original receipt
alone. Retry remains meaningful after full/start/cancel because it reconciles a saved
operation, not permission to register anew. No optimistic confirmation.

## 4 — Motion does not govern state: consistent

Sources: design-system common policy/M04/M06 and R02.1 three sequences/review.md.

Action/state updates run immediately under existing logic; no timer/animation-end
callback gates network, selection, validation, busy state, eligibility or confirmation.
Presentation observes state. Network/readback durations remain variable, with no
artificial minimum. Latest selection wins interrupted motion. Reduced motion changes
decoration only. Confirmed check fades 180 ms after readback; cannot delay or invent it.
No per-frame requests, looped markers or animation-driven retries/polling.

## 5 — Accessible compact sheet: consistent as a design requirement

Sources: SPEC-003 R03/R07, design-system M02; R02.1 sheet.png/review.md/marker sequence.

Content-driven height, proposed 220–260 units at 390x844, never a fixed cap. Art yields
to enlarged text. Expand/reflow/scroll without clipped actions; safe areas and ≥48-unit
targets. Visible Close/View court, back/Escape and accessible list alternative; no
gesture-only interaction. Focus enters named title, modal background is isolated,
close restores trigger. Latest marker replaces one sheet; filter/account teardown
clears selection. Reduced motion opens immediately. Native implementation must handle
trigger unavailability by restoring focus to a logical surviving control.

This checks completeness/consistency of the accessibility design. VoiceOver, native
focus, actual 200% text, gestures and frame timing are NOT verified by static art.
Those acceptance checks remain with T03/T06; their absence does not block design-only
T01 closure and must never be reported as implemented accessibility acceptance.

## Approval and gates

T01 is done for design-only acceptance. SPEC-002 registry is verified and tasks
T00–T06 are done; existing closure-review/verification provide local/browser/owner-
reported iPhone evidence, not rerun here. SPEC-003 becomes ready for its planned
implementation sequence, not verified. T02–T06 remain todo. Implementation permission
is NOT provided; the next user decision is authorization of t02-scope.md only.

Typography approval covers sports title direction and Lexend content. Teko SemiBold
is the existing implementation candidate; exact font files, glyph coverage and bundled
OFL provenance are T02 asset-validation work. No claim that raster pixels are exact
fonts or licensed distributable artwork assets. If validation needs a visually different
font or new dependency outside scope, record the finding before changing that direction.

## Reproducible documentation review and limits

Windows/PowerShell on existing dirty tree. Read README/status/workflow; run harness
status; inspect the named source functions and R02.1 documents/artifacts; compare each
case above without altering code/data. Run npm run verify and harness:status after
documentation updates. Results are recorded in verification.md. No app/backend/RLS,
Edge Function or harness change, dependency installation, commit or push. No runtime
regression/device/permission suites claimed from this documentation-only review.
