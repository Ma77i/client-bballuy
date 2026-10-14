# ADR 0016 — shared presentation foundations

Date: 2026-10-13. Scope: authorized SPEC-003 T02 only, approved R02 + R02.1.

## Context

Existing court/auth screens use constants/colors; pickup Kit contained a separate
palette and primitives. Replacing complete layouts is T03-T05. Existing primary is
used for both links and white-label fills, so blindly changing it to brand orange
would reduce contrast while requiring unrelated screen edits. Existing font files
and validated business/request recovery must be preserved.

## Decision

- Single semantic source constants/design; colors and pickup Kit are compatibility
  adapters, not independently maintained design systems. Legacy primary/primaryDark
  remain explicit migration tokens until context-specific adoption in T03-T05. New
  buttons/choices use orange/navy and role-specific dark/cream surfaces. No new theme
  selector or route. Meaningful boundaries use muted/light-boundary tokens, not the
  low-contrast decorative separator. No blanket disabled opacity.
- Canonical primitives live in components/foundation; existing GameButton/Choice/
  Field/Panel/Notice imports retain their APIs through Kit reexports. Body sizing is
  opt-in through AppText variants to avoid clipping legacy titles with inherited line
  heights. Existing controlled values, handlers, confirmation/retry logic remain owned
  by callers. Explicit ARIA checked/busy/description supplements native semantics on
  React Native Web 0.21; keyboard focus has a visible offset outline.
- Retain four loaded Lexend 1.007 binaries. Bundle static Teko weight 600, Version
  2.000, from Google Fonts CSS family=Teko:600 (pinned gstatic v23 URL in manifest).
  Its internal family is Teko Light SemiBold; Expo registers explicit Teko-SemiBold
  alias. No variable font instancing or package needed. Validate SFNT weight, Spanish
  cmap and hashes without dependencies. Preserve embedded Lexend 2019 copyright,
  supply original notices and upstream OFL text; no claim that current upstream
  binaries equal the existing files. Unloaded custom fonts use Lexend-Bold for display
  when available, otherwise the system font. Font-source map is shared with the fixture.
- Original generic ball/hoop and decorative fictional adult character created by
  built-in image_gen with approved art reference; optimized alpha WebP 256px bounds.
  Two assets total 40,338 bytes. Source prompts, generation filenames/dimensions/
  hashes recorded locally. No court photos, participant/avatar mapping or backend
  field. GenericMedia labels illustrations; failed source -> local art -> static
  vector ball if local decode also fails. Changed source identity resets that chain.
- Existing React Native Animated suffices for bounded transform/opacity utilities:
  native driver on mobile, JS driver only on web. One presentation provider observes
  reduced-motion/app activity, conservatively static until preference resolves. Events
  win late initial queries; cleanup ignores late responses. Background epochs cancel
  stale presses. Callers can disable one-shot feedback on screen blur. No animation
  callbacks mutate business state or start requests. No new dependency or looping art.

## Alternatives and consequences

A second independent arcade Kit would duplicate maintenance; rejected. Global primary
replacement and whole-screen adoption would exceed T02 and risk legacy contrast;
deferred rather than claiming all screens already redesigned. Reanimated is installed
but unnecessary for these simple effects; no new animation package or worklet setup.
Variable Teko requires extra preprocessing and has platform caveats; static validated
file is smaller and explicit. Raster art is decorative; meaningful UI icons stay vector.

Browser fixture is a standalone Metro entry outside app/routes, not a product screen
or business simulator. Scripts serve localhost-only resources; no auth/backend writes.
Native bundle transform proves syntax/resource packaging, not physical-device rendering,
VoiceOver, actual Dynamic Type, gesture/modal focus or release performance. Those
checks remain T03-T06. No T03 continuation authorized by this decision.

## Sources and evidence

- [T02 scope](../../specs/003-arcade-ux-ui/t02-scope.md) and
  [verification](../../specs/003-arcade-ux-ui/verification.md).
- [Expo SDK 57 Font](https://docs.expo.dev/versions/v57.0.0/sdk/font/) and
  [React Native AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo).
- [Lexend OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/lexend/OFL.txt),
  [Teko OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/teko/OFL.txt).
- Local assets/fonts/manifest.json and assets/illustrations/manifest.json;
  node scripts/verify-presentation-assets.mjs and tests/presentation.test.cjs.
