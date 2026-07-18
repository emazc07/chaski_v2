import { HikeCard } from "@/components/events/HikeCard"

import type { EventListItem } from "@/types"

type HikesGridProps = {
  events: EventListItem[]
}

export function HikesGrid({ events }: HikesGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <li key={event.id}>
          <HikeCard event={event} />
        </li>
      ))}
    </ul>
  )
}