# Checklist de implementación de `.agents/`

## Objetivo

Implantar la estructura y arquitectura base de `.agents/` como fuente única de verdad de la capa multiagente del proyecto, con foco en un entorno WordPress + Docker y adaptadores runtime derivados.

## Criterios de cierre global

- [ ] Existe `.agents/` con estructura base operativa.
- [ ] La arquitectura canónica está documentada y versionada.
- [ ] Los agentes base tienen contratos claros de entrada y salida.
- [ ] Los pipelines mínimos están definidos.
- [ ] El perfil WordPress está aterrizado al stack real del proyecto.
- [ ] Hay skills y tools base para operar la capa IA.
- [ ] Los esquemas validan la consistencia mínima.
- [ ] Los adaptadores runtime se generan como derivados, no como origen.
- [ ] Existe un flujo claro para validar cambios y evitar deriva.

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

- [ ] Crear `.agents/AGENTS.md`.
- [ ] Crear `.agents/architecture/`.
- [ ] Crear `.agents/agents/`.
- [ ] Crear `.agents/pipelines/`.
- [ ] Crear `.agents/profiles/`.
- [ ] Crear `.agents/skills/`.
- [ ] Crear `.agents/tools/`.
- [ ] Crear `.agents/runtime/`.
- [ ] Crear `.agents/schemas/`.
- [ ] Añadir contenido base funcional a cada ruta, evitando directorios vacíos sin propósito.

Entregables esperados:

- Estructura canónica completa de `.agents/`.
- Primer conjunto de archivos base listos para evolucionar.

## Fase 3. Capa normativa de arquitectura

Objetivo: convertir la visión arquitectónica en contratos explícitos.

- [ ] Crear `.agents/architecture/principles.md`.
- [ ] Crear `.agents/architecture/overview.md`.
- [ ] Crear `.agents/architecture/glossary.md`.
- [ ] Crear `.agents/architecture/routing.yaml`.
- [ ] Crear `.agents/architecture/handoff_schema.yaml`.
- [ ] Crear `.agents/architecture/guardrails.yaml`.
- [ ] Crear `.agents/architecture/state_model.yaml`.
- [ ] Definir reglas de routing entre roles.
- [ ] Definir estados válidos y transiciones mínimas.
- [ ] Definir guardrails operativos y límites de actuación.

Entregables esperados:

- Arquitectura normativa y contractual de la capa IA.

## Fase 4. Definición de agentes base

Objetivo: dejar descritos los roles estándar y sus contratos operativos.

- [ ] Crear `.agents/agents/planner.md`.
- [ ] Crear `.agents/agents/builder.md`.
- [ ] Crear `.agents/agents/reviewer.md`.
- [ ] Crear `.agents/agents/fixer.md`.
- [ ] Crear `.agents/agents/qa.md`.
- [ ] Definir responsabilidades por rol.
- [ ] Definir entradas esperadas por rol.
- [ ] Definir salidas esperadas por rol.
- [ ] Definir límites, restricciones y reglas de decisión.
- [ ] Definir artefactos de handoff esperados por rol.

Entregables esperados:

- Roles base consistentes con el patrón `Planner → Builder → Reviewer → Fixer → QA`.

## Fase 5. Pipelines mínimos

Objetivo: formalizar flujos reutilizables para tipos de trabajo comunes.

- [ ] Crear `.agents/pipelines/feature.yaml`.
- [ ] Crear `.agents/pipelines/bugfix.yaml`.
- [ ] Crear `.agents/pipelines/refactor.yaml`.
- [ ] Crear `.agents/pipelines/audit.yaml`.
- [ ] Definir pasos y dependencias por pipeline.
- [ ] Definir precondiciones de entrada.
- [ ] Definir salidas y criterios de paso a la siguiente etapa.
- [ ] Definir bloqueos y condiciones de stop.

Entregables esperados:

- Pipelines mínimos listos para ejecución y validación.

## Fase 6. Perfiles de proyecto

Objetivo: aterrizar la arquitectura a contextos de proyecto concretos, con prioridad en WordPress.

- [ ] Crear `.agents/profiles/wordpress.yaml`.
- [ ] Crear `.agents/profiles/generic-web.yaml`.
- [ ] Evaluar si `plugin.yaml` y `laravel.yaml` entran en v1 o quedan como placeholders explícitos.
- [ ] Modelar stack WordPress + Docker del proyecto actual.
- [ ] Referenciar uso de WP-CLI, servicios Docker y rutas relevantes.
- [ ] Definir checks reproducibles asociados al perfil WordPress.

