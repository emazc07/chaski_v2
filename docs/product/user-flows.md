# Flujos de usuario

Este documento describe los flujos críticos del MVP. Cada flujo
representa una secuencia de pantallas y acciones que un usuario realiza
para cumplir un objetivo.

> Si un flujo cambia (porque cambia el diseño o el modelo de datos),
> este documento se actualiza.

---

## Flujo 1: Descubrimiento orgánico (visitante)

**Objetivo del usuario**: encontrar caminatas que le interesen.

**Objetivo de Chaski**: convertir al visitante en cuenta registrada.

```
[Búsqueda en Google: "caminatas en Costa Rica"]
        ↓
[Landing Page] ──── click "Explorar caminatas" ────→ [All Events]
        ↓                                                   ↓
        │                                              [filtros]
        ↓                                                   ↓
        └──────────── click en card ─────────────→ [Event Detail]
                                                            ↓
                                                  ¿Quiere inscribirse?
                                                            ↓
                                                    [Modal Sign Up]
                                                            ↓
                                              [Onboarding Wizard - skippable]
                                                            ↓
                                                  [Inscripción confirmada]
                                                            ↓
                                                       [Dashboard]
```

**Notas**:
- Todo el browsing previo al modal es público y SEO-friendly.
- Tras el sign up, el sistema **recuerda** que el usuario quería
  inscribirse al evento X y completa esa acción automáticamente.

---

## Flujo 2: Inscripción a evento (hiker autenticado)

**Objetivo del usuario**: inscribirse a una caminata.

```
[Dashboard] o [All Events] o [link compartido]
        ↓
[Event Detail]
        ↓
   click "Inscribirme"
        ↓
[Confirmación: "¿Querés inscribirte a {evento}?"]
        ↓
   click "Sí, inscribirme"
        ↓
[Inscripción confirmada: badge en card + checklist desbloqueado]
        ↓
   (opcional) marca ítems del checklist
        ↓
[Evento aparece en "Mis Caminatas > Próximas"]
```

**Edge cases**:
- Evento lleno → botón deshabilitado, mensaje claro.
- Ya inscrito → botón "Cancelar inscripción".
- Evento pasado o cancelado → inscripción bloqueada.

---

## Flujo 3: Crear primer evento (hiker se vuelve organizer)

**Objetivo del usuario**: enviar su primera caminata a revisión.

```
[Dashboard]
        ↓
   click "Crear evento" (visible en el nav o como CTA)
        ↓
[Create Event - Paso 1: Info básica]
        ↓ (auto-save en cliente)
[Paso 2: Detalles de ruta]
        ↓
[Paso 3: Logística + checklist]
        ↓
[Paso 4: Revisión y enviar]
        ↓
   click "Enviar a revisión"
        ↓
[Confirmación: "Tu evento fue enviado al equipo de Chaski.
 Te avisaremos en tu dashboard cuando esté aprobado."]
        ↓
   (el usuario ahora es Organizer)
        ↓
   en el nav aparece toggle "Caminante / Organizador"
        ↓
[Organizer Dashboard]
   - Tab "Pendientes" muestra el evento recién enviado
   - Badge "Pendiente de revisión"
```

**Notas**:
- El usuario **no necesita activar nada** para volverse organizer.
  Enviar el primer evento lo activa automáticamente, **sin esperar a la
  aprobación**.
- El evento **no aparece** en `/eventos` ni es indexable hasta ser
  aprobado por el admin (ver Flujo 9 y Flujo 10).
- En MVP no hay plan / pago. Cualquier hiker puede crear eventos.

---

## Flujo 4: Compartir un evento

**Objetivo del usuario**: invitar a otros caminantes a un evento.

```
[Event Detail]
        ↓
   click botón "Compartir"
        ↓
[Menú de compartir]
   - Copiar link
   - WhatsApp
   - Telegram
   - X
   - Instagram (DM)
        ↓
   click en opción
        ↓
   - Copiar: muestra "Link copiado"
   - Otros: abre app/web nativo con texto pre-llenado
```

**URL compartida**: `chaski.app/eventos/{slug}` — funciona también para
no autenticados.

**Texto pre-llenado** (WhatsApp ejemplo): *"Mirá esta caminata en Chaski:
{título} — {fecha} — {link}"*

---

## Flujo 5: Onboarding (post primer registro)

**Objetivo del usuario**: empezar a usar Chaski.

**Objetivo de Chaski**: capturar señales mínimas para personalizar.

```
[Sign Up completo]
        ↓
[Onboarding Wizard]
   - Paso 1: experiencia (3 opciones)
   - Paso 2: frecuencia (4 opciones)
   - Paso 3: motivaciones (multi-select)
   - Paso 4: zonas favoritas (multi-select)
   - Paso 5: ¡Listo! + 3 recomendaciones + 1ª insignia
        ↓
   o en cualquier paso: click "Saltar por ahora"
        ↓
[Dashboard]
   - Si saltó: banner "Completá tu perfil al X%"
   - Si completó: feed personalizado
```

**Notas**:
- El wizard nunca **bloquea** el acceso a Chaski. Siempre hay escape.
- Cada paso se puede revisitar después en `/perfil`.

---

## Flujo 6: Gestión de evento (organizer)

