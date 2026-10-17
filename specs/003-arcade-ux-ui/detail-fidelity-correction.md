# Court detail fidelity correction — 2026-10-15

Current presentation: the owner-corrected image reference and latest implementation
section at the end supersede earlier composition descriptions.

Owner authorizes only Detalle implementation, preserving all earlier local work.
R02/R02.1 and T01 closure are authoritative; R03 rejected, no new board/design.
Inspected original R02 courts.png, R02.1 sheet.png and unchanged R01 courts.png
(detail support retained by T01 closure). R02 itself does not contain an independent
new detail composition. Later owner decisions supersede the old community wording,
primary save button, repeated captions and physical/attendance implications.

## Acceptance for this correction

- Main cream SOBRE LA CANCHA card: prominent existing original illustration,
  real name/type/surface/lighting/notes, compact sports hierarchy and soft borders.
- One connected action area in that card: primary Armar partido opens the exact
  existing organizer route with real court ID; secondary existing save/remove
  control retains hook, confirmation, pending/read/write errors and replay.
- Secondary Ver ubicación en el mapa keeps existing dismissTo /map parameters,
  centering and selected marker; coordinates remain secondary, no invented address.
- Reported activity stays in a separate section, uses existing server reads and
  truthful timestamps/errors/retries/attendance caveats. No occupancy inferred.
- Existing provisional local art only, no photos/new assets, no repeated visible
  illustration disclaimer. Accessible generic-image explanation remains available.
- Reflow/scroll at large text,≥48 pt action targets, existing reduced-motion tools.
- Verify and client tests; actual running-code captures and reference comparison;
  native owner review pending before further screen changes.

No map/sheet/contract/backend/RLS/dependency changes or business logic changes;
no commits/push/SPEC closure. Historical task registry remains unchanged.

## Implemented files

- app/court/[id].tsx: main cream SOBRE LA CANCHA card,156 × 156 original T02
  illustration, real name/attributes, secondary location/coordinates/notes, one
  connected action area with primary Armar partido and embedded save/remove.
  Navy page and separate raised-navy reported-activity section. Uses existing
  Panel/Button/GenericMedia/tokens; no parallel component/style system.
  Physical information stacks when fontScale≥1.5 or viewport width<360.
- components/courts/CourtMembership.tsx: presentation-only embedded option passed
  to the existing MembershipPanel. Hook and all callbacks remain unchanged.
- components/courts/MembershipPanel.tsx: embedded mode removes the independent
  outer panel and introductory paragraph, inherits cream surface, uses compact
  secondary status/action. Existing default presentation and every pending/error/
  retry/confirmed branch retained. No membership-state or confirmation changes.
- components/pickup/CourtActivity.tsx: forwards its existing arcade flag to the
  existing SessionCard so detail activity uses the existing Spanish arcade
  presentation and reported-attendance caveat. Same filter/read/retry/timestamp.
- tests/browser/detail-fidelity.js: replayable isolated browser integration checks
  of the actual app with fully intercepted auth/catalog/membership/activity transport.
  Uses exact Palermo seed fields; synthetic identity exists only in its temporary
  browser context. No account created, real token used or backend write performed.

Earlier local Courts/auth changes preserved. No new asset/font/dependency, map or
sheet change, domain hook/controller/contract/schema/RLS modification.

## Reference comparison

Reviewed R02/courts.png, R02.1/sheet.png and R01/courts.png detail support retained
by T01 closure. Restored: original illustrated emphasis, grouped physical facts,
connected save/organize actions and separate reported-activity block; navy/cream/
orange with Teko/Lexend, no repeated image disclaimer. Later approved adaptations
are intentional: navy page with cream main card, SOBRE LA CANCHA title, save/remove
terminology, orange Armar partido primary, secondary confirmed save/remove, current
location handoff and compact accessible reflow. Not R03 and not a new design board.

Remaining differences: the existing T02 generic art is the provisional ball/hoop
resource, not the exact textured/halftone crop embedded in the raster; no replacement
created. Readable actual labels/state recovery can change height relative to the
illustrative raster. Native font metrics, safe areas and image sharpness at156 pt
are not yet measured. No pixel-perfect or native acceptance claim.

