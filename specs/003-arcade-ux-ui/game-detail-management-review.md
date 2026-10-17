# Game detail and management — pre-implementation review

Date:2026-10-15. Status: review/proposal only; application implementation NOT authorized
by this document. Owner formally approved Armar partido for both modes, retaining
physical iPhone picker/keyboard/safe-area/large-text checks,49 dependency alerts
(critical first) and future player invitations as separate pending work.

## Sources and scope

- Approved design-r02/play.png and the later owner-supplied R02 raster
  (play-r02-recovery-evidence/owner-reference.png), middle detail phone, and R02.1 eligibility and
  registration sequence. Read alongside later approved partido terminology,
  #FF8A43/navy CTA, current original art and no repeated illustration captions.
- Current app/pickup/[id].tsx, app/organize/[id].tsx, ParticipationControls,
  participation/organizer hooks and domain modules, current shared presentation.
- R02 does NOT include an independent organizer-management detail screen. Its right
  phone is personal sessions, not management. Management proposals below apply the
  existing approved vocabulary to existing functions; no invented approved board.
- No R03, new boards, art generation, dependencies, backend/contracts/RLS, source
  changes, real game writes or next-screen implementation authorized this turn.

## Public detail — observed differences and proposed corrections

1. Composition: current text-only status, format and court on navy, no illustration;
   R02 has original ball/hoop banner integrated with a cream information card and
   dominant format beside court/state. Propose reuse existing clean PlayArt crops
   and one integrated cream summary: large format, real court, small semantic tag,
   icon-led real schedule/availability/organizer. Later owner raster also groups
   format/court/time as labelled detail rows; these remain read-only, not new public
   editing controls. Original clean crop resolution
   limits persist; no substitute artwork or fictional participant metadata.
2. Actions: current TU INSCRIPCIÓN is a separate dark panel above organizer/count
   data; Inscribirme uses the older dark-orange/white default. Propose keep its
   existing component/handlers but compose it with the main detail card and use
   scoped #FF8A43/navy on eligible primary action. Preserve full/closed/read-error/
   roster-inconsistent/pending restrictions and exit confirmation. An owner may
   still have participation and management roles; do not automatically replace
   one capability with the other based on ownership alone.
3. Information: current organizer/availability/occupancy/notice, optional note and
   roster are separate padded blocks; format/court/title use similar stacked sizes.
   Propose compact hierarchy and clear 'N lugares disponibles · M en total' using
   confirmed server fields. Keep note, real roster and guest-vs-account distinction
   as secondary sections; R02 raster omission does not authorize removing them.
   Registration/presence/started report never imply actual physical attendance.
4. Copy/status: current titles/buttons/errors still say convocatoria and feminine
   state labels, with plain orange state copy. Propose partido consistently in this
   scope, green Abierto/blue Iniciado and differentiated Completo/Cancelado/Finalizado,
   reusing approved sportsSessionStatus rather than changing global helpers/callers.
   Keep Inscripción no confirma asistencia and No reserva la cancha concise/nearby.
5. Context/navigation: existing owner-only management and real-court detail routes
   remain; reorganize their emphasis without changing routes/IDs or navigation.
   Compact update/readback indication, distinct retry and stale-data messaging stay.

## Management — observed differences and proposed corrections

1. Summary: current text title plus repeated court/date/count in a large cream block,
   no original art. Propose the same integrated detail summary pattern with organizer
   context, original art and actual state, schedule, capacity and note. No new stats,
   player search, invitation controls, result or attendance claims.
2. Actions: current vertically stacked full-width start/edit/cancel/create-another/
   return/register actions have weak grouping. Propose state-dependent primary
   Iniciar partido or Finalizar partido, secondary Editar/Registrar/Armar otro and
   clearly separated destructive Cancelar partido. Preserve all existing role gates,
   confirmation bodies, pending locks, rejection/replay/readback and real transitions.
   Full capacity is not a lifecycle closure; do not disable valid organizer actions
   simply because all places are occupied.
3. Editor: existing large court radio rows, default non-illustrated format controls
   and manual date/time fields contrast with the just-approved creation UX. Propose
   reuse compact Dropdown, opt-in illustrated FormatChoices and PlannedSchedule
   only when editCore permits changing those fields. Description-only locked editing
   remains; do not enable core fields after server core_locked. Preserve existing
   saveEdit behavior: changing a note on an elapsed planned game need not reprogram
   the unchanged schedule, and opening an editor must never silently adjust its date.
