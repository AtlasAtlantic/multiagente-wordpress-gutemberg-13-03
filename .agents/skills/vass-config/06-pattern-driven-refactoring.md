---
title: Refactorización guiada por patrones
alwaysApply: false
category: refactoring
globs:
  - "theme/**/*.php"
  - "plugins/**/*.php"
  - "mu-plugins/**/*.php"
  - "mu-plugins/*.php"
  - "patterns/**/*.php"
---
# Refactorización guiada por patrones

## TL;DR

- El mismo cambio mecánico se repite en **≥5 archivos**
- El cambio es **sintáctico/estructural** (no lógico)
- Es un **rename** o **cambio de nombre de hook/filter**
- El cambio es **mecánico** (no lógica de negocio)
- El cambio implica lógica de negocio
## Propósito

Esta guía define cuándo y cómo aplicar cambios masivos por patrones en lugar de baby steps tradicionales, optimizando la velocidad en refactorizaciones mecánicas repetitivas.

## Cuando aplica

- alwaysApply: false
- category: refactoring
- globs: "theme/**/*.php", "plugins/**/*.php", "mu-plugins/**/*.php", "mu-plugins/*.php", "patterns/**/*.php"

## Reglas

## Contexto

El principio de "baby steps" es fundamental, pero aplicarlo sin criterio en refactorizaciones masivas puede ser contraproducente. Cuando el mismo cambio se repite en 20+ archivos, arreglar uno a uno es ineficiente.

**Aprendizaje clave:** Si estás haciendo el MISMO cambio en varios archivos, no es "baby steps", es un PATRÓN.

---

## ¿Cuándo aplicar la refactorización guiada por patrones?

### Criterios de activación:

✅ **USA esta técnica cuando:**
- El mismo cambio mecánico se repite en **≥5 archivos**
- El cambio es **sintáctico/estructural** (no lógico)
- Es un **rename** o **cambio de nombre de hook/filter**
- El cambio es **mecánico** (no lógica de negocio)

❌ **NO uses esta técnica cuando:**
- El cambio implica lógica de negocio
- Cada archivo requiere un cambio diferente
- Es una feature nueva (no refactor)
- No estás seguro del patrón exacto
- Hay menos de 5 archivos afectados (usa baby steps)

---

## Proceso: 5 pasos

### Paso 1: PARAR y analizar

**Señales de alerta (ejecuta este proceso):**
- Has arreglado 3+ archivos con el mismo cambio
- Estás haciendo commits similares consecutivos
- Ves el mismo search/replace en varios archivos

**Acciones:**
1. PARA el enfoque archivo por archivo
2. Analiza TODOS los archivos afectados (no solo el primero)
3. Verifica que WordPress funciona correctamente

```bash
# Encontrar TODOS los archivos con el patrón antiguo
grep -r "OldPattern" theme/ plugins/ mu-plugins/ patterns/ | cut -d: -f1 | sort -u

# Contar ocurrencias
grep -r "OldPattern" theme/ plugins/ mu-plugins/ patterns/ | wc -l
```

---

### Paso 2: Identificar patrones

**Buscar patrones repetitivos:**

```bash
# Encontrar TODOS los archivos con el patrón antiguo
grep -r "OldPattern" theme/ plugins/ mu-plugins/ patterns/ | cut -d: -f1 | sort -u

# Contar ocurrencias
grep -r "OldPattern" theme/ plugins/ mu-plugins/ patterns/ | wc -l

# Ver contexto para confirmar patrón
grep -A 2 -B 2 "OldPattern" path/to/file.php
```

**Patrones comunes en refactorizaciones WordPress:**

| Tipo de cambio | Patrón antiguo | Patrón nuevo |
|-------------|-------------|-------------|
| Nombre de hook | `'old_hook_name'` | `'new_hook_name'` |
| Nombre de filter | `'old_filter_name'` | `'new_filter_name'` |
| Nombre de función | `old_function_name()` | `new_function_name()` |
| Nombre de clase | `OldClass` | `NewClass` |
| Namespace | `namespace Old\Namespace;` | `namespace New\Namespace;` |
| Text domain | `'old-textdomain'` | `'prisa-media'` |
| Ruta de directorio | `get_template_directory()` | `get_stylesheet_directory()` |
| Nombre de bloque | `'old/block-name'` | `'new/block-name'` |

