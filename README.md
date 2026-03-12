# WordPress AI Multiagent Base

Base reusable para crear proyectos WordPress nuevos con una configuracion de IA estructurada, multiagente y multi-runtime.

## Que tipo de configuracion de IA incluye

Esta plantilla no usa una IA improvisada ni un unico prompt gigante.
Usa una configuracion gobernada, con perfiles, guardrails, skills y validadores.

La idea es simple:
- la IA planifica antes de cambiar codigo
- implementa con alcance controlado
- revisa riesgos y regresiones
- valida quality gates antes de cerrar

## Arquitectura de la IA

### 1. Fuente de verdad comun: `.agents/`

`/.agents` define como trabaja la IA en el proyecto.

Incluye:
- `multiagent.yaml`: pipeline, routing, quality contract y skill resolution
- `profiles/`: perfiles reutilizables por tipo de proyecto WordPress
- `skills/`: skills locales de dominio y gobierno tecnico
- `prompts/`: prompts de `planner`, `builder`, `reviewer` y `qa`
- `GUARDRAILS.md`: reglas operativas y de calidad
- `RUNTIMES.md`: contrato comun para adaptadores de runtime
- `tools/agents-doctor.sh`: validador de consistencia de `.agents`

### 2. Runtime adapters

La misma base puede ser consumida por varios runtimes:
- `AGENTS.md`: contrato principal visible del repositorio
- `CLAUDE.md`: adaptador para Claude
- `.cursor/`: adaptador para Cursor
- `.azure/`: base reservada para Azure
- `.codex/`: adaptador y validadores especificos de Codex

Regla clave:
- `.agents/` es la unica fuente de verdad del workflow
- los adaptadores no deben redefinir perfiles, gates, checks o routing

### 3. Flujo multiagente

La configuracion separa el trabajo en 4 roles:
- `planner`: convierte la peticion en un plan ejecutable y selecciona perfil/skills/checks
- `builder`: implementa cambios y registra decisiones tecnicas
- `reviewer`: revisa riesgos, seguridad, regresiones y mantenibilidad
- `qa`: valida gates, consolida evidencia y decide cierre o retorno

Artefactos obligatorios:
- `plan`
- `patch_summary`
- `verification_report`

### 4. Perfiles WordPress

La base viene preparada para estos perfiles:
- `plugin-development`
- `theme-development`
- `block-theme-development`
- `full-site-wordpress`

Cada perfil define:
- skills primarias y secundarias
- `required_gates` y `optional_gates`
- `required_checks` y `optional_checks`
- reglas `expected_when` / `include_when`
- politica `not_applicable`

### 5. Skills locales

La plantilla usa skills locales bajo `./.agents/skills`.
No depende de instalar skills globales.

Ejemplos de skills incluidas:
- `wp-plugin-development`
- `wp-block-development`
- `wp-block-themes`
- `wp-rest-api`
- `wordpress-security-validation`
- `wp-performance`
- `wp-phpstan`
- `e2e-testing-patterns`
- `web-accessibility`
- `frontend-responsive-design-standards`
- `agents-config`
- `vass-config`

Compatibilidad de rutas:
- `skills -> .agents/skills` es un alias para skills importadas que todavia referencian `skills/...`
- la ruta canonica sigue siendo `.agents/skills`

## Como debe usarse la IA

### Para tareas normales

Describe la tarea en lenguaje natural y, si puedes, indica:
- objetivo
- target (`plugin`, `theme`, `block theme`, `repo wordpress`)
- checks deseados si importan

Ejemplos:
- `crea un plugin wordpress con settings api y endpoint rest`
- `corrige este block theme y su theme.json`
- `corrige esta incidencia en un bloque wordpress y no cierres sin verificar la regresion`

### Para cambios de configuracion

