# Play fidelity correction — 2026-10-15

Owner approved final My Courts after copy/color/touch checks and authorizes Jugar
only. R02/play.png composition and R02.1 state/motion rules are authoritative;
R03 discarded. No new boards/assets/dependencies/backend/contracts/domain rules.

## Acceptance before implementation

- Compact ENCONTRÁ TU PARTIDO heading; exactly two compact selectors Cancha/Formato
  using existing Dropdown adapted opt-in, no oversized choice grid.
- Existing filtered server sessions in horizontal cream sports cards: large original
  art/format at left, real state/court/time/organizer/availability and read CTA right.
- Owner copy uses partido in this screen. Existing destination flows/contracts keep
  their functionality; no new invitation/player/guest capability.
- Fixed sibling dock above existing tabs/safe inset with Armar partido and Jugar
  ahora; scroll gets remaining space, no action hidden by overlay. Large text
  reflows controls and dock. Existing create/quick routes get selected real filters
  when present, no selection/request/submission side effect. Quick form already
  supports selecting a court when no Cancha filter was set; validations unchanged.
- Mis partidos and Historial routes remain accessible. Duplicate owned-game section
  on discovery can give way to existing personal destination; organizer management
  remains reachable via personal game detail's existing owner-only manage action.
- Preserve loading/empty/errors/retries/pull refresh, actual capacities/states,
  no invented people/counts/results, preference-aware motion and accessible focus.
- New sports option on SessionCard only for Jugar, preserving approved CourtActivity
  and personal-screen callers. Dropdown opt-in preserves existing default styling.
- Verify/client and actual browser implementation/captures; iPhone acceptance pending.

No next screen, commits/push or SPEC closure. My Courts and Detalle must remain
unchanged after their approval.

## Implementation and observed evidence

2026-10-15, Windows/Node local workspace on SPEC-003/design, preserving existing
uncommitted changes. Implementation screenshot comparison was made against
[approved R02](design-r02/play.png), R02.1 state/motion decisions and the owner's
latest compact-header/fixed-dock requirements. No new mockups or image assets.

Files for this correction:
- app/(tabs)/play.tsx: compact heading, existing personal/history destinations,
  presentation-only controlled filters, non-scrolling dock above existing tabs.
- components/pickup/DiscoverGames.tsx: compact existing Dropdown selectors,
  unchanged sessionGroups/filter predicates, Spanish partido copy and query states.
- components/pickup/SessionCard.tsx: opt-in horizontal sports composition; original
  112 pt bundled artwork at left, format and real catalog data. Existing other
  callers retain their previous branch. Accessible card label includes schedule,
  organizer when available, real availability and started-state qualification.
- components/ui/dropdown.tsx: optional arcade surface/label, 48 pt targets,
  checked radio semantics, explicit close, keyboard Space activation, modal focus
  and return to trigger, reduced-motion-aware modal. Default visual styles retained.
- Final My Courts only: app/(tabs)/my-courts.tsx and optional Button foregroundColor
  in components/foundation/Primitives.tsx; see its separate approval record.
- tests/browser/play-fidelity.js, updated tests/browser/my-courts-fidelity.js,
  these evidence images and documentation. No domain hooks or backend edits.

Executed:
- npm run verify: PASS (docs, TypeScript, ESLint).
- npm run test:client: PASS 109/109, including capacity/lifecycle/uncertain-state,
  presentation contrast, motion, account isolation and membership regressions.
- Existing My Courts isolated browser test: PASS 8 checks; refresh 48 x 48,
  exact requested subtitle/orange/navy and unchanged navigation/recovery.
- Play isolated browser test: PASS 6 grouped checks on the actual Expo web app
  at localhost:8091, viewport 402 x 874. All auth/REST traffic simulated in an
  isolated context; no persistent QA account, remote mutation or product fixture.
  Three test-only rows exercised 1v1/2v2/5v5 and full capacity. Observed filters,
  Space selection and focus restoration, create/quick filter parameters,
  personal/history routes, loading, empty, read error/retry and fixed dock while
  scrolling. Dock button measured 183 x 50 at y748, above tabs. Narrow 320 pt,
  reduced-motion preference and doubled CSS text stress had no horizontal overflow.
  CSS text stress is not an iOS Dynamic Type validation.
- First browser attempt used a wrong progressbar locator; the shared loading state
  is text, not that role. Corrected test locator, reran successfully. No product
  failure was hidden or excluded.

Captures from implementation (test data explicitly simulated, never production):
[list](play-fidelity-evidence/list.png),
[selector](play-fidelity-evidence/filters.png),
[empty](play-fidelity-evidence/empty.png),
[error](play-fidelity-evidence/error.png),
[text stress](play-fidelity-evidence/text-stress.png).

## Comparison and remaining limits

