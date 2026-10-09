# Plantilla de especificación

Crear una carpeta `specs/NNN-nombre/` y cuatro archivos. Esta plantilla no es una especificación activa y no se registra como trabajo.

## spec.md
Título con ID SPEC-NNN. Secciones: Problema, Objetivo, Alcance, Fuera de alcance, Requisitos, Aceptación, Preguntas abiertas. Requisitos como encabezados `### R01 — Nombre`, con resultado observable y casos de fallo. Identificar decisiones propuestas.

## plan.md
Estrategia, secuencia, contratos/archivos afectados, riesgos, pruebas y decisiones. No inventar configuración de sistemas externos no inspeccionados.

## tasks.json
Ejemplo mínimo (adaptar al trabajo real):

```json
{
  "specId": "SPEC-002",
  "tasks": [
    {
      "id": "T01",
      "title": "Implementar requisito definido",
      "status": "todo",
      "requirements": ["R01"],
      "dependsOn": [],
      "acceptance": "Resultado observable del requisito R01 comprobado.",
      "evidence": []
    }
  ]
}
```

Los estados permitidos están en [el flujo](../docs/workflow.md). Cada requisito debe tener una tarea; no cerrar tareas con dependencias pendientes. `evidence` contiene rutas desde la raíz del repositorio a documentos/pruebas existentes, no URLs externas ni salidas temporales ignoradas. Registrar detalles y resultados dentro de esos archivos.

## verification.md
Entorno, escenarios con IDs vinculados a requisitos, resultados ejecutados, fecha y limitaciones. Inicialmente declarar que no hay aceptación ejecutada. Al verificar, documentar comandos o pasos reproducibles y resultado.

## Registro
Añadir al array `specs` de `registry.json` un objeto con `id`, `title`, `path`, `status` y `requirements`. `path` es la carpeta desde la raíz; los requisitos deben coincidir con encabezados de `spec.md`. Ejecutar `npm run verify:docs`.
