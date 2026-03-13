# Checklist de implementación de `.agents/`

## Objetivo

Implantar la estructura y arquitectura base de `.agents/` como fuente única de verdad de la capa multiagente del proyecto, con foco en un entorno WordPress + Docker y adaptadores runtime derivados.

## Criterios de cierre global

- [x] Existe `.agents/` con estructura base operativa.
- [x] La arquitectura canónica está documentada y versionada.
- [x] Los agentes base tienen contratos claros de entrada y salida.
- [x] Los pipelines mínimos están definidos.
- [x] El perfil WordPress está aterrizado al stack real del proyecto.
- [x] Hay skills y tools base para operar la capa IA.
- [x] Los esquemas validan la consistencia mínima.
- [x] Los adaptadores runtime se generan como derivados, no como origen.
- [x] Existe un flujo claro para validar cambios y evitar deriva.

## Fase 1. Cierre de decisiones de Spec v1

Objetivo: fijar las decisiones mínimas que desbloquean la implantación sin dejar ambigüedades.

- [x] Confirmar `.agents/` como única fuente de verdad.
- [x] Fijar `.agents/skills/` como convención canónica y corregir referencias alternativas como `.skills/`.
- [x] Confirmar estructura mínima de carpetas y archivos de v1.
- [x] Definir convención de nombres para agentes, pipelines, perfiles, skills y tools.
- [x] Definir formato canónico por tipo de artefacto: Markdown, YAML y JSON Schema.
- [x] Definir versión inicial de la spec y criterio de compatibilidad futura.

Entregables esperados:

- `docs/agents-spec-v1.md` alineado con la convención final.
- Decisiones de nomenclatura y estructura sin contradicciones internas.

## Fase 2. Scaffold base de `.agents/`

Objetivo: materializar la estructura inicial para que el sistema exista físicamente en el repositorio.

- [x] Crear `.agents/AGENTS.md`.
- [x] Crear `.agents/architecture/`.
- [x] Crear `.agents/agents/`.
- [x] Crear `.agents/pipelines/`.
- [x] Crear `.agents/profiles/`.
- [x] Crear `.agents/skills/`.
- [x] Crear `.agents/tools/`.
- [x] Crear `.agents/runtime/`.
- [x] Crear `.agents/schemas/`.
- [x] Añadir contenido base funcional a cada ruta, evitando directorios vacíos sin propósito.

Entregables esperados:

- Estructura canónica completa de `.agents/`.
- Primer conjunto de archivos base listos para evolucionar.

## Fase 3. Capa normativa de arquitectura

Objetivo: convertir la visión arquitectónica en contratos explícitos.

- [x] Crear `.agents/architecture/principles.md`.
- [x] Crear `.agents/architecture/overview.md`.
- [x] Crear `.agents/architecture/glossary.md`.
- [x] Crear `.agents/architecture/routing.yaml`.
- [x] Crear `.agents/architecture/handoff_schema.yaml`.
- [x] Crear `.agents/architecture/guardrails.yaml`.
- [x] Crear `.agents/architecture/state_model.yaml`.
- [x] Definir reglas de routing entre roles.
- [x] Definir estados válidos y transiciones mínimas.
- [x] Definir guardrails operativos y límites de actuación.

Entregables esperados:

- Arquitectura normativa y contractual de la capa IA.

## Fase 4. Definición de agentes base

Objetivo: dejar descritos los roles estándar y sus contratos operativos.

- [x] Crear `.agents/agents/planner.md`.
- [x] Crear `.agents/agents/builder.md`.
- [x] Crear `.agents/agents/reviewer.md`.
- [x] Crear `.agents/agents/fixer.md`.
- [x] Crear `.agents/agents/qa.md`.
- [x] Definir responsabilidades por rol.
- [x] Definir entradas esperadas por rol.
- [x] Definir salidas esperadas por rol.
- [x] Definir límites, restricciones y reglas de decisión.
- [x] Definir artefactos de handoff esperados por rol.

Entregables esperados:

- Roles base consistentes con el patrón `Planner → Builder → Reviewer → Fixer → QA`.

## Fase 5. Pipelines mínimos

Objetivo: formalizar flujos reutilizables para tipos de trabajo comunes.

- [x] Crear `.agents/pipelines/feature.yaml`.
- [x] Crear `.agents/pipelines/bugfix.yaml`.
- [x] Crear `.agents/pipelines/refactor.yaml`.
- [x] Crear `.agents/pipelines/audit.yaml`.
- [x] Definir pasos y dependencias por pipeline.
- [x] Definir precondiciones de entrada.
- [x] Definir salidas y criterios de paso a la siguiente etapa.
- [x] Definir bloqueos y condiciones de stop.

Entregables esperados:

- Pipelines mínimos listos para ejecución y validación.

## Fase 6. Perfiles de proyecto

Objetivo: aterrizar la arquitectura a contextos de proyecto concretos, con prioridad en WordPress.

- [x] Crear `.agents/profiles/wordpress.yaml`.
- [x] Crear `.agents/profiles/generic-web.yaml`.
- [x] Evaluar si `plugin.yaml` y `laravel.yaml` entran en v1 o quedan como placeholders explícitos.
- [x] Modelar stack WordPress + Docker del proyecto actual.
- [x] Referenciar uso de WP-CLI, servicios Docker y rutas relevantes.
- [x] Definir checks reproducibles asociados al perfil WordPress.

