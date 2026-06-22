# Modelo de datos de Chaski

Este documento define el modelo de datos del MVP de Chaski, desde las
entidades conceptuales hasta los atributos, relaciones, restricciones e
índices que se traducirán en migraciones y modelos ActiveRecord.

> Para una **referencia rápida del esquema final** (solo tablas,
> columnas, tipos y constraints, sin razonamiento), ver
> [`schema.md`](./schema.md).

> **Estado del documento**:
> - ✅ Paso 1: Entidades identificadas
> - ✅ Paso 2: Atributos por entidad (las 10 entidades + 2 join tables completadas)
> - 🔄 Paso 3: Relaciones entre entidades — vive en [`relationships.md`](./relationships.md) (Dominio User completado)
> - ⏳ Paso 4: Restricciones (validaciones, unicidad) (pendiente)
> - ⏳ Paso 5: Optimización (índices, enums) (pendiente)

Cada paso se trabaja en su propia sesión para que las decisiones sean
entendidas y defendibles. Este documento se actualiza incrementalmente.

---

## Paso 1: Entidades del MVP

### Metodología usada

Las entidades se derivaron aplicando el siguiente proceso:

1. **Extracción de sustantivos** recurrentes desde
   [`docs/product/mvp.md`](../product/mvp.md) y
   [`docs/product/screens.md`](../product/screens.md).
2. **Test de las 3 condiciones** para cada candidato:
   - ¿Tiene identidad propia?
   - ¿Tiene atributos descriptivos?
   - ¿Necesita persistir?
3. **Filtrado de falsos positivos**: roles, estados y cálculos derivados
   se modelan como atributos o enums, no como entidades.

### Entidades principales (8)

Cada una tiene modelo Ruby propio (`class X < ApplicationRecord`) y su
propia tabla en la base de datos.

| # | Entidad | Qué representa |
|---|---|---|
| 1 | **User** | Usuario registrado. Contiene autenticación, datos de perfil y datos del onboarding (todo en una sola tabla, sin `Profile` aparte). |
| 2 | **Event** | Caminata publicada por un organizador. Es el corazón del producto. |
| 3 | **Destino** | Lugar canónico de hiking (Pico Blanco, Chirripó, etc.). Catálogo curado que se seedea con ~30-40 destinos populares de Costa Rica. |
| 4 | **Inscription** | Inscripción de un User a un Event. Relación con atributos propios (estado, fecha, razón de cancelación). |
| 5 | **GearItem** | Ítem del checklist de equipo de un evento (ej: "Botas de montaña"). Pertenece a un Event. |
| 6 | **GearItemMark** | Marca de un User sobre un GearItem específico ("lo tengo / no lo tengo"). |
| 7 | **Badge** | Catálogo de insignias disponibles en Chaski (ej: "Primera caminata", "Conquistador del Volcán"). |
| 8 | **UserBadge** | Insignia ganada por un User en una fecha específica. |

### Catálogos pequeños (2)

Entidades cortas (en términos de cantidad de filas) pero útiles para
consultas, filtrado y administración.

| # | Entidad | Qué representa |
|---|---|---|
| 9 | **Motivation** | Catálogo de motivaciones para caminar (Naturaleza, Fitness, Social, Fotografía, Espiritual, Aventura). Capturadas en el onboarding. |
| 10 | **Region** | Catálogo de zonas de Costa Rica (Talamanca, Cordillera Central, Tilarán, Guanacaste, Valle Central, etc.). Sirven para preferencias del User y para categorizar Destinos. |

### Tablas de unión sin modelo propio (2)

Estas existen solo en la BD para representar relaciones **muchos a
muchos** que no tienen atributos propios. Se declaran con
`has_and_belongs_to_many` en Rails.

| Tabla | Qué conecta | Por qué no tiene modelo |
|---|---|---|
| `motivations_users` | User ↔ Motivation | No hay nada más que guardar más allá de la conexión. |
| `regions_users` | User ↔ Region | Mismo motivo. |

**Convención de naming**: HABTM en Rails usa el nombre de las dos
tablas relacionadas en **orden alfabético** y ambas plurales. Así
`has_and_belongs_to_many :motivations` en `User` resuelve la tabla
correcta sin necesidad de `join_table:` explícito.

---

## Distinción importante: join con modelo vs join sin modelo

Hay un patrón conceptual importante en este modelo:

| Caso | Tiene modelo Ruby propio | Por qué |
|---|---|---|
| **Inscription** (User ↔ Event) | ✅ Sí | Tiene atributos propios: `status`, `inscribed_at`, `cancellation_reason`. La inscripción es algo más que "estos dos están conectados". |
| **GearItemMark** (User ↔ GearItem) | ✅ Sí | Tiene `marked_at`. Necesitamos saber cuándo se marcó. |
| **UserBadge** (User ↔ Badge) | ✅ Sí | Tiene `earned_at`. La fecha de obtención importa. |
| **user_motivations** (User ↔ Motivation) | ❌ No | Solo conecta. No hay nada más que decir sobre la conexión. |
| **user_regions** (User ↔ Region) | ❌ No | Igual. |

**Regla operativa**: si la conexión tiene información propia (cuándo,
en qué estado, por qué), es un **modelo con tabla**. Si la conexión es
solo "X tiene Y", es una **tabla pura sin modelo**.

---

## Conteo total

- **10 modelos Ruby con tabla propia**.
- **2 join tables sin modelo Ruby**.
- **Total: 12 tablas en la base de datos.**

Es un tamaño razonable para un MVP. Sin Organizations / Plans / Tienda /
Reviews (diferidas a Fase 2), nos mantenemos chicos pero cubiertos.

---

## Decisiones de scope tomadas en este paso

| Decisión | Resultado |
|---|---|
| ¿Usuario como entidad única o roles separados? | Una sola entidad `User`. Roles (hiker, organizer, admin) se modelan como atributos. |
| ¿Tabla `Profile` aparte o atributos en `User`? | Atributos directamente en `User` (más simple para MVP). |
| ¿`Destino` como entidad o texto libre? | Entidad con catálogo curado + campo `custom_location` opcional en `Event` para destinos fuera del catálogo. |
| ¿`Motivation` y `Region` como entidades o como arrays/enums? | Como entidades, conectadas a `User` por many-to-many. Permite filtrado y stats. |
| ¿`Inscription`, `GearItemMark`, `UserBadge` como joins puros o como modelos? | Como modelos, porque tienen atributos propios (estado, fechas, razones). |
| ¿Modelar `Trail` aparte de `Destino`? | No para MVP. `Destino` cubre lo necesario. Trail/variantes se evaluará en Fase 2 si el producto lo requiere. |

---

## Paso 2: Atributos por entidad

Definir los atributos = decidir qué columnas tiene cada tabla y con qué
tipo de dato. Se trabaja entidad por entidad. Cada decisión queda
justificada para que el modelo sea defendible.

### Conceptos clave aplicados en este paso

- **Tipos de datos Rails/PostgreSQL**:
  - `string`: varchar 255, contenido corto de una sola línea (inputs).
  - `text`: contenido largo multi-línea (textareas).
  - `integer` / `bigint`: enteros.
  - `decimal(p, s)`: números con precisión exacta (dinero, distancias).
  - `boolean`: true/false.
  - `date`: solo fecha (sin hora).
  - `datetime`: fecha + hora + timezone.
  - `references`: foreign key a otra tabla.
- **Heurística `string` vs `text`**: si va en un `<input>`, `string`.
  Si va en un `<textarea>`, `text`.
- **Migraciones son inmutables**: una vez corridas en producción, no
  se modifican. Todo cambio = migración nueva.
- **Devise genera columnas automáticamente**: al correr
  `rails g devise User`, Devise crea una migración con las columnas
  que sus módulos activados necesitan.
- **Active Storage NO es una columna**: los archivos adjuntos
  (avatares, imágenes de eventos) viven en tablas internas
  (`active_storage_blobs`, `active_storage_attachments`).
- **Enums en Rails**: pueden guardarse como `integer` (compacto) o
  `string` (legible). Para MVP usamos `string`: más legible al
  debuggear y seguro ante reordenamientos.

---

### User

`User` es la entidad más rica del MVP. Sus 14 columnas se organizan
en 4 subgrupos lógicos.

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `email` | `string` | NO | `""` | Devise |
| 3 | `encrypted_password` | `string` | NO | `""` | Devise |
| 4 | `reset_password_token` | `string` | SÍ | — | Devise |
| 5 | `reset_password_sent_at` | `datetime` | SÍ | — | Devise |
| 6 | `remember_created_at` | `datetime` | SÍ | — | Devise |
| 7 | `name` | `string` | NO | — | Profile (Chaski) |
| 8 | `bio` | `text` | SÍ | — | Profile (Chaski) |
| 9 | `location` | `string` | SÍ | — | Profile (Chaski) |
| 10 | `emergency_contact` | `string` | SÍ | — | Profile (Chaski) |
| 11 | `birthday` | `date` | SÍ | — | Profile (Chaski) |
| 12 | `experience_level` | `string` (enum) | SÍ | — | Onboarding (Chaski) |
| 13 | `frequency` | `string` (enum) | SÍ | — | Onboarding (Chaski) |
| 14 | `admin` | `boolean` | NO | `false` | Roles (Chaski) |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `avatar` | (Active Storage) | — | — | No es columna de `users` |

**Total: 14 columnas definidas + 2 timestamps automáticos + 1
attachment vía Active Storage.**

#### Subgrupo 1 — Auth (gestionado por Devise)

Estas columnas SON nuestras (viven en nuestra BD), pero el código que
las gestiona vive en la gema Devise. Activar un módulo de Devise =
nueva migración con sus columnas.

**Módulos de Devise activados para el MVP**:
`:database_authenticatable, :registerable, :recoverable, :rememberable, :validatable`

