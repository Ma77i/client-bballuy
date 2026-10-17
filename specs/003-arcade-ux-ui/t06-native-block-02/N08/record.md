# N08 — Keyboard, scrolling and creation pending state

Type: owner-operated physical iPhone acceptance. Status: **PASS — owner-reported physical acceptance on iPhone with Expo Go**.

## Steps

1. Use a disposable draft in each mode; focus every editable field, including multiline description and numeric present count where shown.
2. With keyboard open, scroll to the final action and validation messages. Dismiss/reopen keyboard and switch between inputs.
3. Submit invalid input, correct it and confirm errors remain reachable.
4. If a local disposable creation is available, tap submit rapidly while pending and observe the eventual single confirmed game. Reuse N07 evidence when the exact same submission was observed; do not create unnecessary fixtures.

## Expected

Focused fields, errors and final action remain reachable without keyboard/home-indicator/tab overlap. Pending disables duplicate submission; creation is confirmed only after the existing server check. If pending is too fast to observe, that subcheck stays NOT RUN.

## Observe / capture

A short screen recording with keyboard and bottom action is most useful. Redact typed personal content; report exact field and orientation if obscured.

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
