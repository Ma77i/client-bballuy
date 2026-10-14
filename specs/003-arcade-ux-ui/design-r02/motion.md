# R02 motion specification — proposed, not implemented

The visual storyboard uses representative frames, not animation recordings.
Durations describe presentation only. Network work never waits for animation.
Reduced motion applies immediately when the preference changes during use.

## S01 — Court selection

Idle cream card → pressed tint/scale .99 over 100 ms → existing detail navigation.
Do not add a persistent list selection or delay navigation. If touch is cancelled,
restore idle in at most 80 ms. Repeated activation is handled by current navigation,
not queued animation. Reduced motion: static pressed tint and immediate navigation.
Accessible court name/action and keyboard focus outline; no tiny arrow-only target.

## S02 — List/map switch

Selected Lista → active tab indicator fades over 160 ms → selected Mapa.
Use opacity, not map-size animation; show only the active interactive view. Preserve
query/camera/list scroll, clear preview on list switch; no automatic location request.
Rapid alternation settles on latest mode with no queued fades/duplicate targets.
Reduced motion: immediate selected state. Focus stays on labelled selected control.
Web keeps list and explanation instead of an inert map switch.

## S03 — Marker and sheet

Plain marker → exclusive outline (140 ms, scale 1→1.06→1) → single sheet
translate/opacity (240 ms). Timelines may overlap; do not wait to select or request.
Sheet compact media, named title, Close/View court; art yields to scaled content.
Another marker replaces content in the same sheet, never stacks it. Close/back/
Escape/background dismissal restore focus; filter removal/account teardown clear it.
Fast taps settle on latest ID. Reduced motion: static outline and immediate sheet.
No continuous pulse/bitmap animation; modal focus isolation and scroll alternative.

## S04 — Format selection

Previous selected tile → new tile border/check and selected label over 140 ms,
single local scale 1→1.03→1 optional; corresponding capacity text updates immediately.
Format choice does not submit or navigate. 1v1/2v2/5v5 = total 2/4/10 places.
Rapid taps cancel prior transition and settle on latest format; disabled/pending
controls cannot animate as newly selected. Reduced motion: instant border/check/text.
Screen-reader radio/selected semantics; keyboard and vertically reflowed text labels.

## S05 — Button press

Idle → pressed .98 scale/opacity 100 ms → released 80 ms. Action starts on existing
activation event, no delayed request. Cancelled touch returns to idle, focus ring
remains. Busy state locks duplicate submissions immediately with stable button size.
Reduced motion: static tint/focus/busy label, no scale. No automatic sound/haptics.

## S06 — Registration confirmation

Inscribirme → Comprobando inscripción (duration determined by request, no artificial
minimum) → readback-confirmed Inscripción confirmada with inline check fade 180 ms.
No confetti, points or inferred attendance. Failure/uncertainty replaces pending
with persistent named error/retry; opposite operation remains blocked until actual
reconciliation. Blur/unmount stops decoration while saved request survives; account
switch cannot announce prior account success. Reduced motion: static confirmation.
Polite announcement only after current-account readback; errors announced once.

## S07 — Loading, error and success

Initial load: static reserved blocks plus Cargando; optional one-time opacity 120 ms,
no shimmer loop. Refresh retains cached content and last-successful-check time.
Failure: Error + Reintentar appears in 120 ms without shake; not an empty state.
Confirmed success: persistent text/check with one-time 180 ms fade, no overlay.
Read failure cannot be relabelled success/empty; latest current-account result wins.
Unmount/blur/background stops decorative work, no animation-owned retry or polling.
Reduced motion: all static, optional opacity at most 80 ms. Meaningful error heading,
alert semantics, labelled progress and retry reachable without gestures.

## Common future acceptance

Prefer local transform/opacity and bounded artwork; no per-frame network work,
marker loops, staggered list entrances or blocking celebration. Existing focused
foreground polling stays unchanged. Future iPhone comparison under identical build/
device/scenario: rapid selection/switch/close ten times, no stale overlays or listeners,
screen-reader focus/return, 200% text, 320-wide layout and safe areas. Investigate
repeatable animation-attributable frames over 32 ms. These are planned criteria,
not runtime, accessibility or performance evidence from static boards.

## S01 organizer variant — choosing a court

On Organize only, choosing a court updates the persistent single selection with
border/check over 140 ms; latest selection wins and does not navigate or submit.
Reduced motion applies the check/border immediately. Preserve the three distinct
court IDs even where names resemble one another. A list-card press remains direct
detail navigation, so it must not acquire this organizer-only persistent state.

