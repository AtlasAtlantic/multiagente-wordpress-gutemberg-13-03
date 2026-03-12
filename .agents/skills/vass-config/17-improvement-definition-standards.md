---
title: Estándares de definición de mejoras
alwaysApply: false
category: documentation
globs:
  - "docs/technical/improvements/**/*.md"
---
# Estándares de definición de mejoras

## TL;DR

- **Fuente única de verdad** sobre qué se mejora y por qué
- **Plano técnico** para la implementación de la mejora
- **Referencia del estado actual** para entender la implementación existente
- **Guía de verificación** para confirmar que la mejora funciona y no rompe funcionalidad existente
- Incluye - Qué mejoras están incluidas

## Propósito

Definir estructura estándar para documentar mejoras y validarlas sin regresiones.

## Cuando aplica

- alwaysApply: false
- category: documentation
- globs: "docs/technical/improvements/**/*.md"

## Reglas

### 1. Propósito

Este documento define la estructura, el contenido y los estándares de redacción para documentación de mejoras en el proyecto WordPress. Un documento de mejora bien escrito debe servir como:

- **Fuente única de verdad** sobre qué se mejora y por qué
- **Plano técnico** para la implementación de la mejora
- **Referencia del estado actual** para entender la implementación existente
- **Guía de verificación** para confirmar que la mejora funciona y no rompe funcionalidad existente

### 2. Estructura del documento

Cada documento de mejora DEBE seguir esta estructura:

### 2.1. Secciones obligatorias (en orden)

1. **Título** (`# TICKET-XX: [Nombre descriptivo]`)
2. **Objetivo** - Qué se mejora y por qué
3. **Contexto del proyecto** - Estado actual y qué se mejora
4. **Alcance**
   - Incluye - Qué mejoras están incluidas
   - Excluye - Qué queda explícitamente fuera de alcance
5. **Estado actual** - Descripción detallada de la implementación actual
6. **Mejoras propuestas** - Qué se va a cambiar
7. **Requisitos funcionales** - Cómo funciona la mejora
8. **Modelo de datos y relaciones** - Si hay cambios de datos (si aplica)
9. **Criterios de aceptación** - Cómo verificar la mejora
10. **Estrategia de pruebas** - Tests incluyendo regresiones

### 2.2. Secciones opcionales

- **Análisis de impacto** - Sistemas/componentes afectados
- **Consideraciones de migración** - Si hace falta migración de datos
- **Requisitos no funcionales** - Rendimiento, seguridad, mantenibilidad
- **Consideraciones técnicas** - Notas de implementación, patrones a seguir
- **Consideraciones finales** - Resumen y siguientes pasos

### 3. Guías por sección

### 3.1. Título

```markdown
# TICKET-XX: [Nombre descriptivo]
# Improvement: [Nombre descriptivo]
```

**Reglas**:
- Usar ID del ticket (TICKET-XX) cuando esté disponible
- Usar verbo en imperativo o infinitivo en inglés ("Improve performance", "Optimize queries")
- Ser específico y descriptivo
- Enfocar en la mejora, no en el problema

**Ejemplos**:
- ✅ `# TICKET-30: Improve block asset loading performance`
- ✅ `# Improvement: Optimize WordPress hook registration`
- ❌ `# TICKET-30` (falta descripción)
- ❌ `# Improvement` (demasiado vago)
- ❌ `# Fix: Slow loading` (esto es un bug, no una mejora)

### 3.2. Objetivo

**Propósito**: Explicar QUÉ se mejora y POR QUÉ en 2-4 párrafos.

**Debe incluir**:
- Descripción clara de la limitación o problema actual
- Qué conseguirá la mejora
- Valor de negocio o beneficio
- Mejoras clave que aporta

**Plantilla**:
```markdown
## Objective

[Resumen breve de 1-2 frases sobre qué se mejora y por qué]

El sistema actualmente [comportamiento/limitación]. Esta mejora [qué se mejorará], permitiendo:
- [Beneficio 1]
- [Beneficio 2]
- [Beneficio 3]

La mejora será **[característica clave]** y se implementará mediante [cómo].
```

**Ejemplo**:
```markdown
## Objective

Improve block asset loading performance by implementing conditional loading and asset optimization.

The system currently loads all block assets on every page, even when blocks are not used. This improvement will implement conditional asset loading and optimization, allowing:
- Reduce page load time by 40-50%
- Load assets only when blocks are present
- Optimize asset delivery for better performance

The improvement will be **backward compatible** and will be implemented via WordPress conditional asset enqueuing.
```

