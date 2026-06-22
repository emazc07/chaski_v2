# Chaski

> El punto de encuentro para caminantes en Costa Rica.

**Curso:** Ruby on Rails + React (Vite + Inertia) 

**Autor:** Emmanuel Zuñiga

---

## 1. Resumen

**Chaski** es una plataforma web pensada para conectar a personas interesadas en hacer caminatas en Costa Rica con quienes las organizan. Busca centralizar el descubrimiento, la inscripción y la logística de las caminatas, reemplazando la dispersión actual en grupos informales de WhatsApp y Facebook.

El nombre proviene del **quechua**: los *chaskis* eran los mensajeros del imperio Inca que recorrían rutas montañosas conectando comunidades. Es una metáfora del rol que cumplen hoy los caminantes y de la red que Chaski busca tejer entre ellos.

---

## 2. Problema

La organización y el descubrimiento de caminatas en Costa Rica vive disperso en canales informales:

- La información está fragmentada en grupos de Facebook, WhatsApp y contactos personales.
- Es difícil encontrar caminatas según nivel, fecha o ubicación.
- La gestión por WhatsApp carece de herramientas para organizar logística (cupo, equipo recomendado, confirmaciones, recordatorios).
- El organizador comparte la lista de equipo como imagen suelta; el participante no tiene una forma estructurada de verificarla.
- No existe un historial visible ni una reputación verificable del organizador o del caminante.

---

## 3. Solución

Una plataforma web donde:

- El **organizador** publica caminatas, define cupo, dificultad, ubicación y un checklist de equipo recomendado.
- El **caminante** descubre eventos, se inscribe, marca su checklist personal y va construyendo su historial con insignias.
- Las organizaciones (planes superiores) pueden listar productos relacionados al hiking en una vitrina tipo clasificados; la transacción no ocurre dentro de la app.
- Se contempla, para una fase posterior, un asistente conversacional con IA que ofrezca recomendaciones personalizadas según el perfil del caminante y los detalles del evento.

---

## 4. Propuesta de Valor


| Para el organizador                                  | Para el caminante                        |
| ---------------------------------------------------- | ---------------------------------------- |
| Difusión de sus eventos hacia caminantes verificados | Descubrimiento centralizado de caminatas |
| Gestión estructurada de cupo e inscripciones         | Checklist de equipo claro por evento     |
| Checklist personalizable por evento                  | Historial verificable de caminatas       |
| Reputación y visibilidad dentro de la plataforma     | Insignias por logros (gamificación)      |
| Vitrina de productos (planes Pro / Enterprise)       | Filtros por nivel, fecha y ubicación     |


---

## 5. Mercado Objetivo

Costa Rica, con foco en hiking nacional:

- Caminantes recreativos que buscan grupos los fines de semana.
- Clubes de montañismo, guías independientes y agencias pequeñas de turismo de aventura.
- Rutas populares: Chirripó, Cerro Chato, Cerro de la Muerte, Cerros de Escazú, Volcán Barva, Talamanca, Camino de Costa Rica, entre otras.

---

## 6. Diferenciación

Chaski no compite con plataformas como AllTrails, Strava o Komoot. Esas plataformas resuelven **el descubrimiento de senderos** o **el seguimiento individual de actividades**. Chaski resuelve **la organización social de la caminata**.


| Plataforma          | Pregunta que responde                                        |
| ------------------- | ------------------------------------------------------------ |
| AllTrails / Wikiloc | "¿Dónde puedo caminar?"                                      |
| Strava / Komoot     | "¿Cómo registro o planifico mi actividad?"                   |
| Meetup / Facebook   | "¿Qué eventos genéricos existen cerca?"                      |
| **Chaski**          | **"¿Con quién, cuándo y cómo voy a caminar en Costa Rica?"** |


El competidor real de Chaski hoy son los **grupos informales de WhatsApp y Facebook**. Chaski busca diferenciarse por:

- **Foco local en Costa Rica**: rutas, condiciones y comunidad propias del país.
- **Logística estructurada**: cupo, checklist, inscripciones, recordatorios, todo en un solo lugar.
- **Plataforma de doble lado**: organizadores y caminantes en el mismo sistema.
- **Identidad del caminante**: perfil, historial e insignias que construyen reputación verificable.

---

## 7. Roles de Usuario


| Rol                         | Descripción                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Caminante (hiker)**       | Rol base. Todo usuario que se registra es caminante. Busca, se inscribe y participa en caminatas.                                    |
| **Organizador (organizer)** | Capacidad que se activa al contratar un plan de pago. Permite crear y gestionar eventos. Un caminante puede ser también organizador. |
| **Administrador (admin)**   | Rol interno de la plataforma. Gestiona usuarios, planes y reportes.                                                                  |


Un mismo usuario puede caminar y organizar al mismo tiempo; ser organizador es una capacidad, no una identidad separada.

---

## 8. Modelo de Negocio

