---
title: Principios principales
alwaysApply: true
category: documentation
---
# Principios principales

## TL;DR

- **Primero planificar**: Traza siempre un plan para cada feature o tarea solicitada
- **Análisis previo a la implementación**: Antes de escribir código, analiza patrones existentes, revisa el flujo de Git, entiende la estructura del código e identifica hooks/filters/APIs de WordPress a utilizar
- **Tareas pequeñas, de una en una**: Trabaja siempre en baby steps, de uno en uno. No avances más de un paso cada vez.
- **Desarrollo guiado por tests**: Si hay tests, empieza con tests en rojo para cualquier funcionalidad nueva (TDD). Si no hay tests, verifica manualmente en el entorno de WordPress antes y después de los cambios.
- **Seguridad de tipos**: Todo el código debe estar tipado con `declare(strict_types=1);` y los type hints adecuados.

## Propósito

Establecer principios operativos transversales para guiar decisiones técnicas y de proceso.

## Cuando aplica

- alwaysApply: true
- category: documentation
## Reglas

- **Primero planificar**: Traza siempre un plan para cada feature o tarea solicitada
- **Análisis previo a la implementación**: Antes de escribir código, analiza patrones existentes, revisa el flujo de Git, entiende la estructura del código e identifica hooks/filters/APIs de WordPress a utilizar
- **Tareas pequeñas, de una en una**: Trabaja siempre en baby steps, de uno en uno. No avances más de un paso cada vez.
- **Desarrollo guiado por tests**: Si hay tests, empieza con tests en rojo para cualquier funcionalidad nueva (TDD). Si no hay tests, verifica manualmente en el entorno de WordPress antes y después de los cambios.
- **Seguridad de tipos**: Todo el código debe estar tipado con `declare(strict_types=1);` y los type hints adecuados.
- **Nombres claros**: Usa nombres claros y descriptivos siguiendo convenciones de WordPress: `snake_case()` para funciones de WordPress, `camelCase()` para funciones custom, `PascalCase` para clases.
- **Cambios incrementales**: Prefiere cambios incrementales y focalizados frente a modificaciones grandes y complejas.
- **Cuestionar suposiciones**: Cuestiona siempre suposiciones e inferencias, especialmente sobre APIs y hooks de WordPress.
- **Detección de patrones**: Detecta y destaca patrones de código repetidos, especialmente hooks, filters y estructuras de theme en WordPress.
- **Consistencia de patrones**: Antes de implementar código nuevo, analiza código similar existente y sigue los mismos patrones, especialmente el uso de hooks y la arquitectura del theme.
- **WordPress APIs primero**: Usa siempre funciones y APIs de WordPress en lugar de reinventar funcionalidad. Aprovecha hooks, filters y funciones core.
- **Gestión de versiones**: Comprueba con frecuencia nuevas versiones de WordPress core y plugins. Pide siempre permiso al usuario antes de actualizar WordPress core o cualquier plugin. Verifica compatibilidad y revisa changelogs antes de proponer actualizaciones.
- **Principios ágiles**: Sigue los valores Agile, XP y Scrum según se define en `03-agile-principles.md`
- **Verificación de refactorización**: Antes de refactorizar, verifica manualmente en el entorno de WordPress (o ejecuta tests si los hay), revisa dependencias de hooks/filters y asegúrate de que la funcionalidad de WordPress sigue correcta tras cada cambio. Ver `07-refactoring-verification-checklist.md` para el proceso completo.

---
**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
