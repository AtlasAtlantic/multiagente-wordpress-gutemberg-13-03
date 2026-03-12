---
title: Estándares de pruebas
alwaysApply: true
category: testing
globs:
  - "theme/**/*.php"
  - "plugins/**/*.php"
  - "mu-plugins/**/*.php"
  - "mu-plugins/*.php"
  - "tests/**/*.php"
---
# Estándares de pruebas

## TL;DR

- **Desarrollo guiado por tests (TDD)**: Cuando hay infraestructura de tests, escribir tests en rojo primero y luego implementar
- **Verificación manual**: Cuando no hay tests, verificar manualmente en entorno WordPress antes y después de los cambios
- **Un concepto por verificación**: Cada verificación debe probar un solo comportamiento
- **Aislamiento**: Las verificaciones no deben depender entre sí
- **Verificación significativa**: Nombres/descripciones deben explicar claramente qué se prueba



## Propósito

Este documento define estándares de pruebas y verificación para desarrollo WordPress, garantizando verificación completa, código mantenible y patrones consistentes.

## Cuando aplica

- alwaysApply: true
- category: testing
- globs: "theme/**/*.php", "plugins/**/*.php", "mu-plugins/**/*.php", "mu-plugins/*.php", "tests/**/*.php"

## Reglas

## Visión general

Este documento define estándares de pruebas y verificación para desarrollo de themes WordPress. Cuando existe infraestructura de tests se usan tests automatizados. Cuando no hay tests, es obligatoria la verificación manual en entorno WordPress.

## Principios fundamentales de verificación

- **Desarrollo guiado por tests (TDD)**: Cuando hay infraestructura de tests, escribir tests en rojo primero y luego implementar
- **Verificación manual**: Cuando no hay tests, verificar manualmente en entorno WordPress antes y después de los cambios
- **Un concepto por verificación**: Cada verificación debe probar un solo comportamiento
- **Aislamiento**: Las verificaciones no deben depender entre sí
- **Verificación significativa**: Nombres/descripciones deben explicar claramente qué se prueba
- **Ejecución rápida**: Los tests automatizados deben ser rápidos; la verificación manual debe ser sistemática
- **Depuración vs validación**: `--ui` y `--headed` son solo para depurar; la validación final debe ser headless y dirigida
- **Prohibición de suite completa**: no ejecutar `npx playwright test` sin ruta o `--grep`; siempre debe ser dirigido

---

## Cuando existe infraestructura de tests

### Desarrollo guiado por tests (TDD)

**Cuando hay infraestructura de tests disponible:**

1. **ROJO**: Escribe un test que falle
   - El test debe describir el comportamiento deseado
   - El test debe fallar por la razón correcta (la feature aún no existe)
   - Ejecuta los tests y comprueba que fallan

2. **VERDE**: Escribe el código mínimo para pasar el test
   - Escribe solo lo necesario para pasar el test
   - No optimices ni refactorices todavía
   - Ejecuta los tests y comprueba que pasan

3. **REFACTOR**: Mejora el código manteniendo los tests en verde
   - Limpia el código
   - Elimina duplicación
   - Mejora la estructura
   - Los tests deben seguir pasando tras refactorizar

### Estructura de tests

**Patrón Arrange-Act-Assert:**
```php
it('registers custom block correctly', function () {
    // Arrange - Preparar el entorno de WordPress
    // (mocks, fixtures, etc.)
    
    // Act - Ejecutar la funcionalidad
    $blocks = new Blocks();
    $blocks->register();
    
    // Assert - Verificar el resultado
    expect(has_block('prisa-media/custom-block'))->toBeTrue();
});
```

### Organización de tests

**Dónde colocar los tests:**
```
tests/
├── Unit/                      # Tests unitarios (componentes aislados)
│   ├── Classes/
│   └── Functions/
└── Feature/                   # Tests de integración y de feature
    ├── Blocks/
    └── Theme/
```

---

## Cuando no existe infraestructura de tests

### Verificación manual en WordPress

**OBLIGATORIO**: Cuando no hay tests, la verificación manual es obligatoria:

1. **Antes de los cambios**: Establecer línea base
   - Probar la funcionalidad actual en WordPress
   - Documentar el comportamiento actual
   - Revisar el debug log de WordPress por errores

