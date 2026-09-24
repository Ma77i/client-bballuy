# ADR 0004: core API permission boundaries

Status: accepted for local T03 implementation, September 21, 2026.

## Context

The inspected schema allows table-wide profile writes; ownership RLS alone does
not protect global roles or statistics. The local court membership relation was
closed to API writes pending authorization tests. Public roster/count visibility
is undecided. The owner reports that hosted Edge Functions are empty, so no Edge
deployment is required to implement the local database boundary.

## Decision

Keep the inspected baseline immutable and add a separate local migration. Revoke
both table and column privileges from PUBLIC, anon and authenticated before
granting the minimal core operations. Retain the existing profile SELECT policy.

Authenticated callers may update only their own display name, avatar URL and
existing privacy/location preferences. Roles, IDs, timestamps, level and counters
are server-managed. The signup trigger creates a player profile regardless of
caller metadata; direct API INSERT, UPSERT and DELETE are unavailable. Harden
the trigger function's search path and revoke direct execution by public API roles.

Courts and their invoker coordinate view permit SELECT only. Memberships allow
authenticated SELECT/DELETE with owner RLS and INSERT of user_id/court_id with an
owner check. joined_at remains server-generated, and no UPDATE privilege exists.
Membership rows remain private to their owner until roster/count visibility is
explicitly specified. This does not decide future team eligibility.

Privileged server maintenance remains separate from the mobile user's API role.
An admin label in a user profile does not grant extra client column privileges.
Test real local Auth sessions through PostgREST, not service-role impersonation.

## Consequences

T04 must complete onboarding by updating the trigger-created profile rather than
inserting a client-supplied profile. The app continues to use its hosted backend;
local acceptance does not prove those hosted permissions are fixed. A hosted
upgrade still requires fresh inspection and a separately reviewed incremental
deployment. Other historical tables/functions, Storage and mobile behavior are
outside this permission change.
