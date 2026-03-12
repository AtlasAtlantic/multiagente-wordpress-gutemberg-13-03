---
title: Estándares de desarrollo de bloques WordPress (Fusionado + ampliado)
status: active
last_updated: 2026-02-24
owner: Equipo Front / WordPress
scope:
  - theme/blocks/**/*
  - theme/patterns/**/*.php
  - theme/templates/**/*.html
  - theme/parts/**/*.html
  - plugins/**/blocks/**/*
---

# Estándares de desarrollo de bloques WordPress (Fusionado + ampliado)

## TL;DR

- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- Block metadata (block.json): https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
- Registro de bloques: https://developer.wordpress.org/block-editor/getting-started/fundamentals/registration-of-a-block/
- Paquetes (data/core-data): https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/ • https://developer.wordpress.org/block-editor/reference-guides/packages/packages-core-data/
- Interactivity API: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/



## Propósito

Este documento define estándares y buenas prácticas para desarrollar bloques WordPress: **block.json**, registro en PHP, componentes React del editor, estilos, patterns, templates, y **arquitectura moderna** (SSR vs estático, data layer oficial, seguridad, rendimiento, accesibilidad e interactividad en frontend).

## Cuando aplica

- n/a


## Reglas

**Fuentes oficiales (source of truth):**
- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- Block metadata (block.json): https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
- Registro de bloques: https://developer.wordpress.org/block-editor/getting-started/fundamentals/registration-of-a-block/
- Paquetes (data/core-data): https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/ • https://developer.wordpress.org/block-editor/reference-guides/packages/packages-core-data/
- Interactivity API: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
- Global styles / theme.json: https://developer.wordpress.org/themes/global-settings-and-styles/
- Ejemplos: https://github.com/WordPress/block-development-examples

---

## 0. Compatibilidad y mínimos (obligatorio)

- **WordPress mínimo soportado:** definir por proyecto (recomendado **6.3+** si se adopta `apiVersion: 3`).
- **PHP mínimo:** `8.0+` (recomendado `8.1+`).
- **Gutenberg plugin:** no obligatorio; el estándar debe funcionar con WP Core.

### Block API (`apiVersion`)
- **Por defecto:** `apiVersion: 3` si el mínimo de WordPress lo permite.
- Si el proyecto soporta WP anterior al mínimo requerido por API v3, documentar **una** de estas opciones:
    1) bajar a `apiVersion: 2`, o
    2) elevar el mínimo de WordPress (preferible si el producto lo permite).

> Regla: **no asumir compatibilidad**. Si se sube `apiVersion`, se actualiza el mínimo de WP y se refleja en la documentación del repositorio.

---

## 1. Principios básicos (no negociables)

- Usar la **Block API de WordPress** (no reinventar frameworks internos).
- Seguir WordPress Coding Standards (WPCS) para PHP y convenciones de `@wordpress/scripts` para JS.
- Priorizar: **accesibilidad**, **rendimiento**, **mantenibilidad**, **compatibilidad con Core**.
- Editor ≠ Frontend: separar `editorScript`, `viewScript` y render SSR (PHP) cuando aplique.
- **REST/Data stores primero:** Gutenberg es cliente REST. Evitar "hacks" que eludan stores oficiales.
- Evitar bundles monolíticos: **carga condicional** y dependencias mínimas.

---

## 2. Estructura de bloques

### 2.1 Estructura de directorios (base)

**Estructura estándar de bloque (fuente):**
```
theme/blocks/
├── block-name/
│   ├── block.json          # Metadatos del bloque (OBLIGATORIO)
│   ├── index.js            # Registro del bloque (script editor)
│   ├── edit.js             # Componente editor (React)
│   ├── save.js             # Función save (render frontend si es estático)
│   ├── style.scss          # Estilos editor + frontend
│   ├── editor.scss         # Estilos solo editor
│   ├── view.js             # JS frontend (si aplica)
│   └── render.php          # Render server-side (si aplica, recomendado para bloques dinámicos)
```

**Patterns:**
```
theme/patterns/
└── pattern-name.php
```

**Templates:**
```
theme/templates/
└── template-name.html
```

### 2.2 Convención `src/` vs `build/` (si hay build) (obligatorio)