Entregables esperados:

- Perfil WordPress alineado con el repo actual.
- Perfil genérico mínimo para portabilidad.

## Fase 7. Skills base

Objetivo: crear capacidades reutilizables para operar el sistema y el contexto WordPress + Docker.

- [x] Crear skill `agents-bootstrap-architecture`.
- [x] Crear skill `agents-architecture-design`.
- [x] Crear skill `agents-runtime-adapter`.
- [x] Crear skill `agents-config-validation`.
- [x] Crear skill `wordpress-project-setup`.
- [x] Crear skill `docker-wordpress-stack`.
- [x] Crear skill `project-scaffold-generator`.
- [x] Crear skill `project-doctor`.
- [x] Añadir `SKILL.md` en cada skill.
- [x] Añadir `scripts/` o `resources/` solo cuando aporten valor real.

Entregables esperados:

- Set inicial de skills reutilizables y coherentes con la misión del bootstrap.

## Fase 8. Tools deterministas

Objetivo: mover la ejecución crítica a herramientas repetibles y auditables.

- [x] Crear `.agents/tools/doctor/`.
- [x] Crear `.agents/tools/validate-config/`.
- [x] Crear `.agents/tools/sync-runtime/`.
- [x] Crear `.agents/tools/scaffold/`.
- [x] Implementar validación estructural de `.agents/`.
- [x] Implementar validación de YAML y JSON Schema.
- [x] Implementar generación de outputs runtime.
- [x] Implementar scaffold mínimo para nuevos artefactos.

Entregables esperados:

- Tooling base para validar, sincronizar y escalar la arquitectura.

## Fase 9. Esquemas de validación

Objetivo: impedir deriva y ambigüedad mediante validación formal.

- [x] Crear `.agents/schemas/profile.schema.json`.
- [x] Crear `.agents/schemas/pipeline.schema.json`.
- [x] Crear `.agents/schemas/routing.schema.json`.
- [x] Crear `.agents/schemas/handoff.schema.json`.
- [x] Validar referencias cruzadas entre pipelines y agentes.
- [x] Validar referencias cruzadas entre perfiles y skills.
- [x] Validar consistencia de routing y handoffs.

Entregables esperados:

- Base de validación formal para la v1.

## Fase 10. Adaptadores runtime v1

Objetivo: proyectar la arquitectura canónica a runtimes concretos sin convertirlos en origen de verdad.

- [x] Crear `.agents/runtime/codex/`.
- [x] Crear `.agents/runtime/claude/`.
- [x] Crear `.agents/runtime/cursor/`.
- [x] Crear `.agents/runtime/chatgpt/`.
- [x] Añadir `mapping.yaml` por runtime.
- [x] Añadir `templates/` por runtime.
- [x] Añadir `output/` por runtime.
- [x] Definir trazabilidad entre fuente canónica y artefacto derivado.
- [x] Generar una primera salida mínima por runtime.

Entregables esperados:

- Adaptadores v1 operativos y explícitamente derivados de `.agents/`.

## Fase 11. Gobernanza operativa

Objetivo: definir cómo se cambia, valida y sincroniza la arquitectura sin deriva.

- [x] Documentar flujo de cambios sobre `.agents/`.
- [x] Documentar flujo de validación antes de aceptar cambios.
- [x] Documentar regeneración de adaptadores runtime.
- [x] Documentar revisión de diffs y control de trazabilidad.
- [x] Definir convención para evolucionar la spec sin romper proyectos.

Entregables esperados:

- Convención operativa clara para mantenimiento y evolución.

## Fase 12. Validación end-to-end

Objetivo: verificar que la base implantada es operativa, no solo documental.

- [x] Ejecutar validación estructural completa de `.agents/`.
- [x] Ejecutar validación de esquemas.
- [x] Generar outputs runtime desde la fuente canónica.
- [x] Comprobar que el perfil WordPress refleja el stack real del proyecto.
- [x] Revisar huecos, incoherencias o sobreingeniería.
- [x] Cerrar ajustes finales de v1.

Entregables esperados:

- Base multiagente inicial lista para evolucionar.

## Dependencias clave

- La Fase 1 desbloquea todas las demás.
- La Fase 2 es prerequisito para Fases 3 a 10.
- La Fase 3 condiciona Fases 4, 5, 9 y 10.
- La Fase 6 debe apoyarse en el stack real del repositorio.
- La Fase 8 depende parcialmente de Fases 3 y 9.
- La Fase 12 depende del cierre funcional de Fases 2 a 11.

## Riesgos a vigilar

- [ ] Evitar sobrediseñar runtime adapters antes de cerrar la capa canónica.
- [ ] Evitar duplicar lógica entre `.agents/` y archivos específicos de runtime.
- [ ] Evitar dejar handoffs y outputs como texto ambiguo no validable.
- [ ] Evitar mezclar tools de agentes con scripts generales del proyecto.
- [ ] Evitar crear skills o roles sin un caso operativo claro en v1.

## Registro de progreso

- [x] Plan documentado en `docs/agents-implementation-checklist.md`.
- [x] Implantación iniciada.
- [x] Primer corte funcional de `.agents/` completado.
- [x] Validación end-to-end completada.
