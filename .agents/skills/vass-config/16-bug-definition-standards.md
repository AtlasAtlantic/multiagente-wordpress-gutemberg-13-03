---
title: Estándares de definición de bugs
alwaysApply: false
category: documentation
globs:
  - "docs/technical/bugs/**/*.md"
---
# Estándares de definición de bugs

## TL;DR

- **Fuente única de verdad** sobre qué es el bug y cómo se solucionó
- **Referencia técnica** para entender causas raíz y soluciones
- **Base de conocimiento** para prevenir bugs similares en el futuro
- **Guía de verificación** para confirmar que el fix funciona correctamente
- Síntomas

## Propósito

Definir estructura estándar para documentar bugs y su resolución verificable.

## Cuando aplica

- alwaysApply: false
- category: documentation
- globs: "docs/technical/bugs/**/*.md"

## Reglas

### 1. Propósito

Este documento define la estructura, el contenido y los estándares de redacción para documentación de bugs en el proyecto WordPress. Un buen documento de bug debe servir como:

- **Fuente única de verdad** sobre qué es el bug y cómo se solucionó
- **Referencia técnica** para entender causas raíz y soluciones
- **Base de conocimiento** para prevenir bugs similares en el futuro
- **Guía de verificación** para confirmar que el fix funciona correctamente

### 2. Estructura del documento

Cada documento de bug DEBE seguir esta estructura:

### 2.1. Secciones obligatorias (en orden)

1. **Título** (`# Bug: [Nombre]` o `# TICKET-XX: [Nombre]`)
2. **Descripción del problema**
   - Síntomas
   - Ejemplo del problema
3. **Causa raíz**
4. **Soluciones implementadas**
5. **Verificación**
6. **Notas importantes**
7. **Archivos relacionados**
8. **Commits relacionados**

### 2.2. Secciones opcionales

- **Estado** - Estado actual del bug (Abierto, Arreglado, No se corrige, etc.)
- **Fecha** - Cuándo se descubrió/arregló
- **Prioridad** - Prioridad del bug (Crítica, Alta, Media, Baja)
- **Impacto** - Quién/qué se ve afectado
- **Workarounds** - Soluciones temporales antes del fix

### 3. Guías por sección

### 3.1. Título

```markdown
# Bug: [Nombre descriptivo]
# TICKET-XX: [Nombre descriptivo]
```

**Reglas**:
- Usar ID del ticket (TICKET-XX) cuando esté disponible
- Usar un nombre descriptivo que identifique claramente el problema
- Ser específico y técnico

**Ejemplos**:
- ✅ `# Bug: El bloque no aparece en el inserter de WordPress`
- ✅ `# TICKET-01: Hook no dispara en el momento correcto`
- ❌ `# Bug: Problema de bloque` (demasiado vago)
- ❌ `# TICKET-01` (falta descripción)

### 3.2. Descripción del problema

**Propósito**: Explicar claramente QUÉ es el bug y su impacto.

**Debe incluir**:
- Descripción clara del comportamiento incorrecto
- Qué funcionalidad se ve afectada
- Impacto en usuarios o sistema
- Cuándo/dónde ocurre el bug

**Estructura**:
```markdown
## Problem Description

[Resumen breve de 1-2 frases]

[Descripción detallada, incluyendo contexto]

### Symptoms

- [Síntoma 1]: [Qué se observa]
- [Síntoma 2]: [Qué se observa]
- [Síntoma 3]: [Qué se observa]

### Problem Example

```[language]
[Código, error o comportamiento que demuestra el bug]
```
```

**Ejemplo**:
```markdown
## Problem Description

Custom block does not appear in WordPress block inserter after registration.

The block was registered in `Blocks.php` using `register_block_type()`, but it does not appear in the block inserter when editing a page or post.

### Symptoms

- Block registration code executes without errors ✅
- No PHP errors in WordPress debug log ✅
- Block does not appear in block inserter ❌
- Block name is correct: `prisa-media/hero-block` ✅

### Problem Example

```php
// Block registration code
register_block_type( 'prisa-media/hero-block', [
    'render_callback' => [ $this, 'renderHeroBlock' ],
] );
```

**Expected**: Block appears in inserter
**Actual**: Block does not appear
```

