# ADR 0005: one session owner and recoverable onboarding

Status: accepted for local T04 implementation, September 22, 2026.

## Decision

Use Supabase Auth as the single session owner. Native clients use AsyncStorage;
web clients use the SDK browser storage. Share persistence, refresh and process
lock options between production and local integration tests. Do not save a second
access/refresh token copy in secureStorage; remove legacy copies on logout.
AsyncStorage is not encrypted storage. This implementation does not claim a
hardware-backed token vault or native-device security acceptance.

Keep auth callbacks synchronous and defer profile loads outside the callback.
Validate restored sessions with Auth, distinguish network/profile failure from
an incomplete profile, and ignore obsolete async results after account changes.
Refresh follows native AppState; React lifecycle cleanup removes listeners.

A root gate routes missing sessions to login, unfinished profiles to setup, and
completed accounts to discovery. Profile setup updates the trigger-created row
and re-reads it before continuing; avatar upload is optional. Email confirmation
returns through manual sign-in. OAuth and unfinished password recovery controls
are hidden. Forms display validation/request errors inline on web and native.

## Consequences and boundaries

Controller tests cover races and retry paths, while real local SDK tests cover
Auth persistence through a reused test adapter, refresh and revocation. Browser
reload evidence is separate from native force-close/reopen acceptance. Revoking
a refresh session does not make an already issued JWT disappear immediately;
rejection is tested when refreshing, without promising instant global logout.

T05 owns account-scoped React Query and notification cleanup. Existing age and
consent screens are retained; the historical pending-consent sync only runs for
immediate-session signup. Confirmation-later consent synchronization, placeholder
legal links and optional Storage uploads are not accepted by T04 evidence.
No hosted database permissions, Auth settings or deployment are changed.

Metro excludes only generated .harness artifacts (including the documentation
worktree) from its file watcher so harness fixture cleanup cannot crash preview.
This does not exclude application code from lint, types or tests. The local web
wrapper injects only a local public key and URL without changing the app .env.
