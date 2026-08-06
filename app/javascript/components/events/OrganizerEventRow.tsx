import { Link } from "@inertiajs/react"

import { formatEventDateLong } from "@/lib/dates"
import { difficultyFormLabel } from "@/lib/difficulty"
import { statusBadgeClasses, statusLabels } from "@/lib/eventLabels"

import type { OrganizerEvent, OrganizerInscription } from "@/types"

type OrganizerEventRowProps = {
  event: OrganizerEvent
  expanded: boolean
  canEdit: boolean
  onToggleExpand: () => void
  onRequestDelete: () => void
  onRequestRemoveHiker: (inscription: OrganizerInscription) => void
}

function statusBadge(status: string) {
  if (status === "published") return null

  const label = statusLabels[status] ?? status
  const classes = statusBadgeClasses[status] ?? "border-gray-200 bg-gray-100 text-gray-700"

  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${classes}`}
    >
      {label}
    </span>
  )
}

function inscriptionStatusBadge(status: string) {
  if (status === "pending") {
    return (
      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800 uppercase">
        Pendiente
      </span>
    )
  }

  return (
    <span className="shrink-0 rounded-full bg-chaski-green/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-chaski-green-dark uppercase">
      Confirmado
    </span>
  )
}

function HikerAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?"

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-stone-200"
      />
    )
  }

  return (
    <span
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600"
    >
      {initial}
    </span>
  )
}

export function OrganizerEventRow({
  event,
  expanded,
  canEdit,
  onToggleExpand,
  onRequestDelete,
  onRequestRemoveHiker,
}: OrganizerEventRowProps) {
  const coverUrl = event.cover_image_card_url
  const totalHikers = event.confirmed_count + event.pending_count
  const canExpand = totalHikers > 0

  return (
    <li className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-start">
        <div className="relative h-16 w-full shrink-0 overflow-hidden rounded-md bg-stone-200 sm:w-24">
          {coverUrl ? (
            <img src={coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-chaski-green/30 to-stone-300"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="min-w-0 flex-1 font-semibold text-gray-900">{event.title}</h3>
            {statusBadge(event.status)}
          </div>
          <p className="mt-0.5 truncate text-sm text-gray-600">
            {formatEventDateLong(event.starts_at)} · {event.custom_location}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">{difficultyFormLabel(event.difficulty)}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
            <span>
              <span className="font-semibold text-chaski-green-dark">{event.confirmed_count}</span>{" "}
              confirmado{event.confirmed_count === 1 ? "" : "s"}
            </span>
            <span className="text-stone-300">·</span>
            <span>
              <span className="font-semibold text-amber-800">{event.pending_count}</span> pendiente
              {event.pending_count === 1 ? "" : "s"}
            </span>
            {canExpand && (
              <button
                type="button"
                onClick={onToggleExpand}
                className="font-medium text-chaski-green hover:text-chaski-green-dark"
                aria-expanded={expanded}
              >
                {expanded ? "Ocultar lista" : "Ver caminantes"}
              </button>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col sm:items-stretch">
          {canEdit && (
            <Link
              href={`/events/${event.id}/edit`}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Editar
            </Link>
          )}
          <button
            type="button"
            onClick={onRequestDelete}
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      </div>

      {expanded && canExpand && (
        <ul className="space-y-2 border-t border-stone-100 bg-stone-50/80 px-3 py-3">
          {event.inscriptions.map((inscription) => (
            <li
              key={inscription.id}
              className="flex items-center gap-3 rounded-md border border-stone-200 bg-white px-3 py-2"
            >
              <HikerAvatar name={inscription.user.name} avatarUrl={inscription.user.avatar_url} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {inscription.user.name}
                </p>
              </div>
              {inscriptionStatusBadge(inscription.status)}
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onRequestRemoveHiker(inscription)}
                  className="shrink-0 text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Quitar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}
