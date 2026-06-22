# Schema de Chaski (referencia rápida)

Listado plano del esquema de base de datos del MVP. **Solo el "qué"**:
tablas, columnas, tipos, constraints. Sin razonamiento, sin
alternativas, sin decisiones.

> Para el **"por qué"** de cada decisión (alternativas evaluadas,
> trade-offs, ADRs aplicables), ver
> [`data-model.md`](./data-model.md).

---

## Inventario

| # | Tabla | Tipo | Columnas |
|---|---|---|---|
| 1 | `users` | Modelo Ruby | 14 + 2 timestamps + 1 attachment |
| 2 | `events` | Modelo Ruby | 21 + 2 timestamps + 1 attachment |
| 3 | `destinos` | Modelo Ruby | 8 + 2 timestamps + 1 attachment |
| 4 | `inscriptions` | Modelo Ruby (join con atributos) | 6 + 2 timestamps |
| 5 | `gear_items` | Modelo Ruby | 5 + 2 timestamps |
| 6 | `gear_item_marks` | Modelo Ruby (join con atributos) | 2 + 2 timestamps |
| 7 | `badges` | Modelo Ruby | 9 + 2 timestamps |
| 8 | `user_badges` | Modelo Ruby (join con atributos) | 4 + 2 timestamps |
| 9 | `motivations` | Modelo Ruby | 5 + 2 timestamps |
| 10 | `regions` | Modelo Ruby | 4 + 2 timestamps |
| 11 | `motivations_users` | Join puro HABTM | 2 FKs |
| 12 | `regions_users` | Join puro HABTM | 2 FKs |

**Total: 12 tablas, 80 columnas modeladas.**

---

## Modelos Ruby con tabla (10)

### users

Usuario registrado. Contiene auth, perfil y datos del onboarding.

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `email` | `string` | NOT NULL, UNIQUE | Devise |
| `encrypted_password` | `string` | NOT NULL | Devise |
| `reset_password_token` | `string` | nullable, UNIQUE | Devise |
| `reset_password_sent_at` | `datetime` | nullable | Devise |
| `remember_created_at` | `datetime` | nullable | Devise |
| `name` | `string` | NOT NULL | |
| `bio` | `text` | nullable | |
| `location` | `string` | nullable | |
| `emergency_contact` | `string` | nullable | |
| `birthday` | `date` | nullable | |
| `experience_level` | `string` (enum) | nullable | |
| `frequency` | `string` (enum) | nullable | |
| `admin` | `boolean` | NOT NULL, default `false` | |
| `created_at` | `datetime` | NOT NULL | |
| `updated_at` | `datetime` | NOT NULL | |

- **Enums**: `experience_level` (`beginner`, `intermediate`, `advanced`), `frequency` (`monthly`, `biweekly`, `weekly`, `more_often`).
- **Active Storage**: `avatar` (`has_one_attached`).
- **Devise modules**: `database_authenticatable`, `registerable`, `recoverable`, `rememberable`, `validatable`.

---

### events

Caminata publicada por un organizer. Pasa por verificación de admin
antes de publicarse.

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `organizer_id` | `bigint` | FK→`users`, NOT NULL | |
| `title` | `string` | NOT NULL | |
| `slug` | `string` | NOT NULL, UNIQUE | Inmutable |
| `description_short` | `string` | NOT NULL | max 160 chars (app) |
| `description_long` | `text` | NOT NULL | |
| `destino_id` | `bigint` | FK→`destinos`, nullable | Exclusivo con `custom_location` |
| `custom_location` | `string` | nullable | Exclusivo con `destino_id` |
| `difficulty` | `string` (enum) | NOT NULL | |
| `distance_km` | `decimal(5, 2)` | NOT NULL | |
| `elevation_gain_m` | `integer` | NOT NULL | |
| `duration_hours` | `decimal(4, 1)` | NOT NULL | |
| `route_type` | `string` (enum) | NOT NULL | |
| `starts_at` | `datetime` | NOT NULL | |
| `meeting_point` | `text` | NOT NULL | |
| `max_participants` | `integer` | NOT NULL | min 2 (app) |
| `price_crc` | `integer` | NOT NULL, default `0` | `0` = gratis |
| `status` | `string` (enum) | NOT NULL, default `pending_review` | ADR-005 |
| `rejection_reason` | `text` | nullable | ADR-005 |
| `reviewed_at` | `datetime` | nullable | ADR-005 |
| `reviewed_by_id` | `bigint` | FK→`users`, nullable, `on_delete: nullify` | ADR-005 |
| `created_at` | `datetime` | NOT NULL | |
| `updated_at` | `datetime` | NOT NULL | |

