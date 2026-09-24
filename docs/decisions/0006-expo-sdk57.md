# ADR 0006: Expo SDK 57 for physical iPhone validation

Status: accepted by the owner on September 22, 2026.

## Context and decision

The available iPhone runs Expo Go 57.0.9 / SDK 57. Upgrade the app from SDK 54
instead of arranging a separately signed SDK 54 client. Retain Expo Router and
the existing source structure. Align native packages to Expo's SDK 57 matrix;
review SDK 55/56/57 breaking changes. No force/legacy peer-resolution flags,
remote migration, EAS build, update publication or deployment are authorized.

Use public Text props through AppText to preserve the existing font without
mutating React Native internals. Update obsolete style/symbol APIs and component
patterns identified by the new React lint rules; keep those rules enabled.

Isolate Supabase CLI 2.99.0 in local-backend/tools with its own npm lockfile. Its
terminal UI needs a different React version than Expo. This is developer tooling,
not mobile code; forcing either runtime to an incompatible React version is not
appropriate. The root SDK integration tests still use the app's Supabase client.

Provide a LAN launcher restricted to a private IPv4 assigned to this PC. Read
only the local public key, set the local API URL in the process environment and
skip dotenv. Do not change the user's .env, firewall rules or hosted database.
Expo Go/CLI login uses the same owner-controlled Expo account.

## Verification boundaries

Dependency checks, regression tests and iOS/web bundle generation establish
upgrade readiness. T04 remains in progress until observed iPhone lifecycle tests
are recorded. No native binary compilation on Windows or App Store certification
is implied. Map provider selection from ADR 0002 still needs SDK 57 validation.

## Sources

- [Upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
- [SDK 55 changes](https://expo.dev/changelog/sdk-55)
- [SDK 56 changes](https://expo.dev/changelog/sdk-56)
- [SDK 57 changes](https://expo.dev/changelog/sdk-57)
- [Expo Go 57 login](https://expo.dev/changelog/expo-go-57-login)
