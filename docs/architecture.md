# Arquitectura observada

Revisión local de septiembre de 2026; no representa una comprobación del despliegue remoto.

## Cliente
- `app/`: rutas Expo Router; `(auth)` contiene onboarding, registro y acceso; `(tabs)`, canchas, equipos y perfil.
- `app/team/[id].tsx` y `app/player/[id].tsx`: detalles de equipo y jugador.
- `app/create-team/`: asistente de tres pasos con estado en `contexts/TeamCreationContext.tsx`.
- `app/_layout.tsx`: proveedores de React Query, autenticación y notificaciones, fuentes y navegación raíz.
- `components/` y `constants/`: UI reutilizable y colores.
- `hooks/profile.ts`: consultas y actualización de perfiles/equipos con React Query.

## Datos y estado
`contexts/AuthContext.tsx` mantiene sesión y perfil. `lib/backend/supabase.ts` configura Supabase y ofrece un adaptador. Muchas pantallas usan Supabase directamente; el adaptador no es una frontera uniforme.

`lib/utils/secureStorage.ts` guarda tokens por separado y no está integrado como almacenamiento de sesión de Supabase. `NotificationContext` usa almacenamiento local y datos de demostración; no es un servicio remoto.

After T02, `lib/backend/database.types.ts` is generated from the inspected local
replay. The Supabase client and core profile/court types consume that contract.
The historical root migrations and JSON remain reference material, not a hosted
deployment contract. See [database context](db-context.md) for evidence and limits.

## Servidor
- `supabase/migrations/`: esquema y políticas RLS históricos.
- `supabase/functions/`: funciones Deno para ubicación aproximada, borrar cuenta, exportar datos, limitar solicitudes y URLs firmadas.
- `supabase/storage-policies.sql`: configuración histórica de logos.
- `scripts/setup-*.sql`: variantes manuales, algunas de desarrollo; no son migraciones reconciliadas.

## Recorridos con problemas
Registro → perfil → edad → consentimiento → registro: completar el perfil vuelve a un paso previo.

Crear equipo → insertar capitán → insertar invitados: una falla intermedia no revierte el equipo.

Cerrar sesión → entrar con otra cuenta: claves de consultas personales compartidas sin limpieza de caché al salir.

## Fronteras de la estabilización
1. Verificar cliente Expo y funciones Deno con sus respectivos entornos.
2. Hacer cumplir permisos e integridad en servidor, además de validaciones de UI.
3. Garantizar en la base las operaciones que deben completarse todas o ninguna.
4. Separar roles globales y pertenencia a equipos.

No se propone migrar de framework ni reescribir. Las extracciones de lógica responden a [SPEC-001](../specs/001-core-journey/plan.md).
