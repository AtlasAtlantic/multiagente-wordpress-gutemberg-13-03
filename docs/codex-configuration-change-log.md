# Bitácora de Cambios de Configuración Codex

## Propósito

Este documento registra cronológicamente los cambios realizados en la configuración de Codex y en su gobernanza relacionada.

Reglas de uso:

- añadir nuevas entradas siempre al final
- mantener orden cronológico ascendente
- describir el cambio de forma breve y humana
- incluir validación ejecutada cuando aplique
- no borrar entradas anteriores

## Entradas

### 2026-03-12

#### 1. Alineación de gobernanza Codex con el Skill Discovery Index

- Se actualizó la gobernanza de configuración para reconocer `./.agents/generated/skill-discovery-index.json` como artefacto derivado.
- Se dejó explícito que el índice puede usarse para discovery, filtrado por tier y shortlist, pero no para sustituir `multiagent.yaml`.
- Se reflejó esta regla en:
  - `.codex/agents/planner.toml`
  - `.codex/rules/25-codex-configuration-change-standards.md`
  - `.agents/skills/vass-config/SKILL.md`
  - `.agents/skills/agents-config/SKILL.md`
- Validación ejecutada:
  - `./.agents/tools/agents-doctor.sh`
  - `./.codex/tools/update-codex-rules-index.sh`
  - `./.codex/tools/validate-codex-rules.sh`
  - `./.codex/tools/validate-codex-readme.sh`
  - `./.codex/tools/validate-codex-skills.sh`
  - `./.codex/skills/codex-doctor/scripts/run.sh`

#### 2. Guía humana del Skill Discovery Index

- Se añadió una guía explicativa para el equipo sobre qué mejora el `skill-discovery-index`, qué hacer al crear una skill nueva y qué partes del flujo siguen igual.
- Archivo añadido:
  - `docs/skill-discovery-index-human-guide.md`

#### 3. Bitácora automática de cambios de configuración Codex

- Se crea esta bitácora para registrar futuros cambios de configuración de Codex de forma cronológica.
- A partir de este punto, los cambios de configuración Codex deben añadir aquí una nueva entrada.
