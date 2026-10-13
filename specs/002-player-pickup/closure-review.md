# SPEC-002 local acceptance review - 2026-10-13

T06 closes the local specification, not the MVP. SPEC-003 remains draft; no
continuation, hosted migration, beta or release is authorized by this review.

## Acceptance coverage

- A01: confirmed pilot courts, audience, formats, capacity and lifecycle are in
  spec.md and ADR 0010. All three catalog records remain preserved.
- A02: T03 browser and database evidence proves authenticated discovery, safe
  rosters, reported activity, foreground refresh and recoverable failures.
  The owner confirmed on iPhone that start/close updates court activity.
- A03: T02 browser and server evidence covers immediate/future creation,
  owner-only lifecycle, validation, cancellation and locked core edits. The
  owner confirmed both timing paths and keyboard/save behavior on iPhone.
- A04: T04 browser/server evidence covers join/leave/rejoin, idempotent retries,
  capacity races and start restrictions. The owner confirmed participation on
  a second account and recovery after disabling Wi-Fi/mobile data.
- A05: T04 evidence covers account isolation and personal-session persistence.
  The owner confirmed account separation and closing/reopening Expo Go retains
  personal sessions. This is owner-reported device evidence, not agent observation.
- A06: local anonymous/two-account contract suites pass and preserve original
  courts. Hosted schema parity remains unverified.
- A07: dated functional browser evidence is in verification.md; native evidence
  is recorded below. Player attendance, pilot usefulness and retention remain
  unmeasured; no usage success is inferred from functional acceptance.
- A08: T05 browser/server evidence covers standalone/linked matches, guests,
  declared final scores, owner-only corrections and retained revision history.
  The owner confirmed a guest 1v1, saving 11-9 and correcting to 12-9 on iPhone.

## Final fixes and reproducible checks

Environment: Windows, local Supabase/PostgreSQL, Expo SDK 57, Metro port 8090,
mobile-sized browser and owner iPhone/Expo Go on the same Wi-Fi. Device model,
iOS version and Expo Go version were not supplied. Native screenshot evidence
is not claimed. Earlier browser journeys and commands remain in verification.md.

Organizer request loading now retains in-flight state; refocusing reads current
busy state. tests/pickup-organizer.test.cjs exercises loading during a delayed
RPC without erasing or duplicating its persisted request.

Profile now offers separately configured problem reporting. Drafts contain
manual reproduction prompts and no automatic account attachments. Missing
configuration hides the entry; failed handoff offers retry and selectable
contact. The local launcher reads an ignored private configuration, never logs
its value, and allows an explicit environment override.

Browser reproduction: open Profile with a synthetic account; temporarily make
window.open throw; press Report a problem; verify failure notice and retry.
Replace window.open with a capture stub and retry; verify a mailto draft with
manual prompts and no account fields, and restored Report a problem control.
Restore window.open and sign out. Both paths passed without sending email.
This found and fixed an unbound Linking.openURL call by preserving its receiver.

The owner confirmed the iPhone failure notice and retry before that final
receiver fix. A successful native email composer has not been observed; the
final successful handoff was verified with a browser stub and helper tests.
The fallback remains usable. No email was sent by the agent.

Final commands: npm run test:client (94 passed), npm run test:harness (11 passed),
npm run verify (docs, TypeScript and lint passed), npm run db:local:permissions
(111 passed), npm run db:local:sessions (42 passed), npm run db:local:pickup
(197 passed), npm run db:local:verify (original courts and core contract passed).
Session-suite adapters are in-memory; owner device checks supply native evidence.
No Edge Function changed. iOS manifest and updated native bundle returned HTTP
200, as did LAN backend health; served bundles alone are not device acceptance.

Generated fixtures were removed by scoped cleanup. The final browser account
had no sessions or matches; exact ID and test-email namespace guards preceded
profile/Auth deletion. An initial cleanup used the wrong profile table and
rolled back; the corrected users_public cleanup succeeded. Existing data and
the requested preview remain available. No blanket storage clearing occurred.

All T06 local functional acceptance criteria have evidence. Stop here until
the owner explicitly requests continuation and SPEC-003 is ready.
