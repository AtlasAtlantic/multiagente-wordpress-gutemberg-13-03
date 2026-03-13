
# Spec v1 — Arquitectura Multi‑Agente con `.agents` como Fuente de Verdad

## 1. Propósito del documento

Este documento define una **especificación formal (Spec v1)** para implementar una arquitectura multi‑agente portable y neutral respecto a proveedor de IA.

El objetivo es permitir que un proyecto pueda trabajar indistintamente con diferentes entornos y runtimes de IA como:

- Codex CLI
- Claude
- Cursor
- ChatGPT
- futuros runtimes

sin duplicar lógica ni romper consistencia.

La clave del modelo es:

> `.agents/` es la **fuente de verdad única** de la capa de automatización inteligente del proyecto.

Todo el comportamiento de los agentes, workflows, skills, herramientas y adaptadores runtime debe definirse dentro de `.agents/`.

Los archivos específicos de runtime **no son fuentes de verdad**, sino **artefactos derivados**.

---

# 2. Principios de arquitectura

## 2.1 Source of Truth única

La carpeta `.agents/` contiene:

- arquitectura
- definición de agentes
- pipelines
- perfiles
- skills
- herramientas de agentes
- adaptadores runtime
- esquemas de validación

Ningún runtime externo puede redefinir esta lógica.

---

## 2.2 Neutralidad de proveedor

La arquitectura debe funcionar independientemente del proveedor de IA.

Esto permite cambiar o combinar herramientas como:

- Codex CLI
- Claude Code
- Cursor
- ChatGPT
- futuros agentes

sin rediseñar la arquitectura.

---

## 2.3 Runtime como adaptador

Los runtimes son **capas de adaptación**.

Su función es traducir la arquitectura definida en `.agents/` a los formatos requeridos por cada entorno.

Ejemplos:

- `CLAUDE.md`
- `.cursor/rules`
- `.codex/config.toml`
- instrucciones de proyecto en ChatGPT

---

## 2.4 Determinismo

Siempre que sea posible:

- la IA planifica
- los scripts ejecutan

Las operaciones críticas deben delegarse a **herramientas deterministas**.

---

## 2.5 Portabilidad entre proyectos

La carpeta `.agents/` debe poder copiarse entre repositorios y funcionar con mínimos cambios.

---

# 3. Estructura canónica de `.agents/`

```
.agents/
│
├─ AGENTS.md
│
├─ architecture/
│   ├─ principles.md
│   ├─ glossary.md
│   ├─ routing.yaml
│   ├─ handoff_schema.yaml
│   ├─ guardrails.yaml
│   └─ state_model.yaml
│
├─ agents/
│   ├─ planner.md
│   ├─ builder.md
│   ├─ reviewer.md
│   ├─ fixer.md
│   └─ qa.md
│
├─ pipelines/
│   ├─ feature.yaml
│   ├─ bugfix.yaml
│   ├─ refactor.yaml
│   └─ audit.yaml
│
├─ profiles/
│   ├─ wordpress.yaml
│   ├─ laravel.yaml
│   ├─ plugin.yaml
│   └─ generic-web.yaml
│
├─ skills/
│
├─ tools/
│
├─ runtime/
│
└─ schemas/
```

---

# 4. Roles de agentes

La arquitectura define los siguientes roles estándar.

## Planner

Responsabilidades:

- analizar la tarea
- identificar alcance
- detectar riesgos
- definir plan

Salida esperada:

```
objective
scope
files
steps
risks
validation
```

---

## Builder

Responsabilidades:

- implementar código
- seguir el plan aprobado
- usar skills del sistema

Restricciones:

- no modificar el alcance
- no introducir dependencias no aprobadas

---

## Reviewer

Responsabilidades:

- revisar calidad del código
- detectar regresiones
- validar arquitectura

Salida:

```
findings
severity
required_changes
approval_status
```

---

## Fixer

Responsabilidades:

- corregir problemas detectados en la revisión

Restricciones:

- solo modificar lo solicitado por review

---

## QA

Responsabilidades:

- validar build
- ejecutar tests
- comprobar criterios de aceptación

Salida:

```
checks
results
blocking_issues
final_status
```

---

# 5. Pipeline estándar

El flujo estándar recomendado es:

```
Planner → Builder → Reviewer → Fixer → QA
```

---

# 6. Definición de pipelines

Ejemplo `feature.yaml`:

```yaml
pipeline: feature-development

steps:
  - planner
  - builder
  - reviewer
  - fixer
  - qa
```

---

# 7. Skills

Las skills representan **capacidades reutilizables del sistema**.

Ejemplo de estructura:

```
.skills/
  wordpress-block-dev/
      SKILL.md
      scripts/
      resources/
```

Contenido típico de `SKILL.md`:

- descripción
- cuándo usarla
- pasos operativos
- scripts disponibles

---

# 8. Tools

Las tools son **scripts ejecutables** que permiten a los agentes operar de forma determinista.

Ejemplos:

```
build.sh
lint.sh
test.sh
e2e.sh
```

Las tools deben:

- ser idempotentes
- producir salidas claras
- evitar efectos colaterales inesperados

---

# 9. Runtime adapters

La carpeta `runtime/` contiene adaptadores para diferentes entornos.

Ejemplo:

```
runtime/
   codex/
   claude/
   cursor/
   chatgpt/
```

Cada runtime puede incluir:

```
mapping.yaml
templates/
output/
```

Los archivos generados en `output/` **no son fuente de verdad**.

---

# 10. Esquemas de validación

La carpeta `schemas/` define los esquemas que validan la arquitectura.

Ejemplos:

```
profile.schema.json
pipeline.schema.json
routing.schema.json
handoff.schema.json
```

La validación garantiza:

- consistencia
- integridad
- compatibilidad futura

---

# 11. Operativa de cambios

Flujo recomendado:

1. modificar `.agents/`
2. validar esquemas
3. regenerar adaptadores runtime
4. revisar diffs
5. ejecutar herramientas de diagnóstico

---

# 12. Herramientas del sistema

Se recomienda incluir herramientas internas como:

```
doctor
validate-config
sync-runtime
scaffold
```

Estas herramientas ayudan a:

- detectar inconsistencias
- generar artefactos runtime
- validar configuraciones

---

# 13. Ventajas de esta arquitectura

- independencia de proveedor
- portabilidad entre proyectos
- consistencia operativa
- gobernanza clara
- reducción de duplicación

---

# 14. Evolución futura

Esta Spec v1 está diseñada para evolucionar.

Posibles mejoras futuras:

- Spec v2 con contratos de estado
- soporte para orquestadores externos
- integración con MCP
- herramientas de generación automática
