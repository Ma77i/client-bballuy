# Armar partido R02 fidelity correction — 2026-10-15

## Acceptance before implementation

Owner approved Jugar visually with three minor pending items (header integration,
availability wording, full-game behavior) and authorizes only the existing creation
flow. R02/organize.png and R02.1 rules are authoritative; R03 discarded.

- Compact ARMAR PARTIDO header, original available R02 sports art, navy/cream/orange.
- Compact real-court selector and illustrated format tiles with immediate checked
  selection, capacities2/4/10, same default2v2; selection never submits/navigates.
- Jugar ahora keeps the existing quick route; Planificar expands date/time locally.
  Initial timing remains unselected. Mode is not a game lifecycle state.
- Quick setup and planning preserve their actual participant/note inputs, existing
  count bounds/defaults, court/date/time validation and account-bound saved requests.
- Quick already accepts a missing court from the approved Jugar dock but had no
  editable court control; expose the same existing draft.courtId in the compact
  selector to satisfy required-field validation, without changing creation contracts.
- Reuse existing Choice/Button/Field/Dropdown/PlayArt and motion; any illustrated
  FormatChoices branch must be opt-in, preserving match/edit callers.
- Exact #FF8A43/navy Armar partido CTA, busy/duplicate guard, server readback before
  existing success navigation. Pending requests retain Reintentar comprobación,
  restored immutable inputs and original UUID replay; no new confirmation fiction.
- Preserve navigation, keyboard/safe areas, accessible targets, readable large text,
  explicit selected state and reduced motion. No new art/dependencies/backend rules.
- Verify/client plus actual browser evidence of both modes, validation, error,
  pending/busy/recovery and success under explicitly isolated simulated transport.
  Actual iPhone review remains required; no next screen or SPEC closure.

## Source comparison and deliberate adaptations

Original R02 first phone has illustrated header, stacked court choices, three
vertical illustrated format tiles and two timing choices. User explicitly replaces
court-choice stack with compact selector and visible copy with partido. Second
phone keeps immediate setup, participation/present count/note; third reveals planned
date/time with no present-count input. Original synthetic description max140 is not
contract truth: existing500 maximum remains. Original player silhouettes/header
athlete are not independent runtime assets; reuse the already available original
R02 ball/hoop crops and existing fonts instead of generating substitutes.

Implementation and verification evidence to be recorded after execution.

## Implementation and evidence

