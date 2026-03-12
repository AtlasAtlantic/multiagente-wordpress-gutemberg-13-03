---
title: Estándares de tarjetas HITO y CHILD
alwaysApply: false
category: workflow
---
# Estándares de tarjetas HITO y CHILD

## TL;DR

- **HITO**: Tarjeta padre de milestone que agrupa trabajo relacionado
- **CHILD**: Subtarea que pertenece a un HITO padre
- **Etiquetas**: HITO usa etiqueta `HITO`, CHILD usa `HITO` y `CHILD` más la etiqueta con el ID del padre (p. ej., `ZNQ14Sb5`)
- Formato: `{cardId}-{number}-{kebab-case-name}.md`
- Ejemplo: `ZNQ14Sb5-46-sistema-de-tracking-de-paginas-del-proyecto.md`



## Propósito

Este documento define estándares para trabajar con tarjetas HITO (milestone) y sus tarjetas CHILD en Trello, incluyendo estructura de documentación, convenciones de nombres y patrones de flujo.

## Cuando aplica

- alwaysApply: false
- category: workflow

## Reglas

## Introducción

Las tarjetas HITO representan features de milestone que se descomponen en múltiples tarjetas CHILD (subtareas). Esta estructura jerárquica permite mejor organización y seguimiento de features complejas.

**Conceptos clave:**
- **HITO**: Tarjeta padre de milestone que agrupa trabajo relacionado
- **CHILD**: Subtarea que pertenece a un HITO padre
- **Etiquetas**: HITO usa etiqueta `HITO`, CHILD usa `HITO` y `CHILD` más la etiqueta con el ID del padre (p. ej., `ZNQ14Sb5`)

## Estructura de documentación

### Documentación de tarjeta HITO (padre)

**Ubicación**: `docs/features/{cardId}-{number}-{kebab-case-name}.md`

**Convención de nombres**:
- Formato: `{cardId}-{number}-{kebab-case-name}.md`
- Ejemplo: `ZNQ14Sb5-46-sistema-de-tracking-de-paginas-del-proyecto.md`

**Estructura**:
- El documento debe describir el sistema/feature global
- Incluir lista de tarjetas CHILD y relaciones
- Documentar el sistema de tracking o estructura creada
- Referenciar todas las tarjetas hijas

**Ejemplo**:
```markdown
# 46: Sistema de tracking de páginas del proyecto

**Trello Card**: [ZNQ14Sb5 - Sistema de tracking de páginas del proyecto](https://trello.com/c/ZNQ14Sb5/46-sistema-de-tracking-de-p%C3%A1ginas-del-proyecto)

## Objetivo

[Descripción del sistema/feature global]

## Estructura de Páginas

[Documentación de todas las páginas/cards hijas]
```

### Documentación de tarjeta CHILD

**Ubicación**: `docs/features/hito-{parentCardId}/{cardId}-{number}-{kebab-case-name}.md`

**Convención de nombres**:
- Directorio: `docs/features/hito-{parentCardId}/`
- Archivo: `{cardId}-{number}-{kebab-case-name}.md`
- Ejemplo: `docs/features/hito-ZNQ14Sb5/kv1ppuYl-47-home.md`

**Estructura**:
- Incluir link al HITO padre justo después del link de Trello
- Documentar la página/feature específica
- Incluir todo el contenido extraído de imágenes de diseño
- Referenciar el HITO padre en contexto

**Secciones obligatorias**:
```markdown
# {number}: {Feature Name}

**Trello Card**: [{cardId} - {Feature Name}](https://trello.com/c/{cardId}/{number}-{feature-name})

**HITO padre**: [{parentCardId} - {Parent Name}](https://trello.com/c/{parentCardId}/{parent-number}-{parent-name})

## Objetivo

[Objetivo específico de esta tarjeta child]

## Contexto del Proyecto

### Relación con la Estructura Actual

Esta página:
- Es una página hija de "{Parent Name}" (Nivel X)
- Forma parte del grupo de [group type]
- Estará vinculada desde la página padre "{Parent Name}"
- Utilizará el sistema de páginas jerárquico de WordPress (`post_parent`)
```