> **Nota**: esta sección es una **propuesta inicial generada con apoyo de IA**. Los precios, límites y funcionalidades por plan están sujetos a revisión y validación. Se afinarán a lo largo del curso conforme se valide la propuesta de producto y se discuta con el docente.

El modelo planteado es **freemium** para el organizador. Para el caminante la plataforma es siempre gratuita.


| Plan           | Precio mensual aprox. | Cupo por evento   | Eventos activos | Tienda de clasificados | Otros                                                          |
| -------------- | --------------------- | ----------------- | --------------- | ---------------------- | -------------------------------------------------------------- |
| **Free**       | $0                    | Hasta 10 personas | 1 evento activo | No disponible          | Checklist básico                                               |
| **Pro**        | ~$9                   | Hasta 30 personas | 5 activos       | Hasta 10 productos     | Checklist personalizable, badge "Verificado", analítica básica |
| **Enterprise** | ~$29                  | Sin límite        | Ilimitados      | Productos ilimitados   | Multi-organizador (equipo), soporte prioritario                |


**Notas:**

- La **tienda** funciona como clasificados: la transacción ocurre fuera de la app, Chaski solo es el escaparate.
- El **asistente de IA** se contempla como funcionalidad asociada a los planes superiores en una fase posterior del desarrollo.

---

## 9. Onboarding del Caminante

El primer contacto con la plataforma debe ayudar al caminante a crear su perfil. La intención es construir una identidad útil para personalizar recomendaciones, filtros e insignias.

**Fases del onboarding:**

1. **Registro mínimo**: email, nombre y contraseña.
2. **Wizard de perfil** (saltable, de 1 a 2 minutos): preguntas cortas sobre nivel de experiencia, frecuencia, motivaciones para caminar y zonas favoritas. Al final se entrega valor inmediato (primera insignia + caminatas recomendadas).
3. **Enriquecimiento progresivo**: datos adicionales como foto, biografía, contacto de emergencia o equipo propio se solicitan en el contexto donde tienen sentido (al inscribirse a un evento, al postular como organizador, etc.).

El perfil del caminante alimentará en fases futuras tanto las recomendaciones como el asistente de IA.

---

## 10. Entidades del Sistema

A nivel conceptual, el sistema contempla al menos las siguientes entidades. Las definiciones técnicas (atributos, tipos de datos y relaciones) se trabajarán durante el curso en conjunto con el docente.

- **Usuario**: persona registrada en la plataforma. Puede actuar como caminante y, si tiene un plan activo, también como organizador.
- **Evento**: caminata publicada por un organizador. Contiene fecha, ubicación, dificultad, cupo y descripción.
- **Inscripción**: relación entre un caminante y un evento al que se apuntó. Registra el estado de la inscripción.
- **Ítem del Checklist**: cada elemento de equipo o requisito que un organizador recomienda para su evento.
- **Insignia**: reconocimiento que gana un caminante al cumplir ciertos criterios dentro de la plataforma.
- **Plan**: tipo de suscripción del organizador (Free, Pro, Enterprise), que define los límites y funcionalidades disponibles.

---

## 11. Casos de Uso (MVP)

Más allá de los CRUDs típicos (eventos, ítems del checklist, inscripciones), el MVP contempla los siguientes casos de uso:

1. **Búsqueda y filtrado de eventos** por dificultad, fecha, ubicación y cupo disponible.
2. **Inscripción del caminante a un evento** con validaciones de cupo, fecha y estado del evento.
3. **Cálculo del porcentaje de preparación** del caminante para un evento, a partir de los ítems del checklist marcados.
4. **Asignación automática de insignias** al cumplir ciertos criterios (primera caminata, número de caminatas completadas, dificultad alcanzada, etc.).
5. **Cierre automático de inscripciones** cuando el evento alcanza el cupo máximo o se llega a la fecha límite.
6. **Aplicación de límites del plan** del organizador (no puede crear más eventos ni cupo más alto del que su plan permite).

---

## 12. Próximos Pasos

Esta entrega corresponde a la **definición inicial** del proyecto. Los siguientes pasos antes de comenzar a programar serán:

- Revisar la propuesta con el docente y recibir retroalimentación.
- Definir el stack tecnológico final junto con el docente, alineado a lo que se trabajará durante el curso.
- Diseñar el modelo de datos con base en los casos de uso del MVP.
- Construir un roadmap semanal alineado al cronograma del curso.

---

## 13. Visión a Futuro

Funcionalidades consideradas pero que quedan fuera del alcance inmediato del curso:

- **Caminante Premium**: suscripción para el caminante con beneficios adicionales.
- **Comunidad**: comentarios, fotos compartidas y rankings.
- **Aplicación móvil**.
- **Multi-país**: expansión a otros países con localización.

El enfoque de Chaski es **social y de activación turística**, no de cartografía o e-commerce. Esas capacidades se delegan a plataformas existentes (AllTrails, Google Maps, marketplaces) con las que Chaski puede coexistir.

---

## 14. Autoría

Proyecto académico del curso *Ruby on Rails + React*. Autor: Emmanuel Zuñiga.