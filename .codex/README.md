# Codex Configuration

Este directorio centraliza reglas y validadores de configuracion Codex para este repositorio.
No es el repositorio de estandares de desarrollo del proyecto.

## Multi-Agent Nativo

- `.codex/config.toml` define solo la capa nativa del runtime Codex:
  - `features.multi_agent`
  - limites de agentes
  - `agents.<name>.config_file`
- `/.codex/agents/*.toml` define configuracion de subagentes nativos de Codex.
- Los perfiles funcionales del proyecto viven en `.agents/profiles/*.yaml` y no deben duplicarse en `.codex/config.toml`.

## Estructura

- `.codex/rules/`: reglas exclusivas de configuracion Codex.
- `.codex/tools/`: validadores y utilidades de mantenimiento.
- `.codex/skills/`: skills locales de soporte para validacion.

## Alcance

- Estandares de desarrollo (WordPress, testing, workflow de feature): `./.agents/skills/vass-config/`
- Reglas de configuracion Codex: `./.codex/rules/`

## Comandos

- Actualizar indice de reglas:
  - `.codex/tools/update-codex-rules-index.sh`
- Validar reglas:
  - `.codex/tools/validate-codex-rules.sh`
- Validar este README:
  - `.codex/tools/validate-codex-readme.sh`
- Validar skills de Codex:
  - `.codex/tools/validate-codex-skills.sh`
- Validacion integral:
  - `.codex/skills/codex-doctor/scripts/run.sh`
