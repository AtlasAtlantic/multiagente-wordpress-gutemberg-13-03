---
title: Principio de baby steps
alwaysApply: true
category: workflow
---
# Principio de baby steps

## TL;DR

- Lo puedas completar en minutos
- Lo puedas explicar en una frase
- No requiera mantener un modelo mental grande
- Los controles de calidad pasan (PHPCS, PHPStan si están disponibles)
- El sitio WordPress carga sin errores
## Propósito

Este documento define el principio de baby steps: dividir el trabajo en micro-pasos que produzcan un estado válido y funcional tras cada paso, con verificación obligatoria y límites de tamaño de commit.

## Cuando aplica

- alwaysApply: true
- category: workflow

## Reglas

## 1. Dividir el trabajo en micro-pasos

Un "paso" debe ser tan pequeño que:
- Lo puedas completar en minutos
- Lo puedas explicar en una frase
- No requiera mantener un modelo mental grande

**Ejemplo:**  
❌ "Implementar bloque custom para la sección hero"  
✔ "Registrar el tipo de bloque en WordPress"  
✔ "Añadir metadatos en block.json"  
✔ "Crear la función de render callback"  
✔ "Añadir estilos del bloque"

---

## 2. Cada paso debe producir un estado válido y funcional

Después de cada paso:

- Los controles de calidad pasan (PHPCS, PHPStan si están disponibles)
- El sitio WordPress carga sin errores
- No hay errores PHP en el debug log
- La feature funciona en el entorno WordPress
- Sin hacks parciales
- Sin estado temporal roto

Esto aporta **seguridad continua**.

---

## 3. Hacer commit tras cada paso pequeño

**Checklist obligatorio antes de cada commit**:
- [ ] Ejecutar `./vendor/bin/phpcs` para WordPress Coding Standards (SIEMPRE primero)
- [ ] Ejecutar `./vendor/bin/phpstan analyse` si está disponible
- [ ] Probar manualmente en entorno WordPress (admin y frontend)
- [ ] Revisar el debug log de WordPress (`WP_DEBUG_LOG`)
- [ ] Revisar cualquier error de comandos previos
- [ ] Si un commit falla con "❌ PHPCS" u otros errores, **PARAR** y corregir
- [ ] Solo seguir con `git add` y `git commit` cuando todo pase
- [ ] No continuar haciendo commits si los anteriores fallaron: revisar el motivo primero

**Tras cambios en base de datos - paso obligatorio**:
- [ ] **SIEMPRE** verificar que los cambios en base de datos funcionan en WordPress
- [ ] Probar con datos reales si aplica
- [ ] Revisar el debug log por errores de base de datos
- [ ] Solo continuar con cambios de código tras verificar la base de datos
- [ ] **Anti-patrón**: Crear cambios de base de datos y seguir sin verificar

## 3.1. Límites de tamaño de commit - REGLAS DURAS

**Un commit NO DEBE superar estos límites**:
- **Máximo de archivos cambiados**: **5 archivos** por commit
- **Máximo de líneas cambiadas**: **200 líneas** (altas + bajas)
- **Máximo de componentes**: **1 tipo de componente** por commit (p. ej., solo clases, o solo plantillas, o solo assets)

**Qué cuenta como "un tipo de componente"**:
- Clases PHP (Setup, Assets, Blocks, etc.) = un tipo
- Plantillas (HTML en `templates/`, `parts/`) = un tipo
- Patterns (PHP en `patterns/`) = un tipo
- Assets (CSS, JS, SCSS) = un tipo
- Archivos de configuración (`theme.json`, `composer.json`, etc.) = un tipo

**Ejemplos de commits válidos:**
✅ `feat: create Setup class for theme initialization` (1 archivo: Setup.php)  
✅ `feat: add hero-parallax block pattern` (1 archivo: patterns/hero-parallax.php)  
✅ `feat: add enqueueFrontend method to Assets class` (1 archivo: Assets.php, ~50 líneas)  
✅ `refactor: update theme.json color palette` (1 archivo: theme.json, ~20 líneas)

**Ejemplos de commits INVÁLIDOS (demasiado grandes):**
❌ `feat: implement full block theme` (múltiples archivos: clases, plantillas, patterns, assets)  
❌ `feat: add custom blocks feature` (múltiples componentes: Blocks.php, block.json, plantillas, estilos)  
❌ `refactor: update all theme classes and templates` (múltiples tipos de componente)

**Si tus cambios superan estos límites:**
1. **PARA** - No hagas commit
2. Divide el trabajo en commits más pequeños
3. Cada commit debe ser verificable de forma independiente (WordPress funciona, sin errores)
4. Commitea de forma incremental: una pieza pequeña cada vez

**Un commit debe capturar:**
- Un comportamiento
- Una mejora
- Un refactor
- **UN paso pequeño**

