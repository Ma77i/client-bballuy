# Verificación de SPEC-001

## Scope revision — 2026-09-19

The current acceptance journey is account → court discovery → persistent court community membership. Team creation and team joining are deferred. A08/A09 below replace the previous, unexecuted team scenarios. Historical T00/T01 evidence remains unchanged and is not proof of the new functional requirements. No native map, membership migration or remote change was implemented during this revision.

## Alcance de esta evidencia
Documentation/static checks are distinct from product acceptance. T01 establishes
the client baseline; T02 now establishes the local data-contract portion of A02
from owner-supplied remote exports. No hosted writes or mobile-device checks were
performed. A03–A10 remain unaccepted. The dated entries distinguish local SQL/API
tests, earlier remote read-only probes, source evidence and unverified behavior.

## Entorno inicial
Windows/PowerShell, Node.js 24.16.0, npm 11.13.0. Dependencias ya instaladas. Deno y Supabase CLI no encontrados en PATH. Fuente: inspección local durante la recuperación del 2026-09-17 (Uruguay).

## Escenarios de aceptación pendientes

### A01 — R01: controles
Desde una instalación reproducible, ejecutar `npm run verify`; esperar documentación, tipos y lint del cliente sin errores. Para Edge Functions afectadas, ejecutar `npm run verify:edge`. Registrar versiones y avisos. No confundir este escenario con una compilación móvil.

Para el arranque local, ejecutar `npm start -- --offline` y comprobar que Metro queda esperando conexiones sin `ExpoMetroConfig.loadAsync is not a function` ni solicitud de instalar `@types/react-native`. Ejecutar `npx expo install --check` para contrastar dependencias; si solo se puede verificar sin red, registrar ese límite. Detener el servidor al terminar. Este control no demuestra que la aplicación compile ni funcione en dispositivo.

T01 regression acceptance: `npm run test:client` imports the real profanity utility and checks clean text, case-insensitive detection, masking and the combined validation result. Type/lint checks must accept court search results with id/name only and resolve every collapsible import. No new lint exclusions or dependency installations are required. Device-level court selection and collapsible interaction are not covered by these static checks.

### A02 — R02: base reproducible
En base desechable, preparar esquema siguiendo el procedimiento documentado; comprobar columnas, restricciones, triggers y políticas esperadas. Comparar con el contrato canónico. Registrar comandos/versión de migraciones sin exportar datos personales.

### A03 — R03: autorización
As A, update an allowed field of A's profile: allowed. Attempt to change app_role, modify B's profile/membership or write the curated court catalog directly: denied or unchanged, verified by a subsequent read. Repeat protected mutations without a session. Do not use service-role credentials as the identity under test.

### A04 — R04: registro y acceso
Crear A con credenciales de prueba. Probar respuesta con sesión inmediata y sin sesión por confirmación de correo; no duplicar cuenta ni entrar a perfil sin sesión. Completar verificación según entorno elegido. Probar contraseña incorrecta y reintento válido.

### A05 — R05: perfil
Con sesión y perfil incompleto, completar nombre sin avatar. Entrar a la app y leer el mismo nombre tras recargar. No volver al registro. Validación rechaza nombre inválido y permite corregirlo.

### A06 — R06: sesión
Cerrar el proceso de la app y abrirlo de nuevo: conservar una sesión válida. Probar renovación y sesión revocada en entorno de prueba: volver al acceso sin bucles. Cerrar sesión y reabrir: no quedar autenticado.

### A07 — R07: dos cuentas en el mismo dispositivo
Load profile/My Courts as A, log out and sign in as B. Check the first render and slow-network states: A's private profile, personal court list and notifications never appear as B's data. Intentionally public community information is separate from account-owned data.

### A08 — R08: court discovery
On the chosen native platform, show the same verified courts in the map/list and open details by selecting a marker or list item. Check location accuracy, empty/error states and permission denial. Manual browsing/list remains usable without location. Record provider, library version, build configuration and test device. A browser preview alone does not satisfy this scenario.

