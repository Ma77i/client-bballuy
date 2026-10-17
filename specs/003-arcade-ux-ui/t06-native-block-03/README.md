# T06 final physical block — N12–N17

Owner authorizes guided N12–N16 and preparation of N17 on2026-10-16. All new cases
NOT RUN; N17 consolidation is prepared, not accepted. T06 and SPEC remain open.
This is documentation-only preparation; any observed defect needs a specific
proposal and new implementation authorization.

## Device and scope

Reported iPhone16 Pro / iOS26.6.1 / Expo Go57.0.0, normal text, VoiceOver off,
Reduce Motion off. Confirm unchanged versions and locale/timezone before testing.
Current source revision snapshot is [revision](revision.json); exact loaded device
bundle remains unverified. Preserve working tree. Other SPEC-004 work changed the
local court catalog to six records per its evidence; do not compare to obsolete
three-court fixtures or alter coordinates/data here. Confirm local endpoint before
any reversible test write; no production edits/reset/account modifications.

## Short sessions

- A,6–8min: [N12 visual review](N12/record.md), normal settings.
- B,8–10min: [N13 enlarged text](N13/record.md), then restore slider.
- C,8–10min: [N14 VoiceOver](N14/record.md), learn exit first, then turn off.
- D1,5min: [N15 reduced motion](N15/record.md), then restore original preference.
- D2,5–7min: [N16 safe areas](N16/record.md); reuse captures instead of repeat transactions.

Avoid functional repetitions from N06–N11; use drafts and existing games. No new
art, redesigns, dependency updates or backend operations. Capture only necessary
screens; redact name/email/private content and avoid recording spoken personal data.
Report case/subcase; PASS/FAIL/BLOCKED; settings; actual observation; optional
redacted image/video. NOT RUN is unattempted. BLOCKED is a missing prerequisite,
not a pass/failure. Functional corrections require owner authorization.

## Verified Apple settings guidance

Apple menus can vary by locale/iOS version. Use Settings search if wording differs;
record a blocker rather than pretending a setting was enabled.

- [Text size](https://support.apple.com/es-es/111773): Accessibility > Display & Text
  Size > Larger Text > Larger Accessibility Sizes, then slider. This is Dynamic
  Type, not Display Zoom. Restore original position after N13.
- [VoiceOver](https://support.apple.com/es-es/guide/iphone/iph3e2e415f/ios):
  Accessibility > VoiceOver. One tap selects; double-tap activates; practice first.
  Siri off command or learned Settings toggle provides exit. Do not assume shortcut
  is configured. Restore off after N14.
- [Reduce Motion](https://support.apple.com/es-es/111781): Accessibility > Motion >
  Reduce Motion. Restore original off after N15.

## Integral acceptance matrix / N17

[Review matrix](N17/matrix.html), [structured evidence](N17/matrix.json) and
[closure gate](N17/record.md) contain all N01–N16 results, automated/physical
separation, accepted adaptations, residual security risks and platform limitations.
No aggregate PASS or closure is implied. N01 overview/N03/N04 retests and N05
missing evidence remain unresolved; N02 gesture-only PASS; N06–N11 owner case PASS.

## Preparation verification — 2026-10-16

npm run verify: PASS (128 Markdown files, app typecheck and lint). All16 matrix
case references and4 automated evidence references resolve. Captured application/
package hashes unchanged during preparation. No device or simulated tests performed
here; no fresh security audit claimed. New physical cases remain NOT RUN. This
check does not close T06/SPEC or verify dynamic iOS setting behavior.
