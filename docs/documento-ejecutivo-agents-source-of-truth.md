# Documento ejecutivo  
## `.agents/` como fuente única de verdad para una arquitectura multiagente multi-runtime

**Versión:** 1.0  
**Fecha:** 2026-03-13  
**Ámbito:** configuración portable de agentes, skills, tools y runtimes para proyectos de desarrollo software

---

## 1. Resumen ejecutivo

Este documento define un planteamiento de arquitectura para entornos de trabajo asistidos por IA en los que conviven varios runtimes y herramientas, por ejemplo **Codex CLI, Claude, Cursor y ChatGPT**, sin acoplar la lógica del sistema a un proveedor concreto.

La decisión central es la siguiente:

> **`.agents/` debe ser la fuente única de verdad de toda la capa de IA del proyecto.**

Eso implica que dentro de `.agents/` debe residir de forma canónica:

- la definición de agentes y sus responsabilidades,
- los pipelines y handoffs,
- los perfiles de proyecto,
- las skills,
- las tools específicas de agentes,
- los guardrails,
- los esquemas de validación,
- y los adaptadores de runtime.

Los archivos específicos de cada runtime, como `.codex/`, `CLAUDE.md`, reglas de Cursor o instrucciones de proyecto equivalentes, **no deben ser origen de diseño**, sino **artefactos derivados o adaptadores generados** a partir de `.agents/`.

Este modelo persigue cinco objetivos estratégicos:

1. **Portabilidad entre proyectos**  
   La capa de IA puede reutilizarse como plantilla o base común.

2. **Neutralidad respecto a proveedor**  
   La arquitectura no depende de OpenAI, Anthropic, Cursor ni ningún runtime concreto.

3. **Gobernanza y mantenibilidad**  
   Se elimina la deriva entre archivos duplicados y se consolida una única referencia canónica.

4. **Escalabilidad organizativa**  
   Permite incorporar nuevos perfiles, skills, agentes o runtimes sin rediseñar el sistema.

5. **Auditabilidad y control operativo**  
   Todo el comportamiento de la capa IA queda centralizado, versionado y validable.

---

## 2. Problema que se quiere resolver

En la práctica, los equipos que trabajan con agentes de IA suelen acabar con la configuración repartida entre múltiples ubicaciones:

- `AGENTS.md` en raíz,
- `.codex/`,
- `CLAUDE.md`,
- reglas de Cursor,
- instrucciones embebidas en herramientas de chat,
- skills en rutas distintas,
- scripts desperdigados,
- y documentación informal fuera de control.

Este modelo genera problemas estructurales:

### 2.1 Duplicación de lógica
La misma norma de calidad, el mismo pipeline o la misma instrucción de comportamiento se replica en varios sitios.

### 2.2 Deriva entre runtimes
Un runtime queda actualizado y otro no. El sistema empieza a comportarse distinto según la herramienta usada.

### 2.3 Imposibilidad de saber qué manda realmente
Cuando varias ubicaciones contienen reglas parcialmente solapadas, deja de estar claro cuál es la referencia válida.

### 2.4 Mantenimiento caro
Cada cambio de arquitectura obliga a tocar varias superficies manualmente.

### 2.5 Baja portabilidad
Mover la configuración a otro proyecto requiere reconstruir piezas dispersas.

### 2.6 Riesgo operativo
Sin una fuente única de verdad, la revisión, validación y evolución del sistema se vuelven frágiles.

---

## 3. Tesis arquitectónica

La tesis de este documento es:

> **Toda la capa de automatización inteligente del proyecto debe declararse, gobernarse y evolucionarse desde `.agents/`.**

Y, como consecuencia:

> **Todo lo que quede fuera de `.agents/` y pertenezca a un runtime concreto debe considerarse derivado, adaptado o generado.**

Esto convierte `.agents/` en una capa canónica y estable sobre la que después se proyectan distintos runtimes.

---

## 4. Principios rectores

### 4.1 Fuente única de verdad
Solo `.agents/` contiene la definición canónica de la capa IA.

