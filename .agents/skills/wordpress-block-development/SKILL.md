---
name: wordpress-block-development
description: Construir o revisar bloques modernos de WordPress usando estándares portables para `block.json`, decisiones SSR frente a estático, registro, acceso a datos, seguridad, accesibilidad y comportamiento frontend.
---

# wordpress-block-development

Usa esta skill para trabajo de bloques custom en themes o plugins.

## Cuándo usarla

- al crear o modificar un bloque custom
- al decidir entre bloques estáticos o server-rendered
- al revisar `block.json`, el registro del bloque o el output de build
- al añadir UI de editor, acceso a datos del bloque, interactividad frontend, patterns o templates
- al validar accesibilidad, seguridad y rendimiento de una implementación de bloque

## Flujo de trabajo

1. Lee el bloque existente o implementaciones vecinas de bloques en el repositorio.
2. Decide estático frente a SSR antes de codificar.
3. Trata `block.json` como fuente de verdad de metadatos.
4. Registra desde artefactos de build cuando el proyecto tenga paso de build.
5. Mantén separadas las responsabilidades de editor, frontend y servidor.
6. Cierra con verificación de editor y frontend.

## Reglas

- Toma como base las convenciones de la WordPress Block API y los paquetes oficiales.
- Prioriza SSR cuando el bloque dependa de datos runtime, SEO, permisos o lógica compartida de renderizado.
- Prioriza bloques estáticos para marcado editorial estable.
- Mantén los atributos mínimos y seguros para migración.
- Usa `@wordpress/data` y `@wordpress/core-data` antes que lógica ad hoc de fetch.
- Carga JS frontend solo cuando el bloque necesite realmente interacción.
- Trata accesibilidad y escaping como requisitos, no como opcionales.

## Referencias

- Lee `references/block-architecture.md` para reglas de estructura, registro y renderizado.
- Lee `references/block-quality-checklist.md` para datos, interactividad, accesibilidad, seguridad y validación.

## Salida esperada

- una implementación de bloque alineada con la arquitectura de bloques de WordPress
- una decisión justificada entre SSR y estático
- metadatos y registro consistentes con el modelo de build del repositorio
- evidencia explícita de verificación de editor y frontend