## Configuración de tarjetas Trello

### Configuración de tarjeta HITO

**Etiquetas obligatorias**:
- `HITO` (etiqueta de milestone)
- Etiqueta custom con el ID de la card (p. ej., `ZNQ14Sb5`) para filtrar

**Descripción**:
- Incluir link a documentación: `docs/features/{cardId}-{number}-{kebab-case-name}.md`
- Describir el sistema/feature global
- Listar todas las CHILD con links

**Checklists**:
- Crear checklists para seguimiento general
- Ejemplo: "Desktop" y "Mobile" para tracking de páginas

### Configuración de tarjeta CHILD

**Etiquetas obligatorias**:
- `HITO` (indica que pertenece a un milestone)
- `CHILD` (indica subtarea)
- Etiqueta con el ID del padre (p. ej., `ZNQ14Sb5`) para filtrar

**Descripción**:
- **OBLIGATORIO**: Incluir link al HITO padre
- Incluir link a documentación: `docs/features/hito-{parentCardId}/{cardId}-{number}-{kebab-case-name}.md`
- Copiar contenido completo del markdown a la descripción
- Incluir todas las secciones: Objective, Context, Scope, Requirements, Acceptance Criteria, Testing Strategy

**Checklists**:
- **OBLIGATORIO**: Crear checklist "status" con estos ítems:
  - Contenido aprobado
  - FIGMA aprobado
  - versión Desktop
  - versión Mobile
  - URL permalink ok
  - SEO revisado
  - WPO revisado
  - Accesibilidad revisado
  - Ya está creada en PRE
- Crear checklists adicionales según "Criterios de Aceptación" y "Estrategia de Testing"

**Comentarios**:
- **OBLIGATORIO**: Añadir comentario en español al crear la card
- **OBLIGATORIO**: Añadir comentario en español al actualizar la card con contenido de imágenes
- Registrar todas las actualizaciones con comentarios

## Extracción de contenido de imágenes de diseño

### Proceso

Al actualizar cards CHILD con contenido específico desde imágenes:

1. **Extraer todo el contenido visible**:
   - Headers y navegación
   - Secciones hero (títulos, subtítulos, fondos)
   - Secciones de contenido (texto, estadísticas, listas)
   - Elementos visuales (imágenes, logos, iconos)
   - Información de footer

2. **Actualizar documento markdown**:
   - Añadir sección "Contenido Específico" con todo el contenido
   - Actualizar "Requisitos Funcionales" con estructura específica
   - Actualizar "Registro de Actualizaciones" con change log

3. **Actualizar tarjeta Trello**:
   - Copiar contenido completo actualizado a la descripción
   - Añadir comentario en español registrando la actualización
   - Listar todos los elementos extraídos

4. **Verificar completitud**:
   - Capturar todo el texto visible
   - Describir todos los elementos visuales
   - Incluir estadísticas y métricas
   - Documentar navegación

### Categorías de contenido a extraer

- **Header/Navegación**: Logo, items de menú, estados activos, breadcrumbs
- **Secciones hero**: Títulos, subtítulos, fondos, elementos gráficos
- **Secciones de contenido**: Párrafos, estadísticas, listas, descripciones
- **Elementos visuales**: Descripción de imágenes, logos, iconos
- **Elementos interactivos**: Botones, enlaces, CTAs, formularios
- **Footer**: Contacto, ubicaciones, links legales, copyright

## Flujo Git para HITOs

### Orden de commits

Al commitear documentación para HITOs y CHILD, seguir este orden:

1. **Documentación del HITO padre** (primer commit)
2. **Páginas nivel 1** (páginas principales sin padre)
3. **Páginas nivel 2** (páginas hijas)

**Justificación**: Refleja la jerarquía y hace el historial más claro.

### Mensajes de commit

**Formato**: `docs: Añadir documentación de feature {Name} ({type})`

**Incluir**:
- Tipo de página (principal, landing, ficha, etc.)
- Nivel (Nivel 1, Nivel 2)
- Elementos clave (hero, estadísticas, listas, etc.)
- ID de card Trello
- Referencia HITO padre

