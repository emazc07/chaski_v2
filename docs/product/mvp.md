# MVP de Chaski

> **Estado**: definido el 2026-05-27.
> **Alcance temporal**: curso de Ruby on Rails + React (≈10 semanas para MVP).

Este documento define **qué se construye en la primera fase** de Chaski y,
con la misma importancia, **qué no se construye todavía**.

---

## 1. Visión del MVP

Una plataforma web donde **caminantes en Costa Rica pueden descubrir
caminatas, inscribirse y prepararse**, y donde **organizadores individuales
pueden publicar y gestionar sus eventos**.

El MVP **no incluye monetización ni multi-usuario por organización**. Esas
capacidades quedan en Fase 2 (ver `ideas/parking-lot.md`).

---

## 2. Principios de scope

1. **Foco en el caminante individual y el organizador individual**.
   Organizaciones multi-usuario quedan fuera del MVP.
2. **Browsing libre, gate solo en acción**. Cualquiera puede ver eventos
   sin autenticarse. La cuenta solo se requiere al inscribirse, guardar o
   contactar.
3. **Mobile-first**. La mayoría de hikers usarán el teléfono.
4. **CRUD primero, automatizaciones después**. Inscripciones, eventos y
   checklists son CRUDs que el usuario maneja a mano. Reglas automáticas
   (cierre por cupo, asignación de insignias) son nice-to-have.
5. **Diseño consistente sobre features adicionales**. Mejor 12 pantallas
   bien diseñadas que 20 a medio terminar.

---

## 3. Lo que entra al MVP

### Pantallas (17)

| # | Pantalla | Acceso | Estado |
|---|---|---|---|
| 1 | Landing Page | Pública | Ya diseñada en Visily |
| 2 | All Events (listado) | Pública | Ya diseñada en Visily |
| 3 | Event Detail | Pública | Ya diseñada en Visily |
| 4 | Sign Up / Sign In (modal + página) | Pública | Por diseñar |
| 5 | Onboarding Wizard | Solo autenticado | Por diseñar |
| 6 | Hiker Dashboard | Solo autenticado | Por diseñar |
| 7 | Mi perfil (edición) | Solo autenticado | Por diseñar |
| 8 | Mis caminatas (inscripciones) | Solo autenticado | Por diseñar |
| 9 | Create Event (wizard 4 pasos) | Solo organizer | Por diseñar |
| 10 | Manage Event (organizer) | Solo organizer (dueño) | Por diseñar |
| 11 | Edit Event | Solo organizer (dueño) | Reuso del wizard |
| 12 | Settings (cuenta) | Solo autenticado | Por diseñar |
| 13 | Error pages (404 / 403 / 500) | Pública | Por diseñar |
| 14 | Páginas de footer (Sobre, Términos, Privacidad, Contacto) | Pública | Por diseñar |
| 15 | Organizer Dashboard | Solo autenticado con eventos | Por diseñar |
| 16 | Admin Events List | Solo admin | Por diseñar |
| 17 | Admin Event Review | Solo admin | Por diseñar |

Detalle de cada pantalla en [`screens.md`](./screens.md).

### Funcionalidades core

- Registro y login con **email + password**.
- Recuperación de contraseña por email.
- Onboarding skippable post-registro.
- Búsqueda y filtrado de eventos (dificultad, fecha, ubicación, cupo).
- Compartir evento por URL pública (con slug amigable).
- Inscripción y desinscripción a eventos.
- Checklist de equipo: el organizador define ítems, el hiker marca los
  suyos.
- Toggle entre modo "Caminante" y modo "Organizador" en el nav.
- Creación de evento con wizard de 4 pasos y auto-guardado de borrador.
- Edición y cancelación de eventos (con notificación a inscritos
  pendiente de Fase 2 para email automático; en MVP basta con cambio de
  estado visible).
- Gestión de inscritos por parte del organizador (ver lista,
  marcar como completado).
- Galería de insignias (UI lista, asignación automática queda en Fase 2;
  en MVP las insignias se otorgan manualmente o con seeds).
