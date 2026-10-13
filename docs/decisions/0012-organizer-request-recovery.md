# ADR 0012 - Organizer UI and recoverable requests

Date: 2026-10-12. Status: accepted technical implementation for SPEC-002/T02.

## Decision

Add a Play tab for owned invitations, a create form and organizer-only management
routes. Keep public discovery/joining and played-match result screens for T03,
T04 and T06. Reuse the Expo stack, auth gate, fonts and account-remounted query
provider. Original court records remain separately selectable.

Validate supported formats, combined places and real local dates/times before
sending. A future invitation reserves only the organizer's chosen player place;
immediate invitations include present guests. Core edits follow core_locked.
Confirm start/cancel/close before mutation; closing records no score or attendance.

Persist request UUID/payload before sending in AsyncStorage, partitioned by
backend URL, owner and create/session scope. Uncertain requests freeze conflicting
input and retry with the same key after remount/reload. Confirm current owned
server state after the RPC, then clear the pending record. Definite business
rejections permit editing; transport, storage/readback and auth uncertainty retain
the operation. No credentials are stored in the request record.

Check identity before/after the command and pass p_expected_actor to the server.
Its comparison against auth.uid rejects account changes between the client check
and transport. The parameter is optional for earlier local callers; the mobile
client always pins it. Auth failures cannot erase an older uncertain request.
Current query/screen state remounts with the account boundary.

## Local contract refinements

The unreleased local migration definition includes expected-actor binding and
allows editing an open description after its planned time, without changing the
time. Only an explicitly edited future schedule must still be in the future.
The function was synchronized locally without hosted migration or reset. Types
and rollback-replay/permission tests cover the final definition.

Original dark panels, orange actions, sports typography and clear place/status
counts establish the visual direction. Safe-area-aware tab heights preserve
labels on narrow screens. No licensed graphics or unimplemented controls are used.

## Limits

Request storage is scoped, not encrypted content storage; keep credentials out of
payloads. A different backend URL is treated as a different scope. Browser and
bundle checks do not certify native touch/keyboard behavior. Native acceptance
remains explicit in the final MVP verification.
