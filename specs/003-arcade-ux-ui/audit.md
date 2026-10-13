# SPEC-003 - Frontend audit and inventory

Code/documentation inspection on 2026-10-13, not new live visual/device acceptance.
Existing uncommitted SPEC-002 work must be preserved. Registry/harness reports
SPEC-001 verified and SPEC-002 in progress, final T06 pending. SPEC-003 was absent
from registry/folders; future references were not an existing specification.

## Findings

- constants/colors.ts uses blue primary/orange secondary; pickup/Kit.tsx uses
  orange/darker panels. Consolidate semantic presentation tokens.
- app/(tabs)/map.tsx places a 280-high native map and mapped cards in a ScrollView.
  Standard markers open details directly; no mode switch or preview sheet exists.
- CourtMap.tsx preserves explicit in-memory location; .web.tsx provides list explanation.
  List/markers use the same name-filtered catalog.
- Detail shows name, coordinates, half-court/surface/lighting/notes, CourtActivity,
  CourtMembership and organize-here access. Preserve recorded values and unknown labels.
- My Courts is membership-based; no independent save/favorite function exists.
- Profile exposes display name, My Courts and logout, not editing/statistics/uploads.
- AppText/root loader retain Lexend Regular/Medium/SemiBold/Bold; no display font loaded.
- Catalog query has no photo field. No local court-specific photo assets identified.
  Legacy onboarding remote images are not verified photographs of catalog courts.
- Play has sports panels and reusable controls; recovery/confirmation states exist.
- Accessibility labels exist; modal focus, scaling, contrast and reduced-motion
  performance need visual design and runtime testing.
- Architecture describes three tabs but code has Courts/My Courts/Play/Profile;
  README and some narratives retain old task references. Prefer latest tasks/evidence
  and inspected code. Do not rewrite unrelated historical documents in this step.

## Reusable foundation

Retain AppText/font loader, GameButton/GamePanel/GameField/GameChoice/GameNotice,
CourtMembership/CourtActivity, SessionCard, ParticipationControls, MatchPlayerSlot,
HeaderMenu, SignOutButton and AuthGate. Preserve accessibility props/confirmations.
Retain catalog/membership/location/auth/pickup/participation/organizer/match hooks and
libraries, account-remounted query provider and route guards. Generic components/ui
need individual review; legacy team/avatar/notification source is not automatically
suitable or authorized to expose.

## Redesign inventory

Primary: app/(tabs)/map.tsx; components/courts/CourtMap.tsx and .web.tsx;
new presentation-only CourtCard, CourtMedia, CourtPreviewSheet and shared states;
app/court/[id].tsx; app/(tabs)/my-courts.tsx and profile.tsx; tab/root layouts.

Play coherence: app/(tabs)/play.tsx and components/pickup; app/pickup/[id].tsx and
mine.tsx; app/organize/create.tsx, quick.tsx and [id].tsx; app/matches/create.tsx,
mine.tsx and [id].tsx. Cover discovery/filtering, invitation registration,
Now/Plan ahead, organizer lifecycle, guests/accounts, declared scores and history.

Supporting: splash/loading, welcome/onboarding, age/consent, signin/signup, profile
setup, AuthGate, missing-route and shared loading/empty/error states. Styling only;
preserve validated copy meaning, routing, validation and recovery.
Teams/team creation/player details/notification settings/avatar uploads remain excluded.

## Architecture constraints

ADRs 0006/0008 retain SDK 57 and native-map/web-list separation; 0007/0009 retain
account isolation/confirmed membership. ADRs 0010-0015 retain pickup priority,
atomic command contract, request recovery, reported activity, participation and
score revision/history. Backend, RLS and contracts need no changes for this redesign.
