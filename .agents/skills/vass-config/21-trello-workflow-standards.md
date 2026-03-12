---
title: Estándares de flujo Trello
alwaysApply: false
category: workflow
---
# Estándares de flujo Trello

## TL;DR

- Títulos de cards
- Descripciones de cards
- Comentarios
- Ítems de checklist
- Cualquier otro texto en Trello



## Propósito

Este documento define estándares de flujo Trello basados en metodología COMPI, incluyendo estructura de tablero, uso de columnas, etiquetas, límites WIP y reglas de movimiento de cards para gestionar sprints, releases y flujo de desarrollo.

## Cuando aplica

- alwaysApply: false
- category: workflow

## Reglas

## Idioma para contenido en Trello

**CRÍTICO**: Todo el contenido escrito en Trello (títulos, descripciones, comentarios, checklists) debe estar en **español** según las preferencias de comunicación del proyecto.

Incluye:
- Títulos de cards
- Descripciones de cards
- Comentarios
- Ítems de checklist
- Cualquier otro texto en Trello

**Justificación**: Se usa español en Trello para mejor comunicación del equipo, mientras que el código y la documentación técnica permanecen en inglés. Ver `language-standards.md` para reglas completas de idioma.

**Ejemplos**:
- ✅ Título: "Actualizar metodología de trabajo con cursor"
- ✅ Comentario: "Documentación creada y vinculada. Ver: `docs/features/p9g6EwQs-32-actualizar-metodologia.md`"
- ❌ Título: "Update working methodology with cursor" (debe ser español)

## Estructura del tablero

### Columnas del tablero de sprint

El tablero de sprint tiene estas columnas (en orden de flujo):

| Columna | Propósito | Límite WIP | Reglas |
|--------|---------|-----------|-------|
| **TODO** | Trabajo por hacer | Ninguno | Contiene HITO, FEEDME y CHILD |
| **OUT-OF-SPRINT** | Trabajo inesperado durante el sprint | Ninguno | Bugs, urgencias, refactors. Prioridad más alta que WIP |
| **WORK-IN-PROGRESS** | Trabajo en curso | 8 total, 1 por persona | Máx 8 cards, solo 1 por persona |
| **PAUSED** | Trabajo temporalmente pausado | Ninguno | Requiere etiqueta y comentario |
| **MERGE-REQUEST** | Listo para revisión de código | Ninguno | Desarrollado, probado, revisable. Requiere etiqueta de versión (R.X.X.X.X) |
| **DONE** | Trabajo completado y liberado | Ninguno | Todas las features del hito completas, tareas mergeadas y desplegadas |

### Columnas del backlog

El tablero de backlog se usa para planificación y refinado:

| Columna | Propósito |
|--------|---------|
| **NEXT SPRINT** | Trabajo planificado para el siguiente sprint |
| **PRIORITY 1** | Historias con máxima prioridad y valor |
| **PRIORITY 2** | Historias con menos prioridad que P1 |
| **PRIORITY 3** | Historias con menos prioridad que P2 |
| **NICE TO HAVE** | Ideas o requests surgidos durante el desarrollo |
| **REFACTOR** | Tareas de refactorización |

## Sistema de etiquetas

### Etiquetas de prioridad

| Etiqueta | Descripción | Orden de prioridad |
|-------|-------------|----------------|
| **OTS** | Out Of Sprint: tareas urgentes no planificadas | Máxima |
| **P0** | Prioridad 0 | Alta |
| **P1** | Prioridad 1 | Media-alta |
| **P2** | Prioridad 2 | Media |
| **P3** | Prioridad 3 | Baja |

### Etiquetas de pausa

Estas etiquetas **deben** usarse al mover a PAUSED:

| Etiqueta | Descripción | Uso |
|-------|-------------|-------|
| **HELP** | Bloqueo y necesita ayuda | Para bloqueo técnico |
| **VACATIONS** | Persona de vacaciones | Comentar estado para handover |
| **DISCUSSION** | Discusión abierta | Comentarios deben reflejar discusión |
| **WFR** | Waiting for response | Esperando input externo |

### Etiquetas de tipo de bug

| Etiqueta | Descripción |
|-------|-------------|
| **E_INCOMPLETE_REQUIREMENTS** | Requisitos incompletos |
| **E_FUNCTIONAL** | Bug por error de código |
| **E_FRONTEND** | Bug en capa de presentación |

### Etiquetas de tipología

| Etiqueta | Descripción | Uso |
|-------|-------------|-------|
| **HITO** | Hitos de sprint | Aplicado a features de hito |
| **REFACTOR** | Tarea de refactor | Para trabajo de refactor |
| **FEEDME** | Desde FeedMe | Feedback en tiempo real |
| **CHILD** | Card hija | Subtarea de una card padre |
| **OTS** | Out of Sprint | Tareas urgentes no planificadas |

