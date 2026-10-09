# Instrucciones del proyecto

## Al comenzar
- Leer `README.md`, `docs/status.md` y `docs/workflow.md`.
- Ejecutar `npm run harness:status` y localizar la especificación del cambio.
- Revisar Git y conservar los cambios existentes del usuario.
- Código, documentación y comentarios dentro del código, en ingles.
- Comunicar en español; distinguir hechos, propuestas y puntos no verificados.

## Fuente de verdad
- `specs/*/spec.md`: comportamiento esperado, no evidencia de implementación.
- `specs/*/tasks.json`: tareas, dependencias y estado de ejecución.
- `specs/*/verification.md`: evidencia de aceptación.
- `docs/status.md`: fotografía del proyecto y límites de las comprobaciones.
- El esquema remoto está pendiente de contrastar; no asumir que coincide con SQL o JSON locales.

## Trabajar en un cambio
- Actualizar requisitos y aceptación antes de cambiar comportamiento.
- Elegir una tarea con dependencias satisfechas y limitar el cambio a su alcance.
- Resolver decisiones técnicas rutinarias con el contexto; preguntar si la ambigüedad cambia el producto o afecta datos existentes.
- No tratar propuestas documentadas como decisiones de producto confirmadas.
- Registrar decisiones estructurales en `docs/decisions/`.
- No delegar ni crear agentes adicionales salvo pedido explícito del usuario.

## Límites y convenciones
- Conservar la estructura Expo; evitar reorganizaciones masivas durante estabilización.
- Validar entradas en el cliente; hacer cumplir permisos e invariantes en el servidor.
- Separar roles globales de roles dentro de un equipo.
- No incluir secretos, tokens ni datos personales en documentación, pruebas o logs.
- No ejecutar `reset-project`, resets de base ni SQL histórico contra un entorno remoto como parte de verificaciones.
- Una tarea de documentación no autoriza desplegar migraciones ni publicar la app.
- No ocultar fallos con exclusiones generales, `any` o desactivando reglas.
- Verificar cliente y Deno por separado; esa separación no exime al servidor de controles.

## Antes de terminar
- Ejecutar `npm run verify`; para Edge Functions modificadas, también `npm run verify:edge`.
- Si se modificó el harness, ejecutar también `npm run test:harness`.
- Añadir pruebas relevantes para comportamiento, permisos o integridad modificados.
- Registrar entorno, pasos/comandos, resultado y limitaciones en la evidencia de la especificación.
- No marcar tareas `done` sin evidencia reproducible en un archivo del repositorio.
- Informar cambios, controles, fallos restantes y siguiente tarea concreta.
- Un control estático verde no equivale a aceptación funcional ni autorización para desplegar.
