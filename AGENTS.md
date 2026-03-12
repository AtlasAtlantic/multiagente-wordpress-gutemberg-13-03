# Repository Guidelines

## Project-Local Codex Skills
Use only repository-local skills under `./.agents/skills` (do not install globally).

Compatibility note: `./skills` is a symlink alias to `./.agents/skills` for imported skills that still reference `skills/...` paths. The source of truth remains `./.agents/skills`.

### Skill Tiers

- `tier_1_execution`: skills principales de implementacion.
- `tier_2_support`: skills de soporte, analisis, routing y verificacion.
- `tier_3_reference`: skills de referencia y buenas practicas.
- `governance_transversal`: skill transversal de gobierno tecnico.

- `wp-block-development` (`./.agents/skills/wp-block-development/SKILL.md`): Gutenberg block creation/refactors.
- `wp-block-themes` (`./.agents/skills/wp-block-themes/SKILL.md`): block theme and `theme.json` work.
- `wp-plugin-development` (`./.agents/skills/wp-plugin-development/SKILL.md`): plugin architecture, lifecycle hooks, settings, cron, migrations, and packaging.
- `wp-rest-api` (`./.agents/skills/wp-rest-api/SKILL.md`): custom endpoints/routes and REST debugging.
- `wp-phpstan` (`./.agents/skills/wp-phpstan/SKILL.md`): PHPStan setup, baselines, WordPress stubs, and static analysis fixes. Use when the repo already has Composer/PHPStan entrypoints or when the task explicitly allows adding dev dependencies.
- `wordpress-security-validation` (`./.agents/skills/wordpress-security-validation/SKILL.md`): sanitization, escaping, nonce/capability checks.
- `wp-performance` (`./.agents/skills/wp-performance/SKILL.md`): profiling and performance fixes.
- `wp-project-triage` (`./.agents/skills/wp-project-triage/SKILL.md`): internal helper for deterministic WordPress repo classification.
- `wordpress-router` (`./.agents/skills/wordpress-router/SKILL.md`): internal router to classify WordPress work and choose the right domain skill.
- `e2e-testing-patterns` (`./.agents/skills/e2e-testing-patterns/SKILL.md`): Playwright/Cypress E2E strategy, flaky test debugging, and test standards.
- `web-accessibility` (`./.agents/skills/web-accessibility/SKILL.md`): WCAG 2.1 accessibility implementation and auditing.
- `frontend-responsive-design-standards` (`./.agents/skills/frontend-responsive-design-standards/SKILL.md`): mobile-first responsive layout and breakpoint standards.
- `agents-config` (`./.agents/skills/agents-config/SKILL.md`): governance and evolution of `.agents`, routing, profiles, prompts, runtime adapters, and validators.
- `vass-config` (`./.agents/skills/vass-config/SKILL.md`): governance standards for workflow, testing, WordPress, CI, Trello/Venus, and Codex configuration changes.
- `php-best-practices`, `modern-javascript-patterns`, `scss-best-practices`: language-level quality and refactoring guidance.
Use the kebab-case folder name as canonical skill id in config files (example: `frontend-responsive-design-standards`).

Activation rule for agents: if the request clearly matches one of the topics above, load that `SKILL.md` from `.agents/skills` first and follow it. If multiple skills match, use the minimal set needed.
If the request is primarily about `.agents`, runtime adapters, routing, prompts, guardrails, or agent-architecture changes, load `agents-config` first.
If the request is primarily about process standards, workflow conventions, or Codex configuration changes, load `vass-config` first and combine with domain skills only when needed.
For WordPress tasks, run `wordpress-router` first as an internal routing helper, then load only the domain skill(s) required. `wp-project-triage` is a support skill and should not be used as a user-facing fallback.

## Reusable Profiles

Reusable WordPress profiles live in `./.agents/profiles/`:

- `plugin-development`
- `theme-development`
- `block-theme-development`
- `full-site-wordpress`

Each profile defines primary skills, support skills, explicit `required_gates` / `optional_gates`, and `required_checks` / `optional_checks`.
For WordPress work, `planner` must select one profile before implementation.

Profile contract:

- `primary_skills` and `secondary_skills`: minimum and support skills for the profile
- `required_gates` and `optional_gates`: quality criteria that QA must evaluate
- `required_checks` and `optional_checks`: executable verifications that `builder` should run when tooling and `expected_when` apply

Current profile defaults:

- `plugin-development`: required gates `architecture`, `security`; optional gates `packaging`, `migrations`; optional checks `build`, `lint`, `static_analysis`, `tests`, `e2e`
- `theme-development`: required gates `responsive`, `accessibility`; optional checks `build`, `lint`, `tests`, `e2e`
- `block-theme-development`: required gates `theme_json`, `editor_frontend_parity`, `accessibility`, `responsive`; optional checks `build`, `lint`, `tests`, `e2e`
- `full-site-wordpress`: required gate `scope_isolation`; optional gates `accessibility`, `responsive`; optional checks `build`, `lint`, `static_analysis`, `tests`, `e2e`
- E2E default policy:
  - if a plugin task creates or modifies a Gutenberg block and reusable E2E infrastructure exists, `e2e` should become a required check for that task
  - if a theme or block-theme task changes visible UI/theme behavior and reusable E2E infrastructure exists, `e2e` should become a required check for that task
  - if a plugin/theme/block-theme task fixes a reproducible visual or functional bug and reusable E2E infrastructure exists, `e2e` should become a required regression check for that task
  - if that type of change should carry E2E but no reusable E2E infrastructure exists, Codex should ask whether to mount that base before leaving `e2e` as `not_applicable`
  - only skip that question when the user explicitly excludes tests or the change does not justify E2E

## Guardrails

Common runtime guardrails live in `./.agents/GUARDRAILS.md`.

Key rules:

- do not edit WordPress core
- do not act outside the selected target/profile
- do not close tasks without required artifacts
- treat `.agents/` as the only source of truth for workflow
- allow `not_applicable` only with concrete evidence
- in reproducible bugs or incidents with visible/functional impact, do not stop at the patch; verify the result and leave regression evidence, using E2E when applicable

## Multi-Agent Orchestration (Codex)
This repository also supports a local multi-agent workflow for feature delivery.

- Config file: `./.agents/multiagent.yaml`
- Profiles: `./.agents/profiles/*.yaml`
- Agent prompts: `./.agents/prompts/*.md`
- Agents validator: `./.agents/tools/agents-doctor.sh`
- Architecture map: `./docs/architecture.md`
- Activation model: mixed (`manual trigger` + `automatic routing`)

### Codex Validators
For Codex configuration changes (`.codex/**`, `AGENTS.md`), run:

- `.codex/tools/update-codex-rules-index.sh`
- `.codex/tools/validate-codex-rules.sh`
- `.codex/tools/validate-codex-readme.sh`
- `.codex/tools/validate-codex-skills.sh`
- `.codex/skills/codex-doctor/scripts/run.sh`

Scope split:

- `.agents/**` governs feature delivery workflow and development standards.
- `.cursor/**` is a Cursor runtime adapter and must follow `.agents/**`.
- `.codex/**` is reserved for Codex configuration governance and validation.

### Agents Validator
For `.agents/**` changes, run:

- `.agents/tools/agents-doctor.sh`

For `.cursor/**` changes, also run:

- `.agents/tools/agents-doctor.sh`

### Manual Triggers
Use any of these in the user prompt to force orchestration:

- `multiagente`
- `iniciar multiagente`
- `pipeline feature`
- `forzar reviewer`
- `ejecutar qa`

### Automatic Routing
If the request clearly maps to WordPress domains, frontend responsive work, or workflow/standards domains, run the default pipeline:

- Gutenberg blocks -> `wp-block-development`
- WordPress plugins -> `wp-plugin-development`
- WordPress REST API -> `wp-rest-api`
- WordPress PHPStan/static analysis -> `wp-phpstan` (when Composer/PHPStan setup exists or the task explicitly allows adding it)
- WordPress security validation -> `wordpress-security-validation`
- WordPress performance -> `wp-performance`
- E2E strategy or flaky tests -> `e2e-testing-patterns`
- Web accessibility (a11y/WCAG) -> `web-accessibility`
- Responsive frontend layout/breakpoints -> `frontend-responsive-design-standards`
- Workflow/process/Codex config standards -> `vass-config`
- `.agents` / runtime adapters / agent architecture -> `agents-config`