### A09 — R09: persistent community membership
A and B independently join the same court without teams. Retry/double-tap: one membership per user/court. Restart: My Courts and membership state persist. Leave, repeat leaving, then rejoin: state remains consistent with no duplicates. A cannot add/remove B's membership or join a nonexistent court. Global roles remain unchanged. No schedule, automatic expiry or physical-presence claim is introduced. If the proposed multiple-court default is adopted, join two courts and verify leaving one preserves the other.

### A10 — R10: errores y funciones provisionales
Interrupt the network while saving a profile, joining and leaving a court. Expect actionable errors, safe retry and reconciliation of optimistic state rather than false success. Verify discovery error/retry behavior. No simulated notifications or fixed fake invitations appear as real events, and any membership counts are not labeled as people currently playing.

## Registro de ejecución

### 2026-09-21 — Documentation access from mobile

Prepared a documentation-only publication on codex/docs-mobile-access, with a
mobile reading guide, a dated summary of current issues and clearer local versus
published-code boundaries. No implementation task state changed. The development
working copy retains its application changes; hosted data and schema are untouched.

Windows/PowerShell, existing Node/npm environment: `npm.cmd run harness:status`
reports T00–T02 done and T03 available. `npm.cmd run verify` passes documentation,
client types and lint. No harness or Edge Function code changed. Database and
device acceptance were not rerun for this documentation-only update.

The publication is assembled in a separate Git worktree with an explicit file
list. It includes Markdown guides, specification JSON, reviewed schema evidence,
read-only inventory SQL and the placeholder environment example. Application
changes, runtime credentials and local verification logs are excluded. A scan of
the selected files found no common token/private-key/credentialed database-URL
patterns; this is a bounded check, not a general secret-detection guarantee.

Relative Markdown file links are checked against the publication itself. The
one link to an unpublished client test is rendered as a code-path reference in
that snapshot. Task evidence paths and executable commands still describe the
development working copy; this documentation branch is not a runnable T02 release.

Publication validation: all 115 relative Markdown file links resolve in the
32-file snapshot. Git created the local documentation commit, but GitHub rejected
the push with HTTP 403: the connected account lacks write access to the existing
repository. A noninteractive attempt with the repository owner's username found
no usable stored credential. No successful upload or phone-accessible branch is
claimed. Resolving account access is required before retrying the same branch;
repository visibility and global credential configuration were not changed.

### 2026-09-19–20 — T02 local reconstruction, typed client and repeatable checks

Received and reviewed the second CSV as
[dependency evidence](../../supabase/snapshots/2026-09-19-dependencies.json), with
source hash and boundaries in the [snapshot notes](../../supabase/snapshots/README.md).
It supplies 15 public tables, one view, 12 app routines, enum labels and three
court records. No public relation implements persistent court membership. Both
games and matches exist; no remote migration history table was reported.

Implemented [ADR 0003](../../docs/decisions/0003-inspected-local-baseline.md).
The local-only baseline reconstructs the reviewed public objects/auth trigger;
the next migration adds court_memberships and court_catalog. The historical root
migrations/seed remain untouched. No remote SQL, user cleanup or court mutation
was performed. Court IDs, raw geography, attributes and timestamps are preserved.

Reproduction from the repository root, using the commands documented in
[local-backend](../../local-backend/README.md):

1. Installed a project-scoped CLI and initialized an unlinked workspace. Initial
   replay used CLI 2.117.0. Final pinned/verified CLI is 2.99.0; the config uses its
   inbucket section. Runtime: PostgreSQL 17.6 and PostGIS 3.3.7, matching the export.
2. `npm.cmd run db:local:start`: local services started from migrations and seed.
   Only the BBallUY project/network/volumes were created or operated on. CLI output
   containing generated local credentials was not exposed; the initial captured
   startup log was replaced with a credential-free summary.
3. `npm.cmd run db:local:verify`: PASS. Compares all three courts with the source,
   including geographic bytes and timestamp microseconds; checks all 21 original
   core column names/types/nullability; exercises the actual signup trigger and
   membership uniqueness/FKs/server timestamp/leave/rejoin/multiple-court
   independence without teams. Fixtures run in a rollback transaction.