### Etiquetas de versión

Formato: **R.W.X.Y.Z**

Donde:
- **W** = Versión estable actual
- **X** = Número de sprint actual
- **Y** = Número de despliegue actual
- **Z** = Número de bug (si aplica)

**Ejemplo**: `R.0.4.4.0` = Release del segundo jueves del cuarto sprint sin bugs

## Límites WIP

### Reglas

1. **Límite por columna**: WIP no debe superar el número de miembros del equipo
2. **Límite por persona**: Una persona no puede tener dos cards en columnas con límite WIP
3. **Máximo cards**: Máximo 8 cards simultáneas en WORK-IN-PROGRESS
4. **Una por persona**: Solo 1 card por persona en WORK-IN-PROGRESS

### Enforcement

- Si se alcanza el límite, completar o pausar trabajo antes de iniciar nuevas tareas
- OUT-OF-SPRINT tiene prioridad sobre WIP y puede interrumpir

## Reglas de movimiento de cards

### Movimientos permitidos

```
TODO → WORK-IN-PROGRESS → MERGE-REQUEST → DONE
  ↓         ↓
OUT-OF-SPRINT  PAUSED
```

### Restricciones de movimiento

- **No mover a**: `TODO` o `OUT-OF-SPRINT`
- **No mover desde**: `DONE`
- **Obligatorio al mover a PAUSED**: Etiqueta (HELP, VACATIONS, DISCUSSION, WFR) y comentario con motivo

### Reglas especiales

1. **Mover a WORK-IN-PROGRESS**:
   - Comprobar WIP antes
   - Asegurar que no tienes otra card en WIP
   - Crear rama con Venus: `venus newBranch F/<trello-card-id>-description`
   - La rama crea MR con estado WIP

2. **Mover a PAUSED**:
   - **OBLIGATORIO**: Etiqueta de pausa (HELP, VACATIONS, DISCUSSION, WFR)
   - **OBLIGATORIO**: Comentario explicando el motivo
   - Usar Venus: `venus moveCardTo PAUSED --card-id <id> --label <reason> --comment "why paused"`

3. **Mover a MERGE-REQUEST**:
   - Card desarrollada, revisada y probada
   - Código revisable y testeable
   - Añadir discusión de pruebas en MR
   - Actualizar descripción del MR si hace falta
   - Quitar estado WIP del MR

4. **Mover a DONE**:
   - Reviewer etiqueta MR con versión (R.W.X.Y.Z)
   - Card mergeada y desplegada
   - CHILD a DONE cuando se mergea y despliega
   - HITO a DONE solo cuando TODOS los CHILD están en DONE

## Flujo ideal

### Flujo estándar (feature de hito)

1. **Inicio**: Feature HITO en TODO
   - Feature tiene CHILD asociadas

2. **Trabajo en subtareas**: Resolver CHILD una a una
   - Crear rama: `venus newBranch F/<trello-card-id>-description`
   - Push a GitLab y generar MR con WIP
   - En MR: añadir link Trello y descripción

3. **Listo para revisión**: Tras desarrollo, review y tests
   - Quitar WIP del MR
   - Mover card a MERGE-REQUEST
   - Añadir discusión de pruebas en MR
   - Actualizar descripción si hace falta

4. **Revisión de código**: Tras review y discusiones resueltas
   - Reviewer etiqueta MR con versión (R.W.X.Y.Z)
   - Card permanece en MERGE-REQUEST hasta merge y deploy

5. **Completar**: Tras merge y deploy
   - Mover CHILD a DONE
   - Si todas las CHILD están en DONE, mover HITO a DONE

### Flujo excepcional (Out-of-Sprint)

1. **Trabajo planificado**: Card en WORK-IN-PROGRESS

2. **Aparece urgente**: Bug o urgencia
   - Pasa a OUT-OF-SPRINT
   - Prioridad sobre WIP

3. **Pausar trabajo actual** (si es necesario):
   - Mover WIP a PAUSED
   - **OBLIGATORIO**: Etiqueta y comentario

4. **Trabajar urgente**: Mover OUT-OF-SPRINT a WORK-IN-PROGRESS

5. **Reanudar**: Tras completar urgente
   - Mover de PAUSED a WORK-IN-PROGRESS
   - Continuar

## Calendario de releases

### Frecuencia de releases

- **Releases**: Martes y jueves
- **Contenido**: Todos los MRs cerrados desde el último despliegue

### Numeración de versiones

Formato: **W.X.Y.Z**

Donde:
- **W** = Versión estable actual
- **X** = Número de sprint actual
- **Y** = Número de despliegue actual (incrementa martes/jueves)
- **Z** = Número de bug (0 si no hay bugs)