### 3.3. Causa raíz

**Propósito**: Explicar POR QUÉ ocurre el bug.

**Debe incluir**:
- Explicación técnica de la causa raíz
- Múltiples causas si aplica
- Por qué la implementación actual es incorrecta
- Factores contribuyentes

**Estructura**:
```markdown
## Root Cause

[Explicación general de por qué ocurre el bug]

### Analysis

1. **Causa 1**: [Explicación técnica]
2. **Causa 2**: [Explicación técnica]
3. **Causa 3**: [Explicación técnica]
```

**Ejemplo**:
```markdown
## Root Cause

The block was not appearing because the registration hook was firing too early, before WordPress block editor was ready.

### Analysis

1. **Hook timing**: Block was registered in `after_setup_theme` hook, but block editor requires `init` hook
2. **Missing block.json**: Block metadata file was not found by WordPress
3. **Incorrect namespace**: Block name format was incorrect for WordPress block API
```

### 3.4. Soluciones implementadas

**Propósito**: Documentar CÓMO se arregló el bug.

**Debe incluir**:
- Todos los archivos modificados
- Cambios de código con ejemplos
- Explicación paso a paso del fix
- Workarounds o soluciones temporales (si aplica)

**Estructura**:
```markdown
## Implemented Solutions

### 1. [Nombre de la solución]

**File**: `path/to/file.php`

[Descripción de lo que cambió y por qué]

```php
// Before (incorrect)
[código antiguo]

// After (correct)
[código nuevo]
```

### 2. [Nombre de la solución]

**File**: `path/to/file.php`

[Descripción]
```

**Ejemplo**:
```markdown
## Implemented Solutions

### 1. Change Hook Priority

**File**: `theme/src/Blocks.php`

Changed block registration hook from `after_setup_theme` to `init` with proper priority:

```php
// Before (incorrect)
public function register(): void {
    add_action( 'after_setup_theme', [ $this, 'registerBlocks' ] );
}

// After (correct)
public function register(): void {
    add_action( 'init', [ $this, 'registerBlocks' ], 10 );
}
```

### 2. Create block.json File

**File**: `theme/blocks/hero-block/block.json`

Created block.json metadata file required by WordPress:

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "prisa-media/hero-block",
  "title": "Hero Block"
}
```
```

### 3.5. Verificación

**Propósito**: Proveer pasos para verificar que el fix funciona.

**Debe incluir**:
- Pasos para reproducir la verificación
- Resultados esperados
- Cómo confirmar que el bug está resuelto

**Estructura**:
```markdown
## Verification

### Verify [Aspecto específico]

[Pasos de verificación]

**Expected result:**
[Salida o comportamiento esperado]

### Verify [Otro aspecto]

[Pasos de verificación]
```

**Ejemplo**:
```markdown
## Verification

### Verify Block Appears in Inserter

1. Go to WordPress admin
2. Edit a page or post
3. Click "+" to open block inserter
4. Search for "Hero Block"

**Expected result:**
- Block appears in inserter under "Text" category
- Block can be added to page
- No PHP errors in WordPress debug log

### Verify Block Renders on Frontend

1. Add block to a page
2. Publish page
3. View page on frontend

**Expected result:**
- Block renders correctly
- No PHP errors in WordPress debug log
- Block styles load correctly
```

### 3.6. Notas importantes

**Propósito**: Documentar consideraciones importantes, limitaciones o info relacionada.

**Debe incluir**:
- Advertencias importantes sobre el fix
- Limitaciones conocidas
- Issues relacionados o dependencias
- Consideraciones futuras

**Formato**:
```markdown
## Important Notes

