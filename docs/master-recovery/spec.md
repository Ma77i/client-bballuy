# Master working-tree recovery

## Scope and acceptance

R1: Exclude dependency installations, Expo output, verification caches and local
Supabase CLI caches from Git without deleting local files.
R2: Restore the seven files removed by commit 597bdd9 from its parent 92d1628.
R3: Preserve existing tracked source and record branch divergence and check limits.

Acceptance: git status lists only the ignore rules, restored files and this
recovery specification; git ls-files -u is empty; dependency paths are ignored.
This task does not reconcile unrelated histories, merge feature/init, change
application behavior, publish changes or certify the historical application.

## Authorized branch preparation

R4: Preserve both known master histories with a merge, without force pushing or
rewriting existing commits. The cached origin/master tree matches 92d1628.
R5: Keep feature/init intact and verify that its complete changes merge into
master without conflicts. Publication requires working repository access.
Acceptance: both original master tips are ancestors of prepared master and a
merge-tree preview with feature/init succeeds. Master remains the historical
baseline until the feature PR is merged.