### 4.2 Separación entre modelo canónico y adaptadores
La lógica de agentes no se define en Codex, Claude o Cursor.  
Los runtimes solo consumen una representación adaptada.

### 4.3 Portabilidad por diseño
La estructura debe poder moverse entre proyectos con el menor coste posible.

### 4.4 Neutralidad de proveedor
El diseño debe sobrevivir al cambio de runtime o a la convivencia de varios a la vez.

### 4.5 Reproducibilidad
La configuración de runtimes derivados debe poder regenerarse de forma determinista.

### 4.6 Gobernanza explícita
Los contratos, roles, pipelines y handoffs deben estar formalizados y versionados.

### 4.7 Validación obligatoria
La estructura canónica debe poder validarse con esquemas, checks y herramientas de doctor.

### 4.8 Trazabilidad
Debe poder saberse qué versión de `.agents/` produjo cada artefacto runtime.

### 4.9 Evolución controlada
La arquitectura debe permitir cambios graduales sin romper proyectos ya existentes.

### 4.10 Separación clara entre capa IA y capa aplicación
`.agents/` gobierna cómo trabaja la IA; el resto del repo gobierna la aplicación o producto.

---

## 5. Alcance de `.agents/`

Dentro de `.agents/` debe vivir **todo lo que define cómo operan los agentes**.

### 5.1 Elementos que deben ser canónicos dentro de `.agents/`

- documento raíz de comportamiento,
- arquitectura,
- principios,
- glosario,
- agentes y sus roles,
- pipelines,
- perfiles,
- guardrails,
- skills,
- tools específicas de agentes,
- adaptadores runtime,
- esquemas de validación,
- utilidades de sincronización y doctor.

### 5.2 Elementos que no deberían ser canónicos dentro de `.agents/`

No deben confundirse con la capa IA:

- código fuente del producto,
- documentación funcional del producto,
- assets de aplicación,
- tests del negocio o aplicación,
- CI/CD de despliegue del producto,
- scripts generales usados por todo el equipo si no pertenecen a la capa IA.

---

## 6. Estructura recomendada

### 6.1 Estructura de alto nivel del proyecto

```text
project/
├─ src/
├─ tests/
├─ docs/
├─ scripts/
├─ README.md
└─ .agents/
```

### 6.2 Estructura canónica propuesta para `.agents/`

```text
.agents/
├─ AGENTS.md
│
├─ architecture/
│  ├─ principles.md
│  ├─ overview.md
│  ├─ glossary.md
│  ├─ routing.yaml
│  ├─ handoff_schema.yaml
│  ├─ state_model.yaml
│  └─ guardrails.yaml
│
├─ agents/
│  ├─ planner.md
│  ├─ builder.md
│  ├─ reviewer.md
│  ├─ fixer.md
│  └─ qa.md
│
├─ pipelines/
│  ├─ feature.yaml
│  ├─ bugfix.yaml
│  ├─ refactor.yaml
│  └─ audit.yaml
│
├─ profiles/
│  ├─ wordpress.yaml
│  ├─ laravel.yaml
│  ├─ plugin.yaml
│  └─ generic-web.yaml
│
├─ skills/
│  ├─ wp-plugin-development/
│  ├─ gutenberg-block-development/
│  ├─ docker-debug/
│  ├─ playwright-e2e/
│  └─ code-review/
│
├─ tools/
│  ├─ doctor/
│  ├─ sync-runtime/
│  ├─ validate-config/
│  └─ scaffold/
│
├─ runtime/
│  ├─ codex/
│  │  ├─ mapping.yaml
│  │  ├─ templates/
│  │  └─ output/
│  ├─ claude/
│  │  ├─ mapping.yaml
│  │  ├─ templates/
│  │  └─ output/
│  ├─ cursor/
│  │  ├─ mapping.yaml
│  │  ├─ templates/
│  │  └─ output/
│  └─ chatgpt/
│     ├─ mapping.yaml
│     ├─ templates/
│     └─ output/
│
└─ schemas/
   ├─ profile.schema.json
   ├─ pipeline.schema.json
   ├─ routing.schema.json
   └─ handoff.schema.json
```

