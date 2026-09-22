# ADR 0002 — Court-first MVP and map integration

Status: court-community semantics confirmed by the user; map choice proposed pending integration validation. Date: 2026-09-19. No map dependency, cloud project or billing configuration has been changed.

## Context

The user proposed sign-up, sign-in, court discovery and joining a court, then clarified that joining means belonging to the court's community without requiring a team. Membership is persistent until the user leaves. Attendance and match registration are outside this MVP. Future team eligibility based on court membership is deliberately undecided.

The repository currently uses Expo SDK 54 and React Native 0.81.5. Its map screen is a placeholder with sample courts and notifications. Local schemas contain court coordinates, but the deployed schema has not been inspected. No court attendance or membership implementation was found in the reviewed client/schema files.

## Proposed MVP boundary

1. Email/password registration and login, a minimal display name, persistent session and logout.
2. A map and a list backed by a small curated catalog of real courts in one initial area. Proposed starting point: 10–20 courts in Montevideo, subject to confirmation and verification of the actual locations.
3. Court details: name, location, verified attributes and the current user's membership state. Decide visibility before adding a community count or roster.
4. Join/leave one's own court community and find memberships in My Courts. The relationship persists across restarts until the user leaves, with no schedule or automatic expiry. Proposed default: a user can belong to multiple courts. Membership is not physical presence and grants no administrative role.
5. Loading/error/retry states and discovery without granting location permission, using manual map browsing or the list. No background tracking needed for this proposal.

Defer teams, chat, ratings, match management, OAuth, push and user-submitted courts. Keep existing code while removing unfinished features from the MVP navigation when implementation starts.

## Recommended map approach

Use `react-native-maps`, with Google Maps on Android and the native Apple Maps provider on iOS initially. Expo's SDK 54 documentation lists the library and Expo Go support. Google Maps can also be used on iOS if a consistent provider later becomes a requirement. Store court identities, coordinates and participation in Supabase rather than depending on the map provider's place catalog. [Expo SDK 54 documentation](https://docs.expo.dev/versions/v54.0.0/sdk/map-view/).

This is an engineering recommendation for a simple marker/detail experience, not a measured performance comparison. Before adoption, run a small on-device integration check using the SDK-compatible version; verify markers, taps, permissions, a rebuilt Android binary and representative Uruguayan locations. Do not assume a browser preview validates native maps. A full web map is a separate scope decision.

## Cost and alternatives

- **Google/Apple through react-native-maps:** lowest integration uncertainty for this existing Expo project in our assessment. Google's current price list shows an unlimited free usage cap for the Maps SDK SKU. Places, Routes, web Dynamic Maps and other SKUs have separate prices; this is not a promise that every Maps API is free. Google requires enabled billing and an API key for the Android SDK. Use restricted keys and enable only the APIs actually needed. [Pricing](https://developers.google.com/maps/billing-and-pricing/pricing), [Android billing requirements](https://developers.google.com/maps/documentation/android-sdk/usage-and-billing).
- **MapLibre:** a candidate if provider flexibility becomes a priority. Its Expo integration requires a rebuilt native app and does not run in Expo Go. Select a compatible version and a production tile/style source before estimating cost. [Expo setup](https://maplibre.org/maplibre-react-native/docs/setup/expo/). OpenStreetMap's public tile servers have limited capacity and best-effort availability; do not equate open map data with unlimited hosted infrastructure. [OSMF tile policy](https://operations.osmfoundation.org/policies/tiles/).
- **Mapbox:** consider if the product later needs more extensive cartographic customization. React Native integrations are third-party integrations rather than officially supported native frameworks; validate their compatibility and applicable pricing before adopting. [Mapbox hybrid framework guidance](https://docs.mapbox.com/help/dive-deeper/mobile-apps/).
- **expo-maps:** the SDK 54 documentation labels it alpha, notes breaking changes and requires development builds. Prefer the documented react-native-maps route for this stabilization effort. [Expo Maps SDK 54](https://docs.expo.dev/versions/v54.0.0/sdk/maps/).

Sources reviewed on 2026-09-19. Recheck pricing and native compatibility before enabling services or installing dependencies.

## Acceptance proposal

Two test users can register/login, view the same real court, join/leave without duplicates and reopen with the correct session and My Courts. A user cannot edit another user's membership. Joining requires no team and membership does not expire automatically. Discovery works after location permission is denied. Any community counts must be labeled as membership, not people currently playing.

## Sequence and open decisions

First finish the shared client stabilization work already in progress, then reconcile profiles/courts and permissions, complete authentication, verify the native map integration, connect the curated catalog and implement the chosen participation model. Finish with a two-account device test.

Joining semantics are confirmed. First platform, initial area, court source, multiple-membership default and community visibility still need confirmation. SPEC-001 has been revised consistently while preserving completed setup, ongoing stabilization and prior evidence. Team-specific work is deferred. The recommended provider still needs an on-device integration check before adoption.
