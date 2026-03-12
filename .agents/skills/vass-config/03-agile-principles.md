---
title: Principios y valores Agile para el desarrollo asistido por IA
alwaysApply: true
category: workflow
---
# Principios y valores Agile para el desarrollo asistido por IA

## TL;DR

- ✅ **OBLIGATORIO**: Cada commit debe producir software que funcione (tests pasan si existen, o verificación manual en entorno WordPress)
- ✅ **OBLIGATORIO**: Las features solo están "hechas" cuando están probadas (automática o manualmente), documentadas y desplegables
- ❌ **PROHIBIDO**: Marcar tareas como completadas si el código no funciona o la verificación falla
- ❌ **PROHIBIDO**: Considerar documentación o planificación como "progreso" sin código funcionando
- Antes de marcar cualquier tarea como completa:



## Propósito

Este documento define cómo se aplican los principios Agile, los valores de Extreme Programming (XP), los valores de Scrum y las prácticas de mejora continua al desarrollo de software asistido por IA. Estos principios guían la toma de decisiones, el flujo de trabajo y los estándares de calidad de código.

## Cuando aplica

- alwaysApply: true
- category: workflow


## Reglas

---

## 1. Principios ágiles fundamentales

### 1.1. El software funcionando es la medida principal de progreso

**Principio**: La única medida válida de progreso es software que funcione, esté probado y sea desplegable.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Cada commit debe producir software que funcione (tests pasan si existen, o verificación manual en entorno WordPress)
- ✅ **OBLIGATORIO**: Las features solo están "hechas" cuando están probadas (automática o manualmente), documentadas y desplegables
- ❌ **PROHIBIDO**: Marcar tareas como completadas si el código no funciona o la verificación falla
- ❌ **PROHIBIDO**: Considerar documentación o planificación como "progreso" sin código funcionando

**Verificación**:
- Antes de marcar cualquier tarea como completa:
  - Si hay tests: ejecutarlos, deben pasar todos
  - Si no hay tests: verificar manualmente la feature en entorno WordPress
- Antes de hacer commit: verificar que la feature funciona manualmente en WordPress o con tests automatizados
- El progreso se mide por: número de tests pasando (si existen), features funcionando verificadas en WordPress, funcionalidad desplegada

**Ejemplo**:
```
✅ Progreso: "Añadido bloque custom - test manual correcto en WordPress, sin errores en el debug log"
✅ Progreso: "Añadido soporte de theme - 8 tests pasando, test manual correcto"
❌ No es progreso: "Diseñada la arquitectura del theme - documentación completada"
```

### 1.2. Atención continua a la excelencia técnica

**Principio**: Mantener altos estándares de calidad de código de forma continua, no como algo posterior.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Ejecutar PHPCS (WordPress Coding Standards) antes de cada commit
- ✅ **OBLIGATORIO**: Ejecutar PHPStan antes de cada commit (si está disponible)
- ✅ **OBLIGATORIO**: Corregir problemas de calidad inmediatamente, no acumular deuda técnica
- ✅ **OBLIGATORIO**: Refactorizar cuando aparezcan patrones (principio DRY)
- ❌ **PROHIBIDO**: Hacer commits que no pasan controles de calidad
- ❌ **PROHIBIDO**: Posponer refactorizaciones "para más tarde"

**Puertas de calidad** (todas deben pasar):
1. Formato de código: `./vendor/bin/phpcs` o `composer phpcs` - sin errores
2. Análisis estático: `./vendor/bin/phpstan analyse` - sin errores (si está disponible)
3. Tests: Todos pasan (si hay infraestructura de tests)
4. Verificación manual: La feature funciona como se espera en entorno WordPress

**Checklist de verificación**:
- [ ] PHPCS pasa sin warnings (WordPress Coding Standards)
- [ ] PHPStan pasa sin errores (si está disponible)
- [ ] Todos los tests pasan (si hay infraestructura de tests)
- [ ] Verificación manual en WordPress completada (si no hay tests)
- [ ] El código sigue patrones de WordPress y estándares del proyecto
- [ ] No se ha introducido duplicación de código

