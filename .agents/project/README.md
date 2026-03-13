# Contexto del proyecto

Este directorio contiene el contexto canónico específico del repositorio.

Reglas:

- úsalo para perfiles activos, rutas locales, nombres de servicios y overrides
- no dupliques asunciones reutilizables de WordPress que ya vivan en `profiles/`
- no dupliques preferencias reutilizables de tools o defaults del stack salvo que se requiera un override local
- los adaptadores runtime pueden consumir este contexto, pero no redefinirlo
