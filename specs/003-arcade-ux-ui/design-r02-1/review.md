# T01 / R02.1 — targeted changes — 2026-10-13

Owner approved R02.1 visual direction and all three sequences, and authorized
T01 closure after five consistency checks. T01 is done for design-only acceptance;
see ../t01-closure.md. R02/R01 originals stay unchanged; implementation unauthorized.
Temporary public wordmark remains bballuy; arcade/street basketball is the style.

## Changed artifacts only

- `sheet.png`: compact preview and expanded large-text counterpart, using R02 art.
  Proposed natural content height about 220–260 logical units at 390x844, not a fixed
  cap. Remove spare blank space; thumbnail 48–56 units. Title, truthful attributes,
  generic-media caption, Close and View court stay visible. At 200% text, expand/reflow
  and scroll; art may disappear. Targets ≥48, safe areas, heading focus and restore
  focus on close; dismissal never relies solely on drag. Actual 200% rendering not tested.
- `eligibility.svg`: patches for open/available, full/open, started and cancelled
  direct details. Non-registered viewer examples; View detail stays available.
- `participants-dates.svg`: four existing participation/timing combinations and
  explicit future planned examples, without modifying current defaults or contracts.
- `sequence-marker.svg`, `sequence-format.svg`, `sequence-registration.svg`: four
  actual UI-state frames each, not just labels/arrows. Duration, interruption and
  reduced-motion annotations accompany every sequence. Not animation recordings.

## Contract checks informing the visual patches

Inscription eligibility inspected in `lib/pickup/participation.ts` and current
participation controls: state open, not joined, available places >0 and consistent
roster; fresh usable read and no unresolved write also required. Full/open disables
new join but allows an already-registered player to leave with confirmation. Started
and cancelled do not permit join/leave; started/full/cancelled must not all be reduced
to a disabled generic open card. Closed is similarly non-joinable. Full remains visible
in discovery; started activity is separate, cancelled direct detail remains readable.
View detail is a read action, not registration. Server still decides races/invariants.

Organizer input inspected in `lib/pickup/organizer.ts` and CreateInvitation:
capacities 2/4/10, integer present count bounded by organizer participation and capacity;
playing organizer counts once alongside present guests. Current default is 2v2,
organizer plays, one present; initial timing choice remains unselected. The two-present
visual sample is an edited valid state, not a changed default. Plan count equals
Number(organizerPlays); no present-count field added there. Guest labels belong to
present occupancy or match slots, not anonymous join operations. Match sides retain
exact 1/2/5 places, linked accounts/guests distinct, no auto-assignment or substitutes.

Planned invitation sample uses 20/10/2026 18:00 America/Montevideo, future relative
to this review on 13/10/2026. Dates are examples, never live activity evidence and
never a new default. When preparing another dated review, revalidate sample schedule
or use neutral placeholders. Started illustration uses a report-time label without
inventing a past planned date; never imply future scheduled time automatically starts
play. Historical R02 originals are retained, not silently rewritten.

## Sequence annotations

Marker: selection outline 140 ms, sheet translation/opacity 240 ms may overlap.
Latest selected ID replaces one sheet; filtering out/close/account teardown clears it.
Reduced motion immediate selection/sheet, no scaling/slide. Modal focus isolates map;
close restores trigger. No continuous pulse, full-map animation or request per frame.

Format: four frames show 1v1 selected, explicit touch to 2v2, settled 2v2, another
explicit touch to 5v5. Capacity updates immediately; this is not automatic cycling.
Border/check 140 ms; latest valid touch wins, no submission/navigation. Reduced motion
instant border/check/text. Radio/selected semantics, text reflow and disabled state.

Registration: eligible → sending saved request → successful write response but
checking current readback → confirmed current registration. Network/readback time is
variable; no minimum animation wait. Only final current-account readback gets an
inline check fade 180 ms, reduced motion static check. Transport/readback failure keeps
request identity and recovery, blocks opposite action; no success or confetti. Switching
account cannot announce prior account confirmation. A conflicting current readback
shows actual current status instead of blindly claiming the original requested result.

## Limits and remaining gate

No application/runtime/backend/RLS changes, commits or push. Original raster style
preserved; SVG sequence labels approximate typography and show schematic UI fragments.
Generic artwork is not a court photo. Raster layout is a proposal, not proof of focus,
text scaling, native gestures, performance or functional eligibility acceptance.
Final R02.1 design approval and documentary consistency checks are recorded in
../t01-closure.md. T02 still needs separate implementation authorization. Native
accessibility/performance acceptance remains pending; design-only T01 is done.
