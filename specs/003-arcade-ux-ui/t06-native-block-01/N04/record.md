# N04 — Save, remove and save again with confirmed state

Type: physical iPhone test, owner-operated. Status: **FAIL — reported issue; correction/retest pending**.
Date/time, observer, runtime revision match: pending owner confirmation.

## Steps

1. Confirm the local test environment and account A. Note a chosen court’s initial saved/not-saved state without recording identity.
2. Open its detail, add it to My Courts if absent, and tap again rapidly while pending. Wait for confirmation.
3. Open My Courts, refresh with its header control, then revisit detail.
4. Remove the court through the existing confirmation if shown; check both screens. Add it again and repeat refresh.
5. While keeping the app open, turn off both Wi-Fi and mobile data briefly; try a refresh/save operation. Restore Wi-Fi and use the offered retry/recheck. Record whether the server might already have received the action; do not assume rollback or fabricate an error.
6. Restore the initial saved state when the test finishes.

## Expected

State is pending until confirmed; no duplicate action or false success. Detail and My Courts agree after refresh and after remove/re-add. Errors preserve recovery and do not claim unknown occupancy. If timing prevents an error/pending state, mark that subcheck BLOCKED or NOT RUN, never PASS by inference.

## Observe / evidence

Capture pending, confirmed, removed and recoverable error when reproducible. Record initial/final state by court name only and whether network loss occurred before/after tapping.
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

Pending confirmation block is visually intrusive. Replace it with button spinner and screen-reader pending announcement; preserve server readback, duplicate prevention and error retry.
No correction is physically verified yet.
