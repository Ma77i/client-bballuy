# ADR 0009: Confirmed court membership changes

Date: 2026-09-24
Status: Implemented locally for T07; device acceptance pending

## Decision

Use the existing court_memberships table and owner-only policies without a new
migration. Join inserts only user_id/court_id, leaving joined_at server-managed.
A unique-key conflict is acceptable only if a subsequent owner-filtered read
confirms membership. Do not upsert/update an existing timestamp. Leave deletes
only the current owner's selected court and confirms absence, so repeating it
is safe after a lost acknowledgement. Validate IDs and current Auth identity
before writes; database RLS and foreign keys remain authoritative.

The UI waits for a confirmed response and reloads the owner's membership list
before claiming success. There is no optimistic membership state. Disable repeat
submissions while pending and retain the intended action on failure for an
explicit retry. Cancel stale list reads before publishing the confirmed list.
Details and My Courts share the owner-scoped query/cache boundary from ADR 0007.
Changing accounts isolates late mutation results in the old cache.

## Product boundary

Join means persistent community membership without a team, scheduling, attendance
or expiry. No public roster or member count is exposed. My Courts provides empty,
loading, error/retry and refresh states, and opens the same court detail page.
The existing team tab is preserved; final MVP navigation cleanup is T08 scope.

## Verification boundary

Local API tests include duplicate/concurrent joins, preserved join timestamps,
leave retries, rejoin, fresh-client persistence, owner mismatch and invalid courts.
Fault tests cover writes applied before a lost acknowledgement and read-back
failures. Browser evidence is separate from iPhone acceptance. Hosted schema
upgrade/deployment requires a separate authorized task.
