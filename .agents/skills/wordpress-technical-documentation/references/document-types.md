# Tipos de documento

Usa la estructura correcta según la naturaleza del trabajo.

## Documento de feature

Úsalo para una capability nueva o una ampliación relevante de feature.

Secciones obligatorias:

1. Título
2. Objetivo
3. Contexto del proyecto
4. Alcance
   - Incluye
   - Excluye
5. Requisitos funcionales
6. Modelo de datos y relaciones, si aplica
7. Criterios de aceptación
8. Estrategia de pruebas

Secciones opcionales:

- hooks o filters de WordPress implicados
- notas específicas de bloques
- notas de integración en theme o plugin
- requisitos no funcionales
- update log

## Documento de bug

Úsalo al documentar un defecto y su fix verificado.

Secciones obligatorias:

1. Título
2. Descripción del problema
   - Síntomas
   - Ejemplo o comportamiento fallido
3. Causa raíz
4. Soluciones implementadas
5. Verificación
6. Notas importantes
7. Archivos relacionados
8. Commits relacionados, si aplica

Secciones opcionales:

- impacto
- prioridad
- workarounds
- fecha de descubrimiento o de fix

## Documento de improvement

Úsalo al evolucionar un comportamiento actual sin enmarcarlo como defecto.

Secciones obligatorias:

1. Título
2. Objetivo
3. Contexto del proyecto
4. Alcance
   - Incluye
   - Excluye
5. Estado actual
6. Improvements propuestos
7. Requisitos funcionales
8. Criterios de aceptación
9. Estrategia de pruebas

Secciones opcionales:

- análisis de impacto
- consideraciones de migración
- requisitos no funcionales
- consideraciones técnicas

## Regla de decisión

- capability nueva: feature
- comportamiento incorrecto: bug
- mejor versión de un comportamiento actual aceptable: improvement
