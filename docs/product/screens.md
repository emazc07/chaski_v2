# Inventario de pantallas del MVP

Este documento describe **cada pantalla del MVP**: qué muestra, quién la
ve, qué acciones permite, y los estados (con datos / vacío) que debe
soportar.

> Este inventario es fuente de verdad para el diseño en Visily y para la
> implementación posterior. Si una pantalla cambia, este documento se
> actualiza.

---

## Acceso por rol

| Rol | Definición |
|---|---|
| **Visitante** | Usuario no autenticado |
| **Hiker** | Usuario autenticado (sin necesariamente haber creado eventos) |
| **Organizer** | Hiker que ha creado al menos un evento |
| **Admin** | Rol interno de la plataforma |

---

## 1. Landing Page

- **Ruta**: `/`
- **Acceso**: Visitante (también accesible para Hiker si navega a la
  raíz manualmente, aunque su default tras login es el dashboard).
- **Objetivo**: convertir a un visitante en cuenta registrada o, al
  menos, en explorador de eventos.
- **Contenido**:
  - Hero con propuesta de valor en una frase.
  - Pasos de cómo funciona Chaski (3 pasos visuales).
  - Caminatas destacadas (cards de eventos próximos).
  - Testimonios / prueba social (si hay).
  - Footer con links a Sobre, Términos, Privacidad, Contacto.
- **CTAs**:
  - "Explorar caminatas" → `/eventos`
  - "Crear cuenta" → abre modal de registro
- **Estado**: ya diseñada en Visily.

---

## 2. All Events Page (Listado)

- **Ruta**: `/eventos`
- **Acceso**: Visitante y autenticado.
- **Objetivo**: descubrir caminatas filtrables.
- **Contenido**:
  - Filtros: dificultad, fecha, ubicación (provincia/zona), cupo
    disponible.
  - Buscador por texto libre (título, ubicación).
  - Lista paginada de cards de eventos.
  - Cada card muestra: imagen, título, fecha, ubicación, dificultad,
    cupo (X/Y), organizador.
- **Acciones**:
  - Click en card → `/eventos/:slug`
  - Filtrar / buscar (sin requerir auth).
- **Estado vacío**: "No encontramos caminatas con esos filtros. Probá
  ampliar la búsqueda."
- **Estado**: ya diseñada en Visily.

---

## 3. Event Detail Page

- **Ruta**: `/eventos/:slug`
- **Acceso**: Visitante y autenticado.
- **Objetivo**: dar toda la información de una caminata específica y
  convertir en inscripción.
- **Contenido**:
  - Imagen / galería de la caminata.
  - Título, organizador, fecha, hora, punto de encuentro.
  - Detalles: dificultad, distancia, elevación, duración, tipo.
  - Descripción / itinerario.
  - Checklist de equipo recomendado (visible para todos; marcable solo
    para inscritos).
  - Cupo (X de Y inscritos), barra de progreso.
  - Inscritos (avatares opcionales).
- **Acciones**:
  - "Inscribirme" → si no autenticado, modal de auth; si autenticado,
    inscripción inmediata.
  - "Compartir" → menú con copiar link, WhatsApp, Telegram, X.
  - "Guardar" (Fase 2).
