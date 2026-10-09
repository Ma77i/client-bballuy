# Database reconciliation runbook

Scope: SPEC-001 / T02. This is an inspection workflow, not a deployment workflow.

## Local reconciliation implemented — 2026-09-20

Both requested exports have been received and reviewed. There is no further
inventory request pending for the local T02 scope. The
[local backend](../local-backend/README.md) reconstructs the inspected public
schema and original court catalog, then adds the MVP data contract in a separate
migration. PostgreSQL 17.6/PostGIS 3.3.7 replay, data checks, API reads and generated
client types have been exercised locally. See
[ADR 0003](decisions/0003-inspected-local-baseline.md) for the baseline/upgrade
boundary and [verification](../specs/001-core-journey/verification.md) for evidence.

The remote schema, users, teams and all three courts are unchanged. No remote
migration is implied. Permission changes and caller tests belong to T03;
physical catalog validation and map integration belong to T06. The collection
steps below document how the evidence was obtained; they are not instructions
to export the same files again.

## Received inventory and next step — 2026-09-19

The first SQL inventory was received as a CSV and parsed into the preserved
[schema snapshot](../supabase/snapshots/2026-09-19-core-schema.json). See its
[provenance](../supabase/snapshots/README.md) and the
[code/schema comparison](db-context.md). It confirms the shapes of courts and
users_public; it does not include function bodies, enum labels, other possible
membership relations or the court records themselves.

Run [core-dependencies.sql](../supabase/inspection/core-dependencies.sql) in the
same project's SQL Editor and export the single dependency_snapshot value as
CSV or JSON. It reads public application metadata and existing court records,
including their IDs and original geography text. It does not read auth/user/team
rows or execute application functions. Review function definitions and court
notes for private embedded values before sharing. No remote data is modified.
The follow-up is not a full backup or proof of court location accuracy.

The follow-up executed successfully on an isolated PostgreSQL 16.0 synthetic
fixture, including enum, view, routine and court-result assertions; the
temporary container was removed. The remote database is PostgreSQL 17.6, and
the fixture used text for coordinates rather than PostGIS, so this is a query
validation only. Actual dependency collection and local Supabase replay remain
pending.

Use these results to choose the exact PostGIS/local baseline, preserve existing
signup behavior and model persistent court membership separately from teams.
Do not replay the mismatched historical migration against the remote project,
generate authoritative types from the partial export, or remove existing users
as a shortcut. No cleanup is currently needed for this inspection.

## Current environment evidence — 2026-09-19

- Client verification was green at task entry; T01 was already complete.
- The existing environment file defines a Supabase project URL and public key. Values were not printed or copied into documentation.
- `npm run db:inspect:api` reached the configured project's metadata endpoint outside the restricted execution environment, but received HTTP 401. No metadata snapshot was obtained. This proves the request was rejected, not which credential/configuration is wrong.
- Docker CLI is installed. The earlier check could not connect to the engine, but a new authorized read-only check returned server version 28.3.2. Docker is now available; no local containers or database were started by this task.
- Follow-up diagnosis: the same public key returned HTTP 200 for `/auth/v1/settings` and `/rest/v1/courts?select=id&limit=0` (empty array as requested). OpenAPI root requests still returned HTTP 401. Credentials work for these normal API requests; the initial OpenAPI-only probe was not a valid general credential check. No application rows were retrieved.
- The user confirmed that the configured project is still the intended target. Its three existing courts must be preserved, including their identifiers and stored details. Existing test users and their court associations may be cleaned up only if necessary; no cleanup has been performed or shown necessary. Do not treat this remote project as disposable.

Do not generate an authoritative Database type or design a remote migration from the historical JSON alone. No remote schema, rows or credentials were changed.

## Step 1: identify the target

