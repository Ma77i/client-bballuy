# ADR 0001 — SDD y harness local

Estado: adoptada para organizar el repositorio. Fecha: 2026-09-17.

## Contexto
El proyecto se retoma tras una pausa, con funciones parciales, documentación demasiado optimista y contratos de datos divergentes. El usuario pidió documentación, SDD e instrucciones/verificaciones para agentes.

## Decisión
Guardar especificaciones, planes, tareas y evidencia en el repositorio. Usar `AGENTS.md` como entrada y un harness Node con controles locales, códigos de salida fiables y resultados JSON temporales.

Primera especificación: registro → perfil → sesión persistente → equipo → segundo miembro. Separar comportamiento esperado, estado actual y evidencia.

## Alternativas
- Solo conversaciones: contexto difícil de recuperar entre sesiones.
- Plataforma externa o framework SDD completo: configuración extra antes de resolver contratos y controles básicos.
- Reescritura: no justificada por este objetivo.

## Consecuencias
Mantener documentación junto al código. El harness empieza con documentación, tipos y lint; faltan pruebas de comportamiento/permisos. No ofrece despliegue automático, aislamiento de agentes ni certificación de seguridad. No se conecta a Harness.io.
