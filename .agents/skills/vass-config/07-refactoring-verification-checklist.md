---
title: Checklist de verificación de refactorización
alwaysApply: false
category: refactoring
globs:
  - "theme/**/*.php"
  - "plugins/**/*.php"
  - "mu-plugins/**/*.php"
  - "mu-plugins/*.php"
  - "patterns/**/*.php"
---
# Checklist de verificación de refactorización

## TL;DR

- [ ] Buscar todo el código relacionado con lo que se va a refactorizar
- [ ] Listar todos los archivos que pueden verse afectados
- [ ] Identificar hooks y filters de WordPress que podrían verse afectados
- [ ] Comprobar dependencias entre componentes
- [ ] Documentar todos los archivos y hooks afectados
## Propósito

Este documento define pasos de verificación obligatorios que DEBEN completarse antes, durante y después de cualquier refactorización. Esto asegura que la refactorización no rompa la funcionalidad existente en WordPress.

## Cuando aplica

- alwaysApply: false
- category: refactoring
- globs: "theme/**/*.php", "plugins/**/*.php", "mu-plugins/**/*.php", "mu-plugins/*.php", "patterns/**/*.php"

## Reglas

## Principio central

**NUNCA refactorizar sin establecer una línea base y verificar que WordPress funciona tras cada cambio.**

---

## OBLIGATORIO: Antes de cualquier refactorización

### Paso 1: Identificar impacto

- [ ] Buscar todo el código relacionado con lo que se va a refactorizar
  ```bash
  # Buscar referencias a una clase
  grep -r "ClassName" theme/ plugins/ mu-plugins/
  
  # Buscar uso de hooks
  grep -r "hook_name" theme/ plugins/ mu-plugins/
  
  # Buscar uso de filters
  grep -r "filter_name" theme/ plugins/ mu-plugins/
  
  # Buscar todos los archivos que usan una función
  grep -r "function_name" theme/ plugins/ mu-plugins/ patterns/
  ```

- [ ] Listar todos los archivos que pueden verse afectados
- [ ] Identificar hooks y filters de WordPress que podrían verse afectados
- [ ] Comprobar dependencias entre componentes
- [ ] Documentar todos los archivos y hooks afectados

### Paso 2: Establecer línea base

- [ ] Probar la funcionalidad actual en entorno WordPress
  - Probar en admin de WordPress (si aplica)
  - Probar en frontend
  - Revisar el debug log de WordPress por errores
  - Verificar que hooks/filters funcionan correctamente

- [ ] Documentar comportamiento actual
  - Ejemplo: "La feature funciona en admin/frontend de WordPress, sin errores en el debug log"
- [ ] **CRÍTICO**: Si la funcionalidad está rota, arreglarla ANTES de refactorizar
- [ ] No continuar con la refactorización si el código actual no funciona

### Paso 3: Analizar dependencias

- [ ] Comprobar dependencias de hooks WordPress
  ```bash
  # Encontrar todos los lugares donde se usa el hook
  grep -r "add_action.*hook_name" theme/ plugins/ mu-plugins/
  grep -r "do_action.*hook_name" theme/ plugins/ mu-plugins/
  ```

- [ ] Comprobar dependencias de filters
  ```bash
  # Encontrar todos los lugares donde se usa el filter
  grep -r "add_filter.*filter_name" theme/ plugins/ mu-plugins/
  grep -r "apply_filters.*filter_name" theme/ plugins/ mu-plugins/
  ```

- [ ] Identificar hooks/filters de WordPress que necesitarán actualización
- [ ] Documentar qué hooks/filters requieren cambios
- [ ] Planificar cómo mantener compatibilidad hacia atrás si es necesario

### Paso 4: Planificar estrategia de refactorización

- [ ] Para cada componente afectado, planificar cómo refactorizar
- [ ] Decidir: actualizar hooks/filters o mantener compatibilidad
- [ ] Documentar la estrategia para cada cambio
- [ ] Crear un checklist de cambios necesarios

---

## OBLIGATORIO: Durante la refactorización

### Tras cada baby step

- [ ] Probar en WordPress inmediatamente tras cada cambio
  - Probar en admin de WordPress (si aplica)
  - Probar en frontend
  - Revisar el debug log de WordPress por errores
  - Verificar que hooks/filters siguen funcionando

- [ ] Ejecutar controles de calidad
  ```bash
  ./vendor/bin/phpcs
  ./vendor/bin/phpstan analyse  # si está disponible
  ```

- [ ] Verificar que la funcionalidad de WordPress sigue funcionando
- [ ] **CRÍTICO**: No continuar al siguiente paso hasta que WordPress funcione
- [ ] Hacer commit solo cuando WordPress esté verificado

### Estrategia de corrección

Cuando WordPress se rompe por una refactorización:

1. **Si cambió el hook**: Verificar que el hook sigue disparando en el momento correcto
2. **Si cambió el filter**: Verificar que el filter sigue modificando datos correctamente
3. **Si se movió un método**: Verificar que todas las referencias se actualizaron
4. **Si se renombró una clase**: Verificar que todas las referencias se actualizaron
5. **Si cambió una dependencia**: Verificar que las dependencias siguen disponibles

---

## OBLIGATORIO: Después de la refactorización

### Verificación final

