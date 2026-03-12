---
name: vass-config
description: "Repositorio de estandares VASS para flujo de trabajo, calidad, WordPress, testing y cambios de configuracion Codex. Usar como capa transversal de gobierno tecnico."
compatibility: "Skill local basada en documentacion. Cargar en modo minimo por defecto y ampliar solo secciones necesarias."
---

# VASS Config

## When to use

Use this skill when the task is about:

- workflow and delivery standards
- testing and quality gates
- pull requests and git workflow
- Trello or Venus process rules
- GitLab CI conventions
- Codex/agent configuration changes
- WordPress coding/process standards as cross-cutting governance

## Inputs required

- task goal and scope
- affected files and domains (code, docs, ci, workflow, codex config)
- level of complexity (simple vs complex)

## Procedure

### 1) Start minimal

Load `README.min.md` first for low-complexity tasks.

Minimal baseline:

- `00-base-standards.md`
- `01-core-principles.md`
- `10-testing-standards.md`
- `19-wordpress-standards.md`
- `22-wordpress-blocks-standards.md` (only for block work)

### 2) Expand only when needed

Use `README.md` as index and open only the document required by the task.

Common mappings:

- Codex config changes -> `25-codex-configuration-change-standards.md`
- workflow planning/execution -> `03-agile-principles.md`, `04-babysteps-principle.md`, `05-pre-implementation-analysis.md`
- refactors -> `06-pattern-driven-refactoring.md`, `07-refactoring-verification-checklist.md`
- docs updates -> `14-documentation-standards.md`
- bug/feature/improvement specs -> `15`, `16`, `17`, `18`
- git/pr -> `12-git-workflow-standards.md`, `13-pull-requests-standards.md`
- Trello/Venus -> `20`, `21`, `23`
- GitLab CI -> `24-gitlab-ci-standards.md`

### 3) Compose with domain skills

This skill is governance-first and should be combined with domain skills when implementation is technical:

- WordPress blocks -> `wp-block-development`
- REST API -> `wp-rest-api`
- security -> `wordpress-security-validation`
- performance -> `wp-performance`
- accessibility -> `web-accessibility`
- E2E -> `e2e-testing-patterns`

### 4) Preserve source-of-truth boundaries

For Codex or agent-configuration changes:

- keep `.agents/**` as the canonical workflow source
- treat `./.agents/generated/skill-discovery-index.json` as a derived artifact only
- do not move routing, profiles, guardrails or quality-gate logic into `.codex/**`
- if Codex references the discovery index, it must do so only for discovery or shortlist support

### 5) Output expectations

When this skill is used, ensure outputs include:

- explicit standard(s) applied
- concrete verification evidence
- residual risks when any rule cannot be fully validated
