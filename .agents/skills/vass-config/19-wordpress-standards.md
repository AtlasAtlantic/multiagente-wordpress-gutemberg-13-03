---
title: Estándares de WordPress
alwaysApply: true
category: workflow
globs:
  - "theme/**/*.php"
  - "plugins/**/*.php"
  - "mu-plugins/**/*.php"
  - "mu-plugins/*.php"
---
# Estándares de WordPress

## TL;DR

- Seguir WordPress Coding Standards (WPCS) para estilo consistente
- Priorizar seguridad: sanitizar, validar, escapar y usar nonces
- Usar APIs y funciones de WordPress en lugar de reinventar funcionalidad
- Mantener compatibilidad hacia atrás cuando sea posible
- Diseñar para escalabilidad y mantenibilidad



## Propósito

Este documento define estándares, buenas prácticas y convenciones específicas de WordPress para desarrollo de themes y plugins en este proyecto, siguiendo WordPress Coding Standards y buenas prácticas de seguridad.

## Cuando aplica

- alwaysApply: true
- category: workflow
- globs: "theme/**/*.php", "plugins/**/*.php", "mu-plugins/**/*.php", "mu-plugins/*.php"


## Reglas

Eres experto en WordPress, PHP y buenas prácticas de desarrollo WordPress.

## Principios básicos

- Seguir WordPress Coding Standards (WPCS) para estilo consistente
- Priorizar seguridad: sanitizar, validar, escapar y usar nonces
- Usar APIs y funciones de WordPress en lugar de reinventar funcionalidad
- Mantener compatibilidad hacia atrás cuando sea posible
- Diseñar para escalabilidad y mantenibilidad
- Usar POO con namespaces correctos
- Seguir convenciones de nombres y estructura de archivos de WordPress

## Dependencias

- PHP 8.2+
- WordPress 6.4+
- Composer para gestión de dependencias
- Build tools modernos (Vite) para compilación de assets

## WordPress Coding Standards

### Estándares PHP

- Seguir PSR-12 con ajustes específicos de WordPress
- Usar siempre tipado estricto: `declare(strict_types=1);`
- Usar convenciones de nombres WordPress:
  - Funciones: `snake_case()` para funciones WordPress, `camelCase()` para funciones custom
  - Clases: `PascalCase` con nombres descriptivos
  - Constantes: `UPPER_SNAKE_CASE`
  - Variables: `snake_case`
- Indentación: usar tabs (no espacios) en archivos WordPress
- Longitud de línea: mantener <80 caracteres si es posible, máximo 120
- Condiciones Yoda: usar comparaciones tipo Yoda: `if ( 'value' === $variable )`

### Estructura de código

- **Comprobar ABSPATH siempre**: Cada archivo PHP debe empezar con:
  ```php
  if ( ! defined( 'ABSPATH' ) ) {
      exit;
  }
  ```
- Usar namespaces: `namespace Theme;` o `namespace PluginName;`
- Usar clases `final` cuando no se necesite herencia
- Mantener clases enfocadas en una única responsabilidad
- Usar inyección de dependencias para mejor testabilidad

### Patrones específicos de WordPress

- **Hooks y filters**: Usar siempre el sistema de hooks de WordPress
  ```php
  // Bien - usando hooks
  add_action( 'wp_enqueue_scripts', [ $this, 'enqueueAssets' ] );
  add_filter( 'the_content', [ $this, 'filterContent' ] );
  
  // Mal - ejecución directa
  $this->enqueueAssets(); // No llamar directamente
  ```

- **Theme support**: Registrar features del theme en el hook `after_setup_theme`
  ```php
  add_action( 'after_setup_theme', [ $this, 'setup' ] );
  
  public function setup(): void {
      add_theme_support( 'title-tag' );
      add_theme_support( 'post-thumbnails' );
      add_theme_support( 'editor-styles' );
  }
  ```

