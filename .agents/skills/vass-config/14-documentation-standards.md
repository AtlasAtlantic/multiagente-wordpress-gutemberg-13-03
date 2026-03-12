---
title: Estándares de documentación
alwaysApply: false
category: documentation
globs:
  - "docs/**/*.md"
  - "*.md"
  - "README.md"
---
# Estándares de documentación

## TL;DR

- SIEMPRE ESCRIBIR EN INGLÉS, incluyendo comentarios y cualquier explicación en los archivos. Esto aplica tanto al crear documentación nueva como al actualizar la existente, y también aplica a la documentación dentro del código (comentarios, explicaciones de funciones o campos, etc.).
- **Usar solo minúsculas**: Todas las letras deben ser minúsculas (incluyendo números de ticket: `ticket-xx`, no `TICKET-XX`)
- **Usar kebab-case**: Separar palabras con guiones (`-`)
- **Extensión de archivo**: Usar siempre `.md`
- **Formato de ID de tarjeta Trello**: Usar el ID exacto de la URL de Trello (p. ej., `p9g6EwQs-32-actualizar-metodologia.md`)



## Propósito

Este documento define estándares y buenas prácticas para documentación técnica en este proyecto, incluyendo estructura, procesos de actualización y reglas de idioma.

## Cuando aplica

- alwaysApply: false
- category: documentation
- globs: "docs/**/*.md", "*.md", "README.md"

## Reglas

## Introducción

La documentación técnica aplica a toda la documentación relativa al proyecto, como arquitectura, README, specs de API y otros documentos MD que describen cómo está estructurado, cómo se ejecuta y cómo opera el proyecto.
Las especificaciones de IA se refieren a documentos que explican a los agentes IA cómo comportarse, documentar, planificar, codificar, etc., incluyendo acuerdos de equipo, estándares y convenciones.

## Reglas generales
- SIEMPRE ESCRIBIR EN INGLÉS, incluyendo comentarios y cualquier explicación en los archivos. Esto aplica tanto al crear documentación nueva como al actualizar la existente, y también aplica a la documentación dentro del código (comentarios, explicaciones de funciones o campos, etc.).

## Convenciones de nombres de archivos

Todos los archivos de documentación en `docs/` y sus subdirectorios DEBEN seguir estas reglas:

- **Usar solo minúsculas**: Todas las letras deben ser minúsculas (incluyendo números de ticket: `ticket-xx`, no `TICKET-XX`)
- **Usar kebab-case**: Separar palabras con guiones (`-`)
- **Extensión de archivo**: Usar siempre `.md`
- **Formato de ID de tarjeta Trello**: Usar el ID exacto de la URL de Trello (p. ej., `p9g6EwQs-32-actualizar-metodologia.md`)

**Ejemplos:**
- ✅ `p9g6EwQs-32-actualizar-metodologia.md` (formato ID Trello)
- ✅ `ticket-32-add-custom-block.md` (formato tradicional)
- ✅ `ticket-15-update-theme-setup.md`
- ✅ `block-registration-issue.md`
- ✅ `docs/features/hito-ZNQ14Sb5/kv1ppuYl-47-home.md` (tarjeta CHILD en directorio HITO)
- ❌ `TICKET-32-add-custom-block.md` (tiene mayúsculas)
- ❌ `P9G6EWQS-32-actualizar-metodologia.md` (ID en mayúsculas)
- ❌ `ARCHITECTURE.md` (tiene mayúsculas)
- ❌ `README-PROYECTO.md` (tiene mayúsculas)

**Nombres HITO y CHILD:**
- **HITO parent**: `{cardId}-{number}-{kebab-case-name}.md` en `docs/features/`
- **CHILD**: `{cardId}-{number}-{kebab-case-name}.md` en `docs/features/hito-{parentCardId}/`
- Ver `hito-and-child-cards-standards.md` para estructura completa

**Nota**: Esta regla aplica a todos los archivos nuevos. Los existentes con mayúsculas deben renombrarse al actualizarlos.

**CRÍTICO**: Antes de crear cualquier archivo de documentación, verificar:
1. El nombre usa solo minúsculas (incluyendo tickets)
2. El nombre sigue kebab-case
3. Comprobar archivos similares existentes para validar el patrón
4. Si hay ejemplos en otras reglas con mayúsculas, ignorarlos y seguir esta regla

## Archivos que deben versionarse

**CRÍTICO**: Los siguientes archivos y directorios DEBEN versionarse en git (NO ignorar):

- `docs/.obsidian/` - Configuración de Obsidian (si se usa)
- Todos los archivos en `docs/technical/`
- Todos los archivos de reglas en `.codex/rules/`

**Nota**: Si `.gitignore` impide versionar estos archivos, debe ajustarse o limpiarse.

## Documentación técnica
Antes de hacer cualquier commit o push, o si se solicita documentar un commit, SIEMPRE debes revisar qué documentación técnica debe actualizarse.

### Regla de documento único para issues

**CRÍTICO**: Toda la documentación de un issue específico (feature, bug o mejora) DEBE mantenerse en el MISMO archivo durante todo el ciclo de implementación.

