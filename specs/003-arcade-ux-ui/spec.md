# SPEC-003 - BBallUY Arcade UX/UI Redesign

Execution state: [registry](../registry.json). Owner-approved planning scope dated
2026-10-13. T01 design is approved; T02 foundations are implemented and locally verified.
SPEC-003 is in_progress. Owner closed T03 and T04 and authorized T05 on 2026-10-14;
T05 is implemented/local checks ready, in_progress for review. T06 remains todo and
has not started. Physical native limits remain explicit in each task's evidence.
No backend/RLS changes, commits or push.

## Problem and goal

Court and pickup screens use different palettes/components. Court discovery combines
map and list and opens details directly from standard markers. Redesign the existing
MVP with an arcade / street-basketball visual style: orange-led, night blue, original sports
illustrations, sports-game/comic-inspired composition and purposeful microinteractions.
See [audit](audit.md), [Design System](design-system.md) and [plan](plan.md).

## Scope

Presentation and interaction design for existing SPEC-001/002 journeys. Authenticated
Courts starts with a list and switches to native map; basketball markers open a
court-preview bottom sheet with full-detail action. Detail retains confirmed community
join/leave, reported activity and organize-here access. My Courts, Profile, existing
Play/invitation/organizer/match flows and entry/auth screens receive coherent styling.
Preserve Expo structure, accepted copy meaning and first-run/auth routing.

## Out of scope

Functional gamification, rankings, points, rewards, invented statistics/ratings,
favorites, public community counts/rosters, teams, chat, push, reservations, live
scoring, new profile editing/upload features, new filters or court records.
No backend, schema, generated database types, RPC, permissions, grants or RLS changes.
No fictitious activity, player totals, distances, addresses or verified-presence claims.
No hosted operations, dependency upgrades, beta/release, commits or push.

## Delivery gates

Planning and T01 design work may precede SPEC-002 closure. Implementation T02 onward
requires BOTH complete SPEC-002 acceptance and owner approval of the exact T01 design
revision, plus authorization to implement. Complete SPEC-002 means verified registry,
all tasks done and reproducible local/browser/iPhone evidence, not just bundles/static
checks. Record dates, revision and approval scope in verification.md. The 2026-10-13
general direction approval is not T01 visual approval. Design approval and SPEC-002 acceptance are now recorded in t01-closure.md.
Ready status does not authorize implementation. The harness cannot encode cross-specification
dependencies; an available-task label does not waive these gates.

## Requirements

### R01 - UX/UI-only preservation and gates

Preserve SPEC-001/002 contracts, permissions, validations, request UUID/replay,
confirmed readback, account isolation, guarded routes and tests. No optimistic success
or inferred attendance. Check the delivery gates before any implementation.

### R02 - Arcade identity and reusable Design System

Permanent orange identity, night blue, white/contrasting surfaces, original sports
art and expressive controls. Licensed sports display font for headings; Lexend for
content. Define semantic tokens, component variants/states and motion catalog.
Exact values and compositions are proposals requiring T01 review.

Owner clarification (2026-10-13): `bballuy` is the internal project name and the
temporary public brand and logo wordmark until the owner chooses a final app name.
Use lowercase `bballuy` in new design revisions. Arcade and street basketball
describe the visual style, not a product name or a logo suffix. Do not introduce
StreetHoops or another replacement name. Preserve R01 originals as historical
proposals; their naming is superseded by this clarification.

### R03 - List-first discovery and court preview

List is the initial authenticated Courts view. List/map share the existing filtered
catalog. Markers select one court and open one preview sheet; another marker replaces
its content. Include explicit close and full-detail actions. Preserve search, camera
and list position on return. Filtering out selection closes preview. Location denial
retains browsing. Web keeps searchable list/details and mobile-map explanation.

### R04 - Detail, My Courts and Profile

Keep recorded attributes/unknown labels, current-account community state, confirmed
join/leave/retry and reported activity with freshness/errors. Preserve organizing
shortcut. My Courts means communities, not favorites. Profile retains name, My Courts
and recoverable logout without new editing, avatars or statistics.

### R05 - Existing Play journeys

Design discovery/filtering, invitation details/participation, My sessions, Now/Plan
ahead, organizer lifecycle, match registration and declared-score/history flows.
Preserve capacities 2/4/10, explicit start, existing confirmations, guest/account
distinction, revision conflicts and uncertain-request recovery. Community membership
is distinct from registration, and registration is not verified attendance.

### R06 - Original placeholders and verified-photo strategy

Assume no real court photographs available. Original generic ball/hoop/asphalt
illustrations must not depict a specific court or imply unrecorded attributes.
Label generic media honestly. Future photography requires provenance, rights,
correct court-ID mapping, source/date and owner review. Propose local assets/manifest,
not a backend change or upload/gallery feature. Missing/failed images use the same
placeholder. Photos are not a prerequisite for planning or original-placeholder design.

### R07 - Accessible and performant interactions

Catalog behavior, duration, states, interruption, reduced motion, accessibility
and performance criteria for every interaction. Support screen readers, focus,
keyboard, text scaling, safe areas and alternatives to gestures. Distinguish initial
load, refresh, empty, read failure and uncertain writes. Preserve polling rules.
No blocking celebration or continuously animated map markers. Verify Expo SDK 57.

