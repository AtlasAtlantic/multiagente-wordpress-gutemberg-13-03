---
title: Estándares de análisis previo a la implementación
alwaysApply: true
category: workflow
---
# Estándares de análisis previo a la implementación

## TL;DR

- Comprobar si se requiere una rama de feature
- Verificar el "Before Starting Work Checklist" en `git-workflow-standards.md`
- Crear la rama PRIMERO si se trabaja en una feature (antes de cualquier cambio de código)
- Encontrar clases/componentes similares en el codebase
- Revisar su estructura, convenciones de nombres y patrones
## Propósito

Antes de implementar cualquier feature nueva, bloque o cambio de código significativo, el agente de IA debe realizar un análisis exhaustivo de los patrones existentes, la estructura del código y los flujos de trabajo para asegurar consistencia y calidad.

## Cuando aplica

- alwaysApply: true
- category: workflow

## Reglas

## Principio central

**Nunca empieces a codificar sin entender los patrones y el flujo de trabajo existentes.**

## Checklist obligatorio previo a la implementación

Antes de escribir cualquier código, la IA debe:

1. **Revisar los estándares de flujo de Git**
   - Comprobar si se requiere una rama de feature
   - Verificar el "Before Starting Work Checklist" en `git-workflow-standards.md`
   - Crear la rama PRIMERO si se trabaja en una feature (antes de cualquier cambio de código)

2. **Analizar patrones de código existentes**
   - Encontrar clases/componentes similares en el codebase
   - Revisar su estructura, convenciones de nombres y patrones
   - Entender la arquitectura y decisiones de diseño
   - Identificar componentes o helpers reutilizables
   - Revisar el uso de hooks y filters de WordPress

3. **Revisar patrones de tests (si aplica)**
   - Examinar tests existentes para funcionalidad similar (si hay infraestructura de tests)
   - Entender la estructura y organización de los tests
   - Revisar patrones de datos de prueba
   - Identificar convenciones de testing

4. **Revisar documentación**
   - Revisar documentación relevante de la feature
   - Revisar estándares de WordPress en `.codex/rules/19-wordpress-standards.md`
   - Verificar alineación con los estándares documentados

5. **Verificar dependencias**
   - Comprobar qué clases/componentes ya existen
   - Entender dependencias de hooks y filters de WordPress
   - Identificar qué hay que crear vs. qué se puede reutilizar
   - Revisar APIs y funciones de WordPress disponibles

## Checklist previo a la creación de archivos (para documentación)

**OBLIGATORIO**: Antes de crear cualquier archivo de documentación (feature, bug, mejora, etc.), verificar:

1. **Convención de nombres de archivo**:
   - [ ] Revisar `documentation-standards.md`, sección "File Naming Conventions"
   - [ ] El nombre usa **solo minúsculas** (incluyendo tickets: `ticket-xx`, no `TICKET-XX`)
   - [ ] El nombre sigue **kebab-case** (palabras separadas por guiones)
   - [ ] Comprobar archivos similares existentes para validar el patrón

2. **Ubicación del archivo**:
   - [ ] Verificar el directorio correcto (`docs/technical/features/`, `docs/technical/bugs/`, etc.)
   - [ ] Comprobar si ya existe un archivo similar (evitar duplicados)

3. **Estándares de contenido**:
   - [ ] Revisar el estándar relevante (`feature-definition-standards.md`, `bug-definition-standards.md`, etc.)
   - [ ] Verificar que todas las secciones obligatorias están incluidas
   - [ ] Comprobar que ejemplos y bloques de código siguen convenciones del proyecto

## Proceso de análisis de patrones de código

### Paso 1: Identificar código similar

Al implementar una clase/componente nuevo, buscar:
- Clases similares (p. ej., `Setup` → `Assets`, `Blocks`)
- Bloques similares (p. ej., bloques custom existentes)
- Patrones similares (p. ej., patterns en `patterns/`)
- Uso de hooks similar (p. ej., `after_setup_theme`, `wp_enqueue_scripts`)

### Paso 2: Analizar patrones

Para cada componente similar encontrado:
- **Estructura**: ¿Cómo se organiza la clase? (final class, constructor, métodos)
- **Nombres**: ¿Qué convenciones de nombres se usan?
- **Hooks WordPress**: ¿Qué hooks y filters se usan?
- **Gestión de errores**: ¿Cómo se gestionan los errores?
- **Dependencias**: ¿Qué dependencias se inyectan?
- **Tipos de retorno**: ¿Qué devuelven los métodos?
- **Documentación**: ¿Qué patrones PHPDoc se usan?

### Paso 3: Documentar hallazgos

