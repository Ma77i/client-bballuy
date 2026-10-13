# BBallUY product vision and next MVP discussion

Recorded 2026-10-12 from the owner's product discussion. This is an idea backlog
and a recommendation, not an approved implementation specification or roadmap.
The current accepted local scope remains SPEC-001. The owner subsequently
confirmed players seeking to join as the initial audience and deferred iOS beta
until after the next MVP. [SPEC-002](../specs/002-player-pickup/spec.md) now captures
the session/match journey, now ready after T00; [ADR 0010](decisions/0010-player-first-next-mvp.md)
records the confirmed audience/order. Other suggestions remain unapproved.

## Owner direction

The existing mini MVP covers authentication, discovering courts and following
them through persistent court community membership. The broader ambition is an
app people enjoy using and want to return to because it connects basketball,
community, competition and a strong visual identity.

Requested ideas to preserve:

- Public and private teams, captains, team profiles and their members' profiles.
- A group social feed. Captain-only posting versus member posting is undecided.
- Games, championships and formats including 1v1, 2v2 and 5v5, with room for more.
- A carefully defined way to register games and their results.
- Rankings, statistics, medals, cups and other rewards. Examples include app
  activity, games played and games won; none has an approved scoring rule.
- Attractive, energetic design inspired by basketball, NBA presentation, video
  games and animation. These are creative references, not licensed assets.
- A more useful, realistic MVP before attempting the complete vision.

## Product hypothesis

Recommendation: prioritize helping a person find or organize a real opportunity
to play. The proposed repeat loop is discover a court, find an upcoming session,
join, play, and find the next session. Team identity and rewards can strengthen
that loop later. Their effect on retention is unverified.

Court discovery alone may offer few reasons to reopen after choosing a court.
This is a hypothesis to test with players, not an observed analytics finding.
Validate the problem with one reachable court community and its organizers;
the initial city, courts, audience and recruitment method remain undecided.

## Proposed next product MVP: organize a pickup session

This is a proposal for a future feature specification, independent of making
the future work of making the client distributable through an iOS beta.

Example: a player publishes a Saturday 18:00 session at a known court with a
format and a limited number of places. Other players can join or leave, see
whether a place remains, and find their upcoming sessions. The organizer can
cancel and participants can see that cancellation when opening the app.

Small candidate scope:

- Existing account, minimal player profile, court discovery and court memberships.
- Upcoming sessions attached to a court: organizer, date/time, format, capacity
  and a short description. Avoid requiring a permanent team to participate.
- Join/leave with server-enforced capacity and duplicate prevention; an organizer
  counts toward capacity only if explicitly registered as a participant.
- My upcoming sessions and clear scheduled, cancelled and completed states.
- An organizer marks the session as finished. This does not certify attendance,
  a played match, a winner or a ranking result.
- A shareable invitation if it can be kept inside the agreed scope. Otherwise
  organizers can recruit through their existing channels during the pilot.
- A lightweight reporting path and a named person responsible for handling
  reports before public participation. Exact visibility and moderation rules
  need product acceptance.

Do not promise push reminders, live court presence, reserved court access,
balanced teams or a guaranteed game. A planned session is an invitation, not
proof that the court is available or participants will attend. Offline actions
must not display confirmed places before server confirmation.

Proposed exclusions: permanent teams, free-form social feed, chat, competitive
rankings, individual performance statistics, tournaments, paid rewards and
automatic matchmaking. Push reminders are useful but add delivery and consent
work; choose them separately if the pilot demonstrates the need.

