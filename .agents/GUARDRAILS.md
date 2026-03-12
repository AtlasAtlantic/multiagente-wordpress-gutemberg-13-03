# Guardrails

Guardrails operativos comunes para cualquier runtime que consuma `.agents/`.

## 1. Guardrails de alcance

- No editar fuera del target elegido por `wordpress-router` y el perfil seleccionado.
- No tocar `wordpress/wp-admin/` ni `wordpress/wp-includes/` salvo instruccion explicita del usuario.
- En repos `full-site-wordpress`, aislar primero el target real (plugin, theme, block theme, mu-plugin) antes de implementar.
- No mezclar cambios de dominio con cambios de infraestructura salvo que la tarea lo pida.

## 2. Guardrails de ejecucion

- Para tareas WordPress, ejecutar `wordpress-router` antes de proponer o aplicar cambios.
- El `planner` debe seleccionar un perfil antes de implementar.
- No cargar skills fuera del perfil salvo justificacion explicita y documentada.
- No marcar una tarea como cerrada sin `plan`, `patch_summary` y `verification_report`.
- `not_applicable` solo es valido con evidencia concreta del repo o del entorno.

## 3. Guardrails de calidad

- No introducir `<style>` inline dentro del HTML de bloques dinamicos.
- Validar seguridad WordPress cuando la tarea procese entrada, admin forms, AJAX, REST, render dinamico o permisos.
- En plugins, revisar lifecycle (`activation`, `uninstall`, migraciones, cron) cuando la tarea lo afecte.
- En themes o block themes, revisar responsive y accessibility si cambia la salida visual.
- No asumir tooling inexistente: Composer, PHPStan, PHPCS, Playwright o Node solo aplican si existen o si la tarea permite anadirlos.
- En incidencias o bugs reproducibles con impacto funcional o visual, no dar por resuelto el problema sin verificar el resultado y dejar evidencia de regresion.
- Si existe infraestructura E2E reutilizable para ese target, ejecutar o actualizar la prueba E2E de regresion correspondiente antes de cerrar la incidencia.
- Si ese bug deberia dejar cobertura E2E y no existe base reutilizable, pedir confirmacion para montarla antes de cerrar, salvo exclusion explicita de tests.
- En incidencias reproducibles de bloque Gutenberg o del editor del bloque, no cerrar la tarea con solo `build` o verificacion manual: hace falta E2E ejecutado si existe base reutilizable, o una pregunta explicita al usuario para montar esa base antes del cierre.

## 4. Guardrails multi-runtime

- `.agents/` es la unica fuente de verdad para workflow, perfiles, gates y skills.
- `.cursor/`, `CLAUDE.md`, `.codex/` y `.azure/` no deben redefinir perfiles, tiers, routing ni quality gates.
- Los adaptadores de runtime solo deben documentar diferencias especificas del runtime.

## 5. Guardrails de configuracion

- Cambios en `.agents/**` deben ejecutar `.agents/tools/agents-doctor.sh`.
- Cambios en `.codex/**` o `AGENTS.md` deben ejecutar `codex-doctor`.
- Si un runtime necesita instrucciones adicionales, deben vivir en su adaptador, nunca duplicadas en `.agents`.
