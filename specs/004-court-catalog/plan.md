# Plan

T00: record the confirmed batch, inspect the local catalog, add a guarded data-only
migration and extend catalog preservation checks to cover original plus new rows.
Apply only to the running unlinked bballuy-local database. Verify replay, public
reads, original-row preservation, permissions and client checks. Preserve all
unrelated working changes. No new app UI or hosted operation.

T01: remove only the owner-selected original court using a stable ID and name
guard. Preflight found one membership and no history references. Existing FK
cascade removes that membership; do not delete accounts or migrate membership
to another court. Update expected catalog to explicitly exclude the retired ID.
