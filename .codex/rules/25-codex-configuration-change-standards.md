---
title: Estándares de cambios en configuración Codex
alwaysApply: false
category: documentation
globs:
  - ".codex/**"
  - "AGENTS.md"
---
# Estándares de cambios en configuración Codex

## TL;DR

- Definir alcance antes de cambiar configuración (`.codex/**`, `AGENTS.md`).
- Aplicar cambios mínimos, localizados y sin refactors colaterales.
- Ejecutar validadores según el área tocada.
- No cerrar una tarea de configuración sin evidencia (comando exacto + salida).

## Propósito

Estandarizar cómo se modifican los archivos de configuración de Codex para mantener coherencia, trazabilidad y validación reproducible en cada cambio.

## Cuando aplica

- alwaysApply: false
- category: documentation
- globs: ".codex/**", "AGENTS.md"

## Reglas

### 1. Alcance de configuración (OBLIGATORIO)

Se considera cambio de configuración Codex cualquier modificación en:

- `.codex/README.md`
- `.codex/skills.yaml`
- `.codex/policies.yaml`
- `.codex/context.yaml`
- `.codex/environments.yaml`
- `.codex/vars.yaml`
- `.codex/conventions.md`
- `.codex/rules/*.md`
- `.codex/tools/*.sh`
- `.codex/skills/*/SKILL.md`
- `.codex/skills/*/scripts/*.sh`
- `AGENTS.md`

### 2. Flujo de cambio (OBLIGATORIO)

Antes de editar:

1. Declarar qué archivo(s) se van a tocar y por qué.
2. Declarar qué validadores se ejecutarán y cuáles no aplican.

Durante la edición:

1. Cambiar solo lo necesario para el objetivo.
2. No mezclar mejoras no relacionadas en el mismo lote.
3. No reordenar ni reformatear masivamente sin justificación.

### 3. Validación por alcance (OBLIGATORIO)

Ejecutar validación mínima en función del área tocada:

- Si cambias `.codex/rules/`:
  - `.codex/tools/update-codex-rules-index.sh`
  - `.codex/tools/validate-codex-rules.sh`
- Si cambias `.codex/README.md`:
  - `.codex/tools/validate-codex-readme.sh`
- Si cambias `skills.yaml` o `.codex/skills/`:
  - `.codex/tools/validate-codex-skills.sh`
- Si el lote toca más de un área:
  - Ejecutar todos los validadores afectados.

Validación integral recomendada al cierre:

- `.codex/skills/codex-doctor/scripts/run.sh`

### 4. Evidencia obligatoria en entrega (OBLIGATORIO)

Cada entrega debe incluir:

1. Comando exacto ejecutado.
2. Extracto de salida con resultado.
3. Estado final (`RESULTADO: OK` o `RESULTADO: FAIL`).

Sin esa evidencia, la tarea no puede marcarse como cerrada.

### 5. Criterio de cierre (OBLIGATORIO)

Una tarea de configuración Codex se considera cerrada solo si:

1. Todos los validadores del alcance están en verde.
2. El diff es coherente con el objetivo declarado.
3. No hay cambios colaterales sin justificar.

## Ejemplos

```bash
# Cambio en reglas
.codex/tools/update-codex-rules-index.sh
.codex/tools/validate-codex-rules.sh

# Cambio en README
.codex/tools/validate-codex-readme.sh

# Cambio en skills
.codex/tools/validate-codex-skills.sh
```

## Relacionado con

- `AGENTS.md`
- `./.agents/skills/vass-config/README.min.md` (estandares de desarrollo del proyecto)
