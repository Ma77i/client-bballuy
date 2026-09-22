# Contexto de base de datos

## Local data contract implemented — 2026-09-20

The second export supplied the missing enums, 12 application routines and the
three court records. Its public schema includes both games and matches, plus
team_members and teams.home_court_id; no existing public relation represents
the requested independent court community membership. The reported migration
history table is absent. See [source evidence](../supabase/snapshots/README.md).

The [isolated local workspace](../local-backend/README.md) replays the inspected
schema and preserves the catalog. A separate migration adds court_memberships
with a unique user/court pair, timestamp and foreign keys, plus a security-invoker
court_catalog coordinate projection. Membership writes are gated until T03.
The generated database.types.ts now types the Supabase client and core row types.
Profile queries use real nullable columns; nonexistent bio/wins/address reads
were removed, and the player achievement query uses achievement_id.

All three court records round-trip through PostgreSQL/PostGIS and the public API.
This establishes source preservation, not independent physical verification.
Parque Rodo and Parque Rodó Court remain separate original records. The remote
project remains unchanged, including its known privilege issues. Historical
findings below remain relevant as the rationale and pre-change evidence.

## First remote inventory reviewed — 2026-09-19

The user supplied the result of public-schema.sql. Preserved the parsed
[snapshot](../supabase/snapshots/2026-09-19-core-schema.json) and its
[provenance](../supabase/snapshots/README.md). Capture: 2026-09-19 15:19:14 -03:00,
PostgreSQL 17.6. This supersedes the unknown-schema status for the objects below,
not for the entire backend.

- `courts` has eight columns: id, name, coords, half_court, lighting, surface,
  notes and created_at. Coordinates are non-null geography(Point,4326).
  Lighting is nullable text, not the boolean assumed by the historical migration
  and Court interface. Address, indoor, hoops_count, ratings, created_by and
  updated_at are absent. Keep the existing IDs and geography values; derive a
  map-friendly coordinate representation without rewriting court rows.
- `users_public` has 13 columns. display_name and the level/stat counters are
  nullable. bio, city, xp, games_won and updated_at are absent. The three role,
  visibility and location-mode fields use enums; their labels are not exported.
  The initial migration and UserPublic interface are not the current contract.
  hooks/profile.ts already handles several nullable values, but still assumes
  bio and games_won exist.
- Both tables have RLS enabled. The only courts policy allows SELECT; broad
  table grants alone do not demonstrate allowed INSERT/UPDATE/DELETE. T03 must
  restrict grants and prove operations using real caller roles.
- Profile INSERT checks the caller's ID; UPDATE accepts the owner or
  is_mod_or_admin(auth.uid()). Authenticated has table-wide INSERT/UPDATE grants,
  including app_role, and no profile trigger is present in the export. These
  definitions do not protect privileged columns from self-editing. T03 must
  close this path and verify it with direct requests; no exploit was attempted.
- No regular/partitioned `public.court_memberships` table is returned. This does
  not rule out another relationship table or view. Preserve existing team data
  while inspecting those possibilities; do not equate team membership with
  the new persistent court-community membership.
- The only exported constraints are the two primary keys. In particular, this
  export contains no users_public.id foreign key to auth.users, unlike the
  historical migration. Adding that constraint requires checking existing data
  first; no orphan check or cleanup has been performed.
- Auth has a SECURITY DEFINER trigger calling public.handle_new_auth_user(),
  with no function-level settings reported. Its body, and the bodies of
  share_team() and is_mod_or_admin(), were not included. Do not replace them with
  guessed implementations or assume the trigger applies the old migration.

The current inventory contains no court rows, so the reported three courts are
not yet backed up or validated by it. [core-dependencies.sql](../supabase/inspection/core-dependencies.sql)
collects enum labels, application routines, related public relations and the
existing court catalog without reading user/team rows or executing app routines.
Review its output before versioning. This completes the first comparison;
canonical migrations, generated types and a faithful local replay still depend
on that additional evidence. No remote changes are authorized by this document.

## T02 inspection status — 2026-09-19

The client baseline passes. The target is confirmed and its three existing courts must be preserved. Docker now responds (28.3.2), and the unchanged public key succeeds for Auth settings and a zero-row courts request. The metadata root still returns HTTP 401 because public-key OpenAPI inspection is no longer supported on hosted Supabase; this is not evidence that the application key is invalid. Use the catalog-only SQL inventory or authorized Management API described in the [runbook](database-reconciliation.md). No complete remote schema was obtained, no canonical generated types were produced, and no migrations were applied. Reconciliation awaits a supported inventory and disposable local replay.

