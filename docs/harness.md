# Harness para agentes

Un harness es el entorno de instrucciones, contexto y verificaciones que permite a un agente trabajar con resultados comprobables. Aquí es local y pequeño; no es Harness.io ni un servicio autónomo.

## Componentes
- `AGENTS.md`: entrada y reglas del repositorio.
- `docs/`: contexto, estado conocido y procedimiento.
- `specs/registry.json`: catálogo de especificaciones y requisitos.
- `specs/*/tasks.json`: tareas, dependencias, condiciones de salida y evidencia.
- `scripts/harness.mjs`: controles ejecutables sin dependencias nuevas.

## Comandos
`npm run harness:status` valida el registro y muestra tareas, dependencias y disponibilidad. No inicia agentes, no modifica tareas y no demuestra que los controles pasen.

`npm run verify:docs` comprueba archivos requeridos no vacíos, rutas locales de enlaces Markdown, registro, IDs, requisitos con tareas, estados, dependencias sin ciclos y evidencia existente para tareas terminadas. No verifica anclas, enlaces externos ni la verdad del contenido de la evidencia. Rechaza evidencia temporal de `.harness/`.

`npm run verify` ejecuta documentación, TypeScript y ESLint del **cliente**; ejecuta los tres incluso si uno falla. Devuelve código 1 si alguno falla, incluyendo una herramienta ausente. No aplica arreglos ni llama al backend. Los avisos de lint se muestran; no hacen fallar el comando por sí solos.

`npm run verify:edge` ejecuta `deno check` sobre los `index.ts` de las funciones Supabase. Si Deno no está disponible, falla explícitamente. Puede descargar dependencias de las funciones; no despliega, no invoca endpoints y no prueba permisos SQL.

`npm run test:harness` prueba el propio verificador con repositorios temporales aislados: enlaces rotos, requisitos sin tareas, ciclos, cierre sin evidencia, dependencias pendientes y propagación de fallos. No son pruebas funcionales de la app. Ejecutarlo al modificar el harness; los fixtures viven bajo `.harness/test-fixtures/` y se limpian al terminar.

## Resultados
Cada ejecución escribe `.harness/docs.json`, `.harness/verify.json` o `.harness/edge.json`, según el comando. Contiene fecha, versión de Node, plataforma, alcance, checks y códigos de salida; el stdout detallado se ve en la terminal. Es temporal e ignorado por Git; cada modo sobrescribe solo su propio último resultado.

Para cerrar una tarea, registrar el resumen reproducible en `verification.md` o una prueba versionable y referenciarlo desde `evidence`. El harness valida que exista, pero no puede juzgar si demuestra el criterio de aceptación. No marca tareas automáticamente.

## Uso en una sesión
1. Leer instrucciones, estado y especificación.
2. Ejecutar status y verify; registrar la línea base.
3. Elegir tarea disponible; aclarar decisiones de producto de las que dependa.
4. Actualizar tarea a `in_progress`, implementar alcance y pruebas pertinentes.
5. Ejecutar controles y escenarios; informar también los fallos previos.
6. Registrar evidencia y cambiar a `done` solo al cumplir condición de salida.

Petición reutilizable: «Leé AGENTS.md y SPEC-001, ejecutá el harness, trabajá en la siguiente tarea disponible dentro del alcance confirmado y dejá evidencia. No despliegues ni modifiques bases remotas como parte de la verificación».

## Límites actuales
T01 includes focused client regression tests; T02 adds local SQL/API contract
checks through the [local backend workflow](../local-backend/README.md). These
database checks are separate from the static verify command. Two-account
authorization, the full device journey, native build acceptance and CI remain
pending. Database tests use the disposable local environment, never production.

No se añadió un pipeline atado a un proveedor. Los comandos y códigos de salida pueden usarse luego en CI, sin cambiar su significado ni convertir fallos conocidos en excepciones permanentes.