**Reglas:**
- Si un issue referencia una ruta de documento (p. ej., en Trello/Linear), usar ESA ruta exacta
- Todas las actualizaciones, aprendizajes, seguimiento de progreso y cambios van al MISMO documento
- Nunca crear documentos duplicados o nuevos para el mismo issue
- Esto asegura una única fuente de verdad y evita fragmentación

**Ejemplos:**
- Issue TICKET-32.1 referencia `docs/technical/features/ticket-32-custom-blocks/ticket-32.1-hero-block.md` → Todas las actualizaciones van a ese archivo
- Issue TICKET-XX referencia `docs/technical/bugs/ticket-xx-bug-name.md` → Todas las actualizaciones van a ese archivo (usar minúsculas: `ticket-xx`, no `TICKET-XX`)
- Si el issue no referencia ruta, seguir naming estándar: `docs/technical/[type]/ticket-xx-[name].md` (minúsculas: `ticket-xx`, no `TICKET-XX`)

Al actualizar documentación, haré:
1. Revisar todos los cambios recientes en el codebase
2. Identificar qué archivos de documentación necesitan actualización según los cambios. Ejemplos claros:
   - Para cambios en el theme WordPress: actualizar documentación del theme
   - Para cambios de hooks/filters WordPress: actualizar documentación de hooks
   - Para cambios en librerías, configuración de WordPress o cualquier cambio de instalación, actualizar *-standards.md
   - Para bug fixes: crear documentación de bug siguiendo `bug-definition-standards.md`
   - Para nuevas features: crear documentación de feature siguiendo `feature-definition-standards.md`
3. **Para documentación específica de un issue**: Actualizar SIEMPRE el MISMO documento referenciado en el issue (mirar la descripción en Trello/Linear)
4. Actualizar cada archivo de documentación afectado en inglés, manteniendo consistencia con la documentación existente
5. Asegurar que toda la documentación está bien formateada y sigue la estructura establecida
6. Verificar que los cambios se reflejan con precisión en la documentación
7. **CRÍTICO**: Verificar que `docs/.obsidian/` se incluye en commits si cambia (debe versionarse, no ignorarse)
8. Reportar qué archivos se actualizaron y qué cambios se hicieron

### Tipos de documentación

El proyecto mantiene distintos tipos de documentación, cada uno con sus estándares:

- **Features**: En `docs/features/`, seguir `feature-definition-standards.md`
  - **HITO parent**: `docs/features/{cardId}-{number}-{kebab-case-name}.md`
  - **CHILD**: `docs/features/hito-{parentCardId}/{cardId}-{number}-{kebab-case-name}.md`
  - Ver `hito-and-child-cards-standards.md` para estructura completa HITO/CHILD
- **Bugs**: En `docs/bugs/`, seguir `bug-definition-standards.md`
- **Improvements**: En `docs/improvements/`, seguir `improvement-definition-standards.md`
- **Notas técnicas**: En `docs/`, seguir estándares generales de documentación

**Nota**: Las rutas de features cambiaron de `docs/technical/features/` a `docs/features/` para alinearse con la estructura del proyecto.

## Especificaciones de IA

Esta regla establece un proceso obligatorio para la IA para:
*   Aprender de feedback del usuario, guía y sugerencias durante las interacciones.
*   Identificar oportunidades de mejorar las reglas de desarrollo existentes basadas en esos aprendizajes de forma proactiva.
*   Mantener la asistencia de la IA alineada con las necesidades del proyecto y expectativas del usuario.
*   Incorporar feedback del usuario al marco operativo de la IA para maximizar su valor.

Esta regla aplica tras cualquier interacción donde el usuario dé feedback explícito o implícito, sugerencias, correcciones, información nueva o preferencias. **La IA DEBE analizar activamente todas las interacciones en busca de oportunidades de aprendizaje, no solo esperar feedback directo, para refinar de forma proactiva su entendimiento y mejores prácticas del proyecto.**

### Errores comunes y anti-patrones a evitar por la IA

*   **Saltarse el proceso de aprobación:** Aplicar modificaciones de reglas sin revisión y aprobación explícita del usuario.
*   **Propuestas sin vínculo:** Proponer cambios de reglas sin conectar claramente con el feedback específico o aprendizajes de la interacción.
*   **Modificaciones imprecisas:** Sugerir cambios sin identificar qué regla o sección exacta se debe modificar, dificultando la revisión.
*   **Feedback no atendido:** No iniciar el proceso de aprendizaje y revisión cuando el usuario da feedback relevante que podría mejorar las reglas.
*   **Scope creep:** Actualizar múltiples reglas no relacionadas o cambios fuera del alcance del feedback recibido.
*   **Cambios de reglas sin motivo:** Modificar reglas sin conexión directa con feedback o aprendizaje. Las actualizaciones deben ser reactivas y basadas en feedback.
*   **Falta de confirmación:** No notificar al usuario tras implementar una modificación aprobada.

---

**Última actualización:** 2026-01-16  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