---

### Paso 3: Cuantificar impacto

**Umbral de decisión:**

| Archivos afectados | Estrategia |
|---------------|----------|
| 1-4 archivos | Baby steps tradicionales |
| 5-19 archivos | Guiado por patrones (esta guía) |
| 20+ archivos | Guiado por patrones + verificación cuidadosa |

---

### Paso 4: Aplicar el cambio masivo por patrón

**Orden de aplicación (de más seguro a menos seguro):**

1. **Plantillas/Patterns** (más seguro de cambiar)
2. **Archivos de configuración** (`theme.json`, etc.)
3. **Assets** (CSS, JS)
4. **Clases PHP** (hooks, filters, métodos)
5. **Funcionalidad core** (Kernel, Setup)

**Técnica: búsqueda y reemplazo iterativo**

```bash
# 1. Identificar archivos
FILES=$(grep -r "OldPattern" theme/ plugins/ mu-plugins/ patterns/ | cut -d: -f1 | sort -u)

# 2. Revisar cada archivo manualmente (importante)
for file in $FILES; do
    echo "=== $file ==="
    grep -n "OldPattern" "$file"
done

# 3. Aplicar el cambio con tu editor (no con scripts sed/awk)
# - Usa Search & Replace del IDE
# - Confirma visualmente cada cambio
# - Verifica que el patrón es correcto en contexto
```

**⚠️ IMPORTANTE:** No uses scripts automáticos para el cambio. Usa búsqueda/reemplazo en el IDE para:
- Ver el contexto de cada ocurrencia
- Confirmar que el patrón aplica
- Detectar falsos positivos
- Verificar que hooks/filters de WordPress son correctos

---

### Paso 5: Verificar y commitear por patrón

**Después de aplicar UN patrón:**

1. **Ejecutar controles de calidad:**
   ```bash
   ./vendor/bin/phpcs
   ./vendor/bin/phpstan analyse  # si está disponible
   ```

2. **Probar manualmente en WordPress:**
   - Probar en admin de WordPress (si aplica)
   - Probar en frontend
   - Revisar el debug log de WordPress por errores
   - Verificar que hooks/filters siguen funcionando

3. **Si todo pasa, hacer commit:**
   ```bash
   git add -A
   git commit -m "refactor: apply pattern [description] to [N] files

   - Changed: OldPattern → NewPattern
   - Affected files: [list or number]
   - WordPress verified: admin/frontend working
   "
   ```

**Estructura del commit:**
- Primera línea: Tipo + patrón + cantidad
- Cuerpo: Detalles del cambio
- Pie: Estado de verificación

---

## Ejemplo completo: migración de text domain

### Situación inicial
- 25 archivos usando el text domain antiguo `'old-textdomain'`
- Hay que cambiar a `'prisa-media'`

### ❌ Enfoque incorrecto (2 horas):
```
1. Arreglar Setup.php → commit
2. Arreglar Assets.php → commit
3. Arreglar Blocks.php → commit
... (repetir 25 veces)
```

### ✅ Enfoque correcto (30 minutos):

#### Paso 1: Analizar
```bash
grep -r "'old-textdomain'" theme/ plugins/ mu-plugins/ | wc -l
# Output: 25 occurrences
```

#### Paso 2: Identificar patrón
```bash
grep -r "'old-textdomain'" theme/ plugins/ mu-plugins/ | cut -d: -f1 | sort -u
# Output: 15 files
```

#### Paso 3: Aplicar por patrón

**Patrón: text domain en funciones de traducción**
```bash
# Encontrar archivos
grep -r "'old-textdomain'" theme/ plugins/ mu-plugins/ | cut -d: -f1 | sort -u
# → 15 files

# Cambio en IDE: Search & Replace
# Old: 'old-textdomain'
# New: 'prisa-media'
```

**Verificar en WordPress:**
- Comprobar que las traducciones siguen funcionando
- Verificar que no hay errores PHP en el debug log

```bash
git commit -m "refactor: update text domain from old-textdomain to prisa-media (15 files)"
```

**Resultado:** 1 commit grande vs 15 commits pequeños, 4x más rápido

---

## Checklist de ejecución

