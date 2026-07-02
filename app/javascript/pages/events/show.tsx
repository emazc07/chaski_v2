import type { ReactElement } from "react"

import { Head, Link } from "@inertiajs/react"

import DetailItem from "@/components/events/DetailItem"
import EventBadge from "@/components/events/EventBadge"
import PublicLayout from "@/components/layout/PublicLayout"
import {
  difficultyLabels,
  formatPrice,
  formatStartsAt,
  routeTypeLabels,
  statusBadgeClasses,
  statusLabels,
} from "@/lib/eventLabels"

import type { Event } from "@/types"

type EventsShowProps = {
  event: Event
  can_manage: boolean
}

export default function EventsShow({ event, can_manage }: EventsShowProps) {
  const difficultyLabel = difficultyLabels[event.difficulty] ?? event.difficulty
  const routeTypeLabel = routeTypeLabels[event.route_type] ?? event.route_type
  const statusLabel = statusLabels[event.status] ?? event.status

  const showStatusBadge = can_manage && event.status !== "published"

  return (
    <div className="bg-chaski-bg">
      <Head title={event.title} />

      <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
        <div
          aria-hidden
          className="h-40 rounded-lg border border-gray-200 bg-gradient-to-br from-chaski-green/20 via-chaski-bg to-gray-100"
        />

        <Link
          href="/events"
          className="mt-6 inline-block text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Volver a caminatas
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          <p className="mt-2 text-base font-medium text-chaski-green-dark">
            {event.custom_location}
          </p>
          <p className="mt-3 text-lg text-gray-700">{event.description_short}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <EventBadge
              label={difficultyLabel}
              className="bg-chaski-green/10 text-chaski-green-dark"
            />
            <EventBadge label={routeTypeLabel} />
            {showStatusBadge && (
              <EventBadge
                label={statusLabel}
                className={`border ${statusBadgeClasses[event.status] ?? "border-amber-200 bg-amber-50 text-amber-800"}`}
              />
            )}
          </div>
        </header>

        <section className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Detalles de la caminata</h2>

          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Fecha y hora" value={formatStartsAt(event.starts_at)} />
            <DetailItem label="Punto de encuentro" value={event.meeting_point} />
            <DetailItem label="Distancia" value={`${event.distance_km} km`} />
            <DetailItem label="Desnivel" value={`${event.elevation_gain_m} m`} />
            <DetailItem label="Duración estimada" value={`${event.duration_hours} h`} />
            <DetailItem label="Cupo máximo" value={`${event.max_participants} participantes`} />
            <DetailItem label="Precio" value={formatPrice(event.price_crc)} />
          </dl>
        </section>

        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Descripción</h2>
          <div className="prose prose-gray mt-4 max-w-none whitespace-pre-line text-gray-700">
            {event.description_long}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <button
            type="button"
            disabled
            className="w-full rounded-md bg-chaski-green px-4 py-3 text-sm font-medium text-white opacity-60 sm:w-auto sm:px-6"
          >
            Inscribirme (próximamente)
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Las inscripciones estarán disponibles en una fase posterior.
          </p>
        </section>

        {can_manage && (
          <section className="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">
            <Link
              href={`/events/${event.id}/edit`}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Editar
            </Link>
            <Link
              href={`/events/${event.id}`}
              method="delete"
              as="button"
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              onBefore={() => window.confirm("¿Eliminar esta caminata?")}
            >
              Eliminar
            </Link>
          </section>
        )}
      </div>
    </div>
  )
}

EventsShow.layout = (page: ReactElement<EventsShowProps>) => (
  <PublicLayout>{page}</PublicLayout>
)
