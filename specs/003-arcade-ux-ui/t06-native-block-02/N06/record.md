# N06 — Play discovery and secondary navigation

Type: owner-operated physical iPhone acceptance. Status: **PASS — owner-reported physical acceptance on iPhone with Expo Go**.

## Steps

1. Open Jugar on the local test account. Select a court and each available format through the compact selectors; clear filters again.
2. Scroll the actual list; use Ver partido then return. Confirm the filter context remains usable.
3. Reach Armar partido, Jugar ahora, Mis partidos and Historial; return from each without submitting anything.
4. Observe an empty filter result if available. Briefly go offline and refresh only if the existing UI offers refresh/retry; reconnect and retry.

## Expected

Filters show real matching sessions; all entry actions are reachable without dock/tab/safe-area overlap. Loading/empty/error states are truthful and recoverable. Unavailable states are NOT RUN/BLOCKED, not assumed passed.

## Observe / capture

Capture Jugar with filters and dock, a real empty state if reproducible and any overlap/error. Do not capture private participant identities.

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
