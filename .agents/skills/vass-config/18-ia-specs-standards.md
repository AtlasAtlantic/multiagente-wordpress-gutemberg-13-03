---
title: Estándares de especificaciones de IA
alwaysApply: false
category: documentation
globs:
  - ".codex/rules/**/*.md"
---

# Estándares de especificaciones de IA

## TL;DR

- **Siempre** para guías que la IA debe aplicar automáticamente
- Archivos que definen **reglas, patrones o flujos**
- Archivos que están **siempre activos** en el contexto de la IA
- [ ] Contiene reglas accionables (no solo información)
- [ ] Debe aplicarse sin petición explícita del usuario



## Propósito

Definir reglas medibles y cuantificables para crear y mantener especificaciones de IA en el directorio `.codex/rules/`.

## Cuando aplica

- alwaysApply: false
- category: documentation
- globs: ".codex/rules/**/*.md"


## Reglas

---

## Tipos de archivo y uso

### Cuándo usar `.md` (Metadata Context)
- **Siempre** para guías que la IA debe aplicar automáticamente
- Archivos que definen **reglas, patrones o flujos**
- Archivos que están **siempre activos** en el contexto de la IA

**Criterios (TODOS deben cumplirse):**
- [ ] Contiene reglas accionables (no solo información)
- [ ] Debe aplicarse sin petición explícita del usuario
- [ ] Define "cómo hacer algo"
- [ ] Cumplimiento medible (se puede comprobar)

**Ejemplos:**
- ✅ `04-babysteps-principle.md` - Define reglas de flujo
- ✅ `06-pattern-driven-refactoring.md` - Define cuándo/cómo refactorizar
- ✅ `12-git-workflow-standards.md` - Define reglas de commits

### Cuándo usar `.md` (Markdown estándar)
- Documentación de referencia
- Material de aprendizaje
- Registro histórico
- Información sin reglas exigibles

**Ejemplos:**
- ✅ `ARCHITECTURE.md` - Describe el sistema, no impone reglas
- ✅ `README.md` - Informativo
- ✅ Retrospectivas - Registro histórico

---

## Estándares cuantificables para archivos `.md`

### 1. Estructura del archivo (OBLIGATORIO)

Cada archivo `.md` DEBE tener:

```yaml
---
title: [Título descriptivo]
alwaysApply: true|false  # true = la IA aplica automáticamente
category: [one of: refactoring, testing, documentation, workflow, architecture]
---

# [Título que coincide con el YAML]

## Propósito
[1-2 frases: por qué existe la guía]

## [Secciones de contenido...]

## [Checklist - OBLIGATORIO para guías de workflow]

## [Métricas/Criterios de éxito - OBLIGATORIO para guías de proceso]

---

**Última actualización:** YYYY-MM-DD
**Estado:** Activo|Borrador|Obsoleto
```

**Métricas:**
- ✅ Tiene frontmatter YAML con todos los campos requeridos
- ✅ El título del YAML coincide con el H1
- ✅ El propósito es ≤2 frases
- ✅ Tiene checklist si define un workflow
- ✅ Tiene métricas si define un proceso
- ✅ Tiene fecha de última actualización

---

### 2. Restricciones de longitud

| Tipo de guía | Líneas mín. | Líneas máx. | Motivo |
|---------------|-----------|-----------|-----------|
| Workflow (p. ej. TDD) | 100 | 500 | Detalle suficiente sin abrumar |
| Conjunto de reglas (p. ej. commits) | 50 | 300 | Referencia rápida |
| Catálogo de antipatrónes | 80 | 400 | Se necesitan varios ejemplos |
| Uso de herramientas | 30 | 200 | Práctico, no teórico |

**Comprobación:**
```bash
# Contar líneas
wc -l .codex/rules/*.md
```

**Excepción:** Si >500 líneas → dividir en varios archivos

---

### 3. Requisitos de medibilidad

Cada archivo `.md` con `alwaysApply: true` DEBE incluir UNO de:

#### A. Checklist (para guías de workflow)
```markdown
## Checklist

**Antes de [acción]:**
- [ ] Ítem específico verificable
- [ ] Otro ítem específico

**Después de [acción]:**
- [ ] Paso de verificación
```

**Criterios:**
- ✅ Cada ítem es binario (sí/no)
- ✅ Cada ítem es específico (no vago)
- ✅ Se puede comprobar en <5 minutos

---

#### B. Métricas (para guías de proceso)
```markdown
## Success Metrics

**This [guideline] is successful if:**
- ✅ [Métrica cuantificable 1]
- ✅ [Métrica cuantificable 2]

**Measurement:**
[Comando o método de medición]
```

**Criterios:**
- ✅ Métricas cuantificables (números, porcentajes, tiempo)
- ✅ Método de medición
- ✅ Umbral de éxito (p. ej. "≥80%", "<30 min")

