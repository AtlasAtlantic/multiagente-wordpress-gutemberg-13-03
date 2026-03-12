# Skill Discovery Index v1

## Propósito

Definir un artefacto derivado de discovery para las skills locales sin introducir una nueva fuente de verdad.

Este documento especifica:

- la ubicación del archivo generado
- la estructura JSON
- el mapeo a fuentes canónicas
- las reglas de validación
- los no-objetivos

El índice existe únicamente para dar soporte a:

- discovery de skills
- construcción de shortlists
- inspección por tooling
- validación de consistencia

El índice no debe sustituir routing, guardrails, profiles ni reglas de orquestación.

## Fuente de verdad

La configuración canónica sigue estando en `.agents/`.

Fuentes principales:

- `.agents/skills/**/SKILL.md`
- `.agents/skills-tier.yaml`
- `.agents/multiagent.yaml`

Fuentes relacionadas que pueden referenciarse, pero no duplicarse en el índice como política ya resuelta:

- `.agents/profiles/*.yaml`
- `.agents/GUARDRAILS.md`
- `.agents/prompts/*.md`

## Artefacto de salida

Ruta del archivo generado:

`./.agents/generated/skill-discovery-index.json`

Propiedades:

- generado, nunca editado a mano
- determinista a partir de fuentes canónicas
- regenerable en cualquier momento
- objetivo de validación para `agents-doctor`

## No-objetivos

El índice no debe:

- decidir qué skill ejecutar
- resolver lógica de routing
- codificar `gates` o `checks` finales
- duplicar política de guardrails
- reemplazar `multiagent.yaml`
- convertirse en un registry editable

Flujo correcto:

`skill-discovery-index -> shortlist -> multiagent.yaml decide -> execution`

## Contrato JSON v1

Estructura de alto nivel:

```json
{
  "version": 1,
  "generated_at": "2026-03-12T12:00:00Z",
  "source_of_truth": ".agents",
  "skills": []
}
```

### Campos de alto nivel

- `version`
  - obligatorio
  - entero
  - fijo a `1` para este contrato
- `generated_at`
  - obligatorio
  - timestamp ISO 8601 en UTC
- `source_of_truth`
  - obligatorio
  - string
  - fijo a `.agents`
- `skills`
  - obligatorio
  - array de entradas de skill
  - ordenado por `name`

## Contrato de entrada de skill

### Campos obligatorios

- `name`
  - identificador canónico de la skill
  - string
- `path`
  - ruta relativa al repo al directorio de la skill
  - string
- `tier`
  - tier canónico obtenido de `skills-tier.yaml`
  - string
- `source_files`
  - array no vacío de rutas relativas al repo que originan la entrada

### Campos opcionales

- `summary`
  - resumen corto legible por humanos
  - string o `null`
- `tags`
  - tags ligeros para discovery
  - array de strings

### Ejemplo v1

```json
{
  "name": "e2e-testing-patterns",
  "path": ".agents/skills/e2e-testing-patterns",
  "tier": "tier_2_support",
  "source_files": [
    ".agents/skills/e2e-testing-patterns/SKILL.md",
    ".agents/skills-tier.yaml"
  ],
  "summary": "Deterministic WordPress end-to-end testing guidance for Playwright-first projects.",
  "tags": [
    "wordpress",
    "gutenberg",
    "playwright",
    "e2e"
  ]
}
```

## Reglas de mapeo a fuentes canónicas

### `name`

Fuente canónica:

- nombre base del directorio de la skill dentro de `.agents/skills/`

Reglas:

- `name` debe coincidir con el id canónico usado por el repo en routing, profiles y configuración
- en v1 no debe derivarse desde frontmatter de `SKILL.md`
- el frontmatter puede usar el mismo id por consistencia documental, pero no es fuente de verdad para el índice

### `path`

Derivado de la ruta real del directorio de la skill dentro de `.agents/skills/`.

Formato:

- relativo al repo
- sin slash final

### `tier`

Fuente canónica:

- `.agents/skills-tier.yaml`

Reglas:

- debe resolverse únicamente desde `skills-tier.yaml`
- no debe inferirse desde `SKILL.md`
- cada skill debe pertenecer a exactamente un tier

### `source_files`

Valores mínimos obligatorios:

- `SKILL.md` de la skill
- `.agents/skills-tier.yaml`

En futuras versiones podrán añadirse más ficheros si la extracción se amplía, pero v1 debe mantenerse mínima.

### `summary`

Fuente preferente:

- frontmatter `description` de `SKILL.md`

Fallback:

- `null`

Reglas:

- no inferir desde párrafos arbitrarios del cuerpo salvo que exista una extracción estandarizada a propósito
- no sintetizar con lógica LLM durante la generación

### `tags`

Fuentes permitidas en v1:

- metadata estructurada explícita si se añade más adelante a `SKILL.md`
- extracción conservadora desde términos conocidos si es determinista

Fallback:

- array vacío

Reglas:

- es preferible omitir antes que hacer parsing semántico frágil

## Reglas de validación

La validación debe vivir en `agents-doctor`.

### Errores duros

- existe un directorio real de skill sin entrada en el índice
- existe una entrada en el índice sin directorio real de skill
- `path` no existe
- falta `SKILL.md` para una skill indexada
- falta `tier`
- `tier` no existe en `.agents/skills-tier.yaml`
- una skill aparece en más de un tier en `.agents/skills-tier.yaml`
- el `tier` indexado no coincide con el `tier` canónico en `.agents/skills-tier.yaml`
- `name` duplicado
- `path` duplicado
- `source_files` vacío
- alguna entrada de `source_files` no existe
- `version` de alto nivel no está soportada
- el índice committed no coincide con una regeneración determinista del generador (staleness)

### Warnings

- `summary` es `null`
- `tags` está vacío

En v1 los warnings semánticos se limitan a metadata opcional realmente presente en el contrato.

Los warnings están permitidos en v1 porque la metadata semántica puede seguir incompleta.

## Reglas de generación

El generador debe:

1. escanear `.agents/skills/*/SKILL.md`
2. resolver los tiers canónicos desde `.agents/skills-tier.yaml`
3. construir entradas deterministas
4. ordenar las entradas por `name`
5. emitir JSON con formato estable
6. permitir regeneración determinista para validación de staleness

El generador no debe:

- leer `multiagent.yaml` para resolver decisiones de ejecución
- calcular resultados de routing
- incrustar prompts o guardrails
- inventar metadata faltante

## Reglas de integración

Usos permitidos:

- discovery
- filtrado por tier
- construcción de shortlist
- validación con doctor
- inspección por tooling

Usos no permitidos:

- decisiones directas de ejecución
- puentear `multiagent.yaml`
- reemplazar selección de profiles
- reemplazar quality gates

## Versionado

Este documento define `v1`.

Los cambios incompatibles hacia atrás requieren:

- incremento de `version`
- nota de migración explícita en este documento
- actualización del validador

La metadata aditiva puede mantenerse dentro de `v1` si:

- los campos obligatorios permanecen estables
- las reglas de validación siguen siendo compatibles
- se conserva el mapeo a fuentes canónicas

## Siguientes entregables recomendados

1. normalización opcional adicional de `tags` si se amplía metadata estructurada en `SKILL.md`
2. mejoras de tooling que consuman el índice sin introducir lógica resolutiva
