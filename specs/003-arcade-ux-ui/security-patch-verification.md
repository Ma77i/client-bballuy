# Authorized shell-quote patch verification

Date: 2026-10-16. Owner authorized exclusively the transitive shell-quote
1.10.0 → 1.11.0 update. This report supersedes the authorization/unpatched status
in the historical security proposal, while retaining its investigation limits.

## Change and compatibility

Updated only the shell-quote lock node (version, registry URL and published SHA512
integrity); npm install --ignore-scripts --no-audit --no-fund installed one changed
package. No direct dependency or override added. Semantic comparison of every
lock node against the captured pre-update lock found exactly one changed node:
node_modules/shell-quote. package.json and all application/test/backend sources
match the pre-update hashes. Expo57, React Native0.86.3 and react-devtools-core6.1.5
remain unchanged; the parent's ^1.6.1 range admits1.11.0. MIT/Node>=0.4 unchanged.
An initial offline install could not find the new tarball in cache; online install
then succeeded. No lifecycle scripts or general updates were run.

npm ls shell-quote resolves the exact1.11.0 version. A safe in-process check passed
ordinary quote/parse round trip and rejection of all four line terminators after
a comment token. No generated shell command was executed.

## Fresh audit

npm audit --json completed with exit1 because findings remain: **48 affected
packages: 0 critical, 32 high, 15 moderate, 1 low**. The shell-quote finding is absent;
no other package finding disappeared. Counts include inherited findings, not48
independent vulnerabilities. Full reproducible advisory/range/affected-node data:
[post-patch audit](security-audit-after-shell-quote-2026-10-16.json).
Baseline remains [original audit](security-audit-2026-10-16.json).

## Residual environment risks

- Development: lint/config/transforms, filesystem/glob/watchers, dev websockets
  and desktop DevTools process potentially untrusted local inputs. The separately
  vendored DevTools standalone shell-quote copy is not rewritten by this lock patch;
  its editor uses parse, and vulnerable quote reachability was not demonstrated.
- Compilation/CI: Metro/CSS/source maps, XML project parsing and signing wrappers
  remain affected through their dependency chains. Installing a tool is not proof
  its vulnerable operation ran; no CI/desktop exposure blanket clearance is issued.
- Application execution: query-string/decode-uri-component/navigation URI handling
  remain runtime candidates requiring focused reachability analysis. SDK/native
  package findings may be inherited, not separate proven executable defects.
  iOS JS source presence does not prove exploitability; absence does not clear
  Android, web, native binaries or development tools.

Remaining affected packages grouped by the earlier investigation (not mutually
exclusive environment guarantees):

- transforms / lint / configuration parsers: `@babel/core`, `@humanfs/node`, `ajv`, `flatted`, `js-yaml`.

- SDK or inherited package finding: `@expo/cli`, `@expo/config`, `@expo/config-plugins`, `@expo/inline-modules`, `@expo/local-build-cache-provider`, `@react-native-community/datetimepicker`, `@react-native/community-cli-plugin`, `@react-native/virtualized-lists`, `expo`, `expo-splash-screen`, `react-native`, `react-native-maps`, `react-native-reanimated`, `react-native-worklets`, `uuid`.

- native configuration / XML / signing tooling: `@expo/code-signing-certificates`, `@expo/prebuild-config`, `@xmldom/xmldom`, `node-forge`, `xcode`.

- bundler / filesystem / pattern matching: `@expo/metro`, `@expo/metro-config`, `@expo/metro-file-map`, `@react-native/metro-config`, `brace-expansion`, `braces`, `chokidar`, `fast-glob`, `metro`, `metro-config`, `metro-file-map`, `metro-transform-worker`, `micromatch`, `minimatch`, `picomatch`.

- navigation / URL parsing: `@react-navigation/core`, `decode-uri-component`, `expo-router`, `query-string`.

- CSS / source-map tooling: `postcss-selector-parser`, `source-map-js`, `tailwindcss`.

- development websocket tooling: `ws`.

## Verification boundary

Client tests: npm run test:client **117/117 PASS** after installation.
Further final verification/export results are recorded below after completion.
Physical iPhone tests were not executed. No Android export or standalone DevTools
interactive test is claimed. No further dependency fixes are authorized. Remaining
risk disposition is separate from T05 visual/implementation acceptance and SPEC closure.

## Completed local checks after patch

Environment: Windows, Node24.16.0, npm, existing SPEC-003/design dirty checkout;
local-device Expo preview with .env disabled and local backend only.

- npm run verify: PASS, documentation104 Markdown files, app typecheck and lint.
- npm run test:client: PASS117/117, no failures/skips.
- npm ls shell-quote: exact1.11.0 under react-devtools-core6.1.5/RN0.86.3.
- npm audit --json: exit1 with48 findings, critical0; full report linked above.
- Native production graph export: EXPO_NO_DOTENV=1 EXPO_OFFLINE=1 CI=1,
  workspace-local TEMP/TMP, npx expo export --platform ios --source-maps
  --output-dir .harness/shell-quote-patch-ios --max-workers 2: PASS3656modules,
  35assets, Hermes bundle5.6MB. Its3640-source map includes zero shell-quote or
  react-devtools-core source entries. This is a JS/asset export, not an IPA build,
  installation, device test or signed native binary audit.
- Preview startup: local-device launcher started Metro8090 successfully. Expo's
  suggested SDK patch/other package updates were left untouched.
- git diff --check reports pre-existing EOF/CRLF whitespace in Play, CreateInvitation,
  DiscoverGames, FormatChoices and dropdown. Those source files are byte-identical
  to the captured pre-patch baseline; unrelated cleanup was not introduced.

Only package-lock.json and SPEC/status documentation changed during this follow-up;
application code, package.json, contracts and backend remain byte-identical to the
captured baseline. Dependency/cache/generated local artifacts are not app code changes.

- Post-patch browser regression: tests/browser/t05-final-corrections.js completed
  all10 grouped checks (synthetic isolated auth/REST/RPC, zero real backend writes).
  Covers court CTA contrast, five personal lifecycle states, history empty/retry,
  pending score, same-request replay after uncertain response, revision conflict
  recovery, owner permissions, registration account/guest roster and320px layout.
  Current captures are in t05-final-corrections-evidence. Initial attempt found
  preview offline; the next cold-load navigation timed out during Metro compilation;
  the warm rerun completed successfully. Neither failed setup is counted as a pass.
- Final npm run verify:docs after documentation updates: PASS104 Markdown files.