- **Enums**: `difficulty` (`easy`, `moderate`, `hard`, `extreme`), `route_type` (`loop`, `out_and_back`, `point_to_point`), `status` (`pending_review`, `published`, `rejected`, `cancelled`, `completed`).
- **Active Storage**: `cover_image` (`has_one_attached`), obligatoria, JPEG/PNG/WebP, ≤5MB.

---

### destinos

Catálogo curado de lugares populares para caminar en Costa Rica.

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `name` | `string` | NOT NULL, UNIQUE | |
| `slug` | `string` | NOT NULL, UNIQUE | Inmutable |
| `description` | `text` | nullable | |
| `province` | `string` (enum) | NOT NULL | |
| `latitude` | `decimal(9, 6)` | nullable | GPS |
| `longitude` | `decimal(9, 6)` | nullable | GPS |
| `active` | `boolean` | NOT NULL, default `true` | Soft-disable |
| `created_at` | `datetime` | NOT NULL | |
| `updated_at` | `datetime` | NOT NULL | |

- **Enums**: `province` (`san_jose`, `alajuela`, `cartago`, `heredia`, `guanacaste`, `puntarenas`, `limon`).
- **Active Storage**: `cover_image` (`has_one_attached`), opcional.

---

### inscriptions

Inscripción de un User a un Event. Join con atributos.

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `user_id` | `bigint` | FK→`users`, NOT NULL | |
| `event_id` | `bigint` | FK→`events`, NOT NULL | |
| `status` | `string` (enum) | NOT NULL, default `active` | |
| `cancellation_reason` | `text` | nullable | |
| `cancelled_at` | `datetime` | nullable | |
| `created_at` | `datetime` | NOT NULL | |
| `updated_at` | `datetime` | NOT NULL | |

- **Indexes**: `(user_id, event_id)` UNIQUE.
- **Enums**: `status` (`active`, `cancelled`, `attended`, `no_show`).
- **Comportamiento**: re-inscripción tras cancelar = toggle del mismo record (no se crea nuevo).

---

### gear_items

Ítem del checklist de equipo de un evento. Definido por el organizer
(per-event, sin catálogo global).

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `event_id` | `bigint` | FK→`events`, NOT NULL | |
| `name` | `string` | NOT NULL | max 80 chars (app) |
| `description` | `text` | nullable | |
| `required` | `boolean` | NOT NULL, default `true` | `false` = recomendado |
| `position` | `integer` | NOT NULL, default `0` | Orden UI |
| `created_at` | `datetime` | NOT NULL | |
| `updated_at` | `datetime` | NOT NULL | |

---

### gear_item_marks

Marca del hiker "ya tengo este ítem". Join con atributos
**vía Inscription** (no User).

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `inscription_id` | `bigint` | FK→`inscriptions`, NOT NULL | |
| `gear_item_id` | `bigint` | FK→`gear_items`, NOT NULL | |
| `created_at` | `datetime` | NOT NULL | Funciona como "marked_at" |
| `updated_at` | `datetime` | NOT NULL | |

- **Indexes**: `(inscription_id, gear_item_id)` UNIQUE.
- **Comportamiento**: toggle por delete (marcar = INSERT, desmarcar = DELETE). Sin flag `marked`.

