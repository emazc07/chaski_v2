# Bitácora de Chaski

Registro cronológico del trabajo en el proyecto. Cada entrada documenta
un día de trabajo, las decisiones tomadas, lo aprendido y lo pendiente.

> **Regla de uso**:
> - Solo se escribe entrada cuando hubo trabajo real ese día. No se
>   fuerza la frecuencia.
> - Foco en **decisiones, aprendizajes y bloqueos**, no en "qué archivo
>   toqué" (eso ya está en los commits/PRs).
> - Entradas cortas: 5-10 minutos de escritura máximo.
> - Si una sección no aplica, se omite (no hay que rellenar).
> - Se linkean commits, PRs y archivos relevantes en lugar de copiar
>   contenido.

## Plantilla

```markdown
## YYYY-MM-DD — Título corto del día

**Foco**: <una línea que resume la sesión>

**Trabajado**:
- ...

**Decisiones**:
- ...

**Aprendido**:
- ...

**Bloqueos**:
- ...

**Siguiente**:
- ...
```

---

## 2026-05-21 — Setup inicial del proyecto

**Foco**: configurar el repo de Chaski desde cero y subir la propuesta
inicial del proyecto.

**Trabajado**:
- Setup de Rails 8 + Inertia + React + Tailwind como base del proyecto
  (commit `c8bddc3`).
- Configuración de PostgreSQL local con reinicialización del cluster
  para que `emmanuelzuniga` quedara como superuser.
- Configuración de identidad git local con email personal
  (`emazc0798@gmail.com`) separado del email corporativo del trabajo.
- Creación de cuenta personal de GitHub (`emazc07`) y del repo
  `emazc07/chaski`.
- Escritura del `README.md` con la propuesta inicial del proyecto:
  visión, problema, solución, propuesta de valor, mercado, roles,
  modelo de negocio (marcado como propuesta con apoyo de IA), entidades
  conceptuales y casos de uso del MVP (commit `4179d59`).

**Decisiones**:
- Stack inicial: Rails 8 + Inertia + React + Vite + Tailwind. La
  decisión final del stack se revisará con el docente.
- JavaScript en lugar de TypeScript para el frontend (se puede agregar
  TS gradualmente si surge la necesidad).
- PostgreSQL como base de datos (no SQLite) — más cercano a producción.
- Repo personal en cuenta separada de la corporativa.
- README mantiene solo lo que el autor entiende y puede defender. El
  modelo de negocio se marcó explícitamente como propuesta inicial con
  IA porque aún no está validado.

**Aprendido**:
- Cómo separar identidad git por proyecto cuando se trabaja con varias
  cuentas (corporate vs personal).
- Cómo reinicializar el cluster de PostgreSQL en macOS con Homebrew.
- Diferencia entre `gem install` (instala) vs agregar al `Gemfile`
  (declara y persiste como dependencia del proyecto).

**Siguiente**:
- Diseñar pantallas clave en Visily (landing, event detail, all events).
- Definir el MVP en detalle.

---

## 2026-05-27 — Definición del MVP y sistema de documentación

**Foco**: cerrar el alcance del MVP de Chaski y dejarlo documentado en
el repo para que sirva como contexto futuro (incluido como contexto
para agentes de IA).

**Trabajado**:
- Debate exhaustivo del MVP: 10 ideas iniciales convertidas en 15
  pantallas concretas con sus estados, rutas y acciones.
- Creación de la estructura de `docs/` con 4 subcarpetas (`product/`,
  `technical/`, `ideas/`) y 6 archivos.