### R08 - Reviewable designs and acceptance evidence

T01 delivers reviewable List, Map, Bottom Sheet, Detail, My Courts and principal Play
flows, with Profile/system/entry-state examples. Include annotations, tokens, original
placeholder direction and motion storyboards. Owner approval of exact revision is
mandatory before implementation. Separate planned tests, historical evidence and
newly observed browser/iPhone results.

## Acceptance

- A01/R01: preserved contracts/tests, no backend/RLS changes or new functional scope;
  both gates and implementation authorization evidenced before T02.
- A02/R02: approved arcade designs, consistent token/component states, measured
  contrast and licensed font/original illustration assets.
  New revisions use `bballuy` for the temporary brand/logo, without Arcade or
  Street Basketball as part of the name; the final commercial name remains open.
- A03/R03: list-first entry, equal filtered data, marker-sheet-detail, close/back,
  selection replacement/removal, context return, location denial and web fallback work.
- A04/R04: community join/leave/retry/restart and A -> B -> A preserve state;
  truthful activity/unknown attributes, organize shortcut and logout retry remain.
- A05/R05: existing Play flows preserve enabled rules, confirmations, guest capacity,
  pending request recovery, lifecycle and score revision/history behavior.
- A06/R06: no unverified court photograph; labelled generic original placeholder
  and failure fallback; future provenance/ID/rights strategy reviewed.
- A07/R07: reduced motion, screen-reader focus, enlarged text, keyboard, narrow screens,
  safe areas, interruptions and documented performance criteria verified.
- A08/R08: owner approval identifies exact T01 revision; eventual closure includes
  reproducible browser/iPhone evidence, not only static success.

## Current design baseline and remaining technical validation

Spanish initial UI; R02 direction plus R02.1 patches/sequences approved and T01 done.
See [closure](t01-closure.md) for exact scope and five consistency checks.
Routine T02 work validates display-font files/license provenance, optimized original
assets and shared primitive compatibility; full native focus/text/motion tests remain
T03/T06. No new product decision or implementation permission is inferred.
See [T02 scope](t02-scope.md), awaiting explicit authorization.

## References

[Tasks](tasks.json), [verification](verification.md),
[SPEC-001](../001-core-journey/spec.md), [SPEC-002](../002-player-pickup/spec.md),
[workflow](../../docs/workflow.md), [architecture](../../docs/architecture.md).


## T01 design authorization - 2026-10-13

The owner authorized T01 design and visual presentation only, with Spanish UI.
Reviewable compositions prioritize List, Map, Preview sheet and Detail and cover
the existing SPEC-002 Play journey. No application components, functional code,
commits or push. R01 approval and separate implementation authorization remain
mandatory before T02. This supersedes the historical documentation-only boundary.

## T01 R02 visual refinement - 2026-10-13

Owner authorized three separate R02 visual boards: Courts, Play and Organize,
plus an annotated motion storyboard. Preserve R01 originals for comparison.
Courts requires a smaller hero and denser truthful list; Play emphasizes existing
1v1/2v2/5v5 formats; Organize uses visual court/format/timing controls without
changing the existing Now/Plan branches or validation. Navy predominates, cream
information panels and orange actions. Design-only; T01 stays in_progress until
explicit final revision approval. No code/backend/RLS/commit/push authorization.


## T01 R02.1 targeted review authorization - 2026-10-13

Owner approved the general R02 artistic direction, not final T01 acceptance.
R02.1 is design-only and separate: compact/accessible preview sheet; accurate
full/started/cancelled registration eligibility; future illustrative scheduling and
existing participant rules; three 3-4-frame visual sequences (marker/sheet, format,
pending/server-confirmed registration). Preserve all other R02 direction and files.
No implementation, commits/push or T01 closure authorized. Final approval pending.

## T02 foundation authorization - 2026-10-13

Owner explicitly authorized t02-scope.md: tokens, fonts/license validation, original
optimized local assets/fallback, reusable accessible primitives and decorative
motion/reduced-motion utilities. Preserve architecture/APIs and all SPEC-001/002
contracts. No screen/navigation/map/sheet integration, backend/RLS/new features,
commits/push or T03 continuation. Add meaningful primitive/recovery-regression checks
and reproducible foundation preview evidence; native acceptance remains separate.

## R03 design-only fidelity review — 2026-10-14

The owner requested a new [R03 review package](design-r03/README.md) after reporting
native visual divergence. R03 is proposed, not approved or implementation-ready.
Current authorization is design/documentation only; do not continue UI implementation
or final verification from earlier T05 authorization. T00–T04 completed history is
preserved; T05 stays in_progress and T06 todo. No registry state/numbering changed.
The [proposed refinement sequence](design-r03/task-proposal.md) requires approval
before insertion/renumbering. Once approved, frozen R03 boards/specifications become
the visual baseline; until then R02/R02.1 remain historical approved references.
Actual iPhone comparison, text settings, safe insets and native acceptance remain
pending. No backend/RLS, contracts, app source, commits or push in this review.