Recovered R02 composition: navy base, compact cream selector pair, cream horizontal
cards, large left sport/format panel, right court/status/schedule/organizer and CTA.
No oversized hero or duplicate organizer feed. Existing Mis partidos/detail still
provide management. Latest owner decisions deliberately supersede the board's
larger header and inline action area with a compact title and fixed dock.

Existing provisional local illustration is reused, without generating new art or
reproducing the board's complete raster texture/scene. Buttons retain the established
accessible orange-action/white token; brand orange is present in selection/badges.
Cards grow/reflow instead of clipping large text. These are documented adaptations,
not a new design reference. Live discovery still reads only open/started sessions;
closed states remain in existing personal/history flows, not added to public feed.

Physical iPhone 16 Pro, Dynamic Type, VoiceOver focus/restoration, native picker
scroll/close, safe areas and pull-to-refresh remain NOT executed. No new iOS export
or native performance claim this turn. Browser captures do not prove native parity.

## Owner iPhone review gate

1. Reload Expo Go, open Jugar; compare compact title, selector pair and large-left
   illustrated cards. Use only existing real sessions; an empty server list is valid.
2. Select Cancha/each Formato; close selectors explicitly; check result and focus.
3. Scroll to the last card: dock stays above tabs and covers no content. Open each
   dock action, confirm court/format where selected, then return without creating.
4. Check Mis partidos/Historial and return. Pull to refresh; review real query states.
5. Enable larger iOS text, VoiceOver and Reduce Motion; check card/control reflow,
   complete labels, selector dismissal/return focus and bottom safe area.
6. Provide iPhone captures for visual approval. No next screen until approval.

My Courts is approved/frozen; Detalle unchanged. Jugar awaits owner native/visual
review. T05 remains in_progress, T06 todo, SPEC-003 open. No commit or push.

## Owner correction of rejected implementation — 2026-10-15

The preceding implementation is NOT visually approved. Current acceptance supersedes
its text-only header and provisional art adaptations: restore compact illustrated
BBallUY Arcade / JUGAR header; original R02 art left with live format overlaid;
compact cream cards, court/status aligned, icon-led real metadata, integrated CTA;
green open, blue started, distinct full/cancelled/completed; exact #FF8A43/navy CTA.
Preserve existing selectors, dock, routes, truth/registration rules and query states.
Only Play callers change; approved courts/detail/My Courts remain frozen.

Inventory before code: R02 is a flattened board; no standalone header or three card
background assets. Existing runtime art has only court-placeholder.webp/player.webp,
which is not equivalent. R03 art is excluded. Owner explicitly authorized extracting
and optimizing art from the attached R02 board. No image generation or new design.
Use text-free crop areas; all formats/people/schedule/count/state remain live text.
Source crop dimensions and resolution limits must be recorded. Actual iPhone visual
acceptance remains required; verify/client/browser captures cannot close the SPEC.

## Recovered R02 composition and verification

Current source of visual truth is the owner's attached first phone, copied unchanged
as [owner-reference.png](play-r02-recovery-evidence/owner-reference.png). It differs
slightly from the earlier repo raster in illustrative copy/detail content; no
synthetic date/count/name from either board enters production data.

Files changed this iteration:
- app/(tabs)/play.tsx: illustrated header, personal/history links after list as in
  reference, exact brand orange/navy primary dock action; existing navigation intact.
- components/pickup/PlayArt.tsx: owner-authorized header/card crops, local fallback,
  live brand/title/description, large-text/narrow header reflow; no domain state.
- components/pickup/SessionCard.tsx: sports branch only: 110 pt illustrated left
  panel, live overlaid tilted format, court plus small real-state tag, calendar/
  availability/organizer icons, integrated orange/navy CTA and compact spacing.
  Existing non-sports branches and other screen callers retain their presentation.
- components/pickup/DiscoverGames.tsx: compact real update time, no redundant
  immediate-group heading; existing filters/group predicates/queries untouched.
- components/pickup/play-presentation.ts: presentation-only state label/color map.
- assets/illustrations/r02-play/: four WebP crops and provenance manifest.
- scripts/extract-r02-play-art.py: reproducible rectangular extraction; existing
  bundled Pillow runtime, no dependency added or image generation.
- tests/presentation.test.cjs, tests/browser/play-r02-recovery.js and documentation.

### Element-by-element comparison

1. Header: R02 brand left, large JUGAR, short description and orange ball/hoop art
   right recovered using the actual source crop. Compact ~148 pt at default size;
   larger text/narrow width moves art into flow instead of overlapping readable text.
2. Selector pair: existing compact cream Cancha/Formato retained. No choice grids.
3. Ticket surface: cream horizontal rounded cards, 8 pt padding and illustrated left
   panel, right information. First observed card ~170 pt, down from previous~238 pt.
   Height grows for long names/organizers, started caveat or accessibility text.
