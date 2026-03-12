# Agents Configuration

`.agents/` es la capa reusable de workflow y estandares de desarrollo.

La ruta canonica de las skills es `.agents/skills`. El alias `skills/` existe solo por compatibilidad con skills importadas que todavia referencian `skills/...`.

## Capas

- `multiagent.yaml`: pipeline comun, routing, perfiles, `quality_contract` y `planning_resolution`.
- `GUARDRAILS.md`: guardrails comunes para cualquier runtime.
- `profiles/`: perfiles reutilizables por tipo de proyecto WordPress.
- `skills/`: skills locales del repositorio.
- `prompts/`: prompts de agentes del pipeline.
- `tools/`: validadores de consistencia de `.agents`.
- `RUNTIMES.md`: contrato comun para adaptadores de runtime.
- `skills/agents-config/`: skill especializada para evolucion de `.agents` y adaptadores runtime.

## Comandos

- Validacion integral de `.agents`:
  - `.agents/tools/agents-doctor.sh`

## Arquitectura

- Mapa del sistema: `docs/architecture.md`

## Regla base

Para tareas WordPress:

1. `planner` ejecuta `wordpress-router`
2. `wordpress-router` selecciona perfil
3. el perfil define skills minimas, `required_gates` y `required_checks`

## Operacion

Pide la tarea en lenguaje natural.

Formato recomendado:

- objetivo
- target si lo conoces (`plugin`, `theme`, `block theme`, `repo wordpress`)
- checks deseados si importan

Ejemplos:

- Plugin development:
  - `crea un plugin wordpress con ajustes y endpoint rest`
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
- QA / routing:
  - `ejecuta qa para este cambio wordpress`
  - `revisa este repo wordpress y trabaja solo sobre el target correcto`
  - `revisa este cambio y devuelve findings por severidad`
  - `valida los quality gates de este plugin`
  - `quiero plan, patch_summary y verification_report para esta tarea`
- Agents config:
  - `revisa la configuracion de .agents y reduce ruido en multiagent.yaml`
  - `alinea CLAUDE.md, .cursor y .azure con .agents`
  - `mejora guardrails, perfiles o prompts del sistema de agentes`
  - `endurece agents-doctor para detectar deriva de contrato`
  - `refactoriza la arquitectura de agentes sin duplicar la fuente de verdad`

## Perfiles esperados

- `plugin-development`: plugins, mu-plugins, hooks, Settings API, uninstall, cron, migraciones
- `theme-development`: themes clasicos, frontend, responsive, accesibilidad
- `block-theme-development`: `theme.json`, templates, parts, patterns, Site Editor
- `full-site-wordpress`: stack completo, WordPress en subdirectorio, varios targets posibles

## Contrato de calidad

- `gates`: criterios de calidad que QA evalua
- `checks`: verificaciones ejecutables que `builder` corre como evidencia
- `required_checks` no se anaden solo porque exista tooling; cada check debe quedar justificado por alcance, peticion explicita o impacto real del cambio
- en `full-site-wordpress`, primero se aisla el target y solo despues se expanden skills de dominio o checks del target elegido

## Validacion

- Si cambias `.agents/**`:
  - `.agents/tools/agents-doctor.sh`
- Si cambias `.codex/**` o `AGENTS.md`:
  - `.codex/tools/update-codex-rules-index.sh`
  - `.codex/tools/validate-codex-rules.sh`
  - `.codex/tools/validate-codex-readme.sh`
  - `.codex/tools/validate-codex-skills.sh`
  - `.codex/skills/codex-doctor/scripts/run.sh`
