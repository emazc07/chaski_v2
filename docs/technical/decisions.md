# Registro de decisiones (ADRs)

Este archivo documenta **decisiones de diseño y arquitectura** del
proyecto, con su contexto y razonamiento. Sigue el formato simplificado
de un ADR (Architecture Decision Record).

> **Regla**: cuando se toma una decisión que afecta el alcance, el
> stack, o la experiencia de usuario, se documenta acá con su fecha y
> razón. Las decisiones no se borran; si una se reemplaza, se marca
> como **Superseded** y se agrega el ADR nuevo.

---

## ADR-001: Diferir Organizations a Fase 2

- **Fecha**: 2026-05-27
- **Estado**: Accepted

### Contexto

Una idea temprana del producto era que un organizador no fuera un
usuario individual sino una **Organization** (multi-usuario): un grupo
de hikers con roles (Owner, Admin, Organizer, Member), invitaciones por
email, y eventos creados bajo el paraguas de la organización.

Esto refleja casos de uso reales (clubs de montañismo, agencias
turísticas pequeñas), pero implica:

- Multi-tenancy (los eventos pertenecen a una org, no a un user).
- Sistema de invitaciones con tokens, expiración y acceptance flow.
- Permisos granulares por rol dentro de la organización.
- UI para gestionar la organización y sus miembros.

### Decisión

**No se implementa Organizations en el MVP**. En su lugar, un usuario
individual es el "organizer" de sus propios eventos. La capacidad de
"ser organizer" se activa al crear el primer evento.

### Razones

1. **Complejidad técnica**: Organizations agrega 3-4 semanas de trabajo
   sin probar primero que el core funciona.
2. **Validación primero**: necesitamos validar que la propuesta
   (descubrir + inscribirse + checklist) tiene tracción antes de
   construir capas de gestión organizacional.
3. **Tiempo del curso**: 10 semanas para MVP es ajustado. Mejor pulir
   pocas pantallas que rushear muchas.
4. **El usuario puede esperar**: los clubes y agencias chicas pueden
   operar perfectamente con cuentas individuales en una primera fase.

### Consecuencias

- Los eventos pertenecen a un `User`, no a una `Organization`.
- En Fase 2 habrá una migración para introducir el concepto de `Organization`
  y mover los eventos. Documentar esto desde ya en la arquitectura.

---

## ADR-002: Autenticación con email + password (no OTP en MVP)

- **Fecha**: 2026-05-27
- **Estado**: Accepted

### Contexto

Se evaluaron dos esquemas de autenticación para el MVP:

| Esquema | Pros | Contras |
|---|---|---|
| **Email + Password** | Implementación rápida con Devise, sin infra externa | Usuario debe recordar password, flow de "olvidé mi contraseña" |
| **Magic link / OTP por email** | Sin password, más moderno, mejor en mobile | Requiere infra de email confiable, latencia en la entrega |

### Decisión

**Email + password tradicional** para el MVP, implementado con Devise.

### Razones

1. **Velocidad de implementación**: Devise es estándar en Rails y
   resuelve el 90% out-of-the-box.
2. **Sin dependencia de email crítico**: si el SMTP no funciona, el
   usuario igual puede ingresar. En MVP no podemos garantizar que un
   correo llegue en segundos.
3. **Familiaridad del usuario**: el modelo es conocido por toda la
   audiencia.

### Consecuencias

- Devise como gem principal de auth.
- Flujo "Olvidé mi contraseña" sí se implementa (requiere SMTP, pero
  no es bloqueante: en dev se usa `letter_opener`).
- Magic link queda como opción en Fase 2 (no como reemplazo).

---

## ADR-003: Create Event como wizard de 4 pasos

- **Fecha**: 2026-05-27
- **Estado**: Accepted

### Contexto

