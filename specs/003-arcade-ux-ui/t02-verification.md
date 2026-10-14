# T02 foundation implementation and verification — 2026-10-13

Environment: Windows/PowerShell, existing dirty tree; Expo 57.0.24, React Native
0.86.3, RN Web 0.21.2, existing React 19.2.3. No dependency/lockfile changes.
Owner explicitly authorized t02-scope.md only. No T03+ implementation, commits/push.

## Component and file inventory

- constants/design.ts: semantic palette/surface tones, type/spacing/radius/touch/motion.
- constants/colors.ts: compatibility adapter, including explicitly transitional
  legacy primary. No implicit white-label orange migration of unrelated screens.
- constants/font-assets.ts and app/_layout.tsx: shared font registration plus
  presentation provider. Existing stack/auth/account structure and guards unchanged.
- AppText.tsx and font-policy.ts: opt-in variants and loaded-font/system fallback;
  preserve caller sizes, scaling and unknown/system font families.
- foundation/Primitives.tsx and styles.ts: Button, Choice/ChoiceGroup (format emphasis and labelled radio context),
  Field (also supports controlled search inputs), Panel/card surface, Notice and
  StateView. Native/ARIA role/states, named fields and errors, focus, ≥48 targets,
  wrapping, stable button border dimensions, dark and cream variants. No query logic.
- pickup/Kit.tsx: aliases to those canonical primitives/styles, no duplicate palette.
- PresentationProvider, useDecorativeMotion and motion-policy: pooled preference/app
  activity, cancellable press transform and caller-signal one-shot opacity feedback,
  reduced/static and background/blur cleanup. No animation-controlled request/state.
- GenericMedia: labelled generic source/local/symbol fallback, source-key reset,
  reserved dimensions and zero image transition; decorative accessible-tree exclusion.
- assets/fonts: retained Lexend files plus Teko-SemiBold.ttf, OFL/NOTICE/source CSS,
  metadata/hash manifest. assets/illustrations: two optimized local WebP, manifests
  and full built-in generation prompts. No photograph or profile/participant asset.
- scripts/verify-presentation-assets.mjs: reproducible SFNT Spanish coverage/metadata/
  license/hash/media-budget checks. tests/presentation.test.cjs adds seven meaningful
  contrast, motion preference/race/cleanup, font fallback and asset-integrity cases.
- tests/fixtures/FoundationPreview.tsx + scripts/foundation-preview.mjs: isolated
  component gallery, never imported by app routing; actual primitives/asset loaders,
  existing format/capacity constants, local UI probes, no auth/backend entity fixtures.
- ADR 0016 records font/resource provenance, adapters, animation approach and limits.

## Reproduction

1. npm run verify; npm run test:client; node scripts/verify-presentation-assets.mjs.
2. Start node node_modules/expo/bin/cli start --web --localhost --port 8093.
3. Start node scripts/foundation-preview.mjs 8093 8196; open http://127.0.0.1:8196.
   Windows Metro localhost binds ::1 here; gallery proxies /assets to localhost:8093.
   No product navigation/route added. Gallery JS uses dev=false/minify=false to avoid
   unrelated development WebSocket channels. Use local free ports if needed.
4. At 375x812 and 812x375, inspect dark/cream controls and original art; activate Action
   once, toggle busy, activate busy/disabled probes: counter stays at one. Busy and
   disabled exposed; toggle off and choose 5v5: checked true, previous 2v2 checked false.
   Focus action: 3px outline with offset; field help linked by aria-describedby.
5. Scroll to media: lazy decode loads both assets. Invalid inline PNG produces the
   same local ball/hoop fallback; no failed source represented as a photo.
6. Browser preference emulation: before module load supply matchMedia query
   '(prefers-reduced-motion: reduce)' with matches=true and change listeners; change
   matches false/true and dispatch change. Actual RN Web provider reports yes/no/yes.
   Action still increments immediately with reduced mode, no request or effect gate.
   Pure tests also cover late-query race and disposal. This is web emulation, not iOS.
7. Text stress: multiply rendered text/input font sizes and explicit line heights by
   two in the isolated browser. At 375px no horizontal overflow; headings/labels wrap
   and button grows. This is browser text stress, not actual native 200% Dynamic Type.
8. Fetch localhost:8093/tests/fixtures/FoundationPreview.bundle?platform=ios&dev=false&minify=false;
   HTTP 200/native transform is compilation only, not device acceptance.

## Observed evidence and correction history

- Initial baseline: verify PASS, 94 existing client tests PASS.
- Font audit: 5 static fonts, required ÁÉÍÓÚÜÑáéíóúüñ¿¡ mapped; Teko weight 600,
  18,180 bytes; total active fonts 332,596 bytes. All five served HTTP 200 and browser
  FontFace loaded after forcing unused Medium/Bold; normal text/title use Lexend/Teko.
- Art: alpha preserved (0–255), 256x250 and 256x234 WebP, 21,898/18,440 bytes;
  40,338 total. Placeholder and character decoded, invalid source restored placeholder.
- Browser activation counter 1 after normal action and unchanged after busy/disabled;
  aria-busy/disabled true. 5v5 checked true, previous 2v2 false, help description linked.
  375 and 812 widths match viewports; no observed horizontal clipping in gallery.
- Browser reduced preference yes -> no -> yes and reduced-mode action count 1.
- Native fixture bundle HTTP 200, 6,201,772 bytes including final grouping/media checks;
  this does not establish FPS/VoiceOver/actual device font rendering.
- New lint initially rejected render-time ref access/effect setState. Fixed through
  state-owned Animated values and derived epoch-based presses, no rule suppression.
- Web initially omitted native busy/checked states; explicit ARIA equivalents added
  and verified. Standalone host first used wrong IPv4 Metro origin and lacked asset
  proxy; localhost/proxy fixed; fonts/media served correctly. No backend was queried.
- npm run typecheck (generic mixed client/Deno command) failed with 27 legacy Deno
  module/global errors; npm run typecheck:app and prescribed verify pass. No Edge
  Function edited, no new exclusions or weakened checks. This is not server acceptance.
- Final verify/client tests/results and lifecycle cleanup are appended to verification.md.

## Remaining limits

Physical iPhone/Android, VoiceOver/TalkBack, native Dynamic Type/focus, interruption
timings/frame profiling and release build performance remain unverified. Legacy screen
primary/copy/layout adoption and any older loading overlays remain T03-T05, not claimed
fixed here. Caller must disable decorative feedback on navigation blur; app background
and focus/press cancellation handled centrally. Full map/sheet/eligibility journeys
remain existing contracts and later presentation tasks. No hosted/schema/RLS changes.

Final control-size probe: idle and busy action heights both 50 CSS px; aria-busy/disabled true.
Labelled radio groups in the fixture expose 3 formats and 1 single-option example.
Existing screen group/layout adoption remains T05; no screen edited to install new groups.
Three obsolete local preview hosts from startup/proxy attempts were stopped; only
Metro 8093 and final localhost gallery 8196 retained for owner review.

Missing/blank sources now select local art immediately (no decode event needed); the
seventh new test covers missing, blank and invalid module-number inputs. Gallery
includes the blank-URI case alongside intentional invalid image decoding.
