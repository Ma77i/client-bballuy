# 0019 — Pickup presentation on existing foundations

Date: 2026-10-14. Scope: SPEC-003/T05, explicitly authorized after T04 owner closure.

Existing pickup routes already use Kit aliases backed by T02 primitives. Keep those
aliases and business hooks rather than create another design system or move routes.
Reuse Panel/Choice/Field/Button/StateView, presentation motion and original local art.
Add opt-in adapters: GameText maps existing kit colors to Panel surface context;
ArcadeField/ArcadeNotice translate display errors without changing validation,
classification, request identity or hook behavior. GameLoading uses the existing
reduced-motion-aware StateView instead of independent spinner loops.

SessionCard has an opt-in arcade composition used by Play/personal sessions. Court
activity keeps its previous default rendering to preserve approved T04. FormatChoices
uses capacities from the original organizer module; decorative feedback observes the
selected value and exposes no request/navigation or animation completion callback.
MotionLink adapts existing press feedback for organizer/history read actions.

EntryFrame consolidates existing entry/auth presentation, with original local art,
scrolling, safe areas and keyboard handling. Authentication, consent persistence,
first-run routing and form handlers are retained. Replace unverified remote artwork
in entry slides with the already bundled labelled illustration. No new dependency.

The only shared primitive extension is optional Choice.style for compact court
options and orange selection outlines in T05. Default behavior/styles are unchanged;
T03/T04 callers do not supply the new property. Do not migrate T03/T04 or redesign
their screens as part of this decision. Native accessibility/performance still
requires observed device evidence; compilation alone does not close that gate.
