# Parking Lot — Ideas fuera del MVP

Este archivo guarda ideas, funcionalidades y exploraciones que **no
entran al MVP** pero que no queremos perder. Algunas serán Fase 2,
otras quizás nunca lleguen al producto. La idea es que **el chat con
el agente no sea el único lugar donde existen**.

> **Regla**: cualquier idea que surja durante el desarrollo y no caiga
> dentro del scope del MVP se anota acá. No se evalúa de inmediato. Se
> revisita cuando se planifica la Fase 2 o sprints futuros.

---

## Fase 2 (post-MVP, semanas 11-15 del curso o después)

### Organizations (multi-usuario)

- Una `Organization` es un grupo de usuarios con un plan compartido.
- Roles internos: Owner, Admin, Organizer, Member.
- Invitaciones por email/username con tokens y acceptance flow.
- Eventos creados bajo una organización en lugar de un usuario.
- UI para gestionar miembros, invitaciones y roles.
- **Migración**: convertir los eventos individuales del MVP en eventos
  de una "organización personal" del usuario, o mantener ambos modelos.

### Subscription Plans con Stripe

- Tres tiers: **Free**, **Pro** (~$9/mo), **Enterprise** (~$29/mo).
- Cupo por evento, eventos activos, tienda de clasificados y otras
  features se desbloquean por tier.
- Integración con Stripe Billing / Stripe Checkout.
- Webhook handling para upgrades, downgrades y cancelaciones.
- Lógica de "rebajar plan" cuando el usuario excede límites tras un
  downgrade.

### Tienda de clasificados (planes Pro / Enterprise)

- Cada organización con plan superior puede listar productos de hiking.
- **La transacción NO ocurre en Chaski**: solo es vitrina.
- Productos tienen título, descripción, fotos, precio, contacto del
  vendedor.
- Búsqueda y filtros por categoría (ropa, equipo, alimentos, calzado).
- Moderación admin.

### Asistente conversacional con IA

- Chat embebido (LLM con contexto del perfil del hiker + detalles del
  evento).
- Casos de uso: recomendar caminatas según perfil, sugerir equipo según
  ruta, responder preguntas frecuentes del evento.
- Disponible para usuarios autenticados.
- Posible integración con OpenAI, Anthropic, o un modelo local.

### Asignación automática de insignias

- Background jobs (Sidekiq / Solid Queue) que evalúan condiciones tras
  cada evento completado.
- Reglas: primera caminata, X caminatas completadas, Y km acumulados,
  Z elevación, dificultad alcanzada, etc.
- Cada insignia tiene su propia regla evaluada por un servicio.
- Notificación in-app cuando se gana una insignia.

### Email notifications automáticas

- Confirmación de inscripción.
- Recordatorio 24h antes del evento.
- Notificación al organizer cuando alguien se inscribe.
- Notificación a inscritos cuando el organizer cancela o edita el
  evento.
- Email digest semanal de caminatas recomendadas.
- Preferencias granulares en `/configuracion`.

### Magic link / OTP login

- Como opción adicional, no reemplazo del password.
- Útil para usuarios que olvidan password con frecuencia o entran
  desde mobile.

### Reviews post-evento

- Después de un evento, los inscritos pueden dejar review del
  organizador y del evento.
- Estrellas + comentario opcional.
- Reputación pública del organizador basada en agregado de reviews.

### Calendario mensual del organizer

- Vista tipo calendario (grid mensual) con todos los eventos del
  organizador del mes en curso y meses futuros.
- Patrón muy común en organizadores de hiking en redes sociales: cada
  inicio de mes publican una imagen con sus próximas caminatas. Chaski
  puede ofrecer eso nativamente.
- **Vistas necesarias**:
  - Calendario público por organizer (en su perfil): hikers ven de un
    vistazo qué tiene programado el organizador favorito.
  - Calendario global (todos los eventos del mes) en una página de
    descubrimiento.
  - Calendario privado del organizer en su dashboard (ve también los
    `pending_review` y `rejected`).
- **Features asociadas**:
  - Exportación a Google Calendar / Apple Calendar / iCal (`.ics`).
  - Imagen shareable del calendario mensual (para Instagram stories).
  - Suscripción a calendario de un organizer ("avísame cuando publique
    eventos nuevos").
- **Modelo de datos**: no requiere tablas nuevas; es una vista derivada
  agrupando `events` por mes/organizer. Eventual indexado en
  `(organizer_id, starts_at)` y `(starts_at, status)` para performance.

---

## Visión a futuro (post-curso)

### App móvil nativa

- React Native o nativa.
- Notificaciones push.
- Offline-first para el checklist y los detalles del evento (útil en
  zonas sin señal).

### Multi-país / multi-idioma

- i18n con soporte para español, inglés y portugués.
- Soporte para más países (Colombia, Perú, México como candidatos
  iniciales).
- Configuración de moneda y unidades (km vs mi).

### Comunidad y social

- Comentarios en eventos.
- Galería de fotos compartidas post-evento.
- Rankings (caminantes más activos del mes, organizadores con mejor
  reputación).
- Sistema de "amigos" / "seguir caminantes".

### Caminante Premium

- Suscripción para el hiker (no solo para el organizer).
- Beneficios: insignias exclusivas, prioridad en cupos limitados,
  estadísticas avanzadas, descuentos en la tienda.

### Integraciones

- Strava: importar caminatas registradas.
- Google Maps / Apple Maps: navegar al punto de encuentro.
- WhatsApp Business API: notificaciones por WhatsApp.

### Geo-features avanzadas

- Mapa interactivo de rutas.
- Tracks GPX de las rutas.
- (Nota: esto se evaluará con cuidado para **no competir con AllTrails**.
  El foco de Chaski sigue siendo social, no cartográfico.)

---

## Ideas más exploratorias / sin compromiso

- Sistema de carpooling para llegar al punto de encuentro.
- "Caminata sorpresa" semanal (curada algorítmicamente).
- Seguros de eventos (partnership con aseguradora).
- Programa de embajadores / influencers de outdoors.
- Marketplace de guías certificados.

---

## Cómo agregar ideas a este archivo

1. Si surge una idea durante una conversación con el agente o durante
   desarrollo, anotarla acá con suficiente contexto para entenderla en
   3 meses.
2. No evaluar viabilidad en el momento. Solo capturar.
3. Cuando se planifica un nuevo sprint o fase, revisitar este archivo
   y mover ideas a un alcance concreto si corresponden.
