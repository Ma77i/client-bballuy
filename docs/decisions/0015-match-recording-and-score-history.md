# ADR 0015 - Explicit matches and declared final scores

Status: accepted for the SPEC-002 local slice, 2026-10-13.

T05 (formerly T06) adds standalone match creation, optional links from owned
started/closed invitations, account/guest selection and owned match/result views.
Temporary sides have exactly 1/2/5 players. Bounded authenticated display-name
lookup returns only IDs/names, with literal substring search and at most 20
results; profile/contact fields remain private. Linking accounts is organizer
declared and grants no statistics, ranking or attendance verification.

Use existing request-keyed create_match and score RPC actions. Persist payload
and UUID by backend/account/create-or-match scope before transport. Read back
the current match, roster and revision history before confirming success.
Revision conflicts clear the rejected operation and require refreshed review
and explicit confirmation; never rebase or overwrite automatically.

An incremental local migration extends score closure to a linked started
invitation in the same transaction, removing its reported court activity.
Corrections retain closed state/time and immutable previous/new score history.
No remote migration, live scoring or automatic ranking is introduced.

Completing SPEC-002 is a delivery checkpoint, not MVP completion. Stop before
another specification unless the owner requests continuation and SPEC-003 is
ready; no post-MVP or beta planning is part of this decision.
