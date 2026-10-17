# Authorized T05 scoped completion corrections

## Current owner decision — 2026-10-16

Owner formally approved the four secondary game screens and closed T05 for
implementation and visual acceptance. T00–T05 are done; T06 remains todo,
planning only, awaiting authorization. SPEC-003 remains open. This latest status
supersedes older pending-review/dependency-authorization statements below.
See [T05 closure](t05-closure.md), [exact security patch](security-patch-verification.md)
and [proposed physical T06 checklist](t06-plan.md). Native validations remain
pending; no physical tests, commits, push or SPEC closure are claimed.


Date: 2026-10-16. Owner approves the pre-closure diagnosis and authorizes only: accessible navy-on-orange court-detail CTA and inspection of shared variants; secondary My sessions/history/match registration/result presentation and visible Spanish partido vocabulary; read-only security investigation and proposal. Reuse approved R02/R02.1 components/art/tokens, preserve all rules, conditions, confirmations, retries/UUID/readback/account isolation and original guest/account behavior. No rework of already approved screens beyond the explicit contrast fix and strictly necessary shared presentation. No dependency modification without separate owner authorization. No T06, SPEC closure, commit or push. Record validation and stop for T05 review.


## Implemented corrections

- `app/court/[id].tsx`: the only approved court-detail presentation change is explicit navy foreground/icon on approved #FF8A43 Armar partido. WCAG relative-luminance ratio is7.99:1 (AA normal text), replacing white/bright orange2.34:1.
- `components/foundation/Primitives.tsx`: a primary Button with a bright-brand background override now derives navy content unless explicitly configured otherwise. Busy/disabled content remains legible on that retained bright surface. Dark-orange/white default, danger, secondary and quiet variants retain their existing color semantics. Inspected all application/shared bright-orange overrides; other current primary callers already request navy. This is presentation-only; click/pending/motion rules do not change.
- `app/pickup/mine.tsx`: single route title Mis partidos, compact existing R02 art, real role/registration context, reused sports SessionCard and masculine state group labels. Full remains an open lifecycle with a distinct full badge. Loading/empty/read error/retry/freshness preserved.
- `components/pickup/MatchSummary.tsx`: shared cream recorded-match composition using existing format art, court name, actual lifecycle, declared score/revision and recorded time. Recorded matches intentionally have their own contract; no fabricated session places/organizer name to coerce SessionCard. A pending score displays dashes with an explicit pending label.
- `app/matches/mine.tsx`: compact art/action and shared illustrated match cards; Spanish empty and retry copy; actual registered/pending/completed state and history routing preserved.
- `app/matches/create.tsx`: compact court choices, existing illustrated format selector, original-art header and exact orange/navy CTA. Original create/source/side selection and validation predicates are unchanged. Guest/account inputs and search remain the existing recorded-match functionality, not future invitation search or acceptance.
- `app/matches/[id].tsx`: shared illustrated real match summary, compact real participant identity/type rows, declared result and revision/history preserved, navy/orange review/confirm/edit controls. Original permissions, pending recovery, expected revision, confirmation, validation and save callbacks unchanged.
- `components/pickup/MatchPlayerSlot.tsx`: compact existing guest/account choices only; no new roster/search capability.
- `components/pickup/error-copy.ts`: visible partido wording and grammatical agreement, including conflict/source/ownership recovery; internal English message keys/classification untouched.
- `components/pickup/SessionCard.tsx`: legacy arcade branch labels say Ver partido; the approved sports branch remains unchanged.
- `app/(auth)/signup.tsx`: only the existing description says partidos instead of convocatorias; no authentication/layout/consent behavior change.

Tests changed/added: `tests/pickup-presentation.test.cjs` (one meaningful Spanish conflict/source/owner recovery assertion group), `tests/browser/t05-final-corrections.js` (isolated real UI), `tests/browser/detail-fidelity.js` (authorized navy contrast expectation and active local preview port), `tests/browser/t05-conflicts.js` (same conflict assertion with current Spanish copy; historical live script not rerun).

No new art/font/dependency, backend/RLS/schema, business contract, hook or account model. Existing local changes outside the scope were preserved. Source/config hashes are compared against this turn's baseline, not clean HEAD. Approved Profile/Map/My Courts/Play/Create/Management screens are unchanged except the explicitly allowed shared rendering/visible-copy effects and one-line signup description. No ranking, invented places, score or attendance claims.

## Security analysis presented before dependency changes

See [security update proposal](security-update-proposal.md) and [per-package investigation](security-investigation-evidence.json). All49 entries were classified by advisory chain, actual locked nodes and iOS production source presence; no broad fix or dependency change. Critical chain is RN0.86.3 → DevTools-core6.1.5 → shell-quote1.10.0. Proposal is only transitive resolution to1.11.0 within the existing ^1.6.1 range; npm metadata and semver compatibility checked. Separate owner authorization required before applying it.

Development setup loads the DevTools backend under __DEV__; the backend source map contains no shell-quote. Desktop standalone embeds a separate older copy for its editor's parse integration. Current production iOS source map has no shell-quote or DevTools-core source entries. This bounds observed release-JS exposure, not a blanket Android/web/developer-machine security clearance. Updating the installed resolution does not rewrite prebundled vendor code. Other URL/parser/SDK and tooling risks remain explicitly unremediated.

## Executed checks and evidence

