# Gobernanza

## Flujo de cambio

1. Modificar los artefactos canónicos en `.agents/`.
2. Registrar el cambio en `docs/agents-change-record.md`.
3. Ejecutar validación estructural y de configuración.
4. Regenerar el output derivado de runtime cuando el entorno lo permita.
5. Revisar los diffs entre los cambios canónicos y el output derivado.

Para migraciones de skills o estándares legados, usa primero la skill `agents-change-governance` para auditar, clasificar y reducir el material al cambio canónico reusable mínimo antes de editar.

Los cambios canónicos deben clasificarse antes de editar:

- `platform`: arquitectura reusable, agentes, pipelines, skills, tools, schemas y metadatos
- `profile`: perfiles reutilizables por tipo de proyecto o infraestructura
- `project-context`: contexto local del repositorio en `.agents/project/`
- `derived-runtime`: mappings, plantillas y outputs generados de adaptadores runtime

## Flujo de validación

- ejecutar `sh .agents/tools/doctor/run.sh`
- ejecutar `sh .agents/tools/validate-config/run.sh`
- ejecutar `sh .agents/tools/sync-runtime/run.sh`
- ejecutar tooling de validación de schemas cuando esté disponible

## Flujo de sincronización de runtime

- el output runtime debe tratarse como derivado
- el output runtime debe regenerarse desde `.agents/`
- el output runtime debe incluir trazabilidad de revisión y spec
- los mappings runtime deben declarar que `.agents/` es la fuente de verdad
- los manifests runtime generados deben regenerarse bajo demanda y no versionarse como artefactos fuente

## Evolución de la spec

- los cambios compatibles y aditivos se mantienen dentro de v1
- los cambios estructurales rompientes requieren una nueva major
- los adaptadores runtime deben declarar la versión de spec que consumen

## Prevención de drift

- no editar nunca el output runtime como si fuera canónico
- no almacenar decisiones canónicas solo en archivos específicos de runtime
- revisar el change log y los mappings runtime cuando cambie la arquitectura
