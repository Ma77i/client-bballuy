# T04 final UX refinement — 2026-10-14

Superseded location behavior: owner subsequently requested explicit centering and
marker selection. See [targeted map handoff](t04-map-target.md) for current behavior
and evidence; the context-only location checks below are historical.

Owner approved the existing visual direction and requested targeted copy/action
refinements, not architecture or business changes. Owner subsequently chose returning
to the existing Courts map with preserved context. T04 remains in_progress for native
acceptance; the location decision is resolved. T05 has not started.

## Implemented changes

- MembershipPanel: My Courts language for confirmed, pending, read failure and
  uncertain write states. Add/remove and retries use labelled secondary buttons.
  Existing server-confirmed callback priority and same-intent retries are unchanged.
- Detail: orange Organizar convocatoria precedes the My Courts panel and is never
  gated by membership. Its original route and court ID remain unchanged. Native
  headerBackTitle is Volver; Expo Router retains the back handler (web accessible
  name is Volver, back). No custom navigation implementation.
- My Courts: natural introduction and empty-state copy, preserving all read,
  refresh, error/retry and actual name/ID-only cards.
- Reported activity: opt-in arcade gap reduced from 16 to 8, heading 26/30,
  timestamp and refresh status retained without the long polling explanation.
  Polling itself and the warning that reported games do not prove occupancy remain.
- Browser selectors and the device review checklist reflect the new labels.

No map, marker, Bottom Sheet, T03 behavior, Profile logic, Play/organizer flows,
membership hook/model/contract, backend/RLS, dependency or asset was changed.

## Executed evidence

Windows/PowerShell; existing local Expo app on port 8090 and isolated Docker backend
on port 55431. Synthetic identities only; actual court catalog and confirmed
membership writes/readbacks. Browser scripts execute through Playwright, sequentially:

1. tests/browser/t04-setup.js: create two local QA accounts and sign in.
2. t04-community.js: 14 checks pass: add/remove/re-add, real readback, unchanged
   court ID, My Courts navigation, write/readback uncertainty, same-intent retry,
   retained original joined_at, personal read error and retry.
3. t04-profile.js: 9 pass: logout failure/retry, A -> B -> A isolation and support
   draft failure/retry. Composer is stubbed; no email is sent.
4. t04-reads.js: 9 pass: catalog/membership/activity error and retry, truthful
   unknown attribute, occupancy caveat and organizer court-ID/back navigation.
5. t04-accessibility.js: 8 pass: held requests block duplicate activation, pending
   membership cannot claim confirmation, reduced press motion, 320px reflow.
6. Additional 390x844 DOM inspection confirms organizer before removal, orange
   rgb(255,138,67) versus secondary navy rgb(23,31,48), both minHeight 48px,
   and Agregada a Mis canchas only after confirmation.

Total: 40 scripted checks plus the action-hierarchy inspection. verify passes docs,
application typecheck and lint; test:client passes 105/105, zero skipped. Initial
browser navigation rendered blank until reload; setup then passed. The first
community run failed on its old Go back selector; updated to the actual localized
accessible name and reran successfully. These were not claimed as passing runs.

After tests, signed out, cleared private fixture storage and deleted only the two
newly created identities using exact UUID/email guards against the local Docker
container. Zero owned fixtures remain. Three-court catalog fingerprint before/after:
6b603bd412dbb79c3ac6a6070eeb1d9e. No reset, migration or remote write.

Actual web captures, not iPhone captures:
[Detail](t04-evidence/refinement/detail.png),
[My Courts](t04-evidence/refinement/my-courts.png).
Prior captures are preserved for comparison.

## Location decision and follow-up verification

Owner explicitly selected the existing map with context preserved. Detail now has
a secondary Ver ubicación en el mapa action using Expo Router dismissTo('/map').
It returns to the existing destination (or replaces direct-entry Detail when absent),
without forcing List/Map, centering, changing selection or integrating a service.
The caption explains that Courts offers List/Map; actual coordinates remain smaller
secondary information. Organize remains the sole principal orange CTA.

tests/browser/t04-location.js executed after fresh local t04-setup.js: 7/7 pass,
covering real coordinates, retained search/list/results, retained map mode/search,
and direct-detail fallback. Browser map mode uses the existing web fallback and does
not prove physical native camera retention. Initial automation sampled pre-hydration
controls; corrected by waiting for network idle and typing through keyboard events.
Those unsuccessful runs were not recorded as passing checks. Installed Expo Router
implementation was inspected; dismissTo uses its existing POP_TO navigation action.

verify and test:client rerun successfully (105/105, no skips). Two fresh QA identities
were signed out/removed with exact local UUID/email guards; zero owned fixtures remain,
and the same original catalog fingerprint above is unchanged. No remote write/reset.
[Updated detail location capture](t04-evidence/refinement/location.png) is actual web,
not a physical iPhone capture. Earlier 40 regression checks remain dated evidence
for unchanged membership/account behavior, not newly rerun in this location follow-up.

## Native limits

Physical iPhone VoiceOver, Dynamic Type, safe areas, app restart/background and
actual mail composer remain unobserved; see t04-iphone-review.md. Prior iOS export
is compilation evidence for the earlier T04 implementation, not execution of this
refinement. No complete native acceptance or T04 closure is claimed.
No commit/push; stop before T05.
