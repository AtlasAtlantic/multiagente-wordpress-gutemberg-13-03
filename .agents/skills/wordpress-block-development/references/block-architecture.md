# Arquitectura de bloques

Esta referencia condensa las reglas reutilizables de arquitectura procedentes de los estándares antiguos de bloques.

## Decisiones núcleo

- Usa la WordPress Block API como base.
- Mantén `block.json` como fuente de verdad de metadatos.
- Si el repositorio compila assets, registra bloques desde `build/`, no desde `src/`.
- Separa la lógica exclusiva del editor, la lógica frontend y el renderizado en servidor.

## Estático frente a SSR

Prioriza SSR cuando:

- el bloque dependa de posts, taxonomías, usuarios, settings o datos externos
- el HTML renderizado deba seguir siendo indexable y consistente
- los permisos o reglas de negocio server-side afecten al render
- deba compartirse una única ruta canónica de render entre contextos

Prioriza estático cuando:

- el bloque sea editorial y autocontenido
- el marcado no dependa de datos runtime
- el bloque no necesite decisiones server-side

Si hay duda y entran en juego datos runtime, prioriza SSR.

## Estructura esperada

Estructura típica de fuentes:

- `block.json`
- `index.js`
- `edit.js`
- `save.js` for static blocks
- `render.php` for SSR blocks
- `style.*`
- `editor.*`
- `view.js` only when frontend interaction exists

Los artefactos relacionados también pueden incluir:

- patterns
- templates
- template parts

## Reglas de registro

- Registra bloques en `init`.
- Haz que `register_block_type()` apunte al directorio que contiene `block.json`.
- En proyectos con build, apunta el registro a artefactos compilados.
- Usa render callbacks para bloques SSR.
- Encola scripts frontend de forma condicional cuando la interacción dependa de atributos o contexto.

## Guía de metadatos

- Mantén `name` con namespace y en kebab-case.
- Usa solo los flags de `supports` que el diseño permita realmente.
- Desactiva la edición HTML cuando no se quiera libertad editorial.
- Mantén atributos mínimos, serializables y compatibles hacia adelante.
- Evita almacenar objetos grandes o payloads REST en los atributos.