**Columnas que genera Devise**:

| Columna | Tipo | Propósito |
|---|---|---|
| `email` | `string` | Login + comunicación. Único (index único). |
| `encrypted_password` | `string` | Hash bcrypt de la contraseña. **Nunca** texto plano. |
| `reset_password_token` | `string` | Token único para flujo "olvidé mi contraseña". |
| `reset_password_sent_at` | `datetime` | Timestamp para invalidar el token tras N horas. |
| `remember_created_at` | `datetime` | Timestamp del "remember me" en login. |

**Módulos NO activados (y por qué)**:

| Módulo | Decisión MVP | Razón |
|---|---|---|
| `confirmable` (confirmar email) | No | Se difiere a Fase 2. Reduce fricción de signup en MVP. |
| `lockable` (lockout tras N fallos) | No | Overhead innecesario sin tráfico real. |
| `trackable` (analytics de login) | No | Tracking se implementará aparte si se requiere. |
| `omniauthable` (SSO Google/etc.) | No | Decisión de producto: solo email + password en MVP. |

#### Subgrupo 2 — Profile

Atributos del perfil público y de logística del usuario.

| Columna | Tipo | Decisión clave |
|---|---|---|
| `name` | `string` (NOT NULL) | Campo único, sin separar `first_name` / `last_name`. Más simple e inclusivo culturalmente. |
| `bio` | `text` (nullable) | Multi-línea, opcional. Límite ~500 chars vía validación en app (no constraint de BD). |
| `location` | `string` (nullable) | Free text (ej: "San José, Costa Rica"). No estructurado en MVP. |
| `emergency_contact` | `string` (nullable) | Formato libre: "Nombre — Teléfono". Opcional al registrarse, **requerido al inscribirse al primer evento**. |
| `birthday` | `date` (nullable) | Fecha exacta. Visible **solo a organizers** de los eventos del usuario. Pedida en la primera inscripción a un evento, no en el signup. |

**`avatar`**: gestionado por Active Storage (`has_one_attached :avatar`
en el modelo). NO es columna de la tabla `users`. Los blobs viven
en `active_storage_blobs`, las relaciones en
`active_storage_attachments`.

#### Subgrupo 3 — Onboarding (single-select)

Los dos atributos del Onboarding Wizard que admiten un solo valor.
Los multi-select (`Motivations`, `Regions`) viven en sus propias
entidades + tablas join (definidos en Paso 1).

| Columna | Valores válidos (DB) | Display (UI vía i18n) |
|---|---|---|
| `experience_level` | `beginner`, `intermediate`, `advanced` | Principiante, Intermedio, Avanzado |
| `frequency` | `monthly`, `biweekly`, `weekly`, `more_often` | Una vez al mes, Cada quincena, Cada semana, Más seguido |

**Decisiones aplicadas a ambos**:

- **Naming**: keys en inglés (convención Rails / i18n), display en
  español vía archivos de locale.
- **Storage**: `string` (no `integer`). Más legible al debuggear y
  seguro ante reordenamientos en el enum.
- **Nullable + sin default**: coherente con un onboarding *skippable*.
  Un usuario puede no haber completado el onboarding aún.
- **`frequency`** representa **cadencia** (cada cuánto camina), no
  intensidad / dificultad.

#### Subgrupo 4 — Roles

Decisión arrastrada del Paso 1: los roles son **capacidades**, no
entidades separadas. Cada rol se modela donde tiene más sentido.

| "Rol" | Cómo se modela | Razón |
|---|---|---|
| **Hiker** | Implícito en toda fila de `users` | Es la capacidad base. Si existe el record, es hiker. |
| **Organizer** | **Derivado** dinámicamente: `user.events.any?` | Sin flag explícito. Se mantiene siempre consistente con la realidad (un user que crea un evento *es* organizer; uno cuyos eventos se borraron deja de serlo). Si la query se vuelve costosa, futura optimización: counter cache. |
| **Admin** | Columna `admin: boolean, NOT NULL, default: false` | Capacidad de equipo Chaski, asignada manualmente desde Rails console (o futuro panel interno). |

**Seguridad de `admin`**: NUNCA se incluye en los strong parameters
de formularios públicos. Solo se modifica desde paneles internos con
verificación previa. Patrón: defensa en profundidad (controller +
modelo + nunca formularios públicos).

#### Decisiones de diseño tomadas en User

| Decisión | Resultado |
|---|---|
| `name`: único vs `first_name` + `last_name` | Único (`name: string`) |
| `bio`: tipo y límite | `text`, max ~500 chars (validación en app) |
| `avatar`: storage | Active Storage (no URL string en columna) |
| `location`: estructura | Free text (`string`) |
| `emergency_contact`: entidad propia o atributo | Atributo simple en `User` |
| `birthday`: granularidad y visibilidad | `date` exacta. Visible solo a organizers de los eventos del usuario. Pedida en la primera inscripción. |
| Enums: storage type | `string` (no `integer`) |
| Enums: default | `nil` (sin default), nullable |
| `frequency`: cadencia vs intensidad | Cadencia (`monthly`, `biweekly`, etc.) |
| Organizer: modelado | Derivado de `events`, sin flag |
| Admin: modelado | `boolean`, no enum |
| Devise: módulos activados | 5 módulos base (sin `confirmable`, `lockable`, `trackable`, `omniauthable`) |

---

### Event

