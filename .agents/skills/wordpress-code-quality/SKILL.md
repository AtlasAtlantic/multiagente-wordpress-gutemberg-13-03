---
name: wordpress-code-quality
description: Aplicar estándares reutilizables de implementación WordPress para análisis, código, validación, logging y entrega de bajo riesgo. Usar al cambiar PHP de WordPress, hooks, templates, plugins, themes o checks de calidad a nivel de proyecto.
---

# wordpress-code-quality

Usa esta skill para trabajo de implementación WordPress que deba seguir siendo portable entre proyectos.

## Cuándo usarla

- al añadir o cambiar código PHP de WordPress
- al introducir hooks, filters, templates, setup del theme o lógica de plugin
- al planificar la verificación de cambios WordPress
- al revisar logging, sanitización, escaping, nonces, capacidades o acceso a BD
- al preparar un change set pequeño y revisable para entrega

## Flujo de trabajo

1. Antes de codificar, inspecciona código similar que ya exista en el repositorio.
2. Prioriza APIs de WordPress y patrones ya establecidos del proyecto frente a abstracciones custom.
3. Aplica las reglas de seguridad y gestión de errores de `references/implementation-standards.md`.
4. Elige una estrategia de verificación desde `references/verification-and-delivery.md`.
5. Cierra con evidencia explícita de validación y notas de riesgo residual cuando no sea posible una verificación completa.

## Reglas

- Trata los patrones existentes del repositorio como la primera referencia de implementación.
- Usa un change set enfocado cada vez; no mezcles refactors no relacionados.
- Sigue una estructura compatible con WPCS y convenciones de naming de WordPress.
- Sanitiza en entrada, valida antes de usar y escapa en salida.
- Usa nonces y checks de capacidad para acciones privilegiadas.
- Prioriza `get_posts()`, `WP_Query`, APIs de metadatos y helpers core antes que SQL raw.
- Si `$wpdb` es necesario, exige prepared statements.
- Evita debug ad hoc comiteado en el codebase.
- Loguea fallos inesperados con contexto estable y no sensible.
- No te comas excepciones; o bien las dejas burbujear, o logueas y relanzas con propósito.

## Referencias

- Lee `references/implementation-standards.md` para reglas de código, seguridad y logging.
- Lee `references/verification-and-delivery.md` para análisis previo a la implementación, verificación manual y tamaño de PR.
- Combínala con `wordpress-technical-documentation` cuando el cambio necesite documentación duradera de feature, bug o improvement.

## Salida esperada

- código WordPress alineado con los patrones existentes del repositorio
- estrategia de verificación y evidencia explícitas
- gestión segura de errores y postura de seguridad correcta
- un change set revisable y de bajo riesgo