Esto aporta:
- Historial limpio
- Rollback fácil
- Revisión clara
- Mejor colaboración
- Depuración más simple (se puede bisectar a un cambio pequeño)

---

## 4. Evitar saltos mentales de varios pasos

Nunca hagas esto:

> "Ya que estoy aquí, también arreglo X, mejoro Y, reescribo Z..."

Esto causa:

- Bugs
- Regresiones ocultas
- Cambio de contexto
- Responsabilidades mezcladas
- Depuración más difícil

Mantén la disciplina:  
**Un paso.  
Luego verificar.  
Luego continuar.**

---

## 5. Desarrollo guiado por tests (TDD) - Condicional

**REGLA CRÍTICA**: Cuando exista infraestructura de tests, escribe SIEMPRE los tests ANTES y luego implementa.

**Ciclo TDD (cuando hay infraestructura de tests):**

1. **ROJO**: Escribe un test que falle
   - El test debe describir el comportamiento deseado
   - El test debe fallar por la razón correcta (la feature aún no existe)
   - Ejecuta los tests y confirma el fallo

2. **VERDE**: Escribe el mínimo código para pasar el test
   - Solo el código necesario para pasar
   - Sin optimizar ni refactorizar aún
   - Ejecuta los tests y confirma que pasan

3. **REFACTOR**: Mejora el código manteniendo los tests en verde
   - Limpia el código
   - Elimina duplicación
   - Mejora estructura
   - Los tests deben seguir pasando tras refactorizar

**Cuando no hay tests:**
- Escribe código siguiendo patrones de WordPress
- Prueba manualmente en entorno WordPress de inmediato
- Verifica en admin y frontend
- Revisa el debug log de WordPress
- Haz commit solo tras verificación manual correcta

**Anti-patrones a evitar:**
❌ Escribir código primero y tests después (cuando hay tests)  
❌ Escribir todos los tests de golpe y luego todo el código  
❌ Saltarse verificación por "cambios simples"  
❌ No probar manualmente en WordPress cuando no hay tests

**Flujo correcto:**
✅ Escribir un test → Ver fallo → Escribir mínimo código → Ver pasar → Commit (si hay tests)  
✅ Escribir código → Probar manualmente en WordPress → Verificar → Commit (si no hay tests)  
✅ Luego siguiente paso → Repetir

---

## 6. Verificación tras cada baby step

Cada vez que completes un paso:
- Ejecuta PHPCS (WordPress Coding Standards) - DEBE pasar
- Ejecuta PHPStan si está disponible - DEBE pasar
- Prueba manualmente en entorno WordPress
- Revisa el debug log de WordPress (`WP_DEBUG_LOG`)
- Revisa la consola del navegador por errores JavaScript (si aplica)
- Verifica que la feature funciona como se espera
- **Verifica que no se superan los límites de tamaño de commit**

Esto evita encadenar errores.

### Checklist de verificación WordPress

Después de CADA baby step, ANTES de commitear:

1. **Controles de calidad de código**
   ```bash
   # WordPress Coding Standards
   ./vendor/bin/phpcs
   
   # Análisis estático (si está disponible)
   ./vendor/bin/phpstan analyse
   ```

2. **Pruebas manuales en WordPress**
   - Probar en admin de WordPress (si aplica)
   - Probar en frontend
   - Verificar que no hay errores PHP en el debug log
   - Revisar consola del navegador por errores JavaScript (si aplica)
   - Verificar diseño responsive (si aplica)

3. **Documentar el estado de verificación**
   - Nota: "Todos los checks OK, WordPress verificado" o "X errores encontrados, corrigiendo..."
   - Solo commitear cuando el estado sea "Todos los checks OK"
   - Incluir el estado de verificación en el mensaje de commit si aplica

### Anti-patrones

❌ **Continuar al siguiente paso con checks fallando**
- Corrige siempre antes de continuar

❌ **Acumular código roto "para arreglar después"**
- Corrige inmediatamente tras cada cambio

❌ **Saltarse verificación en WordPress "porque es un cambio pequeño"**
- Cada cambio puede romper WordPress, siempre verificar

---

## 7. Revisión de patrones antes de cada paso

Antes de iniciar cada baby step:
- Revisa código similar para ese tipo de cambio
- Entiende el patrón usado en el codebase para esa operación
- Verifica consistencia con patrones WordPress existentes (hooks, filters, estructura del theme)
- Solo entonces implementa siguiendo el patrón identificado

Esto asegura consistencia y reduce la necesidad de refactorizar más tarde.

---

## 8. PHPStan: añadir solo lo necesario y suficiente

Al corregir errores de PHPStan, sigue el **principio de lo mínimo necesario**:

### ❌ No hagas esto:
- Añadir anotaciones `@property` a todas las clases de una vez
- Ignorar todos los errores con patrones genéricos
- Añadir type hints innecesarios en todas partes