Crear un evento tiene muchos campos: título, descripción, fotos, fecha,
hora, ubicación, dificultad, distancia, elevación, duración, tipo,
cupo, punto de encuentro, gear checklist. Un solo formulario largo
sería abrumador para un organizador primerizo.

### Decisión

**Wizard de 4 pasos** con auto-guardado de borrador:

1. Información básica (título, descripción, foto principal).
2. Detalles de la ruta (fecha, hora, ubicación, dificultad, distancia,
   elevación, duración, tipo).
3. Logística (cupo, punto de encuentro, gear checklist).
4. Revisión y publicación.

### Razones

1. **Reduce ansiedad**: cada paso enfoca una decisión.
2. **Permite progresar a pedazos**: el organizer puede dejar y volver
   gracias al borrador.
3. **Estándar**: AllTrails, Meetup y Eventbrite usan patrones similares.

### Consecuencias

- Necesitamos persistir borradores (campo `status: draft` en `Event`).
- El componente del wizard se reutiliza para Edit Event.
- Indicador de progreso visible en todo momento.

> **Amendment (2026-05-31)**: El estado `draft` queda fuera del MVP.
> Ver **ADR-005** para el modelo de estados final del Event. El wizard
> conserva auto-guardado en el cliente (localStorage o similar) durante
> la sesión, pero no persiste un borrador en la base de datos. El
> submit del wizard pasa el evento a `pending_review` directamente.

---

## ADR-004: Browsing libre, gate solo en acción

- **Fecha**: 2026-05-27
- **Estado**: Accepted

### Contexto

Se consideró si la app debería **gatear** parte del browsing tras un
registro (por ejemplo, mostrar solo las primeras N caminatas y exigir
cuenta para "ver más"). El objetivo de gatear sería forzar conversión
a registro.

### Decisión

**Todo el browsing es público y sin gate**. La autenticación se
requiere únicamente cuando el usuario realiza una **acción que genera
estado**: inscribirse, guardar favorito, contactar organizador.

### Razones

1. **SEO**: páginas públicas indexables son la principal fuente de
   tráfico orgánico de plataformas similares (Meetup, AllTrails,
   Eventbrite).
2. **Confianza**: dejar ver el contenido sin fricción genera más
   conversión que forzar registro temprano.
3. **Compartibilidad**: cualquier link compartido debe funcionar para
   no autenticados. Caso contrario, no se viraliza.
4. **Estándar del mercado**: las plataformas que más crecen no gatean
   el browsing.

### Consecuencias

- Todas las páginas de eventos tienen URL pública con slug amigable.
- El modal de auth aparece **solo** cuando el usuario intenta una
  acción (no por scroll, no por tiempo, no por número de páginas
  vistas).
- Después del auth, el sistema vuelve a la página de origen y
  continúa la acción.

---

## ADR-005: Verificación manual de eventos por admin antes de publicar

- **Fecha**: 2026-05-31
- **Estado**: Accepted

### Contexto

Chaski compite contra grupos de WhatsApp y Facebook donde no hay
filtro de calidad: cualquiera publica cualquier cosa. Esa es
precisamente la frustración que el producto busca resolver. Si Chaski
muestra eventos incompletos, ambiguos o sospechosos, el diferenciador
desaparece y la confianza se pierde rápido.

Sin moderación, los primeros 50-100 eventos definen la percepción
pública del producto. Limpiar a posteriori (banear, esconder, pedir
edición) es más costoso y daña la experiencia de quienes ya
descubrieron contenido malo.

### Decisión

Todo evento creado en Chaski **debe pasar por verificación manual de
un admin** antes de ser visible públicamente. Mientras espera revisión,
el evento existe en la base de datos pero no se muestra en páginas
públicas ni en búsquedas.

#### Modelo de estados del Event

| Estado (DB) | Display (ES) | Visible públicamente |
|---|---|---|
| `pending_review` | Pendiente de revisión | No |
| `published` | Publicado | Sí |
| `rejected` | Rechazado | No |
| `cancelled` | Cancelado | Sí (con badge "Cancelado") |
| `completed` | Finalizado | Sí (archivado) |