## Executed verification — 2026-10-15

Windows/PowerShell, SPEC-003/design, Expo web at localhost:8091.

- npm run verify: PASS (88 Markdown files, client TypeScript/lint, no warnings).
- npm run test:client: PASS109/109 including membership duplicate protection/
  readback/retry, catalog/location handoff and reduced-motion regressions.
- git diff --check: PASS; only normal LF/CRLF notices.
- Browser integration:10 checks PASS, actual application in a separate temporary
  browser context; all auth/rest transport fulfilled by the test. This validates
  UI/state handling, not new real-server membership or native map acceptance.
  Context is closed even on failure; no persisted test account/back-end mutation.

Observed browser checks:

1. Exact seed Palermo fields, one principal physical/actions card, separate empty
   activity statement explicitly says absence of reports does not mean empty court.
2. Simulated add→remove→re-add yields exactly three successful simulated writes
   and each action waits for confirmed simulated readback.
3. Delayed change shows disabled busy control; failed change exposes retry of same
   operation, hides opposite control; retry reconciles existing state flow.
4. Armar partido opens existing /organize/create with the same courtId; back restores.
5. Location action uses existing handoff and selects Mapa on web. Web does not render
   native marker/sheet, so camera/selection/gestures are not newly verified here.
6. Personal read error hides stale save/remove; retry restores confirmed simulated state.
7. Delayed catalog read displays Cargando cancha before the ready state.
8. Catalog error is readable and retry restores detail.
9. Activity error/retry stays independent from physical information.
10. Width320 reflows illustration/facts vertically and keeps actions scrollable.

Early browser attempts entered before hydration completed; the test now waits for
existing auth/UI readiness before filling the isolated form. Final complete rerun
passed. No production auth change was needed.

Reproduce: start the existing local Expo web server on8091; run
tests/browser/detail-fidelity.js with the Playwright browser_run_code_unsafe filename
argument. The script contains only obvious non-working simulation credentials and
closes its private context. No real account credentials are required.

## Actual running-code captures

- [Detail at402 × 874](detail-fidelity-evidence/detail.png).
- [Narrow reflow at320 × 874](detail-fidelity-evidence/narrow.png).

Both are inspected browser screenshots of production components with explicitly
simulated transport and the exact existing court data. They are neither mockups nor
iPhone captures. Empty activity is a test response, not a claim about live Palermo.
No fabricated participant/game/statistic is introduced into the app or screenshot.

## iPhone review — pending owner execution

Open an existing court from Canchas in Expo Go. Check:

- Illustration prominence/readability and real facts at default text size.
- Armar partido remains primary and opens the existing flow for this court.
- Add/remove/re-add confirms actual account/server state; busy/retry behavior works.
- Location returns to the actual map, centered on that court with its marker selected.
- Reported activity/timestamp/caveats are separate from physical facts.
- Large system text reflows without clipping, all actions scroll into reach.
- VoiceOver headings/action labels/focus, native back/context, Reduce Motion.

Send a default-text screenshot and, if possible, one with enlarged text. Native
gestures/focus/performance and actual account writes remain unexecuted in this step.
Stop before Mis canchas or any next screen. SPEC-003 stays in_progress, historical
task statuses unchanged; no completion, commit or push.

## Owner compact refinement — 2026-10-15

Before implementation: use compact attribute label/value hierarchy aligned with the
156 pt illustration at normal text size, with natural growth for long names/large
text. Replace the large outlined location button with a quiet intrinsic-width link
(minimum48 pt target), remove visible coordinates only. Embedded membership normal
state shows only Agregar a mis canchas / Cancha agregada. The latter remains the
existing remove action, with an explicit accessible removal hint; preserve busy,
error/retry and server-confirmed state. No data/map/domain changes.

## Owner corrected visual target — 2026-10-15

