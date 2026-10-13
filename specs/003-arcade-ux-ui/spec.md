# SPEC-003 - BBallUY Arcade UX/UI Redesign

Execution state: [registry](../registry.json). Owner-approved planning scope dated
2026-10-13. This remains draft; current authorization includes T01 design and visual presentation only. No application implementation, commits or push.

## Problem and goal

Court and pickup screens use different palettes/components. Court discovery combines
map and list and opens details directly from standard markers. Redesign the existing
MVP as BBallUY Arcade / Street Basketball: orange-led, night blue, original sports
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
general direction approval is not T01 visual approval. Keep this draft until dependent
decisions and approvals are resolved. The harness cannot encode cross-specification
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

## Pending decisions

Spanish is the confirmed initial UI language. Annotated static R01 compositions are
the authorized T01 review format; no implementation is authorized. Pending:
display font selection/bundled license provenance, illustration approval, exact
tokens and compositions. Optional owner brand assets; no photos required.
Bottom-sheet technical choice follows approved designs; prefer existing primitives
before considering another SDK-compatible dependency. Scope/direction already approved.

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