- **Text domain**: Usar siempre text domain para i18n
  ```php
  // Bien
  __( 'Text to translate', 'prisa-media' );
  _e( 'Echo text', 'prisa-media' );
  esc_html__( 'Safe HTML text', 'prisa-media' );
  
  // Mal - sin text domain
  __( 'Text to translate' );
  ```

## Buenas prácticas de seguridad

### Sanitización de datos

**CRÍTICO**: Sanitizar siempre la entrada de usuario antes de guardar o mostrar.

- **Sanitizar al entrar**: Usar `sanitize_text_field()`, `sanitize_email()`, `sanitize_url()`, etc.
  ```php
  // Bien - sanitizar entrada
  $name = sanitize_text_field( $_POST['name'] ?? '' );
  $email = sanitize_email( $_POST['email'] ?? '' );
  $url = esc_url_raw( $_POST['url'] ?? '' );
  
  // Mal - sin sanitizar
  $name = $_POST['name']; // PELIGROSO
  ```

- **Escapar al salir**: Escapar siempre al mostrar en el navegador
  ```php
  // Bien - escapar salida
  echo esc_html( $user_input );
  echo esc_attr( $attribute_value );
  echo esc_url( $url );
  echo esc_js( $javascript_value );
  echo wp_kses_post( $html_content ); // Para HTML permitido
  
  // Mal - sin escape
  echo $user_input; // vulnerabilidad XSS
  ```

### Nonces

**OBLIGATORIO**: Usar nonces siempre en formularios y AJAX.

```php
// Crear nonce
wp_nonce_field( 'action_name', 'nonce_field_name' );
wp_nonce_field( 'delete_post_' . $post_id, 'delete_nonce' );

// Verificar nonce
if ( ! isset( $_POST['nonce_field_name'] ) || 
     ! wp_verify_nonce( $_POST['nonce_field_name'], 'action_name' ) ) {
    wp_die( 'Security check failed' );
}
```

### Comprobación de capacidades

**OBLIGATORIO**: Verificar capacidades antes de permitir acciones.

```php
// Bien - comprobar capacidades
if ( ! current_user_can( 'edit_posts' ) ) {
    wp_die( 'You do not have permission to perform this action.' );
}

if ( ! current_user_can( 'manage_options' ) ) {
    return;
}
```

### Consultas a base de datos

- **Nunca usar SQL directo**: Usar la capa de abstracción de WordPress
  ```php
  // Bien - funciones WordPress
  $posts = get_posts( [
      'post_type' => 'page',
      'posts_per_page' => 10,
  ] );
  
  // Bien - usar WP_Query
  $query = new WP_Query( [
      'post_type' => 'product',
      'meta_key' => 'price',
      'meta_value' => 100,
  ] );
  
  // Mal - SQL directo (riesgo de seguridad)
  global $wpdb;
  $results = $wpdb->get_results( "SELECT * FROM {$wpdb->posts} WHERE post_type = 'page'" );
  ```

- **Si usas $wpdb**: Usar siempre `$wpdb->prepare()` para consultas
  ```php
  // Bien - prepared statement
  $results = $wpdb->get_results(
      $wpdb->prepare(
          "SELECT * FROM {$wpdb->posts} WHERE post_type = %s AND post_status = %s",
          'page',
          'publish'
      )
  );
  
  // Mal - riesgo de inyeccion SQL
  $results = $wpdb->get_results(
      "SELECT * FROM {$wpdb->posts} WHERE post_type = '{$post_type}'"
  );
  ```

### Operaciones con archivos

- **Validar siempre operaciones de archivo**: Comprobar existencia, permisos y rutas
  ```php
  // Bien - operaciones seguras
  $file_path = get_template_directory() . '/includes/file.php';
  if ( file_exists( $file_path ) && is_readable( $file_path ) ) {
      require_once $file_path;
  }
  
  // Mal - sin validacion
  require_once get_template_directory() . '/includes/file.php';
  ```

## Estándares de desarrollo de themes

### Estructura de archivos

