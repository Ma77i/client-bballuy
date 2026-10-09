# ADR 0003: isolated local baseline from inspected schema

Status: accepted for local T02 implementation, 2026-09-19.

## Context

Two owner-supplied exports establish the public application schema and three
existing court records. The remote schema differs from the historical migrations
and reports no supabase_migrations.schema_migrations table. Running the old
initial migration or pretending it already represents the remote state is unsafe.

## Decision

Keep root supabase/migrations unchanged as historical evidence. Create a separate
Supabase CLI workspace at local-backend, with project ID bballuy-local and distinct
ports. The baseline reconstructs the inspected public tables, enums, functions,
views, constraints, indexes, policies, grants and relevant auth trigger. Supabase
provides its own auth schema and services. The baseline is local-only and retains
known permission flaws for subsequent T03 fixes and regression tests.

Seed all three exported courts with original IDs, geography values and attributes.
Do not silently merge the two similarly named Parque Rodo courts, translate raw
lighting values into booleans, or use the historical example seed. Provenance is
the owner-provided database export; physical location accuracy remains to be
reviewed before map acceptance. No production users, memberships or teams are
copied into the local environment.

New MVP changes are separate local migrations. Start court membership with
user_id, court_id and joined_at, a unique pair and foreign keys. No team or expiry
field is needed. Keep it inaccessible to API roles until ownership policies are
implemented in T03. Generate TypeScript from the running local database, never
from guessed enum labels or manually asserted JSON shapes.

## Consequences

Local replay does not constitute remote deployment. A future remote change must
be an incremental, reviewed upgrade that preserves the existing catalog and team
relationships; do not push the local baseline to that project. Private schemas,
storage buckets, external Auth settings and all remote data are outside this
snapshot, so the local environment is not a full backup or exact hosted clone.