4. The same verifier uses only the local public key to read court search and
   court_catalog via PostgREST. All three IDs/names and projected coordinate pairs,
   lighting and half_court values agree with the export. Membership API writes
   remain denied by grants while T03 policies are pending.
5. `npm.cmd run db:local:types` generates database.types.ts from the running local
   database. The client uses Database/Tables types; compilation identified the
   nonexistent courts.address query and an overly wide invite-role type. Fixed
   those, the achievement primary-key selection, and profile assumptions about
   bio/wins/rank. No new any, lint exclusion or type suppression was introduced.
6. With pinned CLI 2.99.0, repeated `db:local:reset`, `db:local:verify` and
   `db:local:types`: PASS. The generated type file's SHA-256 is unchanged by clean
   replay. Only the disposable local database was reset; no hosted link exists.

Local tooling observations: the first type-generation attempt omitted the custom
Docker network and failed; fixed by passing --network-id for every CLI operation.
Docker Desktop reports 0.0.0.0 / :: published ports despite the requested loopback
network option with both tested CLI versions. The wrapper reports this actual
limit, the workflow requires a trusted development network and shutdown after
tests, and the completion run stops bballuy-local. No host firewall, Docker daemon
configuration or unrelated containers were modified.

T02's reproducible data contract is complete. Source provenance and preservation
are verified against the owner-supplied catalog; this is not independent field
verification of court locations or duplicate resolution. T06 must review those
map/catalog questions. A03 permissions, mobile signup/sessions, Storage/Edge
Functions and the complete MVP journey are not accepted by these checks.

Static/client validation before final documentation: `npm.cmd run verify` passes
documentation, types and lint; `npm.cmd run test:client` passes nine tests; targeted
ESLint passes both new tooling scripts. Git diff --check still reports existing
CRLF/whitespace findings in the dirty working tree; no broad formatting cleanup
was made.

Final completion check on 2026-09-20: `npm.cmd run verify` passes documentation,
types and lint after the task/status updates; `npm.cmd run test:client` passes
all nine tests. `db:local:stop` succeeds and retains the disposable local data.
The local services are stopped. T02 is marked done; T03 authorization is next.

### 2026-09-19 — T02 first user-supplied database snapshot

Parsed the single schema_snapshot CSV cell supplied by the user, validated its
scope and counts, and preserved it in
[2026-09-19-core-schema.json](../../supabase/snapshots/2026-09-19-core-schema.json).
[Provenance](../../supabase/snapshots/README.md) records the original CSV hash
and capture timestamp. The source is user-identified as the configured project;
the export itself contains no project ID or inspection role.

Compared the 21 exported columns, constraints, policies, grants and trigger with
the initial migration, lib/backend/types.ts and hooks/profile.ts. Recorded exact
differences and evidence limits in [database context](../../docs/db-context.md).
No secrets or business rows are present in this first snapshot. No remote
requests, migrations, user cleanup or court mutations were performed this turn.

Prepared core-dependencies.sql to collect the missing definitions and existing
court catalog in a read-only transaction. It has not been run against the remote
database. T02 remains partial: no complete baseline, generated types, disposable
replay, verified court provenance or A02 acceptance is claimed.

Validation: `npm.cmd run verify` passed documentation, client types and lint.
Executed core-dependencies.sql successfully using the already installed image
`sha256:2d74f8a2591ca34f2ea0565e385325570dd618e2d07372a8bb0ba97bddd19c93`
(PostgreSQL 16.0) in a task-created container with `--rm --network none`, tmpfs
database storage and no published ports or host mounts. The synthetic fixture
contained a courts table (coords as text), one court, an enum with two labels,
a profile table, a view and a SQL helper function. Parsed the returned JSON and
asserted the scope, one court, two enum labels, one view and one function. The
container was stopped and automatically removed after the check. Existing
containers were not changed. This proves query execution on the fixture, not
PostGIS behavior, remote PostgreSQL 17.6 compatibility or a replay of the actual
Supabase schema. No remote credentials were passed to Docker.

### 2026-09-19 — T02 Docker recovered and credential diagnosis corrected

