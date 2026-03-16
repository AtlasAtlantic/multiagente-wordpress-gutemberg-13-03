# Hoja de ruta de mejora de skills de `.agents/`

## Objetivo

Mejorar progresivamente la capa de skills de `.agents/` para que sea:

- más útil en operación real
- menos ambigua
- más consistente con perfiles, tools y arquitectura
- más portable entre proyectos WordPress
- menos dependiente de validaciones superficiales

Esta hoja de ruta está pensada como documento vivo y marcable.

## Criterios de cierre global

- [ ] Las skills existentes tienen propósito claro y no se solapan innecesariamente.
- [ ] Los perfiles recomiendan skills coherentes con las capabilities reales.
- [ ] No quedan skills cargables por Codex con formato inválido.
- [ ] La validación detecta no solo existencia de `SKILL.md`, sino problemas mínimos de calidad estructural.
- [ ] La documentación de skills y README refleja el estado real de la plataforma.
- [ ] Existe una capacidad determinista de triage del proyecto WordPress.
- [ ] Existe una capacidad específica para desarrollo de plugins WordPress.
- [ ] Existe una capacidad específica para operaciones WordPress/WP-CLI.
- [ ] Las skills WordPress nuevas o mejoradas están integradas sin duplicación con las actuales.
- [ ] Cada iteración queda registrada en `docs/agents-change-record.md`.

## Estado actual resumido

- [x] Existe un núcleo base de skills canónicas.
- [x] Se migró parte reusable de `vass-config`.
- [x] Se añadieron skills de calidad WordPress, bloques y documentación técnica.
- [x] Se alinearon los `recommended_skills` de perfiles WordPress con las skills reales.
- [ ] La validación sigue siendo superficial respecto a calidad de skills.
- [ ] Persisten README y metadatos con cierto humo de scaffold o estado histórico.
- [ ] Faltan skills WordPress de triage, plugin-dev y ops.

## Principios de ejecución

- Cada mejora debe ser mínima, trazable y validable.
- No crear una skill nueva si una existente puede absorber el cambio limpiamente.
- Cuando una capability sea más fiable como automatización, moverla a `.agents/tools/`.
- Mantener slugs, rutas y claves estructurales estables salvo refactor deliberado.
- Evitar skills monolíticas que mezclen gobierno, implementación y operación.

## Skills externas de referencia y URL

Estas son las skills externas identificadas hasta ahora como candidatas a auditoría, adaptación o integración parcial.

- `wp-project-triage`: <https://skills.sh/automattic/agent-skills/wp-project-triage>
- `wp-plugin-development`: <https://skills.sh/automattic/agent-skills/wp-plugin-development>
- `wp-wpcli-and-ops`: <https://skills.sh/automattic/agent-skills/wp-wpcli-and-ops>
- `wp-rest-api`: <https://skills.sh/automattic/agent-skills/wp-rest-api>
- `wp-performance`: <https://skills.sh/automattic/agent-skills/wp-performance>
- `wp-phpstan`: <https://skills.sh/automattic/agent-skills/wp-phpstan>
- `wp-block-themes`: <https://skills.sh/automattic/agent-skills/wp-block-themes>
- `wordpress-router`: <https://skills.sh/automattic/agent-skills/wordpress-router>

Regla:

- no instalar o migrar ninguna skill externa sin auditoría previa
- usar estas URLs como punto de partida, no como aprobación implícita

## Fase 1. Saneamiento y coherencia de la base actual

Objetivo: eliminar drift, humo documental e inconsistencias básicas antes de ampliar el catálogo.

- [x] Añadir frontmatter YAML obligatorio a todos los `SKILL.md`.
- [x] Traducir de forma segura la prosa humana al español sin romper identificadores.
- [x] Alinear `recommended_skills` con las skills reales de WordPress.
- [x] Revisar README que todavía describen el sistema como “scaffold pendiente” y actualizar estado real.
- [ ] Revisar descripciones (`description`) de todas las skills para asegurar trigger claro y no ambiguo.
- [ ] Revisar que cada skill tenga referencias suficientes sin inflar `SKILL.md`.
- [ ] Detectar y documentar solapes entre `wordpress-project-setup`, `wordpress-code-quality`, `wordpress-block-development` y `wordpress-technical-documentation`.

