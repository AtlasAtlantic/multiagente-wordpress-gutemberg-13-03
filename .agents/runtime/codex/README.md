# Adaptador runtime de Codex

Codex es un adaptador derivado para la plataforma canónica almacenada en `.agents/`.

Reglas:

- `.agents/` sigue siendo la fuente de verdad
- `.codex/` no debe introducir decisiones canónicas de arquitectura
- las plantillas y mappings específicos de Codex pueden proyectar contenido canónico, pero no sustituirlo
- el output generado bajo `output/` es desechable y reproducible

Inputs canónicos:

- `../../version.yaml`
- `../../catalog.yaml`
- `../../compatibility.yaml`
- `../../architecture/`
- `../../agents/`
- `../../pipelines/`
- `../../profiles/`
- `../../project/project.yaml`

Directorios:

- `templates/`: plantillas del adaptador
- `output/`: artefactos generados
