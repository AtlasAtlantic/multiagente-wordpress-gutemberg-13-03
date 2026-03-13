# Registro de cambios de `.agents/`

## Índice rápido

- [`LOG-0001`: creación del checklist de implantación](#2026-03-13-0000-europemadrid--log-0001)
- [`LOG-0002`: creación del documento inicial de registro de cambios](#2026-03-13-0000-europemadrid--log-0002)
- [`LOG-0003`: instrucción obligatoria en `AGENTS.md` para usar el changelog](#2026-03-13-1210-europemadrid--log-0003)
- [`LOG-0004`: separación entre instrucciones y registro cronológico](#2026-03-13-1216-europemadrid--log-0004)
- [`LOG-0005`: índice rápido convertido en enlaces internos](#2026-03-13-1219-europemadrid--log-0005)
- [`LOG-0006`: instrucción obligatoria para que el índice use enlaces internos](#2026-03-13-1221-europemadrid--log-0006)
- [`LOG-0007`: cierre documental de la Fase 1 en spec y checklist](#2026-03-13-1223-europemadrid--log-0007)
- [`LOG-0008`: scaffold base de `.agents/` completado](#2026-03-13-1223-europemadrid--log-0008)
- [`LOG-0009`: capa normativa de arquitectura creada en `.agents/architecture`](#2026-03-13-1223-europemadrid--log-0009)
- [`LOG-0010`: roles base definidos en `.agents/agents`](#2026-03-13-1223-europemadrid--log-0010)
- [`LOG-0011`: pipelines mínimos definidos en `.agents/pipelines`](#2026-03-13-1223-europemadrid--log-0011)
- [`LOG-0012`: perfiles base definidos con foco en WordPress](#2026-03-13-1223-europemadrid--log-0012)
- [`LOG-0013`: skills base creadas en `.agents/skills`](#2026-03-13-1223-europemadrid--log-0013)
- [`LOG-0014`: tools deterministas iniciales creadas en `.agents/tools`](#2026-03-13-1223-europemadrid--log-0014)
- [`LOG-0015`: esquemas de validación base creados en `.agents/schemas`](#2026-03-13-1223-europemadrid--log-0015)
- [`LOG-0016`: corrección de `sync-runtime` para propagar fallos de escritura`](#2026-03-13-1237-europemadrid--log-0016)
- [`LOG-0017`: endurecimiento adicional de `sync-runtime` con verificación post-escritura](#2026-03-13-1237-europemadrid--log-0017)
- [`LOG-0018`: validación cruzada reforzada y runtime adapters v1 preparados`](#2026-03-13-1237-europemadrid--log-0018)
- [`LOG-0019`: gobernanza operativa documentada en `.agents/architecture/governance.md`](#2026-03-13-1237-europemadrid--log-0019)
- [`LOG-0020`: corrección del parser de `validate-config` para listas YAML acotadas`](#2026-03-13-1237-europemadrid--log-0020)
- [`LOG-0021`: cierre de la validación end-to-end y outputs runtime generados`](#2026-03-13-1247-europemadrid--log-0021)

## 2026-03-13 00:00 Europe/Madrid | LOG-0001

- Tipo: `create`
- Área: `docs`
- Resumen: creación del checklist de implantación por fases para la arquitectura `.agents/`
- Motivo: disponer de un plan operativo marcable para seguir la implantación de la estructura y arquitectura
- Archivos afectados:
  - `docs/agents-implementation-checklist.md`
- Detalle:
  - se creó un documento de seguimiento por fases
  - se añadieron tareas, entregables, dependencias, riesgos y registro de progreso
- Impacto:
  - habilita seguimiento estructurado de la implantación
- Validación:
  - revisión manual del archivo creado
- Fuente de verdad afectada:
  - `No`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - la hora exacta de creación no quedó registrada previamente y se usa `00:00` como marcador inicial

## 2026-03-13 00:00 Europe/Madrid | LOG-0002

- Tipo: `create`
- Área: `docs`
- Resumen: creación del documento inicial de registro de cambios para documentar las modificaciones futuras
- Motivo: mantener trazabilidad completa de la implantación y evolución de `.agents/`
- Archivos afectados:
  - `docs/agents-change-log.md`
- Detalle:
  - se creó un documento base con propósito, reglas de uso, plantilla y convenciones
  - se añadieron las primeras entradas para inicializar el historial
- Impacto:
  - habilitó auditoría y trazabilidad inicial de cambios
- Validación:
  - revisión manual del archivo creado
- Fuente de verdad afectada:
  - `No`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - esta entrada refleja el estado previo antes de separar instrucciones y registro

## 2026-03-13 12:10 Europe/Madrid | LOG-0003

- Tipo: `update`
- Área: `docs`
- Resumen: instrucción obligatoria en `AGENTS.md` para registrar todos los cambios en un documento separado
- Motivo: hacer vinculante el uso del changelog y dejar explícito que el historial no debe mezclarse con `AGENTS.md`
- Archivos afectados:
  - `AGENTS.md`
  - `docs/agents-change-log.md`
- Detalle:
  - se añadió una sección de registro obligatorio de cambios en `AGENTS.md`
  - se indicó que el changelog debía mantenerse como documento separado
- Impacto:
  - reforzó la trazabilidad obligatoria de la implantación
- Validación:
  - revisión manual de ambos archivos
- Fuente de verdad afectada:
  - `No`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - esta entrada se conserva por trazabilidad histórica aunque la separación definitiva se corrige en `LOG-0004`

## 2026-03-13 12:16 Europe/Madrid | LOG-0004

- Tipo: `update`
- Área: `docs`
- Resumen: separación de instrucciones y registro cronológico en dos archivos distintos
- Motivo: corregir la implementación para que `docs/agents-change-log.md` contenga solo instrucciones y el historial viva en un archivo separado
- Archivos afectados:
  - `AGENTS.md`
  - `docs/agents-change-log.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se convirtió `docs/agents-change-log.md` en documento de instrucciones obligatorias
  - se creó `docs/agents-change-record.md` como archivo oficial del historial cronológico
  - se migraron las entradas previas al nuevo archivo de registro
  - se ajustó `AGENTS.md` para apuntar al archivo de instrucciones y al archivo separado de registro
- Impacto:
  - separa correctamente normativa y evidencia histórica
  - deja la trazabilidad alineada con la intención funcional pedida
- Validación:
  - revisión manual de los tres archivos
- Fuente de verdad afectada:
  - `No`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - a partir de este punto el historial debe mantenerse solo en `docs/agents-change-record.md`

## 2026-03-13 12:19 Europe/Madrid | LOG-0005

- Tipo: `update`
- Área: `docs`
- Resumen: conversión del índice rápido del registro de cambios en enlaces internos navegables
- Motivo: facilitar el acceso directo desde el índice a cada entrada del historial
- Archivos afectados:
  - `docs/agents-change-record.md`
- Detalle:
  - se sustituyeron los elementos del índice rápido por enlaces internos Markdown
  - se añadió una nueva entrada al historial para registrar este cambio
- Impacto:
  - mejora la navegación dentro del registro de cambios
- Validación:
  - revisión manual del documento actualizado
- Fuente de verdad afectada:
  - `No`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - los anclajes dependen de la normalización automática de encabezados Markdown

## 2026-03-13 12:21 Europe/Madrid | LOG-0006

- Tipo: `update`
- Área: `docs`
- Resumen: instrucción obligatoria para que el índice del registro use enlaces internos a cada entrada
- Motivo: dejar la regla explícita en el documento de instrucciones y no solo aplicada en el ejemplo actual
- Archivos afectados:
  - `docs/agents-change-log.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se añadió al documento de instrucciones que el archivo de registro debe incluir un índice rápido
  - se añadió al documento de instrucciones que el índice debe estar compuesto por enlaces internos a cada entrada
  - se registró el cambio en el historial cronológico
- Impacto:
  - convierte en norma obligatoria la navegabilidad interna del registro
- Validación:
  - revisión manual de ambos archivos
- Fuente de verdad afectada:
  - `No`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - futuras entradas deberán mantener actualizado el índice con su enlace interno correspondiente

## 2026-03-13 12:23 Europe/Madrid | LOG-0007

- Tipo: `update`
- Área: `docs`
- Resumen: cierre documental de la Fase 1 mediante decisiones canónicas explícitas en la spec y actualización del checklist
- Motivo: desbloquear la implantación de `.agents/` eliminando ambigüedades de estructura, nombres, formatos y compatibilidad
- Archivos afectados:
  - `docs/agents-spec-v1.md`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se añadió a la spec una sección de decisiones canónicas de v1
  - se fijó `.agents/skills/` como convención y se corrigió el ejemplo que usaba `.skills/`
  - se definieron convención de nombres, formato por artefacto y criterio de compatibilidad de la spec
  - se actualizó el checklist para marcar completadas las tareas de la Fase 1 y el inicio de la implantación
- Impacto:
  - deja la fase de definición inicial lista para pasar al scaffold de `.agents/`
- Validación:
  - revisión manual de los documentos actualizados
- Fuente de verdad afectada:
  - `No`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - el siguiente paso natural es ejecutar la Fase 2 y crear la estructura física de `.agents/`

## 2026-03-13 12:23 Europe/Madrid | LOG-0008

- Tipo: `create`
- Área: `.agents`
- Resumen: creación del scaffold base de `.agents/` con estructura física y archivos mínimos funcionales
- Motivo: completar la Fase 2 del plan y dejar la base canónica lista para empezar a poblar arquitectura, agentes, pipelines y perfiles
- Archivos afectados:
  - `.agents/AGENTS.md`
  - `.agents/architecture/README.md`
  - `.agents/agents/README.md`
  - `.agents/pipelines/README.md`
  - `.agents/profiles/README.md`
  - `.agents/skills/README.md`
  - `.agents/tools/README.md`
  - `.agents/runtime/README.md`
  - `.agents/runtime/codex/README.md`
  - `.agents/runtime/claude/README.md`
  - `.agents/runtime/cursor/README.md`
  - `.agents/runtime/chatgpt/README.md`
  - `.agents/runtime/codex/templates/.gitkeep`
  - `.agents/runtime/codex/output/.gitkeep`
  - `.agents/runtime/claude/templates/.gitkeep`
  - `.agents/runtime/claude/output/.gitkeep`
  - `.agents/runtime/cursor/templates/.gitkeep`
  - `.agents/runtime/cursor/output/.gitkeep`
  - `.agents/runtime/chatgpt/templates/.gitkeep`
  - `.agents/runtime/chatgpt/output/.gitkeep`
  - `.agents/schemas/README.md`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se creó la estructura base de directorios de `.agents/`
  - se añadió un `AGENTS.md` canónico dentro de `.agents/`
  - se añadieron documentos guía mínimos por carpeta para evitar rutas vacías sin propósito
  - se prepararon los directorios base de runtime con `templates/` y `output/`
  - se actualizó el checklist para marcar completada la Fase 2
- Impacto:
  - deja la base física de `.agents/` operativa y lista para la Fase 3
- Validación:
  - revisión manual de la estructura y archivos creados
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - el siguiente paso natural es poblar `architecture/` con los artefactos normativos de v1

## 2026-03-13 12:23 Europe/Madrid | LOG-0009

- Tipo: `create`
- Área: `architecture`
- Resumen: creación de la capa normativa inicial en `.agents/architecture`
- Motivo: completar la Fase 3 y convertir el scaffold base en una arquitectura con contratos explícitos
- Archivos afectados:
  - `.agents/architecture/principles.md`
  - `.agents/architecture/overview.md`
  - `.agents/architecture/glossary.md`
  - `.agents/architecture/routing.yaml`
  - `.agents/architecture/handoff_schema.yaml`
  - `.agents/architecture/guardrails.yaml`
  - `.agents/architecture/state_model.yaml`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se definieron principios operativos y reglas de validación
  - se añadió un overview con el modelo canónico y la separación de responsabilidades
  - se creó un glosario mínimo de términos
  - se formalizaron routing, handoff schema, guardrails y state model
  - se actualizó el checklist para marcar completada la Fase 3 y la documentación de arquitectura
- Impacto:
  - deja la base contractual lista para definir agentes y pipelines sobre reglas explícitas
- Validación:
  - revisión manual de los archivos creados y consistencia básica entre ellos
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - el siguiente paso natural es definir los roles base en `.agents/agents/`

## 2026-03-13 12:23 Europe/Madrid | LOG-0010

- Tipo: `create`
- Área: `agents`
- Resumen: definición de los roles base con contratos operativos en `.agents/agents`
- Motivo: completar la Fase 4 y dejar entradas, salidas, límites y handoffs explícitos para cada rol del sistema
- Archivos afectados:
  - `.agents/agents/planner.md`
  - `.agents/agents/builder.md`
  - `.agents/agents/reviewer.md`
  - `.agents/agents/fixer.md`
  - `.agents/agents/qa.md`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se crearon los cinco roles estándar del patrón base
  - cada rol recibió propósito, entradas, salidas, responsabilidades, límites, reglas de decisión y expectativas de handoff
  - se actualizó el checklist para marcar completada la Fase 4 y el criterio de contratos claros
- Impacto:
  - deja los agentes listos para ser referenciados por pipelines y validaciones
- Validación:
  - revisión manual de consistencia entre roles y arquitectura
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - el siguiente paso natural es formalizar los pipelines en `.agents/pipelines/`

## 2026-03-13 12:23 Europe/Madrid | LOG-0011

- Tipo: `create`
- Área: `pipelines`
- Resumen: definición de los pipelines mínimos en `.agents/pipelines`
- Motivo: completar la Fase 5 y formalizar los flujos base para feature, bugfix, refactor y audit
- Archivos afectados:
  - `.agents/pipelines/feature.yaml`
  - `.agents/pipelines/bugfix.yaml`
  - `.agents/pipelines/refactor.yaml`
  - `.agents/pipelines/audit.yaml`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se definieron precondiciones, pasos, dependencias, salidas y condiciones de stop por pipeline
  - se mantuvo el patrón base planner -> builder -> reviewer -> fixer -> qa con variaciones justificadas para auditoría
  - se actualizó el checklist para marcar completada la Fase 5 y el criterio de pipelines mínimos definidos
- Impacto:
  - deja el sistema preparado para conectar perfiles, validaciones y futuras ejecuciones de runtime
- Validación:
  - revisión manual de consistencia entre pipelines, roles y routing base
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - el siguiente paso natural es definir los perfiles de proyecto con foco en WordPress

## 2026-03-13 12:23 Europe/Madrid | LOG-0012

- Tipo: `create`
- Área: `profiles`
- Resumen: definición de perfiles base con implementación real de `wordpress` y base portable `generic-web`
- Motivo: completar la Fase 6 y aterrizar la arquitectura al stack WordPress + Docker del repositorio
- Archivos afectados:
  - `.agents/profiles/wordpress.yaml`
  - `.agents/profiles/generic-web.yaml`
  - `.agents/profiles/README.md`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se creó `wordpress.yaml` con rutas, servicios, preferencias de tooling y checks reproducibles basados en el repo
  - se creó `generic-web.yaml` como perfil portable sin supuestos WordPress
  - se documentó que `plugin.yaml` y `laravel.yaml` quedan diferidos en v1
  - se actualizó el checklist para marcar completada la Fase 6 y el criterio del perfil WordPress
- Impacto:
  - deja la arquitectura adaptada al contexto real del proyecto y preparada para skills y validación
- Validación:
  - revisión manual de consistencia con `docker-compose.yml` y la estructura `wordpress/wp-content`
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - el siguiente paso natural es crear las skills base del sistema

## 2026-03-13 12:23 Europe/Madrid | LOG-0013

- Tipo: `create`
- Área: `skills`
- Resumen: creación de las skills base del bootstrap en `.agents/skills`
- Motivo: completar la Fase 7 con capacidades reutilizables alineadas con la misión del sistema
- Archivos afectados:
  - `.agents/skills/agents-bootstrap-architecture/SKILL.md`
  - `.agents/skills/agents-architecture-design/SKILL.md`
  - `.agents/skills/agents-runtime-adapter/SKILL.md`
  - `.agents/skills/agents-config-validation/SKILL.md`
  - `.agents/skills/wordpress-project-setup/SKILL.md`
  - `.agents/skills/docker-wordpress-stack/SKILL.md`
  - `.agents/skills/project-scaffold-generator/SKILL.md`
  - `.agents/skills/project-doctor/SKILL.md`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se crearon ocho skills base con propósito, casos de uso y salida esperada
  - se evitó añadir scripts o recursos superfluos en esta primera iteración
  - se actualizó el checklist para marcar completada la Fase 7
- Impacto:
  - deja una capa reutilizable mínima para bootstrap, validación y adaptación de runtime
- Validación:
  - revisión manual de los archivos creados
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - estas skills podrán enriquecerse más adelante con recursos o scripts específicos

## 2026-03-13 12:23 Europe/Madrid | LOG-0014

- Tipo: `create`
- Área: `tools`
- Resumen: creación del tooling determinista inicial para doctor, validación, sync y scaffold
- Motivo: completar la Fase 8 con una base ejecutable para operar la capa canónica
- Archivos afectados:
  - `.agents/tools/doctor/README.md`
  - `.agents/tools/doctor/run.sh`
  - `.agents/tools/validate-config/README.md`
  - `.agents/tools/validate-config/run.sh`
  - `.agents/tools/sync-runtime/README.md`
  - `.agents/tools/sync-runtime/run.sh`
  - `.agents/tools/scaffold/README.md`
  - `.agents/tools/scaffold/run.sh`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se implementó comprobación estructural básica
  - se implementó validación básica de archivos requeridos y referencias mínimas
  - se implementó generación inicial de manifiestos derivados por runtime
  - se implementó un scaffold mínimo para agentes, pipelines, perfiles y skills
  - se actualizó el checklist para marcar completada la Fase 8
- Impacto:
  - dota a la arquitectura de una primera capa ejecutable y repetible
- Validación:
  - revisión manual del código shell creado
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - el `sync-runtime` inicial genera manifiestos mínimos; la proyección completa llegará en la Fase 10

## 2026-03-13 12:23 Europe/Madrid | LOG-0015

- Tipo: `create`
- Área: `schemas`
- Resumen: creación de los JSON Schemas base para perfiles, pipelines, routing y handoffs
- Motivo: completar la Fase 9 y dejar una validación formal mínima sobre los artefactos canónicos
- Archivos afectados:
  - `.agents/schemas/profile.schema.json`
  - `.agents/schemas/pipeline.schema.json`
  - `.agents/schemas/routing.schema.json`
  - `.agents/schemas/handoff.schema.json`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se definieron esquemas base para perfiles, pipelines, routing y handoffs
  - se alinearon los campos obligatorios con los contratos definidos previamente
  - se actualizó el checklist para marcar completada la Fase 9 y el criterio de esquemas mínimos
- Impacto:
  - deja una base formal para validar consistencia y reducir deriva
- Validación:
  - revisión manual de consistencia entre esquemas y artefactos canónicos existentes
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - la validación automática real podrá reforzarse en iteraciones posteriores

## 2026-03-13 12:37 Europe/Madrid | LOG-0016

- Tipo: `update`
- Área: `tools`
- Resumen: corrección del script `sync-runtime` para que falle correctamente si no puede escribir output derivado
- Motivo: durante la validación en el sandbox el script informaba éxito aunque la escritura del manifiesto fallaba
- Archivos afectados:
  - `.agents/tools/sync-runtime/run.sh`
  - `docs/agents-change-record.md`
- Detalle:
  - se añadió control de estado por runtime
  - se añadió salida de error explícita cuando un manifiesto no puede escribirse
  - se añadió código de salida no cero si alguna generación falla
- Impacto:
  - evita falsos positivos en la sincronización de adaptadores runtime
- Validación:
  - revisión manual del script actualizado
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - en este entorno sandbox la escritura en `.agents/runtime/*/output` vía shell sigue bloqueada, por lo que la verificación completa queda pendiente fuera de esa limitación

## 2026-03-13 12:37 Europe/Madrid | LOG-0017

- Tipo: `update`
- Área: `tools`
- Resumen: endurecimiento adicional de `sync-runtime` mediante verificación explícita del manifiesto generado
- Motivo: la semántica de error del shell en el sandbox seguía permitiendo un mensaje final engañoso al fallar la redirección
- Archivos afectados:
  - `.agents/tools/sync-runtime/run.sh`
  - `docs/agents-change-record.md`
- Detalle:
  - se fuerza la eliminación previa del fichero destino
  - se verifica de forma explícita la existencia del manifiesto tras el intento de escritura
  - se mantiene el estado de error si falta cualquier output esperado
- Impacto:
  - reduce el riesgo de falsos positivos en la fase de sincronización de runtime
- Validación:
  - revisión manual del script actualizado
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - la limitación de escritura del sandbox sigue siendo externa al diseño del script

## 2026-03-13 12:37 Europe/Madrid | LOG-0018

- Tipo: `update`
- Área: `runtime`
- Resumen: refuerzo de validación cruzada y preparación de los runtime adapters v1 con mappings y templates
- Motivo: avanzar en Fases 9 y 10 dejando trazabilidad explícita y mejor integridad entre perfiles, skills, pipelines y routing
- Archivos afectados:
  - `.agents/tools/validate-config/run.sh`
  - `.agents/runtime/codex/mapping.yaml`
  - `.agents/runtime/codex/templates/system.md`
  - `.agents/runtime/claude/mapping.yaml`
  - `.agents/runtime/claude/templates/system.md`
  - `.agents/runtime/cursor/mapping.yaml`
  - `.agents/runtime/cursor/templates/system.md`
  - `.agents/runtime/chatgpt/mapping.yaml`
  - `.agents/runtime/chatgpt/templates/system.md`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se añadieron comprobaciones cruzadas de roles, pipelines y skills en `validate-config`
  - se crearon mappings y templates mínimos para los cuatro runtimes objetivo
  - se dejó explícita la trazabilidad entre fuente canónica, revisión y versión de spec
  - se actualizó el checklist para marcar avanzada parcialmente la Fase 10
- Impacto:
  - mejora la integridad del modelo canónico y deja listos los adaptadores para la futura generación de output
- Validación:
  - revisión manual de scripts y mappings
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - la generación automática de `output/` sigue pendiente por la limitación de escritura del sandbox en esas rutas

## 2026-03-13 12:37 Europe/Madrid | LOG-0019

- Tipo: `create`
- Área: `architecture`
- Resumen: documentación de gobernanza operativa para cambios, validación, sync y evolución de spec
- Motivo: completar la Fase 11 y dejar explícito cómo mantener la arquitectura sin deriva
- Archivos afectados:
  - `.agents/architecture/governance.md`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se documentó el flujo de cambios sobre `.agents/`
  - se documentó el flujo de validación y regeneración de adaptadores runtime
  - se documentó la convención de evolución de la spec y prevención de deriva
  - se actualizó el checklist para marcar completada la Fase 11 y el criterio de flujo claro
- Impacto:
  - deja una norma operativa explícita para evolucionar la capa canónica
- Validación:
  - revisión manual del documento creado
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - la generación efectiva de output runtime sigue pendiente de un entorno que permita escribir en esas rutas

## 2026-03-13 12:37 Europe/Madrid | LOG-0020

- Tipo: `update`
- Área: `tools`
- Resumen: corrección del parser de `validate-config` para limitar la lectura a los bloques YAML correctos
- Motivo: la validación cruzada estaba interpretando listas ajenas como si fueran `applicable_pipelines` o `recommended_skills`
- Archivos afectados:
  - `.agents/tools/validate-config/run.sh`
  - `docs/agents-change-record.md`
- Detalle:
  - se sustituyó el parseo amplio por bloques acotados mediante `awk`
  - se limitó la lectura a `applicable_pipelines` y `recommended_skills`
- Impacto:
  - reduce falsos positivos en la validación cruzada de perfiles
- Validación:
  - revisión manual del script actualizado
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `No`
- Observaciones:
  - después de este ajuste la validación debe reflejar errores reales del modelo y no ruido del parser

## 2026-03-13 12:47 Europe/Madrid | LOG-0021

- Tipo: `validation`
- Área: `runtime`
- Resumen: cierre de la validación end-to-end con outputs runtime generados y checklist completado
- Motivo: confirmar que la base `.agents/` ya es operativa y no solo documental
- Archivos afectados:
  - `.agents/runtime/chatgpt/output/manifest.txt`
  - `.agents/runtime/claude/output/manifest.txt`
  - `.agents/runtime/codex/output/manifest.txt`
  - `.agents/runtime/cursor/output/manifest.txt`
  - `docs/agents-implementation-checklist.md`
  - `docs/agents-change-record.md`
- Detalle:
  - se ejecutó `doctor` con resultado correcto
  - se ejecutó `validate-config` con resultado correcto
  - se validó la sintaxis JSON de los esquemas
  - se ejecutó `sync-runtime` y se generaron manifiestos por runtime
  - se comprobó que el perfil WordPress refleja el stack real del repositorio
  - se marcaron como completados el criterio de runtime derivado, la Fase 12 y el primer corte funcional
- Impacto:
  - deja cerrada la implantación base v1 de `.agents/`
- Validación:
  - `sh .agents/tools/doctor/run.sh`
  - `sh .agents/tools/validate-config/run.sh`
  - `for f in .agents/schemas/*.json; do python3 -m json.tool "$f" >/dev/null; done`
  - `sh .agents/tools/sync-runtime/run.sh`
  - `rg -n "^  (db|wordpress|caddy|wp-cli):" docker-compose.yml && test -d wordpress/wp-content`
- Fuente de verdad afectada:
  - `Sí`
- Artefactos derivados afectados:
  - `Sí`
- Observaciones:
  - el primer corte funcional queda cerrado con manifiestos derivados mínimos por runtime
