import { Head, Link, router } from "@inertiajs/react"
import { useState } from "react"

import { ActiveFilterChips } from "@/components/events/ActiveFilterChips"
import { EventsFilterBar } from "@/components/events/EventsFilterBar"
import { OrganizerEventRow } from "@/components/events/OrganizerEventRow"
import PublicLayout from "@/components/layout/PublicLayout"
import ConfirmDialog from "@/components/ui/ConfirmDialog"

import type { OrganizerEvent, OrganizerInscription } from "@/types"

const FILTER_PATH = "/events/mine"
const FILTER_ONLY = ["upcoming", "past", "q", "difficulty", "zone", "date", "total_count"]

type EventsMineProps = {
  upcoming: OrganizerEvent[]
  past: OrganizerEvent[]
  q?: string | null
  difficulty?: string | null
  zone?: string | null
  date?: string | null
  total_count?: number
}

export default function EventsMine({
  upcoming,
  past,
  q,
  difficulty,
  zone,
  date,
  total_count,
}: EventsMineProps) {
  const hasFilters = Boolean(q?.trim() || difficulty || zone || date)
  const count = total_count ?? upcoming.length + past.length
  const isEmpty = upcoming.length === 0 && past.length === 0
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [deleteEventId, setDeleteEventId] = useState<number | null>(null)
  const [removeTarget, setRemoveTarget] = useState<{
    eventId: number
    inscription: OrganizerInscription
  } | null>(null)

  function confirmDeleteEvent() {
    if (deleteEventId == null) return
    const id = deleteEventId
    setDeleteEventId(null)
    router.delete(`/events/${id}`)
  }

  function confirmRemoveHiker() {
    if (!removeTarget) return
    const { eventId, inscription } = removeTarget
    setRemoveTarget(null)
    router.delete(`/events/${eventId}/inscriptions/${inscription.id}`)
  }

  function renderEventRow(event: OrganizerEvent, canEdit: boolean) {
    return (
      <OrganizerEventRow
        key={event.id}
        event={event}
        canEdit={canEdit}
        expanded={expandedId === event.id}
        onToggleExpand={() => setExpandedId((current) => (current === event.id ? null : event.id))}
        onRequestDelete={() => setDeleteEventId(event.id)}
        onRequestRemoveHiker={(inscription) => setRemoveTarget({ eventId: event.id, inscription })}
      />
    )
  }

  return (
    <PublicLayout showFooter={false}>
      <Head title={q?.trim() ? `Mis eventos — ${q}` : "Mis eventos"} />

      <ConfirmDialog
        open={deleteEventId != null}
        variant="destructive"
        title="¿Eliminar esta caminata?"
        description="Se eliminará el evento y ya no aparecerá en Chaski. Esta acción no se puede deshacer."
        primaryLabel="Sí, eliminar"
        secondaryLabel="Volver"
        onPrimary={confirmDeleteEvent}
        onSecondary={() => setDeleteEventId(null)}
        onClose={() => setDeleteEventId(null)}
      />

      <ConfirmDialog
        open={removeTarget != null}
        variant="destructive"
        title="¿Quitar a este caminante?"
        description={
          removeTarget
            ? `Vas a cancelar la inscripción de ${removeTarget.inscription.user.name}. Podrá volver a solicitar cupo si hay espacio.`
            : ""
        }
        primaryLabel="Sí, quitar"
        secondaryLabel="Volver"
        onPrimary={confirmRemoveHiker}
        onSecondary={() => setRemoveTarget(null)}
        onClose={() => setRemoveTarget(null)}
      />

      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
        <header className="mb-6">
          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-chaski-heading sm:text-3xl">
                {q?.trim() ? `Resultados para “${q}”` : "Mis eventos"}
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Administrá las caminatas que organizás y sus inscritos
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-chaski-green-dark ring-1 ring-amber-100">
                {count} evento{count === 1 ? "" : "s"}
              </span>
              <Link
                href="/events/new"
                className="inline-flex items-center rounded-md bg-chaski-green px-4 py-2 text-sm font-medium text-white hover:bg-chaski-green-dark"
              >
                Crear nuevo evento
              </Link>
            </div>
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
            {hasFilters ? "No hay eventos con esos filtros." : "Aún no has creado caminatas."}
          </p>
        ) : (
          <div className="space-y-10">
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900">Próximas</h2>
                <ul className="mt-3 space-y-3">
                  {upcoming.map((event) => renderEventRow(event, true))}
                </ul>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900">Anteriores</h2>
                <ul className="mt-3 space-y-3">
                  {past.map((event) => renderEventRow(event, false))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
