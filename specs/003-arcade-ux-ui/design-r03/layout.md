# R03 layout and spacing contract

All values are baseline logical points, for the 402 × 874 reference. Prototype
CSS pixels map 1:1 to these design points; screenshots are not native renders.

## Global geometry

- Safe top 62, safe bottom 34: provisional, must use measured native insets.
- Side gutters 16; useful content width 370. Spacing scale 4 / 8 / 12 / 16 / 24 / 32.
- Main heading region 64 including vertical padding. Native detail header 44.
- Existing four tabs retained. Reference tab reservation 98 = 64 controls + 34
  bottom inset. No new navigation entry. Implement as 64 + actual bottom inset.
- Tab labels 12/18 and glyphs 24; active orange, inactive muted cream.
- Normal vertical card gap 12; section padding 16; corner radii 12 / 16 / 20 / 24.

## Canchas

Heading y=62–126; search y=126–174; 12 gap; segments y=186–234; 16 bottom
padding plus 4 visual buffer. First card/map begins y=254. Available map stage
522 pt down to tab top y=776. No illustration banner consumes this map space.
List cards at x=16, width370, minimum height182, art116 × 128, gap12.
Reported activity or long names increase height; preserve scrolling to every CTA.
Map location action x=338, y=270, 48 × 48. Selected marker 48 with 4 pt cream
halo, 2 pt offset. Static diagram positions are illustrative, not geography.
Collapsed sheet measured 198 pt in this composition: padding8/16/12,
handle40 × 4, title row42, art72 × 72, action row48, gaps4/8/16. Close hit48
may extend within title area without overlapping the title. No fixed empty minimum.
Expanded sheet grows to content, at most available viewport below safe top;
internal scroll when necessary. Explicit Ampliar/Contraer and Cerrar remain visible.

## Detail and Mis canchas

Detail header y=62–106; scroll content starts y=122 after16 padding. Cards width370,
16 internal padding, gap12. About art164 × 156; text alongside at default size.
Coordinates are 12 pt secondary, below the 48 pt location action, not a title.
Saved-state panel follows; organizer CTA stays inside JUGAR ACÁ. Continued frame
shows scroll/action variants, not a duplicate simultaneous saved state.
Mis canchas header y=62–126; list/empty begins126. Refresh48 × 48 right. Empty
art220 × 220 with40 top padding, gap20; CTA stretches within24 pt content gutters.

## Jugar and Perfil

Jugar heading y=62–126, compact navigation link region60 including48 pt targets
and12 bottom padding. Filter region86; card content starts y=284 after12 pt separation. Two selects
179 pt wide, gap12. Fixed dock y=688–776, height88, 48 pt actions with12 gap.
Scroll bottom reserve186 = dock88 + tabs98; last card has16 pt trailing padding.
Filter overlay y=258, x=16, width370; selection rows48, never an oversized grid.
Profile starts y=126; normal hero268 high, player220 × 248; account name wraps.
Grouped rows56 minimum; the entire content scrolls above tabs, including logout.
Large-content example reduces hero to176 and character height160, never to a tiny
icon. Name64 and row28 illustrate 2× content scaling; header/tabs in this design
example remain baseline. Actual Dynamic Type must scale them too and be tested.

## Text, scrolling and runtime adaptation

Baseline regions are not hard height caps. At 1.5× and 2× text scaling, headers,
selects, card titles, notices and buttons grow. About art/text and court-card facts
can stack within the same illustrated card when the right column cannot fit;
art must remain at least96 × 106, not a substitute glyph. Essential names and
status/actions cannot be ellipsized. Caption grows/wraps without covering controls.
Two filters/dock buttons may stack if required by large text; document this as the
approved accessibility adaptation, not a normal-size free reinterpretation.
Cards use natural content height. Modal/selector content scrolls. Keyboard handling
uses existing form behavior and makes focused inputs reachable. Map top/height
respond to the actual safe/header measurements; do not bake y254 into runtime.
No permanent blank sheet space. All actions stay reachable above measured insets.
