# SPEC-001 formal closure review

## Resolution update - 2026-10-09

C01-C03 are resolved for local MVP acceptance. C01: all four introduction slides
and welcome now describe catalog/community/My Courts only; fresh-entry and direct
browser routes passed. C02: consent visibly identifies provisional development
notices, removes external policy links/unsupported promises, and records test
acknowledgements as dev-preview-1 through the existing draft/sync contract. Both
selections are required; storage failure retains them and supports retry. This is
not legal-policy approval or authorization for public registration. C03: the owner
explicitly confirms Palermo, Parque Rodo and Parque Rodó Court are at their actual
locations. No court rows were changed or merged; this is owner evidence, not a survey.

See the dated verification entry for 48 client tests, browser evidence and limits.
T08 is done and SPEC-001 verified within the local scope. Remaining release debt
below still applies. The repository was clean at aae45d5 before this change; the
older inventory and commit-group proposal describe the September audit, not the
current uncommitted delta. No future feature work, new commit, push or remote operation occurred.

## Historical audit (superseded by the resolution above)

Reviewed 2026-09-24 against the working tree at HEAD 5027fe0, not a published
release. This review supersedes the earlier unconditional closure statement.
No application code, database, Git index, commit or remote was changed by the audit.
No future feature specification was created or started.

## Verdict

The core local MVP is implemented and has browser, automated and owner-reported
iPhone evidence. Formal closure is not yet justified: R10/A10 still has visible
unfinished promises and placeholder links in the public onboarding/consent flow.
T08 and the registry return to in_progress; earlier passing evidence is retained.
This is a correction to the acceptance assessment, not a regression in membership.

## Acceptance review

- **A01 / R01: client baseline accepted.** Current verify passes; 46 client tests
  and 11 harness tests pass. T09 records clean installation, compatibility checks
  and bundle exports. The separate verify:edge fails with missing Deno (ENOENT).
  No Edge source changed and no Edge call belongs to this MVP; this is not a
  server-wide green result or permission to activate the legacy functions.
- **A02 / R02: local data contract accepted.** T02 records reproducible replay,
  generated types and preservation of three supplied court IDs/raw fields.
  Local-backend contract/seed tests support this. Source provenance is the owner's
  exported catalog, not an independent field survey. Hosted schema is not upgraded.
- **A03 / R03: local permissions accepted.** T03 and the latest T08 run record
  111 direct assertions with anonymous/A/B callers, protected profile fields,
  read-only catalog and owner-only memberships, including forged IDs and retries.
- **A04 / R04: local signup/login accepted.** T04 records immediate-session and
  confirmation-required signup, local captured-email confirmation/manual return,
  invalid-password retry and consent recovery. Native automatic deep linking is
  explicitly not required. Real hosted email delivery is not certified.
- **A05 / R05: minimal profile accepted.** Name validation, save without avatar,
  recovery from incomplete setup, persistent profile and write-error retry are
  evidenced in T04/T08. Avatar editing is hidden and not certified.
- **A06 / R06: session lifecycle accepted.** Controller/integration tests cover
  refresh, revocation and late responses; the owner reports iPhone restart and
  logout. API tests use a memory adapter; actual native persistence is supported
  by the separate owner report, not inferred from that adapter.
- **A07 / R07: account isolation accepted.** Account-scoped cache/storage tests,
  browser A -> B -> A and the explicit owner iPhone confirmation support this.
  Frame-by-frame native recordings are not available.
- **A08 / R08: map/list interaction accepted; geographical accuracy is limited.**
  T06 records three markers, matching details, rodo search, location grant/denial
  and manual browsing on iPhone. Browser read-error/no-match recovery passes.
  Coordinates match the supplied source; no separate physical-location survey
  or explicit confirmation of each court's real-world position is recorded.
  Because A08 says to check location accuracy and R02 mentions physical accuracy,
  obtain explicit owner confirmation for all three positions before claiming
  unqualified geographical acceptance. Do not silently merge the Parque Rodo rows.
