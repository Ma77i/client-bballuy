# T01 visual review — R01 — 2026-10-13

Status: proposed, awaiting owner review. Spanish is the confirmed initial UI language.
This revision is design-only. No application components or runtime changes.

## Reading order

1. `courts.png`: primary List / Map / Preview sheet / Detail composition.
2. `play.png`: principal Play compositions with illustrative session data.
3. `review.html`: supporting static compositions, alternatives and motion storyboard.

Generated images are art-direction proposals, not pixel specifications. Typography
is approximate; authoritative labels, states and constraints are below. Maps are
schematic. Session names, times, guests and scores are synthetic examples, not activity
evidence. Court names preserve the three distinct local catalog records.

## Primary screen annotations

- List: initial mode, existing name search only. Cream cards contrast with navy
  chrome; compact character/header never pushes discovery below the first viewport.
  No distance, counts, ratings or favorites. Card opens full detail.
- Map: identical filtered catalog; static basketball markers. Selected outline and
  accessible name, never color alone. Location is an explicit optional action;
  denial keeps browsing. Web uses searchable list and mobile-map explanation.
- Preview: one selected court, not stacked sheets. Another marker replaces content;
  search excluding selection closes it. Visible Close and View court, scrollable
  content, no community mutation here. Back/Escape/dismiss close; focus returns.
  Suggested compact height 40–50%, expanding for text scaling, not a fixed height.
- Detail: generic art caption `Ilustración · No es una foto`; truthful recorded
  attributes and `Sin información` for unknown values. Community action and
  `Organizar acá` remain distinct. Activity is organizer-reported with start time,
  last successful check and cached-read failure. Failure never means no activity.
- Navigation: four existing tabs, `Canchas`, `Mis canchas`, `Jugar`, `Perfil`.
  Return preserves search, camera and list scroll. No changed routing contract.

## Play coverage and exact state semantics

- Discovery: existing court/format filters; separate open invitations and reported
  started activity. Full invitations show `0 lugares disponibles`; past planned
  open invitations are labelled accurately in direct details, not future discovery.
- Invitation: date/time, court, format, available places, organizer and safe display
  names. `Inscripción ≠ asistencia confirmada`. Join appears only with eligible
  fresh reads. Leave requires `¿Salir de esta convocatoria?` confirmation.
- My sessions: deduplicated organizer/registration union, actual open/started/
  cancelled/closed status; cancelled records remain readable. Not My Courts.
- Create: court and format followed by unselected `Ahora` / `Planificar` choice.
  Now goes to quick setup; Plan reveals date/time fields. Explicit organizer
  participation and present guest occupancy preserve 2/4/10 total capacities.
- Organizer: owner-only Start/Cancel/Close with confirmation. Locked core fields
  explain why; description stays editable where currently permitted. No clock-based
  automatic start. Started sessions cannot accept join/leave.
- Match: separate standalone or eligible linked record, exact 1/2/5 players per
  temporary side. Account lookup and guest labels distinct; no private contact data.
  No automatic roster assignment or account creation for guests.
- Score: non-negative final integers; `Resultado declarado por el organizador`.
  Confirmation precedes save; confirmed save closes match and active linked source.
  Correction shows previous/new values and history. Revision conflict requires
  refresh and review, never silent rebase. No rankings or live scorekeeping.
- Every write: busy immediately, stable button size, no optimistic success.
  `No pudimos confirmar el cambio` retains saved request; `Reintentar comprobación`
  reconciles it while opposite action stays blocked. Never encourage a new request.

## Proposed tokens and alternatives

Primary A: navy #0C1220, raised #171F30, orange #FF8A43, cream #FFF7ED,
text #F8FAFC, muted #B8C3D6, border #53647E. Orange buttons use navy text.
Body 16/24, secondary 14/21; short display titles 32/36, sections 24/28.
48-unit minimum targets, 16-unit gutters; radius cards 20, buttons 12, sheet 28.
Halftone only on art; no rotated body text, outlined paragraph text or flashing.

Alternative B: same brand/navigation with navy cards and cream section headers,
smaller art and fewer diagonals. Better content density, less arcade expression.
Light mode: cream canvas, navy text/cards, orange actions with navy text;
no white-on-orange labels. Functional status wording remains identical.

Lexend stays body font. Proposed display: Teko SemiBold (strong scoreboard identity);
alternative Barlow Condensed Bold (more restrained editorial sports identity).
Primary upstream license texts were read on 2026-10-13: all SIL OFL 1.1.
Selection and exact bundled font provenance remain pending; preserve copyright
and license when distributed. No fonts installed or bundled by T01.

- https://raw.githubusercontent.com/google/fonts/main/ofl/lexend/OFL.txt
- https://raw.githubusercontent.com/google/fonts/main/ofl/teko/OFL.txt
- https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/OFL.txt

## Motion storyboard and acceptance proposals

Press: idle → pressed (100 ms, scale at most .98) → immediate action.
Marker: idle → selected outline (150 ms, at most 1.08) → stable selection.
Sheet: closed → translate/opacity (240 ms) → focus heading → close → restore focus.
Switch: list → selected mode (180 ms) → preserved context, no location request.
Confirmation: pending → server readback → inline check (180 ms); no celebration.
Reduced motion: all scale/slide/bounce removed, immediate state or opacity ≤100 ms.
Rapid interruption settles on latest selection; no queued entrance animations.
No looped character or markers, no request per animation frame; stop on blur/background.

Future acceptance: VoiceOver focus isolation/return, keyboard/Escape, safe areas,
200% text without clipped actions, 320-wide scroll layout and no gesture-only action.
Compare frame timing on same iPhone/scenario/build; investigate repeatable >32 ms
animation frames. These criteria are planned, not observed performance/accessibility.

## Media and unresolved review items

Generic original basketball/hoop character art is decorative, not court imagery.
Same labelled fallback for missing/failed images; future photos require source/date,
rights and verified court-ID mapping in a local manifest. No gallery/upload scope.

Owner review requested: A vs B art density; Teko vs Barlow title direction; character
style/amount; cream-card balance; compact sheet content and light-mode direction.
Approve an exact revision/scope or request changes. R01 is not approved automatically
by the original identity direction. T01 remains in progress and T02 is unauthorized.

## Contrast audit

Computed sRGB WCAG ratios in contrast.json: navy/orange 7.99:1, primary/navy
17.87:1, muted/raised 9.27:1, navy/cream 17.61:1. Initial #53647E boundary
on #171F30 is 2.74:1: rejected for meaningful control boundaries; use #B8C3D6
(9.27:1) there. White/orange 2.34:1 is rejected for labels. These are token
calculations, not measurements of every generated pixel or runtime state.


## Raster deviations retained for review

The court board uses a cream detail canvas as a contrast alternative within the
dark direction. Marker selection outline must be exclusive in implementation;
the raster renders similar marker outlines. The map caption is not the actual
location control: keep a separate Mi ubicación action. The preview illustration
may be reduced further; enlarged text takes priority over its height. These
annotations are normative proposals, not silently accepted raster behavior.


Play raster review notes: generic-media caption must also be visible on Play
card/detail (the raster omitted it). Detail action should be singular Ver convocatoria.
The score board juxtaposes editable/result/history/conflict examples; these are
separate states, not simultaneously enabled controls. A conflict disables saving
until refreshed and explicitly reviewed. The extra-player affordance does not permit
a third player in a 2v2 side: each side has exactly two slots, with replacements
only. These annotations preserve existing SPEC-002 behavior.