### ✅ Haz esto:
- Corregir un error cada vez
- Añadir la anotación mínima necesaria para ese error
- Añadir `@property` solo cuando PHPStan reporte propiedades indefinidas
- Verificar que PHPStan pasa tras cada fix antes de continuar

### Ejemplo — Corregir errores de PHPStan en baby steps:

**Paso 1:** Arreglar `Assets.php` línea 19
```php
// Añadir solo la anotación necesaria para este error concreto
/** @var Parallax $parallax */
$this->parallax = new Parallax();
```

**Paso 2:** Verificar que PHPStan pasa para este archivo
```bash
./vendor/bin/phpstan analyse theme/src/Assets.php
```

**Paso 3:** Hacer commit de este fix
```bash
git commit -m "fix: add type annotation in Assets for PHPStan"
```

**Paso 4:** Pasar al siguiente error en el siguiente archivo

### Checklist de verificación:

Tras corregir un error de PHPStan:
1. ✅ Ejecutar PHPStan en el archivo concreto
2. ✅ Verificar que el error desapareció
3. ✅ Ejecutar PHPStan completo para asegurar que no hay nuevos errores (si está disponible)
4. ✅ Probar manualmente en WordPress para asegurar que no se rompió nada
5. ✅ Hacer commit del fix

---

## 9. La refactorización también sigue micro-pasos

Incluso al refactorizar:  
❌ "Reescribir toda la estructura del theme"  
✔ "Extraer método para encolar assets"  
✔ "Renombrar variable para aclarar intención"  
✔ "Mover clase al namespace correcto"

Refactorizaciones pequeñas mantienen el sistema estable.

### 9.1. Excepción: refactorización guiada por patrones para cambios repetitivos

**IMPORTANTE**: Baby steps es el enfoque por defecto, pero cuando haya refactorizaciones mecánicas y repetitivas:

**Cuándo usar el enfoque de patrones (NO baby steps):**
- ✅ El MISMO cambio es necesario en **≥5 archivos**
- ✅ El cambio es **mecánico/sintáctico** (no lógico)
- ✅ Es un **rename** o **cambio de nombre de hook/filter**

**Ejemplos:**
- Renombrar un callback de hook `after_setup_theme` en 10 archivos
- Cambiar `get_template_directory()` → `get_stylesheet_directory()` en 15 archivos
- Actualizar el text domain de `old-textdomain` → `prisa-media` en 20 archivos

**Proceso:**
1. **PARA** tras corregir 3-5 archivos con el mismo cambio
2. **Identifica** el patrón exacto usando `grep`
3. **Aplica** el patrón a TODOS los archivos afectados de una vez (busca/reemplaza en IDE)
4. **Verifica** manualmente en WordPress y commitea

**Cuándo NO usar esta excepción:**
- ❌ Los cambios implican lógica distinta en cada archivo
- ❌ No estás seguro de que el patrón sea el mismo en todos
- ❌ Es funcionalidad nueva (no refactor)
- ❌ Menos de 5 archivos afectados (usa baby steps)

**Más info:** Ver `.codex/rules/06-pattern-driven-refactoring.md` para la guía completa.

---

## 10. La asistencia de IA refuerza este principio

Cuando programas con herramientas como Cursor:

- Los baby steps ayudan a la IA a entender contexto
- Reduce alucinaciones
- Hace diffs limpios
- Permite iteración controlada
- Evita perder el control del codebase

Cuanto más pequeño sea el cambio, más precisa será la IA.

---

# Ejemplos prácticos

### Ejemplo A — Crear un bloque custom

En lugar de:

❌ _"Crear un bloque custom completo con todas las features"_

Haz:

1. Registrar el tipo de bloque en WordPress
2. Crear el fichero `block.json` con metadatos
3. Añadir el registro del bloque en `Blocks.php`
4. Crear la función de render callback
5. Añadir estilos del bloque (CSS)
6. Añadir script del editor del bloque (si aplica)
7. Probar en el editor de bloques de WordPress
8. Probar en frontend

Cada punto es un baby step.

---

### Ejemplo B — Construir una feature del theme WordPress

❌ _"Crear toda la configuración del theme con todas las features"_

✔ Hazlo en baby steps:

1. Crear la clase `Setup.php`
2. Añadir el hook `after_setup_theme`
3. Añadir soporte para `title-tag`
4. Añadir soporte para `post-thumbnails`
5. Registrar menús de navegación
6. Cargar el text domain
7. Probar cada feature en WordPress

Cada paso se verifica de forma independiente.

---

# Beneficios

- Menos bugs
- Depuración más rápida
- Código más claro
- Progreso fiable
- Refactorizaciones más seguras
- Amigable para herramientas IA
- Mejor colaboración de equipo
- Rollback fácil
- Reduce el agobio

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