### 1.3. Simplicidad - maximizar el trabajo no hecho

**Principio**: Construir solo lo necesario ahora. Evitar sobre-ingeniería y complejidad innecesaria.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Implementar la solución más simple que funcione
- ✅ **OBLIGATORIO**: Cuestionar cada feature: "¿Es necesario ahora?"
- ✅ **OBLIGATORIO**: Eliminar código, comentarios y dependencias sin uso
- ❌ **PROHIBIDO**: Añadir features "por si acaso"
- ❌ **PROHIBIDO**: Implementar soluciones complejas cuando sirven las simples
- ❌ **PROHIBIDO**: Mantener código muerto o comentado

**Marco de decisión**:
Antes de añadir complejidad, pregúntate:
1. ¿Esto es requerido para la feature actual?
2. ¿Podemos resolverlo con patrones existentes?
3. ¿Se va a usar en la siguiente iteración?
4. Si la respuesta es "no" a todo: no lo implementes

**Ejemplos**:
```
✅ Simple: Usar funciones y hooks existentes de WordPress
❌ Complejo: Crear una implementación custom cuando WordPress aporta la funcionalidad

✅ Simple: Usar transients de WordPress para cachear
❌ Complejo: Crear un sistema de caché propio

✅ Simple: Añadir un método a una clase existente del theme
❌ Complejo: Crear una nueva clase para un único caso de uso

✅ Simple: Usar arrays para estructuras de datos pequeñas
❌ Complejo: Crear una clase de colección custom para 3 ítems

✅ Simple: Usar get_posts() para consultas
❌ Complejo: Escribir SQL custom cuando bastan funciones de WordPress
```

### 1.4. Entregar software funcionando con frecuencia

**Principio**: Entregar incrementos pequeños y funcionales con frecuencia (días/semanas, no meses).

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Hacer commit tras cada cambio pequeño y funcional (ver principio de baby steps)
- ✅ **OBLIGATORIO**: Cada commit debe ser desplegable de forma independiente (tests pasan si existen o verificación manual en WordPress correcta)
- ✅ **OBLIGATORIO**: Hacer push a la rama regularmente (al menos a diario)
- ✅ **OBLIGATORIO**: Crear PRs cuando la feature está completa y probada
- ❌ **PROHIBIDO**: Acumular cambios para "grandes commits"
- ❌ **PROHIBIDO**: Trabajar días sin hacer commits

**Frecuencia de entrega**:
- **Commits**: Tras cada pequeño paso (minutos/horas)
- **Pushes**: Al menos una vez al día
- **PRs**: Cuando la feature está completa (normalmente 1-3 días de trabajo)
- **Releases**: Según el calendario del proyecto

**Verificación**:
- Revisar git log: Deberían verse commits regulares (sin huecos de días)
- Revisar rama: Debería pushearse con regularidad
- Revisar PRs: Deben ser pequeños y focalizados (ver estándares de PR)

### 1.5. Aceptar requisitos cambiantes

**Principio**: Adaptarse a requisitos cambiantes, incluso tarde en el desarrollo.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Diseñar el código para que sea flexible y modificable
- ✅ **OBLIGATORIO**: Usar abstracciones e interfaces en áreas propensas a cambio
- ✅ **OBLIGATORIO**: Mantener el código modular y con bajo acoplamiento
- ✅ **OBLIGATORIO**: Refactorizar cuando cambien requisitos (no parchear)
- ❌ **PROHIBIDO**: Resistirse a cambios de requisitos
- ❌ **PROHIBIDO**: Hardcodear valores que puedan cambiar

**Diseño para el cambio**:
- Usar inyección de dependencias
- Extraer configuración a constantes/archivos de config
- Usar interfaces para dependencias externas
- Mantener métodos pequeños y enfocados (responsabilidad única)
- Escribir tests que validen comportamiento, no implementación

