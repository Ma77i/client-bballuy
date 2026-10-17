# My Courts fidelity correction — 2026-10-15

Owner approved Detalle and authorizes only Mis canchas now. R02/R02.1 and the
owner-approved implemented Canchas card are the visual reference. No independent
R02 My Courts board is asserted; no R03/new mockup/new asset. Existing local work
and approved detail must stay intact.

## Acceptance before implementation

- Use the existing illustrated CourtCard opt-in,116 pt art LEFT, real name and
  outlined Ver cancha RIGHT. Current saved query projects court ID/name only:
  no invented attributes/activity/statistics and no new read or contract.
- Remove oversized refresh and redundant body heading/intro; a labelled48 pt
  icon in the existing header calls the same refetch with busy feedback.
- Keep pull-to-refresh, initial loading, error/retry, account-isolated actual rows
  and exact existing detail/exploration navigation. No optimistic saved records.
- Empty state uses existing original T02 player art prominently, a short message
  and one Explorar canchas CTA. Navy/cream/orange/Teko/Lexend/shared tokens only.
- Verify, client tests, isolated browser/capture checks and explicit iPhone limits.

Do not modify Detalle, shared production components, hooks, business logic, backend/
RLS/contracts/dependencies or other screens. No Jugar work, commits/push/closure.

## Implementation inventory

- app/(tabs)/my-courts.tsx only production file changed. Uses illustrated CourtCard
  with showFacts=false and the existing saved-query name/ID projection, unchanged
  detail route. Removes large refresh/redundant intro; header title uses Teko and
  accessible heading, refresh uses existing quiet icon-only Button with Spanish
  name, busy feedback and48 × 48 hit. Adds8 pt right margin so focus ring fits.
- Pull-to-refresh still uses existing refetch/isFetching state and native control.
- Empty state uses existing original GenericMedia player at220 × 220, navy base,
  brief sports heading and one existing Explorar canchas action. No new art,
  mocked activity, count, photograph or profile/guest/social feature in product UI.
- Existing loading/error/retry branches retained. Current account's query remains
  the only list source. No hook/read projection/cache/isolation logic was changed.
- tests/browser/my-courts-fidelity.js: isolated actual-app browser test, transport
  simulation only, exact seed Palermo fields with a synthetic account existing
  only in a temporary browser context. No real account or backend mutation.

Docs: this scope/evidence plus SPEC spec/plan/verification and docs/status links.
Protected-file SHA-256 comparison confirms7 files unchanged: approved detail route,
CourtCard, CourtMembership, MembershipPanel, CourtActivity, courts hook, My Courts
loader. Prior dirty changes preserved. No shared source or other screen modified.

## Executed verification — 2026-10-15

Windows/PowerShell, SPEC-003/design, local Expo web on8091.

- npm run verify: PASS (89 Markdown files, TypeScript/lint, no warnings).
- npm run test:client: PASS109/109, including account-isolation/cache/session,
  saved-court/membership and presentation/motion regressions.
- Isolated browser suite:8 checks PASS with actual app and fully intercepted
  browser API transport; no real server-write or native acceptance claim.
- git diff --check: PASS (line-ending notices only).

Browser observations:

1. One simulated saved response renders only its real seed ID/name; shared116 pt
   illustration/name/outline CTA verified, no unavailable attributes/activity added.
2. Header refresh48 × 48; large Actualizar button absent.
3. Card opens the unchanged Detalle with exact court ID; back restores saved list.
4. Slow refresh exposes busy/disabled icon; repeated press blocked while fetching.
5. Empty confirmed response removes prior card and displays220 pt original player;
   Explorar canchas opens existing Canchas route.
6. Read error is distinct from empty; existing retry restores simulated saved rows.
7. Initial loading observed before saved rows return.
8. Width320 with reduced-motion media preference has no horizontal card overflow.
   Native font scaling, gestures, VoiceOver and actual frame timing remain untested.

A first browser assertion expected an error heading; the existing StateView exposes
an alert. Corrected the test selector without changing production semantics; final
complete suite passed. No failure was excluded. Test context closes in finally.
Reproduce by running tests/browser/my-courts-fidelity.js through Playwright's
browser_run_code_unsafe filename argument with the local Expo server on8091.

## Running-code screenshots and reference comparison

- [Populated](my-courts-fidelity-evidence/populated.png).
- [Empty](my-courts-fidelity-evidence/empty.png).

Actual browser app at402 × 874 with explicitly simulated transport; not new mockups
or actual iPhone/account data. The populated response is a test saved-state fixture,
not a claim about the owner's list. No fictitious data was added to runtime sources.
Inspected both for horizontal composition, original illustration prominence,
readable name/CTA, discreet refresh/focus and navy/cream/orange continuity.
Matches approved implemented Canchas card exactly by reuse. R02/R02.1 supply the
shared identity, not an invented independent My Courts board.

Differences/limits: My Courts projection lacks type/surface/activity so those fields
are omitted honestly. Existing256 px illustration masters are provisional; sharpness
at220 pt/3× needs native review. Browser OS/tab chrome/insets differ from real iPhone;
existing bottom-tab chrome was not changed in this task. Detalle owner approval is
recorded as approval, not as new execution of device/real-server tests.

## iPhone review pending

In Expo Go on iPhone16 Pro: open Mis canchas with actual saved rows, inspect art/name/
CTA and header refresh; refresh by icon and pull, open detail/back; on an account
with no saved rows check illustrated empty and Explorar canchas. Verify VoiceOver
labels/selected account isolation, enlarged text, safe areas, image sharpness and
Reduce Motion. Native gestures, real refresh errors and physical performance were
not executed here. Send a populated/empty screenshot when possible.

Stop for owner approval before Jugar. SPEC-003 remains in_progress, task registry
history unchanged, no commits, push, deployment or closure.

## Owner final approval — 2026-10-15

Owner explicitly authorized approval after two final changes and verification.
Added Guardá tus canchas favoritas para encontrarlas acá below the empty heading;
Explorar canchas now exact #FF8A43 with navy label (7.99:1). Existing Button gained
an optional foregroundColor override; no other caller behavior changed. Updated
browser suite8 checks PASS including exact CTA colors/copy and48 × 48 refresh
hit (exceeds44 × 44 requested). Presentation tests7/7 PASS. Mis canchas visual
correction is approved; no further visual work here. Native device checks not
executed are not retroactively claimed passed. SPEC stays open.
