import { Head, Link, useForm } from "@inertiajs/react"

import GearItemsFields from "@/components/events/GearItemsFields"
import PublicLayout from "@/components/layout/PublicLayout"

import type { Event, GearItemFormRow } from "@/types"

const inputClassName =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

const difficultyOptions = [
  { value: "easy", label: "Fácil" },
  { value: "moderate", label: "Moderada" },
  { value: "hard", label: "Difícil" },
  { value: "extreme", label: "Extrema" },
]

const routeTypeOptions = [
  { value: "loop", label: "Circuito" },
  { value: "out_and_back", label: "Ida y vuelta" },
  { value: "point_to_point", label: "Punto a punto" },
]

function toDatetimeLocalValue(value: string): string {
  return value.slice(0, 16)
}

export default function EventsEdit({ event }: { event: Event }) {
  const { data, setData, patch, processing, errors } = useForm({
    event: {
      title: event.title,
      description_short: event.description_short,
      description_long: event.description_long,
      custom_location: event.custom_location,
      difficulty: event.difficulty,
      distance_km: event.distance_km,
      elevation_gain_m: String(event.elevation_gain_m),
      duration_hours: event.duration_hours,
      route_type: event.route_type,
      starts_at: toDatetimeLocalValue(event.starts_at),
      meeting_point: event.meeting_point,
      max_participants: String(event.max_participants),
      price_crc: String(event.price_crc),
      gear_items_attributes: (event.gear_items ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description ?? "",
        required: item.required,
        position: item.position,
      })) as GearItemFormRow[],
    },
  })

  // Rails returns flat attribute keys (e.g. "title"); useForm types nested "event.*" keys.
  const fieldErrors = errors as unknown as Record<string, string>

  function setGearItems(items: GearItemFormRow[]) {
    setData(
      "event.gear_items_attributes",
      items.map((item, position) => ({ ...item, position })),
    )
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    patch(`/events/${event.id}`)
  }

  return (
    <PublicLayout>
      <Head title="Editar evento" />

      <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Editar evento</h1>
          <p className="mt-2 text-gray-600">Modifica los datos de tu caminata.</p>
        </header>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                id="title"
                type="text"
                value={data.event.title}
                onChange={(e) => setData("event.title", e.target.value)}
                className={inputClassName}
                placeholder="Ej. Cerro Chirripó"
              />
              {fieldErrors.title && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description_short"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Descripción corta
              </label>
              <textarea
                id="description_short"
                rows={2}
                maxLength={160}
                value={data.event.description_short}
                onChange={(e) => setData("event.description_short", e.target.value)}
                className={inputClassName}
                placeholder="Resumen breve (máx. 160 caracteres)"
              />
              {fieldErrors.description_short && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.description_short}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description_long"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Descripción larga
              </label>
              <textarea
                id="description_long"
                rows={4}
                value={data.event.description_long}
                onChange={(e) => setData("event.description_long", e.target.value)}
                className={inputClassName}
                placeholder="Detalles de la ruta, qué llevar, nivel requerido, etc."
              />
              {fieldErrors.description_long && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.description_long}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="custom_location"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Ubicación
              </label>
              <input
                id="custom_location"
                type="text"
                value={data.event.custom_location}
                onChange={(e) => setData("event.custom_location", e.target.value)}
                className={inputClassName}
                placeholder="Ej. San Gerardo de Rivas"
              />
              {fieldErrors.custom_location && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.custom_location}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="difficulty"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Dificultad
                </label>
                <select
                  id="difficulty"
                  value={data.event.difficulty}
                  onChange={(e) => setData("event.difficulty", e.target.value)}
                  className={inputClassName}
                >
                  <option value="">Seleccionar...</option>
                  {difficultyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.difficulty && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.difficulty}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="route_type"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Tipo de ruta
                </label>
                <select
                  id="route_type"
                  value={data.event.route_type}
                  onChange={(e) => setData("event.route_type", e.target.value)}
                  className={inputClassName}
                >
                  <option value="">Seleccionar...</option>
                  {routeTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.route_type && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.route_type}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="distance_km"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Distancia (km)
                </label>
                <input
                  id="distance_km"
                  type="number"
                  min="0"
                  step="0.1"
                  value={data.event.distance_km}
                  onChange={(e) => setData("event.distance_km", e.target.value)}
                  className={inputClassName}
                  placeholder="18.5"
                />
                {fieldErrors.distance_km && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.distance_km}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="elevation_gain_m"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Desnivel (m)
                </label>
                <input
                  id="elevation_gain_m"
                  type="number"
                  min="0"
                  step="1"
                  value={data.event.elevation_gain_m}
                  onChange={(e) => setData("event.elevation_gain_m", e.target.value)}
                  className={inputClassName}
                  placeholder="1200"
                />
                {fieldErrors.elevation_gain_m && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.elevation_gain_m}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="duration_hours"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Duración (horas)
                </label>
                <input
                  id="duration_hours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={data.event.duration_hours}
                  onChange={(e) => setData("event.duration_hours", e.target.value)}
                  className={inputClassName}
                  placeholder="8"
                />
                {fieldErrors.duration_hours && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.duration_hours}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="starts_at" className="mb-1 block text-sm font-medium text-gray-700">
                Fecha y hora de inicio
              </label>
              <input
                id="starts_at"
                type="datetime-local"
                value={data.event.starts_at}
                onChange={(e) => setData("event.starts_at", e.target.value)}
                className={inputClassName}
              />
              {fieldErrors.starts_at && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.starts_at}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="meeting_point"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Punto de encuentro
              </label>
              <input
                id="meeting_point"
                type="text"
                value={data.event.meeting_point}
                onChange={(e) => setData("event.meeting_point", e.target.value)}
                className={inputClassName}
                placeholder="Ej. Parqueo principal"
              />
              {fieldErrors.meeting_point && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.meeting_point}</p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="max_participants"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Máximo de participantes
                </label>
                <input
                  id="max_participants"
                  type="number"
                  min="2"
                  step="1"
                  value={data.event.max_participants}
                  onChange={(e) => setData("event.max_participants", e.target.value)}
                  className={inputClassName}
                  placeholder="12"
                />
                {fieldErrors.max_participants && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.max_participants}</p>
                )}
              </div>

              <div>
                <label htmlFor="price_crc" className="mb-1 block text-sm font-medium text-gray-700">
                  Precio (CRC)
                </label>
                <input
                  id="price_crc"
                  type="number"
                  min="0"
                  step="1"
                  value={data.event.price_crc}
                  onChange={(e) => setData("event.price_crc", e.target.value)}
                  className={inputClassName}
                  placeholder="0"
                />
                {fieldErrors.price_crc && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.price_crc}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <GearItemsFields items={data.event.gear_items_attributes} onChange={setGearItems} />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? "Actualizando..." : "Actualizar caminata"}
              </button>

              <Link
                href="/events/mine"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Volver a mis eventos
              </Link>
            </div>
          </form>
        </section>
      </div>
    </PublicLayout>
  )
}
