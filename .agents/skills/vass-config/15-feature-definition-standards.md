---
title: Estándares de definición de features
alwaysApply: false
category: documentation
globs:
  - "docs/technical/features/**/*.md"
---
# Estándares de definición de features

## TL;DR

- **Fuente única de verdad** sobre qué hace la feature y por qué
- **Plano técnico** para la implementación
- **Herramienta de comunicación** entre stakeholders y desarrolladores
- **Documentación de referencia** para mantenimiento futuro
- **OBLIGATORIO**: Incluir enlace a la tarjeta de Trello inmediatamente después del título: `**Trello Card**: [Card ID - Card Name](Card URL)`

## Propósito

Definir estructura y criterios de calidad para especificaciones de features en WordPress.

## Cuando aplica

- alwaysApply: false
- category: documentation
- globs: "docs/technical/features/**/*.md"

## Reglas

### 1. Propósito

Este documento define la estructura, el contenido y los estándares de redacción para especificaciones funcionales de features en el proyecto WordPress. Una especificación bien escrita debe servir como:

- **Fuente única de verdad** sobre qué hace la feature y por qué
- **Plano técnico** para la implementación
- **Herramienta de comunicación** entre stakeholders y desarrolladores
- **Documentación de referencia** para mantenimiento futuro

### 2. Estructura del documento

Toda especificación de feature DEBE seguir esta estructura:

### 2.1. Secciones obligatorias (en orden)

1. **Título** (`# Feature: [Nombre]` o `# {número}: [Nombre]` o `# TICKET-XX: [Nombre]`)
   - **OBLIGATORIO**: Incluir enlace a la tarjeta de Trello inmediatamente después del título: `**Trello Card**: [Card ID - Card Name](Card URL)`
   - **Para tarjetas CHILD**: Incluir enlace al HITO padre: `**HITO padre**: [Parent Card ID - Parent Name](Parent Card URL)`
2. **Objetivo**
3. **Contexto del proyecto** - cuando la feature modifica funcionalidad existente
4. **Alcance**
   - Incluye
   - Excluye
5. **Requisitos funcionales**
6. **Modelo de datos y relaciones** (si aplica)
7. **Criterios de aceptación**
8. **Estrategia de pruebas**
9. **Registro de Actualizaciones** (Update Log) - registrar todos los cambios y añadidos

### 2.2. Secciones opcionales

- **Hooks y filters de WordPress** - cuando la feature usa hooks de WordPress
- **Desarrollo de bloques** - cuando se crean bloques custom
- **Configuración del theme** - cuando se modifica theme.json o la estructura del theme
- **Requisitos no funcionales** - rendimiento, seguridad, etc.
- **Consideraciones técnicas** - notas de implementación, patrones a seguir
- **Contenido Específico** - cuando se extrae contenido de imágenes de diseño
- **Consideraciones finales** - resumen y siguientes pasos

### 2.3. Extracción de contenido desde imágenes de diseño

Cuando se proporcionan imágenes de diseño, extrae TODO el contenido visible y añádelo a la documentación:

1. **Añade sección "Contenido Específico"** con:
   - Elementos de header/navegación
   - Secciones hero (títulos, subtítulos, fondos, elementos gráficos)
   - Secciones de contenido (texto, estadísticas, listas, descripciones)
   - Elementos visuales (imágenes, logos, iconos)
   - Elementos interactivos (botones, enlaces, CTAs)
   - Información de footer

2. **Actualiza "Requisitos funcionales"** con la estructura específica de las imágenes

3. **Actualiza "Registro de Actualizaciones"** con una entrada de cambios

4. **Actualiza la descripción de la tarjeta de Trello** con el contenido completo del markdown

5. **Añade comentario en la tarjeta de Trello** en español con el seguimiento de la actualización

Ver `hito-and-child-cards-standards.md` para el proceso de extracción de contenido en detalle.

### 3. Guías por sección

### 3.1. Título

```markdown
# {número}: [Nombre descriptivo]
# TICKET-XX: [Nombre descriptivo]
# Feature: [Nombre descriptivo]
```

