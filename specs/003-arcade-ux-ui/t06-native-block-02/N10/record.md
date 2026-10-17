# N10 — Join/leave, uncertain response and recovery

Type: owner-operated physical iPhone acceptance. Status: **PASS — owner-reported physical acceptance on iPhone with Expo Go**.

## Steps

1. With B eligible for a real open local test game, join normally; check pending then confirmed account status. Leave if policy allows; verify the server-confirmed result.
2. Repeat with rapid tapping while pending; observe that a second action is blocked.
3. Briefly disable both network connections around a disposable join/leave attempt, then restore Wi-Fi. Record whether the attempt was sent and whether an uncertain state actually appeared; network timing may not reproduce it.
4. If offered, use Reintentar comprobación to recover the saved operation. Reopen detail/Mis partidos and compare actual account membership and capacity.
5. If no uncertain state occurred, mark that subcase BLOCKED/NOT RUN and describe the timing; do not claim server concurrency or exact request counts from a phone screenshot.

## Expected

No confirmed inscription appears until real account-state verification completes. Recovery checks the saved operation, not a new duplicate join. State and capacity reconcile after network restoration; no opposite action becomes available while membership is uncertain. Definitive rejection/error remains distinguishable from pending verification.

## Observe / capture

Capture pending/uncertain/retry/confirmed states when actually observed; note network timing and alias only. Do not send network logs containing tokens.

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
