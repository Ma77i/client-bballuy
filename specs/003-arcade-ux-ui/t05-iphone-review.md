# T05 iPhone Expo Go review — prepared, physical cases pending

Date: 2026-10-14. T04 is closed by explicit owner approval. T05 implementation and
local evidence are ready for review; T06 is not authorized or started. None of the
following physical results is inferred from browser checks or iOS compilation.

Open exp://192.168.1.13:8090 in Expo Go on the same trusted Wi-Fi as the PC, using
the matching Expo account/SDK 57. The local launcher is npm run db:local:device if
Metro stops; do not reset the database. Synthetic browser QA identities/data were
removed. Use your existing local test accounts or create new test-only accounts.

1. Entry/sign in: scroll with keyboard, show/hide password, failed login and retry.
   Check introductory steps, 13+ acknowledgement and both provisional development
   notices. Their meaning/persistence and account confirmation behavior stay the same.
2. Jugar: navy page, orange actions, cream real invitation cards, Teko/Lexend and
   labelled local original art. Open Organizar, Mis convocatorias and Historial.
   Pull to refresh; test loading, empty, failed read/retry and stale-data notice.
3. Organizar: pick Palermo; rapidly select 1v1 -> 2v2 -> 5v5 -> 1v1. Each selection
   shows 2/4/10/2 total places immediately, without navigation or network submission.
   Check enlarged text, wrapping, checked labels and disabled state during a request.
4. Ahora: enter quick setup, choose playing versus only organizing, and enter present
   count including the organizer once. Invalid counts remain errors. Planificar:
   use future local YYYY-MM-DD/HH:MM; past/invalid dates fail, no present-guest field.
   Create only after checking the draft; no real court reservation is implied.
5. Two accounts: organize 1v1 while playing; other account joins the remaining place.
   The invitation is full. Existing player can leave with confirmation, then rejoin
   if still open. A nonregistered account cannot join a full invitation.
6. Pending/uncertain: interrupt the network during registration/readback. No confirmed
   success before actual account/server readback. No opposite action while uncertain.
   Reintentar comprobación checks the saved request; do not create another request.
   Repeat after background/reopen to check saved intent and account isolation.
7. Organizer: edit where permitted; occupied invitations retain core lock. Start,
   cancel and finish have original confirmations. Started/cancelled/completed details
   remain readable but cannot join/leave. Time passing alone never starts a game.
8. Match: explicitly choose both sides, accounts versus guests, and valid names.
   Linked invitation keeps its court/format. Review then confirm a final score;
   correct it and inspect preserved revisions. Two devices editing the same revision
   must show conflict/refresh/review, not silently overwrite the result.
9. VoiceOver: route/section headings, format labels/total capacity/selected state,
   pending/busy/disabled controls, server confirmation announcements and recovery
   action. Confirm decorative icons/art do not imply new activity or verified photos.
10. >=200% Dynamic Type, small iPhone, portrait/landscape, keyboard and safe areas:
    scroll to every CTA, no clipped essential text or unreachable confirmation.
    Enable Reduce Motion; selections/state still immediate, decorative feedback does
    not delay actions. Interrupt a press/selection with another touch or backgrounding.

Record actual device/model/iOS/Expo/date and observed outcomes before marking any
case verified. Physical FPS, focus, gestures, persistence/background and mail composer
are unmeasured; no release/production or full SPEC-003 acceptance claim.
