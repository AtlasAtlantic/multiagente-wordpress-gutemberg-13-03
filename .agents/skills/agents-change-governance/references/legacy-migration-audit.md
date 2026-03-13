# Auditoría de migración de legado

Usa esta referencia al revisar skills, reglas o playbooks antiguos antes de integrarlos en `.agents/`.

## Preguntas de auditoría

Respóndelas explícitamente para cada artefacto o bloque de contenido legado:

1. ¿Cuál es su propósito real?
2. ¿Sigue siendo útil ese propósito en la plataforma actual?
3. ¿Tiene una sola responsabilidad?
4. ¿Está acoplado al repositorio, toolchain o workflow antiguo?
5. ¿Es reusable entre proyectos WordPress + Docker?
6. ¿Duplica una skill, tool, profile o regla arquitectónica actual?
7. ¿La estructura es lo bastante clara como para conservarla?
8. ¿Necesita refactor antes de reutilizarse?
9. ¿Debe seguir siendo una única skill o dividirse?
10. ¿Pertenece a una skill, a tooling, a documentación de arquitectura o a ninguna parte?

## Reglas de clasificación

Clasifica cada bloque legado en uno de estos resultados:

- `migrar-sin-cambios`: solo si ya es canónico, reusable y está alineado con el naming y el alcance actuales
- `migrar-con-refactor`: la idea es reusable, pero el contenido o la estructura deben cambiar antes de entrar en `.agents/`
- `dividir-en-varias-skills`: una skill antigua mezcla responsabilidades independientes
- `fusionar-con-skill-existente`: la capability ya existe y solo necesita reforzarse
- `descartar`: es específico del repositorio, obsoleto o incompatible con las reglas actuales de la plataforma
- `mover-a-documentacion`: aporta racional o referencia útil, pero no es lo bastante operativo para una skill
- `mover-a-tooling`: la ejecución determinista pertenece a `.agents/tools/`, no a prosa

## Qué conservar y qué rechazar

Conserva solo contenido que sea:

- canónico de `.agents/`
- reusable entre repositorios
- compatible con el vocabulario actual de la plataforma
- lo bastante específico como para guiar la acción
- lo bastante acotado como para seguir siendo mantenible

Rechaza o reescribe contenido que:

- trate `.codex/`, `CLAUDE.md`, `.cursor/` o los outputs runtime como fuente de verdad
- codifique Trello, GitLab, Venus u otras decisiones de workflow locales del proyecto
- apunte a skills inexistentes o a rutas específicas del repo
- mezcle reglas de implementación WordPress de negocio con gobernanza de plataforma
- duplique checks ya cubiertos por `doctor`, `validate-config` o `sync-runtime`

## Heurísticas de migración

- Prioriza extraer principios en lugar de copiar documentos.
- Sustituye rutas locales del repo por rutas canónicas de `.agents/`.
- Sustituye gobernanza específica de runtime por gobernanza platform-first.
- Mueve la guía detallada y opcional a `references/` en lugar de inflar `SKILL.md`.
- Si el material legado contiene pasos ejecutables que deban ser fiables, muévelos a `.agents/tools/`.

## Patrón de decisión para skills monolíticas antiguas

Si una skill legada es un índice mixto de estándares:

1. Identifica la capability reusable más pequeña que realmente aporta.
2. Separa la guía reusable del procedimiento operativo local.
3. Mantén el núcleo reusable como una sola skill solo si el propósito sigue siendo singular.
4. Descarta el resto o reubícalo en documentación/tooling cuando esa sea la capa correcta.
