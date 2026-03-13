# Estándares de implementación WordPress

Esta referencia destila las partes reutilizables de los estándares antiguos para themes y plugins de WordPress.

## Análisis previo a la implementación

Antes de escribir código:

1. Encuentra clases, hooks, bloques, templates o helpers similares que ya existan.
2. Inspecciona naming, registro de hooks, estilo de dependencias, tipos de retorno y gestión de errores.
3. Reutiliza patrones existentes salvo que haya un motivo documentado para desviarse.
4. Comprueba si WordPress core ya proporciona el comportamiento que necesitas.

## Estándares de código

- Usa `declare(strict_types=1);` cuando el repositorio ya siga PHP tipado.
- Mantén una responsabilidad por clase o módulo.
- Prioriza clases `final` cuando no haga falta herencia.
- Haz coincidir nombres de clase con nombres de archivo y mantén una estructura compatible con PSR-4 cuando el proyecto use autoloading.
- Usa hooks y filters en lugar de ejecución directa cuando se requiera integración con el ciclo de vida de WordPress.
- Registra theme support en `after_setup_theme`.
- Registra comportamiento runtime en el hook correcto en lugar de ejecución ansiosa.

## Reglas de seguridad

- Sanitiza en entrada con el helper más estrecho y adecuado.
- Escapa en salida con el helper más estrecho y adecuado.
- Usa `wp_kses_post()` solo cuando se permita HTML de forma intencional.
- Exige nonces en formularios, AJAX y cambios de estado privilegiados.
- Exige checks de capacidad antes de ediciones, borrados o cambios de configuración.
- Prioriza APIs de WordPress para posts, metadatos, usuarios, taxonomías y options.
- Evita raw SQL. Si es necesario, exige `$wpdb->prepare()`.
- Valida rutas de archivo, existencia y legibilidad antes de operaciones con archivos.

## Gestión de errores y logging

- No comitees `var_dump`, `print_r`, `dd` ni código equivalente de debug.
- Prioriza mensajes estructurados de `error_log()` condicionados por `WP_DEBUG_LOG` en flujos orientados a desarrollo.
- Incluye claves de contexto estables como `post_id`, `user_id`, `hook_name` o `file_path`.
- No loguees nunca secretos, tokens, contraseñas ni datos personales sensibles.
- No captures excepciones solo para continuar en silencio.
- Si capturas, o bien:
  - añades contexto útil y relanzas, o
  - conviertes el error en una ruta apropiada de dominio con logging
- Usa checks de `is_wp_error()` sobre resultados de APIs de WordPress que puedan fallar.
- Mantén genéricos los mensajes de fallo de cara al usuario; los detalles internos, a logs.

## Preferencias comunes en WordPress

- Usa `WP_Query`, `get_posts()` y APIs core antes que SQL custom.
- Usa text domains de forma consistente para cadenas traducibles.
- Usa `after_setup_theme`, `init`, `wp_enqueue_scripts`, `admin_enqueue_scripts` y hooks similares de forma intencional.
- Carga assets solo donde se necesiten.

## Anti-patrones

- salida directa sin escape
- acciones privilegiadas sin nonce
- acciones de administración sin checks de capacidad
- excepciones tragadas
- raw SQL con valores interpolados
- includes de archivos sin validación
- patrones nuevos introducidos sin comprobar convenciones existentes del repositorio