Si el proyecto compila assets (recomendado):
- `src/` contiene **fuente**
- `build/` contiene **artefactos** (JS/CSS finales y `block.json` listo)
- `register_block_type()` se hace **siempre desde `build/`**.

Ejemplo:
```
my-plugin/
  src/blocks/hero/...
  build/blocks/hero/block.json
  build/blocks/hero/index.js
  build/blocks/hero/style-index.css
```

> Regla: evitar registrar desde `src/` para no depender de rutas o builds incompletos.

---

## 3. Decisión arquitectónica: bloque estático vs dinámico (SSR) (obligatorio)

Antes de desarrollar, documentar la decisión (README del bloque o ADR corta).

### 3.1 Usar **SSR (dinámico)** cuando:
- Depende de **datos** (CPT, taxonomías, usuarios, settings, APIs externas).
- Afecta a **SEO** (contenido indexable que no debe depender de JS).
- Requiere HTML consistente (caché, listados, cambios globales).
- Hay lógica sensible (roles/capabilities).

### 3.2 Usar **estático** cuando:
- Es contenido editorial puro y estable.
- No requiere datos runtime ni personalización por usuario.

> Regla: si dudas y hay datos/SEO, **SSR por defecto**.

---

## 4. Configuración `block.json`

**OBLIGATORIO:** Cada bloque debe tener un `block.json`. Es la fuente única de verdad.

**Campos requeridos (mínimo):**
```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "namespace/block-name",
  "title": "Block Title",
  "category": "design",
  "icon": "star",
  "description": "Block description",
  "textdomain": "text-domain",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./editor.css",
  "style": "file:./style.css"
}
```

**Campos comunes:**
- `name`: `namespace/block-name` (kebab-case).
- `supports`: habilitar solo lo que el diseño permite.
- `attributes`: atributos **mínimos** (ver sección 6).
- `providesContext` / `usesContext`: usar para composición (evitar prop drilling en InnerBlocks).

### 4.1 `supports` (coherencia editorial)
- No habilitar `color/typography/spacing` si el bloque es "diseño cerrado".
- Desactivar HTML cuando no sea necesario:
```json
{ "supports": { "html": false } }
```
- `align` solo si el diseño lo contempla (`wide/full`).

### 4.2 Frontend JS: `viewScript` (uso correcto)
- Usar **solo** si el bloque necesita interactividad en cliente.
- Evitar cargar JS "por defecto".
- En bloques SSR, puede ser necesario **encolar condicionalmente** desde PHP según atributos/contexto.

> Regla: React en frontend **no** es baseline. Ver sección 9.

---

## 5. Registro de bloques

### 5.1 Registro en PHP (obligatorio)

Registrar bloques en `theme/src/Blocks.php` (o equivalente), usando `init`.

**Si el proyecto tiene build, registrar siempre desde `build/`, no desde `src/`.**

```php
<?php
declare(strict_types=1);

namespace Theme;

final class Blocks {
    public function register(): void {
        add_action( 'init', [ $this, 'registerBlocks' ], 10 );
    }

    public function registerBlocks(): void {
        // Registrar desde build/ si hay proceso de compilación
        register_block_type( get_template_directory() . '/build/blocks/block-name' );

        // Si no hay build (fuente directa sin compilar):
        // register_block_type( get_template_directory() . '/blocks/block-name' );
    }
}
```

**Reglas:**
- Usar hook `init` (no `after_setup_theme`).
- Usar `register_block_type()` con ruta al directorio que contiene `block.json`.
- Si hay build, registrar **siempre** desde `build/`.

### 5.2 Render server-side (SSR)

```php
register_block_type(
    get_template_directory() . '/build/blocks/block-name',
    [
        'render_callback' => [ $this, 'renderBlock' ],
    ]
);

public function renderBlock( array $attributes, string $content, \WP_Block $block = null ): string {
    $title = esc_html( $attributes['title'] ?? '' );

    // Enqueue condicional si hay interactividad (y el asset está registrado).
    if ( ! empty( $attributes['hasInteraction'] ) ) {
        wp_enqueue_script( 'namespace-block-name-view' );
    }

    return sprintf( '<div class="block-name"><h2>%s</h2>%s</div>', $title, $content );
}
```