Antes de implementar, documentar:
- Qué patrones se seguirán
- Qué será similar vs. diferente
- Cualquier desviación y por qué
- Hooks/filters de WordPress a usar

### Paso 4: Aplicar patrones con consistencia

Al implementar:
- Seguir exactamente los patrones identificados
- Mantener consistencia con el código existente
- Usar APIs y funciones de WordPress
- Solo desviarse si hay un motivo claro y documentado

## Análisis de patrones específico de WordPress

### Antes de crear un nuevo bloque

1. **Revisar bloques existentes**
   - Revisar `theme/src/Blocks.php` para patrones de registro
   - Revisar archivos `block.json` existentes
   - Entender patrones de render callback
   - Revisar cómo se encolan assets para bloques

2. **Revisar block patterns**
   - Revisar `patterns/` para patrones similares
   - Entender estructura y registro de patterns
   - Revisar cómo usan bloques los patterns

3. **Revisar APIs de WordPress**
   - Revisar documentación de la Block API
   - Comprobar block supports disponibles
   - Entender atributos del bloque y funciones de guardado

### Antes de crear una nueva clase del theme

1. **Revisar clases existentes**
   - Revisar `theme/src/` para clases similares
   - Entender cómo registran hooks las clases
   - Revisar patrones de inyección de dependencias
   - Ver cómo se inicializan en `Kernel.php`

2. **Revisar hooks de WordPress**
   - Identificar hooks apropiados para la funcionalidad
   - Comprobar si se necesitan filters
   - Entender prioridad y dependencias del hook

## Integración con el flujo de trabajo

### Integración con baby steps

Antes de cada baby step:
1. Revisar código similar para ese paso concreto
2. Entender el patrón para ese tipo de cambio
3. Aplicar el patrón de forma consistente
4. Verificar que el cambio coincide con patrones existentes

### Integración con el flujo de Git

El análisis previo a la implementación debe ocurrir **antes** de crear la rama:
1. Revisar `git-workflow-standards.md`
2. Verificar requisitos del checklist
3. Crear rama como PRIMER paso
4. Después continuar con el análisis e implementación

## Ejemplos

### Ejemplo 1: Crear un nuevo bloque custom

**Antes de codificar:**
1. ✅ Revisar bloques existentes en `Blocks.php`
2. ✅ Entender estructura de `block.json`
3. ✅ Revisar patrones de render callback
4. ✅ Revisar encolado de assets para bloques
5. ✅ Revisar WordPress block API
6. ✅ Crear rama de feature
7. ✅ Después implementar siguiendo el patrón

### Ejemplo 2: Crear una nueva clase del theme

**Antes de codificar:**
1. ✅ Revisar clases similares (`Setup`, `Assets`, `Blocks`)
2. ✅ Entender patrones de registro de hooks
3. ✅ Ver cómo se instancian clases en `Kernel.php`
4. ✅ Revisar patrones de inyección de dependencias
5. ✅ Crear rama de feature
6. ✅ Después implementar siguiendo el patrón

### Ejemplo 3: Crear un nuevo block pattern

**Antes de codificar:**
1. ✅ Revisar patterns existentes en `patterns/`
2. ✅ Entender estructura de archivo de pattern
3. ✅ Revisar el registro del pattern
4. ✅ Revisar cómo usan bloques los patterns
5. ✅ Crear rama de feature
6. ✅ Después implementar siguiendo el patrón

### Ejemplo 4: Añadir un nuevo hook de WordPress

**Antes de codificar:**
1. ✅ Identificar el hook apropiado (`after_setup_theme`, `wp_enqueue_scripts`, etc.)
2. ✅ Revisar uso del hook en clases similares
3. ✅ Entender prioridad y dependencias del hook
4. ✅ Revisar patrones de callback
5. ✅ Crear rama de feature
6. ✅ Después implementar siguiendo el patrón

## Análisis de hooks y filters de WordPress

Al añadir nueva funcionalidad, analizar:

### Selección de hook
- **Action hooks**: Para ejecutar código en puntos específicos
- **Filter hooks**: Para modificar datos
- **Prioridad**: Por defecto es 10, ajustar si es necesario
- **Dependencias**: Asegurar que las dependencias están cargadas

### Hooks comunes en desarrollo de themes

**Configuración del theme:**
- `after_setup_theme` - Inicialización del theme
- `init` - Inicialización de WordPress
- `widgets_init` - Registro de widgets

**Assets:**
- `wp_enqueue_scripts` - Scripts/estilos del frontend
- `admin_enqueue_scripts` - Scripts/estilos del admin
- `enqueue_block_assets` - Assets del editor de bloques

