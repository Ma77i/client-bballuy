# N09 — Lifecycle and role permissions

Type: owner-operated physical iPhone acceptance. Status: **PASS — owner-reported physical acceptance on iPhone with Expo Go**.

## Steps

1. Identify local disposable games representing open with space, full, started, finished and cancelled. Use only existing supported UI transitions or available test fixtures; do not edit database states.
2. For each available state, inspect detail as organizer A, and separately as participant/nonparticipant B where available. Record actual visible/enabled actions.
3. Open with space: eligible nonparticipant can join. Full: new join is unavailable, but an already joined account may leave while lifecycle remains open and roster is verified.
4. Started/finished/cancelled: no join or leave action contrary to existing policy. Nonorganizers cannot obtain management permissions from appearance/navigation.
5. On a disposable eligible organizer game, inspect edit/start/cancel controls. Exercise cancellation confirmation including dismissing it first; confirm cancellation only for the test fixture.

## Expected

States reflect server truth. Full is a capacity condition, not a replacement for open lifecycle. Joining requires open state, free places, not already joined and verified roster; leaving requires open state, joined and verified roster. Organizer actions follow existing server rules; confirm/cancel prompts remain intact. Missing states/roles are BLOCKED, not invented.

## Observe / capture

For each state record role alias A/B, visible/enabled actions and expected/actual outcome. Hide names/emails. Capture a closed/full action area and cancellation prompt. Do not record credentials.

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
