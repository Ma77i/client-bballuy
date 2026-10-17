# N01 — List entry, search and shared map results

Type: physical iPhone test, owner-operated. Status: **FAIL — reported issue; correction/retest pending**.
Date/time, observer, runtime revision match: pending owner confirmation.

## Steps

1. With test account A signed in, fully close the app then reopen the project in Expo Go. Do not use a reload alone to claim a cold launch.
2. Open Canchas. Verify List is the initial discovery mode; note whether persisted state changes this observation.
3. Search Palermo; switch to Map and back to List without clearing the search.
4. Open its detail, return using the back icon, and inspect the search/mode context.
5. Clear search; try a deliberately unmatched search, then clear it again.

## Expected

Initial discovery uses List; the same filter applies to list and map. Palermo is the only matching court, no fictional courts appear, empty results are recoverable, and returning preserves the discovery context.

## Observe / evidence

Capture initial List, filtered Map and restored List; note startup path and exact search text. Do not infer map behavior from a web preview.
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

Core list/search/mode journey owner-approved; initial overview zoom too close. Increase catalog bounds padding/minimum span only; preserve manual camera and explicit detail focus.
No correction is physically verified yet.
