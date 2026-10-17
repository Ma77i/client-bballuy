# N05 — Logout and account isolation A → B → A

Type: physical iPhone test, owner-operated. Status: **NOT RUN**.
Date/time, observer, runtime revision match: pending owner confirmation.

## Steps

1. Use two existing local test accounts labelled only A/B. If B is unavailable, mark cross-account checks BLOCKED; do not provide credentials or create production accounts.
2. In A note real saved-court/participation distinctions; open Profile and My Courts. Where no distinguishing data exists, record that limitation rather than inventing it.
3. Sign out normally, sign in as B and inspect Profile, My Courts and existing personal game data only for isolation (do not execute N06–N11).
4. Sign out B and return to A. Check that only A’s confirmed information returns; watch for flashes of previous-account data during loading.
5. Test logout with network unavailable, observe the actual result, restore connectivity and recover. Logout may succeed locally offline: do not claim that an error branch was verified if none occurred.
6. Open Reportar un problema only to verify the existing handoff/cancel behavior; do not send a report or message. Return to the intended test account.

## Expected

Logout returns to authentication; B never sees A’s personal state, and returning to A restores A’s state only. Loading/error/retry cannot publish another account’s cache. Failed logout, if actually observed, remains recoverable. A legitimate offline logout success is recorded separately from an untested failure branch.

## Observe / evidence

Record A/B labels only, actions and timings. Crop/blur names, emails, passwords and any private participation data. Record whether logout actually failed; never induce errors through backend edits.
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
