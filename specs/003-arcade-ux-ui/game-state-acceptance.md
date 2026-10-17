# Game detail and management acceptance — 2026-10-16

## Owner decision and scope

The owner explicitly approves the current visual versions of game detail and game management as sufficiently faithful to R02/R02.1. No further redesign is requested. This supersedes the prior pending visual approval notices, without claiming exhaustive native accessibility or functional testing. No application code, domain rules, contracts, backend or permissions were changed during this verification.

Nonblocking follow-ups, not implemented:

- Visually distinguish Cancelar partido from Editar partido, retaining cancellation confirmation.
- Evaluate a consistent 24-hour display for Spanish Uruguay. Do not change stored time, device zone or scheduling semantics.
- Refine the Inscripción confirmada indicator without showing success before server readback.

## Executed verification

Environment: existing local Expo web server on localhost:8090; isolated browser context 402 × 874, locale es-UY, timezone America/Montevideo. Browser scenario: [game-state-acceptance.js](../../tests/browser/game-state-acceptance.js). Execute with the Playwright browser_run_code_unsafe tool using that file as filename. Authentication, reads and RPC responses are intercepted inside the isolated context. Synthetic identities and session data never reach a backend. Thirteen assertion groups passed, with four simulated RPC attempts (two operations, each retried with its original request UUID); zero real backend requests.

- Open: fresh consistent nonparticipant sees enabled registration; organizer sees start, edit and cancel. A nonowner has no management entry. A direct management route with an owner-filtered empty response shows recovery and no lifecycle controls.
- Full: the unregistered viewer cannot join; an already registered viewer can request exit with confirmation. Full is still an open lifecycle, so its organizer retains start/edit/cancel; existing occupied places keep core editing locked.
- Started: no registration or exit; organizer sees finish and register-result entry, without start/edit/cancel. Finish requires confirmation.
- Completed: no registration or exit, no lifecycle edit/start/cancel/finish; existing register-result entry remains available to organizer. No automatic score or attendance is implied.
- Cancelled: details remain readable; no registration/exit or lifecycle changes. No result-entry action is introduced.
- Start, cancellation and finish confirmation dialogs were opened and dismissed without sending requests. Exit confirmation and retaining one's place were checked. The loaded management screen has no duplicate back action.
- Management read failure exposes retry and returns to confirmed details. Public-detail read failure exposes retry and restores registration after a fresh successful read.
- Uncertain registration does not show confirmation. Explicit Reintentar comprobación reuses the original request UUID, then shows confirmation only after successful readback.
- Uncertain organizer start retains its request; retry uses the same UUID and then renders the confirmed started state and actions.
- Existing locked/unlocked editor behavior and participant identity/guest distinctions remain intact.

`npm run test:client`: **116/116 passed**. Existing tests cover account/identity isolation, mismatched organizer rejection before transport, expected-actor binding across auth changes, lifecycle action predicates, full/closed/inconsistent participation, duplicate presses, lost replies, failed readback, storage failures and replay. Test doubles validate client behavior; they do not freshly prove deployed server enforcement.

`npm run verify`: documentation, TypeScript and lint passed. No application code changed in this acceptance pass.

Browser screenshots are under [acceptance evidence](game-state-acceptance-evidence/public-open.png), including [management](game-state-acceptance-evidence/management-open.png) and [owner detail](game-state-acceptance-evidence/public-owner.png). Captures contain synthetic test data, not real game records.

## Limits and remaining work

Visual acceptance on iPhone is owner-reported and explicitly granted. This pass did not perform fresh physical iPhone/Android tests, VoiceOver, Dynamic Type, native safe-area or keyboard tests, or live server/RLS permission and concurrent mutation tests. It did not rerun result correction/history journeys or re-audit dependencies. Earlier SPEC-002 evidence remains historical, not a new server check.

Keep the existing physical creation-picker/keyboard/safe-area/large-text checks pending. Keep the previously reported 49 dependency security alerts (including one critical) pending review; no new audit result or remediation is claimed. Player invitations remain documented for a future functional SPEC.

These two screens are visually accepted and the scoped local state checks pass. SPEC-003 remains open; T05 remains in_progress and T06 remains todo. No commit, push, release or automatic next screen is authorized.
