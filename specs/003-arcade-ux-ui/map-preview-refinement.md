# Map and compact court preview refinement

Date: 2026-10-16. Authorized scope: remove map-only results/freshness footer and let existing native map fill remaining space; compact the existing preview with original local art and orange primary view action. Preserve list metadata, native map code, coordinates, camera/selection, permissions, navigation, gesture thresholds, expanded content, focus and reduced motion. No new dependency or other-screen work. R02/R02.1 remain authoritative; owner visual acceptance was formally granted on 2026-10-16; detailed native checks remain pending.

The tab navigator already reserves the bottom safe area and MapScreen passes bottomInset=0. Do not add another bottom safe-area spacer. Keep the native map flex fill. Catalog and activity read/error handling must remain truthful; exceptional notices are not a permanent metadata footer.


## Implementation

Only application files changed in this pass:

- `components/courts/CourtDiscovery.tsx`: do not mount the results/metadata ScrollView over the native map. Keep list count/freshness and the unchanged web-map fallback/list. The native map retains its flex-fill area down to the existing tab boundary. Location denial, activity errors/retry and empty-result feedback remain available as conditional top notices, with room reserved for the existing floating location control. No permanent metadata footer remains over the native map.
- `components/courts/CourtPreview.tsx`: compact 56-unit existing illustration beside the name and real physical facts; no visible media caption. Orange/navy primary View court shares a row with the quiet expand/collapse control. Quiet 48-unit close remains in the information row. A small handle and title/facts region retain the original PanResponder handlers. Large text hides decorative art and exposes expanded information as before. Natural content height, bounded internal scrolling, escape/back, modal focus and return focus remain.

No native map implementation, marker, coordinate, selection reducer, camera, location permission, route or dependency changed. No other screen was modified in this pass. Tab safe areas remain owned by the existing navigator; no duplicate bottom inset was added. There is no fixed compact height or art-caption spacer.

## Executed checks

- `npm run test:client`: 116/116 passed. Includes existing discovery selection/replacement, close/expand, focus requests, filter/error reconciliation, gesture thresholds, reduced-motion policies and navigation intent coverage.
- `npm run verify`: documentation, TypeScript and lint passed.
- `tests/browser/map-preview-refinement.js` with Playwright browser_run_code_unsafe: five groups passed using real Expo web UI on localhost:8090, synthetic isolated auth/REST and reduced-motion preference. List count/freshness retained; List to Map web fallback retained; shared preview expands/collapses through its accessible control; close and existing court-detail navigation work; 320-unit preview has no horizontal overflow. The shared preview is opened through the existing court focus route, not a simulated native marker.
- Captures: [compact shared preview on web](map-preview-evidence/compact-preview-web.png), [expanded shared preview on web](map-preview-evidence/expanded-preview-web.png), [narrow preview on web](map-preview-evidence/compact-preview-narrow-web.png), [web fallback](map-preview-evidence/web-map-fallback.png). These show actual implementation and explicitly synthetic test account/catalog transport. They are not native map captures or geographic evidence. The metadata visible behind the web preview belongs to the preserved web fallback/list, not the native map footer.
- `npx expo export --platform ios --output-dir .harness/map-preview-ios`: PASS, full native entry graph, 3655 modules, Hermes bundle and 35 assets. First attempt failed because Hermes could not write its sandbox temporary bytecode file; reran with TEMP and TMP scoped to `.harness/map-preview-temp` and succeeded. No application workaround or environment-file modification. A first browser run timed out during startup; rerun after bundling succeeded. No claim that these tooling failures were native runtime failures.

## Native review pending

This Windows environment has no attached iPhone capture/control surface. The real map cannot render in the supported web fallback. Therefore screenshots of the full native map and a selected native marker with compact preview have **not** been generated or verified here. Do not replace them with a fabricated map, new mockup or a browser fallback labelled as native.

On the owner's iPhone in Expo Go:

1. Enter Courts list, then Map. Confirm compact search/switch and floating location remain. The normal map has no count/freshness footer and reaches the top of the tab bar with no duplicate safe-area gap.
2. Select a court marker. Confirm the same marker stays highlighted, only one compact sheet opens, and real name/type/surface remain readable with View court primary.
3. Expand by upward gesture and secondary control; scroll expanded content, collapse, then close by X, VoiceOver escape and platform back where applicable. Check return focus.
4. Select again and open View court. Confirm correct existing detail route and restored context when returning. Repeat rapid marker changes and large text/reduced motion.
5. Supply screenshots of unselected full map and selected compact preview (expanded capture helpful). Native gestures, VoiceOver, enlarged text, bottom geometry and marker highlight remain unverified until observed.

Await owner visual approval. SPEC-003 remains open, T05 in_progress, T06 todo; no commit/push or unrelated work.


## Formal owner visual approval — 2026-10-16

The owner formally approves the implemented Profile and Map visual versions and requests no further visual changes for now. This supersedes earlier pending owner visual acceptance, not unexecuted physical checks. Keep iPhone enlarged text, VoiceOver, safe areas and long-email behavior pending. Avatar, editing and expanded profile data remain future functional SPEC work only. Browser long-email coverage is historical evidence, not a substitute for the requested native check. Approval does not close SPEC-003 or authorize commits/push.
