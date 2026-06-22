# Documentación de Chaski

Esta carpeta contiene la documentación viva del proyecto Chaski. Está pensada
para servir tres propósitos:

1. **Memoria del proyecto**: capturar decisiones, alcance y rationale para
   que no se pierdan en chats o conversaciones.
2. **Onboarding**: cualquier persona (incluído el autor en el futuro) que
   abra el repo puede entender el proyecto desde acá.
3. **Contexto para agentes de IA**: estos archivos sirven como base de
   conocimiento que un asistente como Cursor puede consultar cuando trabaja
   sobre el código.

---

## Índice

### Bitácora

- [`bitacora.md`](./bitacora.md) — Registro cronológico del trabajo en el
  proyecto: qué se hizo cada día, qué se decidió, qué se aprendió.

### Producto

- [`product/mvp.md`](./product/mvp.md) — Alcance definido para el MVP del
  curso. Qué entra, qué no, y por qué.
- [`product/screens.md`](./product/screens.md) — Inventario de pantallas
  del MVP con descripción funcional de cada una.
- [`product/user-flows.md`](./product/user-flows.md) — Flujos críticos de
  usuario: descubrimiento, registro, inscripción, creación de evento.

### Técnico

- [`technical/decisions.md`](./technical/decisions.md) — Registro de
  decisiones de diseño/arquitectura (ADRs).
- [`technical/data-model.md`](./technical/data-model.md) — Diseño del
  modelo de datos del MVP **con razonamiento**: entidades, atributos,
  alternativas evaluadas, decisiones y trade-offs. Estructurado en
  5 pasos.
- [`technical/relationships.md`](./technical/relationships.md) — Paso
  3 del modelo de datos: diagramas ER por dominio, asociaciones
  formales, decisiones de `dependent:` e `inverse_of:`.

### Ideas y futuro

- [`ideas/parking-lot.md`](./ideas/parking-lot.md) — Ideas, funcionalidades
  y mejoras consideradas pero fuera del alcance inmediato del MVP.

---

## Convenciones

- Todos los archivos están en **Markdown**.
- Las decisiones importantes se documentan como **ADRs** (Architecture
  Decision Records) en `technical/decisions.md`.
- Cuando se cierra un alcance (MVP, fase, sprint), se hace **commit
  separado** que sirva como punto de referencia.
- Los archivos en `ideas/` son **bocetos**: pueden estar incompletos o
  contradecirse entre sí; sirven para no perder ideas, no como verdad
  oficial.

---

## Cómo navegar esta documentación

Si sos nuevo en el proyecto, leé en este orden:

1. [`/README.md`](../README.md) (en la raíz del repo) — propuesta general
   del proyecto.
2. [`product/mvp.md`](./product/mvp.md) — qué se está construyendo
   exactamente.
3. [`product/screens.md`](./product/screens.md) — las pantallas concretas.
4. [`technical/decisions.md`](./technical/decisions.md) — el porqué de las
   decisiones técnicas.
5. [`technical/data-model.md`](./technical/data-model.md) y
   [`technical/relationships.md`](./technical/relationships.md) — el
   modelo de datos del MVP.
6. [`bitacora.md`](./bitacora.md) — para entender el estado actual y lo
   más reciente del proyecto.
