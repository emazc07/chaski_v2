import { Head, Link, router, usePage } from "@inertiajs/react"
import { useState } from "react"

import { HikeListRow } from "@/components/hikes/HikeListRow"
import PublicLayout from "@/components/layout/PublicLayout"
import ConfirmDialog from "@/components/ui/ConfirmDialog"

import { formatEventDateLong } from "@/lib/dates"
import { difficultyFormLabel } from "@/lib/difficulty"

import type { FeaturedEvent, HikeInscription, SharedProps } from "@/types"

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
  upcoming,
  past,
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
  const [cancelOpen, setCancelOpen] = useState(false)

  const otherUpcoming = upcoming.slice(1, 4)
  const showVerTodas = upcoming.length > 4 || past.length > 0
  const highlightCoverUrl =
    next_hike?.event.cover_image_hero_url ?? next_hike?.event.cover_image_card_url

  const quickActions: QuickAction[] = [
    { label: "Mi perfil", href: "#", disabled: true },
    { label: "Mis caminatas", href: "/hikes/mine/all" },
    { label: "Mis insignias", href: "#", disabled: true },
    ...(user?.admin ? [{ label: "Crear evento", href: "/events/new" }] : []),
  ]

  function confirmCancelInscription() {
    if (!next_hike) return
    setCancelOpen(false)
    router.delete(`/events/${next_hike.event.id}/inscription`)
  }

  return (
    <PublicLayout>
      <Head title="Mis caminatas" />

      <ConfirmDialog
        open={cancelOpen}
        variant="destructive"
        title="¿Cancelar tu inscripción?"
        description="Vas a dejar de estar inscrito en esta caminata. Podés volver a inscribirte después si hay cupo."
        primaryLabel="Sí, cancelar"
        secondaryLabel="Volver"
        onPrimary={confirmCancelInscription}
        onSecondary={() => setCancelOpen(false)}
        onClose={() => setCancelOpen(false)}
      />

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

            <div className="relative mt-6 overflow-hidden rounded-lg border border-gray-200 text-white shadow-sm">
              {highlightCoverUrl ? (
                <img
                  src={highlightCoverUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-br from-chaski-green/40 via-stone-800 to-stone-900"
                />
              )}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20"
              />
              <div className="relative p-6 sm:p-8">
                <span className="inline-block rounded-full bg-chaski-green px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  Próxima aventura
                </span>
                <h2 className="mt-4 text-2xl font-bold drop-shadow-sm">{next_hike.event.title}</h2>
                <p className="mt-2 text-sm text-white/90">
                  {formatEventDateLong(next_hike.event.starts_at)} ·{" "}
                  {next_hike.event.custom_location}
                </p>
                <span className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                  {difficultyFormLabel(next_hike.event.difficulty)}
                </span>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/events/${next_hike.event.id}`}
                    className="rounded-full bg-chaski-green px-5 py-2 text-sm font-bold text-white hover:bg-chaski-green-dark"
                  >
                    Ver detalles
                  </Link>
                  <button
                    type="button"
                    className="rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white hover:bg-white/10"
                    onClick={() => setCancelOpen(true)}
                  >
                    Cancelar inscripción
                  </button>
                </div>
              </div>
            </div>

            {otherUpcoming.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold text-gray-900">Otras próximas</h2>
                <ul className="mt-3 space-y-3">
                  {otherUpcoming.map((inscription) => (
                    <HikeListRow key={inscription.id} inscription={inscription} />
                  ))}
                </ul>
                {showVerTodas && (
                  <Link
                    href="/hikes/mine/all"
                    className="mt-4 inline-block text-sm font-bold text-chaski-green hover:text-chaski-green-dark"
                  >
                    Ver todas mis caminatas →
                  </Link>
                )}
              </div>
            )}

            {otherUpcoming.length === 0 && showVerTodas && (
              <Link
                href="/hikes/mine/all"
                className="mt-6 inline-block text-sm font-bold text-chaski-green hover:text-chaski-green-dark"
              >
                Ver todas mis caminatas →
              </Link>
            )}
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
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/events"
                className="inline-block rounded-full bg-chaski-green px-6 py-3 text-sm font-bold text-white hover:bg-chaski-green-dark"
              >
                Explorar caminatas
              </Link>
              {past.length > 0 && (
                <Link
                  href="/hikes/mine/all"
                  className="inline-block rounded-full border border-chaski-green px-6 py-3 text-sm font-bold text-chaski-green hover:bg-chaski-green/5"
                >
                  Ver historial
                </Link>
              )}
            </div>
          </section>
        )}

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Caminatas para vos</h2>
            <Link
              href="/events/all"
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
              {featured_events.map((event) => {
                const coverUrl = event.cover_image_card_url
                return (
                  <li
                    key={event.id}
                    className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="relative mb-3 h-24 overflow-hidden rounded-md bg-stone-200">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-gradient-to-br from-chaski-green/20 to-gray-100"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{event.custom_location}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatEventDateLong(event.starts_at)} ·{" "}
                      {difficultyFormLabel(event.difficulty)}
                    </p>
                    <Link
                      href={`/events/${event.id}`}
                      className="mt-auto pt-4 text-sm font-medium text-chaski-green hover:text-chaski-green-dark"
                    >
                      Ver →
                    </Link>
                  </li>
                )
              })}
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