---

## 7. Significado y responsabilidad de cada carpeta

### 7.1 `AGENTS.md`
Documento raíz y legible por humanos. Debe resumir:

- principios operativos,
- stack,
- restricciones,
- calidad,
- reglas comunes,
- y la existencia de `.agents/` como fuente de verdad.

No debe ser el único sitio donde vive la verdad, pero sí el **punto de entrada humano**.

### 7.2 `architecture/`
Contiene la definición formal del sistema:

- principios,
- glosario,
- reglas de routing,
- esquema de handoff,
- modelo de estado,
- guardrails.

Es la capa normativa y contractual.

### 7.3 `agents/`
Define cada rol de agente:

- objetivo,
- responsabilidades,
- entradas,
- salidas,
- límites,
- reglas de decisión,
- artefactos esperados.

### 7.4 `pipelines/`
Define flujos operativos estandarizados para tipos de trabajo distintos:

- nueva funcionalidad,
- bugfix,
- refactor,
- auditoría,
- migración, etc.

### 7.5 `profiles/`
Define variantes de comportamiento según el tipo de proyecto o dominio:

- WordPress,
- Laravel,
- frontend genérico,
- librerías PHP,
- plugins, etc.

### 7.6 `skills/`
Agrupa capacidades reutilizables empaquetadas como workflows operativos:

- instrucciones,
- scripts opcionales,
- recursos,
- contexto específico.

### 7.7 `tools/`
Agrupa herramientas específicas para la capa de agentes, no para el proyecto general.

Ejemplos:

- doctor de consistencia,
- sincronización de runtimes,
- validación de estructura,
- scaffolding de nuevas skills o perfiles.

### 7.8 `runtime/`
Contiene adaptadores por runtime.  
Aquí **no se redefine la arquitectura**; se traduce.

Cada runtime puede contener:

- mapeos,
- plantillas,
- salidas generadas,
- reglas de exportación.

### 7.9 `schemas/`
Permite validar formalmente la estructura.  
Es crítico para que el sistema no dependa de interpretaciones vagas.

---

## 8. Modelo operativo recomendado

### 8.1 Patrón de agentes recomendado
El patrón base recomendado es:

```text
Planner → Builder → Reviewer → Fixer → QA
```

Este patrón es suficientemente robusto, comprensible y portable.

### 8.2 Rol de cada agente

#### Planner
Responsable de:

- entender el problema,
- definir alcance,
- proponer estrategia,
- identificar archivos,
- detectar riesgos,
- definir validaciones.

#### Builder
Responsable de:

- implementar el cambio,
- usar skills apropiadas,
- ceñirse al plan,
- no ampliar scope sin justificación.

#### Reviewer
Responsable de:

- revisar el cambio,
- detectar defectos,
- identificar riesgos de regresión,
- validar coherencia técnica.

#### Fixer
Responsable de:

- aplicar correcciones derivadas de la review,
- cerrar issues detectados,
- no introducir cambios no solicitados.

#### QA
Responsable de:

- validar criterios de aceptación,
- ejecutar checks,
- revisar build, lint y tests,
- emitir veredicto final.

---

## 9. Handoffs y contratos entre agentes

Uno de los mayores errores en sistemas multiagente es no formalizar el traspaso de trabajo.

### 9.1 Qué debe resolver el handoff
El handoff debe dejar claro:

- quién entrega,
- quién recibe,
- qué se ha hecho,
- qué queda pendiente,
- qué riesgos existen,
- qué artefactos se han generado,
- qué verificaciones se esperan.

### 9.2 Ejemplo de campos de handoff
Un contrato razonable debería incluir:

- `role_from`
- `role_to`
- `objective`
- `assumptions`
- `scope`
- `files_touched`
- `repo_findings`
- `commands_run`
- `risks`
- `verification_plan`
- `artifacts`
- `status`

