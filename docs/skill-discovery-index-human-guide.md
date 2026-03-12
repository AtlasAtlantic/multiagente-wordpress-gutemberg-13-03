# Guía Humana del Skill Discovery Index

## Qué hemos mejorado

Antes, el sistema de skills funcionaba, pero la información estaba repartida entre varios sitios:

- las carpetas de `./.agents/skills/`
- los `SKILL.md`
- `./.agents/skills-tier.yaml`
- `./.agents/multiagent.yaml`
- prompts y validadores

Eso obligaba a revisar varios archivos para entender:

- qué skills existen
- en qué tier está cada una
- cuáles son canónicas
- si faltaba alguna por conectar

Ahora existe un índice generado automáticamente:

- `./.agents/generated/skill-discovery-index.json`

Ese archivo no manda sobre el sistema. Solo resume de forma estructurada qué skills existen realmente.

La mejora práctica es esta:

- más claridad para humanos y agentes
- más facilidad para descubrir skills
- menos riesgo de incoherencias
- mejor base para validadores y tooling

La idea importante es:

- `.agents` sigue siendo la fuente de verdad
- el índice es solo un artefacto derivado para discovery y shortlist

## Qué pasa cuando añadimos una skill nueva

Sí hay que hacer algo, pero no es complicado.

El flujo correcto es:

1. Crear la nueva skill en `./.agents/skills/<skill-id>/SKILL.md`.
2. Añadir esa skill a `./.agents/skills-tier.yaml`.
3. Si aplica, conectarla en perfiles, routing, prompts o validadores.
4. Regenerar el índice:

```bash
./.agents/tools/generate-skill-discovery-index.sh
```

5. Validar el sistema:

```bash
./.agents/tools/agents-doctor.sh
```

Regla importante:

- no hay que editar `skill-discovery-index.json` a mano
- ese archivo se genera automáticamente

## La forma de trabajo

La forma de trabajo sigue siendo básicamente la misma.

No hemos cambiado cómo se decide qué hacer. El flujo sigue siendo:

1. `.agents` define el sistema.
2. `multiagent.yaml` decide routing y resolución.
3. los perfiles, prompts y guardrails gobiernan el comportamiento.
4. `agents-doctor` valida la coherencia.

Lo nuevo es solo una ayuda adicional:

- el `skill-discovery-index` permite discovery más claro
- facilita shortlist e inspección
- ayuda a detectar deriva antes

En otras palabras:

- no cambia cómo se trabaja día a día
- mejora cómo se organiza, consulta y valida la arquitectura de skills

## Flujo corto de mantenimiento

Cuando se cree o cambie una skill, el flujo recomendado es:

1. Editar la skill y su metadata canónica.
2. Actualizar `skills-tier.yaml` si hace falta.
3. Actualizar routing o perfiles solo si aplica.
4. Regenerar el índice.
5. Ejecutar `agents-doctor`.

## Regla de oro

Si hay una duda entre lo que dice el índice y lo que dice `.agents`, manda `.agents`.

El índice ayuda.
No gobierna.
