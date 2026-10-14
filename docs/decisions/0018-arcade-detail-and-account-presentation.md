# ADR 0018 — Reuse presentation while preserving account/server state

Date: 2026-10-14. Authorized SPEC-003/T04 only; T03 approved by owner.

Keep court/account queries, mutation locks, confirmed membership readback, cache
ownership, logout and support draft logic in their existing hooks/controllers.
MembershipPanel receives those states/callbacks and preserves existing priority:
pending write, uncertain write, pending read, read error, confirmed status. No local
optimistic membership, animation callback, new confirmation dialog or extra request.

Reuse CourtCard through an opt-in name/ID-only projection with showFacts false.
My Courts' existing query provides only those catalog fields; changing the query or
claiming unqueried attributes unknown would expand the contract or mislead users.
Full-catalog T03 callers retain exactly their previous default fields/layout.

Profile opts into shared arcade logout presentation; the HeaderMenu caller retains
its existing default. CourtActivity opts into Spanish arcade headings/accessible
loading while preserving filtering, cadence, freshness/errors and existing SessionCard.
ReportProblem retains validity gating, original mailto draft and retry/fallback; no
account data automatically attached and no email sent by the application.

All presentation uses T02 tokens/fonts/buttons/panels/media and reduced-motion-aware
feedback. Profile art is a labelled generic illustration, not a new avatar feature.
No new dependency, parallel palette, backend/schema/RLS, business state or route.
Only My Courts/Profile tab labels and active orange tint change; navigation geometry,
Play, organizer and match flows remain as before. Stop before T05.

Browser integration against the real local app is the behavioral evidence, with
isolated synthetic accounts and controlled transport/composer failures. Physical
iPhone accessibility, enlarged text, restart and composer outcomes require separate
observed evidence; compilation/browser results cannot substitute for them.