### 9.3 Beneficios
Formalizar handoffs:

- reduce ambigüedad,
- mejora la trazabilidad,
- evita pérdidas de contexto,
- facilita validación automática,
- mejora la calidad de los pipelines.

---

## 10. Skills como capacidades, no como agentes

Es importante distinguir ambos conceptos.

### 10.1 Qué es una skill
Una skill es una capacidad reutilizable que encapsula un workflow o conocimiento especializado.

Ejemplos:

- desarrollo de plugins WordPress,
- desarrollo de bloques Gutenberg,
- depuración Docker,
- validación E2E,
- revisión de seguridad.

### 10.2 Qué no es una skill
Una skill no es:

- un rol organizativo,
- un agente,
- un pipeline completo,
- una simple nota decorativa.

### 10.3 Por qué conviene que esté en `.agents/skills/`
Porque pertenece claramente a la capa IA del proyecto y debe heredar:

- versionado,
- validación,
- portabilidad,
- relación con perfiles y pipelines.

---

## 11. Tools específicas de agentes

### 11.1 Diferencia respecto a scripts generales del proyecto
Hay que separar:

- scripts generales del proyecto, que pueden vivir en `scripts/`,
- tools de agentes, que deben vivir en `.agents/tools/`.

### 11.2 Ejemplos de tools de agentes
- validador de estructura `.agents/`,
- sincronizador de runtimes,
- generador de adaptadores,
- comprobador de contratos,
- doctor general del sistema.

### 11.3 Por qué deben vivir dentro de `.agents/`
Porque su finalidad no es servir al producto, sino a la operación de la capa multiagente.

---

## 12. Runtimes como adaptadores, no como origen

Este punto es clave.

### 12.1 Qué significa “adaptador”
Un adaptador runtime traduce la arquitectura canónica a una representación consumible por un runtime concreto.

### 12.2 Qué runtimes pueden coexistir
Ejemplos:

- Codex CLI
- Claude
- Cursor
- ChatGPT
- futuros runtimes internos o corporativos

### 12.3 Qué no debe ocurrir
No debe ocurrir que:

- `.codex/` redefina reglas canónicas,
- `CLAUDE.md` introduzca comportamientos no reflejados en `.agents/`,
- Cursor tenga reglas distintas que nadie ha modelado en `.agents/`.

### 12.4 Regla de oro
> Los runtimes consumen la verdad; no la crean.

---

## 13. Flujo de sincronización recomendado

### 13.1 Flujo correcto

1. Se modifica `.agents/`
2. Se validan esquemas y referencias
3. Se regeneran adaptadores runtime
4. Se comparan diffs
5. Se ejecuta doctor
6. Se hace commit

### 13.2 Flujo incorrecto

1. Editar `.codex/`
2. Editar `CLAUDE.md`
3. Editar Cursor
4. Intentar alinear `.agents/` después

Ese flujo destruye la idea de fuente única de verdad.

---

## 14. Gobernanza del sistema

### 14.1 Política obligatoria
Debe existir una política explícita, por ejemplo en `architecture/principles.md`, que establezca:

- `.agents/` es la fuente única de verdad,
- los runtimes son derivados,
- toda modificación estructural se hace en `.agents/`,
- los adaptadores deben ser regenerables,
- la validación es obligatoria.

### 14.2 Revisión de cambios
Los cambios en `.agents/` deberían revisarse como cambios de arquitectura, no como simples cambios de documentación.

### 14.3 Versionado
Conviene incluir versión de spec para:

- estructura,
- schemas,
- pipelines,
- perfiles,
- mappings runtime.

---

## 15. Ventajas estratégicas del modelo

### 15.1 Portabilidad real entre proyectos
Una base `.agents/` bien diseñada se puede reutilizar casi como producto interno.

### 15.2 Menor dependencia de proveedor
Si mañana cambia el runtime dominante, la arquitectura permanece.

### 15.3 Menor duplicación
Una sola verdad evita copias inconsistentes.

### 15.4 Mejor auditoría
Es posible revisar el sistema completo desde una sola ubicación.