**Contenido:**
- `the_content` - Filtrar contenido del post
- `wp_head` - Añadir a `<head>`
- `wp_footer` - Añadir al footer

### Patrón de registro de hooks

```php
// Bien - siguiendo el patrón existente
public function register(): void {
    add_action( 'after_setup_theme', [ $this, 'setup' ] );
}

public function setup(): void {
    // Implementación
}
```

## Anti-patrones a evitar

❌ **Empezar a codificar justo tras aprobar el plan**
- Hay que completar primero el análisis previo

❌ **Crear código sin revisar implementaciones similares**
- Encontrar y analizar código similar primero

❌ **Ignorar APIs de WordPress**
- Usar siempre funciones de WordPress en lugar de reinventar

❌ **Saltarse el checklist de flujo de Git**
- La creación de rama es obligatoria para features

❌ **Asumir patrones sin verificar**
- Verificar siempre patrones revisando código real

❌ **No revisar hooks/filters de WordPress**
- Revisar siempre la documentación para hooks adecuados

❌ **Hardcodear valores que deberían usar funciones de WordPress**
- Usar `get_template_directory()`, `get_stylesheet_directory()`, etc.

## Análisis específico de refactorización

Cuando se refactoriza código existente (no se implementan features nuevas), hace falta análisis adicional:

### Pasos obligatorios antes de refactorizar

1. **Encontrar todo el código relacionado**
   ```bash
   # Buscar referencias a una clase
   grep -r "ClassName" theme/ plugins/ mu-plugins/
   
   # Buscar uso de hooks
   grep -r "hook_name" theme/ plugins/ mu-plugins/
   
   # Buscar uso de filters
   grep -r "filter_name" theme/ plugins/ mu-plugins/
   ```

2. **Verificar la funcionalidad en WordPress**
   - Probar manualmente en entorno WordPress
   - Revisar el debug log de WordPress por errores
   - Verificar que los hooks siguen disparándose correctamente
   - Verificar que los filters siguen funcionando

3. **Documentar el comportamiento actual**
   - Nota: "La feature funciona en admin/frontend de WordPress"
   - **CRÍTICO**: Si la funcionalidad está rota, arreglarla ANTES de refactorizar
   - Nunca continuar con refactorización si el código actual no funciona

4. **Identificar cambios rompientes**
   - Listar métodos que se mueven o renombran
   - Listar hooks/filters que cambian
   - Listar dependencias que se modifican
   - Planificar cómo mantener compatibilidad hacia atrás

5. **Planificar la estrategia de refactor**
   - Para cambios de hooks: asegurar que siguen disparando en el momento correcto
   - Para cambios de clases: asegurar que se mantienen dependencias
   - Documentar la estrategia para cada cambio

### Checklist de verificación para refactorización

Antes de empezar a refactorizar, completar el checklist:
- [ ] Todo el código relacionado identificado
- [ ] Línea base establecida (la feature funciona en WordPress)
- [ ] Dependencias de hooks/filters comprobadas
- [ ] Estrategia de refactorización planificada

### Integración con baby steps

Al refactorizar en baby steps:
- Probar manualmente en WordPress tras CADA paso
- Revisar el debug log de WordPress tras cada cambio
- No acumular funcionalidad rota
- Ver `babysteps-principle.md` para más detalles

### Escenarios comunes de refactorización

**Escenario 1: Mover métodos a una nueva clase**
- Encontrar todas las referencias al método
- Revisar dependencias de hooks
- Planificar cómo mantener funcionalidad
- Mover código de forma incremental, probando en WordPress tras cada movimiento

**Escenario 2: Cambiar prioridades de hooks**
- Encontrar todos los lugares donde se usa el hook
- Revisar dependencias entre hooks
- Probar en WordPress tras cambiar la prioridad
- Verificar que la funcionalidad no se rompe

**Escenario 3: Extraer clase/componente**
- Encontrar todas las referencias al código original
- Revisar registros de hooks
- Crear nueva clase siguiendo patrones existentes
- Actualizar referencias de forma incremental
- Probar en WordPress tras cada cambio

## Verificación

Tras completar el análisis previo a la implementación, verificar:
- [ ] Checklist de flujo de Git completado (rama creada si aplica)
- [ ] Patrones de código similares identificados y analizados
- [ ] Hooks/filters de WordPress revisados
- [ ] Documentación revisada
- [ ] Dependencias entendidas
- [ ] Patrones documentados antes de implementar
- [ ] Si es refactor: línea base establecida y funcionalidad verificada en WordPress

Solo entonces proceder con el primer cambio de código.

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
