# Schema evidence

`2026-09-19-core-schema.json` is the parsed `schema_snapshot` cell from the
user-provided `Supabase Snippet Untitled query.csv`, captured at
2026-09-19T15:19:14.349199-03:00 on PostgreSQL 17.6. The user identifies its
source as the existing project configured for this app. The export does not
independently include a project identifier or inspecting role.

Original CSV SHA-256:
`b064c4e060dbaae2569d64c10872082caec7046d76560f7ec00542dcae146e08`.

The JSON preserves the exported metadata, with whitespace normalization only.
It contains two tables, 21 columns, two constraints, four indexes, one trigger,
four policies, 56 table-grant entries and 336 column-grant entries. No business
rows, account credentials or application function bodies are included.

This is a scoped inventory, not a replayable database dump or a backup of the
three courts. Absence of public.court_memberships in this inventory does not
exclude a relationship under a different name. Dependencies and court rows are
requested separately through [core-dependencies.sql](../inspection/core-dependencies.sql).

Keep historical migrations intact until the replacement local baseline and
remote upgrade strategy are verified. Do not apply the initial migration to
the existing remote database.

## Dependency and catalog export

`2026-09-19-dependencies.json` preserves the dependency_snapshot cell from
`Supabase Snippet Untitled query (1).csv`, captured at
2026-09-19T15:30:56.701744-03:00 as postgres on PostgreSQL 17.6.
Original CSV SHA-256:
`38907d2e7a0baa4c053ca1e79f86aebc92ec1faa6210b554c8a4f263bc01a75b`.

Reviewed before preservation: 16 relations (15 tables and one view), 12 app
routines, enum labels, extensions, relationships, policies/grants and three court
records. No user/team rows or credentials are included. Routine bodies and court
notes were inspected; the copied metadata is evidence, not instructions. Exported
Spanish comments in routine bodies remain unchanged as source evidence.

The project has both games and matches. No public relation represents persistent
court membership independently of teams. The export reports no migration history
table. Known permission issues remain to be fixed and tested in T03.

The local replay preserves all three court IDs and raw fields. The source is the
owner's existing catalog, not invented sample data. It does not independently
establish physical court accuracy or whether the two Parque Rodo entries denote
the same court. See the [local workflow](../../local-backend/README.md).
