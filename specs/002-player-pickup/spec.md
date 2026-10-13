# SPEC-002 - Player-first pickup MVP

## Problem

Players can discover and follow courts through SPEC-001 but cannot find and join
an upcoming opportunity to play. The owner selected players seeking to join as
the initial audience on 2026-10-12 and deferred iOS beta until after this MVP.

## Goal

Help a player find an immediate or future opportunity to play, join or leave,
and register an actually played match and its side-level final score without
a permanent team. The first delivery records final scores; live scoring follows
later with its own requirements and acceptance.
Local functional acceptance is verified, including owner-reported iPhone checks.
See closure-review.md for acceptance coverage and limitations. Completing this
specification does not finish the MVP. Task states live in tasks.json and the registry.

## Owner-confirmed rules - 2026-10-12

- Pilot at Parque Rodo and Palermo. Preserve all three existing court records;
  the two Parque Rodo records must not be merged or arbitrarily selected.
- Any authenticated user may organize a session and manage only their own.
- Sessions are visible to all authenticated users. Neither creating nor joining
  requires a permanent team or membership in the selected court community.
- Everyone in that authenticated audience can see the organizer and available
  places and participant display names. Visibility means authenticated users,
  not anonymous access, emails or other private account fields.
- Players may leave until the start. Once participants have joined, changing
  court, time or format requires cancellation and a new session. Cancellation
  remains visible in My sessions. Start is an explicit organizer action;
  the scheduled time is the planned time, not an automatic start.
- The project owner handles problem reports through a supplied email contact.
  Keep the actual address out of repository documentation, tests and logs;
  configure it separately when implementing the reporting entry point.
- Formats are 1v1, 2v2 and 5v5; the earlier 3v5 input was corrected by the owner.
- An organizer explicitly selects whether they play. A playing organizer uses
  a player place; a non-playing organizer does not.
- First deliver final-score entry by the organizer, labelled as declared and
  without ranking credit. Live scorekeeping is deferred beyond this MVP delivery.
- Already-assembled match records may include guests without app accounts.
  Joining an invitation through the app still requires an authenticated account.
- Player capacity is fixed at 2 for 1v1, 4 for 2v2 and 10 for 5v5, with no
  substitute places in the first delivery.
- When inviting players from a court, the organizer specifies how many players
  are already present, including guests. Those players consume capacity.
- The organizer explicitly starts play. Once started, joining and leaving
  registrations are closed; this does not prevent anyone physically leaving.
- Saving the organizer-declared final score closes the match. The organizer
  can later correct it, preserving previous values and correction history.