**Reglas SSR:**
- Escapar/sanitizar según el tipo (ver sección 10).
- `$content` contiene el HTML renderizado de `InnerBlocks` ya procesado por WordPress. **No aplicar `wp_kses_post()` sobre `$content`**: el pipeline de bloques ya lo ha gestionado. Sí escapar atributos propios del bloque padre.
- No mezclar lógica del editor en el render.

---

## 6. Atributos: serialización, tamaño y compatibilidad (obligatorio)

### 6.1 Reglas de oro
- **No** guardar objetos grandes en `attributes` (ej.: respuestas REST completas).
- Guardar **IDs** o valores mínimos (ej.: `postId`, `termId`, `url`).
- Si el dato viene de WordPress, preferir `core-data` (no duplicar).
- Defaults siempre definidos (cuando aplique).

### 6.2 Migraciones
Si se modifica un atributo **o la función `save`**:
- Añadir una entrada en el array `deprecated` de `registerBlockType`. **Esto es obligatorio si `save` cambia**: sin `deprecated`, todos los bloques existentes quedarán en estado de invalidación y el editor mostrará errores de validación.
- Mantener compatibilidad con contenido existente.
- Añadir fallbacks en `edit` y `render_callback`.

```js
// Ejemplo de deprecated para un cambio en save()
registerBlockType( 'namespace/block-name', {
    // ...definición actual...
    deprecated: [
        {
            attributes: { /* atributos de la versión anterior */ },
            save( { attributes } ) {
                // HTML que generaba la versión anterior
                return <div>{ attributes.title }</div>;
            },
        },
    ],
} );
```

> Regla: cada cambio en `save` → nueva entrada en `deprecated`. Sin excepción.

---

## 7. Componentes React (editor)

### 7.1 Componente editor (`edit.js`)

```jsx
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
    const blockProps = useBlockProps();

    return (
        <div { ...blockProps }>
            {/* UI editor */}
            <p>{ __( 'Settings', 'text-domain' ) }</p>
        </div>
    );
}
```

**Reglas:**
- Usar siempre `useBlockProps()` para el wrapper.
- Usar componentes de `@wordpress/components` y `@wordpress/block-editor`.
- UI accesible (labels, ayudas, botones reales).
- No hacer manipulación DOM directa en editor.

### 7.2 InspectorControls (ejemplo)
```jsx
import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
    const { title, subtitle } = attributes;
    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Settings', 'text-domain' ) }>
                    <TextControl
                        label={ __( 'Subtitle', 'text-domain' ) }
                        value={ subtitle }
                        onChange={ ( value ) => setAttributes( { subtitle: value } ) }
                    />
                </PanelBody>
            </InspectorControls>

            <div { ...blockProps }>
                <RichText
                    tagName="h2"
                    value={ title }
                    onChange={ ( value ) => setAttributes( { title: value } ) }
                    placeholder={ __( 'Enter title...', 'text-domain' ) }
                />
            </div>
        </>
    );
}
```

### 7.3 Función `save` (`save.js`) — bloques estáticos

```jsx
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
    const { title, subtitle } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div { ...blockProps }>
            <RichText.Content tagName="h2" value={ title } />
            { subtitle && <p>{ subtitle }</p> }
        </div>
    );
}
```

**Reglas:**
- `save` devuelve HTML estático.
- No usar hooks ni lógica compleja en `save`.
- Para SSR, `save` suele ser `null`/mínimo y el render lo hace PHP.
- Cualquier cambio en `save` obliga a crear una entrada en `deprecated` (ver sección 6.2).

---

## 8. Data layer oficial (obligatorio)

### 8.1 `@wordpress/data` + `@wordpress/core-data`
Para entidades de WP (posts, terms, users, media), usar stores oficiales.

Ejemplo:
```js
import { useSelect } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';

const post = useSelect(
  (select) => select(coreDataStore).getEntityRecord('postType', 'page', postId),
  [postId]
);
```

### 8.2 Rendimiento con `useSelect`
- Seleccionar **lo mínimo necesario**. Los selectores que devuelven objetos o arrays nuevos en cada llamada provocan re-renders continuos aunque los datos no hayan cambiado.
- Declarar correctamente las dependencias del segundo argumento.
- `core-data` deduplica requests automáticamente, por lo que N bloques iguales no generarán N llamadas REST. El riesgo real es otro: **referencia de objeto nueva en cada render**.

