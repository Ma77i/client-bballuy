# R02/R02.1 fidelity correction — Canchas only

Owner authorization: 2026-10-14. R03 is rejected as a design baseline. No R04, new
boards or alternative mockups. R02/R02.1 and T01 closure are the reference, with
subsequent approved functional/usability decisions retained.

## Scope and acceptance before implementation

1. Restore horizontal cream cards, original existing illustration prominent on the
   left, name/recorded facts/reported activity/visible orange CTA on the right.
2. Compact illustrated discovery header, cream search with search glyph, compact
   Listado/Mapa segments with cream unselected and orange selected state.
3. Give native map remaining space and a discreet accessible location action; no
   changes to markers/camera/selection/map behavior or the existing bottom sheet.
4. Preserve loading/empty/error/retry, shared results, real IDs/coordinates, focus,
   location denial, reduced motion, text scaling and current server-derived activity.
5. Reuse existing tokens/media/primitives, no new assets from rejected R03.
6. Changes to the shared court card are opt-in for discovery so Mis canchas remains
   unchanged until its separate owner-approved screen step. Shared additions retain
   default behavior for all existing callers.
7. Run verify, client regression tests and actual browser implementation comparison.
   Physical iPhone map/gesture/text/VoiceOver acceptance remains pending until run.

No backend, contracts, rules, dependencies, commits, push or SPEC closure. No next
screen until explicit approval of Canchas. T00–T04 historical completion and current
T05/T06 statuses remain unchanged; this owner-gated correction is not evidence that
the completed task's historical native checks have been rerun.

## Evidence

Results, captures, remaining differences and iPhone checklist will be recorded here
after implementation.

## Implemented changes and file inventory

- components/courts/CourtCard.tsx: discovery-only illustrated variant, cream horizontal
  composition,116 × 116 local original art on navy, right-side name/facts/reported
  activity/disclosure/orange CTA. Single accessible navigation target, preserved
  press/reduced-motion behavior. Natural height; stacks at fontScale≥1.5 or width<350.
  Default variant unchanged for Mis canchas until separate approval.
- components/courts/CourtDiscovery.tsx: one compact sports heading, cream search
  with icon, two48 pt light/orange segments with icons/check/selected semantics.
  Native map gets full remaining container; existing metadata becomes a bounded
  overlay instead of shrinking the map. Location is a48 pt icon control on map,
  quiet text/icon in native list. Existing search, query states, retries, selection,
  camera, focus restoration, mode reducer and callbacks unchanged.
- components/foundation/Primitives.tsx: opt-in Choice icon, Field leading icon and
  hidden visible label (accessible name remains). Default caller layout retained.
- components/foundation/GenericMedia.tsx: opt-in caption visibility/background;
  card renders the mandatory disclosure beside its information instead. Existing
  local source/decode fallback and all other callers retain their defaults.

No app route, map implementation, preview sheet, reducer, hook, domain code, asset,
dependency or test source changed. Baseline hashes confirmed only these four source
files differ. Scope/status/spec/plan/evidence are the documentation changes.

## Executed verification — 2026-10-14 America/Montevideo

Environment: Windows/PowerShell, SPEC-003/design, existing Expo57 project.

- npm run verify: PASS (86 Markdown files, TypeScript and lint). Intermediate
  concurrent run detected a ReactNode/style union; corrected to Boolean before
  final passing verification. No suppression or exclusion.
- npm run test:client: PASS109/109, including catalog/search, denied location,
  single-marker selection/context, dismissal, recovery and motion preference tests.
- git diff --check: PASS; only normal LF/CRLF notices.
- Actual authenticated application at localhost:8090/map,402 × 874 browser viewport:
  three real catalog rows; query rodo returns the two accent-insensitive matches;
  no-match state; clear restores all three; Mapa keeps the web fallback/list;
  Palermo card opens real detail and browser back restores discovery.
- Emulated prefers-reduced-motion: Listado/Mapa selections remain immediate. Both
  radio hit bounds48 px; selected orange #FF8A43, unselected cream #FFF7ED.
- Width320 browser: all three cards fit their container (scrollWidth=clientWidth281);
  accessible illustrated stack remains readable. This is not native Dynamic Type.
- Existing DiscoveryPreview fixture, hosted with node scripts/foundation-preview.mjs
  8090 8194 DiscoveryPreview: simulated catalog error→retry, loading→recovery and
  explicit sheet Ampliar/Ver menos/Cerrar passed using the actual shared components.
  Fixture data is the exact existing seed; state toggles are labelled simulations,
  not backend failure injection or evidence of native map gestures.
- iOS Metro transformation: GET /tests/fixtures/DiscoveryPreview.bundle?platform=ios
  &dev=false&minify=false&hot=false returned HTTP200,6,363,123 bytes. This is module
  transformation only, not an iPhone run or a release/Hermes build.

The first preview host inside the restricted environment was unreachable; the
existing allowlisted preview host was restarted outside that restriction and the
checks above completed. No approval-review rejection or data mutation occurred.

## Actual implementation captures and comparison

[Browser list](courts-fidelity-list.png) and [web map fallback](courts-fidelity-web-map.png)
are captures of running code, not new boards/mockups or iPhone screenshots.
Compared against design-r02/courts.png and design-r02-1/sheet.png.

Restored: left large art/right information and action, cream cards, soft separation,
compact light/orange segments, sports heading and original navy/orange identity.
Subsequent adaptations retained: no-photo disclosure, truthful reported activity,
server timestamp/error recovery, compact accessible sheet/expand/close and current
location/detail centering. Current source has no new server or occupancy claims.

Remaining visual differences: T02 local court illustration is the existing original
ball/hoop resource, not the exact textured crop embedded in the R02 raster. The R02
character montage/halftone header is not a standalone bundled asset; this correction
keeps the approved compact heading and does not fabricate a replacement or use R03.
Repeated generic court art follows the shared illustration pattern of R02. Native
sharpness at116 pt still needs physical review. The screenshot does not reproduce
OS chrome/safe areas; existing Expo/browser development overlays are not product UI.
No pixel-perfect/native fidelity or complete owner acceptance is claimed.

## Required owner iPhone review — all pending

Reload the existing Expo Go project and open Canchas on iPhone16 Pro. Send an
actual screenshot of the list and a second of the map with Palermo selected.

1. Check illustration prominence versus right-side information, card height, full
   names and number of reachable cards; inspect image sharpness.
2. Search Rodó, clear, switch Listado/Mapa; check selected segment and context.
3. Check map has more usable height; location control is discreet and48 pt; deny
   location if convenient and confirm manual exploration remains available.
4. Tap Palermo then another marker rapidly: one selected marker and one sheet,
   unchanged gestures/expand/close; Ver cancha and location-return still work.
5. Increase system text, check no clipped names/actions and scroll accessibility;
   VoiceOver focus/return and Reduce Motion remain pending physical checks.

Canchas is ready for owner testing, not accepted/closed. Stop here; do not modify
Detalle, Mis canchas, Jugar or Perfil until explicit approval of this screen.