---

### badges

Catálogo curado de insignias. Asignación automática diferida a Fase 2.

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `name` | `string` | NOT NULL, UNIQUE | |
| `slug` | `string` | NOT NULL, UNIQUE | Inmutable |
| `description` | `text` | NOT NULL | |
| `icon` | `string` | NOT NULL | Filename SVG en `app/assets/images/badges/` |
| `category` | `string` (enum) | NOT NULL | |
| `rule_key` | `string` | nullable, UNIQUE | Puente a Fase 2 (auto-asignación) |
| `position` | `integer` | NOT NULL, default `0` | |
| `active` | `boolean` | NOT NULL, default `true` | Soft-disable |
| `created_at` | `datetime` | NOT NULL | |
| `updated_at` | `datetime` | NOT NULL | |

- **Enums**: `category` (`milestone`, `destination`, `special`, `onboarding`).

---

### user_badges

Insignia ganada por un User. Join con atributos.

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `user_id` | `bigint` | FK→`users`, NOT NULL | |
| `badge_id` | `bigint` | FK→`badges`, NOT NULL | |
| `event_id` | `bigint` | FK→`events`, nullable, `on_delete: nullify` | Triggering event |
| `earned_at` | `datetime` | NOT NULL | |
| `created_at` | `datetime` | NOT NULL | |
| `updated_at` | `datetime` | NOT NULL | |

- **Indexes**: `(user_id, badge_id)` UNIQUE.

---

### motivations

Catálogo de motivaciones para caminar (onboarding multi-select).

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `name` | `string` | NOT NULL, UNIQUE | |
| `slug` | `string` | NOT NULL, UNIQUE | Inmutable |
| `icon` | `string` | NOT NULL | Filename SVG en `app/assets/images/motivations/` |
| `position` | `integer` | NOT NULL, default `0` | |
| `active` | `boolean` | NOT NULL, default `true` | Soft-disable |
| `created_at` | `datetime` | NOT NULL | |
| `updated_at` | `datetime` | NOT NULL | |

- **Seed inicial (6 filas)**: Naturaleza, Fitness, Social, Fotografía, Espiritual, Aventura.

---

### regions

Catálogo de zonas geográfico-hikers de Costa Rica
(onboarding multi-select). **No** son provincias.

| Columna | Tipo | Constraints | Notas |
|---|---|---|---|
| `id` | `bigint` | PK | |
| `name` | `string` | NOT NULL, UNIQUE | |
| `slug` | `string` | NOT NULL, UNIQUE | Inmutable |
| `position` | `integer` | NOT NULL, default `0` | |
| `active` | `boolean` | NOT NULL, default `true` | Soft-disable |
| `created_at` | `datetime` | NOT NULL | |
| `updated_at` | `datetime` | NOT NULL | |

- **Seed inicial (~9 filas)**: Cordillera de Talamanca, Cordillera Central, Cordillera de Tilarán, Cordillera de Guanacaste, Valle Central, Pacífico Sur, Pacífico Central, Caribe, Península de Nicoya.

---

## Join tables sin modelo Ruby (2)

Convención Rails HABTM: nombres en orden alfabético, ambos plurales,
sin `id`, sin timestamps.

### motivations_users

| Columna | Tipo | Constraints |
|---|---|---|
| `motivation_id` | `bigint` | FK→`motivations`, NOT NULL |
| `user_id` | `bigint` | FK→`users`, NOT NULL |

- **Indexes**: `(motivation_id, user_id)` UNIQUE.

### regions_users

| Columna | Tipo | Constraints |
|---|---|---|
| `region_id` | `bigint` | FK→`regions`, NOT NULL |
| `user_id` | `bigint` | FK→`users`, NOT NULL |

- **Indexes**: `(region_id, user_id)` UNIQUE.

---

## Active Storage (resumen)

