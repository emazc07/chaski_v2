import { Head, Link } from "@inertiajs/react"

import { ActiveFilterChips } from "@/components/events/ActiveFilterChips"
import { EventsFilterBar } from "@/components/events/EventsFilterBar"
import { HikeListRow } from "@/components/hikes/HikeListRow"
import PublicLayout from "@/components/layout/PublicLayout"

import type { HikeInscription } from "@/types"

const FILTER_PATH = "/hikes/mine/all"
const FILTER_ONLY = ["upcoming", "past", "q", "difficulty", "zone", "date", "total_count"]

type HikesAllProps = {
  upcoming: HikeInscription[]
  past: HikeInscription[]
  q?: string | null
  difficulty?: string | null
  zone?: string | null
  date?: string | null
  total_count?: number
}

export default function HikesAll({
  upcoming,
  past,
  q,
  difficulty,
  zone,
  date,
  total_count,
}: HikesAllProps) {
  const hasFilters = Boolean(q?.trim() || difficulty || zone || date)
  const count = total_count ?? upcoming.length + past.length
  const isEmpty = upcoming.length === 0 && past.length === 0

  return (
    <PublicLayout>
      <Head title={q?.trim() ? `Mis caminatas — ${q}` : "Mis caminatas"} />

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <header className="mb-6">
          <nav className="text-sm text-stone-500">
            <Link href="/hikes/mine" className="hover:text-chaski-green">
              Mis caminatas
            </Link>
            <span className="mx-1.5">›</span>
            <span className="font-medium text-chaski-green-dark">Todas</span>
          </nav>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-chaski-heading sm:text-3xl">
                {q?.trim() ? `Resultados para “${q}”` : "Todas mis caminatas"}
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Próximas e historial de caminatas en las que participaste
              </p>
            </div>

            <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-chaski-green-dark ring-1 ring-amber-100">
              {count} caminata{count === 1 ? "" : "s"}
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
            path={FILTER_PATH}
            only={FILTER_ONLY}
          />
          <ActiveFilterChips
            q={q}
            difficulty={difficulty}
            zone={zone}
            date={date}
            path={FILTER_PATH}
            only={FILTER_ONLY}
          />
        </div>

        {isEmpty ? (
          <p className="rounded-xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-600 shadow-sm">
            {hasFilters
              ? "No hay caminatas con esos filtros."
              : "Todavía no estás inscrito en ninguna caminata."}
          </p>
        ) : (
          <div className="space-y-10">
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900">Próximas</h2>
                <ul className="mt-3 space-y-3">
                  {upcoming.map((inscription) => (
                    <HikeListRow key={inscription.id} inscription={inscription} />
                  ))}
                </ul>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900">Anteriores</h2>
                <ul className="mt-3 space-y-3">
                  {past.map((inscription) => (
                    <HikeListRow key={inscription.id} inscription={inscription} />
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