Entregables esperados:

- Skills base coherentes entre sí.
- Documentación de estado alineada con la realidad de la plataforma.

## Fase 2. Endurecimiento de validación de skills

Objetivo: hacer que la validación detecte problemas reales de calidad estructural en skills.

- [ ] Extender `validate-config` para comprobar que cada `SKILL.md` empieza con frontmatter YAML válido.
- [ ] Validar presencia mínima de `name` y `description` en frontmatter.
- [ ] Validar que `name` coincide con el slug de directorio cuando aplique.
- [ ] Validar que referencias declaradas en `SKILL.md` apuntan a archivos existentes cuando sea posible.
- [ ] Decidir si conviene añadir un check de longitud o complejidad para detectar skills monolíticas.
- [ ] Evaluar si `doctor` debe incluir un resumen de salud de skills, no solo estructura de directorios.

Entregables esperados:

- Validación menos superficial.
- Detección temprana de skills rotas o inconsistentes.

## Fase 3. Auditoría de solapes y huecos reales

Objetivo: decidir con precisión qué mejorar, fusionar o crear a continuación.

- [ ] Auditar el catálogo actual de skills frente a capacidades ya cubiertas.
- [ ] Clasificar cada skill en: estable, mejorar, fusionar, dividir, deprecar.
- [ ] Identificar capacidades faltantes de alto valor para WordPress + Docker.
- [ ] Contrastar el catálogo propio con fuentes externas útiles, priorizando skills oficiales de WordPress.
- [ ] Documentar qué piezas externas aportan valor real y cuáles duplican lo ya construido.

Entregables esperados:

- Inventario priorizado de mejoras.
- Mapa claro de duplicaciones y huecos.

## Fase 4. Nueva skill de triage de proyecto WordPress

Objetivo: incorporar una capability determinista de diagnóstico de repositorio WordPress.

