# SPEC-003 pre-closure audit — 2026-10-16

## Current owner decision — 2026-10-16

Owner formally approved the four secondary game screens and closed T05 for
implementation and visual acceptance. T00–T05 are done; T06 remains todo,
planning only, awaiting authorization. SPEC-003 remains open. This latest status
supersedes older pending-review/dependency-authorization statements below.
See [T05 closure](t05-closure.md), [exact security patch](security-patch-verification.md)
and [proposed physical T06 checklist](t06-plan.md). Native validations remain
pending; no physical tests, commits, push or SPEC closure are claimed.


## Decision summary and audit boundary

**SPEC-003 is not ready for unconditional closure.** The principal reviewed screens are visually approved, but T05 remains in progress, T06 is still todo, accessibility has a concrete contrast failure and unexecuted native criteria, and some secondary Play/result screens retain inconsistent presentation/copy without a final screen-specific approval. No further Profile/Map redesign is requested or proposed.

This is a read-only source/evidence audit plus authorized documentation updates, not implementation or a declaration that T06 has run. Existing local changes on SPEC-003/design are preserved. No source, dependency, contract, backend, RLS or data changes; no commit/push. Findings below distinguish current inspection, earlier evidence and owner-reported acceptance. The source snapshot at the start covers 267 code/config/test/asset files for a before/after integrity comparison.

### Newly recorded approval

The owner formally approves the current **Profile and Map** visual implementation. Updated [Profile approval](profile-fidelity-review.md) and [Map approval](map-preview-refinement.md) supersede their earlier pending visual gates. Keep iPhone large text, VoiceOver, safe areas and long-email behavior pending. Avatar/editing/expanded account data are deferred, not implemented. Visual approval does not imply these checks were executed.

## 1. Implemented and approved inventory

- **Foundations:** T02 tokens, shared primitives, licensed Teko/Lexend, local art/fallbacks, reduced/decorative motion are implemented and locally verified. See [T02 evidence](t02-verification.md), [Design System](design-system.md), assets/fonts and illustration manifests. The current asset verification passes.
- **Courts list:** approved horizontal illustrated cards, compact search/switch, real catalog and outline View court action. User-authorized later Courts/auth corrections are documented in [court fidelity](courts-fidelity-correction.md) and [targeted refinement](courts-auth-refinement.md). The initial pending review text is historical; subsequent owner progression and approvals supersede it.
- **Native Map/preview:** T03 explicitly closed by the owner; latest footer removal/compact sheet visually approved in the current instruction. Marker/camera/selection logic was preserved in the latest refinement. Fresh physical accessibility/performance evidence remains separate. See [T03 closure](t03-closure.md), [latest refinement](map-preview-refinement.md).
- **Court detail:** owner approved the cream background, integrated art/name, physical attributes, grouped actions, secondary centered-map navigation and separate truthful activity. This is an intentional later adaptation, not a failure to use the navy full-page R02 template. See [detail fidelity](detail-fidelity-correction.md), [T04 closure](t04-closure.md). A known contrast failure remains despite visual approval; see finding F01.
- **My Courts:** owner approved shared horizontal cards, quiet refresh, illustrated empty copy and orange/navy exploration CTA. It still uses actual memberships internally, not a new favorites system. The smaller saved-court projection intentionally omits unavailable attributes/activity. See [approval](my-courts-fidelity-correction.md).
- **Play:** visually approved sports cards/original R02 crops, compact court/format selectors and fixed actions. Minor header integration/availability wording remain accepted follow-ups. Full-game client checks passed; actual native last-place/real-server scenarios are not inferred. See [current Play evidence and approval](play-fidelity-correction.md).
- **Create game, now and planned:** composition/usability formally approved, including native scheduling adapter and unchanged local-time/ISO contract. Physical picker/keyboard/large-text validation pending. See [approval and checks](organize-usability.md), [ADR 0020](../../docs/decisions/0020-native-scheduling-controls.md).
- **Public game detail and organizer management:** visually approved; state restrictions, confirmations and recovery have unit and isolated-browser evidence. See [state acceptance](game-state-acceptance.md). Sensitive cancel distinction, 24-hour evaluation and confirmed-registration indicator remain nonblocking polish.
- **Profile:** latest cream illustrated account card/secondary grouped actions formally approved. Uses current real name and optional session email; no avatar/editing/extra query. See [approval](profile-fidelity-review.md).
- **Entry/auth, My sessions, recorded-match registration/result/history:** presentation exists and historical local browser/regression evidence is available. The approved principal screens do **not** automatically grant final fidelity approval to these other screens. Entry refinements were exercised, but no blanket final screen-by-screen visual acceptance is evidenced. See [T05 inventory/evidence](t05-verification.md).

