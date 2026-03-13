# Reglas de redacción

Estas reglas adaptan las partes reutilizables de los estándares antiguos de documentación.

## Naming

- Usa lowercase kebab-case para nombres de archivo Markdown nuevos.
- Mantén nombres de archivo descriptivos y estables.
- Prioriza identificadores locales del repositorio o nombres descriptivos frente a IDs de trackers externos cuando importe la portabilidad.

## Flujo de actualización

- Si ya existe un documento para el mismo tema, actualízalo en lugar de crear otro.
- Refleja en el documento técnico correspondiente los cambios de código cuando haya cambiado comportamiento, interfaces o expectativas operativas.
- Mantén la documentación alineada con la estructura actual del repositorio, no con rutas heredadas de un proyecto antiguo.

## Reglas de contenido

- Escribe en español de España salvo que la política canónica del repositorio diga lo contrario.
- Explica qué hace el sistema, por qué existe y cómo debe verificarse.
- Mantén el alcance explícito con exclusiones claras.
- Prioriza ejemplos concisos frente a prosa narrativa larga.
- Al documentar detalles de implementación, referencia los patrones, hooks o componentes WordPress relevantes.

## Anti-patrones

- duplicar documentos para el mismo tema
- depender de Trello, HITO/CHILD, Venus o estructura externa de tablero
- mezclar semánticas de feature, bug e improvement en un mismo documento
- dejar la verificación sin definir
- usar títulos vagos como `update`, `changes` o `fixes`
