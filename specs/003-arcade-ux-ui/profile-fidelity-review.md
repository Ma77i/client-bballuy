# Profile fidelity audit and implementation proposal

Date: 2026-10-16. Status: implemented and formally visually approved; physical accessibility/safe-area/long-email checks remain pending. Original audit findings are retained below.

## Sources and observed implementation

Reviewed current `app/(tabs)/profile.tsx`, `components/SignOutButton.tsx`, `components/ReportProblem.tsx`, `components/foundation/GenericMedia.tsx`, `components/pickup/PlayArt.tsx`, auth context/controller, profile hooks and the tab layout. Inspected the original local player artwork, R02 Play board and historical T04 Profile screenshot. The historical screenshot is corroborating evidence, not a fresh native capture.

R02/R02.1 have no standalone Profile composition. Reuse their navy/cream/orange system, Teko/Lexend, original sports art and soft cards. R03 is excluded. This proposal does not claim an existing approved Profile board or generate a new one.

Current screen repeats the native Perfil title as TU PERFIL, shows a 48-point player and visible generic-image caption inside a cream name card, then presents a prominent Mis canchas action, logout and support as separate blocks. The reading order gives logout priority over help. The small art and disconnected controls weaken the player-card composition. Actual spacing on the owner's current iPhone has not been freshly observed in this audit.

## Data boundary

- `useAuth().user.display_name` supplies the actual name. Keep the neutral missing-name fallback; never fabricate a player name.
- `useAuth().session.user.email` may supply the actual signed-in account email. Display it only when nonempty, read-only, with wrapping. Do not add a query or load another account.
- The local profile type also includes legacy avatar/statistical fields. Their presence in local types is not proof of meaningful or reconciled remote data; do not display role, level, game counts, scores or other statistics.
- Existing auth bootstrap/error/retry gates and account isolation remain the source of truth. Do not introduce a second profile cache or patch hook.

## Concrete proposed composition

1. Keep the compact native Perfil header and remove TU PERFIL from the content. Retain the existing tab navigation and safe-area ownership.
2. Directly below it, render one cream player card with a large original `player.webp` illustration on the left (approximately 150–180 logical units, preserving its proportions) and the actual display name in sports typography on the right. Put a small Cuenta label and the optional actual email below the name. Use the image already bundled by GenericMedia, without a repeated image caption. It is decorative sports art, never the user's photo or an editable avatar. Preserve the established local/symbol fallbacks.
3. Keep the art and name in one composition with soft borders and restrained orange accents. At enlarged text or narrow width, reflow vertically; never truncate identity or impose a fixed card height. No invented jersey number, biography, rank, team or player attributes.
4. Follow with one compact group of actions on a raised navy surface: secondary Mis canchas, Reportar un problema, then visually separated sensitive Cerrar sesión. Reuse existing buttons and logout/support components. Avoid a full-width primary orange navigation button competing with the account card. Keep support help adjacent to support, including the facts that it opens an editable mail draft and does not attach account information automatically.
5. Keep controls at least 48 logical units, natural text wrapping and scroll access above the tab bar. Use existing Teko/Lexend, palette and surface tokens. No new motion is necessary; retain existing press/reduced-motion behavior and immediate functional updates.

## Files after approval

- `app/(tabs)/profile.tsx`: composition, conditional read-only session email, secondary court navigation, grouped support/logout. No navigation destination change.
- `components/ReportProblem.tsx`: only if needed, an opt-in compact presentation for Profile's help spacing; preserve default behavior and all current callers. Do not remove explanatory privacy copy, errors, fallback contact or retry.
- Reuse `components/SignOutButton.tsx` unchanged where possible. Its pending lock, failure notice, retry and successful redirect must remain untouched.
- Reuse GenericMedia, foundation primitives, design tokens and the bundled player asset unchanged. No new asset, package, backend operation or broad shared-style change.
- Add a focused Profile browser regression/evidence and update this proposal, SPEC verification and project status after approved implementation. Record the targeted refinement under open SPEC-003 without rewriting historical T04 completion or marking T05 complete.

## Functional dependencies and acceptance plan

Support is currently hidden when EXPO_PUBLIC_SUPPORT_EMAIL is missing or invalid; retain that behavior rather than inventing a contact or nonfunctional action. No configuration value or secret is copied into this document. The report still opens the user's mail application for review, never sends automatically. Logout remains local sign-out through the existing auth controller and only redirects after success.

