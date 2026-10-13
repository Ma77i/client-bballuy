# Product and MVP scope

Updated 2026-10-09. The local MVP is implemented and its
[C01-C03 findings](../specs/001-core-journey/closure-review.md) are resolved.

## Purpose

The owner confirmed players seeking to join as the initial audience and placed
the next product MVP before iOS beta on 2026-10-12. The next priority is
[SPEC-002](../specs/002-player-pickup/spec.md), ready for implementation after
T00 planning closure. It includes invitations and organizer-declared final match
results; T01's local contract and T02 browser organizer UI are verified; T03 public
discovery is next. See
[ADR 0010](decisions/0010-player-first-next-mvp.md). Broader ideas in
[the product vision discussion](product-vision.md) remain proposals. SPEC-001
remains the accepted local scope. iOS beta is future work without a registered
specification; define it later against the completed product.

BBallUY helps people discover basketball courts and become part of their communities. The commercial name remains undecided; some existing screens still use StreetHoops.

## Current MVP direction

Sign up or sign in, view real courts, join a court community and return to My Courts with a persistent session. The user clarified that membership does not require a team and does not mean being physically present at the court.

Membership remains until the user leaves. No scheduled attendance, automatic expiry or match registration is implied. Multiple court memberships are proposed as the initial default.

The current requirements are in [SPEC-001](../specs/001-core-journey/spec.md). [ADR 0002](decisions/0002-court-first-mvp.md) records the map recommendation and alternatives. The previous team-first objective has been deferred; keep its existing code and historical evidence.

## MVP experience

- Email/password authentication and a minimal display name.
- Court map and equivalent list.
- Court details with verified location and available attributes.
- Join/leave and My Courts.
- Restored session after reopening, account isolation and clear failures/retries.

Validated interaction target: the owner's iPhone with Expo Go SDK 57, using Apple
Maps through react-native-maps 1.27.2. The local catalog preserves the three
owner-supplied court records. Web supports list/search/details. Android acceptance,
expansion to 10-20 courts and a full web map are not delivered. Source-coordinate
preservation is verified; the owner confirmed all three real-world positions on
2026-10-09. No independent field survey is claimed.

## Deferred features

Teams and their eligibility rules, chat, ratings, games, check-ins, planned attendance, push, OAuth, user-created courts and embedded navigation.

Whether team membership should require belonging to its court, or remain independent, is explicitly undecided. Do not encode either future rule now.

## Permissions

Users manage their own profile and court memberships. Joining grants no administrative privileges. The curated court catalog is not writable by regular users. Protect global roles independently of community membership.

## Open decisions

The development backend is unlinked local Supabase and iPhone is the confirmed
validation platform. Public member counts/rosters, catalog expansion and hosted
email configuration remain undecided. Age policy, consent content and public
URLs remain release work. The preview explicitly labels its development notices
and stores acknowledgements with a distinct version; this is not legal validation.
Misleading onboarding and consent claims were corrected within SPEC-001.
