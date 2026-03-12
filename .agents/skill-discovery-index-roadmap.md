# Skill Discovery Index Roadmap

## Objetivo

Definir, validar, generar e integrar un `Skill Discovery Index` derivado para `.agents` sin crear una nueva fuente de verdad ni duplicar la lógica resolutiva de `multiagent.yaml`.

## Estado global

- Fase 1. Contrato: completada
- Fase 2. Validación: completada
- Fase 3. Generador: completada
- Fase 4. Integración: completada

## Fase 1. Contrato

Estado: completada

Objetivo:

- definir el contrato v1 del índice
- fijar qué campos son obligatorios y cuáles opcionales
- documentar fuentes canónicas por campo
- dejar claro que el índice es derivado y no resuelve routing

Entregables completados:

- [skill-discovery-index-v1.md](./skill-discovery-index-v1.md)

Resultado:

- existe una especificación v1 estable para `./.agents/generated/skill-discovery-index.json`

## Fase 2. Validación

Estado: completada

Objetivo:

- endurecer `agents-doctor` para validar el contrato v1
- distinguir errores duros de warnings
- permitir que el índice aún no exista sin bloquear el flujo

Entregables completados:

- [agents-doctor.sh](./tools/agents-doctor.sh)

Resultado:

- `agents-doctor` valida el contrato del índice si el archivo existe
- si el índice aún no existe, emite un warning explícito y no falla

## Fase 3. Generador

Estado: completada

Objetivo:

- crear el script que genere `./.agents/generated/skill-discovery-index.json`
- hacerlo de forma determinista y conservadora
- derivar `tier` exclusivamente desde `skills-tier.yaml`
- poblar solo metadata opcional cuya extracción sea fiable

Entregables completados:

- [generate-skill-discovery-index.sh](./tools/generate-skill-discovery-index.sh)
- carpeta `./.agents/generated/`
- [skill-discovery-index.json](./generated/skill-discovery-index.json)

Resultado:

- el índice se genera sin edición manual
- el archivo cumple el contrato v1
- `agents-doctor` valida el índice correctamente

## Fase 4. Integración

Estado: completada

Objetivo:

- permitir que planner o tooling consulten el índice solo para discovery y shortlist
- impedir que el índice sustituya la decisión final de `multiagent.yaml`
- consolidar su uso como artefacto auxiliar e inspeccionable

Entregables completados:

- reglas mínimas de consumo del índice en [multiagent.yaml](./multiagent.yaml)
- integración de uso acotado en [planner.md](./prompts/planner.md)
- documentación arquitectónica en [architecture.md](../docs/architecture.md)

Resultado:

- el índice se usa solo como apoyo a discovery y shortlist
- la decisión final sigue dependiendo de `multiagent.yaml`
- no se duplica lógica de routing, guardrails ni policy

## Reglas de gobierno

- la fuente de verdad sigue siendo `.agents/`
- el índice no se edita manualmente
- cualquier cambio en contrato, generador o integración debe pasar por `agents-doctor`
- si el alcance crece, se debe versionar el contrato antes de ampliar el índice