Environment: 2026-10-15, Windows, SPEC-003/design, existing local changes preserved.
Jugar's explicit visual approval and three minor follow-ups are recorded in
[its approval section](play-fidelity-correction.md#owner-visual-approval--2026-10-15).
Those follow-ups were not modified or declared functionally accepted this turn.

Files changed for this screen:
- components/pickup/CreateInvitation.tsx: compact illustrated header, compact court
  selector, mode/participation cards, compact actual fields, orange/navy submit and
  Spanish partido copy. Original handlers/defaults/validation/submission/replay kept.
- components/pickup/FormatChoices.tsx: opt-in illustrated format cards, checked text/
  border, real capacities and accessible targets. Default branch used by management/
  matches retains prior styling/selection behavior. Shared selection motion observes
  immediate state; it never schedules state or a request.
- tests/browser/organize-fidelity.js: isolated actual-app interaction evidence.
- This document, task evidence link, verification/plan/status, and Play approval note.
No new image/dependency/domain hook/backend/schema/RLS change. Reused approved R02
PlayArt component and bundled crops without editing them.

### R02 comparison, element by element

- Header: compact brand + ARMAR PARTIDO + short purpose and original orange art;
  current ball/hoop crops replace the board's athlete because only existing available
  resources are authorized. Existing Teko/Lexend remain; no new font or artwork.
- Court: owner-requested compact cream selector replaces three stacked court cards;
  options remain real catalogue rows/IDs. Quick uses the same draft field/validation
  when arriving without a selected court from Jugar.
- Format: three cream vertical sports tiles, art above format/capacity, selected
  orange outline and checked footer, adapting R02 hierarchy rather than a button grid.
  Artwork is ball/hoop rather than the board's unavailable independent silhouette
  layers; it does not claim player identities or occupancy. Existing2v2 default stays.
- Timing: two cream icon cards. Neither initially selected; Jugar ahora retains the
  existing quick route and carries court/format. Planificar stays selected while its
  date/time fields expand locally. Quick has an explicit mode/format/capacity summary;
  a selected mode is not labelled started/open/completed.
- Participation: two cream icon choices Juego/Solo organizo; actual present count
  only in now mode, future occupancy only counts a playing organizer. No user search,
  invitation acceptance or guest-management capability added.
- Fields: actual existing text date/time controls retained, not new native picker
  integrations. Existing tomorrow18:00 draft default and500-character description
  retained; illustrative140-character label and sample counts in R02 are not rules.
- Layout: all initial court/format/timing controls remain editable in planning,
  per subsequent approved functional decision, so planning is taller than the
  board's condensed-summary third phone. Scroll and keyboard clearance retained;
  large text wraps/stacks instead of enforcing a raster's fixed height.
- Submit: exact #FF8A43/navy Armar partido; pending keeps Reintentar comprobación.
  Confirmation still requires real-current-account server readback in unchanged
  hooks; animations never gate or simulate completion. No initial submit before
  timing selection, matching existing flow and approved R02 initial-state decision.

### Executed verification

- npm run verify: PASS docs, TypeScript, ESLint.
- npm run test:client: PASS111/111, including organizer validation/capacities,
  saved-request replay/uncertain readback/identity and presentation regression tests.
- Actual Expo web browser at localhost:8092, isolated context402x874; five grouped
  checks in tests/browser/organize-fidelity.js PASS:
  1. Default2v2; immediate1v1/2v2/5v5 selection,2/4/10 labels,>=48pt format targets,
     no selection write/navigation; missing court blocks quick; valid quick route
     carries exact selected court/format, and back restores initial form.
  2. Plan reveals date/time and no present-count; invalid calendar date blocks write;
     Solo organizo in5v5 shows10 available; exact orange CTA observed.
  3. Simulated server rejection recovers; busy disables duplicate submit; uncertain
     readback stays on form with locked fields; retry reuses original UUID; success
     navigation only after readback. Three simulated RPC attempts here: rejected,
     successful-write/failed-read, same-UUID confirmation replay.
  4. Quick court selection works without input date/time; Juego counts organizer once,
     Solo organizo removes that place; count5 invalid for2v2; count2 confirms existing
     now creation. Fourth simulated RPC attempt, no real backend write.
  5. Court loading/error/retry,320pt viewport, reduced-motion preference, doubled CSS
     text stress with no horizontal overflow. Not a physical Dynamic Type test.
- Screenshot inspection caught transient modal fade in initial captures. Capture
  helper now waits for picker dismissal before recording; final captures are settled.
- First server launch inside restricted environment did not accept local sockets;
  locally approved elevated preview on8092 allowed browser checks. No dependency
  updates were applied despite informational Expo updater messages.
- Approved Play files, My Courts/detail, organizer domain hook/module and existing
  management/match screen sources compared with start-of-turn hashes: unchanged.

Browser test uses simulated auth/catalog/RPC/readback only, no actual QA account or
backend mutation. It proves client interaction/recovery under those responses, not
remote schema compatibility, permissions or a new native acceptance.

### Actual implementation captures

Test selection in initial capture ends on5v5; that is an edited test state, not a new
default. Dates/counts in captures are isolated test inputs, never added app fixtures.

- [Initial](organize-fidelity-evidence/initial.png)
- [Planificar, upper controls](organize-fidelity-evidence/planned.png)
- [Planificar, fields and submit](organize-fidelity-evidence/planned-submit.png)
- [Jugar ahora, upper controls](organize-fidelity-evidence/quick.png)
- [Jugar ahora, fields and submit](organize-fidelity-evidence/quick-submit.png)
- [Uncertain request](organize-fidelity-evidence/pending.png)
- [Narrow](organize-fidelity-evidence/narrow.png)
- [Text stress](organize-fidelity-evidence/text-stress.png)

Captures are actual browser implementation, not new boards or native screenshots.
Original art has the already documented flattened-R02 crop resolution limitations.

### iPhone review gate — pending, not executed

On iPhone16Pro/Expo Go: open Armar partido from Jugar, check header, compact court
picker and three illustrated modes. Select each format and verify2/4/10, then select
a real court. Jugar ahora must open its existing setup; Planificar must expose only
its proper fields and preserve editable initial choices. Check Juego/Solo organizo,
invalid/valid date/time/count and both CTAs. Test creation only in an authorized test
environment; no real session was created by this browser evidence. Review keyboard
avoidance, scroll to final submit, VoiceOver selected/focus return, larger iOS text,
Reduce Motion and safe areas. Provide captures before any next screen.

Physical native motion/focus/keyboard/performance/creation remain unverified. No
claim of native acceptance, SPEC closure or complete T05 acceptance. T05 remains
in_progress, T06 todo; stop here for owner review. No commit or push.

## Owner composition approval and targeted usability work — 2026-10-15

Owner approves the current Armar partido composition and requests native schedule
controls, compact confirmation format, shorter help, keyboard/CTA checks and a
future-invitations planning note only. See [current scope and evidence](organize-usability.md).
Earlier manual-date-field adaptation is superseded by this explicit request;
no new design reference, next screen or full native acceptance is implied.
