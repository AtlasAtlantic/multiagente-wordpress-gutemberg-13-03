---
title: Estándares de flujo de Git
alwaysApply: true
category: workflow
---
# Estándares de flujo de Git

## TL;DR

- **Trabajar en la rama `main`**: Permitido para cambios pequeños y no críticos como:
- Correcciones de typos en comentarios o documentación
- Ajustes menores de formato
- Pequeños ajustes de configuración
- Fixes rápidos que no requieren tests



## Propósito

Este documento define los estándares de flujo de Git, incluyendo estrategia de ramas, guías de commits y el proceso de pull request para el proyecto.

## Cuando aplica

- alwaysApply: true
- category: workflow

## Reglas

## 1. Estrategia de ramas

- **Trabajar en la rama `main`**: Permitido para cambios pequeños y no críticos como:
    - Correcciones de typos en comentarios o documentación
    - Ajustes menores de formato
    - Pequeños ajustes de configuración
    - Fixes rápidos que no requieren tests
    - Actualizaciones solo de documentación

- **Crear una rama de feature**: Obligatorio para:
    - Nuevas features o funcionalidad
    - Refactorizaciones significativas
    - Cambios que requieran tests
    - Nuevos bloques, patterns o clases de theme
    - Cualquier cambio que afecte a la funcionalidad de WordPress
    - Cambios que afecten a múltiples archivos o requieran varios commits

## 2. Convención de nombres de ramas

Las ramas de feature deben seguir este patrón:
```
feature/TICKET-ID-short-description
```

Ejemplos:
- `feature/TICKET-9-add-custom-block`
- `feature/TICKET-12-update-theme-setup`
- `fix/TICKET-15-fix-asset-enqueuing`

## 3. Pasos del flujo de trabajo

Al empezar a trabajar en una feature:

