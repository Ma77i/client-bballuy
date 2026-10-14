# Mandatory R03 implementation fidelity contract

Status: proposed, requires explicit owner approval before implementation.

1. Owner must approve R03. Freeze board files, component/layout specifications,
   asset versions and SHA-256 manifest together; record approval date and message.
2. Approved R03 images and specifications become the visual source of truth.
   Runtime code cannot freely reinterpret their composition.
3. Never replace designed illustrations with small generic icons, compact selectors
   with oversized button grids, or horizontal illustrated cards with text-only cards.
4. Do not add paragraphs or buttons that materially change the approved hierarchy.
5. Preserve spacing, type, colors, illustration placement, proportions and selected
   states. Required deviations must be documented and approved **before** implementation.
6. Every completed screen must be tested on a real iPhone and compared with its
   corresponding approved board. Functional correctness alone is insufficient.
7. Significant visual mismatches must be corrected before task closure. Green tests
   do not grant visual acceptance, publication or deployment permission.

## Measurement and evidence protocol

Use the owner's iPhone16 Pro, record actual logical window, safe insets, iOS/Expo
versions, font scale and Reduce Motion setting. Capture default and amplified text,
matching route/state/data. Compare content excluding OS chrome and actual map tiles;
map tiles vary, but viewport geometry/controls/selection/sheet do not. Bracket
bindings are replaced with real data; no fixture people or fictional attendance.

Baseline acceptance: gutters16±2 pt; main gaps12±2; fixed control/illustration boxes
within±4 pt; typography family/weight exact, size within±1 pt at reference font scale;
colors exact semantic tokens, no unapproved replacements. Text contrast≥4.5:1,
meaningful control/focus boundary≥3:1; touch hit≥48 pt. Normal art dimensions and
composition must match the inventory. No clipping, CTA behind dock, disabled
closed-state enrollment, fabricated labels or unexpected navigation controls.
Natural text wrapping and documented accessibility stacking are exempt from fixed
height comparisons, not from hierarchy, reachability or readable contrast.

Save native captures and annotated comparisons per screen, with measured bounds,
pass/fail, exceptions and owner review. Do not use a whole-image pixel threshold as
the only acceptance test: native glyph rendering, real content and maps differ.
Unapproved structural changes always fail regardless of numerical similarity.

## Screen checklists

### Canchas list/map

- [ ] One heading; search48, segments48, cream/orange selected semantics.
- [ ] Horizontal card art116 × 128 at left, name at right, outline CTA48.
- [ ] Only real type/surface/activity; disclosure remains readable.
- [ ] Reference map stage522; actual measured layout maximizes remaining height.
- [ ] Location48; selected marker halo; exactly one content-sized sheet.
- [ ] Close/expand48 reachable with VoiceOver; focus returns; rapid markers replace.
- [ ] Location denied/error does not block exploration; large text and reduce motion.

### Detail

- [ ] Three named groups; art164 × 156; no technical membership terminology.
- [ ] Coordinates secondary; location centers/selects actual court and returns context.
- [ ] Organize primary within JUGAR ACÁ; save/remove secondary and server-confirmed.
- [ ] Pending/error/readback/confirmation unchanged; long name and2× text reachable.

### Mis canchas

- [ ] Same illustrated card system; only actual saved account IDs; no fake facts.
- [ ] Refresh48/pull; empty art220 × 220 and one Explorar canchas CTA.
- [ ] Loading, refresh failure and retry distinct from empty; account isolation holds.
- [ ] Real-device navigation list→detail→saved list→detail and long-text capture.

### Jugar

- [ ] Two compact179 × 48 selects; correct real options/check-selected state.
- [ ] Format92 pt well, 1v1/2v2/5v5 legible, capacities2/4/10.
- [ ] Real state/time/organizer/availability; closed states cannot join improperly.
- [ ] Dock88 above actual tabs;186 reference scroll reservation; last CTA reachable.
- [ ] Existing create/join/leave/manage/result/history and uncertain readback intact.
- [ ] Selection immediate; no motion-driven state; interrupted/reduced-motion capture.

### Perfil

- [ ] Original player220 × 248, name32, compact56 pt grouped rows.
- [ ] No invented account field/avatar/photo/edit action; report existing config only.
- [ ] Logout reachable at default and amplified text; no account data leakage.
- [ ] Large name wraps, content scrolls, minimum160 pt character retained on adaptation.

All boxes currently unchecked: this document specifies future implementation
acceptance; R03 render review is not native or runtime acceptance.
