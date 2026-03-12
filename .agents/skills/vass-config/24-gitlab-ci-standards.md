---
title: Estándares de GitLab CI/CD
alwaysApply: false
category: ci-cd
globs:
  - ".gitlab-ci.yml"
---
# Estándares de GitLab CI/CD

## TL;DR

- **Toda la configuración CI/CD debe estar en `.gitlab-ci.yml`**: No configurar manualmente en la UI
- **Control de versiones**: Todo cambio de pipeline debe commitearse y revisarse
- **Documentación**: Pipelines complejos deben documentarse en la documentación de feature
- **Nunca commitear secretos**: Usar variables CI/CD protegidas/enmascaradas
- **Validar variables de entorno**: Validar variables requeridas antes de desplegar



## Propósito

Este documento define estándares, buenas prácticas, guías de seguridad y patrones de configuración para pipelines de GitLab CI/CD en este proyecto. Estas reglas aplican específicamente al trabajar con `.gitlab-ci.yml`.

## Cuando aplica

- alwaysApply: false
- category: ci-cd
- globs: ".gitlab-ci.yml"

## Reglas

**Referencia**: [GitLab CI/CD YAML Syntax Reference](https://docs.gitlab.com/ci/yaml/)

---

## Principios básicos

### 1. Pipeline como código

- **Toda la configuración CI/CD debe estar en `.gitlab-ci.yml`**: No configurar manualmente en la UI
- **Control de versiones**: Todo cambio de pipeline debe commitearse y revisarse
- **Documentación**: Pipelines complejos deben documentarse en la documentación de feature

### 2. Seguridad primero

- **Nunca commitear secretos**: Usar variables CI/CD protegidas/enmascaradas
- **Validar variables de entorno**: Validar variables requeridas antes de desplegar
- **Principio de mínimo privilegio**: Jobs con acceso mínimo necesario
- **Conexiones seguras**: Usar SSH keys y protocolos seguros

### 3. Eficiencia y rendimiento

- **Usar caché**: Cachear dependencias (Composer, NPM)
- **Ejecución paralela**: Ejecutar jobs independientes en paralelo con `needs` y `parallel`
- **Optimizar stages**: Minimizar stages y dependencias
- **Gestión de artifacts**: Caducidades apropiadas

### 4. Fiabilidad y mantenibilidad

- **Operaciones idempotentes**: Jobs repetibles y consistentes
- **Gestión de errores**: Validar inputs, comprobar prerequisitos, manejar fallos
- **Nombres claros**: Nombres descriptivos de jobs
- **Configuración reutilizable**: Usar anchors (`&`) y aliases (`*`)

---

## Estructura y organización de archivo

### Estructura estándar de pipeline

```yaml
# 1. Configuración global
variables:
  GIT_DEPTH: 1

# 2. Reglas de workflow
workflow:
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: never
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    - when: never

# 3. Anchors YAML
.default_rules: &default_rules
  - if: '$CI_COMMIT_BRANCH == "stable" && $CI_PIPELINE_SOURCE == "push"'
    when: always
  - when: never

.default_tags: &default_tags
  - VASSVM-10176-PHP83-PRISAMEDIA

# 4. Stages
stages:
  - validate
  - install
  - security
  - check
  - deploy
  - cleanup

# 5. before_script global (opcional)
before_script:
  - echo "Runner directory $CI_PROJECT_DIR"

# 6. Jobs (organizados por stage)
Job Name:
  stage: validate
  script:
    - echo "Job execution"
  rules: *default_rules
  tags: *default_tags
```

### Orden de secciones

1. **Keywords globales**: `variables`, `workflow`, `default`, `include`
2. **Anchors YAML**: Bloques reutilizables (`.default_rules`, `.default_tags`, etc.)
3. **Stages**
4. **Scripts globales**: `before_script` (si aplica)
5. **Jobs**: Organizados por stage

---

## Configuración de workflow

### Workflow rules

**OBLIGATORIO**: Definir `workflow:rules` para controlar cuándo se ejecutan pipelines.

**Patrones comunes**:

```yaml
workflow:
  rules:
    # Nunca ejecutar en eventos de MR
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: never
    # Nunca ejecutar en commits iniciales
    - if: '$CI_COMMIT_BEFORE_SHA == "0000000000000000000000000000000000000000"'
      when: never
    # Nunca ejecutar en pushes a main (si main está protegido)
    - if: '$CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"'
      when: never
    # Ejecutar en push
    - if: '$CI_PIPELINE_SOURCE == "push"'
      when: always
    # Por defecto: no ejecutar
    - when: never
```

**Reglas**:
- Terminar siempre con `when: never` por defecto
- Usar condiciones específicas primero
- Documentar por qué se excluyen ramas/eventos

---

## Stages y jobs

### Organización de stages

**Stages recomendados** (en orden):

1. **validate**: Validación de entorno, herramientas
2. **install**: Instalación de dependencias (Composer, NPM)
3. **security**: Auditorías de seguridad (composer audit, npm audit)
4. **check**: Calidad de código (linting, análisis, tests)
5. **deploy**: Despliegue
6. **cleanup**: Limpieza

**Reglas**:
- Stages enfocados en un propósito
- Minimizar número de stages (4-6)
- Nombres descriptivos

### Convención de nombres de jobs

**Formato**: `[Acción] [Componente] [Entorno]`

**Ejemplos**:
- `Environment Validation`
- `Install PHP DEV`
- `Install PHP PRO`
- `Install NPM`
- `Security Audit`
- `PHP Rector`
- `PHP CS Fixer`
- `PHP Stan`
- `PHP Code Sniffer`
- `PHP Unit`
- `NPM ESLint`
- `NPM Stylelint`
- `Application Deployment`
- `Application Deployment PRE`
- `Application Deployment PRO`
- `cleanup_workspace`

**Reglas**:
- Usar PascalCase (convención GitLab)
- Ser descriptivo y específico
- Incluir entorno en jobs de despliegue

---

## Anchors y aliases YAML

### Propósito

Usar anchors (`&`) y aliases (`*`) para:
- **Reducir duplicación**
- **Mantener consistencia**
- **Simplificar mantenimiento**

### Anchors comunes

#### Anchors de rules

```yaml
.default_rules: &default_rules
  - if: '$CI_COMMIT_TAG'
    when: never
  - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    when: never
  - if: '$CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"'
    when: never
  - if: '$CI_PIPELINE_SOURCE == "push"'
    when: always
  - when: never

.deploy_rules: &deploy_rules
  - if: '$CI_COMMIT_BRANCH == "stable" && $CI_PIPELINE_SOURCE == "push"'
    when: always
  - when: manual

.predeploy_rules: &predeploy_rules
  - if: '$CI_COMMIT_BRANCH == "preproduction" && $CI_PIPELINE_SOURCE == "push"'
    when: always
  - when: never

.prodeploy_rules: &prodeploy_rules
  - if: '$CI_COMMIT_BRANCH == "production" && $CI_PIPELINE_SOURCE == "push"'
    when: always
  - when: never
```

#### Anchors de tags

```yaml
.default_tags: &default_tags
  - VASSVM-10176-PHP83-PRISAMEDIA
```

#### Anchors de paths

```yaml
.default_php_paths: &default_php_paths
  - wp-content/themes/prisa-media/vendor/
  - wp-content/plugins/prisa-blocks/vendor/

.default_npm_paths: &default_npm_paths
  - wp-content/themes/prisa-media/node_modules/
  - wp-content/plugins/prisa-blocks/node_modules/
```

#### Anchors de scripts

```yaml
.validate_environment: &validate_environment
  - |
    if [ -z "$DOC_ROOT_DEVEL" ] && [ -n "$CI_ENVIRONMENT_NAME" ] && [ "$CI_ENVIRONMENT_NAME" = "devel" ]; then
      echo "Error: DOC_ROOT_DEVEL environment variable not set for devel deployment"
      exit 1
    fi
```

**Uso**:

```yaml
Job Name:
  before_script:
    - *validate_environment
  rules: *default_rules
  tags: *default_tags
  cache:
    paths: *default_php_paths
```

---

## Variables

### Variables globales

**OBLIGATORIO**: Definir variables globales al inicio del archivo.

**Variables comunes**:

```yaml
variables:
  GIT_DEPTH: 1  # Clonado shallow para pipeline más rápido
```

**Reglas**:
- Usar `GIT_DEPTH: 1` para clones rápidos (salvo si se necesita historial completo)
- Documentar por qué se necesita cada variable
- Usar variables CI/CD para datos sensibles (no en YAML)

### Variables por job

**Usar variables por job para**:
- Sobrescribir variables globales
- Configuración específica del job

**Ejemplo**:

```yaml
Install NPM:
  variables:
    GIT_SUBMODULE_STRATEGY: none
  script:
    - make install-npm
```

**Reglas**:
- Sobrescribir solo cuando sea necesario
- Documentar por qué se sobreescriben
- Usar nombres descriptivos

### Variables de entorno

**OBLIGATORIO**: Validar variables requeridas antes del despliegue.

**Patrón**:

```yaml
.validate_environment: &validate_environment
  - |
    if [ -z "$DOC_ROOT_DEVEL" ] && [ -n "$CI_ENVIRONMENT_NAME" ] && [ "$CI_ENVIRONMENT_NAME" = "devel" ]; then
      echo "Error: DOC_ROOT_DEVEL environment variable not set for devel deployment"
      exit 1
    fi
  - |
    if [ "$CI_ENVIRONMENT_NAME" = "preproduction" ]; then
      missing_vars=""
      [ -z "$DOC_ROOT_PRE" ] && missing_vars="$missing_vars DOC_ROOT_PRE"
      [ -z "$SSH_USER_PRE" ] && missing_vars="$missing_vars SSH_USER_PRE"
      [ -z "$SSH_HOST_PRE" ] && missing_vars="$missing_vars SSH_HOST_PRE"
      [ -z "$SSH_PORT_PRE" ] && missing_vars="$missing_vars SSH_PORT_PRE"
      [ -z "$DOMAIN_PRE" ] && missing_vars="$missing_vars DOMAIN_PRE"
      if [ -n "$missing_vars" ]; then
        echo "Error: Missing preproduction environment variables:$missing_vars"
        exit 1
      fi
    fi
```

**Reglas**:
- Validar todas las variables antes de desplegar
- Mensajes claros con nombres faltantes
- Salir con error si falta algo

---

## Caché

### Estrategia de caché

**Propósito**: Acelerar pipelines cacheando dependencias.

**Claves de caché**: Usar claves basadas en hash de lockfiles.

**Patrón**:

```yaml
before_script:
  - export PHP_COMBINED_HASH=$(sha256sum composer.lock | awk '{print $1}')
  - export NPM_HASH=$(sha256sum package-lock.json | awk '{print $1}')

Install PHP DEV:
  cache:
    key: "php-dev--$PHP_COMBINED_HASH"
    paths:
      - wp-content/themes/prisa-media/vendor/
      - wp-content/plugins/prisa-blocks/vendor/
    policy: pull-push

Install PHP PRO:
  cache:
    key: "php-pro--$PHP_COMBINED_HASH"
    paths:
      - wp-content/themes/prisa-media/vendor/
      - wp-content/plugins/prisa-blocks/vendor/
    policy: pull-push

Install NPM:
  cache:
    key: "npm--$NPM_HASH"
    paths:
      - wp-content/themes/prisa-media/node_modules/
      - wp-content/plugins/prisa-blocks/node_modules/
    policy: pull-push
```

**Políticas de caché**:
- `pull-push`: Pull antes, push después (instalación)
- `pull`: Solo pull (jobs que usan deps)

**Reglas**:
- Claves basadas en lockfiles
- Cachear solo dependencias (vendor/, node_modules/)
- `pull-push` en install, `pull` en jobs de uso
- Documentar claves y paths

---

## Artifacts

### Configuración de artifacts

**Propósito**: Pasar archivos entre jobs y guardar outputs.

**Patrón**:

```yaml
PHP Stan:
  artifacts:
    when: always  # Mantener artifacts aunque falle
    paths:
      - wp-content/themes/prisa-media/results-phpstan.xml
      - wp-content/plugins/prisa-blocks/results-phpstan.xml
    expire_in: 2 days
    reports:
      junit:
        - wp-content/themes/prisa-media/results-phpstan.xml
        - wp-content/plugins/prisa-blocks/results-phpstan.xml

Install PHP DEV:
  artifacts:
    paths:
      - wp-content/themes/prisa-media/vendor/
      - wp-content/plugins/prisa-blocks/vendor/
    expire_in: 2 days
```

**Reglas**:
- `expire_in` razonable (1-7 días)
- `when: always` para reportes de tests
- Usar `reports:junit` para integración GitLab
- Solo artifact lo necesario

---

## Dependencias entre jobs

### Uso de `needs`

**Propósito**: Ejecutar en paralelo y definir dependencias.

**Patrón**:

```yaml
PHP Rector:
  needs:
    - Install PHP DEV
  cache:
    key: "php-dev--$PHP_COMBINED_HASH"
    paths: *default_php_paths
    policy: pull

Application Deployment:
  needs:
    - Install NPM
    - Install PHP PRO
    - PHP Rector
    - PHP CS Fixer
    - PHP Stan
    - PHP Code Sniffer
    - NPM ESLint
    - NPM Stylelint
```

**Reglas**:
- Usar `needs` para paralelizar
- Listar dependencias explícitas
- Usar `dependencies` para controlar artifacts

### Uso de `dependencies`

**Propósito**: Controlar qué artifacts se descargan.

**Patrón**:

```yaml
PHP Rector:
  dependencies:
    - Install PHP DEV
  needs:
    - Install PHP DEV
```

**Reglas**:
- Usar `dependencies` para limitar artifacts (jobs más rápidos)
- Por defecto descarga artifacts de stages previos
- Usar `dependencies: []` para no descargar nada

---

## Buenas prácticas de seguridad

### 1. Gestión de secretos

**OBLIGATORIO**: Nunca commitear secretos en `.gitlab-ci.yml`.

**Usar variables CI/CD**:
- Variables protegidas para datos sensibles
- Variables enmascaradas para ocultar valores en logs
- Variables por entorno

**Ejemplo**:

```yaml
# ❌ MAL - nunca hacer esto
script:
  - ssh user@host -p 12345

# ✅ BIEN - usar variables
script:
  - ssh $SSH_USER@$SSH_HOST -p $SSH_PORT
```

**Reglas**:
- Todos los secretos en variables CI/CD (protegidas/enmascaradas)
- Nunca hardcodear passwords, tokens o keys
- Variables distintas por entorno

### 2. Validación de variables de entorno

**OBLIGATORIO**: Validar variables requeridas antes de despliegue.

**Patrón**: Usar anchor YAML de validación (ver sección Variables).

**Reglas**:
- Validar todas las variables en `before_script`
- Salir con error si faltan
- Mensajes claros

### 3. Conexiones seguras

**Para despliegues SSH**:

```yaml
Application Deployment PRE:
  script:
    - rsync -e "ssh -p $SSH_PORT_PRE" -az --force --delete --progress --exclude-from='.htexclude' ./ $SSH_USER_PRE@$SSH_HOST_PRE:$DOC_ROOT_PRE
```

**Reglas**:
- Usar SSH keys (no passwords)
- Guardar claves en variables CI/CD o runner
- Usar usuarios/puertos específicos (no root)
- Validar conexión antes de desplegar

### 4. Control de acceso

**Reglas**:
- Usar `rules` para controlar ejecución
- No desplegar desde ramas no confiables
- `when: manual` para producción
- Proteger ramas sensibles (main, production, preproduction)

---

## Patrones de despliegue

### Configuración de entornos

**Patrón**:

```yaml
Application Deployment:
  stage: deploy
  environment:
    name: devel
    url: $URL_DEVEL
  before_script:
    - *validate_environment
  script:
    - echo "Deploying code to $DOC_ROOT_DEVEL - $URL_DEVEL"
    - nvm use 16
    - make build
    - rsync -az --force --delete --progress --exclude-from=.htexclude public/ $DOC_ROOT_DEVEL
    - wp compi migration --quiet --path=$DOC_ROOT_DEVEL
    - echo "[OK] Build CSS/JS"
  rules: *deploy_rules
  tags: *default_tags
```

**Reglas**:
- Definir `environment:name` y `environment:url`
- Validar variables antes de desplegar
- Usar `rsync` con `--exclude-from=.htexclude`
- Ejecutar migraciones si aplica
- Limpiar workspace en `after_script`

### Reglas de despliegue

**Patrón**:

```yaml
.deploy_rules: &deploy_rules
  - if: '$CI_COMMIT_TAG'
    when: never
  - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    when: never
  - if: '$CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"'
    when: never
  - if: '$CI_COMMIT_BRANCH == "stable" && $CI_PIPELINE_SOURCE == "push"'
    when: always
  - if: '$CI_COMMIT_BRANCH =~ /^(production|preproduction)$/'
    when: never
  - when: manual
```

**Reglas**:
- Desplegar a devel desde `stable` automáticamente
- Desplegar a PRE desde `preproduction` automáticamente
- Desplegar a PRO desde `production` automáticamente
- `when: manual` como fallback
- No desplegar en eventos MR
- No desplegar desde main

### Proceso de despliegue

**Pasos estándar**:

1. **Validar entorno**: Comprobar variables
2. **Build assets**: Ejecutar build
3. **Deploy archivos**: `rsync`
4. **Migraciones**: Ejecutar migraciones (si aplica)
5. **Cleanup**: Limpiar workspace

**Ejemplo**:

```yaml
script:
  - echo "Deploying code to $DOC_ROOT_DEVEL - $URL_DEVEL"
  - nvm use 16
  - make build
  - rsync -az --force --delete --progress --exclude-from=.htexclude public/ $DOC_ROOT_DEVEL
  - wp compi migration --quiet --path=$DOC_ROOT_DEVEL
  - echo "[OK] Build CSS/JS"
```

---

## Calidad de código y tests

### Jobs de calidad de código

**Jobs estándar**:

1. **PHP Rector**: Modernización
2. **PHP CS Fixer**: Estilo de código
3. **PHP Stan**: Análisis estático
4. **PHP Code Sniffer**: WPCS
5. **NPM ESLint**: Lint JS
6. **NPM Stylelint**: Lint CSS

**Patrón**:

```yaml
PHP Stan:
  stage: check
  script:
    - make check-php
    - echo "[OK] PHP Stan"
  dependencies:
    - Install PHP DEV
  needs:
    - Install PHP DEV
  cache:
    key: "php-dev--$PHP_COMBINED_HASH"
    paths: *default_php_paths
    policy: pull
  artifacts:
    when: always
    paths:
      - wp-content/themes/prisa-media/results-phpstan.xml
    reports:
      junit:
        - wp-content/themes/prisa-media/results-phpstan.xml
  allow_failure: false
  rules: *default_rules
  tags: *default_tags
```

**Reglas**:
- Ejecutar en stage `check`
- `allow_failure: false` en checks críticos
- Reportes JUnit para integración GitLab
- Cachear dependencias
- Usar `dependencies` para limitar artifacts

### Jobs de testing

**Patrón**:

```yaml
PHP Unit:
  stage: check
  script:
    - export XDEBUG_MODE=coverage
    - make check-unit
    - echo "[OK] PHP Unit"
  needs:
    - Install PHP DEV
  cache:
    key: "php-dev--$PHP_COMBINED_HASH"
    paths: *default_php_paths
    policy: pull
  artifacts:
    when: always
    paths:
      - wp-content/themes/prisa-media/results-phpunit.xml
      - wp-content/themes/prisa-media/coverage-report.xml
    reports:
      junit:
        - wp-content/themes/prisa-media/results-phpunit.xml
      coverage_report:
        coverage_format: cobertura
        path: wp-content/themes/prisa-media/coverage-report.xml
  allow_failure: false
  rules: *default_rules
  tags: *default_tags
```

**Reglas**:
- Ejecutar en stage `check`
- Generar reports de cobertura
- Usar reports JUnit
- `allow_failure: false` en tests críticos

---

## Auditorías de seguridad

### Auditoría de dependencias

**Patrón**:

```yaml
Security Audit:
  stage: security
  script:
    - echo "Auditing PHP dependencies..."
    - composer audit --working-dir=wp-content/themes/prisa-media --no-dev
    - composer audit --working-dir=wp-content/plugins/prisa-blocks --no-dev
    - echo "Auditing NPM dependencies..."
    - nvm use 16
    - npm audit --prefix ./wp-content/themes/prisa-media --audit-level=high
  needs:
    - Install PHP DEV
    - Install NPM
  allow_failure: true
  rules: *default_rules
  tags: *default_tags
```

**Reglas**:
- Ejecutar en stage `security`
- Auditar PHP (Composer) y NPM
- `--audit-level=high` para NPM
- `allow_failure: true` (informativo)
- Ejecutar tras instalar dependencias

---

## Cleanup

### Limpieza de workspace

**Patrón**:

```yaml
cleanup_workspace:
  stage: cleanup
  variables:
    CI_DEBUG_TRACE: "false"
    GIT_SUBMODULE_STRATEGY: none
    GIT_STRATEGY: none
  script:
    - echo "Time to clean up"
  after_script:
    - find "$CI_PROJECT_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  rules: *default_rules
  tags: *default_tags
```

**O en job de deploy**:

```yaml
Application Deployment:
  after_script:
    - rm -rf $CI_PROJECT_DIR/*
    - rm -rf $CI_PROJECT_DIR/.[!.]*
```

**Reglas**:
- Limpiar workspace tras despliegue
- Usar `after_script` para limpieza
- Borrar archivos y ocultos
- `GIT_STRATEGY: none` cuando no haga falta

---

## Gestión de errores

### Validación y comprobaciones

**Patrón**:

```yaml
before_script:
  # Validar herramientas
  - php --version || (echo "PHP not available" && exit 1)
  - composer --version || (echo "Composer not available" && exit 1)
  - npm --version || (echo "NPM not available" && exit 1)
  
  # Validar archivos
  - test -f .htexclude || (echo ".htexclude not found" && exit 1)
  
  # Validar variables
  - *validate_environment
```

**Reglas**:
- Validar herramientas antes de usar
- Validar archivos antes de usar
- Validar variables antes de desplegar
- Mensajes claros
- Salir con error en fallos

### Allow Failure

**Usar `allow_failure: true` para**:
- Checks no críticos (auditorías, tests opcionales)
- Features experimentales
- Jobs que pueden fallar sin bloquear

**Usar `allow_failure: false` para**:
- Checks críticos de calidad
- Tests obligatorios
- Jobs de deploy

**Patrón**:

```yaml
Security Audit:
  allow_failure: true  # Informativo

PHP Stan:
  allow_failure: false  # Crítico
```

---

## Buenas prácticas

### 1. Organización de jobs

- **Agrupar relacionados**
- **Minimizar número de jobs**
- **Dependencias claras**

### 2. Optimización de rendimiento

- **Usar caché**
- **Paralelizar con `needs`**
- **Clonado shallow (`GIT_DEPTH: 1`)**
- **Limitar artifacts**

### 3. Mantenibilidad

- **Anchors YAML**
- **Documentar lógica compleja**
- **Patrones consistentes**
- **Versionar todo**

### 4. Seguridad

- **Validar inputs**
- **No secretos en YAML**
- **Conexiones seguras**
- **Mínimo privilegio**

### 5. Fiabilidad

- **Operaciones idempotentes**
- **Gestión de errores**
- **Logs claros**
- **Test local previo**

---

## Patrones comunes

### Patrón 1: Instalación con caché

```yaml
before_script:
  - export PHP_COMBINED_HASH=$(sha256sum composer.lock | awk '{print $1}')

Install PHP DEV:
  stage: install
  script:
    - make install-php-dev
  needs:
    - Environment Validation
  cache:
    key: "php-dev--$PHP_COMBINED_HASH"
    paths: *default_php_paths
    policy: pull-push
  artifacts:
    paths: *default_php_paths
    expire_in: 2 days
  rules: *default_rules
  tags: *default_tags
```

### Patrón 2: Check de calidad con artifacts

```yaml
PHP Stan:
  stage: check
  script:
    - make check-php
    - echo "[OK] PHP Stan"
  dependencies:
    - Install PHP DEV
  needs:
    - Install PHP DEV
  cache:
    key: "php-dev--$PHP_COMBINED_HASH"
    paths: *default_php_paths
    policy: pull
  artifacts:
    when: always
    paths:
      - wp-content/themes/prisa-media/results-phpstan.xml
    reports:
      junit:
        - wp-content/themes/prisa-media/results-phpstan.xml
  allow_failure: false
  rules: *default_rules
  tags: *default_tags
```

### Patrón 3: Deploy con validación

```yaml
Application Deployment:
  stage: deploy
  environment:
    name: devel
    url: $URL_DEVEL
  before_script:
    - *validate_environment
  script:
    - echo "Deploying code to $DOC_ROOT_DEVEL - $URL_DEVEL"
    - nvm use 16
    - make build
    - rsync -az --force --delete --progress --exclude-from=.htexclude public/ $DOC_ROOT_DEVEL
    - wp compi migration --quiet --path=$DOC_ROOT_DEVEL
    - echo "[OK] Build CSS/JS"
  needs:
    - Install NPM
    - Install PHP PRO
    - PHP Rector
    - PHP CS Fixer
    - PHP Stan
    - PHP Code Sniffer
    - NPM ESLint
    - NPM Stylelint
  cache:
    - key: "php-pro--$PHP_COMBINED_HASH"
      paths: *default_php_paths
      policy: pull
    - key: "npm--$NPM_HASH"
      paths: *default_npm_paths
      policy: pull
  after_script:
    - rm -rf $CI_PROJECT_DIR/*
    - rm -rf $CI_PROJECT_DIR/.[!.]*
  rules: *deploy_rules
  tags: *default_tags
```

---

## Anti-patrones a evitar

❌ **Hardcodear secretos en YAML**
```yaml
# MAL
script:
  - ssh user@host -p 12345
```

✅ **Usar variables**
```yaml
# BIEN
script:
  - ssh $SSH_USER@$SSH_HOST -p $SSH_PORT
```

❌ **Sin validación de variables**
```yaml
# MAL
script:
  - rsync ./ $DOC_ROOT_DEVEL
```

✅ **Validar antes**
```yaml
# BIEN
before_script:
  - *validate_environment
script:
  - rsync ./ $DOC_ROOT_DEVEL
```

❌ **Sin caché**
```yaml
# MAL
Install PHP:
  script:
    - composer install
```

✅ **Usar caché**
```yaml
# BIEN
Install PHP:
  cache:
    key: "php--$PHP_HASH"
    paths: *default_php_paths
    policy: pull-push
  script:
    - composer install
```

❌ **Ejecución secuencial**
```yaml
# MAL
Job 1:
  stage: check
  stage: check
Job 2:
  stage: check
```

✅ **Ejecución paralela**
```yaml
# BIEN
Job 1:
  stage: check
  needs:
    - Install PHP
Job 2:
  stage: check
  needs:
    - Install PHP
```

❌ **Sin gestión de errores**
```yaml
# MAL
script:
  - composer install
  - npm install
```

✅ **Validar y gestionar errores**
```yaml
# BIEN
script:
  - composer --version || (echo "Composer not available" && exit 1)
  - composer install
  - npm --version || (echo "NPM not available" && exit 1)
  - npm install
```

---

## Checklist para cambios en GitLab CI/CD

Antes de commitear cambios en `.gitlab-ci.yml`, verificar:

### Seguridad
- [ ] No hay secretos hardcodeados
- [ ] Datos sensibles en variables CI/CD
- [ ] Variables validadas antes de deploy
- [ ] Conexiones seguras (SSH keys, no passwords)

### Rendimiento
- [ ] Caché configurado para dependencias
- [ ] Jobs en paralelo con `needs`
- [ ] Artifacts con caducidad apropiada
- [ ] `GIT_DEPTH: 1` para clones rápidos

### Fiabilidad
- [ ] Gestión de errores (validaciones, checks)
- [ ] Mensajes de error claros
- [ ] Jobs idempotentes
- [ ] Limpieza de workspace configurada

### Mantenibilidad
- [ ] Anchors YAML para configuración compartida
- [ ] Naming consistente
- [ ] Lógica compleja documentada
- [ ] Patrones establecidos seguidos

### Funcionalidad
- [ ] Workflow rules definidas
- [ ] Stages organizados lógicamente
- [ ] Dependencias correctas (`needs`, `dependencies`)
- [ ] Reglas de despliegue apropiadas

---

## Referencias

- [GitLab CI/CD YAML Syntax Reference](https://docs.gitlab.com/ci/yaml/)
- [GitLab CI/CD Examples](https://docs.gitlab.com/ee/ci/examples/)
- [GitLab CI/CD Variables](https://docs.gitlab.com/ee/ci/variables/)
- [GitLab CI/CD Cache](https://docs.gitlab.com/ee/ci/caching/)
- [GitLab CI/CD Artifacts](https://docs.gitlab.com/ee/ci/pipelines/job_artifacts.html)

---

**Última actualización:** 2026-01-16  
**Estado:** Activo  
**Aplica a:** `.gitlab-ci.yml` únicamente

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
