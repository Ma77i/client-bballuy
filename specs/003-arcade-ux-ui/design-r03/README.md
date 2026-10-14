# R03 — Visual Fidelity Redesign

Status: **proposed / awaiting explicit product-owner approval**. Date: 2026-10-14.
Design and documentation only. No runtime UI, backend, contracts, dependencies,
commits or push. SPEC-003 remains in_progress; this package does not close T05 or
start final verification. T00–T04 history is preserved.

## Review package

Open [the annotated visual review](review.html). Static compositions are not an
implemented app. Each board contains two complete device frames and annotations.

- [Canchas: list and map](boards/courts.png).
- [Court detail: top and scrolled/action state](boards/detail.png).
- [Mis canchas: populated structural example and empty](boards/my-courts.png).
- [Jugar: list and compact court-filter overlay](boards/play.png).
- [Perfil: default composition and enlarged-content example](boards/profile.png).
- [Shared components and icons](components.md).
- [Illustration inventory and generation record](illustrations.md).
- [Layout measurements](layout.md).
- [Interactions, motion and truthful states](interaction-motion.md).
- [R02/R02.1 and current implementation comparison](change-log.md).
- [Mandatory implementation fidelity contract and screen checklists](fidelity-contract.md).
- [Proposed task sequence](task-proposal.md).
- [Separate future functional requirements](future-functional-requirements.md).
- [Design verification and limits](verification.md).

## Device and evidence boundary

The owner confirmed iPhone 16 Pro and does not know the current text-size setting.
The reference is 402 × 874 logical points, based on an assumed 3× scale and the
1206 × 2622 native pixel resolution in [Apple technical specifications](https://support.apple.com/en-us/121031).
Safe-area reference values 62 top / 34 bottom are provisional design assumptions,
not measured Expo insets. Read actual window dimensions, font scale and insets on
the owner's phone before approving the implementation baseline. Device frames and
Dynamic Island silhouettes are review chrome, not new app UI.

There are no new physical-iPhone screenshots available in this revision. The
comparison uses source inspection, stored web captures and the owner's report.
No claim of pixel-measured native fidelity, VoiceOver or native performance.

## Data and approval decisions

Court names, IDs, catalog attributes and coordinates remain unchanged. Palermo's
coordinates were read from the existing seed, not a guessed address. Map drawing
is explicitly schematic; marker positions do not specify replacement geography.
Bracket fields are **bindings**, not fictitious dates, people or counts. Saved-list
and membership panels illustrate possible states, not an asserted account list.
An illustration is neither a court photograph nor the user's avatar.

Pending owner decisions:

1. Approve or revise the five compositions and their component specifications.
2. Approve the darker orange text/outline on cream for accessible small controls;
   bright brand orange remains on fills, selected states and navy accents.
3. Approve the proposed existing-flow handoffs: Ver convocatorias preselects the
   existing court filter; Jugar ahora requests an existing court selection when
   Todas is active, then opens the existing quick-create form without submitting.
4. Confirm actual phone text size/insets during implementation review. Enlarged
   text is required, not a separate approval to remove art or hide actions.
5. Approve the task insertion/mapping before changing the registry. No registry
   renumbering, design approval or implementation authorization is implied here.

R02/R02.1 remain the historical approved reference. R03 becomes the single visual
source of truth only after explicit approval and an immutable approval manifest.

Supplement: [shared visual states](boards/states.png), including closed session
states, uncertain registration readback, real activity bindings and compact selects.

[Proposed review file hashes](review-manifest.json) identify this delivered package;
they do not constitute approval. Freeze a new manifest upon explicit owner approval.