4. Feedback/copy: current success/confirm/error/lifecycle text says convocatoria;
   several notices repeat the same conditions. Propose concise partido copy and
   contextual notices, preserving that start closes registration/exit and finalizing
   neither records a result nor confirms attendance. Registration/match-recording
   entry routes retain exact current params, including sourceId.
5. Layout/accessibility: editor uses hardcoded96 keyboard offset and fixed bottom
   padding; proposed reuse of approved creation policy (Expo Router header height,
   one keyboard-avoidance mechanism, safe bottom inset, scroll/reflow). No new native
   validation is implied. Existing navigation back icon behavior remains unchanged.

## Functional inventory to preserve (not a new product specification)

Inspected code and isolated read-only browser checks confirm client presentation:
- open/nonjoined/available: join offered only with usable consistent read and ready
  operation state. Busy/pending manager locks remain; no optimistic confirmation.
- open/full: nonjoined join disabled; already registered can still request exit with
  confirmation. Capacity2/4/10 unchanged. Full never auto-starts/finishes a game.
- started/cancelled/completed: detail remains readable; no join/leave. Started is a
  report, not attendance; elapsed planned time does not automatically start anything.
- Organizer controls: open permits current start/cancel/edit; started permits current
  finalize and match-recording entry; completed retains match-recording entry;
  cancelled has no new lifecycle control. Unlocked core vs description-only editor
  is determined by existing managementActions/core_locked, not new visual heuristics.
- Same account/command/UUID recovery and fresh server readback remain in hooks/domain.
  The future invitation feature is not the current anonymous present guest place.

Additional static observation, NOT a demonstrated defect or a proposed silent logic
change: public participation explicitly disables actions while detail refetches;
management's disabled expression gates action readiness/busy/pending but not the
cached query's isFetching flag. Server still decides races. Preserve current rules
in a visual pass and assess refresh/race behavior explicitly during later authorized
functional regression; any behavior adjustment must be separately explained.

## Proposed implementation file scope — awaiting approval

- app/pickup/[id].tsx: public composition/copy/layout only.
- components/pickup/ParticipationControls.tsx: detail-only caller, present existing
  state/handlers in new grouping; keep pending/leave/readback behavior.
- app/organize/[id].tsx: organizer presentation and editor adapters, preserve handlers.
- Optionally a single components/pickup/GameSummary.tsx shared by these two routes,
  only if needed to avoid duplicate approved summary markup; no parallel design system.
- Reuse PlayArt, sportsSessionStatus, Dropdown, illustrated FormatChoices,
  PlannedSchedule and shared foundations. Do not restyle global defaults or approved
  creation/Play/court/My Courts/Profile. No new asset or dependency planned.
- Later interaction tests and evidence documentation as relevant, not implemented now.

Recommended execution gate after approval: public detail first, owner visual review,
then organizer management. No automatic advancement or T05/T06/SPEC closure.

## Observed baseline and limits

Actual Expo web read-only review at localhost:8090, isolated simulated auth/catalog/
roster/owned rows,402x874, Spanish/Montevideo context. Six grouped checks passed:
open eligible join; full unjoined disabled vs joined allowed exit; started/cancelled/
completed read-only registration; owner open controls/locked editor; unlocked editor
with current manual fields; started/completed match-recording entries. No submit,
join, leave, lifecycle, edit save or real backend mutation performed; attempted
writes counter0. These observations do not verify remote authorization or native UI.
The earlier8092 preview timed out; used existing local-device preview8090 without
changing its environment, creating accounts or touching the owner's phone session.

Actual current implementation captures, not new designs and not proposed mockups:
[public open](game-detail-review-evidence/public-open.png),
[public full](game-detail-review-evidence/public-full.png),
[management open](game-detail-review-evidence/management-open.png),
[locked editor](game-detail-review-evidence/management-edit-locked.png),
[unlocked editor](game-detail-review-evidence/management-edit-unlocked.png).
Synthetic names/dates/counts only in isolated transport/captures; no product fixtures.
No native device/VoiceOver/keyboard or new remote-schema verification executed.
Local documentation/static/unit baseline results recorded below after execution.