The user confirmed the keys still match and showed Docker Desktop's Images view. An authorized `docker version --format '{{.Server.Version}}'` returned 28.3.2; the restricted attempt failed with access denied. No containers were started, stopped or modified. Local credential checks printed booleans only: anon role, unexpired claim, matching project reference, no process overrides or surrounding whitespace. These checks alone do not validate a signature.

Authorized GET probes with the existing public key returned: `/rest/v1/` HTTP 401 with or without the bearer header; `/rest/v1` HTTP 401; `/auth/v1/settings` HTTP 200; `/rest/v1/courts?select=id&limit=0` HTTP 200 and an empty array. Only statuses and error categories were logged; no keys or response bodies were printed. No business rows were retrieved and no writes were sent. The zero-row request does not verify court count or row-level policies.

Supabase's [official breaking change](https://supabase.com/changelog/42949-breaking-change-removing-access-to-openapi-spec-via-the-anon-key) removes anon OpenAPI access while preserving ordinary Data API requests. This explains the endpoint-specific failure and corrects the earlier credential suspicion. Updated the inspector error guidance and workflow to require a supported inventory path. T02 remains blocked on that inventory, not on Docker or proven invalid credentials; A02 remains unaccepted.

Validation: `npm.cmd run verify` passed documentation (20 files), client types and lint; `npm.cmd run test:client` passed all nine tests; targeted ESLint for scripts/inspect-database-api.mjs exited 0. No SQL inventory, migration replay or device acceptance was executed.

### 2026-09-19 — T02 target and retention confirmation

The user confirmed the existing Supabase project remains the intended target and reported three courts that must be preserved. Test users and their court associations may be removed if they obstruct the work, but no cleanup has been demonstrated necessary or executed. Updated the runbook, status and blocked reason. This is user-provided context, not a verified database inventory. The previous HTTP 401 and unavailable Docker engine remain independent, unresolved observations; no new remote requests or data changes were made in this update.

### 2026-09-19 — T02 inspection preparation, not acceptance

T01 was already complete when this turn started. Entry `npm run verify` passed documentation, client types and lint. Prepared scripts/inspect-database-api.mjs and supabase/inspection/public-schema.sql, plus the database reconciliation runbook. No database schema, generated types or data migration was invented from the unverified historical snapshot.

`npm run test:client`: nine tests passed, including five inspector cases for public-only credentials, safe endpoints, metadata-only output and invalid-response rejection. Tests are local and do not make network requests.

`npm run db:inspect:api`: restricted execution returned EACCES. The authorized network retry reached the configured endpoint and received HTTP 401; no API schema snapshot was produced. The script did not fall back to the available service-role credential and did not read business rows or send writes.

Docker's first restricted check could not access its configuration/engine. The authorized read-only version check also failed because the Docker Desktop Linux engine pipe was unavailable. No containers were started. Supabase CLI was not available in PATH. The SQL inventory query has not been executed against a real database, so its database behavior is not certified.

T02 remains blocked pending identification/access to the intended development schema and a runnable disposable backend. API inspection alone would not establish RLS, grants or complete database types even if successful. A02 is not accepted; no new device or functional acceptance scenarios were executed.

### 2026-09-19 — T01 completion: client checks and regression baseline

Environment: Windows/PowerShell, Node 24.16.0, npm 11.13.0; existing installed dependencies, Expo 54.0.37 / React Native 0.81.5. No reinstall or new dependency. Preserved the user's existing tracked and untracked work, including deleted legacy theme hooks. Used `npm.cmd` because PowerShell blocks `npm.ps1`. Git inspection used a command-scoped `-c safe.directory=C:/Users/user/Documents/code/mobileApps/bball/client-bballuy` due to sandbox ownership; no global Git configuration was changed.

Initial `npm.cmd run harness:status`: T00 done, T01 in progress, remaining tasks waiting on dependencies. Initial `npm.cmd run verify`: docs passed; client TypeScript failed with 6 errors; lint failed with 4 errors and 4 warnings, matching the prior baseline.

Changes for R01/T01:

