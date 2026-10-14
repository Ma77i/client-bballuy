# Proposed R03 task sequence before final verification

Planning proposal only. Registry unchanged. T00–T04 stay done with original evidence;
T05 stays in_progress. The current pending T06 final-verification task has not run.
Do not mark design approved/ready or start UI work until explicit owner approval.

Once the owner approves this task insertion, apply the following mapping and update
all dependencies/references together, following docs/workflow.md execution-order
numbering. Record old T06 → new T12; preserve its historical title/evidence mapping.
Never append later IDs ahead of an earlier execution step without that mapping.

- Proposed T06: R03 design approval and immutable baseline. Deliver five boards,
  shared specs, phone measurements and explicit owner decisions. Dependencies: completed
  T02/T04, not T05 closure. T05 remains in_progress while its visual acceptance is
  resolved by R03; this avoids a circular approval/implementation dependency.
- Proposed T07: shared presentation refinements/assets. Dependency T06 approved.
  Reuse T02, optimize approved art, accessible orange ink, compact selects/cards/icons.
  No new dependency without necessity/authorization; no domain changes.
- Proposed T08: Canchas list/map visual fidelity. Dependency T07. Apply layout/art,
  preserve T03 markers/context/sheet behavior; actual iPhone comparison and fixes.
- Proposed T09: Detail and Mis canchas fidelity. Dependency T08. Group sections,
  shared saved cards, compact refresh; existing confirmation and location handoff.
- Proposed T10: Jugar discovery composition and existing-flow continuity.
  Dependency T09. Compact filters/dock/tickets; approved handoffs only. Preserve
  Organize/participation/match/results/history behavior and R02.1 state sequences.
- Proposed T11: Perfil composition and cross-screen visual/accessibility regression.
  Dependency T10. Original art/groups/name, logout/isolation, actual native comparison.
- Proposed T12: final complete-redesign verification (formerly pending T06).
  Dependency T11, T05 closure and all implementation/owner gates. Include real-iPhone fidelity,
  functional regression, accessibility/reduced-motion and performance evidence.

These entries are not inserted into tasks.json yet. Owner may choose a smaller
refinement grouping; maintain dependency order and auditable old-to-new mappings.
T05 can only close when its preserved functional scope and the corresponding R03
visual acceptance have evidence; new design renders alone do not satisfy it.
Each implementation task must provide board comparison, meaningful regression
checks, observed native results and explicit unexecuted limits before closure.
No future avatar/social feature is part of this sequence.