Bug and incident prompts should also trigger the default pipeline when they clearly point to:

- plugin bugs or regressions
- block bugs or regressions
- theme or block-theme visual regressions
- REST bugs or permission/regression issues
- Gutenberg editor issues such as:
  - `editor de gutenberg`
  - `editor de gutemberg`
  - `editor de bloques`
  - `bug en el editor`
  - `incidencia en el editor`
  - `bug en el bloque`
  - `incidencia en el bloque`
  - `parte del editor de gutenberg`
  - `parte del editor de gutemberg`
  - `bloque en el editor`
  - `bloque en el editor de bloques`
  - `cambios no se reflejan`
  - `no se reflejan los cambios`
  - `no se reflejan bien los cambios`
  - `cuando vario la configuracion`
  - `al variar la configuracion`
  - `sigue viendose mal`

### Default Pipeline
Pipeline id: `wp-feature-v1`

Entry rule for WordPress work:
1. `planner` runs `wordpress-router`
2. `wordpress-router` selects the target profile
3. the selected profile determines minimum skills, required gates and applicable checks

1. `planner`: converts request into a decision-complete implementation plan.
2. `builder`: applies changes and records technical decisions.
3. `reviewer`: checks regressions, security, and maintainability.
4. `qa`: validates gates using evidence from executed checks, reports `status`, and sets the routing `decision`.

### Quality Contract

`./.agents/multiagent.yaml` defines `quality_contract`:

- `gates`: quality criteria such as `security`, `responsive`, `accessibility`, `scope_isolation`
- `checks`: executable verifications such as `build`, `lint`, `static_analysis`, `tests`, `e2e`

Planner derivation rules:

- `required_gates` = `quality_contract.common_required_gates` + `profile.required_gates` + any explicit domain gate that applies
  - `artifacts_present`
  - `profile_selected`
- `required_checks` = checks from the selected profile whose `expected_when` applies, whose tooling exists, and whose inclusion is justified by prompt intent or real change impact
- for blocks and visible UI/theme changes, reusable E2E infrastructure can promote `e2e` from optional to required for the concrete task
- the same applies to reproducible visual or functional bug fixes that should leave a regression test behind
- if those changes justify E2E but no reusable base exists yet, the planner should ask whether it should be created before continuing
- for reproducible Gutenberg block or block-editor bugs, `build` or manual verification alone are not enough to close the task: either E2E must run or Codex must explicitly ask to mount the reusable E2E base before closing

Execution rules:

- `builder` executes checks and reports them in `checks_run`
- `reviewer` evaluates risks and whether evidence is sufficient for the required gates
- `qa` decides pass/fail/not_applicable for gates, using `checks_run` as evidence where relevant
- `qa` must return the task to `builder` if a reproducible Gutenberg block/editor bug is being closed without E2E and without an explicit user-facing question about mounting the base when no reusable suite exists
- checks are not added just because tooling exists; the plan must justify each required check by request scope, explicit demand, or change impact

### How To Operate
Use natural language and describe:

Operational note for configuration changes:

- If you change `AGENTS.md`, `.agents/**`, or `.codex/**`, validate behavior in a fresh Codex session started from the repo root.
- Do not rely on `codex resume` over an older session to prove that new routing or prompt rules are active; resumed sessions can keep prior thread context and behave as if they were still on the earlier configuration snapshot.

- objective
- target (`plugin`, `theme`, `block theme`, `repo wordpress`, etc.) when known
- desired checks if they matter

Examples:

- Plugin development:
  - `crea un plugin wordpress con settings api y endpoint rest`
  - `anade un mu-plugin para registrar hooks de seguridad`
  - `corrige el uninstall de este plugin y revisa migraciones`
  - `anade una tarea wp-cron segura a este plugin`
  - `haz que este plugin wordpress pase composer phpstan y composer phpcs`
