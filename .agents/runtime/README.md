# Runtime

Este directorio contiene adaptadores runtime derivados del modelo canónico de `.agents/`.

Reglas:

- los directorios runtime no deben redefinir comportamiento canónico
- `.agents/version.yaml`, `.agents/catalog.yaml`, `.agents/compatibility.yaml` y `.agents/project/project.yaml` son inputs canónicos cuando corresponda
- el output generado pertenece al `output/` de cada runtime
- las plantillas y mappings son específicos del adaptador, pero nacen de `.agents/`
- el output generado es derivado y no debe tratarse como canónico
- los manifests generados están pensados para regenerarse bajo demanda y no versionarse

Runtimes previstos:

- `codex/`
- `claude/`
- `cursor/`
- `chatgpt/`