The owner wants both immediate invitations (two players seek two more for a 2v2)
and registering a match among already present players (two players play a 1v1).
An extra person may keep the side-level score live; otherwise enter the final
score afterward. Individual point attribution is explicitly unnecessary.
These flows expand the earlier invitation-only draft. Final-score entry is in
the first delivery; optional live scoring is deferred.
See the assessment and smaller implementation alternative in
[the product vision](../../docs/product-vision.md#scorekeeper-and-instant-game-discussion).

## Scope

Preserve account/court/community functionality. Add court-linked upcoming session
discovery, details, limited organizer creation/cancellation/completion, confirmed
join/leave and a personal upcoming list. Establish server permissions, concurrent
capacity protection, clear error/retry states and local device acceptance.
An organizer role is session-scoped and must not grant global privileges.
Also define immediate invitations and already-assembled match registration,
temporary sides and side-level final results. Live scorekeeping is future work.

## Out of scope

Permanent teams/captains, social feeds/chat, tournaments, competitive rankings,
individual statistics, attendance awards, live scorekeeping, push reminders,
payments, automatic matchmaking and court reservations. iOS beta preparation
and distribution are future work with no registered specification. No hosted migrations, remote
data cleanup, cloud builds, commits or publishing are authorized by this plan.

## Requirements

### R01 - Confirmed session rules and baseline

Finalize pilot audience/location, organizer eligibility, participant visibility,
supported formats and capacities, date/time and cancellation/closure rules,
reporting/support expectations and observable acceptance before implementation.
Preserve SPEC-001 behavior, existing users and all three court records.

### R02 - Discover upcoming opportunities

Players can browse upcoming non-cancelled sessions associated with known courts
and inspect court, date/time, format, available places and organizer information
allowed by the chosen privacy rules. Empty/loading/error/retry states are explicit.
Visibility and participation do not require following the court. The organizer
and available places and participant display names are visible to authenticated
players. Never expose private account/contact fields with the roster.
A planned invitation must not imply live attendance or reserved court access.
T03 also displays organizer-declared started sessions on their courts for all
authenticated viewers, including the server-recorded start time. Refresh while
viewing and on return to the foreground; closing removes active status. Label
this as reported activity, not verified physical presence. Read failures must
not silently imply no activity. Push notifications and preferences are deferred.

Discovery shows open immediate invitations, open future invitations whose
planned start has not passed, and organizer-reported started activity separately.
Open future sessions past their planned time remain accessible by ID but are
labelled as past their planned time rather than upcoming opportunities. Full
open invitations remain visible with zero places. Closed/cancelled sessions
are excluded from discovery but their detail route shows the actual state.
Details include participant display names and present guest labels, distinguish
registered places from attendance, and show management only to the organizer.
T03 is read-only for other players; join/leave actions belong to T04.
Activity refreshes every 30 seconds only on a focused screen in the foreground,
plus on foreground return and pull-to-refresh. Show the last successful check
and read failures alongside cached activity; never convert a failure to empty.

### R03 - Supply and manage sessions

The initial creation screen ends at the timing choice with no default selection.
Plan ahead reveals scheduled configuration on that screen. Now opens a separate
quick setup retaining the selected court and format. Both paths preserve the
existing account-bound request recovery and explicit organizer participation.


T02 provides an organizer-only Play hub, creation form and owned invitation
management. Validate known court, supported format, explicit participation,
combined places and real future local date/time before sending. Show loading,
empty and recoverable failures without sample activity. Require confirmation for
start/cancellation/closure and preserve input/request identity on uncertain writes.
Disable core edits once core_locked; descriptions can still be changed while open.
The account-bound pending operation survives remount/retry and is cleared only
after server-confirmed readback or a definite rejection. Lifecycle controls are
hidden for non-owners and enforced independently by the server.
Pass the expected actor to the RPC to reject account switches during transport.
Open descriptions remain editable after the planned time; changing that time
still requires a valid future schedule and an unlocked invitation.

Eligible organizers can create valid court-linked sessions and cancel or close
their own sessions under the agreed lifecycle. Non-owners cannot mutate them.
Any authenticated user may organize. If participants have joined, changing court,
time or format requires cancellation and a new session rather than editing.
Cancelled sessions remain visibly cancelled for existing registrants. Marking
finished alone does not confirm attendance, a match result or reward eligibility.
Recording a match result is a distinct explicit operation under R08.
Only the organizer can perform the explicit start action. Passing the planned
time does not start play or certify presence automatically. Clients must show
the actual state and the planned time separately.

### R04 - Confirmed joining and leaving

Authenticated players can join or leave eligible sessions without a team.
The server prevents duplicate registrations and exceeding capacity under
concurrent requests. Reject invalid, cancelled or otherwise closed sessions.
Retries reconcile uncertain outcomes; no confirmed success before server
confirmation. Organizer participation is an explicit creation choice and only a
playing organizer consumes a player place.
T04 adds join/leave controls on public details with explicit leave confirmation.
Do not submit from failed/stale or inconsistent roster reads. The server remains
authoritative for capacity and start races; a passed planned time alone does not
block a direct open-session join. Persist one account/backend/session-bound
request UUID and action before transport. An uncertain outcome blocks the
opposite action until replay and readback reconcile actual current membership.
Double presses share one in-flight operation; definite rejections permit refresh
and a new choice. Lost transport, auth failures and readback failures preserve
the request. Success messaging follows current readback, not the original receipt.

This account-based registration flow is distinct from guest participation in an
already-assembled match under R08; guests cannot call join operations anonymously.

Capacity is 2/4/10 for 1v1/2v2/5v5, without substitutes. Already-present players,
including guests, consume places alongside account-based registrations. Never
count a playing organizer twice if included in the present-player count. Available
places equal capacity minus all distinct occupied player places. A 2v2 with two
present players must show two available places. The server must reject overbooking
across present-player allocation and registrations, not only duplicate join rows.
After the organizer starts play, join/leave operations are rejected, including
races between start and registration. The scheduled time alone does not close
registration; it is the planned time.

### R05 - Personal sessions and account isolation

Show the signed-in player's current registrations, organizer-owned invitations
and visible cancellations in a dedicated My sessions screen linked from Play.
Include open, started, cancelled and completed groups; past planned open sessions
remain visible with their actual state. Leaving removes a non-owner registration
from this list; an organizer-owned invitation remains as an organizing entry.
The list is a deduplicated union, so a playing organizer appears once.
Cancelled registrations retain their details and cancellation status.
Refresh/reopen preserve server-confirmed state. Account switching and late
responses cannot expose the prior account's private registration data.

### R06 - Permission and integrity contract

T01 implements [ADR 0011](../../docs/decisions/0011-atomic-pickup-contract.md):
read-only authenticated pickup tables/name projections, request-keyed RPC writes,
row-locked capacity/lifecycle transitions and expected-revision score corrections.
Retrying an identical request returns its original receipt; different payloads
cannot reuse the same key. Clients then reread current state. Direct table writes
are denied even to organizers. Guest occupancy and account places share one limit.

Define visibility and enforce it in the server, not only UI. Anonymous and
two-account requests prove allowed reads and rejected identity spoofing,
cross-owner mutations and invalid lifecycle/capacity operations. Profile/global
roles remain separate from organizer permissions. Use a disposable local backend
and preserving migrations; do not assume the hosted schema matches local files.

### R07 - Useful experience and acceptance

Use clear, energetic basketball presentation consistent with the existing Expo
structure; do not advertise deferred features. Verify discovery, creation,
joining/leaving, capacity races, cancellation, account isolation and network
recovery locally and on the agreed iPhone/Expo Go target. Define pilot usefulness
criteria and distinguish functional acceptance from unmeasured retention.

### R08 - Register played matches and side-level scores

Allow registration of an already-assembled 1v1, 2v2 or 5v5 match at a known court,
without requiring a prior invitation, a permanent team or court membership.
Keep invitations, registrations and actually played matches distinct, including
matches arising from an invitation. Record two temporary sides and a final score
without attributing individual points. A closed invitation must not automatically
generate a win, a result or verified attendance.

The organizer may include guests without accounts alongside registered players
in the played-match record. Clearly distinguish a guest from a linked user;
do not create accounts, claim verified identities, or assign a guest's result to
an existing account automatically. Exact guest representation and identity-linking
UI remain to be designed without collecting unnecessary personal information.

The organizer enters the final score after play. Label it as organizer-declared;
it does not grant ranking points or claim independent verification.
Live recording and scorer permissions are deferred and must not
be required by this delivery's server contract or acceptance.

T05 supplies standalone match creation, optional linking from an organizer-owned
started/closed invitation, and organizer-owned match list/details. Choose exact
1/2/5 players on each temporary side, linking a known account through a bounded
display-name lookup or entering a guest label (1-40 characters). Names/IDs only
are returned by authenticated lookup; no private profile/contact fields. Duplicate
registered players are rejected across sides. No automatic roster assignment.
Creation is a separate explicit operation and can be resumed before final scoring.
Both create and score persist account/backend/scope-bound request UUID/payload
before transport; uncertain retries reconcile current match, roster and history.
Fresh score writes require an explicit confirmation and current revision;
conflicts require refresh and review, with no silent overwrite or retry rebasing.

Saving a final score closes the match in the same server-confirmed operation.
For a match linked to a started invitation, that operation also closes the source
invitation so its court report ends; corrections never reopen either record.
Only its organizer can submit or correct the result. Corrections retain prior
and new scores plus server-recorded change time; they do not reopen registration
or overwrite history. Validate side scores as non-negative integers and make
retries idempotent so they do not duplicate result/history entries. No game clock,
individual scoring or automatic ranking/winner calculation is required.

## Acceptance

- A01 / R01: agreed rules, exclusions, baseline and validation plan are recorded;
  product questions are resolved before dependent behavior is implemented.
- A02 / R02: real local sessions can be found and inspected; empty/read-failure
  states recover without invented activity or live-presence claims. Two-account
  court views reflect explicit start and closure, with start time and reported
  status, foreground refresh and recoverable read failures. Full invitations,
  past planned times, cancelled/completed direct details, safe rosters and
  non-owner read-only controls are covered.
- A03 / R03: valid creation and owner-only lifecycle actions work; invalid input
  and non-owner edits fail; participants can see cancellation.
  Only the organizer starts play; passing the planned time does not auto-start.
  The initial form ends at timing; Plan ahead reveals its fields, Now opens
  quick setup preserving court/format. Test both paths and saved-request retry.
  T02 additionally verifies retained input on failed create, request-key replay
  after uncertain transport/readback, account-scoped pending storage, real-date
  validation, locked core edits and explicit confirmation for lifecycle changes.
- A04 / R04: join/leave/rejoin and uncertain-response retry preserve one intended
  registration; two callers racing for the last place cannot overbook.
  T04 additionally covers leave confirmation, blocked opposite actions during
  uncertainty, saved retries after remount, failed readback, current-state
  messaging after receipt replay, storage failures and stale-reader disabling.
  Test 2/4/10 fixed capacities, present guests and a playing organizer without
  double counting. A 2v2 with two present players has two remaining places. Joining
  or leaving after explicit start fails, including concurrent start/join races.
- A05 / R05: reopen/refresh and A -> B -> A retain correct personal data, including
  cancellation; late requests do not cross identities. Organizer/participant
  overlap appears once; leaving removes only the caller's registration while
  cancelled/started/completed states persist in personal sessions.
- A06 / R06: reproducible local contract and permission cases pass for anonymous
  and two authenticated accounts; original court records remain preserved.
- A07 / R07: complete functional/error journey has dated browser and iPhone
  evidence; pilot findings or unmeasured usefulness limits are explicit. Static
  checks alone cannot close this specification or prove player retention.
- A08 / R08: an already-assembled match can be recorded without a prior invitation;
  temporary sides/final score persist with organizer-only recording permissions,
  validation and recoverable errors. Results are labelled as declared. A session
  alone creates no result, individual stats or ranking credit. Live updates are
  not required for this acceptance.
  Guest participants can be included without accounts and remain distinct from
  linked users; invitation registration still rejects anonymous callers.
  Saving closes the match atomically; organizer-only corrections preserve the
  previous score/history and remain closed. Retry must not duplicate history.

## Acceptance plan and operational preparation

All three catalog records remain selectable; pilot activity targets Parque Rodo
and Palermo without changing or merging catalog data. No extra catalog curation
or verified real-time court availability is claimed.

T06 verifies focus changes during organizer writes: loading saved state must not
erase an in-flight request, and revisiting a finished write must not leave its
controls permanently busy. The problem-report entry point lives in Profile,
uses a separately configured owner email, and opens a draft with manually filled
reproduction prompts only. Failed email handoff has a visible retry and selectable
contact; a missing contact hides the entry instead of inventing one.

Use a user-initiated email report/support entry point and the supplied owner-managed
contact, configured separately from repository evidence. Never send automatically
or attach private account fields. A moderation dashboard is outside this delivery.

Acceptance requires A01-A08 against the local backend, browser and existing
iPhone/Expo Go target. Use anonymous and two authenticated callers for permissions;
exercise immediate/future invitations, guests, races, cancellations, retries,
account isolation and final-score correction history. Preserve original courts
and distinguish owner-reported device evidence from agent observation.

The pilot should observe finding/joining games and organizer result recording.
Recruitment and the pilot date remain operational preparation, not participation
evidence. Record real usage findings separately; attendance and retention remain
unmeasured until observed. No numerical retention threshold blocks functional
acceptance. Static checks alone cannot close A02-A08.

## Owner delivery boundary - 2026-10-13

Completing SPEC-002 does not finish the MVP or authorize another phase. Stop
after this specification until the owner explicitly instructs continuation
and SPEC-003 is ready. Additional design/functionality improvements may be
defined there before MVP completion. Do not plan post-MVP work, beta or launch.
