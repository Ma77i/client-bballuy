# T06 N01–N04 targeted corrections

Date: 2026-10-16. Owner authorizes these four observed defects only. T06 remains
in_progress, SPEC open; N06–N11 not started. No new dependencies or backend/data changes.

## N02 cause investigation and implementation

Owner physically observed FAIL: upward handle swipe does not expand on iPhone16 Pro,
iOS26.6.1 / Expo Go57.0.0. GestureHandlerRootView already wraps the app correctly;
missing root configuration was not the cause. The old preview used JS PanResponder
on a16pt target inside ScrollView, plus another handler inside its scrolling title.
This allows native scroll interception before the child claims movement. This is
a code-supported cause of gesture contention, not an instrumented native trace.
Also the old policy explicitly closed on downward drag and never compacted.

Use the existing RNGH Gesture.Pan on a non-collapsible44pt handle outside ScrollView.
Vertical activation12pt, horizontal failure24pt, end displacement40pt. Stable
callbacks/recognizer survive parent state changes while owning the touch. Explicit
idempotent expanded/compact commands never dismiss the selected court; only close
and existing dismissal paths do. Native map pan/zoom/rotate/pitch are disabled from
handle begin until finalization, including failed/cancelled gestures; unmount releases
the lock. Court replacement remounts the handle. Content scroll and Ver cancha
remain independent. Ampliar/Contraer is always available, including large text.
No new drag animation or animation-driven functional state; existing Reduce Motion
behavior retained. Target area changed for reliable touch, not a visual redesign.
Native responder/gesture arbitration still requires physical retest: **N02 stays FAIL**.

Reference: [RNGH pan gesture documentation](https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture/)
and installed gesture implementation; native APIs already present in this project.

## N01 camera overview

Initial catalog span now has minimum0.04 degrees on each axis and1.9 times catalog
bounds instead of0.008/1.4. Real coordinates untouched; only initial overview region
changes. Existing saved manual region and explicit detail-focus region take priority;
no repeated fit-to-bounds effect was added. Core list/search/mode journey is owner
approved, while this camera adjustment awaits iPhone confirmation.

## N03 location feedback

Inspection found permission/position already requested only by explicit Mi ubicación
press, not by list mounting. Preserve that behavior. Failure text is shorter and
rendered as a compact non-touch-blocking text surface rather than a large notice;
it clears after5seconds and on another location request. Screen reader announcement
retains failure feedback. Timer cleans up on unmount. Denied/unavailable location
never changes the catalog or blocks browsing. Physical retest pending.

## N04 pending membership

Replace the large confirmation StateView and separate busy CTA with one busy secondary
button using existing spinner, blocked presses and accessibility busy state. Keep its
normal action text and announce Guardando cambios en Mis canchas to screen readers.
No membership hook/readback/retry behavior changed; current joined value is unchanged
until its existing server-confirmation flow finishes. Physical retest pending.

## Files modified in this correction

- components/courts/CourtPreview.tsx: dedicated native gesture handle and accessible toggle.
- components/courts/discovery-state.ts: explicit size command and non-dismissing drag policy.
- components/courts/CourtDiscovery.tsx: stable size callback, gesture lock, compact location feedback.
- components/courts/CourtMap.tsx and types.ts: temporary native gesture enable flag.
- lib/courts/catalog.ts: overview bounds padding only.
- app/(tabs)/map.tsx: transient location feedback and screen-reader announcement.
- components/courts/MembershipPanel.tsx: in-button pending presentation/announcement.
- tests/court-discovery.test.cjs and court-catalog.test.cjs: directional/idempotent
  resize, selection preservation, thresholds, padded bounds and coordinate integrity.
- tests/fixtures/DiscoveryPreview.tsx: updated callback and existing gesture root.
- tests/browser/detail-fidelity.js and map-preview-refinement.js: updated observable
  busy state and Contraer label. Native map test is not represented as a web pass.
- SPEC/status/block records and post-correction application snapshot.

## Physical retest steps

1. Reload the updated local project in Expo Go. Confirm N01 broader initial map
   (cold discovery), then pan/zoom, switch List/Map and return from detail: manual
   context remains; explicit Ver ubicación still centers/selects the chosen court.
2. N02: select Palermo, put finger on the top horizontal handle and swipe up more
   than40pt. Expanded information appears. Swipe down from handle: compact sheet
   remains open and marker stays selected. Repeat3times, including short/diagonal
   aborted drags; the map must not move beneath the handle.
3. Expand using Ampliar, compact using Contraer. Scroll expanded content; close/reopen,
   rapidly replace markers and use Ver cancha to navigate. Map pans again after
   release/cancel/close. Capture a short video of handle plus map.
4. Repeat N02 with enlarged text and Reduce Motion; VoiceOver can use the size button.
   Record subchecks separately rather than claiming they passed at normal settings.
5. N03: cold List must not trigger location prompt; tap Mi ubicación with denied
   permission, observe brief compact message clearing after5seconds; keep exploring.
6. N04: add/remove/re-add on local test account: spinner in button, no large pending
   block, no duplicate submission; confirmed state and retry remain correct. Check
   VoiceOver pending announcement separately when enabled.

Only owner-confirmed physical observations can change case statuses. Attach redacted
captures to each N01–N04 case. No device pass or SPEC closure is claimed here.

## Executed verification

Windows / Node24.16.0; existing SPEC-003/design dirty checkout preserved.
- npm run test:client:119/119 PASS, including new overview bounds and directional
  idempotent expansion/compaction checks. Unit tests do not exercise iOS arbitration.
- npm run verify: documentation111 Markdown files, app typecheck and lint PASS.
  Initial development lint caught ref access during render; corrected by stable
  callback dependencies without disabling rules. Final source uses no such ref writes.
- tests/browser/detail-fidelity.js:11 grouped checks PASS in real web presentation
  with intercepted synthetic auth/REST and zero real writes. Add/remove/re-add,
  busy/blocked action, failed mutation/retry, read failure, navigation and narrow layout.
  Test now waits on aria-busy rather than old confirmation copy. Initial adapted
  selector checked too early; another attempt timed out; final unchanged warm run
  completed. Neither initial failure is counted as a pass.
- iOS export: EXPO_NO_DOTENV=1 EXPO_OFFLINE=1 CI=1, workspace TEMP/TMP,
  npx expo export --platform ios --source-maps --output-dir .harness/t06-block01-ios
  --max-workers 2: PASS3656modules /35assets. Not a native physical acceptance test.
- No physical retest yet: map drag ownership, gesture cancellation, VoiceOver,
  large text and Reduce Motion remain owner-device checks; N02 remains FAIL.

No shared Button, membership hook/server confirmation, backend/RLS, package manifest,
lockfile, actual court records or other screen redesign changed in this correction.
The old pre-correction fingerprint is retained; current application hashes are in
[t06 post-correction snapshot](t06-native-block-01/revision-after-corrections.json).
