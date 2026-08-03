import { Link } from "@inertiajs/react"

import { formatPrice } from "@/lib/eventLabels"

import type { EventOrganizer } from "@/types"

type EventBookingCardProps = {
  priceCrc: number
  inscriptionUrl: string
  isInscribed: boolean
  isAuthenticated: boolean
  organizer?: EventOrganizer | null
  canManage: boolean
  eventId: number
  onCancelClick: () => void
}

function organizerInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function EventBookingCard({
  priceCrc,
  inscriptionUrl,
  isInscribed,
  isAuthenticated,
  organizer,
  canManage,
  eventId,
  onCancelClick,
}: EventBookingCardProps) {
  const priceLabel = formatPrice(priceCrc)

  return (
    <aside className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
        Costo estimado
      </p>
      <p className="mt-1 text-2xl font-bold text-stone-900">
        {priceCrc === 0 ? (
          priceLabel
        ) : (
          <>
            {priceLabel}
            <span className="text-base font-medium text-stone-500"> /persona</span>
          </>
        )}
      </p>

      <div className="mt-5">
        {!isAuthenticated ? (
          <>
            <Link
              href="/users/sign_in"
              className="flex w-full items-center justify-center rounded-lg bg-chaski-green px-4 py-3 text-sm font-semibold text-white hover:bg-chaski-green-dark"
            >
              Inscribirme ahora
            </Link>
            <p className="mt-3 text-center text-xs leading-relaxed text-stone-500">
              Iniciá sesión para inscribirte. Al inscribirse, se enviará una notificación al
              organizador para coordinar el pago.
            </p>
          </>
        ) : isInscribed ? (
          <>
            <p className="text-sm font-medium text-chaski-green-dark">
              Ya estás inscrito en esta caminata.
            </p>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center rounded-lg border border-red-300 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
              onClick={onCancelClick}
            >
              Cancelar inscripción
            </button>
          </>
        ) : (
          <>
            <Link
              href={inscriptionUrl}
              method="post"
              as="button"
              className="flex w-full items-center justify-center rounded-lg bg-chaski-green px-4 py-3 text-sm font-semibold text-white hover:bg-chaski-green-dark"
            >
              Inscribirme ahora
            </Link>
            <p className="mt-3 text-center text-xs leading-relaxed text-stone-500">
              Al inscribirse, se enviará una notificación al organizador para coordinar el pago.
            </p>
          </>
        )}
      </div>

      {organizer && (
        <>
          <hr className="my-5 border-stone-100" />
          <div className="flex items-center gap-3">
            {organizer.avatar_url ? (
              <img
                src={organizer.avatar_url}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-chaski-green/15 text-sm font-bold text-chaski-green-dark"
              >
                {organizerInitials(organizer.name)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-900">{organizer.name}</p>
              <p className="text-xs text-stone-500">Organizador</p>
            </div>
          </div>
        </>
      )}

      {canManage && (
        <div className="mt-5 flex flex-wrap gap-2 border-t border-stone-100 pt-5">
          <Link
            href={`/events/${eventId}/edit`}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Editar
          </Link>
          <Link
            href={`/events/${eventId}`}
            method="delete"
            as="button"
            className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            onBefore={() => window.confirm("¿Eliminar esta caminata?")}
          >
            Eliminar
          </Link>
        </div>
      )}
    </aside>
  )
}