**Ejemplo**:
```
✅ Flexible: Definir constantes del theme en theme.json o en un fichero de config (fácil de cambiar)
❌ Rígido: Valores hardcodeados en múltiples archivos PHP

✅ Flexible: Usar hooks y filters de WordPress (pueden ser modificados por plugins)
❌ Rígido: Llamadas directas que no se pueden sobrescribir

✅ Flexible: Interfaz para servicios (permite cambiar implementaciones)
❌ Rígido: Instanciación directa de una clase concreta
```

---

## 2. Valores de Extreme Programming (XP)

### 2.1. Comunicación

**Valor**: Una comunicación abierta y frecuente garantiza que todos entienden requisitos y objetivos.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Escribir mensajes de commit claros y descriptivos
- ✅ **OBLIGATORIO**: Documentar decisiones y justificaciones en comentarios de código
- ✅ **OBLIGATORIO**: Usar nombres de variables y métodos significativos (código auto-documentado)
- ✅ **OBLIGATORIO**: Actualizar la documentación cuando cambie el comportamiento
- ❌ **PROHIBIDO**: Nombres crípticos o abreviaturas
- ❌ **PROHIBIDO**: Commits con mensajes tipo "fix" o "update"

**Estándares de comunicación**:
- **Código**: Auto-documentado (los nombres explican el propósito)
- **Comentarios**: Explican el "por qué", no el "qué" (el código muestra el "qué")
- **Mensajes de commit**: Describen qué cambió y por qué
- **Documentación**: Mantenerla actualizada con cambios de código

**Verificación**:
- ¿Puede un desarrollador nuevo entender el código sin hacer preguntas?
- ¿Los mensajes de commit explican el cambio con claridad?
- ¿La documentación está actualizada respecto al código?

**Ejemplos**:
```
✅ Claro: $post_title = get_the_title($post_id);
❌ Poco claro: $pt = get($id);

✅ Claro: // Usar wp_insert_post() para crear el post con todo el meta de forma atómica
❌ Poco claro: // crear post

✅ Commit claro: "feat: add custom block registration for hero section"
❌ Commit poco claro: "fix: update theme"
```

### 2.2. Simplicidad

**Valor**: Construir solo lo que se necesita hoy. Evitar complejidad innecesaria.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Implementar la solución más simple que funcione
- ✅ **OBLIGATORIO**: No añadir features hasta que se necesiten
- ✅ **OBLIGATORIO**: Eliminar código sin uso de inmediato
- ✅ **OBLIGATORIO**: Preferir estructuras simples (arrays) frente a complejas (clases custom) cuando proceda
- ❌ **PROHIBIDO**: Sobre-ingeniería
- ❌ **PROHIBIDO**: Añadir features "nice-to-have"
- ❌ **PROHIBIDO**: Optimización prematura

**Checklist de simplicidad**:
Antes de implementar, pregunta:
1. ¿Es esta la forma más simple de resolver el problema?
2. ¿Lo necesitamos ahora o podemos esperar?
3. ¿Podemos usar patrones/herramientas existentes?
4. ¿Esto hará el código más difícil de entender?

**Ejemplos**:
```
✅ Simple: return ['title' => $title, 'content' => $content];
❌ Complejo: return new PostDataDTO($title, $content);

✅ Simple: if ($post_id !== null) { ... }
❌ Complejo: if (Optional::of($post_id)->isPresent()) { ... }

✅ Simple: Usar wp_remote_get() de WordPress para peticiones HTTP
❌ Complejo: Crear un wrapper custom para cliente HTTP
```

### 2.3. Feedback