After implementation authorization, run `npm run verify` and `npm run test:client`; exercise real screen rendering with existing/simulated account data, missing email/name fallback, long names and email, court navigation, supported/unsupported report configuration, mail handoff failure/retry, logout failure/retry and pending duplicate prevention. Verify that switching accounts cannot retain prior identity. Distinguish isolated browser transport from live backend and native evidence. Request an iPhone capture before visual acceptance; native large text, VoiceOver and safe-area behavior must not be reported as tested until observed.

## Future functional SPEC — documented only

Defer profile photo/avatar selection and upload, personal-data editing and expanded account information. A future functional specification must define editable fields, validation, ownership, account isolation, consent/privacy, storage/upload limits and policies, error recovery and server contracts before implementation. Existing avatar fields or update hooks do not authorize activating these functions. No edit/upload placeholders, fake controls, new storage or schema are proposed here.

SPEC-003 remains open. No application code changes, commits or push are authorized by this audit. Wait for explicit owner approval of this composition before implementation.


## Implementation authorization — 2026-10-16

The owner formally approves this proposal and authorizes the scoped Profile-only presentation correction. Preserve logout/support behavior, current auth identity and all other screens. No new dependency, query, asset or functional capability. Implementation must stop for fresh visual acceptance; approval of this proposal does not approve the resulting native screen.


## Implemented Profile refinement — 2026-10-16

Only application file changed in this pass: `app/(tabs)/profile.tsx`.

- Retained the single native Perfil header, removed TU PERFIL, and integrated the existing decorative player art (150-point width beside identity; 180-point width in the stacked layout) into one cream account card with an orange accent.
- Used existing auth display name and optional session email, without new requests, profile mutations, caching or statistics. Existing neutral missing-name fallback remains. Email is selectable and omitted when absent.
- At widths below 390 or font scale at least 1.25, art and identity stack; the card has no fixed height or text line limit. Content scrolls above the existing tab navigator. Existing header/tab safe-area ownership is unchanged.
- Grouped secondary court navigation and the existing report component on a navy surface, followed by a separator and the unchanged sensitive logout component. Shared buttons keep 48-unit targets and existing reduced-motion handling.
- ReportProblem and SignOutButton required no modifications. All assets, dependencies, global styles, auth/controller and other screens remain unchanged in this pass.

### Executed verification

`npm run test:client`: 116/116 passed, including auth/account isolation, failed logout, support configuration and handoff error coverage. `npm run verify`: documentation, TypeScript and lint passed.

Reproducible scenario: [profile-fidelity.js](../../tests/browser/profile-fidelity.js), run with the Playwright browser_run_code_unsafe tool against localhost:8090. Real Expo web UI, isolated context, es-UY/America-Montevideo, synthetic intercepted auth and REST; no real account changes or mail delivery.

Six groups passed: single heading/account identity and 48-unit targets; My Courts navigation; configured mail handoff failure/retry; logout failure preserving account and successful retry redirect; switching accounts with a long name/email at 320-point width without horizontal overflow; fresh session without email omits email. Auth/REST transport is simulated, not fresh server permission verification. An initial fixture incorrectly expected clearing the mocked server email to erase an already restored session; the test was corrected to create a fresh authenticated no-email session, without application changes.

Actual implementation captures with synthetic test identity: [Profile at 402 × 874](profile-fidelity-evidence/profile.png), [small-screen long identity](profile-fidelity-evidence/profile-small.png), [no-email session](profile-fidelity-evidence/profile-no-email.png). Inspected the normal and small captures. They are browser renders, not physical iPhone captures.

### Differences and pending owner review

No intentional composition deviation from the approved proposal. Report explanation retains its original complete copy, and original report/logout components remain intact. Native font scaling, VoiceOver, safe-area geometry and physical scrolling were not executed in this pass. The existing auth gate handles missing/invalid names before Profile; the fallback remains but was not forced through that gate in browser testing. Browser support handoff uses a stubbed window opener, not an installed mail application.

Await a fresh iPhone screenshot and explicit visual acceptance. Avatar, profile edits and expanded account data remain future functional work only. SPEC-003 remains open; no commit/push or next-screen implementation.


## Formal owner visual approval — 2026-10-16

The owner formally approves the implemented Profile and Map visual versions and requests no further visual changes for now. This supersedes earlier pending owner visual acceptance, not unexecuted physical checks. Keep iPhone enlarged text, VoiceOver, safe areas and long-email behavior pending. Avatar, editing and expanded profile data remain future functional SPEC work only. Browser long-email coverage is historical evidence, not a substitute for the requested native check. Approval does not close SPEC-003 or authorize commits/push.