- **A09 / R09: persistent membership accepted.** Join/leave/rejoin, independent
  same-court A/B membership, restart, uniqueness, invalid IDs and lost response
  retry are evidenced in T03/T07/T08. Multiple-court integrity has SQL/API tests;
  expanding or formalizing that proposed product default remains a separate decision.
- **A10 / R10: incomplete.** Profile/membership/read/logout error recovery passes
  and legacy authenticated routes are guarded. However, first-run onboarding and
  consent remain accessible and still present deferred capabilities as available.

## Findings that prevent formal closure

**C01 - Misleading onboarding, R10/A10.**
`app/(auth)/onboarding/index.tsx` advertises statistics and games; step2 advertises
real-time activity; step3 advertises teams/invitations/events; step4 promises a
match one tap away. `app/(auth)/welcome.tsx` repeats the statistics/game claim.
`app/splash.tsx` routes a new installation to these onboarding screens. Hiding
the authenticated Teams tab does not remove these claims.

Exit condition: make the visible introduction describe only implemented court
discovery/community membership; verify a fresh first-run journey and direct
welcome/onboarding links. Do not implement deferred teams/events to fix the copy.

**C02 - Placeholder consent links and unsupported promises, R10/A10.**
`app/(auth)/consent.tsx` opens example terms/privacy URLs under tu-dominio.com and
claims users can control visibility/export/delete data at any time. Those controls
are absent from the MVP; legacy export/delete handlers are not verified/deployed.
The local HTTP development environment also cannot support an unqualified claim
that all transport is encrypted. Legal policy validation is outside this audit;
the concrete finding is that the app describes unavailable behavior as available.

Exit condition: clearly identify the development consent placeholder, prevent
misleading links/promises and preserve the existing consent persistence contract.
Owner-approved real policies/URLs and actual privacy operations are release work;
do not invent legal text, claim compliance or deploy legacy handlers as a shortcut.

**C03 - Location accuracy evidence, A08/R02.**
Source-coordinate equality and correct marker-to-detail navigation do not prove
physical accuracy. Ask the owner to confirm the three locations against known
courts and record the result. A correction/merge affecting preserved rows needs
its own reviewed data decision. T06's interaction evidence remains valid.

## Debt, workarounds and risks outside the local core acceptance

- **Hosted boundary (release blocker):** local migrations/RLS/types are the tested
  contract. Root historical SQL is not a safe upgrade path. Reinspect hosted
  state, preserve accounts/courts, prepare backups and an incremental migration
  before any separately authorized deployment. Local tests do not certify hosted RLS.
- **Dependencies (release triage):** T09/T06 recorded 26 audit findings: 2 low,
  17 moderate, 7 high. This audit did not refresh registry advisories or establish
  exploitability. Do not use audit fix --force as an unreviewed upgrade strategy.
- **Legacy services:** missing Deno prevents checking five Edge handlers. The
  [key migration review](../../docs/supabase-key-migration.md) records schema,
  authorization and error-handling gaps. Owner reported hosted Functions empty;
  that is not an independent inventory of all integrations. Keep them inactive.
- **Development exposure:** Docker was observed publishing beyond loopback despite
  requested network settings. Local HTTP/private-LAN preview is intentional for
  Expo Go, not a production security configuration. Use the documented local
  lifecycle; this audit did not alter running containers or firewall rules.
- **Runtime validation:** Expo Go and bundle exports are not signed iOS/Android
  builds, distribution acceptance, background lifecycle testing across all OS
  versions, accessibility certification or performance/load testing. Web has a
  list, not an interactive map. No cross-device offline synchronization promise.
- **Persistence/workarounds:** native Supabase uses AsyncStorage and processLock;
  it is not SecureStore-backed encrypted token storage. Account-scoped providers
  deliberately remount caches/screens. Fixed navigator guards retain legacy code
  but are not a server authorization boundary. Membership uses insert/delete plus
  read-back, accepting extra calls to avoid false success or rewritten timestamps.
