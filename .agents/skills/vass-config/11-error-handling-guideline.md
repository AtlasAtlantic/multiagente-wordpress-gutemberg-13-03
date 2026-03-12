---
title: Guía de gestión de errores y logging en WordPress
alwaysApply: true
category: workflow
globs:
  - "theme/**/*.php"
  - "plugins/**/*.php"
  - "mu-plugins/**/*.php"
  - "mu-plugins/*.php"
---
# Guía de gestión de errores y logging en WordPress

## TL;DR

- Todos los errores inesperados deben registrarse en el debug log de WordPress.
- Evita `try/catch` ad-hoc salvo que aporten valor (contexto extra, comportamiento de fallback).
- Usa funciones de gestión de errores de WordPress cuando corresponda.
- **No** capturar una excepción e ignorarla.
- **No** capturar, loguear y continuar en silencio.



## Propósito

Detectar y entender cada error relevante en WordPress de forma estándar, profesional y controlada, usando patrones de logging y buenas prácticas de WordPress. Estas reglas deben seguirse por desarrolladores y agentes IA (como Cursor) al generar o editar código WordPress.

## Cuando aplica

- alwaysApply: true
- category: workflow
- globs: "theme/**/*.php", "plugins/**/*.php", "mu-plugins/**/*.php", "mu-plugins/*.php"

## Reglas

## Tabla de contenidos

