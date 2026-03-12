# CLAUDE.md

Adaptador de runtime para Claude Code.

## Fuente de verdad

Claude debe tratar estos archivos como contrato principal:

1. `AGENTS.md`
2. `.agents/README.md`
3. `.agents/RUNTIMES.md`
4. `.agents/GUARDRAILS.md`
5. `.agents/multiagent.yaml`
6. `.agents/profiles/`
7. `.agents/skills/`

`.agents` es la fuente comun. `CLAUDE.md` no redefine workflow ni quality gates.

## Reglas operativas para Claude

- En tareas WordPress, empezar por `wordpress-router`.
- Seleccionar un perfil antes de implementar:
  - `plugin-development`
  - `theme-development`
  - `block-theme-development`
  - `full-site-wordpress`
- Cargar solo las skills minimas necesarias.
- Respetar `./.agents/GUARDRAILS.md`.
- Respetar los artefactos obligatorios:
  - `plan`
  - `patch_summary`
  - `verification_report`
- Si cambias `.agents/**`, ejecutar:
  - `.agents/tools/agents-doctor.sh`
- Si cambias `.codex/**` o `AGENTS.md`, ejecutar:
  - `.codex/tools/update-codex-rules-index.sh`
  - `.codex/tools/validate-codex-rules.sh`
  - `.codex/tools/validate-codex-readme.sh`
  - `.codex/tools/validate-codex-skills.sh`
  - `.codex/skills/codex-doctor/scripts/run.sh`

## Contexto de proyecto

Para detalles del proyecto actual, usar:

- `README.md`
- documentacion del target afectado dentro del repo

No usar `CLAUDE.md` como segunda fuente de verdad para arquitectura del proyecto.