- **Testing automation:** logic/API suites are reproducible commands, but browser
  fault injection is recorded as tool/manual steps, not a committed end-to-end
  runner. iPhone evidence is owner-reported. Manual acceptance must be repeated
  when the affected flow changes; green lint cannot substitute for it.
- **Legacy implementation:** the unused generic adapter's eq method discards its
  filter; team creation is not transactional; avatar/Storage behavior and notification
  settings are unfinished. Existing any casts/debug logs remain in legacy areas.
  Do not reactivate these routes without their own contracts/tests.
- **Product/release decisions:** age policy, real consent content/URLs, password
  recovery, branding (BBallUY/StreetHoops), remote image provenance, catalog expansion,
  possible duplicate Parque Rodo entries, member visibility and team eligibility
  are unresolved or deferred. Games/chat/ratings/push/OAuth are not delivered.
- **Documentation drift:** architecture/product/development still described old
  SDK54, simulated notifications and the old onboarding loop as current. This audit
  updates the current summaries while retaining dated verification history.

## Repository inventory and proposed commits

Before audit documentation edits: feature/init at 5027fe0; 57 tracked modified
paths and 41 untracked files, no staged changes. The cached origin/feature/init
ref matches HEAD (0 ahead/0 behind); no fetch was performed, so remote freshness
is unknown. The implementation is in the working tree, not captured by HEAD.
Some status entries may be line-ending-only; diff hunks determine semantic changes.

The untracked files include required auth/court modules, tests, the permission
migration and isolated CLI manifests. Omitting them would produce an incomplete
checkout. .env, node_modules, .harness and .playwright-mcp are ignored/untracked by
Git. A limited pattern scan of source/docs/tests/local backend found no literal
secret-key/JWT candidates; this is not a complete secret or Git-history audit.

Proposed dependency-ordered grouping (no staging or commits performed):

1. **chore: align Expo SDK 57 and local development tooling** - package/lockfile,
   app config, AppText plus its import replacements, React lint/API compatibility,
   Metro exclusion, isolated CLI manifests, LAN launcher/test, ADR 0006. Split
   mixed package/script/layout hunks; do not include incomplete auth imports here.
2. **feat: secure local accounts and court membership data** - local permission
   migration/contract tests, typed backend/session configuration, lib/auth and
   lib/courts helpers, auth/account/notification contexts, auth screens/gate,
   session/permission/regression tests, hooks/profile isolation, local-backend
   wrapper imports and corresponding ADRs. Keep cross-dependent API helpers and
   sessions tests together; the wrapper imports them when any command starts.
3. **feat: deliver court discovery and community membership UI** - catalog and
   membership hooks/screens/components, My Courts, native/web map, profile/menu/
   SignOutButton and root/tab guards, ADRs 0008/0009 and relevant tests. The public
   onboarding issues are still open; do not label this commit a fully closed MVP.
4. **docs: reconcile SPEC-001 acceptance and remaining findings** - current README,
   product/architecture/development summaries, spec/plan/evidence/task state,
   this audit, key migration runbook and ignore/documentation changes. After C01-C03
   are resolved, record their fix/test evidence in a separate reviewable commit.

These are proposed semantic groups, not prevalidated intermediate trees. Shared
files such as package.json, app.json, app/_layout.tsx, scripts/local-backend.mjs
and hooks/profile.ts require hunk staging. Run verify and relevant tests after
each assembled group, and verify the final clean checkout includes untracked
sources. Do not split by filename alone or rewrite history/reset the working tree.
No push, publication, tag or merge is authorized by this grouping proposal.

## Checks for this review

Fresh: verify passed initially; test:client 46/46; test:harness 11/11;
verify:edge failed because Deno is unavailable. No Edge or harness source changed.
The 42 local session and 111 authorization assertions and three-court check are
retained from the preceding same-day run, not claimed as rerun here. Browser/device
acceptance is the dated evidence in verification.md, not a new audit observation.
Final documentation/static checks are recorded in the audit entry in verification.md.

Next action remains inside SPEC-001: resolve C01/C02, collect C03 evidence and
rerun affected acceptance before restoring verified. Close the core findings before starting future feature work.