Owner supplied owner-reference.png and explicitly replaced the previous proposed
detail composition. Implement cream page/name/landscape hero; compact navy physical
attribute block; cream grouped actions (orange saved-court control, outlined existing
organizer action); separate navy reported activity. Keep recent accepted copy
Cancha agregada/Agregar a mis canchas, no visible coordinates, quiet location action,
existing route/selection/readback and report caveats. Do not restore community copy
or invent the reference ellipsis action. Existing provisional art only: panoramic
container can differ from the supplied court-scene illustration until an approved
standalone asset exists. Reference is owner-provided, not a new generated mockup.

## Owner-reference implementation and final checks

Implemented the corrected image composition, retaining actual product semantics:
cream page/navigation header; court name above a wide original-art container; one
small generic-art disclosure under the hero (not repeated in components); navy
SOBRE LA CANCHA with consistent outline icons and muted label/white value rows;
quiet48 pt location link, no visible coordinates; cream grouped actions with orange
Agregar a mis canchas / Cancha agregada and outlined Armar partido; separate navy
activity panel with white sports heading/icon and existing timestamp/caveats.

Cancha agregada still invokes the existing removal callback and has an explicit
accessible removal hint. There is no extra Mis canchas heading or normal-state
status paragraph. Busy/errors/retries remain visible only when relevant.
No invented community/ellipsis action or fake lighting/surface/address.

Files additionally adapted in this refinement:

- app/court/[id].tsx: corrected owner composition and previous requested reductions.
- components/courts/MembershipPanel.tsx: compact-only labels and orange save control.
- components/foundation/Primitives.tsx: optional Button accessibilityHint; defaults
  unchanged, makes the selected save control's removal behavior explicit.
- components/foundation/GenericMedia.tsx: optional height defaults to size, permits
  wide detail container without changing other current callers or source/fallback.
- components/pickup/CourtActivity.tsx: white heading and icon to match navy reference.
- tests/browser/detail-fidelity.js: selectors updated to latest approved labels;
  same isolated transport simulation, no backend writes.

Owner reference is [the supplied image](detail-fidelity-evidence/owner-reference.png).
Current [default screenshot](detail-fidelity-evidence/detail.png) and
[narrow screenshot](detail-fidelity-evidence/narrow.png) were regenerated from actual
code with the same disclosed transport simulation. No new board or asset was generated.

Final local verify PASS and109 client tests PASS;10 browser integration checks
PASS after the corrected composition, including simulated add/remove/re-add, pending
blocking/retries, organizer courtId/back, location mode, catalog/activity recovery.
The upload correction supersedes the previous orange-organizer arrangement; the
new orange-save/outlined-organizer hierarchy follows the supplied image.

Remaining differences: provisional hoop/ball artwork is not the court landscape
embedded in the supplied image. Data is seed Palermo in the isolated test, not
the reference's Parque Rodo. Accessible48 pt hits, actual report caveats and large
text can require more vertical scrolling than the compressed reference. Native
VoiceOver, text scaling, safe areas, image sharpness and real-server operation
acceptance remain pending the owner's iPhone review. Stop here without further
screens, task closure, commits or push.

## Owner typography/navigation rule — 2026-10-15

Before implementation: retain one centered Canchas header, icon-only back controls
through shared navigation/Button presentation, with existing accessible labels and
callbacks. Orange filled buttons use white labels and an accessible darker orange
action fill; brand orange remains the decorative identity. Increase detail text
line height, sentence-case aligned Sobre la cancha / Actividad reportada headings,
remove visible illustration disclosure. Preserve generic-image accessible text
and all state/navigation/data behavior. Shared presentation changes are explicitly
authorized by the owner universal button/back rule, not a next-screen redesign.

## Final typography/navigation refinement evidence

Implemented one centered Canchas title and minimal native back display at the root
Stack and detail. Shared Button renders existing Volver/Back actions as icons only
while preserving accessible label, callbacks, disabled/busy state and≥48 pt hit.
No routing behavior change.