```js
// ❌ Antipatrón: devuelve array nuevo en cada render → re-render continuo
const posts = useSelect(
    (select) => select(coreDataStore).getEntityRecords('postType', 'post'),
    []
);

// ✅ Si solo necesitas el total, selecciona solo ese valor
const totalPosts = useSelect(
    (select) =>
        select(coreDataStore).getEntityRecords('postType', 'post')?.length ?? 0,
    []
);
```

### 8.3 Preloading REST (rendimiento en editor)
Si el bloque consume datos REST al cargar el editor, considera el preloading para evitar waterfalls de requests. WordPress ofrece el mecanismo `preloadedData` a través de `wp_add_inline_script` o `wp_localize_script` combinado con el middleware de preload del store:

```php
// Precargar la respuesta en el editor para evitar request adicional
add_action( 'enqueue_block_editor_assets', function () {
    $preload_paths = [ '/wp/v2/posts?per_page=10' ];
    $preload_data  = array_reduce(
        $preload_paths,
        'rest_preload_api_request',
        []
    );
    wp_add_inline_script(
        'wp-api-fetch',
        sprintf( 'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );', wp_json_encode( $preload_data ) ),
        'after'
    );
} );
```

### 8.4 REST custom (si aplica)
- Si hay endpoints propios: `register_rest_route`, `permission_callback`, sanitización y caching donde proceda.
- Evitar "fetch sin store" repetitivo: crear capa de datos y cache en el store si procede.

---

## 9. JavaScript e interactividad (frontend)

### 9.1 Baseline recomendado
Orden de preferencia:

1) **Interactivity API** (estado ligero, directivas, composición).
2) Vanilla JS acotado al bloque.
3) React en frontend **solo** con justificación (bundle, CWV, complejidad real).

### 9.2 JavaScript frontend (`view.js`) — vanilla acotado

```js
// view.js se carga después del parsing del documento.
// DOMContentLoaded puede ser redundante dependiendo de cuándo se encola el script.
// Verificar el atributo `defer` o `async` en el handle registrado.

const blocks = document.querySelectorAll('.wp-block-namespace-block-name');

blocks.forEach((block) => {
    // Evitar inicializaciones duplicadas
    if ( block.dataset.initialized ) return;
    block.dataset.initialized = 'true';

    // Inicializar interactividad específica del bloque
});
```

**Notas sobre `DOMContentLoaded`:**
- `view.js` se encola con `defer` por defecto en `block.json`. El DOM ya está disponible cuando se ejecuta; envolver en `DOMContentLoaded` es habitualmente redundante.
- En bloques con `apiVersion: 3`, el editor usa un iframe propio. `view.js` **no se ejecuta en el contexto del editor**, por lo que este punto solo aplica al frontend.
- Si el tema usa navegación AJAX o transiciones de página sin recarga completa, los listeners de `DOMContentLoaded` no se dispararán en las páginas subsiguientes. En ese caso, emplea un evento personalizado o inicializa mediante callback del sistema de navegación del tema.

**Reglas:**
- No listeners globales innecesarios.
- No `innerHTML` con contenido no confiable.
- Comprobar existencia y evitar inicializaciones duplicadas.

### 9.3 Interactivity API (recomendado para UI interactiva)
```js
import { store, getContext } from '@wordpress/interactivity';

store('namespace/block-name', {
    state: {
        isOpen: false,
    },
    actions: {
        toggle: () => {
            const context = getContext();
            context.isOpen = !context.isOpen;
        },
    },
});
```

HTML con directivas:
```html
<div
  data-wp-interactive="namespace/block-name"
  data-wp-context='{ "isOpen": false }'
>
  <button
    data-wp-on--click="actions.toggle"
    aria-expanded="false"
    data-wp-bind--aria-expanded="context.isOpen"
    aria-controls="block-content"
  >
    Toggle
  </button>
  <div
    id="block-content"
    data-wp-bind--hidden="!context.isOpen"
    data-wp-bind--aria-hidden="!context.isOpen"
  >
    Content
  </div>
</div>
```

