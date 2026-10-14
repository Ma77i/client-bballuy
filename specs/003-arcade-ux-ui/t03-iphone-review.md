# T03 iPhone Expo Go review — prepared, not executed

## Focused visual retest after refinement

Owner supplied iPhone visual feedback requesting compaction; the revised layout
requires a new run. See t03-visual-refinement.md. Compare header/list space, shorter
cards, content-sized sheet, 28-unit art and full no-photo disclaimer. Verify the
48x48 Close icon by VoiceOver name, unfilled Ampliar/Ver menos with expanded state,
and sole filled Ver cancha CTA. Recheck safe areas above the tab bar (no duplicated
bottom inset), native text >=200%, keyboard, rapid marker replacement, focus and
Reduce Motion. Do not mark any original case passed from this feedback alone.

Date: 2026-10-14. Branch: SPEC-003/design. Status: every device case below pending.
No physical iPhone, VoiceOver, gesture, native camera or performance observation is
claimed. Owner must record observed outcomes/device/version/date before acceptance.

## Reproduce locally

Use Expo Go matching SDK 57 and the existing synthetic local account. Docker must
be running; PC and iPhone share trusted Wi-Fi. Follow
[the local device procedure](../../local-backend/README.md).

```powershell
npm run db:local:start
npm run db:local:device
```

Scan the terminal QR code. Launcher disables dotenv and uses only the local API;
do not substitute a hosted backend or reset/reseed an existing database. Keep
credentials, keys, private network addresses and personal data out of evidence.
This session did not launch the LAN/device backend or execute either command.

## Pending acceptance cases

1. Sign in; Canchas initially shows Listado and all three original records. Search
   `rodo` finds both Parque Rodó entries; IDs/names/coordinates remain distinct.
2. Switch to Mapa: same two markers. Deny location permission, then browse/search,
   select and open details. Optional location failure must not block exploration.
3. Select each basketball marker: selected outline, one sheet, real attributes and
   labelled generic artwork. Rapidly select A/B/A; latest ID wins with no stacked
   sheet, accidental map-background dismissal, stale title or uncontrolled pulse.
4. Tap map background and Close; reopen. Drag down on the 48-unit handle to close;
   drag up or press Expand to show recorded lighting/notes. Scroll text independently
   without accidental dismissal. No gesture is required for closing/expanding.
5. Search removing the selected record, or make the catalog fail: preview closes,
   current read state/retry remains. Activity failure preserves its warning and
   retry, without presenting old organizer reports as freshly verified.
6. Pan/zoom; remember camera. Open Ver cancha, use existing back navigation: search,
   mode, camera, selected record and list offset survive. Repeat from a scrolled card.
   Switch Listado/Mapa after moving camera; no forced recenter from an old location.
7. VoiceOver: marker activation, heading focus, Close/Expand/View labels, modal
   isolation (including header/tab navigator), escape, restore to surviving marker
   or view selector if removed. Verify no duplicate marker or trapped focus.
8. iOS text size >=200%: labels/names wrap; image yields; attributes auto-expand;
   scroll reaches Close and Ver cancha; safe-area/tab bar do not obscure controls.
   Repeat in landscape and with the keyboard visible.
9. Enable Reduce Motion before opening and while moving: static marker/sheet/view
   feedback, immediate actions. Background/foreground during rapid selection and
   detail navigation; no stuck scale, replay loop, delayed state or lost selection.
10. Observe fluid pan/zoom, three-marker selection and handle scrolling on the actual
    device. Expo Go observation is not release FPS certification; record any hitch,
    missing marker, inaccessible target or interrupted gesture explicitly.

## Result template

For each case: case number; device/iOS/Expo Go version; date; exact steps; observed
outcome; pass/fail; screenshot/recording reference if appropriate. Leave unexecuted
cases pending. Do not put secrets/account identifiers in captures or reports.
Fix observed failures within T03 before requesting closure; do not begin T04.