`Event` es la **entidad más rica del MVP**, después de `User`. Sus 21
columnas se organizan en 6 subgrupos lógicos. Incorpora 4 columnas
nuevas decididas en [ADR-005](./decisions.md#adr-005-verificación-manual-de-eventos-por-admin-antes-de-publicar)
(verificación manual por admin antes de publicar).

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `organizer_id` | `bigint` (FK a `users`) | NO | — | Identidad |
| 3 | `title` | `string` | NO | — | Identidad |
| 4 | `slug` | `string` (unique) | NO | — | Identidad |
| 5 | `description_short` | `string` (max 160) | NO | — | Descripción |
| 6 | `description_long` | `text` | NO | — | Descripción |
| 7 | `destino_id` | `bigint` (FK a `destinos`) | SÍ | — | Ruta |
| 8 | `custom_location` | `string` | SÍ | — | Ruta |
| 9 | `difficulty` | `string` (enum) | NO | — | Ruta |
| 10 | `distance_km` | `decimal(5, 2)` | NO | — | Ruta |
| 11 | `elevation_gain_m` | `integer` | NO | — | Ruta |
| 12 | `duration_hours` | `decimal(4, 1)` | NO | — | Ruta |
| 13 | `route_type` | `string` (enum) | NO | — | Ruta |
| 14 | `starts_at` | `datetime` | NO | — | Logística |
| 15 | `meeting_point` | `text` | NO | — | Logística |
| 16 | `max_participants` | `integer` | NO | — | Logística |
| 17 | `price_crc` | `integer` | NO | `0` | Logística |
| 18 | `status` | `string` (enum) | NO | `"pending_review"` | Moderación (ADR-005) |
| 19 | `rejection_reason` | `text` | SÍ | — | Moderación (ADR-005) |
| 20 | `reviewed_at` | `datetime` | SÍ | — | Moderación (ADR-005) |
| 21 | `reviewed_by_id` | `bigint` (FK a `users`) | SÍ | — | Moderación (ADR-005) |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `cover_image` | (Active Storage) | — | — | No es columna de `events` |

**Total: 21 columnas definidas + 2 timestamps automáticos + 1 attachment
vía Active Storage.**

#### Subgrupo 1 — Identidad

Lo que identifica al evento de forma única en el sistema.

| Columna | Tipo | Decisión clave |
|---|---|---|
| `organizer_id` | `bigint` (FK a `users`, NOT NULL) | Todo evento tiene un organizer. Alias en código: `event.organizer` (no `event.user`). |
| `title` | `string` (NOT NULL) | Límite ~120 chars vía validación en app. |
| `slug` | `string` (NOT NULL, unique) | Para URLs amigables tipo `/eventos/chirripo-amanecer`. |

**Decisiones aplicadas a `slug`**:

| Pregunta | Decisión |
|---|---|
| ¿Hace falta `slug` o usamos solo `id` en URLs? | Solo `slug`. Compartibilidad por WhatsApp es core (MVP); URL descriptiva pesa más. |
| ¿Auto-generado o manual? | **Auto** desde `title` usando `parameterize` de Rails (sin gema adicional). |
| ¿Mutable? | **Inmutable** después de crear. Los links compartidos siempre funcionan. Si el título se edita, el slug queda. |
| ¿Cómo manejamos duplicados? | **Sufijo numérico**: `cerro-de-la-muerte`, luego `cerro-de-la-muerte-2`, `-3`, etc. |
| Constraint BD | `unique index` sobre `slug`. Defensa a nivel BD aunque la lógica de app falle. |

#### Subgrupo 2 — Descripción

Contenido textual e imagen que se le muestra al hiker.

| Columna | Tipo | Decisión clave |
|---|---|---|
| `description_short` | `string` (max 160 chars) | Para cards, listings y `og:description` meta tags. Funciona como **hook** vendedor. |
| `description_long` | `text` (sin constraint BD) | Para Event Detail Page. Hint UI de 1500-3000 chars. |
| `cover_image` | Active Storage | `has_one_attached :cover_image`. |

**Decisiones aplicadas**:

| Pregunta | Decisión |
|---|---|
| ¿Una sola descripción o dos? | **Dos** (`short` + `long`). Razones: compartibilidad por WhatsApp limpia (meta tags), performance en listas (no carga `text` grande), short como hook editable. |
| `cover_image` obligatoria | **Sí**. Sin imagen las cards se ven mal y caen los clicks. |
| Galería de imágenes | **No** para MVP. Solo una imagen (`has_one_attached`). Galería en Fase 2. |
| Formatos aceptados | JPEG, PNG, WebP. HEIC se convierte vía `image_processing`. |
| Tamaño máximo | 5 MB. Active Storage genera variants para thumbnails. |
| Aspect ratio | Libre + hint UI ("recomendamos 16:9 horizontal"). Crop tool en Fase 2. |
| Default si falla upload | Placeholder genérico (`event_placeholder.jpg` en assets). |

**Validación**:

```ruby
class Event < ApplicationRecord
  has_one_attached :cover_image
  validates :cover_image, attached: true,
                          content_type: %w[image/jpeg image/png image/webp],
                          size: { less_than: 5.megabytes }
end
```

#### Subgrupo 3 — Ruta

Características físicas y geográficas de la caminata.

| Columna | Tipo | Decisión clave |
|---|---|---|
| `destino_id` | `bigint` (FK a `destinos`, nullable) | Si el destino existe en el catálogo curado, se usa la FK. |
| `custom_location` | `string` (nullable) | Si NO está en el catálogo, el organizer escribe libremente. |
| `difficulty` | `string` (enum, NOT NULL) | 4 valores. |
| `distance_km` | `decimal(5, 2)` (NOT NULL) | Rango natural: 0.00 a 999.99 km. |
| `elevation_gain_m` | `integer` (NOT NULL) | Solo subida acumulada en metros enteros. |
| `duration_hours` | `decimal(4, 1)` (NOT NULL) | Permite 3.5h, 4h, 5.5h. Rango 0.0 a 999.9 (soporta multi-día). |
| `route_type` | `string` (enum, NOT NULL) | 3 valores. |

**Reglas de coexistencia `destino_id` ↔ `custom_location`** (exclusivos):

| Caso | `destino_id` | `custom_location` |
|---|---|---|
| Destino del catálogo (ej. Chirripó) | `42` | `NULL` |
| Lugar no catalogado | `NULL` | `"Sendero El Volcán, Bajos del Toro"` |
| **NO permitido**: ambos llenos o ambos vacíos | — | — |

Validación a nivel app vía dos validations custom. CHECK constraint en BD
queda para Fase 2 si la integridad se vuelve crítica.

**Valores de `difficulty`** (4 niveles, asimetría DB vs UI):

| DB (clave) | Display (UI ES) | Quién es el target |
|---|---|---|
| `easy` | Principiante | Hikers con `experience_level: beginner` |
| `moderate` | Intermedia | Hikers con `experience_level: intermediate` |
| `hard` | Avanzada | Hikers con `experience_level: advanced` |
| `extreme` | Extrema | Subset de `advanced` con preparación específica (multi-día, técnica) |

Decisión: **mantenemos `easy/moderate/hard/extreme`** en BD (convención
hiking estándar — AllTrails, Komoot, Wikiloc) pero el **display alinea
con el lenguaje del onboarding del hiker** (`User.experience_level`).
Esto da match cognitivo directo: "Yo soy Intermedio → busco eventos
Intermedios", sin traducción mental.

**Valores de `route_type`** (3 valores):

| DB (clave) | Display (UI ES) | Descripción |
|---|---|---|
| `loop` | Circular | Empieza y termina en el mismo punto sin repetir trayecto |
| `out_and_back` | Ida y vuelta | Por el mismo camino |
| `point_to_point` | Punto a punto | Empieza en A, termina en B (requiere logística de transporte) |

`peak` (cima) descartado: geométricamente igual a `out_and_back`. Si
"alcanzar la cima" se vuelve útil como filtro, se modela como
`summit: boolean` separado.

**No modelamos** en MVP:

| Atributo | Razón |
|---|---|
| `peak_altitude_m` (altitud del punto más alto) | Se menciona en `description_long`. Si se vuelve filtro útil, se agrega. |
| `elevation_loss_m` (bajada acumulada) | Irrelevante para mayoría de hikes. |
| `ends_at_location` (punto final si es `point_to_point`) | Se describe en `description_long`. Estructurar queda para Fase 2. |

#### Subgrupo 4 — Logística

Cuándo, dónde encontrarse, cuántos y cuánto cuesta.

| Columna | Tipo | Decisión clave |
|---|---|---|
| `starts_at` | `datetime` (NOT NULL) | Único campo combinado (fecha + hora). |
| `meeting_point` | `text` (NOT NULL) | Multi-línea: lugar + indicaciones + link de mapa. |
| `max_participants` | `integer` (NOT NULL) | Validación `min: 2` en app. |
| `price_crc` | `integer` (NOT NULL, default `0`) | Colones enteros. `0` = gratis. |

**Decisiones aplicadas**:

| Pregunta | Decisión |
|---|---|
| Fecha + hora: ¿dos columnas o una? | **Una sola** (`starts_at: datetime`). Costa Rica tiene una sola timezone sin DST. Rails maneja todo con `config.time_zone = "America/Costa_Rica"`. Naming convention Rails: campos `datetime` terminan en `_at`. |
| ¿`ends_at` también? | **No**. Derivado de `duration_hours`. Si los organizers piden control fino en Fase 2 (logística de bus, etc.), se agrega. |
| `meeting_point`: `string` o `text`? | **`text`**. Casos reales superan 255 chars (lugar + indicaciones + links + contacto). |
| `max_participants` nullable | **NOT NULL** con `min: 2`. Hikes "sin límite" son la excepción; se modelan con un número alto (999). Lógica de la app se simplifica. |
| Moneda en BD | **`price_crc`** (asume CRC). Target geográfico CR (MVP). Multi-moneda se evalúa en Fase 2. |
| `price_crc`: `integer` o `decimal`? | **`integer`**. CRC al consumidor se redondea a enteros. No usamos céntimos. |
| `price_crc` nullable | **NOT NULL, default `0`**. `0` = gratis. Sin ambigüedad "no especificado". |

#### Subgrupo 5 — Moderación (ADR-005)

Las 4 columnas que implementan el flujo de verificación manual por
admin antes de publicar. Origen completo: ADR-005.

| Columna | Tipo | Decisión clave |
|---|---|---|
| `status` | `string` (enum, NOT NULL, default `"pending_review"`) | 5 valores. |
| `rejection_reason` | `text` (nullable) | Free text. Aplica solo cuando `status = 'rejected'`. |
| `reviewed_at` | `datetime` (nullable) | Timestamp de la última revisión. |
| `reviewed_by_id` | `bigint` (FK a `users`, nullable) | Quién hizo la última revisión. |

**Valores del enum `status`**:

| DB (clave) | Display (UI ES) | Visible públicamente |
|---|---|---|
| `pending_review` | Pendiente de revisión | No |
| `published` | Publicado | Sí |
| `rejected` | Rechazado | No |
| `cancelled` | Cancelado | Sí (con badge "Cancelado") |
| `completed` | Finalizado | Sí (archivado) |

**Reglas y comportamiento**:

| Aspecto | Comportamiento |
|---|---|
| Validación de `rejection_reason` | A nivel app: requerida si `status = 'rejected'`, min 10 chars. Sin CHECK constraint en BD para MVP. |
| `reviewed_at` + `reviewed_by_id` | Se setean **juntos** cuando un admin acciona (aprobar o rechazar). |
| Re-revisión | En cada nueva revisión, ambas columnas **se sobreescriben**. No mantenemos historial de revisiones múltiples en MVP. Si se vuelve crítico, se agrega modelo `EventReview` separado en Fase 2. |
| FK `reviewed_by_id` `on_delete` | **`nullify`**. Si un admin se elimina, los eventos mantienen `status` y `reviewed_at`, pero `reviewed_by_id` queda `NULL`. El hecho de "fue revisado" se preserva. |
| `reviewed_by_id` apunta a | Tabla `users` (NO una tabla `admins` separada — `admin` es un boolean en `User`). |
| ¿`published_at` separado? | **No**. `reviewed_at` cubre el caso. Si distinguir "primera publicación" vs "última revisión" se vuelve útil, se agrega en Fase 2. |
| ¿`submitted_at` separado? | **No**. Sin estado `draft` en BD (ADR-005), `created_at == submitted_at`. |

#### Subgrupo 6 — Auditoría

Trivial. Rails las agrega automáticamente con `t.timestamps` en la
migración.

| Columna | Tipo | Mantenido por |
|---|---|---|
| `created_at` | `datetime` (NOT NULL) | Rails (al crear) |
| `updated_at` | `datetime` (NOT NULL) | Rails (en cada save) |

#### Decisiones de diseño tomadas en Event

| Decisión | Resultado |
|---|---|
| URL con `slug` vs `id` | Solo `slug`. URL amigable, SEO-friendly, compartibilidad por WhatsApp. |
| `slug`: auto vs manual | Auto desde `title` via `parameterize`. |
| `slug`: mutabilidad | Inmutable después de crear. |
| `slug`: duplicados | Sufijo numérico (`-2`, `-3`, ...). |
| Una descripción vs dos | Dos: `description_short` (160 chars max) + `description_long` (text). |
| Cover image | Active Storage, obligatoria, 5MB max, formatos JPEG/PNG/WebP. |
| Galería de imágenes | Diferida a Fase 2. |
| `destino_id` ↔ `custom_location` | Exclusivos, validación en app. |
| `difficulty`: niveles | 4 (`easy`, `moderate`, `hard`, `extreme`). |
| `difficulty`: display | Asimetría DB→UI. UI usa lenguaje del onboarding (Principiante / Intermedia / Avanzada / Extrema). |
| `distance_km`: precision | `decimal(5, 2)` (hasta 999.99 km). |
| `elevation_gain_m`: tipo | `integer` (metros enteros). |
| `duration_hours`: tipo | `decimal(4, 1)` (admite 3.5h, multi-día). |
| `route_type`: valores | 3 (`loop`, `out_and_back`, `point_to_point`). |
| Fecha + hora | Único `starts_at: datetime`. Costa Rica = una sola timezone sin DST. |
| `ends_at` | No para MVP, derivado de `duration_hours`. |
| `meeting_point`: tipo | `text` (multi-línea). |
| `max_participants` | NOT NULL, `min: 2` validation. |
| Moneda | `price_crc` (asume CRC). Multi-moneda → Fase 2. |
| `price_crc` tipo | `integer` (sin céntimos). NOT NULL, default 0 = gratis. |
| `status` storage | `string` (5 valores, default `pending_review`). |
| `rejection_reason` validación | App-level, requerida si `rejected`, min 10 chars. |
| `reviewed_at` + `reviewed_by_id` | Se setean juntos, sobreescriben en re-reviews. Sin historial. |
| `reviewed_by_id` FK delete | `on_delete: nullify`. |
| `published_at` separado | No. |
| `submitted_at` separado | No. |

---

### Destino

`Destino` es el catálogo curado de lugares populares para caminar en
Costa Rica (~30-40 entradas iniciales vía seeds). Sirve para que los
organizadores referencien lugares conocidos de forma estructurada y
para permitir filtros, stats y consistencia de datos. Es entidad
chica comparada con `Event` o `User`.

Si el lugar no está en el catálogo, el organizer escribe
`Event.custom_location` (string libre) como escape — ver Subgrupo 3
de Event.

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `name` | `string` (unique) | NO | — | Identidad |
| 3 | `slug` | `string` (unique) | NO | — | Identidad |
| 4 | `description` | `text` | SÍ | — | Descriptivo |
| 5 | `province` | `string` (enum) | NO | — | Ubicación |
| 6 | `latitude` | `decimal(9, 6)` | SÍ | — | Ubicación |
| 7 | `longitude` | `decimal(9, 6)` | SÍ | — | Ubicación |
| 8 | `active` | `boolean` | NO | `true` | Operativo |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `cover_image` | (Active Storage) | — | — | No es columna de `destinos` |

**Total: 8 columnas + 2 timestamps + 1 attachment.**

#### Subgrupo 1 — Identidad

| Columna | Tipo | Decisión clave |
|---|---|---|
| `name` | `string` (NOT NULL, unique) | Nombre canónico ("Cerro Chirripó", "Volcán Arenal"). `unique index` a nivel BD. |
| `slug` | `string` (NOT NULL, unique) | Auto desde `name` con `parameterize`. Inmutable. Sufijo numérico para duplicados (raro porque `name` también es unique). Mismo patrón que `Event.slug`. |

#### Subgrupo 2 — Ubicación

| Columna | Tipo | Decisión clave |
|---|---|---|
| `province` | `string` (enum, NOT NULL) | 7 valores fijos correspondientes a las provincias de CR. |
| `latitude` | `decimal(9, 6)` (nullable) | Coordenadas GPS, precisión sub-metro. Nullable porque algunos destinos no tienen coords cargadas al inicio. |
| `longitude` | `decimal(9, 6)` (nullable) | Idem. |

**Valores del enum `province`**:

| DB (clave) | Display (UI ES) |
|---|---|
| `san_jose` | San José |
| `alajuela` | Alajuela |
| `cartago` | Cartago |
| `heredia` | Heredia |
| `guanacaste` | Guanacaste |
| `puntarenas` | Puntarenas |
| `limon` | Limón |

Storage como `string` (no `integer`), consistente con el resto de los
enums del modelo.

**Sobre las coordenadas**: se modelan ya aunque MVP no use mapas. Los
seeders cargan las coords conocidas (Chirripó 9.4836, -83.4889; Arenal
10.4625, -84.7032; etc.). Cuesta cero en MVP y ahorra una migración
cuando se agregue mapa interactivo en Fase 2.

**No modelamos** en MVP:

| Atributo | Razón |
|---|---|
| `region_id` (FK a `Region`) | Decisión Paso 1: `Region` solo se relaciona con `User` (preferencias del hiker). Si "filtrar eventos por región" se vuelve crítico, se agrega FK en Fase 2. |
| `municipality` / `canton` | Granularidad innecesaria para MVP. `province` + descripción libre alcanza. |

#### Subgrupo 3 — Descriptivo

| Columna | Tipo | Decisión clave |
|---|---|---|
| `description` | `text` (nullable) | Texto informativo sobre el lugar. Nullable porque algunos destinos pueden no tener descripción curada todavía. |
| `cover_image` | Active Storage | `has_one_attached :cover_image`. Opcional. |

**Decisión: una sola `description`** (no `short` + `long` como en Event).
Razón: el destino describe un lugar (informativo) y no vende un evento
(promocional). No hay necesidad de meta tags ni de hooks editoriales
separados.

#### Subgrupo 4 — Operativo

| Columna | Tipo | Decisión clave |
|---|---|---|
| `active` | `boolean` (NOT NULL, default `true`) | Soft-disable. Permite ocultar un destino del catálogo sin borrarlo (cierre permanente, ban, decomiso). Borrar rompería eventos históricos que lo referencian. |

Lógica en código:

```ruby
class Destino < ApplicationRecord
  scope :active, -> { where(active: true) }
  has_many :events
end
```

Las queries públicas filtran por `Destino.active`. Los eventos
históricos siguen referenciando el destino aunque esté inactive.

#### Subgrupo 5 — Auditoría

| Columna | Tipo | Mantenido por |
|---|---|---|
| `created_at` | `datetime` (NOT NULL) | Rails (al crear) |
| `updated_at` | `datetime` (NOT NULL) | Rails (en cada save) |

#### Decisiones de diseño tomadas en Destino

| Decisión | Resultado |
|---|---|
| `name` unique | Sí (`unique index` BD). Evita duplicados como "Chirripó" vs "Cerro Chirripó" sin coordinación. |
| `slug` patrón | Mismo que `Event`: auto desde `name`, inmutable, sufijo numérico para duplicados (raro). |
| Coordenadas | Modelar ya, nullable, `decimal(9, 6)`. Seeders cargan las conocidas. |
| `province` | Enum string con 7 valores fijos (provincias CR). |
| Relación con `Region` | **No** en MVP. `Region` queda solo para User preferences. |
| Granularidad ubicación | `province` solamente; sin `municipality` / `canton`. |
| `description` | Un solo `text`, nullable. Sin `short`/`long`. |
| `events_count` (counter cache) | **Diferido** a Paso 5 (optimización). |
| `active` flag | Sí, NOT NULL default `true`. Soft-disable. |
| `cover_image` | Active Storage, opcional. |

---

### Inscription

`Inscription` es el **primer "join con atributos"** del proyecto. No
es un join puro (`has_and_belongs_to_many`) porque la relación entre
`User` y `Event` tiene información propia que no pertenece a ninguno
de los dos: estado, razón de cancelación, timestamp de cancelación.

**Mental model**: si pensás en un boleto de concierto, el boleto te
conecta con un evento y tiene atributos propios (cuándo se compró, si
fue usado, etc.). `Inscription` es el "boleto" de Chaski.

Patrón Rails que usaremos:

```ruby
class User < ApplicationRecord
  has_many :inscriptions
  has_many :events, through: :inscriptions
end

class Event < ApplicationRecord
  has_many :inscriptions
  has_many :users, through: :inscriptions
end

class Inscription < ApplicationRecord
  belongs_to :user
  belongs_to :event
end
```

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `user_id` | `bigint` (FK a `users`) | NO | — | Asociación |
| 3 | `event_id` | `bigint` (FK a `events`) | NO | — | Asociación |
| 4 | `status` | `string` (enum) | NO | `"active"` | Estado |
| 5 | `cancellation_reason` | `text` | SÍ | — | Estado |
| 6 | `cancelled_at` | `datetime` | SÍ | — | Estado |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |

**Total: 6 columnas + 2 timestamps.** Es la entidad más chica modelada
hasta ahora.

#### Subgrupo 1 — Asociación

| Columna | Tipo | Decisión clave |
|---|---|---|
| `user_id` | `bigint` (FK a `users`, NOT NULL) | El hiker inscrito. |
| `event_id` | `bigint` (FK a `events`, NOT NULL) | El evento al que se inscribió. |

Ambas FKs definidas con `t.references :user, foreign_key: true` y
`t.references :event, foreign_key: true` en la migración. Rails crea
índices automáticos en cada una.

**Constraint adicional** (clave del modelo):
- `unique index` compuesto en (`user_id`, `event_id`): un usuario no
  puede tener más de una inscripción al mismo evento. Si cancela y
  re-inscribe, se reusa el mismo record cambiando `status`.

```ruby
add_index :inscriptions, [:user_id, :event_id], unique: true
```

#### Subgrupo 2 — Estado

Los atributos que pertenecen a la relación misma (no al user ni al
event).

| Columna | Tipo | Decisión clave |
|---|---|---|
| `status` | `string` (enum, NOT NULL, default `"active"`) | 4 valores. Default `active` porque al crearse la inscripción el hiker está inscrito. |
| `cancellation_reason` | `text` (nullable) | Free text. Aplica solo cuando `status = 'cancelled'`. Sin validación de longitud (el hiker puede dejarla vacía). |
| `cancelled_at` | `datetime` (nullable) | Timestamp business-meaningful. Aplica solo cuando `status = 'cancelled'`. |

**Valores del enum `status`**:

| DB (clave) | Display (UI ES) | Cuándo aplica |
|---|---|---|
| `active` | Inscrito | Hiker inscrito, evento aún no ha ocurrido |
| `cancelled` | Cancelada | Hiker canceló su inscripción |
| `attended` | Asistió | Post-evento, marcado por el organizer como presente |
| `no_show` | No asistió | Post-evento, no se presentó |

Storage `string` (no `integer`), consistente con el resto de enums
del modelo.

**Razones para NO desambiguar el actor de la cancelación**: en MVP no
distinguimos `cancelled_by_hiker` vs `cancelled_by_organizer` como
estados separados. Si llega a ser útil saber quién canceló, se
agrega `cancelled_by_id` (FK a `users`) como columna nullable en
Fase 2. Por ahora, el contexto va libre en `cancellation_reason`.

#### Subgrupo 3 — Auditoría

| Columna | Tipo | Mantenido por |
|---|---|---|
| `created_at` | `datetime` (NOT NULL) | Rails (al crear) |
| `updated_at` | `datetime` (NOT NULL) | Rails (en cada save) |

#### Comportamientos importantes

**Re-inscripción después de cancelar**:

| Acción | Comportamiento |
|---|---|
| Hiker cancela inscripción | `status: cancelled`, `cancelled_at: now`, `cancellation_reason: <texto opcional>` |
| Hiker re-inscribe al mismo evento | Se reusa el mismo record (gracias al `unique index`). `status: active`, `cancelled_at: NULL`, `cancellation_reason: NULL` |

**Por qué toggle y no nuevo record**:

- Mantiene la regla "una inscripción por (user, event)" simple a nivel
  BD sin partial unique index.
- La query "¿está inscrito María al evento 7?" siempre devuelve un
  solo record o ninguno. Sin necesidad de ordenar por `created_at` o
  filtrar por status para encontrar "la actual".
- Costo: se pierde el historial de cancelaciones múltiples si el
  mismo hiker cancela y re-inscribe varias veces. Para MVP no es
  crítico. Si se vuelve, se modela `InscriptionEvent` en Fase 2.

#### Decisiones de diseño tomadas en Inscription

| Decisión | Resultado |
|---|---|
| ¿Modelo Ruby o join puro? | **Modelo Ruby** (`has_many :through`). La relación tiene atributos propios. |
| Valores de `status` | 4: `active`, `cancelled`, `attended`, `no_show`. |
| Desambiguar actor de cancelación | **No** en MVP. Sin `cancelled_by_id`. Contexto va en `cancellation_reason`. |
| `cancellation_reason` | `text` nullable, sin validación de longitud. |
| `cancelled_at` | Columna separada nullable. Semánticamente importante; no se reusa `updated_at`. |
| Re-inscripción | **Toggle del status** en el mismo record. `cancelled_at` y `cancellation_reason` se limpian. |
| Constraint unicidad | `unique index` compuesto en (`user_id`, `event_id`). |
| Counter cache (`Event.inscriptions_count`) | Diferido a Paso 5. |
| Waitlist | **No** en MVP. Al llenarse el cupo, la inscripción queda bloqueada. |
| Mensaje del hiker al organizer al inscribirse | **No** en MVP. Si surge necesidad, se modela `InscriptionNote` aparte. |

---

### GearItem

`GearItem` representa un **ítem del checklist de equipo** de un evento
(ej: "Linterna frontal", "Botella de agua 2L", "Capa de lluvia"). Cada
ítem pertenece a **un solo evento**: el organizer define la lista
desde cero al crear/editar el evento. No hay catálogo global de gear
items en el MVP — ver decisión más abajo.

`GearItem` y `GearItemMark` (la entidad que sigue) funcionan en
pareja:

- `GearItem` define **qué** equipo se necesita (lo decide el
  organizer).
- `GearItemMark` registra **quién** lo marcó como "ya lo tengo" (lo
  hace cada hiker inscrito).

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `event_id` | `bigint` (FK a `events`) | NO | — | Asociación |
| 3 | `name` | `string` | NO | — | Contenido |
| 4 | `description` | `text` | SÍ | — | Contenido |
| 5 | `required` | `boolean` | NO | `true` | Categorización |
| 6 | `position` | `integer` | NO | `0` | Orden |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |

**Total: 5 columnas + 2 timestamps.**

#### Subgrupo 1 — Asociación

| Columna | Tipo | Decisión clave |
|---|---|---|
| `event_id` | `bigint` (FK a `events`, NOT NULL) | Todo ítem pertenece a exactamente un evento. Si el evento se borra, sus ítems también (`dependent: :destroy` a definir en Paso 3). |

#### Subgrupo 2 — Contenido

| Columna | Tipo | Decisión clave |
|---|---|---|
| `name` | `string` (NOT NULL) | Nombre corto del ítem (ej: "Linterna frontal"). Límite ~80 chars vía validación en app. |
| `description` | `text` (nullable) | Detalle opcional (ej: "Idealmente >300 lúmenes"). Hint UI: ~200 chars. |

#### Subgrupo 3 — Categorización

| Columna | Tipo | Decisión clave |
|---|---|---|
| `required` | `boolean` (NOT NULL, default `true`) | Si `true`, se muestra como "Requerido" en la UI; si `false`, "Recomendado". |

Decisión: **un solo boolean en lugar de un enum de 3 valores**
(`required` / `recommended` / `optional`). Las listas de equipo son
chicas (10-15 ítems típicos) y la distinción "requerido vs
recomendado" cubre los casos reales sin agregar complejidad.

**`category` (clothing, food, safety, etc.) NO se modela en MVP**.
Las listas son lo bastante cortas para no necesitar agrupación. Si
crecen a >25 ítems con regularidad en Fase 2, se evalúa agregar.

#### Subgrupo 4 — Orden

| Columna | Tipo | Decisión clave |
|---|---|---|
| `position` | `integer` (NOT NULL, default `0`) | Define el orden visual en el checklist. El organizer puede reordenar (drag-and-drop o flechas) en el wizard. Sin este campo el orden quedaría arbitrario (por `id` o `created_at`). |

#### Subgrupo 5 — Auditoría

| Columna | Tipo | Mantenido por |
|---|---|---|
| `created_at` | `datetime` (NOT NULL) | Rails (al crear) |
| `updated_at` | `datetime` (NOT NULL) | Rails (en cada save) |

#### Decisión clave: ¿catálogo global o por-evento?

Antes de definir las columnas se evaluó si `GearItem` debía ser un
**catálogo global** (organizer selecciona de una lista predefinida) o
**por-evento** (organizer crea sus ítems desde cero).

| Opción | Cómo se modela | Por qué se descartó / eligió |
|---|---|---|
| **A. Per-event (elegida)** | `gear_items.event_id` NOT NULL. Cada evento tiene sus propios records. | Esquema simple (1 tabla), sin admin de catálogo, sin cuello de botella si falta un ítem en el catálogo, evolución natural cuando haya datos reales. |
| **B. Catálogo global** | Tabla `gear_items` sin `event_id` + tabla join `event_gear_items`. | Requiere mantener el catálogo (admin), 2 tablas extra, organizer dependiente del admin para items nuevos. Overkill en MVP. |
| **C. Híbrido** | Catálogo global + override custom por evento. | Combina la complejidad de A y B sin justificación clara en MVP. |

**Cómo se mitiga la repetición en Opción A**: el wizard "Crear Evento"
muestra **sugerencias hardcodeadas en el frontend** ("Agua 2L",
"Linterna frontal", "Bloqueador solar", etc.). El organizer hace click
en la sugerencia y se crea un `GearItem` row con ese nombre. A nivel
DB es per-event (cada click crea un record nuevo), a nivel UX se
siente como un catálogo. Cuando haya 50+ eventos en producción, se
analiza `SELECT name, COUNT(*) FROM gear_items GROUP BY name` para
construir un catálogo real basado en datos (Fase 2/3).

#### Caso de uso (resumen)

1. Organizer crea evento → al guardar, se insertan N filas en
   `gear_items` (una por ítem del checklist), todas con el mismo
   `event_id`.
2. Hiker ve la página del evento → query
   `SELECT * FROM gear_items WHERE event_id = X ORDER BY position`
   devuelve la lista informativa.
3. Hiker se inscribe → ahora puede **marcar** ítems vía
   `GearItemMark` (siguiente entidad).

#### Decisiones de diseño tomadas en GearItem

| Decisión | Resultado |
|---|---|
| Catálogo global vs per-event | **Per-event** (`event_id` NOT NULL). UX mitiga repetición vía sugerencias frontend. |
| `name` tipo | `string`, max ~80 chars (validación app). |
| `description` | `text` nullable, hint ~200 chars. |
| `required` | `boolean` NOT NULL default `true`. Sin enum de 3 valores. |
| `category` (clothing, food...) | **No** en MVP. |
| `quantity` separada | **No** — se incluye dentro de `name` (ej: "Agua 2L"). |
| `position` | `integer` NOT NULL default `0`. Orden controlado por el organizer. |

---

### GearItemMark

`GearItemMark` es el **segundo join con atributos** del proyecto
(después de `Inscription`). Conecta una `Inscription` (no un `User`
directo) con un `GearItem` para registrar que ese hiker marcó ese
ítem como "ya lo tengo".

Diseño minimalista: solo dos FKs + timestamps. La **existencia** del
record significa "marcado". Marcar = crear record. Desmarcar = borrar
record (no usamos un boolean `marked` para evitar queries con WHERE
extra en cada vista del checklist).

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `inscription_id` | `bigint` (FK a `inscriptions`) | NO | — | Asociación |
| 3 | `gear_item_id` | `bigint` (FK a `gear_items`) | NO | — | Asociación |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |

**Total: 2 columnas + 2 timestamps.** Es la entidad más chica del
proyecto.

#### Subgrupo 1 — Asociación

| Columna | Tipo | Decisión clave |
|---|---|---|
| `inscription_id` | `bigint` (FK a `inscriptions`, NOT NULL) | Conecta al hiker (vía su Inscription) con el ítem marcado. |
| `gear_item_id` | `bigint` (FK a `gear_items`, NOT NULL) | El ítem marcado. |

**Constraint clave**:
- `unique index` compuesto en (`inscription_id`, `gear_item_id`): un
  hiker no puede marcar el mismo ítem dos veces dentro de la misma
  inscripción. Refuerza la semántica "marcado / no marcado" sin
  ambigüedad.

```ruby
add_index :gear_item_marks, [:inscription_id, :gear_item_id], unique: true
```

#### Subgrupo 2 — Auditoría

| Columna | Tipo | Mantenido por |
|---|---|---|
| `created_at` | `datetime` (NOT NULL) | Rails (al crear). Funciona también como "marked_at". |
| `updated_at` | `datetime` (NOT NULL) | Rails (en cada save). |

#### Decisión clave: ¿FK a `Inscription` o a `User`?

Esta es la decisión central del diseño y vale la pena hacerla
explícita.

| Opción | FK | Implicancia |
|---|---|---|
| **A. `belongs_to :inscription` (elegida)** | `inscription_id` | Solo se puede marcar si existe inscripción. La regla "solo hikers inscritos pueden marcar gear del evento" queda enforced a nivel BD. Si el hiker cancela, sus marks dejan de ser visibles (porque la inscripción no está active) pero quedan en BD; si re-inscribe, reaparecen. |
| **B. `belongs_to :user`** | `user_id` | El usuario marca ítems directamente, sin obligación de inscripción. Más laxo. La regla de negocio queda solo a nivel app. |

**Decisión: A (vía Inscription)**. Modela la regla de negocio
fielmente. Sin Inscription no existe Mark — el FK lo enforce.

**Consecuencia útil**: el ciclo de vida del mark sigue al de la
inscripción. Si el hiker cancela y re-inscribe al mismo evento (mismo
Inscription record, status togglea), sus marks reaparecen
exactamente como los dejó.

#### Decisión clave: ¿toggle por delete o flag `marked: boolean`?

| Opción | Cómo se modela | Trade-off |
|---|---|---|
| **A. Delete on unmark (elegida)** | Marcar = `CREATE`. Desmarcar = `DELETE`. La existencia del record = marcado. | Queries simples ("ítems marcados" = `COUNT(*)`). Sin necesidad de `WHERE marked = true`. Sin historial de toggling. |
| **B. Flag `marked: boolean`** | Mark/unmark = `UPDATE` del flag. | Queda historial (`updated_at` cambia). Queries necesitan `WHERE marked = true`. Más estado que mantener. |

**Decisión: A**. Simplicidad gana en MVP. Si se necesita historial
("¿cuándo desmarcó el ítem?") en Fase 2, se agrega tabla
`gear_item_mark_history` separada sin tocar este modelo.

#### Caso de uso (resumen)

1. Hiker se inscribe a evento → ahora ve el checklist con checkboxes
   interactivos.
2. Hiker marca "Linterna frontal" → `INSERT INTO gear_item_marks`.
3. Hiker desmarca → `DELETE FROM gear_item_marks WHERE ...`.
4. Organizer ve el dashboard del evento → query con `COUNT` agrupado
   por `inscription_id` muestra qué % del equipo tiene cada hiker.
5. Hiker cancela inscripción → marks quedan en BD pero invisibles. Si
   re-inscribe, reaparecen.

#### Decisiones de diseño tomadas en GearItemMark

| Decisión | Resultado |
|---|---|
| Modelo Ruby vs join puro (`has_and_belongs_to_many`) | **Modelo Ruby** (con tabla). Por consistencia con `Inscription` y `UserBadge`; permite tener `created_at` (cuándo marcó). |
| FK target | **`Inscription`** (no `User`). Enforce a nivel BD la regla "solo inscritos pueden marcar". |
| Toggle approach | **Delete on unmark**. Sin flag `marked: boolean`. |
| Historial de toggling | **No** en MVP. Si se necesita, tabla separada en Fase 2. |
| `notes` (textarea del hiker por ítem) | **No** en MVP. |
| Unique constraint | `unique index` compuesto en (`inscription_id`, `gear_item_id`). |
| Counter cache (`Inscription.marks_count`) | Diferido a Paso 5 (optimización). |

---

### Badge

`Badge` es el **catálogo curado de insignias** del producto (~10-15
entradas iniciales vía seeds). Es entidad chica, en la misma familia
de catálogos curados que `Destino`.

Las insignias se le otorgan al hiker para reconocer hitos:
"Bienvenido a Chaski" (al completar onboarding), "Primera caminata"
(al completar el primer evento), "Conquistador del Chirripó" (al
asistir a un evento en Chirripó), etc.

**Scope MVP**: la galería de insignias y el catálogo seedeado son
parte del MVP. La **asignación automática** (Sidekiq evaluando reglas
tras cada evento completado) queda **diferida a Fase 2** — ver
[parking-lot.md](../ideas/parking-lot.md). En MVP las insignias se
otorgan **manualmente** (admin / Rails console) o vía **seeds** (para
demo y testing).

`Badge` y `UserBadge` (la entidad que sigue) funcionan en pareja:

- `Badge` define **qué insignias existen** (curado por el equipo).
- `UserBadge` registra **qué insignia ganó qué hiker, cuándo y en qué
  evento** (la siguiente entidad).

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `name` | `string` (unique) | NO | — | Identidad |
| 3 | `slug` | `string` (unique) | NO | — | Identidad |
| 4 | `description` | `text` | NO | — | Contenido |
| 5 | `icon` | `string` | NO | — | Contenido |
| 6 | `category` | `string` (enum) | NO | — | Categorización |
| 7 | `rule_key` | `string` (unique) | SÍ | — | Automatización (Fase 2) |
| 8 | `position` | `integer` | NO | `0` | Orden |
| 9 | `active` | `boolean` | NO | `true` | Operativo |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |

**Total: 9 columnas + 2 timestamps.**

#### Subgrupo 1 — Identidad

| Columna | Tipo | Decisión clave |
|---|---|---|
| `name` | `string` (NOT NULL, unique) | Nombre canónico ("Primera caminata", "Conquistador del Chirripó"). `unique index` a nivel BD. |
| `slug` | `string` (NOT NULL, unique) | Auto desde `name` con `parameterize`. Inmutable. URL pública: `/insignias/primera-caminata`. Mismo patrón que `Event` y `Destino`. |

#### Subgrupo 2 — Contenido

| Columna | Tipo | Decisión clave |
|---|---|---|
| `description` | `text` (NOT NULL) | Texto explicativo de qué representa la insignia y cómo se gana. Aparece en el detalle de la galería. |
| `icon` | `string` (NOT NULL) | Filename de un SVG curado en `app/assets/images/badges/`. Ver decisión detallada abajo. |

##### Decisión clave: storage de `icon`

Se evaluaron 3 opciones para guardar la representación visual:

| Opción | Cómo se modela | Por qué se descartó / eligió |
|---|---|---|
| **A. Emoji string** (ej: `icon: "🥾"`) | `string` con un carácter emoji | Inconsistencia visual entre plataformas (iPhone vs Android vs Windows). Estética casual ("WhatsApp") no transmite "logro ganado". Diferenciación pobre entre insignias del mismo nicho (🥾 vs 🚶 vs 👟). PostgreSQL soporta el storage técnicamente, pero el problema es de producto, no de BD. |
| **B. Asset filename string** (elegida) | `string` con filename de SVG curado en `app/assets/images/badges/` | Consistencia visual perfecta. Calidad editorial. Versionado en git. SVG vectorial (nítido a cualquier tamaño, 2-10 KB). Sin overhead de Active Storage. El "deploy para agregar insignia nueva" funciona como **gate editorial**: forza curaduría. |
| **C. Active Storage** (`has_one_attached :icon`) | Sin columna `icon` en `badges`. Blob + attachment en tablas internas | Overkill para ~15 íconos curados. 2 queries extra por badge. Pérdida de versionado en git. Un admin podría subir un PNG cualquiera y romper la consistencia visual. Active Storage está pensado para **contenido user-generated** (avatares, fotos de evento), no para iconografía del producto. |

**Decisión: B (asset filename string)**. Regla mental que aplica:

> **Active Storage = archivos del usuario** (avatar, cover_image).
> **Asset folder = archivos del producto** (logos, íconos curados).

Workflow para agregar insignia nueva:
1. Diseñar/seleccionar SVG (puede partir de un set open-source).
2. Guardarlo en `app/assets/images/badges/<filename>.svg`.
3. Agregar fila al seed: `Badge.create!(name: "...", icon: "filename.svg", ...)`.
4. Deploy.

Renderizado en UI (React via Inertia):

```jsx
<img src={`/assets/badges/${badge.icon}`} alt={badge.name} />
```

#### Subgrupo 3 — Categorización

| Columna | Tipo | Decisión clave |
|---|---|---|
| `category` | `string` (enum, NOT NULL) | 4 valores. Permite agrupar insignias en la galería del perfil. |

**Valores del enum `category`**:

| DB (clave) | Display (UI ES) | Ejemplos |
|---|---|---|
| `milestone` | Hitos | Primera caminata, 10 caminatas, 50 km, 100 km, 1000 m elevación |
| `destination` | Destinos | Conquistador del Chirripó, Conquistador del Arenal |
| `special` | Especiales | Madrugador, Trasnochador, Aventura multi-día |
| `onboarding` | Bienvenida | Bienvenido a Chaski, Perfil completo |

Storage `string` (no `integer`), consistente con el resto de enums
del modelo.

**Catálogo seedeable inicial sugerido** (~10 insignias):

| Categoría | Insignias iniciales |
|---|---|
| `onboarding` | Bienvenido a Chaski, Perfil completo |
| `milestone` | Primera caminata, 5 caminatas, 10 caminatas, 50 km acumulados, 100 km acumulados, 1000 m de elevación |
| `destination` | Conquistador del Chirripó, Conquistador del Arenal |
| `special` | Madrugador |

#### Subgrupo 4 — Automatización (Fase 2)

| Columna | Tipo | Decisión clave |
|---|---|---|
| `rule_key` | `string` (unique, nullable) | Identificador de la regla que asigna automáticamente la insignia. En MVP siempre `NULL` (asignaciones manuales/seeds). En Fase 2: `first_hike_completed`, `ten_hikes_completed`, `chirripo_conqueror`, etc. |

**Por qué incluirlo ya en MVP**: agregar una columna `string` nullable
cuesta cero hoy. Cuando llegue Fase 2 y se implementen los background
jobs de asignación automática, no hay que correr migración: solo
poblar `rule_key` en cada `Badge`. Patrón **forward-compatible**.

**Unique nullable**: cada regla puede tener una sola insignia
asociada. Múltiples filas con `rule_key = NULL` están permitidas (es
el caso de todas las insignias en MVP).

#### Subgrupo 5 — Orden

| Columna | Tipo | Decisión clave |
|---|---|---|
| `position` | `integer` (NOT NULL, default `0`) | Define el orden visual en la galería del perfil. Mismo patrón que `GearItem.position`. |

#### Subgrupo 6 — Operativo

| Columna | Tipo | Decisión clave |
|---|---|---|
| `active` | `boolean` (NOT NULL, default `true`) | Soft-disable. Mismo patrón que `Destino.active`: si retiramos una insignia, no rompemos `UserBadge` históricos que la referencian. |

```ruby
class Badge < ApplicationRecord
  scope :active, -> { where(active: true) }
  has_many :user_badges
end
```

Las queries del catálogo público filtran por `Badge.active`. Las
insignias ya ganadas siguen visibles en el perfil del hiker aunque
la insignia se vuelva `inactive`.

#### Subgrupo 7 — Auditoría

| Columna | Tipo | Mantenido por |
|---|---|---|
| `created_at` | `datetime` (NOT NULL) | Rails (al crear) |
| `updated_at` | `datetime` (NOT NULL) | Rails (en cada save) |

#### Decisiones de diseño tomadas en Badge

| Decisión | Resultado |
|---|---|
| `name`, `slug` unique | Sí (`unique index` BD ambos). |
| `slug` patrón | Auto desde `name` con `parameterize`, inmutable. Mismo que `Event` y `Destino`. |
| `description` | `text` NOT NULL. |
| `icon` storage | **Opción B**: `string` con filename de SVG curado en `app/assets/images/badges/`. Sin Active Storage, sin emojis. |
| `category` enum | 4 valores: `milestone`, `destination`, `special`, `onboarding`. |
| `rule_key` | `string` unique nullable. MVP siempre `NULL`. Puente forward-compatible a Fase 2 (automation). |
| `position` | `integer` NOT NULL default `0`. |
| `active` | `boolean` NOT NULL default `true`. Soft-disable. |
| `points` / `rarity_tier` | **Diferidos**. No agregan valor en MVP. |
| Asignación automática | **Diferida a Fase 2** (parking lot). MVP = manual / seeds. |

---

### UserBadge

`UserBadge` es el **tercer "join con atributos"** del proyecto (tras
`Inscription` y `GearItemMark`). Conecta un `User` con un `Badge` y
registra **cuándo** ganó la insignia y opcionalmente **en qué evento**.

A diferencia de `Inscription` (que es siempre creada por el hiker) y
`GearItemMark` (que es siempre toggleable por el hiker), un
`UserBadge` se crea cuando **el sistema o un admin** otorga la
insignia (no por acción directa del hiker). En MVP el otorgamiento es
manual; en Fase 2 será via background jobs evaluando reglas.

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `user_id` | `bigint` (FK a `users`) | NO | — | Asociación |
| 3 | `badge_id` | `bigint` (FK a `badges`) | NO | — | Asociación |
| 4 | `event_id` | `bigint` (FK a `events`) | SÍ | — | Contexto |
| 5 | `earned_at` | `datetime` | NO | — | Estado |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |

**Total: 4 columnas + 2 timestamps.**

#### Subgrupo 1 — Asociación

| Columna | Tipo | Decisión clave |
|---|---|---|
| `user_id` | `bigint` (FK a `users`, NOT NULL) | El hiker que ganó la insignia. |
| `badge_id` | `bigint` (FK a `badges`, NOT NULL) | La insignia ganada. |

**Constraint clave**:
- `unique index` compuesto en (`user_id`, `badge_id`): un hiker gana
  cada insignia **una sola vez**. Aunque vaya al Chirripó 3 veces,
  solo gana "Conquistador del Chirripó" una vez.

```ruby
add_index :user_badges, [:user_id, :badge_id], unique: true
```

**Sobre insignias repetibles**: en Fase 2 podría tener sentido que
algunas insignias sean repetibles (ej: "Madrugador" cada vez que se
asiste a un evento antes de las 5am). Si se da el caso, se quita el
unique constraint y se agrega un counter. Para MVP, **single-earn**
es la regla universal.

#### Subgrupo 2 — Contexto

| Columna | Tipo | Decisión clave |
|---|---|---|
| `event_id` | `bigint` (FK a `events`, nullable) | Evento que **disparó** el otorgamiento de la insignia. Nullable porque no todas las insignias se ganan en un evento. |

**Cuándo se popula `event_id`**:

| Insignia (ejemplo) | `event_id` |
|---|---|
| Bienvenido a Chaski (al completar onboarding) | `NULL` |
| Perfil completo | `NULL` |
| Primera caminata (al completar el primer evento) | ID del evento que se completó |
| Conquistador del Chirripó (al asistir a un evento en Chirripó) | ID del evento del Chirripó |
| 100 km acumulados (al cruzar el umbral) | ID del evento que cruzó el umbral |

**Beneficio**: permite a la UI mostrar contexto en el perfil del
hiker — *"Ganaste esta insignia en el evento [Chirripó — Ruta clásica
del 14 de junio 2026]"* con link al evento.