- **Variantes**:
  - Visitante: ve todo pero el botón inscribirse dispara modal.
  - Hiker no inscrito: botón inscribirse activo.
  - Hiker inscrito: botón "Cancelar inscripción" + checklist marcable.
  - Organizer del evento: ve link a "Gestionar este evento" y el badge
    de status del evento (`pending_review`, `published`, `rejected`).
  - Si el organizer ve su propio evento en `rejected`, también ve la
    `rejection_reason` y un CTA "Editar y reenviar".
  - Admin: ve el badge de status + acciones "Aprobar" / "Rechazar" si
    el evento está en `pending_review` (ver pantalla #17).
  - Evento lleno: botón inscripción deshabilitado, mensaje "Cupo
    completo".
  - Evento pasado: badge "Caminata finalizada", inscripción
    deshabilitada.
  - Evento cancelado: badge "Cancelado" en rojo, inscripción
    deshabilitada, mensaje explicativo.
- **Visibilidad pública**: solo si `status IN ('published',
  'cancelled', 'completed')`. Eventos en `pending_review` o `rejected`
  solo son accesibles para su organizer y para admins.
- **Estado**: ya diseñada en Visily (ajustes para los badges de status
  pendientes en una iteración futura).

---

## 4. Sign Up / Sign In

- **Ruta**: `/login` y `/registro` (también disponible como **modal**
  desde cualquier acción que requiera auth).
- **Acceso**: Visitante.
- **Objetivo**: registrar o autenticar al usuario sin sacarlo del
  contexto donde estaba.
- **Comportamiento**:
  - **Modal** (preferido): aparece sobre la página donde estaba el
    usuario. Tras autenticarse, vuelve a esa página y continúa la
    acción (ej. completar inscripción).
  - **Página dedicada**: para cuando alguien llega por link directo o
    desde el menú.
- **Contenido modal**:
  - Toggle entre "Iniciar sesión" / "Crear cuenta".
  - Sign Up: nombre, email, password, password confirmation.
  - Sign In: email, password.
  - Link "Olvidé mi contraseña" → modal de recovery.
- **Validaciones**:
  - Email único y formato válido.
  - Password mínimo 8 caracteres.
  - Errores inline con copy claro.

---

## 5. Onboarding Wizard

- **Ruta**: `/bienvenida` (solo se muestra una vez después del primer
  login).
- **Acceso**: Hiker recién registrado.
- **Objetivo**: armar perfil mínimo para personalizar la experiencia,
  sin forzar.
- **Diseño**: **una sola página** con barra de progreso y 5 pasos
  navegables. Botón "Saltar por ahora" siempre visible.
- **Pasos**:
  1. **Experiencia**: principiante / intermedio / avanzado.
  2. **Frecuencia**: una vez al mes / cada quincena / cada semana / más.
  3. **Motivaciones**: naturaleza / fitness / social / fotografía /
     espiritual / aventura.
  4. **Zonas favoritas**: provincia / parque / cordillera (multi-select).
  5. **¡Listo!**: muestra 3 caminatas recomendadas + primera insignia
     ("Bienvenido a Chaski").
- **Si saltó**: la home page muestra un banner "Completá tu perfil al
  X%" como invitación.

---

## 6. Hiker Dashboard

- **Ruta**: `/dashboard` (default tras login).
- **Acceso**: Hiker.
- **Objetivo**: ser el "home base" del caminante.
- **Contenido (con eventos inscritos)**:
  - Saludo personalizado: "Hola, {nombre}".
  - Próxima caminata destacada (card grande con countdown si aplica).
  - Stats rápidos: caminatas completadas, próximas, insignia más
    reciente.
  - Caminatas recomendadas (carrusel horizontal).
  - Atajos: ver perfil, ver historial, ver todas las caminatas.
- **Contenido (empty state, sin inscripciones)**:
  - Hero con CTA grande: "Explorá tu primera caminata".
  - Caminatas recomendadas basadas en onboarding.
  - Si saltó el onboarding: banner "Completá tu perfil para mejores
    recomendaciones".
- **Toggle Hiker/Organizer**: en el nav, solo visible si el usuario es
  organizer.

---

## 7. Mi Perfil

- **Ruta**: `/perfil`
- **Acceso**: Hiker (el propio).
- **Objetivo**: ver y editar el perfil público.
- **Contenido**:
  - Foto de perfil, nombre, bio, ubicación.
  - Nivel de experiencia, frecuencia, motivaciones (lo que llenó en
    onboarding).
  - Insignias ganadas.
  - Estadísticas: total de caminatas, distancia acumulada, elevación
    acumulada.
- **Acciones**:
  - Editar foto, bio, datos personales.
  - Editar preferencias del onboarding.

---

## 8. Mis Caminatas

- **Ruta**: `/mis-caminatas`
- **Acceso**: Hiker.
- **Objetivo**: ver el historial de inscripciones del usuario.
- **Contenido**:
  - Tabs: Próximas / Pasadas / Canceladas.
  - Lista de cards de eventos (con estado de inscripción).
- **Acciones**:
  - Click en card → `/eventos/:slug`.
  - Cancelar inscripción (solo en "Próximas").
- **Estado vacío**: "Aún no te has inscrito a ninguna caminata.
  Explorá las próximas."

---

## 9. Create Event Page (Wizard 4 pasos)

- **Ruta**: `/eventos/nuevo`
- **Acceso**: Hiker (al crear su primer evento se vuelve Organizer).
- **Objetivo**: crear un evento publicable.
- **Diseño**: wizard con 4 pasos y auto-guardado en el cliente
  (localStorage) durante la sesión. NO persiste un borrador en la base
  de datos (ver ADR-005).
- **Pasos**:
  1. **Información básica**: título, descripción corta, descripción
     larga, foto principal.
  2. **Detalles de la ruta**: fecha, hora, ubicación (provincia y
     punto), dificultad, distancia (km), elevación (m), duración
     estimada (hrs), tipo (loop / out-and-back / point-to-point).
  3. **Logística**: cupo máximo, punto de encuentro, hora de salida,
     gear checklist (lista editable de ítems).
  4. **Revisión y enviar**: preview de cómo se verá la Event Detail
     Page. Botón **"Enviar a revisión"** (no "Publicar"). Texto
     informativo: *"Tu evento será revisado por el equipo de Chaski
     antes de aparecer públicamente. Te avisaremos en tu dashboard
     cuando esté aprobado."*
- **Resultado del submit**: el evento se crea con `status =
  pending_review`. El organizer es redirigido a su Organizer Dashboard
  donde ve el evento con badge "Pendiente de revisión".

---

## 10. Manage Event (Organizer)

- **Ruta**: `/eventos/:slug/gestionar`
- **Acceso**: Organizer dueño del evento.
- **Objetivo**: administrar un evento publicado.
- **Contenido**:
  - Resumen del evento (datos clave).
  - Lista de inscritos: avatar, nombre, fecha de inscripción, % de
    checklist completado.
  - Acciones: marcar evento como completado, cancelar evento, editar
    evento.
- **Acciones**:
  - "Editar evento" → `/eventos/:slug/editar`.
  - "Cancelar evento" → confirmación, cambia estado a "cancelado".
  - "Marcar como completado" (post-fecha).

---

## 11. Edit Event

- **Ruta**: `/eventos/:slug/editar`
- **Acceso**: Organizer dueño del evento.
- **Diseño**: mismo wizard de Create Event pero con datos pre-cargados.
  Permite ir a cualquier paso libremente.

---

## 12. Settings (Cuenta)

- **Ruta**: `/configuracion`
- **Acceso**: Hiker.
- **Objetivo**: ajustes de cuenta (no de perfil público).
- **Secciones**:
  - **Cuenta**: cambiar email, cambiar password.
  - **Privacidad**: visibilidad del perfil (público / solo inscritos
    a mis eventos).
  - **Notificaciones**: toggles para futuras notificaciones por email
    (en MVP solo placeholders, sin envío real).
  - **Zona peligrosa**: eliminar cuenta.

---

## 13. Error Pages

- **404 — No encontrado**: para rutas inexistentes o eventos
  eliminados. Sugerencia: "Volver al inicio" o "Ver próximas
  caminatas".
- **403 — Sin permiso**: cuando se intenta acceder a un recurso que no
  es del usuario (ej. editar evento ajeno).
- **500 — Error del servidor**: con mensaje genérico y link a soporte
  (Fase 2: integración con Sentry o similar).

Todas mantienen el mismo design language y muestran navegación útil.

---

## 14. Footer Pages

Páginas estáticas linkeadas desde el footer global:

- `/sobre` — Sobre Chaski.
- `/terminos` — Términos y condiciones.
- `/privacidad` — Política de privacidad.
- `/contacto` — Formulario o email de contacto.

---

## 15. Organizer Dashboard

- **Ruta**: `/organizador` (solo accesible si el usuario tiene al
  menos un evento creado).
- **Acceso**: Organizer.
- **Objetivo**: home base del organizador.
- **Toggle**: en el nav se puede saltar entre "Caminante" (dashboard
  hiker) y "Organizador".
- **Contenido**:
  - CTA principal: "Crear nuevo evento" → `/eventos/nuevo`.
  - Lista de eventos del organizer con tabs:
    - **Pendientes** (status `pending_review`) — badge amarillo.
    - **Rechazados** (status `rejected`) — badge rojo, muestra
      `rejection_reason` y CTA "Editar y reenviar".
    - **Publicados** (status `published`, fecha futura) — badge verde.
    - **Finalizados** (status `completed`).
    - **Cancelados** (status `cancelled`).
  - Stats: total de eventos publicados, total de inscritos, próximo
    evento publicado.
- **Estado vacío**: usuario sin eventos no llega acá (no hay toggle
  visible).

---

## 16. Admin Events List

- **Ruta**: `/admin/events`
- **Acceso**: Admin únicamente (`current_user.admin?`). Si un no-admin
  llega acá, redirige a página 403.
- **Objetivo**: ver la cola de eventos pendientes de revisión para
  decidir aprobación o rechazo.
- **Contenido**:
  - Filtros por status (default: `pending_review`). Toggle para ver
    todos los estados.
  - Tabla con columnas:
    - Fecha del evento (orden ascendente por default — más urgentes
      arriba).
    - Título.
    - Organizer (nombre + email).
    - Destino.
    - Status (badge).
    - Fecha de creación.
    - Acción: "Revisar →" link a `/admin/events/:id`.
- **Estado vacío**: "No hay eventos pendientes. Buen trabajo."
- **Nota de UI**: sin charts ni analytics. Solo una tabla funcional.

---

## 17. Admin Event Review

- **Ruta**: `/admin/events/:id`
- **Acceso**: Admin únicamente.
- **Objetivo**: revisar un evento específico y aprobar o rechazar.
- **Diseño**: vista del evento idéntica a Event Detail Page con un
  **header/sidebar admin** que contiene:
  - Status actual del evento (badge grande).
  - Metadatos: creado por X el Y, última edición Z, revisado por W el
    V (si aplica).
  - Botones:
    - **"Aprobar"** → confirmación inline, cambia status a
      `published`, setea `reviewed_at` y `reviewed_by_id`. Redirige a
      `/admin/events` con flash de éxito.
    - **"Rechazar"** → abre modal con textarea para
      `rejection_reason` (requerido, mínimo 10 caracteres). Submit
      cambia status a `rejected`, guarda razón, setea `reviewed_at`
      y `reviewed_by_id`. Redirige a `/admin/events` con flash.
- **Si el evento ya fue revisado**: muestra los botones igual (el
  admin puede cambiar la decisión: aprobar un evento previamente
  rechazado, o re-rechazar uno aprobado por error).
