# Runtime Adapters

`.agents/` es la fuente de verdad comun para cualquier runtime.

## Source Of Truth

Los runtimes deben leer primero:

1. `AGENTS.md`
2. `.agents/README.md`
3. `.agents/GUARDRAILS.md`
4. `.agents/multiagent.yaml`
5. `.agents/profiles/*.yaml`
6. `.agents/skills/`

## Reglas comunes

- Para trabajo WordPress, el runtime debe ejecutar primero `wordpress-router`.
- El `planner` debe seleccionar un perfil antes de implementar.
- Solo se deben cargar las skills minimas necesarias.
- Los runtime adapters deben respetar `GUARDRAILS.md`.
- Toda tarea multi-agent debe producir:
  - `plan`
  - `patch_summary`
  - `verification_report`

## Adaptadores

- `AGENTS.md`: adaptador general y documentacion principal del repo.
- `.cursor/`: adaptador ligero para Cursor; no debe duplicar reglas de `.agents`.
- `CLAUDE.md`: adaptador ligero para Claude; no debe duplicar reglas de `.agents`.
- `.codex/`: adaptador y validadores especificos de Codex.
- `.azure/`: capa futura para Azure; debe consumir `.agents` como fuente comun.

## Politica anti-deriva

Los adaptadores de runtime no deben redefinir:

- perfiles
- tiers de skills
- quality gates
- artefactos obligatorios
- reglas de routing

Si necesitan comportamiento especifico del runtime, deben:

1. referenciar `.agents`
2. documentar solo la diferencia concreta del runtime
