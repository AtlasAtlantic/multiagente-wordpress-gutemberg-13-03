# Verificación y entrega WordPress

Usa esta referencia para elegir una estrategia de verificación y mantener change sets revisables.

## Estrategia de verificación

Elige la opción más fuerte disponible:

1. tests automatizados cuando ya exista infraestructura
2. verificación manual enfocada en WordPress cuando no existan tests
3. ambas, cuando el riesgo lo justifique

## Si existen tests automatizados

- Empieza con un test en rojo al añadir comportamiento nuevo.
- Mantén los tests enfocados en un único comportamiento cada uno.
- Prioriza ejecución rápida y dirigida frente a suites amplias.
- Para tests de navegador, ejecuta la spec afectada o un grep estrecho, no la suite completa.

## Si no existen tests automatizados

La verificación manual es obligatoria:

1. Establece una línea base antes de editar.
2. Verifica inmediatamente después de cada cambio significativo.
3. Comprueba admin y frontend cuando corresponda.
4. Revisa el WordPress debug log.
5. Revisa errores de consola cuando haya JS o bloques implicados.
6. Deja constancia de cualquier hueco que no hayas podido verificar.

## Disciplina del change set

- Mantén el cambio enfocado en un problema o en un slice de feature.
- Evita mezclar trabajo de feature con formato o refactors no relacionados.
- Busca un PR o unidad de entrega que sea fácil de revisar con rapidez.
- Si el diff se amplía demasiado, divídelo antes de cerrar el trabajo.

## Checklist sugerido de cierre

- han pasado los checks de calidad relevantes
- se ha ejecutado verificación manual o tests automatizados
- se ha revisado el debug log cuando aplica
- se han documentado riesgos y limitaciones
- se ha actualizado la documentación de interfaz pública u operativa si cambió el comportamiento