1. **[Nota 1]**: [Descripción]
2. **[Nota 2]**: [Descripción]
3. **[Nota 3]**: [Descripción]
```

### 3.7. Archivos relacionados

**Propósito**: Listar todos los archivos involucrados en el fix.

**Formato**:
```markdown
## Related Files

- `theme/src/Blocks.php` - [Qué se cambió]
- `theme/blocks/hero-block/block.json` - [Qué se añadió/actualizó]
- `theme/src/Assets.php` - [Qué se cambió]
```

### 3.8. Commits relacionados

**Propósito**: Registrar los commits que arreglaron el bug.

**Formato**:
```markdown
## Related Commits

- `fix: change block registration hook to init`
- `fix: add missing block.json metadata file`
- `feat: update block registration pattern`
```

### 4. Guías de estilo de escritura

### 4.1. Idioma y tono

- **Idioma**: Inglés para todo el contenido y código
- **Tono**: Profesional, técnico, preciso
- **Voz**: Preferir voz activa
- **Tiempo verbal**: Pasado para lo ocurrido, presente para el estado actual

### 4.2. Reglas de formato

**Formato Markdown**:
- Usar `#` para título principal, `##` para secciones, `###` para subsecciones
- Usar **negrita** para resaltar términos clave
- Usar formato `code` para:
  - Rutas de archivo: `theme/src/Blocks.php`
  - Funciones WordPress: `register_block_type()`
  - Campos de base de datos: `post_meta_key`
  - Nombres de clase/método: `Blocks::registerBlocks()`
  - Nombres de variables: `$block_attributes`
- Usar emojis en cabeceras (📋, 🔍, ✅, 🧪, 📝, 🔗, 🐛) - opcional

**Bloques de código**:
- Siempre indicar lenguaje: ` ```php`, ` ```bash`, ` ```json`
- Incluir comentarios en ejemplos si aportan valor
- Mostrar antes/después al demostrar fixes
- Usar comentarios `// Before (incorrect)` y `// After (correct)`

**Listas**:
- Usar `-` para listas sin orden
- Usar `1.`, `2.`, etc. para listas ordenadas
- Usar `- [ ]` para checklists (si aplica)

### 4.3. Convenciones de nombres

**Archivos y rutas**:
- Usar rutas completas: `theme/src/Blocks.php`
- **IMPORTANTE**: Usar kebab-case con **solo minúsculas** para archivos de bug: `ticket-47-block-not-appearing.md`
  - ✅ Correcto: `ticket-47-block-not-appearing.md`
  - ❌ Incorrecto: `TICKET-47-block-not-appearing.md` (contiene mayúsculas)
  - **Nota**: Ver `documentation-standards.md` sección "File Naming Conventions" para la regla completa.

**Funciones WordPress**:
- Usar convenciones WordPress: `snake_case()` para funciones WordPress
- Usar nombres descriptivos: `register_hero_block()`, `enqueue_block_assets()`

**Base de datos**:
- Usar `snake_case` para tablas y columnas
- Usar nombres descriptivos para claves foráneas: `post_id`, `user_id`

**Clases y métodos**:
- Usar `PascalCase` para clases: `Blocks`, `Assets`, `Setup`
- Usar `camelCase` para métodos custom: `registerHeroBlock()`, `enqueueAssets()`

### 5. Errores comunes a evitar

### 5.1. Errores de contenido

❌ **Descripción de problema vaga**:
```markdown
## Problem Description

The block doesn't work.
```

✅ **Descripción específica**:
```markdown
## Problem Description

Custom block does not appear in WordPress block inserter after registration. The block was registered in `Blocks.php` using `register_block_type()`, but it does not appear in the block inserter when editing a page or post.

### Symptoms

- Block registration code executes without errors ✅
- No PHP errors in WordPress debug log ✅
- Block does not appear in block inserter ❌
```

❌ **Falta análisis de causa raíz**:
```markdown
## Root Cause

The code was wrong.
```