The target and retention requirements are confirmed above. Compare the current project URL and public key with the local `.env` privately; update only if needed. The dashboard's Connect dialog shows the URL and publishable key; Settings > API Keys also lists legacy keys. Check the existing anon key if the project still uses it. HTTP 401 alone does not prove credentials changed. Do not paste tokens or database passwords into task messages or commit them.

Docker is an independent local prerequisite for the disposable test stack. The hosted Supabase project does not depend on Docker Desktop on this computer; fixing either access issue will not automatically fix the other.

The public key cannot inspect all database internals. Access to the SQL editor or an authorized database connection will also be needed for the complete inventory. A service-role key is not a database connection password.

## Step 2: choose a supported schema inspection path

Hosted Supabase [removed OpenAPI access through anon keys](https://supabase.com/changelog/42949-breaking-change-removing-access-to-openapi-spec-via-the-anon-key) in 2026 without changing normal table API access. The public-only inspector below is therefore not a supported hosted-project inventory method. Its initial use for this project was mistaken; do not rotate working keys because it fails. Proceed to the read-only catalog inventory in Step 3. An alternative for API metadata is the authorized [Management API OpenAPI endpoint](https://supabase.com/docs/reference/api/v1-get-database-openapi), which still does not replace catalog inspection.

### Optional legacy/self-hosted metadata probe

Run `npm run db:inspect:api`. This explicitly contacts the configured project; it is not part of the default offline `verify` command.

The script sends a GET to `/rest/v1/` using the public key only. It refuses privileged JWT roles, rejects unsafe remote HTTP URLs and redirects, does not query table rows and writes only selected column metadata to `.harness/database-api.json`. It excludes descriptions, examples and defaults from that report.

The report describes only API-visible definitions for users_public, courts and court_memberships. An absent definition means not exposed or absent, not proof that the table does not exist. It does not contain policies, triggers or a complete privilege model. Check the report timestamp: failed runs do not replace a prior snapshot. Do not derive SQL nullability from requiredByApi alone.

PostgREST's [OpenAPI documentation](https://docs.postgrest.org/en/stable/references/api/openapi.html) explains this API metadata surface. The inspector is deliberately not a generated-type replacement.

## Step 3: collect the database inventory

Review and run [public-schema.sql](../supabase/inspection/public-schema.sql) against the identified development database using an authorized SQL editor/connection. The file opens a read-only transaction and queries catalogs only: table/column definitions, defaults, constraints, indexes, relevant triggers, RLS and grants for the MVP tables.

It does not execute table mutations, read business rows, create a helper RPC or alter policies. It has not yet been executed against PostgreSQL in this environment. Grant visibility depends on the inspecting role. Review relevant trigger/helper function bodies and referenced enum definitions separately; function bodies are intentionally not exported automatically.

Save the JSON result locally under `.harness/` first. Review schema defaults and definitions before adding sanitized schema evidence to version control. Include the environment label, inspection role and timestamp, never credentials.

## Step 4: reconcile and prove the contract

Compare the inspected schema with historical migrations, docs/db-schema.json and current queries. Decide the canonical contract and record a migration strategy that preserves existing rows. Membership is persistent, independent of teams, and unique per user/court; inspect before adding it in case an equivalent relation already exists.

Docker Desktop is now reachable. Prepare a project-scoped Supabase CLI/local configuration. Pin the chosen CLI and database versions based on the inspected environment. The existing seed file is historical example data, so review/disable it before automatically starting a new local stack; do not call its courts a verified local catalog. Use a separate stack; do not repurpose existing Docker images, containers or volumes from other projects.

Replay the reconciled migration chain in an isolated database, test the upgrade path where needed, and generate types from that schema. Supabase documents [local workflows](https://supabase.com/docs/guides/local-development/cli-workflows) and [generated types](https://supabase.com/docs/guides/api/rest/generating-types). These steps remain unexecuted here.

Complete T02 only after database replay, schema/type/query agreement and reproducible real-court provenance are evidenced. Keep permission acceptance in T03 and functional membership UI in T07. Merely creating inspection scripts does not satisfy T02.