- Block development:
  - `crea un bloque gutenberg dinamico con render.php`
  - `corrige un bloque wordpress que no guarda bien sus atributos`
  - `actualiza block.json para usar apiVersion 3`
  - `anade viewScriptModule a este bloque y revisa compatibilidad`
  - `migra este bloque sin romper serializacion ni contenido existente`
- Theme development:
  - `crea un theme FSE responsive con theme.json, templates y patterns`
  - `corrige este block theme y su theme.json`
  - `mejora este theme para responsive y accesibilidad`
  - `anade patterns y templates a este block theme`
  - `revisa por que los cambios de theme.json no se reflejan en frontend`
  - `ajusta este theme clasico para movil, tablet y desktop`
- Security:
  - `revisa este formulario wordpress y corrige nonce, permisos y escaping`
  - `corrige seguridad en este admin-post wordpress`
  - `audita este plugin para xss, csrf y validacion de entrada`
  - `revisa este bloque dinamico y valida sanitizacion y salida segura`
  - `encuentra riesgos de permisos en esta pantalla de ajustes wordpress`
- REST API:
  - `crea un endpoint rest wordpress con validacion de schema y permisos`
  - `corrige este register_rest_route que devuelve 403`
  - `expone este custom post type en wp/v2`
  - `anade campos personalizados a la respuesta rest`
  - `revisa autenticacion y permission_callback de esta api rest`
- Performance:
  - `analiza rendimiento wordpress de este plugin`
  - `encuentra por que esta ruta rest wordpress es lenta`
  - `revisa autoloaded options y object cache en este proyecto`
  - `perfila este problema de wp-cron y su impacto en rendimiento`
  - `mide y corrige el cuello de botella backend de este sitio wordpress`
- QA / review:
  - `ejecuta qa para este cambio wordpress`
  - `revisa este cambio y devuelve findings por severidad`
  - `valida los quality gates de este plugin`
  - `quiero plan, patch_summary y verification_report para esta tarea`
  - `comprueba que este cambio cumple seguridad, rendimiento y mantenibilidad`
- E2E by default when applicable:
  - `crea un bloque gutenberg nuevo en este plugin y anade su test e2e asociado`
  - `modifica este bloque del plugin y actualiza su smoke test e2e`
  - `cambia theme.json de este block theme y valida con e2e reutilizable`
  - `corrige esta incidencia visual del plugin y deja test e2e de regresion`
  - `corrige este bug funcional del theme y cubre la regresion con e2e`
- Agents config:
  - `revisa la configuracion de .agents y reduce ruido en multiagent.yaml`
  - `alinea CLAUDE.md, .cursor y .azure con .agents`
  - `mejora guardrails, perfiles o prompts del sistema de agentes`
  - `endurece agents-doctor para detectar deriva de contrato`
  - `refactoriza la arquitectura de agentes sin duplicar la fuente de verdad`
- Full-site / repo routing:
  - `revisa este repo wordpress y trabaja solo sobre el target correcto`
  - `analiza este stack wordpress y dime si el cambio va en plugin, theme o block theme`

Expected profile mapping:

- plugin or mu-plugin tasks -> `plugin-development`
- classic theme tasks -> `theme-development`
- block theme / `theme.json` / templates / patterns -> `block-theme-development`
- full stack / embedded WordPress / ambiguous multi-target repo -> `full-site-wordpress`

Validation commands:

- `.agents/**` changes -> `.agents/tools/agents-doctor.sh`
- `.codex/**` or `AGENTS.md` changes ->
  - `.codex/tools/update-codex-rules-index.sh`
  - `.codex/tools/validate-codex-rules.sh`
  - `.codex/tools/validate-codex-readme.sh`
  - `.codex/tools/validate-codex-skills.sh`
  - `.codex/skills/codex-doctor/scripts/run.sh`

### Required Artifacts
Every multi-agent task must produce:

- `plan`
- `patch_summary`
- `verification_report`

Artifact relation:

- planner output contains the `plan` artifact
- builder output contains the `patch_summary` artifact
- qa output contains the `verification_report` artifact plus the final `status` and `decision`