✅ **Análisis detallado**:
```markdown
## Root Cause

The block was not appearing because the registration hook was firing too early, before WordPress block editor was ready.

### Analysis

1. **Hook timing**: Block was registered in `after_setup_theme` hook, but block editor requires `init` hook
2. **Missing block.json**: Block metadata file was not found by WordPress
```

### 5.2. Errores de formato

❌ **Código sin lenguaje**:
```markdown
```
register_block_type();
```
```

✅ **Código con lenguaje**:
```markdown
```php
register_block_type( 'prisa-media/hero-block', [ ... ] );
```
```

❌ **Falta comparación antes/después**:
```markdown
## Solutions

Arreglé el hook.
```

✅ **Comparación completa**:
```markdown
## Solutions

### 1. Change Hook Priority

**File**: `theme/src/Blocks.php`

```php
// Before (incorrect)
add_action( 'after_setup_theme', [ $this, 'registerBlocks' ] );

// After (correct)
add_action( 'init', [ $this, 'registerBlocks' ], 10 );
```
```

### 5.3. Errores estructurales

❌ **Faltan secciones críticas**:
```markdown
# Bug: Block doesn't work

Arreglado.
```

✅ **Estructura completa**:
```markdown
# TICKET-47: Block not appearing in inserter

## Problem Description
[Clear description]

## Root Cause
[Technical analysis]

## Implemented Solutions
[Detailed fixes]

## Verification
[Test steps]

## Related Files
[File list]
```

### 6. Checklist de revisión

Antes de dar por completo un documento de bug, verificar:

### Compleción de contenido
- [ ] La descripción del problema explica claramente QUÉ es el bug
- [ ] La causa raíz explica POR QUÉ ocurre
- [ ] Las soluciones documentan CÓMO se arregló
- [ ] Los pasos de verificación confirman que funciona
- [ ] Todos los archivos relacionados listados

### Precisión técnica
- [ ] Todas las funciones WordPress están correctamente nombradas
- [ ] Todas las rutas de archivo siguen la estructura del proyecto
- [ ] Todos los ejemplos de código son válidos
- [ ] Referencias a código existente son correctas

### Calidad de formato
- [ ] Todo el markdown está bien formateado
- [ ] Todos los bloques de código tienen lenguaje
- [ ] Todas las secciones siguen la estructura estándar
- [ ] Comparaciones antes/después claras

### Claridad y usabilidad
- [ ] Un desarrollador puede entender el bug desde este documento
- [ ] Un desarrollador puede verificar el fix desde este documento
- [ ] Ejemplos realistas y útiles
- [ ] Términos técnicos usados consistentemente

### 7. Plantillas

### 7.1. Plantilla de bug fix

Usa esta plantilla al documentar un bug fix:

```markdown
# TICKET-XX: [Bug Name]

## Problem Description

[Brief summary]

[Detailed description]

### Symptoms

- [Symptom 1]
- [Symptom 2]

### Problem Example

```[language]
[Code or behavior demonstrating the bug]
```

---

## Root Cause

[Explanation of why the bug occurs]

### Analysis

1. **Cause 1**: [Technical explanation]
2. **Cause 2**: [Technical explanation]

---

## Implemented Solutions

### 1. [Solution Name]

**File**: `path/to/file.php`

[Description]

```php
// Before (incorrect)
[old code]

// After (correct)
[new code]
```

---

## Verification

### Verify [Aspect 1]

[Steps]

**Expected result:**
[Expected output]

---

## Important Notes

1. **[Note]**: [Description]

---

## Related Files

- `path/to/file.php` - [What was changed]

---

## Related Commits

- `fix: [commit message]`
```

### 8. Mejora continua

Esta guía es un documento vivo. Cuando identifiques patrones o problemas en documentación de bugs:

1. Documentar el problema
2. Proponer una actualización a esta guía
3. Actualizar documentos de bug existentes para ajustarlos a los nuevos estándares cuando sea viable
4. Incluir el aprendizaje en futuras revisiones de bugs

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