2. **Tras cada cambio**: Verificar inmediatamente
   - Probar en admin de WordPress (si aplica)
   - Probar en frontend
   - Revisar el debug log de WordPress por errores
   - Verificar que hooks/filters funcionan correctamente

3. **Tras completar la feature**: Verificación final
   - Probar toda la funcionalidad afectada
   - Verificar que no hay regresiones
   - Revisar el debug log de WordPress
   - Probar en varios navegadores (si aplica)

### Checklist de verificación manual

**Para nuevas features:**
- [ ] La feature funciona en admin de WordPress (si aplica)
- [ ] La feature funciona en frontend
- [ ] Sin errores PHP en el debug log de WordPress
- [ ] Sin errores JavaScript en consola (si aplica)
- [ ] Diseño responsive funciona (si aplica)
- [ ] Pruebas cross-browser completadas (si aplica)

**Para refactorización:**
- [ ] Línea base establecida (la feature funcionaba antes)
- [ ] La feature sigue funcionando tras refactorizar
- [ ] Sin errores nuevos en el debug log de WordPress
- [ ] Hooks/filters siguen funcionando correctamente
- [ ] No se han introducido regresiones

---

## Checklist de verificación para nuevas features

Al implementar una nueva feature, asegúrate de:

### Calidad de código
- [ ] PHPCS pasa (WordPress Coding Standards)
- [ ] PHPStan pasa (si está disponible)
- [ ] El código sigue patrones WordPress
- [ ] Hooks/filters usados correctamente

### Funcionalidad WordPress
- [ ] La feature funciona en admin de WordPress (si aplica)
- [ ] La feature funciona en frontend
- [ ] Sin errores PHP en el debug log de WordPress
- [ ] Sin errores JavaScript en consola (si aplica)
- [ ] Diseño responsive funciona (si aplica)

### Tests automatizados (si existe infraestructura de tests)
- [ ] Tests unitarios escritos para clases/métodos
- [ ] Tests de integración escritos para flujos
- [ ] Todos los tests pasan
- [ ] Tests usan estructura Arrange-Act-Assert
- [ ] Tests aislados e independientes

### Verificación manual (si no hay infraestructura de tests)
- [ ] Pruebas manuales realizadas en WordPress
- [ ] Todos los flujos de usuario probados
- [ ] Casos límite probados manualmente
- [ ] Condiciones de error probadas manualmente

---

## Verificación específica de WordPress

### Desarrollo de bloques

**Al crear bloques custom:**
- [ ] El bloque aparece en el inserter
- [ ] El bloque se puede añadir al contenido
- [ ] Los atributos del bloque funcionan correctamente
- [ ] El bloque renderiza bien en frontend
- [ ] Los estilos del bloque cargan correctamente
- [ ] Los scripts del editor funcionan (si aplica)

### Features del theme

**Al añadir features del theme:**
- [ ] La feature funciona con WordPress core
- [ ] La feature no entra en conflicto con plugins
- [ ] La feature sigue WordPress Coding Standards
- [ ] La feature usa hooks de WordPress apropiados
- [ ] La feature está correctamente internacionalizada

### Verificación de hooks y filters

**Al añadir hooks/filters:**
- [ ] El hook se dispara en el momento correcto
- [ ] El filter modifica los datos correctamente
- [ ] La prioridad del hook es apropiada
- [ ] Las dependencias están cargadas antes de que dispare el hook
- [ ] No hay conflictos con otros hooks/filters

---

## Anti-patrones a evitar

❌ **Saltarse la verificación "porque es simple"**
- Cada cambio necesita verificación

❌ **Verificar solo en un entorno**
- Probar en admin y frontend

❌ **Ignorar el debug log de WordPress**
- Revisar siempre los errores

❌ **No probar casos límite**
- Probar con datos vacíos, valores nulos, etc.

❌ **Asumir que los tests cubren todo**
- La verificación manual sigue siendo importante incluso con tests

---

## Integración con otros estándares

### Con el principio de baby steps
- Verificar tras CADA baby step
- No continuar hasta que pase la verificación
- Ver `babysteps-principle.md` para detalles

### Con el análisis previo a la implementación
- Planificar la estrategia de verificación antes de codificar
- Identificar qué hay que verificar
- Ver `pre-implementation-analysis.md` para detalles

### Con estándares WordPress
- Seguir WordPress Coding Standards
- Usar APIs y funciones de WordPress
- Ver `wordpress-standards.md` para guías

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
