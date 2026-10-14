# T04 owner closure — 2026-10-14

Owner explicitly authorized closing SPEC-003/T04 and starting only T05 on the current
SPEC-003/design branch, preserving local changes. T04 is done by this approval with
the reproducible evidence in t04-verification.md, t04-final-refinement.md and
t04-map-target.md. Available evidence: verify, 106 client tests, local browser account/
membership/location journeys and complete iOS compilation. The final location action
selects Map, current court marker and compact preview using real catalog coordinates.

No additional native test is inferred from closure. Physical iPhone camera/gestures,
VoiceOver, Dynamic Type, interruption and composer cases remain unobserved in
t04-iphone-review.md; retain them for the separate T06 gate. No production/release,
remote migration, commit/push or T06 authorization is implied. Earlier in_progress
statements remain historical evidence of their dates and are superseded here.
