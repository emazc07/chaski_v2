import { Head, Link } from "@inertiajs/react"

import { HikesGrid } from "@/components/events/HikesGrid"
import { HeroBanner } from "@/components/home/HeroBanner"
import { ChaskiHow } from "@/components/layout/ChaskiHow"
import PublicLayout from "@/components/layout/PublicLayout"

import type { EventListItem } from "@/types"

type EventsIndexProps = {
  events: EventListItem[]
  total_count: number
}

export default function EventsIndex({ events, total_count }: EventsIndexProps) {
  const showViewAllLink = total_count > events.length

  return (
    <PublicLayout>
      <Head title="Chaski — Caminatas" />

      <HeroBanner />

      <div id="proximas-caminatas" className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Próximas caminatas
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Descubrí lo que se viene este mes
            </p>
          </div>

          {showViewAllLink && (
            <Link
              href="/events/all"
              className="inline-flex items-center gap-1 text-sm font-bold text-chaski-green hover:text-chaski-green-dark"
            >
              Ver todas las caminatas
              <ArrowRightIcon />
            </Link>
          )}
        </header>

        {events.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-600 shadow-sm">
            No hay caminatas publicadas aún.
          </p>
        ) : (
          <HikesGrid events={events} />
        )}
      </div>
      <ChaskiHow/>
    </PublicLayout>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}






