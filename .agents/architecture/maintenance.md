# Mantenimiento de la plataforma

## Qué cuenta como plataforma

Los artefactos reutilizables de plataforma son las piezas canónicas que deben funcionar entre repositorios:

- `architecture/`
- `agents/`
- `pipelines/`
- `schemas/`
- `skills/`
- `tools/`
- `runtime/` adapters, mappings, and templates
- `version.yaml`
- `catalog.yaml`
- `compatibility.yaml`

Modifica artefactos de plataforma cuando el cambio sea reusable entre varios proyectos. No muevas aquí comportamiento local del repositorio.

## Qué cuenta como perfil reusable

Los perfiles reutilizables viven en `profiles/`.

Crea un perfil nuevo cuando:

- un tipo de proyecto WordPress tenga comportamiento estable y reusable
- un patrón de infraestructura se comparta entre proyectos
- el nuevo comportamiento no pueda expresarse como override local en `project/project.yaml`

Modifica un perfil existente cuando:

- el comportamiento ya pertenezca a ese tipo reusable
- el cambio deba afectar a todos los proyectos que activen ese perfil

No añadas rutas específicas del repositorio, nombres de servicios ni checks puntuales a perfiles reutilizables.

## Qué cuenta como contexto de proyecto

El contexto de proyecto vive en `project/project.yaml`.

Solo puede contener:

- rutas locales del repositorio
- nombres de servicios locales
- perfiles activos
- checks exclusivos del proyecto
- overrides locales explícitos

No debe contener comportamiento reusable que ya pertenezca a metadatos de plataforma o a perfiles reutilizables.

## Qué cuenta como runtime derivado

Los artefactos runtime derivados viven en `runtime/*`.

Reglas:

- `mapping.yaml` y las plantillas son definiciones del adaptador y siguen siendo canónicas
- `output/` siempre es derivado
- `output/` debe regenerarse con `sh .agents/tools/sync-runtime/run.sh`
- los archivos runtime generados nunca deben editarse manualmente
- los adaptadores runtime nunca deben redefinir comportamiento de plataforma fuera de `.agents/`

## Cómo evolucionar la plataforma

Al añadir perfiles:

- prefiere extender un perfil reusable existente si el comportamiento ya está cubierto
- crea un perfil nuevo solo cuando el comportamiento sea una variante reusable estable
- actualiza `catalog.yaml`, `compatibility.yaml`, schemas y validación si cambia la taxonomía

Al deprecar perfiles:

- mantén el archivo mientras siga siendo necesaria la compatibilidad
- márcalo explícitamente con un estado como `compatibility-profile` o `deprecated`
- elimínalo de las listas principales de perfiles reutilizables antes de borrarlo por completo

Al cambiar catálogo o compatibilidad:

- mantén la taxonomía consistente entre `project_types`, perfiles reutilizables, perfiles de compatibilidad y perfiles de infraestructura
- asegúrate de que `validate-config` siga cubriendo cada categoría declarada
- vuelve a ejecutar `doctor`, `validate-config` y `sync-runtime`
