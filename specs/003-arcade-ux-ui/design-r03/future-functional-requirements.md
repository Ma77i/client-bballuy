# Future functional requirements — outside R03

These are proposals, not authorization, implemented capabilities or new SPEC-002
contracts. Plan each separately with permissions, persistence, acceptance and tests.

- User-uploaded avatar: upload/remove/crop, storage rules, privacy and fallback.
- Profile editor: editable fields, validation, authorization, persistence/conflicts.
- Additional account details: explicit schema and visibility decisions, never
  invented fields on today's Profile board.
- New player discovery/search, social invitations and acceptance flow, or expanded
  guest-player management: separate product requirements and server permission work.

SPEC-002 already has restricted account lookup and assembled-match participant/
guest handling. Preserve those existing verified journeys; this future list does
not authorize removing them or falsely label all guest handling as unimplemented.
R03 adds no social controls to the five discovery/account boards.

Visible Mis canchas means saved courts. Existing internal membership models/hooks,
contracts and security remain unchanged. A domain migration away from those models
would require separate authorization; terminology refinement is not such a migration.