Baseline controls: npm run verify PASS (documentation/typecheck/lint); npm run
test:client PASS116/116. No source changes or new functional implementation. Browser
fixture for unlocked edit uses organizer-not-playing with zero occupied places;
full joined detail includes both organizer and viewing participant, so review does
not rely on inconsistent synthetic occupancy. Native/device and remote server
permission checks remain unexecuted. Proposal remains awaiting owner authorization.


## Authorized narrow refinement

The owner reviewed both screens on iPhone and did not grant visual acceptance. Implement the existing R02 art header, compact real session summary and secondary actions, compact participant rows, masculine game terminology, and one navigation back control. Preserve all action predicates, confirmations, server readback, editor validation and routes. Native screenshots of both screens are required after local checks; SPEC-003 remains open.


## Implemented refinement and verification

Visual acceptance is pending owner review of fresh iPhone screenshots of **both** screens. SPEC-003 and T05 remain open.

- Both screens now reuse `GameSummary`, the existing authorized R02 header crop, cream summary, prominent format, court, state badge, schedule and actual occupied/available counts. Unknown state presentation remains unavailable.
- Management groups lifecycle/edit/cancel controls, retains confirmation and saved-request recovery, and removes the loaded screen's duplicate back button. The native header and error-route recovery remain. Empty action cards are omitted for terminal states.
- Public detail promotes the organizer-only management CTA above participation, uses compact identity/type rows, groups organizer notes and warnings, and makes court navigation quiet. No participant identities or guest distinctions were removed.
- Visible copy uses partido, including scoped error translation. Internal identifiers, routes, hooks, predicates, capacity rules, editor validation, mutations and contracts are unchanged. No new dependency or backend change.
- Files: `app/organize/[id].tsx`, `app/pickup/[id].tsx`, `components/pickup/ParticipationControls.tsx`, `components/pickup/GameSummary.tsx`, `components/pickup/detail-copy.ts`, and reproducible browser scenario `tests/browser/game-detail-refinement.js`.

### Executed checks

- `npm run test:client`: 116/116 passed, including existing eligibility, lifecycle, replay, capacity and account-isolation coverage.
- `npm run verify`: documentation, TypeScript and lint passed; the initially observed unused import was removed before the final rerun.
- Browser: real Expo web UI at localhost:8090, isolated 402 × 874 viewport, es-UY / America/Montevideo, synthetic intercepted transport. Open join enabled; full unregistered join disabled; full registered exit retained; started/cancelled/completed no join/leave; owner management entry; lifecycle confirmation dismissal; no duplicate loaded back; locked editor note-only; unlocked editor fields; started completion/registration and completed registration. Zero attempted backend mutations. This is not a live creation/lifecycle transaction test.
- Captures: [management](game-detail-refinement-evidence/management-open.png), [public detail](game-detail-refinement-evidence/public-open.png), [owner detail](game-detail-refinement-evidence/public-owner.png), [participant rows](game-detail-refinement-evidence/participant-rows.png), [full state](game-detail-refinement-evidence/public-full.png), [locked editor](game-detail-refinement-evidence/management-edit-locked.png), [unlocked editor](game-detail-refinement-evidence/management-edit-unlocked.png). All data in these browser captures is explicitly synthetic test transport, never added to application seed/runtime data.

### Remaining fidelity and native limits

R02's ball/hoop crop is reused as supplied, retaining its original resolution and contain fit. Real roster, freshness, organizer controls and safety warnings require additional content absent from the illustrative board. There is no independently approved management board; management reuses approved detail patterns. The original editor remains functionally unchanged, including manual fields. Native typography, safe areas, VoiceOver, large text, scrolling and final proportions require new iPhone screenshots and hands-on validation. Browser screenshots do not grant visual acceptance. No other screen is authorized next.


## Game detail and management visually approved — 2026-10-16

Owner approved both current screens; this supersedes earlier pending visual approval.
No redesign or application change. Thirteen isolated browser state/recovery groups
and 116/116 client tests passed; local verify passed. Native functional/accessibility
and live server permission checks were not rerun. Three nonblocking polish items
(cancel distinction, 24-hour display evaluation, confirmed-registration indicator)
remain recorded in [acceptance and limits](game-state-acceptance.md).
SPEC-003 stays open, T05 in_progress, T06 todo; no commits/push or next-screen work.
