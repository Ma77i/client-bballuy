# R03 shared components and icon specification

Proposed design, not runtime components. Reuse the T02 primitives and current state
hooks; adapt presentation once authorized. Do not create a parallel visual system.

## Color and typography

- Foundation navy: #0C1220. Raised navy: #171F30. Cream: #FFF7ED.
- Brand orange: #FF8A43, with navy labels on filled buttons and selected segments.
- Proposed accessible orange ink: #A63B00 for text and 1.5 pt outlines on cream.
- Primary cream-surface text: navy; secondary text #243047. Navy muted text #B8C3D6.
- Decorative cream border: #E5D6C8, 1 pt. Navy decorative divider #243047.
  These are not the sole boundary for interactive fields or focus indicators.
- Control boundary #53647E; keyboard focus 3 pt navy on cream / cream on navy,
  plus outline offset 2 pt. Never convey selected/error state by color alone.
- Existing Teko SemiBold: heading 30/32, section 27/29, court 25/27,
  account name 32/35, format 40/42. Existing Lexend Regular/SemiBold: body 16/24,
  compact card facts 13/19, controls 14/20, captions and tab labels 12/18.
  Compact facts are supporting metadata; full-detail body can grow to 16/24.
- Font scaling remains enabled. Measurements are baseline, not fixed label heights.
  Do not use a maximum-font-scale cap to preserve these mockups.

## Shared primitives

**Court card:** horizontal cream card, 370 pt outer width, radius 20, padding
12/12/30, art well 116 × 128 left, gap 12, remaining text column right. Minimum
182 pt height, natural growth for wrapped names and activity. Name before facts,
then optional actual reported-activity row and 48 pt outlined Ver cancha. Entire
card may navigate with one accessible target; the depicted CTA must remain visible.
No duplicate nested accessible navigation targets. Art disclosure at bottom 12/16.
Soft border, no prominent orange side stripe. Missing type/surface is omitted,
not inferred from art. No photo substitutions.

**Saved-court variant:** same art and visual geometry. Current My Courts projection
has name/ID only: omit unavailable attributes and activity. Do not invent them.
A future approved presentation-only reuse of the existing catalog read could add
real attributes by ID; that choice is not silently part of this design step.

**Activity row:** optional full-width text below facts; actual status and actual
last successful update, followed by compact 'Los reportes no confirman ocupación.'
Use a stale/error tag when appropriate, not an invented fresh timestamp or count.
No report means unavailable, never 'vacía'. Row increases card height; never overlaps
illustration disclosure or CTA. Full caveat lives in expanded/detail information.

**Button:** minimum 48 pt hit height, horizontal padding 12, radius 12, content
wraps and grows. Primary orange/navy; secondary outlined; destructive text uses
explicit label, confirmation and existing eligibility. Pending retains width and
label context; disable repeated submissions without hiding readback recovery.

**Search:** 370 × 48 minimum, cream, radius 12, search glyph 22, gap 12,
padding 12. Existing query only. Clear action, when shown, has 48 pt hit region.

**Segmented view selector:** two equal 181 × 48 segments separated by 8 pt,
cream unselected, orange selected, navy text, 18 pt glyph and 8 pt gap. Announce
selected state. This is a compact two-way control, never a large button grid.

**Select filters:** two 179 × 48 minimum controls with 12 pt gutter, visible
12 pt Cancha/Formato labels above, 18 pt chevron. Cream overlay width 370,
radius 16, padding 12, one 48 pt row per existing option. Orange selected row
plus checkmark. Formato options Todos, 1v1, 2v2, 5v5. Cancha options use real IDs.

**Game ticket:** cream horizontal card, radius 20, padding/gap 12; minimum
184 pt, grows for actual text. Format well 92 pt wide with 40 pt display label
and original art below. Right: explicit state tag, real court, real schedule,
real organizer and real availability. Ver convocatoria has 48 pt target, or the
whole card is one accessible target. No invented fixtures. Status is not a button.

**Grouped profile rows:** 56 pt minimum (48 hit), 12 pt internal gap/padding,
24 pt glyph, wrapped label, trailing 18 pt chevron. Two navy grouped surfaces,
subtle internal separators. Existing configured report action only; if unavailable,
preserve the current unavailable/error behavior, never fabricate a contact.

**Notice/loading/empty/error:** compact inline notice under the relevant control,
48 pt retry, meaningful Spanish status label. Keep stable content during refresh;
first load may use non-flickering placeholders. Empty uses original art and one
existing exploration CTA. An error is not a zero-result or empty account state.

## Icon family and accessibility

Use the current project's vector icon facility once implemented; match a single
rounded outline family: 24 × 24 viewBox, 1.8–2 pt stroke, round caps/joins. Review
HTML uses original simple vector drawings, not imported unlicensed icon files.
Search 22; tab/account glyphs 24; chevrons 16–18; marker basketball 28 inside 48.
Functional icon hits are 48 × 48. Decorative glyphs are hidden from assistive tech.

Spanish accessible labels: Buscar cancha, Actualizar Mis canchas, Mi ubicación,
Cerrar vista previa, Ampliar información de cancha, Volver, Cancha, Formato.
Map marker announcement includes real court name and selection. Tabs announce
selected state. Refresh and close remain available without swipe-only gestures.
Error/success status is announced politely; critical failures use the existing
alert behavior. Do not announce animation frames or decorative illustration detail.