- [ ] Probar toda la funcionalidad afectada en WordPress
  - Probar en admin de WordPress (si aplica)
  - Probar en frontend
  - Revisar el debug log de WordPress por errores
  - Verificar que hooks/filters funcionan correctamente

- [ ] Ejecutar controles de calidad
  ```bash
  ./vendor/bin/phpcs
  ./vendor/bin/phpstan analyse  # si está disponible
  ```

- [ ] Verificar que no se introdujeron regresiones
- [ ] Comparar funcionalidad con la línea base
  - Ejemplo: "Después de refactorizar: la feature funciona en admin/frontend de WordPress, sin errores en el debug log (igual que la línea base)"
- [ ] Documentar cambios realizados
- [ ] Actualizar mensaje de commit para mencionar verificación

### Documentación

- [ ] Documentar cambios rompientes
- [ ] Actualizar documentación si hace falta
- [ ] Anotar mejoras realizadas durante la refactorización

---

## Anti-patrones (NUNCA hacer esto)

❌ **Refactorizar sin probar WordPress primero**
- Establece siempre la línea base antes de cambiar código

❌ **Mover código sin revisar dependencias de hooks/filters**
- Hooks y filters se rompen cuando se mueve o renombra el código

❌ **Asumir que WordPress funcionará tras refactorizar**
- Verifica siempre, nunca asumas

❌ **Acumular funcionalidad rota "para arreglar después"**
- Corrige problemas inmediatamente tras cada cambio

❌ **Hacer commit de refactor sin verificación en WordPress**
- La funcionalidad de WordPress debe funcionar antes del commit

❌ **Saltarse verificación en WordPress "porque es solo un refactor"**
- Refactorizar puede romper WordPress igual que código nuevo

---

## Integración con otros estándares

### Con el principio de baby steps

- Probar en WordPress tras CADA baby step
- No continuar al siguiente paso hasta que WordPress funcione
- Ver `babysteps-principle.md` para detalles

### Con el análisis previo a la implementación

- Antes de refactorizar, completar el análisis previo
- Identificar todos los componentes afectados (código + hooks/filters)
- Ver `pre-implementation-analysis.md` para análisis específico de refactorización

### Con estándares WordPress

- Seguir estándares de codificación de WordPress durante la refactorización
- Usar APIs y funciones de WordPress
- Ver `wordpress-standards.md` para guías

---

## Ejemplos

### Ejemplo 1: Mover métodos a una nueva clase

**Antes:**
```php
// Assets.php
private function enqueueParallax(): void { ... }
```

**Después:**
```php
// Parallax.php
public function enqueue(): void { ... }
```

**Pasos de verificación:**
1. ✅ Encontrar referencias: `grep -r "enqueueParallax" theme/ plugins/ mu-plugins/`
2. ✅ Probar línea base: verificar que el parallax funciona en WordPress
3. ✅ Comprobar dependencias de hooks: `grep -r "wp_enqueue_scripts" theme/ plugins/ mu-plugins/`
4. ✅ Tras mover el código, probar en WordPress de nuevo
5. ✅ Verificar que el parallax sigue funcionando en frontend
6. ✅ Revisar el debug log de WordPress por errores

### Ejemplo 2: Cambiar nombre de hook

**Antes:**
```php
add_action( 'after_setup_theme', [ $this, 'setup' ] );
```

**Después:**
```php
add_action( 'init', [ $this, 'setup' ] );
```

**Pasos de verificación:**
1. ✅ Encontrar uso de hooks: `grep -r "after_setup_theme" theme/ plugins/ mu-plugins/`
2. ✅ Probar línea base: verificar que setup funciona en WordPress
3. ✅ Comprobar prioridad y dependencias del hook
4. ✅ Tras cambiar el hook, probar en WordPress
5. ✅ Verificar que setup sigue funcionando correctamente
6. ✅ Revisar el debug log de WordPress por errores

### Ejemplo 3: Renombrar bloque

**Antes:**
```php
register_block_type( 'prisa-media/old-block', [ ... ] );
```

**Después:**
```php
register_block_type( 'prisa-media/new-block', [ ... ] );
```

**Pasos de verificación:**
1. ✅ Encontrar referencias del bloque: `grep -r "old-block" theme/ plugins/ mu-plugins/ patterns/`
2. ✅ Probar línea base: verificar que el bloque funciona en el editor de WordPress
3. ✅ Revisar archivos block.json y patterns
4. ✅ Tras renombrar, probar en el editor de WordPress
5. ✅ Verificar que el bloque sigue funcionando y aparece correctamente
6. ✅ Revisar el debug log de WordPress por errores

---

## Resumen del checklist de verificación

Antes de refactorizar:
- [ ] Todo el código relacionado identificado
- [ ] Línea base establecida (WordPress funciona)
- [ ] Dependencias de hooks/filters comprobadas
- [ ] Estrategia de refactorización planificada

Durante la refactorización:
- [ ] WordPress probado tras cada paso
- [ ] Funcionalidad rota corregida inmediatamente
- [ ] No se acumuló funcionalidad rota
- [ ] Controles de calidad pasan

Después de refactorizar:
- [ ] Toda la funcionalidad afectada funciona en WordPress
- [ ] Sin errores en el debug log de WordPress
- [ ] Sin regresiones
- [ ] Cambios documentados

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