---

#### C. Árbol de decisión (para guías condicionales)
```markdown
## When to Apply

**Use this guideline if:**
- Condición 1 (con umbral si aplica)
- AND/OR Condición 2

**Do NOT use if:**
- Contra-condición 1
```

**Criterios:**
- ✅ Condiciones específicas
- ✅ Criterios positivos y negativos
- ✅ Umbrales cuando aplica (p. ej. "≥5 archivos")

---

### 4. Requisitos de ejemplos

Cada regla DEBE tener al menos UN ejemplo mostrando:

| Elemento | Requerido | Formato |
|---------|----------|--------|
| ✅ Uso correcto | SÍ | Código/comando + explicación |
| ❌ Uso incorrecto | SÍ | Código/comando + por qué está mal |
| Contexto | RECOMENDADO | Cuándo aplicar este ejemplo |

**Formato de ejemplo:**
```markdown
### Example: [Descripción breve]

**❌ Incorrect:**
```[language]
[código malo]
```
**Why wrong:** [1 frase]

**✅ Correct:**
```[language]
[código bueno]
```
**Why right:** [1 frase]
```

**Mínimo:** 2 ejemplos por regla principal

---

### 5. Actionability Score

Cada guía se puntúa 0-100% en base a:

| Criterio | Peso | Medición |
|-----------|--------|-------------|
| Checklist binario | 25% | SÍ/NO |
| Métricas cuantificables | 25% | SÍ/NO |
| Umbrales de decisión | 20% | Conteo (p. ej. "≥5 archivos") |
| ≥2 ejemplos | 15% | Conteo |
| Señales de error | 15% | SÍ/NO |

**Score mínimo requerido:** 70% para `alwaysApply: true`

**Script de cálculo:**
```bash
# ./scripts/score-guideline-actionability.sh .codex/rules/filename.md
```

---

### 6. Frecuencia de actualización

| Tipo de guía | Frecuencia requerida |
|---------------|---------------------------|
| Core workflow (TDD, baby steps) | Tras proyectos mayores |
| Procesos (git, testing) | Cada 3 meses o si se viola 3+ veces |
| Herramientas | Cuando cambie la versión |
| Antipatrónes | Cuando se detecte un patrón nuevo |

**Actualizar incluye:**
- Revisar que los ejemplos sigan siendo válidos
- Añadir aprendizajes de retrospectivas
- Actualizar métricas si cambian umbrales

---

## Checklist de cumplimiento

Usar antes de commitear cualquier `.md`:

### Estructura
- [ ] Tiene frontmatter YAML con `title`, `alwaysApply`, `category`
- [ ] El título del YAML coincide con el H1
- [ ] Tiene sección "Propósito" (≤2 frases)
- [ ] Tiene fecha de "Última actualización"
- [ ] Tiene "Estado"

### Contenido
- [ ] Dentro de límites de longitud (ver tabla)
- [ ] Idioma en inglés
- [ ] Usa modo imperativo en instrucciones ("Use X", no "You should use X")
- [ ] Términos técnicos consistentes con el codebase

### Medibilidad (al menos UNO):
- [ ] Checklist binario con ≥5 ítems
- [ ] Métricas cuantificables con umbrales
- [ ] Árbol de decisión con condiciones claras

### Ejemplos
- [ ] ≥2 ejemplos completos
- [ ] Cada ejemplo tiene versión ✅ correcta y ❌ incorrecta
- [ ] Ejemplos con código real del proyecto (no placeholder)

### Actionability
- [ ] Score de actionability ≥70%
- [ ] Cada regla se puede comprobar/verificar
- [ ] Tiene sección de "error signals" o "warning signs"
- [ ] Tiene "antipatterns to avoid" si aplica

---

## Anti-patrones en specs de IA

### ❌ Reglas vagas
**Mal:** "Write good tests"  
**Bien:** "Every test file must have ≥3 tests covering: happy path, error case, edge case"

### ❌ Guías no medibles
**Mal:** "Code should be clean"  
**Bien:** "Functions must be ≤20 lines, classes ≤300 lines, cyclomatic complexity ≤10"

### ❌ Sin ejemplos
**Mal:** Listar reglas sin ejemplos  
**Bien:** 2-3 ejemplos reales del codebase

### ❌ Demasiado largo
**Mal:** Guía de 800 líneas que cubre todo  
**Bien:** Dividir en guías de ~200 líneas enfocadas

### ❌ Reglas en conflicto
**Mal:** "Always baby steps" Y "Do mass refactorings"  
**Bien:** "Baby steps por defecto, pattern-driven cuando ≥5 archivos (ver excepción)"

---

## Tarjeta rápida de referencia

### Crear un nuevo `.md`

