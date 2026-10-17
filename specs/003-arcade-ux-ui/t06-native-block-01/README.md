# T06 block 01 — guided physical acceptance

Owner authorized only N01–N05 on 2026-10-16. T06 is in_progress; SPEC-003 stays open.
Preparation and guidance are executed; **N02 expansion/contraction correction is owner-confirmed physical PASS; N01/N03/N04 corrections await retest; N05 remains NOT RUN** until
owner confirmation. No functional code, dependencies, backend or production data
changes are authorized. The owner now requests preparation of N06–N11; see [block02](../t06-native-block-02/README.md). N12–N17 remain outside current scope.

## Environment

- Device: iPhone 16 Pro; iOS 26.6.1 and Expo Go 57.0.0, owner-reported on 2026-10-16 (not independently inspected).
- Owner-reported settings: normal text size; VoiceOver off; Reduce Motion off.
- Device locale/timezone: pending. Accounts A/B availability and matching local runtime remain unconfirmed.
- Code: SPEC-003/design; exact dirty application fingerprint and per-file hashes in
  [revision snapshot](revision.json). Base commit alone is insufficient.
- Local workspace/CLI revision recorded; matching running Metro/device bundle not
  yet confirmed. Do not claim the phone tested this revision before reload/confirmation.
- Backend: intended bballuy-local via existing local-device launcher; current phone
  endpoint/connectivity must be confirmed before writes. If hosted/unknown, BLOCKED.
- Accounts: aliases A/B only, availability pending. No credentials/identities stored.
- Network, execution timestamps and screenshot references: pending per test run.

## Cases and evidence separation

- [N01](N01/record.md): initial List, shared search and mode/context.
- [N02](N02/record.md): marker selection, sheet, close/expand/detail.
- [N03](N03/record.md): denied/granted location and exploration.
- [N04](N04/record.md): save/remove/re-add, pending/error recovery.
- [N05](N05/record.md): sign out, A/B isolation and recovery.

N01 core journey approved with camera retest pending; N02 gesture correction PASS; N03/N04 observed issues pending retest; N05 NOT RUN. Earlier browser transport simulations remain in their original
T05 evidence and are not copied as physical passes. Redact images before storing;
never store credentials, tokens, private emails or precise device location.
For replies use: case/subcase; PASS/FAIL/BLOCKED; expected vs observed; redacted
capture if useful. NOT RUN means no attempt yet. An unavailable account, network,
permission control or matching build is a blocker, not a failure or pass.

## Current verification of preparation

npm run verify: PASS (110 Markdown files, application typecheck and lint), recorded
in the T06 verification entry. This checks documentation/types/lint only. No simulator/browser checks
are run as substitutes for this physical block. Owner-reported defects and correction scope are in [correction report](../t06-block01-corrections.md). N02 expansion/contraction gesture correction is physical PASS by owner report; other subchecks remain separate.