- `npm run test:client`:117/117 passed (no skips). The new grammar/recovery test initially caught una partido iniciada after a first replacement; corrected visible agreement, without weakening the assertion or changing validator behavior.
- `npm run verify`: docs, application TypeScript and lint pass; final rerun after documentation below.
- `tests/browser/detail-fidelity.js`:11 groups PASS, real Expo web UI with synthetic isolated transport. Includes exact CTA pair, actual attribute display, membership add/remove/re-add, pending duplicate protection/readback/error/retry, organizer court context and map handoff, loading/catalog/activity errors and narrow reflow. These simulated commands do not write to a backend. Initial attempt used an inactive legacy8091 test URL; moved the scenario to the existing local8090 preview and reran successfully.
- `tests/browser/t05-final-corrections.js`: real web UI, isolated synthetic auth/REST/RPC, es-UY/America-Montevideo, reduced motion,402 ×874 and320 ×740. Tests real controls without bypassing app validation. Final outcome appended after rerun. Earlier nine-group pass includes current five session states, personal empty/read retry, history empty/read retry, score validation/review, committed-write lost response with same-UUID retry, concurrent revision conflict/review and revisions1/2/3, nonowner restrictions, roster account/guest, 1v1/5v5 and narrow reflow.
- The fixture performs five intercepted RPC attempts, with idempotency receipts and an injected concurrent correction; zero real backend writes. It does not certify server/RLS/concurrency behavior. Existing client tests cover unchanged server-facing invariants; historical real local T05 evidence remains historical.
- iOS full-entry export with source maps/Hermes PASS using workspace TEMP/TMP, EXPO_NO_DOTENV=1, EXPO_OFFLINE=1, CI=1 and max-workers2.3656 modules/35 assets, source map3640 sources; current final entry recorded in security-investigation-evidence.json. This is not a device build/install or physical acceptance.
- Native bundle analysis, npm view metadata, parent range check and installed-source inspection are read-only. No npm update/install/audit fix was run.

Actual implementation captures, all game/account/result content explicitly synthetic test transport:
[Mis partidos](t05-final-corrections-evidence/my-games.png),
[history](t05-final-corrections-evidence/history.png),
[empty history](t05-final-corrections-evidence/history-empty.png),
[registered-match setup](t05-final-corrections-evidence/register-match.png),
[result summary](t05-final-corrections-evidence/result-summary.png),
[uncertain result](t05-final-corrections-evidence/result-uncertain.png),
[correction history](t05-final-corrections-evidence/result-correction.png),
[narrow detail](t05-final-corrections-evidence/result-narrow.png),
[court contrast](t05-final-corrections-evidence/court-contrast.png).

Capture scripts wait for image decode; initial fast screenshots were incomplete. A screenshot locator first matched an inactive previous route; corrected to the active final route, without changing the application. During final verification Metro stopped; restored the normal local db:local:device launcher with Docker status access, .env disabled, no reset/data mutation. No hosted preview fallback was introduced. Initial tool startup/fixture failures are not counted as passing app checks.

## Differences, risks and native acceptance

R02 has a personal-session card reference but no independent recorded-result/history board. These flows reuse its approved sports composition/system and actual existing contracts; no claimed exact nonexistent board or new mockup. Previously documented small raster crop limits remain. Already-approved Play header/availability polish, management cancel styling, 24-hour evaluation and confirmed-registration indicator are not expanded into new redesign work here. The recorded-match score is declared by its organizer, not live or attendance verified.

The49 security alerts, including critical, remain in the unchanged dependency tree pending a separate update decision. Profile/map approvals remain intact. T05 implementation corrections are ready for owner review after final local checks; do not mark T05 done before acceptance. T06 todo and SPEC in_progress remain unchanged.

On iPhone16Pro/Expo Go: verify navy court CTA; open Mis partidos in populated/empty/error states and inspect statuses/art; open Historial and both pending/completed records; exercise existing registration with1v1/2v2/5v5, guest/account distinction, invalid scores, review/confirm/cancel and result corrections; confirm history/readback/retry and back navigation. In authorized local test accounts only, check uncertain response/reopen and account switching. Repeat VoiceOver, large text, keyboard/safe areas and Reduce Motion. No physical iPhone/Android execution or release-performance claim. Security changes are awaiting explicit authorization; no T06 or SPEC closure, commits or push.


## Final local result

Final secondary browser scenario: **10/10 groups PASS**, five simulated RPC attempts and zero real backend writes. Includes the delayed pending/busy/disabled primary action before response. Court-detail regression:11/11 groups PASS. Client:117/117 PASS. Full production iOS export PASS with final source. The final browser run followed local Metro restart/cold rebuild; its initial cold navigation timed out, then the warm full scenario passed. No failed startup is counted as a functional test pass.

Before/after source hash check confirms package.json/lock, all domain/hooks/contexts/backend/RLS files and the protected approved Profile/Map/My Courts/Play/organizer screens are unchanged in this turn. Shared visual/text effects and the authorized court CTA are explicitly listed above. No dependency update; security proposal awaits its own approval. T05 remains in_progress for owner acceptance; T06 todo. Final verify/client rerun after documentation is recorded below.


Final verify PASS (documentation, TypeScript, lint;101 Markdown documents). Final test:client117/117 PASS, zero skips. git diff --check on files changed in this pass is clean. No dependency update or T05/T06 completion state change.
