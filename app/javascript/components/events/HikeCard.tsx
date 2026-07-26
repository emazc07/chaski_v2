import { Link } from "@inertiajs/react"

import { DifficultyBadge } from "@/components/events/DifficultyBadge"
import { formatEventDateShort } from "@/lib/dates"

import type { EventListItem } from "@/types"

const placeholderGradients = [
  "from-chaski-green/30 to-stone-200",
  "from-amber-200/80 to-stone-200",
  "from-sky-200/80 to-stone-200",
]

function organizerInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

type HikeCardProps = {
  event: EventListItem
}

export function HikeCard({ event }: HikeCardProps) {
  const gradient = placeholderGradients[event.id % placeholderGradients.length]

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-36 bg-stone-200">
        <div
          aria-hidden
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
        />
        <div className="absolute left-2.5 top-2.5">
          <DifficultyBadge difficulty={event.difficulty} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3.5 py-3">
        <h2 className="line-clamp-2 text-sm font-bold leading-snug text-stone-900 group-hover:text-chaski-green-dark">
          {event.title}
        </h2>

        <div className="mt-2 space-y-1">
          <p className="flex items-center gap-1.5 text-xs text-stone-500">
            <CalendarIcon />
            {formatEventDateShort(event.starts_at)}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-stone-500">
            <MapPinIcon />
            <span className="line-clamp-1">{event.custom_location}</span>
          </p>
        </div>

        {event.organizer && (
          <>
            <hr className="my-2.5 border-stone-100" />
            <div className="mt-auto flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chaski-green/15 text-[10px] font-bold text-chaski-green-dark"
              >
                {organizerInitials(event.organizer.name)}
              </span>
              <span className="truncate text-xs font-medium text-stone-700">
                {event.organizer.name}
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  )
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden
      className="h-3.5 w-3.5 shrink-0 text-stone-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
      />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden
      className="h-3.5 w-3.5 shrink-0 text-stone-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
      />
    </svg>
  )
}