1. **Crear rama desde main** (como primer paso, antes de cualquier cambio de código):
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/TICKET-ID-short-description
   ```

2. **Hacer cambios siguiendo el principio de baby steps**:
   - Un cambio pequeño cada vez
   - Commit tras cada paso verificado
   - **Antes de commitear**: **SIEMPRE ejecutar PHPCS primero**:
     ```bash
     ./vendor/bin/phpcs
     # o para archivos específicos:
     ./vendor/bin/phpcs path/to/file.php
     ```
   - **Después** ejecutar PHPStan si está disponible:
     ```bash
     ./vendor/bin/phpstan analyse
     ```
   - **Después** probar manualmente en entorno WordPress
   - **Solo cuando** PHPCS pasa y la verificación en WordPress es correcta, continuar con `git add` y `git commit`
   - El hook pre-commit ejecuta estos checks automáticamente y bloquea el commit si fallan
   - **IMPORTANTE**: Si un commit falla con "❌ PHPCS" u otros errores:
     - **PARA** y revisa la salida de error
     - **NO** continúes haciendo más commits
     - Arregla los problemas primero y luego reintenta el commit
     - Comprueba por qué fallaron los commits anteriores antes de intentar nuevos

3. **Requisitos del hook pre-commit**:
   - **PHPCS** (WordPress Coding Standards) debe pasar
   - **PHPStan** (análisis estático) debe pasar (si está disponible)
   - **Tests** deben pasar (si hay infraestructura de tests)
   - Si cualquier check falla, el commit se bloquea
   - Arregla los problemas antes de volver a intentar el commit
   - Puedes ejecutar los checks manualmente: `./vendor/bin/phpcs`, `./vendor/bin/phpstan analyse`, tests (si existen)

   **Excepción: usar `--no-verify` en commits solo de documentación**:
   - **OBLIGATORIO**: Usar `--no-verify` cuando el commit contiene SOLO archivos no de código
   - **Archivos no de código**: `.md`, `.md`, `.txt`, `.yml`, `.yaml`, `.json` (solo config), `.sh`, `.gitignore`, `.env.example`, `README`, `LICENSE`
   - **Archivos de código**: `.php`, `.js`, `.ts`, `.vue`, `.css`, `.scss`, `.xml`
   - **Regla**: Si el commit tiene CUALQUIER archivo de código → hooks normales. Si tiene SOLO archivos no de código → `--no-verify`
   - **Justificación**: Cambios de documentación no necesitan checks de formato/análisis de código, se comitea más rápido
   - **Ejemplo**: `git commit --no-verify -m "docs: update README"` (solo README.md cambia)
   - **Ejemplo**: `git commit -m "feat: add custom block"` (incluye .php, se ejecutan hooks)

4. **Commitear con frecuencia y mensajes claros**:
   - **OBLIGATORIO**: Seguir límites de tamaño de commit (ver `babysteps-principle.md` sección 3.1)
   - **Máximo**: 5 archivos, 200 líneas, 1 tipo de componente por commit
   - Usar formato de conventional commits: `type: description`
   - Tipos: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `style:`
   - Ejemplo: `feat: add custom block registration`
   - **Antes de commitear**: Revisar tamaño de commit con `git diff --stat`
   - **Si es demasiado grande**: dividir en commits más pequeños

5. **Hacer push de la rama regularmente**:
   ```bash
   git push -u origin feature/TICKET-ID-short-description
   ```

6. **Crear Pull Request** cuando la feature esté completa y verificada en WordPress

7. **Merge a main** tras review y aprobación del PR

## 4. Guías para mensajes de commit

- Usar inglés en todos los mensajes de commit
- Seguir formato de conventional commits: `type: description`
- Mantener la primera línea por debajo de 72 caracteres
- Ser específico y descriptivo
- Referenciar el ticket si aplica: `feat(TICKET-9): add custom block`

## 5. Hook pre-commit

El proyecto tiene un **hook pre-commit** configurado que ejecuta automáticamente:
- **PHPCS** (WordPress Coding Standards) para formato de código
- **PHPStan** para análisis estático (si está disponible)
- **Tests** (si hay infraestructura de tests)

**Importante**: Todos los checks deben pasar antes de permitir un commit. Si alguno falla:
1. **PARA** - No continúes con más commits
2. Revisa la salida de error (busca "❌ PHPCS", "❌ PHPStan", "❌ Tests")
3. Arregla los problemas reportados
4. Ejecuta los checks manualmente para verificar:
   ```bash
   ./vendor/bin/phpcs            # WordPress Coding Standards
   ./vendor/bin/phpstan analyse  # Análisis estático (si está disponible)
   # Ejecuta tests si existen
   ```
5. **Solo después** de que todo pase manualmente, intenta commitear otra vez
6. Si fallan varios commits, ejecuta PHPCS sobre todos los archivos cambiados: `./vendor/bin/phpcs`

**Error común a evitar**:
- ❌ Intentar varios commits sin revisar por qué fallaron los anteriores
- ❌ Crear un commit grande cuando se planearon commits lógicos más pequeños
- ✅ Ejecutar PHPCS primero, luego commitear
- ✅ Revisar la salida del comando - si hay errores, corregir antes de reintentar

Esto asegura calidad de código y evita comitear código roto.

## 6. Checklist antes de empezar a trabajar

Antes de hacer cambios de código, verificar:
- [ ] Plan creado y aprobado
- [ ] Entendimiento claro de la tarea
- [ ] Análisis previo a la implementación completado (ver `pre-implementation-analysis.md`)
  - [ ] Patrones de código similares identificados y revisados
  - [ ] Hooks/filters de WordPress revisados
  - [ ] Documentación revisada
- [ ] Rama creada (si es una feature) - **DEBE hacerse ANTES de cualquier cambio de código**
- [ ] La rama está actualizada con main

**Crítico**: La creación de la rama es la PRIMERA acción relacionada con código. Todo análisis y planificación ocurre antes de crear la rama, pero la rama debe crearse antes de escribir cualquier código de implementación.

## 7. Checklist de finalización de tarea

Antes de marcar una tarea o feature como completa, verifica TODO lo siguiente:

### Cambios en base de datos (si aplica)
- [ ] Cambios en base de datos probados en entorno WordPress
- [ ] **SIEMPRE** verificar cambios en base de datos justo después de crearlos
- [ ] Verificar que los cambios funcionan sin errores
- [ ] Comprobar que la estructura coincide con lo esperado
- [ ] Revisar el debug log de WordPress por errores de base de datos

### Cambios de código
- [ ] Todos los archivos afectados actualizados (usar `grep` para encontrar referencias)
- [ ] Clases del theme actualizadas (métodos, tipos de retorno, PHPDoc)
- [ ] Bloques actualizados (si aplica)
- [ ] Hooks/filters actualizados (si aplica)
- [ ] Tests actualizados para reflejar cambios (si hay infraestructura de tests)

### Calidad de código
- [ ] Ejecutar `./vendor/bin/phpcs` - todos los archivos pasan WordPress Coding Standards
- [ ] Ejecutar `./vendor/bin/phpstan analyse` - sin errores de análisis estático (si está disponible)
- [ ] Ejecutar tests - todos pasan (si hay infraestructura de tests)
- [ ] Revisar warnings o errores de los checks de calidad

### Verificación WordPress
- [ ] La feature funciona en admin de WordPress (si aplica)
- [ ] La feature funciona en frontend
- [ ] Sin errores PHP en el debug log de WordPress
- [ ] Sin errores JavaScript en consola (si aplica)
- [ ] Hooks/filters funcionan correctamente
- [ ] **Pruebas manuales realizadas** con datos reales
- [ ] Casos límite probados (datos vacíos, valores nulos, múltiples ítems)

### Documentación
- [ ] Comentarios de código actualizados (si hace falta)
- [ ] PHPDoc actualizado (si hace falta)
- [ ] Documentación de arquitectura actualizada (si hace falta)
- [ ] Documentación de la feature actualizada (si hace falta)

### Refactorización (si aplica)
- [ ] Métodos antiguos marcados como `@deprecated` (compatibilidad hacia atrás)
- [ ] Métodos nuevos siguen convenciones de nombres
- [ ] Todas las referencias a métodos/hooks antiguos actualizadas
- [ ] Buscar referencias antiguas: `grep -r "old_pattern" theme/ plugins/ mu-plugins/ patterns/`

**Anti-patrones críticos a evitar**:
- ❌ Marcar tarea completa sin verificación en WordPress
- ❌ Marcar tarea completa sin revisar el debug log de WordPress
- ❌ Marcar tarea completa sin pruebas manuales
- ❌ Marcar tarea completa sin ejecutar PHPCS/PHPStan
- ❌ Hacer múltiples cambios sin verificar cada paso
- ❌ Asumir que el código funciona sin probarlo en WordPress

**Flujo correcto**:
1. Hacer cambios de código
2. Ejecutar PHPCS y PHPStan
3. Probar manualmente en WordPress tras cada cambio de componente
4. Revisar el debug log de WordPress por errores
5. Verificar todos los ítems del checklist
6. Entonces marcar como completo y commitear

---

**Última actualización:** 2026-01-15  
**Estado:** Activo  
**Nota:** Usar `--no-verify` para commits solo de documentación (ver sección 3)

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
