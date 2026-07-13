import { Head, Link, usePage } from "@inertiajs/react"
  
import PublicLayout from "@/components/layout/PublicLayout"

import type { FeaturedEvent, HikeInscription, SharedProps } from "@/types"

const difficultyLabels: Record<string, string> = {
  easy: "Fácil",
  moderate: "Moderada",
  hard: "Difícil",
  extreme: "Extrema",
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)

  return date.toLocaleDateString("es-CR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function daysUntil(value: string): number | null {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

type QuickAction = {
  label: string
  href: string
  disabled?: boolean
}

export default function HikesMine({
  next_hike,
  featured_events,
}: {
  upcoming: HikeInscription[]
  past: HikeInscription[]
  cancelled: HikeInscription[]
  next_hike: HikeInscription | null
  featured_events: FeaturedEvent[]
}) {
  const { auth } = usePage<SharedProps>().props
  const user = auth?.user
  const firstName = user?.name?.split(" ")[0] ?? "caminante"

  const quickActions: QuickAction[] = [
    { label: "Mi perfil", href: "#", disabled: true },
    { label: "Mis caminatas", href: "#", disabled: true },
    { label: "Mis insignias", href: "#", disabled: true },
    ...(user?.admin ? [{ label: "Crear evento", href: "/events/new" }] : []),
  ]

  return (
    <PublicLayout>
      <Head title="Mis caminatas" />

      <div className="mx-auto max-w-5xl px-6 pt-8 pb-12">
        {next_hike ? (
          <section className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Hola, {firstName}</h1>
            <p className="mt-2 text-gray-600">
              {(() => {
                const days = daysUntil(next_hike.event.starts_at)
                if (days === null) return "Tu próxima aventura te espera."
                if (days === 0) {
                  return (
                    <>
                      Tu próxima caminata es{" "}
                      <span className="font-semibold text-chaski-green">hoy</span>
                    </>
                  )
                }
                if (days === 1) {
                  return (
                    <>
                      Tu próxima caminata es en{" "}
                      <span className="font-semibold text-chaski-green">1 día</span>
                    </>
                  )
                }
                if (days > 0) {
                  return (
                    <>
                      Tu próxima caminata es en{" "}
                      <span className="font-semibold text-chaski-green">{days} días</span>
                    </>
                  )
                }
                return "Tu próxima aventura te espera."
              })()}
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-chaski-green/30 via-stone-800 to-stone-900 p-6 text-white shadow-sm">
              <span className="inline-block rounded-full bg-chaski-green px-3 py-1 text-xs font-bold uppercase tracking-wide">
                Próxima aventura
              </span>
              <h2 className="mt-4 text-2xl font-bold">{next_hike.event.title}</h2>
              <p className="mt-2 text-sm text-white/90">
                {formatDate(next_hike.event.starts_at)} · {next_hike.event.custom_location}
              </p>
              <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                {difficultyLabels[next_hike.event.difficulty] ?? next_hike.event.difficulty}
              </span>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/events/${next_hike.event.id}`}
                  className="rounded-full bg-chaski-green px-5 py-2 text-sm font-bold text-white hover:bg-chaski-green-dark"
                >
                  Ver detalles
                </Link>
                <Link
                  href={`/events/${next_hike.event.id}/inscription`}
                  method="delete"
                  as="button"
                  className="rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white hover:bg-white/10"
                  onBefore={() => window.confirm("¿Cancelar tu inscripción?")}
                >
                  Cancelar inscripción
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="mb-10 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <span className="inline-block rounded-full bg-chaski-green/10 px-3 py-1 text-xs font-medium text-chaski-green-dark">
              Bienvenido de vuelta
            </span>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Hola, {firstName}</h1>
            <p className="mt-2 text-xl font-medium text-stone-600">
              Tu próxima caminata te está esperando.
            </p>
            <p className="mt-3 max-w-xl text-gray-600">
              Unite a la comunidad y descubrí caminatas publicadas cerca de vos.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-block rounded-full bg-chaski-green px-6 py-3 text-sm font-bold text-white hover:bg-chaski-green-dark"
            >
              Explorar caminatas
            </Link>
          </section>
        )}

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Caminatas para vos</h2>
            <Link
              href="/events"
              className="text-sm font-bold text-chaski-green hover:text-chaski-green-dark"
            >
              Ver todas →
            </Link>
          </div>

          {featured_events.length === 0 ? (
            <p className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
              No hay caminatas publicadas aún.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-3">
              {featured_events.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div
                    aria-hidden
                    className="mb-3 h-24 rounded-md bg-gradient-to-br from-chaski-green/20 to-gray-100"
                  />
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{event.custom_location}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(event.starts_at)} ·{" "}
                    {difficultyLabels[event.difficulty] ?? event.difficulty}
                  </p>
                  <Link
                    href={`/events/${event.id}`}
                    className="mt-auto pt-4 text-sm font-medium text-chaski-green hover:text-chaski-green-dark"
                  >
                    Ver →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Acciones rápidas</h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((action) => (
              <li key={action.label}>
                {action.disabled ? (
                  <div
                    aria-disabled
                    className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 opacity-60 shadow-sm"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-chaski-green/10 text-lg text-chaski-green">
                      •
                    </span>
                    <span className="mt-3 text-center text-sm font-semibold text-gray-900">
                      {action.label}
                    </span>
                    <span className="mt-1 text-xs text-gray-500">Próximamente</span>
                  </div>
                ) : (
                  <Link
                    href={action.href}
                    className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:border-chaski-green/30"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-chaski-green/10 text-lg text-chaski-green">
                      +
                    </span>
                    <span className="mt-3 text-center text-sm font-semibold text-gray-900">
                      {action.label}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PublicLayout>
  )
}