**Valor**: Ciclos de feedback cortos permiten ajustes y mejoras rápidas.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Ejecutar tests tras cada cambio (si existen) O verificar manualmente en WordPress
- ✅ **OBLIGATORIO**: Obtener feedback de tests antes de continuar (TDD cuando existan)
- ✅ **OBLIGATORIO**: Revisar los controles de calidad (PHPCS, PHPStan) inmediatamente
- ✅ **OBLIGATORIO**: Probar manualmente en WordPress tras cambios de código
- ✅ **OBLIGATORIO**: Revisar el debug log de WordPress tras cambios
- ✅ **OBLIGATORIO**: Actualizar el Learning Log con feedback y aprendizajes
- ❌ **PROHIBIDO**: Hacer múltiples cambios sin probar/verificar
- ❌ **PROHIBIDO**: Ignorar fallos de tests, warnings o errores de WordPress

**Bucles de feedback**:
1. **Código → Test/Verificar** (segundos): escribir código, ejecutar tests (si existen) o verificar en WordPress inmediatamente
2. **Test → Arreglar** (minutos): corregir tests en rojo antes de continuar (si hay tests)
3. **Calidad → Arreglar** (minutos): corregir problemas de PHPCS/PHPStan de inmediato
4. **Manual WordPress → Ajustar** (minutos): probar en WordPress, revisar debug log, ajustar si hace falta
5. **Retrospectiva → Mejorar** (días): aprender de errores, actualizar reglas

**Fuentes de feedback**:
- Tests automatizados (feedback más rápido, si existen)
- Herramientas de calidad de código (PHPCS, PHPStan)
- Pruebas manuales en entorno WordPress (admin, frontend)
- Debug log de WordPress (WP_DEBUG_LOG)
- Consola del navegador (errores JavaScript)
- Revisiones de código (perspectiva de pares)
- Métricas de producción (feedback en el mundo real)

**Verificación**:
- ¿Se ejecutan tests tras cada cambio (si existen)?
- ¿Se hace verificación manual en WordPress tras cada cambio?
- ¿Se corrigen problemas de calidad de inmediato?
- ¿Se documenta y aplica el feedback?

---

## 3. Valores de Scrum

### 3.1. Compromiso

**Valor**: El equipo se compromete a alcanzar objetivos y apoyarse mutuamente.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Completar tareas antes de pasar a nuevas
- ✅ **OBLIGATORIO**: Cumplir el trabajo planificado
- ✅ **OBLIGATORIO**: No abandonar trabajo incompleto
- ✅ **OBLIGATORIO**: Verificar que el trabajo está realmente completo (tests, calidad, documentación)
- ❌ **PROHIBIDO**: Empezar tareas nuevas si las actuales están incompletas
- ❌ **PROHIBIDO**: Marcar tareas "done" cuando no están totalmente completas

**Definition of Done** (todo debe cumplirse):
- [ ] Código implementado y funcionando
- [ ] Tests escritos y pasando (si hay infraestructura de tests), O verificación manual en WordPress completada
- [ ] Controles de calidad pasan (PHPCS, PHPStan si están disponibles)
- [ ] Pruebas manuales en entorno WordPress realizadas (admin y frontend)
- [ ] Debug log de WordPress revisado (sin errores)
- [ ] Consola del navegador revisada (sin errores JavaScript, si aplica)
- [ ] Documentación actualizada (si aplica)
- [ ] Código revisado (si aplica)
- [ ] Committed y pusheado

### 3.2. Coraje

**Valor**: El equipo tiene coraje para hacer lo correcto y abordar problemas difíciles.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Refactorizar cuando la calidad del código degrade
- ✅ **OBLIGATORIO**: Eliminar deuda técnica, no acumularla
- ✅ **OBLIGATORIO**: Admitir errores y aprender de ellos
- ✅ **OBLIGATORIO**: Cuestionar requisitos si no tienen sentido
- ❌ **PROHIBIDO**: Evitar refactorizaciones difíciles
- ❌ **PROHIBIDO**: Ocultar problemas o deuda técnica

**Acciones valientes**:
- Refactorizar métodos grandes en otros más pequeños
- Eliminar código y dependencias sin uso
- Arreglar tests en rojo en vez de comentarlos
- Actualizar patrones obsoletos aunque "funcionen"
- Documentar errores en el Learning Log

### 3.3. Foco