**Reglas**:
- Usar número de tarjeta Trello o ID de ticket cuando esté disponible
- Usar verbo en imperativo o infinitivo en español para features/mejoras/bugs ("Añadir bloque personalizado", "Actualizar configuración del tema")
- Ser específico y descriptivo
- **OBLIGATORIO**: Incluir enlace a la tarjeta Trello inmediatamente después del título

**Ejemplos**:
- ✅ `# 47: Home` con `**Trello Card**: [kv1ppuYl - Home](https://trello.com/c/kv1ppuYl/47-home)`
- ✅ `# 46: Sistema de tracking de páginas del proyecto` con enlace Trello
- ✅ `# TICKET-13: Add custom hero block` (para documentación en inglés)
- ✅ `# Feature: Update theme setup with new hooks` (para documentación en inglés)
- ❌ `# TICKET-15` (falta descripción)
- ❌ `# Blocks` (demasiado vago)
- ❌ Falta enlace a Trello (obligatorio para features con Trello)

**Para tarjetas CHILD, incluir también**:
```markdown
**HITO padre**: [ZNQ14Sb5 - Sistema de tracking de páginas del proyecto](https://trello.com/c/ZNQ14Sb5/46-sistema-de-tracking-de-p%C3%A1ginas-del-proyecto)
```

### 3.2. Objetivo

**Propósito**: Explicar QUÉ hace la feature y POR QUÉ existe en 2-4 párrafos.

**Debe incluir**:
- Descripción clara del propósito de la feature
- Valor de negocio o problema que resuelve
- Capacidades clave que aporta
- Hooks/filters de WordPress implicados (si aplica)

**Plantilla**:
```markdown
## Objective

[Resumen breve de 1-2 frases sobre qué hace la feature]

El sistema [acción principal], permitiendo:
- [Capacidad clave 1]
- [Capacidad clave 2]
- [Capacidad clave 3]

La implementación usará [hooks/filters/APIs de WordPress] y seguirá WordPress Coding Standards.
```

**Ejemplo**:
```markdown
## Objective

Add a custom hero block with parallax scrolling effect for homepage sections.

The system will provide a reusable block that:
- Displays hero content with background image
- Implements parallax scrolling effect
- Supports customizable text and button options
- Works seamlessly with WordPress block editor

The implementation will use WordPress block API, register hooks in `after_setup_theme`, and follow WordPress coding standards.
```

### 3.3. Contexto del proyecto

**Propósito**: Explicar cómo encaja esta feature en el codebase existente.

**Incluir cuando**:
- La feature modifica o extiende funcionalidad existente
- La feature sigue patrones de código existentes
- Entender el código existente es crucial para implementar

**Debe incluir**:
- **Estado actual**: Qué existe ahora
- **Componentes similares existentes**: Lista de bloques, clases, hooks relacionados
- **Patrón de implementación**: Describir el patrón arquitectónico a seguir
- **Relación con la estructura actual**: Cómo se conecta con el theme/plugins actuales

**Ejemplo**:
```markdown
## Project Context

### Current State

- **Theme structure**: Currently exists `Setup`, `Assets`, and `Blocks` classes in `theme/src/`
- **Existing blocks**: Theme has basic blocks registered in `Blocks.php`
- **Similar existing components**:
  - `Blocks.php` - Block registration class
  - `Assets.php` - Asset enqueuing class
  - `theme/patterns/hero-parallax.php` - Existing pattern

### Implementation Pattern

The project follows a consistent pattern:
- Theme classes in `theme/src/`
- Block registration in `Blocks.php`
- Block patterns in `theme/patterns/`
- Assets enqueued via `Assets.php`

### Relationship to Current Structure

This feature will:
- Add new block registration in `Blocks.php`
- Create block.json metadata file
- Add render callback following existing patterns
```

### 3.4. Alcance

**Propósito**: Definir límites claros de lo que SÍ y NO incluye la feature.

**Estructura**:
```markdown
## Scope

### Includes

- [Item específico 1]
- [Item específico 2]
- [Item específico 3]

### Excludes (for now)

- [Elemento fuera de alcance 1] - [motivo o consideración futura]
- [Elemento fuera de alcance 2] - [motivo o consideración futura]
```

