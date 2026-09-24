# Current architecture

Reviewed 2026-09-24 against the local working tree. Hosted deployment is not
represented by these files. See the [formal closure audit](../specs/001-core-journey/closure-review.md).

## Client and navigation

Expo SDK 57 / React Native 0.86.3 / React 19.2.3, using Expo Router.
Active authenticated tabs are Courts, My Courts and Profile. Court detail is
app/court/[id].tsx. Tabs/Stack Protected guards exclude teams, team creation,
player details and notification settings; legacy source/data is preserved.
These route guards are product boundaries, not server authorization.

AuthGate coordinates signin, incomplete-profile setup and authenticated discovery.
The first-run onboarding, age and consent screens remain reachable. Their outdated
feature claims and placeholder policy links are open R10 findings, not evidence
that the corresponding features work. Profile editing/avatar upload is not exposed.
AppText preserves the Lexend font through public Text props.

## Session and personal state

AuthContext delegates to lib/auth/controller.ts. Supabase persists the session
through AsyncStorage on native platforms and SDK storage on web, using processLock.
Native AppState coordinates auto-refresh. Auth hydration validates the user and
loads the minimal profile; revisions prevent late responses restoring an old account.
The legacy secureStorage helper is cleared on logout, not used as a second token store.
AsyncStorage does not provide SecureStore-backed encrypted token persistence.

AccountDataProvider remounts the QueryClient and personal screen subtree on identity
changes. Personal query keys include the owner; old caches are cancelled/disposed.
Notification persistence is backend/account scoped and serializes writes. Automatic
sample events are removed; this is neither a push service nor a working settings UI.
Consent synchronization binds pending drafts to backend/account and retains them
on failure for retry. This technical persistence does not validate policy content.

## Court catalog and membership

The local court_catalog security-invoker view converts preserved PostGIS coordinates
to latitude/longitude. One client name filter supplies both list and map markers.
Native react-native-maps 1.27.2 uses the default Apple provider on the tested iPhone;
the web-specific component provides the catalog list without a native map.
Location is opt-in, in-memory and used only for recentering; denial keeps browsing.

Court membership is separate from teams or attendance. lib/courts/membership.ts
validates identity/IDs, inserts or deletes the owner/court pair, then confirms state.
Unique constraints and owner-only RLS enforce server integrity. Retries do not
rewrite joined_at. The shared owner query updates after confirmation, without
optimistic success. No public roster, count, capacity or expiry is implied.

## Backend boundary

local-backend/supabase is the unlinked disposable workspace. Its baseline/seed
reproduce the owner's inspected schema and three court records; the subsequent
permission migration protects core profiles, catalog and memberships. Generated
types in lib/backend/database.types.ts describe this local contract.

Root supabase/migrations, SQL scripts and JSON are historical source material,
not a deployable hosted upgrade. Local RLS tests do not establish hosted permissions.
The generic legacy adapter in lib/backend/supabase.ts is not used for new court
writes; its eq method drops the filter and requires repair before reuse.

## Legacy and operational limits

Five Deno functions remain under supabase/functions, without callers in the MVP.
The owner reported no hosted Edge Functions; verify:edge currently fails because
Deno is unavailable. Schema/auth/error-handling gaps are in the
[key migration review](supabase-key-migration.md). Team creation is nontransactional;
Storage/avatar and notification settings are not certified. Do not activate these
areas on the strength of client checks.

Local API tests run against Docker with real anonymous/A/B credentials and clean
only their fixtures. Docker's observed non-loopback bindings and the HTTP LAN
preview are development limitations. Signed builds, hosted migrations, public
email delivery and production operation have no acceptance evidence yet.
