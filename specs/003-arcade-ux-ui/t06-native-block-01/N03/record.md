# N03 — Location denied and granted

Type: physical iPhone test, owner-operated. Status: **FAIL — reported issue; correction/retest pending**.
Date/time, observer, runtime revision match: pending owner confirmation.

## Steps

1. Record the current location permission, then set Expo Go location permission to denied in iOS Settings (the precise Settings route depends on iOS). Do not reinstall or reset the phone/app.
2. Reopen the project, use Mi ubicación and read the resulting message.
3. Search/browse List and Map, open a marker and its detail while permission is denied.
4. Change permission to While Using the App, return and use Mi ubicación again.
5. Restore the original permission after recording both outcomes.

## Expected

Denied location never blocks court exploration; feedback is understandable. With permission granted, location can be retried without corrupting court selection/data. No court coordinates change. A device/system inability to change or provide location is BLOCKED, not a successful grant test.

## Observe / evidence

Record permission choices and app feedback, not your precise location. Crop/obscure blue-dot position and identifying surroundings in shared captures. Do not clear Expo Go storage to force a permission prompt.
Save redacted attachments under this case directory; no private originals in Git.

## Result log — fill only after owner confirmation

- Subcase / step: pending.
- Status: NOT RUN.
- Expected / actual: not observed.
- Owner report date and redacted capture reference: pending.
- Retest / defect ID: none reported yet (not evidence of no defects).

PASS requires every claimed subcheck observed with its expected outcome. FAIL means
an observed mismatch. BLOCKED means a prerequisite prevents testing; record reason.
Use separate statuses for partial checks; do not aggregate a partial pass into a
case PASS. Preserve failed attempts when recording retests. Any defect receives
repro steps, actual/expected, impact and a proposed scoped correction; functional
code changes require new owner authorization.

## Owner clarification — 2026-10-16

Location failure notice persists and obscures map. Keep permission/location calls exclusively behind explicit user action; show brief nonblocking feedback and clear it after timeout.
No correction is physically verified yet.