**Valor**: Centrarse en el trabajo en curso y en los objetivos del sprint.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Trabajar en una sola tarea a la vez (ver baby steps)
- ✅ **OBLIGATORIO**: Completar la tarea actual antes de empezar la siguiente
- ✅ **OBLIGATORIO**: Evitar el cambio de contexto
- ✅ **OBLIGATORIO**: Minimizar distracciones e interrupciones
- ❌ **PROHIBIDO**: Multitarea o trabajar en varias features a la vez
- ❌ **PROHIBIDO**: Cambiar de tarea cuando la actual se pone difícil

**Prácticas de foco**:
- Un commit = un cambio pequeño
- Una tarea = completar antes de la siguiente
- Una feature = terminar antes de empezar otra
- Un problema = resolver antes de pasar al siguiente

### 3.4. Apertura

**Valor**: El equipo y los stakeholders son transparentes sobre el trabajo y los retos.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Documentar problemas y soluciones en el Learning Log
- ✅ **OBLIGATORIO**: Ser transparente sobre errores y aprendizajes
- ✅ **OBLIGATORIO**: Compartir conocimiento mediante documentación
- ✅ **OBLIGATORIO**: Actualizar reglas cuando cambien patrones
- ❌ **PROHIBIDO**: Ocultar problemas o fallos
- ❌ **PROHIBIDO**: No documentar aprendizajes

**Prácticas de apertura**:
- Documentar errores en el Learning Log
- Actualizar reglas cuando se cometan errores
- Compartir soluciones y patrones
- Ser honesto sobre lo que funciona y lo que no

### 3.5. Respeto

**Valor**: Los miembros del equipo se respetan entre sí y a los stakeholders.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Escribir código que otros puedan entender y mantener
- ✅ **OBLIGATORIO**: Seguir estándares y convenciones del proyecto
- ✅ **OBLIGATORIO**: Escribir mensajes de commit claros para futuros desarrolladores
- ✅ **OBLIGATORIO**: Mantener el código limpio y bien organizado
- ❌ **PROHIBIDO**: Escribir código que solo tú puedas entender
- ❌ **PROHIBIDO**: Ignorar estándares del proyecto

**Prácticas respetuosas**:
- Código auto-documentado
- Convenciones de nombres claras
- Estilo de código consistente
- Comentarios y documentación útiles

---

## 4. Mejora continua

### 4.1. Ciclo PDCA (Plan-Do-Check-Act)

**Marco**: Enfoque estructurado para experimentación y mejora.

**Reglas de aplicación**:

#### PLAN
- ✅ **OBLIGATORIO**: Crear un plan detallado antes de implementar
- ✅ **OBLIGATORIO**: Identificar riesgos y estrategias de mitigación
- ✅ **OBLIGATORIO**: Definir criterios de éxito y cómo medirlos
- ✅ **OBLIGATORIO**: Revisar patrones similares antes de implementar

**Checklist de plan**:
- [ ] Análisis previo a la implementación completado
- [ ] Patrones de código similares identificados
- [ ] Estrategia de tests definida
- [ ] Criterios de éxito claros
- [ ] Riesgos identificados

#### DO
- ✅ **OBLIGATORIO**: Seguir el plan (baby steps, TDD si hay tests, verificación manual si no)
- ✅ **OBLIGATORIO**: Documentar desviaciones y por qué
- ✅ **OBLIGATORIO**: Registrar qué funciona y qué no

**Checklist de ejecución**:
- [ ] Seguir el principio de baby steps
- [ ] Escribir tests primero (TDD si hay infraestructura de tests)
- [ ] Verificación manual en WordPress (si no hay tests)
- [ ] Commit tras cada pequeño paso
- [ ] Ejecutar controles de calidad antes de hacer commit (PHPCS, PHPStan)

#### CHECK
- ✅ **OBLIGATORIO**: Verificar que los resultados coinciden con el plan
- ✅ **OBLIGATORIO**: Medir resultados (tests pasan, métricas de calidad)
- ✅ **OBLIGATORIO**: Identificar qué funcionó y qué no
- ✅ **OBLIGATORIO**: Comparar resultados reales vs. esperados

