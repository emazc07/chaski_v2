import { Head, Link } from "@inertiajs/react"

import PublicLayout from "@/components/layout/PublicLayout"

import type { Event } from "@/types"

export default function EventsMine({ events }: { events: Event[] }) {
  return (
    <PublicLayout>
      <Head title="Mis eventos" />

      <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis eventos</h1>
          <p className="mt-2 text-gray-600">Administra las caminatas que organizas.</p>
        </header>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {events.length === 0 ? (
            <p className="text-gray-700">Aún no has creado caminatas.</p>
          ) : (
            <ul className="space-y-4">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 last:border-0"
                >
                  <div>
                    <h2 className="font-semibold text-gray-900">{event.title}</h2>
                    <p className="text-gray-600">{event.custom_location}</p>
                    <p className="text-sm text-gray-500">
                      {event.starts_at?.slice(0, 10)} · {event.difficulty} · {event.status}
                    </p>
                    <p className="text-sm text-gray-700">{event.description_short}</p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/events/${event.id}/edit`}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/events/${event.id}`}
                      method="delete"
                      as="button"
                      className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                      onBefore={() => window.confirm("¿Eliminar esta caminata?")}
                    >
                      Eliminar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/events/new"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Crear nuevo evento
          </Link>
        </section>
      </div>
    </PublicLayout>
  )
}
