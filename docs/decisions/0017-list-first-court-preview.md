# ADR 0017 — List-first court discovery and one native preview

Date: 2026-10-14. Scope: authorized SPEC-003/T03 on SPEC-003/design.

## Decision

Keep existing catalog/activity queries and detail routes. CourtDiscovery receives
read states and callbacks; its reducer owns only view/search/selection/expansion.
No query, write, roster or membership rule moves into the presentation layer.
List cards navigate directly; native markers replace one preview. Derived visible
selection excludes filtered-out or unusable reads immediately, before any animation.

Use the installed native maps library, platform .web resolution and T02 tokens,
fonts/media/primitives/motion provider. The web fallback keeps searchable cards and
detail callbacks, without importing native map runtime. Preserve list offset and
camera in the mounted discovery screen through existing stack navigation.

The sheet is an anchored sibling overlay, rather than a full-screen native Modal:
touch remains available to other markers. Markers stop press propagation; background
map press closes the sheet. Header/map/activity siblings are hidden from accessibility
while selected; sheet declares accessibilityViewIsModal. Heading receives focus;
close attempts the surviving marker host, then the selected view control. Actual
VoiceOver isolation, including navigator chrome, is a physical-device acceptance
check, not an inferred guarantee. Handle-only PanResponder supplements Close/Expand;
scrolling content never depends on drag. Sheet height follows available layout,
safe area and content; >=150% font scale removes art and shows expanded attributes
automatically. Buttons reflow, labels remain and content scrolls at high text sizes.

Selection 140 ms, sheet 240 ms and switch 160 ms are decorative and interruptible.
No animation completion changes ID, catalog, route or location. Reduced motion,
background and screen blur settle feedback immediately. Native marker snapshot
tracking is bounded to mount/selection (172 ms); no persistent pulse, z-index
reordering or per-frame React state/request loop. Marker scale uses the JS driver
for the custom snapshot; sheet/view transforms use the native driver on mobile.
Device frame timing remains unmeasured. Camera restore takes precedence over old
location; only a new explicit location result requests recentering.

## Alternatives and consequences

A Modal would isolate focus more directly but intercept taps on other markers.
A new sheet package is unnecessary for this three-court compact preview; it would
add a dependency and gesture integration surface. This implementation needs actual
iPhone coverage for custom-marker snapshots, accessibility and handle gestures.
T03 remains in_progress pending that evidence; T04 is not authorized or started.

Technical references: [native marker documentation](https://github.com/react-native-maps/react-native-maps/blob/master/docs/marker.md)
and installed React Native AccessibilityInfo host-focus API/types. These references
inform implementation, not product acceptance or a device performance claim.