**FK `event_id` `on_delete`**: **`nullify`**. Si un evento se borra
(raro), la insignia ganada se preserva; solo se pierde el link al
evento que la disparó. La insignia en sí es histórica.

#### Subgrupo 3 — Estado

| Columna | Tipo | Decisión clave |
|---|---|---|
| `earned_at` | `datetime` (NOT NULL) | Cuándo el hiker ganó la insignia semánticamente. Separado de `created_at` por razones explicadas abajo. |

**Por qué `earned_at` separado de `created_at`**:

Mismo razonamiento que `cancelled_at` en `Inscription`:
- `created_at` es **cuándo se insertó el row en la BD** (técnico).
- `earned_at` es **cuándo el hiker ganó la insignia** (negocio).

Casos donde difieren:
1. **Seeds históricos**: cargamos `Badge.create!(earned_at: 1.year.ago, …)` para demo y `created_at` queda como `now`.
2. **Backfill admin**: admin asigna manualmente con `earned_at` de la fecha real del evento que la motivó (puede ser pasado).
3. **Background jobs delayed (Fase 2)**: si el job evalúa "completaste 10 caminatas" 5 minutos después del evento, `earned_at` debe ser el `starts_at` del evento, no el momento del job.

#### Subgrupo 4 — Auditoría

