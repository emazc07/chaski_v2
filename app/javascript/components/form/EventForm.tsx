import { Link, useForm } from "@inertiajs/react"

import FormField from "@/components/form/FormField"
import FormSelectField from "@/components/form/FormSelectField"
import FormTextareaField from "@/components/form/FormTextareaField"

import type { Event } from "@/types"

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

type EventFormProps = {
  event?: Event
}

export default function EventForm({ event }: EventFormProps) {
  const isEditing = Boolean(event)

  const { data, setData, post, patch, processing, errors } = useForm({
    event: event
      ? {
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
        }
      : {
          title: "",
          description_short: "",
          description_long: "",
          custom_location: "",
          difficulty: "",
          distance_km: "",
          elevation_gain_m: "",
          duration_hours: "",
          route_type: "",
          starts_at: "",
          meeting_point: "",
          max_participants: "",
          price_crc: "0",
        },
  })

  const fieldErrors = errors as Record<string, string>

  function submit(e: React.FormEvent) {
    e.preventDefault()

    if (event) {
      patch(`/events/${event.id}`)
    } else {
      post("/events")
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <FormField
        id="title"
        label="Título"
        value={data.event.title}
        onChange={(value) => setData("event.title", value)}
        error={fieldErrors.title}
        placeholder="Ej. Cerro Chirripó"
      />

      <FormTextareaField
        id="description_short"
        label="Descripción corta"
        rows={2}
        maxLength={160}
        value={data.event.description_short}
        onChange={(value) => setData("event.description_short", value)}
        error={fieldErrors.description_short}
        placeholder="Resumen breve (máx. 160 caracteres)"
      />

      <FormTextareaField
        id="description_long"
        label="Descripción larga"
        value={data.event.description_long}
        onChange={(value) => setData("event.description_long", value)}
        error={fieldErrors.description_long}
        placeholder="Detalles de la ruta, qué llevar, nivel requerido, etc."
      />

      <FormField
        id="custom_location"
        label="Ubicación"
        value={data.event.custom_location}
        onChange={(value) => setData("event.custom_location", value)}
        error={fieldErrors.custom_location}
        placeholder="Ej. San Gerardo de Rivas"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormSelectField
          id="difficulty"
          label="Dificultad"
          value={data.event.difficulty}
          onChange={(value) => setData("event.difficulty", value)}
          options={difficultyOptions}
          error={fieldErrors.difficulty}
        />

        <FormSelectField
          id="route_type"
          label="Tipo de ruta"
          value={data.event.route_type}
          onChange={(value) => setData("event.route_type", value)}
          options={routeTypeOptions}
          error={fieldErrors.route_type}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField
          id="distance_km"
          label="Distancia (km)"
          type="number"
          min="0"
          step="0.1"
          value={data.event.distance_km}
          onChange={(value) => setData("event.distance_km", value)}
          error={fieldErrors.distance_km}
          placeholder="18.5"
        />

        <FormField
          id="elevation_gain_m"
          label="Desnivel (m)"
          type="number"
          min="0"
          step="1"
          value={data.event.elevation_gain_m}
          onChange={(value) => setData("event.elevation_gain_m", value)}
          error={fieldErrors.elevation_gain_m}
          placeholder="1200"
        />

        <FormField
          id="duration_hours"
          label="Duración (horas)"
          type="number"
          min="0"
          step="0.5"
          value={data.event.duration_hours}
          onChange={(value) => setData("event.duration_hours", value)}
          error={fieldErrors.duration_hours}
          placeholder="8"
        />
      </div>

      <FormField
        id="starts_at"
        label="Fecha y hora de inicio"
        type="datetime-local"
        value={data.event.starts_at}
        onChange={(value) => setData("event.starts_at", value)}
        error={fieldErrors.starts_at}
      />

      <FormField
        id="meeting_point"
        label="Punto de encuentro"
        value={data.event.meeting_point}
        onChange={(value) => setData("event.meeting_point", value)}
        error={fieldErrors.meeting_point}
        placeholder="Ej. Parqueo principal"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          id="max_participants"
          label="Máximo de participantes"
          type="number"
          min="2"
          step="1"
          value={data.event.max_participants}
          onChange={(value) => setData("event.max_participants", value)}
          error={fieldErrors.max_participants}
          placeholder="12"
        />

        <FormField
          id="price_crc"
          label="Precio (CRC)"
          type="number"
          min="0"
          step="1"
          value={data.event.price_crc}
          onChange={(value) => setData("event.price_crc", value)}
          error={fieldErrors.price_crc}
          placeholder="0"
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={processing}
          className="rounded-full bg-chaski-green px-5 py-2.5 text-sm font-bold text-white hover:bg-chaski-green-dark disabled:opacity-50"
        >
          {processing
            ? isEditing
              ? "Actualizando..."
              : "Creando..."
            : isEditing
              ? "Actualizar caminata"
              : "Crear caminata"}
        </button>

        <Link href="/events/mine" className="text-sm font-medium text-gray-600 hover:text-gray-900">
          Volver a mis eventos
        </Link>
      </div>
    </form>
  )
}