**Reglas**:
- Ser específico y concreto
- Usar bullets para claridad
- En "Excludes", añadir breve explicación del motivo o futuro
- Evitar lenguaje ambiguo

**Ejemplos**:
✅ Bien:
```markdown
### Includes

- Register custom block type in WordPress
- Create block.json metadata file
- Add render callback with parallax functionality
- Enqueue block-specific CSS and JavaScript
- Test in WordPress block editor and frontend

### Excludes (for now)

- Block editor sidebar controls - can be added in future enhancement
- Multiple parallax effects - single effect for MVP
- Admin settings page - not required for initial version
```

❌ Mal:
```markdown
### Includes

- Add block
- Make it work

### Excludes

- Other things
```

### 3.5. Requisitos funcionales

**Propósito**: Describir CÓMO funciona la feature desde la perspectiva del usuario/sistema.

**Estructura**:
- Usar subsecciones numeradas para distintas áreas funcionales
- Incluir uso de hooks/filters WordPress
- Describir comportamiento de cada componente
- Usar bloques de código para ejemplos

**Para hooks de WordPress, incluir**:
```markdown
### WordPress Hooks

The feature will use the following hooks:

**Action Hooks:**
- `after_setup_theme` - Register block type
- `wp_enqueue_scripts` - Enqueue block assets

**Filter Hooks:**
- `block_categories_all` - Add custom block category (if needed)
```

**Para bloques, usar formato paso a paso**:
```markdown
### Block Registration Flow

### Step 1 — Register Block Type

Register the block in WordPress using `register_block_type()`:

```php
register_block_type( 'prisa-media/hero-block', [
    'render_callback' => [ $this, 'renderHeroBlock' ],
    'attributes' => [
        'title' => [
            'type' => 'string',
            'default' => '',
        ],
    ],
] );
```

Logic:
1. Hook into `after_setup_theme`
2. Call `register_block_type()` with block name and configuration
3. Define block attributes

---

### Step 2 — Create Block Metadata

Create `block.json` file:

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "prisa-media/hero-block",
  "title": "Hero Block",
  "category": "text",
  "editorScript": "file:./index.js"
}
```

---

### Step 3 — Render Callback

Implement render callback:

```php
public function renderHeroBlock( array $attributes, string $content ): string {
    $title = esc_html( $attributes['title'] ?? '' );
    return sprintf( '<div class="hero-block">%s</div>', $title );
}
```
```

### 3.6. Modelo de datos y relaciones (si aplica)

**Propósito**: Definir estructura de base de datos y relaciones (si la feature implica cambios de BD).

**Debe incluir**:
- Tablas implicadas (existentes y nuevas)
- Todas las columnas con tipos y restricciones
- Relaciones entre entidades
- Meta keys de WordPress (si se usa post meta)
- Custom post types (si aplica)

**Formato usando tablas**:
```markdown
## Data Model and Relationships

### Database Changes (if applicable)

#### Custom Post Type: `[post_type_name]`

**Post Meta Keys:**

| Meta Key | Type | Description | Default |
|----------|------|-------------|---------|
| `_custom_field` | string | Custom field value | empty string |

**Taxonomies:**
- `custom_taxonomy` - Custom taxonomy for categorization

### WordPress Integration

- Uses WordPress post meta API: `get_post_meta()`, `update_post_meta()`
- Uses WordPress custom post type: `register_post_type()`
- Uses WordPress taxonomies: `register_taxonomy()`
```

### 3.7. Criterios de aceptación

**Propósito**: Definir condiciones que deben cumplirse para considerar la feature completa.

**Formato**:
```markdown
## Acceptance Criteria

### Functional

- [ ] CA-F1: [Functional acceptance criterion 1]
- [ ] CA-F2: [Functional acceptance criterion 2]
- [ ] CA-F3: [Functional acceptance criterion 3]

### Technical

- [ ] CA-T1: [Technical acceptance criterion 1]
- [ ] CA-T2: [Technical acceptance criterion 2]

