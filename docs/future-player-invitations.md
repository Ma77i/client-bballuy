# Future functional SPEC planning note — player invitations

Date:2026-10-15. Status: documented request only, NOT implemented or a ready SPEC.
This is explicitly outside SPEC-003's current presentation/usability implementation.
Do not change membership, pickup contracts/RLS or anonymous-place accounting here.

## Requested capabilities for both now and planned games

- Search real accounts by name or email under approved privacy/discovery permissions.
- Send invitations and let the target account accept or reject.
- Reconcile real available places only when the defined lifecycle transition merits it.
- Count unregistered guests where the existing flow permits it, without creating a
  fake account or an acceptance action on behalf of somebody without an account.
- Enforce capacity/concurrency/authorization on the server; UI counts are not locks.

## Decisions required before a later functional SPEC is ready

- Who may search by exact email vs display name, which fields are exposed, consent,
  enumeration protections/rate limits and account isolation. Never expose private
  email lists to implement a friendly-name search.
- Who may invite, which game lifecycle states permit it, expiry/cancel/revoke rules,
  repeat invites, notification/delivery channel and acceptance confirmation UI.
- Whether pending invitations reserve any capacity is NOT decided. Define exactly
  when a place is allocated/released on acceptance, rejection, expiry, cancellation,
  leaving, organizer changes and game start/closure. Do not infer new rules from R02.
- Define own-account participation vs anonymous present/guest places and conversion
  rules without double counting a person when an account later participates.
- Define atomic transactions/locking, idempotency/replay, stale responses, last-place
  races, full games, simultaneous acceptances and notification failures. Capacity
  must remain2/4/10 under adversarial concurrent requests.
- Confirm data model/contracts/migration/RLS only after remote schema inspection;
  current local SQL is not evidence of hosted equivalence.

## Proposed future acceptance evidence (not executed)

Two real isolated accounts, both modalities/formats, search privacy tests, duplicate
send/replay, accept/reject/expiry, no place on transitions that do not allocate one,
concurrent last-place acceptance and anonymous/registered duplicate prevention.
Include organizer/account isolation, unauthorized acceptance, stale/offline recovery,
closed/full states and server-enforced capacity. A later functional SPEC must obtain
explicit authorization before any implementation, migration or notification sends.

No user-search UI, invitation records/endpoints, notification sends or server changes
were created by the current organizer usability task.