**Nota de accesibilidad:** `hidden` es un atributo booleano HTML que oculta el elemento visualmente y para tecnologías asistivas. Combinar `data-wp-bind--hidden` con `data-wp-bind--aria-hidden` **es redundante**: cuando `hidden` está presente, los lectores de pantalla ya ignoran el elemento. Usa uno u otro según el patrón de ocultación que necesites. Si requieres visibilidad visual pero ocultación para AT, usa solo `aria-hidden`. Asegúrate además de vincular `aria-expanded` al botón disparador para cumplir el patrón ARIA de disclosure.

---

## 10. Estilos

### 10.1 Organización CSS/SCSS
- `style.scss`: estilos editor + frontend.
- `editor.scss`: estilos solo editor (opcional).
- Scopear por wrapper: `.wp-block-namespace-block-name`.

Ejemplo:
```scss
.wp-block-namespace-hero-block {
  padding: var(--wp--preset--spacing--large);

  &__title {
    font-size: var(--wp--preset--font-size--x-large);
    color: var(--wp--preset--color--foreground);
  }

  &__content {
    margin-top: var(--wp--preset--spacing--medium);
  }
}
```

### 10.2 Integración con `theme.json`
Usar `theme.json` para:
- paleta de color,
- tipografías,
- spacing,
- layout.

> Regla: no duplicar estilos globales en bloques.

---

## 11. Accesibilidad (obligatorio)

Checklist mínimo:
- Navegación teclado sin trampas (tab/shift+tab).
- Foco visible (y orden de foco lógico).
- Semántica correcta (`button` para acciones, headings ordenados).
- ARIA solo si aporta valor (no "aria por aria"). En particular: no combinar `hidden` y `aria-hidden` de forma redundante (ver sección 9.3).
- Contraste suficiente (si el bloque controla colores).
- En componentes que muestran/ocultan contenido, usar el patrón de disclosure ARIA: `aria-expanded` en el control, `aria-controls` apuntando al contenido.

---

## 12. Seguridad (obligatorio)

### 12.1 SSR: escapar/sanitizar
- Atributos HTML: `esc_attr()`
- URLs: `esc_url()`
- Texto plano: `esc_html()`
- HTML editorial permitido: `wp_kses_post()` o `wp_kses()` con allowlist

**Sobre `$content` en `render_callback`:** Este parámetro contiene el HTML renderizado de los `InnerBlocks` ya procesado por el pipeline de bloques de WordPress. No es necesario (ni recomendable) aplicarle `wp_kses_post()`. Sí debes escapar los **atributos propios del bloque padre** que interpolos directamente en el HTML de salida.

> Regla: nunca imprimir contenido "raw" sin criterio.

### 12.2 REST endpoints
- `permission_callback` siempre.
- Sanitización y validación de inputs.
- Responder con `WP_REST_Response` cuando aplique.

### 12.3 DOM insertion en frontend
- Evitar `dangerouslySetInnerHTML` salvo contenido editorial sanitizado.
- Evitar `innerHTML` con datos remotos sin sanitización.
- Preferir `textContent` y construcción DOM segura.

---

## 13. Patterns

### 13.1 Estructura de archivo
Ubicación: `theme/patterns/pattern-name.php`

```php
<?php
/**
 * Title: Pattern Name
 * Slug: namespace/pattern-name
 * Categories: featured, text
 * Description: Pattern description
 */
?>
<!-- wp:group {"className":"pattern-wrapper"} -->
<div class="wp-block-group pattern-wrapper">
  <!-- wp:heading -->
  <h2>Pattern Title</h2>
  <!-- /wp:heading -->

  <!-- wp:paragraph -->
  <p>Pattern content</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
```

**Reglas:**
- Usar comentarios HTML de bloques.
- Cabecera completa (Title/Slug/Categories).
- Si hay texto visible, considerar traducción (según política del proyecto).

---

## 14. Templates / Template parts

Ubicación:
- `theme/templates/*.html`
- `theme/parts/*.html`

Ejemplo:
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
<!-- wp:group {"tagName":"main"} -->
<main class="wp-block-group">
  <!-- wp:post-content /-->
</main>
<!-- /wp:group -->
<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

---

## 15. Hooks comunes

```php
// Registrar bloques
add_action( 'init', 'register_blocks', 10 );

// Encolar assets de bloques
add_action( 'enqueue_block_assets', 'enqueue_block_assets' );
add_action( 'enqueue_block_editor_assets', 'enqueue_block_editor_assets' );

// Categorías de bloques
add_filter( 'block_categories_all', 'add_block_categories', 10, 2 );

// Variaciones de bloques
add_action( 'init', 'register_block_variations' );
```

