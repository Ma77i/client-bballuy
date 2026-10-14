# T04 explicit court-location handoff — 2026-10-14

Owner superseded the previous context-only return: Ver ubicación en el mapa must
open Map, center the current court (Palermo when entered from Palermo), and select
its marker. This authorizes the minimal discovery handoff required for that action,
not a new map/marker/preview design or broader T03 changes.

Acceptance: route only carries the existing court ID; resolve real coordinates
from the current catalog. Consume the request once after successful catalog loading
and focus. Preserve a compatible search; clear an incompatible search so the target
is visible. Select Map and the same existing compact preview, without stacking sheets.
An invalid target does not invent coordinates or change discovery. Ordinary Back,
map entry, manual pan, location denial and marker changes retain existing behavior.
Selection is immediate; reduced motion centers without animation. Keep web fallback
and native validation limits explicit. No contracts/backend/dependencies/T05 changes.

## Implementation and verification

Detail sends focusCourtId plus a presentation-only request timestamp via the existing
Expo Router dismissTo('/map') destination. The unique request tag allows repeated
requests for the same court after navigating through another tab. Map passes the
request to CourtDiscovery and clears route parameters when handled. Requests wait
for screen focus and successful catalog reads; unknown IDs are consumed safely.
No coordinates or account/business state are accepted from navigation parameters.

Discovery's existing reducer atomically switches view, selects the same compact
preview, and clears only an incompatible search. A one-shot region from the actual
catalog uses .015 latitude/longitude deltas. CourtMap applies it when already ready
or onMapReady, with zero-duration motion when reduced. The region is cleared on
handoff to the native map so later manual pan/view changes are not forced back.
Selection does not await camera/sheet animation completion. The existing native
marker style, single-sheet implementation and close/expand controls are reused.

CourtPreview's native AccessibilityInfo focus call was unavailable on web when
the handoff first opened a preview there; platform-specific web focus now avoids
that runtime error, preserving the native path. No accessibility suppression or
lint exclusion added. An early synchronous camera setter was rejected by the hook
lint rule; region intent moved into the existing reducer and native-map callback.
The final verify run has no lint warning/error. Initial failures are not passes.

Files: app/court/[id].tsx, app/(tabs)/map.tsx, CourtDiscovery.tsx,
discovery-state.ts, CourtMap.tsx, types.ts, CourtPreview.tsx, targeted client/browser
tests and specification/status evidence only. All existing uncommitted work retained.

Executed on Windows/PowerShell, existing Expo 57 web app (8090), isolated local
Docker backend (55431), two newly generated synthetic accounts:

- npm run verify: 70 Markdown files, application typecheck and lint pass.
- npm run test:client: 106/106, zero skips, including immediate explicit target,
  compact replacement, conflicting-search clearing and one-shot region reducer test.
- Playwright: tests/browser/t04-setup.js then t04-location.js: 10/10 checks pass.
  Palermo selection/one preview, List -> Map, compatible search, repeated same court,
  closing without reopening, unknown target, direct Detail -> Map and My Courts ->
  Palermo with an incompatible Rodo search. Web uses the existing map fallback;
  this does not certify native camera positioning. A preliminary My Courts attempt
  exposed an already-consumed same-ID request; unique request tagging fixed it and
  the complete scripted case passed on the final run.
- Full iOS export: EXPO_NO_DOTENV=1 EXPO_OFFLINE=1 CI=1; workspace TEMP/TMP;
  npx expo export --platform ios --output-dir .harness/t04-map-target-ios-export.
  3634 modules, 31 assets, 7.1MB Hermes entry; SDK compatibility guard retained.
- git diff --check: no whitespace errors (Git emits existing LF/CRLF notices).

Signed out, cleared browser fixture storage and removed exactly the two owned
synthetic identities with guarded local Docker SQL. Zero owned fixtures remain;
catalog fingerprint unchanged: 6b603bd412dbb79c3ac6a6070eeb1d9e. No remote write,
reset/migration or original-account/court changes.

Physical iPhone camera on both already-ready/newly-mounted maps, pan interruptions,
marker/VoiceOver focus, enlarged text and reduced motion remain pending in
t04-iphone-review.md. An iOS export is compilation, not device acceptance.
T04 remains in_progress; T05 not started. No commit/push.
