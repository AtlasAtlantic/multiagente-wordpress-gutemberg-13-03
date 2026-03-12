---
title: Estándares de idioma
alwaysApply: true
category: documentation
globs:
  - "**/*.php"
  - "**/*.md"
  - "**/*.md"
---
# Estándares de idioma

## TL;DR

- **Solo inglés para el código**: Todo el código debe estar siempre en inglés, incluyendo:
- Código (variables, funciones, clases, comentarios, mensajes de error, mensajes de log)
- **Cadenas de traducción**: Todas las cadenas en funciones gettext (`__()`, `_e()`, `esc_html__()`, etc.) deben estar en inglés. Son el idioma fuente para la traducción.
- Documentación (README, guías, documentación de API)
- Esquemas de datos y nombres de base de datos

## Propósito

Definir el estándar de idioma para código y documentación, manteniendo consistencia con WordPress.

## Cuando aplica

- alwaysApply: true
- category: documentation
- globs: "**/*.php", "**/*.md", "**/*.md"
## Reglas

- **Solo inglés para el código**: Todo el código debe estar siempre en inglés, incluyendo:
    - Código (variables, funciones, clases, comentarios, mensajes de error, mensajes de log)
    - **Cadenas de traducción**: Todas las cadenas en funciones gettext (`__()`, `_e()`, `esc_html__()`, etc.) deben estar en inglés. Son el idioma fuente para la traducción.
    - Documentación (README, guías, documentación de API)
    - Esquemas de datos y nombres de base de datos
    - Archivos de configuración y scripts
    - Mensajes de commit en Git
    - Nombres y descripciones de tests

- **Gestor de tareas**: Las plataformas de gestión de tareas (Trello, Jira, Linear, etc.) pueden usar español en tickets (títulos, descripciones, comentarios) según las preferencias de comunicación del proyecto.

**Ejemplo de cadenas de traducción correctas:**
```php
// Bien - cadenas fuente en inglés
'primary' => __( 'Primary Navigation', 'prisa-media' ),
'footer'  => __( 'Footer Navigation', 'prisa-media' ),
esc_html_e( 'Save Changes', 'prisa-media' );

// Mal - cadenas fuente en español (incorrecto)
'primary' => __( 'Navegacion principal', 'prisa-media' ),
'footer'  => __( 'Navegacion pie', 'prisa-media' ),
```

**Justificación**: Usar inglés como idioma fuente para las cadenas de traducción:
- Hace el código accesible para desarrolladores internacionales
- Sigue las buenas prácticas de WordPress (el inglés es el idioma fuente por defecto)
- Permite una gestión de traducciones más sencilla
- Mantiene consistencia con WordPress core y la mayoría de plugins

---
**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
