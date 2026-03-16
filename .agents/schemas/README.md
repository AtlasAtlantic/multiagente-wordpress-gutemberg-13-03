# Schemas

Este directorio contiene archivos JSON Schema usados para validar la configuración canónica.

Schemas canónicos actuales:

- `profile.schema.json`
- `pipeline.schema.json`
- `routing.schema.json`
- `handoff.schema.json`
- `version.schema.json`
- `catalog.schema.json`
- `compatibility.schema.json`
- `project.schema.json`

Estos schemas validan tanto los metadatos reutilizables de la plataforma como el contexto específico del proyecto.

Propósito:

- formalizar contratos mínimos de configuración
- reducir deriva estructural entre catálogo, perfiles, proyecto, pipelines y runtime
