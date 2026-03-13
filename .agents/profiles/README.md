# Perfiles

Este directorio contiene perfiles reutilizables que adaptan la capa de agentes a tipos de proyecto WordPress y patrones de infraestructura.

Perfiles reutilizables:

- `wordpress-plugin.yaml`
- `wordpress-theme.yaml`
- `wordpress-block-theme.yaml`
- `wordpress-hybrid.yaml`
- `docker-wordpress-standard.yaml`
- `generic-web.yaml`

Perfiles de compatibilidad:

- `wordpress.yaml`

Reglas:

- solo asunciones reutilizables
- sin rutas ni nombres de servicios específicos del repositorio
- la activación del proyecto ocurre en `.agents/project/project.yaml`
