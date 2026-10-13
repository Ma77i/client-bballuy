# Especificaciones

El catálogo legible por herramientas es [registry.json](registry.json). El estado de ejecución vive allí y en cada `tasks.json`; no se mantiene otra lista de estados en este índice.

## Trabajo inicial

Current order: preserve SPEC-001, define and deliver the player-first MVP through
[SPEC-002](002-player-pickup/spec.md). iOS beta is future work without a
registered specification or reserved ID. See
[ADR 0010](../docs/decisions/0010-player-first-next-mvp.md).
- [SPEC-001: account, courts and community membership](001-core-journey/spec.md)
- [Plan](001-core-journey/plan.md)
- [Tareas y dependencias](001-core-journey/tasks.json)
- [Evidencia y escenarios](001-core-journey/verification.md)

## Convención
Cada carpeta `NNN-nombre` contiene `spec.md`, `plan.md`, `tasks.json` y `verification.md`. Requisitos con ID estable `R01`, `R02`, etc., únicos dentro de su especificación; tareas `T00`, `T01`, etc.

Usar [template.md](template.md) para el siguiente trabajo y seguir el [flujo SDD](../docs/workflow.md). Ejecutar `npm run harness:status` para encontrar tareas disponibles. La aceptación requiere evidencia de comportamiento, no solo archivos existentes.
