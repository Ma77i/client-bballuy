# T06 physical acceptance plan

## Final physical block authorized — 2026-10-16

Owner authorizes N12–N16 guided acceptance and N17 matrix preparation only.
[Sessions and matrix](t06-native-block-03/README.md) are prepared with new
physical cases NOT RUN and N17 pending review. N06–N11 owner physical PASS; N02
gesture-only PASS. N01 camera/N03/N04 retests and N05 missing result remain open.
No functional/dependency/backend changes, closure, commits, push or deployment.
T06 in_progress; SPEC-003 open.


## N06–N11 physical acceptance reported — 2026-10-16

Owner explicitly reports N06,N07,N08,N09,N10,N11 PASS on iPhone/Expo Go.
[Case evidence and limits](t06-native-block-02/README.md) distinguish direct
owner physical acceptance from simulations. No new screenshots, conditional-subcase
observations or loaded bundle hash supplied; none fabricated. N01 camera, N03/N04
physical retests and N05 status remain unchanged; N02 gesture correction PASS.
T06 in_progress; SPEC-003 open. N12–N17 await authorization. Documentation only;
no functional/dependency/backend changes, commit, push or deployment.


## Owner gesture acceptance and next-block preparation — 2026-10-16

N02 expansion/contraction gesture correction is physical PASS by direct owner
report on iPhone/Expo Go. No further gesture changes requested or made. This does
not pass all N02 subchecks. N01 core list/search/mode flow approved; camera retest
pending. N03/N04 observed defects remain pending physical correction retest; N05
has no result supplied. Automated checks do not supersede those statuses.
[Next block N06–N11](t06-native-block-02/README.md) prepared; all cases NOT RUN.
T06 in_progress and SPEC open. No new code/dependency/backend changes or commit/push.
Latest owner-confirmed status supersedes earlier N02 FAIL statements only for the
expansion/contraction defect; historical observations remain preserved.


## Current authorization — block 01 only, 2026-10-16

Owner approved the plan and authorized N01–N05 only. T06 is in_progress for
preparation and owner-operated physical testing. [Block record](t06-native-block-01/README.md)
contains separate case records and the exact local revision snapshot. All physical
cases remain NOT RUN pending owner results. This supersedes earlier planning-only
status, not historical test evidence. N06–N17 require further owner authorization;
no functional changes, dependency updates or automatic SPEC closure permitted.


Date: 2026-10-16. **Planning only; not authorized to execute. T06 remains todo.**
T05 implementation and visuals are owner-approved. SPEC-003 remains open.

## Preparation and recording

Use the owner's iPhone 16 Pro with Expo Go and the existing local-device launcher.
Record iOS/Expo Go versions, local app revision/dirty snapshot, locale/timezone,
text-size setting, Reduce Motion and VoiceOver settings before testing. Do not
record credentials, personal account details or tokens. Confirm the local backend
identity; never switch to hosted data or reset a database. Use designated test
accounts A/B and disposable test games; preserve the three court records/IDs.
Record each check as NOT RUN / PASS / FAIL / BLOCKED, with date, observer,
steps, expected/actual result and redacted screenshot/video. All checks below are
currently NOT RUN in this T06 plan. Earlier visual approvals remain valid but do
not substitute for accessibility or functional device evidence.

## Concrete iPhone checklist

- [ ] N01 / A03: cold launch opens List; search then switch List/Map. Both show
  the same real courts; search/context survive returning from detail.
- [ ] N02 / A03: pan/zoom map, tap A then B quickly. Exactly one sheet opens;
  selected marker stays highlighted. Expand by gesture and accessible control,
  scroll long content, close, reopen, use Ver cancha and return. Verify focus
  return and no bottom gap. Detail location action centers/selects the real court.
- [ ] N03 / A03: deny location then explore all courts; retry location with
  permission granted. No blocked discovery or changed court coordinates.