### Definition Of Done
- Task status can be set to `done` only by `qa`.
- All required gates must be `passed` or `not_applicable` with reason.
- Checks provide evidence, but do not replace gate evaluation.
- QA separates result and transition:
  - `status`: `done|failed|blocked`
  - `decision`: `close|return_to_builder`
- Any failed gate returns the task to `builder` through `decision: return_to_builder` with actionable blockers.

### Skill Resolution

`loaded_skills` must follow `planning_resolution.loaded_skills` in `./.agents/multiagent.yaml`.

Resolution order:

1. `router.required_skill`
2. `profile.primary_skills`
3. `domain.required_skills_by_domain`
4. `profile.secondary_skills_if_justified`
5. `profile.reference_skills_only_if_needed`

Resolution rules:

- de-duplicate while preserving highest-priority order
- always include `wordpress-router` for WordPress tasks
- include domain skills only when the detected domain or request matches
- do not include reference skills by default
- if a plugin task is a reproducible Gutenberg block or block-editor bug, include `e2e-testing-patterns` as a secondary skill so the plan explicitly evaluates regression coverage and whether a reusable E2E base exists
- internal rule id: `if_plugin_task_is_a_reproducible_block_or_editor_bug_require_e2e_testing_patterns_as_secondary_skill`
- in `full-site-wordpress`, do not expand to cross-domain secondary skills before the target is isolated
- in `full-site-wordpress`, if the request already points to `plugin`, `theme`, `block theme`, or `REST`, isolate that target before expanding domain skills
- once a unique target is isolated, resolve `loaded_skills` from that target domain instead of staying ambiguous at repo level

## Project Structure & Module Organization
This template runs a local WordPress stack with Docker and Caddy.

- `docker-compose.yml`: service orchestration (`db`, `wordpress`, `caddy`, `wp-cli`).
- `Caddyfile`: HTTPS + reverse proxy config for the domain defined in `.env` (`WP_DOMAIN`).
- `scripts/bootstrap-wp.sh`: idempotent WP-CLI bootstrap on first run.
- `wordpress/`: bind-mounted WordPress files (`/var/www/html` in container).
- `.env` / `.env.example`: runtime configuration.
- `README.md`: operator workflow and local TLS setup.

Keep custom code in `wordpress/wp-content/` (themes, plugins, mu-plugins). Avoid editing WordPress core files under `wp-admin` and `wp-includes`.

## Build, Test, and Development Commands
- `docker compose up -d`: start the full local stack.
- `docker compose ps`: check service health/status.
- `docker compose logs -f caddy`: inspect HTTPS/proxy issues.
- `docker compose logs -f wp-cli`: review bootstrap/install output.
- `docker compose down`: stop services.
- `docker compose down -v`: full reset (removes DB volume).
- `curl -kI --resolve "$WP_DOMAIN":443:127.0.0.1 "https://$WP_DOMAIN"`: quick HTTPS smoke check.

## Coding Style & Naming Conventions
- YAML (`docker-compose.yml`, `Caddyfile`): 2-space indentation, no tabs.
- Shell scripts: POSIX `sh`, keep `set -eu`, prefer explicit env defaults.
- File names: lowercase with hyphens for scripts/docs (example: `bootstrap-wp.sh`).
- Env vars: uppercase snake case (`WP_SITE_URL`, `WP_DB_HOST`).
- Dynamic block styling: do not inject `<style>` tags inside block HTML output. Prefer shared stylesheet handles or one aggregated dynamic style output per page.

## Testing Guidelines
There is no formal unit test suite yet. Use reproducible integration checks:

1. `docker compose up -d`
2. `docker compose ps` (DB healthy, app/caddy up)
3. Verify redirect and TLS with `curl` commands above
4. Confirm WP is installed: `docker compose logs --tail=100 wp-cli`

When changing bootstrap or networking, include command output snippets in PR notes.

## Commit & Pull Request Guidelines
No Git history exists yet in this directory, so use this convention:

- Commit format: `type(scope): summary` (example: `fix(caddy): update local domain`).
- Keep commits focused and atomic.
- PRs should include:
  - What changed and why
  - Local verification steps run
  - Screenshots for UI/admin changes (`/wp-admin`) when relevant
  - Any `.env` or host/certificate prerequisites
