# Courts/authentication targeted refinement — 2026-10-15

Owner-authorized scope: discovery cards only (cream/orange outline CTA≥48 pt,
name→grouped facts→secondary real activity, no repeated visible illustration
disclosure), existing generic art retained. No map/marker/camera/sheet change.
Generic images remain decorative, with an accessible generic-art explanation.
Use an accessible darker orange ink on cream rather than failing text contrast.

Authentication: integrate show/hide eye in password fields, hidden initially,
preserve values/focus and do not submit;48 pt target and Spanish accessible names.
Keep signup validation, confirmation and consent storage/sync unchanged.

Consent inspection before changes: current /age-gate→/consent→/signup saves two
provisional acknowledgements as dev-preview-1, later bound to the signup email
and synced to the account. There are no approved policy document routes/URLs
in this flow. Replacing them with definitive legal acceptance or moving the
persistence gate into signup changes the product/consent meaning. Owner was asked
for document/link sources; that dependent change waits for clarification. No
invented legal text/link and no consent-contract modification is authorized here.

No new designs, assets, dependencies, backend, Detalle work, commit, push or closure.

## Consent clarification before visual refinement

Owner clarified that the problem is discoverability of the two existing pre-signup
acknowledgements. Keep that step and both meanings; add explicit square checkbox
shapes, orange fill/check when selected and a short tapping instruction. No policy
document routes/links, definitive-policy wording, new validation gate or storage
contract is introduced. Existing booleans, disabled/pending/retry logic and
saveDevelopmentConsent remain intact.

## Accessibility adapter identified before implementation

Browser testing found RN Web checkbox Pressable responds to pointer/Enter but not
standard Space activation. Apply the existing FormatChoices web-keyboard adapter
pattern to the acknowledgement group, toggling the same two booleans only. This
is input accessibility, not a new consent validation/persistence rule. Keep native
press behavior and disabled/pending guards unchanged.

## Implementation and changed files

- components/courts/CourtCard.tsx: illustrated discovery variant only; cream CTA
  with orange ink border/text, minimum48 pt. Name remains26/30, grouped facts14/21,
  real reported activity secondary. Repeated visible generic-art caption removed;
  native accessibilityHint explicitly says generic illustration, not this court's
  photo/exact representation. Current local artwork remains untouched/decorative.
- constants/design.ts: semantic orangeInk #A63B00 (6.09:1 on cream). Bright brand
  orange remains for primary fills/selections; no global token value changed.
- components/foundation/Primitives.tsx: optional passwordVisibility trailing eye in
  Field,48 pt hit width, reserved text padding, dynamic Spanish accessible label/hint,
  keyboard focus outline and input focus restoration. Web pointer-down prevents
  unnecessary focus theft. No defaults or form submission callbacks changed.
- app/(auth)/signin.tsx: integrated eye, standalone visibility button removed.
- app/(auth)/signup.tsx: integrated independent eyes in password/confirmation, both
  hidden initially; validation, signup request and confirmation handling untouched.
- app/(auth)/consent.tsx: recognizable28 pt square checkboxes inside≥48 pt rows,
  orange fill/check, instruction, existing accessible checked/disabled state. Space
  adapter follows FormatChoices pattern; existing booleans/save/retry unchanged.
- tests/presentation.test.cjs: contrast regression for orangeInk on cream.

All previous local changes retained. CourtDiscovery, CourtMap/native/web, camera,
markers, preview/sheet, membership/auth controllers and consent storage/sync were
not changed in this targeted step. No asset, dependency, backend or RLS change.

## Executed verification — 2026-10-15

Windows/PowerShell, SPEC-003/design; actual Expo app at localhost:8091.

- npm run verify: PASS,87 Markdown files; TypeScript and lint pass without warnings.
- npm run test:client: PASS109/109 after final implementation, including existing
  auth/consent isolation/recovery/persistence and court/discovery/motion regressions.
- node --test tests/presentation.test.cjs: PASS7/7, including added orange-ink contrast.
- Running signin: password hidden initially; eye toggles type without losing value
  or input focus (observed true);48 × 52 px hit region; no navigation/submission.
  Hiding restores password input type. Empty form validation still blocks sign-in.
- Running consent: neither/one accepted keeps Continue disabled; both enable it;
  uncheck disables again. Existing Continue save reaches /signup. Rows measured
 108 pt at402 px viewport. Space activation/toggle-back verified after adding the
  accessibility adapter. No new account or backend mutation performed.
- Running signup: independent primary/confirmation eyes retain both test values;
  toggling one leaves the other hidden. Values cleared after test. Empty-name
  validation blocks account creation. No auth success or remote consent sync is
  newly claimed; those controllers are unchanged and covered by existing tests.
- Canchas actual component fixture with exact seed: CTA48 px, cream #FFF7ED, orange
  ink #A63B00 text/border; visible disclosure absent. Accent-insensitive query and
  simulated catalog-error/retry pass. No fictitious activity supplied. Fixture is
  component/browser evidence, not a physical map or authenticated native run.

An intermediate lint run detected unused confirmation-eye state; connected to its
field and final rerun passed cleanly. Earlier Space test failed; adapter documented
before implementation and final toggle/untoggle passed. Preview favicon404 is only
the isolated host's missing favicon, not an app runtime error.

## Actual implementation captures

- [Signin](courts-auth-evidence/signin.png).
- [Signup](courts-auth-evidence/signup.png).
- [Consent with explicit checked/unchecked boxes](courts-auth-evidence/consent.png).

These are actual browser captures at402 × 874, reviewed for field/eye placement and
checkbox recognition; not mockups, approved new designs or native screenshots.

## iPhone checks still pending

On iPhone16 Pro: keyboard remains usable when toggling each eye; value/caret/focus
retained; no submission; keyboard navigation/autofill/VoiceOver announcements;
checkbox state discoverability and both-required validation; large-text reflow;
Canchas outlined CTA/readability and no map/preview regression. Native execution
has not been observed. Existing policies remain provisional, per clarification;
no independent legal links or definitive acceptance claim was invented.

Ready for owner review, not SPEC closure. No Detalle/other-screen progression,
commits or push. Task registry/historical completion left unchanged.