### WordPress Integration

- [ ] CA-W1: Feature works correctly in WordPress admin
- [ ] CA-W2: Feature works correctly on frontend
- [ ] CA-W3: No PHP errors in WordPress debug log
- [ ] CA-W4: Hooks/filters fire at correct times
```

**Reglas**:
- Ser específico y testeable
- Usar formato "Given-When-Then" si ayuda
- Cubrir happy path, edge cases y escenarios de error
- Incluir criterios específicos de WordPress

**Ejemplos**:
✅ Bien:
```markdown
- [ ] CA-F1: Block appears in WordPress block inserter under "Text" category
- [ ] CA-F2: Block can be added to page and displays correctly on frontend
- [ ] CA-F3: Parallax effect works on scroll in all major browsers
- [ ] CA-T1: PHPCS passes with no warnings (WordPress Coding Standards)
- [ ] CA-T2: No PHP errors in WordPress debug log
- [ ] CA-W1: Block attributes save correctly in WordPress editor
```

❌ Mal:
```markdown
- [ ] Block works
- [ ] No errors
```

### 3.8. Estrategia de pruebas

**Propósito**: Definir cómo se verificará la feature.

**Estructura**:
```markdown
## Testing Strategy

### Automated Tests (if test infrastructure exists)

**File**: `tests/Unit/Blocks/[BlockName]Test.php`

- [ ] UT-1: [Unit test 1 description]
- [ ] UT-2: [Unit test 2 description]

**File**: `tests/Feature/Blocks/[BlockName]Test.php`

- [ ] FT-1: [Feature test 1 description]
- [ ] FT-2: [Feature test 2 description]

### Manual WordPress Testing

- [ ] MT-1: Block appears in block inserter
- [ ] MT-2: Block can be added to page
- [ ] MT-3: Block renders correctly on frontend
- [ ] MT-4: Block attributes work correctly
- [ ] MT-5: No PHP errors in WordPress debug log
- [ ] MT-6: No JavaScript console errors
- [ ] MT-7: Responsive design works correctly
- [ ] MT-8: Cross-browser testing completed
```

**Reglas**:
- Organizar por tipo de test (Unit, Feature, Manual)
- Especificar rutas de archivos para tests automatizados (si existen)
- Usar IDs descriptivos para tests
- Cubrir happy path, edge cases y escenarios de error
- Incluir siempre checklist de pruebas manuales en WordPress

### 4. Guías de estilo de escritura

### 4.1. Idioma y tono

- **Idioma**:
  - **CRÍTICO**: La documentación de features/mejoras/bugs debe estar en **español**
  - Inglés para ejemplos de código, rutas de archivos y términos técnicos
  - Ver `language-standards.md` para reglas completas
- **Tono**: Profesional, técnico, preciso
- **Voz**: Preferir voz activa
- **Tiempo verbal**: Presente para estado actual, futuro/imperativo para requisitos

### 4.2. Reglas de formato

**Formato Markdown**:
- Usar `#` para título principal, `##` para secciones, `###` para subsecciones
- Usar **negrita** para resaltar términos clave
- Usar formato `code` para:
  - Rutas de archivo: `theme/src/Blocks.php`
  - Funciones WordPress: `register_block_type()`
  - Campos de base de datos: `post_meta_key`
  - Nombres de clase/método: `Blocks::registerHeroBlock()`
  - Nombres de variables: `$block_attributes`
- Usar `---` (regla horizontal) para separar pasos principales