Si cambias:
- `.agents/**`
- `.codex/**`
- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/**`
- `.azure/**`

debes validar la configuracion con los doctors del repo.

### Para incidencias y regresiones

La plantilla ya deja politica para esto:
- si hay una incidencia reproducible con impacto visual o funcional, no basta con el patch
- hay que verificar el resultado y dejar evidencia de regresion
- si existe una base E2E reutilizable, debe usarse
- si deberia existir y no existe, la IA debe preguntar si debe montarla antes de cerrar

## Que incluye la plantilla

- `.agents/`
- `.codex/`
- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/`
- `.azure/`
- `docker-compose.yml`
- `Caddyfile`
- `scripts/bootstrap-wp.sh`
- `scripts/init-project.sh`
- `.env.example`
- `skills-lock.json`
- base Playwright reutilizable en `e2e/`
- `package.json` y `playwright.config.js`
- estructura WordPress inicial en `wordpress/wp-content/{plugins,themes,mu-plugins}`

## Que no incluye

- WordPress del proyecto origen
- plugins o themes de producto
- datos locales o base de datos
- artefactos build
- codigo especifico del proyecto origen

## Arranque de un proyecto nuevo paso a paso

### 1. Copiar o clonar la plantilla

Copia esta carpeta a la ubicacion donde quieras crear el proyecto nuevo.

### 2. Inicializar el proyecto

Desde la raiz del template:

```sh
./scripts/init-project.sh mi-proyecto mi-proyecto.local "Mi Proyecto WordPress"
```

Argumentos:
- `mi-proyecto`: nombre interno del proyecto y de Docker Compose
- `mi-proyecto.local`: dominio local para Caddy, WordPress y Playwright
- `Mi Proyecto WordPress`: titulo inicial del sitio
- argumento opcional 4: email del admin

Que hace este script:
- crea `.env` a partir de `.env.example`
- ajusta `COMPOSE_PROJECT_NAME`
- ajusta `WP_DOMAIN`
- ajusta `WP_SITE_URL`
- ajusta `WP_SITE_TITLE`
- ajusta `WP_ADMIN_EMAIL`
- ajusta `PLAYWRIGHT_BASE_URL`

### 3. Revisar y entender `.env`

El archivo `.env` controla el entorno local.

Variables principales:
- `COMPOSE_PROJECT_NAME`: nombre del proyecto Docker Compose
- `WP_DOMAIN`: dominio local del proyecto
- `WP_SITE_URL`: URL completa usada por WordPress
- `WP_SITE_TITLE`: titulo inicial del sitio
- `WP_ADMIN_USER`, `WP_ADMIN_PASSWORD`, `WP_ADMIN_EMAIL`: credenciales iniciales de admin
- `WP_DB_HOST`, `WP_DB_NAME`, `WP_DB_USER`, `WP_DB_PASSWORD`, `WP_DB_ROOT_PASSWORD`: conexion a MariaDB
- `WP_TABLE_PREFIX`: prefijo de tablas WordPress
- `PLAYWRIGHT_BASE_URL`: URL base para E2E con Playwright

Para que sirve `.env`:
- evita hardcodear dominios y credenciales
- permite reutilizar la plantilla en proyectos distintos
- hace que Docker, bootstrap WP y Playwright usen la misma configuracion

### 4. Anadir el dominio al hosts local

Ejemplo:

```sh
echo '127.0.0.1 mi-proyecto.local' | sudo tee -a /etc/hosts
```

Sin esto, el dominio local no resolvera en tu maquina.

### 5. Levantar el stack local

```sh
docker compose up -d
```

Servicios incluidos:
- `db`: MariaDB
- `wordpress`: Apache + PHP
- `caddy`: proxy HTTPS local
- `wp-cli`: bootstrap inicial de WordPress

### 6. Entender que hace `bootstrap-wp.sh`

`./scripts/bootstrap-wp.sh` hace el arranque inicial del sitio:
- espera a que existan archivos core de WordPress
- si no existen, descarga core con WP-CLI
- crea `wp-config.php` si falta
- espera a la base de datos
- instala WordPress si todavia no esta instalado
- ajusta `home` y `siteurl`

El objetivo es que el stack pueda arrancar desde cero sin pasos manuales de instalacion web.

### 7. Verificar que WordPress ha arrancado bien

```sh
docker compose ps
docker compose logs -f wp-cli
```

Cuando veas `Bootstrap finished.`, WordPress ya deberia estar operativo.

### 8. Abrir el sitio

- sitio: `https://<tu-dominio>`
- admin: `https://<tu-dominio>/wp-admin`

### 9. Instalar dependencias JS del root si vas a usar E2E

```sh
npm install
```

Esto instala Playwright para la base E2E del proyecto.

### 10. Ejecutar el smoke test E2E base

```sh
npm run test:e2e
```

La plantilla trae un smoke test minimo de login en `wp-admin`.
Sirve como base para que la politica E2E de `.agents` pueda activarse en cambios e incidencias futuras.

## Validacion de la configuracion

### Cambios en `.agents/**`

```sh
./.agents/tools/agents-doctor.sh
```

### Cambios en `.codex/**` o `AGENTS.md`

```sh
.codex/tools/update-codex-rules-index.sh
.codex/tools/validate-codex-rules.sh
.codex/tools/validate-codex-readme.sh
.codex/tools/validate-codex-skills.sh
.codex/skills/codex-doctor/scripts/run.sh
```

### Comprobacion de Docker

```sh
docker compose config
```

## Flujo recomendado de uso en proyectos nuevos

1. inicializa el proyecto con `init-project.sh`
2. levanta Docker
3. valida que WordPress arranca
4. instala dependencias JS si vas a usar E2E
5. empieza a trabajar sobre `wordpress/wp-content/`
6. usa la IA siguiendo `AGENTS.md`
7. valida `.agents` o `.codex` cuando cambies configuracion

## Comandos utiles

```sh
# Estado del stack
docker compose ps

# Logs del bootstrap
docker compose logs -f wp-cli

# Logs de Caddy
docker compose logs -f caddy

# Apagar contenedores
docker compose down

# Reset completo
docker compose down -v

# Validar .agents
./.agents/tools/agents-doctor.sh

# Validar Codex
.codex/skills/codex-doctor/scripts/run.sh

# Ejecutar E2E base
npm run test:e2e
```