| Columna | Tipo | Mantenido por |
|---|---|---|
| `created_at` | `datetime` (NOT NULL) | Rails (al crear) |
| `updated_at` | `datetime` (NOT NULL) | Rails (en cada save) |

#### Caso de uso (resumen)

1. María completa el onboarding wizard → sistema (o admin) crea:
   ```
   UserBadge { user_id: 15, badge_id: 1 (Bienvenido), event_id: NULL, earned_at: now }
   ```
2. María asiste al Chirripó (evento 42) → admin (en MVP) o
   background job (Fase 2) crea:
   ```
   UserBadge { user_id: 15, badge_id: 7 (Primera caminata), event_id: 42, earned_at: 2026-06-14 18:00 }
   UserBadge { user_id: 15, badge_id: 9 (Conquistador del Chirripó), event_id: 42, earned_at: 2026-06-14 18:00 }
   ```
3. María ve su perfil → query:
   ```sql
   SELECT badges.*, user_badges.earned_at, user_badges.event_id
   FROM user_badges
   JOIN badges ON badges.id = user_badges.badge_id
   WHERE user_badges.user_id = 15
   ORDER BY badges.category, badges.position;
   ```
4. UI agrupa por `category` y muestra las insignias con el ícono,
   nombre, descripción y (si `event_id` no es null) link al evento.

