---
title: Gestión de deuda técnica
alwaysApply: false
category: workflow
---

# Gestión de deuda técnica

## TL;DR

- Frustración recurrente
- Pérdida de contexto
- Complejidad acumulada
- Degradación de la velocidad de entrega
- Feature rechazada por limitación técnica



## Propósito

Definir reglas medibles para identificar, documentar, priorizar y resolver deuda técnica de forma proactiva, evitando su acumulación y manteniendo la salud del codebase.

## Cuando aplica

- alwaysApply: false
- category: workflow


## Reglas

---

## Principio central

**La deuda técnica que persiste >2 semanas se vuelve 3x más difícil de resolver.**

La gestión proactiva evita:
- Frustración recurrente
- Pérdida de contexto
- Complejidad acumulada
- Degradación de la velocidad de entrega

---

## Cuándo documentar deuda técnica

### Disparadores automáticos (DEBE documentarse):

| Disparador | Umbral | Acción |
|---------|-----------|--------|
| Se usa el mismo workaround | ≥3 veces | Añadir al backlog inmediatamente |
| El problema bloquea trabajo | ≥1 vez/día | Ítem de alto impacto |
| "TODO" o "FIXME" en código | ≥2 semanas de antigüedad | Extraer al backlog |
| Proceso manual | >5 min cada vez | Candidato a automatización |
| Problema de hook/filter WordPress | Bloquea funcionalidad | Documentar de inmediato |

### Evaluación manual (DEBERÍA documentarse):

- Feature rechazada por limitación técnica
- Degradación de rendimiento observada
- Vulnerabilidad de seguridad detectada
- WordPress core/plugin llegando a fin de vida
- Violación de patrones detectada en code review
- Violaciones de estándares de codificación WordPress

---

## Estándar de documentación

Todos los ítems en `docs/technical/TECHNICAL_DEBT.md` DEBEN incluir:

```markdown
### [Título claro y accionable]
- **Estado:** Pendiente | En progreso | Resuelto
- **Descripción:** [Qué problema causa - 1 frase]
- **Impacto:** [Cómo afecta al desarrollo - 1 frase]
- **Tiempo estimado:** [5min | 15min | 30min | 1h | 2h | 1d | 1w]
- **Frecuencia:** [Por hora | Por día | Por semana | Por sprint]
- **Contexto:** [Link a código, issue o conversación]
- **Solución propuesta:** [Cómo resolverlo - 2-3 frases]
```

**Checklist de calidad:**
- [ ] El título es específico (no "Arreglar código")
- [ ] La estimación de tiempo es realista
- [ ] La frecuencia es observable
- [ ] Existe una solución propuesta

---

## Sistema de priorización

### Clasificación por impacto

#### 🔴 Alto impacto
**Criterios (CUALQUIERA de):**
- Bloquea el flujo >3 veces/semana
- Afecta a >1 miembro del equipo
- Causa pérdida de contexto
- Tiempo estimado <1 hora
- Frecuencia >1/día
- Funcionalidad WordPress rota

**SLA:** Resolver en 1 semana O antes de la siguiente feature

#### 🟡 Impacto medio
**Criterios (CUALQUIERA de):**
- Tiene workaround pero molesta
- Ocurre <1 vez/día
- Afecta a 1 miembro del equipo
- Tiempo estimado 1-4 horas
- Reduce velocidad ~10-20%

**SLA:** Resolver en 1 mes O en un sprint de deuda dedicado

#### 🟢 Bajo impacto
**Criterios (TODOS):**
- Ocurrencia rara (<1/semana)
- Workaround sencillo
- Tiempo estimado >4 horas
- Impacto mínimo en velocidad
- Mejora "nice to have"

**SLA:** Revisar trimestralmente, resolver oportunamente

---

### Fórmula de score de prioridad

```
Score de prioridad = (Impacto × Frecuencia) / Tiempo

Impacto: Alto=10, Medio=5, Bajo=1
Frecuencia: Por día=10, Por semana=5, Por mes=1
Tiempo: 15min=1, 1h=4, 4h=16, 1d=32
```