**Actividades de comprobación**:
- Ejecutar todos los tests (si hay infraestructura)
- Revisar calidad de código: `./vendor/bin/phpcs`, `./vendor/bin/phpstan analyse` (si está disponible)
- Pruebas manuales en entorno WordPress
- Revisar debug log de WordPress para errores
- Revisar entradas del Learning Log
- Comparar tiempo/esfuerzo real vs. estimado

#### ACT
- ✅ **OBLIGATORIO**: Actualizar reglas según aprendizajes
- ✅ **OBLIGATORIO**: Documentar mejoras en el Learning Log
- ✅ **OBLIGATORIO**: Aplicar mejoras a la siguiente iteración
- ✅ **OBLIGATORIO**: Compartir aprendizajes con el equipo (vía documentación)

**Actividades de acción**:
- Actualizar `.codex/rules/` con nuevos aprendizajes
- Actualizar Learning Log en documentos de planificación
- Ajustar el proceso para la siguiente feature
- Eliminar anti-patrones del flujo de trabajo

### 4.2. Retrospectivas regulares

**Práctica**: Reflexión regular sobre lo que funcionó y lo que no.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Documentar errores en el Learning Log de inmediato
- ✅ **OBLIGATORIO**: Actualizar reglas cuando se identifiquen patrones
- ✅ **OBLIGATORIO**: Revisar el Learning Log antes de empezar nuevas features
- ✅ **OBLIGATORIO**: Hacer retrospectiva tras completar features

**Preguntas de retrospectiva**:
1. ¿Qué fue bien?
2. ¿Qué no fue bien?
3. ¿Qué aprendimos?
4. ¿Qué deberíamos cambiar?
5. ¿Qué deberíamos seguir haciendo?

**Resultado de la retrospectiva**:
- Entradas en el Learning Log
- Reglas actualizadas en `.codex/rules/`
- Mejoras de proceso
- Anti-patrones a evitar

### 4.3. Mejoras basadas en datos

**Práctica**: Registrar métricas para asegurar que los cambios conducen a los resultados deseados.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Registrar cobertura de tests y métricas de calidad
- ✅ **OBLIGATORIO**: Medir tiempo para completar tareas
- ✅ **OBLIGATORIO**: Contar errores y fallos
- ✅ **OBLIGATORIO**: Usar datos para validar mejoras

**Métricas a seguir**:
- **Calidad**: Errores PHPCS (WordPress Coding Standards), errores PHPStan, fallos de tests (si hay tests)
- **Velocidad**: Tiempo para completar features, commits por día
- **Fiabilidad**: Ratio de tests pasando (si hay tests), éxito de verificación manual en WordPress
- **Proceso**: Tamaño de commits, tamaño de PRs, tiempo de revisión

**Validación de mejoras**:
- Antes del cambio: Métricas base
- Después del cambio: Nuevas métricas
- Comparar: ¿Mejoraron las métricas?
- Si no: Ajustar el enfoque

**Ejemplo**:
```
Base: Tamaño medio de commit = 8 archivos, 350 líneas
Después de la regla: Tamaño medio de commit = 3 archivos, 120 líneas
Resultado: ✅ Mejora (commits más pequeños)
Acción: Mantener la regla, seguir monitorizando
```

### 4.4. Objetivos claros y medibles

**Práctica**: Definir objetivos específicos y medibles alineados con el valor para el cliente.

**Reglas de aplicación**:
- ✅ **OBLIGATORIO**: Definir criterios de éxito medibles para cada feature
- ✅ **OBLIGATORIO**: Alinear objetivos con valor para el cliente (software funcionando)
- ✅ **OBLIGATORIO**: Registrar el progreso hacia los objetivos
- ✅ **OBLIGATORIO**: Ajustar objetivos según feedback

