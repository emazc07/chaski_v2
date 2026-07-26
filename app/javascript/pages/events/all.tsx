import { Head, Link } from "@inertiajs/react"

import { HikesGrid } from "@/components/events/HikesGrid"
import PublicLayout from "@/components/layout/PublicLayout"

import type { EventListItem } from "@/types"

export default function EventsAll({ events }: { events: EventListItem[] }) {
  return (
    <PublicLayout>
      <Head title="Todas las caminatas" />

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <header className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-chaski-green"
          >
            <ArrowLeftIcon />
            Volver
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">
            Todas las caminatas
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {events.length === 0
              ? "Explorá caminatas publicadas por la comunidad."
              : `${events.length} caminata${events.length === 1 ? "" : "s"} disponible${events.length === 1 ? "" : "s"}`}
          </p>
        </header>

        {events.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-600 shadow-sm">
            No hay caminatas publicadas aún.
          </p>
        ) : (
          <HikesGrid events={events} />
        )}
      </div>
    </PublicLayout>
  )
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}