Shared primary buttons/filled selectors now use white label/icon on orangeAction
#BA4300, tested≥4.5:1 against white; bright #FF8A43 remains brand/decorative orange.
Outline buttons and non-filled controls keep their surface-specific label colors.
This shared rule was explicitly requested for all orange/back buttons, not a new
redesign of the other screens. Main physical rows now use24 pt line height and
8 pt vertical padding. Sobre la cancha and Actividad reportada use26/34 Teko,
sentence case and the same left inset. Visible illustration disclaimer removed;
accessible generic-art explanation retained. No coordinates or extra saved-state
paragraph restored.

Changed presentation files in this refinement: app/_layout.tsx, app/court/[id].tsx,
components/foundation/Primitives.tsx and styles.ts, constants/design.ts,
components/pickup/CourtActivity.tsx; contrast assertion in presentation.test.cjs
and render assertions in tests/browser/detail-fidelity.js. Existing local work
retained; native map/camera/sheet/backend/domain code untouched.

Verify PASS; client109/109 PASS. Updated isolated browser suite11 checks PASS,
including visible single header, white button text, aligned sentence-case headings,
absence of disclosure and all previous navigation/state/retry checks. Render check
counts visible labels only because the navigator retains hidden earlier screens.
Regenerated actual browser captures reflect this version; transport remains
explicitly simulated. Actual iPhone native back-label behavior/VoiceOver and large
text remain pending. No commits, push, closure or further-screen progression.

## Owner action/header/activity refinement — 2026-10-15

Before implementation: keep approved cream background, existing art/physical card,
map handoff and behaviors. Integrate name/art in the existing header View with
4 pt internal gap, no extra card. Armar partido first/primary with exact system
#FF8A43; saved-court action secondary soft outline, labels Agregar a mis canchas /
Quitar de mis canchas. Keep prior white-label rule; white on this exact requested
orange has2.21:1 contrast and is recorded as unresolved accessibility debt rather
than claimed compliant. Do not change global tokens/other screens to resolve it.
Compact only the arcade detail activity copy/spacing; keep actual checked time,
stale/error/retry, and explicit no-reports≠empty-court caveat.

## Final owner-approved cream/header/action refinement — executed

Cream background explicitly provisionally approved and left unchanged. The existing
name/art header wrapper now includes both with4 pt internal gap; no additional
card, image, overlay or decorative asset introduced. Generic image hint moved to
the court-name heading, preserving its independent heading semantics.

Armar partido is first/primary, exact palette.orange #FF8A43 override scoped to this
button only. Saved-court control is secondary with palette.muted soft border and
current confirmed-state labels Agregar a mis canchas / Quitar de mis canchas.
Existing mutation/pending/error/retry callbacks remain unchanged. Global orange
button treatment and all other screens are untouched by this revision.

Detail activity gap reduced8→4 pt; empty report statement uses existing14/21 caption
size and shorter explicit caveat: Sin partidos reportados en curso. No confirma que
la cancha esté vacía. Current check time, refreshing status, errors/stale warnings,
retry and actual activity cards retain their semantics. Other non-arcade callers
retain the prior text/spacing.

Changed production files this step: app/court/[id].tsx,
components/courts/MembershipPanel.tsx, components/pickup/CourtActivity.tsx. Browser
selectors/render assertions updated in tests/browser/detail-fidelity.js; added
explicit checks for #FF8A43 primary background and cream secondary background.

Executed: npm run verify PASS; npm run test:client PASS109/109; isolated-browser
suite11 checks PASS including visual assertions, navigation, simulated state
transitions/pending/retries; git diff --check PASS. Default/narrow captures updated
and inspected, actual code with isolated simulated transport as described above.
No backend writes, business-rule, map, physical-attribute or navigation changes.

Remaining: white text on explicitly requested #FF8A43 measures2.21:1 and fails
normal-text contrast; not declared accessibility-approved. This preserves both
explicit owner color instructions; a later owner decision is needed to resolve
that color conflict. Provisional original art and native iPhone focus/VoiceOver/
text scaling and actual account/server review remain pending. Stop before Mis
canchas; no commits/push, task closure or SPEC closure.