## MVP scope revision — 2026-09-19

SPEC-001 now prioritizes profiles, courts and persistent court community memberships. The proposed new relation is court_memberships(user_id, court_id, joined_at), with a unique user/court pair and authenticated ownership controls, subject to inspection of the actual schema. Joining grants no global role, needs no team and has no automatic expiry. Court membership is not attendance. Whether future teams depend on court membership remains undecided; do not add that constraint now. The team-specific discrepancies and contract proposal below are historical context, not the current MVP delivery scope.

Estado: **pendiente de reconciliar**. No se consultó ni modificó el Supabase remoto en esta organización.

## Fuentes existentes
- `supabase/migrations/20250101000000_initial_schema.sql`: esquema histórico con `matches`, roles de equipo `captain/member` y sin estado de membresía.
- `supabase/migrations/20250101000001_rls_policies.sql`: políticas históricas; revisar protección de roles, membresías y participantes.
- `docs/db-schema.json`: instantánea manual de origen/fecha no establecidos. Describe `games`, roles mediante `app_role`, `status` y columnas de equipos adicionales. No tratarla como un volcado verificado.
- `lib/backend/types.ts`: tipos manuales; tampoco coinciden completamente con las otras fuentes.
- `scripts/setup-*.sql` y `supabase/storage-policies.sql`: configuraciones alternativas, no una cadena ordenada de migraciones.

## Diferencias relevantes

La creación de equipos escribe `type`, `requires_approval`, `minimum_players` y estado `active/pending`. La migración inicial no define esas columnas. El cliente usa roles `team_captain/player`; la migración admite `captain/member`; el JSON usa un enum global que ni siquiera incluye `team_captain`.

El detalle de equipo consulta `matches`, mientras el JSON describe `games`. El estado final aparece como `completed` en un contrato y `finished` en otro. Resolverlo con evidencia del entorno, no reemplazando nombres a ciegas.

Los perfiles pueden editarse por el propietario bajo las políticas guardadas, pero `app_role` no está protegido a nivel de columna/trigger en los archivos revisados. La propiedad de una fila no autoriza modificar privilegios globales.

Los logos son privados y las políticas locales restringen la lectura al propietario. Una URL firmada sigue necesitando permisos para emitirse. La variante `setup-storage-dev.sql` permite acceso mucho más amplio: no usarla como corrección general.

## Procedimiento de reconciliación (T02)
1. Identificar un entorno de desarrollo y obtener, en lectura, esquema, restricciones, defaults, triggers, grants, RLS y buckets actuales. No copiar datos de usuarios.
2. Comparar esa evidencia con las fuentes locales y registrar divergencias.
3. Decidir contrato canónico y compatibilidad con datos existentes; separar rol global de rol de equipo y solicitud de invitación.
4. Crear migraciones incrementales. No reescribir migraciones que puedan haber sido aplicadas sin establecer primero el historial.
5. Preparar configuración local y comprobar construcción desde cero en base desechable; probar también la actualización del esquema anterior cuando corresponda.
6. Generar tipos desde el esquema reconciliado y sustituir contratos manuales gradualmente.
7. Probar lectura y escritura con anónimo, usuario A, usuario B y capitán; los casos denegados son parte de la aceptación.

Los comandos de reset, push o ejecución de SQL no forman parte del harness. La inspección puede prepararse sin cambios remotos; aplicar migraciones a una base existente requiere identificar el destino y alcance autorizado.

## Contrato propuesto del primer recorrido
- Perfil identificado por el usuario autenticado; privilegios globales no editables por él.
- Capitán como responsabilidad dentro del equipo, sin convertirlo en administrador global.
- Unicidad de pertenencia `(team_id, user_id)`.
- Crear equipo y membresía del capitán en una operación atómica, derivando identidad del token.
- Unirse a un equipo público abierto genera una membresía activa propia. En equipos con aprobación o privados, el servidor impide autoaprobarse o saltar invitaciones.
- Guardar rutas estables de imágenes y generar URLs temporales según permisos; no persistir URLs firmadas como identificadores.

Este contrato es una propuesta de implementación para [SPEC-001](../specs/001-core-journey/spec.md), no una descripción de la base desplegada.
