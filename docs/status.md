# Estado del proyecto

## Current issues and next action — 2026-09-21

This is a reading summary of the recorded evidence, not a new runtime or remote
security audit. Task states remain in [tasks.json](../specs/001-core-journey/tasks.json).
T00–T02 have local completion evidence; T03 is the next available implementation
task. The MVP is not yet accepted on a device or deployed as a complete journey.

- **Permissions (T03):** inspected profile permissions do not protect app_role
  from owner edits. Restrict privileged profile fields and catalog writes, then
  verify allowed/denied operations with anonymous access and two real test sessions.
  The new local court membership API remains closed until ownership is enforced.
- **Registration and sessions (T04):** the onboarding loop, email confirmation
  without an immediate session, persistence, refresh and revocation need fixes or
  functional verification. Existing screens do not prove this journey works.
- **Account isolation (T05):** shared personal cache keys and logout cleanup can
  expose stale account data after switching users; verify A-to-B behavior.
- **Maps and catalog (T06):** the map remains a placeholder. The Google/Apple
  proposal needs native validation; platform and initial area are not finalized.
  Preserve the three original courts; verify location accuracy and whether the
  two nearby Parque Rodo records represent the same court before any merge.
- **Membership experience (T07):** local storage exists, but join/leave/rejoin and
  My Courts still need UI, integration, retry and persistence acceptance.
- **Release evidence (T08):** no complete two-account device journey or native
  build acceptance is recorded. Remove simulated MVP events and test failures.

Additional known limitations: Docker published local ports on all interfaces
despite the requested loopback option; the last backend run was stopped. An npm
audit previously reported 36 vulnerabilities, but that is a historical count,
not a fresh assessment of current versions or exploitability. Dependency triage
is still required before release. Edge Function validation remains separate;
the missing-Deno limitation has not been resolved by client checks.

Deferred legacy issues include partial team creation, image-storage behavior and
an adapter whose eq filter is ineffective. Teams are outside this MVP; do not use
that adapter for new writes without fixing it. The historical root SQL is not a
safe remote deployment path. A future release needs a reviewed incremental
upgrade against a freshly inspected hosted database.

The first three tasks established documentation, a passing client baseline and
a reproducible local data contract. They do not represent one third of the user
experience: most remaining work is functional integration and acceptance.

For phone access, use the [mobile reading guide](mobile-guide.md). The published
documentation records local work; it does not publish or deploy the app changes.

## T02 local reconciliation complete — 2026-09-20

The two reviewed exports now reproduce the public application schema and all
three existing court records in a separate local Supabase workspace. PostgreSQL
17.6/PostGIS 3.3.7 replay, source preservation, SQL contract tests and public
catalog API reads pass. Type generation is identical before/after a clean replay.
The generated types now drive the client and exposed invalid field assumptions;
profile stats, achievement and court queries were aligned with the real schema.

Added local-only court_memberships (unique user/court pair, foreign keys and
server timestamp) and a security-invoker coordinate view. Membership API writes
remain closed until T03. Hosted data and schema were not changed. The three
original IDs and raw court fields are preserved; possible duplicate Parque Rodo
entries and physical map accuracy remain T06 review work.

The [local workflow](../local-backend/README.md) documents setup, reset, checks,
type generation and shutdown, including the observed Docker port-binding limit.
Next task: T03, protect privileged profile columns/catalog writes and prove
membership ownership with anonymous and two authenticated callers. T04–T08
remain unaccepted. See [execution evidence](../specs/001-core-journey/verification.md).
All entries below are historical observations.

## T02 first schema snapshot received — 2026-09-19

Reviewed and preserved the user's PostgreSQL 17.6 inventory: courts has eight
columns, users_public has 13, and public.court_memberships is not among the
returned regular/partitioned tables. The historical migrations and manual types
do not match it. Profile grants/policies do not restrict editing privileged
columns; T03 needs direct permission checks and a fix. No remote writes or
cleanup occurred. The three courts remain protected by the retention requirement.

Prepared one read-only follow-up to collect missing enum labels, application
function bodies, related schema objects and the court catalog. The first export
contains structure only, not a backup of those courts. T02's remaining blocker
is this dependency/catalog inventory, not Docker or the public API key. See
[confirmed differences](db-context.md) and the [runbook](database-reconciliation.md).
Historical status entries below describe the earlier state.

## T02 diagnostic correction — 2026-09-19

Docker is now reachable (server 28.3.2). The unchanged public Supabase key succeeds for Auth settings and a zero-row courts request (HTTP 200). The OpenAPI root alone returns HTTP 401, consistent with Supabase's removal of public-key schema introspection. The earlier probe was insufficient to diagnose credential validity. Do not change credentials on that basis. T02 now awaits a supported schema inventory via SQL editor/database connection or authorized Management API, plus local replay. Preserve the three existing courts; no cleanup or remote mutations occurred. Details and sources: [database runbook](database-reconciliation.md). The following entry records the earlier state.

## T02 started; external prerequisites pending — 2026-09-19

Current client checks still pass. Added read-only API schema inspection, a database catalog inventory query and five regression tests for the inspector (nine tests total in test:client). The configured Supabase metadata endpoint returns HTTP 401; the Docker Desktop Linux engine is not running/available. The user confirmed the same target project and requires preservation of its three existing courts. Test users and court associations may be cleaned up if necessary, but no need has been established and no cleanup was performed. The remote project is not disposable. T02 is blocked on access/environment prerequisites, not complete. No canonical schema/types, migrations or verified court catalog are claimed. See the [database runbook](database-reconciliation.md).

