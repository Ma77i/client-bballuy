# Read the project from your phone

Open this documentation on GitHub in your phone's browser. Start here and follow
the links below; a local C: drive link cannot open the computer's files on a phone.
If GitHub asks you to sign in, use an account with access to this repository.

## Reading order

For the current organizer UI, start the computer preview with
`npm.cmd run db:local:device`. On the same Wi-Fi, open
`http://YOUR_PC_WIFI_IP:8090/_expo/loading?platform=ios` in iPhone Safari and
choose Expo Go. Sign in to the local preview, then open Play -> Organize a game.
The computer and local backend must remain running. localhost on an iPhone
refers to the phone itself. See
[the organizer evidence](../specs/002-player-pickup/verification.md) for scope.

1. [Current status and open issues](status.md): read the newest dated section
   first. Older entries explain previous findings and may already be superseded.
2. [MVP specification](../specs/001-core-journey/spec.md): the intended account,
   court discovery and community membership experience.
3. [Implementation plan](../specs/001-core-journey/plan.md): the sequence and scope.
4. [Task tracker](../specs/001-core-journey/tasks.json): authoritative task states,
   dependencies and completion criteria. GitHub displays this as structured text.
5. [Verification evidence](../specs/001-core-journey/verification.md): what was
   checked, when, and what the results do not establish.

## Guides and decisions

- [Documentation index](README.md)
- [Development setup](development.md)
- [Local database guide](../local-backend/README.md)
- [How specification-driven work proceeds](workflow.md)
- [Agent instructions and checks](harness.md)
- [Map proposal and unresolved choices](decisions/0002-court-first-mvp.md)

## Publication scope

The September 21, 2026 prepared publication on codex/docs-mobile-access is a documentation
snapshot. It includes specifications and reviewed database inspection evidence.
Application changes, executable test tooling and local database migrations remain
in the development working copy and are not published by this documentation-only
update. Recorded test results describe that working copy, not the older application
code inherited by this branch. This branch is for reading, not a runnable T02 release.

Upload status on September 21: prepared and committed locally, but the push was
rejected because the connected GitHub account lacks write permission on the
existing repository. Phone access to this branch is pending successful upload.

No app deployment, remote database migration or repository visibility change is
part of this publication. Later documentation edits need another commit and push
before they appear on your phone; GitHub is not a live view of uncommitted files.

## Continue through the conversation

You can ask for a task explanation or a plain-language status here at any time.
To resume implementation, ask the agent to read the project instructions, work on
the next available task within its confirmed scope, run the required checks and
record the evidence. Product choices still marked as proposals remain undecided.
