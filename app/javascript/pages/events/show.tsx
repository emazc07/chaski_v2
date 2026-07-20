import { Head, Link, usePage } from "@inertiajs/react"

import PublicLayout from "@/components/layout/PublicLayout"

import { difficultyFormLabel } from "@/lib/difficulty"

import type { Event, GearItem, Inscription, SharedProps } from "@/types"

const routeTypeLabels: Record<string, string> = {
  loop: "Circuito",
  out_and_back: "Ida y vuelta",
  point_to_point: "Punto a punto",
}

const statusLabels: Record<string, string> = {
  pending_review: "Pendiente de revisión",
  published: "Publicada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
  completed: "Finalizada",
}

const statusBadgeClasses: Record<string, string> = {
  pending_review: "border-amber-200 bg-amber-50 text-amber-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
  cancelled: "border-gray-200 bg-gray-100 text-gray-700",
  completed: "border-gray-200 bg-gray-100 text-gray-600",
}

function formatStartsAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 16).replace("T", " ")

  return date.toLocaleString("es-CR", {
    dateStyle: "long",
    timeStyle: "short",
  })
}

function formatPrice(priceCrc: number): string {
  if (priceCrc === 0) return "Gratis"

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(priceCrc)
}

type DetailItemProps = {
  label: string
  value: string
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-gray-900">{value}</dd>
    </div>
  )
}

export default function EventsShow({
  event,
  can_manage,
  inscription,
  marked_gear_item_ids = [],
}: {
  event: Event
  can_manage: boolean
  inscription: Inscription | null
  marked_gear_item_ids?: number[]
}) {
  const { auth } = usePage<SharedProps>().props
  const user = auth?.user
  const isInscribed = inscription?.status === "active"
  const inscriptionUrl = `/events/${event.id}/inscription`

  const gearItems = event.gear_items ?? []
  const markedSet = new Set(marked_gear_item_ids)
  const canMarkGear = Boolean(user && isInscribed)

  function markUrl(item: GearItem) {
    return `/events/${event.id}/gear_items/${item.id}/mark`
  }

  const difficultyLabel = difficultyFormLabel(event.difficulty)
  const routeTypeLabel = routeTypeLabels[event.route_type] ?? event.route_type
  const statusLabel = statusLabels[event.status] ?? event.status

  const showStatusBadge = can_manage && event.status !== "published"

  return (
    <PublicLayout>
      <Head title={event.title} />

      <div className="bg-chaski-bg">
        <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
          {/* Cover placeholder — Visily uses a hero image; Active Storage deferred */}
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
              <span className="rounded-full bg-chaski-green/10 px-3 py-1 text-sm font-medium text-chaski-green-dark">
                {difficultyLabel}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {routeTypeLabel}
              </span>
              {showStatusBadge && (
                <span
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${statusBadgeClasses[event.status] ?? "border-amber-200 bg-amber-50 text-amber-800"}`}
                >
                  {statusLabel}
                </span>
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

          {gearItems.length > 0 && (
            <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Equipo necesario</h2>
              {!canMarkGear && (
                <p className="mt-1 text-sm text-gray-500">
                  {user
                    ? "Inscribite para marcar lo que ya tenés."
                    : "Inicia sesión e inscribite para marcar tu equipo."}
                </p>
              )}

              <ul className="mt-4 divide-y divide-gray-100">
                {gearItems.map((item) => {
                  const marked = markedSet.has(item.id)

                  return (
                    <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      {canMarkGear ? (
                        <Link
                          href={markUrl(item)}
                          method={marked ? "delete" : "post"}
                          as="button"
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                            marked
                              ? "border-chaski-green bg-chaski-green text-white"
                              : "border-gray-300 bg-white text-transparent"
                          }`}
                          aria-label={marked ? `Desmarcar ${item.name}` : `Marcar ${item.name}`}
                        >
                          ✓
                        </Link>
                      ) : (
                        <span
                          aria-hidden
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-200 bg-gray-50 text-xs text-gray-400"
                        >
                          ✓
                        </span>
                      )}

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            marked ? "text-gray-500 line-through" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                          {item.required && (
                            <span className="ml-2 text-xs font-normal text-gray-500">
                              (requerido)
                            </span>
                          )}
                        </p>
                        {item.description && (
                          <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          {!user ? (
            <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <Link
                href="/users/sign_in"
                className="inline-block rounded-md bg-chaski-green px-6 py-3 text-sm font-medium text-white hover:bg-chaski-green/90"
              >
                Inicia sesión para inscribirte
              </Link>
              <p className="mt-2 text-sm text-gray-500">
                Necesitas una cuenta para inscribirte en esta caminata.
              </p>
            </section>
          ) : isInscribed ? (
            <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-chaski-green-dark">
                Ya estás inscrito en esta caminata.
              </p>
              <Link
                href={inscriptionUrl}
                method="delete"
                as="button"
                className="mt-4 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                onBefore={() => window.confirm("¿Cancelar tu inscripción?")}
              >
                Cancelar inscripción
              </Link>
            </section>
          ) : (
            <section className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <Link
                href={inscriptionUrl}
                method="post"
                as="button"
                className="inline-block rounded-md bg-chaski-green px-6 py-3 text-sm font-medium text-white hover:bg-chaski-green/90"
              >
                Inscribirme
              </Link>
            </section>
          )}

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
    </PublicLayout>
  )
}