R02/R02.1 are the baseline; R03 is rejected. R02 never had independent Profile/My Courts/management boards. Their accepted compositions reuse the approved system and subsequent owner decisions, rather than claiming nonexistent visual references.

## 2. Current differences and findings

### F01 — Acceptance gap: contrast in an approved court-detail CTA

Source: `app/court/[id].tsx`, Armar partido button, with bright orange override and no foregroundColor. The shared Button's primary label defaults to white. A fresh WCAG relative-luminance calculation gives **#FFFFFF on #FF8A43 = 2.34:1**; navy on that orange is 7.99:1. The former fails both the 4.5:1 normal-text and 3:1 large-text thresholds in A02/A07. Historical evidence cited 2.21:1; the current recomputed value is 2.34:1, and the failure conclusion is unchanged.

The existing contrast tests cover approved token pairs, not every screen's override composition; a green suite therefore does not resolve this failure. Do not change the approved screen during this audit. A narrow owner-authorized foreground/background decision is needed, followed by a focused rendered-combination check; no redesign or business-rule change is required.

### F02 — T05 pending fidelity/copy: My sessions and recorded-match flows

`app/pickup/mine.tsx` still renders **Mis convocatorias**, repeats header/content titles, and uses the earlier `SessionCard arcade` branch, which is vertical and lacks the prominent left art of the approved sports branch. This is a real composition mismatch with the R02 personal-session pattern and the subsequent visible partido terminology. No new functionality is needed to correct it, but implementation is not authorized by this audit.

`app/matches/mine.tsx` contains **No matches recorded todavía.** and **Reintentar partidoes**. `app/matches/create.tsx` contains **CONVOCATORIA VINCULADA** and linked-invitation wording. `app/matches/[id].tsx` still has Player as a fallback and convocatoria in confirmation copy, and passes some validator messages directly to fields/notices. `components/pickup/error-copy.ts` retains convocatoria translations outside the later detail-only adapter; signup also retains convocatorias. These source observations show Spanish/terminology adoption is incomplete. Actual error rendering and all route states need review, not blanket text replacement of internal identifiers.

### F03 — Nonblocking, already accepted polish and art limits

Retain the owner-designated minor items: Play illustrated-header integration and availability clarity; management Cancel versus Edit visual distinction with confirmation; evaluate es-UY 24-hour presentation; refine confirmed-registration indicator. Full is a functional state rule, so correctness is never dismissed as cosmetic; client behavior passed, native/current-server evidence remains scoped.

Court art is provisional. Exact R02 Play extracts come from a flattened 1536 × 1024 board; the header crop is 225 × 112 and original general assets are around 256 px. Independent high-resolution layers do not exist in the repo. Their resolution limits are documented and accepted provisionally, not grounds to generate new designs or source photographs now.

Intentional accepted adaptations: cream court-detail page, saved-court terminology, removal of repetitive generic-art captions, compact sheet, native date/time controls and device-local timezone. Generic art remains decorative/honest, not a verified photo, personal avatar or literal court depiction. Do not restore removed captions merely because the historical raster had them.

### F04 — Documentation debt and brand ambiguity

Historical task reports correctly describe their dates but still appear to be current in places: T02 awaiting permission; R03 proposed as a future baseline; native scheduling instructions still manual in older checklists; blanket T05 no-dependency-change wording predates the authorized picker. Latest sections supersede them. This audit adds a current decision/evidence index without rewriting historical results.

The written temporary-brand contract says lowercase **bballuy**, whereas approved Play/Create headers currently render **BBallUY ARCADE**. Record this as a contract-versus-approved-screen ambiguity to reconcile with the owner; do not silently rename already approved screens or revive R03.

## 3. Acceptance criteria and remaining tests

- **A01/R01 — substantiated locally, not a fresh hosted audit.** T01 closure records both delivery gates. Current Git diff shows no hooks/lib/contexts/backend/RLS changes. One native picker dependency is an explicitly documented later authorization, superseding the original generic no-new-dependency scope. Existing capacity/replay/identity tests pass. Hosted schema parity and server enforcement are not newly certified.
- **A02/R02 — partial.** Fonts/licenses, asset integrity and token contrast pass; owner visual approvals exist. F01 is a concrete remaining contrast failure. Unreviewed secondary flows and the naming ambiguity prevent claiming universal consistency.
- **A03/R03 — owner accepted; detailed physical cases pending.** Existing local/reducer/browser and native export evidence covers data/selection behavior. Latest native full-map bottom geometry, gestures, focus and marker highlight were not newly observed by the agent. The owner's visual approval is recorded as approval, not fabricated per-case test execution.
- **A04/R04 — accepted implementation/local evidence, native gaps explicit.** Membership add/remove/re-add, account isolation, activity caveats, organizing shortcut and logout recovery have earlier local and current unit coverage. Profile long-name/email browser checks passed; native long emails, scaling, VoiceOver and safe areas remain specifically requested.
- **A05/R05 — partial.** Historical T05 records 61 real local browser checks, including results/history/corrections/conflicts. Later isolated checks cover current game states and uncertain-response recovery. Those historical live tests were not rerun after every fidelity change, and secondary-screen final fidelity review is incomplete. Do not add counts from different dates/transports as a single fresh end-to-end pass.
- **A06/R06 — substantiated with accepted later caption adaptations.** Local original art/fallback and provenance exist; no verified court-photo claim. Future photo rights/ID verification remains future scope, not a missing MVP feature.
- **A07/R07 — not complete.** No exhaustive physical VoiceOver/TalkBack, >=200% Dynamic Type/font scaling, safe-area/keyboard/modal focus, interruption/background restore or frame-performance evidence. R02 proposes ten rapid interaction repetitions and investigation of animation-caused frames over 32 ms; native measurement is absent. F01 also fails this gate.
- **A08/R08 — partial.** Exact R02/R02.1 design approval and subsequent named-screen approvals are recorded. Final consolidated browser/iPhone evidence, unresolved failure decisions and all task completion evidence are not complete.