**Ejemplo**:
```
docs: Añadir documentación de feature Home (página principal)

- Página Home (landing principal) del proyecto PRISA Media
- Nivel 1: Página principal sin sección padre, URI: / (raíz del sitio)
- Hero Section: PRISA MEDIA + 100 AÑOS DE LIDERAZGO E INNOVACIÓN
- Sección de estadísticas: 6 métricas clave
- Card Trello: kv1ppuYl
- HITO padre: ZNQ14Sb5
```

### Commits individuales

**CRÍTICO**: Crear un commit por archivo de documentación. Cada commit debe:
- Incluir solo un archivo
- Tener mensaje completo y descriptivo
- Seguir el orden lógico (HITO → Nivel 1 → Nivel 2)

## Estándares de idioma

### Idioma de documentación

**CRÍTICO**: Toda documentación de features/mejoras/bugs (incluyendo HITO y CHILD) debe estar en **español**.

Incluye:
- Títulos y secciones
- Objetivo
- Requisitos funcionales
- Criterios de aceptación
- Estrategia de pruebas
- Registro de actualizaciones

**Excepción**: Ejemplos de código, rutas de archivo y términos técnicos permanecen en inglés.

### Idioma en Trello

**CRÍTICO**: Todo el contenido de Trello debe estar en **español**.

Ver `trello-workflow-standards.md` para reglas completas.

## Buenas prácticas

### Crear tarjetas HITO

1. **Planificar la estructura**:
   - Identificar todas las CHILD necesarias
   - Determinar jerarquía (Nivel 1, Nivel 2)
   - Crear la HITO padre primero

2. **Crear tarjetas CHILD**:
   - Crear todas las CHILD con etiquetas correctas
   - Vincular al padre con etiqueta ID padre
   - Crear directorio de documentación: `docs/features/hito-{parentCardId}/`

3. **Documentar sistemáticamente**:
   - Empezar por documentación del HITO
   - Documentar CHILD en orden lógico
   - Extraer contenido de diseños cuando estén disponibles

### Actualizar con contenido de diseño

1. **Extraer todo**:
   - No omitir contenido visible
   - Describir elementos visuales con precisión
   - Incluir texto, estadísticas, listas

2. **Actualizar ambos sitios**:
   - Actualizar markdown primero
   - Después actualizar descripción Trello
   - Añadir comentario registrando actualización

3. **Mantener consistencia**:
   - Mantener markdown y Trello sincronizados
   - Usar misma estructura
   - Actualizar "Registro de Actualizaciones" en markdown

### Seguimiento de progreso

1. **Usar checklists**:
   - Checklist "status" para progreso
   - Checklists adicionales para criterios de aceptación
   - Actualizar checklists según avance

2. **Añadir comentarios**:
   - Comentar al crear cards
   - Comentar al actualizar con contenido
   - Comentar al mover en el flujo

3. **Vincular documentación**:
   - Incluir links en descripciones
   - Vincular HITO padre desde CHILD
   - Mantener links actualizados

## Errores comunes a evitar

❌ **Falta enlace al padre en CHILD**
- Incluir siempre "HITO padre" tras el link de Trello

❌ **Naming inconsistente**
- Usar ID exacto en directorio y archivo
- Seguir kebab-case siempre

❌ **Saltarse extracción de contenido**
- Extraer TODO lo visible en diseños
- No dejar placeholders si hay contenido

❌ **No actualizar Trello**
- Replicar contenido markdown en descripción de Trello
- Mantener sincronía

❌ **Orden de commits incorrecto**
- Commitear HITO primero
- Luego en orden lógico (Nivel 1 → Nivel 2)

❌ **Faltan comentarios**
- Añadir comentario al crear/actualizar cards
- Registrar cambios en español

❌ **Idioma incorrecto**
- Documentación de features/mejoras/bugs en español
- Contenido Trello en español
- Solo código y términos técnicos en inglés

---

**Última actualización:** 2026-01-16  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
