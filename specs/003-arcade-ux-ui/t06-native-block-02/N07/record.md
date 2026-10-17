# N07 — Formats, modes and native date/time

Type: owner-operated physical iPhone acceptance. Status: **PASS — owner-reported physical acceptance on iPhone with Expo Go**.

## Steps

1. Open Armar partido. Switch 1v1,2v2,5v5 and confirm total capacities2,4,10; selection changes immediately without sending or navigating.
2. Select a real court. In Jugar ahora inspect organizer participation and Personas ya presentes; try an invalid count to verify its existing validation without committing.
3. Switch to Planificar. Open date/time pickers; select a future local date/time, reopen and cancel another selection. Try a past date/time and verify rejection.
4. Check selected format/court/time before confirming. Only on the confirmed local test environment, create one disposable planned game through the UI; compare the detail time with the selected local time. Note that fixture for later tests.
5. Separately exercise Jugar ahora creation only if required by the remaining test subcase; use a disposable fixture and note its actual state.

## Expected

Format totals are2/4/10; mode-specific controls and existing participation limits are preserved. Spanish dates are readable, cancelling does not replace the draft, past time is rejected. Server-confirmed creation has the selected local time; no court reservation is claimed. No test in production.

## Observe / capture

Capture selected format and picker/confirmation with private details removed. Record device timezone/locale, chosen wall time and observed detail time, without tokens or account identifiers.

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
