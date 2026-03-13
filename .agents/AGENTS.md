# Fuente de verdad de `.agents/`

## Propósito

Este directorio es la fuente de verdad canónica de la capa multiagente de este proyecto y de la plataforma reusable de WordPress que incorpora.

Define:

- arquitectura de plataforma
- roles de agente
- pipelines reutilizables
- perfiles reutilizables
- contexto del proyecto
- skills
- herramientas del agente
- adaptadores runtime
- esquemas de validación

## Reglas

- Todo lo que quede fuera de `.agents/` es derivado, contextual o específico de un runtime.
- Los outputs específicos de runtime no deben redefinir el comportamiento canónico.
- Los cambios en este directorio deben reflejarse en `docs/agents-change-record.md`.
- Los flujos de validación y sincronización deben tratar `.agents/` como origen upstream.
- El modelo canónico se organiza en `platform`, `profiles`, `project` y `runtime`.
- Las rutas, servicios y overrides específicos del repositorio pertenecen a `project/`, no a los perfiles reutilizables.

## Alcance inicial

Esta plataforma está orientada a trabajo reusable de WordPress + Docker entre proyectos y prepara proyecciones canónicas para:

- Codex
- Claude
- Cursor
- ChatGPT

## Mapa de directorios

- `architecture/`: principios y contratos canónicos
- `agents/`: definiciones de roles
- `pipelines/`: flujos de trabajo estándar
- `profiles/`: comportamiento reutilizable por tipo de proyecto e infraestructura
- `project/`: contexto específico del repositorio y perfiles activos
- `skills/`: capacidades reutilizables
- `tools/`: tooling determinista para la capa de agentes
- `runtime/`: definiciones de adaptadores runtime y outputs generados
- `schemas/`: reglas formales de validación
