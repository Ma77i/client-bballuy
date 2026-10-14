# T03 authorized implementation scope — 2026-10-14

## Owner-authorized visual refinement after iPhone feedback

Compact only the court header/search/selector, list cards, generic media/caption
and preview layout. Ver cancha remains the primary CTA; Close and Expand become
secondary controls with >=48-unit targets, explicit labels and expansion state.
Preview must shrink to its content, scrolling only when content needs the available
height. Preserve selected marker, rapid replacement, focus, large text and reduced
motion. No architecture/business change or My Courts/Play/Profile edit. Repeat
local checks and prepare another iPhone visual review; owner feedback does not
certify the previously pending device cases. Keep original evidence separately.

Owner authorized T03 on SPEC-003/design after T00–T02 completion. R02 and R02.1
remain the approved reference. Implement only list-first court discovery, shared
search, native basketball markers and a single compact/expandable preview.
Preserve catalog IDs/coordinates, location denial, activity freshness, retry,
existing detail navigation and web isolation from the native map package.

Acceptance includes immediate selection/replacement/removal; interruptible
140 ms marker / 240 ms sheet / 160 ms view motion; reduced-motion static states;
accessible close/back, heading focus/restoration, safe areas and large-text scroll.
Search, list offset and camera survive detail return. No new dependency, backend,
RLS, membership/business change, commit, push or automatic T04.

Run verify, test:client and focused discovery tests. Browser checks cover actual
shared components and web fallback; a native bundle is transform evidence only.
Physical iPhone Expo Go gestures, markers, VoiceOver, Dynamic Type and navigation
must have observed evidence before native acceptance is recorded. Keep T03
in_progress if these acceptance checks remain pending.

## SDK 57 navigation compatibility correction

The actual app entry must bundle with Metro's React Navigation compatibility
check enabled. Use Expo Router's supported navigation exports for discovery focus
without changing focus/blur behavior. Verify the full iOS entry graph, not only
the isolated discovery fixture; retain the existing native acceptance gate.