---

## 16. Buenas prácticas (resumen operativo)

### 16.1 Desarrollo de bloques
1. Empezar por `block.json`.
2. Definir SSR vs estático (sección 3).
3. Atributos mínimos (sección 6).
4. Data layer oficial si hay datos (sección 8).
5. Interactivity baseline (sección 9).
6. Accesibilidad y seguridad (secciones 11–12).
7. Probar editor + frontend.

### 16.2 Organización de código
- Un bloque por directorio.
- Utilidades compartidas en carpeta común.
- Naming consistente (kebab-case archivos, PascalCase componentes).
- JSDoc/TS donde aporte valor.

### 16.3 Rendimiento
- Carga condicional de assets.
- Code splitting si bloques grandes.
- Dependencias mínimas.
- Evitar requests en cascada y renders innecesarios.
- Preloading REST para bloques que consumen datos al iniciar el editor (sección 8.3).

---

## 17. Anti-patrones a evitar

❌ Registrar bloques en `after_setup_theme` → usar `init`
❌ Registrar desde `src/` cuando hay build → registrar siempre desde `build/`
❌ DOM directo en editor → usar estado React / componentes
❌ Estilos "inline" desde JS → usar CSS + `theme.json`
❌ Ignorar `block.json` → es la fuente de verdad
❌ No usar `useBlockProps()` → wrapper obligatorio
❌ Lógica React compleja en `save` → `save` es estático
❌ Cambiar `save` sin añadir entrada en `deprecated` → invalidación masiva de bloques
❌ Cadenas sin i18n / textdomain inconsistente
❌ Atributos gigantes → guardar IDs/valores mínimos
❌ React frontend por defecto → baseline Interactivity/vanilla
❌ `useSelect` devolviendo objetos/arrays nuevos en cada render → re-renders continuos
❌ Aplicar `wp_kses_post()` sobre `$content` de InnerBlocks → ya está procesado
❌ Combinar `hidden` + `aria-hidden` de forma redundante → elegir uno según el patrón
❌ Asumir que `DOMContentLoaded` funciona en todos los contextos → verificar estrategia de encolado y compatibilidad con AJAX/SPA

---

## 18. Checklist

### 18.1 Antes de crear un bloque
- [ ] Propósito y requisitos definidos
- [ ] SSR vs estático decidido (sección 3)
- [ ] `block.json` planificado (supports/attributes/context)
- [ ] A11y y rendimiento considerados desde el diseño

### 18.2 Durante el desarrollo
- [ ] `block.json` completo
- [ ] Editor usa `useBlockProps()`
- [ ] `save` correcto (o SSR); si cambia, `deprecated` actualizado
- [ ] Estilos scopeados y alineados con `theme.json`
- [ ] i18n correcto (**JS: NO `_e()`**)
- [ ] Data layer oficial si hay datos (core-data)
- [ ] `useSelect` selecciona mínimo (sin objetos nuevos en cada render)
- [ ] Interactividad frontend solo si hace falta
- [ ] Patrones ARIA correctos en componentes interactivos (disclosure, roles, aria-expanded)

### 18.3 Antes de finalizar
- [ ] Inserción/edición/guardado OK
- [ ] Persistencia tras recargar editor
- [ ] Frontend OK (SSR o estático)
- [ ] Sin errores en consola
- [ ] Seguridad/escapado aplicado (atributos propios escapados; `$content` no re-sanitizado)
- [ ] A11y smoke (teclado) validado
- [ ] Registro desde `build/` verificado (si hay proceso de compilación)

---

## 19. Referencias

- https://developer.wordpress.org/block-editor/
- https://developer.wordpress.org/block-editor/getting-started/tutorial/
- https://developer.wordpress.org/block-editor/getting-started/fundamentals/block-json/
- https://developer.wordpress.org/block-editor/getting-started/fundamentals/registration-of-a-block/
- https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/
- https://developer.wordpress.org/block-editor/reference-guides/packages/packages-core-data/
- https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
- https://developer.wordpress.org/themes/global-settings-and-styles/
- https://github.com/WordPress/block-development-examples

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md