Required physical checklist: iPhone 16 Pro, recording actual iOS/Expo Go versions and text setting; all approved routes at normal/enlarged text; VoiceOver labels/busy/selected/focus return; safe bottom and keyboard; actual native scheduling confirm/cancel/past selection; map expand/close/rapid marker replacement; app background/reopen and uncertain saved-request replay; account A → B → A; long unbroken names/email; native mail draft/failure without sending. Android picker/TalkBack/font-scaling behavior is unverified and needs an explicit supported-platform acceptance decision. Do not assert native success from browser text stress or bundle exports.

A fresh final regression should also cover creation, join/leave/rejoin, capacities 2/4/10, all closed/full states, organizer-only commands, guests/accounts, results/history/correction/conflicts and errors/retries on the final frozen UI, using an explicitly authorized local fixture environment with cleanup. No such live-data regression was run during this audit.

## 4. Technical debt and security risk

A new read-only `npm audit --json` query completed against the registry on 2026-10-16: **49 affected packages: 1 low, 15 moderate, 32 high, 1 critical**. This is a package count including inherited/transitive findings, not 49 independent exploitable vulnerabilities. Snapshot with every reported package/range/path/advisory/fix recommendation: [security evidence](security-audit-2026-10-16.json). Exit code 1 means findings exist. The first sandbox query failed DNS; the permitted registry retry completed. No audit fix/install/downgrade was performed.

