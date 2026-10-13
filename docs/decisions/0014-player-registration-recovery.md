# ADR 0014 - Confirmed pickup participation and personal sessions

Status: accepted for local MVP, 2026-10-13.

T04 uses the existing authenticated pickup_command join/leave actions and safe
read projections. The public detail receives explicit join, leave confirmation
and a current-registration indicator. Writes pass the expected actor; direct
table writes are not used. Only open sessions allow changes; planned time is
not an automatic start. Server row locks enforce capacity and lifecycle races.

Persist one request UUID/action per backend/account/session before sending.
Replay uncertain operations after reopening, then reread current membership
before reporting confirmation. Block the opposite action until reconciliation.
A definite server rejection clears the operation; transport/auth/readback or
storage failures retain it. Cache invalidation refreshes public details,
discovery, owner views and personal sessions, without optimistic membership.

My sessions is a separate route linked from Play, containing a deduplicated
union of organizer-owned invitations and current account registrations, grouped
by open, started, cancelled and completed state. A non-owner who leaves drops
from the list; an organizer who leaves still has an organizing entry. A
cancelled registration remains visible. Read failures preserve labelled cached
rows, and foreground/focus polling follows T03. No new SQL, attendance credit,
rankings or notification service is required.
