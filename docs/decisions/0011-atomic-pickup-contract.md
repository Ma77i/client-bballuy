# ADR 0011 - Atomic local pickup contract

Date: 2026-10-12. Status: accepted technical implementation for SPEC-002/T01.

## Context

The inspected legacy games/matches are coupled to historical team/statistics
contracts and permissions. SPEC-002 needs invitations independent of teams,
guest occupancy, explicit start and organizer-declared results without rankings.

## Decision

Add pickup_sessions/places and separate pickup_matches/match_players/score_history
through one incremental local migration. Preserve all legacy rows and courts;
do not activate legacy endpoints or deploy to hosted Supabase.

Expose authenticated read-only tables and narrow name/occupancy views. Views use
explicit auth.uid checks and project only display names from protected profiles;
they do not grant broad profile reads or expose email/contact fields. All writes
use pickup_command, a security-definer RPC with empty search_path, server-derived
identity, exact command field allowlists and owner checks. No team/court membership
or global role is required to organize or join.

Private per-actor UUID request receipts prevent duplicate creation and result
history after lost responses. Reject reused keys with changed payloads. Serialize
each request, then lock the target session/match row so join/leave/start and
capacity checks share a transaction. Result writes require the last read revision;
concurrent stale corrections fail rather than silently replacing a newer score.
Repeated receipts return the original response; clients reread current state.

Present-player places are guest placeholders plus one organizer account place
when playing. This prevents counting the organizer twice. A guest cannot join
through an anonymous API request.
Once any place has been occupied, core court/time/format edits stay locked even
if every registered player later leaves. Organizer join/leave updates the playing
flag and the account place together. Business conflicts use HTTP 409; invalid
input and permissions remain distinct errors. Match rosters identify two temporary
sides, registered users or guest labels, without inferred attendance or identity claims.
An invitation can link several played matches without equating registration with
attendance. Saving a result closes that match, not every match in its invitation.

## Consequences and boundaries

Direct mutations are denied, including authenticated organizer writes, so clients
cannot bypass locks or history. Started invitations cannot be edited/cancelled
as scheduled invitations; organizers may close the invitation independently of
recording results. Historical cancellations remain readable. Player limits use
the agreed 2/4/10 rule. Match sides require 1/2/5 players each when recording an
actually assembled match; registration may start without claiming a full turnout.

Request receipts are internal and not readable by app callers. Fixture cleanup
uses only generated local accounts and their owned rows. Record preservation,
permissions, concurrent requests and correction history need runtime evidence.
This contract does not certify a UI, hosted schema parity or production readiness.
