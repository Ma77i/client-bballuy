# T02 — presentation foundations — authorized scope

Owner authorized this scope on 2026-10-13. T02 is locally verified; see
[t02-verification](t02-verification.md). T03 onward remains unauthorized. T01 approved
R02 + R02.1 and SPEC-002 local acceptance are recorded in t01-closure.md. This scope
is bounded to reusable foundations; no complete screen redesign in T02.

## Included

1. Consolidate semantic presentation tokens: navy/orange/cream, readable text and
   meaningful boundaries, spacing, radii, type styles, focus/selected/pressed/busy/
   disabled/error states. Include light-surface variants; no new theme-setting feature.
2. Keep Lexend and validate/bundle the existing Teko SemiBold candidate for display
   titles, including actual font source/version/OFL notices and Spanish glyphs. Preserve
   system text scaling and startup fallback. No dependency or Expo upgrade.
3. Prepare optimized original generic ball/hoop and compact character assets consistent
   with approved art; local provenance/manifest and explicit generic-media/failure
   fallback. No court photograph sourcing, gallery, upload or backend image field.
4. Implement/reconcile shared presentation primitives in existing Expo structure:
   typography, primary/secondary/danger button, panel/card surface, field/search,
   visual choice/format tile, notice/loading/error/success and generic media wrapper.
   Preserve component APIs and existing confirmation/recovery behavior; no reorganization.
5. Add reusable decorative motion/reduced-motion utilities with approved defaults
   (press 100/80 ms, selection 140 ms, inline confirmed feedback 180 ms). They observe
   real state, never own requests/validation/eligibility or delay action/state updates.
   Sheet 240 ms policy is defined here; actual marker/sheet orchestration belongs T03.

## Intended file boundaries

Existing constants/colors, AppText/font loader and root font initialization as needed;
local assets/fonts/illustrations/licenses and narrowly scoped shared presentation
modules; existing pickup/Kit adapters only where required for shared primitives.
Finalize exact file paths after inspecting existing conventions, without mass moves.
Root edits only for font/presentation initialization, not navigation/auth changes.
Foundation adoption may adjust shared visuals; complete layouts/routes stay with later tasks.

## Excluded and preserved

- T03: list/map switch behavior, basketball markers, preview sheet/focus orchestration.
- T04: full court detail, My Courts and Profile layouts.
- T05: full Play/Organize/match/history/entry layouts and Spanish-copy rollout.
- T06: assembled journey/browser/native/accessibility/performance acceptance.
- No new functionality, filters, teams, gamification, ranking, points, favorites,
  statistics, public counts, attendance or reservation claims.
- No changes to hooks/lib contract behavior, capacity/defaults, request UUID/replay,
  account isolation, permissions, backend/schema/RPC/RLS/migrations/generated DB types.
- No new dependencies/upgrades, hosted operations, app publication, commits or push.

Shared primitives support approved Spanish labels; preserve existing copy semantics
and validation messages. Do not translate all screens in this foundation task.

## Exit evidence

npm run verify and existing test:client pass; add meaningful targeted checks where
new primitive interaction/reduced-motion/disabled behavior warrants them. Inspect
foundation states in a local preview: contrast, readable Spanish glyphs, focus/busy/
disabled semantics, text scaling and fallback media. Record exact environment/steps,
observed outcomes and unverified native limits. No mock success replacing readback.
Full marker/modal/gesture/VoiceOver and performance proof remain T03/T06, not inferred
from static/unit checks. T02 done requires reproducible repository evidence.

Authorizing T02 authorizes only this foundation scope, not automatic T03+ execution
or deployment. Pause at T02 completion and report checks and the next task for review.
