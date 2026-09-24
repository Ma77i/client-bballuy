# BBallUY — proyecto en estabilización

Read from your phone: [documentation and project navigation](docs/mobile-guide.md).

Aplicación móvil para encontrar personas con quienes jugar al básquet y organizar equipos. Cliente Expo / React Native y recursos de Supabase. El nombre comercial definitivo está pendiente; algunas pantallas todavía dicen StreetHoops.

**No listo para producción.** Hay funcionalidades parciales, errores conocidos y diferencias entre código y esquemas SQL. Ver [estado actual](docs/status.md).

The local MVP's sign up/sign in, court discovery and persistent membership journey
has browser and owner-reported iPhone evidence. The formal 2026-09-24 audit reopens
SPEC-001 closure: onboarding/consent still overstates available features, and
physical court-location accuracy needs explicit confirmation. See the
[closure review and proposed commits](specs/001-core-journey/closure-review.md).
Hosted migration, release builds and production readiness remain separate work.

## Retomar el proyecto

1. Leer [producto](docs/product.md) y [arquitectura](docs/architecture.md).
2. Preparar el entorno con la [guía de desarrollo](docs/development.md).
3. Leer la [primera especificación](specs/001-core-journey/spec.md) y sus [tareas](specs/001-core-journey/tasks.json).
4. Ejecutar `npm run harness:status` y `npm run verify` antes de cambiar código.

Current MVP direction (2026-09-19): sign up/sign in, discover real courts and join their communities. Membership persists until leaving and does not require a team. See [SPEC-001](specs/001-core-journey/spec.md) and the [map recommendation](docs/decisions/0002-court-first-mvp.md). The earlier team-first journey is deferred; existing setup and stabilization work are preserved.

The [local backend workflow](local-backend/README.md) reproduces the inspected
schema and three existing courts without changing hosted data. It includes
database contract tests, two-account permission checks and type generation.
Membership storage and owner-only permissions are implemented locally; no hosted
schema upgrade has been deployed by these tasks.

## Inicio local

Instalar con `npm ci`, crear `.env` a partir de [.env.example](.env.example) con un proyecto Supabase de desarrollo y ejecutar `npm start`. Las versiones observadas y limitaciones están en la guía de desarrollo.

Usar `npm start` o `npx expo start`, que ejecutan el CLI local. El comando directo `expo start` puede invocar el CLI global obsoleto y fallar con `ExpoMetroConfig.loadAsync is not a function`. En PowerShell con scripts bloqueados, usar `npm.cmd start`. Ver [diagnóstico de arranque](docs/development.md).

Las comprobaciones no necesitan credenciales:

```sh
npm run verify:docs
npm run verify
```

`verify` returns an error when a check fails. As of 2026-09-19, the client static baseline passes; also run `npm run test:client` for the focused regression suite. Green local checks do not replace device or database-permission acceptance. See the dated evidence for remaining limitations.

## Trabajo guiado por especificaciones (SDD)

Requisitos y aceptación viven en `specs/`; después se concreta el plan, se implementan tareas pequeñas y se registra evidencia. Ver [flujo de trabajo](docs/workflow.md).

Para agentes, [AGENTS.md](AGENTS.md) es la entrada. El [harness](docs/harness.md) ofrece instrucciones, tareas y verificaciones locales; no depende de un proveedor de agentes ni de Harness.io.

- [Índice de documentación](docs/README.md)
- [Base de datos y discrepancias](docs/db-context.md)
- [Decisión de adoptar SDD](docs/decisions/0001-spec-driven-workflow.md)
- [Catálogo de especificaciones](specs/README.md)

Los documentos antiguos [equipos](README-create-team.md) e [imágenes](README-image-upload.md) se conservan como referencia histórica, no como evidencia de funcionalidad completa.

El comando reset-project es un resto del generador de Expo que mueve o elimina código. No forma parte de la instalación ni del mantenimiento normal.