Seguir estructura de theme WordPress:
```
theme/
├── style.css          # Cabecera y estilos del theme
├── functions.php      # Punto de entrada del theme
├── theme.json         # Configuración FSE
├── templates/         # Plantillas de bloque
├── patterns/          # Block patterns
├── parts/             # Partes de plantilla
├── assets/            # CSS, JS, imágenes
│   ├── js/
│   ├── scss/
│   └── dist/          # Assets compilados
└── src/               # Código PHP
    ├── Setup.php
    ├── Assets.php
    └── Blocks.php
```

### Cabecera del theme

**OBLIGATORIO**: `style.css` debe contener la cabecera:
```css
/*
Theme Name: prisa-media
Theme URI: https://example.com/prisa-media
Author: Prisa Media
Author URI: https://example.com
Description: Theme de bloques (FSE) para prisa-media.
Version: 1.0.0
Requires at least: 6.4
Tested up to: 6.4
Requires PHP: 8.2
Text Domain: prisa-media
*/
```

### Functions.php

- Mantener `functions.php` mínimo - usarlo solo para bootstrap del theme
- Cargar clases via autoloader (Composer)
- Usar estructura orientada a objetos

```php
<?php
declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once __DIR__ . '/vendor/autoload.php';

Theme\Kernel::boot();
```

### Gestión de assets

- **Encolar scripts y estilos correctamente**: Usar `wp_enqueue_script()` y `wp_enqueue_style()`
  ```php
  // Bien - encolado correcto
  public function enqueueFrontend(): void {
      wp_enqueue_script(
          'prisa-media-main',
          get_template_directory_uri() . '/assets/dist/main.js',
          [], // Dependencias
          null, // Version (null para cache busting via manifest)
          true  // En footer
      );
      
      wp_enqueue_style(
          'prisa-media-style',
          get_template_directory_uri() . '/assets/dist/main.css',
          [],
          null
      );
  }
  ```

- **Usar manifest para cache busting**: En producción, usar manifest.json del build
  ```php
  private function getManifest(): array {
      $manifestPath = get_template_directory() . '/assets/dist/manifest.json';
      return Filesystem::readJson( $manifestPath );
  }
  ```

- **Carga condicional**: Cargar assets solo cuando hagan falta
  ```php
  if ( $this->parallax->shouldEnqueue() ) {
      wp_enqueue_script( 'parallax-script', ... );
  }
  ```

### Full Site Editing (FSE)

- **Usar theme.json**: Configurar ajustes en `theme.json`
  ```json
  {
    "version": 2,
    "settings": {
      "color": {
        "palette": [
          { "slug": "ink", "color": "#111111", "name": "Ink" }
        ]
      },
      "typography": {
        "fontFamilies": [
          {
            "slug": "mulish",
            "name": "Mulish",
            "fontFamily": "'Mulish', sans-serif"
          }
        ]
      }
    }
  }
  ```

- **Plantillas de bloque**: Usar templates HTML en `templates/`
- **Partes de plantilla**: Reutilizables en `parts/`
- **Block patterns**: Reutilizables en `patterns/`

## Internacionalización (i18n)

### Text Domain

- **Usar siempre text domain**: Consistente en todo el theme
- **Cargar text domain**: en `after_setup_theme`
  ```php
  load_theme_textdomain( 'prisa-media', get_template_directory() . '/languages' );
  ```

### Funciones de traducción

- **Usar la función adecuada**:
  ```php
  // Para echo
  _e( 'Text', 'prisa-media' );
  esc_html_e( 'Safe HTML text', 'prisa-media' );
  
  // Para return
  __( 'Text', 'prisa-media' );
  esc_html__( 'Safe HTML text', 'prisa-media' );
  esc_attr__( 'Attribute text', 'prisa-media' );
  
  // Para variables
  sprintf( __( 'Hello %s', 'prisa-media' ), $name );
  sprintf( esc_html__( 'Hello %s', 'prisa-media' ), esc_html( $name ) );
  ```

- **Plural**: Usar `_n()` para plural
  ```php
  _n( 'One item', '%s items', $count, 'prisa-media' );
  ```

## Operaciones de base de datos

### Usar funciones WordPress