- [ ] Auditar la skill externa equivalente (`wp-project-triage`: <https://skills.sh/automattic/agent-skills/wp-project-triage>) y clasificar qué partes migrar.
- [ ] Diseñar la skill canónica `wordpress-project-triage` o equivalente.
- [ ] Decidir qué parte vive en `SKILL.md`, qué parte en `references/` y qué parte en `.agents/tools/`.
- [ ] Implementar un tool determinista de inspección del repo si aporta valor real.
- [ ] Conectar su salida con perfiles, checks y contexto de proyecto cuando proceda.

Entregables esperados:

- Skill o tool de triage reusable.
- Diagnóstico más fiable del tipo de proyecto, tooling y capacidades disponibles.

## Fase 5. Skill específica de desarrollo de plugins WordPress

Objetivo: cubrir el hueco de arquitectura y operación específica de plugins.

- [ ] Auditar `wp-plugin-development` (<https://skills.sh/automattic/agent-skills/wp-plugin-development>) y separar lo reusable de lo acoplado.
- [ ] Decidir si la capability entra como skill nueva o como ampliación de `wordpress-code-quality`.
- [ ] Cubrir bootstrap de plugin, activation/deactivation, uninstall, settings API y packaging si aportan valor reusable.
- [ ] Evitar duplicar reglas ya presentes en `wordpress-code-quality`.
- [ ] Añadir referencias o scripts solo cuando mejoren fiabilidad.

Entregables esperados:

- Capability clara de desarrollo de plugins.
- Menor ambigüedad entre trabajo de theme, plugin y bloque.

## Fase 6. Skill de operaciones WordPress / WP-CLI

Objetivo: fortalecer la capa operativa del stack WordPress + Docker.

- [ ] Auditar `wp-wpcli-and-ops` (<https://skills.sh/automattic/agent-skills/wp-wpcli-and-ops>) y clasificar qué partes son reutilizables.
- [ ] Decidir el límite entre `docker-wordpress-stack` y una nueva skill de operaciones WordPress.
- [ ] Modelar operaciones comunes seguras: wp-cli, search-replace, cache flush, contenido, usuarios, multisite si aplica.
- [ ] Mover a `.agents/tools/` las operaciones que deban ser deterministas y repetibles.
- [ ] Definir guardrails para operaciones potencialmente destructivas.

Entregables esperados:

- Capability operativa WordPress más sólida.
- Separación clara entre stack e intervención sobre WordPress.

## Fase 7. Capacidades opcionales de segunda prioridad

Objetivo: ampliar el catálogo solo después de cubrir los huecos críticos.

- [ ] Evaluar necesidad real de skill `wp-rest-api` (<https://skills.sh/automattic/agent-skills/wp-rest-api>).
- [ ] Evaluar necesidad real de skill `wp-performance` (<https://skills.sh/automattic/agent-skills/wp-performance>).
- [ ] Evaluar necesidad real de skill `wp-phpstan` (<https://skills.sh/automattic/agent-skills/wp-phpstan>).
- [ ] Evaluar necesidad real de skill `wp-block-themes` (<https://skills.sh/automattic/agent-skills/wp-block-themes>).
- [ ] Evaluar si alguna capability debe resolverse mejor desde perfiles/tools que desde skills.

Entregables esperados:

- Backlog priorizado de capacidades opcionales.
- Decisiones explícitas de no incorporar lo que no aporte valor real.

## Fase 8. Limpieza final y criterios de mantenimiento

Objetivo: dejar una base estable de evolución de skills.

- [ ] Revisar naming y tono de todas las skills para mantener consistencia.
- [ ] Revisar si `recommended_skills` sigue alineado tras las nuevas incorporaciones.
- [ ] Actualizar README y documentación de plataforma para reflejar el catálogo final.
- [ ] Definir criterios de deprecación de skills.
- [ ] Definir criterios mínimos para aceptar una skill externa o migrada.

Entregables esperados:

- Gobernanza de skills más estable.
- Menor riesgo de deriva futura.

## Backlog de tareas concretas

### Alta prioridad

- [ ] Actualizar README con estado real y eliminar “listo para Fase X” donde ya no aplique.
- [ ] Endurecer `validate-config` para validar frontmatter y calidad mínima de skills.
- [ ] Auditar e integrar `wp-project-triage` (<https://skills.sh/automattic/agent-skills/wp-project-triage>).
- [ ] Auditar e integrar `wp-plugin-development` (<https://skills.sh/automattic/agent-skills/wp-plugin-development>).
- [ ] Auditar e integrar `wp-wpcli-and-ops` (<https://skills.sh/automattic/agent-skills/wp-wpcli-and-ops>).

### Prioridad media

- [ ] Revisar solapes entre skills WordPress actuales.
- [ ] Evaluar `wp-rest-api` (<https://skills.sh/automattic/agent-skills/wp-rest-api>).
- [ ] Evaluar `wp-performance` (<https://skills.sh/automattic/agent-skills/wp-performance>).
- [ ] Evaluar `wp-phpstan` (<https://skills.sh/automattic/agent-skills/wp-phpstan>).

### Baja prioridad

- [ ] Evaluar `wp-block-themes` (<https://skills.sh/automattic/agent-skills/wp-block-themes>) si FSE gana peso real.
- [ ] Revisar oportunidades de generación automática de metadatos o índices de skills.

## Registro de progreso

Usar esta sección para marcar iteraciones reales.

### Iteración 1

- [x] Migración inicial de skills reuse desde `vass-config`.
- [x] Skills WordPress base creadas.
- [x] Traducción segura al español.
- [x] Corrección de frontmatter en `SKILL.md`.
- [x] Alineación de `recommended_skills`.

### Iteración 2

- [ ] Endurecimiento de validación de skills.
- [x] Limpieza de README con humo de scaffold.

### Iteración 3

- [ ] Auditoría e integración de triage/plugin-dev/wp-cli ops.

## Dependencias

- La Fase 2 depende de tener estabilizado el catálogo actual.
- Las Fases 4, 5 y 6 dependen de la auditoría de la Fase 3.
- La Fase 8 depende del cierre razonable de las fases anteriores.

## Riesgos

- Crear skills nuevas demasiado pronto y aumentar duplicación.
- Importar skills externas sin separar ideas útiles de estructura ajena.
- Confiar en validaciones verdes aunque sigan siendo superficiales.
- Mantener documentación que describa una plataforma que ya no existe.

## Regla de uso

Cada vez que se cierre una tarea relevante de esta hoja de ruta:

1. marcar el checkbox correspondiente
2. registrar el cambio en `docs/agents-change-record.md`
3. ejecutar validación si se ha tocado `.agents/`