- [ ] N04 / A04: add/remove/re-add court, inspect My Courts, refresh and return
  to detail. Pending actions reject duplicate taps; only server-confirmed state
  appears. Network failure offers retry without invented activity/occupancy.
- [ ] N05 / A01,A04: sign out, sign into B, return to A. No stale profile,
  saved courts or participation from the previous account. Test logout failure
  and recovery; report problem preserves existing handoff behavior.
- [ ] N06 / A05: Play court/format selectors, scrolling, fixed dock, My games
  and History navigation remain reachable. Empty/loading/error/retry states use
  truthful Spanish labels and no fictional totals.
- [ ] N07 / A05,A07: Armar partido, Ahora and Planificar: select all formats,
  verify capacities 2/4/10, select court and native date/time. Dates are Spanish,
  past selections rejected; cancel picker preserves draft. Confirm local time
  round trip (America/Montevideo), selected format and no court reservation claim.
- [ ] N08 / A05,A07: open keyboard in every editable field; reach final CTA,
  dismiss keyboard, scroll to errors and retry. No dock/tab/home-indicator overlap
  or obscured field. Rapid submit creates a single confirmed game.
- [ ] N09 / A05: open/full/started/finished/cancelled games with organizer and
  participant/nonparticipant accounts. Full/closed games have no invalid join;
  permitted leave/edit/start/cancel actions follow existing rules. Cancel retains
  confirmation. Details remain readable; no permission is inferred from styling.
- [ ] N10 / A05: join/leave with normal, pending and interrupted network.
  Never show registration confirmed before account-state recheck. Recover unknown
  status via Reintentar comprobación without issuing a duplicate join request.
- [ ] N11 / A05: register match from eligible source, existing account/guest
  roster, capacity validation, score save and history. Check pending score, final
  result, correction review, stale revision/conflict and retry after lost response;
  nonorganizer cannot edit. Use safe local fixtures; do not manufacture production data.
- [ ] N12 / A02,A06: compare approved R02/R02.1 compositions across courts,
  detail, My Courts, Play, create, game detail/management, history/result and
  profile. Original art/fallback loads, no generic image is presented as a real
  court photo. No new redesign for minor follow-ups.
- [ ] N13 / A07: repeat key journeys with largest accessibility text sizes and
  small available viewport: titles, cards, long emails, fields, sheet expanded,
  actions and dock wrap/scroll without clipping or loss of information.
- [ ] N14 / A07: VoiceOver traversal for back icon, filters, selected options,
  password eye, consent, markers, sheet close/expand, pending/error notices and
  confirmation. Focus order/return/announcements are usable; decorative art is
  ignored; controls have meaningful labels and adequate touch targets.
- [ ] N15 / A07: Reduce Motion enabled, rapidly change marker/format and press
  actions; transitions interrupt safely. Server states update immediately and
  are never gated by animation. Repeat with normal motion for visible regressions.
- [ ] N16 / A07: notch/home indicator/tab bar/keyboard safe areas in portrait
  and supported rotation. Check map full height, compact sheet and fixed Play dock.
  Note real scroll/gesture responsiveness and any visible stalls; quantify only
  with an actual recorded measurement, never infer device performance from export.
- [ ] N17 / A08: consolidate device evidence and unresolved failures, map A01–A08
  to actual checks, review security disposition and request explicit owner closure.

## Execution boundary and exit gate

Ask owner authorization to start T06. Run in short observable batches: N01–N05,
N06–N11, then N12–N17, preserving screenshots and failures per batch. Any required
fixture/state not available is BLOCKED, not PASS. Browser mocks do not verify
server concurrency or physical VoiceOver. Android native parity remains a separate
unexecuted platform check. Rerun local verify/client tests after any authorized fix.
T06 cannot be done until reproducible evidence addresses its acceptance criteria
and the owner resolves/accepts remaining limitations. No SPEC closure, deployment,
commit, push, new functionality or security updates are authorized by this plan.