**Objetivo del organizer**: ver inscritos y administrar su evento.

```
[Organizer Dashboard]
        ↓
   click en evento
        ↓
[Manage Event Page]
   - Datos del evento
   - Lista de inscritos
   - Stats
        ↓
   Posibles acciones:
   - "Editar evento" → wizard de edición
   - "Cancelar evento" → confirmación, cambia estado
   - "Marcar como completado" (post-fecha)
   - Ver perfil de inscrito
```

**Edge case**: si el organizer cancela el evento, en MVP los inscritos
no reciben email automático (eso es Fase 2). Pero el evento aparece en
"Mis Caminatas > Canceladas" del inscrito con badge "Cancelado".

---

## Flujo 7: Cancelar inscripción (hiker)

**Objetivo del usuario**: dejar de ir a una caminata.

```
[Mis Caminatas > Próximas]
        ↓
   click en evento
        ↓
[Event Detail con estado "Inscrito"]
        ↓
   click "Cancelar inscripción"
        ↓
[Modal de confirmación]
   - Razón opcional (textarea)
   - Botón "Confirmar cancelación"
        ↓
[Evento pasa a "Mis Caminatas > Canceladas"]
[Cupo del evento se libera]
```

---

## Flujo 8: Recuperación de contraseña

```
[Modal Sign In]
        ↓
   click "Olvidé mi contraseña"
        ↓
[Modal de recovery]
   - Input: email
   - Botón "Enviar link"
        ↓
[Mensaje: "Te enviamos un email"]
        ↓
   (el usuario recibe email — esto requiere SMTP configurado)
        ↓
   click en link del email
        ↓
[Página: nuevo password]
   - Password
   - Confirmación
        ↓
[Sign in automático]
        ↓
[Dashboard]
```

**Nota técnica**: en desarrollo se puede usar `letter_opener` para
visualizar emails sin configurar SMTP real. En staging/prod se configura
un servicio (Postmark, SendGrid, etc.).

---

## Flujo 9: Verificación de evento (perspectiva del organizer)

**Objetivo del organizer**: pasar de "evento enviado" a "evento publicado",
o entender por qué fue rechazado y reenviar.

```
[Organizer Dashboard > Tab "Pendientes"]
        ↓
   (espera la revisión del admin — ver Flujo 10)
        ↓
   ┌──────────────────┬──────────────────┐
   ▼                  ▼                  ▼
[APROBADO]      [RECHAZADO]         (sigue pendiente)
   │                  │
   │                  ▼
   │           [Tab "Rechazados"]
   │                  │
   │           Click en evento
   │                  ↓
   │           [Event Detail con header
   │            "Rechazado: <razón>"
   │            + CTA "Editar y reenviar"]
   │                  ↓
   │           [Edit Event wizard]
   │                  ↓
   │           Click "Reenviar a revisión"
   │                  ↓
   │           Status pasa automáticamente
   │           a `pending_review`
   │                  ↓
   │           [Tab "Pendientes" otra vez]
   │
   ▼
[Tab "Publicados"]
   - Badge "Publicado" verde
   - Evento ahora visible en /eventos
   - URL pública compartible
```

**Notas**:
- En MVP **no hay notificación por email**. El organizer debe entrar
  al dashboard para enterarse del estado.
- La razón de rechazo es **free text** escrita por el admin.
- Editar un evento rechazado **automáticamente** lo manda a
  `pending_review` al guardar. No hay botón explícito "reenviar".
- Si el evento se queda en `pending_review` y la fecha se acerca, el
  organizer debe contactar al admin por canal externo (en MVP no hay
  escalamiento automático).

---

## Flujo 10: Cola de moderación (perspectiva del admin)

**Objetivo del admin**: revisar los eventos enviados y decidir publicar
o rechazar.

```
[Login como admin]
        ↓
   navegar a /admin/events
        ↓
[Admin Events List]
   - Default: filtro = "pending_review"
   - Orden: fecha del evento ascendente
        ↓
   Click "Revisar →" en un evento
        ↓
[Admin Event Review]
   - Vista completa del evento (igual a Event Detail Page)
   - Sidebar admin con metadata y acciones
        ↓
   ┌──────────────────┬──────────────────┐
   ▼                  ▼                  ▼
[Aprobar]        [Rechazar]          [Cerrar sin acción]
   │                  │                   │
   │                  ▼                   ▼
   │           [Modal con textarea     volver a la lista
   │            para rejection_reason]
   │                  ↓
   │           Submit (mínimo 10 chars)
   │                  ↓
   │           Status → `rejected`
   │           reviewed_at = now
   │           reviewed_by_id = admin.id
   │                  ↓
   │           Redirect a /admin/events
   │
   ▼
Status → `published`
reviewed_at = now
reviewed_by_id = admin.id
   ↓
Redirect a /admin/events
con flash "Evento aprobado"
```

**Notas**:
- El admin puede **cambiar su decisión** después: re-aprobar un evento
  rechazado o re-rechazar un evento aprobado por error.
- El admin también puede acceder a `/admin/events/:id` directamente
  para revisar eventos en cualquier estado (no solo `pending_review`).
- En MVP no hay logs de auditoría detallados más allá de `reviewed_at`
  y `reviewed_by_id`. Si una decisión se revierte, se sobrescriben.