- Court search now derives its result type from `searchCourts` and displays the available id/name data without an unsupported address. Backend queries were not changed.
- Collapsible imports now resolve to React Native primitives and the existing palette. It retains initially closed/toggle state and exposes its expanded accessibility state. No active call sites were found by `rg -n 'Collapsible' app components` outside its definition; no device interaction is claimed.
- The profanity utility imports the actual named `Filter` export. [Regression tests](../../tests/profanity.test.cjs) exercise ordinary text, word boundaries, case-insensitive detection, masking and combined validation with the installed library.
- Removed two unused declarations, added the router effect dependency and moved the notification save helper into its effect. No lint suppression or broader exclusion was added. Notification startup read/write ordering and account-scoped storage remain later work, not verified fixes.

Reproduction and observed results:

1. `npm.cmd run verify`: exit 0; documentation (19 Markdown files, one specification), TypeScript and lint all pass; zero client errors/warnings.
2. `npm.cmd run test:client`: exit 0; 4 tests pass, 0 fail. Uses Node 24 native TypeScript loading; no backend or credentials. The strategy and future integration/device boundaries are recorded in [development](../../docs/development.md).
3. `$env:EXPO_NO_DOTENV='1'; $env:EXPO_OFFLINE='1'; npx.cmd expo install --check`: exit 0, `Dependencies are up to date`, alongside Expo's warning that validation is unreliable offline. This checks the installed catalog only. `npm.cmd ls @types/react-native --depth=0` reports `(empty)` with exit 1, the expected absence of that package.
4. In a separate shell: `$env:EXPO_NO_DOTENV='1'; $env:CI='1'; npm.cmd start -- --offline --port 8087`. Observed `Starting Metro Bundler` and `Waiting on http://localhost:8087`, with no global CLI failure or types installation. `Invoke-WebRequest -UseBasicParsing http://localhost:8087/status` returned UTF-8 `packager-status:running`. Ctrl+C did not stop the CI process; identified its listener with `netstat -ano -p tcp`, then stopped that process tree with `taskkill /PID <observed-pid> /T /F` using elevated cleanup after sandbox access denial.
5. Final `npm.cmd run verify` passed again after documentation/task updates. `npm.cmd run harness:status` reports T01 done and T02 available by dependencies. Auxiliary `git diff --check` reports whitespace/CRLF findings across the existing dirty working tree; no repository-wide formatting cleanup was attempted. This is separate from the passing client lint check.

T01 is complete using this evidence and the preserved 2026-09-18 CLI/dependency evidence. A01's local client checks pass on the existing installation; a clean-install/native-build acceptance is not claimed. R01's server verification limitation remains: no Edge Functions changed and `verify:edge` was not rerun; the last recorded result is missing Deno. Harness scripts were not changed. No device/emulator, native bundle/build, two-account flow or A02–A10 scenario was executed. Previously reported dependency vulnerabilities were not reassessed. No remote database was accessed or modified and nothing was deployed. Next available task: T02.

### 2026-09-19 — Court-first scope revision

The user confirmed that joining means persistent court community membership without a team. Updated product scope, map decision record, requirements, plan, tasks and acceptance scenarios together. Preserved T00 completion, ongoing T01 state and dated evidence below. Native map selection remains a recommendation pending integration validation.

`npm run verify`: documentation passed (19 Markdown files, one specification); client TypeScript still has 6 errors and lint still has 4 errors / 4 warnings. Overall exit code 1, with the same pre-existing findings. No application code, dependencies, cloud billing, database or Edge Functions were changed. Map/provider sources were checked on 2026-09-19 and linked in ADR 0002. No device or functional acceptance scenarios were executed.

### 2026-09-17 — T00, organización y harness

Entorno: el indicado arriba. Ejecución equivalente mediante `npm.cmd` en PowerShell. Ninguna migración, cuenta ni dato remoto modificados.