The owner should choose whether the first experiment is this organizer-led
pickup flow or a simpler court availability announcement ("I plan to play at
18:00"). The announcement needs fewer rules but offers less certainty about
numbers. A team-first MVP is an alternative when the initial audience consists
of established squads; it has more membership and permission work.

## Games and results: define distinct concepts before implementation

Recommendation: distinguish a planned session, its participant registrations,
actual attendance, and any matches played during it. One afternoon can contain
several matches, changing sides and substitutes. A registration is not attendance
and one session is not automatically one competitive match.

A future match needs a format, participants on each side, scoring rules, status
and an optional result. Permanent teams should not be mandatory for 1v1 or
temporary pickup sides. Whether 5v5 requires ten registered players, supports
substitutes or allows several games is an open product rule.

Suggested future result flow: proposed result, confirmation by the opposing
side, confirmed result or dispute. Pending, disputed and cancelled results must
not count toward competitive rankings. Captains may confirm for permanent teams;
individual or pickup games need an explicitly chosen representative mechanism.
Corrections, duplicate matches and abuse prevention need server rules and tests.

Start with participation and an agreed final score, if validated as necessary.
Individual points, assists and rebounds require a reliable recording process;
do not infer them from attendance or let unverified self-reports establish rank.
No database model, migration or result authority is approved by this discussion.

## Teams and group activity

Public discovery, roster visibility and admission are separate decisions. A
discoverable team can require approval; a private team may use invitations and
restrict its roster. Define these meanings rather than relying on one label.

Proposed team roles: member and captain scoped to a team, separate from global
administrators. Decide captain transfer, multiple captains, departures, removal
and the last-captain case before implementing membership changes.

Feed options to revisit:

- Captain announcements: simpler governance; useful for schedules and team news.
- All-member posts: more conversation, plus reporting and moderation work.
- Hybrid: captain announcements plus member replies or reactions. Recommended
  as a later limited experiment if organizers need communication inside the app.

No feed publishing policy is confirmed. Team membership depending on court
membership remains undecided, consistent with the existing product document.

## Motivation, competition and rewards

Recommendation: reward useful basketball participation and community behavior,
then test whether people value those rewards. App-opening counts and forced
daily streaks can reward empty activity rather than helping people play.

Candidate progression: first attended session, participation across several
weeks, organizing sessions that actually happen, and welcoming newcomers.
Attendance-based awards need a credible attendance mechanism before release.
Wins and cups should depend on confirmed results. Avoid popularity rewards that
pressure users to expose personal information or penalize less active players.

Later ranking options: participation, confirmed wins, or a skill rating. These
answer different questions. Wins alone favor frequent players; skill ratings
require enough trustworthy results and rules for mixed formats and opponents.
Prefer separate seasonal/format categories if competition is introduced, with
a published scoring explanation and correction/dispute handling.

Do not combine 1v1, 2v2 and 5v5 into an unexplained universal score. Give casual
players useful participation recognition even if they never seek a ranking.
Reward thresholds, seasons, eligibility and anti-abuse rules remain open.

## Visual direction

Recommendation: combine strong sports typography, clear court/session cards,
high contrast, an expressive accent color and original basketball illustrations.
Use motion for meaningful moments such as a confirmed registration or earned
award, while respecting reduced motion. Keep navigation and loading/errors clear.

Explore two original directions later: street basketball (court texture,
neighborhood identity and illustrated players) or arcade competition (bold score
panels, collectible badges and energetic transitions). A hybrid can work if
there is one consistent typography, palette and icon system.

NBA, games and cartoons are inspiration for energy and presentation. No specific
brand palette, character, logo, image or final design has been selected. Avoid
clutter, autoplay spectacle, unreadable type and constant reward interruptions.
The current mini MVP must continue to describe only available functionality.

## Pilot evidence and next decisions

Before approving implementation, ask players how they currently arrange games,
what makes arrangements fail, and whether they would organize or join a session
in this app. Recruit organizers as well as attendees so the pilot has activity.
An empty feed or session list is not a meaningful retention experiment.

Proposed success evidence: real sessions organized, whether they happened, players
who attended and returned to another session, organizer reuse, and the reasons
people cancelled or stopped using the app. Registration counts and screen time
alone do not establish basketball value. Define a pilot period, denominators,
consent-aware collection and acceptance thresholds before collecting metrics.
No target percentage or retention outcome is claimed.

Next concrete task: SPEC-002/T03, public upcoming-session discovery;
T01 local contracts and T02 browser organizer UI are verified.
T00 rules are confirmed, including guests, fixed capacity, explicit start and
final-result corrections with history. The feature specification contains requirements, acceptance, permissions,
integrity rules and task dependencies. Other alternatives above are retained as
discussion history, not equal-priority next actions. This backlog is not a task list.

## Scorekeeper and instant game discussion

Owner input, 2026-10-12: start at Parque Rodo and Palermo; any authenticated user
may organize; sessions are discoverable and joinable regardless of court
membership. Organizer and available places are visible to authenticated users.
The owner receives reports. Participants can leave until start; after registration,
changing court/time/format requires cancellation and a new session. The owner
requested 1v1, 2v2 and literally 3v5, pending clarification of the last format.
Instant and future games are desired; the meaning of instant remains open.

Assessment: a non-playing scorekeeper is feasible and can let players concentrate
on playing while preserving a shared score. It introduces a distinct session or
match permission, separate from organizer, player, captain and global roles.
It also introduces side assignment, scoring rules, correction/undo, concurrent
updates, connectivity/retry behavior and a clear end-of-match operation. Keeping
score does not by itself make a result trustworthy for competitive rankings.

Recommendation, not approval: after the join-session flow, try a small optional
scoreboard with two temporary sides, one designated scorer, score increments and
undo. The scorer does not occupy a playing place. Do not require every session to
have a scorer; organizers may also choose not to play. Whole-side scoring is a
smaller experiment than recording each player's points, assists or rebounds.
Future ranked results need confirmation/dispute rules even if a scorer exists.

An instant invitation (start now, still looking for players) can reuse much of
session discovery/registration with explicit joinability rules. Recording a
match for already-present players needs a separate participant/result workflow.
Do not equate either action with verified live court presence. Avoid making the
existing player-first MVP depend on a competitive match recording system.

## Owner clarification: invitations and played matches

On 2026-10-12 the owner corrected formats to 1v1, 2v2 and 5v5, chose participant
display-name visibility for all authenticated users, selected an email support
channel they handle, and approved explicit playing/non-playing organizer choice.
The actual contact address is kept out of repository documentation and logs.

Both immediate flows are desired: invite more players now, or record a match
among already-present players. The latter should support a side-level final
score, optionally recorded live by a non-playing scorer; individual point
attribution is unnecessary. The previous invitation-only minimum was an assistant
recommendation, not a product constraint. SPEC-002 now includes these desired
flows in its draft; participant identities, result authority and the first live
scoring delivery slice remain open.

Subsequent T00 closure supersedes those open questions: guests are allowed in
played matches, app joining requires an account, the organizer declares the final
score and saving closes the match. Organizer corrections retain history. Live
scoring is later work; 2/4/10 capacity includes present players and start is explicit.

Recommendation: offer understandable actions such as find a game, organize a
game (now or later), and register a played game. Keep invitation state and actual
match results separate internally while presenting familiar basketball language.
A smaller first delivery can include final-score entry and defer live updates;
that sequencing requires agreement and is not imposed by this discussion.

## Earlier documentation check context

The owner explicitly confirmed guest players without accounts in played-match
records. App-based joining of invitations still requires an account. Guest
records must stay distinct from linked users; no automatic account creation or
unverified assignment of old results to future accounts is implied.

Environment: Windows / PowerShell, repository workspace, 2026-10-12.
Initial reading: README.md, docs/status.md, docs/workflow.md, docs/product.md,
docs/README.md and the existing core specification. Existing working changes
were preserved. Current specification numbering and check results are recorded
in [SPEC-002 verification](../specs/002-player-pickup/verification.md).

Change scope: this idea record and discovery links only; no application,
database, release configuration, feature task states or approved scope changed.
Run `npm.cmd run verify` from the repository root for documentation/client checks.
Result: `npm.cmd run verify` passed documentation link checks (36 Markdown files,
two registered specifications), client TypeScript and lint with exit code 0.
This verifies the documentation change, not the proposed product experience.
No user research, UI design,
retention measurement, device acceptance or hosted inspection was performed.
