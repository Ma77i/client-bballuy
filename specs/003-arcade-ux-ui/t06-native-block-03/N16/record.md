# N16 — Safe areas, keyboard geometry and responsiveness

Physical status: **NOT RUN**. Session D2 / 5–7 minutes; normal settings; reuse N13 captures for enlarged text.

## Steps

1. Portrait: Map with no selection must reach tab navigation without unexplained blank bottom space; select court and inspect compact/expanded preview close/size/CTA against home indicator and tab bar.
2. Play: scroll until bottom, verify fixed dock and tab targets remain separate. Inspect Profile bottom actions and existing Result/Management actions.
3. Armar partido draft: open description/numeric keyboard and native date/time controls; scroll to final CTA/errors; dismiss/reopen keyboard. Test geometry only, not creation again.
4. Turn device horizontally only if the app supports rotation; if portrait-locked record supported scope, not a false failure. Repeat with an overlay/picker open only when supported.
5. Observe smoothness during scrolling/marker/size changes, interruptions and one background/foreground return. Restore settings; note device heat or stalls without asserting cause or fps.

## Expected and classification

No content under notch/home indicator, unusable bottom controls or keyboard/dock overlap. Safe scrolling preserves access at supported orientations; native picker returns to usable screen. Expo Go overlays belong to host, not app decoration. Visible responsive behavior is an observation, not proof of release performance; exact32ms frame target remains unmeasured.

## Evidence

Capture full viewport with top/bottom edges and keyboard open, compact/expanded sheet and dock if affected. Note orientation/support, keyboard/control and setting. Supported geometry PASS requires owner confirmation; unavailable rotation marked not applicable with reason, not silently passed.

## Result template

- Owner date/time and case/subcase: pending.
- Device/settings/revision match: pending confirmation.
- PASS / FAIL / BLOCKED / NOT RUN: NOT RUN.
- Steps, expected and actual: not observed.
- Redacted attachment or exact observation: none supplied.
- Defect proposal / authorized fix / retest: none yet.

A case PASS requires explicit owner confirmation; automated success is separate.
If a conditional step is unavailable, record it separately. Preserve failures and
retests. Do not modify functional code/dependencies or production data in this block.
