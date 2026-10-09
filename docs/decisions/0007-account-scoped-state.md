# ADR 0007: Account-scoped client state

Date: 2026-09-23
Status: Accepted for T05

## Context

A module-level QueryClient, unowned personal query keys and a global notification
storage key could expose the previous account after logout/login. The map also
generated fictitious notifications repeatedly. Clearing caches only in a logout
button would miss session revocation and direct identity changes.

## Decision

Place an identity-keyed AccountDataProvider below AuthProvider. Each identity gets
its own QueryClient and mounted screen/notification state. Disposal cancels and
clears the old cache. Identity changes remount synchronously; token refresh for
the same user does not. Personal query keys include owner IDs and are disabled
without a session. Async queries and mutations capture the intended owner rather
than querying whichever user happens to be active later.

Notification persistence uses backend URL plus owner ID. Do not import the legacy
unowned key because its ownership and synthetic history cannot be established.
Hydrate before accepting changes; stopped instances ignore callbacks and late
loads. Serialize writes per storage/key across instances so quickly returning to
an account waits for its prior writes. No automatic sample-notification producer
runs. Failed loads do not overwrite unreadable storage.

Provide an owner-filtered My Courts reader and hook now; T07 supplies its UI and
membership actions. Server RLS remains authoritative even if the owner parameter
is forged.

## Consequences

Switching accounts resets navigation, local form state and public query caches as
well as private caches. This conservative boundary is appropriate for the current
small app and avoids auditing every legacy screen's state in isolation. A future
shared public cache must be explicitly separated and tested. Stored notifications
remain on-device for the original account; logout does not delete its history.
No hosted migration or authentication token storage change is required.
