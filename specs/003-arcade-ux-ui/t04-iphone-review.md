# T04 iPhone Expo Go review — prepared; all device cases pending

Date: 2026-10-14. T03 approved/closed by owner; T04 locally implemented, in_progress.
No T04 physical iPhone result is claimed. Use the existing real local test account,
matching Expo Go/SDK 57, PC and phone on trusted Wi-Fi. The current local device
Metro can be reloaded; if it stops, follow ../../local-backend/README.md and run
npm run db:local:device. Do not reset the database or use a hosted backend.

1. Canchas -> actual court -> back: preserve T03 search/list/map context. Open the
   same court from Mis canchas; names/IDs/recorded attributes remain identical.
   Ver ubicación en el mapa explicitly opens Map centered on the current court with
   its marker selected and one compact preview. Check Palermo from List, an already
   mounted map, My Courts and direct-detail entry. A search excluding the target is
   cleared; compatible search stays. Close/pan/change marker and verify no repeated
   recentering. Repeat the same target and reduced-motion preference. Ordinary Back
   still preserves context; real coordinates stay secondary.
2. Detail: Teko/Lexend, navy/orange/cream, labelled original generic illustration;
   all real fields/notes readable. Palermo lighting says Sin registrar. No photo,
   fabricated activity, attendance, ranking, points or favorites.
3. Join -> server-confirmed member -> leave -> confirmed absence -> rejoin. Check
   Mis canchas after each action/refresh and after a complete app restart. Membership
   does not imply currently playing. No opposite action while saving/uncertain.
4. Network failure during write/readback: retry same intended change; no premature
   success. Membership read failure and catalog/activity errors show their retries.
   Stale reports are marked; lack of reported games never means physical emptiness.
5. Organizer shortcut: existing route receives the exact court ID; return to Detail.
   This is navigation verification, not authorization to redesign T05 flows.
6. Profile: actual display name, labelled generic player art, Mis canchas, logout,
   configured report action. Logout failure preserves account and offers retry;
   success returns to sign in. A -> B -> A isolates names and communities.
7. Report: missing/invalid contact hides action. Configured action opens a draft
   for review without automatic account data. Observe real composer opening or
   fallback/retry; do not send the email as part of this review.
8. VoiceOver: route headings, every control's name/disabled/busy state, membership
   updates/error announcements and back/focus recovery. No trapped or duplicate focus.
9. Text >=200%, landscape and safe areas: full names/attributes/notes/disclaimers
   wrap; scroll reaches community/organize/logout/report controls and tab labels.
   No ellipsis, fixed card height or font-scaling cap was introduced.
10. Reduce Motion before launch and during press: static feedback, immediate functional
    changes. Background/foreground mid-request/press; no stale scale/state or delayed
    server result. Observe device responsiveness; no release FPS claim from Expo Go.

For each case record device/iOS/Expo Go/date/steps/observed outcome/pass-fail. Screens
must omit credentials/personal contact details. Leave unexecuted checks pending;
resolve failures within T04 and record evidence before closure. Do not start T05.