1. [Principios globales](#1-principios-globales)
2. [Niveles de logging](#2-niveles-de-logging--cuándo-usar-cada-uno)
3. [Configuración de logging](#3-reglas-de-configuración-de-logging)
4. [Gestión de excepciones](#4-reglas-de-gestión-de-excepciones)
5. [Uso de error_log en código](#5-reglas-para-uso-de-error_log-en-código)
6. [WordPress debug log](#6-wordpress-debug-log)
7. [Servicios de reporting de errores](#7-reporting-de-errores-sentry-bugsnag)
8. [Testing y logging](#8-testing--logging)
9. [Gestión de errores en clases del theme](#9-gestión-de-errores-en-clases-del-theme)
10. [Gestión de errores de validación](#10-gestión-de-errores-de-validación)
11. [Checklist para modificaciones de código](#11-checklist-para-cursor-al-modificar-código)

---

## 1. Principios globales

1. **Centraliza la gestión de errores.**
   - Todos los errores inesperados deben registrarse en el debug log de WordPress.
   - Evita `try/catch` ad-hoc salvo que aporten valor (contexto extra, comportamiento de fallback).
   - Usa funciones de gestión de errores de WordPress cuando corresponda.

2. **Nunca te comas excepciones.**
   - **No** capturar una excepción e ignorarla.
   - **No** capturar, loguear y continuar en silencio.
   - O bien:
     - Deja que WordPress lo maneje (sin `try/catch`), o
     - Loguea + relanza, o
     - Loguea + convierte a una excepción de dominio.

3. **Usa logging de WordPress en lugar de depuración ad-hoc.**
   - No comitear llamadas de depuración (`var_dump`, `print_r`, `dd`, `dump`).
   - Prefiere `error_log()` o el debug log de WordPress.

4. **Prefiere logging estructurado.**
   - Mensajes cortos y descriptivos.
   - Incluye contexto:
     - `post_id`, `user_id`, IDs de entidades, referencias externas.
   - Usa un formato consistente para mensajes.

5. **Nunca loguear información sensible.**
   - Nunca loguear passwords, tokens, claves privadas, tarjetas, ni PII.
   - Usa valores enmascarados si es necesario.

6. **Respeta límites por entorno.**
   - Local/testing → logs verbosos OK (cuando `WP_DEBUG_LOG` está activo).
   - Producción → logs significativos, acotados y no sensibles.
   - Respetar constantes `WP_DEBUG` y `WP_DEBUG_LOG`.

---

## 2. Niveles de logging — Cuándo usar cada uno

### `error_log()` con `E_USER_NOTICE`
- Detalle técnico de bajo nivel.
- Solo para desarrollo o instrumentación temporal.
- Ejemplo: pasos de parseo, valores intermedios.

### `error_log()` con `E_USER_WARNING`
- Comportamiento inusual pero no fatal.
- Ejemplo: formato inesperado encontrado, contenido parcial procesado.

### `error_log()` con `E_USER_ERROR`
- La operación falla, pero el sistema sigue funcionando.
- Ejemplo: fallo de parseo, error de API, error de validación.

### WordPress `wp_die()`
- Errores fatales que deben detener ejecución.
- Reservado para casos graves.
- Usar mensajes user-friendly.

> **Regla:** Al capturar excepciones y recuperar, loguea al menos `E_USER_WARNING` o `E_USER_ERROR`.

---

## 3. Reglas de configuración de logging

1. **Usar el debug log de WordPress:**
   - Activar `WP_DEBUG_LOG` en `wp-config.php` para desarrollo.
   - Ubicación: `wp-content/debug.log`.
   - Nunca comitear `wp-config.php` con debug activado en producción.

2. **Comportamiento dependiente de entorno:**
   - No hardcodear logging.
   - Comprobar `WP_DEBUG_LOG` antes de loguear:
     ```php
     if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
         error_log( 'Message here' );
     }
     ```

3. **Preferir el debug log de WordPress en desarrollo:**
   - Usar `WP_DEBUG_LOG` para depuración en desarrollo.
   - Usar `error_log()` para logging en producción si es necesario.

4. **Formato de logging estructurado:**
   - Formato consistente: `[Contexto] Mensaje: detalles`
   - Incluir timestamps cuando sea relevante.

---

## 4. Reglas de gestión de excepciones

### 4.1 Gestión de excepciones en WordPress

WordPress no tiene un handler centralizado de excepciones como Laravel. Gestiona las excepciones adecuadamente:

```php
try {
    // Operación WordPress
    $result = wp_insert_post( $post_data );
    if ( is_wp_error( $result ) ) {
        throw new \RuntimeException( $result->get_error_message() );
    }
} catch ( \Exception $e ) {
    if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
        error_log( 'Failed to insert post: ' . $e->getMessage() );
    }
    // Gestionar con gracia o relanzar
}
```

### 4.2 Ocultar mensajes internos al usuario

- Las respuestas de UI DEBEN ser genéricas y seguras.
- Stack traces y errores internos solo a logs.
- Nunca exponer detalles de implementación.
- Usar `wp_die()` con mensajes seguros en errores fatales.

### 4.3 Excepciones de dominio

Crear clases de excepción para errores de dominio:

```php
namespace Theme\Exceptions;

class BlockException extends \RuntimeException {}
class AssetException extends \InvalidArgumentException {}
class HookException extends \RuntimeException {}
```

**Beneficios:**
- Logging específico de dominio.
- Límites claros entre capas.
- Mejor gestión de errores.

### 4.4 Funciones de error de WordPress

WordPress proporciona funciones de gestión de errores:

```php
// Comprobar si el resultado es un error de WordPress
if ( is_wp_error( $result ) ) {
    error_log( 'WordPress error: ' . $result->get_error_message() );
}

// Error fatal con mensaje user-friendly
wp_die( 'An error occurred. Please try again later.' );
```

---

## 5. Reglas para uso de `error_log()` en código

### 5.1 Patrón general

```php
if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
    error_log( sprintf(
        'Failed to enqueue asset: %s | File: %s | Hook: %s',
        $handle,
        $file_path,
        current_filter()
    ) );
}
```

### 5.2 Reglas

1. **Comprobar siempre `WP_DEBUG_LOG` antes de loguear.**
   - No loguear en producción salvo necesidad.
   - Usar logging condicional.

2. **Mensajes orientados a acción + contexto.**
   - Bien: "Failed to enqueue block script: block-name"
   - Mal: "Error occurred"

3. **Claves de contexto en `snake_case` estable.**
   - Usar nombres consistentes: `post_id`, `file_path`, `user_id`.
   - Nunca usar camelCase ni nombres inconsistentes.

4. **Al capturar excepciones, incluir:**
   - Nombre de la clase de excepción.
   - Mensaje de excepción.
   - Contexto relevante (post ID, ruta de archivo, etc.).

5. **No hacer spam de logs.**
   - No loguear el mismo error repetidamente.
   - Usar rate limiting si es necesario.

6. **Formato consistente.**
   - Seguir convenciones del proyecto.
   - Usar `sprintf()` para mensajes estructurados.

---

## 6. WordPress debug log

### 6.1 Configuración

Activar en `wp-config.php`:

```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false ); // No mostrar en frontend
```

### 6.2 Uso

```php
if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
    error_log( 'Debug message here' );
}
```

### 6.3 Ubicación del fichero

- Por defecto: `wp-content/debug.log`
- Revisar regularmente durante el desarrollo
- Nunca commitear logs al repositorio
- Añadir a `.gitignore`

---

## 7. Reporting de errores (Sentry, Bugsnag…)

1. **Integrar vía hooks WordPress:**
   ```php
   add_action( 'wp_fatal_error_handler', function( $error, $message ) {
       // Enviar a servicio externo
   } );
   ```

2. **Filtrar ruido:**
   - Solo reportar errores en producción.
   - Filtrar errores esperados.
   - Incluir contexto relevante.

3. **Preservar contexto al reportar excepciones:**
   - Incluir todo el contexto relevante en reportes.
   - No perder información al enviar a servicios externos.

---

## 8. Testing y logging

1. **NO hacer asserts sobre logs completos.**
   - Los logs son detalles de implementación.
   - Enfocar tests en comportamiento, no en logging.

2. **Revisar el debug log de WordPress tras cambios:**
   - Revisar siempre `wp-content/debug.log` tras cambios de código.
   - Verificar que no se han logueado errores.
   - Limpiar el log antes de probar si hace falta.

3. **Mantener logs mínimos en producción.**
   - No contaminar logs de producción.
   - Usar niveles apropiados.

4. **Los logs ayudan a depurar pero no sustituyen la verificación.**
   - Verificar comportamiento en WordPress.
   - Usar logs para entender fallos.

---

## 9. Gestión de errores en clases del theme

### 9.1 Patrón para clases del theme

Las clases del theme deben:
- Validar datos de entrada.
- Loguear errores con contexto.
- Lanzar excepciones de dominio.
- Nunca tragarse excepciones en silencio.

**Ejemplo:**
```php
try {
    wp_enqueue_script(
        $handle,
        $src,
        $deps,
        $version,
        $in_footer
    );
} catch ( \Exception $e ) {
    if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
        error_log( sprintf(
            'Failed to enqueue script: %s | Error: %s | File: %s',
            $handle,
            $e->getMessage(),
            __FILE__
        ) );
    }
    
    throw new \Theme\Exceptions\AssetException(
        "Failed to enqueue script {$handle}: {$e->getMessage()}",
        0,
        $e
    );
}
```

### 9.2 Validación antes de operaciones

Validar datos antes de operaciones WordPress:

```php
// Validar nombre de hook
if ( empty( $hook_name ) || ! is_string( $hook_name ) ) {
    throw new \InvalidArgumentException(
        'Hook name must be a non-empty string.'
    );
}

// Validar ruta de archivo
if ( ! file_exists( $file_path ) ) {
    throw new \InvalidArgumentException(
        "File does not exist: {$file_path}"
    );
}
```

### 9.3 Envolver operaciones en try/catch

Envolver operaciones WordPress que puedan fallar:

```php
public function enqueueAssets(): void {
    try {
        wp_enqueue_style( 'theme-style', $style_url );
        wp_enqueue_script( 'theme-script', $script_url );
    } catch ( \Exception $e ) {
        if ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
            error_log( 'Failed to enqueue assets: ' . $e->getMessage() );
        }
        throw $e;
    }
}
```

---

## 10. Gestión de errores de validación

### 10.1 Validación de entrada

Validar datos antes de procesar:

```php
if ( ! isset( $_POST['action'] ) ) {
    wp_die( 'Invalid request.' );
}

if ( ! wp_verify_nonce( $_POST['nonce'], 'action' ) ) {
    wp_die( 'Security check failed.' );
}
```

### 10.2 Validación de datos

Validar rangos y restricciones:

```php
// Validar ID de post
$post_id = absint( $_POST['post_id'] ?? 0 );
if ( $post_id === 0 ) {
    throw new \InvalidArgumentException( 'Invalid post ID.' );
}

// Validar text domain
if ( empty( $text_domain ) || ! is_string( $text_domain ) ) {
    throw new \InvalidArgumentException( 'Text domain must be a non-empty string.' );
}
```

### 10.3 Excepciones de validación

- Usar `InvalidArgumentException` para entrada inválida.
- Proveer mensajes de error claros.
- Incluir contexto en logs.

---

## 11. Checklist para Cursor al modificar código

Al modificar código, asegurar:

1. **Los errores burbujean salvo aportar valor.**
   - No capturar excepciones innecesariamente.
   - Capturar solo si añades contexto o gestionas con gracia.

2. **Niveles de logging correctos.**
   - Usar niveles adecuados (notice, warning, error).
   - No loguear todo como error.

3. **Logs estructurados y estables.**
   - Formato consistente.
   - Incluir identificadores estables.

4. **Límites externos loguean y lanzan excepciones de dominio.**
   - Las clases del theme deben loguear y lanzar excepciones de dominio.
   - Usar funciones de error de WordPress cuando corresponda.

5. **Sin logging excesivo.**
   - No loguear cada operación.
   - Loguear eventos y errores significativos.

6. **Mensajes al usuario seguros.**
   - No exponer detalles internos.
   - Mensajes claros y accionables.
   - Usar `wp_die()` con mensajes seguros.

7. **Configuración de logging por entorno.**
   - Comprobar `WP_DEBUG_LOG` antes de loguear.
   - No hardcodear comportamiento de logging.

8. **Debug log de WordPress revisado.**
   - Revisar siempre `wp-content/debug.log` tras cambios.
   - Verificar que no hay errores.

9. **Validación antes de operaciones.**
   - Validar entrada pronto.
   - Validar rangos y restricciones.
   - Usar funciones de sanitización y validación de WordPress.

10. **Los try/catch aportan valor.**
    - Usar solo si añaden contexto o gestionan con gracia.
    - No capturar e ignorar.

11. **Funciones WordPress usadas correctamente.**
    - Usar `is_wp_error()` para comprobar errores WordPress.
    - Usar `wp_die()` para errores fatales.
    - Usar funciones de sanitización y validación WordPress.

12. **Seguridad mantenida.**
    - Sanitizar siempre la entrada del usuario.
    - Escapar siempre la salida.
    - Verificar nonces siempre.
    - Comprobar capacidades siempre.

---

## Recursos adicionales

- [WordPress Debugging](https://wordpress.org/documentation/article/debugging-in-wordpress/)
- [WordPress Error Handling](https://developer.wordpress.org/reference/functions/wp_die/)
- [PSR-3 Logger Interface](https://www.php-fig.org/psr/psr-3/)

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