**Ejemplo**: `0.4.4.0` = Release del segundo jueves del cuarto sprint sin bugs

### Proceso de release

1. Reviewer etiqueta MR con versión (R.W.X.Y.Z)
2. MR se mergea a main
3. Release se despliega martes o jueves
4. Cards pasan de MERGE-REQUEST a DONE tras deploy

## Buenas prácticas

### Flujo diario

1. **Inicio de día**:
   - Ejecutar `venus myDay` para ver tus cards
   - Revisar OUT-OF-SPRINT (prioridad máxima)
   - Revisar MRs con discusiones
   - Priorizar trabajo

2. **Empezar trabajo**:
   - Comprobar WIP antes de mover a WORK-IN-PROGRESS
   - Verificar que no tienes otra card en WIP
   - Crear rama con Venus: `venus newBranch F/<card-id>-description`
   - Mover card a WORK-IN-PROGRESS

3. **Durante el trabajo**:
   - Foco en una card a la vez
   - No trabajar en varias cards simultáneamente
   - Si hay bloqueo, pausar con etiqueta y comentario

4. **Completar trabajo**:
   - Quitar WIP del MR
   - Mover card a MERGE-REQUEST
   - Añadir discusión de pruebas en MR

### Gestión de cards

1. **Cards CHILD**:
   - Vincular child a padre usando etiqueta CHILD con ID del padre
   - Trabajar CHILD una a una
   - HITO a DONE solo cuando todas las CHILD estén en DONE

2. **Pausar cards**:
   - Usar siempre etiqueta de pausa (HELP, VACATIONS, DISCUSSION, WFR)
   - Comentar por qué se pausa
   - Actualizar comentario si cambia el motivo

3. **Etiquetas de versión**:
   - Reviewer añade etiqueta (R.W.X.Y.Z) al MR
   - Versión sigue formato W.X.Y.Z
   - Etiqueta se añade cuando MR está listo para release

### Gestión de sprints

1. **Planificación**:
   - Trabajar desde backlog (NEXT SPRINT, PRIORITY 1, 2, 3)
   - Mover trabajo planificado a TODO del sprint
   - Ajustar capacidad

2. **Durante el sprint**:
   - Respetar límites WIP
   - Gestionar OUT-OF-SPRINT según aparecen
   - Mantener cards actualizadas

3. **Fin de sprint**:
   - Completar trabajo planificado
   - Mover incompletos al backlog si hace falta
   - Revisar métricas de sprint

## Checklist

### Antes de empezar a trabajar
- [ ] Comprobar WIP (máx 8 cards, 1 por persona)
- [ ] Verificar que no tienes otra card en WIP
- [ ] Revisar OUT-OF-SPRINT por urgencias
- [ ] Crear rama con Venus: `venus newBranch F/<card-id>-description`
- [ ] Mover card a WORK-IN-PROGRESS

### Durante el trabajo
- [ ] Foco en una card
- [ ] Si bloqueo, pausar con etiqueta y comentario: `venus moveCardTo PAUSED --card-id <id> --label <reason> --comment "why"`
- [ ] Mantener descripción del MR actualizada
- [ ] Añadir pasos de testing en discusión del MR

### Completar trabajo
- [ ] Quitar WIP del MR
- [ ] Mover card a MERGE-REQUEST: `venus moveCardTo MERGE_REQUEST --card-id <id>`
- [ ] Añadir discusión de testing funcional
- [ ] Esperar review y etiqueta de versión

### Code review
- [ ] Revisar código y funcionalidad
- [ ] Resolver discusiones
- [ ] Etiquetar MR con versión (R.W.X.Y.Z)
- [ ] Merge a main

### Tras despliegue
- [ ] Verificar etiqueta de versión
- [ ] Mover card a DONE
- [ ] Si todas las child están DONE, mover HITO a DONE

## Anti-patrones a evitar

❌ **Trabajar en varias cards simultáneamente**
- Foco en una card
- Máximo 1 card por persona en WIP

❌ **Mover cards sin Venus**
- Usar `venus moveCardTo` para consistencia de etiquetas

❌ **Pausar cards sin motivo**
- Siempre añadir etiqueta y comentario

❌ **Ignorar OUT-OF-SPRINT**
- OUT-OF-SPRINT tiene prioridad máxima

❌ **Mover HITO a DONE antes que las CHILD**
- HITO solo cuando todas las CHILD estén DONE

❌ **Saltarse etiquetas de versión**
- Reviewer debe etiquetar MR con versión antes de merge

❌ **Superar límites WIP**
- Respetar máx 8 cards en WIP, 1 por persona

---

**Última actualización:** 2026-01-16  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md
