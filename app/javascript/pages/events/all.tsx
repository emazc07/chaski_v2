import { Head, Link } from "@inertiajs/react"

import { EventsFilterBar } from "@/components/events/EventsFilterBar"
import { ActiveFilterChips } from "@/components/events/ActiveFilterChips"
import { HikesGrid } from "@/components/events/HikesGrid"
import PublicLayout from "@/components/layout/PublicLayout"

import type { EventListItem } from "@/types"

type EventsAllProps = {
  events: EventListItem[]
  q?: string | null
  difficulty?: string | null
  zone?: string | null
  date?: string | null
  total_count?: number
}

export default function EventsAll({
  events,
  q,
  difficulty,
  zone,
  date,
  total_count,
}: EventsAllProps) {
  const hasFilters = Boolean(q?.trim() || difficulty || zone || date)
  const count = total_count ?? events.length

  return (
    <PublicLayout>
      <Head title={q?.trim() ? `Caminatas — ${q}` : "Próximas caminatas"} />

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <header className="mb-6">
          <nav className="text-sm text-stone-500">
            <Link href="/events" className="hover:text-chaski-green">
              Inicio
            </Link>
            <span className="mx-1.5">›</span>
            <span className="font-medium text-chaski-green-dark">Caminatas</span>
          </nav>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-chaski-heading sm:text-3xl">
                {q?.trim() ? `Resultados para “${q}”` : "Próximas caminatas"}
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Descubrí caminatas guiadas en todo Costa Rica
              </p>
            </div>

            <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-chaski-green-dark ring-1 ring-amber-100">
              {count} caminata{count === 1 ? "" : "s"} disponible{count === 1 ? "" : "s"}
            </span>
          </div>
        </header>

        <div className="mb-8">
          <EventsFilterBar
            key={[q, difficulty, zone, date].join("|")}
            q={q}
            difficulty={difficulty}
            zone={zone}
            date={date}
          />
          <ActiveFilterChips q={q} difficulty={difficulty} zone={zone} date={date} />
        </div>

        {events.length === 0 ? (
          <p className="rounded-xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-600 shadow-sm">
            {hasFilters ? "No hay caminatas con esos filtros." : "No hay caminatas publicadas aún."}
          </p>
        ) : (
          <HikesGrid events={events} />
        )}
      </div>
    </PublicLayout>
  )
}
