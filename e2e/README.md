# E2E Base

Esta carpeta deja una base Playwright reutilizable para proyectos nuevos.

Convencion recomendada:
- una spec por flujo o bloque relevante
- helpers compartidos en `e2e/helpers/`
- usar `PLAYWRIGHT_BASE_URL` para apuntar al dominio local

La base existe para que `.agents` pueda promover `e2e` a required check cuando el cambio o la incidencia lo justifiquen.
