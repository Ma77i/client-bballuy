# Desarrollo local

## Entorno observado
Windows/PowerShell, Node.js 24.16.0 y npm 11.13.0 durante la organización. Son versiones observadas, no una matriz de compatibilidad. El repositorio declara Expo 54, React Native 0.81.4, React 19.1 y TypeScript 5.9; lockfile npm versión 3.

La revisión inicial no actualizó dependencias ni certificó compilación móvil. La corrección posterior del arranque alinea dependencias dentro de SDK 54; los resultados están en [la evidencia](../specs/001-core-journey/verification.md). Deno y Supabase CLI no estaban en PATH. Registrar el entorno de cada prueba antes de atribuir fallos al código.

## Preparación
1. Instalar con `npm ci` desde la raíz. En un entorno preparado no reinstalar por rutina.
2. Copiar `.env.example` a `.env`, con URL y clave pública de Supabase de desarrollo. Nunca colocar una clave administrativa en `EXPO_PUBLIC_*`.
3. Ejecutar `npm run verify:docs` y `npm run verify`.
4. Ejecutar `npm start` y abrir en dispositivo o emulador compatible. `npm run android` requiere herramientas Android; compilar iOS localmente requiere macOS/Xcode.

Do not run exploratory SQL against production. T02 now provides a verified
[disposable local backend](../local-backend/README.md), separate from the hosted
project and historical root migrations. Use db:local:start, db:local:verify,
db:local:types and db:local:stop from the repository root; db:local:reset replays
only that disposable database. Read the local workflow's observed network limits.

## Comandos
- `npm start`: Expo.
- `npm run android`, `npm run ios`, `npm run web`: destinos del proyecto.
- `npm run harness:status`: tareas habilitadas o pendientes de dependencias.
- `npm run verify:docs`: estructura documental, enlaces locales y trazabilidad.
- `npm run test:harness`: pruebas del verificador; ejecutar cuando cambien sus scripts.
- `npm run typecheck:app`: TypeScript del cliente, sin Deno.
- `npm run lint:app`: ESLint sobre directorios del cliente.
- `npm run verify`: documentación + tipos + lint del cliente; ejecuta todos aunque uno falle.
- `npm run verify:edge`: `deno check` de funciones; requiere Deno y sus dependencias, puede necesitar red. No despliega ni hace pruebas funcionales.
- `npm run typecheck` y `npm run lint`: controles amplios históricos, todavía mezclan entornos.

En PowerShell usar `npm.cmd` si la política local bloquea `npm.ps1`. El harness usa Node sin depender de un shell específico.

## Error al iniciar con el CLI global antiguo
Usar `npm start` o `npx expo start` desde la raíz. Ambos utilizan el CLI incluido en la dependencia local `expo`. Ejecutar `expo start` directamente puede seleccionar el paquete global obsoleto `expo-cli` y fallar con `ExpoMetroConfig.loadAsync is not a function`.

En PowerShell con scripts bloqueados, iniciar con `npm.cmd start` o `npx.cmd expo start`. Para limpiar la caché de Metro: `npm.cmd start -- --clear`. No hace falta cambiar la política de PowerShell ni instalar otro CLI global.

Contrastar versiones con `npx.cmd expo install --check`; corregir desajustes con `npx.cmd expo install --fix` y revisar los cambios de `package.json` y `package-lock.json`. Mantener el SDK acordado. No agregar `@types/react-native`: la versión de React Native del proyecto incluye sus propios tipos.

Para una comprobación sin red, usar `npm.cmd start -- --offline`. No combinar `--offline` con `--localhost`: este CLI los considera opciones de host excluyentes. Que Metro arranque no acredita compilación móvil ni el recorrido funcional.

## Datos y cierre
### Client regression tests

Run `npm run test:client` alongside `npm run verify`. The tests use Node's built-in test runner and native TypeScript loading, verified with Node 24.16.0. No test framework or extra dependency is installed. The suite imports the real profanity utility and exercises accepted text, case-insensitive detection, word boundaries, masking and rejected validation results.

Keep pure-logic regression tests focused on changed behavior. TypeScript and lint cover the court result contract and module resolution; they do not prove rendered UI interactions. Add native component/device tests when the affected MVP screens are connected. Backend authorization and integrity need direct allow/deny tests against a disposable database in T02/T03; session restart and account switching need the T04/T05 device scenarios. The four utility tests do not cover these boundaries or establish language-wide moderation accuracy. `verify` remains the documentation/type/lint command; run `test:client` separately.

Los controles locales de documentación/tipos/lint no leen `.env` ni consultan Supabase. Las pruebas funcionales requieren entorno de desarrollo y cuentas de prueba identificados, sin guardar contraseñas, JWT ni datos personales como evidencia.

No ejecutar `reset-project`: es un resto del generador y puede mover/eliminar código; no limpia la caché.

Al cerrar una corrección, documentar el caso que fallaba, verificarlo y comprobar escenarios afectados. Para permisos, probar también intentos denegados de otras cuentas. Para cambios documentales basta la verificación documental, informando fallos conocidos del resto.
