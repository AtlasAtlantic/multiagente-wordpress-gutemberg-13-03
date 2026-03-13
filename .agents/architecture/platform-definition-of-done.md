# Definition of Done de la plataforma

Un cambio en `.agents/` solo está terminado cuando todo lo siguiente es cierto:

- `sh .agents/tools/doctor/run.sh` pasa
- `sh .agents/tools/validate-config/run.sh` pasa
- `sh .agents/tools/sync-runtime/run.sh` pasa
- no se ha movido lógica canónica fuera de `.agents/`
- el output runtime sigue derivando de inputs canónicos
- los perfiles reutilizables no se mezclan con contexto local del proyecto
- `project/project.yaml` contiene solo contexto local u overrides explícitos
- catálogo y compatibilidad siguen siendo consistentes con los archivos en disco
- los mappings runtime siguen siendo consistentes con lo que consume `sync-runtime`
- `docs/agents-change-record.md` se actualiza dentro de la misma línea de trabajo

Si alguno de los puntos anteriores falla, el cambio no está completo.