- **Preferir funciones WordPress**: `get_posts()`, `WP_Query`, `get_post_meta()`, etc.
  ```php
  // Bien - funciones WordPress
  $posts = get_posts( [
      'post_type' => 'page',
      'posts_per_page' => 10,
      'post_status' => 'publish',
  ] );
  
  $meta = get_post_meta( $post_id, 'custom_field', true );
  update_post_meta( $post_id, 'custom_field', $value );
  ```

- **Usar WP_Query para consultas complejas**:
  ```php
  $query = new WP_Query( [
      'post_type' => 'product',
      'meta_query' => [
          [
              'key' => 'price',
              'value' => 100,
              'compare' => '>=',
          ],
      ],
      'tax_query' => [
          [
              'taxonomy' => 'product_category',
              'field' => 'slug',
              'terms' => 'electronics',
          ],
      ],
  ] );
  ```

### Tablas personalizadas

- **Evitar tablas custom**: Usar post meta, taxonomias o CPTs cuando sea posible
- **Si se necesitan tablas custom**: Usar `$wpdb` con prepared statements
  ```php
  global $wpdb;
  $table_name = $wpdb->prefix . 'custom_table';
  
  $results = $wpdb->get_results(
      $wpdb->prepare(
          "SELECT * FROM {$table_name} WHERE status = %s",
          'active'
      )
  );
  ```

## Buenas prácticas de rendimiento

### Caché

- **Usar transients de WordPress**: Para operaciones costosas
  ```php
  // Obtener de caché o calcular
  $data = get_transient( 'expensive_operation_result' );
  if ( false === $data ) {
      $data = expensive_operation();
      set_transient( 'expensive_operation_result', $data, HOUR_IN_SECONDS );
  }
  ```

- **Object cache**: Usar `wp_cache_get()` y `wp_cache_set()`
  ```php
  $data = wp_cache_get( 'key', 'group' );
  if ( false === $data ) {
      $data = compute_data();
      wp_cache_set( 'key', $data, 'group', HOUR_IN_SECONDS );
  }
  ```

### Optimización de consultas

- **Limitar consultas**: Especificar siempre `posts_per_page` o `number`
- **Usar campos específicos**: Pedir solo los campos necesarios
  ```php
  $posts = get_posts( [
      'fields' => 'ids', // Solo IDs
      'posts_per_page' => 10,
  ] );
  ```

- **Evitar N+1**: Agrupar operaciones cuando sea posible
  ```php
  // Bien - operación en lote
  $post_ids = wp_list_pluck( $posts, 'ID' );
  update_post_meta_cache( $post_ids ); // Cachea todo el meta a la vez
  
  // Mal - query N+1
  foreach ( $posts as $post ) {
      $meta = get_post_meta( $post->ID, 'field', true ); // Query por post
  }
  ```

### Optimización de assets

- **Minificar y concatenar**: Usar Vite para producción
- **Carga condicional**: Cargar assets solo donde se necesitan
- **Defer/async scripts**: Usar atributos adecuados
  ```php
  wp_enqueue_script( 'script', $src, [], null, true ); // true = en footer
  wp_script_add_data( 'script', 'defer', true );
  wp_script_add_data( 'script', 'async', true );
  ```

## Desarrollo de bloques

### Bloques custom

- **Registrar bloques correctamente**: Usar `register_block_type()` o block.json
  ```php
  register_block_type( 'prisa-media/custom-block', [
      'render_callback' => [ $this, 'renderBlock' ],
      'attributes' => [
          'title' => [
              'type' => 'string',
              'default' => '',
          ],
      ],
  ] );
  ```

- **Usar block.json**: Para metadatos del bloque
  ```json
  {
    "$schema": "https://schemas.wp.org/trunk/block.json",
    "apiVersion": 3,
    "name": "prisa-media/custom-block",
    "title": "Custom Block",
    "category": "text",
    "editorScript": "file:./index.js"
  }
  ```

### Block patterns