**Marco de objetivos (SMART)**:
- **Específico**: Claro, sin ambigüedad
- **Medible**: Se puede cuantificar
- **Alcanzable**: Realista y alcanzable
- **Relevante**: Alineado con el valor para el cliente
- **Temporal**: Tiene fecha límite

**Ejemplos de objetivos**:
```
✅ Bien: "Reducir el tamaño medio de commit a ≤5 archivos y ≤200 líneas en 2 semanas"
❌ Mal: "Hacer commits más pequeños"

✅ Bien: "Alcanzar 100% de tests pasando para el bloque custom" (si hay tests)
✅ Bien: "Completar el bloque custom con verificación manual en WordPress en 1 día"
❌ Mal: "Escribir buenos tests"

✅ Bien: "Completar la refactorización del theme con todos los tests pasando en 1 día" (si hay tests)
✅ Bien: "Completar la refactorización del theme con verificación manual en WordPress en 1 día"
❌ Mal: "Refactorizar theme"
```

---

## 5. Integración con principios existentes

### 5.1. Baby Steps + Agile

- **Baby Steps** = Entregas pequeñas y frecuentes (principio Agile 1.4)
- **Un paso cada vez** = Foco (valor Scrum 3.3)
- **Commit tras cada paso** = Software funcionando (principio Agile 1.1)

### 5.2. TDD + Feedback XP

- **Ciclo TDD** = Bucles de feedback cortos (valor XP 2.3) - cuando hay infraestructura de tests
- **Verificación manual** = Bucle de feedback alternativo cuando no hay tests
- **Tests primero** = Coraje para refactorizar (valor Scrum 3.2) - cuando hay tests
- **Red-Green-Refactor** = Mejora continua (Sección 4) - cuando hay tests
- **Código → Verificar WordPress → Ajustar** = Bucle de feedback cuando no hay tests

### 5.3. Calidad de código + excelencia técnica

- **PHPCS/PHPStan** = Excelencia técnica (principio Agile 1.2)
- **WordPress Coding Standards** = Consistencia con el ecosistema WordPress
- **Quality gates** = Compromiso con la calidad (valor Scrum 3.1)
- **Arreglar de inmediato** = Respeto al codebase (valor Scrum 3.5)

### 5.4. Learning Log + mejora continua

- **Documentar errores** = Apertura (valor Scrum 3.4)
- **Actualizar reglas** = Fase Act (PDCA 4.1)
- **Compartir aprendizajes** = Comunicación (valor XP 2.1)

---

## 6. Checklist de verificación

Antes de marcar cualquier tarea como completa, verifica:

### Principios Agile
- [ ] Software funcionando: tests pasan (si existen) o verificación manual en WordPress correcta
- [ ] Excelencia técnica: PHPCS y PHPStan pasan (si están disponibles)
- [ ] Simplicidad: No se añadió complejidad innecesaria
- [ ] Entrega frecuente: Se hicieron commits tras pasos pequeños
- [ ] Adaptabilidad: El código es flexible y modificable

### Valores XP
- [ ] Comunicación: Código auto-documentado, commits claros
- [ ] Simplicidad: Solución más simple que funciona
- [ ] Feedback: Tests ejecutados (si existen), controles de calidad OK, prueba manual en WordPress hecha

### Valores Scrum
- [ ] Compromiso: La tarea está realmente completa (todos los checks pasan)
- [ ] Coraje: Deuda técnica abordada, no acumulada
- [ ] Foco: Una tarea completada antes de empezar la siguiente
- [ ] Apertura: Errores documentados, aprendizajes compartidos
- [ ] Respeto: Código sigue estándares WordPress y es mantenible

### Verificación WordPress
- [ ] La feature funciona en el admin de WordPress (si aplica)
- [ ] La feature funciona en el frontend
- [ ] Sin errores PHP en el debug log de WordPress
- [ ] Sin errores en consola JavaScript (si aplica)
- [ ] Diseño responsive funciona (si aplica)
- [ ] Pruebas cross-browser completadas (si aplica)

