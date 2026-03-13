# Checklist de calidad de bloques

Usa esta referencia al implementar o revisar un bloque WordPress.

## Reglas de datos y editor

- Usa `@wordpress/data` y `@wordpress/core-data` antes que capas custom de fetch.
- Mantén `useSelect` enfocado para evitar rerenders innecesarios.
- Precarga o cachea datos cuando el editor, de otro modo, vaya a refetchear en exceso.
- Mantén los inspector controls alineados con el modelo de edición soportado.

## Comportamiento frontend

- No tomes React como opción por defecto en frontend.
- Usa `view.js` solo cuando el bloque necesite interacción en cliente.
- Considera la Interactivity API para comportamiento interactivo más rico cuando el repositorio la soporte.
- Carga scripts de forma condicional siempre que sea posible.

## Accesibilidad

- Asegura estructura semántica de headings y landmarks.
- Mantén los controles accesibles por teclado.
- Preserva estados de foco visibles.
- Valida labels, nombres y announcements de la UI interactiva.

## Seguridad

- Escapa y sanitiza el output SSR.
- Valida entrada REST y capacidades en endpoints custom.
- Evita patrones inseguros de inserción en DOM en frontend.

## Checklist de verificación

- El bloque aparece en el inserter
- El bloque puede configurarse en el editor
- Los atributos persisten correctamente
- El render frontend coincide con el resultado esperado
- Los estilos cargan en los contextos correctos
- No hay errores nuevos de PHP en el debug log
- No hay errores nuevos de consola en editor o frontend
- La decisión entre SSR y estático sigue estando justificada
