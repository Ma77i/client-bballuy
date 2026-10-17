# N02 — Markers, sheet and detail navigation

Type: physical iPhone test, owner-operated. Status: **PASS for expansion/contraction gesture correction only — owner-confirmed physical retest. Other N02 subchecks are not implicitly passed.**.
Date/time, observer, runtime revision match: pending owner confirmation.

## Steps

1. Clear search, enter Map and pan/zoom to see two real court markers.
2. Tap one marker, then quickly another several times. Observe selected marker/name.
3. Expand the sheet by dragging; close, reopen, then expand through the secondary accessible control. Scroll expanded content if necessary.
4. Close with the close control and reopen. Choose Ver cancha, then return.
5. In court detail use Ver ubicación en el mapa and inspect court centering/selection.
6. Note focus behavior for controls; if VoiceOver is available, check return to a meaningful map control after closing. Otherwise mark that subcheck NOT RUN.

## Expected

Only one sheet exists; its name matches the highlighted marker. Quick changes replace selection safely. Expansion by gesture and control, scrolling, close and back work. Ver cancha opens the selected real court; location action centers/selects it. No unexplained bottom gap or covered CTA.

## Observe / evidence

Prefer a short recording of rapid marker changes, expansion and return. Include compact/expanded screenshots and any bottom gap; separate untested focus behavior from gesture results.
Save redacted attachments under this case directory; no private originals in Git.

## Result log — fill only after owner confirmation

- Subcase / step: pending.
- Status: NOT RUN.
- Expected / actual: not observed.
- Owner report date and redacted capture reference: pending.
- Retest / defect ID: none reported yet (not evidence of no defects).

PASS requires every claimed subcheck observed with its expected outcome. FAIL means
an observed mismatch. BLOCKED means a prerequisite prevents testing; record reason.
Use separate statuses for partial checks; do not aggregate a partial pass into a
case PASS. Preserve failed attempts when recording retests. Any defect receives
repro steps, actual/expected, impact and a proposed scoped correction; functional
code changes require new owner authorization.

## Owner-reported defect — 2026-10-16

iPhone16 Pro / reported iOS26.6.1 / Expo Go57.0.0: upward swipe does not expand
court preview. Owner authorizes targeted gesture correction, preserving approved
visuals, map context/selection and accessible alternative. Acceptance before code:
handle upward drag expands; downward drag only compacts (never closes); explicit
Ampliar/Contraer remains available including enlarged text; Ver cancha navigates;
map interaction blocked during handle contact; cancellation/unmount restores it.
No dependency/backend changes. Status stays FAIL until owner physical confirmation.
N01/N03/N04 approved correction details are not present in available records;
clarification requested rather than inferring changes to those flows.

## Physical retest confirmation — 2026-10-16

Source: direct owner report in this chat, iPhone16 Pro with Expo Go. Owner confirms
upward/downward Bottom Sheet dragging works correctly and explicitly accepts the
gesture correction as PASS. No attachment was supplied with this confirmation;
recorded as owner-reported physical evidence, not automated or independently observed.
Previously reported environment: iOS26.6.1 / Expo Go57.0.0, normal text, VoiceOver
and Reduce Motion off; no changed settings were reported for this retest.

Expansion/contraction gesture defect: PASS; preserve implementation without further
changes. Prior FAIL is retained above as history, superseded only for this defect.
No automatic PASS for VoiceOver, enlarged text, reduced motion, every N02 navigation
subcase or other N01/N03/N04 corrections. Exact loaded bundle hash not device-verified.