#### Decisiones de diseño tomadas en UserBadge

| Decisión | Resultado |
|---|---|
| `event_id` (triggering event) | **Nullable**. Da contexto cuando aplica; sin valor cuando no. |
| `earned_at` separado de `created_at` | **Sí**. Mismo patrón que `cancelled_at` en `Inscription`. Permite backfills, seeds y jobs delayed con timestamp correcto. |
| Insignias repetibles | **No** en MVP. `unique index` en (`user_id`, `badge_id`). |
| `notes` (texto admin al asignar manualmente) | **No** en MVP. |
| FK `event_id` `on_delete` | **`nullify`**. La insignia se preserva, se pierde el link al evento. |
| Counter cache (`User.badges_count`) | Diferido a Paso 5 (optimización). |

---

### Motivation

`Motivation` es el **catálogo de motivaciones para caminar** que el
hiker selecciona en el Onboarding Wizard. Catálogo fijo de 6 filas,
curado por el equipo y cargado vía seeds.

Conexión a `User`: many-to-many vía join table sin modelo
(`motivations_users`). Un user puede tener 0, 1 o N motivaciones
(multi-select en el wizard).

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `name` | `string` (unique) | NO | — | Identidad |
| 3 | `slug` | `string` (unique) | NO | — | Identidad |
| 4 | `icon` | `string` | NO | — | Contenido |
| 5 | `position` | `integer` | NO | `0` | Orden |
| 6 | `active` | `boolean` | NO | `true` | Operativo |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |

