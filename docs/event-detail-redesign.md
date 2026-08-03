# Guía: rediseño de Event Detail (Visily)

Paso a paso para implementar la página de detalle de evento según el mockup
de Visily. Fuente de verdad de producto: [`product/screens.md`](./product/screens.md)
§3 Event Detail Page.

---

## 1. Objetivo y referencia

Reconstruir `/events/:id` (Inertia page `events/show`) para que coincida con
el layout Visily:

1. Hero full-bleed (badge de dificultad, título, fecha, ubicación)
2. Fila de 4 stats (cupo, distancia, elevación, duración)
3. Columna principal: “Sobre esta caminata” + equipo
4. Sidebar: card de inscripción (precio + CTA + organizador) + tips

**Fuera de alcance:** listado de eventos, migraciones nuevas, rutas por slug,
compartir/guardar.

---

## 2. Mapeo mockup → datos existentes

No se agregan columnas. Se reutiliza el modelo `Event` y `GearItem`.

| Bloque mockup | Fuente |
|---|---|
| Badge dificultad | `event.difficulty` + `difficultyFormLabel` (pill verde sólido en hero) |
| Título / fecha / ubicación | `title`, `starts_at`, `custom_location` |
| Imagen hero | `cover_image_hero_url` + overlay gradient |
| CUPO / DISTANCIA / ELEVACIÓN / DURACIÓN | `max_participants`, `distance_km`, `elevation_gain_m`, `duration_hours` |
| Pull-quote | `description_short` (itálica + barra lateral) |
| Cuerpo | `description_long` |
| Equipo | `gear_items` (checklist 2 columnas; marcar solo si inscrito) |
| Precio + CTA | `price_crc` + flujos de inscripción existentes |
| Organizador | Nested `organizer` (`id`, `name`, `avatar_url`) desde el controller |
| Tips | Copy estático (puntualidad / llegar 15 min antes) |
| Chip “Llevar ropa adecuada” | Chip estático junto al heading de equipo |

No hay ruta pública `/profile/:id`. El bloque del organizador muestra
nombre/avatar **sin** link “Ver perfil” (evita rutas rotas).

---

## 3. Cambios en el controller

Archivo: [`app/controllers/events_controller.rb`](../app/controllers/events_controller.rb)

1. En `set_event`, eager-load organizer + avatar:

   ```ruby
   Event.with_attached_cover_image
     .includes(organizer: { avatar_attachment: :blob })
     .find(params[:id])
   ```

2. En `show`, serializar organizer como en `serialized_events`:

   ```ruby
   event_json = @event.as_json(include: { organizer: { only: [:id, :name] } })
   event_json["organizer"] = (event_json["organizer"] || {}).merge(
     "avatar_url" => @event.organizer&.avatar_url
   )
   event_json.merge!(cover_image_urls(@event)).merge!(
     "gear_items" => @event.gear_items.ordered.as_json(
       only: [:id, :name, :description, :required, :position]
     )
   )
   ```

3. Conservar props: `can_manage`, `inscription`, `marked_gear_item_ids`.

---

## 4. Tipos TypeScript

Archivo: [`app/javascript/types/index.ts`](../app/javascript/types/index.ts)

Agregar a `Event`:

```ts
organizer?: EventOrganizer
```

`EventOrganizer` ya existe (`id`, `name`, `avatar_url?`).

---

## 5. Componentes

Orquestación en [`pages/events/show.tsx`](../app/javascript/pages/events/show.tsx).
Piezas en `app/javascript/components/events/`:

| Archivo | Rol |
|---|---|
| `EventHero.tsx` | Cover full-bleed, gradient, badge, título, fecha, ubicación |
| `EventStatsRow.tsx` | 4 cards de métricas |
| `EventAboutSection.tsx` | Quote + descripción larga |
| `EventGearSection.tsx` | Checklist 2 columnas + mark/unmark |
| `EventBookingCard.tsx` | Precio, CTA inscripción, organizador, acciones manage |
| `EventTipsCard.tsx` | Card beige con tip de puntualidad |

Helpers reutilizados:

- [`lib/eventLabels.ts`](../app/javascript/lib/eventLabels.ts) — `formatPrice`, `statusLabels`
- [`lib/difficulty.ts`](../app/javascript/lib/difficulty.ts) — `difficultyFormLabel`
- [`lib/dates.ts`](../app/javascript/lib/dates.ts) — `formatEventDateHero`

### Orden de implementación recomendado

1. Documentar (este archivo) y mapear campos.
2. Extender `EventsController#show` + tipo `Event.organizer`.
3. Crear los 6 componentes de presentación.
4. Reescribir `show.tsx` con hero → stats → grid 2 columnas.
5. Verificar estados (visitante / inscrito / organizer) y responsive.


---

## 6. Layout y tokens CSS

Tokens en [`entrypoints/application.css`](../app/javascript/entrypoints/application.css):

- `chaski-bg`, `chaski-green`, `chaski-green-dark`, `chaski-heading`

Estructura de página:

1. Hero a ancho completo (fuera de `max-w-*`)
2. Contenido en `max-w-6xl`
3. Stats row
4. Grid `lg:grid-cols-[1fr_320px]` — main + sidebar sticky
5. `ConfirmDialog` de éxito/cancelación sin cambios de comportamiento

Radius ~8–12px (`rounded-lg` / `rounded-xl`). CTA oliva (`bg-chaski-green`).

---

## 7. Comportamiento a preservar

- Visitante: CTA → `/users/sign_in`
- Autenticado no inscrito: POST inscripción
- Inscrito: cancelar + checklist marcable
- Organizer (`can_manage`): Editar / Eliminar + badge de status si no published
- Flash de inscripción exitosa → `ConfirmDialog` success
- Gear mark/unmark vía Inertia Link method post/delete

---

## 8. Checklist responsive

- [ ] Hero legible en mobile (título no se corta mal; meta apilada)
- [ ] Stats: 2×2 en tablet, 1 col en mobile estrecho, 4 cols en desktop
- [ ] Sidebar debajo del main en `< lg`
- [ ] Booking card usable en touch (botón full-width)

---

## 9. QA manual

| Caso | Esperado |
|---|---|
| Visitante | Ve todo; CTA pide iniciar sesión |
| Hiker no inscrito | “Inscribirme ahora” funciona |
| Hiker inscrito | Cancelar + checks de equipo |
| Organizer | Editar/Eliminar visibles; status badge si aplica |
| Sin cover | Placeholder gradient en hero |
| Sin gear_items | Sección equipo oculta |
| Precio 0 | Muestra “Gratis” |
| Organizer sin avatar | Iniciales en círculo |
