---
name: agents-config
description: "Gobernanza y evolucion de la arquitectura local de agentes: .agents, perfiles, routing, prompts, guardrails, adaptadores runtime y validadores. Usar para mejorar o depurar la configuracion de agentes sin redefinir la fuente de verdad."
compatibility: "Skill local basada en documentacion y validadores del repo. Diseñada para cambios en .agents, AGENTS.md y adaptadores runtime."
---

# Agents Config

## When to use

Use this skill when the task is about:

- `.agents/**`
- `AGENTS.md`
- `CLAUDE.md`, `.cursor/**`, `.azure/**`
- `multiagent.yaml`, perfiles, prompts, tiers o guardrails
- artefactos derivados de `.agents` como `skill-discovery-index.json`
- `agents-doctor` y consistencia entre contrato, docs y adaptadores
- reduccion de ruido en routing, skills o contratos de handoff

Do not use this skill for normal product implementation in plugins/themes unless the task is specifically about agent configuration.

## Inputs required

- objective of the configuration change
- affected files or layers (`.agents`, runtime adapters, docs)
- whether `.codex/**` is also affected

## Procedure

### 1) Treat `.agents` as source of truth

Load the minimum contract before changing anything:

- `AGENTS.md`
- `.agents/README.md`
- `.agents/GUARDRAILS.md`
- `.agents/RUNTIMES.md`
- `.agents/multiagent.yaml`
- `.agents/skill-discovery-index-v1.md` cuando el cambio afecte discovery o metadata de skills

Open only the profile/prompt/runtime files needed for the task.

### 2) Keep scopes separated

- `.agents/**` defines workflow, routing, gates/checks, skills and prompts.
- `./.agents/generated/skill-discovery-index.json` is a derived discovery artifact; it may support shortlist or inspection, but must never replace `.agents` as source of truth.
- Runtime adapters (`CLAUDE.md`, `.cursor/**`, `.azure/**`) may reference `.agents`, but must not redefine it.
- `.codex/**` is Codex-specific governance and validation; touch it only if the task explicitly requires it.

### 3) Prefer simplification over new layers

When improving the system:

- remove duplication before adding structure
- tighten contracts before adding heuristics
- prefer one source of truth per concept
- avoid generic "AI improvement" abstractions without a bounded responsibility

### 4) Validation is mandatory

- If you change `.agents/**`, run:
  - `.agents/tools/agents-doctor.sh`
- If you change `.codex/**` or `AGENTS.md`, also run:
  - `.codex/tools/update-codex-rules-index.sh`
  - `.codex/tools/validate-codex-rules.sh`
  - `.codex/tools/validate-codex-readme.sh`
  - `.codex/tools/validate-codex-skills.sh`
  - `.codex/skills/codex-doctor/scripts/run.sh`

## Output expectations

When this skill is used, ensure the result includes:

- what contract or layer changed
- why the change reduces ambiguity, drift, or noise
- exact validation evidence
- update to `docs/codex-configuration-change-log.md` when the task also changes Codex configuration or Codex governance
