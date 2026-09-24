# Supabase key migration and function preflight

Reviewed September 21, 2026. This runbook separates the verified mobile client
configuration from the owner-reported hosted Edge Function inventory.

Owner update: the Edge Functions page is empty. No deployed function migration
is needed based on that report, and none is being deployed to replace the unused
local handlers. External integrations were not independently inventoried. The
function findings below remain prerequisites for any future activation.

## Current evidence

The client reads EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY and
EXPO_PUBLIC_PROVIDER. The second variable now contains a publishable key; its
historical name does not require a legacy JWT. The previous read-only probe
returned HTTP 200 from Auth settings and three courts from the catalog. The
owner reports disabling legacy keys in the Dashboard. The exposed key was not
reused to test revocation. No server secret belongs in the mobile environment.

No direct calls to functions.invoke or functions/v1, or references to the five
function names, were found in app, components, lib, hooks or contexts. This
does not establish that external clients, webhooks, scheduled jobs or hosted
functions are absent. Deployment cannot be inferred from local function folders.

## Local function dependencies and migration requirements

### delete-account

Reads SUPABASE_SERVICE_ROLE_KEY and validates the caller with auth.getUser(token).
A key-only replacement would not make the existing deletion flow safe: it updates
missing users_public.bio/city columns and accesses user_sessions, consent_records
and blocked_users, absent from the inspected public schema. Several database
errors are ignored, and the comment promising an auth-to-profile cascade conflicts
with the inspected absence of that foreign key.

Before enabling or redeploying: define and test the deletion contract against the
real schema, validate the session before administrative work, handle partial
failure, and avoid returning successful deletion after unchecked cleanup.
Never use an actual account-deletion invocation as a connectivity check.

### export-data

Reads SUPABASE_SERVICE_ROLE_KEY but forwards the caller's Authorization header,
so its data client currently acts under the caller's JWT/RLS. Preserve that user
scope during migration rather than silently promoting export queries to admin.
The courts.created_by filter and the match_participants/consent_records tables
do not exist in the inspected schema. Query errors are ignored and can produce
an incomplete response presented as a successful export.

Before redeploying: reconcile the export contract, validate the caller's session,
separate any narrowly justified admin operation from user-scoped reads, and test
cross-account access and query failure. This review does not certify a complete
privacy export.

### issue-signed-url

Reads SUPABASE_ANON_KEY and forwards the caller's JWT. Replace the API credential
with a publishable key while retaining verified user identity and Storage RLS.
The local handler contains incomplete bucket/path authorization comments. Hosted
Storage policies and their interaction with its role check remain unverified.
Do not replace its client with a privileged secret-key client to bypass failures.

### rate-limit

Reads SUPABASE_SERVICE_ROLE_KEY, accepts userId/ipAddress from the request body
and has no handler-level caller authentication. Its rate_limits table is absent
from the inspected schema, and its read/increment sequence is not atomic.

Before enabling or redeploying: define whether the caller is trusted server code
or a user, authenticate it, derive trusted identity, implement an atomic counter
against an agreed schema and verify failures deny safely. Do not disable gateway
JWT verification on this existing handler to make a new key work.

### approx-locate

Has no Supabase key dependency and no database access. It still needs its own
input-validation and caller-policy review before being treated as production
ready. Key rotation alone does not require changing its calculation.

## Hosted inventory needed

In the intended project's Edge Functions page, record deployed function names
and whether any known callers use them. Function names are sufficient for the
first inventory; do not paste secret values or user tokens into chat or docs.
For deployed functions, also inspect their actual source, configuration and
environment-variable names: local code may differ from the deployed revision.

If none are deployed and no external integrations depend on legacy credentials,
the local historical functions need no emergency deployment to restore the MVP.
Keep them deferred and continue T03's database permission work. If any are live,
review their callers and migrate only the required functions with explicit
authorization tests before deployment. Do not re-enable the exposed legacy key
as a routine rollback.

## New server keys and authorization

Supabase documents SUPABASE_PUBLISHABLE_KEYS and SUPABASE_SECRET_KEYS as JSON
objects keyed by name, such as default. Confirm availability in the hosted
environment; do not assume a plain-string replacement or invent a new secret.
Read the selected key, fail with a generic configuration error if it is missing,
and never log environment values or raw key-parsing failures.

Publishable/secret API keys are distinct from user session JWTs. Preserve caller
authentication and ownership checks. If a gateway configuration change is needed
for a new key, handler-level authorization must be implemented and tested first;
turning off verify_jwt by itself is not an authentication migration.

## Acceptance before declaring a deployed function migrated

- Confirm the hosted function and its callers are in scope.
- Verify configured key names and reject missing/malformed configuration safely.
- Test valid, missing and invalid user sessions, or authenticated server callers
  where appropriate; an API key alone must not impersonate a user.
- Test A cannot access or mutate B's data and that database/Storage failures do
  not produce false success. Run destructive scenarios only against local fixtures.
- Run npm run verify:edge with Deno and relevant behavioral tests. Deno is not
  currently available on PATH; client checks do not substitute for these checks.
- Review the deployment and test environment before publishing. Confirm old key
  dependencies are gone from deployed functions and external integrations.

No Edge Function source, gateway configuration, hosted secret, data or deployment
was changed by this preflight. Subsequent T03 local permission evidence is recorded
in [verification](../specs/001-core-journey/verification.md); hosted permission
deployment remains separate.

Sources reviewed September 21, 2026:
[Supabase key migration](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys)
and [API key rotation](https://supabase.com/docs/guides/getting-started/api-keys#rotate-a-leaked-or-compromised-key).
