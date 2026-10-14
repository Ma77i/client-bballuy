# SPEC-003 / T01 — R02 design review — 2026-10-13

Status: proposed, not approved. T01 remains in_progress; T02 is unauthorized.
Owner requested refinement rather than a restart. Spanish is the initial UI language.
Only visual artifacts and documentation change; R01 files remain untouched.

## Deliverables and comparison

- `courts.png`: Courts list-first, map and compact preview. Compare with
  `../design-r01/courts.png`. Header target: about 96–120 logical units on a
  390x844 reference, excluding search/switch. The large character hero gives way to
  smaller art and more visible cards. Cream cards separate title, recorded attributes
  and action; sport court-line motifs stay decorative. Three catalog records remain.
- `play.png`: existing court/format filters, invitation detail and personal lifecycle
  examples. Compare with `../design-r01/play.png`. Match-ticket composition makes
  1v1/2v2/5v5 prominent; court/time/places remain readable. Navy now dominates whole
  screens, rather than cream page backgrounds. Cream carries information and orange
  actions. No team/rank/score decoration in discovery.
- `organize.png`: initial selection, Now quick setup and Plan expanded state.
  R01 generic form rows evolve into visual court choices and illustrated mode tiles.
  This is not a new wizard: Now navigates and Plan expands the existing form.
- `storyboard.svg` and `motion.md`: annotated frame proposals for seven requested
  interaction groups, including loading/error/success. Not implemented animation
  or measured device behavior.
- `prompts.json`: full prompts and R01 reference mapping. Built-in image_gen, not CLI.

Raster typography approximates Teko for titles and Lexend for content. Exact type
selection and bundled license provenance remain pending; upstream OFL evidence is
recorded in R01. No fonts, runtime assets or dependencies installed here.

## Data and unchanged behavior

Only local catalog names: `Parque Rodo`, `Parque Rodó Court`, `Palermo`.
All have recorded concrete surface; only Parque Rodo has half_court=true. Do not
infer lighting, facilities, presence or distances from illustrations. `Sin información`
remains the unknown label. Generic ball/hoop media is explicitly labelled
`Ilustración · No es una foto`; failed/missing media returns the same fallback.
No new photograph, attribute, count or court record.

All invitation dates, occupancy and statuses are synthetic layout examples.
Capacity remains 2/4/10 for 1v1/2v2/5v5; registrations and present guests share it
without counting a playing organizer twice. No new filters. Open/full/started/
cancelled/closed stay distinct. Past planned open invitations retain their direct-
detail state; planned time never automatically starts play.

Initial organizer screen retains court/format selection and ends at timing.
Neither timing option is selected initially. Preserve existing format/participation
defaults; illustrations do not authorize altering them. Now carries court/format
to quick setup. Plan reveals valid future local date/time, not a new step. Quick
setup counts present players including guests; planned setup has no present-player
field. Validation stays inline, named and readable. Create remains the existing
create action, not a newly inserted confirmation.

Preserve community/registration separation, owner-only lifecycle and explicit
start/leave/cancel/close/score confirmations, request identity/replay, account
isolation, revision conflict/history and server readback. An uncertain write never
animates success or permits the opposite operation before reconciliation.

## Shared visual and accessibility proposals

Tokens retain R01: navy #0C1220, raised #171F30, orange #FF8A43,
cream #FFF7ED, primary #F8FAFC and secondary #B8C3D6. Orange actions carry navy
text (R01 calculated 7.99:1), cream carries navy (17.61:1); use #B8C3D6 for meaningful
boundaries on raised navy (9.27:1). White/orange labels rejected. Raster pixels
are not assumed to reproduce exact tokens or have measured contrast everywhere.

Comic strokes/halftone confined to small headers, media and tile artwork;
no rotated body labels or texture behind essential data. Format tiles illustrate
player quantities but always retain 1v1/2v2/5v5 and total capacity text. Selected
state uses border/check plus semantic selected state, not orange alone. Targets at
least 48 units; body 16/24 and secondary 14/21, system scaling preserved. At large
text, tiles reflow vertically and content scrolls; no clipping to fit artwork.

List/map share filtered data and retain search/camera/list position. One selected
marker, one sheet, explicit Close/View court plus back/Escape; filtering away selected
court closes it. Location denied leaves browsing available; web remains searchable
list/mobile-map explanation. Focus moves to modal title and returns on dismiss.
Illustrative maps are schematic, not evidence of geographic accuracy.

## Review scope and remaining questions

Review compact header/card density; sport format prominence; readability of mode
illustrations; expanded planning layout; restraint of motion and placeholders.
Teko remains proposed, not selected by prior general art approval. R02 is not the
final approval of any design. R01 supporting Profile/My Courts/entry proposals and
full match/history constraints remain available; R02 does not silently approve them.
Approval must identify exact revision and covered scope before T01 can be done.
Native VoiceOver, scaled text, gesture interruption and frame timing remain future
acceptance after design approval and separate implementation authorization.

## Visual inspection notes

Play: corrected capacity labels and four existing tabs; restored My sessions,
Organize and Register match entries; personal started/cancelled rows do not imply
joinable availability. The organizer display name in the image is entirely fictional.
The final raster dropped its illustrative footer; review.html labels all dates, names,
places and statuses as synthetic. Use the labelled review context, not this raster as
a screenshot of real activity. Detail intentionally condenses fields; actual roster,
confirmations and recovery remain required by SPEC-002, not removed by composition.

Courts: original catalogue names and concrete surfaces preserved, generic media
label visible, one selected marker. Preview art is reduced; final height must shrink
or scroll with enlarged text, rather than consuming extra fixed space.

Storyboard: rendered and visually reviewed via isolated Chrome file tab; text and
seven rows fit without clipping. It shows state frames, not actual transitions.
The organizer court-selection variant is specified separately in motion.md.


Organize: corrected past schedule to unselected date/time placeholders and made
Plan an explicitly expanded state of the same screen. Both initial timing choices
remain unselected. Mode silhouette art is symbolic, not an exact roster; capacity
labels are authoritative. Planned-state compact court/format summary represents
selected values; existing initial choices remain editable above in the same scroll
content. Do not remove these controls in future implementation. Number stepper
is a visual proposal for the existing present-count input, bounded by existing
validation; it introduces no new occupancy rule. No new default participation rule.

