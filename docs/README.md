# Documentación

Start on your phone: [mobile reading guide](mobile-guide.md).

## Entender y retomar
- [Producto](product.md): propósito, primer objetivo y decisiones pendientes.
- [Estado](status.md): problemas observados y límites de la revisión.
- [Arquitectura](architecture.md): responsabilidades actuales.
- [Desarrollo](development.md): entorno y comandos.
- [Base de datos](db-context.md): divergencias y reconciliación.
- [Database inspection runbook](database-reconciliation.md): read-only metadata collection, inspected source and reconciliation boundaries.
- [Local backend](../local-backend/README.md): inspected baseline, original court seed, replay and contract checks.

## Cambiar el proyecto
- [Flujo SDD](workflow.md): del requisito a la evidencia.
- [Harness](harness.md): instrucciones y verificaciones para agentes.
- [Especificaciones](../specs/README.md): trabajos planificados y plantilla.
- [Decisión 0001](decisions/0001-spec-driven-workflow.md): organización elegida.
- [Court-first MVP and maps decision](decisions/0002-court-first-mvp.md): persistent court communities confirmed; map recommendation and alternatives.

## Mantener la información
Actualizar el documento que contiene la información original y enlazarlo. El estado de tareas vive solo en `specs/*/tasks.json`; la evidencia funcional, en `verification.md`. Las salidas locales del harness son temporales.

Una especificación expresa intención. Una pantalla existente no demuestra que el comportamiento esté completo. Los documentos históricos de la raíz no sustituyen una comprobación actual.
