# R03 design-package verification

Date: 2026-10-14. Windows PowerShell, SPEC-003/design, existing dirty changes retained.
Scope: design/documentation only; no app implementation or native acceptance.

## Executed design checks

- Read README, project status/workflow, SPEC-003 registry/design/evidence, R02/R02.1,
  current shared/court/profile/pickup presentation and existing navigation.
- npm run harness:status: SPEC-003 in_progress, T00–T04 done, T05 in_progress,
  T06 todo. Branch SPEC-003/design. No task status/numbering was modified.
- Built review.html with local Teko/Lexend and original local art. Playwright opened
  the local file, awaited document.fonts.ready, exported each board element.
- DOM measurements: all ten main device frames exactly402 × 874 client pixels;
  collapsed bottom sheet198 px, content-sized. These are design measurements.
- Assets decoded: court-action1254 × 1254, court-secondary256 × 250,
  player-action256 × 234, player-portrait1178 × 1335. Both local fonts loaded.
- Inspected five board PNGs for hierarchy, overflow, illustration scale, selected
  marker/sheet, scrolling and amplified-content Profile. Supplement includes actual
  eligibility labels as design examples, no fabricated sessions or responses.
- Color luminance checks: orange ink #A63B00 on cream6.09:1; navy on brand orange
  7.99:1; muted #B8C3D6 on navy10.52:1. Bright orange on cream2.21:1, therefore
  proposed darker ink is required for small text. Decorative borders are not used
  as the sole focus/interactive boundary.
- SHA-256 source preservation comparison:220 existing files across app/components/
  hooks/lib/constants/assets/tests/scripts/local-backend unchanged from review start.
  Temporary capture/check scripts are ignored; source-result count recorded here.

## Reproducing the design render

Open review.html from the repository with a browser supporting local font/image
loading. Set a1280 × 1200 review viewport; wait for fonts. Export elements
#courts-board, #detail-board, #my-courts-board, #play-board, #profile-board and
#states-board as PNGs. Measure .phone clientWidth/clientHeight and .sheet bounds.
Re-export after any design edit so images match the HTML/specification. The HTML
is a review artifact, not UI component implementation or a functional preview.

## Local verification

Final npm run verify: **PASS** (85 Markdown files; docs, TypeScript and lint passed).
Scoped git diff --check: PASS (line-ending notices only). An initial run found
one missing link because this verification file was not yet written; fix and rerun
required. No failures are concealed. Client runtime tests, Edge verification and
harness tests are not newly claimed for this documentation-only revision.

## Not executed / acceptance limits

No physical iPhone render/gesture/VoiceOver/native focus, actual font-size setting,
safe insets, reduced-motion runtime, decode memory/frame performance or real-account
journey was checked for R03. Existing web captures are not native screenshots.
New PNG review masters need optimization; reused256 px art needs production-resolution
review at3×. No assertion that the remote schema matches local seeds.
No R03 approval, implementation-ready state, task completion, final verification,
commit, push or deployment. Follow the fidelity contract and owner gate next.