- **Verificación manual de eventos por admin antes de publicar**
  (ADR-005). Todo evento creado entra en estado `pending_review` y
  solo aparece en páginas públicas tras aprobación. Notificación al
  organizer vía badge en su dashboard (sin email en MVP). Razón de
  rechazo en free text.

### Roles del MVP

- **Hiker (caminante)**: rol base de todo usuario registrado.
- **Organizer (organizador)**: capacidad que un hiker activa al crear su
  primer evento. No requiere plan de pago en el MVP (los planes llegan en
  Fase 2 junto con Stripe).
- **Admin**: rol interno con acceso a `/admin/events` para revisar y
  aprobar/rechazar eventos antes de su publicación. Esencial para el
  trust signal del producto (ADR-005). En MVP el admin es el equipo
  de Chaski (una sola persona).

---

## 4. Lo que NO entra al MVP (Fase 2 o más allá)

Estas decisiones fueron tomadas conscientemente. El detalle está en
[`../ideas/parking-lot.md`](../ideas/parking-lot.md).

- **Organizations** (multi-usuario por organización, invitaciones, roles
  internos como Owner/Admin/Organizer/Member).
- **Planes de suscripción** (Free / Pro / Enterprise) con Stripe.
- **Tienda de clasificados** para productos de hiking.
- **Asistente conversacional con IA**.
- **Asignación automática de insignias** vía background jobs.
- **Email notifications automáticas** (recordatorios, confirmaciones).
- **Magic link / OTP login** (en MVP solo password tradicional).
- **Reviews post-evento**.
- **App móvil nativa**.
- **Multi-país / multi-idioma**.

---

## 5. Decisiones clave del MVP

Las siguientes decisiones se discutieron y confirmaron. El detalle vive
en [`../technical/decisions.md`](../technical/decisions.md).

| ADR | Decisión |
|---|---|
| ADR-001 | Diferir Organizations a Fase 2 |
| ADR-002 | Autenticación con email + password (no OTP en MVP) |
| ADR-003 | Create Event como wizard de 4 pasos |
| ADR-004 | Browsing libre sin gate, gate solo en acción |
| ADR-005 | Verificación manual de eventos por admin antes de publicar |

---

## 6. Criterios de éxito del MVP

El MVP se considera **funcionalmente completo** cuando un usuario externo
puede:

1. Entrar a Chaski sin cuenta y ver eventos disponibles.
2. Crearse una cuenta en menos de 2 minutos.
3. Pasar (o saltar) el onboarding sin perder el contexto.
4. Inscribirse a una caminata y ver su checklist de equipo.
5. Crear su propio evento como organizador y enviarlo a revisión.
6. Ver el badge "Pendiente de revisión" en su dashboard tras crear el
   evento, y "Publicado" tras la aprobación del admin.
7. Como admin, revisar la cola de eventos pendientes y aprobar o
   rechazar (con razón) cada uno.
8. Ver participantes inscritos como organizador.
9. Compartir el link público del evento por WhatsApp.
10. Ver una página 404 amigable si entra a un evento eliminado.

---

## 7. Fuera del scope técnico del MVP

- **Performance avanzada**: no se optimizan queries N+1 más allá de lo
  básico, no se implementa caching agresivo.
- **Internacionalización (i18n)**: solo español.
- **Accesibilidad WCAG AAA**: se busca AA mínimo, AAA queda fuera.
- **Tests E2E exhaustivos**: solo tests críticos (auth, inscripción,
  creación de evento).
- **Pipeline CI/CD complejo**: GitHub Actions básico para tests.
- **Deploy a producción real**: el target es ambiente de staging /
  desarrollo. Deploy productivo se evalúa al final del curso.

---

## 8. Próximos pasos después de definir el MVP

1. Diseñar las pantallas faltantes en Visily.
2. Definir el modelo de datos formal con base en las pantallas y casos
   de uso.
3. Configurar el stack técnico (Rails + Inertia + React + Postgres).
4. Implementar autenticación.
5. Implementar CRUDs base (Events, Inscriptions, ChecklistItems).
6. Iterar pantalla por pantalla.
