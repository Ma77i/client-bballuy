# Targeted security investigation and update proposal

## Current owner decision — 2026-10-16

Owner formally approved the four secondary game screens and closed T05 for
implementation and visual acceptance. T00–T05 are done; T06 remains todo,
planning only, awaiting authorization. SPEC-003 remains open. This latest status
supersedes older pending-review/dependency-authorization statements below.
See [T05 closure](t05-closure.md), [exact security patch](security-patch-verification.md)
and [proposed physical T06 checklist](t06-plan.md). Native validations remain
pending; no physical tests, commits, push or SPEC closure are claimed.


Date: 2026-10-16. Status: **analysis/proposal only; dependency change awaiting separate owner authorization**. No package.json, package-lock.json or installed dependency was changed. This is not a general security remediation or a clean-audit declaration.

## Findings across the 49 alerts

The current recorded npm audit includes 49 affected package entries (1 low, 15 moderate, 32 high, 1 critical). Inherited package findings and multiple advisory/range entries must not be counted as 49 independent attacks. Every package's actual lockfile node/version, advisory chain, triage area and production-iOS source presence is preserved in [investigation evidence](security-investigation-evidence.json); original full advisory metadata is in [audit evidence](security-audit-2026-10-16.json).

Categories reviewed: bundler/filesystem/pattern matching (Metro, braces/globs/watchers); configuration/lint/transforms (Babel, humanfs, AJV, flatted, YAML); native XML/signing (xmldom, node-forge, xcode and Expo wrappers); CSS/source-map tooling; development websockets; navigation/URL parsing (query-string/decode-uri-component/router); and SDK packages inheriting their parents' findings. Direct SDK findings are often metadata propagation, not separate demonstrated runtime vulnerabilities.

The production iOS map contains source entries for 12 of the reported packages, including query-string/decode-uri-component, the router and SDK/native libraries. Treat navigation/untrusted URI parsing as a separate runtime candidate for focused analysis. Source-map inclusion does not demonstrate an exploitable call; missing source entries do not certify CI, web, Android or native binaries. Signing/Metro/file parsing remain tooling risks when processing untrusted project/input files. No malicious input or shell exploit was executed.

Do not accept npm's suggested Expo44/React Native0.72 or other broad downgrades as a compatible fix for the current Expo57/RN0.86 project. The picker finding is inherited via Expo, with no independent picker advisory in this report. No unrelated package should be updated as a side effect of the critical patch.

## Critical shell-quote chain and affected environments

Installed/locked path: project → react-native0.86.3 → react-devtools-core6.1.5 → shell-quote1.10.0. The direct parent declares ^1.6.1, which permits the patched 1.11.0. npm metadata confirms 1.11.0 is published, MIT licensed and declares Node >=0.4, consistent with the old parent engine floor. This does not by itself certify behavior/Expo compatibility.

React Native's installed setUpReactDevTools.js imports react-devtools-core inside __DEV__. Its normal backend entry's source map has no shell-quote source. The separately bundled desktop standalone DevTools source map embeds an older shell-quote implementation; its src/editor.js imports parse to launch editors through Node child_process. That embedded copy is not the separately installed 1.10.0 module, and a lockfile update cannot rewrite an already bundled vendor file.

A fresh production iOS full-entry export with source maps inspected 3640 source entries: **zero shell-quote entries and zero react-devtools-core entries**. Therefore no critical quote-function path was observed in this iOS production JS graph. Expo Go/development includes DevTools instrumentation, and Node/desktop development tooling is the relevant dependency surface; package installation classification as prod is not proof the shell code ships in the release app. Metro loads the package tree during packaging, but mere installation is not execution of quote. No direct application import of shell-quote was found. Android/web release graphs and a distributed binary were not audited here, so no blanket runtime-safety claim is made.

The advisory affects a specific quote/comment/line-terminator combination, with a fix in1.11.0. The inspected embedded editor imports parse, not quote; the critical function's exploitation was not demonstrated. npm calls this critical while the maintainer page rates it high/8.1. Sources: [maintainer advisory](https://github.com/ljharb/shell-quote/security/advisories/GHSA-pqg4-j6r4-53mv), installed package/source maps and the recorded npm query. Avoid treating an audit classification as proof of a remote mobile compromise, or treating dev-only code as automatically safe.

## Proposed smallest compatible change — not executed

Request specific authorization to update **only the shell-quote transitive lock resolution from1.10.0 to1.11.0**, within the existing parent semver range. Keep Expo, React Native and react-devtools-core versions unchanged. Prefer a targeted lock resolution, no new direct dependency and no override unless a reproducible resolver constraint requires another reviewed proposal. Do not run audit fix --force, general upgrades or edits to vendored/minified dependencies.

On authorization: capture baseline; perform targeted package resolution/install without lifecycle scripts where feasible; inspect the diff before accepting it. Abort/re-propose if any SDK versions or unrelated packages change. Check resolved dependency tree, package/lock integrity and Node engine compatibility. Run verify, all client tests and relevant browser scenarios, production iOS/Android exports, a focused development startup/DevTools smoke test and fresh npm audit. The critical should disappear; report actual remaining counts instead of assuming48. Keep the embedded standalone editor copy a separate vendor/tooling assessment, not a claim that patching the installed module rewrites all vendored code.

## Residual risk and approval boundary

All49 entries remain unresolved in the installed lockfile at this proposal stage. No fixes were applied. iOS graph evidence narrows the observed release-JS surface; developer/CI exposure, embedded DevTools code and other runtime parsers still need risk ownership. Updating shell-quote alone will not resolve all other high/moderate advisories. A production-readiness decision remains separate from SPEC-003 visual acceptance. This proposal must be explicitly approved before any dependency changes; T06 and SPEC closure remain unauthorized.
