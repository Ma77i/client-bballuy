# ADR 0008: SDK 57 court map candidate

Date: 2026-09-23
Status: Accepted for local iPhone use after owner device tests on 2026-09-23

## Decision

Integrate react-native-maps 1.27.2, the version recommended by the installed Expo
57.0.24 module catalog. Use the default Apple Maps provider on iOS. Android uses
the library default Google provider, but a standalone Android binary and its
restricted key/billing setup are outside this local iPhone validation. No cloud
map credentials or billing changes are introduced.

Expo's SDK 57 documentation confirms Expo Go inclusion and no extra setup for
that test environment: [Expo map documentation](https://docs.expo.dev/versions/v57.0.0/sdk/map-view/).
This confirms the supported integration path, not observed behavior on this device.
The owner subsequently verified native rendering, taps and location denial; see
[acceptance evidence](../../specs/001-core-journey/verification.md).

## Data and platform boundary

Supabase court_catalog remains the source for names, coordinates and recorded
attributes. Validate rows before rendering; the same name-filtered array supplies
list and native markers. Do not add courts or infer attendance, ratings, distance
or missing attributes. The initial scope is the existing three-court catalog.

Web resolves a separate component with list/search/details, without importing the
native map module or loading third-party tiles. A full web map is deferred as in
ADR 0002. The native map uses the catalog bounds initially and optional foreground
location only after the user taps Use my location. Location is not persisted or
sent to Supabase. Denial/error retains manual browsing. Native map services may
use network access to render their basemap; an offline basemap is not promised.

## Limits

Local type checks, SDK checks and bundles do not certify native rendering. T06 has owner-reported iPhone acceptance recorded in the specification. Web search/details and pure location
failure logic have separate evidence. Membership buttons and My Courts UI remain
T07, and no hosted database schema is assumed to match local migrations.