Entregables esperados:

- Perfil WordPress alineado con el repo actual.
- Perfil genérico mínimo para portabilidad.

## Fase 7. Skills base

Objetivo: crear capacidades reutilizables para operar el sistema y el contexto WordPress + Docker.

- [ ] Crear skill `agents-bootstrap-architecture`.
- [ ] Crear skill `agents-architecture-design`.
- [ ] Crear skill `agents-runtime-adapter`.
- [ ] Crear skill `agents-config-validation`.
- [ ] Crear skill `wordpress-project-setup`.
- [ ] Crear skill `docker-wordpress-stack`.
- [ ] Crear skill `project-scaffold-generator`.
- [ ] Crear skill `project-doctor`.
- [ ] Añadir `SKILL.md` en cada skill.
- [ ] Añadir `scripts/` o `resources/` solo cuando aporten valor real.

Entregables esperados:

- Set inicial de skills reutilizables y coherentes con la misión del bootstrap.

## Fase 8. Tools deterministas

Objetivo: mover la ejecución crítica a herramientas repetibles y auditables.

- [ ] Crear `.agents/tools/doctor/`.
- [ ] Crear `.agents/tools/validate-config/`.
- [ ] Crear `.agents/tools/sync-runtime/`.
- [ ] Crear `.agents/tools/scaffold/`.
- [ ] Implementar validación estructural de `.agents/`.
- [ ] Implementar validación de YAML y JSON Schema.
- [ ] Implementar generación de outputs runtime.
- [ ] Implementar scaffold mínimo para nuevos artefactos.

Entregables esperados:

- Tooling base para validar, sincronizar y escalar la arquitectura.

## Fase 9. Esquemas de validación

Objetivo: impedir deriva y ambigüedad mediante validación formal.

- [ ] Crear `.agents/schemas/profile.schema.json`.
- [ ] Crear `.agents/schemas/pipeline.schema.json`.
- [ ] Crear `.agents/schemas/routing.schema.json`.
- [ ] Crear `.agents/schemas/handoff.schema.json`.
- [ ] Validar referencias cruzadas entre pipelines y agentes.
- [ ] Validar referencias cruzadas entre perfiles y skills.
- [ ] Validar consistencia de routing y handoffs.

Entregables esperados:

- Base de validación formal para la v1.

## Fase 10. Adaptadores runtime v1

Objetivo: proyectar la arquitectura canónica a runtimes concretos sin convertirlos en origen de verdad.

- [ ] Crear `.agents/runtime/codex/`.
- [ ] Crear `.agents/runtime/claude/`.
- [ ] Crear `.agents/runtime/cursor/`.
- [ ] Crear `.agents/runtime/chatgpt/`.
- [ ] Añadir `mapping.yaml` por runtime.
- [ ] Añadir `templates/` por runtime.
- [ ] Añadir `output/` por runtime.
- [ ] Definir trazabilidad entre fuente canónica y artefacto derivado.
- [ ] Generar una primera salida mínima por runtime.

Entregables esperados:

- Adaptadores v1 operativos y explícitamente derivados de `.agents/`.

## Fase 11. Gobernanza operativa

Objetivo: definir cómo se cambia, valida y sincroniza la arquitectura sin deriva.

- [ ] Documentar flujo de cambios sobre `.agents/`.
- [ ] Documentar flujo de validación antes de aceptar cambios.
- [ ] Documentar regeneración de adaptadores runtime.
- [ ] Documentar revisión de diffs y control de trazabilidad.
- [ ] Definir convención para evolucionar la spec sin romper proyectos.

Entregables esperados:

- Convención operativa clara para mantenimiento y evolución.

## Fase 12. Validación end-to-end

Objetivo: verificar que la base implantada es operativa, no solo documental.

- [ ] Ejecutar validación estructural completa de `.agents/`.
- [ ] Ejecutar validación de esquemas.
- [ ] Generar outputs runtime desde la fuente canónica.
- [ ] Comprobar que el perfil WordPress refleja el stack real del proyecto.
- [ ] Revisar huecos, incoherencias o sobreingeniería.
- [ ] Cerrar ajustes finales de v1.

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
- [ ] Primer corte funcional de `.agents/` completado.
- [ ] Validación end-to-end completada.
