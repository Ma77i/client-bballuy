# T03 focused visual refinement — 2026-10-14

Owner requested this refinement after real iPhone visual testing: recover court
discovery space, reduce list/card/sheet height and prioritize Ver cancha. No exact
device/version, VoiceOver, Dynamic Type or complete case outcomes were supplied;
the feedback authorizes the refinement, not native acceptance or T03 closure.
Branch SPEC-003/design; existing uncommitted T03 and Router compatibility work preserved.

## Presentation differences

- Court header: 28/32 sports title, 8 vertical / 12 horizontal padding, 4-unit gaps.
  Search retains a visible 14/21 label and its accessible association; compact input
  padding reduces its normal height to 48. List/Map remain 48-high checked controls.
- Cards: 12 padding, 4-unit gaps, 26/30 sports title and full truthful attributes.
  Art shrinks from 56 to 28; its 14/21 disclaimer sits beside it instead of taking
  a wide side column. Ver cancha indication remains; the entire card still activates
  the existing detail callback. No fixed height, text truncation or scaling cap.
- Sheet: content-sized ScrollView explicitly has flexGrow 0 / flexShrink 1, inside
  the existing available-height cap. It no longer reserves the maximum height for
  short content. The handle/title share a >=48 region; Close is a 48x48 quiet icon
  control with accessible name Cerrar. Ampliar/Ver menos is an unfilled secondary
  text control, >=48 high, retaining expanded state and tap expansion. Ver cancha
  is the sole filled orange CTA, full width. All content can still scroll when needed.
- Sheet art is 28 with its unchanged disclaimer alongside it. Native font scale
  >=1.5 still removes art and automatically exposes expanded attributes. Caption,
  title, facts, controls and CTA scale/reflow without truncation.
- Removed duplicate bottom safe-area padding in the Courts screen: the existing
  tab navigator already reserves 64 + bottom inset and pads that inset. The sheet
  stays inside the tab content above that bar; the navigator itself was not edited.
  Device safe-area placement must be rechecked rather than inferred from web.

## Incremental file scope

CourtDiscovery.tsx, CourtCard.tsx, CourtPreview.tsx and app/(tabs)/map.tsx contain
these presentation changes. Primitives.tsx adds opt-in compact Field / quiet and
icon-only Button options; defaults remain unchanged elsewhere. GenericMedia.tsx
adds opt-in inline compact media/disclaimer, preserving source/local/symbol fallback.
DiscoveryPreview.tsx adds an isolated sheet review using the actual component and
second exact seed court; its native focus/animation are deliberately inactive.
Documentation and separate refinement screenshots accompany this change.

No edit to native CourtMap, discovery reducer, motion provider/utilities, catalog
loader/filter, location permissions, activity queries, route contracts, backend/RLS,
dependencies, membership rules or My Courts/Play/Profile. No commit/push; no T04.
The existing heading ref, focus/escape/back callbacks, single selection, rapid
replacement and reduced-motion paths remain in place. This is code preservation,
not a claim that a physical accessibility/gesture regression test was executed.

## Executed checks

Windows/PowerShell, Expo 57.0.24, RN 0.86.3, Node 24.16.0.

```powershell
npm run verify
npm run test:client
node --test tests/court-discovery.test.cjs tests/court-catalog.test.cjs tests/presentation.test.cjs
git diff --check
```

Verify passes; 105 client tests pass with zero failed/skipped. Focused suite 17/17
passes, including selection/replacement/removal, gesture thresholds, location denial,
motion preference races, reduced/blocked/background policy, contrast and asset integrity.
No new test mirroring styling was added; browser checks exercise the actual controls.
No Edge or harness implementation edited; their separate checks are not required here.

Full actual iOS app export with the Router compatibility guard enabled passes,
Hermes bundle 7.1 MB / 3633 modules. Reproduction follows the writable temporary
directory procedure in t03-verification.md; use output directory
.harness/t03-refined-ios-export. This is compilation, not iPhone execution.

## Observed browser review

Run the existing local device launcher and, separately:

```powershell
node scripts/foundation-preview.mjs 8090 8197 DiscoveryPreview
```

Open http://127.0.0.1:8197; isolated real-component gallery with seed data, explicit
test controls and simulated navigation. It does not certify authenticated routing,
native markers, gestures, focus or real Dynamic Type.

- At 390x844: header content 177 px, input/selectors 48 high, all three cards 113 high.
  Generic illustrations load; names/attributes and no-photo captions remain visible.
- Probar hoja: compact sheet 197 high, content-sized; Cerrar 48x48, Ampliar 48 high,
  Ver cancha 50 high/full width. Ampliar changes aria-expanded false -> true and
  reveals original lighting outdoor and note; height grows to 253. Ver menos restores
  compact content. Ver cancha passes ID 61b2c883-d029-4725-9142-bc1af122b84f to the
  simulated detail. Cerrar removes the sheet through the existing callback.
- At 320x568: cards reflow to 142 high without horizontal overflow. Compact sheet
  caption wraps fully; all three controls remain >=48 and reachable, without clipping.
- Rechecked search rodo -> two original records; selecting Mapa retains the query,
  checked state, two cards and the existing mobile-map explanation on web.
- Original t03-evidence/web-list.jpg remains unchanged for comparison. New captures:
  [list](t03-evidence/refinement/list.jpg) and [sheet](t03-evidence/refinement/sheet.jpg).
  Test-only buttons/text in captures are absent from the real app.

## Next iPhone review and status

T03 stays in_progress; T04–T06 remain todo. Reopen/reload the local Expo Go project
on the same Wi-Fi using the existing device launcher; no database reset or hosted
backend is needed. The Expo server is left running for the owner's review.
Repeat compact header/cards/sheet, Close/Expand/CTA, rapid marker A/B/A, current
selection, focus restoration, text >=200%, safe-area/keyboard/landscape and Reduce
Motion cases in t03-iphone-review.md. Record actual observations before closure.
No new physical-device result or production-performance guarantee is claimed.

Final verify checked 63 Markdown files and passed client TypeScript/lint. Final
test:client remained 105/105 with zero skipped; git diff --check passed. Local
device Metro status returned HTTP 200 / packager-status:running. Compatibility
guard-disable environment flag was absent. These are local observations only.
