# SPEC-001 — Account, courts and community membership

Execution state: [registry](../registry.json). Revised on 2026-09-19 following the user's clarification: joining a court means belonging to its community, without needing a team.

## Revision history

This revision replaces the proposed team-creation journey. R08/R09, tasks T06/T07 and scenarios A08/A09 now cover court discovery and court membership. None of the replaced functional requirements had been verified. Preserve T00 completion, T01 work in progress and all dated evidence; earlier results do not demonstrate the new requirements.

## Problem

The map is a placeholder and there is no verified flow from account creation to discovering a real court and joining its community. The MVP needs a small useful journey with reliable authentication, real data and enforceable permissions.

## Goal

A person signs up or signs in, discovers real courts, joins a court community and can find their courts again after reopening the app.

## Scope

Email/password authentication, minimal profile, persistent session, map/list discovery, court details, joining/leaving and My Courts. Membership represents an ongoing community relationship, not attendance or a reservation. No team is required.

Proposed first validation target: Android. Proposed initial catalog: 10–20 verified courts in Montevideo. These platform/catalog details remain recommendations to confirm.

## Out of scope

Teams, team-to-court eligibility rules, scheduled attendance, automatic membership expiry, games, chat, ratings, push, OAuth, court submissions and embedded route navigation. A full web map is a separate decision.

## Requirements

### R01 — Verifiable client baseline

Documentation and commands are reproducible. Client types and lint pass without errors; warnings are fixed or justified. Deno functions have separate checks. Do not hide known errors.

Use the local Expo CLI through npm start or npx expo start rather than global expo-cli. React Native supplies its own types. Stay within SDK 54 during stabilization and distinguish the installed compatibility catalog from remotely checked recommendations.

T01 stabilization boundaries: court search consumers use the existing id/name result contract without inventing an address or changing backend queries. Retain the collapsible component using the existing app palette and React Native primitives, with its initially closed/toggle behavior. Use the installed profanity filter's supported export and preserve detection/cleaning behavior with local regression tests. Resolve hook dependency and unused-code warnings without suppressing checks. Notification storage/account isolation and onboarding routing remain assigned to later tasks.

### R02 — Reproducible court data contract

Reconcile profiles, courts and court memberships across migrations, generated types and queries. Inspect the actual development schema before assuming local SQL or JSON is authoritative. Document and verify a disposable database setup. Seed verified court locations with source/provenance; do not present sample locations as real local courts.

Preserve all three owner-supplied court records and their identifiers. Keep raw
lighting/surface values until a separate normalization decision; use a
security-invoker catalog view to expose latitude/longitude without changing
geography storage. Profile/court reads and types must use inspected fields and
nullability. Do not invent bio, address or win statistics when their columns are
absent. Physical court verification remains part of map/catalog acceptance.

### R03 — Protected privileges and ownership

A user can edit allowed profile fields and their own court memberships, but cannot elevate their global role, alter another user's membership or modify the curated court catalog. Enforce permissions at the database/API boundary and demonstrate denied operations through direct requests.

### R04 — Coherent registration and login

Create an account once with valid credentials. When email confirmation is required, explain the pending step without entering a session-only route. Invalid credentials allow a clear retry. Test the verification return for the chosen platform and auth configuration.

### R05 — Minimal profile and completed onboarding

Store a valid display name and enter court discovery without looping through registration or consent again. An authenticated user with an incomplete profile reaches the unfinished step. No avatar or team is required.

### R06 — Persistent session

A valid session survives a full app restart and refreshes when appropriate. Revoked sessions or failed refreshes return to login without loops. Logout clears authentication consistently and reports relevant errors.

### R07 — Account isolation

Switching from A to B never shows A's personal profile, My Courts or personal notifications as B's data, including initial cached renders. Queries and local storage are scoped to the authenticated user. This does not prohibit intentionally public community information.

### R08 — Real court discovery

Show the same real catalog in a map and list. Selecting a court opens its details with verified name/location and available attributes. Location permission denial still allows manual browsing and the list. Provide usable loading, empty and error states. Restrict results to the initial catalog/area; do not claim national completeness.

Use a native map provider after the integration check in [ADR 0002](../../docs/decisions/0002-court-first-mvp.md). The library/provider choice remains a recommendation until tested; the user has not selected a provider yet.

### R09 — Persistent court community membership

An authenticated user can join a court, see it in My Courts, leave and join again. Membership persists across app restarts until the user leaves. Repeated taps and network retries cannot create duplicate memberships for the same user/court.

Two users can belong to the same court without a team. No scheduling, check-in, automatic expiry, capacity reservation or physical-presence claim is implied. Proposed default: a user may join multiple courts independently. The app must not impose future team eligibility rules in this MVP.

Show the current user's membership state. A community member count or roster is optional until visibility is decided; never label membership counts as people currently playing.

### R10 — Honest and recoverable experience

Network failures during profile updates or membership changes show an error and retry rather than false success. Reconcile optimistic changes after failures. Remove simulated notifications and fixed fake invitations from the MVP experience. Clearly identify or hide unfinished controls.

## Acceptance

Execute A01–A10 in [verification.md](verification.md) with two test accounts and a real device/development build. Keep evidence linked from [tasks.json](tasks.json). Static checks alone do not verify the journey.

## Remaining decisions

Confirm first platform, initial geographic area and curated data source, email-confirmation configuration, development Supabase environment and visibility of other court members. Multiple court membership is the proposed default. Future team eligibility is deliberately undecided.

Shared stabilization and non-dependent preparation can continue while these decisions are open.