- Apertura, revisión y merge del PR
  [#1](https://github.com/emazc07/chaski/pull/1) con toda la
  documentación inicial. Cleanup de la branch (local + remota).
- Creación de esta bitácora (`docs/bitacora.md`) con plantilla y reglas
  de uso. Backfill de la sesión del 2026-05-21 y la actual. Apertura del
  PR [#2](https://github.com/emazc07/chaski/pull/2).
- Iteración de prompts de Visily para 4 pantallas del MVP:
  - Modal de Sign Up / Sign In (tabs arriba, header contextual, sin
    social login).
  - Hiker Dashboard (con dos estados: vacío y con eventos).
  - Onboarding Wizard (5 pasos, skippable, 3 frames clave en lugar de 5
    para evitar prompts redundantes).
  - Create Event Wizard (4 pasos, uno por frame: info básica, detalles
    de ruta, logística, revisión/publicación).

**Decisiones**:
- **ADR-001**: Diferir Organizations a Fase 2. El MVP solo maneja
  usuarios individuales como organizers.
- **ADR-002**: Autenticación con email + password (no OTP en MVP).
- **ADR-003**: Create Event como wizard de 4 pasos con auto-guardado
  de borradores.
- **ADR-004**: Browsing libre sin gate; la autenticación solo se pide
  al ejecutar una acción que genere estado (inscribirse, guardar).
- Orden estratégico de diseño en Visily: Sign Up modal → Hiker
  Dashboard → Onboarding → Create Event Wizard.
- El sistema de documentación vive en `docs/` y sirve tanto para
  humanos como para agentes de IA.
- Adoptar flujo de PRs incluso siendo único contribuyente, para
  beneficios de self-review, historial limpio y práctica.
- Prompts de Visily limitados a **desktop por ahora**; mobile se
  evaluará después de cerrar las pantallas principales.
- **Convención nueva**: verificar el conteo de caracteres con `wc -c`
  antes de compartir cualquier prompt de Visily (el límite es 4,000 y
  las estimaciones a ojo fallan).

**Aprendido**:
- Diferencia entre **page** y **modal** para flujos de auth: el modal
  no saca al usuario del contexto, lo cual mejora conversión.
- Que el "next event" debe ser visualmente dominante en el dashboard
  porque es lo que el usuario realmente busca al loguearse.
- Que los empty states son tan importantes como los estados con
  datos — un buen empty state inspira y guía, no se siente vacío.
- Que documentar decisiones (ADRs) cuesta poco hoy y ahorra mucho
  contexto mañana.
- Que un wizard largo necesita transmitir **confianza** con un
  indicador de "Guardado automáticamente" visible y persistente, sino
  el usuario teme perder su trabajo y abandona.
- Que selectores visuales (cards clickeables con iconos) son más
  amigables que dropdowns para decisiones cualitativas como dificultad,
  tipo de ruta o nivel de experiencia.
- Que para wizards con muchos pasos similares, alcanza con generar
  **frames clave** que cubran cada patrón visual distinto. Los pasos
  análogos se duplican después en Visily.

**Bloqueos**:
- Modal de Sign Up tuvo un pequeño error en Visily; pendiente de
  ajuste manual.

**Siguiente**:
- Ajustar manualmente el modal de Sign Up en Visily.
- Generar en Visily el Hiker Dashboard, Onboarding Wizard y Create
  Event Wizard con los prompts ya preparados.
- Después de las 8 pantallas principales (Landing, All Events, Event
  Detail, Sign Up, Dashboard, Onboarding, Create Event y Manage Event),
  revisar el stack técnico con el docente.
- Pendiente diseñar: Manage Event, Mis caminatas, Mi perfil, Settings,
  Error pages, Footer pages, Organizer Dashboard.

**Referencias**:
- PR #1 (docs base): <https://github.com/emazc07/chaski/pull/1>
- PR #2 (bitácora): <https://github.com/emazc07/chaski/pull/2>
- Scope MVP: `docs/product/mvp.md`
- Inventario de pantallas: `docs/product/screens.md`
- ADRs: `docs/technical/decisions.md`

---

## 2026-05-28 — Cleanup post-merge y arranque del modelo de datos

**Foco**: cerrar el housekeeping del PR #2 y arrancar el Paso 1 del
modelo de datos del MVP en modo colaborativo, paso por paso.

**Trabajado**:
- Cleanup post-merge del PR #2 (bitácora): `switch main` → `pull` →
  `branch -d` → `push origin --delete` → bonus `fetch --prune`.
- Definición de la metodología de 5 pasos para construir el modelo de
  datos (entidades → atributos → relaciones → restricciones →
  índices/enums). Cada paso vive en su propia sesión.
- Aplicación del **test de 3 condiciones** (identidad propia, atributos
  descriptivos, persistencia) a cada candidato a entidad.
- Cierre del Paso 1: identificación de las **12 tablas del MVP** (10
  modelos Ruby + 2 join tables sin modelo).
- Creación del archivo `docs/technical/data-model.md` con metodología,
  entidades, decisiones y pendientes.
- Commit local del Paso 1 en branch `docs/data-model` (`776bec6`). Aún
  no pusheado: se acumulan los 5 commits del modelo en una sola branch
  para un PR único al final.

**Decisiones**:
- El modelado de datos se hace en sesiones separadas, una por paso.
  Sin apuro. Cada paso tiene su commit.
- **User** es una sola entidad. Los roles (hiker, organizer, admin) se
  modelan como **atributos**, no como entidades separadas.
- **Profile** vive como atributos directamente en `User`. No hay tabla
  `Profile` separada en el MVP.
- **Destino** es entidad con **catálogo curado** de ~30-40 destinos
  populares de Costa Rica + campo `custom_location` libre en `Event`
  como escape para destinos fuera del catálogo (opción híbrida).
- **Motivation** y **Region** son entidades separadas, conectadas con
  `User` por many-to-many. Descartado modelarlas como enums o arrays.
- **Inscription**, **GearItemMark** y **UserBadge** son modelos con
  tabla propia (no joins puros), porque tienen atributos propios
  (estado, fechas).
- **Trail** se decidió **no modelar** aparte de `Destino` en el MVP.
  Se reevalúa en Fase 2.
- **Estrategia de PRs para el modelo**: una sola branch
  (`docs/data-model`) con un commit por paso, y un PR único al cerrar
  los 5 pasos.

**Aprendido**:
- El **flujo post-merge en git**: switch, pull, delete local, delete
  remote, prune. Cada paso tiene una razón concreta y no son
  intercambiables.
- Diferencia entre `git branch -d` (safe, rechaza si no fue mergeada)
  y `-D` (force delete).
- Cómo derivar **entidades** desde requerimientos aplicando el test de
  3 condiciones a sustantivos del dominio.
- **Concepto clave**: una conexión entre entidades es un modelo Ruby
  propio cuando tiene atributos (cuándo, en qué estado, por qué); es
  solo una tabla pura cuando es "X tiene Y" sin información extra.
- **Top-down vs bottom-up para catálogos**: texto libre da flexibilidad
  pero degrada la calidad de datos; catálogo curado da consistencia y
  permite filtros y stats reales. Para Chaski, calidad gana.
- Las **decisiones de scope** (qué incluir, qué diferir, cómo
  abstraer) son tan importantes como el modelado técnico en sí.

**Siguiente**:
- Paso 2 del modelo de datos: definir **atributos** de cada entidad con
  tipos (`string`, `integer`, `text`, `decimal`, `datetime`, `boolean`,
  `enum`). Arrancar con `User` como ejemplo extenso.
- Paso 3: declarar relaciones (`has_many`, `belongs_to`,
  `has_many :through`, `has_and_belongs_to_many`).
- Paso 4: agregar restricciones (validaciones a nivel app + constraints
  a nivel BD).
- Paso 5: optimizar con índices y enums.
- Al cerrar los 5 pasos: pushear la branch `docs/data-model` y abrir
  PR contra `main`.

**Referencias**:
- Modelo de datos (work in progress): `docs/technical/data-model.md`
- Branch en progreso: `docs/data-model` (commit `776bec6`, sin push)

---

## 2026-05-31 — Paso 2 (User) y verificación manual de eventos

**Foco**: avanzar el modelo de datos con atributos del `User` y abrir
un debate de producto sobre moderación de eventos antes de publicar.

**Trabajado**:
- Cierre del **Paso 2 del modelo de datos para `User`** en branch
  `docs/data-model` (commit `391edd9`): 14 columnas organizadas en 4
  subgrupos (Auth/Devise, Profile, Onboarding, Roles). Incluye tabla
  completa, justificación de cada decisión y notas técnicas sobre
  Active Storage, enums string-backed y seguridad de `admin`.
- Debate y definición del flujo de **verificación manual de eventos
  por admin** antes de publicar. Cobertura completa: modelo de
  estados, admin view, comunicación con el organizer, scope MVP vs
  Fase 2.
- Decisión de tratar el flujo de verificación como un **product
  decision** independiente del modelo de datos y trabajarlo en
  branch separada `docs/admin-verification`.
- Actualización de 5 archivos de docs con el nuevo flujo: ADR-005 en
  `decisions.md`, amendment a ADR-003, scope en `mvp.md`, 2 pantallas
  nuevas en `screens.md`, 2 flujos nuevos en `user-flows.md` (#9 y
  #10), y entrada en bitácora.

**Decisiones**:
- **User** queda definido con 14 columnas. `name` único (no
  first/last), `bio` text, `location` free text, `emergency_contact`
  como string simple, `birthday` como `date` exacta visible solo a
  organizers de los eventos del usuario y pedida en la primera
  inscripción.
- **`avatar`** vive en Active Storage, no como columna.
- Enums (`experience_level`, `frequency`) guardados como `string` en
  vez de `integer`: más legible al debuggear y seguros ante
  reordenamientos. Keys en inglés, display en español vía i18n.
- **Organizer** se modela como rol **derivado** (`user.events.any?`),
  sin flag explícito. Counter cache queda como optimización futura.
- **Admin** se modela como `boolean` simple (`admin: NOT NULL, default
  false`), nunca incluido en strong parameters públicos.
- **ADR-005**: todo evento creado pasa por revisión manual de un admin
  antes de publicarse. Modelo de estados con 5 valores
  (`pending_review`, `published`, `rejected`, `cancelled`,
  `completed`).
- **Sin estado `draft`** en MVP: el auto-guardado del wizard vive en
  el cliente, no en la base de datos. Esto **amenda ADR-003**.
- **Notificación al organizer** vía badge in-app únicamente (sin
  email en MVP).
- **Razón de rechazo**: free text con mínimo 10 caracteres, sin
  categorías predefinidas.
- **Re-envío tras rechazo**: editar un evento `rejected` lo manda a
  `pending_review` automáticamente al guardar, sin botón explícito.
- **`Event` gana 4 columnas nuevas** (`status`, `rejection_reason`,
  `reviewed_at`, `reviewed_by_id`) que se incorporan al modelo de
  datos cuando se defina `Event` en Paso 2.

**Aprendido**:
- Cómo se diferencia un **producto con filtro de calidad** de un
  feed sin moderación: el filtro es el principal mensaje
  diferenciador frente a grupos de WhatsApp/Facebook.
- Que las decisiones de moderación son más fáciles de incluir al
  inicio que retrofittear después.
- Que ADRs anteriores se pueden **amendar** sin reemplazarlos:
  ADR-003 sigue válido pero su consecuencia sobre `status: draft`
  queda sobreescrita por ADR-005, con notas cruzadas en ambos.
- Que separar el trabajo de modelo de datos del trabajo de producto
  en branches distintas hace que los PRs sean más enfocados y la
  historia de git más legible.
- El patrón de **flag derivado vs. flag persistido** (organizer):
  derivar evita inconsistencias, persistir mejora performance.
  Decidir cuál usar depende de la frecuencia de la query.

**Bloqueos**:
- Ninguno.

**Cierre del día**:
- PR de `docs/admin-verification` mergeado en `main`. Cleanup local y
  remoto hecho. Branch nueva `docs/bitacora-next-steps` abierta solo
  para registrar este cierre.

**Siguiente sesión**:
- **Visily — pantallas admin pendientes**:
  - Diseñar pantalla **#16 Admin Events List** (tabla simple con
    filtro por status, orden por fecha del evento, columnas: fecha,
    título, organizer, destino, status, acción "Revisar →").
  - Diseñar pantalla **#17 Admin Event Review** (Event Detail con
    sidebar admin: status, metadata, botones "Aprobar" / "Rechazar"
    + modal de razón de rechazo).
  - Ajustes en pantallas existentes: badges de status en Event
    Detail (variantes según `pending_review` / `rejected` /
    `cancelled`) y tabs por status en Organizer Dashboard.
- **Modelo de datos — continuar Paso 2 en `docs/data-model`**:
  - `Event` (incluyendo las 4 columnas de status definidas en
    ADR-005: `status`, `rejection_reason`, `reviewed_at`,
    `reviewed_by_id`).
  - Luego entidad por entidad: `Destino`, `Inscription`, `GearItem`,
    `GearItemMark`, `Badge`, `UserBadge`, `Motivation`, `Region`.

**Referencias**:
- Commit Paso 2 User: `391edd9` (branch `docs/data-model`)
- PR de admin-verification: mergeado en `main`
- ADR-005: `docs/technical/decisions.md`
- Pantallas admin documentadas: `docs/product/screens.md` (#16, #17)
- Flujos admin documentados: `docs/product/user-flows.md` (#9, #10)
- Modelo de datos: `docs/technical/data-model.md`

---

## 2026-06-01 — Paso 2 (Event) y cambio a PR incremental

**Foco**: cerrar el modelado de `Event` con sus 21 columnas y abrir
PR parcial del modelo de datos para que el avance quede visible en
el repo para revisión del docente.

**Trabajado**:
- Definición completa de la entidad **Event** con sus 21 columnas
  organizadas en 6 subgrupos lógicos:
  - **Identidad**: `organizer_id` (FK), `title`, `slug`.
  - **Descripción**: `description_short`, `description_long`,
    `cover_image` (Active Storage).
  - **Ruta**: `destino_id` (FK nullable) ↔ `custom_location`
    (exclusivos), `difficulty`, `distance_km`, `elevation_gain_m`,
    `duration_hours`, `route_type`.
  - **Logística**: `starts_at`, `meeting_point`, `max_participants`,
    `price_crc`.
  - **Moderación** (4 columnas de ADR-005): `status`,
    `rejection_reason`, `reviewed_at`, `reviewed_by_id`.
  - **Auditoría**: `created_at`, `updated_at` (automáticos).
- Commit del Paso 2 — Event en `docs/data-model` y push al remoto.
- Cambio de estrategia: abrir **PR parcial** ahora (Paso 1 + Paso 2
  User + Paso 2 Event) en vez de esperar a cerrar los 5 pasos del
  modelo de datos, para que el avance sea visible para evaluación.

**Decisiones**:
- **URL de evento**: `/eventos/:slug` (sin `id`). Compartibilidad por
  WhatsApp es core, URL descriptiva pesa más.
- **`slug`**: auto-generado desde `title` con `parameterize` de Rails
  (sin gemas adicionales). Inmutable después de crear. Sufijo
  numérico para duplicados (`cerro-de-la-muerte-2`).
- **Descripción**: dos campos separados — `description_short` (max
  160 chars, para cards y meta tags) + `description_long` (text,
  para Event Detail Page).
- **Cover image**: obligatoria. Active Storage. JPEG/PNG/WebP, max
  5 MB. Galería diferida a Fase 2.
- **`destino_id` ↔ `custom_location`**: exclusivos. Validación a
  nivel app. CHECK constraint en BD se evalúa en Fase 2.
- **`difficulty`**: 4 niveles. **Asimetría DB→UI**:
  - BD: `easy`, `moderate`, `hard`, `extreme` (convención hiking
    industrial — AllTrails, Komoot).
  - UI: "Principiante", "Intermedia", "Avanzada", "Extrema" (match
    cognitivo con el lenguaje del onboarding del hiker).
- **`distance_km`**: `decimal(5, 2)` (hasta 999.99 km).
- **`elevation_gain_m`**: `integer`. Sin `peak_altitude_m` ni
  `elevation_loss_m`.
- **`duration_hours`**: `decimal(4, 1)` (admite 3.5h y multi-día).
- **`route_type`**: 3 valores (`loop`, `out_and_back`,
  `point_to_point`). `peak` descartado por solaparse con
  `out_and_back`.
- **Fecha + hora**: único `starts_at: datetime` (no dos columnas).
  Costa Rica tiene una sola timezone sin DST → Rails maneja todo
  con `config.time_zone = "America/Costa_Rica"`.
- **`ends_at`**: NO se modela. Se deriva de `duration_hours`.
- **`meeting_point`**: `text` (no `string`), porque los casos reales
  combinan lugar + indicaciones + links + contacto, fácilmente
  superando 255 chars.
- **`max_participants`**: NOT NULL, validación `min: 2`. "Sin
  límite" se representa con un número alto.
- **Moneda**: `price_crc` (asume CRC). `integer` (sin céntimos —
  los precios al consumidor en CRC se redondean a enteros). NOT
  NULL con default `0` (`0` = gratis).
- **`reviewed_at` + `reviewed_by_id`**: se setean juntos al accionar
  el admin. Se sobreescriben en re-reviews. Sin historial de
  revisiones múltiples en MVP — si se vuelve crítico, se agrega
  modelo `EventReview` en Fase 2.
- **`reviewed_by_id` FK**: `on_delete: nullify`. Si un admin se
  elimina, los eventos preservan `status` y `reviewed_at`, pero
  el "quién" se vuelve `NULL`.
- **`published_at` y `submitted_at`**: NO se modelan como columnas
  separadas. `reviewed_at` cubre el caso, y `created_at ==
  submitted_at` porque no hay estado `draft` en BD (ADR-005).

**Aprendido**:
- **Asimetría DB↔UI como patrón**: las claves del enum en BD pueden
  seguir convenciones técnicas (i18n, industria) mientras el display
  alinea con el lenguaje del usuario. Mejor de los dos mundos sin
  compromisos.
- **Naming convention de Rails para `datetime`**: campos que indican
  "momento de algo" terminan en `_at` (`starts_at`, `reviewed_at`,
  `created_at`, `published_at`).
- **`decimal` vs `float` vs `integer`** según el caso:
  - `decimal`: precisión exacta (distancias, dinero con céntimos).
  - `integer`: cuando la convención del dominio no usa decimales
    (colones costarricenses, metros de elevación, cupo).
  - `float`: casi nunca en BD productiva por imprecisión.
- **El valor de `parameterize` out-of-the-box en Rails**: para slugs
  simples no se necesitan gemas adicionales como `friendly_id`.
- **PRs incrementales vs PR único**: incrementales dan visibilidad
  temprana del avance pero requieren resolver conflicts entre
  branches activas. Para un proyecto bajo evaluación, vale la pena
  la coordinación adicional.
- **`Event` quedó como la entidad más rica del MVP** (21 columnas),
  como anticipamos. Las próximas entidades (`Destino`,
  `Inscription`, etc.) serán mucho más pequeñas.
- **Resolución de merge conflicts**: cuando dos branches agregan
  contenido al final del mismo archivo, Git no puede decidir el
  orden y marca el conflict con `<<<<<<<`, `=======`, `>>>>>>>`.
  La resolución es manual: borrar los markers y dejar el contenido
  en el orden que tenga sentido (cronológico en este caso).

**Bloqueos**:
- Ninguno tras resolver el conflict de bitácora manualmente.

**Siguiente**:
- Abrir PR parcial del modelo de datos contra `main`.
- Trabajar las pantallas admin pendientes en Visily (#16 Admin
  Events List y #17 Admin Event Review).
- Continuar Paso 2 con **`Destino`** en la próxima sesión (entidad
  rica, segunda más compleja después de Event).

**Referencias**:
- Modelo de datos: `docs/technical/data-model.md` (545 líneas)
- ADR-005: `docs/technical/decisions.md`
- Branch: `docs/data-model` (Paso 1 + Paso 2-User + Paso 2-Event,
  pusheada al remoto)

---

## 2026-06-04 — Paso 2 (Destino)

**Foco**: cerrar la entidad `Destino` del catálogo curado.

**Trabajado**:
- 8 columnas en 4 subgrupos: Identidad, Ubicación, Descriptivo,
  Operativo.

**Decisiones**:
- `name` unique; `slug` mismo patrón que `Event`.
- `province`: enum string con 7 provincias CR.
- Coordenadas (`latitude`, `longitude`): `decimal(9, 6)` nullable —
  modeladas ya para no tener migración en Fase 2.
- Sin relación con `Region` en MVP (queda solo en User).
- `description`: un solo `text` (no short/long como Event).
- `events_count` counter cache: diferido a Paso 5.
- `active` boolean para soft-disable sin romper eventos históricos.

**Cambio de formato**: bitacora entries pasan a ser cortas y
directas. ADRs y data-model siguen siendo la fuente de verdad
completa.

**Siguiente**:
- Próxima entidad: **`Inscription`** (User ↔ Event con estado propio).

---

## 2026-06-04 (cont.) — Paso 2 (Inscription)

**Foco**: modelar el "boleto" que conecta User y Event.

**Trabajado**:
- 6 columnas + 2 timestamps. Primera entidad "join con atributos"
  (`has_many :through`).
- Nota conceptual incluida sobre por qué Inscription es entidad y
  no join puro.

**Decisiones**:
- `status` enum: 4 valores (`active`, `cancelled`, `attended`,
  `no_show`). Sin `cancelled_by_hiker` vs `cancelled_by_organizer`;
  contexto va en `cancellation_reason`.
- `cancellation_reason`: `text` nullable, sin longitud mínima.
- `cancelled_at`: columna separada nullable (no se reusa
  `updated_at`).
- Re-inscripción: toggle del status en el mismo record (no nuevo).
  Se limpia `cancelled_at` y reason al re-inscribir.
- `unique index` compuesto en (`user_id`, `event_id`).
- Counter cache (`Event.inscriptions_count`) y waitlist: diferidos.

**Siguiente**:
- **`GearItem`** + **`GearItemMark`** juntos (entidades chicas que
  van de la mano: checklist del evento + marcas del hiker).

---

## 2026-06-04 (cont. 2) — Paso 2 (GearItem + GearItemMark)

**Foco**: modelar el checklist de equipo del evento y las marcas que
hace cada hiker inscrito.

**Trabajado**:
- `GearItem`: 5 columnas + 2 timestamps en 4 subgrupos (Asociación,
  Contenido, Categorización, Orden).
- `GearItemMark`: 2 columnas + 2 timestamps. Segundo "join con
  atributos" del proyecto (después de Inscription). Entidad más
  chica del modelo.
- Caso de uso real (Chirripó) trabajado en chat antes de escribir,
  para anclar decisiones a un escenario concreto.

**Decisiones**:
- **Catálogo de gear**: per-event, no global (Opción A). Cada evento
  tiene sus propios `GearItem` records. Repetición se mitiga con
  sugerencias hardcodeadas en el frontend del wizard. Catálogo real
  se construirá en Fase 2 con datos de uso.
- `required: boolean` simple (NOT NULL, default `true`). Sin enum de
  3 valores ni columna `category` en MVP.
- `position: integer` (default `0`) para que el organizer controle
  el orden visual del checklist.
- `GearItemMark.inscription_id` (no `user_id`): enforce a nivel BD
  que solo hikers inscritos pueden marcar items. Lifecycle del mark
  sigue al de la inscripción.
- **Toggle vía delete** (no flag `marked: boolean`): marcar = INSERT,
  desmarcar = DELETE. Sin historial de toggling en MVP.
- `unique index` compuesto en (`inscription_id`, `gear_item_id`).

**Aprendido**:
- Cuándo elegir per-event vs catálogo global vs híbrido para
  entidades "tipo lista". Per-event gana en MVP por simplicidad
  (1 tabla vs 3), evolución natural a catálogo real con datos.
- Patrón **"existencia = estado"** para joins con atributos: si la
  única señal que importa es "marcado / no marcado", la presencia
  del record es suficiente. Evita queries con WHERE extra.
- Por qué los joins con atributos a veces apuntan a otros joins
  (`GearItemMark → Inscription → User/Event`) en vez de a las
  entidades terminales: enforce reglas de negocio a nivel BD.

**Parking lot**:
- Agregada idea de **calendario mensual del organizer** (Fase 2):
  vista grid mensual con eventos del mes, exportación .ics, imagen
  shareable, suscripción. No requiere tablas nuevas en el modelo.

**Siguiente**:
- **`Badge`** + **`UserBadge`** juntos (mismo patrón que
  GearItem/GearItemMark: catálogo + join con atributos).

---

## 2026-06-04 (cont. 3) — Paso 2 (Badge + UserBadge)

**Foco**: cerrar el catálogo de insignias y el registro de qué hiker
ganó cuál.

**Trabajado**:
- `Badge`: 9 columnas + 2 timestamps en 7 subgrupos (Identidad,
  Contenido, Categorización, Automatización, Orden, Operativo,
  Auditoría).
- `UserBadge`: 4 columnas + 2 timestamps. Tercer "join con
  atributos" del proyecto.
- Catálogo seedeable inicial sugerido (~10 insignias) dejado en el
  data-model para arrancar la fase de seeds.

**Decisiones**:
- **`icon` storage**: `string` con filename de SVG en
  `app/assets/images/badges/`. Sin Active Storage (overkill para
  iconografía curada), sin emojis (inconsistencia visual + estética
  casual). Regla mental: "Active Storage = archivos del usuario;
  asset folder = archivos del producto".
- **`category` enum**: 4 valores (`milestone`, `destination`,
  `special`, `onboarding`) para agrupar en la galería.
- **`rule_key`**: `string` unique nullable. MVP siempre `NULL`
  (otorgamiento manual/seeds). Puente forward-compatible a Fase 2,
  cuando Sidekiq automatice asignaciones tras eventos completados.
  Costo de incluirlo ya: cero.
- **`active` boolean**: mismo patrón que `Destino`. Soft-disable
  preserva `UserBadge` históricos.
- **`UserBadge.event_id` nullable**: triggering event como contexto.
  Algunas insignias se ganan en evento ("Conquistador del
  Chirripó"), otras no ("Bienvenido a Chaski").
- **`earned_at` separado de `created_at`**: mismo razonamiento que
  `cancelled_at` en `Inscription`. Permite seeds, backfills y jobs
  delayed con timestamp correcto.
- **`unique index` en (`user_id`, `badge_id`)**: una insignia por
  hiker. Insignias repetibles → Fase 2 si surge necesidad.
- FK `event_id` `on_delete: nullify`: la insignia se preserva si el
  evento se borra.

**Aprendido**:
- **Cómo funcionan los emojis en una BD**: PostgreSQL los soporta
  nativamente (UTF-8 real desde día uno). MySQL **viejo** los rompía
  con encoding `utf8` (que en realidad era 3 bytes); MySQL moderno
  necesita `utf8mb4`. Saberlo evita debugger por horas el día que
  alguien guarde un 🥾 y desaparezca la mitad del string.
- **Diferencia entre "lo soporta técnicamente" vs "es la decisión
  correcta de producto"**: los emojis sí caben en una BD, pero la
  razón para no usarlos en Chaski es **calidad editorial**, no
  limitación técnica.
- **Patrón forward-compatible**: agregar un `string nullable` ahora
  (`rule_key`) cuesta cero y evita migración futura cuando se
  implementa automatización. Aplica a cualquier hook conocido pero
  no-implementado-aún.
- **Tres tipos de "wear" en el modelo**:
  - Acción del hiker (Inscription, GearItemMark) → se crea por
    iniciativa del usuario.
  - Otorgamiento del sistema/admin (UserBadge) → se crea por
    evaluación de reglas o decisión externa.
  - Catálogo curado (Destino, Badge) → se crea por el equipo via
    seeds, se mantiene por admin.

**Siguiente**:
- **`Motivation`** + **`Region`** juntas (catálogos muy chicos: solo
  `name`, `slug`, `position` y `active`). Conectan con `User` vía
  join tables sin modelo (`user_motivations`, `user_regions`).
  Sesión corta — cerramos el Paso 2 completo.

---

## 2026-06-04 (cont. 4) — Paso 2 (Motivation + Region) — Cierre del Paso 2

**Foco**: cerrar el Paso 2 con los dos catálogos chicos del
onboarding y las 2 join tables.

**Trabajado**:
- `Motivation`: 5 columnas + 2 timestamps. Catálogo fijo de 6 filas
  con `icon` (mismo storage pattern que `Badge`).
- `Region`: 4 columnas + 2 timestamps. **Entidad más simple del
  modelo**. Sin `icon` (chips de texto en el onboarding).
- Definición de las 2 join tables (`motivations_users`,
  `regions_users`) con convención Rails HABTM.
- Seeds iniciales sugeridos: 6 motivaciones del onboarding + 9
  regiones de hiking curadas.
- Corrección a Paso 1: nombres de join tables ajustados a convención
  Rails (`motivations_users` en vez de `user_motivations`, etc.).
- **Sección de cierre del Paso 2** agregada con tabla resumen: 12
  tablas, 80 columnas modeladas, distinguiendo modelos Ruby vs joins
  puros.

**Decisiones**:
- Catálogos siguen el mismo patrón consolidado: `name` + `slug`
  (unique ambos), `position` (orden UI), `active` (soft-disable).
- `Motivation.icon`: `string` con filename de SVG en
  `app/assets/images/motivations/`. Mismo razonamiento que `Badge`.
- `Region` sin `icon`: chips de texto en el wizard, sin necesidad
  visual. Si Fase 2 gana mapa por región, se agrega columna.
- **Region ≠ Province**: regiones son zonas geográfico-hikers
  (pueden cruzar provincias). Provincias siguen en `Destino.province`
  como enum cerrado.
- **Sin relación `Destino → Region`** en MVP (decidido en `Destino`).
  Region solo conecta a User.
- **Join tables nomenclatura Rails**: `motivations_users` y
  `regions_users` (orden alfabético, ambos plurales). Permite
  `has_and_belongs_to_many` sin `join_table:` explícito.
- **Sin timestamps ni `id` en join tables**: `create_join_table` es
  Rails-idiomático para HABTM puro. Si Fase 2 necesita atributos
  (ej: "cuándo seleccionó"), se migra a `has_many :through`.

**Aprendido**:
- **Convención Rails HABTM**: nombres alfabéticos plurales. Detalle
  chico pero crítico: usar la convención evita configuraciones
  explícitas en cada modelo.
- **Diferencia conceptual entre `province` (enum cerrado) y `Region`
  (entidad con relación)**:
  - `province` es **atributo fijo** del destino (7 valores
    administrativos). Cambia raras veces. Cabe como enum.
  - `Region` es **etiqueta navegable** que conecta usuarios con
    intereses. Tiene su propio CRUD y se filtra.
  - Misma información puede modelarse de las dos formas según cómo
    se use.
- **Cuándo `create_join_table` vs migración manual con FK**:
  - HABTM puro (sin atributos): `create_join_table` directamente.
    Rails maneja todo.
  - Join con atributos: tabla con FK + `id` + timestamps +
    `has_many :through`.
- **Catálogos curados vs free text**: ya el quinto catálogo curado
  (`Destino`, `Badge`, `Motivation`, `Region` + enums fijos de
  `province`, `difficulty`, `route_type`). El patrón gana sobre free
  text cada vez que existe un dominio cerrado y se necesita filtrar.

**Cierre del Paso 2**:
- **12 tablas, 80 columnas modeladas** (sin contar `id` /
  timestamps).
- 8 modelos Ruby con tabla propia, 3 joins con atributos
  (Inscription, GearItemMark, UserBadge), 2 joins puros HABTM.
- Documento `data-model.md` pasa de ~1000 a ~1300 líneas. Estado:
  Paso 1 ✅, Paso 2 ✅, Paso 3-5 pendientes.

**Siguiente**:
- **Paso 3 — Relaciones**: declarar formalmente las asociaciones
  (`has_many`, `belongs_to`, `has_many :through`,
  `has_and_belongs_to_many`) que quedaron implícitas en Paso 2.
  Producto esperado: matriz de relaciones + diagrama ER simple +
  decisiones sobre `dependent:` y `inverse_of:`.
- **Paso 4**: validaciones (app) y constraints (BD).
- **Paso 5**: índices, enums finalizados, counter caches.