### 3.3. Contexto del proyecto

**Propósito**: Explicar el estado actual y qué se mejorará.

**Debe incluir**:
- **Estado actual**: Qué existe ahora y sus limitaciones
- **Componentes afectados**: Clases, bloques, hooks que se modificarán
- **Relación con la estructura actual**: Cómo se conecta con el theme/plugins existentes

**Plantilla**:
```markdown
## Project Context

### Current State

- **Current implementation**: [Descripción actual]
- **Identified limitations**:
  - [Limitación 1]
  - [Limitación 2]
- **Affected components**:
  - `Assets.php` - [Descripción]
  - `Blocks.php` - [Descripción]

### Relationship to Current Structure

[Cómo se relaciona esta mejora con la estructura existente]
```

### 3.4. Alcance

**Propósito**: Definir límites claros de lo que SÍ y NO incluye la mejora.

**Estructura**:
```markdown
## Scope

### Includes

- [Mejora específica 1]
- [Mejora específica 2]
- [Mejora específica 3]

### Excludes (for now)

- [Elemento fuera de alcance 1] - [motivo o consideración futura]
- [Elemento fuera de alcance 2] - [motivo o consideración futura]
```

**Reglas**:
- Ser específico y concreto
- Usar bullets para claridad
- En "Excludes", añadir breve explicación del motivo o futuro
- Evitar lenguaje ambiguo

### 3.5. Estado actual

**Propósito**: Documentar la implementación existente en detalle.

**Debe incluir**:
- Estructura de código actual
- Comportamiento actual
- Limitaciones actuales
- Ejemplos de código actuales

**Estructura**:
```markdown
## Current State

### Current Implementation

[Descripción de cómo funciona ahora]

### Current Code

```php
[Ejemplo de código actual]
```

### Current Limitations

- [Limitación 1]: [Descripción]
- [Limitación 2]: [Descripción]
```

### 3.6. Mejoras propuestas

**Propósito**: Describir qué se cambiará y cómo.

**Debe incluir**:
- Descripción detallada de las mejoras
- Ejemplos de código nuevos
- Cambios paso a paso
- Hooks/filters de WordPress a usar

**Estructura**:
```markdown
## Proposed Improvements

### 1. [Nombre de mejora]

[Descripción de la mejora]

**Changes:**

```php
// Current (limitation)
[código actual]

// Improved (solution)
[código nuevo]
```

### 2. [Nombre de mejora]

[Descripción]
```

### 3.7. Requisitos funcionales

**Propósito**: Describir CÓMO funciona la mejora.

**Estructura**:
- Usar subsecciones numeradas para áreas funcionales
- Incluir uso de hooks/filters WordPress
- Describir comportamiento de cada componente
- Usar bloques de código para ejemplos

### 3.8. Criterios de aceptación

**Propósito**: Definir condiciones que deben cumplirse para considerar la mejora completa.

**Formato**:
```markdown
## Acceptance Criteria

### Functional

- [ ] CA-F1: [Functional acceptance criterion 1]
- [ ] CA-F2: [Functional acceptance criterion 2]

### Technical

- [ ] CA-T1: [Technical acceptance criterion 1]
- [ ] CA-T2: [Technical acceptance criterion 2]

### WordPress Integration

- [ ] CA-W1: Improvement works correctly in WordPress admin
- [ ] CA-W2: Improvement works correctly on frontend
- [ ] CA-W3: No PHP errors in WordPress debug log
- [ ] CA-W4: No regressions in existing functionality
```

### 3.9. Estrategia de pruebas

**Propósito**: Definir cómo se verificará la mejora.

**Estructura**:
```markdown
## Testing Strategy

### Automated Tests (if test infrastructure exists)

**File**: `tests/Unit/[ComponentName]Test.php`

- [ ] UT-1: [Unit test 1 description]
- [ ] UT-2: [Unit test 2 description]

### Manual WordPress Testing

- [ ] MT-1: [Manual test 1 description]
- [ ] MT-2: [Manual test 2 description]
- [ ] MT-3: Verify no regressions in existing functionality
- [ ] MT-4: Check WordPress debug log for errors
```

### 4. Guías de estilo de escritura

### 4.1. Idioma y tono

- **Idioma**: Inglés para todo el contenido y código
- **Tono**: Profesional, técnico, preciso
- **Voz**: Preferir voz activa
- **Tiempo verbal**: Presente para estado actual, futuro/imperativo para mejoras