#### Transiciones permitidas

- Creación → `pending_review` (estado inicial, sin paso por `draft`).
- `pending_review` → `published` (admin aprueba).
- `pending_review` → `rejected` (admin rechaza con razón).
- `rejected` → `pending_review` (organizer edita y guarda; pasa
  automáticamente, sin botón explícito de reenviar).
- `published` → `cancelled` (organizer cancela el evento).
- `published` → `completed` (la fecha pasó; transición vía background
  job o cron, evaluada en Fase 2; en MVP puede ser manual desde el
  panel admin o derivada en query).

#### Alcance del admin view (MVP)

- **Pantalla 1**: `/admin/events` — lista de eventos `pending_review`
  (default), ordenados por fecha del evento ascendente (más urgentes
  arriba). Toggle para ver todos los estados.
- **Pantalla 2**: `/admin/events/:id` — vista de detalle del evento
  (reutiliza la Event Detail Page) con header/sidebar admin que tiene
  botones **Aprobar** y **Rechazar** (modal con textarea para
  `rejection_reason`).
- Acceso restringido por `current_user.admin?`.

#### Comunicación con el organizer (MVP)

- **Sin email automático**. El organizer ve el estado de cada uno de
  sus eventos como **badge in-app** en su Organizer Dashboard.
- Si el evento fue rechazado, el badge muestra "Rechazado" y al abrir
  el evento se ve la `rejection_reason` con CTA para editar y
  reenviar.

### Razones

1. **Trust signal del producto**. *"Todo lo que ves en Chaski está
   confirmado"* es el mensaje diferenciador. Sin verificación, no se
   puede sostener.
2. **Implementación core barata**. 4 columnas nuevas en `Event`, 2
   pantallas admin simples, y badges en el dashboard del organizer.
   No requiere email infra ni jobs en MVP.
3. **Fácil de extender**. El modelo de estados deja espacio limpio
   para auto-moderación, categorías estructuradas de rechazo y
   notificaciones por email en Fase 2 sin rediseño.
4. **Difícil de retrofittear**. Si arrancamos sin moderación y luego
   queremos agregarla, hay que lidiar con el contenido legado y con
   usuarios acostumbrados a publicación instantánea.

### Consecuencias

- `Event` gana **4 columnas nuevas** que se incorporan al modelo de
  datos: `status` (string enum, NOT NULL, default `pending_review`),
  `rejection_reason` (text, nullable), `reviewed_at` (datetime,
  nullable), `reviewed_by_id` (FK a `users`, nullable).
- Las queries públicas (`/eventos`, búsqueda, recomendaciones) filtran
  por `status IN ('published', 'cancelled', 'completed')`. Lo único
  visible para el organizer en su propio dashboard incluye también
  `pending_review` y `rejected`.
- Aparecen **2 pantallas nuevas en el inventario del MVP**: Admin
  Events List (#16) y Admin Event Review (#17).
- Aparecen **2 flujos nuevos**: verificación desde la perspectiva del
  organizer (envío y reenvío tras rechazo) y desde la perspectiva del
  admin (cola y revisión).
- **Amends ADR-003**: el wizard de Create Event ya no persiste un
  `status: draft` en la base de datos. El auto-guardado vive en el
  cliente. El submit pasa el evento directo a `pending_review`.
- **Operacionalmente** el admin (único, vos) se vuelve el cuello de
  botella del flujo de publicación. Esto es aceptado conscientemente
  en MVP por el volumen esperado bajo. Cualquier organizer va a ver
  un mensaje claro de "tu evento será revisado" al enviar.
- En Fase 2 se evalúan: notificaciones por email al organizer,
  categorización estructurada de razones de rechazo, multiples
  admins con cola compartida o asignada, y auto-rechazo de eventos
  cuya fecha venció en `pending_review`.
