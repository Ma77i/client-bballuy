# SPEC-004 - Owner-supplied court catalog expansion

## Scope
Add four owner-supplied courts to the unlinked local development backend.
Preserve existing courts, identities, memberships and other data. No hosted
operation, schema/permission change or redesign acceptance is implied.

## Requirements
### R01 - Accurate additive catalog
Import La sereg (-34.896771, -56.171400), barrio sur (-34.9140763,
-56.1829666), cementerio sur (-34.9133863, -56.1881912) and Plaza Argentina
(-34.911714, -56.199050). Only barrio sur is a half court. All have concrete
surface, stored as `concreto` consistently with the existing catalog. Preserve
owner name spelling. Interpret `gormigon` as concrete and discard the extra `62`
after the two supplied coordinate pairs. Lighting and notes remain null.
Coordinates/attributes are owner-provided, not independently surveyed.

### R02 - Reproducible preservation and verification
Use stable IDs and an incremental local migration; no reset, overwrite or
silent duplicate import. Verify all original fields, all new attributes,
public catalog projection and unchanged membership permissions. Replaying the
import must not create duplicates or change existing values.

## Acceptance
- A01/R01: four new catalog rows have exact names, coordinates and attributes.
- A02/R02: original rows remain identical, repeat is harmless, public API and
  local contract/permission checks pass; client verify passes. Record limits.

See [tasks](tasks.json), [plan](plan.md) and [evidence](verification.md).

### R03 - Owner-requested removal
On 2026-10-16 the owner requested removal of Parque Rodo Court, identified locally
as `Parque Rodó Court`, ID `61b2c883-d029-4725-9142-bc1af122b84f`.
This explicitly supersedes R02 preservation for that row only. Delete its local
community membership as required by the existing cascade; preserve user accounts,
all six remaining courts and unrelated records. Abort if game, match, team or
pickup history references it. Keep the other `Parque Rodo` record unchanged.
Use a repeat-safe incremental migration and maintain the historical snapshot.

- A03/R03: selected ID absent from the database/public API, associated membership
  absent, six expected courts intact, local checks pass; no hosted operation.
