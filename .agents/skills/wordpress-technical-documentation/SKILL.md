---
name: wordpress-technical-documentation
description: Crear o actualizar documentación técnica reusable para features, bugs e improvements de WordPress. Usar al documentar intención de implementación, causa raíz, criterios de aceptación o verificación sin acoplar la documentación a trackers específicos del proyecto.
---

# wordpress-technical-documentation

Usa esta skill cuando el trabajo de WordPress necesite documentación técnica duradera dentro del repositorio.

## Cuándo usarla

- al escribir o actualizar especificaciones de feature
- al documentar un bug y su fix
- al definir un plan de improvement sin mezclarlo con documentación de bug
- al actualizar notas técnicas tras cambios de implementación
- al normalizar estructura y naming de documentación del repositorio

## Flujo de trabajo

1. Comprueba si el repositorio ya tiene un documento para el mismo issue o elemento de trabajo.
2. Reutiliza el mismo documento cuando ya exista; evita la fragmentación.
3. Elige la familia de plantillas correcta desde `references/document-types.md`.
4. Escribe en español de España salvo que una regla canónica del repositorio diga explícitamente lo contrario.
5. Cierra con notas de verificación, archivos relacionados y cualquier hueco restante.

## Reglas

- Mantén un documento por tema de feature, bug o improvement.
- Usa nombres de archivo Markdown en lowercase kebab-case para archivos nuevos.
- Mantén la documentación técnica y local al repositorio; no dependas de Trello, Venus ni tooling específico de runtime.
- Distingue con claridad entre:
  - documentación de feature
  - documentación de bug
  - documentación de improvement
- Incluye límites de alcance y criterios de verificación.
- Cuando el trabajo cambie comportamiento existente, explica el estado actual antes de describir el estado objetivo.

## Referencias

- Lee `references/document-types.md` para las secciones obligatorias por tipo de documento.
- Lee `references/writing-rules.md` para naming, flujo de actualización y anti-patrones.

## Salida esperada

- un único documento técnico coherente por tema
- documentación con propósito, alcance y verificación explícitos
- menos ambigüedad para implementación y mantenimiento futuros