1. **Copiar plantilla:**
```bash
cp .codex/rules/.template.md .codex/rules/new-guideline.md
```

2. **Completar secciones requeridas:**
   - YAML frontmatter
   - Purpose (1-2 frases)
   - Contenido principal
   - Checklist O métricas O árbol de decisión
   - Al menos 2 ejemplos
   - Fecha de última actualización

3. **Verificar:**
```bash
# Comprobar estructura
./scripts/validate-ia-spec.sh .codex/rules/new-guideline.md

# Comprobar actionability score
./scripts/score-guideline-actionability.sh .codex/rules/new-guideline.md
```

4. **Test:**
   - Pedir a la IA que aplique la guía en un escenario de prueba
   - Verificar que la IA la entiende y sigue
   - Refinar si es ambigua

5. **Commit:**
```bash
git add .codex/rules/new-guideline.md
git commit -m "docs: add [guideline name] specification

- Purpose: [1 sentence]
- Actionability score: [X]%
- Examples: [N]
"
```

---

## Calendario de mantenimiento

### Semanal
- [ ] Revisar `.codex/rules/` modificados esta semana
- [ ] Verificar que cumplen este estándar

### Mensual
- [ ] Ejecutar actionability score en todos los `.md`
- [ ] Actualizar archivos con score <70%
- [ ] Revisar guías violadas múltiples veces (considerar actualización)

### Trimestral
- [ ] Revisar todas las guías de proceso
- [ ] Actualizar umbrales según métricas de velocidad/calidad
- [ ] Archivar guías deprecadas

### Tras refactorización importante
- [ ] Crear retrospectiva
- [ ] Extraer aprendizajes a guías
- [ ] Actualizar guías relacionadas con nuevos ejemplos

---

## Dashboard de métricas

Registrar para todos los `.codex/rules/*.md`:

| Métrica | Objetivo | Actual | Comando |
|--------|--------|---------|---------|
| Actionability score medio | ≥75% | TBD | `./scripts/score-all-guidelines.sh` |
| Archivos con score <70% | 0 | TBD | Mismo script |
| Archivos >500 líneas | 0 | TBD | `wc -l .codex/rules/*.md` |
| Archivos sin ejemplos | 0 | TBD | `grep -L "❌ Incorrect" .codex/rules/*.md` |
| Archivos sin checklist/métricas | 0 | TBD | `grep -L "Checklist\|Metrics" .codex/rules/*.md` |

Actualizar esta tabla mensualmente.

---

## Ejemplos del codebase

### ✅ Buenos ejemplos

**`babysteps-principle.md`:**
- ✅ Tiene checklist claro ("Before each commit")
- ✅ Métricas específicas (máx 5 archivos, 200 líneas)
- ✅ Múltiples ejemplos (Good vs Bad)
- ✅ Señales de error ("If your changes exceed limits...")
- Score: 85%

**`pattern-driven-refactoring.md`:**
- ✅ Árbol de decisión ("Use when ≥5 files affected")
- ✅ Umbrales cuantificables
- ✅ Workflow completo con comandos
- ✅ Métricas de éxito (3x más rápido, 100% tests)
- Score: 90%

### ❌ Malos ejemplos (hipotéticos)

**`write-good-code.md`:**
- ❌ Sin criterios medibles
- ❌ Consejos vagos ("be clear", "stay simple")
- ❌ Sin ejemplos
- ❌ Sin checklist
- Score: 15%

---

## Herramientas

### Script de validación (por crear)
```bash
#!/bin/bash
# ./scripts/validate-ia-spec.sh <file>

# Checks:
# 1. Has YAML frontmatter
# 2. Has required sections
# 3. Has at least 2 examples
# 4. Has checklist OR metrics
# 5. Within length limits
```

### Script de scoring (por crear)
```bash
#!/bin/bash
# ./scripts/score-guideline-actionability.sh <file>

# Calculates actionability score based on criteria
# Outputs: score (0-100%) and missing elements
```

---

## FAQ

**Q: ¿Cuándo debo crear una nueva guía?**  
A: Cuando identifiques un patrón/regla que se ha violado ≥3 veces, o haya un aprendizaje de retrospectiva que deba codificarse.

**Q: ¿Actualizar guía existente o crear nueva?**  
A: Actualiza si es un refinamiento. Crea nueva si es un contexto distinto o no encaja con la estructura actual.

**Q: ¿Cómo sé si una regla es demasiado vaga?**  
A: Si no puedes escribir un checklist binario o una métrica cuantificable, es demasiado vaga.

**Q: ¿Puede una guía ser demasiado prescriptiva?**  
A: Sí. Si elimina toda toma de decisiones o requiere >10 pasos para tareas simples, simplifícala.

---

**Última actualización:** 2026-01-15  
**Estado:** Activo

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md

