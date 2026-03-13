# Checklist de cambio de plataforma

Usa esta referencia al modificar artefactos canónicos de `.agents/`.

## Antes de editar

- Lee primero la arquitectura actual y la skill/tool existente más cercana.
- Declara el alcance previsto en términos de áreas canónicas: `architecture`, `skills`, `tools`, `profiles`, `runtime`, `schemas`, `docs`.
- Prioriza ediciones mínimas y localizadas.
- Evita introducir una skill nueva si una existente puede absorber el cambio limpiamente.

## Reglas de edición

- `.agents/` es la fuente de verdad; los adaptadores runtime son derivados.
- No muevas lógica canónica al output runtime.
- No importes a skills reutilizables supuestos de workflow específicos del repositorio.
- Mantén un propósito claro por skill.
- Usa `references/` para la guía detallada y mantén `SKILL.md` corto.

## Cierre de validación

Ejecuta estos checks después de cambios canónicos siempre que el entorno lo permita:

1. `sh .agents/tools/doctor/run.sh`
2. `sh .agents/tools/validate-config/run.sh`
3. `sh .agents/tools/sync-runtime/run.sh`

Además, verifica:

- que las referencias cruzadas siguen resolviendo
- que no se ha introducido ninguna capability duplicada
- que el output runtime derivado sigue reflejando los inputs canónicos

## Cierre de trazabilidad

Todo cambio relevante debe registrarse en `docs/agents-change-record.md`.

Cada entrada debe recoger:

- por qué se hizo el cambio
- qué archivos canónicos cambiaron
- si cambiaron artefactos runtime derivados
- qué validaciones se ejecutaron
- cualquier riesgo restante o follow-up

## Patrón de entrega recomendado

1. Auditar material legado.
2. Clasificar cada bloque de contenido.
3. Definir el plan mínimo de integración.
4. Editar archivos canónicos.
5. Actualizar el registro de cambios.
6. Ejecutar validación.
7. Reportar con precisión los huecos residuales si la validación no puede completarse.