### 4.2. Reglas de formato

**Formato Markdown**:
- Usar `#` para título principal, `##` para secciones, `###` para subsecciones
- Usar **negrita** para resaltar términos clave
- Usar formato `code` para:
  - Rutas de archivo: `theme/src/Assets.php`
  - Funciones WordPress: `wp_enqueue_script()`
  - Nombres de clase/método: `Assets::enqueueConditionally()`
- Usar `---` (regla horizontal) para separar secciones principales

**Bloques de código**:
- Siempre indicar lenguaje: ` ```php`, ` ```bash`, ` ```json`
- Incluir comentarios si aportan valor
- Mostrar actual vs. mejorado al demostrar cambios

### 4.3. Convenciones de nombres

**Archivos y rutas**:
- Usar rutas completas: `theme/src/Assets.php`
- **IMPORTANTE**: Usar kebab-case con **solo minúsculas** para archivos de mejora: `ticket-30-improve-asset-loading.md`
  - ✅ Correcto: `ticket-30-improve-asset-loading.md`
  - ❌ Incorrecto: `TICKET-30-improve-asset-loading.md` (contiene mayúsculas)
  - **Nota**: Ver `documentation-standards.md` sección "File Naming Conventions" para la regla completa.

### 5. Errores comunes a evitar

### 5.1. Errores de contenido

❌ **Mejoras vagas**:
```markdown
## Proposed Improvements

Make it faster.
```

✅ **Mejoras específicas**:
```markdown
## Proposed Improvements

### 1. Conditional Asset Loading

Implement conditional asset enqueuing based on block presence:

```php
// Current (loads always)
wp_enqueue_script( 'block-script', $url );

// Improved (loads conditionally)
if ( has_block( 'prisa-media/hero-block' ) ) {
    wp_enqueue_script( 'block-script', $url );
}
```
```

### 5.2. Errores estructurales

❌ **Falta estado actual**:
```markdown
# Improvement: Make it better

## Proposed Improvements

[Changes]
```

✅ **Estructura completa**:
```markdown
# TICKET-30: Improve asset loading

## Objective
[What and why]

## Current State
[Current implementation]

## Proposed Improvements
[Detailed changes]

## Acceptance Criteria
[Testable criteria]
```

### 6. Checklist de revisión

Antes de dar por completo un documento de mejora, verificar:

### Compleción de contenido
- [ ] El objetivo indica claramente QUÉ y POR QUÉ
- [ ] El estado actual está documentado en detalle
- [ ] Las mejoras propuestas son específicas y detalladas
- [ ] Los criterios de aceptación son testeables
- [ ] La estrategia de pruebas incluye tests de regresión

### Precisión técnica
- [ ] Todas las funciones WordPress están correctamente nombradas
- [ ] Todas las rutas de archivo siguen la estructura del proyecto
- [ ] Todos los ejemplos de código son válidos
- [ ] Hooks/filters de WordPress documentados

### Calidad de formato
- [ ] Todo el markdown está bien formateado
- [ ] Todos los bloques de código tienen lenguaje
- [ ] Todas las secciones siguen la estructura estándar

### 7. Plantillas

### 7.1. Plantilla de mejora

Usa esta plantilla al documentar una mejora:

```markdown
# TICKET-XX: [Improvement Name]

## Objective

[What is being improved and why]

---

## Project Context

### Current State

[Current implementation and limitations]

---

## Scope

### Includes

- [Improvement 1]
- [Improvement 2]

### Excludes (for now)

- [Out of scope item]

---

## Current State

### Current Implementation

[How it currently works]

### Current Limitations

- [Limitation 1]
- [Limitation 2]

---

## Proposed Improvements

### 1. [Improvement Name]

[Description]

```php
// Current
[current code]

// Improved
[new code]
```

---

## Acceptance Criteria

- [ ] CA-1: [Criterion]

---

## Testing Strategy

### Manual WordPress Testing

- [ ] MT-1: [Test description]
- [ ] MT-2: Verify no regressions
```

### 8. Mejora continua

Esta guía es un documento vivo. Cuando identifiques patrones o problemas en documentación de mejoras:

1. Documentar el problema
2. Proponer una actualización a esta guía
3. Actualizar documentos de mejora existentes para ajustarlos a los nuevos estándares cuando sea viable
4. Incluir el aprendizaje en futuras revisiones de mejoras

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