The critical report identifies **shell-quote 1.10.0**, reached via react-native 0.86.3 → react-devtools-core 6.1.5. The advisory concerns shell command injection in specific quote/comment/line-terminator combinations; fixed version is 1.11.0. Sources: [maintainer advisory](https://github.com/ljharb/shell-quote/security/advisories/GHSA-pqg4-j6r4-53mv), [GitHub reviewed advisory](https://github.com/advisories/GHSA-pqg4-j6r4-53mv). npm/GitHub reviewed classify it critical; the maintainer page reports high/8.1, so do not merge scoring systems. No exploit was executed, compromise observed or reachable app-user path established. A devtools dependency does not by itself prove harmless development-only exposure or a device exploit.

Priority recommendation: separately authorize a compatible transitive patch/parent update investigation, establish development/CI/release reachability, then rerun tests/exports/audit. Updating to a patched version is a proposed remediation, not an executed fix. The current semver parent range appears compatible with a newer patched 1.x, but actual resolution/SDK behavior must be verified first. Other npm suggestions include incompatible Expo/React Native downgrades; never apply `npm audit fix --force` blindly. The picker high finding is inherited via Expo, not proof of a standalone picker defect.

There is no existing SPEC-003 criterion requiring zero npm alerts. Do not invent such a gate or dismiss all 49. Before closure, decide and record critical-risk treatment and remaining alert owners/priority; before release, perform a separate security/readiness decision. This audit recommends treating the unresolved critical exposure assessment as a priority closure decision, not claiming a clean audit.

Other debt: legacy shared card branches/copy adapters; some fixed 96-point keyboard offsets outside the approved creation refinement; low-resolution provisional art; old documentation chronology; no final release performance profile. Legal documents/consent are a development preview with existing acknowledgements, not a production legal-policy implementation. The local/hosted preview-origin mismatch has a documented launcher correction; use the local launcher for local test accounts. Hosted schema remains unreconciled, outside this UX scope.

## 5. Deferred functional work

- Avatar/photo upload, personal-data editing and expanded account info: [Profile future scope](profile-fidelity-review.md). No storage, editor or placeholder controls authorized.
- Account search/name-email privacy, sending/accepting/rejecting invitations, allocation timing, guest counting and server concurrency: [future invitations](../../docs/future-player-invitations.md). Define server rules/contracts/privacy in a later functional SPEC first.
- Verified court photographs need provenance/rights and correct court-ID mapping. They are not required to replace the approved original art now.
- Teams, ranking/XP, persistent squads, chat/push, reservations and live scoring remain excluded; no implicit backlog authorization.
- Production policies, hosted-schema verification, release/install/security readiness are separate work, not outcomes of a visual approval.

## 6. Real task state T00–T06

- **T00 done:** scope/audit/gates and documentation checks exist. Historical initial assumptions are not current implementation evidence.
- **T01 done:** exact R02/R02.1 design/sequence approval and [closure](t01-closure.md). No independent Profile/My Courts/management board is invented.
- **T02 done:** shared foundations, files/licenses/fallbacks/motion and reproducible local evidence. Does not claim complete device accessibility.
- **T03 done:** owner [closure](t03-closure.md) plus latest Map approval recorded. Physical gaps roll into final acceptance; no silent reopening.
- **T04 done:** owner [closure](t04-closure.md), approved court detail/My Courts and now Profile refinements. F01 remains an explicit final-acceptance issue despite historical task completion.
- **T05 in_progress:** principal Play/create/detail/management screens approved, implementation and tests exist; secondary presentation/copy and final review/regression/native evidence remain. Do not mark done from principal-screen approvals alone.
- **T06 todo:** no completed consolidated A01–A08 acceptance, no completion evidence. This authorized pre-closure audit does not bypass its T05 dependency or claim full execution. Audit findings inform its future scope.

Registry remains in_progress; task states are unchanged. Five tasks done does not equal full SPEC acceptance.

## 7. Conditions and decisions before closure

1. Freeze the already approved Profile/Map and other accepted compositions. Request only narrowly authorized corrections, rather than another design round.
2. Decide F01's accessible foreground/background treatment. Resolve the approved-screen/brand-document conflict explicitly and finish secondary-flow partido/Spanish/fidelity review. Record owner acceptance of the remaining screens or a formal scope decision.
3. Establish the treatment of the critical security dependency and residual alerts. Security remediation requires its own authorized change; neither a downgrade nor zero-alert mandate is assumed.
4. Execute/record the missing native and final regression cases, with version/device/steps/outcome and failures. If the owner deliberately defers an original acceptance criterion, amend the scope/acceptance transparently before closure; never label an unexecuted test passed.
5. When T05's acceptance is actually fulfilled, add final evidence and only then mark it done. Execute the dependent T06, map every A01–A08 to observed evidence, and resolve/document genuine failures and decisions.
6. Reconcile current documentation/approvals and run final verify/client/asset checks on the frozen state; retain historical reports as historical.
7. Obtain explicit owner closure approval, then update tasks/registry/status consistently. Closure is not commit/push, deployment or production authorization.

Recommended next decision: authorize a narrow security remediation investigation and a targeted review of My sessions/results/history copy, while scheduling one native acceptance pass. No implementation is authorized or started by this report.

## Audit execution evidence

Fresh in this audit: harness:status; source/task/spec/approval/evidence inspection; npm test:client 116/116 (zero skips); verify-presentation-assets reports 5 active fonts, Spanish glyph coverage and 2 base illustrations (332596 font bytes, 40338 base-art bytes); R02 crop integrity covered by the client suite; npm audit and npm explain shell-quote; contrast calculation; source/config hash comparison. Final npm run verify result is recorded after documentation updates.

Historical, not rerun here: T03/T04 local membership/location journeys, T05's 61 live local browser checks, later 13 isolated state groups, 6 Profile and 5 preview groups, and iOS/Android Hermes exports. These retain their documented dates/limits. No physical devices, new browser scenarios, server/Edge checks, fixtures, migrations or data mutation during this audit. Harness and Edge sources were not changed, so test:harness/verify:edge were not required.

Full report sources include spec.md, tasks.json, plan.md, verification.md, T01–T05 scopes/closure/evidence, all latest fidelity/approval notes, R02/R02.1 review/asset provenance, current target screen/shared source and the security snapshot. Preserved original design artifacts; no R04 or replacement design created.


Final audit verification: `npm run verify` PASS (99 Markdown files; documentation/typecheck/lint). Before/after SHA-256 comparison: all 267 captured source/config/test/asset files unchanged. No task or registry completion-state transitions were made. The optional standalone visual report could not be created because its managed Canvas directory was unavailable; this repository report is the complete deliverable.


## Authorized follow-up implementation — 2026-10-16

F01 contrast and F02 secondary presentation/copy now have [scoped implementation evidence](t05-final-corrections.md), pending owner review. Preserve the audit above as its original diagnosis, not a claim that these issues remain unmodified. Security is analyzed in the [update proposal](security-update-proposal.md), but dependencies and unresolved security findings are unchanged. No T05/T06 completion or SPEC closure.