### Antes de empezar
- [ ] He intentado arreglar ≥3 archivos con el mismo cambio
- [ ] He identificado al menos UN patrón repetido claro
- [ ] He cuantificado cuántos archivos están afectados (≥5)
- [ ] He verificado que WordPress funciona antes de refactorizar

### Durante la ejecución
- [ ] He agrupado cambios por PATRÓN (no por archivo)
- [ ] He usado grep para encontrar TODAS las ocurrencias
- [ ] He aplicado cambios con búsqueda/reemplazo del IDE (no scripts)
- [ ] He verificado visualmente cada cambio
- [ ] He ejecutado PHPCS tras CADA patrón
- [ ] He probado manualmente en WordPress tras cada patrón
- [ ] He commiteado por patrón completado

### Después de completar
- [ ] PHPCS pasando
- [ ] PHPStan pasando (si está disponible)
- [ ] WordPress verificado (admin y frontend)
- [ ] Sin errores en el debug log de WordPress
- [ ] He documentado la refactorización si era compleja

---

## Señales de problema

### 🚨 Para si:
- Has aplicado un patrón y WordPress se rompe
- No entiendes por qué un cambio causó un error
- Aparecen errores PHP en el debug log de WordPress
- Has gastado > 30 min "arreglando un detalle"

### ✅ Entonces:
1. Revertir el último cambio: `git reset --hard HEAD^`
2. Analizar qué salió mal
3. Refinar el patrón
4. Probar con un subconjunto más pequeño (3-5 archivos)

---

## Anti-patrones a evitar

### ❌ Refactorización whack-a-mole
**Síntoma:** Arreglar archivos uno a uno sin detectar patrón

**Solución:** Usar grep para encontrar todas las ocurrencias, agrupar por patrón

---

### ❌ Refactorización big bang
**Síntoma:** Cambiar 10 patrones a la vez sin verificar

**Solución:** UN patrón, verificar en WordPress, commit, siguiente patrón

---

### ❌ Reemplazo dirigido por scripts
**Síntoma:** Usar sed/awk para cambios masivos sin revisar

**Solución:** Búsqueda/reemplazo en IDE para ver contexto y verificar hooks WordPress

---

### ❌ Commits con patrones mezclados
**Síntoma:** Un commit con varios patrones diferentes

**Solución:** Un commit por patrón, mensaje descriptivo

---

## Integración con otros principios

### Relación con baby steps
- **Baby steps:** Para features nuevas, lógica compleja
- **Guiado por patrones:** Para refactorizaciones masivas mecánicas
- **Clave:** Saber cuándo usar cada enfoque

### Relación con análisis previo a la implementación
- **Análisis previo:** CRÍTICO para el enfoque por patrones
- **Encontrar todos los archivos afectados ANTES** de tocar código
- **Decidir estrategia ANTES** de tocar código

### Relación con verificación en WordPress
- **Verificar siempre en WordPress** tras cada patrón
- **Revisar el debug log** por errores
- **Probar hooks/filters** siguen funcionando

---

## Métricas de éxito

### Esta técnica tiene éxito si:
- ✅ Velocidad: ≥ 3x más rápido que el enfoque uno a uno
- ✅ Calidad: PHPCS pasa, WordPress funcionando
- ✅ Claridad: Commits descriptivos, un patrón por commit
- ✅ Confianza: Sin commits "fix" tras la refactorización

---

## Escenarios comunes de refactorización en WordPress

### Escenario 1: Renombrar callbacks de hooks
- Encontrar todos los archivos con el nombre antiguo
- Actualizar el registro del hook
- Verificar que los hooks se disparan correctamente
- Probar en WordPress tras los cambios

### Escenario 2: Actualizar text domain
- Encontrar todas las llamadas a funciones de traducción
- Sustituir el text domain de forma consistente
- Verificar que las traducciones siguen funcionando
- Probar en WordPress

### Escenario 3: Cambiar nombres de funciones
- Encontrar todas las llamadas a la función
- Actualizar definiciones de funciones
- Actualizar todas las referencias
- Verificar funcionalidad en WordPress

### Escenario 4: Renombrar nombres de bloque
- Encontrar todos los registros de bloques
- Actualizar archivos block.json
- Actualizar referencias de bloques en patterns
- Probar los bloques en el editor de WordPress

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
