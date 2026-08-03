import { Link } from "@inertiajs/react"

import { formatEventDateLong } from "@/lib/dates"
import { difficultyFormLabel } from "@/lib/difficulty"

import type { HikeInscription } from "@/types"

type HikeListRowProps = {
  inscription: HikeInscription
}

export function HikeListRow({ inscription }: HikeListRowProps) {
  const coverUrl = inscription.event.cover_image_card_url

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
          <h3 className="truncate font-semibold text-gray-900">{inscription.event.title}</h3>
          <p className="mt-0.5 truncate text-sm text-gray-600">
            {formatEventDateLong(inscription.event.starts_at)} · {inscription.event.custom_location}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {difficultyFormLabel(inscription.event.difficulty)}
          </p>
        </div>
      </Link>
    </li>
  )
}