**Bloques de código**:
- Siempre indicar lenguaje: ` ```php`, ` ```bash`, ` ```json`
- Incluir comentarios cuando aporte valor
- Mostrar ejemplos realistas, no placeholders

**Listas**:
- Usar `-` para listas sin orden
- Usar `1.`, `2.`, etc. para listas ordenadas
- Usar `- [ ]` para checklists/criterios de aceptación
- Indentar sub-items con 2 espacios

**Tablas**:
- Incluir siempre cabecera
- Usar `|` como separador
- Alinear columnas para legibilidad en el source
- Incluir columna de descripción cuando proceda

### 4.3. Convenciones de nombres

**Archivos y rutas**:
- Usar rutas completas: `theme/src/Blocks.php`
- **IMPORTANTE**: Usar kebab-case con **solo minúsculas** para archivos de feature: `ticket-13-add-custom-block.md`
  - ✅ Correcto: `ticket-13-add-custom-block.md`
  - ❌ Incorrecto: `TICKET-13-add-custom-block.md` (contiene mayúsculas)
  - **Nota**: Ver `documentation-standards.md` sección "File Naming Conventions" para la regla completa.

**Funciones WordPress**:
- Usar convenciones WordPress: `snake_case()` para funciones WordPress
- Usar nombres descriptivos: `register_hero_block()`, `enqueue_block_assets()`

**Base de datos**:
- Usar `snake_case` para tablas y columnas
- Usar nombres descriptivos para claves foráneas: `post_id`, `user_id`
- Documentar campos nullable explícitamente

**Clases y métodos**:
- Usar `PascalCase` para clases: `Blocks`, `Assets`, `Setup`
- Usar `camelCase` para métodos custom: `registerHeroBlock()`, `enqueueAssets()`
- Usar nombres descriptivos terminados en propósito: `*Block`, `*Asset`, `*Setup`

### 4.4. URLs y referencias externas

**Incluir siempre**:
- URLs completas para fuentes externas
- Enlaces a documentación relacionada
- Referencias a código/patrones existentes

**Formato**:
```markdown
- **Source URL**: `https://example.com/api/endpoint`
- **Related feature**: See [TICKET-12](./ticket-12-feature-name.md)
- **Similar implementation**: Based on `Blocks::registerBlock()` method
- **WordPress documentation**: [Block API](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
```

### 5. Errores comunes a evitar

### 5.1. Errores de contenido

❌ **Requisitos vagos**:
```markdown
- Add block
- Make it work
```

✅ **Requisitos específicos**:
```markdown
- Register custom block type `prisa-media/hero-block` in WordPress
- Create block.json metadata file in `theme/blocks/hero-block/`
- Implement render callback in `Blocks::renderHeroBlock()`
- Enqueue block-specific CSS and JavaScript via `Assets::enqueueBlockAssets()`
```

❌ **Faltan casos límite**:
```markdown
### Behavior
- The block displays content
```

✅ **Descripción completa de comportamiento**:
```markdown
### Behavior
- **Block registration**: Registers on `after_setup_theme` hook
- **Block attributes**: Supports title (string), image (object), button (object)
- **Default values**: Title defaults to empty string, image to null
- **Error handling**: Validates attributes before rendering, logs errors to WordPress debug log
- **Idempotency**: Registering multiple times doesn't create duplicates (WordPress handles this)
```

❌ **Integración WordPress incompleta**:
```markdown
Block:
- name
- title
```

✅ **Integración WordPress completa**:
```markdown
#### Block Configuration

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `name` | string | Block namespace and name | `prisa-media/hero-block` |
| `title` | string | Block title in inserter | `Hero Block` |
| `category` | string | Block category | `text` |
| `attributes.title` | string | Hero title | `''` |
| `attributes.image` | object | Hero background image | `null` |

**WordPress Hooks:**
- `after_setup_theme` - Block registration
- `wp_enqueue_scripts` - Asset enqueuing
- `render_block_prisa-media/hero-block` - Custom render filter (if needed)
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

❌ **Tabla mal formateada**:
```markdown
| Property | Type |
| name | string |
```

✅ **Tabla correcta**:
```markdown
| Property | Type |
|----------|------|
| name | string |
```

### 5.3. Errores estructurales

❌ **Faltan secciones críticas**:
```markdown
# Feature: Add block

## Description
Add a hero block.
```

✅ **Estructura completa**:
```markdown
# TICKET-13: Add custom hero block

## Objective
[Clear objective]

## Project Context
[How it fits existing code]

## Scope
### Includes
### Excludes

## Functional Requirements
[Detailed requirements]

## Acceptance Criteria
[Testable criteria]

## Testing Strategy
[Test strategy]
```

### 6. Checklist de revisión

Antes de dar por completa una especificación de feature, verifica:

### Compleción de contenido
- [ ] El objetivo indica claramente QUÉ y POR QUÉ
- [ ] El alcance tiene secciones "Includes" y "Excludes"
- [ ] Todos los requisitos funcionales están detallados con ejemplos
- [ ] Hooks/filters de WordPress documentados (si aplica)
- [ ] Criterios de aceptación específicos y testeables
- [ ] Estrategia de pruebas incluye testing manual en WordPress

### Precisión técnica
- [ ] Todas las funciones WordPress están correctamente nombradas
- [ ] Todas las rutas de archivo siguen la estructura del proyecto
- [ ] Todos los ejemplos de código son válidos
- [ ] Referencias a código existente son correctas
- [ ] Se mencionan WordPress Coding Standards

### Calidad de formato
- [ ] Todo el markdown está bien formateado
- [ ] Todos los bloques de código tienen lenguaje
- [ ] Todas las tablas están bien formateadas
- [ ] Todas las listas usan formato consistente
- [ ] Todas las secciones siguen la estructura estándar
- [ ] No hay enlaces rotos

### Claridad y usabilidad
- [ ] Un desarrollador puede implementar la feature solo con esta especificación
- [ ] Casos límite y escenarios de error cubiertos
- [ ] Ejemplos realistas y útiles
- [ ] Términos técnicos usados consistentemente
- [ ] El documento fluye de forma lógica

### 7. Plantillas

### 7.1. Plantilla para nueva feature

Usa esta plantilla al crear una feature desde cero:

```markdown
# TICKET-XX: [Feature Name]

## Objective

[2-4 paragraphs explaining what the feature does and why]

---

## Project Context

### Current State

[What exists now in the codebase]

### Relationship to Current Structure

[How this feature connects to existing components]

---

## Scope

### Includes

- [Item 1]
- [Item 2]
- [Item 3]

### Excludes (for now)

- [Out of scope item 1] - [reason]
- [Out of scope item 2] - [reason]

---

## Functional Requirements

### [Requirement Group 1]

[Details]

### [Requirement Group 2]

[Details]

---

## Acceptance Criteria

### Functional

- [ ] CA-F1: [Criterion]

### Technical

- [ ] CA-T1: [Criterion]

### WordPress Integration

- [ ] CA-W1: [Criterion]

---

## Testing Strategy

### Manual WordPress Testing

- [ ] MT-1: [Test description]

---

## Final Considerations

[Summary and next steps]
```

### 7.2. Plantilla para mejora de feature

Usa esta plantilla al mejorar una feature existente:

```markdown
# TICKET-XX: [Enhancement Name]

## Objective

[What is being enhanced and why]

---

## Project Context

### Current Functionality

[Description of current feature]

### Identified Limitations

[What needs to be improved]

---

## Proposed Changes

### Includes

- [Change 1]
- [Change 2]

### Excludes (for now)

- [Out of scope change]

---

## Impact on Current Structure

### Files That Need Updates

[WordPress files that need changes]

### Hooks/Filters Affected

[WordPress hooks/filters that need updates]

---

## Acceptance Criteria

- [ ] CA-1: [Criterion]

---

## Testing Strategy

### Existing Tests to Update (if test infrastructure exists)

- [ ] [Test file]: [What needs to change]

### New Manual Tests

- [ ] [New test description]
```

### 8. Descomponer features grandes

Cuando una feature supera los límites de tamaño de PR (>15 archivos, >500 líneas, múltiples componentes), dividirla en sub-issues con dependencias claras. Cada sub-issue debe ser independiente, entregable y mergeable directamente a `main`.

### 9. Mejora continua

Esta guía es un documento vivo. Cuando identifiques patrones o problemas en especificaciones de features:

1. Documentar el problema en el análisis previo a la implementación
2. Proponer una actualización a esta guía
3. Actualizar features existentes para ajustarse a los nuevos estándares cuando sea viable
4. Incluir el aprendizaje en futuras revisiones de features

---

**Última actualización:** 2026-01-16  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
