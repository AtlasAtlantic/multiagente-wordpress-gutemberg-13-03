---
name: agents-change-governance
description: Gobernar cambios canónicos en `.agents/` y migraciones de legado. Usar al auditar skills antiguas, clasificar contenido reusable, aplicar refactors mínimos seguros para la plataforma y cerrar con validación trazable.
---

# agents-change-governance

Usa esta skill para evolucionar `.agents/` sin importar material legado a ciegas.

## Cuándo usarla

- al auditar skills o reglas de repositorios legados
- al migrar guías reutilizables a la plataforma actual de `.agents/`
- al cambiar arquitectura canónica, skills, tools o flujos de validación
- al decidir si contenido legado debe refactorizarse, fusionarse, moverse o descartarse

## Flujo de trabajo

1. Leer primero el contexto canónico actual:
   - `.agents/AGENTS.md`
   - archivos relevantes en `.agents/architecture/`
   - skills actuales en `.agents/skills/`
   - `docs/agents-change-log.md`
   - `docs/agents-change-record.md`
2. Auditar el material legado frente a la plataforma actual antes de editar nada.
3. Mantener solo el contenido reusable que pertenezca al `.agents/` canónico.
4. Priorizar mejorar una skill existente antes de crear una nueva.
5. Cuando esté justificada una skill nueva, mantener una sola responsabilidad y mover la guía detallada a `references/`.
6. Cerrar con evidencia explícita de validación y actualización obligatoria de trazabilidad.

## Referencias

- Para reglas de clasificación y decisiones de migración, leer `references/legacy-migration-audit.md`.
- Para guardrails de ejecución, validación y registro de cambios, leer `references/platform-change-checklist.md`.

## Salida esperada

- una decisión de migración justificada
- ediciones canónicas mínimas en `.agents/`
- trazabilidad de cambios actualizada en `docs/agents-change-record.md`
- evidencia de validación o una explicación precisa de por qué no pudo ejecutarse un check
