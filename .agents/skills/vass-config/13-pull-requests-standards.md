---
title: Estándares de pull requests
alwaysApply: false
category: workflow
---
# Estándares de pull requests

## TL;DR

- Pequeñas
- Revisables
- De bajo riesgo
- Fáciles de entender por humanos y por el agente IA
- Cambios de código

## Propósito

Definir criterios obligatorios para pull requests revisables, pequeños y de bajo riesgo.

## Cuando aplica

- alwaysApply: false
- category: workflow

## Reglas

### 1. Propósito

Definir reglas claras, exigibles y de alta calidad para crear pull requests que sean:

- Pequeñas
- Revisables
- De bajo riesgo
- Fáciles de entender por humanos y por el agente IA

Estas reglas aplican a todos los repositorios del proyecto.

---

### 2. Principios básicos

1. **Un PR = un propósito claro**  
   Un PR debe abordar **un único problema**, o entregar **una única pieza de funcionalidad** bien enfocada.

2. **Cambios pequeños, entrega frecuente**  
   Siempre es mejor enviar **5 PRs pequeños** que **1 PR enorme**.

3. **Un PR debe ser revisable en menos de 20–30 minutos**  
   Si requiere más tiempo, el PR es demasiado grande.

4. **Código + tests + documentación mínima**  
   Cada PR debe incluir:
   - Cambios de código  
   - Tests (si hay infraestructura) O verificación manual en WordPress
   - Actualizaciones mínimas de documentación cuando cambian interfaces públicas  

---

### 3. Tamaño máximo recomendado de un PR

Los revisores (humanos o IA) deben aplicar estos "límites duros":

- **Archivos modificados:** máximo **15**
- **Cambios netos de líneas (altas + bajas):** máximo **500**
- **Commits dentro del PR:** idealmente **1–5**, limpios y descriptivos

> Si *cualquiera* de estos límites se supera:
> - No abrir el PR (o marcarlo como "Draft").
> - Dividir el trabajo en PRs más pequeños y aislados funcionalmente.

---

### 4. Qué debe contener un PR

Un PR debe contener cambios cohesivos, por ejemplo:

- Una feature bien acotada  
- Una refactorización enfocada (un módulo o capa)  
- Un único bug fix  
- Una mejora de rendimiento contenida  
- Cambios mínimos de configuración requeridos por lo anterior  

---

### 5. Qué NO debe contener un PR

Evitar mezclar:

- Feature nueva + refactor no relacionado  
- Reorganización de archivos + cambios funcionales profundos  
- Cambios masivos de formato + lógica de negocio nueva  
- Múltiples tickets/historias no relacionadas en un PR  
- Limpieza aleatoria junto con trabajo funcional  

> Regla práctica:  
> Si te cuesta escribir un **título corto y claro**, el PR está haciendo demasiado.

---

### 6. Estructura de un buen PR

### 6.1. Título

Formato recomendado:

```
TICKET-ID: short description
```

Ejemplos:
- `TICKET-6: add custom hero block`
- `TICKET-12: update theme setup with new hooks`

### 6.2. Descripción

La descripción debe responder:

1. **¿Qué hace este PR?** (2–4 líneas)
2. **¿Por qué se necesitaba?**
3. **¿Cómo se implementó?** (decisiones clave)
4. **Impacto / riesgo**
5. **Cómo probarlo**

Ejemplo:

```markdown
## What
Adds a custom hero block with parallax effect for homepage sections.

## Why
Required to create engaging hero sections with modern parallax scrolling effects.

## How
- Added `HeroBlock` class in `theme/src/Blocks.php`.
- Created `block.json` metadata file.
- Added render callback with parallax functionality.
- Enqueued block-specific assets.

## Impact
- Low: New block, doesn't affect existing functionality.

## How to test
1. Go to WordPress block editor
2. Add "Hero Block" to a page
3. Verify:
   - Block appears in inserter
   - Block renders correctly on frontend
   - Parallax effect works
   - No errors in WordPress debug log
```

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
