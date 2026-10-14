# T04 authorized presentation scope — 2026-10-14

## Final approved-direction refinement

Use My Courts language for all visible membership states while preserving internal
models and callbacks. Place the orange organizer action first; removal is secondary.
Compact reported activity while retaining freshness and occupancy caveats. Localize
detail back navigation to Volver. The location affordance must reuse navigation
without changing T03, coordinates, services or discovery behavior; clarify the
existing-map versus phone-map destination with the owner before implementing it.
Owner subsequently chose the existing Courts destination with preserved context.
Use its current navigation route; do not force a view, recenter or change selection.
This context-only decision was subsequently superseded by the owner's explicit
request to center and select the current court; see t04-map-target.md. Only that
minimal discovery handoff is newly authorized.
Repeat local state/account regressions and keep physical-device checks explicit.

Owner closed T03 and authorized only court detail, My Courts and Profile. Use
approved R02/R02.1/T02/T03 presentation; preserve existing reads, membership confirmed
write/readback and same-action retries, real account data, logout recovery, support
draft handoff and account isolation. IDs, routes and business rules are unchanged.

Reuse CourtCard for membership name/ID projection without invented attributes,
activity/counts or another catalog contract. Essential shared primitive/card changes
must be opt-in and documented; court discovery remains unchanged. Existing reported
court activity/freshness/error semantics stay; Play session cards are not redesigned.
No backend/RLS/schema/dependency, navigation feature, avatar/statistics or T05 work.

Run verify/test:client plus relevant membership/account/logout/support regressions;
exercise real local join/leave/rejoin, navigation/read refresh, read/write failure,
logout failure/retry and account isolation where available. Record browser evidence
separately from physical iPhone checks. Mark T04 done only with its acceptance
evidence; leave unobserved native cases explicit. No commit/push.