**Total: 5 columnas + 2 timestamps.**

#### Subgrupos

| Subgrupo | Columnas | Decisión clave |
|---|---|---|
| **Identidad** | `name`, `slug` | Mismo patrón que `Badge`, `Destino` y `Event`: `name` unique para display, `slug` auto desde name vía `parameterize`, inmutable, unique. |
| **Contenido** | `icon` | `string` con filename de SVG en `app/assets/images/motivations/`. Mismo razonamiento que `Badge.icon`: no Active Storage (overkill), no emoji (inconsistente). |
| **Orden** | `position` | `integer` NOT NULL default `0`. Define el orden de las cards en el onboarding wizard. |
| **Operativo** | `active` | `boolean` NOT NULL default `true`. Soft-disable preserva las selecciones históricas de los users. |

#### Seed inicial (6 filas)

Las 6 motivaciones del onboarding wizard. Mismo orden que aparecen en
la UI:

| `position` | `name` | `slug` | `icon` |
|---|---|---|---|
| 0 | Naturaleza | `naturaleza` | `nature.svg` |
| 1 | Fitness | `fitness` | `fitness.svg` |
| 2 | Social | `social` | `social.svg` |
| 3 | Fotografía | `fotografia` | `photography.svg` |
| 4 | Espiritual | `espiritual` | `spiritual.svg` |
| 5 | Aventura | `aventura` | `adventure.svg` |