**Ejemplos:**
- Problema con hook pre-commit: (10 × 10) / 1 = **100** → Resolver inmediatamente
- Documentación faltante: (1 × 1) / 4 = **0.25** → Baja prioridad
- Violaciones PHPCS: (5 × 10) / 16 = **3.1** → Prioridad media

**Umbrales:**
- Score ≥20 → Prioridad alta
- Score 5-19 → Prioridad media
- Score <5 → Prioridad baja

---

## Flujo de resolución

### Antes de empezar cualquier feature

**Check obligatorio:**

```bash
# Revisar deuda de alta prioridad
grep "🔴" docs/technical/TECHNICAL_DEBT.md

# Comprobar quick wins (< 30 min)
grep "Tiempo estimado: 15min\|30min" docs/technical/TECHNICAL_DEBT.md
```

**Árbol de decisión:**
1. ¿Hay ítems 🔴? → **Resolver primero**
2. ¿Hay ítems <30 min? → **Resolver 1-2 ítems**
3. ¿Ítems pendientes totales >10? → **Programar sprint de deuda**
4. Si no → **Continuar con la feature**

---

### Durante el desarrollo de la feature

**Si descubres deuda:**

1. **Inmediata (≤5 min):** Arreglar ahora, mencionarlo en el commit
2. **Rápida (<30 min):** Evaluar si bloquea el trabajo actual
   - Bloquea → Arreglar ahora
   - No bloquea → Documentar y continuar
3. **Larga (>30 min):** Documentar siempre, nunca arreglar en mitad de la feature

**Anti-patrón:** Arreglar deuda no relacionada en mitad de una feature (scope creep)

---

### Revisión semanal de deuda (time-box 15 min)

**Cada lunes:**

```markdown
## Checklist
- [ ] Revisar nuevos ítems añadidos esta semana
- [ ] Repriorizar según el contexto actual
- [ ] Resolver 1-2 quick wins (<30 min)
- [ ] Actualizar estado de ítems en progreso
- [ ] Mover ítems resueltos a "Resolved"
- [ ] Calcular métricas de salud
```

---

### Sprint mensual de deuda (time-box 4 horas)

**Último viernes del mes:**

1. **Preparación (30 min):**
   - Revisar todos los ítems pendientes
   - Recalcular scores de prioridad
   - Agrupar ítems relacionados

2. **Ejecución (3 horas):**
   - Resolver 2-3 ítems de alta prioridad
   - O resolver 5-10 quick wins
   - O abordar 1 ítem complejo

3. **Revisión (30 min):**
   - Actualizar backlog
   - Documentar aprendizajes
   - Actualizar guías si se identifican patrones

---

## Métricas de salud

Registrar en `docs/technical/TECHNICAL_DEBT.md`:

### Métricas obligatorias

| Métrica | Objetivo | Señal de alerta |
|--------|----------|----------|
| Total de ítems pendientes | <10 | >20 |
| Ítems de alta prioridad | <3 | >5 |
| Antigüedad media (días) | <30 | >60 |
| Tasa de resolución (por mes) | ≥5 | <2 |
| Ítems nuevos (por mes) | <8 | >15 |

### Cálculo

```bash
# Total pendientes
grep "Estado: Pendiente" docs/technical/TECHNICAL_DEBT.md | wc -l

# Alta prioridad
grep "🔴" docs/technical/TECHNICAL_DEBT.md | wc -l

# Ítems resueltos este mes
git log --since="1 month ago" --grep="resolve.*debt" --oneline | wc -l
```

---

## Árboles de decisión

### ¿Lo arreglo ahora o lo documento?

```
¿Bloquea el trabajo actual?
├─ SÍ → ¿Arreglo <5 min?
│  ├─ SÍ → Arreglar ahora
│  └─ NO → ¿Arreglo <30 min?
│     ├─ SÍ → Arreglar si es crítico, si no documentar
│     └─ NO → Documentar y continuar
└─ NO → ¿Se repite (≥3 veces)?
   ├─ SÍ → Documentar de inmediato
   └─ NO → Añadir TODO inline, decidir después
```

---

### ¿Es deuda técnica o un bug?

```
¿Impide funcionalidad correcta?
├─ SÍ → Bug (arreglar en el sprint actual)
└─ NO → ¿Ralentiza/molesta el desarrollo?
   ├─ SÍ → Deuda técnica (backlog)
   └─ NO → ¿Es una feature que falta?
      ├─ SÍ → Petición de feature (product backlog)
      └─ NO → No accionable (ignorar)
```