- **Crear patterns reutilizables**: en `patterns/`
  ```php
  <?php
  /**
   * Title: Hero Parallax
   * Slug: prisa-media/hero-parallax
   * Categories: featured
   */
  ?>
  <!-- wp:group {"className":"hero-parallax"} -->
  <div class="wp-block-group hero-parallax">
      <!-- Block content -->
  </div>
  <!-- /wp:group -->
  ```

## Gestión de errores

### Gestión de errores WordPress

- **Usar funciones WordPress**: `wp_die()`, `is_wp_error()`
  ```php
  $result = wp_insert_post( $post_data );
  if ( is_wp_error( $result ) ) {
      wp_die( $result->get_error_message() );
  }
  ```

- **Loguear errores correctamente**: Usar `error_log()` o logging WordPress
  ```php
  if ( WP_DEBUG_LOG ) {
      error_log( 'Error message: ' . $error_message );
  }
  ```

### Depuración

- **Usar constantes WP_DEBUG**: Solo en desarrollo
  ```php
  if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
      // Código de debug
  }
  ```

- **No exponer errores en producción**: Comprobar `WP_DEBUG_DISPLAY`
  ```php
  if ( defined( 'WP_DEBUG' ) && WP_DEBUG && 
       defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY ) {
      // Mostrar errores
  }
  ```

## Organización del código

### Estructura de clases

- **Usar namespaces**: Organizar con namespaces
  ```php
  namespace Theme;
  
  final class Setup {
      // Código de la clase
  }
  ```

- **Clases final**: Usar `final` cuando no se necesite herencia
- **Inyección de dependencias**: Pasar dependencias por constructor
  ```php
  final class Assets {
      private Parallax $parallax;
      
      public function __construct( Parallax $parallax ) {
          $this->parallax = $parallax;
      }
  }
  ```

### Organización de archivos

- **Una clase por archivo**: Seguir PSR-4
- **Nombres descriptivos**: Deben coincidir con la clase
- **Agrupar funcionalidad relacionada**: Usar subdirectorios

## Anti-patrones a evitar

### ❌ Consultas directas a BD

```php
// Mal - SQL directo
global $wpdb;
$results = $wpdb->get_results( "SELECT * FROM wp_posts" );

// Bien - funciones WordPress
$posts = get_posts( [ 'post_type' => 'post' ] );
```

### ❌ Salida sin escape

```php
// Mal - vulnerabilidad XSS
echo $user_input;

// Bien - salida escapada
echo esc_html( $user_input );
```

### ❌ Sin nonces

```php
// Mal - sin check de seguridad
if ( isset( $_POST['action'] ) ) {
    // Procesar formulario
}

// Bien - con nonce
if ( isset( $_POST['action'] ) && 
     wp_verify_nonce( $_POST['nonce'], 'action' ) ) {
    // Procesar formulario
}
```

### ❌ Texto hardcodeado

```php
// Mal - no traducible
echo 'Hello World';

// Bien - traducible
echo esc_html__( 'Hello World', 'prisa-media' );
```

### ❌ Modificar core

```php
// Mal - nunca modificar archivos core
// wp-includes/functions.php - NO EDITAR

// Bien - usar hooks y filters
add_filter( 'the_content', 'custom_content_filter' );
```

## Checklist para desarrollo WordPress

Antes de commitear código WordPress, verifica:

- [ ] Toda la entrada de usuario está sanitizada
- [ ] Toda la salida está escapada
- [ ] Nonces usados en formularios y AJAX
- [ ] Checks de capacidades
- [ ] Text domain en todas las cadenas
- [ ] Check de ABSPATH en todos los archivos PHP
- [ ] Funciones WordPress usadas en lugar de SQL directo
- [ ] Hooks y filters usados correctamente
- [ ] Assets encolados correctamente
- [ ] No se modifican archivos core
- [ ] Código sigue WordPress Coding Standards
- [ ] Consideraciones de rendimiento revisadas

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

**Referencias:**
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/)
- [WordPress Security](https://developer.wordpress.org/advanced-administration/security/)
- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [WordPress Theme Handbook](https://developer.wordpress.org/themes/)

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md

