# Arquitectura del Template

Este template empaqueta la configuracion reusable del repo para crear proyectos WordPress nuevos.

## Capas

- `.agents/`: workflow, perfiles, skills, prompts y guardrails
- `.codex/`: configuracion y validadores especificos de Codex
- `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `.azure/`: adaptadores por runtime
- `docker-compose.yml`, `Caddyfile`, `scripts/bootstrap-wp.sh`: stack local
- `e2e/`, `package.json`, `playwright.config.js`: base reutilizable para Playwright

## Regla principal

`.agents/` sigue siendo la unica fuente de verdad del workflow.

## Contrato operativo

- `quality_contract` vive en `.agents/multiagent.yaml`
- `loaded_skills` se resuelve desde `planning_resolution`
- `required_gates` salen de `quality_contract.common_required_gates` + perfil
- `required_checks` salen del perfil, del tooling detectado y de la intencion real de la tarea
- `builder` ejecuta checks y `qa` decide sobre gates con esa evidencia
- `skill-discovery-index` vive en `./.agents/generated/skill-discovery-index.json` como artefacto derivado para discovery y shortlist
- `skill-discovery-index` no decide ejecucion, no selecciona perfil y no sustituye `multiagent.yaml`

## Compatibilidad de rutas

`skills` es solo un alias de compatibilidad hacia `.agents/skills`.