Los íconos son curados (un SVG distintivo por motivación) y viven
versionados en el repo.

#### Decisiones de diseño tomadas en Motivation

| Decisión | Resultado |
|---|---|
| Columnas mínimas para un catálogo | `name`, `slug`, `icon`, `position`, `active` (5 cols). |
| `description` | **No** en MVP. El nombre + ícono alcanzan en cards de onboarding. |
| `icon` storage | `string` con filename de asset (mismo patrón que `Badge`). |
| Seed inicial | 6 motivaciones fijas (las que aparecen en el wizard de Visily). |
| Catálogo extensible | Sí en Fase 2 si surge necesidad. MVP cierra con las 6. |

---

### Region

`Region` es el **catálogo de zonas geográfico-hikers de Costa Rica**.
Catálogo curado (~8-10 filas iniciales) que el hiker selecciona en el
Onboarding Wizard como "zonas favoritas".

**Importante**: las regiones **no son provincias** (que ya están en
`Destino.province` como enum). Son **agrupaciones que tienen sentido
para hikers** y pueden cruzar provincias. Ejemplo: "Cordillera
Central" abarca partes de Heredia, Alajuela, San José y Cartago.

Conexión a `User`: many-to-many vía join table sin modelo
(`regions_users`). Un user puede tener 0, 1 o N regiones favoritas.

#### Tabla completa

| # | Columna | Tipo | Nullable | Default | Origen |
|---|---|---|---|---|---|
| 1 | `id` | `bigint` | NO | auto | Rails (primary key) |
| 2 | `name` | `string` (unique) | NO | — | Identidad |
| 3 | `slug` | `string` (unique) | NO | — | Identidad |
| 4 | `position` | `integer` | NO | `0` | Orden |
| 5 | `active` | `boolean` | NO | `true` | Operativo |
| — | `created_at` | `datetime` | NO | auto | Rails (timestamps) |
| — | `updated_at` | `datetime` | NO | auto | Rails (timestamps) |

**Total: 4 columnas + 2 timestamps.** Es la **entidad más simple del
modelo**.

#### Diferencia con Motivation

Una sola: **sin `icon`**. En el onboarding las regiones se muestran
como **chips de texto seleccionables** (multi-select estilo tags), no
como cards con ícono. Si en Fase 2 las regiones ganan visual
(ej: pequeño mapa por región), se agrega columna.

Resto de subgrupos y razonamientos: idénticos a `Motivation`.

#### Seed inicial (~9 filas)

Las regiones se eligieron por **relevancia para hiking** (no por
simetría administrativa con las provincias):

| `position` | `name` | `slug` |
|---|---|---|
| 0 | Cordillera de Talamanca | `cordillera-talamanca` |
| 1 | Cordillera Central | `cordillera-central` |
| 2 | Cordillera de Tilarán | `cordillera-tilaran` |
| 3 | Cordillera de Guanacaste | `cordillera-guanacaste` |
| 4 | Valle Central | `valle-central` |
| 5 | Pacífico Sur | `pacifico-sur` |
| 6 | Pacífico Central | `pacifico-central` |
| 7 | Caribe | `caribe` |
| 8 | Península de Nicoya | `peninsula-nicoya` |

#### Decisiones de diseño tomadas en Region

| Decisión | Resultado |
|---|---|
| Columnas mínimas | `name`, `slug`, `position`, `active` (4 cols). |
| `description` | **No** en MVP. |
| `icon` | **No** — chips de texto en onboarding, sin necesidad visual. |
| Hierarchy (regiones que contienen sub-regiones) | **No** en MVP. Flat list. |
| Relación con `Destino` (FK `destinos.region_id`) | **No** en MVP — decidido en `Destino` (Region solo conecta a User). |
| Seed inicial | 9 regiones de hiking, no provincias administrativas. |

---

### Join tables sin modelo Ruby

Dos tablas planas que conectan `User` con sus catálogos many-to-many.
No tienen modelo Ruby porque la conexión no tiene atributos propios
("X tiene Y" y nada más).

| Tabla | Columnas | Constraint |
|---|---|---|
| `motivations_users` | `motivation_id`, `user_id` | `unique index` en (`motivation_id`, `user_id`) |
| `regions_users` | `region_id`, `user_id` | `unique index` en (`region_id`, `user_id`) |

**Naming**: convención Rails HABTM = ambos nombres de tabla en orden
alfabético, plurales (`motivations_users`, no `user_motivations`).
Esto permite que `has_and_belongs_to_many :motivations` en `User`
resuelva la tabla automáticamente sin `join_table:` explícito.

Migraciones (estilo idiomático Rails):

```ruby
create_join_table :motivations, :users do |t|
  t.index [:motivation_id, :user_id], unique: true
end

create_join_table :regions, :users do |t|
  t.index [:region_id, :user_id], unique: true
end
```

Modelos:

```ruby
class User < ApplicationRecord
  has_and_belongs_to_many :motivations
  has_and_belongs_to_many :regions
end

class Motivation < ApplicationRecord
  has_and_belongs_to_many :users
end

class Region < ApplicationRecord
  has_and_belongs_to_many :users
end
```

**Sin timestamps**: por convención `create_join_table` no genera
`created_at` / `updated_at`. Si en Fase 2 se necesita saber "cuándo
seleccionó esta motivación", se migra a `has_many :through` con un
modelo propio.

**Sin `id` primary key**: `create_join_table` tampoco crea columna
`id`. El primary key implícito es el par compuesto. Esto está bien
para HABTM puro; si se migra a `has_many :through`, se agrega `id`.

---

## Cierre del Paso 2

Con `Motivation`, `Region` y las 2 join tables, el Paso 2 está
completo:

| # | Entidad / Tabla | Columnas (sin timestamps) | Tipo |
|---|---|---|---|
| 1 | `User` | 14 | Modelo Ruby |
| 2 | `Event` | 21 | Modelo Ruby |
| 3 | `Destino` | 8 | Modelo Ruby |
| 4 | `Inscription` | 6 | Modelo Ruby (join con atributos) |
| 5 | `GearItem` | 5 | Modelo Ruby |
| 6 | `GearItemMark` | 2 | Modelo Ruby (join con atributos) |
| 7 | `Badge` | 9 | Modelo Ruby |
| 8 | `UserBadge` | 4 | Modelo Ruby (join con atributos) |
| 9 | `Motivation` | 5 | Modelo Ruby |
| 10 | `Region` | 4 | Modelo Ruby |
| 11 | `motivations_users` | 2 (FKs) | Join puro (HABTM) |
| 12 | `regions_users` | 2 (FKs) | Join puro (HABTM) |

**Total: 12 tablas, 80 columnas modeladas** (sin contar `id`,
`created_at`, `updated_at` que son técnicas/automáticas).

---

## Paso 3: Relaciones entre entidades

Por extensión y para mantener este archivo enfocado en atributos y
decisiones de scope, el **Paso 3 vive en su propio archivo**:
[`relationships.md`](./relationships.md).

Lo que contiene:

- Diagramas ER (estructurados en 4 dominios + vista global).
- Matriz de relaciones formales (`has_many`, `belongs_to`,
  `has_many :through`, `has_and_belongs_to_many`).
- Decisiones de `dependent:` por foreign key.
- Decisiones de `inverse_of:` donde aplica.
- Ejemplos de queries típicas habilitadas por cada relación.

---

## Pendiente para próximos pasos

- **Paso 3** — en curso en [`relationships.md`](./relationships.md).
  Dominio User completado; faltan Event, Engagement, Achievement y
  la vista global.
- **Paso 4 — Restricciones** (vuelve a este archivo o vive aparte —
  se decide en su momento): validaciones a nivel app (presence,
  length, format, uniqueness, custom) y constraints a nivel BD (NOT
  NULL, unique, foreign keys, eventual CHECK constraints).
- **Paso 5 — Optimización**: índices para queries frecuentes, decisión
  final de enums (string vs integer storage), counter caches
  pendientes (`Event.inscriptions_count`, `User.badges_count`,
  `Destino.events_count`, `Inscription.marks_count`).
- **Paso 3**: declarar relaciones entre entidades (`has_many`,
  `belongs_to`, `has_many :through`, `has_and_belongs_to_many`).
- **Paso 4**: agregar restricciones (validaciones a nivel app y
  constraints a nivel BD).
- **Paso 5**: definir índices para queries frecuentes y enums para
  estados/categorías.
