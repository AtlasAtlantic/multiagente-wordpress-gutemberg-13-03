# agents-config-validation

Usa esta skill para validar la configuración canónica y las referencias cruzadas.

## Cuándo usarla

- al validar perfiles, pipelines o routing
- al comprobar que existen los archivos requeridos
- al comprobar la consistencia de enlaces cruzados
- al cerrar un cambio canónico en `.agents/` después de aplicar ediciones

## Combinar con

- `agents-change-governance` cuando la tarea incluya migración de legado, clasificación o trabajo de trazabilidad de cambios

## Salida esperada

- informe de validación
- fallos accionables cuando fallen los checks de integridad
