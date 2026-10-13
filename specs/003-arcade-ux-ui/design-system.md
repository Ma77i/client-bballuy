# SPEC-003 - Proposed Design System and interaction catalog

Exact tokens, durations and compositions are T01 proposals. Confirmed direction:
BBallUY Arcade / Street Basketball with orange, night blue, original illustration,
sports-game/comic expression and microinteractions. No functional gamification.

## Visual tokens and components

- brand #FF8A43, pressed #F97316, on-brand #0C1220.
- background #0C1220, surface #171F30, raised #243047.
- contrasting surface #FFF7ED with text #0C1220.
- text #F8FAFC, secondary #B8C3D6, border #53647E.
- dark-surface success #73DEAA, warning #FFD166, error #FFADB5; text/icon required.
- spacing 4/8/12/16/24/32/48; control/card/sheet radius 12/20/28.
- licensed sports display headings 28-36, sections 20-24; Lexend body 16, secondary
  14, body line height about 1.5. Preserve system scaling; no blanket scaling caps.
- touch target at least 48 x 48 logical units. Measure normal text at least 4.5:1,
  large text/meaningful control boundaries 3:1. Values do not imply checked contrast.

Restrained comic outlines/diagonals/halftone away from body text. Original generic
hoop/ball/asphalt artwork, no copied game art or depiction of a particular court.
Define Typography, Button primary/secondary/danger, Field/Search, ViewSwitch,
CourtCard/Media, attribute chip, BasketballMarker, CourtPreviewSheet, community
control, activity label, session card, confirmation panel and StateView.
Cover default/pressed/focus/selected/disabled/busy/error as applicable, initial load,
refresh with cached content, empty, no filter matches, read failure and uncertain write.

## Common motion/accessibility/performance policy

Press 80-120 ms, selection 120-180, view switch 160-220, sheet 220-280, feedback
160-220. Ease-out, restrained spring; actions start immediately, never wait for effects.
Prefer opacity/transform. Reduced motion removes scale/bounce/slide/shimmer/camera
tweens; use immediate updates or brief opacity up to 100 ms. Respect preference
changes during use. Stop loops on blur/background/unmount. No animation-driven
requests, delayed confirmations, sound requirement or automatic haptic behavior.

## Interaction catalog

### M01 - Marker selection

Unselected -> selected basketball marker; 120-180 ms subtle scale 1 -> 1.08 -> 1,
persistent selected outline. One ID; another selection replaces it. No activity pulse.
Accessible court name/selected state where supported and equivalent list action.
Reduced motion: static outline. Performance: small static artwork/selected overlay,
avoid continuous native marker bitmap tracking or animation of every marker.

### M02 - Preview sheet

Closed -> preview, 220-280 ms translation/opacity. Another marker replaces content,
never stacks sheets; interrupted taps settle on latest ID. Close button, dismiss
gesture, map-background tap and platform back/escape close it. Filter removing court,
list switch, account teardown or detail navigation dismisses preview. No mutation.
Move focus to named heading; isolate background while modal; restore trigger focus
on close. Visible close/detail buttons, scrollable enlarged content and safe areas.
Reduced motion: immediate. Performance: one sheet, no extra fetch loop/full-map
rerender per frame. Loading/failed catalog does not show a stale actionable preview.

### M03 - List/map switch

List default; selected control crossfades 160-220 ms. Preserve search/shared results,
camera/list position; switching never requests location. Clear preview on list switch.
Web shows list/mobile-map explanation. Loading/error retains mode.
Labelled selected controls, focus only in active view, no duplicate fading targets.
Reduced motion: immediate. Performance: no map-height animation; mount when needed,
retain lightweight camera state rather than duplicate maps.

### M04 - Buttons, filters and navigation

80-120 ms press opacity/subtle scale; static focus outline. Busy state immediate,
labelled progress and stable sizing; disable repeated submissions. Existing filter
selection/tab emphasis 120-180 ms; stack keeps standard navigation transitions.
Roles, busy/disabled/selected states, keyboard focus and scaled labels required.
Reduced motion: static pressed/focus feedback. Performance: local effects only,
no per-row entrance cascade or delay before navigation/network action.

### M05 - Community confirmation

Idle -> pending -> confirmed current join/leave or uncertainty/error/retry.
Only server-confirmed state gets inline check/emphasis 160-220 ms. Retain shared
membership invalidation/retry action; no favorite toggle. Polite success announcement,
persistent visible state, errors announced once. Reduced motion: static check.
Performance: no confetti/blocking overlay or animation-owned request state.

### M06 - Participation, lifecycle and score feedback

Preserve existing leave/start/cancel/close confirmations. Pending -> current readback
-> result, or saved uncertain request/retry; 160-220 ms inline feedback only.
Full/started/cancelled/completed controls retain existing eligibility. Uncertainty
blocks opposite actions; score revision conflict requires renewed explicit review.
Focus enters confirmation and returns on cancellation; meaningful action/state text.
Reduced motion: static. Performance: unchanged UUID recovery/polling, no duplicate
requests; no win/points animation, silent score rebasing or ranking implication.

### M07 - Loading and refresh

Labelled progress/static skeleton for initial load; refresh retains labelled cached
data. Optional visible skeleton opacity pulse 800-1200 ms, never markers; no artificial
minimum wait. Failure offers retry. Busy label, decorative skeleton hidden from reader.
Reduced motion: static skeleton/label. Performance: bounded visible placeholders,
stop loops when hidden/background; reserve image dimensions to prevent layout jumps.

### M08 - Empty/error/media fallback

Original illustration and existing useful action; optional one-time fade 160-220 ms.
Distinguish no catalog/filter match/membership/invitations from failed reads. Failed
image returns generic artwork, never an unrelated court photo. State heading, meaningful
alt only when necessary, no color-only error or decorative announcements.
Reduced motion: static. Performance: small reusable artwork, no looping mascot,
large animated gradient or hidden retries.

## Performance acceptance proposals

Target smooth 60 Hz on agreed iPhone; record device/build mode/tool/scenario and compare
to SPEC-002 under identical conditions. Ten rapid marker/toggle/open-close repetitions
settle correctly with no extra requests, residual overlays, accumulating listeners or
loops. Investigate reproducible animation-caused frames above 32 ms. Debug Expo Go
timing is diagnostic, not release-performance certification. No new animation errors,
polling/background work or network request per frame. Compress media for rendered size.

## Original placeholder and future photography

Generic ball/hoop/asphalt composition explicitly labelled Illustration / Photo not
available in approved language. Never imply real layout/lighting/condition. Same
fallback on card/sheet/detail. Future photographs require court-ID mapping, source/date,
usage rights and owner verification. Proposed local manifest avoids backend changes;
no upload/gallery or actual sourcing authorized here. Photos do not block T01.

## Technical context

Package declares Expo ~57.0.24, Reanimated 4.5.1, worklets 0.10.1, Gesture Handler
~2.32.0 and maps 1.27.2; these are not device acceptance. Initial planning consulted
[Expo SDK 57 Reanimated](https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/) and
[Reanimated accessibility](https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility/).
Recheck installed compatibility before implementation; no upgrade in this scope.
