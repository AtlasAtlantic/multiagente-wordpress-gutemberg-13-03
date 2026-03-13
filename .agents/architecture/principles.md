# Principios

## Reglas núcleo

1. `.agents/` es la única fuente canónica de la capa multiagente.
2. El modelo canónico se separa en plataforma, perfiles, contexto de proyecto y adaptadores runtime derivados.
3. Los adaptadores runtime consumen definiciones canónicas y no deben redefinirlas.
4. Las tools deterministas ejecutan operaciones críticas siempre que sea posible.
5. Los outputs de los agentes deben estar suficientemente estructurados para soportar validación.
6. WordPress + Docker es un objetivo reusable de primera clase, no un simple detalle de bootstrap puntual.

## Reglas operativas

- Prioriza cambios canónicos antes que cambios específicos de runtime.
- Mantén v1 mínima y extensible.
- Evita solapamiento de roles salvo que lo justifique el pipeline.
- Mantén el output runtime generado fuera de la lógica canónica.
- Mantén rutas, servicios y convenciones específicos del repositorio en `project/`.
- Mantén las asunciones reutilizables de WordPress en `profiles/`.
- Registra cada cambio relevante en `docs/agents-change-record.md`.

## Reglas de validación

- Los contratos deben ser legibles por máquina cuando sea posible.
- Las referencias cruzadas entre agentes, pipelines y perfiles deben ser válidas.
- Las referencias cruzadas entre perfiles y contexto de proyecto deben ser válidas.
- Los outputs runtime deben ser reproducibles desde inputs canónicos.
