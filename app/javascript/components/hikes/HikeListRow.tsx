import { Link } from "@inertiajs/react"

import { formatEventDateLong } from "@/lib/dates"
import { difficultyFormLabel } from "@/lib/difficulty"

import type { HikeInscription } from "@/types"

type HikeListRowProps = {
  inscription: HikeInscription
}

export function HikeListRow({ inscription }: HikeListRowProps) {
  const coverUrl = inscription.event.cover_image_card_url
  const isPending = inscription.status === "pending"

  return (
    <li>
      <Link
        href={`/events/${inscription.event.id}`}
        className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-colors hover:border-chaski-green/30"
      >
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-stone-200">
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
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 truncate font-semibold text-gray-900">
              {inscription.event.title}
            </h3>
            {isPending && (
              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-800 uppercase">
                Pendiente
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-gray-600">
            {formatEventDateLong(inscription.event.starts_at)} · {inscription.event.custom_location}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {isPending
              ? "Pendiente de confirmación"
              : difficultyFormLabel(inscription.event.difficulty)}
          </p>
        </div>
      </Link>
    </li>
  )
}
