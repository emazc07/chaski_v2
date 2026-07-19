import type { ReactElement } from "react"

import { Head } from "@inertiajs/react"

import EventForm from "@/components/form/EventForm"
import PublicLayout from "@/components/layout/PublicLayout"

import type { Event } from "@/types"

type EventsEditProps = {
  event: Event
}

export default function EventsEdit({ event }: EventsEditProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Head title="Editar evento" />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar evento</h1>
        <p className="mt-2 text-gray-600">Modifica los datos de tu caminata.</p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <EventForm event={event} />
      </section>
    </div>
  )
}

EventsEdit.layout = (page: ReactElement<EventsEditProps>) => <PublicLayout>{page}</PublicLayout>
