import type { ReactElement } from "react"

import { Head } from "@inertiajs/react"

import EventForm from "@/components/form/EventForm"
import PublicLayout from "@/components/layout/PublicLayout"

type EventsNewProps = Record<string, never>

export default function EventsNew() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Head title="Crear evento" />

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear nuevo evento</h1>
        <p className="mt-2 text-gray-600">
          Completa los datos para publicar una caminata.
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <EventForm />
      </section>
    </div>
  )
}

EventsNew.layout = (page: ReactElement<EventsNewProps>) => (
  <PublicLayout>{page}</PublicLayout>
)