---

### ¿Hay que programar un sprint de deuda?

```
Ítems pendientes >10?
├─ SÍ → Programar sprint
└─ NO → Ítems de alta prioridad ≥5?
   ├─ SÍ → Programar sprint
   └─ NO → Antigüedad media >60 días?
      ├─ SÍ → Programar sprint
      └─ NO → Continuar cadencia normal
```

---

## Ejemplos

### ✅ Ejemplo 1: Ítem de alta prioridad (resuelto)

**Antes:**
```markdown
### El hook pre-commit no funciona correctamente
- **Estado:** Pendiente
- **Descripción:** PHPCS se ejecuta mal, causando fallos falsos
- **Impacto:** Bloquea cada commit, requiere override manual
- **Tiempo estimado:** 15min
- **Frecuencia:** Cada commit (10-20/día)
- **Contexto:** `.git/hooks/pre-commit` línea 15
- **Solución propuesta:** Arreglar ruta y configuración de PHPCS
```

**Score de prioridad:** (10 × 10) / 1 = **100** → Inmediato

**Resolución:** Arreglado en 10 minutos, ahorra ~5 min por commit × 20 commits/día = 100 min/día

---

### ✅ Ejemplo 2: Ítem de prioridad media

**Actual:**
```markdown
### Warnings de PHPStan en clases del theme
- **Estado:** Pendiente
- **Descripción:** 15 warnings por type hints faltantes
- **Impacto:** PHPStan es ruidoso y cuesta ver problemas reales
- **Tiempo estimado:** 2h
- **Frecuencia:** Se detecta semanalmente en code review
- **Contexto:** `theme/src/*.php`
- **Solución propuesta:** Añadir anotaciones @param y @return
```

**Score de prioridad:** (5 × 5) / 8 = **3.1** → Prioridad media

**Plan:** Programar para el próximo sprint mensual de deuda

---

### ❌ Ejemplo 3: No es deuda técnica

**Documentado incorrectamente:**
```markdown
### Añadir modo oscuro al admin de WordPress
- **Descripción:** Los usuarios quieren modo oscuro
```

**Por qué está mal:** Es una **feature request**, no deuda técnica. Las features van al backlog de producto, no al de deuda.

**Acción correcta:** Mover al backlog de features o rechazar por fuera de alcance.

---

### ✅ Ejemplo 4: Ítem de baja prioridad

```markdown
### Refactorizar Assets en clases más pequeñas
- **Estado:** Pendiente
- **Descripción:** La clase tiene 600 líneas, se podría dividir en 3 clases
- **Impacto:** Más difícil de navegar, pero funciona correctamente
- **Tiempo estimado:** 1 day
- **Frecuencia:** Se nota al editar (mensual)
- **Contexto:** `theme/src/Assets.php`
- **Solución propuesta:** Extraer ParallaxAssets, BlockAssets, etc.
```

**Score de prioridad:** (1 × 1) / 32 = **0.03** → Baja

**Plan:** Revisar si hace falta añadir features importantes a assets; si no, dejar como está.

---

## Anti-patrones

### ❌ "Deuda como comentarios TODO"

**Mal:**
```php
// TODO: Fix this properly
// FIXME: Temporary hack
// HACK: Will refactor later
```

**Por qué está mal:**
- Los TODO no están en el backlog
- No hay priorización
- No hay estimación de tiempo
- Se olvidan rápidamente

**Bien:**
```php
// Ver: docs/technical/TECHNICAL_DEBT.md #item-23
// Temporal: uso valor hardcodeado hasta resolver el item
```

Y documentar el backlog con el contexto completo.

---

### ❌ "Todo es alta prioridad"

**Mal:** Marcar 15 ítems como 🔴 alto impacto

**Por qué está mal:**
- Alta prioridad pierde significado
- Parálisis por análisis
- Nada se resuelve realmente

**Bien:**
- Usar fórmula de prioridad
- Máximo 3-5 ítems 🔴 a la vez
- Si >5 alta prioridad → programar sprint de deuda

---

### ❌ "Arreglarlo ya que estoy aquí"

**Mal:** Arreglar deuda no relacionada mientras se implementa una feature

**Por qué está mal:**
- Scope creep
- Commits mezclados
- Riesgo de romper la feature
- Revisión más difícil

**Bien:**
- Anotar la deuda
- Terminar la feature
- Luego decidir: arreglar ahora o backlog

---

### ❌ "Sprint de deuda sin revisión"

**Mal:** Pasar 4 horas arreglando ítems aleatorios

**Por qué está mal:**
- Puedes arreglar ítems de poco valor
- No se mide impacto
- Se dejan fuera ítems de alta prioridad

**Bien:**
- Revisar y priorizar primero (30 min)
- Elegir ítems con mayor score
- Medir tasa de resolución

---

## Checklist

### Al descubrir deuda técnica
- [ ] ¿Bloquea el trabajo actual? (Sí → decidir arreglar o documentar)
- [ ] ¿Lo he visto ≥3 veces? (Sí → documentar)
- [ ] ¿Lo puedo arreglar en <5 min? (Sí → arreglar ahora)
- [ ] ¿Ocurre >1/día? (Sí → alta prioridad)
- [ ] ¿Lo he documentado con todos los campos obligatorios?
- [ ] ¿He calculado el score de prioridad?
- [ ] ¿Lo he añadido a la sección de impacto correcta?

### Antes de empezar una feature
- [ ] He revisado ítems 🔴 (ninguno O resueltos)
- [ ] He revisado ítems <30 min (resueltos 1-2)
- [ ] He revisado el total pendiente (<10 ideal)
- [ ] He programado sprint de deuda si aplica (>10 ítems O >5 alta prioridad)

### Revisión semanal (Lunes, 15 min)
- [ ] Revisado ítems nuevos de la última semana
- [ ] Repriorizado según cambios de contexto
- [ ] Resueltos 1-2 quick wins (<30 min total)
- [ ] Estados en progreso actualizados
- [ ] Ítems resueltos movidos al histórico
- [ ] Métricas de salud calculadas

### Sprint mensual de deuda (Último viernes, 4 horas)
- [ ] Revisados todos los ítems pendientes (30 min)
- [ ] Scores de prioridad recalculados
- [ ] Ítems relacionados agrupados
- [ ] Resueltos 2-3 de alta prioridad O 5-10 quick wins (3 horas)
- [ ] Backlog actualizado
- [ ] Aprendizajes documentados
- [ ] Guías actualizadas si se detectaron patrones nuevos (30 min)

---

## Métricas de éxito

**Esta guía tiene éxito si:**

| Métrica | Línea base | Objetivo | Medición |
|--------|----------|--------|-------------|
| Incidencias recurrentes | >5/mes | <2/mes | Conteo de "ya lo vi antes" |
| Tasa de resolución de deuda | <2/mes | ≥5/mes | Conteo en git log |
| Antigüedad media de deuda | >60 días | <30 días | Backlog con fecha |
| Ítems de alta prioridad | >5 | <3 | Conteo de ítems 🔴 |
| Velocidad de entrega | Base | +10% | Burndown del sprint |

**Indicadores adelantados:**
- ✅ Menos momentos de "uff, otra vez esto"
- ✅ Onboarding más rápido (menos workarounds raros)
- ✅ Refactorizaciones más confiadas
- ✅ Menos bloqueos sorpresa

---

## Integración con otras guías

### Relación con baby steps
- Arreglar deuda también sigue baby steps
- Un ítem cada vez
- Verificar antes de pasar al siguiente

### Relación con refactorización guiada por patrones
- Si la deuda está en >5 sitios → Fix guiado por patrón
- Documentar todas las instancias
- Arreglar como esfuerzo coordinado

### Relación con análisis previo a la implementación
- Revisar backlog de deuda ANTES de planificar la feature
- Incluir resolución de deuda en las estimaciones
- No construir encima de deuda

---

## Referencias

- **Origen:** Creado tras retrospectiva (2025-11-26)
- **Archivo de backlog:** `docs/technical/TECHNICAL_DEBT.md`
- **Relacionado:** `.codex/rules/06-pattern-driven-refactoring.md`

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md

