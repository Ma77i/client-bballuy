# Trabajo guiado por especificaciones

## Ciclo
1. **Especificar:** problema, alcance, exclusiones, requisitos con ID y criterios observables en `specs/NNN-nombre/spec.md`.
2. **Planificar:** decisiones, archivos, riesgos, pruebas y orden en `plan.md`; distinguir propuestas de decisiones confirmadas.
3. **Descomponer:** tareas pequeñas en `tasks.json`, con requisitos, dependencias y condición de salida.
4. **Implementar:** una tarea coherente por cambio; actualizar el alcance antes de ampliarlo.
5. **Verificar:** controles locales y aceptación; registrar entorno y evidencia en `verification.md`.
6. **Cerrar:** actualizar estados según evidencia y documentación afectada.

Una corrección dentro del alcance puede actualizar una especificación existente. No crear una nueva por cada ajuste de formato.

## Task numbering and execution order

Task IDs must follow execution order in every new plan. If scope, dependencies
or task insertion changes that order, renumber the affected tasks and update
dependencies, plans, status references and evidence mappings together before
continuing. Do not append a higher-numbered task ahead of a lower-numbered
execution step merely to preserve old numbering. Record old-to-new mappings
when existing evidence refers to previous IDs.

The owner requested this convention for future planning on 2026-10-13.

## Estados
Especificación: `draft`, `ready`, `in_progress`, `verified` o `blocked`. `ready` significa lista para ejecutar; `verified`, aceptación comprobada.

Tarea: `todo`, `in_progress`, `done` o `blocked`. Una tarea `done` requiere evidencia reproducible y dependencias terminadas. Un fallo conocido sigue siendo fallo.

`specs/registry.json` enumera especificaciones/requisitos; `tasks.json` guarda tareas y estados. No duplicar esos estados con casillas Markdown.

## Evidencia
- Requisito y tarea.
- Fecha, entorno y comando/pasos concretos.
- Resultado esperado y observado, prueba o evidencia localizable.
- Limitaciones y aspectos no ejecutados.

`.harness/*.json` es temporal y no se versiona. Para cerrar una tarea, trasladar el resultado relevante a un documento o prueba del repositorio.

## Decisiones y aceptación
Registrar decisiones estructurales en `docs/decisions/NNNN-titulo.md`, con contexto, decisión, alternativas y consecuencias. Resolver decisiones técnicas rutinarias; pedir definición cuando cambie el producto o afecte datos existentes.

Una especificación es `verified` cuando todos los requisitos tienen evidencia y todas sus tareas están `done`. El harness valida coherencia estructural; evaluar la calidad de la evidencia sigue siendo responsabilidad de quien revisa.

## Nueva especificación
Usar [la plantilla](../specs/template.md): crear `spec.md`, `plan.md`, `verification.md` y `tasks.json` en una carpeta nueva, registrarla y ejecutar `npm run verify:docs` antes de implementar.
