# ADR 0013 - Timing branches and court activity

Status: accepted for local MVP, 2026-10-13.

The owner requested a short creation entry ending at timing. Plan ahead reveals
scheduled fields; Now navigates to quick setup with the selected court/format.
Both use the existing create request scope, actor binding and recovery protocol.
A saved immediate request can be resumed from the entry screen without issuing
a different request.

Court activity belongs to T03 in this MVP: show explicit server-recorded start
and closure to authenticated viewers, labelled as organizer-reported with start
time. Refresh on foreground/viewing rather than claiming verified presence.
Push notifications are deferred until preferences, device permissions and
reliable delivery have their own acceptance. No notification infrastructure or
remote migration is introduced by this UI refinement.

T03 read-path implementation: reuse authenticated safe views, with account-scoped
query caches. Poll every 30 seconds only while a screen is focused and the app
is active; also refresh on foreground return. Keep failed cached reads explicitly
labelled with their last successful check. Display start time without automatic
expiry or inferred completion. Past scheduled open invitations are omitted from
upcoming discovery but remain accessible by ID; immediate invitations remain
open until the organizer changes state. Full invitations show zero places.