3 attachments en el modelo. Active Storage usa tablas internas
(`active_storage_blobs`, `active_storage_attachments`,
`active_storage_variant_records`); no son columnas de las tablas
referenciadas.

| Modelo | Attachment | Macro | Obligatoria | Restricciones |
|---|---|---|---|---|
| `User` | `avatar` | `has_one_attached` | No | (sin validaciones específicas en MVP) |
| `Event` | `cover_image` | `has_one_attached` | Sí | JPEG/PNG/WebP, ≤5MB |
| `Destino` | `cover_image` | `has_one_attached` | No | (igual) |

> **Nota sobre `icon` en `badges` y `motivations`**: NO usan Active
> Storage. Son `string` con filename de un SVG curado en
> `app/assets/images/{badges,motivations}/`. Active Storage es para
> contenido user-generated; los íconos del producto van como assets.

---

## Enums consolidados

Todos los enums del modelo son **string-backed** (storage `string`,
no `integer`). Keys en inglés (convención técnica), display en
español vía i18n.

| Modelo | Atributo | Valores (DB) | Default |
|---|---|---|---|
| `User` | `experience_level` | `beginner`, `intermediate`, `advanced` | `NULL` |
| `User` | `frequency` | `monthly`, `biweekly`, `weekly`, `more_often` | `NULL` |
| `Event` | `difficulty` | `easy`, `moderate`, `hard`, `extreme` | (sin default) |
| `Event` | `route_type` | `loop`, `out_and_back`, `point_to_point` | (sin default) |
| `Event` | `status` | `pending_review`, `published`, `rejected`, `cancelled`, `completed` | `pending_review` |
| `Destino` | `province` | `san_jose`, `alajuela`, `cartago`, `heredia`, `guanacaste`, `puntarenas`, `limon` | (sin default) |
| `Inscription` | `status` | `active`, `cancelled`, `attended`, `no_show` | `active` |
| `Badge` | `category` | `milestone`, `destination`, `special`, `onboarding` | (sin default) |

---

## Convenciones del esquema

- **Primary keys**: `bigint` autoincremental, llamadas `id`.
- **Foreign keys**: `<nombre_tabla_singular>_id` (ej. `event_id`, `organizer_id`). Siempre con índice (Rails lo agrega solo con `t.references`).
- **Timestamps**: `created_at` / `updated_at` automáticos en toda tabla con modelo Ruby. **Excepción**: join tables HABTM puras (`motivations_users`, `regions_users`) no llevan timestamps.
- **`string` vs `text`**: `string` para inputs (varchar 255), `text` para textareas/contenido largo. La regla operativa es "¿va en `<input>` o `<textarea>`?".
- **`decimal(p, s)`**: usado para distancias (`decimal(5, 2)`), duraciones (`decimal(4, 1)`) y coordenadas GPS (`decimal(9, 6)`). Precisión exacta sin perder dígitos.
- **`integer` vs `decimal` para dinero**: `integer` para CRC (sin céntimos en uso real). `decimal` solo si en Fase 2 se agregan monedas con céntimos.
- **Soft-disable** (patrón consistente en catálogos): `active: boolean NOT NULL default true`. Se aplica a `Destino`, `Badge`, `Motivation`, `Region`.
- **Slugs**: para `Event`, `Destino`, `Badge`, `Motivation`, `Region`. Auto desde `name` con `parameterize`, inmutables, unique. Sufijo numérico para duplicados.
- **`on_delete: nullify`** (en lugar de `cascade` o `restrict`): aplicado a FKs cuyo borrado no debe destruir el registro padre. Usado en `events.reviewed_by_id` y `user_badges.event_id`.

---

## Referencias

- **Razonamiento detallado de cada decisión**: [`data-model.md`](./data-model.md).
- **ADRs aplicables**: [`decisions.md`](./decisions.md).
- **ADR-005** (verificación manual de eventos): impacta `events.status`, `events.rejection_reason`, `events.reviewed_at`, `events.reviewed_by_id`.