- `npm run verify`: documentación válida (18 archivos Markdown, una especificación); TypeScript de cliente con 6 errores; lint de cliente con 4 errores y 4 advertencias. Código global 1. El control de lint se ejecutó aunque tipos falló. Resultado estructurado en `.harness/verify.json` al ejecutar, no versionado.
- `npm run test:harness`: 11 pruebas aprobadas. Cubren caso válido, enlace roto, requisito sin tarea, ciclos, cierre sin evidencia/dependencias, evidencia externa/temporal, especificación verificada prematuramente, continuidad tras fallo y status sin mutación. Fixtures desechables; no usan Supabase ni credenciales.
- `npm run verify:edge`: código 1 por `deno ENOENT`; no se pudo comprobar el servidor porque Deno no está instalado. No es evidencia de que las funciones tengan tipos correctos.
- `npm run harness:status`: registro y tareas legibles; no inicia trabajo ni marca tareas automáticamente.
- Dependencias declaradas de `package.json` y raíz de `package-lock.json`: coinciden. No se instaló ni actualizó ningún paquete en esta tarea.

T00 respalda la organización y el funcionamiento del verificador. **R01 y A01 no están completos:** quedan los fallos del cliente, la verificación Deno y el establecimiento de pruebas apropiadas. A02–A10 no se ejecutaron. T01 es el siguiente trabajo para recuperar controles del cliente.

Los errores del cliente son los ya identificados en B03; no se arreglaron ni silenciaron durante documentación. La separación de entornos explica la reducción de conteos frente a los comandos amplios históricos.

### 2026-09-18 — T01 parcial, CLI local y dependencias de SDK 54

Entorno: Windows/PowerShell, Node.js 24.16.0, npm 11.13.0. Se conservaron los cambios existentes. Alcance: corregir el arranque reportado con `expo-cli` global y alinear dependencias, sin cambios de pantallas ni backend.

- El stack reportado apunta a `expo-cli` global. El script `start` existente ya ejecuta el binario local de Expo; se documentó usar `npm start` / `npx expo start` y sus variantes `.cmd` para PowerShell.
- `npm.cmd uninstall --save-dev @types/react-native --offline --ignore-scripts --no-audit --no-fund`: código 0. Se retiró el paquete agregado por el CLI antiguo; React Native incluye sus tipos.
- `npx.cmd expo install --check`: la primera consulta falló por acceso de red restringido. La repetición con red disponible devolvió 22 recomendaciones para SDK 54. La comprobación offline previa solo contrastaba con el catálogo local de Expo 54.0.13 y no detectaba estas recomendaciones remotas.
- `npx.cmd expo install --fix`: código 0; Expo 54.0.13 → 54.0.37, React Native 0.81.4 → 0.81.5 y paquetes del SDK alineados. El CLI agregó los plugins `expo-font`, `expo-secure-store` y `expo-web-browser` en `app.json`. Manifiesto y raíz del lockfile coinciden en dependencias y dependencias de desarrollo.
- `npx.cmd expo install --check` después de instalar, con red disponible: código 0, `Dependencies are up to date`.
- Arranque: `$env:EXPO_NO_DOTENV='1'; $env:CI='1'; npm.cmd start -- --offline --port 8087`. Resultado: `Starting Metro Bundler` y `Waiting on http://localhost:8087`, sin el TypeError original ni instalación de tipos. GET a `/status` respondió `packager-status:running`. Servidor detenido con Ctrl+C. El primer intento combinó `--offline --localhost` y fue rechazado por opciones excluyentes; se corrigió el procedimiento documentado.
- `npm.cmd run verify`, antes y después del ajuste: documentación aprobada (18 Markdown, una especificación); permanecen 6 errores de TypeScript y 4 errores / 4 advertencias de lint. Son los mismos fallos previos de `step1`, módulos ausentes de `collapsible` y exportación de `bad-words`, más las advertencias ya registradas. El resultado global sigue siendo FAIL.
- npm informó 36 vulnerabilidades del árbol instalado (2 bajas, 16 moderadas, 17 altas, 1 crítica). No se investigó su aplicabilidad ni se ejecutó `npm audit fix`; ese análisis queda pendiente.

Límites: prueba de arranque de Metro en modo offline/CI, sin cargar `.env`, generar bundle ni probar dispositivo/emulador. No se verificó compilación nativa, comportamiento de los plugins ni A02–A10. No se modificaron Edge Functions ni harness. **T01 continúa en progreso y A01 sigue incompleto.** Siguiente tarea: corregir los fallos estáticos del cliente y repetir `npm run verify` antes de la aceptación funcional.