## Client baseline restored — 2026-09-19

T01 is complete: documentation, client TypeScript and lint pass with zero errors/warnings; four profanity regression tests pass. Local Expo starts Metro offline and `/status` returns `packager-status:running`. SDK dependency compatibility passes against the installed offline catalog, without a fresh remote recommendation check. No dependencies were changed during this completion.

B03's client compilation blockers are fixed. Court search consumes the existing id/name contract; the collapsible uses React Native primitives and the existing palette; the profanity utility uses the installed named export. Hook dependencies and unused code warnings are fixed without exclusions. Notification persistence/hydration and account isolation remain unverified; this warning cleanup does not resolve B06.

Next: T02, reconcile the profile/court/membership contract and prepare a disposable backend. Development schema inspection, platform/catalog decisions, database permissions, authentication, real maps and membership acceptance remain pending. No remote database access, migrations or deployment took place. Deno was not rechecked because no Edge Functions changed; its prior missing-runtime limitation remains unresolved. See [reproducible evidence](../specs/001-core-journey/verification.md). Historical entries below describe earlier states.

## Current product direction — 2026-09-19

The user narrowed the MVP to sign-up/sign-in, real court discovery and persistent membership in court communities, independent of teams. SPEC-001 now reflects that direction. The map recommendation and alternatives are in [ADR 0002](decisions/0002-court-first-mvp.md); no provider has been installed or activated. T00 completion and T01 progress are preserved. Team creation/invitation work is deferred, while the historical findings below remain relevant to existing code.

Referencia: 2026-09-17, hora local de Uruguay. Revisión de archivos y comprobaciones locales; sin ejecución en dispositivo ni consultas al Supabase remoto.

## Estado general
En estabilización. Hay base Expo / React Native, perfiles, equipos, Zod, React Query y recursos Supabase. El árbol de trabajo ya tenía modificaciones y archivos sin registrar antes de esta organización.

## Hallazgos prioritarios
- **B01 — Permisos:** la migración RLS permite modificar el perfil propio sin proteger `app_role`. No se encontraron restricciones de columna equivalentes en los archivos revisados. Contrastar el remoto y proteger los campos privilegiados.
- **B02 — Esquemas:** la app escribe `teams.type`, `requires_approval`, `minimum_players` y `team_members.status`, ausentes en la migración inicial. También discrepan roles y `games`/`matches`. Ver [datos](db-context.md).
- **B03 — Cliente:** `step1` espera `address` en canchas; `collapsible` importa cuatro módulos ausentes; `profanity` importa por defecto una exportación nombrada de `bad-words`.
- **B04 — Registro:** completar perfil vuelve a edad/consentimiento/registro; no se distingue bien el alta sin sesión cuando hay confirmación de correo.
- **B05 — Sesión:** falta almacenamiento persistente nativo integrado a Supabase y completar el retorno OAuth.
- **B06 — Cambio de cuenta:** claves de caché personales compartidas y sin limpieza al salir; riesgo de mostrar datos anteriores.
- **B07 — Creación parcial:** equipo y miembros se guardan en llamadas separadas sin transacción ni compensación.
- **B08 — Provisionales:** mapa, canchas y notificaciones de ejemplo; enlace de invitación fijo y opciones sin implementar.
- **B09 — Imágenes:** varias convenciones de rutas y políticas de logos que solo dejan leer al propietario. Falta verificar subida nativa y lectura de otros miembros.
- **B10 — Adaptador:** `eq` en `lib/backend/supabase.ts` no aplica el filtro. No usarlo para nuevas escrituras hasta corregirlo o retirarlo; las pantallas revisadas usan principalmente Supabase directo.

## Línea base previa
- `tsc --noEmit`: 33 errores; 6 del cliente y 27 de funciones Supabase bajo configuración del cliente.
- `eslint .`: 13 errores y 5 advertencias, incluyendo generados y funciones Deno.
- No había suite automatizada configurada.

Las nuevas comprobaciones separan cliente y Deno. Sus conteos no son directamente comparables a los anteriores. El resultado actualizado se registra en [evidencia](../specs/001-core-journey/verification.md).

## Desconocidos
Esquema, grants, políticas, triggers y buckets remotos; configuración Auth; funciones desplegadas; arranque de base local desde cero; compilación Android/iOS y recorrido con dos cuentas. No se afirma que producción tenga todos los problemas locales.

## Siguiente trabajo
Consultar `npm run harness:status`. Los estados y dependencias viven en [tasks.json](../specs/001-core-journey/tasks.json). Primero una base verificable; luego datos/permisos y el recorrido funcional.

## Actualización de arranque — 2026-09-18
Se comprobó el arranque de Metro con el CLI local mediante `npm start`, se retiró `@types/react-native` y se alinearon dependencias dentro de SDK 54 (Expo 54.0.37, React Native 0.81.5). La comprobación de compatibilidad de Expo pasa. El CLI agregó plugins de font, secure-store y web-browser; no se verificó compilación nativa. `verify` mantiene 6 errores de tipos y 4 errores / 4 advertencias de lint. npm reportó 36 vulnerabilidades pendientes de evaluar. T01 sigue en progreso; consultar [evidencia y límites](../specs/001-core-journey/verification.md). Próximo paso: corregir los errores estáticos del cliente.