4. Format/art: actual R02 crops, different ball/hoop compositions per1v1/2v2/5v5,
   live format overlaid rather than sitting in a separate block above a generic icon.
5. Metadata: real court title and small state tag together; icon-led schedule,
   actual available/total places and organizer only when server data exists. No
   default Organizer placeholder emitted. Started label does not imply attendance.
6. States: green Abierto, blue Iniciado, amber Completo, red Cancelado, navy Finalizado;
   labels distinguish without relying on color. Five foreground/background pairs
   pass >=4.5:1 contrast. Completed/cancelled are not added to public discovery;
   existing personal/history access and lifecycle rules remain unchanged.
7. CTA: Ver partido is integrated right, min48 pt, #FF8A43/navy. It only opens detail;
   full/closed detail remains readable, no join permission implied. Primary dock
   uses same exact orange/navy. Secondary Jugar ahora retains existing outline.
8. Bottom: fixed dock and existing four-tab navigation retained as expressly
   requested; personal/history links remain in list flow after results. No original
   board's unimplemented capabilities or illustrative participant values introduced.

### Extraction provenance and remaining visual differences

There were no standalone R02 header/ticket illustrations in runtime assets; only
flattened board and two later generic illustrations. R03 was explicitly excluded.
After the owner's explicit authorization, four text-free regions were cropped from
that board, without painting/generating pixels or upscaling. Each output has source
rectangle, dimensions, SHA256 and byte count in assets/illustrations/r02-play/manifest.json.
Combined payload33014 bytes. Reproduce with existing bundled Python/Pillow:
`python scripts/extract-r02-play-art.py` in an environment already providing Pillow.
No install is needed for the app; extraction is not part of app startup/build.

Clean crops avoid the board's baked format labels and illustration captions. They
therefore use different framing from the flattened original ticket panels. At110 pt
wide on3x iPhone screens these small sources cannot provide native-resolution art:
source widths110-225 px/heights91-112 px, not independent high-resolution layers.
Ball/hoop texture framing, some edge sharpness and the original distressed display
font remain differences. Runtime uses existing Teko/Lexend, not an unlicensed
replacement. No exact pixel-parity/Retina-quality claim. High-resolution clean
source layers would be needed to remove these limitations without generating art.
Readable native formats/metadata/controls remain sharp, not baked into imagery.

### Executed checks

2026-10-15, Windows, branch SPEC-003/design, existing local changes preserved:
- npm run verify: PASS docs/typecheck/lint.
- npm run test:client: PASS111/111 (previous109 plus badge contrast/state precedence
  and source/crop integrity/budget checks). Existing membership/lifecycle/recovery,
  capacities2/4/10 and account-isolation coverage retained.
- tests/browser/play-r02-recovery.js: PASS6 grouped actual-Expo-web checks using
  isolated simulated auth/REST transport, no live-account or backend writes.
  Four fixtures cover three formats, open/full/started, three distinct art sources,
  <=220 pt default first card, exact orange/navy CTA, fixed183x50 dock buttons,
  selector filtering/Space activation/focus return, create/quick filter carry-over,
  personal/history routes, loading/empty/error/retry, narrow populated card and
  doubled-CSS-text stress with reduced-motion preference. No horizontal overflow.
- Source hashes confirm approved My Courts, court detail, CourtCard, CourtDiscovery
  and CourtActivity unchanged. No backend/contracts/permissions/dependencies changes.

Actual implementation evidence (all visible test games/organizers are simulated):
[list](play-r02-recovery-evidence/list.png),
[selector](play-r02-recovery-evidence/filters.png),
[empty](play-r02-recovery-evidence/empty.png),
[error](play-r02-recovery-evidence/error.png),
[text stress](play-r02-recovery-evidence/text-stress.png).
Earlier screenshots remain separate historical evidence of the rejected version.

### Required owner iPhone gate — not executed

Reload Expo Go on iPhone16Pro and capture Jugar at normal text. Review header/art,
card proportions/texture sharpness, names and available real sessions; server empty
is valid. Exercise both selectors, open a full game's detail if one exists, both dock
routes, personal/history and back. Scroll last result and pull-refresh. Repeat with
larger iOS text, VoiceOver and Reduce Motion, checking focus, no truncation/overlap
and safe areas. Browser CSS stress does not certify Dynamic Type or native focus.
No native device/performance verification claimed. Stop here for owner review;
T05 stays in_progress, T06 todo, SPEC-003 open; no commits/push or next-screen work.

## Owner visual approval — 2026-10-15

Owner explicitly approves Jugar visually and authorizes only Armar partido next.
Minor follow-ups remain: integration of illustrated header, availability wording
clarity, and correct full-game behavior. These are tracked, not declared resolved
or newly verified. Do not change Play during the organizer-only correction.
