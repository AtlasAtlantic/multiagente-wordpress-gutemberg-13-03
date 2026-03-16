# Adaptador runtime de ChatGPT

Este adaptador mapea definiciones canónicas de `.agents/` a artefactos runtime compatibles con ChatGPT.

Directorios:

- `templates/`: plantillas del adaptador
- `output/`: artefactos generados

Reglas:

- consume definición canónica desde `.agents/`
- no redefine comportamiento canónico
- trata `output/` como artefacto derivado y regenerable
