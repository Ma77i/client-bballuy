# Product and MVP scope

Updated 2026-09-19.

## Purpose

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

Proposed initial scope: Android validation and a curated set of 10–20 real courts in Montevideo. Confirm platform, area and source before preparing the catalog. The map recommendation is react-native-maps with Google Maps on Android and Apple Maps on iOS, subject to an integration check.

## Deferred features

Teams and their eligibility rules, chat, ratings, games, check-ins, planned attendance, push, OAuth, user-created courts and embedded navigation.

Whether team membership should require belonging to its court, or remain independent, is explicitly undecided. Do not encode either future rule now.

## Permissions

Users manage their own profile and court memberships. Joining grants no administrative privileges. The curated court catalog is not writable by regular users. Protect global roles independently of community membership.

## Open decisions

First platform, geographic area, court-data provenance, visibility of member counts/rosters, email confirmation and development backend. Age policy, consent content and public URLs also remain provisional; existing text is not a legal validation.