### 15.5 Mejor mantenimiento
Se reducen superficies de cambio y errores humanos.

### 15.6 Mejor onboarding
Nuevos miembros del equipo entienden más rápido dónde vive la configuración.

### 15.7 Evolución más segura
Añadir un runtime nuevo se vuelve un problema de adaptación, no de rediseño.

---

## 16. Riesgos y mitigaciones

### 16.1 Riesgo: convertir `.agents/` en un cajón desastre
**Mitigación:** definir contratos claros de qué pertenece y qué no pertenece a `.agents/`.

### 16.2 Riesgo: seguir editando runtimes a mano
**Mitigación:** declarar política formal y añadir checks automáticos.

### 16.3 Riesgo: exceso de complejidad inicial
**Mitigación:** empezar con una v1 pequeña pero ya bien estructurada.

### 16.4 Riesgo: tools y scripts mezclados
**Mitigación:** separar tools de agentes de scripts generales del proyecto.

### 16.5 Riesgo: falta de validación
**Mitigación:** introducir schemas, doctor y sincronización obligatoria.

---

## 17. Recomendación de implantación por fases

### Fase 1. Fundacional
Crear la estructura mínima:

- `.agents/AGENTS.md`
- `architecture/`
- `agents/`
- `profiles/`
- `skills/`
- `runtime/`
- `schemas/`

### Fase 2. Pipeline base
Definir:

- Planner
- Builder
- Reviewer
- QA

y un pipeline simple de feature y bugfix.

### Fase 3. Formalización
Añadir:

- handoff schema,
- routing,
- guardrails,
- validación automática.

### Fase 4. Adaptadores runtime
Incorporar mappings y salidas para:

- Codex,
- Claude,
- Cursor,
- ChatGPT.

### Fase 5. Automatización
Construir:

- doctor,
- sincronizador,
- scaffolders,
- comprobaciones de deriva.

---

## 18. Qué debe considerarse éxito

El modelo se considera correctamente implantado cuando se cumple todo lo siguiente:

- existe una única fuente de verdad en `.agents/`,
- ningún runtime define reglas canónicas por fuera,
- los artefactos runtime se pueden regenerar,
- la estructura valida con esquemas,
- los cambios tienen trazabilidad,
- se puede portar la configuración a otro proyecto con esfuerzo razonable.

---

## 19. Posición final

La propuesta no es simplemente “mover carpetas”.

Es una decisión de gobierno técnico:

> **`.agents/` debe convertirse en el sistema operativo de la capa IA del proyecto.**

Eso significa que:

- `skills/`, `tools/` y `runtime/` deben vivir dentro,
- `AGENTS.md` canónico también,
- los runtimes externos deben tratarse como salidas derivadas,
- y toda la operación debe girar alrededor de esa fuente única de verdad.

Este enfoque es más sólido que repartir la configuración entre varios proveedores y más escalable que depender de convenciones parciales de cada runtime.

---

## 20. Recomendación ejecutiva

Se recomienda adoptar oficialmente el siguiente principio de arquitectura:

> **Toda la configuración multiagente, multi-runtime y reusable del proyecto debe residir canónicamente en `.agents/`, que actuará como fuente única de verdad de la capa IA.**

Y operativamente:

1. centralizar toda definición estructural en `.agents/`,
2. tratar runtimes como adaptadores,
3. validar la estructura con esquemas,
4. automatizar sincronización y comprobación de deriva,
5. evolucionar la arquitectura por versiones.

---

## 21. Anexo: formulación corta para dirección o arquitectura

> Proponemos consolidar toda la configuración de agentes, skills, herramientas y adaptadores de runtime en una única carpeta canónica, `.agents/`, que actuará como fuente única de verdad de la capa de IA del proyecto.  
> Esto elimina duplicidades entre runtimes, reduce deriva operativa, facilita la portabilidad entre proyectos, mejora la gobernanza técnica y permite evolucionar el sistema de forma controlada e independiente del proveedor.

---