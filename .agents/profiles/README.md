# WordPress Profiles

Estos perfiles definen la capa reusable por tipo de proyecto WordPress.

- `plugin-development.yaml`: plugins y mu-plugins.
- `theme-development.yaml`: themes clasicos con foco frontend.
- `block-theme-development.yaml`: block themes y `theme.json`.
- `full-site-wordpress.yaml`: repos full-site o stacks con WordPress embebido en subdirectorio.

Cada perfil declara:

- skills primarias y secundarias
- `required_gates` y `optional_gates`
- `required_checks` y `optional_checks`
- `expected_when` e `include_when` para decidir cuando un check es elegible y cuando debe entrar de verdad en el plan
- criterios para marcar `not_applicable`

El `planner` debe seleccionar un perfil antes de proponer el plan de implementacion.
