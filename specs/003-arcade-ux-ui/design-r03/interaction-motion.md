# R03 interactions, motion and truthful state

Presentation only. Existing SPEC-001/002 contracts, permissions, hooks, confirmation
and recovery remain authoritative. R02.1 approved sequences are retained.

## Motion specification

- Court press: 80 ms down (scale0.985), 120 ms release; cancel on drag/outside.
  Navigation uses the actual press immediately. Reduced motion: color/border only.
- List/map: 140 ms content crossfade, no horizontal slide or query reset. Retapping
  reverses from current opacity; state change is immediate. Reduced: direct swap.
- Marker and sheet: selection/check changes immediately; marker emphasis120 ms;
  sheet translation/opacity180–220 ms from current position. New marker interrupts
  the same sheet, replaces data by real ID, never stacks another sheet. Reduced:
  direct placement and selected halo, no bounce. Restore previous focus on close.
- Sheet expand/collapse: 180 ms to measured content bounds, interruptible by drag,
  another marker or explicit control. Expanded reading order: title, facts, activity,
  CTA, close. Keep close reachable and focus contained as existing native sheet
  behavior requires; background must not become an accidental interactive target.
- Format selection: selected fill/check immediate, 120 ms emphasis only; 1v1=2,
  2v2=4, 5v5=10 total participants. Selecting never creates a request or navigates.
  Rapid selection cancels previous emphasis. Reduced: selected state only.
- Compact select: 120 ms overlay fade; focus moves to current option, selected row
  has check and accessible state. Choice immediately updates existing filter.
  Dismiss outside/back/Escape restores trigger focus; Enter/Space selects on web.
  Reduced: direct overlay. No animation-related network dispatch.
- Registration: pending state occurs immediately on actual submission; duplicate
  submit blocked. Read actual account/server membership before confirmed label.
  Success emphasis160 ms follows confirmed data, not elapsed animation time.
  Uncertain response shows 'No pudimos comprobar tu inscripción' and existing
  'Reintentar comprobación' readback, not another join request. Reduced: text/check.
- Loading: stable placeholder or existing spinner; avoid flashing/shimmer. Error:
  compact real error +48 pt retry; success: polite live announcement. No forced
  success delay, confetti, game points or fabricated attendance.

All sequences are cancellable on route unmount and account change. No timeout,
animation completion or delayed callback controls business state. Native gestures,
VoiceOver order, focus restoration and Reduce Motion require real-device evidence.

## Game eligibility and labels

Visual labels map to existing server states. Planificada is a presentation of an
open session with a future scheduled time, not a new stored state or timer-driven
start. Open/Planificada may join only when existing account/state/capacity rules
permit. Completa never admits a new registration; existing participant leave rules
continue unchanged. Iniciada, Cancelada and Finalizada do not enable joining or
out-of-policy departure. View/detail/history remain accessible as current rules
allow. No UI label overrides the server eligibility helper. Match/guest/account
management already verified in SPEC-002 is preserved, not recreated by R03.

## Existing flow handoffs proposed for approval

Ver ubicación en el mapa preserves the existing focusCourtId/request handoff:
center the real court, select that marker, one sheet, preserve map context.
No external maps service or new address. Back remains Volver.
Ver convocatorias would reuse Jugar's existing Cancha filter, preselected by real
court ID. This is a proposed presentation handoff, not implemented in this revision.
Armar partido opens the existing create flow. Jugar ahora opens existing quick
creation, never automatically submits; when Todas is selected it first requires
an existing real court choice. Current default2v2 applies when no specific format
was selected; otherwise preserve chosen format. Obtain owner approval for these
handoff choices before implementation, without changing creation validation.

Refresh retains actual content and last successful state; failure does not erase
saved courts or display someone else's data. Account change clears account-specific
pending state according to current isolation. Sign-out/report retain existing flows.