### Mejora continua
- [ ] PDCA: Plan seguido, resultados comprobados, mejoras aplicadas
- [ ] Retrospectiva: Aprendizajes documentados en Learning Log
- [ ] Basado en datos: Métricas registradas, mejoras validadas
- [ ] Objetivos: Criterios de éxito claros y medibles cumplidos

---

## 7. Anti-patrones a evitar

❌ **Violar el principio de software funcionando**:
- Marcar tareas completas cuando los tests no pasan
- Hacer commits con código roto
- Considerar documentación como "progreso" sin código funcionando

❌ **Ignorar la excelencia técnica**:
- Saltarse PHPCS/PHPStan
- Acumular deuda técnica
- Posponer refactorizaciones
- No revisar el debug log de WordPress

❌ **Sobre-ingeniería**:
- Añadir features "por si acaso"
- Crear soluciones complejas cuando sirven las simples
- Optimización prematura

❌ **Entrega poco frecuente**:
- Acumular cambios para "grandes commits"
- Trabajar días sin commits
- PRs grandes e inrevisables

❌ **Resistirse al cambio**:
- Hardcodear valores que puedan cambiar
- Acoplar código en exceso
- Negarse a refactorizar cuando cambian requisitos

❌ **Mala comunicación**:
- Nombres de variables crípticos
- Mensajes de commit poco claros
- Documentación desactualizada

❌ **Falta de feedback**:
- Hacer múltiples cambios sin tests/verificación
- Ignorar fallos de tests (si existen)
- No ejecutar controles de calidad
- No verificar cambios en entorno WordPress
- Ignorar errores del debug log de WordPress

❌ **Sin mejora continua**:
- No documentar errores
- No actualizar reglas
- No aprender de fallos

---

## 8. Métricas de éxito

Registra estas métricas para medir la adherencia a los principios Agile:

### Calidad de código
- Errores PHPCS por commit: **Objetivo: 0** (WordPress Coding Standards)
- Errores PHPStan por commit: **Objetivo: 0** (si está disponible)
- Ratio de tests pasando: **Objetivo: 100%** (si hay infraestructura de tests)
- Ratio de verificación manual: **Objetivo: 100%** (entorno WordPress)

### Frecuencia de entrega
- Commits por día: **Objetivo: ≥3**
- Tamaño medio de commit: **Objetivo: ≤5 archivos, ≤200 líneas**
- Tiempo entre commits: **Objetivo: ≤4 horas**

### Calidad de proceso
- Tareas completadas vs. iniciadas: **Objetivo: 1:1** (terminar antes de empezar nuevo)
- Actualizaciones de Learning Log: **Objetivo: tras cada error/aprendizaje**
- Actualizaciones de reglas: **Objetivo: cuando se identifiquen patrones**

### Valor para el cliente
- Features funcionando entregadas: **Objetivo: cada PR incluye una feature funcionando y probada**
- Tiempo de entrega: **Objetivo: 1-3 días por feature**
- Tasa de defectos: **Objetivo: <5% de features necesitan fixes**

---

## 9. Referencias

- [Agile Manifesto](https://agilemanifesto.org/)
- [Extreme Programming Values](http://www.extremeprogramming.org/values.html)
- [Scrum Values](https://scrumguides.org/scrum-guide.html)
- [Ciclo PDCA](https://en.wikipedia.org/wiki/PDCA)
- [Objetivos SMART](https://en.wikipedia.org/wiki/SMART_criteria)

---

## 10. Mantenimiento del documento

Este documento debe actualizarse:
- Cuando se identifiquen nuevos patrones Agile/XP/Scrum
- Cuando las métricas indiquen que hacen falta mejoras de proceso
- Tras retrospectivas que identifiquen nuevas prácticas
- Cuando el equipo aprenda mejores formas de aplicar principios

**Última actualización:** 2026-01-15  
**Estado:** Activo  
**Próxima revisión**: Tras completar la siguiente feature importante

## Relacionado con

- 00-base-standards.md
- 01-core-principles.md

