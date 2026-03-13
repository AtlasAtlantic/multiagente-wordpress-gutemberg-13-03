# Visión general

## Propósito

Esta arquitectura define una plataforma multiagente reusable para proyectos WordPress, con Docker como contexto operativo de primera clase.

## Modelo canónico

El modelo canónico se compone de cuatro capas explícitas:

- `platform`: arquitectura, roles, pipelines, skills, tools, schemas y metadatos de plataforma
- `profiles`: variantes reutilizables de WordPress e infraestructura
- `project`: contexto específico del repositorio que activa perfiles y overrides locales
- `runtime`: adaptadores derivados que consumen inputs canónicos

Los artefactos canónicos almacenados en esas capas incluyen:

- roles de agente
- pipelines
- perfiles
- contexto de proyecto
- skills
- tools
- adaptadores runtime
- esquemas de validación

## Flujo base

El flujo por defecto es:

`planner -> builder -> reviewer -> fixer -> qa`

Esta secuencia es el valor por defecto para trabajo de feature y el patrón de referencia para el resto del sistema.

## Separación de responsabilidades

- `architecture/` define las reglas
- `agents/` define los roles
- `pipelines/` define el flujo de ejecución
- `profiles/` define la adaptación reusable por proyecto
- `project/` define el contexto local del repositorio
- `skills/` define capacidades reutilizables
- `tools/` define la ejecución determinista
- `runtime/` define la proyección derivada del adaptador
- `schemas/` define la validación formal
