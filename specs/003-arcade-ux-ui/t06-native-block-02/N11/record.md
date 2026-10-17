# N11 — Recorded match, results, corrections and conflicts

Type: owner-operated physical iPhone acceptance. Status: **PASS — owner-reported physical acceptance on iPhone with Expo Go**.

## Steps

1. Open Registrar partido with an eligible started/finished source organized by A if available. Check source selection and its real roster, or the existing source-free path when permitted.
2. Inspect1v1/2v2/5v5 roster sizes; exercise existing account/guest selection only where the recorded-match flow allows it. Missing/duplicate/over-capacity entries must not be accepted. No future invitation system is being tested.
3. Save one disposable local record. Verify pending score is distinguished from an actual0–0, identities/types are correct, and History opens the record.
4. As organizer, enter a valid score, review then confirm; reopen result and History. Correct the result using the existing review; inspect actual revision/history.
5. If two authorized sessions/devices are available, open the same editable revision in both. Save from one, then submit the stale other draft: it should recover the conflict and require renewed review against the current revision. Without prerequisites, mark conflict subcase BLOCKED.
6. Inspect the same result as B/nonorganizer: no edit permission. If a lost-response case can safely be reproduced offline, restore connection and use existing recovery without duplicating the record/revision; otherwise leave it unverified.

## Expected

Existing roster/source eligibility, permissions, score validation, review/confirmation, history and revision conflict protections remain. No invented score or participant; pending is distinct. Nonowner cannot edit. Repeated recovery must not create a duplicate result. Physical UI checks do not prove server concurrency without observed conflicting writes.

## Observe / capture

Capture pending result, review, confirmed result and revision history with identities redacted. Record actual before/after revision numbers; conflict and lost-response checks require real observed evidence, not earlier browser simulations.

## Result record

- Date/time and observer: pending owner report.
- Environment/revision match: pending; inherit block baseline only after confirming reload.
- Subcase: pending.
- Status: NOT RUN.
- Expected/actual: not observed.
- Redacted capture reference: none supplied.
- Defect and proposed correction: none reported yet; no automatic code-fix authorization.

Use PASS for observed expected behavior, FAIL for an observed mismatch, BLOCKED for
missing prerequisites, NOT RUN for unattempted subchecks. Partial evidence never
passes the entire case. Report each state/role/error subcase independently. Preserve
failed attempts and later retest history. Never store credentials, tokens or private
identity data. No production writes, database resets, dependency changes or direct
state manipulation. No automatic completion of T06 or SPEC-003.

## Owner physical acceptance — 2026-10-16

Direct owner message explicitly reports this case PASS following the guided iPhone
block. Record as physical owner-reported acceptance, separate from automated and
browser-simulated evidence. Previously reported device: iPhone16 Pro, iOS26.6.1,
Expo Go57.0.0; normal text, VoiceOver/Reduce Motion off. No updated settings reported.

No screenshots, per-subcase observations, network timing, role/state inventory,
concurrency traces or exact loaded bundle hash were supplied with this confirmation.
Do not invent these details or describe the run as independently observed. Case-level
PASS is the owner's explicit result; conditional error/conflict subchecks lack
individual evidence and are not separately asserted as demonstrated by this record.
Earlier NOT RUN entries remain historical preparation. No new device operations
were executed by the agent while recording this report. T06/SPEC remain open.
